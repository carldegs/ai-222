import {labFrame, range, readout} from '../tutor-lab.mjs';

const grid = [
  [0, 0, 2, 0, 0],
  [0, 0, 8, 0, 0],
  [0, 0, 4, 0, 0],
  [0, 0, 2, 0, 0]
];
const halfWidth = 1/4;
const halfHeight = 1/2;

export function sampleRegion(x, y) {
  const left = Math.floor(x), top = Math.floor(y);
  const dx = x - left, dy = y - top;
  const neighbors = [
    {x:left, y:top, weight:(1-dx)*(1-dy)},
    {x:left+1, y:top, weight:dx*(1-dy)},
    {x:left, y:top+1, weight:(1-dx)*dy},
    {x:left+1, y:top+1, weight:dx*dy}
  ].map(cell => ({...cell, value:grid[cell.y][cell.x]}));
  const roundedBox = {
    left:Math.round(x-halfWidth), right:Math.round(x+halfWidth),
    top:Math.round(y-halfHeight), bottom:Math.round(y+halfHeight)
  };
  const pooledRows = grid.slice(roundedBox.top, roundedBox.bottom+1);
  const pooledValues = pooledRows.flatMap(row => row.slice(roundedBox.left, roundedBox.right+1));
  return {
    roundedBox, neighbors,
    pooled:Math.max(...pooledValues),
    aligned:neighbors.reduce((sum, {weight, value}) => sum + weight*value, 0)
  };
}

const subdivisions = 8;
const min = 4;
const maxX = 28, maxY = 20;
const origins = [36, 280];
const yOrigin = 54;
const spacing = 42;

function fraction(value) {
  // The sliders snap to eighths, so products of two weights have denominator 64.
  let numerator = value*subdivisions**2;
  let denominator = subdivisions**2;
  while (denominator > 1 && numerator % 2 === 0) {
    numerator /= 2;
    denominator /= 2;
  }
  return denominator === 1 ? String(numerator) : numerator + '/' + denominator;
}

export function alignLabMarkup() {
  return labFrame('align', 'Slide a small RoI across a thin feature',
    'The darker column is a thin feature, like the edge of an object. Drag either dashed box or use the sliders. Start by moving the box one step right and compare how much the two outputs change.',
    range('seg-align-x', 'Box center x', maxX, 9, min) +
      range('seg-align-y', 'Box center y', maxY, 12, min));
}

function panelMarkup(index, x, y, {roundedBox, neighbors}) {
  const pointX = column => origins[index] + column*spacing;
  const pointY = row => yOrigin + row*spacing;
  const centerX = pointX(x), centerY = pointY(y);
  const isSelected = (column, row) => index === 0
    ? column >= roundedBox.left && column <= roundedBox.right && row >= roundedBox.top && row <= roundedBox.bottom
    : neighbors.some(cell => cell.x === column && cell.y === row && cell.weight > 0);
  const accent = index === 0 ? '#8b6229' : '#286150';
  const tiles = grid.flatMap((row, rowIndex) => row.map((value, column) => {
    const selected = isSelected(column, rowIndex);
    return `<rect x="${pointX(column)-18}" y="${pointY(rowIndex)-18}" width="36" height="36" rx="4"
      fill="${value ? '#bedacb' : '#fcfdf9'}" stroke="${selected ? accent : '#d2dcd2'}" stroke-width="${selected ? 2.5 : 1}"/>
      <text x="${pointX(column)}" y="${pointY(rowIndex)+4}" text-anchor="middle">${value}</text>`;
  })).join('');
  const guides = index === 1 ? neighbors.filter(({weight}) => weight > 0).map(cell =>
    `<path d="M${centerX},${centerY}L${pointX(cell.x)},${pointY(cell.y)}" stroke="${accent}"
      stroke-width="${1+2*cell.weight}" opacity=".55"/>`).join('') : '';
  const xLabels = grid[0].map((_, column) => `<text x="${pointX(column)}" y="33" text-anchor="middle">${column}</text>`).join('');
  const yLabels = grid.map((_, row) => `<text x="${pointX(0)-25}" y="${pointY(row)+4}" text-anchor="middle">${row}</text>`).join('');
  return `<text x="${pointX(2)}" y="17" text-anchor="middle" style="font-weight:650;font-size:15px">${index === 0 ? 'Rounded RoI pooling' : 'RoIAlign'}</text>
    ${xLabels}${yLabels}
    ${tiles}${guides}
    <rect x="${pointX(x-halfWidth)}" y="${pointY(y-halfHeight)}" width="${2*halfWidth*spacing}" height="${2*halfHeight*spacing}"
      rx="2" fill="none" stroke="#293f36" stroke-width="2" stroke-dasharray="4 2"/>
    <circle cx="${centerX}" cy="${centerY}" r="4" fill="${accent}" stroke="#fff" stroke-width="1.5"/>
    <text x="${pointX(2)}" y="222" text-anchor="middle">${index === 0 ? 'Outlined cells supply the max' : 'Lines point to samples with nonzero weight'}</text>`;
}

