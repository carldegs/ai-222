export function buildGroupedContent(groups, equations) {
  const lessons = [];
  const topics = [];
  const quickReference = {};
  for (const {title, summary, recall, steps} of groups) {
    const start = steps[0].slide;
    const length = steps.at(-1).end-start+1;
    const equationKeys = [...new Set(steps.flatMap(step=>step.formulas ?? []))];
    lessons.push({
      title,
      slides:Array.from({length},(_,i)=>start+i),
      formulas:equationKeys.map(key=>equations[key].formula)
    });
    topics.push({
      title,
      steps:steps.map(({formulas, ...step})=>({
        ...step,
        ...(formulas ? {formulas:formulas.map(key=>equationKeys.indexOf(key))} : {})
      }))
    });
    const sourceSlides = steps.flatMap(step=>[
      ...step.explain.flatMap(p=>Array.from(p.matchAll(/\[\[(\d+):/g),match=>Number(match[1]))),
      ...(step.formulas ?? []).map(key=>equations[key].slide)
    ]);
    quickReference[start] = {summary, recall, slides:[...new Set(sourceSlides)].sort((a,b)=>a-b)};
  }
  const topicFor = slide => lessons.findIndex(lesson=>lesson.slides.includes(slide));
  const equationContext = Object.fromEntries(Object.values(equations).map(({formula:[title],context})=>[title,context]));
  return {lessons,topics,quickReference,topicFor,equationContext};
}
