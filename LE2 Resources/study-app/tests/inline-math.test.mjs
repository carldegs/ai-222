import test from 'node:test';
import assert from 'node:assert/strict';
let render=()=>'';
try{({renderInlineMath:render}=await import('../dist/inline-math.mjs'))}catch{}
test('marks explicit inline math without turning it into a display block',()=>{
 const html=render('For $L(\\theta)=\\theta^2/2$, take $\\epsilon=\\frac12$.');
 assert.equal((html.match(/data-inline-math=/g)||[]).length,2);
 assert.match(html,/^For <span/);assert.ok(html.endsWith('</span>.'));
 assert.doesNotMatch(html,/<div/);
});
test('escapes prose and math attributes, keeping unmatched delimiters literal',()=>{
 assert.equal(render('<img> & $5'),'&lt;img&gt; &amp; $5');
 const html=render('$x<y$');assert.match(html,/data-inline-math="x&lt;y"/);
});

import katex from '../dist/vendor/katex/katex.mjs';
import {examples} from '../dist/examples.mjs';
import {equationContext,notationBasics} from '../dist/equation-context.mjs';
test('authored inline formulas in problems and explanations all typeset',()=>{
 let count=0;
 function check(value){
  if(typeof value==='string'){
   assert.equal((value.match(/\$/g)||[]).length%2,0,`Unbalanced inline delimiters: ${value}`);
   for(const match of value.matchAll(/\$([^$\n]+)\$/g)){katex.renderToString(match[1],{displayMode:false,throwOnError:true});count++;}
  }else if(value&&typeof value==='object')for(const v of Object.values(value))check(v);
 }
 check(examples);check(equationContext);check(notationBasics);
 assert.ok(count>100);
 assert.ok(examples[3].problem.includes('$L(\\theta)=\\frac{\\theta^2}{2}$'));
});
