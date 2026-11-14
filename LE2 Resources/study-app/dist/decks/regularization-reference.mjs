const math = String.raw;

export const referenceOverview = {
  title: 'Regularization at a glance',
  intro: 'When training performance improves and validation performance stalls or worsens, check where the model could be relying on quirks of the training data. These methods change the objective, the examples, the network, or the checkpoint you keep.',
  rows: [
    {name:'L1 and L2', slide:5, when:'Use L1 to favor some weights becoming zero. Use L2 to shrink large weights.', step:'Add a weight penalty to the training objective.', equations:[math`\Omega_{L1}=\lambda\sum_j|\theta_j|`,math`\Omega_{L2}=\lambda\theta^T\theta`]},
    {name:'MAP estimation', slide:14, when:'Use when you want the model to favor certain weights unless the data give a good reason to choose others.', step:'Start with a preference (the prior). Use the data to update it (the posterior). Pick the weights that come out on top.', mechanism:'A bell-shaped prior centered at zero, with the same spread for each independent weight, gives the L2 penalty.'},
    {name:'Label-preserving augmentation', slide:20, when:'Use when plausible changes in appearance leave the correct answer intact.', step:'Transform training inputs before the forward pass.', mechanism:'Keep the original label when the transformation preserves it.'},
    {name:'CutOut', slide:27, when:'Use when the model should cope with partial occlusion.', step:'Cover a patch of the training image.', mechanism:'Keep the original label.'},
    {name:'MixUp and CutMix', slide:28, when:'Use to train on combinations of examples. MixUp blends whole images. CutMix swaps a patch.', step:'Construct the training image and its soft target together.', equations:[math`\tilde y=\lambda y_1+(1-\lambda)y_2`], mechanism:'In CutMix, λ is the area fraction from the first image.'},
    {name:'RandAugment', slide:32, when:'Use to sample varied transformations with a small set of policy settings.', step:'Choose and apply transformations while preparing each training example.', mechanism:'N sets the number of operations. M sets their strength on operation-specific scales.'},
    {name:'Multi-task learning and parameter sharing', slide:39, when:'Use when related tasks or inputs can benefit from the same representation.', step:'Reuse encoder weights across tasks or paired inputs.', mechanism:'For multiple tasks, a weighted sum of task losses trains the shared encoder.'},
    {name:'Early stopping', slide:41, when:'Use when later checkpoints start performing worse on validation data.', step:'Evaluate saved checkpoints during training and restore the best one.', equations:[math`t^*=\arg\min_t L_{\mathrm{val}}(\theta_t)`]},
    {name:'Dropout', slide:43, when:'Use to reduce reliance on particular combinations of unit outputs.', step:'Randomly mask activations during the training forward pass.', equations:[math`\tilde h_j=m_jh_j/p`], mechanism:'Inverted dropout uses keep probability p.'},
    {name:'K-fold validation', slide:44, when:'Use to compare settings across held-out splits, especially with limited data.', step:'Retrain on each split and aggregate its held-out score.', equations:[math`\overline s=\frac1K\sum_{k=1}^K s_k`]}
  ]
};

