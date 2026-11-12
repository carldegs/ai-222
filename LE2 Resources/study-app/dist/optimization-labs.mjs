import {choice, range, labFrame, readout} from './tutor-lab.mjs';

const number = n => new Intl.NumberFormat('en', {maximumSignificantDigits: 5}).format(n).replace('-', '−');
const signed = n => (n > 0 ? '+' : '') + number(n);
const advance = label => `<button class="button primary" type="button" data-lab-step>${label}</button>
  <button class="button subtle" type="button" data-lab-reset>Reset</button>`;
const gradients = [-4, -2, 0, 2, 4].map(n=>[n, signed(n)]);
const rates = [[.25,'1/4'], [.5,'1/2'], [1,'1'], [1.5,'3/2'], [2,'2'], [2.5,'5/2']];
const labs = {
  prediction: ['Move the prediction', 'Try to get the loss down to zero.', range('lab-prediction','Prediction (θ)',8,1)],
  batch: ['Change the minibatch', 'The prediction stays at 4. Try each batch and compare the suggested moves.',
    choice('lab-batch','Targets in this batch',[[0,'2 and 4'],[1,'4 and 6'],[2,'2, 4, and 6 (all examples)']],0)],
  signal: ['Pass a signal through several operations', 'Start with a signal of 1 and apply the same multiplier each time.',
    choice('lab-multiplier','Multiplier (λ)',[[.5,'1/2'],[2,'2']],.5) + range('lab-repeats','Repetitions (t)',6,3)],
  gradient: ['Step across the loss curve', 'Start at θ = 4. Try 1/2, then reset and try 5/2. Compare the loss before and after.',
    choice('lab-rate','Learning rate (ε)',rates,.5) + advance('Take a step')],
  momentum: ['Give momentum a new gradient', 'Start with v = −2 and keep ε = 1/2. Try g = 2, then reset and try g = −2.',
    choice('lab-g','Gradient (g)',gradients,2) + choice('lab-alpha','Memory (α)',[[0,'0'],[.5,'1/2'],[.9,'9/10']],.5) + advance('Update velocity')],
  adagrad: ['Build up squared-gradient history', 'Start at r = 0 and keep ε = 1/2. Try g = 4 a few times. Then switch to g = 2.',
    choice('lab-g','Gradient (g)',gradients,4) + advance('Apply gradient')],
  rmsprop: ['Watch the history fade', 'Start with r = 16. Set g = 2 and repeat. This example uses ρ = 1/2 and ε = 1/2.',
    choice('lab-g','Gradient (g)',gradients,2) + advance('Apply gradient')],
  adam: ['Track the two averages', 'Start at s = r = 0. Apply g = 2, then g = −2. Both decay rates and ε are 1/2.',
    choice('lab-g','Gradient (g)',gradients,2) + advance('Apply gradient')],
  schedule: ['Compare learning-rate schedules', 'Change the schedule and move through 100 epochs. Every schedule uses the same peak rate of 0.1.',
    choice('lab-schedule','Schedule',[['cosine','Cosine'],['linear','Linear'],['multi','Multistep'],['warmup','Warmup + cosine'],['restart','Cosine with a restart']],'cosine') +
    range('lab-epoch','Epoch',100,25)]
};

export function labMarkup(id) {
  const [title, prompt, controls] = labs[id];
  return labFrame(id, title, prompt, controls);
}

