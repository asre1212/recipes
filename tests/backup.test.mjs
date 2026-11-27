import test from 'node:test';
import assert from 'node:assert/strict';
import {makeBackup,validateBackup,previewMerge} from '../public/storage.js';
import {encryptBackup,decryptBackup} from '../public/crypto.js';
const recipe={id:'local-test',title:'Test recipe',category:'Main',cuisine:'Indian',ingredients:[['1 cup','rice']],steps:['Cook.'],notes:['A note.'],unspecified:'',source:'original-notebook.jpeg'};
test('plain backups validate, strip unsafe artwork, and reject duplicates/schema errors',()=>{
 const backup=makeBackup([{...recipe,illustration:'https://external.invalid/track'}]);
 assert.deepEqual(validateBackup(backup)[0].ingredients,recipe.ingredients);
 assert.equal(validateBackup(backup)[0].illustration,undefined);assert.equal(validateBackup(backup)[0].source,recipe.source);
 assert.throws(()=>validateBackup({...backup,recipes:[recipe,recipe]}));
 assert.throws(()=>validateBackup({...backup,version:42}));
 assert.throws(()=>validateBackup({...backup,recipes:[{...recipe,category:''}]}));
 assert.throws(()=>validateBackup({...backup,recipes:[{...recipe,id:'../oops'}]}));
});
test('merge explicitly keeps, copies or replaces duplicates by stable ID or title',()=>{
 assert.equal(previewMerge([recipe],[recipe],'skip')[0].action,'skip');
 assert.equal(previewMerge([recipe],[recipe],'copy')[0].action,'copy');
 assert.equal(previewMerge([recipe],[{...recipe,id:'new-id'}],'replace')[0].match.id,recipe.id);
 assert.equal(previewMerge([], [recipe],'skip')[0].action,'add');
});
test('encrypted backups round-trip, randomize ciphertext, and reject wrong passwords/tampering',async()=>{
 const pass='test-only-long-passphrase';const backup=makeBackup([recipe]);
 const first=await encryptBackup(backup,pass);const second=await encryptBackup(backup,pass);
 assert.notEqual(first.iv,second.iv);assert.notEqual(first.salt,second.salt);assert.notEqual(first.ciphertext,second.ciphertext);
 assert.ok(!JSON.stringify(first).includes('Test recipe'));
 assert.deepEqual(await decryptBackup(first,pass),backup);
 await assert.rejects(decryptBackup(first,'wrong-passphrase'),/Could not unlock/);
 const tampered={...first,ciphertext:(first.ciphertext[0]==='A'?'B':'A')+first.ciphertext.slice(1)};
 await assert.rejects(decryptBackup(tampered,pass),/Could not unlock/);
 await assert.rejects(encryptBackup(backup,'short'),/12 characters/);
 await assert.rejects(decryptBackup({...first,iterations:999999999},pass),/Unsupported/);
});

test('new recipe editor renders and existing component ingredients remain editable',async()=>{
 const {editorPage}=await import('../public/kitchen.js');
 assert.match(editorPage(null),/Write a recipe/);
 assert.match(editorPage(false),/name="ingredients"/);
 assert.match(editorPage({...recipe,components:[{title:'Icing',ingredients:[['1 cup','sugar']]}]}),/component-ingredients-0/);
});

test('new entries and cuisine changes keep footer page order aligned with contents',async()=>{
 const {orderRecipes}=await import('../public/storage.js');
 const rows=[{id:'other',category:'Main',cuisine:'Other'},{id:'side',category:'Sides'},{id:'dessert',category:'Desserts'},{id:'indian',category:'Main',cuisine:'Indian'},{id:'chinese',category:'Main',cuisine:'Chinese'}];
 assert.deepEqual(orderRecipes(rows).map(r=>r.id),['dessert','side','indian','chinese','other']);
});
