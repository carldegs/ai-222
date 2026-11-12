import test from 'node:test';
import assert from 'node:assert/strict';
import {decks} from '../dist/decks.mjs';

// Track named methods and domain terms that a beginner needs explained before a check.
const termsByDeck = {
  optimization: [
    'minibatch', 'empirical risk', 'local minimum', 'global minimum', 'saddle',
    'Hessian', 'gradient clipping', 'Glorot', 'ReLU', 'standard deviation',
    'SGD', 'momentum', 'Nesterov', 'AdaGrad', 'RMSProp', 'Adam', 'warmup',
    'learning-rate restart'
  ],
  regularization: [
    'dropout', 'keep probability', 'L1', 'L2', 'overfitting', 'underfitting',
    'MLE', 'IID', 'MAP', 'posterior density', 'Gaussian likelihood',
    'Gaussian prior', 'bounding box', 'STRAug', 'CutOut', 'MixUp', 'CutMix',
    'AgMax', 'RandAugment', 'domain randomization', 'multi-task learning',
    'Siamese', 'disparity', 'early stopping', 'checkpoint', 'cross-validation'
  ],
  detection: [
    'anchor', 'bounding box', 'ground truth', 'IoU', 'SSD', 'Smooth L1',
    'NMS', 'Soft-NMS', 'precision', 'recall', 'RoI', 'RPN', 'FPN',
    'lateral', 'cross-entropy', 'focal', 'FSAF', 'FCOS', 'centerness'
  ],
  segmentation: [
    'panoptic segmentation', 'instance segmentation', 'softmax', 'skip', 'PSPNet', 'mIoU',
    'RoIAlign', 'MaskIoU', 'ProtoNet', 'Fast NMS', 'integral loss', 'semantic branch',
    'SAM 2', 'masklet', 'FIFO', 'boundary'
  ]
};

for (const deck of Object.values(decks)) {
  test(deck.title + ' checks use terminology from the teaching step', () => {
    const gaps = [];
    for (const {steps} of deck.tutor.pages) {
      for (const step of steps) {
        if (!step.check || step.coveredBy) continue;
        const teaching = [step.title, ...step.explain, step.figure?.caption].join(' ');
        for (const term of termsByDeck[deck.id]) {
          const pattern = new RegExp('\\b' + term + '\\b', 'i');
          if (step.check.some(text => pattern.test(text)) && !pattern.test(teaching)) {
            gaps.push(step.title + ' → ' + term);
          }
        }
      }
    }
    assert.deepEqual(gaps, []);
  });
}
