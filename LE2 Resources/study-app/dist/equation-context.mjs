// $...$ marks inline mathematics; all other text remains ordinary prose.
export const notationBasics = [
  [
    "$\\theta$ · parameters",
    "The adjustable numbers inside the model, such as weights and biases. Training changes these numbers; the training examples stay fixed. $\\theta$ can stand for one number or a whole list of numbers."
  ],
  [
    "L and $\\ell$ · loss",
    "A loss is a numerical penalty for a prediction. Smaller usually means a better fit under that chosen penalty. Here $\\ell$ is one example’s loss and L is the combined objective."
  ],
  [
    "$\\nabla_\\theta$ · gradient (nabla)",
    "This upside-down triangle asks: how sensitive is the loss to each parameter? For one parameter it is a derivative, or local slope. For several parameters it is a list of partial derivatives, one per parameter while holding the others fixed. A positive entry means increasing that parameter slightly increases the loss locally; a negative entry means it decreases the loss."
  ],
  [
    "$\\partial$ · partial derivative",
    "The curly d means a derivative with respect to one variable while keeping the other variables fixed. For example, if $L(a,b)=a^2+b^2$, then $\\frac{\\partial L}{\\partial a}=2a$. The gradient combines all such derivatives: (2a, 2b)."
  ],
  [
    "$\\sum$ · sum; $1/m$ · average",
    "The large sigma means add the listed terms. An index $i = 1$ to m says to visit examples 1 through m. Dividing their sum by m makes it an average."
  ],
  [
    "Subscripts and superscripts",
    "$\\theta_{t}$ is the parameter at update step t; $\\theta_{t+1}$ is its next value. The parenthesized superscript in $x^{(i)}$ labels example i, not an exponent. In contrast, $\\rho^t$ really does mean a power."
  ],
  [
    "Vectors, squares, and $\\odot$",
    "A vector is a list of numbers, often one entry per parameter. In the optimizer rules, ⊙ multiplies matching entries; squaring, square roots, and division are also entry by entry. For g = $(2,-3)$, $g\\odot g$ = (4, 9)."
  ],
  [
    "$\\epsilon$ versus $\\delta$",
    "$\\epsilon$ is the learning rate: it controls update size. $\\delta$ is a tiny positive stability constant that prevents division by zero. They do different jobs."
  ],
  [
    "$\\leftarrow$ · assignment",
    "In an algorithm, “$r\\leftarrow r+g^2$” means replace the stored r with the new result. On this page, old and new subscripts sometimes make that order explicit."
  ],
  [
    "A local slope is not a guarantee",
    "The gradient describes very small changes around the current point. Subtracting a scaled gradient is a downhill proposal; a large step or noisy gradient can still increase the loss."
  ]
];

