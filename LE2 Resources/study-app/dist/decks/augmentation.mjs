import { choice, labFrame, range, readout } from '../tutor-lab.mjs';
import { source } from '../tutor.mjs';

const gridSize = 4;
const photoWidth = 320;
const photoHeight = 428;
const cellWidth = photoWidth / gridSize;
const cellHeight = photoHeight / gridSize;
// Source rectangles in the original 1536 × 864 slide 26 image.
const birdCrop = [236, 180, 406, 542];
const catCrop = [882, 180, 406, 542];

function fraction(numerator, denominator) {
  let a = numerator;
  let b = denominator;
  while (b !== 0) [a, b] = [b, a % b];
  return a === denominator ? String(numerator / denominator) :
    `${numerator / a}/${denominator / a}`;
}

export function augmentationState(mode, { column, row, size, birdQuarters }) {
  if (mode === 'mixup') {
    const catQuarters = 4 - birdQuarters;
    return { catOpacity: catQuarters / 4, target: [fraction(birdQuarters, 4), fraction(catQuarters, 4)] };
  }
  const x = Math.max(0, column);
  const y = Math.max(0, row);
  const width = Math.max(0, Math.min(gridSize, column + size) - x);
  const height = Math.max(0, Math.min(gridSize, row + size) - y);
  const patch = { x, y, width, height };
  if (mode === 'cutout') return { patch, target: ['1', '0'] };
  const catCells = width * height;
  const totalCells = gridSize ** 2;
  return { patch, target: [fraction(totalCells - catCells, totalCells), fraction(catCells, totalCells)] };
}

export function augmentationMarkup() {
  const controls = choice('augmentation-mode', 'Method',
    [['cutout', 'CutOut'], ['mixup', 'MixUp'], ['cutmix', 'CutMix']], 'cutmix');
  return labFrame('augmentation', 'Erase, blend, or paste the same photos',
    'Compare the deck’s bird and cat. Watch what changes in the image and what the model is asked to predict.', controls);
}

const positionControl = (axis, label, start) => `<span>${range(`augmentation-${axis}`, label, 3, start, -1)}
  <output for="augmentation-${axis}" data-position="${axis}">${start}</output></span>`;

function photoPanel(id, label) {
  return `<figure style="margin:0;min-width:0">
    <canvas id="augmentation-${id}" width="${photoWidth}" height="${photoHeight}" role="img" aria-label="${label}"
      style="display:block;width:100%;height:auto;background:#ecefe6;border-radius:5px">${label}</canvas>
    <figcaption>${label}</figcaption>
  </figure>`;
}

