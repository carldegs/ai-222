import test from 'node:test';
import assert from 'node:assert/strict';
import {decks} from '../dist/decks.mjs';
import katex from '../dist/vendor/katex/katex.mjs';

for (const deck of Object.values(decks)) {
  test(`${deck.title} quick reference covers every walkthrough lesson`, () => {
    const firstSlides = deck.tutor.lessons.map(({pages}) => pages[0].slide);
    assert.deepEqual(Object.keys(deck.quickReference ?? {}).map(Number), firstSlides);
    for (const {summary, recall, slides} of Object.values(deck.quickReference)) {
      assert.ok(summary && recall && slides.length);
      for (const slide of slides) assert.ok(Number.isInteger(slide) && deck.tutor.pages[slide - 1]);
      for (const text of [summary, recall]) {
        assert.equal((text.match(/\$/g) ?? []).length % 2, 0);
        for (const [, tex] of text.matchAll(/\$([^$\n]+)\$/g)) katex.renderToString(tex, {throwOnError: true});
      }
    }
  });
}

test('Optimization links the restart and warmup equations to their own slides', () => {
  const deck = decks.optimization;
  const formulaTitlesAt = slide => deck.tutor.pages[slide - 1].steps.flatMap(step =>
    (step.formulas ?? []).map(i => deck.lessons[step.topic].formulas[i][0]));
  assert.deepEqual(formulaTitlesAt(40), ['Cosine restarts']);
  assert.deepEqual(formulaTitlesAt(42), ['Linear warmup then cosine decay']);
});
