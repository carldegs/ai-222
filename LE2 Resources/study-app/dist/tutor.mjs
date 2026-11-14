import {renderInlineMath as prose} from './inline-math.mjs';

export const source = (page, label = 'Slide ' + page) =>
  `<button class="tutor-source" type="button" data-slide="${page}" aria-label="${label} (open slide ${page})">${label} <span aria-hidden="true">↗</span></button>`;
const explained = text => text.split(/(\[\[\d+:[^\]]+\]\])/g).map(part => {
  const link = part.match(/^\[\[(\d+):([^\]]+)\]\]$/);
  return link ? source(Number(link[1]), prose(link[2])) : prose(part);
}).join('');

function illustration({page, box: [x, y, w, h], caption}, slideURL) {
  return `<figure class="tutor-figure">
    <button type="button" data-enlarge="${page}" aria-label="Enlarge original slide ${page}">
      <img src="${slideURL(page)}" alt="Original lecture slide ${page}. The highlighted area is described below.">
      <span class="tutor-spotlight" aria-hidden="true" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%"></span>
    </button>
    <figcaption>${source(page, 'From the deck')} <span>${prose(caption)}</span></figcaption>
  </figure>`;
}

function discussion(step, tutor, slideURL, showFormula, equationAnchor, practiceAndNotes) {
  const lab = step.lab ? tutor.labMarkup(step.lab) : '';
  return `<section class="tutor-discussion">
    <h3>${prose(step.title)}</h3>
    ${step.explain.map(p=>`<p class="body-copy">${explained(p)}</p>`).join('')}
    ${step.figure?illustration(step.figure,slideURL):''}
    ${step.labBeforeFormulas ? lab : ''}
    ${step.formulas?.length?`<div class="tutor-equations"${equationAnchor?' id="tutor-equations"':''}>
      <h4 class="section-label">Read the equation${step.formulas.length>1?'s':''}</h4>
      ${step.formulas.map(index=>showFormula(step.topic,index)).join('')}
    </div>`:''}
    ${step.labBeforeFormulas ? '' : lab}
    ${step.flow?tutor.flow:''}
    ${step.check?`<details class="tutor-check"><summary><span class="eyebrow">CHECK YOUR UNDERSTANDING</span>${prose(step.check[0])}</summary><p>${prose(step.check[1])}</p></details>`:''}
    ${step.bridge?`<p class="tutor-bridge"><b>Where this fits</b> ${prose(step.bridge)}</p>`:''}
    ${practiceAndNotes}
  </section>`;
}

export function renderTutor(tutor, lesson, {slideURL, showFormula, notesFor, practiceFor, completed}) {
  const {index, title, context, pages} = lesson;
  const last = index===tutor.lessons.length-1;
  const visiblePages = pages.filter(page=>page.slide!==1)
    .map(page=>({...page,steps:page.steps.filter(step=>!step.coveredBy)}))
    .filter(page=>page.steps.length);
  const equationStep = visiblePages.flatMap(page=>page.steps).find(step=>step.formulas?.length);
  const firstPractice = visiblePages.find(page=>page.problems.length);
  return `<article class="tutor" aria-labelledby="tutor-lesson-title">
    <div class="lesson-meta">
      <span class="lesson-number">LESSON ${index+1} / ${tutor.lessons.length}</span>
      <div class="tutor-lesson-links">
        ${equationStep?'<a class="tutor-practice-link" href="#tutor-equations" data-tutor-jump>Equations ↓</a>':''}
        ${firstPractice?`<a class="tutor-practice-link" href="#worked-problems-${firstPractice.slide}" data-tutor-jump>Worked problems ↓</a>`:''}
      </div>
    </div>
    <h2 id="tutor-lesson-title">${prose(title)}</h2>
    <p class="body-copy tutor-context">${explained(context)}</p>
    <div class="tutor-lesson-picker">
      <label for="tutor-lesson">Go to lesson</label>
      <select id="tutor-lesson">${tutor.lessons.map(item=>`<option value="${item.index}" ${item===lesson?'selected':''}>${item.index+1}. ${prose(item.title)}</option>`).join('')}</select>
    </div>
    <div class="tutor-sources"><span>Original slides</span> ${pages.map(page=>source(page.slide)).join('')}</div>
    ${visiblePages.map(page=>page.steps.map((step,i)=>{
      const extras = i===page.steps.length-1?notesFor(page)+practiceFor(page):'';
      return discussion(step,tutor,slideURL,showFormula,step===equationStep,extras);
    }).join('')).join('')}
    <nav class="tutor-actions" aria-label="Lesson navigation">
      ${index>0?`<button type="button" class="button subtle" data-walkthrough-lesson="${index-1}">← Previous lesson</button>`:'<span></span>'}
      ${last?'<button type="button" class="button primary" data-tutor-finish>Finish & practice →</button>':
        `<button type="button" class="button primary" data-next-lesson="${index+1}">Next lesson →</button>`}
    </nav>
    ${completed?'<button type="button" class="button subtle tutor-unread" data-complete>✓ Read · mark unread</button>':''}
  </article>`;
}
