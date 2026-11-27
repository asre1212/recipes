import {cp,mkdir,rm} from 'node:fs/promises';
import {recipes,categories} from '../public/recipes.js';
const ids=new Set();
for(const recipe of recipes){
 if(ids.has(recipe.id)||!/^[a-z0-9-]+$/.test(recipe.id))throw Error('Invalid or duplicate recipe ID');
 ids.add(recipe.id);
 if(!categories.some(c=>c.name===recipe.category))throw Error('Unknown category');
 if(!recipe.ingredients?.length||!Array.isArray(recipe.steps))throw Error('Incomplete supplied recipe');
}
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await cp('public','dist',{recursive:true});
console.log(`Built ${recipes.length} recipe; contents generated from recipe data.`);
