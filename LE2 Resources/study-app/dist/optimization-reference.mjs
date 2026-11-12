const math = String.raw;

// Keys are the first slide of each walkthrough lesson.
export const quickReference = {
  1: {
    summary: 'A loss measures how far one prediction is from its target. Empirical risk averages those losses over the observed training examples, giving the optimizer an objective to minimize.',
    recall: math`Losses $4,0,4$ give an empirical risk of $8/3$. Performance on new examples needs its own evaluation.`,
    slides: [2,3,4]
  },
  5: {
    summary: 'A minibatch estimates the gradient for one update. Average the individual gradients with the weights held at their current values. Smaller batches make each update cheaper and use less memory, while larger batches can give smoother estimates and better GPU throughput.',
    recall: math`$\nabla_\theta$ means find the slope with respect to each parameter. If two examples give slopes $-2$ and $4$, their batch gradient is $1$. Shuffling helps spread similar examples across batches.`,
    slides: [5]
  },
  6: {
    summary: 'A local minimum is lowest among nearby points. A saddle can have zero slope and still have a downhill direction. In a convex loss, every local minimum is global.',
    recall: 'Clipping a gradient by its norm caps its length and preserves its direction. For example, a gradient of length 10 clipped to 5 has each entry halved.',
    slides: [6,7,8]
  },
  9: {
    summary: 'Repeated multiplications through layers can make gradients vanish or explode. A noisy minibatch gradient is a different issue. The estimate can vary with the examples selected even at the same weights.',
    recall: math`Three multiplications by $1/2$ shrink a signal to $1/8$ of its size. Three multiplications by $2$ grow it eightfold. In the slide’s linear model, the repeated factor along one direction is $\lambda^t$.`,
    slides: [9,10]
  },
  11: {
    summary: 'Initialization picks the starting weights. On a nonconvex loss surface, different starts can lead downhill into different valleys.',
    recall: 'Random weights help break symmetry. Units with identical starting weights and identical updates can keep learning the same feature.',
    slides: [11,12]
  },
  13: {
    summary: math`Glorot (Xavier) uses fan-in $m$ and fan-out $n$ to set the initial scale. He (Kaiming) uses fan-in $m$ and is designed for rectifiers such as ReLU. Biases are additive offsets and can use separate initialization rules.`,
    recall: math`For the normal versions, the variances are $2/(m+n)$ for Glorot and $2/m$ for He. Take the square root for the standard deviation $\sigma$.`,
    slides: [13,14,15]
  },
  16: {
    summary: math`Stochastic gradient descent (SGD) subtracts the minibatch gradient $g$ multiplied by the learning rate $\epsilon$. Recompute the gradient at the new weights for the next update.`,
    recall: math`A negative gradient increases that parameter when subtracted. For $\theta=5$, $g=-4$, and $\epsilon=1/2$, the next weight is $7$. A large step can overshoot even if the initial direction is downhill.`,
    slides: [17,18]
  },
  19: {
    summary: 'Momentum keeps part of the previous move as velocity. Alternating sideways moves in a narrow valley can cancel, while moves that point consistently along the valley can build up.',
    recall: math`Use the deck’s convention. First compute $v_{\rm next}=\alpha v-\epsilon g$, then add that new velocity to the current weights.`,
    slides: [19,20,21]
  },
  22: {
    summary: math`Nesterov momentum evaluates the gradient at the lookahead weights $\theta+\alpha v$. It uses that gradient to update the velocity.`,
    recall: math`With $\theta=4$, $v=-2$, and $\alpha=1/2$, measure the gradient at $3$. Then apply the new velocity to the original weight of $4$.`,
    slides: [22,23]
  },
  24: {
    summary: 'AdaGrad keeps a separate running sum of squared gradients for each weight. A larger sum makes the effective learning rate smaller for that weight.',
    recall: math`Add the current squared gradient before taking the square root. If the old sum is $9$ and the gradient is $4$, the new sum is $25$. Long histories can make updates very small.`,
    slides: [24,25]
  },
  26: {
    summary: 'RMSProp uses a moving average of squared gradients. Older gradients gradually lose influence, so the denominator can shrink when recent gradients are smaller.',
    recall: math`$\rho$ weights the old average and $1-\rho$ weights the new squared gradient. The deck adds the stability constant $\delta$ outside the square root.`,
    slides: [26,27]
  },
  28: {
    summary: math`Adam tracks a signed gradient average $s$ and a squared-gradient average $r$. It corrects both for starting at zero, then uses the corrected squared-gradient average to scale the update.`,
    recall: math`At step $t$, divide each average by $1-\rho^t$ using its own decay. The first update uses $t=1$. The second raw moment averages squares, while a variance would also subtract the squared mean.`,
    slides: [28,29]
  },
  30: {
    summary: 'The trajectory plots show how optimizers move from a starting point on a particular loss surface. Compare sideways oscillations in the valley and movement near the saddle.',
    recall: 'A path depends on the surface, the starting weights, and the settings. Compare validation performance before choosing a method for a new task.',
    slides: [30,31]
  },
  32: {
    summary: math`A learning-rate schedule supplies $\epsilon$ to the optimizer at each epoch. Cosine decay moves smoothly from the initial rate to the final rate, with the largest changes near the middle.`,
    recall: math`Use $\cos 0=1$, $\cos(\pi/2)=0$, and $\cos\pi=-1$. The halfway rate is the average of the initial and final rates.`,
    slides: [32,33,34]
  },
  35: {
    summary: 'Multistep decay holds the rate constant between milestones and multiplies it by a factor at each one. Linear decay subtracts equal amounts over equal intervals.',
    recall: math`Count a milestone once you reach it. Two drops by a factor of $1/2$ leave a quarter of the initial rate. The deck’s linear rule leaves half at the halfway point and reaches zero at the end.`,
    slides: [35,36,37,38]
  },
  39: {
    summary: math`A cosine restart raises the learning rate at the start of a new cycle. The remainder $e\bmod R$ gives the elapsed time in that cycle, where $R$ is the cycle length.`,
    recall: math`With $R=50$, epoch $57$ is seven epochs into the new cycle. The model keeps training from its current weights at the rate the new cycle supplies.`,
    slides: [39,40]
  },
  41: {
    summary: 'Warmup raises the learning rate over the first few epochs to avoid starting with full-sized updates. The main schedule begins once warmup reaches its target rate.',
    recall: math`With $W$ warmup epochs and a final epoch $T$, the cosine phase starts at epoch $W$. Use $e-W$ as its clock and $T-W$ as its duration.`,
    slides: [41,42]
  },
  43: {
    summary: 'Initialization sets the starting weights, the optimizer turns gradients into parameter updates, and the schedule controls the learning rate over time.',
    recall: 'Match the response to the symptom. Try momentum for zigzagging, inspect gradient norms when steps spike, and use validation results to compare optimizers.',
    slides: [44]
  }
};
