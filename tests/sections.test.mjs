import test from 'node:test';import assert from 'node:assert/strict';
import {defaultSections,validateSections,arrangeBook,moveRecipe,removeSection,adoptLegacySections} from '../public/sections.js';
const recipe=(id,category='Desserts',cuisine=null)=>({id,title:id,category,cuisine,ingredients:[['1','ingredient']],steps:['Mix.'],notes:['Keep original'],unspecified:'Time unspecified.'});
const rows=[recipe('one'),recipe('two'),recipe('three','Main','Indian')];
test('pointer move operation reorders within chapter and moves into an empty cuisine with stable IDs',()=>{
 let moved=moveRecipe(rows,'two','desserts','one',defaultSections);assert.deepEqual(moved.map(r=>r.id),['two','one','three']);
 moved=moveRecipe(moved,'one','main-chinese',null,defaultSections);const one=moved.find(r=>r.id==='one');assert.equal(one.category,'Main');assert.equal(one.cuisine,'Chinese');assert.equal(one.sectionId,'main-chinese');assert.deepEqual(one.ingredients,rows[0].ingredients);assert.equal(new Set(moved.map(r=>r.id)).size,3);
 assert.deepEqual(arrangeBook(JSON.parse(JSON.stringify(moved)),defaultSections).map(r=>r.id),moved.map(r=>r.id));
});
test('custom empty sections accept moves; removal requires reassignment and never deletes recipes',()=>{
 const sections=validateSections([...defaultSections,{id:'breakfast',name:'Breakfast',parentId:null}]);
 const moved=moveRecipe(rows,'one','breakfast',null,sections);assert.equal(moved.find(r=>r.id==='one').category,'Breakfast');
 assert.throws(()=>removeSection(sections,moved,'breakfast',''),/Choose where/);
 const removed=removeSection(sections,moved,'breakfast','sides');assert.equal(removed.recipes.length,rows.length);assert.equal(removed.recipes.find(r=>r.id==='one').category,'Sides');assert.ok(!removed.sections.some(s=>s.id==='breakfast'));
 const parent=removeSection(defaultSections,rows,'main','desserts');assert.ok(!parent.sections.some(s=>s.id==='main'||s.parentId==='main'));assert.equal(parent.recipes.length,3);assert.equal(parent.recipes.find(r=>r.id==='three').category,'Desserts');assert.equal(parent.recipes.find(r=>r.id==='three').cuisine,null);
 const snapshot=structuredClone({recipes:rows,sections:defaultSections});moveRecipe(rows,'one','sides',null,defaultSections);assert.deepEqual(snapshot,{recipes:rows,sections:defaultSections});
});
test('invalid section trees rejected; legacy custom categories/cuisines migrate without losing owners choices',()=>{
 assert.throws(()=>validateSections([{id:'child',name:'Child',parentId:'absent'}]));assert.throws(()=>validateSections([...defaultSections,{id:'duplicate',name:'desserts',parentId:null}]));assert.throws(()=>removeSection([{id:'only',name:'Only',parentId:null}],[],'only',null));
 const adopted=adoptLegacySections([recipe('french','Main','French'),recipe('breakfast','Breakfast')]);assert.ok(adopted.some(s=>s.name==='French'&&s.parentId==='main'));assert.ok(adopted.some(s=>s.name==='Breakfast'&&!s.parentId));assert.equal(arrangeBook([recipe('french','Main','French')],adopted)[0].cuisine,'French');
});

test('cancelling layout changes preserves recipe edits and additions made during reorder mode',async()=>{
 const {restoreLayoutSnapshot}=await import('../public/sections.js');const snapshot={recipes:structuredClone(rows),sections:defaultSections};const edited=moveRecipe(rows,'one','sides',null,defaultSections).map(r=>r.id==='one'?{...r,ingredients:[['2 cups','changed ingredient']],notes:['Edited during reorder']}:r);edited.push(recipe('new-local'));
 const restored=restoreLayoutSnapshot(snapshot,edited);assert.equal(restored.find(r=>r.id==='one').category,'Desserts');assert.deepEqual(restored.find(r=>r.id==='one').ingredients,[['2 cups','changed ingredient']]);assert.deepEqual(restored.find(r=>r.id==='one').notes,['Edited during reorder']);assert.ok(restored.find(r=>r.id==='new-local'));
});
