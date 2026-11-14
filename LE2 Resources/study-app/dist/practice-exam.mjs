import {renderDisplayMath, renderInlineMath as prose} from './inline-math.mjs';
import {source} from './tutor.mjs';

const marksFor = items => items.reduce((total, item) => total + item.marks, 0);
const markLabel = marks => `${marks} ${marks === 1 ? 'mark' : 'marks'}`;

function scratch(id, label) {
  return `<details class="exam-scratch">
    <summary>${label}</summary>
    <label class="sr-only" for="exam-draft-${id}">${label}</label>
    <textarea id="exam-draft-${id}" data-exam-draft="${id}" placeholder="Use the part numbers to label your answers…"></textarea>
  </details>`;
}

function solution({answer, steps}, sources) {
  return `<details class="exam-solution">
    <summary>Solution and marks</summary>
    ${steps.map(({formula, substitution, explanation}) => `<div class="exam-work">
      ${explanation ? `<p>${prose(explanation)}</p>` : ''}
      <span>Formula</span>${renderDisplayMath(formula)}
      <span>Substitute and simplify</span>${renderDisplayMath(substitution)}
    </div>`).join('')}
    <p>${prose(answer)}</p>
    ${sources}
  </details>`;
}

function questions(items, sourceLinks, lettered = false) {
  return `<ol class="exam-items"${lettered ? ' type="a"' : ''}>${items.map(item =>
    `<li>${prose(item.prompt)} <span class="exam-marks">(${markLabel(item.marks)})</span>${item.hint ? `<details class="problem-hint"><summary>Need a hint?</summary><p>${prose(item.hint)}</p></details>` : ''}${solution(item, sourceLinks(item))}</li>`).join('')}</ol>`;
}

export function renderExam({problems, theory}, {title = 'Practice exam', suggestedMinutes, sourceLinks = item => source(item.slide)} = {}) {
  const problemMarks = marksFor(problems.flatMap(problem => problem.parts));
  const theoryMarks = marksFor(theory);
  const total = problemMarks + theoryMarks;
  return `<article class="practice-exam" aria-labelledby="exam-title">
    <div class="exam-heading">
      <h3 id="exam-title">${title}</h3>
      <span>${markLabel(total)} · No calculator${suggestedMinutes ? ` · ${suggestedMinutes} min suggested` : ''}</span>
    </div>
    <p class="reference-intro">Work on paper or type below. Open the solution under each question when you’re ready to check your work. Typed answers stay in this tab until you reload.</p>
    <nav class="exam-jumps" aria-label="Practice exam sections">
      <a href="#exam-problems" data-tutor-jump>Multi-part problems</a>
      <a href="#exam-theory" data-tutor-jump>Short-answer theory</a>
    </nav>
    <section id="exam-problems" aria-labelledby="exam-problems-title">
      <h4 id="exam-problems-title" class="section-label">Part I · Multi-part problems <span>${markLabel(problemMarks)}</span></h4>
      ${problems.map(({title, setup, parts}, index) => `<article class="exam-problem">
        <h5>${index + 1}. ${prose(title)}</h5>
        <p>${prose(setup)}</p>
        ${questions(parts, sourceLinks, true)}
        ${scratch(`problem-${index + 1}`, `Type answers for problem ${index + 1}`)}
      </article>`).join('')}
    </section>
    <section id="exam-theory" aria-labelledby="exam-theory-title">
      <h4 id="exam-theory-title" class="section-label">Part II · Short-answer theory <span>${markLabel(theoryMarks)}</span></h4>
      <div class="exam-problem">${questions(theory, sourceLinks)}${scratch('theory', 'Type answers for short-answer theory')}</div>
    </section>
  </article>`;
}
