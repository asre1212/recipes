const te=new TextEncoder();
const MAX=1450000,TYPE='recipe-notebook-backup+jwe';
export const random=()=>crypto.randomUUID();
export const b64=bytes=>btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
export const secret=()=>b64(crypto.getRandomValues(new Uint8Array(32)));
export const unb64=s=>Uint8Array.from(atob(s.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0));
export async function hash(s){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',te.encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');}
export function fail(status,message){throw Object.assign(Error(message),{status,safe:true});}
export function json(value,status=200){return new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});}

export function envelopeHeader(raw,kid){
 if(typeof raw!=='string'||raw.length>MAX||!/^[A-Za-z0-9_.-]+$/.test(raw))fail(400,'Invalid or oversized encrypted snapshot.');
 const parts=raw.split('.');if(parts.length!==5)fail(400,'Expected a compact JWE snapshot.');let header;
 try{header=JSON.parse(new TextDecoder().decode(unb64(parts[0])));}catch{fail(400,'Invalid encrypted header.');}
 if(header.alg!=='RSA-OAEP-256'||header.enc!=='A256GCM'||header.typ!==TYPE||header.v!==1||!/^[-\w]{43}$/.test(header.kid)||kid&&header.kid!==kid||Object.keys(header).some(k=>!['alg','enc','typ','v','kid'].includes(k))||unb64(parts[1]).length!==384||unb64(parts[2]).length!==12||unb64(parts[4]).length!==16||unb64(parts[3]).length>1048592)fail(400,'Unsupported encrypted snapshot.');return header;
}
export async function bounded(request){const size=Number(request.headers.get('Content-Length'));if(size>MAX)fail(413,'Automatic snapshots are limited to 1 MiB of recipe data.');const reader=request.body?.getReader();if(!reader)return '';let length=0,parts=[];for(;;){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>MAX){await reader.cancel();fail(413,'Automatic snapshot is too large.');}parts.push(value);}const bytes=new Uint8Array(length);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}return new TextDecoder('utf-8',{fatal:true}).decode(bytes);}
