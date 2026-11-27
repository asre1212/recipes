// Reading-only paper guides. No recipe records or artwork positions are changed.
const NS='http://www.w3.org/2000/svg';
let observer,frame,current;
const node=(name,attrs={})=>{const el=document.createElementNS(NS,name);for(const [key,value]of Object.entries(attrs))el.setAttribute(key,String(value));return el;};
export function spreadRules(written,bands,height,pitch,start=0){
 const actual=[...new Set(written.map(y=>Math.round(y*100)/100))].filter(y=>y>=0&&y<=height).sort((a,b)=>a-b);
 const extra=[];for(let y=start;y<height;y+=pitch){if(!bands.some(([top,bottom])=>y>=top-3&&y<=bottom+3)&&!actual.some(v=>Math.abs(v-y)<pitch*.55))extra.push(y);}
 return {actual,extra};
}
function svgFor(host,kind){let svg=host.querySelector(':scope > .'+kind);if(!svg){svg=node('svg',{class:kind,'aria-hidden':'true',focusable:'false',preserveAspectRatio:'none'});host.prepend(svg);}svg.setAttribute('viewBox',`0 0 ${host.clientWidth} ${host.clientHeight}`);return svg;}
function point(svg,x,y){const p=svg.createSVGPoint();p.x=x;p.y=y;return p.matrixTransform(svg.getScreenCTM().inverse());}
function collect(targets,svg){
 const probes=targets.map((el,index)=>{const p=document.createElement('i');p.setAttribute('aria-hidden','true');p.style.cssText='display:inline-block;width:0;height:0;padding:0;margin:0;vertical-align:baseline';el.append(p);el.dataset.recipeInk=String(index);return {el,p,index};});
 const lines=[],bands=[];const scaleY=svg.viewBox.baseVal.height/parseFloat(getComputedStyle(svg).height)||1;
 for(const {el,p,index}of probes){const rect=p.getBoundingClientRect(),last=point(svg,rect.left,rect.top).y,style=getComputedStyle(el),leading=parseFloat(style.lineHeight);if(!Number.isFinite(leading))continue;const height=el.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom),count=Math.max(1,Math.round(height/leading));const box=el.getBoundingClientRect();bands.push([point(svg,box.left,box.top).y,point(svg,box.right,box.bottom).y]);for(let line=0;line<count;line++)lines.push({y:last-(count-1-line)*leading*scaleY+4*scaleY,index,line});}
 for(const {p}of probes)p.remove();return {lines,bands};
}
function paint(svg,reading,pitch,left,right,mask){
 svg.replaceChildren();const h=svg.viewBox.baseVal.height;
 if(mask){const defs=node('defs'),cut=node('mask',{id:'recipe-note-cutouts',maskUnits:'userSpaceOnUse',x:0,y:0,width:svg.viewBox.baseVal.width,height:h});cut.append(node('rect',{width:'100%',height:'100%',fill:'white'}));for(const polygon of mask)cut.append(node('polygon',{points:polygon,fill:'black'}));defs.append(cut);svg.append(defs);}
 const group=node('g',{stroke:'#bdcddc','stroke-opacity':'.6','stroke-width':'.7',...(mask?{mask:'url(#recipe-note-cutouts)'}:{})});
 const all=spreadRules(reading.lines.map(l=>l.y),reading.bands,h,pitch,pitch);
 for(const y of all.extra)group.append(node('line',{x1:left,x2:right,y1:y,y2:y}));
 // Keep separate targets even where two trial columns share a physical rule.
 const drawn=[];for(const line of reading.lines){const duplicate=drawn.some(y=>Math.abs(y-line.y)<.2);if(!duplicate)drawn.push(line.y);group.append(node('line',{x1:left,x2:right,y1:line.y,y2:line.y,'data-ink':line.index,'data-line':line.line,...(duplicate?{'stroke-opacity':0}:{})}));}svg.append(group);
}
export function alignRecipeRuling(paper){
 const svg=svgFor(paper,'recipe-rules');const notes=[...paper.querySelectorAll('.margin-note')];
 const polygons=notes.map(note=>{const rect=note.getBoundingClientRect(),m=new DOMMatrix(getComputedStyle(note).transform==='none'?undefined:getComputedStyle(note).transform),cx=rect.x+rect.width/2,cy=rect.y+rect.height/2;return [[-1,-1],[1,-1],[1,1],[-1,1]].map(([sx,sy])=>{const x=sx*note.offsetWidth/2,y=sy*note.offsetHeight/2,p=point(svg,cx+m.a*x+m.c*y,cy+m.b*x+m.d*y);return p.x+','+p.y;}).join(' ');});
 const selectors='.recipe-heading h1,.ingredients h2,.ingredients li,.component h3,.method h2,.method h3,.method li,.prior-trials>h2,.trial-ingredient,.trial-outcome,.unspecified p';
 const targets=[...paper.querySelectorAll(selectors)];const reading=collect(targets,svg);const pitch=parseFloat(getComputedStyle(paper).getPropertyValue('--line'))||28;const inset=getComputedStyle(paper,'::after');
 paint(svg,reading,pitch,parseFloat(inset.left)||13,paper.clientWidth-(parseFloat(inset.right)||10),polygons);
 for(const note of notes){const local=svgFor(note,'note-rules');const content=collect([...note.querySelectorAll('h2,p')],local);paint(local,content,pitch,10,note.clientWidth-10);}
 paper.dataset.rulingWidth=String(paper.clientWidth);paper.dataset.rulingFont=document.documentElement.dataset.recipeFont||'default';
}
export function refreshRecipeRuling(){cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(current?.isConnected)alignRecipeRuling(current);});}
export function scheduleRecipeRuling(){observer?.disconnect();current=document.querySelector('.paper.recipe');if(!current)return;observer=new ResizeObserver(refreshRecipeRuling);observer.observe(current);for(const note of current.querySelectorAll('.margin-note'))observer.observe(note);document.fonts.ready.then(refreshRecipeRuling);refreshRecipeRuling();}
if(typeof document!=='undefined')document.fonts?.addEventListener('loadingdone',refreshRecipeRuling);
