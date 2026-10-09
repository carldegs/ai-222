(() => {
  const companion = {
    overview: {
      heading: 'See generalization happen',
      intro: 'Change the data and model settings to see how training and test behavior respond.',
      items: [{ type: 'Interactive website', title: 'TensorFlow Playground', text: 'Change network depth, features, and regularization, then watch the decision boundary and train/test behavior respond.', url: 'https://playground.tensorflow.org/', action: 'Open interactive ↗' }]
    },
    datasets: {
      heading: 'Trace one batch through the pipeline',
      intro: 'This compact diagram anchors retrieval, ordering, batch assembly, and model input.',
      diagram: ['Dataset|one example', 'Sampler|index order', 'DataLoader + collate|assemble', 'Batch tensors|X, y', 'Model|forward pass'],
      items: [{ type: 'Video lecture', title: 'PyTorch DataLoader Design', text: 'A deeper visual explanation of datasets, samplers, and loaders from the PyTorch team.', url: 'https://www.youtube.com/watch?v=sCsPzVumtR8', action: 'Watch on YouTube ↗' }]
    },
    'mlp-video': {
      heading: 'Watch a network turn pixels into a prediction',
      intro: 'Watch pixels become activations, then a prediction.',
      items: [
        { type: 'Video · click to load', title: '3Blue1Brown: Neural Networks', text: 'A visual intuition for layers, activations, and handwritten-digit classification.', video: 'aircAruvnKk', source: 'https://www.3blue1brown.com/lessons/neural-networks', action: 'Open source page ↗' },
        { type: 'Interactive website', title: 'TensorFlow Playground', text: 'Experiment with width, depth, activation, and regularization while watching decision boundaries.', url: 'https://playground.tensorflow.org/', action: 'Open interactive ↗' }
      ]
    },
    'cnn-video': {
      heading: 'See the CNN forward pass',
      intro: 'Follow filters, feature maps, activation, pooling, and classification.',
      items: [
        { type: 'Video · click to load', title: 'CNN visual walkthrough', text: 'A short animated overview of convolution, activation, and pooling.', video: '8NbXFoVk1mo', source: 'https://www.youtube.com/watch?v=8NbXFoVk1mo', action: 'Open video page ↗' },
        { type: 'Interactive website', title: 'CNN Explainer', text: 'Inspect how a CNN transforms an image through feature maps to a prediction.', url: 'https://poloclub.github.io/cnn-explainer/', action: 'Open interactive ↗' },
        { type: 'Visual reference', title: 'Computing receptive fields', text: 'An interactive visual explanation of how stacked layers expand the visible input region.', url: 'https://distill.pub/2019/computing-receptive-fields/', action: 'Open reference ↗' }
      ]
    },
    'rnn-stepper': {
      heading: 'Follow information through time',
      intro: 'Follow how the hidden state carries information from one token to the next.',
      diagram: ['x₁ + h₀', 'h₁', 'x₂ + h₁', 'h₂', 'x₃ + h₂', 'h₃'],
      stepper: [
        ['1 · First token', 'The recurrent cell combines x₁ with the initial state h₀ to make h₁.'],
        ['2 · Same weights', 'At the next position, the same recurrent weights combine x₂ with h₁ to make h₂.'],
        ['3 · Carry context', 'h₃ contains a learned summary of earlier inputs, though distant information may weaken.']
      ],
      items: [{ type: 'Visual reading', title: 'Understanding LSTMs', text: 'A clear illustrated explanation of gates and the cell-state path.', url: 'https://colah.github.io/posts/2015-08-Understanding-LSTMs/', action: 'Open illustrated guide ↗' }]
    },
    'transformer-video': {
      heading: 'See attention calculated',
      intro: 'Use the video for geometric intuition; use the interactive pages to pause over the token-by-token flow.',
      items: [
        { type: 'Video · click to load', title: '3Blue1Brown: Attention in Transformers', text: 'A step-by-step visual explanation of attention weights and contextual representations.', video: 'eMlx5fFNoYc', source: 'https://www.3blue1brown.com/lessons/gpt', action: 'Open source page ↗' },
        { type: 'Visual reading', title: 'The Illustrated Transformer', text: 'A sequenced visual reference for Q/K/V, multi-head attention, masking, and decoding.', url: 'https://jalammar.github.io/illustrated-transformer/', action: 'Open illustrated guide ↗' },
        { type: 'Technical visual reference', title: 'The Annotated Transformer', text: 'Pair equations with a visual, implementation-oriented walkthrough.', url: 'https://nlp.seas.harvard.edu/annotated-transformer/', action: 'Open reference ↗' }
      ]
    },
    'llm-intro': {
      heading: 'Walk through the generation loop once more',
      intro: 'Use the examples on this page to connect the probabilities to the text you see.',
      diagram: ['Prompt', 'Next-token probabilities', 'Choose a token', 'Append to context', 'Predict again'],
      items: [
        { type: 'Worked example', title: 'Build a sequence probability', text: 'Follow “the cat sat” and multiply each probability by the running product.', url: '#probability', action: 'Revisit the example →' },
        { type: 'Interactive example', title: 'Try a different temperature', text: 'Keep the token scores fixed and see how temperature changes the next-token probabilities.', url: '#generation', action: 'Try the slider →' }
      ]
    },
    'llm-data': {
      heading: 'See the LLM data-to-token pipeline',
      intro: 'Keep this small visual nearby when tracing how text becomes a next-token prediction.',
      diagram: ['Text', 'Tokenizer', 'Token IDs', 'Embeddings + position', 'Transformer', 'Logits', 'Next token'],
      items: [{ type: 'Visual video', title: 'Attention in Transformers', text: 'See contextual representations after tokenization.', url: 'https://www.3blue1brown.com/lessons/attention/', action: 'Open visual lesson ↗' }]
    },
    'agents-stepper': {
      heading: 'See a safe agent loop',
      intro: 'This compact stepper highlights the decision boundaries around evidence, tools, and consequential actions.',
      stepper: [
        ['1 · Observe', 'Read the user goal and the available evidence; treat web pages and tool output as untrusted data.'],
        ['2 · Plan', 'Choose the smallest useful next action and a stopping or escalation condition.'],
        ['3 · Call tool', 'Run the smallest authorized tool call and capture its result as new evidence.'],
        ['4 · Validate', 'Check returned evidence for relevance, provenance, freshness, and errors before relying on it.'],
        ['5 · Approve, escalate, or stop', 'Ask for confirmation before consequential actions; otherwise answer, retry safely, escalate ambiguity, or stop.']
      ],
      items: [
        { type: 'Visual reference', title: 'ReAct project', text: 'Read a reasoning–action–observation trajectory with its original paper and examples.', url: 'https://react-lm.github.io/', action: 'Open project ↗' },
        { type: 'Reference card', title: 'MCP specification', text: 'See the host, client, and server roles behind prompts, resources, and tools.', url: 'https://modelcontextprotocol.io/specification/draft/server/index', action: 'Open specification ↗' }
      ]
    }
  };

  const visualKey = document.body.dataset.visuals;
  const spec = companion[visualKey];
  if (spec) {
    const cards = spec.items.map(item => item.video
      ? `<article class="resource-card video-card" data-youtube-id="${item.video}" data-video-title="${item.title}"><button class="video-card__play" type="button" data-play-video aria-label="Play ${item.title}">▶ Play video</button><div class="video-card__body"><p class="resource-card__type">${item.type}</p><h3>${item.title}</h3><p>${item.text}</p><a class="resource-card__action" href="${item.source}" target="_blank" rel="noopener noreferrer">${item.action}</a></div></article>`
      : `<article class="resource-card"><p class="resource-card__type">${item.type}</p><h3>${item.title}</h3><p>${item.text}</p><a class="resource-card__action" href="${item.url}" target="_blank" rel="noopener noreferrer">${item.action}</a></article>`).join('');
    const diagram = spec.diagram ? `<div class="resource-diagram" aria-label="Process diagram">${spec.diagram.map((item, i) => { const [label, note] = item.split('|'); return `${i ? '<b>→</b>' : ''}<span>${label}${note ? `<br><small>${note}</small>` : ''}</span>`; }).join('')}</div>` : '';
    const stepper = spec.stepper ? `<div class="visual-stepper" data-visual-stepper><h3>Step through the idea</h3><div class="visual-stepper__steps">${spec.stepper.map(([label, text], i) => `<button type="button" data-step-text data-step-text-value="${text}" aria-pressed="${i === 0}" aria-controls="visual-step-output">${label}</button>`).join('')}</div><p class="visual-stepper__output" id="visual-step-output" data-step-output aria-live="polite">${spec.stepper[0][1]}</p></div>` : '';
    const section = document.createElement('section');
    section.className = 'visual-resources';
    section.setAttribute('aria-label', 'Explore further');
    section.innerHTML = `<p class="visual-resources__eyebrow">Explore further</p><h2>${spec.heading}</h2><p class="visual-resources__intro">${spec.intro}</p>${diagram}${stepper}<div class="resource-grid">${cards}</div>`;
    const main = document.querySelector('main');
    if (main) {
      const bottomNav = main.querySelector('.series-bottomnav, .bottomnav');
      if (bottomNav && bottomNav.parentElement === main) main.insertBefore(section, bottomNav);
      else if (bottomNav && bottomNav.closest('section')?.parentElement === main) bottomNav.closest('section').before(section);
      else main.append(section);
    }
  }

  document.querySelectorAll('[data-youtube-id]').forEach(card => {
    const button = card.querySelector('[data-play-video]');
    if (!button) return;
    button.addEventListener('click', () => {
      const id = card.dataset.youtubeId;
      const title = card.dataset.videoTitle || 'YouTube video';
      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1`;
      frame.title = title;
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.allowFullscreen = true;
      button.replaceWith(frame);
      frame.focus();
    }, { once: true });
  });

  document.querySelectorAll('[data-visual-stepper]').forEach(stepper => {
    const output = stepper.querySelector('[data-step-output]');
    stepper.querySelectorAll('[data-step-text]').forEach(button => button.addEventListener('click', () => {
      stepper.querySelectorAll('[data-step-text]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      output.textContent = button.dataset.stepTextValue;
    }));
  });
})();
