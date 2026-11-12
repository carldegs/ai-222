import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {decks} from '../dist/decks.mjs';
import {renderTutor} from '../dist/tutor.mjs';
import katex from '../dist/vendor/katex/katex.mjs';

const {tutor,lessons} = decks.optimization;

test('every Optimization equation appears alongside the slide discussion', () => {
  const shown = lessons.map(()=>[]);
  for (const lesson of tutor.lessons) {
    const markup = renderTutor(tutor,lesson,{
      slideURL:String,
      notesFor:()=>'',
      practiceFor:()=>'',
      completed:false,
      showFormula(topic,index){
        assert(lessons[topic].formulas[index], 'step references a missing equation');
        shown[topic].push(index);
        return '<div data-test-equation></div>';
      }
    });
    if (lesson.pages.some(page=>page.steps.some(step=>step.formulas?.length))) {
      assert.match(markup, /id="tutor-equations"[\s\S]*data-test-equation[\s\S]*Lesson navigation/);
    }
  }
  for (const [topic,items] of shown.entries()) {
    assert.deepEqual(items.sort((a,b)=>a-b), lessons[topic].formulas.map((_,i)=>i));
  }
  assert.deepEqual(tutor.pages[12].steps[0].formulas,[0], 'Glorot is taught on slide 13');
  assert.deepEqual(tutor.pages[13].steps[0].formulas,[1], 'He is taught on slide 14');
});

test('guided steps cite the local slides and typeset their inline notation', () => {
  for (const {steps} of tutor.pages) {
    for (const step of steps) {
      const links = step.explain.flatMap(p => [...p.matchAll(/\[\[(\d+):/g)].map(m=>Number(m[1])));
      const pages = [step.slide, ...step.sources ?? [], ...links, ...(step.figure ? [step.figure.page] : [])];
      for (const page of pages) {
        assert(existsSync(new URL('../dist/assets/slide-' + String(page).padStart(2, '0') + '.webp', import.meta.url)));
      }
      for (const p of [...step.explain, ...step.check ?? [], step.bridge ?? '']) {
        for (const [,tex] of p.matchAll(/\$([^$\n]+)\$/g)) katex.renderToString(tex, {throwOnError:true});
      }
    }
  }
});
