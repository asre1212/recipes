import './vendor-jose.mjs';
import {createHash} from 'node:crypto';
import {cp,mkdir,rm,readdir,readFile,writeFile} from 'node:fs/promises';
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

async function filesAt(directory){const entries=await readdir(directory,{withFileTypes:true});const paths=[];for(const entry of entries){const path=directory+'/'+entry.name;if(entry.isDirectory())paths.push(...await filesAt(path));else paths.push(path);}return paths.sort();}
const digest=createHash('sha256');
for(const path of await filesAt('public')){digest.update(path);digest.update(await readFile(path));}
const revision=digest.digest('hex').slice(0,16);
const sw=await readFile('dist/sw.js','utf8');
await writeFile('dist/sw.js',sw.replace(/const CACHE = '[^']+';/,`const CACHE = 'recipe-notebook-${revision}';`));
console.log(`Offline cache revision: ${revision}`);

const app=await readFile('dist/app.js','utf8');
await writeFile('dist/app.js',app.replace("const APP_BUILD='development';",`const APP_BUILD='${revision}';`));
