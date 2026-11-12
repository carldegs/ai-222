// Explicit, lesson-scoped references. Unmapped explanatory prose stays plain text.
export const conceptReferences=[
 [['loss',3],['Empirical risk',4],['minibatch',5],['Smaller batches',5],['generalization',5]],
 [['convex',6],['nonconvex',6],['local minimum',6],['local minima',6],['global optimality',6],['saddle points',7],['saddle',7],['saddles',7],['Hessian',7],['steep cliffs',8],['clipping',8],['exploding gradients',9],['vanishing gradients',9],['Noisy minibatch gradients',10],['gradient estimation noise',10],['initialization',11]],
 [['Glorot',13],['He initialization',14],['rectifier nonlinearities',14],['random weights',12],['Biases',15]],
 [['Stochastic gradient descent',18],['minibatch',18],['learning rate',17],['schedule',17]],
 [['Ordinary momentum',19],['Momentum',19],['velocity',21],['Nesterov',22],['lookahead position',23],['oscillation',20]],
 [['AdaGrad',24],['squared gradients',25],['square root',25],['effective learning rates',24],['accumulator',25]],
 [['RMSProp',26],['exponential moving average',26],['squared-gradient estimate',27],['decay',27],['AdaGrad',24]],
 [['Adam',28],['first moment',28],['second raw moment',28],['Bias correction',29],['Bias corrections',29]],
 [['Cosine decay',33],['Multistep decay',35],['Linear decay',37],['Cosine restarts',39],['warmup',41],['milestones',36],['restart',40]],
 [['Initialization',12],['optimizer',16],['learning-rate schedule',32],['Clipping',8],['SGD with momentum',21],['Adam',29],['performance depends on the task',44]]
];
const escapeHTML=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const escapeRegex=text=>text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export function renderInlineReferences(text,topic,referenceMap=conceptReferences){
 const terms=referenceMap[topic]||[];
 if(!terms.length)return escapeHTML(text);
 const sources=new Map(terms.map(([phrase,slide])=>[phrase.toLowerCase(),slide]));
 const pattern=new RegExp(`\\b(?:${terms.map(([phrase])=>phrase).sort((a,b)=>b.length-a.length).map(escapeRegex).join('|')})\\b`,'gi');
 let html='',offset=0;
 for(const match of String(text).matchAll(pattern)){
  const slide=sources.get(match[0].toLowerCase());
  html+=escapeHTML(text.slice(offset,match.index));
  html+=`<button type="button" class="inline-reference" data-slide="${slide}" title="Show slide ${slide} in the source panel" aria-label="${escapeHTML(match[0])}: show slide ${slide}" aria-controls="slides">${escapeHTML(match[0])}</button>`;
  offset=match.index+match[0].length;
 }
 return html+escapeHTML(text.slice(offset));
}
