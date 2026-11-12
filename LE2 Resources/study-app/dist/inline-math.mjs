const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function renderDisplayMath(tex){
 const escaped=escapeHTML(tex);
 return `<div class="math" data-math="${escaped}">${escaped}</div>`;
}
// Math is explicitly authored with $...$; ordinary text is never guessed as TeX.
export function renderInlineMath(value){
 const text=String(value);let result='',offset=0;
 for(const match of text.matchAll(/\$([^$\n]+)\$/g)){
  result+=escapeHTML(text.slice(offset,match.index));
  result+=`<span class="inline-math" data-inline-math="${escapeHTML(match[1])}">${escapeHTML(match[1])}</span>`;
  offset=match.index+match[0].length;
 }
 return result+escapeHTML(text.slice(offset));
}
