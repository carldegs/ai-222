import {getDeck,decks} from './decks.mjs';
import {renderInlineMath as prose} from './inline-math.mjs';
import {renderInlineReferences} from './references.mjs?v=regularization-1';
import {clampSlide,readLessonProgress,reviewQueue} from './state.mjs?v=lesson-progress-2';
import {renderTutor} from './tutor.mjs';
import {renderExam} from './practice-exam.mjs';
const deck=getDeck(location.pathname);
const {lessons:topics,questions,resources,equationContext,notationBasics,minibatchAdvantages,challengeConnections,trainingScenario}=deck;
const $=s=>document.querySelector(s), main=$('#content');
function linked(text,index=topic){return String(text).split(/(\$[^$\n]+\$)/).map(part=>part.startsWith('$')?prose(part):renderInlineReferences(part,index,deck.references)).join('')}
function slideURL(n){return `${deck.assetPrefix}${String(n).padStart(2,'0')}.webp`}

const tutor=deck.tutor;
let progress=readLessonProgress(null,tutor.lessons,topics.length), storageOK=true;
try{
 progress=readLessonProgress(localStorage.getItem(deck.storageKey),tutor.lessons,topics.length);
}catch{storageOK=false}
let walkthroughPage=tutor.pages[0];
const currentLesson=()=>tutor.lessons[walkthroughPage.lessonIndex];
let topic=0,tab='learn',slide=2,filter='exam',questionIndex=0,revealed=false,slideOpen=true;
const examDrafts=new Map();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ref=(n,label)=>`<button class="slide-ref" data-slide="${n}">${label||`Slide ${n}`} ↗</button>`;
function definitions(items){return `<dl class="symbol-definitions">${items.map(([symbol,meaning])=>`<div><dt>${prose(symbol)}</dt><dd>${prose(meaning)}</dd></div>`).join('')}</dl>`}
function symbolTable(items){return `<table class="symbol-table" aria-label="What each symbol means"><thead><tr><th scope="col">Symbol</th><th scope="col">Meaning</th></tr></thead><tbody>${items.map(([symbol,meaning])=>`<tr><th scope="row">${prose(symbol)}</th><td>${prose(meaning)}</td></tr>`).join('')}</tbody></table>`}
function notationPrimer(){return `<details class="notation-primer"><summary>${esc(deck.notationTitle??'New to the notation? Start here: θ, ∇, Σ, and more')}</summary><p>You do not need to know every symbol before starting. Use this guide whenever the notation gets in the way of the idea.</p>${definitions(notationBasics)}</details>`}
function minibatchGuide(){return `<section class="minibatch-guide" aria-label="How minibatch stochastic training helps"><h3 class="section-label">Why minibatches help — advantage by advantage</h3><p class="body-copy">A minibatch is a small group of training examples used for one update. “Stochastic” means the gradient depends on the sampled examples. The deck’s ${ref(5,'minibatch advantages')} connect to computation, memory, and learning behavior in different ways.</p>${minibatchAdvantages.map((a,i)=>`<article class="mechanism-card"><h4><span class="mechanism-number">${String(i+1).padStart(2,'0')}</span>${esc(a.title)}</h4><p><b>How it helps:</b> ${esc(a.mechanism)}</p><div class="mechanism-example"><b>Picture it:</b> ${esc(a.example)}</div><p class="mechanism-limit"><b>Tradeoff:</b> ${esc(a.tradeoff)}</p></article>`).join('')}<p class="origin-note">These are expanded explanations of slide 5. The variance scaling assumes independent sampling and finite variance; the hardware discussion and examples clarify the deck’s practical heuristics.</p></section>`}
function connectionGuide({index,compact=false,sourcePage}={}){const entries=sourcePage?challengeConnections.filter(c=>c.slide===sourcePage):challengeConnections;if(!entries.length)return '';return `<section class="connection-guide" aria-label="Training challenges and remedies"><h3 class="section-label">${compact?'Match the challenge to the method':'What these methods help with'}</h3><p class="body-copy">Identify the symptom, explain the mechanism, then state the limitation. These tools address different parts of training and can work together; they do not guarantee that every challenge is solved.</p>${compact?`<div class="table-wrap"><table><thead><tr><th>Challenge</th><th>What helps</th><th>How it helps</th></tr></thead><tbody>${entries.map(c=>`<tr><td>${esc(c.challenge)}</td><td>${ref(c.slide,c.method)}${c.extraSlide?' '+ref(c.extraSlide):''}</td><td>${esc(c.mechanism)}<br><small><b>Limit:</b> ${esc(c.limit)}</small></td></tr>`).join('')}</tbody></table></div>`:entries.map(c=>`<article class="mechanism-card"><div class="eyebrow">CHALLENGE</div><h4>${esc(c.challenge)}</h4><div class="method-links"><span>What helps:</span> ${ref(c.slide,c.method)} ${c.extraSlide?ref(c.extraSlide):''}</div><p><b>How it helps:</b> ${esc(c.mechanism)}</p><p class="mechanism-limit"><b>Limit:</b> ${esc(c.limit)}</p>${index!==c.lesson?`<button class="button subtle" data-lesson="${c.lesson}">Read the method’s lesson →</button>`:''}</article>`).join('')}</section>`}
function formula(f,{compact=false}={}){const c=equationContext[f[0]];return `<div class="formula-card"><div class="formula-title">${esc(f[0])}</div>${c&&tab==='learn'?`<p class="equation-purpose">${prose(c.purpose)}</p>`:''}<div class="math" data-math="${esc(f[1])}">${esc(f[1])}</div><div class="formula-note">${esc(f[2])}</div>${c?`<p class="equation-reading"><b>Read it as:</b> ${prose(c.read)}</p><details class="equation-explanation" ${tab==='learn'&&!compact?'open':''}><summary>Understand the symbols & see an example</summary>${tab!=='learn'?`<p class="equation-purpose">${prose(c.purpose)}</p>`:''}<h4>What each symbol means</h4>${symbolTable(c.symbols)}<div class="equation-mini-example"><span class="eyebrow">A SMALL EXAMPLE</span><p>${prose(c.example)}</p></div><p class="equation-insight"><b>The connection:</b> ${prose(c.insight)}</p></details>`:''}</div>`}
function solutionSteps(steps){return `<ol class="solution-steps">${steps.map(step=>`<li><p>${prose(step.text)}</p>${step.math?`<div class="math" data-math="${esc(step.math)}">${esc(step.math)}</div>`:''}</li>`).join('')}</ol>`}
function workedExamples({problems,slide}){if(!problems.length)return '';return `<div class="worked-problems" id="worked-problems-${slide}">${problems.map(e=>`<article class="worked-card"><div class="worked-meta"><span class="eyebrow">${esc(e.kind)} · NO CALCULATOR · WORKED PROBLEM</span>${ref(e.slide,'Source concept')}</div><h4>${esc(e.title)}</h4><p class="problem-statement">${prose(e.problem)}</p><details class="problem-hint"><summary>Need a hint?</summary><p>${prose(e.hint)}</p></details><details class="worked-solution"><summary><span class="when-closed">Show step-by-step solution</span><span class="when-open">Hide step-by-step solution</span></summary>${solutionSteps(e.solution)}<div class="solution-takeaway"><b>What this tells you</b><p>${prose(e.takeaway)}</p></div><p class="solution-trap"><b>Common mistake:</b> ${prose(e.trap)}</p></details><div class="practice-variation"><div class="eyebrow">YOUR TURN · A VARIATION</div><p>${prose(e.practice.problem)}</p><details class="worked-solution"><summary><span class="when-closed">Check the solution</span><span class="when-open">Hide the solution</span></summary>${solutionSteps(e.practice.solution)}</details></div></article>`).join('')}</div>`}
function math(){document.querySelectorAll('[data-math], [data-inline-math]').forEach(e=>{if(window.katex)window.katex.render(e.dataset.inlineMath??e.dataset.math,e,{displayMode:!e.hasAttribute('data-inline-math'),throwOnError:false,output:'htmlAndMathml'})})}
function save(){try{localStorage.setItem(deck.storageKey,JSON.stringify(progress))}catch{storageOK=false}drawNav()}
function drawNav(){
 const current=currentLesson();
 $('#topics').innerHTML=tutor.lessons.map(({index,title})=>{
  const active=current.index===index;
  const marker=progress.completed.includes(index)?'✓':String(index+1).padStart(2,'0');
  return `<button type="button" class="topic ${active?'selected':''}" data-walkthrough-lesson="${index}" ${active?'aria-current="page"':''}><span class="topic-dot" aria-hidden="true">${marker}</span><span>${esc(title)}</span></button>`;
 }).join('');
 $('#progress-label').textContent=`${progress.completed.length} / ${tutor.lessons.length}`;
 $('#progress-fill').style.width=`${progress.completed.length/tutor.lessons.length*100}%`;
 $('#save-status').textContent=storageOK?'Saved in this browser':'Progress is session-only; browser storage unavailable';
 drawRelatedSlides();
}
function drawRelatedSlides(){
 const related=tab==='learn'?currentLesson():tutor.lessons[tutor.pages[slide-1].lessonIndex];
 $('.related .eyebrow').textContent=tab==='learn'?'THIS LESSON’S SLIDES':'RELATED SLIDES';
 const list=$('#related-slides');
 if(list.dataset.lesson===String(related.index))return;
 list.dataset.lesson=related.index;
 list.innerHTML=related.pages.map(({slide:n})=>ref(n,String(n))).join('');
}
function goSlide(n,open=true){
 slide=clampSlide(n,deck.slideCount);
 $('#slide-image').src=slideURL(slide);
 $('#slide-image').alt=`Original ${deck.title} deck, slide ${slide}`;
 $('#slide-number').value=slide;
 $('#prev-slide').disabled=slide===1;
 $('#next-slide').disabled=slide===deck.slideCount;
 if(open&&!slideOpen)toggleSlides();
 $('#announcement').textContent=`Showing original slide ${slide}`;
 drawRelatedSlides();
}
function toggleSlides(){
 slideOpen=!slideOpen;
 $('#study-layout').classList.toggle('no-slides',!slideOpen);
 const toggle=$('#toggle-slides');
 toggle.textContent=slideOpen?'Hide slides':'Show slides';
 toggle.setAttribute('aria-expanded',slideOpen);
}
function enlarge(n=slide){$('#dialog-image').src=slideURL(n);$('#dialog-image').alt=`Original ${deck.title} slide ${n}`;$('#dialog-caption').textContent=`Slide ${n} / ${deck.slideCount} · ${deck.title} — Rowel Atienza, UP, 2025`;$('#image-dialog').showModal()}
const lessonReferences = tutor.lessons.map(({index,title,pages}) => {
 const entry=deck.quickReference[pages[0].slide];
 const formulas=[...new Set(pages.flatMap(page=>page.steps).flatMap(step=>
  (step.formulas??[]).map(i=>topics[step.topic].formulas[i])))];
 return {...entry,index,title,formulas};
});

