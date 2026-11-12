import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import katex from '../dist/vendor/katex/katex.mjs';
import {getDeck} from '../dist/decks.mjs';
import {renderTutor} from '../dist/tutor.mjs';

test('Detection opens as its own deck and covers the complete source', () => {
  const deck = getDeck('/detection.html');
  assert.equal(deck.id, 'detection');
  assert.notEqual(deck.storageKey, getDeck('/regularization.html').storageKey);
  assert.equal(deck.slideCount, 132);
  assert.ok(existsSync(new URL('../dist/detection.html', import.meta.url)));
  assert.ok(existsSync(new URL('../dist/' + deck.pdf, import.meta.url)));
  for (const {slide} of deck.tutor.pages) {
    const asset = deck.assetPrefix + String(slide).padStart(2, '0') + '.webp';
    assert.ok(existsSync(new URL('../dist/' + asset, import.meta.url)), asset);
  }
});

test('Detection groups the source while retaining equations and all practice modes', () => {
  const deck = getDeck('/detection.html');
  assert.equal(deck.id, 'detection');
  const pages = deck.tutor.pages;
  const topics = deck.tutor.lessons;
  assert.equal(topics.length, deck.lessons.length);
  assert.ok(topics.every(topic => topic.pages.length > 1));
  for (const lesson of topics) {
    const html = renderTutor(deck.tutor, lesson, {
      slideURL: () => 'slide.webp', showFormula: () => '<div>Equation</div>',
      notesFor: () => '', practiceFor: page => page.problems.map(p => p.title).join(''),
    });
    assert.ok((html.match(/class="tutor-discussion"/g) ?? []).length < lesson.pages.length);
    for (const page of lesson.pages) {
      assert.match(html, new RegExp('data-slide="' + page.slide + '"'));
      for (const problem of page.problems) assert.ok(html.includes(problem.title));
    }
    for (const [title, tex] of deck.lessons[lesson.index].formulas) {
      assert.ok(deck.equationContext[title]?.symbols.length, title);
      katex.renderToString(tex, {throwOnError: true});
    }
  }
  for (const kind of ['flashcard', 'theory', 'computation']) {
    assert.ok(deck.questions.some(q => q.type === kind));
  }
  for (const lab of ['overlap', 'centerness']) assert.ok(deck.tutor.labMarkup(lab));
});
