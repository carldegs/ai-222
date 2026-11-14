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

test('Optimization compares each optimizer and gives every reference equation visible context', () => {
  const deck = decks.optimization;
  assert.deepEqual(deck.referenceOverview?.rows.map(method => method.name), [
    'SGD', 'Momentum', 'Nesterov', 'AdaGrad', 'RMSProp', 'Adam'
  ]);
  for (const {when, step, slide, equations} of deck.referenceOverview.rows) {
    assert.ok(when && step && deck.tutor.pages[slide - 1]);
    assert.ok(equations.length);
    for (const tex of equations) katex.renderToString(tex, {throwOnError: true});
  }
  const referenceTitles = new Set(deck.tutor.pages.flatMap(page => page.steps.flatMap(step =>
    (step.formulas ?? []).map(i => deck.lessons[step.topic].formulas[i][0]))));
  assert.deepEqual(new Set(Object.keys(deck.referenceEquationContext)), referenceTitles);
  for (const text of Object.values(deck.referenceEquationContext)) {
    assert.ok(text.trim());
    for (const [, tex] of text.matchAll(/\$([^$\n]+)\$/g)) katex.renderToString(tex, {throwOnError: true});
  }
});

for (const deck of Object.values(decks).slice(1)) {
  test(`${deck.title} overview links to slides and explains every reference equation`, () => {
    const overview = deck.referenceOverview;
    assert.ok(overview?.title && overview.intro && overview.rows.length >= 6);
    for (const {name, when, step, slide, equations, mechanism} of overview.rows) {
      assert.ok(name && when && step && deck.tutor.pages[slide - 1]);
      assert.ok(equations?.length || mechanism);
      for (const tex of equations ?? []) katex.renderToString(tex, {throwOnError: true});
    }
    if (deck.optionalFromSlide) {
      assert.ok(overview.rows.some(row => row.slide < deck.optionalFromSlide));
      assert.ok(overview.rows.some(row => row.slide >= deck.optionalFromSlide));
    }
    const titles = new Set(deck.tutor.pages.flatMap(page => page.steps.flatMap(step =>
      (step.formulas ?? []).map(i => deck.lessons[step.topic].formulas[i][0]))));
    assert.deepEqual(new Set(Object.keys(deck.referenceEquationContext)), titles);
    for (const context of Object.values(deck.referenceEquationContext)) assert.ok(context.trim());
  });
}