function reference(){
 return `<div class="lesson-meta"><span class="lesson-number">KEEP THE ESSENTIALS</span><span>${tutor.lessons.length} lessons</span></div>
 <h2>Your quick reference</h2><p class="reference-intro">Review the main idea and a detail worth remembering from each lesson. Open the symbol explanations for definitions and examples.</p>${notationPrimer()}
 <label class="sr-only" for="formula-search">Search formulas and concepts</label>
 <input id="formula-search" class="search" placeholder="Search formulas, methods, or symbols…" type="search">
 ${challengeConnections.length?`<details class="connections-reference"><summary>Match a training problem to a method</summary>${connectionGuide({compact:true})}</details>`:''}
 <div id="reference-results">${referenceResults('')}</div>`;
}

function referenceResults(value){
 const query=value.trim().toLowerCase();
 const results=lessonReferences.map(({title,index,summary,recall,slides,formulas})=>{
  const matchesText=[title,summary,recall].join(' ').toLowerCase().includes(query);
  const matchesFormula=formulas.flat().join(' ').toLowerCase().includes(query);
  if(!matchesText&&!matchesFormula)return '';
  return `<section class="reference-group">
   <h3>${esc(title)}</h3>
   <p class="body-copy">${prose(summary)}</p>
   <p class="caveat">${prose(recall)}</p>
   ${formulas.length?`<details class="connections-reference" open>
    <summary>${formulas.length===1?'Equation':'Equations'}</summary>${formulas.map(f=>formula(f)).join('')}
   </details>`:''}
   <button type="button" class="button" data-walkthrough-lesson="${index}">Open lesson ${index+1} →</button>
   ${slides.map(n=>ref(n)).join(' ')}
  </section>`;
 }).join('');
 return results||'<p class="empty">No matching formulas or concepts. Try a shorter term or a method name.</p>';
}
function queue(){return reviewQueue(questions,progress.ratings,filter)}
const practiceModes=[['exam','Practice exam'],['flashcard','Flashcards'],['theory','Theory drills'],['computation','Computations'],['all','All drills'],['weak','Review weak spots']];
function testView(){
 return `<h2>Test yourself</h2><div class="toolbar" role="group" aria-label="Practice mode">${practiceModes.map(([mode,label])=>`<button type="button" class="filter ${filter===mode?'selected':''}" data-filter="${mode}" aria-pressed="${filter===mode}">${label}</button>`).join('')}</div>
 ${filter==='exam'?renderExam(deck.exam):drillView()}`;
}
function drillView(){const qs=queue();questionIndex=Math.min(questionIndex,Math.max(0,qs.length-1));const q=qs[questionIndex];return `<p class="reference-intro">Answer first, then reveal the reasoning and rate your recall.</p>
 ${q?`<div class="question-top"><span>${esc(q.type.toUpperCase())} · ${topics[q.topic].title}</span><span>${questionIndex+1} / ${qs.length}</span></div><article class="question-card"><span class="eyebrow">${q.type==='computation'?'✎ NO CALCULATOR':'TAKE A MOMENT TO THINK'}</span><h3>${prose(q.prompt)}</h3><label class="sr-only" for="scratch">Your answer, not graded or saved</label><textarea id="scratch" placeholder="Your answer or scratch work (optional, not saved)…"></textarea>${!revealed?'<button class="button primary" data-reveal>Reveal answer ↓</button>':`<div class="answer"><h4>THE REASONING</h4><p>${prose(q.answer)}</p><div class="marking"><b>Check your answer:</b> ${prose(q.check)}</div><div class="ratings">${[['again','Again'],['unsure','Unsure'],['got','Got it ✓']].map(([k,v])=>`<button class="button ${progress.ratings[q.id]===k?'primary':''}" data-rate="${k}">${v}</button>`).join('')}</div><p class="origin-note">Rate your recall to save it and move to the next question.</p></div>`}</article><div class="quiz-footer"><button class="button" data-question="-1" ${questionIndex===0?'disabled':''}>← Previous</button><button class="button subtle" data-lesson="${q.topic}">Revisit concept ↗</button><button class="button" data-question="1" ${questionIndex===qs.length-1?'disabled':''}>Next →</button></div>`:`<div class="empty"><b>No weak spots to review yet.</b><br>Questions rated Again or Unsure appear here.<br><button class="button" data-filter="all">Practice all questions →</button></div>`}
 <p class="quiz-stats">${Object.values(progress.ratings).filter(v=>v==='got').length} / ${questions.length} marked Got it · ${Object.values(progress.ratings).filter(v=>v==='again'||v==='unsure').length} to revisit · Ratings stay in this browser.</p>`}