export const referenceEquationContext = {
  'Squared loss with L2 penalty':'Start with the prediction error, then add a cost for the weights themselves. The optimizer can accept a slightly worse training fit in exchange for smaller weights.',
  'Likelihood and negative log-likelihood': 'Start with the dataset loss, then work out how to calculate it from the observed targets.',
  'Gaussian regression negative log-likelihood':'Now choose a probability model for the targets. A Gaussian centered at each prediction contributes a squared residual to the negative log-likelihood. With fixed variance, minimizing that loss gives the least-squares fit.',
  'Posterior and MAP objective':math`Say you’re predicting rent. Before looking at any listings, you expect living near campus to add a little to the rent. You’d need strong evidence to believe it doubles the rent. That starting preference is your prior, $p(\theta)$. Now check how well each guess matches the rents you actually see. That’s the likelihood, $p(\mathcal D\mid\theta)$. Combine the two and you get your updated view, the posterior $p(\theta\mid\mathcal D)$. “A posteriori” means after looking at the evidence. MAP picks the weight at the top of that updated ranking. If both guesses fit equally well, your starting preference breaks the tie.`,
  'Gaussian prior gives a quadratic penalty':'The prior in the MAP objective determines the shape of the penalty. A zero-centered Gaussian with the same variance in every direction gives the L2 term from the earlier lesson.',
  'MixUp input and target':'CutOut changes one input and keeps its label. MixUp blends two training inputs, so it uses the same proportions to blend their labels.',
  'CutMix mask and area-weighted target':'CutMix keeps whole pixels from one source or the other. Count the pixels selected from the first image to decide how much of its target to keep.',
  'Input and weight perturbations · supplementary notation':'An input perturbation changes what the model sees. A weight perturbation changes the model itself. Comparing the outputs before and after either change reveals sensitivity to that change.',
  'Weighted multi-task objective · supplementary notation':'When multiple tasks train the same feature extractor, combine their losses. The coefficients control how much each task contributes to the shared update.',
  'Shared encoder · supplementary notation':'Sharing can also happen across two inputs to one task. Apply the same encoder weights to both inputs so their representations can be compared.',
  'Select the best validation checkpoint':'Penalties and augmentation change how training proceeds. Early stopping instead chooses which saved weights to keep, using validation loss to make the choice.',
  'Inverted dropout · supplementary scaling detail':'During training, the random mask turns some outputs off. Dividing the surviving outputs by the keep probability preserves their expected value and lets you use the full activations at inference.',
  'K-fold validation average':'A single split gives one held-out score. Rotate the validation fold, retrain each time, and average the resulting scores to compare settings.',
  'L1 versus L2 · supplementary detail':'Return to the choice of weight penalty. L1 charges in proportion to absolute size and can yield zeros. L2 pulls large weights back more strongly because its slope grows with weight magnitude.'
};

