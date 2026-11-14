import {fcnLab, pspLab} from './semantic-labs.mjs';
import {mountNmsLab, nmsLabMarkup} from './nms-walkthrough.mjs';
import {labFrame, range, readout} from '../tutor-lab.mjs';
import {alignLabMarkup, mountAlignLab} from './roi-align.mjs';

const protoA = [0,1,1,0, 0,1,1,0, 0,1,1,0, 0,1,1,0];
const protoB = [0,0,0,0, 0,0,0,0, 1,1,1,1, 1,1,1,1];
const svg = (width,height,body) => `<svg viewBox="0 0 ${width} ${height}">${body}</svg>`;
const read = (root,id) => root.querySelector('#'+id).valueAsNumber;

const labs = {
  fcn:fcnLab,
  psp:pspLab,
  prototype:{
    title:'Add or cancel part of a prototype',
    prompt:'Prototype A is a vertical strip and prototype B covers the lower half. Adjust B’s coefficient. The result shows pixels whose sigmoid probability exceeds one half.',
    controls:range('seg-prototype','Prototype B coefficient in half units',2,-1,-2),
    draw(root) {
      const coefficient = read(root,'seg-prototype')/2;
      const logits = protoA.map((value,i)=>value/2+coefficient*protoB[i]);
      const tiles = (values, x, label) => `<text x="${x+44}" y="19" text-anchor="middle">${label}</text>
        ${values.map((value,i)=>`<rect x="${x+i%4*22}" y="${31+Math.floor(i/4)*22}" width="21" height="21"
          fill="${value?'#5d927a':'#e5e9dd'}"/>`).join('')}`;
      const plot = svg(390,132,tiles(protoA,15,'Prototype A')+tiles(protoB,151,'Prototype B')+
        tiles(logits.map(value=>value>0),287,'Mask above 0.5'));
      return [plot,readout([['A coefficient','0.5'],['B coefficient',coefficient],
        ['Logit where both are active',0.5+coefficient],['Pixels above 0.5',logits.filter(value=>value>0).length]],
        'A zero logit maps to probability 0.5. This demo shows the assembled scores before any crop.')];
    }
  },
  memory:{
    title:'Advance the frame and inspect both memory queues',
    prompt:'Frame 1 is prompted. This example keeps that frame and the two newest unprompted frames. Move forward and watch which recent frame is replaced.',
    controls:range('seg-frame','Last processed frame',6,4,1),
    draw(root) {
      const frame = read(root,'seg-frame');
      const recent = [frame-1,frame].filter(n=>n>=2);
      const frames = Array.from({length:6},(_,i)=>{
        const n = i+1;
        const x = 12+i*64;
        const fill = n===1?'#eedec2':recent.includes(n)?'#cce1d1':'#ebece5';
        return `<rect x="${x}" y="19" width="54" height="54" rx="4" fill="${fill}"/>
          <text x="${x+27}" y="51" text-anchor="middle">${n}</text>`;
      }).join('');
      return [svg(396,92,frames),readout([['Prompted queue','1'],['Recent queue',recent.join(', ')||'Empty'],
        ['Most recently evicted',frame>=4?String(frame-2):'None']],
        'The prompted frame stays in its separate queue as the recent queue rolls forward.')];
    }
  }
};

export function segmentationLabMarkup(id) {
  if (id === 'fast-nms') return nmsLabMarkup('segmentation');
  if (id === 'align') return alignLabMarkup();
  const {title,prompt,controls} = labs[id];
  return labFrame(id,title,prompt,controls);
}

export function mountSegmentationLabs(container) {
  for (const root of container.querySelectorAll('[data-tutor-lab]')) {
    if (root.dataset.tutorLab === 'fast-nms') {
      mountNmsLab(root);
      continue;
    }
    if (root.dataset.tutorLab === 'align') {
      mountAlignLab(root);
      continue;
    }
    const lab = labs[root.dataset.tutorLab];
    const update = () => {
      const [plot,result] = lab.draw(root);
      root.querySelector('.lab-plot').innerHTML = plot;
      root.querySelector('.lab-result').innerHTML = result;
    };
    root.addEventListener('input',update);
    update();
  }
}
