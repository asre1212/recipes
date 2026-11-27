import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
test('service worker saves the complete shell and serves navigation/assets without network',async()=>{
 const handlers={};const saved=new Map();let skipped=false;let claimed=false;
 const context={URL,self:{location:{href:'https://example.test/recipes/sw.js',origin:'https://example.test'},addEventListener:(name,fn)=>handlers[name]=fn,skipWaiting:()=>{skipped=true;},clients:{claim:()=>{claimed=true;}}},fetch:()=>Promise.reject(Error('offline')),caches:{open:async()=>({addAll:async urls=>{for(const url of urls)saved.set(url,{url});}}),keys:async()=>['recipe-notebook-old','other-app'],delete:async key=>{assert.equal(key,'recipe-notebook-old');},match:async request=>saved.get(typeof request==='string'?request:request.url)}};
 vm.runInNewContext(await readFile('public/sw.js','utf8'),context);
 let promise;handlers.install({waitUntil:p=>promise=p});await promise;
 assert.ok(saved.has('https://example.test/recipes/storage.js'));assert.ok(saved.has('https://example.test/recipes/kitchen.js'));assert.ok(saved.has('https://example.test/recipes/assets/bread.svg'));assert.equal(skipped,false);
 handlers.activate({waitUntil:p=>promise=p});await promise;assert.equal(claimed,true);
 let response;handlers.fetch({request:{method:'GET',url:'https://example.test/recipes/',mode:'navigate'},respondWith:p=>response=p});assert.equal((await response).url,'https://example.test/recipes/index.html');
 handlers.fetch({request:{method:'GET',url:'https://example.test/recipes/recipes.js',mode:'cors'},respondWith:p=>response=p});assert.equal((await response).url,'https://example.test/recipes/recipes.js');
 handlers.message({data:{type:'SKIP_WAITING'},waitUntil:p=>promise=p});assert.equal(skipped,true);
});
