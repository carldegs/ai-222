import {choice, labFrame} from './tutor-lab.mjs';

export const optimizerSurfaces = {
  valley: {
    label: 'Narrow valley',
    start: [-3.3, 1.55],
    rate: 0.24,
    memory: 0.4,
    loss: ([x, y]) => 0.3 * x ** 2 + 3 * y ** 2,
    gradient: ([x, y]) => [0.6 * x, 6 * y],
    levels: [0.125, 0.5, 1, 2, 4, 7, 11, 16],
    landmark: [0, 0],
    landmarkLabel: 'Minimum',
    description: 'Across the narrow valley the loss changes quickly. Compare how much each method moves along the valley after the same number of updates.'
  },
  saddle: {
    label: 'Saddle between two wells',
    start: [0.22, 1.75],
    rate: 0.28,
    memory: 0.55,
    loss: ([x, y]) => 0.055 * (x ** 2 - 4) ** 2 + 1.2 * y ** 2,
    gradient: ([x, y]) => [0.22 * x * (x ** 2 - 4), 2.4 * y],
    levels: [0.1, 0.3, 0.6, 0.88, 1.5, 2.5, 4, 6, 9],
    landmark: [0, 0],
    landmarkLabel: 'Saddle',
    description: 'At the saddle, moving along θ₁ lowers loss and moving along θ₂ raises it. The small θ₁ offset at the start lets the paths move toward one well.'
  }
};

const methods = {
  sgd: {label: 'SGD', color: '#a34524', dash: '3 4'},
  momentum: {label: 'Momentum', color: '#145e56', dash: '9 4'},
  nesterov: {label: 'Nesterov', color: '#3f4a9b', dash: ''}
};

export function optimizerStep(surface, method, {position, velocity}, settings = surface) {
  const {rate, memory} = settings;
  const carried = velocity.map(value => method === 'sgd' ? 0 : memory * value);
  const probe = method === 'nesterov'
    ? position.map((value, i) => value + carried[i])
    : position;
  const gradient = surface.gradient(probe);
  const nextVelocity = gradient.map((value, i) => carried[i] - rate * value);
  return {
    position: position.map((value, i) => value + nextVelocity[i]),
    velocity: nextVelocity,
    probe,
    gradient
  };
}

export function optimizerPaths(surface, count) {
  return Object.fromEntries(Object.keys(methods).map(method => {
    const path = [{position: surface.start, velocity: [0, 0]}];
    for (let step = 0; step < count; step++) {
      path.push(optimizerStep(surface, method, path[step]));
    }
    return [method, path];
  }));
}

const totalSteps = 14;
const surfaceOptions = Object.entries(optimizerSurfaces).map(([id, {label}]) => [id, label]);
const methodOptions = Object.entries(methods).map(([id, {label}]) => [id, label]);

export function optimizerPathMarkup() {
  return labFrame(
    'optimizer-paths', 'Trace three optimizers on the same surface',
    'Each method starts at the same point with zero velocity. Step twice and inspect Nesterov to see where it measures its gradient. The curves show equal-loss levels on a toy surface.',
    choice('optimizer-surface', 'Loss surface', surfaceOptions, 'valley')
    + choice('optimizer-inspect', 'Inspect', methodOptions, 'nesterov')
    + `<button class="button primary" type="button" data-optimizer-next>Next step</button>
       <button class="button subtle" type="button" data-optimizer-back>Back</button>
       <button class="button subtle" type="button" data-optimizer-play>Play</button>
       <button class="button subtle" type="button" data-optimizer-reset>Reset</button>`
  );
}

const number = new Intl.NumberFormat('en', {maximumFractionDigits: 3});
const pair = values => `(${values.map(value => number.format(Math.abs(value) < 0.0005 ? 0 : value)).join(', ')})`;

function drawContours(d3, host, surface) {
  const columns = 80, rows = 50, cell = 5;
  const width = columns * cell, height = rows * cell;
  const x = d3.scaleLinear([-4, 4], [0, width]);
  const y = d3.scaleLinear([-2.5, 2.5], [height, 0]);
  const values = Array.from({length: columns * rows}, (_, i) => surface.loss([
    x.invert((i % columns + 0.5) * cell),
    y.invert((Math.floor(i / columns) + 0.5) * cell)
  ]));
  const contours = d3.contours().size([columns, rows]).thresholds(surface.levels)(values);
  const path = d3.geoPath(d3.geoIdentity().scale(cell));
  const shade = d3.scaleLinear([0, surface.levels.at(-1)], ['#fafaf2', '#b4c6b6']);

  host.replaceChildren();
  const svg = d3.select(host).append('svg').attr('viewBox', '0 0 458 303');
  const chart = svg.append('g').attr('transform', 'translate(32,8)');
  chart.append('rect').attr('width', width).attr('height', height).attr('fill', shade(0));
  chart.selectAll('.optimizer-contour').data(contours).join('path')
    .attr('class', 'optimizer-contour').attr('d', path).attr('fill', contour => shade(contour.value))
    .attr('stroke', '#819b8b').attr('stroke-width', 0.65);
  chart.append('g').attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickValues([-4, -2, 0, 2, 4]).tickSizeOuter(0));
  chart.append('g').call(d3.axisLeft(y).tickValues([-2, -1, 0, 1, 2]).tickSizeOuter(0));
  chart.append('text').attr('x', width / 2).attr('y', height + 37).attr('text-anchor', 'middle').text('Parameter θ₁');
  chart.append('text').attr('x', 6).attr('y', 15).text('θ₂');
  chart.append('circle').attr('cx', x(surface.landmark[0])).attr('cy', y(surface.landmark[1]))
    .attr('r', 3).attr('fill', '#46564c');
  chart.append('text').attr('x', x(surface.landmark[0]) + 9).attr('y', y(surface.landmark[1]) + 4)
    .text(surface.landmarkLabel);
  return {x, y, marks: chart.append('g')};
}

