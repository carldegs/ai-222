import {examples as detectionExamples} from './decks/detection-practice.mjs';
import {examples as segmentationExamples} from './decks/segmentation-practice.mjs';

const math = String.raw;

// Slides that were previously only references in the topic-based guide.
const extraOptimization = [
  {slide:1, topic:0, title:'Optimization', explain:[
    'Rowel Atienza’s deck follows the decisions made while training a model. Start by asking what the model is trying to improve. Then follow how an update is chosen, why it can go wrong, and how optimizers and learning-rate schedules change it.'
  ]},
  {slide:3, topic:0, title:'Measure error on the examples you have', explain:[
    math`The empirical distribution treats the training examples as the observations available to you. In the slide, $x^{(i)}$ is input $i$ and $y^{(i)}$ is its target. The model $f(x^{(i)};\theta)$ predicts an answer and the loss measures how far that answer is from the target.`,
    'One example gives one loss. The next slide turns those separate values into a single objective to minimize.'
  ]},
  {slide:10, topic:1, title:'A minibatch can give a noisy direction', explain:[
    'Imagine two minibatches that contain different kinds of examples. Their gradients can point in different directions at the same parameter values. A gradient estimated from a small batch can differ from the full-data gradient.',
    'This is why the loss can rise on some steps even when it falls over the course of training. The update follows the batch estimate, while the full-data loss describes the entire training set.'
  ]},
  {slide:11, topic:2, title:'The starting point changes which valley you reach', explain:[
    'From the starting point marked by the arrow, the local downhill direction takes you toward the dip on the left. The curve has a lower valley on the right. Following a local slope gives you no direct view of that valley.',
    'Initialization chooses those starting parameters. On the next slide, the deck starts with simple ways to choose starting weights.'
  ], figure:{page:11,box:[17,46,51,44],caption:'Trace the curve from the arrow. Compare the dip nearby with the lower point on the right.'}},
  {slide:14, topic:2, title:'He scales the weights using the input count', formulas:[1], explain:[
    math`He initialization uses fan-in $m$, the number of inputs to a unit. The normal version gives variance $2/m$. For $m=4$, that is $1/2$. Take the square root if you are asked for the standard deviation.`,
    'He initialization accounts for rectifiers such as ReLU, which pass positive values and turn negative ones into zero. Glorot, on the previous slide, uses both fan-in and fan-out.'
  ]},
  {slide:16, topic:3, title:'Meet the update rules the deck will compare', explain:[
    'This slide is the menu for the next part of the deck. Each optimizer needs to turn information about the loss into a change to the weights. Start with the simplest rule, stochastic gradient descent, which uses the gradient estimated from the current minibatch.'
  ]},
  {slide:19, topic:4, title:'Carry some of the last move forward', explain:[
    math`In the first equation, $v$ is the previous move and $\alpha$ controls the fraction you carry forward. Subtract $\epsilon g$ to incorporate the current slope. The second equation adds the new $v$ to the weights.`,
    'Imagine consecutive gradients that point in the same direction. Their moves build on one another. If the directions alternate, part of the old move can cancel part of the new one.'
  ]},
  {slide:23, topic:4, title:'Read the Nesterov loop line by line', explain:[
    math`Find the line that computes the lookahead point $\theta+\alpha v$. The algorithm estimates the gradient there, then uses it to update $v$. The last line applies that new velocity to the current weights.`,
    'The lookahead point is where you measure the slope. The update with that new slope determines where the parameters actually end up.'
  ]},
  {slide:31, topic:7, title:'Watch the optimizers approach a saddle', explain:[
    'At the center of the surface, one cross-section bends upward and another bends downward. A direction that seems to lead into a minimum in one cross-section may lead out of it along another.',
    'Follow the paths in the figure and compare how they move near the saddle. The result depends on the particular surface, starting point and settings.'
  ], figure:{page:31,box:[22,10,58,78],caption:'Trace a raised edge and a blue trough through the center. They show the two kinds of curvature.'}},
  {slide:33, topic:8, title:'Read the shape of cosine decay', explain:[
    'The horizontal axis shows epochs. The vertical axis shows learning rate. The curve starts near the initial rate, falls more quickly around the middle and flattens again near the end.',
    'Pick two equal-width intervals, one near the start and one near the middle. The change in rate is larger in the middle interval.'
  ]},
  {slide:34, topic:8, title:'Read cosine decay at the start, middle and end', formulas:[0], explain:[
    math`The code turns elapsed training into a fraction $e/T$. Multiply that fraction by $\pi$ and take its cosine. At the start, halfway point and end, the cosine is $1$, $0$ and $-1$, respectively.`,
    'That puts the learning rate at the initial rate, the midpoint of the initial and final rates, and the final rate. Use those three anchor points in the worked problem.'
  ]},
  {slide:35, topic:8, title:'Hold the learning rate until a milestone', explain:[
    'Each horizontal segment represents epochs that use the same learning rate. Each vertical drop occurs at a chosen milestone.',
    'Compare with the cosine curve. Multistep decay changes the rate at specific epochs and uses plateaus between them.'
  ]},
  {slide:36, topic:8, title:'Apply the drop factor once per milestone', explain:[
    math`The loop starts with the initial learning rate and multiplies it by the drop factor whenever the current epoch has reached another milestone. For example, a factor of $1/2$ leaves one half of the initial rate after one milestone and one quarter after two.`
  ]},
  {slide:37, topic:8, title:'Take equal amounts off the rate each epoch', explain:[
    'Linear decay follows a straight line. Take any two intervals of the same length and the learning rate falls by the same amount over each one. On this slide it reaches zero at the final epoch.'
  ]},
  {slide:38, topic:8, title:'Calculate how much of the initial rate remains', formulas:[1], explain:[
    math`Divide elapsed epochs $e$ by the total $T$ to get the completed fraction. Subtract it from one and multiply by the initial rate. Halfway through training, half the initial rate remains.`,
    'Use the formula over the scheduled interval. If training runs longer, a practical implementation can cap the rate at its final value.'
  ]},
  {slide:39, topic:8, title:'Watch the learning rate rise at a restart', explain:[
    'A learning-rate restart starts a new cosine cycle. The graph jumps back to the initial learning rate at a restart boundary. Training continues from the current weights.'
  ], check:['What quantity jumps at a learning-rate restart?', 'The learning rate. The weights continue from their current values.']},
  {slide:40, topic:8, title:'Use the remainder to find your place in a cycle', formulas:[2], explain:[
    math`The percent sign in the code computes the remainder after division. With a restart period of $50$, epoch $57$ has remainder $7$, so it uses the cosine rate seven epochs into the new cycle.`
  ]},
  {slide:42, topic:8, title:'Calculate the warmup rate and then switch to decay', formulas:[3], explain:[
    'The first branch handles epochs before warmup finishes. It gives you the fraction of the initial rate reached so far. The second branch starts the cosine calculation from the end of warmup.',
    'When you calculate a decay rate after warmup, measure elapsed time from that boundary. Compare the schedules in the demo, then try the worked problem.'
  ], lab:'schedule'},
  {slide:43, topic:9, title:'Find the references for the optimizer discussion', explain:[
    'The deck points to the Deep Learning textbook and an overview of gradient descent methods. Use these sources if you want to revisit why a method behaves the way it does. The Further learning tab collects related reading.'
  ]}
];

