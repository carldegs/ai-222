import test from 'node:test';
import assert from 'node:assert/strict';
import katex from '../dist/vendor/katex/katex.mjs';
let examples=[];
try{({examples}=await import('../dist/examples.mjs'))}catch{}
test('worked problems cover every lesson with a separate practice variation',()=>{
 for(let topic=0;topic<10;topic++)assert.ok(examples.some(e=>e.topic===topic&&e.solution.length>=3&&e.practice?.solution.length>=2),`Missing worked problem for lesson ${topic+1}`);
});
test('every worked solution equation typesets and cites an original slide',()=>{
 assert.ok(examples.length>=10);
 for(const e of examples){assert.ok(e.slide>=1&&e.slide<=44);for(const step of [...e.solution,...e.practice.solution])if(step.math)assert.ok(katex.renderToString(step.math,{throwOnError:true}).includes('katex'));}
});
