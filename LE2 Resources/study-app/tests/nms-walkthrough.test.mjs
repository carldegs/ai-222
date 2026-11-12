import test from 'node:test';
import assert from 'node:assert/strict';
import {boxIoU, buildNmsFrames, nmsScenarios} from '../dist/decks/nms-walkthrough.mjs';

test('the chain example distinguishes greedy suppression from Fast NMS', () => {
  const boxes = nmsScenarios.chain.boxes;
  assert.equal(boxIoU(boxes[0], boxes[1]), 3/5);
  assert.equal(boxIoU(boxes[1], boxes[2]), 3/5);
  assert.equal(boxIoU(boxes[0], boxes[2]), 1/3);
  const last = mode => buildNmsFrames(boxes, mode, 1/2).at(-1);
  assert.deepEqual(last('hard').kept, ['A', 'C']);
  assert.deepEqual(last('fast').kept, ['A']);
  assert.ok(buildNmsFrames(boxes, 'fast', 1/2).some(frame => frame.current === 'C' && frame.matches.includes('B')));
});

test('Gaussian Soft-NMS decays overlapping scores and reorders candidates', () => {
  const boxes = nmsScenarios.chain.boxes;
  const frames = buildNmsFrames(boxes, 'soft', 1/2);
  const afterFirst = frames.find(frame => frame.current === 'A');
  assert.ok(afterFirst.scores.B < boxes[1].score);
  assert.deepEqual(afterFirst.pending, ['C', 'B']);
  assert.deepEqual(frames.at(-1).kept, ['A', 'C', 'B']);
});

test('Hard NMS suppresses at the threshold and leaves disjoint boxes eligible', () => {
  const boxes = nmsScenarios.can.boxes;
  assert.equal(boxIoU(boxes[0], boxes[1]), 1/2);
  assert.equal(boxIoU(boxes[0], boxes[2]), 0);
  assert.deepEqual(buildNmsFrames(boxes, 'hard', 1/2).at(-1).kept, ['A', 'C']);
  assert.deepEqual(buildNmsFrames(boxes, 'hard', 3/4).at(-1).kept, ['A', 'B', 'C']);
});
