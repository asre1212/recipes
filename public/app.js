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
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pageNumber = recipe => recipes.indexOf(recipe) + 3;
const footer = (number, previous, next) => `<footer class="page-footer"><a href="${previous}" aria-label="Previous page">Previous</a><a class="page-number" href="#contents" aria-label="Page ${number}. Back to contents">${String(number).padStart(2,'0')}<span>Contents</span></a>${next ? `<a href="${next}" aria-label="Next page">Next</a>` : '<span class="end-note">End of book</span>'}</footer>`;
const entry = r => `<li><a class="toc-entry" href="#recipe/${escape(r.id)}"><span>${escape(r.title)}</span><span class="toc-rule" aria-hidden="true"></span><span class="toc-number">${String(pageNumber(r)).padStart(2,'0')}</span></a></li>`;
function contents(){return contentsPage(recipes,sections,footer(2,'#cover',recipes.length?'#recipe/'+recipes[0].id:null));}
function cover() {
 return `<article class="cover"><a class="bear-link" href="#contents" aria-label="Open the table of contents"><img class="bear" src="assets/bear.svg" alt="" width="500" height="700"></a></article>`;
}
const ingredientList = items => `<ul>${items.map(([amount,name])=>`<li><span class="amount">${escape(amount)}</span> ${escape(name)}</li>`).join('')}</ul>`;
const methodList = steps => `<ol>${steps.map(step=>`<li>${escape(step)}</li>`).join('')}</ol>`;
function recipePage(r) {
  const index = recipes.indexOf(r);
  const illustration=bundledRecipes.find(b=>b.id===r.id)?.illustration||r.illustration;
  return `<div class="recipe-actions"><span class="recipe-chapter">${escape(r.category)}${r.cuisine ? ' · '+escape(r.cuisine):''}</span></div><article class="paper recipe"><div class="eyebrow">FROM THE RECIPE NOTEBOOK</div><header class="recipe-heading"><h1>${r.title==='Brown Butter Miso Chocolate Chip Cookies' ? 'Brown Butter Miso<br>Chocolate Chip Cookies' : escape(r.title)}</h1><div class="title-underline" aria-hidden="true"></div></header><div class="recipe-grid ${r.notes.length || illustration ? '' : 'no-margin'}"><section class="ingredients"><h2>Ingredients</h2>${ingredientList(r.ingredients)}${(r.components||[]).map(c=>`<section class="component"><h3>${escape(c.title)}</h3>${ingredientList(c.ingredients)}</section>`).join('')}</section><aside class="margin">${r.notes.length ? `<div class="margin-note"><h2>Margin notes</h2>${r.notes.map(n=>`<p>${escape(n)}</p>`).join('')}</div>` : ''}${illustration ? `<img class="dish-sketch" src="${escape(illustration)}" width="340" height="220" alt="${escape(r.illustrationAlt || bundledRecipes.find(b=>b.id===r.id)?.illustrationAlt || 'A hand-drawn pair of chocolate-chip cookies')}">` : ''}</aside></div><section class="method"><h2>Method</h2>${r.steps.length ? methodList(r.steps) : '<p class="empty">No method supplied in the notebook.</p>'}${(r.components||[]).filter(c=>c.steps?.length).map(c=>`<h3>${escape(c.title)}</h3>${methodList(c.steps)}`).join('')}</section>${r.unspecified ? `<aside class="unspecified"><p>${escape(r.unspecified).replace(/^(\*.*?number\.)/,'<em>$1</em><br>')}</p></aside>` : ''}${trialSection(r)}</article><div class="recipe-outside-footer">${footer(pageNumber(r),index ? '#recipe/'+recipes[index-1].id : '#contents',recipes[index+1] ? '#recipe/'+recipes[index+1].id : null)}</div>`;
}
let currentHash=location.hash||'#cover';
function render() {
 if(hasDraft()&&currentHash!==(location.hash||'#cover')){if(!confirm('Leave this recipe draft without saving?')){history.replaceState(null,'',currentHash);return;}discardDraft();}
 currentHash=location.hash||'#cover';
 const hash = location.hash || '#cover';
 const recipe = hash.startsWith('#recipe/') && recipes.find(r=>r.id===hash.slice(8));
 const coverOpen=hash==='#cover';
 document.documentElement.dataset.navigation=coverOpen?'cover':'paper';
 const header=document.querySelector('.site-header');header.hidden=coverOpen;header.inert=coverOpen;
 document.querySelector('#menu-toggle').hidden=coverOpen;
 document.querySelector('#contents-menu-actions').innerHTML=hash==='#contents'?contentsMenu():'';
 const menuActions=document.querySelector('#recipe-menu-actions');
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
 document.body.dataset.page=hash==='#cover' ? 'cover' : 'paper';
 document.querySelector('meta[name="theme-color"]').content=hash==='#cover'?'#c8b69d':'#ad805a';
 document.querySelectorAll('.site-header a').forEach(a=>a.toggleAttribute('aria-current',a.getAttribute('href')===hash));
 const reset=document.querySelector('#restore-original');
 if(reset&&recipe)reset.addEventListener('click',async()=>{if(confirm('Restore the supplied recipe text and discard your text edits? Your Prior Trials will be kept.')){try{await resetRecipe(bundledRecipes.find(b=>b.id===recipe.id));await refreshLibrary();render();}catch{alert('Could not restore this recipe. Your existing copy remains saved.');}}});
 window.scrollTo(0,0);
 book.focus({preventScroll:true});
}
window.addEventListener('hashchange',render);
window.addEventListener('beforeunload',e=>{if(hasDraft()){e.preventDefault();e.returnValue='';}});
let autoUpdate=true;
try{const savedSections=await initializeSections(await loadLibrary(bundledRecipes.map(r=>r.id)));sections.push(...savedSections);recipes.push(...arrangeBook(await initializeLibrary(bundledRecipes),sections));autoUpdate=await getSetting('autoUpdate',true);const chosen=await getSetting('recipeFont','default');document.documentElement.dataset.recipeFont=['kalam','kristi'].includes(chosen)?chosen:'default';}catch{if(!sections.length)sections.push(...defaultSections);recipes.push(...arrangeBook(bundledRecipes,sections));document.querySelector('#storage-warning').hidden=false;}
const menuToggle=document.querySelector('#menu-toggle');
const notebookMenu=document.querySelector('#notebook-menu');
const fontPicker=document.querySelector('#recipe-font');fontPicker.value=document.documentElement.dataset.recipeFont||'default';fontPicker.addEventListener('change',async()=>{const selected=['kalam','kristi'].includes(fontPicker.value)?fontPicker.value:'default';document.documentElement.dataset.recipeFont=selected;try{await setSetting('recipeFont',selected);}catch{document.querySelector('#storage-warning').hidden=false;}closeMenu(true);});
function closeMenu(returnFocus=false){const toggle=document.querySelector('#menu-toggle');document.querySelector('#notebook-menu').hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open notebook menu');if(returnFocus)toggle.focus();}
menuToggle.addEventListener('click',()=>{const open=notebookMenu.hidden;notebookMenu.hidden=!open;menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Close notebook menu':'Open notebook menu');});
notebookMenu.addEventListener('click',event=>{if(event.target.closest('a,button'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!notebookMenu.hidden){closeMenu(true);event.preventDefault();}});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
document.addEventListener('focusin',event=>{if(!notebookMenu.hidden&&!event.target.closest('.site-header'))closeMenu();});
startAutoBackup();
render();
const help=document.querySelector('#install-help');
help.addEventListener('click',()=>{const guide=document.querySelector('#install-guide');guide.hidden=!guide.hidden;help.setAttribute('aria-expanded',String(!guide.hidden));});
let installPrompt;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;document.querySelector('#install').hidden=false;});
document.querySelector('#install').addEventListener('click',async()=>{if(!installPrompt)return;await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;document.querySelector('#install').hidden=true;});
let registration;let waitingUpdate;let refreshing=false;let deferredReload=false;
function applyWaitingUpdate(){
 if(hasDraft()||document.querySelector('#recipe-form,#trial-form'))return;
 if(deferredReload&&!refreshing){refreshing=true;location.reload();return;}
 if(!waitingUpdate)return;
 document.querySelector('#update-notice').hidden=false;
 document.querySelector('#update-message').textContent='A new notebook version is ready. Your local recipes are saved.';
 if(autoUpdate)waitingUpdate.postMessage({type:'SKIP_WAITING'});
}
async function checkUpdates(){
 const status=document.querySelector('#update-status');
 if(!registration){if(status)status.textContent='App updates need an HTTPS browser connection with service-worker support.';return;}
 try{await registration.update();if(registration.waiting){waitingUpdate=registration.waiting;applyWaitingUpdate();if(status)status.textContent='Update ready. It will apply when no recipe editor is open.';}else if(status)status.textContent=registration.installing?'Downloading the app update…':'You have the latest available app version.';}catch{if(status)status.textContent='Could not check right now. Open the app online and try again.';}
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
