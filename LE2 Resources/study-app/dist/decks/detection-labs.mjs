import {mountVocLab,vocLabMarkup} from './voc-ap-lab.mjs';
import {choice, labFrame, range, readout} from '../tutor-lab.mjs';
import {mountNmsLab, nmsLabMarkup} from './nms-walkthrough.mjs';

function receptiveFieldGrid({size, x, column, region, title, caption}) {
  const cell = 18;
  const width = cell * size;
  const y = 78 - width / 2;
  const top = (size - region) / 2;
  const lines = Array.from({length: size - 1}, (_, index) => {
    const offset = cell * (index + 1);
    return `M${x + offset} ${y}v${width} M${x} ${y + offset}h${width}`;
  }).join(' ');
  const center = x + width / 2;
  const highlightedX = x + cell * (top + column - 1);
  return `<rect x="${x}" y="${y}" width="${width}" height="${width}" fill="#fbfaf6" stroke="#9aa9a0"/>
    <rect x="${highlightedX}" y="${y + top * cell}" width="${region * cell}" height="${region * cell}" fill="${region === 1 ? '#285e50' : '#c3dac9'}"/>
    <path d="${lines}" fill="none" stroke="#9aa9a0"/>
    <rect x="${highlightedX}" y="${y + top * cell}" width="${region * cell}" height="${region * cell}" fill="none" stroke="#285e50" stroke-width="2"/>
    <text x="${center}" y="163" text-anchor="middle" font-weight="bold">${title}</text>
    <text x="${center}" y="183" text-anchor="middle">${caption}</text>`;
}

const anchorBox = {sub:'a', name:'Anchor box', cx:6, cy:5, width:8, height:6, color:'#285e50'};
const objectBox = {sub:'b', name:'Labeled object box', cx:10, cy:7, width:4, height:8, color:'#86632b'};
const offsetOriginY = 50;
const pixelsPerUnit = 13;

function offsetBox(box, originX, showDimensions) {
  const cx = originX + box.cx * pixelsPerUnit;
  const cy = offsetOriginY + box.cy * pixelsPerUnit;
  const width = box.width * pixelsPerUnit;
  const height = box.height * pixelsPerUnit;
  const left = cx - width / 2;
  const top = cy - height / 2;
  const right = left + width;
  const bottom = top + height;
  const sub = suffix => `<tspan baseline-shift="sub" font-size="9">${box.sub}${suffix}</tspan>`;
  return `<rect x="${left}" y="${top}" width="${width}" height="${height}" fill="${box.color}" fill-opacity=".13" stroke="${box.color}" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="4" fill="${box.color}" stroke="white"/>
    ${showDimensions ? `
      <text x="${originX + 90}" y="20" text-anchor="middle" font-weight="bold">${box.name} (${box.sub})</text>
      <path d="M${originX} 50h185m-5-4 5 4-5 4 M${originX} 50v161m-4-5 4 5 4-5" fill="none" stroke="#718179"/>
      <text x="${originX - 7}" y="43" text-anchor="end">0</text>
      <text x="${originX + 191}" y="54">x</text>
      <text x="${originX - 3}" y="225">y</text>
      <path d="M${cx} 50V${cy}H${originX}" fill="none" stroke="${box.color}" stroke-dasharray="4 3"/>
      <text x="${cx}" y="42" text-anchor="middle">c${sub('x')} = ${box.cx}</text>
      <text x="${originX - 6}" y="${cy + 3}" text-anchor="end">c${sub('y')} = ${box.cy}</text>
      <path d="M${left} ${bottom + 7}h${width}m0-4v8 M${left} ${bottom + 3}v8
        M${right + 7} ${top}v${height}m-4 0h8 M${right + 3} ${top}h8" fill="none" stroke="${box.color}"/>
      <text x="${cx}" y="${bottom + 24}" text-anchor="middle">w${sub('')} = ${box.width}</text>
      <text x="${right + 12}" y="${cy + 4}">h${sub('')} = ${box.height}</text>` : ''}`;
}

