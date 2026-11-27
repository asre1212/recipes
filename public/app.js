import {recipeArt,readerNotes,readerIngredients,readerUncertainty} from './recipe-presentation.js';
import {autoBackupPage,bindAutoBackup,startAutoBackup} from './autobackup.js';
import {trialSection,bindTrials} from './trials.js';
import {defaultSections,arrangeBook} from './sections.js';
import {contentsPage,bindContents,contentsMenu} from './contents.js';
import {recipes as bundledRecipes} from './recipes.js';
import {initializeLibrary,loadLibrary,getSetting,setSetting,resetRecipe,saveBookState,initializeSections} from './storage.js';
import {editorPage,bindEditor,backupPage,bindBackup,hasDraft,discardDraft} from './kitchen.js';
const APP_BUILD='development';
document.documentElement.dataset.appBuild=APP_BUILD;
const recipes=[];const sections=[];
const refreshLibrary=async()=>{const savedSections=await getSetting('sections',defaultSections);sections.splice(0,sections.length,...savedSections);const next=await loadLibrary(bundledRecipes.map(r=>r.id));recipes.splice(0,recipes.length,...arrangeBook(next,sections));};
const saveBook=async(nextRecipes,nextSections)=>{await saveBookState(nextRecipes,nextSections);await refreshLibrary();};
const book = document.querySelector('#book');
const header=document.querySelector('.site-header');
const headerAnchor=document.createComment('Notebook navigation mounts only on paper pages');header.before(headerAnchor);
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pageNumber = recipe => recipes.indexOf(recipe) + 3;
const footer = (number, previous, next) => `<footer class="page-footer"><a href="${previous}" aria-label="Previous page">Previous</a><a class="page-number" href="#contents" aria-label="Page ${number}. Back to contents">${String(number).padStart(2,'0')}<span>Contents</span></a>${next ? `<a href="${next}" aria-label="Next page">Next</a>` : '<span class="end-note">End of book</span>'}</footer>`;
const entry = r => `<li><a class="toc-entry" href="#recipe/${escape(r.id)}"><span>${escape(r.title)}</span><span class="toc-rule" aria-hidden="true"></span><span class="toc-number">${String(pageNumber(r)).padStart(2,'0')}</span></a></li>`;
function contents(){return contentsPage(recipes,sections,footer(2,'#cover',recipes.length?'#recipe/'+recipes[0].id:null));}
function cover() {
 return `<article class="cover"><a class="bear-link" href="#contents" aria-label="Open the table of contents"><img class="bear" src="assets/bear.svg" alt="" width="500" height="700"></a></article>`;
}
const ingredientList = (items,original=[]) => `<ul>${readerIngredients(items,original).map(([amount,name])=>`<li><span class="amount">${escape(amount)}</span> ${escape(name)}</li>`).join('')}</ul>`;
const methodList = steps => `<ol>${steps.map(step=>`<li>${escape(step==='Toast the black sesame seeds and grind them with sugar.*'?'Toast the black sesame seeds and grind them with sugar.':step)}</li>`).join('')}</ol>`;
function recipePage(r) {
  const index = recipes.indexOf(r);
  const original=bundledRecipes.find(b=>b.id===r.id)||bundledRecipes.find(b=>b.title===r.title);
  const art=recipeArt[r.id];const notes=readerNotes(r);const uncertainty=readerUncertainty(r,original);
  const sketch=art?`<figure class="recipe-illustration art-${art.size}" style="--sketch-tilt:${art.tilt||0}deg"><img class="dish-sketch" src="${art.src}" width="${art.width}" height="${art.height}" alt="${escape(art.alt)}"></figure>`:'';
  return `<div class="recipe-actions"><span class="recipe-chapter">${escape(r.category)}${r.cuisine ? ' · '+escape(r.cuisine):''}</span></div><article class="paper recipe"><div class="eyebrow">FROM THE RECIPE NOTEBOOK</div><header class="recipe-heading"><h1>${r.title==='Brown Butter Miso Chocolate Chip Cookies' ? 'Brown Butter Miso<br>Chocolate Chip Cookies' : escape(r.title)}</h1><div class="title-underline" aria-hidden="true"></div></header><div class="recipe-grid ${notes.length || art&&art.placement!=='between' ? '' : 'no-margin'} ${art?'sketch-'+art.placement:''}"><section class="ingredients"><h2>Ingredients</h2>${ingredientList(r.ingredients,original?.ingredients)}${(r.components||[]).map(c=>`<section class="component"><h3>${escape(c.title)}</h3>${ingredientList(c.ingredients,original?.components?.find(x=>x.title===c.title)?.ingredients)}</section>`).join('')}</section>${art?.placement.startsWith('next-')?sketch:''}<aside class="margin">${notes.length ? `<div class="margin-note"><h2>Margin notes</h2>${notes.map(n=>`<p>${escape(n)}</p>`).join('')}</div>` : ''}${art&&art.placement!=='between'&&!art.placement.startsWith('next-')?sketch:''}</aside></div>${art?.placement==='between'?sketch:''}${r.steps.length||(r.components||[]).some(c=>c.steps?.length)?'<section class="method"><h2>Method</h2>'+methodList(r.steps):''}${(r.components||[]).filter(c=>c.steps?.length).map(c=>`<h3>${escape(c.title)}</h3>${methodList(c.steps)}`).join('')}${r.steps.length||(r.components||[]).some(c=>c.steps?.length)?'</section>':''}${uncertainty ? `<aside class="unspecified"><p>${escape(uncertainty).replace(/^(\*.*?number\.)/,'<em>$1</em><br>')}</p></aside>` : ''}${trialSection(r)}</article><div class="recipe-outside-footer">${footer(pageNumber(r),index ? '#recipe/'+recipes[index-1].id : '#contents',recipes[index+1] ? '#recipe/'+recipes[index+1].id : null)}</div>`;
}
let currentHash=location.hash||'#cover';
function render() {
 if(hasDraft()&&currentHash!==(location.hash||'#cover')){if(!confirm('Leave this recipe draft without saving?')){history.replaceState(null,'',currentHash);return;}discardDraft();}
 currentHash=location.hash||'#cover';
 const hash = location.hash || '#cover';
 const recipe = hash.startsWith('#recipe/') && recipes.find(r=>r.id===hash.slice(8));
 const coverOpen=hash==='#cover';
 document.documentElement.dataset.navigation=coverOpen?'cover':'paper';
 header.hidden=coverOpen;header.inert=coverOpen;
 if(coverOpen)header.remove();else headerAnchor.after(header);
 header.querySelector('#menu-toggle').hidden=coverOpen;
 header.querySelector('#contents-menu-actions').innerHTML=hash==='#contents'?contentsMenu():'';
 const menuActions=header.querySelector('#recipe-menu-actions');
 menuActions.innerHTML=recipe?`<a href="#edit/${escape(recipe.id)}">Edit recipe</a>${recipe.overridden&&bundledRecipes.some(b=>b.id===recipe.id)?'<button id="restore-original">Restore original</button>':''}`:'';
 closeMenu();
 let title;
 if(hash==='#new'||hash.startsWith('#edit/')) {
 const editing=hash.startsWith('#edit/')?recipes.find(r=>r.id===hash.slice(6)):null;
 if(hash!=='#new'&&!editing){location.hash='#contents';return;}
 book.innerHTML=editorPage(editing,sections);title=editing?'Edit '+editing.title:'Write a recipe';
 bindEditor(editing,async id=>{await refreshLibrary();location.hash='#recipe/'+id;},sections);
 }
 else if(hash==='#autobackup'){book.innerHTML=autoBackupPage();title='Auto Backup';bindAutoBackup();}
 else if(hash==='#backup'){book.innerHTML=backupPage();title='Backups & updates';bindBackup(recipes,refreshLibrary,checkUpdates,value=>{autoUpdate=value;if(value)applyWaitingUpdate();},{sections:()=>sections});}
 else
 if(hash==='#cover') { book.innerHTML=cover(); title='The notebook'; }
 else if(hash==='#contents') { book.innerHTML=contents(); title='Contents';bindContents(recipes,sections,saveBook,render); }
 else if(recipe) { book.innerHTML=recipePage(recipe); title=recipe.title;bindTrials(recipe,async()=>{await refreshLibrary();render();const trials=document.querySelector('.prior-trials');trials?.scrollIntoView({block:'start'});trials?.focus({preventScroll:true});}); }
 else { book.innerHTML=`<article class="paper missing"><h1>A missing page</h1><p>This recipe isn’t in the notebook yet.</p><a class="open-book" href="#contents">Back to contents</a></article>`; title='Page not found'; }
 document.title=title+' · Recipe';
 showAppIdentity();
 document.body.dataset.page=hash==='#cover' ? 'cover' : 'paper';
 document.querySelector('meta[name="theme-color"]').content=hash==='#cover'?'#c8b69d':'#ad805a';
 header.querySelectorAll('a').forEach(a=>a.toggleAttribute('aria-current',a.getAttribute('href')===hash));
 const reset=document.querySelector('#restore-original');
 if(reset&&recipe)reset.addEventListener('click',async()=>{if(confirm('Restore the supplied recipe text and discard your text edits? Your Prior Trials will be kept.')){try{await resetRecipe(bundledRecipes.find(b=>b.id===recipe.id));await refreshLibrary();render();}catch{alert('Could not restore this recipe. Your existing copy remains saved.');}}});
 window.scrollTo(0,0);
 book.focus({preventScroll:true});
}
window.addEventListener('hashchange',render);
window.addEventListener('beforeunload',e=>{if(hasDraft()){e.preventDefault();e.returnValue='';}});
let autoUpdate=true;
try{const savedSections=await initializeSections(await loadLibrary(bundledRecipes.map(r=>r.id)));sections.push(...savedSections);recipes.push(...arrangeBook(await initializeLibrary(bundledRecipes),sections));autoUpdate=await getSetting('autoUpdate',true);const chosen=await getSetting('recipeFont','default');document.documentElement.dataset.recipeFont=['kalam','kristi'].includes(chosen)?chosen:'default';}catch{if(!sections.length)sections.push(...defaultSections);recipes.push(...arrangeBook(bundledRecipes,sections));document.querySelector('#storage-warning').hidden=false;}
const menuToggle=header.querySelector('#menu-toggle');
const notebookMenu=header.querySelector('#notebook-menu');
const fontPicker=header.querySelector('#recipe-font');fontPicker.value=document.documentElement.dataset.recipeFont||'default';fontPicker.addEventListener('change',async()=>{const selected=['kalam','kristi'].includes(fontPicker.value)?fontPicker.value:'default';document.documentElement.dataset.recipeFont=selected;try{await setSetting('recipeFont',selected);}catch{document.querySelector('#storage-warning').hidden=false;}closeMenu(true);});
function closeMenu(returnFocus=false){const toggle=header.querySelector('#menu-toggle');header.querySelector('#notebook-menu').hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open notebook menu');if(returnFocus)toggle.focus();}
menuToggle.addEventListener('click',()=>{const open=notebookMenu.hidden;notebookMenu.hidden=!open;menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Close notebook menu':'Open notebook menu');});
notebookMenu.addEventListener('click',event=>{if(event.target.closest('a,button'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!notebookMenu.hidden){closeMenu(true);event.preventDefault();}});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
document.addEventListener('focusin',event=>{if(!notebookMenu.hidden&&!event.target.closest('.site-header'))closeMenu();});
startAutoBackup();
render();
const help=header.querySelector('#install-help');
help.addEventListener('click',()=>{const guide=document.querySelector('#install-guide');guide.hidden=!guide.hidden;help.setAttribute('aria-expanded',String(!guide.hidden));});
let installPrompt;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;header.querySelector('#install').hidden=false;});
header.querySelector('#install').addEventListener('click',async()=>{if(!installPrompt)return;await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;header.querySelector('#install').hidden=true;});
let registration;let waitingUpdate;let refreshing=false;let deferredReload=false;
function applyWaitingUpdate(){
 if(hasDraft()||document.querySelector('#recipe-form,#trial-form'))return;
 if(deferredReload&&!refreshing){refreshing=true;location.reload();return;}
 if(!waitingUpdate)return;
 document.querySelector('#update-notice').hidden=false;
 document.querySelector('#update-message').textContent='A new notebook version is ready. Your local recipes are saved.';
 if(autoUpdate)waitingUpdate.postMessage({type:'SKIP_WAITING'});
}
function showAppIdentity(workerBuild){const info=document.querySelector('#app-identity');if(!info)return;info.textContent='App build: '+APP_BUILD+' · '+(navigator.standalone||matchMedia('(display-mode: standalone)').matches?'Home Screen / standalone':'browser tab')+'\nAddress: '+location.origin+location.pathname+'\nRoute: '+(location.hash||'#cover')+'\nOffline worker: '+(workerBuild||'checking…');const worker=navigator.serviceWorker?.controller;if(worker&&!workerBuild){const channel=new MessageChannel();channel.port1.onmessage=e=>{channel.port1.close();showAppIdentity(e.data?.build||'unreported');};worker.postMessage({type:'GET_BUILD'},[channel.port2]);}else if(!worker)info.textContent=info.textContent.replace('checking…','not controlling this page');}
async function checkUpdates(){
 const status=document.querySelector('#update-status');
 if(!registration){if(status)status.textContent='App updates need an HTTPS browser connection with service-worker support.';return;}
 try{showAppIdentity();await registration.update();if(registration.waiting){waitingUpdate=registration.waiting;applyWaitingUpdate();if(status)status.textContent='Update ready. It will apply when no recipe editor is open.';}else if(status)status.textContent=registration.installing?'Downloading the app update…':'You have the latest available app version.';}catch{if(status)status.textContent='Could not check right now. Open the app online and try again.';}
}
document.querySelector('#apply-update').addEventListener('click',()=>{if(!hasDraft()&&!document.querySelector('#recipe-form,#trial-form'))waitingUpdate?.postMessage({type:'SKIP_WAITING'});});
if('serviceWorker' in navigator){
 // A first uncontrolled page can also contain an older HTTP-cached shell.
 // Compare worker and shell builds instead of assuming first claim is current.
 const verifyController=()=>{const worker=navigator.serviceWorker.controller;if(!worker)return;const channel=new MessageChannel();channel.port1.onmessage=event=>{channel.port1.close();if(event.data?.build&&event.data.build!==APP_BUILD&&!refreshing){if(hasDraft()||document.querySelector('#recipe-form,#trial-form'))deferredReload=true;else{refreshing=true;location.reload();}}};worker.postMessage({type:'GET_BUILD'},[channel.port2]);};
 navigator.serviceWorker.addEventListener('controllerchange',verifyController);
 navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(async reg=>{
 registration=reg;
 const watchInstalling=()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller){waitingUpdate=reg.waiting;applyWaitingUpdate();}});};
 reg.addEventListener('updatefound',watchInstalling);watchInstalling();
 await navigator.serviceWorker.ready;verifyController();
 document.querySelector('#offline-state').textContent='Saved for offline reading. Your notebook is ready to travel.';
 if(reg.waiting){waitingUpdate=reg.waiting;applyWaitingUpdate();}

 }).catch(()=>{document.querySelector('#offline-state').textContent='Offline saving is unavailable in this browser. You can still read online.';});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&!hasDraft())checkUpdates();});
 window.addEventListener('online',checkUpdates);
 window.addEventListener('pageshow',()=>{verifyController();checkUpdates();});
 window.addEventListener('hashchange',()=>{applyWaitingUpdate();});
}

document.querySelector('.skip').addEventListener('click',event=>{event.preventDefault();book.focus();});
