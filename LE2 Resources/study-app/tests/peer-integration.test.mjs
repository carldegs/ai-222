import test from 'node:test';
import assert from 'node:assert/strict';
import katex from '../dist/vendor/katex/katex.mjs';
import {decks} from '../dist/decks.mjs';
import {mixedPractice} from '../dist/mixed-practice.mjs';
import {renderExam} from '../dist/practice-exam.mjs';
import {vocExample} from '../dist/decks/voc-ap-lab.mjs';
import {fcnToyScores, poolToyFeature} from '../dist/decks/semantic-labs.mjs';

test('mixed practice renders scoped, slide-backed parts and displays exact solution equations',()=>{
  const items=[...mixedPractice.problems.flatMap(problem=>problem.parts),...mixedPractice.theory];
  for(const item of items){
    assert.ok(item.sources.length>=2);
    for(const [id,page] of item.sources){
      const {optionalFromSlide,slideCount}=decks[id];
      assert.ok(page>=1 && page<=slideCount && page<(optionalFromSlide??Infinity));
    }
    for(const {formula,substitution} of item.steps){
      for(const equation of [formula,substitution]) katex.renderToString(equation,{throwOnError:true,displayMode:true});
    }
  }
  const html=renderExam(mixedPractice,{title:'Mixed practice',sourceLinks:item=>item.sources.map(([id,page])=>`${id}/${page}`).join(' ')});
  assert.match(html,/17 marks/);
  assert.match(html,/regularization\/5 optimization\/17/);
  assert.equal((html.match(/class="exam-solution"/g)??[]).length,items.length);
});

test('a false positive lowers precision without increasing recall in the VOC demo',()=>{
  const {points,checkpoints,ap}=vocExample(3);
  assert.deepEqual(points.map(point=>[point.recall,point.precision]),[[1/2,1],[1/2,1/2],[1,2/3]]);
  assert.deepEqual(checkpoints,[...Array(6).fill(1),...Array(5).fill(2/3)]);
  assert.ok(Math.abs(ap-28/33)<1e-12);
});

test('FCN skip additions recover the selected edge and PSPNet pools actual means',()=>{
  const {scores,aligned16,pool3}=fcnToyScores();
  assert.deepEqual(scores.map(stage=>stage.length),[4,16,64]);
  assert.equal(aligned16[28],-2);
  assert.equal(pool3[28],3);
  assert.equal(scores[2][28],1);
  assert.equal(scores[2][30],-2);
  assert.deepEqual(poolToyFeature(1),[10]);
  assert.deepEqual(poolToyFeature(2),[4,10,10,16]);
});

test('the mock exam gives each deck ten marks within exam scope', async ()=>{
  const {mockExam}=await import('../dist/mock-exam.mjs');
  const items=[...mockExam.problems.flatMap(problem=>problem.parts),...mockExam.theory];
  const totals=Object.fromEntries(Object.keys(decks).map(id=>[id,0]));
  for(const item of items){
    const [[id,page]]=item.sources;
    const {optionalFromSlide,slideCount}=decks[id];
    assert.ok(page>=1 && page<=slideCount && page<(optionalFromSlide??Infinity));
    totals[id]+=item.marks;
    for(const {formula,substitution} of item.steps){
      katex.renderToString(formula,{throwOnError:true,displayMode:true});
      katex.renderToString(substitution,{throwOnError:true,displayMode:true});
    }
  }
  assert.deepEqual(Object.values(totals),[10,10,10,10]);
  const html=renderExam(mockExam,{suggestedMinutes:45,sourceLinks:()=>''});
  assert.match(html,/40 marks · No calculator · 45 min suggested/);
  assert.equal((html.match(/<details class="exam-solution">/g)??[]).length,16);
});
