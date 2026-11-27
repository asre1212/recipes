const ITERATIONS=310000;
const encoder=new TextEncoder();const decoder=new TextDecoder();
const b64=bytes=>btoa(String.fromCharCode(...new Uint8Array(bytes)));
const unb64=value=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
async function keyFor(passphrase,salt,iterations){
 const material=await crypto.subtle.importKey('raw',encoder.encode(passphrase),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
export async function encryptBackup(backup,passphrase){
 if(passphrase.length<12)throw Error('Use a passphrase of at least 12 characters.');
 const salt=crypto.getRandomValues(new Uint8Array(16));const iv=crypto.getRandomValues(new Uint8Array(12));
 const key=await keyFor(passphrase,salt,ITERATIONS);
 const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:encoder.encode('recipe-notebook-encrypted:1')},key,encoder.encode(JSON.stringify(backup)));
 // Chunk encoding avoids call-stack limits for a larger notebook.
 let binary='';const bytes=new Uint8Array(ciphertext);for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
 return {format:'recipe-notebook-encrypted',version:1,kdf:'PBKDF2-SHA256',iterations:ITERATIONS,cipher:'AES-256-GCM',salt:b64(salt),iv:b64(iv),ciphertext:btoa(binary)};
}
export async function decryptBackup(envelope,passphrase){
 if(!envelope||envelope.format!=='recipe-notebook-encrypted'||envelope.version!==1||envelope.kdf!=='PBKDF2-SHA256'||envelope.cipher!=='AES-256-GCM'||!Number.isInteger(envelope.iterations)||envelope.iterations<100000||envelope.iterations>2000000||typeof envelope.ciphertext!=='string'||envelope.ciphertext.length>28000000)throw Error('Unsupported encrypted backup.');
 try{
 const salt=unb64(envelope.salt),iv=unb64(envelope.iv);if(salt.length!==16||iv.length!==12)throw Error();
 const key=await keyFor(passphrase,salt,envelope.iterations);
 const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData:encoder.encode('recipe-notebook-encrypted:1')},key,unb64(envelope.ciphertext));
 return JSON.parse(decoder.decode(plain));
 }catch{throw Error('Could not unlock this backup. Check the passphrase; the file may also be damaged. No recipes were changed.');}
}
