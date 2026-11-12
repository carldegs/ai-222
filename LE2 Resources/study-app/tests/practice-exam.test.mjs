import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {decks} from '../dist/decks.mjs';
import katex from '../dist/vendor/katex/katex.mjs';

const examModule = new URL('../dist/practice-exam.mjs', import.meta.url);

for (const deck of Object.values(decks)) {
  test(`${deck.title} exam has scored, slide-backed solutions for every question`, async () => {
    const exam = deck.exam;
    assert.ok(exam, 'The deck needs a practice exam');
    assert.ok(exam.problems.length >= 2);
    assert.ok(exam.theory.length >= 2);
    for (const problem of exam.problems) {
      assert.ok(problem.title && problem.setup);
      assert.ok(problem.parts.length >= 2);
    }
    const items = [...exam.problems.flatMap(problem => problem.parts), ...exam.theory];
    for (const {prompt, answer, marks, slide} of items) {
      assert.ok(prompt && answer);
      assert.ok(Number.isInteger(marks) && marks > 0);
      assert.ok(Number.isInteger(slide) && slide >= 1 && slide <= deck.slideCount);
      for (const content of [prompt, answer]) {
        assert.equal((content.match(/\$/g) ?? []).length % 2, 0);
        for (const [, tex] of content.matchAll(/\$([^$\n]+)\$/g)) {
          katex.renderToString(tex, {throwOnError: true});
        }
      }
    }
    assert.ok(existsSync(examModule), 'The exam needs a renderer');
    const {renderExam} = await import(examModule);
    const html = renderExam(exam);
    const total = items.reduce((sum, item) => sum + item.marks, 0);
    assert.ok(html.includes(`${total} marks`));
    const questionRows = [...html.matchAll(/<li>(.*?)<\/li>/gs)].map(match => match[1]);
    assert.equal(questionRows.length, items.length);
    assert.ok(questionRows.every(row => /<details class="exam-solution">.*data-slide="\d+".*<\/details>/s.test(row)),
      'Each question has its own initially closed solution and slide link');
    assert.ok(items.some(item => item.steps?.length), 'The exam needs worked calculations');
    for (const [index, {steps, answer}] of items.entries()) {
      assert.doesNotMatch(answer, /\$/, 'Solution equations belong in display blocks');
      const rendered = questionRows[index].split('<details class="exam-solution">')[1];
      const blocks = [...rendered.matchAll(/data-math="([^"]+)"/g)].map(match => match[1]);
      const equations = steps.flatMap(({formula, substitution}) => [formula, substitution]);
      assert.deepEqual(blocks, equations.map(tex => tex.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')));
      for (const tex of equations) katex.renderToString(tex, {throwOnError: true, displayMode: true});
    }
  });
}
