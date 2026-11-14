const math = String.raw;
const step = (formula, substitution) => ({formula, substitution});
const item = (marks, prompt, answer, sources, steps = [], hint) =>
  ({marks, prompt, answer, sources, steps, hint});

export const mixedPractice = {
  problems: [
    {
      title: 'Follow a weight through repeated L2 penalty updates',
      setup: math`A scalar weight starts at $\theta_0=8$. The data gradient is zero at every step in this toy problem. Use penalty $\lambda\theta^2$, with $\lambda=1$, and plain SGD with learning rate $\epsilon=1/4$.`,
      parts: [
        item(2, 'Find the penalty gradient and the multiplier on the weight after one step.',
          'Award 1 mark for the gradient and 1 for the multiplier.',
          [['regularization',5],['optimization',17]], [
            step(math`\nabla_\theta(\lambda\theta^2)=2\lambda\theta,\quad
              \theta_{t+1}=\theta_t-\epsilon(2\lambda\theta_t)`,
            math`\theta_{t+1}=(1-2\cdot\tfrac14\cdot1)\theta_t=\tfrac12\theta_t`)
          ], 'Differentiate the penalty before applying the SGD rule.'),
        item(3, 'Find the next three weights. Write a general expression and explain why it tends to zero.',
          'Award 1 mark for the three weights, 1 for the expression, and 1 for explaining that each step multiplies the previous value by one half.',
          [['optimization',18],['regularization',5]], [
            step(math`\theta_t=(1-2\epsilon\lambda)^t\theta_0`,
              math`\theta_1=4,\quad\theta_2=2,\quad\theta_3=1,\quad\theta_t=8(1/2)^t\to0`)
          ])
      ]
    },
    {
      title: 'Compare the steps taken under two box losses',
      setup: math`Treat the scalar box-offset error $u$ as the variable we update. Compare Smooth L1 with $\sigma=1$ against half-squared error $u^2/2$. Use learning rate $\epsilon=1/2$.`,
      parts: [
        item(4, math`Find the magnitude of the next SGD move for each loss at $u=1/2$ and $u=3$.`,
          'Award 1 mark for each of the four move sizes.',
          [['detection',31],['optimization',17]], [
            step(math`|\Delta u|=\epsilon|\ell'(u)|,\quad
              \ell'_{\rm smooth}(u)=\begin{cases}u& |u|<1\\\operatorname{sign}(u)&|u|\ge1\end{cases},
              \quad\ell'_{\rm square}(u)=u`,
            math`\begin{aligned}
              u=1/2 &: \quad |\Delta u_{\rm smooth}|=|\Delta u_{\rm square}|=(1/2)(1/2)=1/4\\
              u=3 &: \quad |\Delta u_{\rm smooth}|=(1/2)(1)=1/2,\quad
              |\Delta u_{\rm square}|=(1/2)(3)=3/2
            \end{aligned}`)
          ], 'Use the slope of each loss at the given error to find the update.'),
        item(2, 'Why does the one-half bound in this exercise apply to the scalar error update? What extra quantity matters when updating a network weight?',
          'Smooth L1 bounds the slope with respect to the error by one (1 mark). For a network weight, the chain rule also introduces how the error depends on that weight (1 mark).',
          [['detection',31],['optimization',17]])
      ]
    },
    {
      title: 'Score a box and a mask for the same object',
      setup: 'In a 4-by-4 grid, the true mask has the four pixels on the main diagonal. The prediction has the four pixels on the opposite diagonal. Draw each bounding rectangle tightly around its four pixels.',
      parts: [
        item(2, 'Find box IoU and pixel IoU for the foreground masks.',
          'Award 1 mark for each overlap ratio.',
          [['detection',22],['segmentation',22]], [
            step(math`\mathrm{IoU}(A,B)=\frac{|A\cap B|}{|A\cup B|}`,
              math`\mathrm{IoU}_{\rm box}=16/16=1,\qquad\mathrm{IoU}_{\rm mask}=0/8=0`)
          ]),
        item(2, 'What does semantic mIoU average? What does VOC detection mAP average?',
          'Semantic mIoU averages the pixel-set IoUs of the evaluated classes (1 mark). VOC detection mAP averages class APs, each based on the score-ranked detections and their precision and recall (1 mark).',
          [['segmentation',22],['detection',48]])
      ]
    }
  ],
  theory: [
    item(2, 'You compare two learning-rate schedules and choose a checkpoint based on accuracy. Which data should guide those choices, and which data should you use for final evaluation?',
      'Use validation data for schedule and checkpoint selection (1 mark). Use held-out test data for the final evaluation after fixing those choices (1 mark).',
      [['optimization',34],['regularization',2],['regularization',41]])
  ]
};