function resultMarkup(x, y, region) {
  const values = readout([
    ['Box center (x, y)', `(${fraction(x)}, ${fraction(y)})`],
    ['Rounded maximum', fraction(region.pooled)],
    ['Aligned weighted sum', fraction(region.aligned)]
  ]);
  const rows = region.neighbors.map(({x, y, weight, value}) => `<tr>
    <th scope="row">(${x}, ${y})</th><td>${value}</td><td>${fraction(weight)}</td><td>${fraction(value*weight)}</td>
  </tr>`).join('');
  return `${values}
    <table class="lab-penalty-table">
      <caption>Four neighbors of the sample point</caption>
      <thead><tr><th scope="col">Point (x, y)</th><th scope="col">Feature</th><th scope="col">Weight</th><th scope="col">Contribution</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p>This example uses one bin per box. Rounded pooling rounds the box corners and takes the maximum over the included grid points. RoIAlign keeps the box coordinates and interpolates at its center. A full RoIAlign layer can take several samples per bin.</p>`;
}

export function mountAlignLab(root) {
  const xInput = root.querySelector('#seg-align-x');
  const yInput = root.querySelector('#seg-align-y');
  const result = root.querySelector('.lab-result');
  const plot = root.querySelector('.lab-plot');
  plot.innerHTML = `<svg viewBox="0 0 476 232">
    ${origins.map((origin, index) => `<g data-align-panel="${index}"></g>
      <rect data-align-drag="${index}" x="${origin-18}" y="${yOrigin-18}" width="204" height="162" fill="transparent"
        style="cursor:grab;touch-action:none"/>`).join('')}
  </svg>`;
  const svg = plot.querySelector('svg');
  const panels = [...svg.querySelectorAll('[data-align-panel]')];

  function update() {
    const x = xInput.valueAsNumber/subdivisions, y = yInput.valueAsNumber/subdivisions;
    xInput.setAttribute('aria-valuetext', String(x));
    yInput.setAttribute('aria-valuetext', String(y));
    const region = sampleRegion(x, y);
    panels.forEach((panel, index) => { panel.innerHTML = panelMarkup(index, x, y, region); });
    result.innerHTML = resultMarkup(x, y, region);
  }

  const d3 = globalThis.d3;
  if (d3) {
    for (const hitArea of svg.querySelectorAll('[data-align-drag]')) {
      const origin = origins[Number(hitArea.dataset.alignDrag)];
      const snap = (pixel, base, max) =>
        Math.max(min, Math.min(max, Math.round((pixel-base)*subdivisions/spacing)));
      d3.select(hitArea).call(d3.drag().container(svg)
        .subject(event => {
          const x = origin + xInput.valueAsNumber/subdivisions*spacing;
          const y = yOrigin + yInput.valueAsNumber/subdivisions*spacing;
          const inBox = Math.abs(event.x-x) <= halfWidth*spacing && Math.abs(event.y-y) <= halfHeight*spacing;
          return inBox ? {x, y} : {x:event.x, y:event.y};
        })
        .on('start drag', event => {
          xInput.value = snap(event.x, origin, maxX);
          yInput.value = snap(event.y, yOrigin, maxY);
          update();
        }));
    }
  }

  root.addEventListener('input', update);
  update();
}
