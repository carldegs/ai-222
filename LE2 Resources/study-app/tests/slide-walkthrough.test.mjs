import test from 'node:test';
import assert from 'node:assert/strict';
import {decks} from '../dist/decks.mjs';

for (const deck of Object.values(decks)) {
  test(deck.title + ' teaches every slide in the original order', () => {
    const pages = deck.tutor.pages;
    assert.ok(pages, 'the guide has a slide sequence');
    assert.deepEqual(pages.map(page=>page.slide), Array.from({length:deck.slideCount},(_,i)=>i+1));
    for (const page of pages) {
      assert.ok(page.steps.length, 'slide ' + page.slide + ' needs an explanation');
      assert.ok(page.steps.every(step=>step.slide===page.slide && step.explain.length));
    }
    assert.deepEqual(new Set(pages.flatMap(page=>page.problems)), new Set(deck.examples));
    const lessons = deck.tutor.lessons;
    assert.ok(lessons?.some(group=>group.pages.length > 1), 'Related slides should share a lesson');
    assert.deepEqual(lessons.flatMap(group=>group.pages), pages);
    assert.equal(lessons[0].pages[0].slide, 1);
    assert.ok(lessons[0].pages.length > 1, 'The cover belongs with the opening lesson');
  });
}