const likelihoodDerivation = [
  {
    title: '1. Define the dataset loss',
    equation: math`\mathcal L_{\mathcal D}(\theta)=-\log p(\mathcal D\mid\theta)`,
    explanation: math`The dataset $\mathcal D=(X,Y)$ contains inputs $X$ and observed targets $Y$. Hold the data fixed and vary the weights $\theta$. This equation defines the loss, but we still need a model for the likelihood on the right.`,
    symbols: [
      [math`$\mathcal D=(X,Y)$`, 'The training inputs and their observed targets.'],
      [math`$\theta$`, 'The weights we are trying to choose.'],
      [math`$p(\mathcal D\mid\theta)$`, 'The likelihood of the observed data at those weights. The vertical bar means “given.”'],
      [math`$\mathcal L_{\mathcal D}(\theta)$ and $-\log$`, 'The dataset loss. A negative logarithm turns higher likelihood into lower loss.']
    ]
  },
  {
    title: '2. Treat the inputs as given',
    equation: math`p(X,Y\mid\theta)=p(Y\mid X,\theta)\,p(X\mid\theta)`,
    explanation: math`If we model the inputs and their distribution does not depend on $\theta$, the factor $p(X\mid\theta)$ is the same for every choice of weights. It adds a constant to the negative log-loss. When we treat inputs as fixed, we work directly with $p(Y\mid X,\theta)$.`,
    symbols: [
      [math`$X$ and $Y$`, 'All observed inputs and all observed targets, respectively.'],
      [math`$p(X,Y\mid\theta)$`, 'The joint likelihood of inputs and targets at the chosen weights.'],
      [math`$p(Y\mid X,\theta)$`, 'The likelihood of the observed targets given their inputs and the weights.'],
      [math`$p(X\mid\theta)$`, 'The input contribution when the inputs are modeled as random.']
    ]
  },
  {
    title: '3. Model one target with a Gaussian',
    equation: math`y_n\mid x_n,\theta\sim\mathcal N(x_n^T\theta,\sigma^2)`,
    explanation: math`For input $x_n$ and weights $\theta$, the model predicts the average target $x_n^T\theta$. An observed target can fall above or below that prediction. We assume the difference is Gaussian noise with mean zero and variance $\sigma^2$. This gives a bell curve centered at the prediction. The curve’s height at the observed target $y_n$ is the likelihood contribution that goes into the next card’s product.`,
    symbols: [
      [math`$x_n$ and $y_n$`, 'The input and observed target for training pair n.'],
      [math`$\sim\mathcal N(\mu,\sigma^2)$`, 'Is modeled by a normal distribution with mean μ and variance σ².'],
      [math`$x_n^T\theta$`, 'The predicted mean. Multiply each input feature by its matching weight and add the results.'],
      [math`$\sigma^2$`, 'The variance of the target around its predicted mean.']
    ]
  },
  {
    title: '4. Combine the target likelihoods',
    equation: math`p(Y\mid X,\theta)=\prod_{n=1}^{N}p(y_n\mid x_n,\theta)`,
    explanation: 'Assume the targets are independent once the inputs and weights are given. That lets us multiply the individual likelihoods to get the joint likelihood. If the targets are still dependent, this factorization generally fails.',
    symbols: [
      [math`$N$`, 'The number of training pairs.'],
      [math`$\prod_{n=1}^{N}$`, 'Multiply one factor for each training pair, from the first through the last.'],
      [math`$p(y_n\mid x_n,\theta)$`, 'The likelihood contribution of target n given its input and the weights.'],
      [math`$p(Y\mid X,\theta)$`, 'The joint target likelihood, given all inputs and the weights.']
    ]
  },
  {
    title: '5. Turn the product into a sum',
    equation: math`\begin{aligned}
      -\log p(Y\mid X,\theta)
        &=-\log\!\left(\prod_{n=1}^{N}p(y_n\mid x_n,\theta)\right)\\
        &=-\sum_{n=1}^{N}\log p(y_n\mid x_n,\theta).
    \end{aligned}`,
    explanation: math`Here $\log$ means the natural logarithm $\ln$, which uses base $e$. The log turns multiplication into addition. The minus sign makes higher likelihood give lower loss. This sum uses conditional independence. The Gaussian assumption specifies the individual factors.`,
    symbols: [
      [math`$\log_b(x)$`, math`The power you raise base $b$ to in order to get $x$. For base 10, the inputs $100,10,1,1/10,1/100$ give $2,1,0,-1,-2$, respectively.`],
      [math`$\ln(x)=\log_e(x)$`, math`The natural log. The inputs $e^2,e,1,1/e,1/e^2$ give $2,1,0,-1,-2$, respectively.`],
      [math`$\ln(1/x)=-\ln(x)$`, math`Taking the reciprocal flips the log’s sign. For a no-calculator answer, leave $-\ln(1/2)$ as the exact value $\ln 2$.`],
      [math`$-\log p(Y\mid X,\theta)$`, 'The negative log of the joint target likelihood.'],
      [math`$\prod_{n=1}^{N}$ and $\sum_{n=1}^{N}$`, 'Multiply the N contributions and add the N contributions, respectively.'],
      [math`$-\log p(y_n\mid x_n,\theta)$`, 'One observed target’s contribution to the final loss.']
    ]
  }
];

