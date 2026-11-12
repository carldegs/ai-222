import {labFrame, range, readout} from '../tutor-lab.mjs';

const labs = {
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
  const {title,prompt,controls} = labs[id];
  return labFrame(id,title,prompt,controls);
}

export function mountDetectionLabs(container) {
  for (const root of container.querySelectorAll('[data-tutor-lab]')) {
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
