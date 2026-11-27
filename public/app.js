import {recipes as bundledRecipes, categories} from './recipes.js';
import {initializeLibrary,loadLibrary,getSetting,setSetting,resetRecipe} from './storage.js';
import {editorPage,bindEditor,backupPage,bindBackup,hasDraft,discardDraft} from './kitchen.js';
const recipes=[];
const refreshLibrary=async()=>{const next=await loadLibrary(bundledRecipes.map(r=>r.id));recipes.splice(0,recipes.length,...next);};
const book = document.querySelector('#book');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pageNumber = recipe => recipes.indexOf(recipe) + 3;
const footer = (number, previous, next) => `<footer class="page-footer"><a href="${previous}" aria-label="Previous page">Previous</a><a class="page-number" href="#contents" aria-label="Page ${number}. Back to contents">${String(number).padStart(2,'0')}<span>Contents</span></a>${next ? `<a href="${next}" aria-label="Next page">Next</a>` : '<span class="end-note">End of book</span>'}</footer>`;
const entry = r => `<li><a class="toc-entry" href="#recipe/${escape(r.id)}"><span>${escape(r.title)}</span><span class="toc-rule" aria-hidden="true"></span><span class="toc-number">${String(pageNumber(r)).padStart(2,'0')}</span></a></li>`;
function contents() {
  return `<article class="paper contents"><div class="eyebrow">THE RECIPE NOTEBOOK</div><h1>Contents</h1><p class="intro">A few good things, worth making again.</p><div class="toc-list">${categories.map(category => {
    const items = recipes.filter(r => r.category === category.name);
    return `<section class="toc-section"><div class="toc-heading"><h2>${category.name}</h2><span>${items.length === 1 ? '1 recipe' : `${items.length} recipes`}</span></div>${category.name === 'Main' ? [...new Set([...category.cuisines, ...items.map(r=>r.cuisine || 'Other')])].map(cuisine => `<h3>${escape(cuisine)}</h3>${items.some(r=>(r.cuisine || 'Other')===cuisine) ? `<ol>${items.filter(r=>(r.cuisine || 'Other')===cuisine).map(entry).join('')}</ol>` : '<p class="empty">A page waiting to be written.</p>'}`).join('') : items.length ? `<ol>${items.map(entry).join('')}</ol>` : '<p class="empty">A page waiting to be written.</p>'}</section>`;
  }).join('')}</div><p class="hand-note">Collected slowly. Cooked with love.</p>${footer(2,'#cover',recipes.length ? '#recipe/'+recipes[0].id : null)}</article>`;
}
function cover() {
 return `<article class="cover"><div class="cover-border"><div class="cover-eyebrow">A LITTLE COLLECTION OF</div><h1>Recipes</h1><p class="cover-subtitle">from the kitchen notebook</p><img class="bear" src="assets/bear.svg" alt="A little white bear holding a chocolate-chip cookie" width="360" height="400"><p class="cover-note">Good food. Happy little moments.</p><a class="open-book" href="#contents">Open the notebook</a><a class="cover-page" href="#contents" aria-label="Page 1. Contents">01 · Contents</a></div></article>`;
}
const ingredientList = items => `<ul>${items.map(([amount,name])=>`<li><span class="amount">${escape(amount)}</span> ${escape(name)}</li>`).join('')}</ul>`;
const methodList = steps => `<ol>${steps.map(step=>`<li>${escape(step)}</li>`).join('')}</ol>`;
function recipePage(r) {
  const index = recipes.indexOf(r);
  const illustration=r.illustration||bundledRecipes.find(b=>b.id===r.id)?.illustration;
  return `<article class="paper recipe"><div class="eyebrow">FROM THE RECIPE NOTEBOOK <span> / ${escape(r.category)}${r.cuisine ? ' · '+escape(r.cuisine):''}</span></div><div class="recipe-actions"><a href="#edit/${escape(r.id)}">Edit recipe</a>${r.overridden&&bundledRecipes.some(b=>b.id===r.id)?'<button id="restore-original">Restore original</button>':''}</div><header class="recipe-heading"><h1>${escape(r.title)}</h1><div class="title-underline" aria-hidden="true"></div></header><div class="recipe-grid ${r.notes.length || illustration ? '' : 'no-margin'}"><section class="ingredients"><h2>Ingredients</h2>${ingredientList(r.ingredients)}${(r.components||[]).map(c=>`<section class="component"><h3>${escape(c.title)}</h3>${ingredientList(c.ingredients)}</section>`).join('')}</section><aside class="margin">${r.notes.length ? `<div class="margin-note"><h2>Margin notes</h2>${r.notes.map(n=>`<p>${escape(n)}</p>`).join('')}</div>` : ''}${illustration ? `<img class="dish-sketch" src="${escape(illustration)}" width="340" height="220" alt="${escape(r.illustrationAlt || bundledRecipes.find(b=>b.id===r.id)?.illustrationAlt || 'A hand-drawn pair of chocolate-chip cookies')}">` : ''}</aside></div><section class="method"><h2>Method</h2>${r.steps.length ? methodList(r.steps) : '<p class="empty">No method supplied in the notebook.</p>'}${(r.components||[]).filter(c=>c.steps?.length).map(c=>`<h3>${escape(c.title)}</h3>${methodList(c.steps)}`).join('')}</section>${r.unspecified ? `<aside class="unspecified"><strong>Still in the margins</strong><p>${escape(r.unspecified)}</p></aside>` : ''}<p class="source-note">Notebook source: ${escape(r.source || 'starter cookie page')}</p>${footer(pageNumber(r),index ? '#recipe/'+recipes[index-1].id : '#contents',recipes[index+1] ? '#recipe/'+recipes[index+1].id : null)}</article>`;
}
let currentHash=location.hash||'#cover';
function render() {
 if(hasDraft()&&currentHash!==(location.hash||'#cover')){if(!confirm('Leave this recipe draft without saving?')){history.replaceState(null,'',currentHash);return;}discardDraft();}
 currentHash=location.hash||'#cover';
 const hash = location.hash || '#cover';
 const recipe = hash.startsWith('#recipe/') && recipes.find(r=>r.id===hash.slice(8));
 let title;
 if(hash==='#new'||hash.startsWith('#edit/')) {
 const editing=hash.startsWith('#edit/')?recipes.find(r=>r.id===hash.slice(6)):null;
 if(hash!=='#new'&&!editing){location.hash='#contents';return;}
 book.innerHTML=editorPage(editing);title=editing?'Edit '+editing.title:'Write a recipe';
 bindEditor(editing,async id=>{await refreshLibrary();location.hash='#recipe/'+id;});
 }
 else if(hash==='#backup'){book.innerHTML=backupPage();title='Backups & updates';bindBackup(recipes,refreshLibrary,checkUpdates,value=>{autoUpdate=value;if(value)applyWaitingUpdate();});}
 else
 if(hash==='#cover') { book.innerHTML=cover(); title='The notebook'; }
 else if(hash==='#contents') { book.innerHTML=contents(); title='Contents'; }
 else if(recipe) { book.innerHTML=recipePage(recipe); title=recipe.title; }
 else { book.innerHTML=`<article class="paper missing"><h1>A missing page</h1><p>This recipe isn’t in the notebook yet.</p><a class="open-book" href="#contents">Back to contents</a></article>`; title='Page not found'; }
 document.title=title+' · Recipe';
 document.body.dataset.page=hash==='#cover' ? 'cover' : 'paper';
 document.querySelectorAll('.site-header a').forEach(a=>a.toggleAttribute('aria-current',a.getAttribute('href')===hash));
 const reset=document.querySelector('#restore-original');
 if(reset&&recipe)reset.addEventListener('click',async()=>{if(confirm('Restore the supplied original and discard your local edits to this recipe?')){try{await resetRecipe(bundledRecipes.find(b=>b.id===recipe.id));await refreshLibrary();render();}catch{alert('Could not restore this recipe. Your existing copy remains saved.');}}});
 window.scrollTo(0,0);
 book.focus({preventScroll:true});
}
window.addEventListener('hashchange',render);
window.addEventListener('beforeunload',e=>{if(hasDraft()){e.preventDefault();e.returnValue='';}});
let autoUpdate=true;
try{recipes.push(...await initializeLibrary(bundledRecipes));autoUpdate=await getSetting('autoUpdate',true);}catch{recipes.push(...bundledRecipes);document.querySelector('#storage-warning').hidden=false;}
render();
const help=document.querySelector('#install-help');
help.addEventListener('click',()=>{const guide=document.querySelector('#install-guide');guide.hidden=!guide.hidden;help.setAttribute('aria-expanded',String(!guide.hidden));});
let installPrompt;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;document.querySelector('#install').hidden=false;});
document.querySelector('#install').addEventListener('click',async()=>{if(!installPrompt)return;await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;document.querySelector('#install').hidden=true;});
let registration;let waitingUpdate;let refreshing=false;
function applyWaitingUpdate(){
 if(!waitingUpdate||hasDraft()||document.querySelector('#recipe-form'))return;
 document.querySelector('#update-notice').hidden=false;
 document.querySelector('#update-message').textContent='A new notebook version is ready. Your local recipes are saved.';
 if(autoUpdate)waitingUpdate.postMessage({type:'SKIP_WAITING'});
}
async function checkUpdates(){
 const status=document.querySelector('#update-status');
 if(!registration){if(status)status.textContent='App updates need an HTTPS browser connection with service-worker support.';return;}
 try{await registration.update();if(registration.waiting){waitingUpdate=registration.waiting;applyWaitingUpdate();if(status)status.textContent='Update ready. It will apply when no recipe editor is open.';}else if(status)status.textContent=registration.installing?'Downloading the app update…':'You have the latest available app version.';}catch{if(status)status.textContent='Could not check right now. Open the app online and try again.';}
}
document.querySelector('#apply-update').addEventListener('click',()=>{if(!hasDraft()&&!document.querySelector('#recipe-form'))waitingUpdate?.postMessage({type:'SKIP_WAITING'});});
if('serviceWorker' in navigator){
 const wasControlled=Boolean(navigator.serviceWorker.controller);
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(wasControlled&&!refreshing&&!hasDraft()){refreshing=true;location.reload();}});
 navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(async reg=>{
 registration=reg;await navigator.serviceWorker.ready;
 document.querySelector('#offline-state').textContent='Saved for offline reading. Your notebook is ready to travel.';
 if(reg.waiting){waitingUpdate=reg.waiting;applyWaitingUpdate();}
 reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller){waitingUpdate=reg.waiting;applyWaitingUpdate();}});});
 }).catch(()=>{document.querySelector('#offline-state').textContent='Offline saving is unavailable in this browser. You can still read online.';});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&!hasDraft())checkUpdates();});
 window.addEventListener('hashchange',()=>{applyWaitingUpdate();});
}

document.querySelector('.skip').addEventListener('click',event=>{event.preventDefault();book.focus();});
