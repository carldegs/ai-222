const math = String.raw;

export const tutorLessons = [
  {title: 'What are we trying to improve?', steps: [
    {slide: 2, sources: [2, 3], title: 'Start with one prediction', explain: [
      'Imagine a tiny model with one adjustable number. Whatever example you show it, it predicts that number. We call the adjustable number a parameter and write it as $\\theta$.',
      'Suppose the correct answer is 4 and our model predicts 1. The prediction is 3 away from the target. If we square that distance, we get a loss of 9. A [[3:loss]] turns the quality of a prediction into a number we can try to make smaller.'
    ], lab: 'prediction', check: ['What happens to the loss if the prediction moves from 1 to 3?', 'The error shrinks from 3 to 1, so the squared loss falls from 9 to 1.']},
    {slide: 4, sources: [3, 4], title: 'One parameter, several examples', formulas: [0], explain: [
      'Now give the same model three correct answers: 2, 4, and 6. If it predicts 4 every time, the squared losses are 4, 0, and 4. Average them to get $8/3$.',
      math`On slide 4, $m$ counts the examples and $\sum$ says to add their losses. The $1/m$ outside that sum turns the total into an average. The slide calls the result [[4:empirical risk]]. Here, “empirical” means we calculated it from the examples we actually saw.`,
      math`The model’s prediction is written $f(x^{(i)};\theta)$, meaning “apply the model with parameters $\theta$ to example $i$.” The correct answer is $y^{(i)}$. The loss compares those two numbers before we average.`
    ], check: ['Why does predicting 4 still give a positive average loss?', 'The model gets the middle example exactly right and misses both of the others. All three examples contribute to the average.']},
    {slide: 5, title: 'Use a few examples to decide the next move', formulas: [1], explain: [
      'A [[5:minibatch]] is the group of examples used for one update. At a prediction of 4, a batch with targets 2 and 4 nudges the model lower. A batch with targets 4 and 6 nudges it higher. Both give partial information about the same problem. In the demo, the slope tells you how the loss responds if you nudge the prediction higher.',
      'Small batches let us update sooner and usually use less memory. Their estimates can vary more from one batch to the next. Shuffling helps keep examples of one type from being grouped together in a fixed order. The slide also lists practical tradeoffs for GPU use, memory, and learning.',
      math`You’ll see $\nabla_\theta$ on [[18:the SGD slide]]. That upside-down triangle means “find the slope for each parameter.” The average of those slopes across the batch is the estimate $g$.`
    ], lab: 'batch', bridge: 'SGD will take the slope estimated from a batch and use it to move the parameters.', check: ['What stays fixed while you compare the two batches?', 'The model still predicts 4. Only the examples used to estimate the slope change.']}
  ]},
  {title: 'Why can a downhill step go wrong?', steps: [
    {slide: 6, sources: [6, 11], title: 'A dip can look like the bottom', explain: [
      'Imagine plotting loss against a single parameter. Moving left or right changes the parameter. The height of the curve is the loss.',
      'A [[11:local minimum]] has no lower point immediately around it. A global minimum is as low as anywhere on the entire curve. Slide 6 calls a bowl-shaped loss convex. In that case, every local minimum also has the lowest loss overall.'
    ]},
    {slide: 7, sources: [7, 31], title: 'Flat in one direction can hide a way down', explain: [
      'With two parameters you can move in two directions. At a [[7:saddle]], the slope at the center is zero, but one direction leads uphill and another leads downhill. Picture the center of a horse saddle.',
      'Slide 7 uses the [[7:Hessian]] to describe this. The Hessian measures curvature, or how the slope changes as you move. Its eigenvalues describe curvature along particular directions. A mix of positive and negative values tells you that some of those directions curve up and others curve down. A minibatch can give a slightly different gradient and help the parameters move away from the saddle.'
    ], figure: {page: 7, box: [64, 7, 27, 31], caption: 'Follow the arrow to the flat spot in the curve. The slide uses this profile to introduce a saddle.'}, check: ['Can a zero slope tell you whether you are at a minimum?', 'Check nearby directions. A saddle can have zero slope at its center even though there are points with lower loss nearby.']},
    {slide: 8, title: 'A steep slope can send you too far', formulas: [1], explain: [
      'A steep slope gives a large gradient. If an update scales that gradient by the usual learning rate, it can move the parameters a long way in one step.',
      '[[8:Gradient clipping]] caps a large gradient before the update uses it. A norm cap scales the whole gradient down together. That keeps its direction and reduces its length.'
    ], figure: {page: 8, box: [48, 12, 47, 43], caption: 'The red arrow is the proposed step. Compare its end with the much lower part of the curve.'}},
    {slide: 9, sources: [9, 10], title: 'Small effects multiply across many steps', formulas: [0], explain: [
      'Suppose a signal is halved each time it passes through a layer. After three repetitions it is one eighth of its original size. If it doubles each time, it becomes eight times as large.',
      math`Slide 9 shows this idea for repeated multiplication by a matrix $W$. An eigenvalue $\lambda$ describes the multiplier along one direction. Repeating it gives $\lambda^t$. Gradients can become extremely small or large as they pass through many operations.`,
      'Slide 10 shows a different difficulty. A minibatch gives a noisy estimate of the gradient, so its direction may differ from the direction computed over all the training data.'
    ], lab: 'signal', bridge: 'Initialization affects the starting parameter values and the scale of signals before training begins.'}
  ]},
  {title: 'Give the model a useful starting point', steps: [
    {slide: 12, sources: [11, 12, 13, 14], title: 'What changes when weights start differently?', explain: [
      'A weight controls how strongly an input contributes to the next calculation. If two units start with identical weights and receive identical updates, they can keep learning the same thing.',
      'Starting with random weights gives units a chance to learn different things. The scale of the random values also matters. After many layers, repeated shrinking or growing can leave gradients too weak or too large for useful updates.',
      math`The next slides choose a starting scale using the size of the layer. Read $m$ as fan-in (the number of inputs) and $n$ as fan-out (the number of outputs). If you use the normal version, $\sigma$ is the standard deviation, a measure of how spread out the starting weights are.`
    ], check: ['Why can giving every weight the same starting value cause trouble?', 'Units with identical inputs, weights, and updates can stay identical, reducing the variety of things they learn.']},
    {slide: 13, sources: [13, 14], title: 'Glorot uses the input and output counts', formulas:[0], explain: [
      'Fan-in means how many inputs feed a unit. Fan-out means how many outputs it feeds. In the slide notation these counts are $m$ and $n$.',
      math`For normal initialization, [[13:Glorot]] uses variance $2/(m+n)$. For $m=n=4$, the variance is $1/4$.`,
      'Variance measures spread. Take its square root to get the standard deviation when the exercise asks for it.'
    ], check: ['If Glorot variance is 1/4, what is its standard deviation?', 'The square root of 1/4 is 1/2.']},
    {slide: 15, title: 'Bias has a different job', explain: [
      'A bias is a constant added to the weighted inputs. It shifts the value going into the activation. Even when the inputs are all zero, the bias can change the output.',
      'Slide 15 gives starting choices for biases, including a positive forget-gate bias for LSTMs. These are examples tied to the layer and activation. The main distinction is that weights set input contributions and biases shift the result.'
    ], bridge: 'Once the initial parameters are set, SGD and the other optimizers determine how those parameters move.'}
  ]},
  {title: 'Take your first gradient step', steps: [
    {slide: 17, sources: [16, 17], title: 'Read the slope before deciding where to go', explain: [
      'Imagine a bowl-shaped loss with its bottom at zero. If you stand on its right side, moving farther right raises the loss. The slope is positive, so a move to the left takes you downhill.',
      math`With several parameters, the gradient collects one slope per parameter. The upside-down triangle $\nabla_\theta$ on the slides means “take those slopes with respect to the parameters $\theta$.” The deck calls the estimated gradient $g$. Subtracting it points the update downhill locally.`
    ], check: ['If the slope is negative, which way does subtracting it move the parameter?', 'It increases the parameter. Subtracting a negative number adds a positive number.']},
    {slide: 18, title: 'Try a small step and a large step', formulas: [0], explain: [
      math`The [[17:learning rate]] $\epsilon$ multiplies the slope. Start at $\theta=4$ on $L(\theta)=\theta^2/2$. Here the slope is $g=4$. At learning rate $1/2$, the update is $4-(1/2)4=2$.`,
      'Change the learning rate and make a step. Watch what happens to the loss after you cross the bottom of the bowl.'
    ], lab: 'gradient', check: ['How can following the downhill direction increase the loss?', 'The direction is local. A large step can cross the bottom and land higher on the other side.']},
    {slide: 18, title: 'Read the algorithm as a loop', explain: [
      'First select a minibatch. Then estimate the gradient at the current parameters. Finally subtract the learning rate times that gradient. Repeat from the new parameters.',
      'The S in [[18:SGD]] stands for stochastic. The choice of minibatch makes the estimated slope vary. At each update the basic rule uses the current estimate.'
    ], bridge: 'Momentum keeps some of the previous update. Adaptive methods will keep other summaries of past gradients.'}
  ]},
  {title: 'Remember which way you were moving', steps: [
    {slide: 20, sources: [19, 20], title: 'Why does plain SGD zigzag?', explain: [
      'In a narrow valley, the slope across the valley is steep, while the slope along it is gentle. A step can cross the valley, then the next step points sharply back across it.',
      '[[20:Momentum]] carries part of the previous move into the next update. Across the valley, opposite moves can partially cancel. Along the valley, repeated moves in the same direction can build up.'
    ], figure: {page: 20, box: [9, 40, 82, 45], caption: 'Compare the two paths inside the ovals. The left path crosses the valley repeatedly. The right path reaches farther along the valley.'}},
    {slide: 21, title: 'Keep a fraction of the last move', formulas: [0], explain: [
      math`The deck calls the remembered move $v$. Multiply the old $v$ by $\alpha$, then subtract the new gradient contribution $\epsilon g$. Add the resulting $v$ to $\theta$.`,
      math`Try $v=-2$, $\alpha=1/2$, $\epsilon=1/2$, and $g=2$. The remembered part is $-1$ and the gradient adds another $-1$, so the new $v$ is $-2$.`
    ], lab: 'momentum', check: ['If α is zero, what remains of the update?', 'The move is −εg, the current gradient contribution.']},
    {slide: 22, sources: [22, 23], title: 'Check the slope where momentum would take you', formulas: [1], explain: [
      math`[[22:Nesterov momentum]] first looks at $\theta+\alpha v$. That is where the remembered part of the move would take us. It evaluates the gradient at that lookahead position, then uses that gradient to compute the actual update.`,
      'Imagine the current slope points down to the right, but your remembered move would carry you past the bottom. The slope at the lookahead position can already point the other way.'
    ], bridge: 'Momentum summarizes signed movement. AdaGrad uses squared gradients to decide how large a step each parameter should get.'}
  ]},
  {title: 'Give each parameter its own step size', steps: [
    {slide: 24, title: 'Two parameters can see different slopes', explain: [
      'Imagine two parameters with the same current slope. One has often had large gradients, while the other has rarely moved. [[24:AdaGrad]] uses that history to scale their updates differently.',
      math`The deck calls the history $r$. Add each parameter’s squared gradient to its own entry in $r$. Squaring makes both positive and negative gradients contribute to the scale.`
    ], check: ['What does a gradient of −3 add to r?', 'Its square is 9. A gradient of +3 adds the same amount.']},
    {slide: 25, title: 'Divide by the size of the history', formulas: [0], explain: [
      math`In the deck’s AdaGrad update, divide the current gradient by $\delta+\sqrt r$. The square root puts the accumulated squares back on a gradient scale. The small $\delta$ keeps the denominator away from zero.`,
      'In the demonstration, make the gradient large for a few updates. Then make it small. Notice that the accumulated history remains large, so the update stays relatively small.'
    ], lab: 'adagrad', bridge: 'AdaGrad’s accumulated history can only grow. RMSProp replaces the sum with a moving average.'}
  ]},
  {title: 'Let old gradients fade', steps: [
    {slide: 26, title: 'A moving average can adapt', formulas: [0], explain: [
      math`[[26:RMSProp]] keeps the same idea of scaling the gradient by its recent size. For each parameter, the new $r$ is $\rho$ times the old $r$ plus $(1-\rho)$ times the new squared gradient.`,
      math`Try $r=16$, $g=2$, and $\rho=1/2$. The old history contributes $(1/2)16=8$ and the new gradient contributes $(1/2)2^2=2$. Add them to get $10$. AdaGrad would add 4 to 16 and get 20. RMSProp can lower its estimate when recent gradients are smaller.`
    ], lab: 'rmsprop', check: ['What happens to old information when ρ is closer to 1?', 'It fades more slowly. The old r keeps a larger share of its previous value at each update.']},
    {slide: 27, title: 'Use the recent scale to make the step', explain: [
      math`After computing $r$, RMSProp uses $\delta+\sqrt r$ to scale the current $g$. When the recent squared gradients are large, the denominator is large. As the history fades, that denominator can shrink.`,
      'For an exam problem, update the history first. Then use the updated value to compute the parameter move.'
    ], bridge: 'Adam uses a similar squared-gradient average for scale and also keeps an average of the signed gradients.'}
  ]},
  {title: 'Combine a direction with a scale', steps: [
    {slide: 28, title: 'Keep two different averages', formulas: [0], explain: [
      math`[[28:Adam]] calls the signed-gradient average $s$ and the squared-gradient average $r$. If recent gradients alternate between $+2$ and $-2$, their signed contributions can cancel in $s$. Their squares both contribute 4 to $r$.`,
      'This gives Adam two pieces of information. The signed average tells it which direction has been consistent. The squared average helps it choose the size of that move.'
    ], check: ['Which average can be close to zero while the gradients are individually large?', 'The signed average s. Large positive and negative gradients can cancel.']},
    {slide: 29, sources: [28, 29], title: 'Correct for the averages starting at zero', formulas: [1], explain: [
      math`Start both averages at zero. For a first gradient of 2 and decay rates of $1/2$, the raw averages are $s=1$ and $r=2$. Only half of each average comes from the data so far.`,
      math`The correction divides each average by $1-\rho^t$, using its own decay rate. At the first step both denominators are $1/2$, so the corrected values are $s'=2$ and $r'=4$. Adam scales the corrected direction $s'$ by $\delta+\sqrt{r'}$ before making the move.`
    ], lab: 'adam', check: ['With g = 2 and both decay rates 1/2, what is the corrected direction on the first step?', 'It is 2. The raw average is 1 and the correction divides by 1/2.']},
    {slide: 30, sources: [30, 31], title: 'Compare paths on one loss surface', explain: [
      'On slide 30, the curves show how different update rules move on the same surface. Their paths can differ because of how they combine the current gradient, its history, and step size.',
      'Use the figure to ask where a path changes direction or spends many steps. The comparison applies to the surface and settings shown.'
    ], figure: {page: 30, box: [20, 7, 61, 83], caption: 'Follow a path from the starting area toward the star. Compare its turns with another path. The legend identifies the update rules.'}}
  ]},
  {title: 'Change the learning rate as training runs', steps: [
    {slide: 32, sources: [32, 33, 34, 35, 36, 37, 38], title: 'Set the size of future steps', explain: [
      math`A schedule gives the optimizer a learning rate $\epsilon$ at each point in training. SGD, momentum and Adam can all use a schedule. Each still follows its own update rule. The learning rate multiplies the move that rule computes.`,
      'A [[37:linear schedule]] changes the rate by the same amount over equal intervals. A [[35:multistep schedule]] holds it steady between sudden drops. A [[33:cosine schedule]] starts and ends gently, with a faster change in the middle.'
    ], check: ['If everything else in the update stays fixed, what does halving ε do to the size of the move?', 'It halves the size of the move.']},
    {slide: 41, sources: [39, 40, 41, 42], title: 'Read warmup on the graph', explain: [
      '[[41:Warmup]] starts training with a small learning rate and raises it over the first few epochs. On slide 41, the line climbs quickly at the far left and then starts its cosine decay.',
      'Warmup is the gradual increase at the start. After the peak the learning rate follows the cosine curve.'
    ], figure: {page: 41, box: [14, 35, 14, 60], caption: 'Look at the short rising segment before the peak. The longer curve after the peak is the decay.'}, check: ['When does cosine decay begin on this slide?', 'It begins after the warmup reaches the peak learning rate.']}
  ]},
  {title: 'Follow one update from start to finish', steps: [
    {slide: 44, sources: [5, 12, 18, 21, 29, 32], title: 'Put the pieces in their place', explain: [
      'Initialization gives us starting parameters. The model uses those parameters to make predictions on a minibatch. The loss compares predictions with the targets. The gradient estimates how the loss changes with the parameters.',
      'The optimizer turns that gradient into a move. A schedule supplies the learning rate. With momentum the move also depends on remembered velocity. With Adam it depends on the corrected averages. After applying the update, the next minibatch sees the new parameters.'
    ], flow: true, check: ['Which part tells us how wrong the predictions are, and which part turns the gradient into a move?', 'The loss measures prediction error. The optimizer uses the gradient and its update rule to determine the move.']},
    {slide: 44, sources: [43, 44], title: 'Choose a response to what you see', explain: [
      'If the first updates jump wildly, inspect the learning rate and gradient size. A smaller rate or clipping may help depending on the cause. If an AdaGrad run barely moves after a long time, inspect the accumulated squared gradients in its denominator. This running sum can make the denominator grow and the step shrink. If an update repeatedly crosses a narrow valley, compare it with momentum.',
      'Slide 44 names SGD with momentum and Adam as common starting points. Choose based on the task and check both the training behavior and performance on unseen data.'
    ], figure: {page: 44, box: [45, 2, 54, 66], caption: 'Each small plot represents a different setting. Follow the same colored line across plots and look for changes in its ranking.'}, check: ['The gradient stays large but the AdaGrad step gets smaller. Which part of the update would you inspect first?', 'Inspect the denominator. The accumulated squared gradients in r keep increasing, which can shrink the step even if the current gradient stays large.']}
  ]}
];
