import{validateBackup}from'./storage.js';
const sha=async value=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const canonical=backup=>JSON.stringify({recipes:validateBackup(backup).sort((a,b)=>a.id.localeCompare(b.id)),sections:backup.sections||[],recipeOrder:backup.recipeOrder||'alphabetical',manualRecipeIds:backup.manualRecipeIds||null});
export async function makeHandoff(backup){const recipes=validateBackup(backup);return {...backup,handoff:{version:1,id:crypto.randomUUID(),ids:recipes.map(r=>r.id),digest:await sha(canonical(backup))}};}
export async function checkHandoff(backup,receipt){
 if(receipt?.version!==1||!Array.isArray(receipt.ids)||receipt.ids.length>2000||new Set(receipt.ids).size!==receipt.ids.length||!receipt.ids.every(id=>typeof id==='string'&&/^[a-z0-9-]{1,150}$/.test(id))||!/^[a-f0-9]{64}$/.test(receipt.digest||''))throw Error('Invalid handoff receipt.');
 const selected=backup.recipes.filter(r=>receipt.ids.includes(r.id)),matches=backup.recipes.length===receipt.ids.length&&selected.length===receipt.ids.length&&await sha(canonical({...backup,recipes:selected}))===receipt.digest;
 return {verified:matches,recipes:selected.length,trials:selected.reduce((n,r)=>n+(r.trials||[]).length,0),sections:backup.sections?.length||0};
}
