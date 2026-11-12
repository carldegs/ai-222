export const choice = (id, label, options, selected) => `<label for="${id}">${label}</label><select id="${id}">${options.map(([value, name])=>
  `<option value="${value}" ${value === selected ? 'selected' : ''}>${name}</option>`).join('')}</select>`;
export const range = (id, label, max, initial, min = 0) =>
  `<label for="${id}">${label}</label><input id="${id}" type="range" min="${min}" max="${max}" value="${initial}">`;
export function labFrame(id, title, prompt, controls) {
  return `<section class="tutor-lab" data-tutor-lab="${id}" aria-labelledby="lab-title-${id}">
    <div class="eyebrow">TRY IT · TEACHING DEMO</div>
    <h4 id="lab-title-${id}">${title}</h4><p>${prompt}</p>
    <div class="lab-controls">${controls}</div>
    <div class="lab-plot" aria-hidden="true"></div>
    <div class="lab-result" role="status" aria-live="polite"></div>
  </section>`;
}

export function readout(values, message = '') {
  return `<dl>${values.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl>${message?`<p>${message}</p>`:''}`;
}

