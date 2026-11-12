import test from 'node:test';
import assert from 'node:assert/strict';
import {clampSlide,readProgress} from '../dist/state.mjs';
test('each deck has its own slide boundary',()=>{assert.equal(clampSlide(100,46),46);assert.equal(clampSlide(45,44),44);assert.equal(clampSlide(46,46),46)});
test('regularization restores all 13 lesson indices while optimizer keeps its bounds',()=>{const raw=JSON.stringify({completed:[0,9,10,12,13],ratings:{a:'got'}});assert.deepEqual(readProgress(raw,13).completed,[0,9,10,12]);assert.deepEqual(readProgress(raw,10).completed,[0,9])});

import {decks,getDeck} from '../dist/decks.mjs';
import katex from '../dist/vendor/katex/katex.mjs';
import {existsSync} from 'node:fs';
test('deck selection isolates content, assets and saved progress',()=>{
 assert.equal(getDeck('/regularization.html').id,'regularization');
 assert.equal(getDeck('/').id,'optimization');
 assert.notEqual(decks.optimization.storageKey,decks.regularization.storageKey);
 assert.notEqual(decks.optimization.assetPrefix,decks.regularization.assetPrefix);
});
test('regularization has complete lesson practice and source assets',()=>{
 const d=decks.regularization;
 assert.equal(d.lessons.length,13);assert.equal(d.questions.length,39);
 assert.equal(new Set(d.questions.map(q=>q.id)).size,d.questions.length);
 for(let i=0;i<d.lessons.length;i++){
  const l=d.lessons[i];assert.ok(d.examples.some(e=>e.topic===i&&e.solution.length>=3&&e.practice.solution.length>=2));
  for(const type of ['flashcard','computation','theory'])assert.ok(d.questions.some(q=>q.topic===i&&q.type===type));
  for(const n of [...l.slides,l.figure])assert.ok(n>=1&&n<=d.slideCount);
  for(const [title] of l.formulas)assert.ok(d.equationContext[title],`Missing explanation for ${title}`);
 }
 for(let n=1;n<=d.slideCount;n++)assert.ok(existsSync(new URL(`../dist/${d.assetPrefix}${String(n).padStart(2,'0')}.webp`,import.meta.url)));
 assert.ok(existsSync(new URL(`../dist/${d.pdf}`,import.meta.url)));
 for(const c of d.challengeConnections){assert.ok(c.lesson<d.lessons.length);assert.ok(c.slide>=1&&c.slide<=d.slideCount)}
});
test('regularization display and inline math render without broken escapes',()=>{
 const d=decks.regularization;
 for(const l of d.lessons)for(const [,math] of l.formulas)katex.renderToString(math,{throwOnError:true});
 function check(v){if(typeof v==='string'){
  assert.doesNotMatch(v,/[\u0000-\u0008\u000b-\u001f]/);assert.ok(!v.includes('\t'),'Unescaped TeX tab');
  assert.equal((v.match(/\$/g)||[]).length%2,0,`Unmatched inline math: ${v}`);
  for(const m of v.matchAll(/\$([^$\n]+)\$/g))katex.renderToString(m[1],{throwOnError:true,displayMode:false});
 }else if(v&&typeof v==='object')for(const x of Object.values(v))check(x)}
 check(d);
 for(const e of d.examples)for(const s of [...e.solution,...e.practice.solution])if(s.math)katex.renderToString(s.math,{throwOnError:true});
});
