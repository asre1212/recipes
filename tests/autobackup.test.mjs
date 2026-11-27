import test from 'node:test';
import assert from 'node:assert/strict';
import {indexedDB} from 'fake-indexeddb';
globalThis.indexedDB=indexedDB;
import {initializeLibrary,initializeSections,saveRecipe,getSetting,validateBackup,restoreRecipes,loadLibrary} from '../public/storage.js';
import {rotateFolder,serializeBackup} from '../public/autobackup.js';
import {recipes} from '../public/recipes.js';
test('each save atomically rotates exactly two lossless recovery snapshots, including trials, and restores safely',async()=>{
 await initializeLibrary(recipes);await initializeSections(recipes);
 const r=structuredClone(recipes[0]);r.ingredients[0][0]='test amount';r.trials=[{id:'trial-qa',ingredient:'1 cup sugar',outcome:'too sweet'}];await saveRecipe(r);
 r.notes.push('second revision');await saveRecipe(r);r.ingredients.splice(1,1);await saveRecipe(r);
 const snapshots=await getSetting('recoverySnapshots');assert.equal(snapshots.length,2);const latest=validateBackup(snapshots[0]),previous=validateBackup(snapshots[1]);assert.equal(latest.find(x=>x.id===r.id).ingredients.length,previous.find(x=>x.id===r.id).ingredients.length-1);assert.deepEqual(latest.find(x=>x.id===r.id).trials,r.trials);
 await restoreRecipes(previous);assert.deepEqual((await loadLibrary()).find(x=>x.id===r.id).ingredients,previous.find(x=>x.id===r.id).ingredients);
});
test('folder writes verify newest before pruning only tracked app files; failures never prune',async()=>{
 const files=new Map([['unrelated.json','private']]);const removed=[];let fail=false;
 const folder={getFileHandle:async name=>({createWritable:async()=>({write:async text=>{if(fail)throw Error('full');files.set(name,text);},close:async()=>{}}),getFile:async()=>({text:async()=>files.get(name)})}),removeEntry:async name=>{removed.push(name);files.delete(name);}};
 let owned=[];for(let i=0;i<4;i++)owned=await rotateFolder(folder,{revision:i},owned);assert.equal(owned.length,2);assert.equal(files.size,3);assert.equal(files.get('unrelated.json'),'private');assert.equal(removed.length,2);fail=true;await assert.rejects(rotateFolder(folder,{revision:5},owned));assert.equal(removed.length,2);assert.ok(owned.every(n=>files.has(n)));
 const sequence=[];await Promise.all([serializeBackup(async()=>{await new Promise(r=>setTimeout(r,5));sequence.push(1);}),serializeBackup(async()=>sequence.push(2))]);assert.deepEqual(sequence,[1,2]);
});
