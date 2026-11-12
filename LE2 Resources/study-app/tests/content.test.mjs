import test from 'node:test';
import assert from 'node:assert/strict';
import katex from '../dist/vendor/katex/katex.mjs';
import {existsSync} from 'node:fs';
import {lessons,questions,resources} from '../dist/content.mjs';

test('all lesson equations typeset without errors',()=>{for(const l of lessons)for(const f of l.formulas)assert.ok(katex.renderToString(f[1],{throwOnError:true}).includes('katex'))});
test('all source pages and lesson figures exist',()=>{assert.equal(lessons.length,10);for(let n=1;n<=44;n++)assert.ok(existsSync(new URL(`../dist/assets/slide-${String(n).padStart(2,'0')}.webp`,import.meta.url)));for(const l of lessons)for(const n of [...l.slides,l.figure])assert.ok(n>=1&&n<=44)});
test('practice has unique IDs and all three formats for valid topics',()=>{assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);for(let i=0;i<10;i++)assert.ok(questions.some(q=>q.topic===i));for(const type of ['flashcard','theory','computation'])assert.ok(questions.some(q=>q.type===type));for(const q of questions)assert.ok(q.answer&&q.check)});
test('supplementary resources use secure source URLs',()=>{for(const r of resources)assert.equal(new URL(r.url).protocol,'https:')});
