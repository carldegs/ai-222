import {choice, readout} from '../tutor-lab.mjs';

const stages = [
  {size:2, name:'FCN-32s', input:'Coarse scores'},
  {size:4, name:'FCN-16s', input:'Aligned coarse + pool4'},
  {size:8, name:'FCN-8s', input:'Aligned FCN-16s + pool3'}
];

const coarse = [2,-2,2,-2];
const pool4 = [
  -3,0,0,0,
  0,0,0,0,
  0,0,0,0,
  -3,0,0,0
];

function upsample(scores,size) {
  return Array.from({length:size*size*4},(_,index)=>{
    const x=index%(size*2);
    const y=Math.floor(index/(size*2));
    return scores[Math.floor(y/2)*size+Math.floor(x/2)];
  });
}

export function fcnToyScores() {
  const alignedCoarse=upsample(coarse,2);
  const fused16=alignedCoarse.map((score,i)=>score+pool4[i]);
  const aligned16=upsample(fused16,4);
  const pool3=aligned16.map((_,i)=>i%8===4 && Math.floor(i/8)>=2 && Math.floor(i/8)<=5?3:0);
  const fused8=aligned16.map((score,i)=>score+pool3[i]);
  return {scores:[coarse,fused16,fused8],aligned16,pool3};
}

function grid(values,size,x,y,span,{selected=-1,color}){
  const cell=span/size;
  return values.map((value,i)=>{
    const left=x+(i%size)*cell;
    const top=y+Math.floor(i/size)*cell;
    return `<rect x="${left}" y="${top}" width="${cell}" height="${cell}" fill="${color(value)}"
      stroke="${i===selected?'#805827':'#faf9f5'}" stroke-width="${i===selected?3:1}"/>`;
  }).join('');
}

export const fcnLab={
  title:'Recover a narrow feature with skip connections',
  prompt:'Read the toy foreground-minus-background score maps from left to right. Choose a stage and inspect the same input location. Positive scores predict foreground. This demo uses nearest-neighbor resizing to make the additions easy to trace.',
  controls:choice('seg-fcn-stage','Prediction stage',stages.map((stage,i)=>[String(i),stage.name]),'0')
    +choice('seg-fcn-pixel','Inspect location',[['28','Thin edge'],['26','Object interior'],['30','Background']],'28'),
  draw(root){
    const stage=Number(root.querySelector('#seg-fcn-stage').value);
    const pixel=Number(root.querySelector('#seg-fcn-pixel').value);
    const {scores,aligned16,pool3}=fcnToyScores();
    const color=value=>value>0?'#669b7f':'#e7ebe2';
    const columns=stages.slice(0,stage+1).map(({size,name,input},i)=>{
      const x=15+i*148;
      const selected=Math.floor(Math.floor(pixel/8)*size/8)*size+Math.floor((pixel%8)*size/8);
      return `<text x="${x+58}" y="20" text-anchor="middle" font-weight="bold">${name}</text>
        ${grid(scores[i],size,x,33,116,{selected,color})}
        <text x="${x+58}" y="170" text-anchor="middle">${input}</text>`;
    }).join('');
    const {size}=stages[stage];
    const selected=Math.floor(Math.floor(pixel/8)*size/8)*size+Math.floor((pixel%8)*size/8);
    const score=scores[stage][selected];
    const earlier=stage===1?upsample(coarse,2)[selected]:aligned16[pixel];
    const skip=stage===1?pool4[selected]:pool3[pixel];
    return [`<svg viewBox="0 0 450 185">${columns}</svg>`,
      readout([['Score grid',`${size} × ${size}`],['Selected score',stage===0?score:`${earlier} + (${skip}) = ${score}`],
        ['Selected label',score>0?'Foreground':'Background']],
        'Green cells predict foreground. The outlined cell contains the selected input location. The final mask is resized to input resolution.')];
  }
};

const feature=Array.from({length:36},(_,i)=>2*(Math.floor(i/6)+i%6));
export function poolToyFeature(size) {
  const span=6/size;
  return Array.from({length:size*size},(_,index)=>{
    const row=Math.floor(index/size)*span;
    const col=(index%size)*span;
    let total=0;
    for(let dy=0;dy<span;dy++) for(let dx=0;dx<span;dx++) total+=feature[(row+dy)*6+col+dx];
    return total/(span*span);
  });
}

export const pspLab={
  title:'See which feature values a pooling bin summarizes',
  prompt:'This is one 6-by-6 feature channel. Choose a pooling grid and a location. The shaded region contributes to the selected bin’s average.',
  controls:choice('seg-psp-scale','Pooling grid',[['1','1 × 1'],['2','2 × 2'],['3','3 × 3'],['6','6 × 6']],'2')
    +choice('seg-psp-pixel','Feature location',[['7','Row 2, column 2'],['28','Row 5, column 5']],'7'),
  draw(root){
    const size=Number(root.querySelector('#seg-psp-scale').value);
    const pixel=Number(root.querySelector('#seg-psp-pixel').value);
    const span=6/size;
    const row=Math.floor(Math.floor(pixel/6)/span);
    const col=Math.floor((pixel%6)/span);
    const pooled=poolToyFeature(size);
    const values=(data,n,x,span)=>data.map((value,i)=>
      `<text x="${x+(i%n+.5)*span/n}" y="${36+(Math.floor(i/n)+.6)*span/n}" text-anchor="middle">${value}</text>`).join('');
    return [`<svg viewBox="0 0 395 204">
      <text x="22" y="21">Input feature channel</text><text x="223" y="21">Pooled channel</text>
      ${grid(feature,6,22,36,144,{selected:pixel,color:()=> '#eef1e9'})}
      <rect x="${22+col*span*24}" y="${36+row*span*24}" width="${span*24}" height="${span*24}" fill="#80aa91" fill-opacity=".32" stroke="#285e50"/>
      ${values(feature,6,22,144)}
      ${grid(pooled,size,223,36,144,{selected:row*size+col,color:()=> '#d9e7d9'})}
      ${values(pooled,size,223,144)}
    </svg>`,readout([['Values in selected bin',span*span],['Bin mean',pooled[row*size+col]],['Local feature value',feature[pixel]]],
      'The real module projects and upsamples each pooled branch, then stacks those features alongside the original local features.')];
  }
};