const labs = {
  'box-offsets': {
    title:'Read the center, width, and height on each box',
    prompt:'Both panels use the same image coordinates. Follow the dashed lines from each center to the axes. Switch to Compare boxes to see how the center and size change.',
    controls:choice('detection-box-view','View',
      [['dimensions','Box measurements'],['compare','Compare boxes']],'dimensions'),
    draw(root) {
      const compare = root.querySelector('#detection-box-view').value === 'compare';
      const plot = `<svg viewBox="0 0 520 ${compare ? 208 : 235}">
        ${compare ? `
          ${offsetBox(anchorBox,145,false)}
          ${offsetBox(objectBox,145,false)}
          <path d="M227 115H275m-5-4 5 4-5 4 M275 119V136m-4-5 4 5 4-5" fill="none" stroke="#20382f" stroke-width="1.5"/>
          <text x="249" y="108" text-anchor="middle">4 right</text>
          <text x="283" y="129">2 down</text>
          <text x="155" y="68">Anchor (a)</text>
          <text x="310" y="91">Object box (b)</text>` :
          `${offsetBox(anchorBox,51,true)}${offsetBox(objectBox,303,true)}`}
      </svg>`;
      const values = compare
        ? [['Horizontal shift','(10 − 6) ÷ 8 = ½'],['Vertical shift','(7 − 5) ÷ 6 = ⅓'],
          ['Width term','log(4/8)'],['Height term','log(8/6)']]
        : [['Anchor center and size','(6, 5), 8 × 6'],['Object center and size','(10, 7), 4 × 8']];
      const message = compare
        ? 'Divide the center shifts by the anchor’s width and height. For the size terms, divide each object dimension by the matching anchor dimension, then take the log.'
        : 'Coordinates and dimensions are in pixels. The horizontal and vertical bars span the width and height of each rectangle.';
      return [plot,readout(values,message)];
    }
  },
  'receptive-field': {
    title:'Trace one feature cell back to the photo',
    prompt:'Start at the dark green cell on the right. Read leftward to find which cells feed it and which pixels feed those cells. Select a neighboring cell and watch its patch shift.',
    controls:choice('detection-feature-cell','Selected cell in the second layer',
      [['0','Left'],['1','Middle'],['2','Right']],'1'),
    draw(root) {
      const column = Number(root.querySelector('#detection-feature-cell').value);
      const grids = [
        {size:7, x:13, region:5, title:'Input image', caption:'5 × 5 pixels can contribute'},
        {size:5, x:222, region:3, title:'First layer', caption:'3 × 3 cells contribute'},
        {size:3, x:414, region:1, title:'Second layer', caption:'1 selected cell'}
      ];
      const plot = `<svg viewBox="0 0 506 195">
        ${grids.map(grid => receptiveFieldGrid({...grid, column})).join('')}
        <path d="M157 78h49m-6-5 6 5-6 5 M329 78h65m-6-5 6 5-6 5" fill="none" stroke="#547463" stroke-width="1.5"/>
        <text x="181" y="65" text-anchor="middle">3 × 3 filter</text>
        <text x="361" y="65" text-anchor="middle">3 × 3 filter</text>
      </svg>`;
      const position = ['left','middle','right'][column];
      const message = column === 1
        ? 'In this example both filters move one cell at a time. Switch to Left or Right to see what one step does to the input patch.'
        : 'The patch shifts by one input pixel and shares four of its five columns with the middle cell’s patch.';
      return [plot,readout([['Selected cell',position],['Receptive field','5 × 5 input pixels'],['Stride','1 input pixel']],message)];
    }
  },
  overlap: {
    title:'Slide two boxes past each other',
    prompt:'Both boxes are 4 by 4. Move the outlined box right and compare the shaded overlap with the total area covered.',
    controls:range('detection-shift','Horizontal shift in units',5,2),
    draw(root) {
      const shift = root.querySelector('#detection-shift').valueAsNumber;
      const shared = Math.max(0,4-shift)*4;
      const union = 32-shared;
      const left = 30+36*shift;
      const plot = `<svg viewBox="0 0 400 204">
        <rect x="30" y="26" width="144" height="144" rx="2" fill="#e0e9de" stroke="#285e50" stroke-width="2"/>
        <rect x="${left}" y="26" width="144" height="144" rx="2" fill="#e9dfc6" fill-opacity=".65" stroke="#86632b" stroke-width="2"/>
        <rect x="${left}" y="26" width="${shared*9}" height="144" fill="#7fa688" fill-opacity=".85"/>
        <text x="35" y="191">Box A</text><text x="${left+100}" y="191">Box B</text>
      </svg>`;
      const message = shared===0 ? 'The boxes share no area.' :
        shift===0 ? 'Both boxes cover exactly the same area.' : 'The union includes the shaded region just once.';
      return [plot,readout([['Shift',shift],['Shared area',shared],['Union',union],['IoU',`${shared}/${union} ≈ ${(shared/union).toFixed(2)}`]],message)];
    }
  },
  centerness: {
    title:'Move an FCOS prediction point inside a fixed box',
    prompt:'Move the point horizontally. The top and bottom distances stay equal. Look for what happens to the horizontal ratio and the ranking score.',
    controls:range('detection-point','Point position from the left side',10,5),
    draw(root) {
      const left = root.querySelector('#detection-point').valueAsNumber;
      const right = 10-left;
      const x = 30+34*left;
      const center = Math.sqrt(Math.min(left,right)/Math.max(left,right));
      const plot = `<svg viewBox="0 0 400 180">
        <rect x="30" y="25" width="340" height="120" rx="2" fill="#e4ebdf" stroke="#285e50" stroke-width="2"/>
        <path d="M30 85H370 M${x} 25V145" stroke="#547463" stroke-width="1.5" stroke-dasharray="4 3"/>
        <circle cx="${x}" cy="85" r="7" fill="#86632b" stroke="white" stroke-width="2"/>
        <text x="30" y="167">Left edge</text><text x="310" y="167">Right edge</text>
      </svg>`;
      return [plot,readout([['Left / right',`${left} / ${right}`],['Top / bottom','3 / 3'],
        ['Centerness',center.toFixed(2)],['Score at class probability 0.8',(0.8*center).toFixed(2)]],
        'The endpoints show the limit at a box edge. The training target here is illustrated for points inside the box.')];
    }
  }
};

export function detectionLabMarkup(id) {
  if (id === 'voc-ap') return vocLabMarkup();
  if (id === 'nms') return nmsLabMarkup('detection');
  const {title,prompt,controls} = labs[id];
  return labFrame(id,title,prompt,controls);
}

export function mountDetectionLabs(container) {
  for (const root of container.querySelectorAll('[data-tutor-lab]')) {
    if (root.dataset.tutorLab === 'voc-ap') {
      mountVocLab(root);
      continue;
    }
    if (root.dataset.tutorLab === 'nms') {
      mountNmsLab(root);
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
