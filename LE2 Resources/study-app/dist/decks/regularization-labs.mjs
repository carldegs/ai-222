import {choice, range, labFrame, readout} from '../tutor-lab.mjs';

const fits = [
  {page:17, name:'Straight line', train:'High', test:'High', note:'The line misses the bend in the data. Slide 17 calls this underfitting.'},
  {page:18, name:'Sixth-degree curve', train:'Low', test:'High', note:'The curve follows sample-specific detail. Slide 18 calls this overfitting.'},
  {page:19, name:'Quadratic curve', train:'Low', test:'Low', note:'The quadratic fits the underlying trend in the deck’s example.'}
];
const trainingError = [8,5,3,2,1];
const validationError = [9,6,4,5,7];
const foldScores = ['3/4','1/2','3/4','1'];

const labs = {
  capacity: {
    title:'Compare the three fits',
    prompt:'Switch models and look at the curve and the two errors reported by the slide.',
    controls:choice('lab-fit','Model capacity',fits.map(({page,name})=>[page,name]),17),
    render(control,slideURL) {
      const fit = fits.find(({page})=>page===Number(control('fit')));
      const visual = `<button class="lab-slide" type="button" data-enlarge="${fit.page}" aria-label="Enlarge original slide ${fit.page}">
        <img src="${slideURL(fit.page)}" alt="Slide ${fit.page}, ${fit.name} fitted to the lecture’s noisy examples">
      </button>`;
      const message = `${fit.note} <button type="button" class="tutor-source" data-slide="${fit.page}">Open slide ${fit.page} ↗</button>`;
      return [readout([['Training error',fit.train],['Test error',fit.test]],message),visual];
    }
  },
  penalty: {
    title:'Compare what L1 and L2 charge',
    prompt:'A fits the training data better but has a bigger weight. At λ = 1/4, switch the penalty rule and see which model has the smaller total.',
    controls:choice('lab-penalty','Penalty rule',[['l2','L2 · square the weight'],['l1','L1 · take the absolute value']],'l2')
      + choice('lab-strength','Penalty strength (λ)',[[0,'0'],[.125,'1/8'],[.25,'1/4'],[.5,'1/2'],[1,'1']],.25),
    render(control) {
      const strength = Number(control('strength'));
      const candidates = [
        {name:'A', loss:1, weight:-3},
        {name:'B', loss:2, weight:1}
      ].map(({name, loss, weight})=>{
        const amount = control('penalty')==='l1'?Math.abs(weight):weight**2;
        const penalty = strength*amount;
        return {name, loss, weight, penalty, total:loss+penalty};
      });
      const [a,b] = candidates;
      const rows = candidates.map(({name, loss, weight, penalty, total})=>`<tr>
        <th scope="row">${name}</th><td>${weight}</td><td>${loss}</td><td>${penalty}</td><td><strong>${total}</strong></td>
      </tr>`).join('');
      const table = `<table class="lab-penalty-table">
        <caption>Training objective for each candidate</caption>
        <thead><tr><th scope="col">Model</th><th scope="col">Weight</th><th scope="col">Data loss</th><th scope="col">Penalty</th><th scope="col">Total</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
      const message = a.total===b.total?'Both models have the same total.':`Model ${a.total<b.total?'A':'B'} has the lower training objective.`;
      return [`<p>${message}</p>`,table];
    }
  },
  cutmix: {
    title:'Change the patch and count the pixels',
    prompt:'Start with 16 bird pixels. Paste a square patch of cat pixels and watch the target change.',
    controls:range('lab-patch','Patch side in pixels',4,2),
    render(control) {
      const size = Number(control('patch'));
      const cat = size*size, bird = 16-cat;
      const grid = Array.from({length:16},(_,i)=> {
        const fromCat = i%4 >= 4-size && Math.floor(i/4) < size;
        return `<span class="lab-tile ${fromCat?'lab-tile-accent':''}">${fromCat?'Cat':'Bird'}</span>`;
      }).join('');
      const visual = `<div class="lab-tiles" aria-hidden="true">${grid}</div>`;
      return [readout([['Patch size',`${size} × ${size}`],['Bird target (λ)',`${bird}/16`],['Cat target (1 − λ)',`${cat}/16`]]),visual];
    }
  },
  'early-stop': {
    title:'Choose the checkpoint as training progresses',
    prompt:'These example losses follow the pattern on slide 41. Advance the epoch and compare the two columns.',
    controls:range('lab-epoch','Latest completed epoch',5,3,1),
    render(control) {
      const epoch = Number(control('epoch'));
      const seen = validationError.slice(0,epoch);
      const best = seen.indexOf(Math.min(...seen))+1;
      const bar = (value, className) => `<td><span class="lab-loss-bar ${className}" style="--loss-width:${value*10}%">${value}</span></td>`;
      const rows = seen.map((value,i)=>`<tr${i+1===best?' class="lab-best"':''}><th scope="row">${i+1}${i+1===best?' · best':''}</th>
        ${bar(trainingError[i],'')}${bar(value,'lab-validation')}</tr>`).join('');
      const visual = `<table class="lab-loss-table"><thead><tr><th scope="col">Epoch</th><th scope="col">Training loss</th><th scope="col">Validation loss</th></tr></thead><tbody>${rows}</tbody></table>`;
      const message = best===epoch ? 'The latest checkpoint has the lowest validation loss so far.' :
        `Keep epoch ${best} even though training loss has fallen further.`;
      return [readout([['Best epoch so far',best],['Best validation loss',validationError[best-1]]],message),visual];
    }
  },
  dropout: {
    title:'Compare the same unit with and without its mask',
    prompt:'The original activation is 6. Change the keep probability and inspect either training outcome or evaluation.',
    controls:choice('lab-keep','Keep probability (p)',[[.25,'1/4'],[.5,'1/2'],[.75,'3/4'],[1,'1']],.75)
      + choice('lab-mask','Pass',[['kept','Training · kept'],['dropped','Training · dropped'],['eval','Evaluation']],'kept'),
    render(control) {
      const keep = Number(control('keep'));
      const pass = control('mask');
      const value = pass==='eval' ? 6 : pass==='kept' ? 6/keep : 0;
      const message = pass==='eval' ? 'Evaluation uses the original activation.' :
        pass==='kept' ? 'The kept output is divided by p during training.' :
          keep===1 ? 'A dropped outcome has probability zero at p = 1.' : 'The dropped output is zero during training.';
      return [readout([['Activation on this pass',value],['Mean over training masks',6]],message)];
    }
  },
  folds: {
    title:'Rotate the validation fold',
    prompt:'Choose a run and see which data that run trains and validates on. The scores below are example accuracies.',
    controls:choice('lab-fold','Training run',foldScores.map((_,i)=>[i+1,'Run '+(i+1)]),1),
    render(control) {
      const selected = Number(control('fold'));
      const cells = foldScores.map((_,i)=>{
        const heldOut = i+1===selected;
        return `<span class="lab-tile ${heldOut?'lab-tile-accent':''}"><b>Fold ${i+1}</b>${heldOut?'Validate':'Train'}</span>`;
      }).join('');
      return [readout([['Held-out fold',selected],['Score for this fold',foldScores[selected-1]],['Mean over four folds','3/4']],
        'Start with a fresh model for each run.'),`<div class="lab-tiles lab-folds" aria-hidden="true">${cells}</div>`];
    }
  }
};

export function regularizationLabMarkup(id) {
  const {title,prompt,controls} = labs[id];
  return labFrame(id,title,prompt,controls);
}

export function mountRegularizationLab(root, slideURL) {
  const lab = root.querySelector('[data-tutor-lab]');
  if (!lab) return;
  const demo = labs[lab.dataset.tutorLab];
  const control = name => lab.querySelector('#lab-'+name).value;
  const result = lab.querySelector('.lab-result');
  const plot = lab.querySelector('.lab-plot');
  plot.removeAttribute('aria-hidden');
  function render() {
    const [readout,visual=''] = demo.render(control,slideURL);
    plot.innerHTML = visual;
    result.innerHTML = readout;
  }
  lab.addEventListener('input',render);
  render();
}
