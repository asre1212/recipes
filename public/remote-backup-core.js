// Adapter-based, memory-only scheduling. No payload/outbox is ever persisted here.
export function remoteScheduler({readConfig,readSnapshot,seal,upload,digest,writeStatus,online=()=>true,visible=()=>true,setTimer=setTimeout,clearTimer=clearTimeout}){
 let timer,running=false,dirty=false,forceNext=false,stopped=false,failures=0;
 const schedule=(delay=5000,force=false)=>{if(stopped)return;dirty=true;failures=0;forceNext||=force;clearTimer(timer);timer=setTimer(run,delay);};
 async function run(){
  if(stopped||running)return;
  const config=await readConfig();if(!config.enabled||!online()||!visible())return;
  running=true;dirty=false;const force=forceNext;forceNext=false;
  try{const snapshot=await readSnapshot(),fingerprint=await digest(JSON.stringify({...snapshot,createdAt:undefined}));if(!force&&config.lastSuccess?.fingerprint===fingerprint)return;
   const encrypted=await seal(snapshot,config.publicJwk),receipt=await upload(encrypted,config);
   if(!receipt.verified)throw Error('The server did not verify the upload. Previous copies were kept.');
   failures=0;await writeStatus({lastSuccess:{at:receipt.at,checksum:receipt.checksum,fingerprint},error:'',notice:receipt.pruned?'':'New copy verified; previous copies were retained because cleanup needs a retry.'});
  }catch(error){failures++;await writeStatus({error:error.message||'Backup failed. Keep editing; reconnect or retry while online.'});}
  finally{running=false;if(dirty&&!stopped)schedule();else if(failures>0&&failures<=3&&!stopped)timer=setTimer(run,60000*2**(failures-1));}
 }
 return {schedule,run,stop(){stopped=true;clearTimer(timer);},get running(){return running;}};
}
