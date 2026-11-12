import test from 'node:test';
import assert from 'node:assert/strict';
import {optimizerStep, optimizerSurfaces, optimizerPaths} from '../dist/optimizer-paths.mjs';

test('Nesterov evaluates at the lookahead and applies the new velocity to the current point', () => {
  const surface = optimizerSurfaces.valley;
  const position = [2, 1];
  const velocity = [-1, 1];
  const settings = {rate: 0.125, memory: 0.5};
  const momentum = optimizerStep(surface, 'momentum', {position, velocity}, settings);
  const nesterov = optimizerStep(surface, 'nesterov', {position, velocity}, settings);
  assert.deepEqual(momentum.probe, [2, 1]);
  assert.deepEqual(nesterov.probe, [1.5, 1.5]);
  assert.deepEqual(nesterov.gradient, surface.gradient(nesterov.probe));
  assert.notDeepEqual(nesterov.position, nesterov.probe);
  assert.deepEqual(nesterov.position, [
    position[0] + 0.5 * velocity[0] - 0.125 * nesterov.gradient[0],
    position[1] + 0.5 * velocity[1] - 0.125 * nesterov.gradient[1]
  ]);
});

test('SGD discards the previous velocity and measures the gradient at the current point', () => {
  const surface = optimizerSurfaces.valley;
  const position = [2, 1];
  const step = optimizerStep(surface, 'sgd', {position, velocity: [10, 10]}, {rate: 0.25, memory: 0.5});
  assert.deepEqual(step.probe, position);
  assert.deepEqual(step.position, [1.7, -0.5]);
});

test('each path begins at the same location, then traces finite updates on both teaching surfaces', () => {
  for (const surface of Object.values(optimizerSurfaces)) {
    const paths = optimizerPaths(surface, 14);
    const [sgd, momentum, nesterov] = Object.values(paths);
    for (const path of Object.values(paths)) {
      assert.deepEqual(path[0].position, surface.start);
      assert.deepEqual(path[1].position, sgd[1].position);
      assert.equal(path.length, 15);
      for (const step of path) assert.ok(step.position.every(Number.isFinite));
    }
    assert.notDeepEqual(momentum[2].position, nesterov[2].position);
  }
  const valley = optimizerPaths(optimizerSurfaces.valley, 14);
  assert.ok(valley.sgd[1].position[1] < 0);
  assert.ok(valley.sgd[2].position[1] > 0);
  assert.ok(Math.abs(valley.momentum[10].position[0]) < Math.abs(valley.sgd[10].position[0]));
  const {loss} = optimizerSurfaces.saddle;
  assert.ok(loss([0.1, 0]) < loss([0, 0]));
  assert.ok(loss([0, 0.1]) > loss([0, 0]));
});
