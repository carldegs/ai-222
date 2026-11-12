import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {getDeck} from '../dist/decks.mjs';
import katex from '../dist/vendor/katex/katex.mjs';

test('Regularization has a guided lesson for every topic and shows every equation in a teaching step', () => {
  const deck = getDeck('/regularization.html');
  assert.ok(deck.tutor, 'Regularization has a walkthrough');
  assert.equal(deck.tutor.topics.length, deck.lessons.length);
  for (const [topic, lesson] of deck.tutor.topics.entries()) {
    assert.ok(lesson.steps.length >= 2);
    const shown = lesson.steps.flatMap(step => step.formulas ?? []).sort((a,b)=>a-b);
    assert.deepEqual(shown, deck.lessons[topic].formulas.map((_,i)=>i));
  }
  assert.deepEqual(deck.tutor.topics[1].steps[0].formulas, [0], 'L2 is visible on the penalties landing step');
});

test('Regularization steps cite their own deck and typeset their inline notation', () => {
  const deck = getDeck('/regularization.html');
  const pages = new Set();
  for (const {steps} of deck.tutor.pages) {
    for (const step of steps) {
      const links = step.explain.flatMap(p => [...p.matchAll(/\[\[(\d+):/g)].map(m=>Number(m[1])));
      for (const page of [step.slide, ...(step.sources ?? []), ...links, ...(step.figure ? [step.figure.page] : [])]) {
        assert(page >= 1 && page <= deck.slideCount);
        assert(existsSync(new URL('../dist/' + deck.assetPrefix + String(page).padStart(2,'0') + '.webp', import.meta.url)));
        pages.add(page);
      }
      for (const p of [...step.explain, ...(step.check ?? []), step.bridge ?? '']) {
        for (const [,tex] of p.matchAll(/\$([^$\n]+)\$/g)) katex.renderToString(tex, {throwOnError:true});
      }
    }
  }
  for (let page=2; page<=46; page++) assert(pages.has(page), 'Missing source slide ' + page);
});

test('each Regularization lesson gives the reader context before its discussion', () => {
  const {tutor} = getDeck('/regularization.html');
  assert.ok(tutor.lessons, 'Regularization combines related slides');
  for (const lesson of tutor.lessons) {
    assert.ok(lesson.context?.trim(), 'Missing context for ' + lesson.title);
  }
  const explanation = tutor.pages[4].steps[0].explain.join(' ');
  assert.match(explanation, /L1[^.]*absolute/i);
  assert.match(explanation, /L2[^.]*squar/i);
});
