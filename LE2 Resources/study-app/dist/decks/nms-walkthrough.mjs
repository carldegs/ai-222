import {choice, labFrame} from '../tutor-lab.mjs';
import {source} from '../tutor.mjs';

const candidate = (id, score, x, y, width, height) => ({id, score, x, y, width, height});
export const nmsScenarios = {
  can: {
    name: 'Duplicate can',
    context: 'A and B are two guesses around the same can. C is another can farther away.',
    objects: [{x:3,y:1.25,width:2,height:4.5}, {x:14,y:1.25,width:2,height:4.5}],
    boxes: [candidate('A',.99,0,1,6,5), candidate('B',.75,2,1,6,5), candidate('C',.64,13,1,4,5)]
  },
  horses: {
    name: 'Two nearby horses',
    context: 'A and B are guesses for two nearby horses. Their boxes overlap even though the horses are distinct.',
    objects: [{x:1.5,y:1.25,width:3,height:4.5}, {x:6,y:1.75,width:3,height:4.5}],
    boxes: [candidate('A',.95,0,1,8,5), candidate('B',.80,2,1,8,5)]
  },
  chain: {
    name: 'Three-box chain',
    context: 'A overlaps B, B overlaps C, and A overlaps C less. Watch whether B can affect C after B is suppressed.',
    objects: [],
    boxes: [candidate('A',.90,0,1,8,5), candidate('B',.80,2,1,8,5), candidate('C',.70,4,1,8,5)]
  }
};

export function boxIoU(a, b) {
  const overlap = (startA, sizeA, startB, sizeB) =>
    Math.max(0, Math.min(startA + sizeA, startB + sizeB) - Math.max(startA, startB));
  const intersection = overlap(a.x,a.width,b.x,b.width) * overlap(a.y,a.height,b.y,b.height);
  return intersection / (a.width * a.height + b.width * b.height - intersection);
}

const labels = {hard:'Greedy NMS', soft:'Gaussian Soft-NMS', fast:'Fast NMS'};
const scoreLabel = value => value.toFixed(3);
const overlapLabel = value => ({0:'0',.5:'1/2',.6:'3/5',[1/3]:'1/3'})[value] ?? value.toFixed(2);

export function buildNmsFrames(boxes, mode, threshold) {
  const scores = Object.fromEntries(boxes.map(box => [box.id, box.score]));
  const pending = [...boxes].sort((a,b) => b.score - a.score);
  const ranked = [...pending];
  const kept = [];
  const suppressed = [];
  const frames = [];
  const record = (message, current = null, matches = []) => frames.push({
    message, current, matches, kept:[...kept], suppressed:[...suppressed],
    pending:pending.map(box => box.id), scores:{...scores}
  });

  record('Start with candidates sorted by confidence.');
  while (pending.length) {
    const box = pending.shift();
    if (mode === 'fast') {
      const higher = ranked.slice(0,ranked.indexOf(box));
      const matches = higher.filter(other => boxIoU(box,other) >= threshold);
      (matches.length ? suppressed : kept).push(box.id);
      const comparisons = higher.map(other => `${other.id}–${box.id}: ${overlapLabel(boxIoU(box,other))}`).join(', ');
      const result = matches.length
        ? `Suppress ${box.id}. ${matches.map(other => other.id).join(', ')} reaches the threshold.`
        : `Keep ${box.id}. No higher-ranked box reaches the threshold.`;
      record(comparisons ? `${comparisons}. ${result}` : result,box.id,matches.map(other => other.id));
      continue;
    }

    kept.push(box.id);
    const comparisons = pending.map(other => {
      const iou = boxIoU(box,other);
      return {other,iou,label:`${box.id}–${other.id}: ${overlapLabel(iou)}`};
    });
    const matches = [];
    for (const {other,iou} of comparisons) {
      if (mode === 'soft' && iou > 0) {
        const previous = scores[other.id];
        scores[other.id] *= Math.exp(-iou * iou / .5);
        matches.push({id:other.id, detail:`${other.id} ${scoreLabel(previous)} → ${scoreLabel(scores[other.id])}`});
      } else if (mode === 'hard' && iou >= threshold) {
        suppressed.push(other.id);
        pending.splice(pending.indexOf(other),1);
        matches.push({id:other.id,detail:other.id});
      }
    }
    pending.sort((a,b) => scores[b.id] - scores[a.id]);
    const evidence = comparisons.length ? ` IoU ${comparisons.map(item => item.label).join(', ')}.` : '';
    const effect = matches.length
      ? mode === 'soft' ? ` Lower the scores and re-rank: ${matches.map(match => match.detail).join(', ')}.`
        : ` Suppress ${matches.map(match => match.id).join(', ')}.`
      : comparisons.length ? ' The remaining candidates stay eligible.' : '';
    record(`Keep ${box.id}.${evidence}${effect}`,box.id,matches.map(match => match.id));
  }
  record(`Final selection, in order: ${kept.join(', ')}.`);
  return frames;
}

