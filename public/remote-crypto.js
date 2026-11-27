import{CompactEncrypt,compactDecrypt,generateKeyPair,exportJWK,importJWK,calculateJwkThumbprint}from'./vendor/jose.js';
const encode=new TextEncoder(),decode=new TextDecoder('utf-8',{fatal:true});
export const REMOTE_MAX_BYTES=1024*1024;
export const REMOTE_TYPE='recipe-notebook-backup+jwe';
export async function sha256(value){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',typeof value==='string'?encode.encode(value):value))].map(b=>b.toString(16).padStart(2,'0')).join('');}
const publicPart=jwk=>({kty:'RSA',n:jwk.n,e:jwk.e});
export async function createRecovery(){const {privateKey}=await generateKeyPair('RSA-OAEP-256',{modulusLength:3072,extractable:true});return {format:'recipe-notebook-recovery',version:1,privateKey:await exportJWK(privateKey)};}
export async function verifyRecovery(value){
 if(value?.format!=='recipe-notebook-recovery'||value.version!==1||value.privateKey?.kty!=='RSA'||!value.privateKey.d)throw Error('Choose your Recipe recovery file.');
 const publicJwk=publicPart(value.privateKey),publicKey=await importJWK(publicJwk,'RSA-OAEP-256'),privateKey=await importJWK(value.privateKey,'RSA-OAEP-256');
 if(privateKey.algorithm.modulusLength!==3072)throw Error('Unsupported recovery key size.');
 const probe=crypto.getRandomValues(new Uint8Array(32)),wrapped=await crypto.subtle.encrypt({name:'RSA-OAEP'},publicKey,probe),opened=new Uint8Array(await crypto.subtle.decrypt({name:'RSA-OAEP'},privateKey,wrapped));
 if(opened.some((b,i)=>b!==probe[i]))throw Error('Recovery key does not match.');
 return {publicJwk,kid:await calculateJwkThumbprint(publicJwk),privateKey};
}
export async function sealSnapshot(backup,publicJwk){
 if(publicJwk?.d||publicJwk?.kty!=='RSA')throw Error('Use a public backup key only.');
 const bytes=encode.encode(JSON.stringify(backup));if(bytes.length>REMOTE_MAX_BYTES)throw Error('Snapshot exceeds the 1 MiB automatic-backup limit. Use a manual export.');
 const key=await importJWK(publicPart(publicJwk),'RSA-OAEP-256');if(key.algorithm.modulusLength!==3072)throw Error('Unsupported public key size.');
 return new CompactEncrypt(bytes).setProtectedHeader({alg:'RSA-OAEP-256',enc:'A256GCM',kid:await calculateJwkThumbprint(publicPart(publicJwk)),typ:REMOTE_TYPE,v:1}).encrypt(key);
}
export async function openSnapshot(jwe,recovery){
 if(typeof jwe!=='string'||jwe.length>REMOTE_MAX_BYTES*1.5+4096)throw Error('Snapshot is too large.');
 try{const {kid,privateKey}=await verifyRecovery(recovery),{plaintext,protectedHeader}=await compactDecrypt(jwe.trim(),privateKey,{keyManagementAlgorithms:['RSA-OAEP-256'],contentEncryptionAlgorithms:['A256GCM']});if(protectedHeader.kid!==kid||protectedHeader.typ!==REMOTE_TYPE||protectedHeader.v!==1||plaintext.length>REMOTE_MAX_BYTES)throw Error();return JSON.parse(decode.decode(plaintext));}catch{throw Error('Recovery key is wrong, or this encrypted snapshot was changed or is unsupported. Nothing was restored.');}
}
