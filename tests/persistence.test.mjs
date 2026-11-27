import 'fake-indexeddb/auto';import test from 'node:test';import assert from 'node:assert/strict';
import {initializeLibrary,loadLibrary,saveRecipe,getSetting,setSetting,saveBookState,makeBackup,validateBackup,restoreRecipes} from '../public/storage.js';
import {defaultSections,moveRecipe,removeSection,arrangeBook} from '../public/sections.js';import {encryptBackup,decryptBackup} from '../public/crypto.js';
const base=[{id:'bundled-test',title:'Supplied test',category:'Desserts',cuisine:null,ingredients:[['½ cup','butter'],['¼ tsp','salt']],steps:['Mix.'],notes:['Original note'],unspecified:'Time unspecified.',source:'test-source.jpeg'},{id:'second-test',title:'Second supplied',category:'Sides',cuisine:null,ingredients:[['1 cup','flour']],steps:['Mix.'],notes:[],unspecified:'Time unspecified.'}];
test('IndexedDB preserves edits, local additions, sections/order and preferences through bundle update and encrypted restore',async()=>{
 await initializeLibrary(base);await setSetting('sections',defaultSections);await setSetting('autoUpdate',false);
 await saveRecipe({...base[0],ingredients:[['¾ cup','butter']],notes:['Changed amount, removed salt, added note.']});
 await saveRecipe({...base[0],id:'local-added',title:'Typed locally',source:'Your notebook'});
 let library=await loadLibrary(base.map(r=>r.id));assert.equal(library.length,3);assert.deepEqual(library.find(r=>r.id===base[0].id).ingredients,[['¾ cup','butter']]);
 const sections=[...defaultSections,{id:'new-empty',name:'New empty section',parentId:null}];let moved=moveRecipe(library,'bundled-test','new-empty',null,sections);await saveBookState(moved,sections);
 const removed=removeSection(sections,moved,'desserts','new-empty');await saveBookState(removed.recipes,removed.sections);
 await initializeLibrary(base.map(r=>({...r,notes:['New bundled update']})));
 library=arrangeBook(await loadLibrary(base.map(r=>r.id)),await getSetting('sections'));assert.equal(library.find(r=>r.id==='bundled-test').category,'New empty section');assert.deepEqual(library.find(r=>r.id==='bundled-test').ingredients,[['¾ cup','butter']]);assert.ok(library.find(r=>r.id==='local-added'));assert.equal(await getSetting('autoUpdate'),false);assert.ok(!(await getSetting('sections')).some(s=>s.id==='desserts'));
 const backup=makeBackup(library,await getSetting('sections'));const encrypted=await encryptBackup(backup,'synthetic-long-test-passphrase');await assert.rejects(decryptBackup(encrypted,'wrong passphrase'));assert.equal((await loadLibrary()).length,3);
 const decoded=await decryptBackup(encrypted,'synthetic-long-test-passphrase');const restored=validateBackup(decoded);await restoreRecipes(restored,decoded.sections);const after=arrangeBook(await loadLibrary(base.map(r=>r.id)),await getSetting('sections'));assert.deepEqual(after.map(r=>r.id),library.map(r=>r.id));assert.equal(after.find(r=>r.id==='bundled-test').source,'test-source.jpeg');assert.deepEqual(after.find(r=>r.id==='bundled-test').ingredients,[['¾ cup','butter']]);assert.deepEqual((await getSetting('sections')).map(s=>s.id),decoded.sections.map(s=>s.id));
 // Cancel/undo uses a full, atomic saved snapshot and retains all recipe IDs.
 await saveBookState(backup.recipes,backup.sections);assert.deepEqual(arrangeBook(await loadLibrary(base.map(r=>r.id)),await getSetting('sections')).map(r=>r.id),library.map(r=>r.id));
});