export function nmsLabMarkup(deck) {
  const fast = deck === 'segmentation';
  const modes = fast ? ['hard','fast'] : ['hard','soft'];
  const scenarios = fast ? ['chain'] : ['can','horses','chain'];
  return labFrame(fast ? 'fast-nms' : 'nms',
    fast ? 'Compare greedy NMS and Fast NMS' : 'Follow hard and Soft-NMS box by box',
    fast ? 'Step through both rules on the same three candidates. Fast NMS evaluates the comparisons in parallel. The walkthrough reveals one column at a time.'
      : 'Pick a scene and step through the ranked candidates. Watch what happens to boxes that overlap the current winner.',
    choice('nms-mode','Method',modes.map(mode => [mode, labels[mode]]),fast ? 'fast' : 'hard') +
    (fast ? '' : choice('nms-scene','Scene',scenarios.map(key => [key,nmsScenarios[key].name]),'can')) +
    choice('nms-threshold','IoU threshold',[[.25,'1/4'],[.5,'1/2'],[.75,'3/4']],.5) +
    '<span class="nms-playback" role="group" aria-label="Walkthrough controls"><button type="button" class="button" data-nms-back>Back</button><button type="button" class="button primary" data-nms-next>Next step</button><button type="button" class="button" data-nms-play>Play</button><button type="button" class="button subtle" data-nms-reset>Reset</button></span>' +
    `<p class="nms-source">${fast ? source(62,'Fast NMS rule') : `${source(39,'Can example')} ${source(40,'Horse example')} ${source(41,'Suppression rules')}`}</p>`);
}

function plotScene(scenario, frame) {
  const color = {A:'#285e50',B:'#90500e',C:'#4a5295'};
  const objects = scenario.objects.map(({x,y,width,height}) =>
    `<rect x="${x*22+24}" y="${y*20+28}" width="${width*22}" height="${height*20}" rx="8" fill="#dce1d9"/>`).join('');
  const candidates = scenario.boxes.map(({id,x,y,width,height}, index) => {
    const selected = frame.current === id;
    const removed = frame.suppressed.includes(id);
    const compared = frame.matches.includes(id);
    const center = x*22+36+index*4;
    return `<g data-nms-box="${id}" opacity="${removed && !selected ? .38 : 1}">
      <rect x="${x*22+24}" y="${y*20+28}" width="${width*22}" height="${height*20}" rx="2"
        fill="${selected || compared ? color[id] : 'none'}" fill-opacity=".12" stroke="${color[id]}"
        stroke-width="${selected ? 4 : 2}" ${removed ? 'stroke-dasharray="5 5"' : ''}/>
      <circle cx="${center}" cy="${y*20+17}" r="10" fill="${color[id]}"/>
      <text x="${center}" y="${y*20+21}" text-anchor="middle" style="fill:white;font-weight:700">${id}</text>
    </g>`;
  }).join('');
  return `<svg viewBox="0 0 420 180" role="img" aria-label="Schematic showing overlap between candidate boxes">
    <rect x="1" y="1" width="418" height="178" rx="8" fill="#fffefb" stroke="#d6e0d2"/>
    ${objects}${candidates}
    <text x="16" y="164">${scenario.objects.length ? 'Gray shapes mark the real objects' : 'Dashed outlines mark suppressed candidates'}</text>
  </svg>`;
}

