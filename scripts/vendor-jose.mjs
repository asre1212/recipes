import{build}from'esbuild';import{mkdir,copyFile}from'node:fs/promises';
await mkdir('public/vendor',{recursive:true});
await build({stdin:{contents:"export {CompactEncrypt,compactDecrypt,generateKeyPair,exportJWK,importJWK,calculateJwkThumbprint,SignJWT,jwtVerify} from 'jose';",resolveDir:process.cwd()},bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,outfile:'public/vendor/jose.js',banner:{js:'/*! jose 6.2.18 · MIT · see jose-LICENSE.txt */'}});
await copyFile('node_modules/jose/LICENSE.md','public/vendor/jose-LICENSE.txt');
