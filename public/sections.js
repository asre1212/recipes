export const defaultSections=[{id:'main',name:'Main',parentId:null},{id:'main-indian',name:'Indian',parentId:'main'},{id:'main-chinese',name:'Chinese',parentId:'main'},{id:'main-other',name:'Other',parentId:'main'},{id:'sides',name:'Sides',parentId:null},{id:'desserts',name:'Desserts',parentId:null}];
export function validateSections(value){
 if(!Array.isArray(value)||!value.length||value.length>100)throw Error('A notebook needs 1–100 sections.');
 const ids=new Set();const names=new Set();
 for(const s of value){if(!s||typeof s.id!=='string'||!/^[a-z0-9-]{1,100}$/.test(s.id)||ids.has(s.id)||typeof s.name!=='string'||!s.name.trim()||s.name.length>100||s.parentId!==null&&typeof s.parentId!=='string')throw Error('Invalid or duplicate section.');const key=(s.parentId||'root')+'|'+s.name.trim().toLowerCase();if(names.has(key))throw Error('Section names must be unique within their parent.');ids.add(s.id);names.add(key);}
 for(const s of value)if(s.parentId&&!value.some(p=>p.id===s.parentId&&!p.parentId))throw Error('A subsection needs an existing top-level parent.');
 if(!value.some(s=>!s.parentId))throw Error('Keep at least one top-level section.');
 return value.map(s=>({id:s.id,name:s.name.trim(),parentId:s.parentId}));
}
export function sectionFor(recipe,sections){return sections.find(s=>s.id===recipe.sectionId)||sections.find(s=>s.parentId&&s.name===recipe.cuisine&&sections.find(p=>p.id===s.parentId)?.name===recipe.category)||sections.find(s=>!s.parentId&&s.name===recipe.category)||sections.find(s=>!s.parentId);}
export function placeInSection(recipe,sectionId,sections){const section=sections.find(s=>s.id===sectionId);if(!section)throw Error('Choose an existing section.');const parent=section.parentId?sections.find(s=>s.id===section.parentId):section;return {...recipe,sectionId:section.id,category:parent.name,cuisine:section.parentId?section.name:null};}
export function sectionSequence(sections){return sections.filter(s=>!s.parentId).flatMap(root=>[root,...sections.filter(s=>s.parentId===root.id)]);}
export function arrangeBook(recipes,sections){const order=sectionSequence(sections).map(s=>s.id);return recipes.map((r,i)=>({...placeInSection(r,sectionFor(r,sections).id,sections),bookOrder:r.bookOrder??i})).sort((a,b)=>order.indexOf(a.sectionId)-order.indexOf(b.sectionId)||(a.bookOrder??recipes.findIndex(r=>r.id===a.id))-(b.bookOrder??recipes.findIndex(r=>r.id===b.id)));}
export function moveRecipe(recipes,id,sectionId,beforeId,sections){const ordered=arrangeBook(recipes,sections);const moved=ordered.find(r=>r.id===id);if(!moved)throw Error('Recipe not found.');const remaining=ordered.filter(r=>r.id!==id);const positioned=placeInSection(moved,sectionId,sections);let index=beforeId?remaining.findIndex(r=>r.id===beforeId&&r.sectionId===sectionId):-1;if(index<0){index=remaining.reduce((last,r,i)=>r.sectionId===sectionId?i+1:last,-1);if(index<0)index=remaining.length;}remaining.splice(index,0,positioned);return arrangeBook(remaining.map((r,i)=>({...r,bookOrder:i})),sections);}
export function removeSection(sections,recipes,id,destinationId){const removed=new Set([id,...sections.filter(s=>s.parentId===id).map(s=>s.id)]);const next=sections.filter(s=>!removed.has(s.id));validateSections(next);const affected=recipes.filter(r=>removed.has(sectionFor(r,sections).id));if(affected.length&&!next.some(s=>s.id===destinationId))throw Error('Choose where to move the recipes before removing this section.');return {sections:next,recipes:recipes.map(r=>removed.has(sectionFor(r,sections).id)?placeInSection(r,destinationId,next):r)};}

