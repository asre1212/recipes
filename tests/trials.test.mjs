import 'fake-indexeddb/auto';
import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {changeTrials,trialSection} from '../public/trials.js';
import {initializeLibrary,loadLibrary,saveRecipe,makeBackup,validateBackup,restoreRecipes,resetRecipe} from '../public/storage.js';
import {encryptBackup,decryptBackup} from '../public/crypto.js';
const recipe={id:'trial-bundled',title:'Old supplied recipe',category:'Desserts',cuisine:null,ingredients:[['1 cup','sugar']],steps:['Mix.'],notes:[],unspecified:'Bake time unspecified.',source:'internal-source.jpeg'};
test('trial entries support independent ingredient and outcome fields, multiple entries, stable editing and removal',()=>{
 let entries=changeTrials([],null,'1 cup sugar','too sweet');entries=changeTrials(entries,null,'¾ cup sugar','Better\nKeep this amount.');assert.equal(entries.length,2);const id=entries[0].id;entries=changeTrials(entries,id,'½ cup sugar','less sweet');assert.equal(entries[0].id,id);assert.equal(entries[0].outcome,'less sweet');entries=entries.filter(t=>t.id!==id);assert.equal(entries.length,1);assert.throws(()=>changeTrials([],null,'','outcome'));assert.throws(()=>changeTrials([],null,'sugar',''));
 const html=trialSection({...recipe,trials:[{id:'safe',ingredient:'<script>',outcome:'A < B'}]});assert.ok(!html.includes('<script>'));assert.match(html,/&lt;script&gt;/);assert.match(html,/trial-arrow/);assert.match(trialSection(recipe),/No trials yet/);assert.ok(!trialSection(recipe).includes('1 cup sugar'));
});
test('older backups load without trials; malformed or duplicate trials reject before a restore',()=>{
 assert.deepEqual(validateBackup(makeBackup([recipe]))[0].trials,[]);
 const valid={id:'trial-1',ingredient:'1 cup sugar',outcome:'too sweet'};const backup=makeBackup([{...recipe,trials:[valid]}]);assert.deepEqual(validateBackup(backup)[0].trials,[valid]);
 for(const trials of [[valid,valid],[{...valid,outcome:''}],[{...valid,ingredient:7}],{},Array(101).fill(valid)])assert.throws(()=>validateBackup(makeBackup([{...recipe,trials}])));
});
test('bundled and typed recipes retain trials across bundle updates and plain/encrypted restore; restoring original keeps trials',async()=>{
 await initializeLibrary([recipe]);const legacy=(await loadLibrary()).find(r=>r.id===recipe.id);assert.deepEqual(legacy.trials,[]);
 const trials=changeTrials([],null,'1 cup sugar','too sweet');await saveRecipe({...legacy,trials});const local={...recipe,id:'local-trial-test',title:'Typed test',trials:changeTrials([],null,'2 tbsp milk','Softer crumb')};await saveRecipe(local);
 await initializeLibrary([{...recipe,notes:['Bundle update']}]);let current=await loadLibrary();assert.deepEqual(current.find(r=>r.id===recipe.id).trials,trials);assert.equal(current.find(r=>r.id==='local-trial-test').trials[0].outcome,'Softer crumb');
 const plain=JSON.parse(JSON.stringify(makeBackup(current)));assert.deepEqual(validateBackup(plain).find(r=>r.id===recipe.id).trials,trials);const encrypted=await encryptBackup(plain,'synthetic-trial-passphrase');await assert.rejects(decryptBackup(encrypted,'wrong-passphrase'));await restoreRecipes(validateBackup(await decryptBackup(encrypted,'synthetic-trial-passphrase')));current=await loadLibrary();assert.deepEqual(current.find(r=>r.id===recipe.id).trials,trials);
 await resetRecipe(recipe);assert.deepEqual((await loadLibrary()).find(r=>r.id===recipe.id).trials,trials);assert.deepEqual((await loadLibrary()).find(r=>r.id===recipe.id).ingredients,recipe.ingredients);
});
test('student handwriting, trial module and face icons are cached; cover keeps the original bear as its accessible link',async()=>{
 const sw=await readFile('public/sw.js','utf8');for(const name of ['trials.js','student-recipe.css','student-hand.woff','bear-face-192-v2.png','apple-touch-bear-v2.png'])assert.ok(sw.includes(name));
 const app=await readFile('public/app.js','utf8');assert.match(app,/class="bear-link" href="#contents" aria-label="Open the table of contents"/);assert.match(app,/src="assets\/bear.svg"/);assert.ok(!app.includes('<h1>Recipes</h1>'));assert.ok(!app.includes('Open the notebook'));
 const manifest=JSON.parse(await readFile('public/manifest.webmanifest'));for(const size of [192,512]){const icon=manifest.icons.find(i=>i.sizes===size+'x'+size);const data=await readFile('public/'+icon.src);assert.equal(data.readUInt32BE(16),size);assert.equal(data.readUInt32BE(20),size);}
 const html=await readFile('public/index.html','utf8');assert.match(html,/apple-touch-bear-v2.png/);const css=await readFile('public/student-recipe.css','utf8');assert.match(css,/StudentHand/);assert.match(css,/#f5df5399/);assert.match(css,/a22f30/);
});