export const equationContext = {
  "Empirical risk": {
    "purpose": "We need a single score for how well the model fits a collection of examples. This equation turns the separate prediction errors into their average.",
    "read": "For each example, make a prediction, measure its loss, add those losses, and divide by the number of examples.",
    "symbols": [
      [
        "$x^{(i)}$ and $y^{(i)}$",
        "The input and correct target for example i. The superscript (i) labels the example."
      ],
      [
        "$\\theta$",
        "The current model parameters, shared by every example."
      ],
      [
        "$f(x^{(i)};\\theta)$",
        "The model’s prediction using input $x^{(i)}$ and parameters $\\theta$. The semicolon separates the input from the parameters."
      ],
      [
        "$\\ell(\\text{prediction},\\text{target})$",
        "The chosen penalty for that example’s prediction, such as squared error."
      ],
      [
        "$\\sum_{i=1}^{m}$ and $1/m$",
        "Add the m losses and divide by m. For the full training objective, m is the sample count; for a batch average, it is the batch size."
      ],
      [
        "$L(\\theta)$",
        "The resulting average loss as a function of the model parameters."
      ]
    ],
    "example": "If three examples have losses 1, 2, and 3, then L = (1 + 2 + 3)/3 = 2. This is an average penalty, not an accuracy of 2 or a probability.",
    "insight": "“Empirical” means estimated from observed examples. Training reduces this score, but performance on unseen data still needs separate evaluation."
  },
  "Minibatch gradient": {
    "purpose": "Before updating the model, we need to know which parameter changes would reduce the loss. A small batch gives a cheaper estimate than using the entire training set.",
    "read": "Take the gradient of each example’s loss with respect to $\\theta$, then average those gradients across the batch.",
    "symbols": [
      [
        "$\\nabla_\\theta$ · nabla theta",
        "Differentiate with respect to the parameters. For one parameter this is a slope; for many it produces a vector of partial derivatives."
      ],
      [
        "$\\ell(f(x^{(i)};\\theta),y^{(i)})$",
        "The loss of prediction i. Differentiation includes how $\\theta$ affects the prediction, not just the final loss calculation."
      ],
      [
        "$m$ and $\\sum$",
        "m is the number of examples in this minibatch; $\\Sigma$ adds their gradients."
      ],
      [
        "$g$",
        "The average gradient vector used by the optimizer. Each entry corresponds to one parameter."
      ]
    ],
    "example": "For one parameter, let the two example gradients be 2 and 6. Their average is g = (2 + 6)/2 = 4. With $\\theta = 3$ and $\\epsilon = \\frac{1}{4}$, SGD proposes $\\theta_{\\mathrm{new}}$ = 3 − ($\\frac{1}{4}$)4 = 2.",
    "insight": "The gradient points toward the steepest local increase in loss under the usual Euclidean geometry. Gradient descent subtracts it. This equation computes g; the optimizer’s separate update rule changes $\\theta$."
  },
  "Repeated linear transformations": {
    "purpose": "This is a simplified way to understand why repeatedly passing a signal through the same linear transformation can make it shrink or grow. It motivates vanishing and exploding gradient problems.",
    "read": "Express W in special coordinate directions, raise each direction’s scaling factor to the number of repetitions, then transform back.",
    "symbols": [
      [
        "$W$ and $W^t$",
        "W is a matrix: a grid of numbers that transforms a vector. $W^t$ here means W multiplied by itself t times. It is not a transpose or a time-step label."
      ],
      [
        "$\\lambda_j$ · eigenvalue",
        "The scaling factor along a special direction, called an eigenvector. Multiplying by W stretches, shrinks, or reverses a vector in that direction without turning it into a different direction."
      ],
      [
        "$V$ and $V^{-1}$",
        "V contains those eigenvectors as columns. $V^{-1}$ changes into their coordinates; V changes back. The inverse undoes the transformation."
      ],
      [
        "$\\operatorname{diag}(\\lambda_1^t,\\ldots,\\lambda_d^t)$",
        "A matrix with these powered scaling factors on its diagonal and zeros elsewhere. d is the number of directions."
      ],
      [
        "$t$",
        "The integer number of repetitions. This decomposition requires W to be diagonalizable: it must have a full set of independent eigenvectors."
      ]
    ],
    "example": "Along a direction scaled by $\\lambda=\\frac12$, three repetitions scale it by $(\\frac12)^3=\\frac18$. A direction with $\\lambda=2$ is scaled by $2^3=8$. The first shrinks; the second grows.",
    "insight": "Focus first on the powered scaling factors. For this repeated linear map, $|\\lambda|<1$ shrinks a component and $|\\lambda|>1$ grows it. Real network gradients also involve other factors, including activation derivatives; this is explanatory intuition rather than the full backpropagation formula."
  },
  "Norm clipping · supplementary formalization": {
    "purpose": "Occasionally a very large gradient can produce a destructive update. Norm clipping limits the overall gradient magnitude before the optimizer uses it.",
    "read": "Keep the gradient if its length is at most c; otherwise shrink every coordinate by the same factor until its length is c.",
    "symbols": [
      [
        "$g$ and $g_{\\mathrm{clip}}$",
        "The original gradient vector and the clipped result."
      ],
      [
        "$\\lVert g\\rVert_2$",
        "The Euclidean length, or norm, of g: square the coordinates, add them, and take the square root."
      ],
      [
        "$c$",
        "The chosen positive maximum gradient length."
      ],
      [
        "$\\min(1,c/\\lVert g\\rVert_2)$",
        "Choose the smaller of these two numbers. This prevents small gradients from being scaled up. For a zero gradient, leave it unchanged rather than divide by zero."
      ]
    ],
    "example": "For g = (6, 8), its norm is √(36 + 64) = 10. If $c = 5$, the scale factor is $\\frac{5}{10}$ = $\\frac{1}{2}$, giving $g_{\\mathrm{clip}}$ = (3, 4). If the original norm were 3, it would stay unchanged.",
    "insight": "Scaling all coordinates equally preserves direction. This differs from clipping each coordinate independently. The explicit norm formula is a supplement to the deck’s introduction to clipping."
  },
  "Glorot / Xavier": {
    "purpose": "Before learning begins, weights need a sensible random scale. Glorot initialization uses the number of inputs and outputs to help control signal scale across layers.",
    "read": "For the uniform option, sample each weight between the negative and positive displayed bounds. For the normal option, sample with mean zero and the displayed standard deviation $\\sigma$.",
    "symbols": [
      [
        "$W$",
        "A layer’s weights, initialized with independent random draws under the usual scheme. This formula chooses their starting distribution; it does not update trained weights."
      ],
      [
        "$m$ and $n$",
        "Fan-in m is the number of inputs; fan-out n is the number of outputs. Here m does not mean minibatch size."
      ],
      [
        "$\\sim$ and $\\mathcal U(a,b)$",
        "“Is sampled from” a uniform distribution between a and b; all equal-length intervals inside the range have equal probability."
      ],
      [
        "$\\sigma$",
        "Standard deviation for the normal (bell-shaped) alternative. Its mean is zero and its variance is $\\sigma^2=2/(m+n)$."
      ],
      [
        "$\\sqrt{\\phantom{x}}$",
        "Square root: the nonnegative number whose square is the expression underneath."
      ]
    ],
    "example": "For $m = 2$ and $n = 6$, the normal variance is $\\frac{2}{8}$ = $\\frac{1}{4}$, so $\\sigma = \\frac{1}{2}$. The uniform bound is √($\\frac{6}{8}$) = $\\sqrt3/2$; that is a different number from the normal standard deviation.",
    "insight": "The displayed uniform distribution and normal standard deviation describe two alternatives, not two sequential operations. Increasing layer width makes their scales smaller. Glorot is associated with balancing signal propagation, especially with approximately linear or tanh-style activations."
  },
  "He / Kaiming": {
    "purpose": "Rectifier activations such as ReLU suppress negative inputs. He initialization accounts for this when setting the random weight scale, using fan-in.",
    "read": "Choose either uniform weights within ±$\\sqrt{6/m}$, or mean-zero normal weights with standard deviation $\\sqrt{2/m}$.",
    "symbols": [
      [
        "$W\\sim\\mathcal U(a,b)$",
        "Weights sampled from the stated uniform range."
      ],
      [
        "$m$",
        "Fan-in: the number of inputs feeding a unit. In this version, fan-out is not used."
      ],
      [
        "$\\sigma$ and $\\sigma^2$",
        "The normal option’s standard deviation and variance. They are $\\sqrt{2/m}$ and 2/m, respectively."
      ]
    ],
    "example": "For fan-in $m = 8$, normal variance is $\\frac{2}{8}$ = $\\frac{1}{4}$ and $\\sigma = \\frac{1}{2}$. The uniform bound is √($\\frac{6}{8}$) = $\\sqrt3/2$. Both options set an initial random scale; neither specifies every weight’s exact value.",
    "insight": "He and Glorot solve the same type of starting-scale problem under different assumptions about the activation. Neither is an optimizer or a guarantee against all unstable training."
  },
  "SGD": {
    "purpose": "Once we have a gradient, this rule converts it into a change to the model parameters. It is the basic update behind stochastic gradient descent.",
    "read": "New parameters equal old parameters minus the learning rate times the current minibatch gradient.",
    "symbols": [
      [
        "$\\theta_t$ and $\\theta_{t+1}$",
        "The parameter vector before and after update step t."
      ],
      [
        "$g_t$",
        "The minibatch gradient evaluated at the old parameters $\\theta_{t}$."
      ],
      [
        "$\\epsilon_t$",
        "The positive learning rate for this step. A schedule can change it over time."
      ],
      [
        "$-\\epsilon_tg_t$",
        "The proposed parameter change. The minus sign reverses the gradient’s uphill direction."
      ]
    ],
    "example": "If $\\theta = 3$, $g = 4$, and $\\epsilon = \\frac{1}{4}$, then $\\theta_{\\mathrm{new}}$ = 3 − 1 = 2. If $g = -4$ instead, $\\theta_{\\mathrm{new}}$ = 3 + 1 = 4. A negative gradient can therefore increase a parameter.",
    "insight": "For a multi-parameter model, apply the rule to each entry. “Stochastic” describes the sampled gradient estimate, not a different subtraction rule. A finite or noisy step may still increase the loss."
  },
  "Momentum · deck convention": {
    "purpose": "Instead of responding only to the current gradient, momentum carries some of the previous movement forward. Consistent directions can build speed while alternating components can cancel.",
    "read": "Retain a fraction $\\alpha$ of the old velocity, subtract the new gradient contribution, then add the resulting new velocity to the parameters.",
    "symbols": [
      [
        "$v_t$ and $v_{t+1}$",
        "Old and new velocity vectors: stored parameter movements. Start v at zero unless another initial state is given."
      ],
      [
        "$\\alpha$",
        "The momentum coefficient between 0 and 1, excluding 1. Larger values retain more of the previous velocity."
      ],
      [
        "$\\epsilon_tg_t$",
        "The current gradient’s learning-rate-scaled contribution."
      ],
      [
        "$\\theta_{t+1}=\\theta_t+v_{t+1}$",
        "Use the newly computed velocity. Here v already includes the negative learning-rate scaling."
      ]
    ],
    "example": "If old $v = -1$, $\\alpha = \\frac{1}{2}$, $\\epsilon = \\frac{1}{4}$, and $g = 2$, new $v = -\\frac{1}{2}$ − $\\frac{1}{2}$ = −1. Starting from $\\theta = 3$, the new parameter is 3 + (−1) = 2.",
    "insight": "Velocity is an analogy for a remembered update direction, not a physical measurement. Other textbooks use a different velocity definition; keep this rule paired with $\\theta_{\\mathrm{new}}=\\theta+v_{\\mathrm{new}}$."
  },
  "Nesterov lookahead": {
    "purpose": "Nesterov momentum checks the slope at a predicted future position, so the new gradient can adjust the movement that momentum is already proposing.",
    "read": "Evaluate the gradient at the current parameters plus $\\alpha$ times the old velocity, rather than at the current parameters alone.",
    "symbols": [
      [
        "$\\theta_t+\\alpha v_t$",
        "The temporary lookahead position, using the previous velocity. It is where the loss gradient is evaluated."
      ],
      [
        "$\\nabla_\\theta L(\\ldots)$",
        "The loss gradient with respect to the parameter position, evaluated at that lookahead point."
      ],
      [
        "$g_t$",
        "The resulting lookahead gradient. Insert it into the momentum velocity update and then update $\\theta$."
      ]
    ],
    "example": "For $L(\\theta)=\\frac{\\theta^2}{2}$, $\\theta = 2$, $v = -1$, and $\\alpha = \\frac{1}{2}$, the lookahead is $\\frac{3}{2}$. The slope of this loss equals $\\theta$, so $g = \\frac{3}{2}$ there, compared with 2 at the current position.",
    "insight": "This equation only chooses where to measure the gradient. It is not the complete parameter update. After computing the new velocity, add it to the original $\\theta$, not to the lookahead position."
  },
  "AdaGrad": {
    "purpose": "Different parameters can have very different gradient histories. AdaGrad gives each coordinate its own effective learning rate by accumulating its squared gradients.",
    "read": "Add the current squared gradient to its stored history, then divide the gradient update by the square root of that updated history plus a tiny constant.",
    "symbols": [
      [
        "$r_t$ and $r_{t-1}$",
        "New and old sums of squared gradients, one stored number per parameter. Start r at zero."
      ],
      [
        "$g_t\\odot g_t$",
        "Square each coordinate of g. Negative gradients still contribute positive squares to the history."
      ],
      [
        "$\\sqrt{r_t}$",
        "Take a square root for each coordinate, so the denominator has the scale of a gradient."
      ],
      [
        "$\\epsilon$ and $\\delta$",
        "$\\epsilon$ is the base learning rate. $\\delta$ is a tiny positive stability constant, outside the square root in the deck’s convention."
      ],
      [
        "$\\epsilon/(\\delta+\\sqrt{r_t})$",
        "The effective learning rate for that particular parameter coordinate."
      ]
    ],
    "example": "For one coordinate with old $r = 9$ and $g = 4$, new $r = 9$ + 16 = 25. With $\\epsilon = 1$ and $\\delta$ ignored for this arithmetic, the update is −4/√25 = −$\\frac{4}{5}$.",
    "insight": "The denominator uses the new accumulator. Since the sum of squares cannot decrease, AdaGrad’s effective rates cannot increase if the base rate is fixed. This can help sparse coordinates, but make long runs slow."
  },
  "RMSProp": {
    "purpose": "AdaGrad remembers every squared gradient forever. RMSProp replaces that cumulative sum with a fading average, allowing the scale estimate to respond to recent training.",
    "read": "Mix the old squared-gradient average with the current squared gradient, then use its square root to normalize the update.",
    "symbols": [
      [
        "$r_t$",
        "An exponential moving average of squared gradients, stored separately for every parameter. Start r at zero."
      ],
      [
        "$\\rho$ and $1-\\rho$",
        "The weights for old history and the new squared gradient. They add to 1. Here $0\\le\\rho<1$."
      ],
      [
        "$g_t\\odot g_t$",
        "The gradient squared entry by entry."
      ],
      [
        "$\\theta_{t+1}$ and $\\theta_t$",
        "New and old parameters. The scaled current gradient is subtracted from the old parameters."
      ],
      [
        "$\\epsilon$, $\\delta$, and $\\sqrt{r_t}$",
        "The base learning rate, a small positive stability constant, and the elementwise root of the updated average."
      ]
    ],
    "example": "With old $r = 4$, $g = 2$, and $\\rho = \\frac{1}{2}$, new r = ($\\frac{1}{2}$)4 + ($\\frac{1}{2}$)4 = 4. For $\\epsilon = \\frac{1}{2}$ and negligible $\\delta$, the parameter change is −($\\frac{1}{2}$)$\\frac{2}{2}$ = −$\\frac{1}{2}$.",
    "insight": "If g becomes zero while old r is positive, r shrinks by a factor of $\\rho$. Unlike AdaGrad’s history, it can decrease. Averaging squared gradients changes update scale; it is not the same as remembering a signed velocity."
  },
  "Moment estimates": {
    "purpose": "Adam keeps two different summaries of recent gradients: a signed average for direction and a squared average for scale. These equations build those summaries.",
    "read": "Update s by averaging the old s with the current gradient; update r by averaging the old r with the current squared gradient.",
    "symbols": [
      [
        "$s_t$",
        "The first-moment estimate: a moving mean of signed gradients. Positive and negative contributions can cancel."
      ],
      [
        "$r_t$",
        "The second raw-moment estimate: a moving mean of squared gradients. It is not the variance."
      ],
      [
        "$\\rho_1$ and $\\rho_2$",
        "Separate decay coefficients for s and r. Each is in [0, 1), and each new input has weight 1 minus its decay."
      ],
      [
        "$g_t$ and $g_t^2$",
        "The current gradient and its elementwise square. This is not a dot product that collapses the vector to one number."
      ],
      [
        "$t$",
        "The update count. Initialize $s_0=r_0=0$."
      ]
    ],
    "example": "At the first step, with $g = 2$ and both decays = $\\frac{1}{2}$, s = ($\\frac{1}{2}$)0 + ($\\frac{1}{2}$)2 = 1, while r = ($\\frac{1}{2}$)0 + ($\\frac{1}{2}$)4 = 2.",
    "insight": "“Moment” is statistical language for summaries such as a mean or mean square. Adam still needs bias correction and a parameter update; these two estimates do not directly change $\\theta$ yet."
  },
  "Correction and update": {
    "purpose": "Adam’s moving averages begin at zero, which makes their early estimates too small under the moment-estimation model. Correction compensates for that initialization before forming the update.",
    "read": "Divide each raw moment by one minus its decay raised to t, then subtract the learning-rate-scaled corrected first moment divided by the square root of the corrected second moment plus $\\delta$.",
    "symbols": [
      [
        "$\\hat s_t$ and $\\hat r_t$ · hats",
        "Bias-corrected versions of $s_{t}$ and $r_{t}$. The deck calls these s′ and r′. A hat is a label, not another multiplication."
      ],
      [
        "$1-\\rho_1^t$ and $1-\\rho_2^t$",
        "Correction denominators. The exponent t counts updates, starting at 1 for the first correction."
      ],
      [
        "$\\sqrt{\\hat r_t}$",
        "The elementwise square root of the corrected second moment. It supplies the normalization scale."
      ],
      [
        "$\\epsilon$, $\\delta$, $\\theta_t$, $\\theta_{t+1}$",
        "The base learning rate, positive stability constant, old parameters, and new parameters."
      ]
    ],
    "example": "At $t = 1$ with decays $\\frac{1}{2}$, raw $s = 1$ and $r = 2$ give $\\hat s$ = 1/($\\frac{1}{2}$) = 2 and $\\hat r$ = 2/($\\frac{1}{2}$) = 4. With $\\epsilon = \\frac{1}{10}$ and negligible $\\delta$, the update is −($\\frac{1}{10}$)$\\frac{2}{2}$ = −$\\frac{1}{10}$.",
    "insight": "Correct both averages before the update. At $t = 0$ the denominators would be zero. Bias correction is about the moment estimates’ initialization; it does not correct dataset bias or guarantee generalization."
  },
  "Cosine decay": {
    "purpose": "A learning-rate schedule changes how large the optimizer’s steps can be as training progresses. Cosine decay provides a smooth transition from an initial rate to a final rate.",
    "read": "Start from the minimum rate and add a smoothly decreasing fraction of the difference between the initial and minimum rates.",
    "symbols": [
      [
        "$\\epsilon(e)$",
        "The learning rate assigned at epoch e. An epoch is one pass through the training dataset."
      ],
      [
        "$\\epsilon_0$ and $\\epsilon_{\\min}$",
        "The initial rate and final lower rate. Usually $\\epsilon_{0}$ ≥ $\\epsilon_{\\min}$ ≥ 0."
      ],
      [
        "$e$ and $T$",
        "Elapsed epoch index and total duration. Use e from 0 through T."
      ],
      [
        "$\\cos(\\pi e/T)$",
        "A cosine evaluated in radians. As e goes from 0 to T, its angle goes from 0 to $\\pi$ and its value goes from 1 to −1."
      ],
      [
        "$(1+\\cos(\\ldots))/2$",
        "A smooth multiplier that goes from 1 to 0. The factor $\\frac{1}{2}$ is already included in the displayed formula."
      ]
    ],
    "example": "If $\\epsilon_{0} = \\frac{1}{10}$ and $\\epsilon_{\\min}$ = 0, the rate is $\\frac{1}{10}$ at $e = 0$, $\\frac{1}{20}$ at e = T/2, and 0 at e = T. Only $\\cos(0)=1$, $\\cos(\\pi/2)=0$, and $\\cos(\\pi)=-1$ are needed.",
    "insight": "The schedule supplies $\\epsilon$ to an optimizer such as SGD or Adam; it does not calculate the gradient. Without restarts this cosine schedule does not rise again within its intended interval."
  },
  "Multistep and linear": {
    "purpose": "These are two alternative schedules. Multistep lowers the rate at selected milestones; linear decay lowers it by the same amount each epoch.",
    "read": "For multistep, multiply the initial rate by γ once for every milestone already reached. For linear decay, multiply it by the fraction of training time remaining.",
    "symbols": [
      [
        "$\\epsilon_{\\mathrm{step}}(e)$ and $\\epsilon_{\\mathrm{linear}}(e)$",
        "Learning rates at epoch e under two different choices of schedule. They are not meant to be multiplied together."
      ],
      [
        "$\\gamma$",
        "The multiplicative decay factor, usually between 0 and 1. For γ = $\\frac{1}{2}$, each milestone halves the rate."
      ],
      [
        "$M_j$",
        "The epoch number of milestone j."
      ],
      [
        "$\\#\\{j:e\\ge M_j\\}$",
        "Count how many milestones satisfy this condition: how many have been reached, including one exactly at the current epoch. The # means a count."
      ],
      [
        "$e/T$ and $1-e/T$",
        "The completed fraction and remaining fraction of the training duration T."
      ]
    ],
    "example": "From $\\epsilon_{0} = \\frac{1}{10}$ with γ = $\\frac{1}{2}$, two milestones give ($\\frac{1}{10}$)($\\frac{1}{2}$)² = $\\frac{1}{40}$. For linear decay halfway through training, the rate is ($\\frac{1}{10}$)(1 − $\\frac{1}{2}$) = $\\frac{1}{20}$.",
    "insight": "A multistep curve has jumps; a linear curve is a straight decline. The displayed linear rule ends at zero and is intended for $0\\le e\\le T$, not for epochs beyond T."
  },
  "Cosine restarts": {
    "purpose": "A restart periodically raises the rate back to its initial value, then repeats the cosine decay.",
    "read": "Find how far you are into the current cycle and use that elapsed time in the cosine.",
    "symbols": [
      [
        "$R$",
        "The fixed number of epochs per restart cycle. It must be positive."
      ],
      [
        "$e\\bmod R$",
        "The remainder when e is divided by R: the elapsed position inside the current cycle. For example, $6\\bmod4=2$."
      ],
      [
        "$\\epsilon_0$ and $\\epsilon_{\\min}$",
        "The rate at the start of each cycle and its lower target. At an exact restart, the clock resets and the rate returns to $\\epsilon_{0}$."
      ]
    ],
    "example": "With $R=4$, $\\epsilon_0=1/10$, and floor zero, epoch 2 is halfway through a cycle, giving $1/20$. Epoch 4 starts the next cycle at $1/10$.",
    "insight": "The schedule resets its clock. Training continues from the current weights and optimizer state."
  },
  "Linear warmup then cosine decay": {
    "purpose": "Warmup gives training a few epochs of smaller updates before using the full initial rate.",
    "read": "Before the warmup ends, grow the rate in proportion to the elapsed epochs. At the end of warmup, start cosine decay over the remaining training time.",
    "symbols": [
      ["$e$, $W$, and $T$", "The current epoch, the warmup duration, and the final epoch. Use $0<W<T$."],
      ["$\\epsilon_0$ and $\\epsilon_{\\min}$", "The peak rate at the end of warmup and the final rate at the end of decay."],
      ["$e-W$ and $T-W$", "Elapsed time since the warmup ended and the total duration of the cosine phase."]
    ],
    "example": "For $W=4$, $T=12$, $\\epsilon_0=1/4$, and $\\epsilon_{\\min}=0$, epoch 2 gives $1/8$ during warmup. At epoch 4 the rate is $1/4$. Epoch 8 is halfway through the cosine phase and gives $1/8$.",
    "insight": "At the warmup boundary the cosine clock starts at zero, so the first cosine rate equals the warmup target."
  }
};
