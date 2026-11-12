import {walkthroughGroups} from './walkthrough-groups.mjs';
import {walkthroughDetails} from './walkthrough-pages.mjs';

export function buildWalkthrough(deck) {
  const {extra, practiceSlides, noteSlides} = walkthroughDetails[deck.id];
  const pages = Array.from({length:deck.slideCount}, (_, index) => ({
    slide:index+1, steps:[], problems:[], notes:[]
  }));

  deck.tutor.topics.forEach(({steps}, topic) => {
    for (const step of steps) {
      pages[step.slide-1].steps.push({...step, topic});
      // Related slides can share one visible discussion while retaining their direct links.
      for (let slide=step.slide+1; slide<=step.end; slide++) {
        pages[slide-1].steps.push({...step, slide, topic, coveredBy:step.slide});
      }
    }
  });
  for (const step of extra) pages[step.slide-1].steps.push(step);
  for (const example of deck.examples) {
    const page = practiceSlides[example.slide] ?? example.slide;
    pages[page-1].problems.push(example);
  }
  noteSlides.forEach((slide, topic)=>pages[slide-1].notes.push(topic));

  for (const page of pages) {
    if (!page.steps.length) throw new Error('Missing walkthrough for ' + deck.title + ' slide ' + page.slide);
    // The last explanation determines the active topic on slides with a recap.
    page.topic = page.steps.at(-1).topic;
  }
  return pages;
}

export function buildLessons(deck, pages) {
  let start = 0;
  const lessons = walkthroughGroups[deck.id].map(([end,title,context], index)=>{
    if (end<=start || end>pages.length) throw new Error('Invalid group boundary in ' + deck.title);
    const members = pages.slice(start,end);
    for (const page of members) page.lessonIndex=index;
    start=end;
    return {index,title,context,pages:members};
  });
  if (start!==pages.length) throw new Error('Unassigned slides in ' + deck.title);
  return lessons;
}
