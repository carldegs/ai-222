import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import katex from '../dist/vendor/katex/katex.mjs';
import {getDeck} from '../dist/decks.mjs';
import {renderTutor} from '../dist/tutor.mjs';

test('Segmentation opens independently with every original slide and grouped discussion', () => {
  const deck = getDeck('/segmentation.html');
  assert.equal(deck.id, 'segmentation');
  assert.equal(deck.slideCount, 113);
  assert.notEqual(deck.storageKey, getDeck('/detection.html').storageKey);
  for (const file of [deck.href, deck.pdf]) assert.ok(existsSync(new URL('../dist/' + file, import.meta.url)));
  for (const {slide} of deck.tutor.pages) {
    const asset = deck.assetPrefix + String(slide).padStart(2, '0') + '.webp';
    assert.ok(existsSync(new URL('../dist/' + asset, import.meta.url)), asset);
  }
  for (const lesson of deck.tutor.lessons) {
    const html = renderTutor(deck.tutor, lesson, {
      slideURL: () => 'slide.webp', showFormula: () => '<div>Equation</div>',
      notesFor: () => '', practiceFor: page => page.problems.map(problem => problem.title).join(''),
    });
    assert.ok((html.match(/class="tutor-discussion"/g) ?? []).length < lesson.pages.length);
    for (const page of lesson.pages) {
      assert.match(html, new RegExp('data-slide="' + page.slide + '"'));
      for (const problem of page.problems) assert.ok(html.includes(problem.title));
    }
  }
});

test('Segmentation equation cards and worked problems use valid notation', () => {
  const deck = getDeck('/segmentation.html');
  assert.equal(deck.id, 'segmentation');
  for (const lesson of deck.lessons) for (const [title, tex] of lesson.formulas) {
    assert.ok(deck.equationContext[title]?.symbols.length, title);
    katex.renderToString(tex, {throwOnError: true});
  }
  for (const example of deck.examples) for (const {math} of [...example.solution, ...example.practice.solution]) {
    if (math) katex.renderToString(math, {throwOnError: true, displayMode: true});
  }
  for (const type of ['flashcard', 'theory', 'computation']) assert.ok(deck.questions.some(q => q.type === type));
  assert.equal(new Set(deck.questions.map(q => q.id)).size, deck.questions.length);
});