const mapDerivation = [
  {
    title: '1. Use Bayes’ rule to get the posterior',
    equation: math`p(\theta\mid\mathcal D)=\frac{p(\mathcal D\mid\theta)\,p(\theta)}{p(\mathcal D)}`,
    explanation: 'Start with the same likelihood used in MLE. Multiply it by the prior to account for how plausible those weights were before seeing the data. The denominator normalizes the result into the posterior.',
    symbols: [
      [math`$\theta$ and $\mathcal D$`, 'The candidate weights and the observed training data.'],
      [math`$p(\mathcal D\mid\theta)$`, 'Likelihood. How well the weights explain the observed data.'],
      [math`$p(\theta)$`, 'Prior. How plausible the weights are before accounting for the data.'],
      [math`$p(\theta\mid\mathcal D)$`, 'Posterior. How plausible the weights are after accounting for the data.'],
      [math`$p(\mathcal D)$`, 'Evidence. It normalizes the posterior and is fixed while comparing weights for the same data and model.']
    ]
  },
  {
    title: '2. Take the negative log',
    equation: math`\begin{aligned}
      -\log p(\theta\mid\mathcal D)
        &=-\log p(\mathcal D\mid\theta)-\log p(\theta)\\
        &\quad+\log p(\mathcal D).
    \end{aligned}`,
    explanation: 'The log turns the product in the numerator into a sum and the division into subtraction. The minus sign outside the log reverses all three signs and makes the highest posterior correspond to the lowest loss.',
    symbols: [
      [math`$\log$`, 'The natural logarithm, also written ln. Its base is e.'],
      [math`$-\log p(\mathcal D\mid\theta)$`, 'The data loss already used in MLE.'],
      [math`$-\log p(\theta)$`, 'The penalty from the prior.'],
      [math`$+\log p(\mathcal D)$`, 'The constant from dividing by the evidence.']
    ]
  },
  {
    title: '3. Choose the weights that minimize the loss',
    equation: math`\theta_{\mathrm{MAP}}
      =\arg\min_\theta\bigl[-\log p(\mathcal D\mid\theta)-\log p(\theta)\bigr]`,
    explanation: 'The evidence term adds the same number for every choice of weights, so dropping it leaves the minimizing weights unchanged. The remaining objective is the MLE data loss plus a penalty from the prior.',
    symbols: [
      [math`$\arg\min_\theta$`, 'Return the weights that give the lowest value inside the brackets.'],
      [math`$\theta_{\mathrm{MAP}}$`, 'The weights at the peak of the posterior.']
    ]
  }
];

const gaussianPriorDerivation = [
  {
    title: '4. Choose a Gaussian prior on the weights',
    equation: math`\begin{aligned}
      \theta&\sim\mathcal N(0,\tau^2 I),\\
      p(\theta)&=(2\pi\tau^2)^{-d/2}
        \exp\!\left(-\frac{\theta^T\theta}{2\tau^2}\right).
    \end{aligned}`,
    explanation: math`Assume the weights are independent, each centered at zero with the same variance $\tau^2$. Multiplying their Gaussian densities gives the joint prior. The squared weights add in the exponent.`,
    symbols: [
      [math`$\tau^2 I$`, 'The prior covariance. Each weight has variance τ² and the off-diagonal entries are zero.'],
      [math`$d$`, 'The number of weights.'],
      [math`$\theta^T\theta$`, 'The sum of the squared weights.']
    ]
  },
  {
    title: '5. The negative log-prior gives the L2 penalty',
    equation: math`\begin{aligned}
      -\log p(\theta)
        &=\frac{\theta^T\theta}{2\tau^2}
          +\frac d2\log(2\pi\tau^2)\\
        &=\lambda\theta^T\theta+C.
    \end{aligned}`,
    explanation: math`The negative log pulls the squared weights out of the exponential. The L2 penalty is $\lambda\theta^T\theta$. With fixed $\Sigma=\tau^2 I$, the full negative log-prior also includes $C$. Every choice of weights gets the same $C$, so the optimization uses just the L2 term. A smaller prior variance gives a larger $\lambda$.`,
    symbols: [
      [math`$\lambda=1/(2\tau^2)$`, 'The penalty coefficient when the data loss is the original negative log-likelihood.'],
      [math`$C$`, 'The Gaussian normalizing term after taking the negative log.']
    ]
  },
  {
    title: '6. Combine squared error with L2',
    equation: math`\theta_{\mathrm{MAP}}=\arg\min_\theta\left[
      \frac{1}{2\sigma^2}\sum_{n=1}^{N}(y_n-x_n^T\theta)^2
      +\frac{1}{2\tau^2}\theta^T\theta
    \right]`,
    explanation: math`The Gaussian model for the targets supplies the squared-error term. The Gaussian prior for the weights supplies the L2 term. With fixed $\sigma^2$ and $\tau^2$, the normalizing terms are constant in the weights and can be dropped.`,
    symbols: [
      [math`$y_n-x_n^T\theta$`, 'The observed target minus its prediction.'],
      [math`$\sigma^2$`, 'Variance of the target around its predicted mean.'],
      [math`$\tau^2$`, 'Variance of each weight under the prior.']
    ]
  }
];

export const referenceDerivations = {
  'Likelihood and negative log-likelihood': likelihoodDerivation,
  'Posterior and MAP objective': mapDerivation,
  'Gaussian prior gives a quadratic penalty': gaussianPriorDerivation
};