export function mountAugmentation(lab, slideURL) {
  const plot = lab.querySelector('.lab-plot');
  const result = lab.querySelector('.lab-result');
  plot.removeAttribute('aria-hidden');
  plot.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr 1.6fr;gap:10px;align-items:start">
    ${photoPanel('bird', 'Source 1 · Bird')}
    ${photoPanel('cat', 'Source 2 · Cat')}
    ${photoPanel('output', 'Augmented image')}
  </div>
  <p>${source(26, 'Photos from slide 26')}</p>
  <div data-augmentation-patch>
    <p>Drag the patch or use the sliders. The left and top edges are at 0. Negative positions put part of the patch outside the photo.</p>
    <div class="lab-controls">
      ${choice('augmentation-size', 'Patch side', [[1, '1 cell'], [2, '2 cells'], [3, '3 cells'], [4, '4 cells']], 2)}
      ${positionControl('column', 'Patch column', 2)}
      ${positionControl('row', 'Patch row', 0)}
    </div>
  </div>
  <div data-augmentation-blend hidden>
    <div class="lab-controls">${choice('augmentation-bird-share', 'Bird share (λ)',
      [[0, '0'], [1, '1/4'], [2, '1/2'], [3, '3/4'], [4, '1']], 3)}</div>
  </div>`;
  const control = name => lab.querySelector(`#augmentation-${name}`);
  const patchControls = lab.querySelector('[data-augmentation-patch]');
  const blendControls = lab.querySelector('[data-augmentation-blend]');
  const output = control('output');
  const context = output.getContext('2d');
  const slide = new Image();
  const drawPhoto = (ctx, crop) => ctx.drawImage(slide, ...crop, 0, 0, photoWidth, photoHeight);
  const value = name => Number(control(name).value);
  const axisInputs = ['column', 'row'].map(axis => [axis, control(axis)]);
  let imageStatus = 'loading';

  function render() {
    const mode = control('mode').value;
    const blend = mode === 'mixup';
    patchControls.hidden = blend;
    blendControls.hidden = !blend;
    output.style.touchAction = blend ? 'auto' : 'none';
    output.style.cursor = blend ? 'auto' : 'grab';

    const size = value('size');
    for (const [axis, input] of axisInputs) {
      input.min = 1 - size;
      lab.querySelector(`[data-position="${axis}"]`).value = input.value;
    }
    const state = augmentationState(mode, { column: value('column'), row: value('row'),
      size, birdQuarters: value('bird-share') });
    const [bird, cat] = state.target;
    const values = [['Bird target', bird], ['Cat target', cat]];
    let message;
    if (blend) {
      message = 'Each output pixel blends the two photos in the same proportions as the target.';
    } else {
      const { width, height } = state.patch;
      const cells = width * height;
      const cutmix = mode === 'cutmix';
      values.push([cutmix ? 'Cat area' : 'Blank area', `${cells}/16 cells`]);
      message = cutmix ? 'The cat supplies only the cells inside the outlined patch. The bird supplies everything else.' :
        'The patch hides bird pixels. The target still says bird.';
      if (cells < size ** 2) message += ' The part outside the photo does not count.';
    }
    if (imageStatus === 'loading') message += ' Loading the source photos…';
    if (imageStatus === 'failed') message += ' The photos could not be loaded. Open slide 26 to see the originals.';
    result.innerHTML = readout(values, message);
    output.setAttribute('aria-label', `${control('mode').selectedOptions[0].textContent} image. ${message}`);

    if (imageStatus !== 'ready') return;
    drawPhoto(context, birdCrop);
    if (blend) {
      context.save();
      context.globalAlpha = state.catOpacity;
      drawPhoto(context, catCrop);
      context.restore();
      return;
    }
    const { x, y, width, height } = state.patch;
    const bounds = [x * cellWidth, y * cellHeight, width * cellWidth, height * cellHeight];
    if (mode === 'cutout') {
      context.fillStyle = '#161817';
      context.fillRect(...bounds);
    } else {
      context.save();
      context.beginPath();
      context.rect(...bounds);
      context.clip();
      drawPhoto(context, catCrop);
      context.restore();
    }
    drawPatchGuide(bounds);
  }

  function drawPatchGuide(bounds) {
    context.save();
    context.strokeStyle = 'rgba(255,255,255,.55)';
    context.lineWidth = 1;
    context.beginPath();
    for (let i = 1; i < gridSize; i++) {
      context.moveTo(i * cellWidth, 0);
      context.lineTo(i * cellWidth, photoHeight);
      context.moveTo(0, i * cellHeight);
      context.lineTo(photoWidth, i * cellHeight);
    }
    context.stroke();
    context.strokeStyle = '#fff';
    context.lineWidth = 5;
    context.strokeRect(...bounds);
    context.strokeStyle = '#183f35';
    context.lineWidth = 2;
    context.strokeRect(...bounds);
    context.restore();
  }

  function position(event) {
    const bounds = output.getBoundingClientRect();
    return [(event.clientX - bounds.left) / bounds.width * gridSize,
      (event.clientY - bounds.top) / bounds.height * gridSize];
  }

  let drag = null;
  output.addEventListener('pointerdown', event => {
    if (drag || event.button !== 0 || control('mode').value === 'mixup' || imageStatus !== 'ready') return;
    const [x, y] = position(event);
    const column = value('column');
    const row = value('row');
    const size = value('size');
    if (x < column || x >= column + size || y < row || y >= row + size) return;
    drag = { id: event.pointerId, offsetX: x - column, offsetY: y - row };
    output.setPointerCapture(event.pointerId);
    output.style.cursor = 'grabbing';
  });
  output.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId) return;
    const [x, y] = position(event);
    control('column').value = Math.round(x - drag.offsetX);
    control('row').value = Math.round(y - drag.offsetY);
    render();
    output.style.cursor = 'grabbing';
  });
  output.addEventListener('lostpointercapture', event => {
    if (drag?.id !== event.pointerId) return;
    drag = null;
    output.style.cursor = 'grab';
  });

  lab.addEventListener('input', render);
  slide.addEventListener('load', () => {
    if (!lab.isConnected) return;
    imageStatus = 'ready';
    drawPhoto(control('bird').getContext('2d'), birdCrop);
    drawPhoto(control('cat').getContext('2d'), catCrop);
    render();
  }, { once: true });
  slide.addEventListener('error', () => {
    imageStatus = 'failed';
    render();
  }, { once: true });
  slide.src = slideURL(26);
  render();
}
