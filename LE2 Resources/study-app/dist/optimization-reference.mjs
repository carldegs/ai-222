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
    recall: math`With 100 training examples split into 5 minibatches of 20, the full training loss uses $m=100$. The gradient for one minibatch uses $m=20$. The 5 tells you how many batches there are. In either equation, $m$ counts the examples inside the sum.`,
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
    summary: math`Nesterov is a variant of momentum. Both methods track a velocity $v_t$. Ordinary momentum measures the minibatch gradient at the current weights $\theta_t$. Nesterov measures it at the lookahead weights $\theta_t+\alpha v_t$.`,
    recall: math`With $\theta_t=4$, $v_t=-2$, and $\alpha=1/2$, ordinary momentum measures the gradient at $4$ and Nesterov measures it at $3$. Both add the new velocity to the original weight of $4$. With $\alpha=0$, the two methods both reduce to plain SGD.`,
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
    summary: math`Adam estimates two moments of recent gradients for each weight. The first moment is the mean of the signed gradients. Its estimate $s_t$ tells Adam which direction has been consistent. The second raw moment is the mean of the squared gradients. Its estimate $r_t$ captures how large the gradients have been, even when their signs alternate.`,
    recall: math`At step $t$, divide each average by $1-\rho^t$ using its own decay. The first update uses $t=1$. Compare the stored histories. AdaGrad sums squares (slide 25). RMSProp takes a moving average of squares (slide 27). Adam keeps a signed average as well and corrects both averages for their zero start (slide 29). For one weight, gradients $+2$ and $-2$ with equal weight have first moment $0$ and second raw moment $4$. Adam uses moving averages that give newer gradients more weight. “Raw” means square each gradient as it is. Variance measures squared deviations from the mean.`,
    slides: [25,27,28,29]
  },
  30: {
    summary: 'The trajectory plots show how optimizers move from a starting point on a particular loss surface. Compare sideways oscillations in the valley and movement near the saddle.',
    recall: 'A path depends on the surface, the starting weights, and the settings. Compare validation performance before choosing a method for a new task.',
    slides: [30,31]
  },
  32: {
    summary: math`A learning-rate schedule supplies $\epsilon$ to the optimizer at each epoch. Cosine decay moves smoothly from the initial rate to the final rate, with the largest changes near the middle.`,
    recall: math`The cosine angle is $\pi e/T$, so the fraction of training completed tells you which multiple of $\pi$ to look up. The halfway rate is the average of the initial and final rates.`,
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

const optimizerOverview = [
  {
    name: 'SGD', slide: 18,
    when: 'Use as a simple baseline to see how far the current gradient alone gets you.',
    step: 'After the minibatch gradient, subtract a scaled copy from the weights.',
    equations: [math`\Delta\theta=-\epsilon_t g_t`]
  },
  {
    name: 'Momentum', slide: 21,
    when: 'Try when SGD zigzags across a narrow valley.',
    step: 'After the gradient, blend the previous move with the new one, then apply the result.',
    equations: [math`v_{t+1}=\alpha v_t-\epsilon_t g_t`, math`\Delta\theta=v_{t+1}`]
  },
  {
    name: 'Nesterov', slide: 22,
    when: 'Try when you want momentum to react to the slope ahead.',
    step: 'Before computing the gradient, look ahead by a fraction of the previous move. Then use the momentum rule.',
    equations: [math`g_t=\nabla L_{\mathrm{batch}}(\theta_t+\alpha v_t)`, math`v_{t+1}=\alpha v_t-\epsilon_t g_t`, math`\Delta\theta=v_{t+1}`]
  },
  {
    name: 'AdaGrad', slide: 25,
    when: 'Useful when some parameters receive nonzero gradients only rarely.',
    step: 'After the gradient, add its square to each parameter’s running total, then scale the update.',
    equations: [math`r_t=r_{t-1}+g_t^2`, math`\Delta\theta=-\frac{\epsilon g_t}{\delta+\sqrt{r_t}}`]
  },
  {
    name: 'RMSProp', slide: 27,
    when: 'Try when AdaGrad’s accumulated history makes later steps too small.',
    step: 'After the gradient, refresh the squared-gradient average, then scale the update.',
    equations: [math`r_t=\rho r_{t-1}+(1-\rho)g_t^2`, math`\Delta\theta=-\frac{\epsilon g_t}{\delta+\sqrt{r_t}}`]
  },
  {
    name: 'Adam', slide: 29,
    when: 'A starting choice when you want both a smoothed direction and a step size that adapts per parameter.',
    step: 'After the gradient, update both averages and correct for their zero start before applying the step.',
    equations: [
      math`s_t=\rho_1s_{t-1}+(1-\rho_1)g_t`,
      math`r_t=\rho_2r_{t-1}+(1-\rho_2)(g_t\odot g_t)`,
      math`\hat s_t=\frac{s_t}{1-\rho_1^t},\quad\hat r_t=\frac{r_t}{1-\rho_2^t}`,
      math`\Delta\theta=-\frac{\epsilon\hat s_t}{\delta+\sqrt{\hat r_t}}`
    ]
  }
];

export const referenceEquationContext = {
  'Empirical risk': math`Average the losses over all training examples to get one score for the current weights. Here $m$ is the size of the training set.`,
  'Minibatch gradient': math`Use the same averaging idea on the current minibatch. Here $m$ is the number of examples in that batch, and each term measures how its loss changes with the weights. At the same weights, differentiating the batch’s average loss gives the same result as averaging its individual gradients.`,
  'Norm clipping · supplementary formalization': 'Check the gradient before handing it to the optimizer. If its length exceeds the cap, shrink every component by the same factor so the direction stays the same.',
  'Repeated linear transformations': 'Why can gradients need clipping in the first place? In this simplified model, each repeated multiplication raises a directional scale factor to a higher power. That can make a signal grow or fade.',
  'Glorot / Xavier': 'Before the first minibatch, pick the scale of the random starting weights. Glorot uses both the number of inputs to a layer and the number of outputs to help keep signals from growing or fading across layers.',
  'He / Kaiming': 'ReLU turns negative inputs into zeros. He initialization accounts for that when setting the starting scale, using the number of inputs to the layer.',
  'SGD': 'Once you have starting weights and a minibatch gradient, turn that slope into a step. The minus sign moves against the slope and the learning rate sets the size of the move.',
  'Momentum · deck convention': 'SGD uses the current slope for every move. Momentum carries part of the previous move forward, so repeated directions build up and back-and-forth moves can cancel.',
  'Nesterov lookahead': 'Keep the momentum update but check the slope where the carried velocity would take you. Feed that slope into the velocity rule, then apply the new velocity to the original weights.',
  'AdaGrad': 'Momentum carries a previous move forward. AdaGrad adjusts the step size of each parameter by dividing by a scale based on all of its squared gradients so far.',
  'RMSProp': 'AdaGrad’s running total can only grow. RMSProp keeps the same scaling rule and replaces that total with a fading average so recent gradients can change the scale in either direction.',
  'Moment estimates': math`As in RMSProp, $g_t\odot g_t$ squares each gradient entry separately. For example, $(-2,3)\odot(-2,3)=(4,9)$. Each weight keeps its own second-moment estimate.`,
  'Correction and update': 'Both Adam averages start at zero. Correct them before using the signed average as the direction and the square root of the second moment to scale the step.',
  'Cosine decay': 'Each optimizer uses a learning rate. A schedule supplies that rate as training proceeds. Cosine decay lowers it smoothly over a fixed number of epochs.',
  'Multistep and linear': 'The schedule can also change the rate by jumps at selected epochs or by equal amounts each epoch. Use the equation that matches the timing in the problem.',
  'Cosine restarts': 'Plain cosine decay runs once. If you want repeated cycles, take the epoch within the current cycle and use it in place of the elapsed time for the whole run.',
  'Linear warmup then cosine decay': 'If full-sized steps are too aggressive at the start, ramp the rate up first. Once it reaches the target rate, start the cosine clock from zero.'
};

export const referenceOverview = {
  title: 'Optimizers at a glance',
  intro: math`Initialize the weights once. At each training step, the optimizer uses the current minibatch to decide how to change the weights. A learning-rate schedule can adjust the step-size setting $\epsilon$ over time.`,
  notation: math`$g_t$ is the minibatch gradient, $\Delta\theta=\theta_{t+1}-\theta_t$ is the weight change, and $\delta$ keeps the denominator positive. For the adaptive methods, squares, square roots, and division are per parameter.`,
  headings: ['Optimizer', 'When to try it', 'Where it acts in a training step', 'Update rule'],
  rows: optimizerOverview
};
