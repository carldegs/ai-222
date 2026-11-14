export function clampSlide(value,total=44){return Math.max(1,Math.min(total,Math.trunc(Number(value))||1))}
export function readProgress(raw,lessonCount=10){
 const empty={completed:[],ratings:{}};
 try {const x=JSON.parse(raw);if(!x||typeof x!=='object')return empty;
 return {completed:[...new Set((Array.isArray(x.completed)?x.completed:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<lessonCount))],ratings:Object.fromEntries(Object.entries(x.ratings&&typeof x.ratings==='object'?x.ratings:{}).filter(([,v])=>['again','unsure','got'].includes(v)))};
 }catch{return empty}
}
export function reviewQueue(questions,ratings,filter){return questions.filter(q=>filter==='weak'?['again','unsure'].includes(ratings[q.id]):filter==='all'||q.type===filter)}

export function readLessonProgress(raw, lessons, topicCount) {
 let version;
 try {version=JSON.parse(raw)?.version} catch {}
 if(version===2)return {version:2,...readProgress(raw,lessons.length)};

 const legacy=readProgress(raw,topicCount);
 const completedTopics=new Set(legacy.completed);
 const completed=[];
 for (const [index,lesson] of lessons.entries()) {
  if (lesson.pages.every(page=>completedTopics.has(page.topic))) completed.push(index);
 }
 return {version:2,completed,ratings:legacy.ratings};
}

export function scopePractice({exam, questions, lessons}, optionalFromSlide) {
  if (optionalFromSlide === undefined) return {exam, questions};
  const included = ({slide}) => slide < optionalFromSlide;
  return {
    exam: {
      problems: exam.problems.filter(problem => problem.parts.every(included)),
      theory: exam.theory.filter(included)
    },
    questions: questions.filter(question => lessons[question.topic].slides.every(slide => slide < optionalFromSlide))
  };
}
