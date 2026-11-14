const math = String.raw;
const step = (formula, substitution) => ({formula, substitution});
const item = (deck, slide, marks, prompt, answer, ...steps) =>
  ({marks, prompt, answer, sources:[[deck, slide]], steps});
const optimization = (...args) => item('optimization', ...args);
const regularization = (...args) => item('regularization', ...args);
const detection = (...args) => item('detection', ...args);
const segmentation = (...args) => item('segmentation', ...args);

export const mockExam = {
  problems: [
    {
      title:'Optimization · When momentum carries you past the minimum',
      setup:math`A model has loss $L(\theta)=\theta^2/2$. Start at $\theta_0=2$ and $v_0=0$. Use learning rate $\epsilon=1/2$ and momentum coefficient $\alpha=3/4$. Take two ordinary momentum steps using the gradient of the current loss each time.`,
      parts:[
        optimization(21,3,'Find the gradient, new velocity, and weight after the first step.',
          'Award 1 mark each for the gradient, velocity, and weight.',
          step(math`g_t=\nabla_\theta L(\theta_{t-1})=\theta_{t-1},\quad v_t=\alpha v_{t-1}-\epsilon g_t,\quad \theta_t=\theta_{t-1}+v_t`,
            math`g_1=2,\quad v_1=\tfrac34(0)-\tfrac12(2)=-1,\quad \theta_1=2-1=1`)),
        optimization(21,3,'Repeat the calculation for the second step. Does the weight cross zero?',
          'Award 1 mark each for the recomputed gradient, velocity, and weight. The negative second weight shows that the move crosses zero.',
          step(math`g_2=\theta_1,\quad v_2=\alpha v_1-\epsilon g_2,\quad\theta_2=\theta_1+v_2`,
            math`g_2=1,\quad v_2=\tfrac34(-1)-\tfrac12(1)=-\tfrac54,\quad \theta_2=1-\tfrac54=-\tfrac14`)),
        optimization(17,2,'Did crossing zero increase the loss? Use the two losses to justify your answer.',
          'Award 1 mark for the two losses and 1 for explaining that the second weight is closer to zero in magnitude, so the loss still falls.',
          step(math`L(\theta)=\theta^2/2`,
            math`L(\theta_1)=\tfrac12,\qquad L(\theta_2)=\tfrac{(-1/4)^2}{2}=\tfrac1{32}`))
      ]
    },
    {
      title:'Regularization · Compare training with and without inverted dropout',
      setup:math`Two units each have activation $4$ before inverted dropout. Each unit is kept independently with probability $p=1/2$. A downstream unit adds their outputs with no bias or nonlinearity.`,
      parts:[
        regularization(43,2,'Give the possible training outputs and their probabilities for one unit.',
          'Award 1 mark for each output with its probability.',
          step(math`\widetilde h=mh/p,\quad \Pr(m=1)=p,\quad\Pr(m=0)=1-p`,
            math`\widetilde h=8\ \text{with probability }\tfrac12,\qquad
              \widetilde h=0\ \text{with probability }\tfrac12`)),
        regularization(43,3,'Give the three possible values of the sum during training and their probabilities.',
          'Award 1 mark per sum with its correct probability. Either unit can be the only unit kept.',
          step(math`\Pr(\text{none})=(1-p)^2,\quad\Pr(\text{exactly one})=2p(1-p),\quad\Pr(\text{both})=p^2`,
            math`\Pr(S=0)=\tfrac14,\qquad\Pr(S=8)=\tfrac12,\qquad\Pr(S=16)=\tfrac14`)),
        regularization(43,3,'Compute the expected training sum and the evaluation sum. Explain how the evaluation pass uses the activations.',
          'Award 1 mark for each sum and 1 for explaining that evaluation uses both original activations with no dropout scaling.',
          step(math`\mathbb E[S]=\sum_s s\Pr(S=s),\quad S_{\rm eval}=h_1+h_2`,
            math`\mathbb E[S]=0(\tfrac14)+8(\tfrac12)+16(\tfrac14)=8,\qquad S_{\rm eval}=4+4=8`))
      ]
    },
    {
      title:'Detection · Remove a duplicate, then evaluate the detections',
      setup:math`Three boxes for one class are scored in order $A>B>C$. The pairwise IoUs are $\operatorname{IoU}(A,B)=3/5$ and $\operatorname{IoU}(A,C)=\operatorname{IoU}(B,C)=1/5$. There are two labeled objects. A and B each overlap the first label above the evaluation threshold. C matches neither label.`,
      parts:[
        detection(41,2,math`Apply hard NMS with threshold $1/2$. Which boxes remain, in order?`,
          'Award 1 mark for keeping A and suppressing B, and 1 for retaining C second.'),
        detection(43,3,'Count true positives, false positives, and false negatives after NMS. Find final precision and recall.',
          'Award 1 mark for the three counts, 1 for precision, and 1 for recall.',
          step(math`P=\frac{TP}{TP+FP},\qquad R=\frac{TP}{TP+FN}`,
            math`TP=1,\quad FP=1,\quad FN=1,\qquad P=\tfrac12,\quad R=\tfrac12`)),
        detection(48,3,'Compute VOC 2007 eleven-point AP. Account for the recall levels the detector cannot reach.',
          'Award 1 mark for the two precision–recall points, 1 for assigning six checkpoints precision one and five checkpoints zero, and 1 for AP.',
          step(math`\mathrm{AP}_{07}=\frac1{11}\sum_{r\in\{0,0.1,\ldots,1\}}P_r`,
            math`(R,P)=(\tfrac12,1),(\tfrac12,\tfrac12),\qquad
              \mathrm{AP}_{07}=\frac{6(1)+5(0)}{11}=\tfrac6{11}`))
      ]
    },
    {
      title:'Segmentation · Connect pixel probabilities to the final mask',
      setup:math`A semantic segmentation model labels four pixels, each as can or background. The ground truth is (can, can, background, background). Its predicted can probabilities are $(3/4,1/4,1/4,3/4)$. Use natural logs and pick the more probable class at each pixel. Both classes count in mean IoU.`,
      parts:[
        segmentation(11,3,'Find the mean pixel cross-entropy. Leave the logs exact.',
          'Award 1 mark for identifying the four true-class probabilities, 1 for averaging their negative logs, and 1 for the simplified result.',
          step(math`\overline{\mathcal L}=-\frac1N\sum_{i=1}^N\ln p_{i,y_i}`,
            math`-\frac{\ln(3/4)+\ln(1/4)+\ln(3/4)+\ln(1/4)}4
              =\tfrac12\ln(16/3)`)),
        segmentation(22,3,'List the predicted labels and find pixel accuracy and semantic mIoU.',
          'Award 1 mark for the four labels, 1 for accuracy, and 1 for both class IoUs and their mean. The predicted labels are can, background, background, can.',
          step(math`\mathrm{Acc}=\frac{\#\text{ correct}}{N},\quad
            \mathrm{IoU}_c=\frac{TP_c}{TP_c+FP_c+FN_c},\quad\mathrm{mIoU}=\frac1K\sum_c\mathrm{IoU}_c`,
            math`\mathrm{Acc}=2/4=\tfrac12,\quad
              \mathrm{IoU}_{\rm can}=\mathrm{IoU}_{\rm bg}=1/(1+1+1)=\tfrac13,\quad
              \mathrm{mIoU}=\tfrac13`)),
        segmentation(11,2,math`The model changes only the first can probability from $3/4$ to $7/8$. What happens to mean cross-entropy and mIoU?`,
          'Mean cross-entropy falls because the probability of the true class rises (1 mark). The predicted labels stay the same, so mIoU is unchanged (1 mark).')
      ]
    }
  ],
  theory:[
    optimization(23,2,'Optimization. Where does Nesterov evaluate the gradient, and why can that help near the bottom of a valley?',
      'It evaluates the gradient at the lookahead position given by the current weight plus the retained velocity (1 mark). That position may already be across the valley, so its slope can counter the remembered move (1 mark).'),
    regularization(28,2,'Regularization. Why does MixUp blend the target when it blends the images? What target would CutOut use if the object remains recognizable?',
      'MixUp uses both sources in the input and gives their classes matching target weights (1 mark). CutOut erases part of one image and keeps its original label under the stated assumption (1 mark).'),
    detection(34,2,'Detection. What does the class head predict for each SSD anchor? Why does a sampled background anchor contribute to classification but have no box target?',
      'The class head scores object categories and background (1 mark). The background anchor has a background class label but has no matched object box to regress toward (1 mark).'),
    segmentation(16,2,'Segmentation. In PSPNet, what does the global pooling branch supply? What can a regional pooling branch preserve?',
      'Global pooling supplies a summary of the entire feature map (1 mark). Regional pooling keeps separate summaries for different parts of that map (1 mark).')
  ]
};