export function adoptLegacySections(recipes){const sections=structuredClone(defaultSections);for(const recipe of recipes){let root=sections.find(s=>!s.parentId&&s.name===recipe.category);if(!root){root={id:'legacy-root-'+sections.length,name:recipe.category,parentId:null};sections.push(root);}if(recipe.cuisine&&!sections.some(s=>s.parentId===root.id&&s.name===recipe.cuisine))sections.push({id:'legacy-cuisine-'+sections.length,name:recipe.cuisine,parentId:root.id});}return validateSections(sections);}

export function restoreLayoutSnapshot(snapshot,current){const saved=new Map(snapshot.recipes.map(r=>[r.id,r]));return current.map(recipe=>{const prior=saved.get(recipe.id);return prior?{...recipe,category:prior.category,cuisine:prior.cuisine,sectionId:prior.sectionId,bookOrder:prior.bookOrder}:recipe;});}

// Only the exact former defaults migrate. Custom trees and explicitly saved layouts stay put.
export function migrateSectionDefaults(sections,version){
 const oldIds=['desserts','sides','main','main-indian','main-chinese','main-other'];
 const untouched=Array.isArray(sections)&&sections.length===oldIds.length&&sections.every((s,i)=>s.id===oldIds[i]&&defaultSections.some(d=>d.id===s.id&&d.name===s.name&&d.parentId===s.parentId));
 return !version&&untouched?structuredClone(defaultSections):sections;
}
export function moveSection(sections,id,beforeId=null){
 const moved=sections.find(s=>s.id===id);if(!moved)throw Error('Section not found.');
 const siblings=sections.filter(s=>s.parentId===moved.parentId);const before=beforeId&&siblings.find(s=>s.id===beforeId);
 if(beforeId&&!before)throw Error('Move sections within the same level.');
 if(beforeId===id)return structuredClone(sections);
 const ordered=siblings.filter(s=>s.id!==id);const index=before?ordered.findIndex(s=>s.id===beforeId):ordered.length;ordered.splice(index,0,moved);
 const roots=moved.parentId?sections.filter(s=>!s.parentId):ordered;
 return validateSections(roots.flatMap(root=>[root,...(root.id===moved.parentId?ordered:sections.filter(s=>s.parentId===root.id))]));
}

export const hiddenCuisine=section=>Boolean(section.parentId&&['Indian','Chinese','Other','Italian'].includes(section.name));
// View ordering never writes bookOrder: an older/manual arrangement remains recoverable.
export function readingGroups(sections){return sections.filter(s=>!s.parentId).flatMap(root=>[{section:root,ids:[root.id,...sections.filter(s=>s.parentId===root.id&&hiddenCuisine(s)).map(s=>s.id)]},...sections.filter(s=>s.parentId===root.id&&!hiddenCuisine(s)).map(s=>({section:s,ids:[s.id]}))]);}
const titleOrder=new Intl.Collator('en',{sensitivity:'base'});
export function arrangeReadingBook(recipes,sections,mode='alphabetical',manualIds=null){
 const manual=arrangeBook(recipes,sections);if(mode==='manual'){if(!Array.isArray(manualIds))return manual;const rank=new Map(manualIds.map((id,i)=>[id,i]));return readingGroups(sections).flatMap(group=>manual.filter(r=>group.ids.includes(r.sectionId)).sort((a,b)=>(rank.get(a.id)??1e9)-(rank.get(b.id)??1e9)));}
 return readingGroups(sections).flatMap(group=>manual.filter(r=>group.ids.includes(r.sectionId)).sort((a,b)=>titleOrder.compare(a.title,b.title)));
}

export function moveReadingRecipe(recipes,id,destination,beforeId,sections,manualIds,keepAssignment=false){
 const ordered=arrangeReadingBook(recipes,sections,'manual',manualIds),source=ordered.find(r=>r.id===id);if(!source)throw Error('Recipe not found.');
 const groups=readingGroups(sections),sameGroup=groups.some(g=>g.ids.includes(sectionFor(source,sections).id)&&g.ids.includes(destination));
 const moved=keepAssignment&&sameGroup?source:placeInSection(source,destination,sections),remaining=ordered.filter(r=>r.id!==id),group=groups.find(g=>g.ids.includes(sectionFor(moved,sections).id));
 let index=beforeId?remaining.findIndex(r=>r.id===beforeId):-1;if(index<0)index=remaining.reduce((last,r,i)=>group.ids.includes(sectionFor(r,sections).id)?i+1:last,remaining.length);
 remaining.splice(index,0,moved);return {recipes:remaining,manualRecipeIds:remaining.map(r=>r.id)};
}
