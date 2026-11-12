import {source} from '../tutor.mjs';
import {regularizationLabMarkup, mountRegularizationLab} from './regularization-labs.mjs';

const math = String.raw;

export const regularizationTutorLessons = [
  {title:'Learn a pattern that holds up on new examples', steps:[
    {slide:2, title:'Ask how the model does on examples it has never seen', explain:[
      'Say a model learns from 100 labeled photos. Those are its training data. It could remember the answer for every photo and still struggle when you show it a new one. Generalization means applying the pattern it learned to new examples.',
      'The [[2:generalization slide]] calls this unseen set the test set. When you are still choosing models or settings, set aside separate validation data to help make those choices. Save the test set for evaluating the final choice.'
    ], check:['You have trained two models. Which data should you use to choose between them, and which data should you save to evaluate the model you pick?', 'Use validation data to choose between the two models. Save the test set for evaluating the model you picked.']},
    {slide:16, title:'Separate the pattern from the wiggle', explain:[
      'Slide 16 starts with a quadratic curve, a curve whose highest input power is two. Then it adds a wavy noise term. The learner only sees the resulting examples.',
      'In the equation on the slide, the polynomial gives the broad curve. The sine term makes it wiggle. On the next three slides, watch how three model families respond to that same data.'
    ]},
  ]},
  {title:'Add a cost for large weights', steps:[
    {slide:5, title:'What the penalty changes during training', formulas:[0], explain:[
      math`A weight is a learned number that multiplies an input. In a simple rent model, the floor-area weight tells you how much the predicted rent changes for one more unit of area, with the other inputs held fixed. The slide uses $\theta$ for the collection of weights.`,
      math`The data loss measures how far the predictions are from the correct answers. An optimizer tries to make its score, called the objective, as small as possible. The objective on slide 5 adds two things: the average squared prediction error and a penalty calculated from the weights. The symbol $\lambda$ (lambda) controls how much that penalty matters. At $\lambda=0$, training uses just the prediction errors.`,
      math`L1 and L2 are named for two ways to measure the size of the weight vector, called norms. L1 regularization, named on [[46:the summary slide]], adds the absolute values of the weights, meaning their distances from zero. L2 regularization on slide 5 uses the squared L2 norm, the square of the straight-line distance to zero. That is $\theta^T\theta$, the sum of squared weights. For weights $(-2,1)$, L1 adds $2+1=3$ and squared L2 adds $4+1=5$. Multiply by $\lambda$ to get the added cost.`,
      'L2 makes big weights increasingly expensive and tends to shrink weights. L1 starts charging at a constant rate as soon as a weight moves away from zero. If a small nonzero weight only improves the data loss a little, the L1 cost can outweigh that gain and leave the weight at exactly zero. A zero weight removes that input’s contribution along that connection.',
      'In the demo, choose a penalty and change its strength. Watch how a model that fits the training data better can lose once its larger weight is part of the score.'
    ], lab:'penalty', check:['A weight goes from −2 to −4. Before multiplying by λ, how does its cost change under L1 and under squared L2?', 'L1 uses absolute values, so the cost doubles from 2 to 4. Squared L2 uses squares, so it rises from 4 to 16.']},
    {slide:46, sources:[5,46], title:'See what changes when you use absolute values', formulas:[1], explain:[
      'Slide 46 lists L1 as another option. For a weight of −2, L1 uses its magnitude, 2. L2 squares it and gets 4. Repeat for each weight, add the contributions and multiply by the penalty strength.',
      'L2’s pull gets stronger as a weight grows in magnitude. L1 charges the same marginal cost per unit of magnitude on either side of zero. Its corner at zero can encourage solutions with some weights exactly zero.'
    ], check:['Why can a very large penalty increase validation loss?', 'It can shrink weights the model needs to capture the real pattern. Choose the strength using validation performance.']}
  ]},
  {title:'Build a loss from probabilities', steps:[
    {slide:7, sources:[6,7,9,10], title:'Score the same observations under two models', formulas:[0], explain:[
      'Suppose model A assigns probability 1/2 to each of two observed outcomes. Model B assigns 1/4 and 1/2. Given the inputs and model parameters, assume the outcomes are independent. Then multiply to get 1/4 for A and 1/8 for B. The higher score favors A.',
      'The [[9:IID slide]] gives the reason for multiplying. Independence lets us factor the joint likelihood. A shared model describes how examples are generated. In regression, the distribution of a target can still depend on its input.',
      'Maximum likelihood estimation (MLE) chooses the parameter values with the largest likelihood.',
      math`Quick log refresher. A logarithm asks, “What power do I raise the base to?” Since $10^2=100$, $\log_{10}(100)=2$. Since $10^{-1}=1/10$, $\log_{10}(1/10)=-1$. The natural log uses base $e$ (about 2.72) and follows the same rules.`,
      math`Multiplying two copies of $1/10$ gives $10^{-1}\cdot 10^{-1}=10^{-2}$. The exponents add, so the base-10 log of the product is $(-1)+(-1)=-2$. That is the rule used on [[10:the negative log-likelihood slide]]. A larger likelihood still has a larger log. The minus sign makes the largest likelihood give the smallest loss.`
    ], check:['Would you need to compute a logarithm to rank A and B?', 'Compare 1/4 with 1/8 directly. The larger likelihood has the smaller negative log-likelihood.']},
    {slide:12, sources:[8,11,12], title:'Take the negative log and recover squared error', formulas:[1], explain:[
      math`Start with just one apartment. The natural log undoes powers of $e$, so $\ln(e^{-a})=-a$. Taking the negative log of the whole score gives $-\ln(Ke^{-a})=a-\ln K$. The $a$ that comes out is the squared rent error divided by $2\sigma^2$.`,
      math`Repeat for every apartment and add. When we compare different weights on the same data with the same fixed variance, all candidates share the constant from $-\ln K$ and the same positive multiplier $1/(2\sigma^2)$. Adding the same number and multiplying by the same positive number preserve the order, so the weights with the smallest sum of squared errors also have the smallest negative log-likelihood.`
    ], figure:{page:12,box:[20,49,61,39],caption:'Red shows the squared rent errors after taking the negative log. Blue shows the part that stays fixed as you change the weights. The slide writes ŷₙ for the target evaluated in the density. We use yₙ for the observed rent.'},
      check:['Why do rent errors of −2 and +2 contribute the same amount to the loss?', 'Both are equally far from the bell curve’s center. Both give a squared error of 4, and the same variance scales both.'],
      bridge:'Slide 5 already used squared error to measure the fit to the data. Here it comes from a Gaussian model of observed rents around their predictions. In the next lesson, a separate Gaussian over the weights gives us the weight penalty.'}
  ]},
  {title:'Use a prior to express a preference over weights', steps:[
    {slide:13, title:'Update what you believe about a weight', formulas:[0], explain:[
      'The model has a weight that controls how much being near campus changes the predicted rent. Your prior is what you believe about that weight before seeing these listings. You might expect a modest effect and want more evidence before believing it’s huge.',
      'The likelihood asks, “If this weight were right, how well would it explain the rents we saw?” The posterior is what you believe about the weight after combining the prior with that evidence.',
      math`[[13:Bayes’ rule]] says to multiply the likelihood by the prior score, then divide by $p(\mathcal D)$. That divisor rescales the results by the same amount for every candidate weight, so it leaves their ranking alone.`,
      'Maximum likelihood estimation (MLE) picks the weight with the best likelihood. Maximum a posteriori estimation (MAP) picks the weight with the best posterior. If a huge weight explains your listings only slightly better, MLE can pick it while MAP still prefers a smaller weight. Stronger evidence can lead MAP to pick the huge weight too.'
    ], check:['Can MAP pick a large weight even if the prior favors smaller weights?', 'Yes. If the larger weight explains the data well enough, multiplying likelihood by prior can still give it the highest posterior score.']},
    {slide:14, sources:[5,12,14], title:'Recover the L2 penalty from a bell curve', formulas:[1], explain:[
      'In Lesson 4, the [[12:Gaussian likelihood]] put a bell curve over possible rents, centered at the predicted rent. Its negative log gave us a squared rent error. Here a Gaussian prior puts a bell curve over the possible values of a weight, centered at zero. Weights farther from zero get a lower prior score.',
      math`The same negative-log trick brings the square out of the exponent. Now it’s the weight that gets squared. A weight of 2 adds four times as much to the penalty as a weight of 1. With independent weights and the same variance for every weight, the squares add up to $\theta^T\theta$, the sum in the [[5:L2 penalty]]. A narrower prior bell charges more for the same weight.`,
      'Taking the negative log also turns the product of likelihood and prior into two costs we can add. The first measures how far the predictions were from the actual rents. The second charges for large weights.'
    ], figure:{page:14,box:[6, 24, 84, 59],caption:'Red marks the cost for prediction errors. Blue marks the cost from the prior. The bottom line shows the L2 form when the prior has the same variance in every direction.'},
      check:['Which Gaussian gives us the squared residual term, and which gives us the weight penalty?', 'The Gaussian likelihood for targets gives squared residuals. A zero-mean Gaussian prior with equal variance in every direction gives an L2 weight penalty.']}
  ]},
  {title:'Change the input and check the label', steps:[
    {slide:20, sources:[20,21,22], title:'Decide which transformations the task permits', explain:[
      'Data augmentation creates variations of the training examples. The three [[20:dog photos]] show an original, a flip and a rotation. The class is still “dog.” Showing all three during training gives the model examples of the same class in different orientations.',
      'Try the same idea on the [[21:letter b]]. A transform can turn it into another letter. Choose transformations by asking what the correct answer would be after each change. A bounding box is a rectangle in the label that marks where an object is. When you flip the image, the rectangle must still surround that object in its new location.'
    ], check:['You flip an image whose label includes a bounding box. What else must move?', 'Flip the box coordinates so the target still marks the object.']},
    {slide:23, sources:[23,24,25], title:'Choose variations the model will actually encounter', explain:[
      'Scene text recognition asks a model to read text in real images. The STRAug examples bend, blur and distort text to simulate how a camera, lighting or a surface might change its appearance.',
      'Find a readable example in each group on the slide. The useful idea is to vary appearance while preserving the text to be read. The table on slide 25 reports gains in a specific experiment.'
    ], figure:{page:23,box:[1, 14, 94, 72],caption:'Compare warped text, blur and camera effects. Ask which distortions you would expect in your own images.'}}
  ]},
  {title:'Erase, blend or paste parts of images', steps:[
    {slide:27, sources:[26,27], title:'CutOut hides part of one example', explain:[
      math`The deck starts with $x_1$, a bird with target $y_1$, and $x_2$, a cat with target $y_2$. [[27:CutOut]] uses the bird alone. It covers a region with a blank patch and keeps the bird target.`,
      'Covering a familiar feature gives the model a reason to use other clues. If too much of the bird is hidden, the example can become difficult to label from the visible evidence.'
    ], figure:{page:27,box:[25, 10, 42, 83],caption:'Look for the black patch over the bird and the unchanged target under the image.'}},
    {slide:28, title:'MixUp blends both the pixels and the target', formulas:[0], explain:[
      math`Imagine taking three parts bird and one part cat at every pixel. The same ratio applies to the labels. If the class order is bird, cat, start with $(1,0)$ and $(0,1)$ and blend to get $(3/4,1/4)$.`,
      math`In the [[28:MixUp equation]], $\lambda$ is the share from source 1. The tilde marks the new blended input or target.`
    ], figure:{page:28,box:[39, 14, 33, 73],caption:'Both source images contribute at the same pixel locations. The target is blended by the same proportions.'}},
    {slide:29, title:'CutMix pastes a patch and counts its area', formulas:[1], explain:[
      math`The mask $M$ picks the source at each pixel. A 1 keeps the bird pixel from $x_1$. A 0 brings in the cat pixel from $x_2$. Count how many pixels each source supplies before mixing the target.`,
      'In a 4 by 4 image, replacing a 2 by 2 patch gives the cat 4 of the 16 pixels. The target is three quarters bird and one quarter cat. Compare the three methods in the demo. Try dragging part of the CutMix patch past the edge.'
    ], figure:{page:29,box:[48, 16, 31, 72],caption:'The cat appears inside the patch. Outside the patch the bird image supplies the pixels.'}, lab:'augmentation',
      check:['A 2 by 2 cat patch overlaps the edge of the 4 by 4 bird image. Only two cat pixels get pasted. What fraction of the target is cat?', 'The cat supplies 2 of the 16 pixels in the final image, so its fraction of the target is 2/16, or 1/8.']}
  ]},
  {title:'Choose variations and encourage agreement', steps:[
    {slide:30, sources:[30,31], title:'AgMax compares two views of the same example', explain:[
      'Start with one labeled image and make two valid augmentations. The [[30:AgMax diagram]] sends both through the model and adds an agreement signal to the supervised training objective.',
      'The model gets feedback about the class and about how consistently it represents the two views. The benefit depends on the views preserving what the task needs.'
    ], figure:{page:30,box:[46,19,51,51],caption:'Follow the two images into their branches. Look for the agreement link between the branches and the class labels at the right.'}},
    {slide:32, title:'RandAugment chooses the transformations to apply', explain:[
      'Imagine training a model to recognize a church. You want it to recognize the same building in photos taken at different angles or in different light. RandAugment makes varied versions of training images. In classification, you train on the changed photo with its original label, so the changes need to preserve what the label describes. Seeing those variations can help the model rely on the building’s features even when the angle or contrast changes.',
      math`The original method has two settings. $N$ is how many operations to apply to one image. Each time an image is augmented, draw $N$ operations from a menu that includes rotation, brightness and sideways shifts. Every option is equally likely on each draw, and an operation can come up twice. Apply them in order, so the second operation works on the output of the first.`,
      math`$M$ is one shared strength setting. Each operation that takes a strength translates $M$ into its own units. Rotation uses an angle, while ShearX slants the image by shifting rows sideways by different amounts. AutoContrast stretches the range of light and dark values based on the image itself. It uses the same rule at every $M$.`,
      math`Read [[32:slide 32]] left to right. With $N=2$, it shows ShearX followed by AutoContrast. Compare the tower in the middle column across $M=9$, $17$, and $28$. The sideways slant gets stronger. Those three levels came from the paper’s experiments with ResNet-50, EfficientNet-B5, and EfficientNet-B7, respectively.`,
      math`For a concrete conversion, the EfficientNet implementation maps $M$ to a rotation of $3M$ degrees in a randomly chosen direction. At $M=5$, that’s a $15^\circ$ turn if Rotate is drawn. ShearX uses its own conversion. These conversions depend on the implementation, so read $M$ as a strength setting and check the library’s mapping for an actual angle or shift.`,
      math`Sharing $M$ makes the policy easier to tune. Compare a few pairs of $N$ and $M$ on validation data, with no need to tune a separate strength and selection probability for every operation. If changes are too strong, they can hide the building or make a text label unreadable.`
    ], figure:{page:32,box:[46,0,50,75],caption:'Follow any row from the original to the slanted image to the contrast-adjusted image. Then compare the slant in the middle column across all three rows.'},
      bridge:'RandAugment can create two independently augmented views of the same image. AgMax can then encourage the model to respond consistently to those views.',
      check:['You want two operations per image and a milder slant whenever ShearX is drawn. Which setting do you change?', math`Keep $N=2$ and lower $M$. You still draw two operations, and ShearX slants the image less when it is chosen.`]}
  ]},
  {title:'Train under perturbations you can explain', steps:[
    {slide:33, sources:[33,34,35,36,37], title:'Vary inputs to practice for unfamiliar conditions', explain:[
      'Slide 33 adds small noise to inputs so the model trains on a neighborhood of examples around the original. The desired answer should still make sense for those perturbed inputs.',
      'The [[34:domain randomization example]] varies simulated conditions such as appearance. If a shortcut only works with a particular texture or background, exposing the learner to many such settings makes the shortcut less reliable.',
      'Slides 35–37 continue with application examples. When reviewing them, identify which aspect of the environment varies and what prediction the model is still expected to make.'
    ]},
    {slide:38, title:'Change the weights during the forward pass', formulas:[0], explain:[
      'Input noise perturbs what enters the model. Weight noise perturbs the model itself. Slide 38 describes the motivation for weight noise in terms of finding a region where small changes in weights have little effect.',
      math`In the slide’s linear example, start from $Xw$ and replace $w$ with $w+\eta$. The prediction changes by $X\eta$. The same parameter noise can affect different inputs by different amounts.`
    ], check:['Where do you add the noise in each method?', 'Input noise changes the example x. Weight noise changes the parameters used to make the prediction.']}
  ]},
  {title:'Train one representation to support several tasks', steps:[
    {slide:39, title:'Follow one image into several outputs', explain:[
      'The [[39:multi-task diagram]] starts with one input and a shared backbone. A backbone is the shared part of the model that turns the input into features. A task head is the part that uses those features to answer one question, such as which class is present, where its bounding box is, or which pixels belong to the object.',
      'One image can supply several kinds of supervision. An edge or shape cue that helps locate an object can also help identify it. Training the shared layers with feedback from related tasks can discourage features that only suit one training target.'
    ], figure:{page:39,box:[63,8,32,83],caption:'Start at the data at the bottom. Follow the shared representation upward as it branches into separate tasks.'}},
    {slide:39, title:'Decide how much each task contributes', formulas:[0], explain:[
      'Compute the losses for the tasks you are training, then combine them. The coefficients set how strongly each task’s loss counts in the objective. Each task’s loss tells us how its predictions would change if we changed the weights. Backpropagation computes those signals for earlier layers, so the shared weights get feedback from every task.',
      'If tasks need conflicting features or one loss dominates the gradients, sharing may hurt a task. Compare each task on held-out examples.'
    ], bridge:'The next lesson also reuses weights. It applies the same encoder to different inputs within one prediction.'}
  ]},
  {title:'Use the same encoder on paired inputs', steps:[
    {slide:40, title:'Trace the two branches of a Siamese model', explain:[
      'In [[40:the disparity example]], the same scene is seen from a left camera and a right camera. Network A processes one image and Network B processes the other. They use the same learned weights.',
      'A downstream network combines the features to predict disparity, the shift in where corresponding points appear. Applying the same feature extractor to both views gives the downstream network features computed by the same rule.'
    ], figure:{page:40,box:[43, 2, 56, 98],caption:'Follow the left and right images through Networks A and B, then through Network C to the disparity output.'}},
    {slide:40, title:'Count the shared weights', formulas:[0], explain:[
      math`Read $f_\theta$ as “run the encoder with weights $\theta$.” The equation applies $f_\theta$ to two inputs. The input changes on each branch and the weight vector stays the same.`,
      'With one set of 100 encoder weights used twice, you still learn 100 encoder weights. Training feedback through either branch can update that set.'
    ], check:['Can the two branches produce different features with the same encoder weights?', 'Yes. Their inputs can differ, so running the same function can produce different outputs.']}
  ]},
  {title:'Keep the checkpoint with the best validation score', steps:[
    {slide:41, title:'Track training and validation error together', explain:[
      'An epoch is one pass through the training data. A checkpoint stores the model parameters at an epoch. At first, training and validation errors may both fall. Later, training error may keep falling as validation error rises.',
      'Slide 41 uses that split as a signal for [[41:early stopping]]. Compare the saved models on validation data. The useful checkpoint is the one with the lowest observed validation error.'
    ], lab:'early-stop', check:['If training error is lowest at epoch 5 and validation error is lowest at epoch 3, which checkpoint do you keep?', 'Keep epoch 3 when the selection rule is minimum validation error.']},
    {slide:41, title:'Write the checkpoint decision as an equation', formulas:[0], explain:[
      'The argmin means “which epoch produced the smallest validation loss?” It returns the epoch index. Retrieve the parameter values stored at that epoch.',
      'A noisy validation score can rise briefly and improve again. Patience lets you wait a few epochs for improvement while keeping a copy of the best checkpoint so far.'
    ], bridge:'Early stopping changes how far training proceeds. A weight penalty changes the objective at each step.'}
  ]},
  {title:'Train a network that can cope with missing units', steps:[
    {slide:42, sources:[42,43], title:'See what a dropout mask removes', explain:[
      'Dropout randomly sets some unit outputs to zero during training. A mask records which outputs to keep for that pass. In the [[42:dropout diagram]], you can see how the next layer receives a smaller set of outputs.',
      math`On slide 43, $p$ is the probability that a unit stays active during training. A keep probability of $3/4$ drops the unit one quarter of the time. Ordinary evaluation uses the full network.`
    ], figure:{page:42,box:[5, 15, 82, 83],caption:'Compare the full network on the left with the thinned network on the right. The removed outputs belong to this mask.'}},
    {slide:43, title:'Balance the average activation with inverted dropout', formulas:[0], explain:[
      'An activation is a unit’s output. If it gets zeroed half the time, its average contribution falls by half. Inverted dropout compensates during training by dividing each kept activation by the keep probability, the chance that a unit is kept.',
      math`With $h=4$ and $p=1/2$, the unit outputs 8 when kept and 0 when dropped. The average over masks is still 4. At evaluation, use the original activation 4.`
    ], lab:'dropout', check:['With an activation of 6 and keep probability 3/4, what does inverted dropout output if the unit is kept?', 'It outputs 6 divided by 3/4, which is 8. A dropped unit outputs 0.']}
  ]},
  {title:'Validate regularizers and choose where to intervene', steps:[
    {slide:44, title:'Rotate which fold is held out', formulas:[0], explain:[
      'Divide the data available for model selection into four groups, called folds. Train on three and score on the fourth. That fourth fold is held out from training and used for validation. Start a fresh model and repeat with a different held-out fold until each fold has served as validation once.',
      'Compare candidates using the mean of their held-out scores. Any preprocessing that learns from the data should be fitted within each training fold. Once you settle on a candidate, evaluate the final procedure on the separate test set.'
    ], figure:{page:44,box:[13, 25, 78, 62],caption:'Each row is a fresh fit. The validation block moves one column to the right with each run.'}, lab:'folds',
      check:['How many times do you train a model to compare two candidates using four folds?', 'Eight times. Each candidate gets four separate training and validation runs.']},
    {slide:46, sources:[45,46], title:'Match the regularizer to what you observe', explain:[
      'If training error is low and held-out error is high, check what the model might be relying on. Consider a penalty for oversized weights, relevant augmentations for unseen variation, or early stopping if later checkpoints generalize worse.',
      'Dropout changes which activations are available during training. Shared parameters change which solutions the architecture can represent. Several methods can be used together. Compare the resulting choices on validation data.'
    ], flow:true, check:['The model performs poorly even on training examples. What should you check before increasing the penalty?', 'Check whether the model is flexible enough to learn the pattern and whether it has finished learning. A larger penalty can make fitting the training data even harder.']}
  ]}
];

const flow = `<figure class="tutor-flow">
  <figcaption><strong>Where each method acts</strong></figcaption>
  <ul class="lab-method-map">
    <li><strong>Inputs</strong><span>${source(20,'Augmentation')} and ${source(33,'input noise')} vary what the learner sees.</span></li>
    <li><strong>Model and activations</strong><span>${source(39,'Multi-task learning')} and ${source(40,'parameter sharing')} reuse learned features. ${source(42,'Dropout')} varies the available unit outputs.</span></li>
    <li><strong>Training objective</strong><span>A ${source(5,'weight penalty')} adds a cost. A ${source(14,'Gaussian prior')} can give that cost a probabilistic interpretation.</span></li>
    <li><strong>Selection</strong><span>${source(41,'Early stopping')} chooses a checkpoint. ${source(44,'Cross-validation')} compares choices across held-out folds.</span></li>
  </ul>
</figure>`;

export const regularizationTutor = {
  topics:regularizationTutorLessons,
  labMarkup:regularizationLabMarkup,
  mountLab:mountRegularizationLab,
  flow
};