const extraRegularization = [
  {slide:1, topic:0, title:'Regularization', explain:[
    'Rowel Atienza’s deck asks how a model can learn a pattern it can use on new examples. We’ll start by defining that goal, then work through ways to encourage it using the training objective, the data, the model and the choice of checkpoint.'
  ]},
  {slide:3, topic:0, title:'Recognize memorization in a training run', explain:[
    'A flexible model may remember the specific input–output pairs it trained on. It then gets a low training error while still making mistakes on new examples.',
    'When training loss keeps falling and validation loss starts rising, the model may be learning details specific to the training sample. This is the overfitting problem the deck addresses.'
  ]},
  {slide:4, topic:0, title:'See where a regularizer can intervene', explain:[
    'A regularizer encourages solutions that are more likely to work on new examples. This slide previews several ways to do that. You can add a cost to the training objective, expose the model to more kinds of examples, or change what parts of the model it can rely on.',
    'The next slide starts with a cost for large weights. We’ll return to the other methods when the deck reaches them.'
  ]},
  {slide:6, topic:2, title:'Move from a loss to a probability model', explain:[
    'The weight-penalty slide gave us a formula to minimize. This title slide starts a new question. If different parameter values make the observed examples more or less likely, can we use those likelihoods to choose parameters?'
  ]},
  {slide:8, topic:2, title:'Put a bell curve around each prediction', explain:[
    math`For apartment $n$, $x_n$ holds the inputs, such as floor area and distance from campus, and $\theta$ holds the weights. Multiply each input by its weight and add to get $x_n^T\theta$, the predicted rent. The actual rent $y_n$ is what we observed. If we measure rent in thousands of pesos and predict 10 when the rent is 11, the error, also called the residual, is $11-10=1$.`,
    math`Slide 8 puts the peak of a bell curve, also called a Gaussian, at the prediction. At a prediction of 10, the curve is equally high at 9 and 11. It is lower at 12 because 12 is farther from the peak. We use the height at the actual rent as its likelihood score. The symbol $\sigma^2$ is the variance, which controls the spread. A bigger variance makes the bell wider.`
  ], figure:{page:8,box:[30,64,43,11],caption:'Inside the Gaussian on slide 8, the first quantity after the vertical bar sets the center and the second sets the spread.'}},
  {slide:9, topic:2, title:'Score the rents together', explain:[
    math`Now say we observe rents of 11 and 9. Each apartment has its own curve centered at its own prediction. Read the first curve’s height at 11 and the second curve’s height at 9. The same weights $\theta$ are used for both predictions.`,
    'Slide 9 calls its assumption IID, short for independent and identically distributed. Independence, once the inputs and weights are given, is what lets us multiply the two heights. We use the same bell-curve rule for each apartment, with a center that depends on its own inputs.'
  ]},
  {slide:10, topic:2, title:'Turn the likelihood product into a sum of losses', explain:[
    'A log turns multiplication into addition. You can compute a log for each example and add the results. A larger likelihood still has a larger log, so negating that log makes the preferred parameter setting have the smaller loss.',
    'When an exercise only asks which of two likelihoods is bigger, compare their products directly.'
  ]},
  {slide:11, topic:2, title:'Look inside one bell-curve score', explain:[
    math`The $\mathcal N$ in slide 11 stands for the Gaussian. For one apartment, its height is a multiplier $K=1/\sqrt{2\pi\sigma^2}$ times $e^{-a}$, where $a=(y_n-x_n^T\theta)^2/(2\sigma^2)$. The multiplier sets the scale of the curve. The exponential makes the height fall as the error gets larger in either direction. At zero error, $e^0=1$, so the curve reaches its peak.`
  ]},
  {slide:15, topic:0, title:'Compare training and test error to diagnose the fit', explain:[
    'Capacity is the range of functions a model can represent. A model that cannot represent the pattern can have high training and test errors. That is underfitting.',
    'A model that captures the quirks of training examples can have low training error and high test error. That is overfitting. Low error on both is the pattern we hope to see.'
  ]},
  {slide:17, topic:0, title:'A straight line misses the bend', explain:[
    'The line has a slope and an intercept. Those two parameters can tilt and shift the line. A line cannot bend with the curved data, so it can miss the pattern even on the points used to train it.'
  ], figure:{page:17,box:[27,32,42,59],caption:'Compare the straight fit with the curved data. Look for places where even nearby training points are far from the line.'}},
  {slide:18, topic:0, title:'A flexible curve can chase the wiggles', explain:[
    'Adding powers of the input gives the polynomial many more ways to bend. That flexibility can make it follow the observed samples closely while straying from the broader pattern between and beyond them.',
    'The slide calls this overfitting because the training error is small while the test error is large.'
  ], figure:{page:18,box:[27,32,42,59],caption:'Notice how closely the fitted curve follows the sample-specific bends.'}},
  {slide:19, topic:0, title:'The quadratic captures the main pattern', explain:[
    'The quadratic has enough flexibility to capture the bend in the underlying curve. In this example, it also generalizes well to the test examples.',
    'Compare all three figures in the demo. Look for underfitting in the line, overfitting in the sixth-degree curve, and lower error on both sets in the quadratic example.'
  ], lab:'capacity', check:['Which fit has small training error but large test error?', 'The sixth-degree fit on slide 18. Its gap is a sign of overfitting, meaning it fit the training examples better than it generalized to new ones.']},
  {slide:21, topic:4, title:'A transformation can change the correct answer', explain:[
    'The original character is b. A rotation or mirror can turn it into a different letter. If the model is learning to recognize characters, the original label may become wrong.',
    'Ask what the right label is after the transform. If the task uses a bounding box to mark the object’s location, move the box with the object.'
  ], figure:{page:21,box:[10,41,57,35],caption:'Compare the original b with the two transformed letters. Which labels would you assign?'}},
  {slide:22, topic:4, title:'Distinguish geometric variation from preprocessing', explain:[
    'Scaling, translating and minor distortions change where or how features appear. For each one, check whether your target remains valid or must move with the image.',
    'The slide also lists normalization and ZCA whitening. These change how the inputs are represented. Whitening reduces correlations between input features. If preprocessing learns statistics, estimate them using the training data.'
  ]},
  {slide:24, topic:4, title:'Read what changed in the text predictions', explain:[
    'Read one row from left to right. It shows the recognizer, an input text image, the baseline prediction, the prediction after training with STRAug and the reported accuracy gain.',
    'Compare the errors in the middle columns. Some examples change from a missing or incorrect character to the expected reading.'
  ], figure:{page:24,box:[17,4,65,67],caption:'Compare the baseline and +STRAug prediction columns for the same input.'}},
  {slide:25, topic:4, title:'Read the text-recognition results in context', explain:[
    'The rows compare variants of the transformer-based recognizer with and without augmentation. Match rows from the same model size before comparing the numbers.',
    'The highlighted column shows gains in the experiment on this slide. The result depends on the model, the data and which variations are useful for the task.'
  ], figure:{page:25,box:[70,28,13,36],caption:'The red outline calls out a column with gains. Compare each model with its augmented counterpart.'}},
  {slide:26, topic:5, title:'Identify the two source images and labels', explain:[
    math`The deck gives the bird image the name $x_1$ and its target the name $y_1$. The cat image is $x_2$ and its target is $y_2$. Keep that order when reading the next three slides.`,
    'One method erases part of one source. The other two use both sources. Keep track of what changes in the image and what changes in the target.'
  ]},
  {slide:31, topic:6, title:'Read the AgMax comparison by augmentation', explain:[
    'Each group of bars belongs to one augmentation setup. Compare bars inside the same group to ask how the training objective affected performance in this experiment.',
    'The plot shows results for a particular model and dataset. Read the legend and axes before comparing bar heights.'
  ]},
  {slide:34, topic:7, title:'Vary the simulator so one appearance cannot dominate', explain:[
    'The robot still has the same job while objects and visual conditions change across simulations. This variation is called domain randomization.',
    'A visual shortcut tied to one color or background becomes less reliable across the variants. The goal is to learn cues that transfer to the conditions the robot encounters.'
  ], figure:{page:34,box:[15,14,70,73],caption:'Look for the same task under different simulated appearances and objects.'}},
  {slide:35, topic:7, title:'Connect the simulation idea to a physical task', explain:[
    'This slide shows a robot hand manipulating an object. Focus on what the task requires across trials. The object moves, so a model or controller needs information it can use as the pose changes.',
    'The slide includes a video reference for the demonstration.'
  ]},
  {slide:36, topic:7, title:'Ask what transfers from simulation to the real world', explain:[
    'This reference illustrates the transfer problem. Simulated and real cameras can differ in lighting, texture and other visual details. A training setup can vary those details while keeping the prediction or control task fixed.'
  ]},
  {slide:37, topic:7, title:'Read the retail gaze example as a new prediction task', explain:[
    'This slide cites a dataset for predicting the object a person is looking at in a retail environment. The target is the object of gaze. Shop layouts, products and viewpoints are examples of conditions a learner may have to handle.'
  ]},
  {slide:45, topic:12, title:'Find the references for regularization and dropout', explain:[
    'The deck lists the Deep Learning textbook, the original dropout paper and Mathematics for Machine Learning. Use the Further learning tab to find additional reading tied to the methods you just studied.'
  ]}
];

export const walkthroughDetails = {
  detection: {
    extra: [],
    practiceSlides: Object.fromEntries(detectionExamples.map(({slide,discussion})=>[slide,discussion])),
    noteSlides: []
  },
  segmentation: {
    extra: [],
    practiceSlides: Object.fromEntries(segmentationExamples.map(({slide,discussion})=>[slide,discussion])),
    noteSlides: []
  },
  optimization: {
    extra: extraOptimization,
    practiceSlides: {4:18, 13:14},
    noteSlides: [5,11,15,18,23,25,27,29,42,44]
  },
  regularization: {
    extra: extraRegularization,
    practiceSlides: {10:12, 13:14, 28:29, 30:32},
    noteSlides: [19,46,14,14,25,29,32,38,39,40,41,43,44]
  }
};
