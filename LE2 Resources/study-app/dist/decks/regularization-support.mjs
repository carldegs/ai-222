export const references=[
 [['Generalization',2],['Overfitting',3],['Capacity',15],['underfit',17],['sixth-degree',18],['quadratic',19],['Regularization',4]],
 [['L2',5],['weight penalty',5],['L1',46],['penalized objective',5]],
 [['Likelihood',7],['conditional independence',9],['Gaussian residual noise',8],['squared-error',12],['logarithm',10]],
 [['prior',13],['posterior',13],['MAP',14],['Gaussian',14],['likelihood',13]],
 [['Data augmentation',20],['Flipping',21],['Scaling',22],['STRAug',23],['Normalization',22],['ZCA whitening',22]],
 [['CutOut',27],['MixUp',28],['CutMix',29],['one-hot',26]],
 [['AgMax',30],['RandAugment',32],['Slide 31',31]],
 [['Input noise',33],['Weight noise',38],['Domain randomization',34],['sim-to-real',35]],
 [['Multi-task learning',39],['shared backbone',39],['separate task heads',39]],
 [['Siamese',40],['weights are tied',40],['disparity estimation',40]],
 [['Early stopping',41],['validation metric',41],['checkpoint',41]],
 [['dropout',42],['keep probability',43],['evaluation',43]],
 [['cross-validation',44],['folds',44],['penalties',46],['augmentation',46],['noise',46],['sharing',46],['dropout',46]]
];
export const connections=[
 {challenge:'Training fit improves while held-out performance worsens',method:'Weight penalties',lesson:1,slide:5,also:[0],mechanism:'Add a cost for large weights, changing the preference among data-fitting solutions. It can discourage fitting sample-specific noise.',limit:'An excessive penalty underfits. Choose its strength on validation data.'},
 {challenge:'A useful prior preference is absent from likelihood alone',method:'MAP estimation',lesson:3,slide:14,also:[2],mechanism:'Combine the data likelihood with a prior. In negative-log form the prior becomes a regularizer; an isotropic Gaussian prior gives L2 shrinkage.',limit:'The prior’s assumptions matter. MAP returns a point estimate and does not guarantee better predictions.'},
 {challenge:'The model relies on accidental orientation or appearance',method:'Label-valid augmentation',lesson:4,slide:20,mechanism:'Train on plausible transformed examples so those irrelevant changes become less useful as shortcuts. Transform spatial annotations consistently.',limit:'A transform that changes the true target creates bad supervision. More copies do not equal independent new data.'},
 {challenge:'Recognition depends too heavily on one small visible region',method:'CutOut or CutMix',lesson:5,slide:27,extraSlide:29,mechanism:'Hide a region or replace it with another image’s patch. The model must use remaining evidence; CutMix also mixes targets by area.',limit:'Too much occlusion can erase the evidence. CutOut and CutMix have different target rules.'},
 {challenge:'The learned rule is brittle between training examples',method:'MixUp',lesson:5,slide:28,mechanism:'Blend two inputs and their targets, teaching behavior on intermediate training examples with soft targets.',limit:'The assumption that these blends provide useful supervision is task-dependent.'},
 {challenge:'Two valid views produce inconsistent learned responses',method:'AgMax',lesson:6,slide:30,mechanism:'Encourage agreement on augmented views of one example while maintaining useful supervised learning.',limit:'Agreement alone allows trivial constant predictions. The exact paper objective is beyond the slide’s conceptual description.'},
 {challenge:'Augmentation combinations are difficult to choose',method:'RandAugment',lesson:6,slide:32,mechanism:'Use a policy with a reduced search space to select and compose augmentation operations.',limit:'The chosen operations must still be valid for the task and suitable in strength.'},
 {challenge:'Small corruptions or a simulator’s appearance break predictions',method:'Noise and domain randomization',lesson:7,slide:33,extraSlide:34,mechanism:'Expose training to relevant perturbations or varied simulation conditions, reducing dependence on one exact clean input or environment.',limit:'Robustness is specific to assumptions and coverage; arbitrary noise or randomization can hurt.'},
 {challenge:'Nearby weight changes cause fragile predictions',method:'Weight noise',lesson:7,slide:38,mechanism:'Train while sampling weight perturbations, encouraging useful performance across a neighborhood of parameter settings.',limit:'This is not generally equivalent to subtracting sampled noise from a closed-form optimum.'},
 {challenge:'A representation over-specializes to one task',method:'Multi-task learning',lesson:8,slide:39,mechanism:'Make shared parameters support several related objectives, while heads retain task-specific processing.',limit:'Conflicting tasks or loss scales can create negative transfer.'},
 {challenge:'Related branches independently learn redundant rules',method:'Parameter sharing',lesson:9,slide:40,mechanism:'Tie the encoder weights so the same mapping must work for different inputs. This reduces independent degrees of freedom.',limit:'Shared architecture alone does not tie weights. Sharing reduces parameter count without necessarily reducing computation.'},
 {challenge:'Late training memorizes the sample',method:'Early stopping',lesson:10,slide:41,mechanism:'Select the best validation checkpoint rather than following training loss down indefinitely.',limit:'Metric noise, patience and checkpoint restoration matter. Never select repeatedly on the final test set.'},
 {challenge:'Features depend on a fixed combination of other units',method:'Dropout',lesson:11,slide:42,extraSlide:43,mechanism:'Randomly remove activations during training, discouraging fragile co-adaptation. Use a consistent keep/drop and scaling convention.',limit:'Excessive dropout can underfit. Expected activation matching is not exact nonlinear ensemble averaging.'},
 {challenge:'A small holdout split gives unstable selection evidence',method:'Cross-validation',lesson:12,slide:44,mechanism:'Train separate models with different held-out folds and average their validation scores.',limit:'This is an evaluation and selection strategy, not itself a weight penalty. Avoid leakage and account for repeated training cost.'}
];
export const scenario=[
 ['Diagnose the error pattern','Check training and validation behavior. High errors on both may need better capacity or optimization; a large generalization gap suggests investigating regularization.'],
 ['Choose a mechanism','Use label-valid augmentation for nuisance variation, penalties for weight preferences, sharing for related tasks or inputs, and dropout for fragile co-adaptation.'],
 ['Select carefully','Choose strengths, augmentation settings and checkpoints using validation evidence or appropriate cross-validation.'],
 ['Report final performance','Freeze the choices, fit the final procedure, and evaluate on untouched test data. Combining methods is useful only if validation evidence supports it.']
];
const math = String.raw;
// Keys are the first slide of each walkthrough lesson.
export const quickReference = {
 1: {
  summary: 'Generalization means predicting well on new examples. Overfitting shows up when training error is low but held-out error is much higher.',
  recall: 'Training data fits the weights, validation data guides choices, and test data measures performance after those choices are fixed.',
  slides: [2,3,4]
 },
 5: {
  summary: math`L1 adds the absolute weight values and can make some weights exactly zero. Its penalty is $\lambda\sum_j|\theta_j|$. L2 adds squared weights, so the cost grows faster for large weights. The strength $\lambda$ controls how much the penalty counts.`,
  recall: math`$\theta^T\theta$ multiplies each weight by itself and adds the results. For weights $(-2,1)$, L1 costs $3$ and squared L2 costs $5$ before multiplying by $\lambda$.`,
  slides: [5,46]
 },
 6: {
  summary: 'Maximum likelihood estimation (MLE) picks the weights that make the observed targets most likely. Given the inputs and weights, independence lets you multiply the individual likelihoods.',
  recall: math`A log asks what power gives you a number. For example, $\log_{10}(100)=2$. Logs turn products into sums and preserve their ordering. Negating the log makes the largest likelihood correspond to the smallest loss.`,
  slides: [7,9,10]
 },
 8: {
  summary: math`In Gaussian regression, each predicted value $x_n^T\theta$ is the center of a bell curve. The residual $y_n-x_n^T\theta$ is the observed value minus the prediction. Bigger residual magnitudes get lower likelihood scores.`,
  recall: math`With the same fixed residual variance $\sigma^2$ and independent observations, minimizing negative log-likelihood over the weights gives the same weights as minimizing squared error.`,
  slides: [8,11,12]
 },
 13: {
  summary: 'A prior scores weight settings before seeing the data. The likelihood scores how well each setting explains the data. The posterior combines both. Maximum a posteriori estimation (MAP) picks the highest posterior score.',
  recall: 'A Gaussian likelihood models errors around predictions and gives squared error. A zero-mean Gaussian prior with the same variance in every weight direction gives an L2 penalty. A narrower prior makes the penalty stronger.',
  slides: [13,14]
 },
 15: {
  summary: 'Capacity is the range of patterns the model can fit. In the deck, the straight line underfits, the sixth-degree curve follows sample-specific wiggles, and the quadratic captures the main trend.',
  recall: 'High error on training and held-out examples can signal underfitting. Low training error with much higher held-out error suggests overfitting.',
  slides: [17,18,19]
 },
 20: {
  summary: 'Data augmentation creates plausible variations of training examples. Check whether the correct answer still applies after each transformation.',
  recall: 'A mirrored character may become a different letter. When a transformation moves an object, move its bounding box or segmentation mask with it.',
  slides: [20,21,22]
 },
 23: {
  summary: 'STRAug changes how text looks in photos, using effects such as warping, blur, and camera changes. The recognizer practices reading the same text under different conditions.',
  recall: 'Compare the baseline and augmented predictions on the same image. A useful transform mimics real variation while keeping the text label valid.',
  slides: [23,24,25]
 },
 26: {
  summary: math`CutOut erases part of one image and typically keeps its label. MixUp blends two images and their targets with the same fraction $\lambda$. CutMix pastes a patch and mixes the targets according to the area from each image.`,
  recall: 'For CutMix, a 2-by-2 patch in a 4-by-4 image gives the pasted source one quarter of the target and the original source three quarters.',
  slides: [27,28,29]
 },
 30: {
  summary: math`RandAugment randomly draws $N$ operations and applies them in order. $M$ is the shared strength setting. AgMax adds a training signal that encourages agreement between two augmented views of the same example.`,
  recall: math`Each RandAugment operation interprets $M$ in its own units. On slide 32, a higher $M$ increases the ShearX slant. AutoContrast follows its own rule at every $M$.`,
  slides: [30,32]
 },
 33: {
  summary: 'Input noise adds small changes to training examples. Domain randomization varies simulation conditions such as textures and lighting so the model has less reason to rely on a single appearance.',
  recall: 'Keep the training target valid across the variations. Choose changes that resemble conditions the model could encounter later.',
  slides: [33,34]
 },
 38: {
  summary: math`Weight noise perturbs the parameters used for a prediction. In the deck’s linear example, replacing $w$ with $w+\eta$ changes the prediction by $X\eta$.`,
  recall: 'Input noise changes what goes into the model. Weight noise changes the model’s calculation for a given input.',
  slides: [38]
 },
 39: {
  summary: 'Multi-task learning trains a shared feature extractor with feedback from multiple tasks. A Siamese model applies the same encoder weights to two inputs, such as the left and right camera images.',
  recall: 'If an encoder with 100 weights is used on both branches, there are still 100 distinct encoder weights. The feature outputs can differ because the inputs differ.',
  slides: [39,40]
 },
 41: {
  summary: 'Early stopping uses validation performance to choose a checkpoint, a saved set of weights from a point in training.',
  recall: 'If the validation loss is lowest at epoch 3 and training loss is lowest at epoch 5, keep the epoch 3 checkpoint. Patience lets training continue briefly while that checkpoint stays saved.',
  slides: [41]
 },
 42: {
  summary: math`An activation is the output a unit passes to the next layer. During training, dropout randomly sets some activations to zero. The deck’s $p$ is the probability of keeping a unit, so $1-p$ is the drop probability.`,
  recall: math`In inverted dropout, a kept output of $6$ becomes $6/(3/4)=8$ when $p=3/4$. A dropped output is $0$. At evaluation, use the original output without masking or scaling.`,
  slides: [42,43]
 },
 44: {
  summary: math`In $K$-fold cross-validation, fit a fresh model on $K-1$ folds, score it on the remaining fold, and rotate the held-out fold. Compare candidates using the mean of their validation scores.`,
  recall: 'Two candidates with four folds require eight fits. Learn preprocessing statistics inside each training fold and save the separate test set for final evaluation.',
  slides: [44]
 },
 45: {
  summary: 'Use the symptom to choose a method. Try relevant augmentation for unfamiliar inputs, a weight penalty when the model leans too heavily on some features, or early stopping when validation gets worse late in training.',
  recall: 'If both training and validation errors are high, check model capacity and optimization before increasing regularization.',
  slides: [46]
 }
};
export const resources=[
 {title:'Regularization for Deep Learning',author:'Goodfellow, Bengio & Courville · Chapter 7',url:'https://www.deeplearningbook.org/contents/regularization.html',tag:'Reinforce',time:'20–30 min selected reading',text:'Use the sections on parameter penalties, augmentation, multi-task learning, early stopping and dropout to deepen the mechanisms introduced by the deck.',topics:[0,1,4,7,8,10,11]},
 {title:'Dropout: A Simple Way to Prevent Neural Networks from Overfitting',author:'Srivastava et al. · JMLR 2014',url:'https://jmlr.org/papers/v15/srivastava14a.html',tag:'Go deeper',time:'10–15 min on method and inference',text:'Read the original masking and test-time scaling explanation. Compare its convention with the inverted-dropout supplement in this guide.',topics:[11]},
 {title:'mixup: Beyond Empirical Risk Minimization',author:'Zhang et al. · ICLR 2018',url:'https://arxiv.org/abs/1710.09412',tag:'Reinforce',time:'10 min on the construction',text:'Focus on the paired input and label interpolation. The experiments go beyond the arithmetic required by this guide.',topics:[5]},
 {title:'CutMix: Regularization Strategy to Train Strong Classifiers with Localizable Features',author:'Yun et al. · ICCV 2019',url:'https://arxiv.org/abs/1905.04899',tag:'Reinforce',time:'10 min on the method',text:'Compare patch replacement and area-weighted labels with CutOut and MixUp. Read the mask convention before translating its equations.',topics:[5]},
 {title:'Improving Model Generalization by Agreement of Learned Representations',author:'Rowel Atienza · WACV 2022',url:'https://arxiv.org/abs/2110.10536',tag:'Go deeper',time:'15–20 min selected reading',text:'For the actual AgMax objective and its motivation. This is optional depth beyond the deck’s conceptual agreement diagram.',topics:[6]},
 {title:'Data Augmentation for Scene Text Recognition',author:'Rowel Atienza · ICCV Workshops 2021',url:'https://arxiv.org/abs/2108.06949',tag:'Reinforce',time:'10–15 min on examples',text:'Explore the STRAug transformation families and why scene-text recognition benefits from task-specific augmentation.',topics:[4]},
 {title:'RandAugment: Practical Automated Data Augmentation with a Reduced Search Space',author:'Cubuk et al. · original paper',url:'https://arxiv.org/html/1909.13719',tag:'Go deeper',time:'10–15 min on policy design',text:'Section 3 explains how RandAugment samples operations. Appendix A.2.3 gives the ImageNet magnitudes shown on slide 32.',topics:[6]},
 {title:'RandAugment magnitude mappings in EfficientNet',author:'TensorFlow TPU · EfficientNet implementation',url:'https://github.com/tensorflow/tpu/blob/master/models/official/efficientnet/autoaugment.py#L437-L489',tag:'Go deeper',time:'5 min on the conversions',text:'See how this implementation converts a shared magnitude to degrees for rotation and to a slant for shear. AutoContrast takes no magnitude argument.',topics:[6]}
];
export const notationBasics=[
 [String.raw`$\theta$ and $\lambda$`,'θ denotes adjustable model parameters. In a penalty λ controls regularization strength; in MixUp and CutMix λ instead denotes a mixing fraction. Always read the local definition.'],
 [String.raw`$p(a\mid b)$`,'A probability or density for a conditioned on b. Likelihood p(data | parameters) and posterior p(parameters | data) reverse what is conditioned on.'],
 [String.raw`$\log$, $\prod$, and $\sum$`,'Logarithm, product, and sum. A log turns a product into a sum; negative log turns maximization of a positive quantity into minimization.'],
 [String.raw`$\arg\min$ and $\arg\max$`,'Return the input or parameter value where an objective is smallest or largest, rather than returning the objective’s value.'],
 [String.raw`$\theta^T\theta$ and $\|\theta\|_2^2$`,'Both mean the sum of squared parameter entries. T denotes transpose; a transpose is not a time-step exponent.'],
 [String.raw`$\mathcal N(\mu,\sigma^2)$`,'A normal distribution with mean μ and variance σ². A Gaussian residual model describes target noise; a Gaussian weight prior describes parameter preferences.'],
 [String.raw`$\nabla_\theta$`,'The gradient: one loss-sensitivity derivative per parameter. A regularizer can contribute a gradient in addition to the data loss.'],
 [String.raw`$\tilde x$, $\tilde y$, and $\odot$`,'A tilde labels a transformed input or target. The circled dot means multiply entries at matching positions.'],
 [String.raw`$\mathbb E$ and $p$ in dropout`,'Expected value averages over random masks. Here p is keep probability; drop probability is 1−p. State the convention before calculating.'],
 ['Validation versus test','Validation guides selection of models, settings and checkpoints. Test data estimates final performance after those choices are fixed.']
];
