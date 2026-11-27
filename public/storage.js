import {legacySeedIds} from './seed-history.js';
import {validateSections,migrateSectionDefaults,adoptLegacySections} from './sections.js';
export const DATA_SCHEMA = 1;
const DB_NAME = 'recipe-personal-notebook';
let database;let freshDatabase=false;
const result = request => new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
export async function openDatabase(){
 if(database)return database;
 const request=indexedDB.open(DB_NAME,1);
 request.onupgradeneeded=event=>{freshDatabase=event.oldVersion===0;const db=request.result;if(!db.objectStoreNames.contains('recipes'))db.createObjectStore('recipes',{keyPath:'id'});if(!db.objectStoreNames.contains('settings'))db.createObjectStore('settings');};
 database=await result(request);database.onversionchange=()=>{database.close();database=null;};return database;
}
async function transaction(storeName,mode,operation){
 const db=await openDatabase();
 return new Promise((resolve,reject)=>{const tx=db.transaction(storeName,mode);let value;try{value=operation(tx.objectStore(storeName));}catch(e){tx.abort();reject(e);return;}tx.oncomplete=()=>resolve(value?.result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Storage operation cancelled.'));});
}
export async function initializeLibrary(bundled){
 const db=await openDatabase();
 const records=await result(db.transaction('recipes').objectStore('recipes').getAll());
 const existing=new Map(records.map(r=>[r.id,r]));
 const seeded=await getSetting('seededRecipeIds',freshDatabase?[]:legacySeedIds),known=new Set(seeded);
 await new Promise((resolve,reject)=>{const tx=db.transaction(['recipes','settings'],'readwrite'),store=tx.objectStore('recipes');for(const recipe of bundled){const prior=existing.get(recipe.id);if(prior?.deleted||prior?.origin==='deleted')continue;if(!prior&&!known.has(recipe.id)&&records.some(r=>!r.deleted&&r.origin!=='deleted'&&r.recipe?.title?.trim().toLocaleLowerCase('en')===recipe.title.trim().toLocaleLowerCase('en')))continue;if(!prior&&!known.has(recipe.id)||prior?.origin==='bundled'&&!prior.modified)store.put({id:recipe.id,origin:'bundled',modified:false,recipe,updatedAt:prior?.updatedAt||new Date().toISOString(),schema:DATA_SCHEMA});}tx.objectStore('settings').put([...new Set([...seeded,...bundled.map(r=>r.id)])],'seededRecipeIds');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});freshDatabase=false;
 return loadLibrary(bundled.map(r=>r.id));
}
export async function loadLibrary(bundledOrder=[]){
 const db=await openDatabase();const records=await result(db.transaction('recipes').objectStore('recipes').getAll());
 const order=new Map(bundledOrder.map((id,index)=>[id,index]));
 return records.filter(r=>!r.deleted&&r.origin!=='deleted'&&r.recipe).sort((a,b)=>(order.get(a.id)??9999)-(order.get(b.id)??9999)||a.updatedAt.localeCompare(b.updatedAt)).map(record=>({...record.recipe,trials:record.recipe.trials||[],local:record.origin==='local',overridden:record.modified}));
}
const saveListeners=new Set();
export const onNotebookSave=listener=>{saveListeners.add(listener);return ()=>saveListeners.delete(listener);};
async function saved(snapshot){for(const listener of saveListeners){try{await listener(snapshot);}catch{ /* recipe commit remains successful */ }}}
export async function saveRecipe(recipe){
 const db=await openDatabase();await new Promise((resolve,reject)=>{const tx=db.transaction(['recipes','settings'],'readwrite');tx.objectStore('recipes').put({id:recipe.id,origin:'local',modified:true,recipe,updatedAt:new Date().toISOString(),schema:DATA_SCHEMA});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});await saved();
}
export async function restoreRecipes(recipes,sections,recipeOrder,manualRecipeIds){
 await saveBookState(recipes,sections,recipeOrder,manualRecipeIds);
}
export async function saveBookState(recipes,sections,recipeOrder,manualRecipeIds){
 const db=await openDatabase();if(manualRecipeIds!==undefined&&manualRecipeIds!==null)validateManualIds(manualRecipeIds);if(sections)validateSections(sections);if(recipeOrder!==undefined&&!['alphabetical','manual'].includes(recipeOrder))throw Error('Invalid recipe order.');
 await new Promise((resolve,reject)=>{const tx=db.transaction(['recipes','settings'],'readwrite');if(recipeOrder!==undefined)tx.objectStore('settings').put(recipeOrder,'recipeOrder');if(manualRecipeIds!==undefined)tx.objectStore('settings').put(manualRecipeIds,'manualRecipeIds');const store=tx.objectStore('recipes');for(const recipe of recipes)store.put({id:recipe.id,origin:'local',modified:true,recipe,updatedAt:new Date().toISOString(),schema:DATA_SCHEMA});if(sections){tx.objectStore('settings').put(sections,'sections');tx.objectStore('settings').put(2,'sectionOrderVersion');}tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('The book was not saved.'));});await saved();
}
export async function getSetting(key,fallback){const db=await openDatabase();const value=await result(db.transaction('settings').objectStore('settings').get(key));return value??fallback;}
export async function setSetting(key,value){await transaction('settings','readwrite',store=>store.put(value,key));}
export function validateBackup(value){
 if(!value||value.format!=='recipe-notebook'||value.version!==1||!Array.isArray(value.recipes)||value.recipes.length>2000)throw Error('This is not a supported Recipe notebook backup.');
 if(value.manualRecipeIds!==undefined&&value.manualRecipeIds!==null)validateManualIds(value.manualRecipeIds);
 if(value.recipeOrder!==undefined&&!['alphabetical','manual'].includes(value.recipeOrder))throw Error('Invalid recipe order in backup.');
 const ids=new Set();const categories=['Desserts','Sides','Main'];
 const text=(v,max=20000)=>typeof v==='string'&&v.length<=max;
 const ingredients=items=>Array.isArray(items)&&items.length<=500&&items.every(i=>Array.isArray(i)&&i.length===2&&i.every(v=>text(v,5000)));
 for(const r of value.recipes){
  if(!r||!text(r.id,150)||!/^[a-z0-9-]+$/.test(r.id)||ids.has(r.id)||!text(r.title,300)||!r.title.trim()||!text(r.category,100)||!r.category.trim()||!ingredients(r.ingredients)||!Array.isArray(r.steps)||r.steps.length>500||!r.steps.every(v=>text(v))||!Array.isArray(r.notes)||!r.notes.every(v=>text(v))||r.cuisine!=null&&!text(r.cuisine,100)||r.unspecified!=null&&!text(r.unspecified))throw Error('A recipe in this backup is invalid or duplicated. No data was changed.');
  if(r.components!=null&&(!Array.isArray(r.components)||r.components.length>50||!r.components.every(c=>text(c.title,300)&&ingredients(c.ingredients)&&(!c.steps||Array.isArray(c.steps)&&c.steps.every(v=>text(v))))))throw Error('Invalid recipe component. No data was changed.');
  if(r.trials!=null&&(!Array.isArray(r.trials)||r.trials.length>100||r.trials.some(t=>!t||!text(t.id,150)||!/^[a-z0-9-]+$/.test(t.id)||!text(t.ingredient,5000)||!t.ingredient.trim()||!text(t.outcome,20000)||!t.outcome.trim())||new Set(r.trials.map(t=>t.id)).size!==r.trials.length))throw Error('Invalid or duplicated Prior Trials entry. No data was changed.');
  ids.add(r.id);
 }
 // Only accept known content fields; discard imported asset paths and metadata.
 return value.recipes.map(r=>({id:r.id,title:r.title,category:r.category,cuisine:r.cuisine||null,ingredients:r.ingredients,steps:r.steps,notes:r.notes,trials:(r.trials||[]).map(t=>({id:t.id,ingredient:t.ingredient,outcome:t.outcome})),unspecified:r.unspecified||'',components:r.components||[],source:text(r.source,300)?r.source:'Restored backup',...(text(r.sectionId,100)&&/^[a-z0-9-]+$/.test(r.sectionId)?{sectionId:r.sectionId}:{}),...(Number.isFinite(r.bookOrder)?{bookOrder:r.bookOrder}:{})}));
}
export function makeBackup(recipes,sections,recipeOrder,manualRecipeIds){return {format:'recipe-notebook',version:1,createdAt:new Date().toISOString(),recipes,...(sections?{sections:validateSections(sections)}:{}),...(recipeOrder!==undefined?{recipeOrder}:{}),...(Array.isArray(manualRecipeIds)?{manualRecipeIds:validateManualIds(manualRecipeIds)}:{})};}
export function previewMerge(current,incoming,policy){
 const byId=new Map(current.map(r=>[r.id,r]));const titles=new Map(current.map(r=>[r.title.trim().toLowerCase(),r]));
 return incoming.map(recipe=>{const match=byId.get(recipe.id)||titles.get(recipe.title.trim().toLowerCase());return {recipe,match,action:!match?'add':policy==='replace'?'replace':policy==='copy'?'copy':'skip'};});
}

export async function resetRecipe(recipe){const db=await openDatabase();await new Promise((resolve,reject)=>{const tx=db.transaction(['recipes','settings'],'readwrite');const store=tx.objectStore('recipes');const request=store.get(recipe.id);request.onsuccess=()=>{const trials=request.result?.recipe.trials||[];store.put({id:recipe.id,origin:'bundled',modified:Boolean(trials.length),recipe:{...recipe,trials},updatedAt:new Date().toISOString(),schema:DATA_SCHEMA});};tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});await saved();}

export function orderRecipes(recipes){
 const chapters=['Main','Sides','Desserts'];
 const cuisines=[...new Set(['Indian','Chinese',...recipes.filter(r=>r.category==='Main').map(r=>r.cuisine||'Other')])];
 return [...recipes].sort((a,b)=>chapters.indexOf(a.category)-chapters.indexOf(b.category)||(a.category==='Main'?cuisines.indexOf(a.cuisine||'Other')-cuisines.indexOf(b.cuisine||'Other'):0));
}

export async function initializeSections(recipes){
 const db=await openDatabase();let sections;
 await new Promise((resolve,reject)=>{const tx=db.transaction('settings','readwrite');const settings=tx.objectStore('settings');const saved=settings.get('sections');const version=settings.get('sectionOrderVersion'),contentVersion=settings.get('contentSectionVersion');let pending=3;
 const ready=()=>{if(--pending)return;try{sections=validateSections(migrateSectionDefaults(saved.result||adoptLegacySections(recipes),version.result));if(!contentVersion.result){const main=sections.find(s=>s.id==='main'&&!s.parentId);if(main&&!sections.some(s=>s.parentId===main.id&&s.name==='Italian'))sections.push({id:sections.some(s=>s.id==='main-italian')?'seed-italian-v1':'main-italian',name:'Italian',parentId:main.id});settings.put(1,'contentSectionVersion');}settings.put(sections,'sections');settings.put(2,'sectionOrderVersion');}catch(error){tx.abort();reject(error);}};
 saved.onsuccess=ready;version.onsuccess=ready;contentVersion.onsuccess=ready;tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Section migration was not saved.'));
 });return sections;
}

function validateManualIds(ids){if(!Array.isArray(ids)||ids.length>2000||new Set(ids).size!==ids.length||ids.some(id=>typeof id!=='string'||!/^[a-z0-9-]{1,150}$/.test(id)))throw Error('Invalid manual recipe order.');return [...ids];}
