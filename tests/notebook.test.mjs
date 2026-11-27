import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {recipes,categories} from '../public/recipes.js';
test('supplied recipes and exact starter measurements',()=>{
 assert.equal(recipes.length,26);assert.equal(recipes[0].ingredients.length,11);
 assert.deepEqual(recipes[0].ingredients[1],['1½ tbsp','white miso paste']);
 assert.deepEqual(recipes[0].ingredients[6],['1¼ cups','all-purpose flour']);
 assert.equal(recipes[0].steps.length,6);
 assert.match(recipes[0].unspecified,/oven temperature and bake time aren’t specified/);
 assert.match(recipes[0].unspecified,/“tsp sugar” but gives no number/);
 assert.deepEqual(categories.map(c=>c.name),['Desserts','Sides','Main']);
});
test('all offline assets exist and manifest remains subpath safe',async()=>{
 const manifest=JSON.parse(await readFile('public/manifest.webmanifest','utf8'));
 assert.equal(manifest.scope,'./');assert.equal(manifest.start_url,'./#cover');
 const sw=await readFile('public/sw.js','utf8');
 for(const file of [...sw.matchAll(/'\.\/([^']+)'/g)].map(m=>m[1])) await access('public/'+file);
 for(const recipe of recipes)if(recipe.illustration)await access('public/'+recipe.illustration);
});

test('all distinct recipes and components have unique routes and sources',()=>{
 assert.equal(new Set(recipes.map(r=>r.id)).size,recipes.length);
 assert.equal(new Set(recipes.map(r=>r.source)).size,13);
 assert.equal(recipes.filter(r=>r.title==='Brown Butter Miso Chocolate Chip Cookies').length,1);
 assert.equal(recipes.find(r=>r.id==='chocolate-birthday-cake').components[0].title,'Frosting');
 assert.equal(recipes.find(r=>r.id==='chocolate-pecan-pie').components.length,2);
 assert.ok(recipes.every(r=>r.source&&r.unspecified));
});