function further(){return `<div class="lesson-meta"><span class="lesson-number">APPENDIX · OPTIONAL EXPLORATION</span></div><h2>A little further.</h2><p class="lead">Another explanation can make the same idea click.</p><p class="reference-intro">Curated original sources to reinforce the deck or go deeper. Time estimates are approximate. These supplements are not additional assumed exam requirements. External links need an internet connection.</p>${resources.map(r=>`<article class="resource"><div class="resource-meta"><b>${r.tag}</b><span>${r.time}</span></div><h3>${r.title}</h3><div class="author">${r.author}</div><p>${r.text}</p><a href="${r.url}" target="_blank" rel="noopener noreferrer">Open resource ↗</a><div class="toolbar">${r.topics.map(i=>`<button class="slide-ref" data-lesson="${i}">${topics[i].title}</button>`).join('')}</div></article>`).join('')}<p class="origin-note">Original slide illustrations are linked to their source pages.</p>`}
function tutorNotes(page){
 const minibatches=page.slide===5&&minibatchAdvantages.length?minibatchGuide():'';
 const caveats=page.notes.map(index=>`<p class="caveat">${linked(topics[index].caveat,index)}</p>`).join('');
 const scenario=page.slide===deck.slideCount&&trainingScenario.length?`<div class="training-scenario"><h4>Putting several tools together</h4><p>A run can change behavior over time. Match each observation to its likely cause before changing the training setup.</p><ol class="steps">${trainingScenario.map(([symptom,action])=>`<li><span><b>${esc(symptom)}.</b> ${esc(action)}</span></li>`).join('')}</ol></div>`:'';
 return `${minibatches}${connectionGuide({index:page.topic,sourcePage:page.slide})}${caveats}${scenario}`;
}
function tutorSlide(){
 return tab==='learn'?walkthroughPage.slide:topics[topic].slides[0];
}
function render(focus=false){
 drawNav();
 document.querySelectorAll('[data-tab]').forEach(button=>{
  const active=button.dataset.tab===tab;
  button.classList.toggle('selected',active);
  button.setAttribute('aria-current',active?'page':'false');
 });
 if(tab==='learn'){
  main.innerHTML=renderTutor(tutor,currentLesson(),{
   slideURL,
   showFormula:(topicIndex,formulaIndex)=>formula(topics[topicIndex].formulas[formulaIndex],{compact:true}),
   notesFor:tutorNotes,
   practiceFor:workedExamples,
   completed:progress.completed.includes(currentLesson().index)
  });
  tutor.mountLab(main,slideURL);
 }else{
  main.innerHTML=tab==='reference'?reference():tab==='test'?testView():further();
  for(const field of main.querySelectorAll('[data-exam-draft]'))field.value=examDrafts.get(field.dataset.examDraft)??'';
 }
 math();
 if(focus)main.focus({preventScroll:true});
 const route=tab==='learn'?`#slide/${walkthroughPage.slide}`:`#${tab}/${topic+1}`;
 history.replaceState(null,'',route);
}
function setWalkthroughPage(n){
 walkthroughPage=tutor.pages[clampSlide(n,deck.slideCount)-1];
 topic=walkthroughPage.topic;
}
function openTopic(n){
 const index=Math.max(0,Math.min(topics.length-1,n));
 chooseTutorPage(tutor.topics[index].steps[0].slide);
}
function focusSection(el){el.tabIndex=-1;el.focus({preventScroll:true});el.scrollIntoView({block:'start'})}
function chooseTutorPage(n){
 tab='learn';
 setWalkthroughPage(n);
 goSlide(walkthroughPage.slide,false);
 render(true);
 window.scrollTo({top:0});
}
function setLessonComplete(completed){
 const index=currentLesson().index;
 progress.completed=progress.completed.filter(value=>value!==index);
 if(completed)progress.completed.push(index);
 save();
}
function chooseLesson(index){
 chooseTutorPage(tutor.lessons[index].pages[0].slide);
}
main.addEventListener('change',e=>{
 if(e.target.id==='tutor-lesson')chooseLesson(Number(e.target.value));
});
main.addEventListener('click',e=>{
 const jump=e.target.closest('[data-tutor-jump]');
 if(!jump)return;
 e.preventDefault();
 focusSection($(jump.hash));
});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.slide)goSlide(b.dataset.slide);
 else if(b.dataset.enlarge)enlarge(Number(b.dataset.enlarge));
 else if(b.dataset.walkthroughLesson!==undefined)chooseLesson(Number(b.dataset.walkthroughLesson));
 else if(b.dataset.lesson!==undefined)openTopic(Number(b.dataset.lesson));
 else if(b.dataset.tab){tab=b.dataset.tab;if(tab==='learn'){topic=walkthroughPage.topic;goSlide(tutorSlide(),false)}render(true);window.scrollTo({top:0,behavior:'smooth'})}
 else if(b.dataset.nextLesson){
  setLessonComplete(true);
  chooseLesson(Number(b.dataset.nextLesson));
 }
 else if(b.hasAttribute('data-tutor-finish')){
  setLessonComplete(true);
  tab='test';render(true);window.scrollTo({top:0});
 }
 else if(b.hasAttribute('data-complete')){setLessonComplete(false);render()}
 else if(b.dataset.filter){filter=b.dataset.filter;questionIndex=0;revealed=false;render(true)}
 else if(b.hasAttribute('data-reveal')){const draft=$('#scratch')?.value||'';revealed=true;render();$('#scratch').value=draft}
 else if(b.dataset.question){questionIndex+=Number(b.dataset.question);revealed=false;render(true)}
 else if(b.dataset.rate){const current=queue()[questionIndex];if(!current)return;progress.ratings[current.id]=b.dataset.rate;save();if(filter!=='weak'||b.dataset.rate!=='got')questionIndex++;if(questionIndex>=queue().length)questionIndex=0;revealed=false;render(true);$('#announcement').textContent=`Rated ${b.textContent}. ${queue().length?'Next practice question.':'Review queue complete.'}`}
});
main.addEventListener('input',e=>{
 if(e.target.id==='formula-search'){$('#reference-results').innerHTML=referenceResults(e.target.value);math()}
 if(e.target.hasAttribute('data-exam-draft'))examDrafts.set(e.target.dataset.examDraft,e.target.value);
});
$('#toggle-slides').onclick=toggleSlides;$('#prev-slide').onclick=()=>goSlide(slide-1);
$('#next-slide').onclick=()=>goSlide(slide+1);
$('#slide-number').oninput=e=>{const value=Number(e.target.value);if(Number.isInteger(value)&&value>=1&&value<=deck.slideCount)goSlide(value)};$('#slide-number').onchange=e=>goSlide(e.target.value);$('#enlarge-slide').onclick=()=>enlarge();$('#close-dialog').onclick=()=>$('#image-dialog').close();$('#image-dialog').onclick=e=>{if(e.target===$('#image-dialog'))$('#image-dialog').close()};
const divider=$('#divider');function resize(clientX){const box=$('#study-layout').getBoundingClientRect();const width=Math.max(270,Math.min(box.width*.55,box.right-clientX));$('#study-layout').style.gridTemplateColumns=`minmax(340px,1fr) 12px ${width}px`}
divider.addEventListener('pointerdown',e=>{divider.setPointerCapture(e.pointerId);divider.onpointermove=e=>resize(e.clientX);divider.onpointerup=()=>{divider.onpointermove=null}});
divider.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();resize(divider.getBoundingClientRect().left+(e.key==='ArrowLeft'?-20:20))}});
function readRoute(){
 const pageHash=location.hash.match(/^#slide\/(\d+)$/);
 if(pageHash){
  tab='learn';
  setWalkthroughPage(Number(pageHash[1]));
  return;
 }
 const hash=location.hash.match(/^#(learn|reference|test|further)\/(\d+)(?:\/(\d+))?$/);
 if(!hash)return;
 tab=hash[1];
 const index=Math.max(0,Math.min(topics.length-1,Number(hash[2])-1));
 const steps=tutor.topics[index].steps;
 const step=Math.max(0,Math.min(steps.length-1,Number(hash[3]??1)-1));
 setWalkthroughPage(steps[step].slide);
 if(tab!=='learn')topic=index;
}
readRoute();
window.addEventListener('hashchange',()=>{readRoute();goSlide(tutorSlide(),false);render()});
document.title=`${deck.title} · AI 222 Exam 2`;
$('.workspace-title h1').textContent=deck.title;
$('#topics').setAttribute('aria-label',`${deck.title} lessons`);
const deckNav=$('#deck-navigation');
deckNav.innerHTML=Object.values(decks).map(d=>`<a class="deck ${d.id===deck.id?'active':''}" href="${d.href}" ${d.id===deck.id?'aria-current="page"':''}><span>${d.number}</span><div>${d.title}<small>${d.slideCount} slides · ${d.tutor.lessons.length} lessons</small></div>${d.id===deck.id?'<b>⌄</b>':''}</a>${d.id===deck.id?'<div id="topic-slot"></div>':''}`).join('');
$('#topic-slot').replaceWith($('#topics'));
$('#slides .icon-link').href=deck.pdf;
$('#slide-number').max=deck.slideCount;
$('.slide-controls label span').textContent=`/ ${deck.slideCount}`;
$('.source-credit').innerHTML=`Source: <i>${deck.sourceTitle??deck.title}</i>, Rowel Atienza, University of the Philippines, updated 2025. Figures reproduced from your supplied deck for personal study.`;
goSlide(tutorSlide(),false);render();
