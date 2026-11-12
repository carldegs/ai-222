import {source} from './tutor.mjs';
import {tutorLessons} from './optimization-tutor-content.mjs';
import {labMarkup, mountLab} from './optimization-labs.mjs';

const flow = `<figure class="tutor-flow">
  <figcaption><strong>One training update</strong><span>Read from top to bottom</span></figcaption>
  <p class="tutor-flow-start">Before the first update: choose starting parameters. ${source(12, 'Initialization')}</p>
  <ol>
    <li><strong>Predict</strong><span>Use the current parameters on a ${source(5, 'minibatch')}.</span></li>
    <li><strong>Measure error</strong><span>Compare the predictions with their targets and ${source(4, 'average the losses')}.</span></li>
    <li><strong>Estimate the slope</strong><span>Compute the ${source(18, 'minibatch gradient')} at the current parameters.</span></li>
    <li><strong>Make the move</strong><span>The optimizer combines the gradient with any history it keeps. The ${source(32, 'schedule')} supplies the learning rate.</span></li>
  </ol>
  <p class="tutor-flow-start">↳ The next minibatch uses the updated parameters.</p>
</figure>`;

export const optimizationTutor = {topics:tutorLessons, labMarkup, mountLab, flow};
