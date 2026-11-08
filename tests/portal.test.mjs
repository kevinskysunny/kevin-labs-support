import test from 'node:test';
import assert from 'node:assert/strict';
import { handlePortal } from '../edge/worker.mjs';

test('apex portal preserves paths/query/ranges while credentials never reach the origin', async()=>{
 let seen;
 const origin=async request=>{seen=request;return new Response('content',{headers:{'content-type':'text/html','set-cookie':'secret=value'}})};
 const r=await handlePortal(new Request('https://kevinlabs.app/volmix/?lang=ja&utm_source=test',{headers:{cookie:'session=private',authorization:'Bearer private',range:'bytes=0-99'}}),origin);
 assert.equal(seen.url,'https://support.kevinlabs.app/volmix/?lang=ja&utm_source=test');
 assert.equal(seen.headers.get('cookie'),null);assert.equal(seen.headers.get('authorization'),null);assert.equal(seen.headers.get('range'),'bytes=0-99');
 assert.equal(r.status,200);assert.equal(await r.text(),'content');assert.equal(r.headers.get('set-cookie'),null);assert.match(r.headers.get('cache-control'),/no-transform/);
});
test('normalization redirects stay on apex; external product redirects remain untouched',async()=>{
 for(const [location,expected] of [['https://support.kevinlabs.app/volmix/','https://kevinlabs.app/volmix/'],['/guides.html?lang=de','https://kevinlabs.app/guides.html?lang=de'],['https://nextmirror.kevinlabs.app/download','https://nextmirror.kevinlabs.app/download']]){
  const r=await handlePortal(new Request('https://kevinlabs.app/volmix'),async()=>new Response(null,{status:301,headers:{location}}));assert.equal(r.headers.get('location'),expected);
 }
});
test('www canonicalizes to apex; unknown hosts/mutations rejected; upstream failure is explicit',async()=>{
 const www=await handlePortal(new Request('https://www.kevinlabs.app/?lang=ko'));assert.equal(www.status,308);assert.equal(www.headers.get('location'),'https://kevinlabs.app/?lang=ko');
 assert.equal((await handlePortal(new Request('https://other.example/'))).status,404);
 assert.equal((await handlePortal(new Request('https://kevinlabs.app/',{method:'POST'}))).status,405);
 assert.equal((await handlePortal(new Request('https://kevinlabs.app/'),async()=>{throw Error('offline')})).status,502);
});
test('download streams, partial status and validators are preserved, HEAD has no body',async()=>{
 const r=await handlePortal(new Request('https://kevinlabs.app/video.mp4'),async()=>new Response('part',{status:206,headers:{'content-type':'video/mp4','content-range':'bytes 0-3/100',etag:'abc'}}));
 assert.equal(r.status,206);assert.equal(r.headers.get('content-range'),'bytes 0-3/100');assert.equal(r.headers.get('etag'),'abc');assert.equal(await r.text(),'part');
 const h=await handlePortal(new Request('https://kevinlabs.app/',{method:'HEAD'}),async()=>new Response(null,{headers:{'content-type':'text/html'}}));assert.equal(await h.text(),'');
});
