import test from 'node:test';
import assert from 'node:assert/strict';
import { getDeck } from '../dist/decks.mjs';
import { augmentationState } from '../dist/decks/augmentation.mjs';

test('CutMix measures the pasted area after clipping to the image', () => {
  const inside = augmentationState('cutmix', { column: 1, row: 1, size: 2 });
  assert.deepEqual(inside.patch, { x: 1, y: 1, width: 2, height: 2 });
  assert.deepEqual(inside.target, ['3/4', '1/4']);

  const edge = augmentationState('cutmix', { column: 3, row: 1, size: 2 });
  assert.deepEqual(edge.patch, { x: 3, y: 1, width: 1, height: 2 });
  assert.deepEqual(edge.target, ['7/8', '1/8']);

  const corner = augmentationState('cutmix', { column: -1, row: -1, size: 2 });
  assert.deepEqual(corner.patch, { x: 0, y: 0, width: 1, height: 1 });
  assert.deepEqual(corner.target, ['15/16', '1/16']);
});

test('CutOut preserves the bird target and MixUp uses the pixel blend weights', () => {
  const erased = augmentationState('cutout', { column: 0, row: 0, size: 4 });
  assert.equal(erased.patch.width * erased.patch.height, 16);
  assert.deepEqual(erased.target, ['1', '0']);

  const mixed = augmentationState('mixup', { birdQuarters: 1 });
  assert.equal(mixed.catOpacity, 0.75);
  assert.deepEqual(mixed.target, ['1/4', '3/4']);
  assert.deepEqual(augmentationState('mixup', { birdQuarters: 4 }).target, ['1', '0']);
});

test('the bird and cat comparison appears in the grouped augmentation lesson', () => {
  const { tutor } = getDeck('/regularization.html');
  const lesson = tutor.lessons.find(({ pages }) => pages[0].slide === 26);
  const demos = lesson.pages.flatMap(({ steps }) => steps.filter(step => !step.coveredBy && step.lab));
  assert.deepEqual(demos.map(({ slide, lab }) => [slide, lab]), [[29, 'augmentation']]);
});
