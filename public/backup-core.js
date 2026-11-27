// Reusable serialized, verified two-file rotation. Caller supplies a writable directory and tracks owned filenames.
let queue=Promise.resolve();
export function serializeBackup(work){const next=queue.then(work);queue=next.catch(()=>{});return next;}
export async function rotateFolder(folder,backup,owned=[],remember=async()=>{}){
 const name='recipe-notebook-auto-'+crypto.randomUUID()+'.json',text=JSON.stringify(backup,null,2);
 const file=await folder.getFileHandle(name,{create:true});const stream=await file.createWritable();await stream.write(text);await stream.close();
 if(await (await file.getFile()).text()!==text)throw Error('Backup verification failed. Previous files were kept.');
 const all=[name,...owned],keep=all.slice(0,2);await remember(all);for(const old of all.slice(2)){if(/^recipe-notebook-auto-[a-f0-9-]+\.json$/.test(old)){try{await folder.removeEntry(old);}catch(error){if(error.name!=='NotFoundError')throw error;}}}
 return keep;
}