function fastMatrix(boxes, current) {
  const cols = boxes.map(box => `<th scope="col">${box.id}</th>`).join('');
  const rows = boxes.map((row,i) => `<tr><th scope="row">${row.id}</th>${boxes.map((col,j) =>
    `<td${col.id === current ? ' class="nms-column"' : ''}>${i < j ? overlapLabel(boxIoU(row,col)) : '–'}</td>`).join('')}</tr>`).join('');
  return `<table class="nms-matrix"><caption>IoU with higher-ranked boxes</caption><thead><tr><th scope="col">Compared with</th>${cols}</tr></thead><tbody>${rows}</tbody></table>`;
}

export function mountNmsLab(root) {
  const modeField = root.querySelector('#nms-mode');
  const sceneField = root.querySelector('#nms-scene');
  const thresholdField = root.querySelector('#nms-threshold');
  const thresholdLabel = root.querySelector('label[for="nms-threshold"]');
  const back = root.querySelector('[data-nms-back]');
  const next = root.querySelector('[data-nms-next]');
  const play = root.querySelector('[data-nms-play]');
  const plot = root.querySelector('.lab-plot');
  const result = root.querySelector('.lab-result');
  let frames, scenario, step, timer;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  plot.removeAttribute('aria-hidden');

  function render(previous) {
    const frame = frames[step];
    const rows = scenario.boxes.map(({id}) => {
      const status = frame.kept.includes(id) ? 'Kept' : frame.suppressed.includes(id) ? 'Suppressed' : 'Waiting';
      return `<span${frame.current === id ? ' class="nms-active"' : ''}><b>${id}</b> ${scoreLabel(frame.scores[id])} · ${status}</span>`;
    }).join('');
    plot.innerHTML = plotScene(scenario,frame) + (modeField.value === 'fast' ? fastMatrix(scenario.boxes,frame.current) : '');
    if (previous && !reducedMotion.matches) {
      for (const id of frame.suppressed) {
        if (previous.suppressed.includes(id)) continue;
        const box = plot.querySelector(`[data-nms-box="${id}"]`);
        box.animate([{opacity:1},{opacity:box.getAttribute('opacity')}],{duration:280});
      }
    }
    const queue = frame.pending.join(' → ');
    result.innerHTML = `<p><b>Step ${step} of ${frames.length - 1}</b> · ${frame.message}</p>
      <div class="nms-status">${rows}</div>
      ${queue ? `<p>Next in order · ${queue}</p>` : ''}
      <p class="nms-context">${scenario.context} These are toy boxes and scores. ${modeField.value === 'soft'
        ? 'Gaussian decay uses σ = 1/2. This example shows every candidate before any final score filter.' : ''}</p>`;
    back.disabled = step === 0;
    next.disabled = step === frames.length - 1;
    play.textContent = timer ? 'Pause' : 'Play';
  }

  function pause() {
    clearInterval(timer);
    timer = undefined;
    result.setAttribute('aria-live','polite');
  }
  function move(delta) {
    pause();
    const previous = frames[step];
    step = Math.max(0,Math.min(frames.length - 1,step + delta));
    render(delta > 0 ? previous : undefined);
  }
  function reset() {
    pause();
    const mode = modeField.value;
    scenario = nmsScenarios[sceneField?.value ?? 'chain'];
    frames = buildNmsFrames(scenario.boxes,mode,Number(thresholdField.value));
    step = 0;
    thresholdField.hidden = thresholdLabel.hidden = mode === 'soft';
    render();
  }

  root.addEventListener('change',reset);
  root.querySelector('[data-nms-reset]').addEventListener('click',reset);
  back.addEventListener('click',() => move(-1));
  next.addEventListener('click',() => move(1));
  play.addEventListener('click',() => {
    if (timer) pause();
    else {
      if (step === frames.length - 1) step = 0;
      result.setAttribute('aria-live','off');
      timer = setInterval(() => {
        if (!root.isConnected) return pause();
        const previous = frames[step++];
        if (step === frames.length - 1) pause();
        render(previous);
      },1300);
    }
    render();
  });
  reset();
}
