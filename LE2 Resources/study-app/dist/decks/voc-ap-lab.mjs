import {labFrame, readout} from '../tutor-lab.mjs';

const detections = [
  {score:'0.95', match:'Bottle A', correct:true},
  {score:'0.80', match:'Background', correct:false},
  {score:'0.65', match:'Bottle B', correct:true}
];

export function vocExample(count) {
  let found = 0;
  const points = detections.slice(0,count).map((d,index)=>{
    found += Number(d.correct);
    return {...d, found, reported:index+1, recall:found/2, precision:found/(index+1)};
  });
  const checkpoints=Array.from({length:11},(_,i)=>
    Math.max(0,...points.filter(point=>point.recall>=i/10).map(point=>point.precision)));
  return {points,checkpoints,ap:checkpoints.reduce((sum,value)=>sum+value,0)/11};
}

export function vocLabMarkup() {
  return labFrame('voc-ap','Build the precision–recall curve one box at a time',
    'Two bottles are labeled. A correct prediction must match a previously unmatched bottle at the fixed evaluation IoU threshold. Reveal the predictions in descending confidence.',
    '<button class="button" type="button" data-voc-back>Back</button><button class="button primary" type="button" data-voc-next>Next prediction</button>');
}

export function mountVocLab(root) {
  let step=0;
  const back=root.querySelector('[data-voc-back]');
  const next=root.querySelector('[data-voc-next]');
  const plot=root.querySelector('.lab-plot');
  const result=root.querySelector('.lab-result');
  const x=r=>58+330*r;
  const y=p=>162-132*p;
  function render(){
    const {points,checkpoints,ap}=vocExample(Math.min(step,3));
    const current=points.at(-1);
    const showAP=step===4;
    back.disabled=step===0;
    next.disabled=showAP;
    next.textContent=step>=3?'Show AP checkpoints':'Next prediction';
    plot.innerHTML=`<svg viewBox="0 0 430 208">
      <path d="M58 30V162H388 M58 96H388 M223 30V162" stroke="#9aa9a0" fill="none"/>
      <text x="12" y="18">Precision</text><text x="388" y="201" text-anchor="end">Recall</text>
      <text x="36" y="34">1</text><text x="29" y="100">½</text><text x="36" y="166">0</text>
      <text x="58" y="181" text-anchor="middle">0</text><text x="223" y="181" text-anchor="middle">½</text><text x="388" y="181" text-anchor="middle">1</text>
      ${showAP?checkpoints.map((value,i)=>`<path d="M${x(i/10)} 162V${y(value)}" stroke="#a78148" stroke-width="3" opacity=".65"/>`).join(''):''}
      <polyline points="${points.map(p=>`${x(p.recall)},${y(p.precision)}`).join(' ')}" stroke="#285e50" stroke-width="2" fill="none"/>
      ${points.map(p=>`<circle cx="${x(p.recall)}" cy="${y(p.precision)}" r="8" fill="${p.correct?'#285e50':'#984b31'}"/>
        <text x="${x(p.recall)}" y="${y(p.precision)+3}" text-anchor="middle" style="fill:white;font-size:9px">${p.reported}</text>`).join('')}
    </svg>`;
    result.innerHTML=showAP
      ?readout([['Recall 0 through 0.5','6 checkpoints at precision 1'],['Recall 0.6 through 1','5 checkpoints at precision 2/3'],['VOC 2007 AP',`28/33 ≈ ${ap.toFixed(3)}`]],
        'At each checkpoint, take the best precision at that recall or higher. Average the 11 heights.')
      :current?readout([['Prediction',`${current.reported} of 3 · confidence ${current.score}`],
        ['Result',`${current.correct?'True positive':'False positive'} · ${current.match}`],
        ['Precision',`${current.found}/${current.reported}`],['Recall',`${current.found}/2`]],
        current.correct?'This prediction finds a new bottle.':'One more box was reported, but the number of bottles found stayed the same.')
      :readout([['Predictions revealed','0 of 3']], 'Start with the highest-confidence prediction.');
  }
  back.addEventListener('click',()=>{step--;render();});
  next.addEventListener('click',()=>{step++;render();if(next.disabled)back.focus();});
  render();
}