function chart({points, xMin, xMax, yMax, dots = [], horizontal, vertical}) {
  const w = 440, h = 168, left = 45, right = 425, top = 17, bottom = 134;
  const X = x => left + (right-left)*(x-xMin)/(xMax-xMin);
  const Y = y => bottom - (bottom-top)*y/yMax;
  return `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true">
    <path class="plot-grid" d="M${left},${top}H${right} M${left},${(top+bottom)/2}H${right} M${X(0)},${top}V${bottom}"/>
    <path class="plot-axis" d="M${left},${top}V${bottom}H${right}"/>
    <text x="${left-5}" y="${top+4}" text-anchor="end">${number(yMax)}</text>
    <text x="${left-5}" y="${bottom+4}" text-anchor="end">0</text>
    <text x="${left}" y="${bottom+15}">${number(xMin)}</text>
    <text x="${right}" y="${bottom+15}" text-anchor="end">${number(xMax)}</text>
    <text x="${left+4}" y="12">${vertical}</text>
    <text x="${(left+right)/2}" y="${bottom+19}" text-anchor="middle">${horizontal}</text>
    <polyline class="plot-curve" points="${points.map(([x,y])=>`${X(x)},${Y(y)}`).join(' ')}"/>
    ${dots.map(([x,y,old])=>`<circle class="${old?'plot-old':'plot-dot'}" cx="${X(x)}" cy="${Y(y)}" r="5.5"/>`).join('')}
  </svg>`;
}

const halfCosine = progress => .05 * (1 + Math.cos(Math.PI * progress));
function rateAt(schedule, epoch) {
  if (schedule==='linear') return .1*(1-epoch/100);
  if (schedule==='multi') return epoch < 40 ? .1 : epoch < 75 ? .05 : .025;
  if (schedule==='warmup') return epoch < 10 ? .1*epoch/10 : halfCosine((epoch-10)/90);
  if (schedule==='restart') return halfCosine(epoch < 50 ? epoch/50 : (epoch-50)/50);
  return halfCosine(epoch/100);
}