function drawPaths(d3, chart, paths, step, inspected) {
  const {x, y, marks} = chart;
  const line = d3.line().x(point => x(point[0])).y(point => y(point[1]));
  marks.selectAll('*').remove();
  const marker = (point, radius, fill, stroke) => marks.append('circle')
    .attr('cx', x(point[0])).attr('cy', y(point[1])).attr('r', radius)
    .attr('fill', fill).attr('stroke', stroke).attr('stroke-width', 2);
  for (const [method, history] of Object.entries(paths)) {
    const {color, dash} = methods[method];
    const points = history.slice(0, step + 1).map(({position}) => position);
    marks.append('path').attr('d', line(points)).attr('fill', 'none')
      .attr('stroke', color).attr('stroke-width', 2.4).attr('stroke-dasharray', dash);
    if (step) marker(points.at(-1), 4.8, color, '#fff');
  }
  const start = paths[inspected][0].position;
  marker(start, 3.5, '#fff', '#263a34');
  marks.append('text').attr('x', x(start[0]) + 9).attr('y', y(start[1]) - 6).text('Start');
  if (!step) return;

  const {probe, position} = paths[inspected][step];
  const previous = paths[inspected][step - 1].position;
  const color = methods[inspected].color;
  const separateProbe = Math.hypot(probe[0] - previous[0], probe[1] - previous[1]) > 1e-9;
  if (separateProbe) {
    marks.append('path').attr('d', line([previous, probe])).attr('fill', 'none')
      .attr('stroke', color).attr('stroke-width', 2).attr('stroke-dasharray', '2 3');
  }
  marks.append('path').attr('d', line([separateProbe ? probe : previous, position]))
    .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 4);
  marker(probe, 6, '#fff', color);
  marker(position, 5, color, '#fff');
}

function readout(surface, paths, step, inspected) {
  const rows = Object.entries(paths).map(([method, path]) => {
    const {position} = path[step];
    return `<tr><th scope="row"><span class="optimizer-legend" style="--method-color:${methods[method].color};--method-line:${method === 'sgd' ? 'dotted' : method === 'momentum' ? 'dashed' : 'solid'}"></span>${methods[method].label}</th>
      <td>${pair(position)}</td><td>${number.format(surface.loss(position))}</td></tr>`;
  }).join('');
  const current = paths[inspected][step];
  const details = step
    ? `<b>${methods[inspected].label}, last move.</b> It started at ${pair(paths[inspected][step - 1].position)}. The open circle marks where it measured the gradient, ${pair(current.probe)}. The gradient there was ${pair(current.gradient)}. The filled dot is where it landed, ${pair(current.position)}.`
    : 'The three paths overlap at Start. All three make the same first move because the previous velocity is zero.';
  return `<p><b>Step ${step} of ${totalSteps}</b> · Learning rate ε = ${surface.rate} · Momentum memory α = ${surface.memory}</p>
    <table class="optimizer-results"><thead><tr><th scope="col">Method</th><th scope="col">Position (θ₁, θ₂)</th><th scope="col">Loss</th></tr></thead>
    <tbody>${rows}</tbody></table><p>${details}</p>`;
}

export function mountOptimizerPaths(lab) {
  const d3 = globalThis.d3;
  const plot = lab.querySelector('.lab-plot');
  const result = lab.querySelector('.lab-result');
  const surfaceChoice = lab.querySelector('#optimizer-surface');
  const inspectChoice = lab.querySelector('#optimizer-inspect');
  const next = lab.querySelector('[data-optimizer-next]');
  const back = lab.querySelector('[data-optimizer-back]');
  const play = lab.querySelector('[data-optimizer-play]');
  const reset = lab.querySelector('[data-optimizer-reset]');
  if (!d3) {
    lab.querySelector('.lab-controls').hidden = true;
    result.textContent = 'The optimizer chart could not load. Use the source figures above to compare the paths.';
    return;
  }

  const explanation = document.createElement('p');
  plot.before(explanation);
  let surface, chart, paths, timer;
  let step = 0;

  function render() {
    drawPaths(d3, chart, paths, step, inspectChoice.value);
    result.innerHTML = readout(surface, paths, step, inspectChoice.value);
    back.disabled = step === 0;
    next.disabled = step === totalSteps;
    play.disabled = step === totalSteps;
    reset.disabled = step === 0;
  }

  function pause() {
    clearInterval(timer);
    timer = undefined;
    play.textContent = 'Play';
    result.setAttribute('aria-live', 'polite');
  }

  function showStep(nextStep) {
    step = nextStep;
    if (step === totalSteps) pause();
    render();
  }

  function startOver() {
    pause();
    surface = optimizerSurfaces[surfaceChoice.value];
    paths = optimizerPaths(surface, totalSteps);
    chart = drawContours(d3, plot, surface);
    explanation.textContent = surface.description;
    showStep(0);
  }

  next.addEventListener('click', () => { pause(); showStep(step + 1); });
  back.addEventListener('click', () => { pause(); showStep(step - 1); });
  reset.addEventListener('click', () => { pause(); showStep(0); });
  inspectChoice.addEventListener('change', render);
  surfaceChoice.addEventListener('change', startOver);
  play.addEventListener('click', () => {
    if (timer !== undefined) {
      pause();
      return;
    }
    play.textContent = 'Pause';
    result.setAttribute('aria-live', 'off');
    timer = setInterval(() => {
      if (!lab.isConnected) pause();
      else showStep(step + 1);
    }, 800);
  });
  startOver();
}
