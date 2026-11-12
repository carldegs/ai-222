import test from 'node:test';
import assert from 'node:assert/strict';
import {sampleRegion} from '../dist/decks/roi-align.mjs';
import {getDeck} from '../dist/decks.mjs';

test('RoIAlign blends four samples before rounded pooling includes the thin feature', () => {
  const region = sampleRegion(1.125, 1.5);
  assert.deepEqual(region.neighbors.map(({x, y, value, weight}) => [x, y, value, weight]), [
    [1, 1, 0, 7/16],
    [2, 1, 8, 1/16],
    [1, 2, 0, 7/16],
    [2, 2, 4, 1/16]
  ]);
  assert.deepEqual(region.roundedBox, {left:1, right:1, top:1, bottom:2});
  assert.equal(region.pooled, 0);
  assert.equal(region.aligned, 3/4);
});

test('A small horizontal change produces a jump only in the rounded result', () => {
  const region = sampleRegion(1.25, 1.5);
  assert.equal(region.pooled, 8);
  assert.equal(region.aligned, 3/2);
  const vertical = sampleRegion(1.25, 1.75);
  assert.equal(vertical.aligned, 5/4);
  assert.equal(vertical.neighbors.reduce((sum, {weight}) => sum + weight, 0), 1);
});

test('The Mask R-CNN lesson includes the two-axis demo and references the original slide', () => {
  const {tutor} = getDeck('/segmentation.html');
  const step = tutor.pages[25].steps.find(step => step.lab === 'align');
  assert.ok(step);
  assert.match(step.explain.join(' '), /\[\[26:/);
  const html = tutor.labMarkup(step.lab);
  assert.match(html, /id="seg-align-x"/);
  assert.match(html, /id="seg-align-y"/);
});