export function mountLab(root) {
  const lab = root.querySelector('[data-tutor-lab]');
  if (!lab) return;
  const id = lab.dataset.tutorLab;
  const control = name => lab.querySelector('#lab-'+name);
  const value = name => Number(control(name).value);
  const plot = lab.querySelector('.lab-plot');
  const result = lab.querySelector('.lab-result');
  const initial = () => ({theta: 4, previous: null, v: -2, r: id==='rmsprop'?16:0, s: 0, t: 0, last: null});
  let state = initial();

  function display(values, message = '', visual = '') {
    plot.innerHTML = visual;
    result.innerHTML = readout(values, message);
  }

  function render() {
    const {theta, previous, r, s, v, t, last} = state;
    if (id==='prediction') {
      const p = value('prediction');
      display([['Prediction (θ)',p],['Target',4],['Distance',Math.abs(p-4)],['Squared loss',(p-4)**2]], '',
        `<svg viewBox="0 0 440 84" aria-hidden="true"><path class="plot-axis" d="M24 43H416"/>
          ${Array.from({length:9}, (_,i)=>`<text x="${24+i*49}" y="69" text-anchor="middle">${i}</text>`).join('')}
          <path class="plot-grid" d="M220 30V55"/><text x="220" y="21" text-anchor="middle">Target</text>
          <circle class="plot-dot" cx="${24+p*49}" cy="43" r="7"/></svg>`);
    } else if (id==='batch') {
      const batch = [[2,4],[4,6],[2,4,6]][value('batch')];
      const slopes = batch.map(y=>2*(4-y));
      const g = slopes.reduce((a,b)=>a+b,0)/slopes.length;
      display([['Slopes at θ = 4',slopes.map(signed).join(', ')],['Average slope (g)',signed(g)]],
        g===0?'The slopes cancel. This batch suggests no move.':`The update subtracts the slope, so the prediction moves ${g>0?'lower':'higher'}.`);
    } else if (id==='signal') {
      const t = value('repeats'), multiplier = value('multiplier');
      const sequence = Array.from({length:t+1},(_,i)=>[i,multiplier**i]);
      display([['Repetitions (t)',t],['Signal size',multiplier===.5&&t>0?`1/${2**t}`:2**t]], '',
        chart({points:sequence, xMin:0, xMax:6, yMax:multiplier===2?64:1, dots:sequence, horizontal:'Repetitions', vertical:'Signal'}));
    } else if (id==='gradient') {
      const loss = x => x*x/2, max = Math.max(5,Math.ceil(Math.max(Math.abs(theta),Math.abs(previous ?? 0))));
      const points = Array.from({length:81},(_,i)=>{const x=max*(i/40-1);return [x,loss(x)]});
      display([['Parameter (θ)',number(theta)],['Slope here (g)',number(theta)],['Loss L(θ)',number(loss(theta))]],
        previous===null?'Choose a learning rate and take a step.':
          `Last move: ${number(previous)} → ${number(theta)}. Loss ${loss(theta)===loss(previous)?'stayed the same':loss(theta)>loss(previous)?'rose':'fell'} from ${number(loss(previous))} to ${number(loss(theta))}.`,
        chart({points,xMin:-max,xMax:max,yMax:loss(max),dots:[...(previous===null?[]:[[previous,loss(previous),true]]),[theta,loss(theta)]],horizontal:'Parameter θ',vertical:'Loss'}));
    } else if (id==='momentum') {
      display(last?[['Old contribution (αv)',signed(last.old)],['New contribution (−εg)',signed(last.fresh)],['Move (new v)',signed(v)]]:[['Starting velocity (v)',number(v)]],
        last?`Step ${t}. The new velocity is added to θ.`:'Choose a gradient and update the velocity.');
    } else if (['adagrad','rmsprop','adam'].includes(id)) {
      if (!last) return display([['History (r)',number(r)],...(id==='adam'?[['Direction (s)',number(s)]]:[])], 'Apply a gradient to see the update.');
      const values = [['Previous r → new r',`${number(last.r)} → ${number(r)}`]];
      if (id==='adam') values.push(['Raw direction (s)',number(s)],['Corrected direction (s′)',number(last.direction)],['Corrected scale (r′)',number(last.scale)]);
      values.push(['Parameter move (Δθ)',signed(last.move)]);
      display(values, `Step ${t}, with g = ${signed(last.g)}. The denominator is √${number(last.scale)} plus a tiny stability constant δ.`);
    } else if (id==='schedule') {
      const epoch = value('epoch'), schedule = control('schedule').value;
      const points = Array.from({length:101},(_,i)=>[i,rateAt(schedule,i)]);
      if (schedule==='multi') points.splice(75,0,[75,.05]), points.splice(40,0,[40,.1]);
      if (schedule==='restart') points.splice(50,0,[50,0]);
      display([['Epoch',epoch],['Learning rate (ε)',number(rateAt(schedule,epoch))]], '',
        chart({points,xMin:0,xMax:100,yMax:.1,dots:[[epoch,rateAt(schedule,epoch)]],horizontal:'Epoch',vertical:'Learning rate'}));
    }
  }

  lab.querySelectorAll('select, input').forEach(el=>el.addEventListener('input',render));
  const stepButton = lab.querySelector('[data-lab-step]');
  stepButton?.addEventListener('click',()=>{
    state.t++;
    if (id==='gradient') {
      state.previous = state.theta;
      state.theta -= value('rate')*state.theta;
      if (state.t===12) stepButton.disabled = true;
    } else if (id==='momentum') {
      const old = value('alpha')*state.v, fresh = -.5*value('g');
      state.v = old + fresh;
      state.last = {old, fresh};
    } else {
      const g = value('g'), r = state.r;
      state.r = id==='adagrad'?r+g*g:(r+g*g)/2;
      if (id==='adam') state.s = (state.s+g)/2;
      const correction = 1-.5**state.t;
      const direction = id==='adam'?state.s/correction:g, scale = id==='adam'?state.r/correction:state.r;
      state.last = {r, g, direction, scale, move:-.5*direction/(1e-8+Math.sqrt(scale))};
    }
    render();
  });
  lab.querySelector('[data-lab-reset]')?.addEventListener('click',()=>{
    state = initial();
    stepButton.disabled = false;
    render();
  });
  render();
}
