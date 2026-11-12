const m = String.raw;
const figure = (page, box, caption) => ({page, box, caption});
const section = (slide, end, title, explain, options = {}) =>
  ({slide, end, title, explain, ...options});
const lesson = (title, context, summary, recall, steps) =>
  ({title, context, summary, recall, steps});

export const segmentationLessons = [
  lesson('Choose what the output should tell you about each pixel',
    'A detector draws a box around each can. If you need the outline of the metal itself, you need to decide which pixels belong to the can.',
    'Semantic segmentation labels pixels by category. Instance segmentation separates individual objects. Panoptic segmentation gives a coherent scene-wide map with both kinds of information.',
    'Thing means a countable object such as a person. Stuff means a region such as road, grass, or sky.', [
    section(1,1,'Segmentation',['The cover introduces pixel-level vision.']),
    section(2,3,'Distinguish the three outputs using one street scene',[
      'A mask is a map that indicates which pixels belong to a region. In [[2:the four-panel comparison]], semantic segmentation assigns each pixel a category, so two people can receive the same color. Instance segmentation gives the two people separate masks with their class labels.',
      'Panoptic segmentation assigns one category to each labeled pixel and keeps separate IDs for individual things. The [[3:stuff and things figure]] shows why both are useful: separate the people, and also label the road they are standing on.'
    ],{figure:figure(2,[34,11,64,81],'Compare the street panels. Find which outputs distinguish two objects of the same class and which also label the road.'),
      check:['Which output would you use to count distinct people and label every road pixel in one map?', 'Panoptic segmentation keeps a separate instance ID for each person while also labeling road pixels.']}),
    section(4,4,'Read what changes in the soda-can example',[
      'In [[4:the tabletop example]], first compare the instance and semantic panels. Look for cans that share a semantic color but get different instance colors. Then look at how the panoptic panel adds a scene-wide background label while keeping each can separate.'
    ],{figure:figure(4,[3,3,75,95],'Read the panels by their labels. Colors are a display convention for class or instance membership.')})
  ]),
  lesson('Classify every pixel with an FCN',
    'The soda-can task has a fixed list of classes. A semantic model answers the same small multiple-choice question at every pixel in the image.',
    'An FCN turns shared image features into a spatial map of class scores. Softmax gives probabilities across classes at each pixel.',
    'The output has one class-score vector per pixel. Softmax acts across the classes for that pixel.', [
    section(5,6,'From an image classifier to a spatial classifier',[
      'An image classifier gives a single score vector for the photo. A [[5:fully convolutional network (FCN)]] keeps a grid of features, applies learned filters across that grid, and produces a grid of scores. Training end to end means the pixel labels can shape both the features and the final classifier.',
      'The [[6:semantic segmentation divider]] starts with class labels alone. When two cans share the same category, their pixels use the same class ID.'
    ]),
    section(7,8,'Read the score vector at a single pixel',[
      m`The [[7:example output]] uses four classes: soda can, water bottle, juice can, and background. Background is a class here because a pixel on the table still needs an answer. At each location the model produces four raw scores, called logits. Softmax converts them to probabilities that sum to one.`,
      'The [[8:pixel callouts]] show what varies by location. Select the class with the largest probability for that location, and repeat across the image.'
    ],{formulas:['softmax'],figure:figure(8,[52,2,46,94],'Compare the class vectors at a background pixel and at pixels on different containers.'),
      check:['Should the softmax probabilities sum to one across pixels or across classes?', 'Across classes at one pixel. The next pixel has its own distribution.']})
  ]),
  lesson('Recover fine detail with FCN skip connections',
    'If you shrink a photo until a bicycle is a few cells wide, enlarging it again cannot recover the exact wheel outlines. An FCN can bring in detail from a finer feature map.',
    'Upsample coarse class scores, fuse them with scores from a finer layer, and train with per-pixel cross-entropy.',
    'FCN-32s, FCN-16s, and FCN-8s name prediction strides before the final upsampling, not different numbers of classes.', [
    section(9,10,'Join coarse recognition with finer location information',[
      'The [[9:FCN diagram]] shows the model shrinking the grid to learn richer features and then enlarging predictions back toward image size. Upsampling makes the grid denser. A skip connection sends an earlier, finer map directly to a later stage so it can help locate edges.',
      'In [[10:FCN-32s, FCN-16s, and FCN-8s]], trace each extra input. FCN-16s combines upsampled coarse scores with the projected pool4 scores. FCN-8s adds pool3 scores as well. The maps have to be aligned before adding the corresponding class scores.'
    ],{figure:figure(10,[6,17,87,56],'Follow the long skip arrows from pool4 and pool3 into the progressively finer score maps.')}),
    section(11,11,'Penalize low probability of the annotated pixel class',[
      'The [[11:loss slide]] uses categorical cross-entropy at each pixel. Read the probability assigned to its annotated class and take the negative log. A correct confident answer has a small loss. Training averages over labeled pixels in the simplified calculation below.',
      'On the same slide, compare how closely the horse outlines follow the ground truth as more skip connections are added. Fine features can improve spatial detail while the coarser map still supplies recognition.'
    ],{formulas:['pixelCE'],figure:figure(11,[47,28,50,39],'Compare the legs and edges across the three FCN predictions and the ground truth.'),
      check:['What does the finer skip input add after the coarse prediction has been upsampled?', 'It adds spatial information from an earlier map, which can help locate narrow structures and edges.']})
  ]),
  lesson('Use PSPNet to put a pixel in scene context',
    'A small patch can look like either water or road. Looking at the whole picture can change the answer. Pyramid Scene Parsing Network (PSPNet) gives the pixel classifier that wider view.',
    'Pool the same feature map over several region sizes, upsample those context maps, and concatenate them with local features.',
    'A 1-by-1 pooling grid summarizes the whole map. A finer grid preserves which part of the image supplied the context.', [
    section(12,15,'Identify what local evidence misses',[
      'The [[13:PSPNet motivation]] is that nearby texture may be ambiguous. [[14:The common failures]] include implausible scene relationships, similar-looking categories, and small objects that are easy to miss.',
      'In [[15:the comparison]], compare the FCN and PSPNet outputs for the same input. Context can make a label more plausible in its scene, while local detail still matters for small or thin objects.'
    ],{figure:figure(15,[12,2,86,72],'Read across one row from input and ground truth to the competing predictions.')}),
    section(16,17,'Pool context at four scales and bring it back to each position',[
      m`In [[16:the pyramid pooling module]], a grid of $1\times1$ bins averages the whole feature map. A $2\times2$ grid averages four large regions. The $3\times3$ and $6\times6$ grids preserve progressively more spatial variation.`,
      'The pooled branches use channel projections, then upsample back to the original feature-map resolution. Concatenation stacks the channels, so each position has local features plus summaries from several regions. That differs from an FPN merge, which builds several prediction resolutions. [[17:The reported result]] illustrates performance on the stated dataset.'
    ],{formulas:['pool'],figure:figure(16,[31,28,60,56],'Trace the feature map into the four pooling branches, then back to the concatenated map.'),
      check:['What can a 2-by-2 pooling grid preserve that one global bin cannot?', 'It keeps separate averages for the four parts of the feature map, so their context can differ.']})
  ]),
  lesson('Trace the implementation and evaluate the pixel labels',
    'The course implementation turns a photo of containers into a colored mask. Check how the output resolution is restored, then ask how to measure the errors in that mask.',
    'Align and concatenate resized feature maps for pixel prediction. Evaluate with both pixel accuracy and semantic mean IoU.',
    'For semantic mIoU, compute an overlap ratio for each evaluated class and average those ratios. Pixel accuracy counts all pixels together.', [
    section(18,20,'Trace downsampling, resizing, and concatenation in the sample',[
      'The [[18:sample diagram]] shows the input photo, the feature pyramid, and the final semantic map. In [[19:the pyramid code]], pooling and stride-two convolutions create smaller maps. In [[20:the FCN code]], bilinear upsampling blends nearby values to bring the maps to a common spatial resolution.',
      'Concatenation stacks channels at matching positions. Further learned upsampling restores image resolution, and the final softmax produces class probabilities per pixel. This course example illustrates multiscale feature fusion. The exact layer choices differ from the published PSPNet pooling module.'
    ],{figure:figure(18,[18,20,63,72],'Follow the branches to the common resolution and then to the color-coded prediction.')}),
    section(21,23,'Compare predicted pixels with the annotated pixels',[
      'The [[21:VIA dataset]] provides annotated targets for training and held-out evaluation. [[22:The evaluation slide]] reports two measures. Pixel accuracy counts how many labels are correct overall. Per-class IoU measures how much the predicted and actual pixel sets for each class overlap.',
      'Average the class IoUs to get semantic mean IoU (mIoU). A class is one set of pixels across the evaluation, so this differs from Detection’s mean of each object’s best box overlap. When background covers most pixels, high accuracy can coexist with poor IoU for small foreground classes.',
      'In [[23:the sample output]], compare the two colored masks around each container. A few missed pixels on a thin edge matter more for a small class than the same count does for a large region.'
    ],{formulas:['semanticMetrics'],figure:figure(23,[33,41,65,48],'Compare the target and prediction around the thin object boundaries.'),
      check:['A model gets every background pixel right but misses every small can. Which metric exposes the missed class more directly?', 'Per-class IoU for can is zero. Semantic mIoU gives that evaluated class the same weight as background.']})
  ]),
  lesson('Give each detected object its own mask with Mask R-CNN',
    'Two people can overlap in the photo and share the same label. An instance model needs to say which pixels belong to each person.',
    'Mask R-CNN extends Faster R-CNN with a mask head for each region of interest. RoIAlign preserves the fractional position of the region when extracting features.',
    'RoIAlign fixes feature alignment. The mask head uses those aligned features to predict a shape.', [
    section(24,26,'Understand why rounding matters to a mask',[
      'Mask R-CNN starts from the Faster R-CNN idea of proposing candidate boxes. Each region of interest (RoI) is a candidate rectangle projected onto the shared feature map. [[26:The RoI comparison]] introduces RoIAlign because rounding box boundaries or sampling bins can shift the features used to draw a mask.',
      'RoIAlign keeps fractional coordinates. It estimates the value at a point using bilinear interpolation, a weighted average of its four neighboring grid values. The weights depend on how close the sampling point is to each neighbor. The demo holds one axis fixed so you can see a single horizontal interpolation.'
    ],{formulas:['align'],lab:'align',
      check:['How does RoIAlign get a feature value between grid locations?', 'It uses interpolation from nearby feature values while keeping the fractional sample coordinate.']}),
    section(27,28,'Read the class, box, and mask paths together',[
      'In [[28:the Mask R-CNN diagram]], the shared backbone and proposal network locate candidate regions. The aligned region features then feed class, box, and mask outputs. The mask head keeps a spatial grid so it can predict the object’s shape inside its candidate region.',
      '[[27:The parallel paths]] matter because identifying the category and deciding which pixels belong to the particular object are different predictions. The class head can be confident even when the mask clips an edge.'
    ],{figure:figure(28,[8,16,89,72],'Trace an RoI into the class and box outputs, then into the separate spatial mask output.')})
  ]),
  lesson('Train a class-specific mask, then place it in the image',
    'A region may have mask scores for several classes. During training we know its class from the annotation. During inference the model has to choose one.',
    'For a positive RoI, apply binary cross-entropy to the mask channel of its ground-truth class. At inference, select the predicted-class channel and resize it to the detected box.',
    'Semantic FCN uses softmax across classes. Each Mask R-CNN channel uses a sigmoid to decide foreground membership inside one RoI.', [
    section(29,31,'Use the known class during mask training',[
      m`The [[29:multi-task loss]] combines classification, box offsets, and mask loss. For each sampled positive RoI the mask head outputs $K$ grids of size $m\times m$, one per foreground category. A pixel in a selected mask asks “does this pixel belong to this instance?” A sigmoid gives its yes probability, and binary cross-entropy scores it against 0 or 1.`,
      '[[30:The class-channel diagram]] shows how one channel is selected. The Mask R-CNN paper uses the ground-truth class for the training loss on a matched positive RoI. The predicted class selects the channel at inference. This distinction matters when the class head guesses incorrectly during training.',
      '[[31:The mask representation]] keeps a grid throughout the mask branch. The other class-specific mask outputs are free to make independent binary predictions.'
    ],{formulas:['maskLoss','maskBCE'],figure:figure(30,[21,0,76,98],'Find the selected mask channel at the end of the RoI’s mask branch.'),
      check:['A positive RoI contains an annotated person, but the class head currently predicts cyclist. Which class mask receives supervision?', 'The person channel receives the mask loss, because training uses the ground-truth class.']}),
    section(32,34,'Resize and threshold the chosen mask at inference',[
      '[[32:The architectures]] attach the mask head to a Faster R-CNN detector with a ResNet or ResNeXt backbone. Some variants use a feature pyramid (FPN) to supply features at several resolutions. [[33:The inference slide]] takes the highest-scoring final detections, selects each predicted-class mask channel, resizes that small probability grid to the detected box, then thresholds at 0.5.',
      'The [[34:summary transition]] leads into a visual walkthrough of these operations. Resizing changes where the mask fits in the image. Thresholding converts the resized probabilities to a binary region.'
    ])
  ]),
  lesson('Follow the Mask R-CNN result from anchors to a scene',
    'A final overlay hides several decisions. If an object has no mask or a mask looks cut off, trace where that information first went wrong.',
    'Propose and refine boxes, predict a mask for each selected region, and place each mask back in image coordinates.',
    'When a mask is missing, check for a missing or suppressed detection first. When it is clipped, inspect the final RoI and the predicted shape.', [
    section(35,38,'Identify which stage supplied each piece of the output',[
      '[[35:The proposal slide]] shows candidate anchors around the people and aircraft. [[36:Box refinement]] adjusts promising candidates. [[37:Mask generation]] creates a separate small shape map for each selected region.',
      '[[38:The composite output]] places the shapes back at their image locations. A missed detection never supplies a region for the mask head, and a tight but misplaced box can cut off part of the object before thresholding.'
    ],{figure:figure(38,[16,28,60,67],'Trace the individual masks from the preceding slide to their positions in the composite.'),
      check:['Where would you first look if a person has neither a final box nor a mask?', 'Check the proposal, classification and box filtering stages. The mask head needs a selected detection.']}),
    section(39,40,'Distinguish a benchmark from an example',[
      '[[39:The performance table]] reports COCO mask AP across backbone choices. As in Detection, AP summarizes a ranked list using matches and missed targets. For mask AP, the overlap criterion uses pixel masks. The [[40:example grid]] lets you see which outlines or overlaps are still hard.'
    ],{figure:figure(40,[0,0,98,87],'Find two nearby instances and check whether their shapes stay separate.')})
  ]),
  lesson('Measure mask quality separately from class confidence',
    'Two masks can both be labeled “person” with high confidence. One may cover the person well while the other misses half their body.',
    'MaskIoU counts shared pixels relative to the union of the predicted and true masks.',
    'Box IoU can be high for two identical enclosing rectangles even when the pixel masks differ substantially.', [
    section(41,43,'Ask what the class score actually measures',[
      '[[42:Mask Scoring R-CNN]] starts from a ranking problem. A class score measures how confident the detector is about the object category. The [[43:comparison examples]] show that two predictions with similar class scores can cover different fractions of the object.',
      'A rectangle only records the outer bounds. The quality measure needs to look inside it and count pixel membership.'
    ],{figure:figure(43,[4,28,91,37],'Compare the displayed class confidences with how completely the masks cover the instances.')}),
    section(44,45,'Count the overlap of two masks',[
      '[[44:MaskIoU]] compares two binary masks of the same instance. Count the pixels on in both as the intersection, and count the pixels on in either as the union. A missed true pixel or an extra predicted pixel reduces the overlap.',
      'In [[45:the scatter plots]], look at the spread of true MaskIoU for a given score. A score that tracks overlap more closely is better suited to ranking masks by quality.'
    ],{formulas:['maskIoU'],figure:figure(45,[7,21,88,45],'Compare how mask score and true mask IoU vary in the first two plots.'),
      check:['If two masks have identical enclosing boxes, what can make their MaskIoU low?', 'Their foreground pixels can differ inside those boxes. MaskIoU counts the pixels shared by the masks.']})
  ]),
  lesson('Train a MaskIoU head and use it to rank masks',
    'During training an annotated mask lets you measure overlap. At inference the annotation is absent, so Mask Scoring R-CNN learns to estimate that overlap from its own features.',
    'Learn MaskIoU from the selected mask and aligned features, then multiply the estimate by the classification score.',
    'A calibrated score can change the ranking without changing the mask’s pixels.', [
    section(46,47,'Predict the quantity that can be measured during training',[
      'The [[46:architecture]] passes the RoI features and a mask prediction into a MaskIoU head. A training target is computed by comparing the predicted binary mask with the annotation. The head learns the overlap using squared error, called L2 loss here.',
      'In [[47:the score equation]], the class score supplies evidence that it is the right kind of object. The learned MaskIoU supplies evidence that the predicted region fits that object. Multiplying them lets either weak signal lower the ranking.'
    ],{formulas:['qualityScore'],figure:figure(47,[48,26,49,69],'Trace the chosen mask into the MaskIoU head and read where its overlap target comes from.')}),
    section(48,49,'Calibrate the masks you already selected',[
      'The [[48:inference slide]] starts from top-scoring boxes after suppression, generates the target masks, and estimates MaskIoU for them. Ground-truth masks are available during training. At inference the head supplies a prediction in their place.',
      '[[49:The benchmark table]] compares mask AP with and without this quality head. The improvement can come from a better ranking of the same candidate masks.'
    ],{check:['What can change if you apply the MaskIoU head and leave every mask pixel as it was?', 'The confidence scores and their order can change, affecting which masks rank highest and how AP is computed.']})
  ]),
  lesson('Let YOLACT share mask prototypes across the image',
    'If you run a separate mask network for every object, you repeat spatial work. YOLACT creates image-wide masks once, then gives each object its own recipe for combining them.',
    'YOLACT generates shared prototype maps and predicts a coefficient vector for each anchor. These two branches run in parallel.',
    'Prototypes are shared across the image. A detection’s coefficients determine how to combine them for that instance.', [
    section(50,53,'Do the shared mask work once',[
      '[[51:The YOLACT motivation]] starts with the cost of the two-stage pipeline. YOLACT keeps dense single-stage detection and adds a separate branch that creates prototype maps across the image. A prototype is a reusable spatial pattern, such as a response along some boundaries.',
      'In [[52:the architecture]] and [[53:the two-task diagram]], one branch produces the prototype maps and the detection branch predicts a recipe per anchor. Non-maximum suppression (NMS) filters duplicate detections before assembling the surviving masks.'
    ],{figure:figure(52,[1,19,97,63],'Trace the branch that makes prototype maps and the branch that predicts coefficients. Find where they meet.')}),
    section(54,55,'Separate image-wide maps from detection-specific numbers',[
      m`[[54:ProtoNet]] emits $k$ spatial maps at reduced resolution, typically one quarter of input height and width in the diagram. The model learns their usefulness from the losses on the assembled masks. There is no separate target telling a particular prototype what shape to draw.`,
      m`Each anchor’s [[55:prediction vector]] carries $c$ class outputs, four box offsets, and $k$ coefficients. A coefficient is one scalar that weights a prototype. The tanh activation lets coefficients be positive or negative, so a prototype can add or remove evidence.`
    ],{formulas:['yolactCount'],check:['If the detector uses eight prototypes, how many mask coefficients does one anchor predict?', 'Eight, one coefficient for each shared prototype.']})
  ]),
  lesson('Assemble and supervise a YOLACT mask',
    'Think of the prototypes as transparent layers. Each detection chooses how strongly each layer contributes, then the detector combines the layers into its own mask.',
    'Take a weighted sum of prototypes at each pixel and apply sigmoid. Crop the resulting mask and supervise the assembled prediction.',
    'Combine logits before applying sigmoid. In the paper’s training rule, the crop and area normalizer use the ground-truth bounding box.', [
    section(56,56,'Multiply the prototype maps by one instance’s coefficients',[
      m`[[56:Mask assembly]] writes $M=\sigma(PC^T)$. Flatten the spatial dimensions of the prototype stack into one row per pixel. At a pixel, multiply each prototype value by the corresponding coefficient and add. The sigmoid converts that score to a foreground probability.`,
      'After assembly, crop the mask to its detection box at inference. In the demo, change a signed coefficient and see how it adds or cancels a feature in the combined score.'
    ],{formulas:['assembly'],lab:'prototype'}),
    section(57,60,'Use the assembled mask loss to train the prototypes',[
      '[[57:The loss slide]] combines class, box, and binary mask errors. It calls the normalizer the ground-truth mask area. The original YOLACT paper specifies cropping to the ground-truth bounding box during training and dividing by that box’s area. This reduces the tendency of large crops to dominate just because they contain more pixels.',
      '[[58:Online hard example mining]] refers to picking currently difficult training examples. Here the deck describes keeping hard negatives for classification at a 1:3 positive-to-negative ratio. Use the current loss to identify a hard negative, such as a background region that the model confuses with an object.',
      'In [[59:the prototype visualizations]] and [[60:the umbrella example]], individual patterns respond to locations or edges. Combining signed coefficients can keep one region and cancel another. ProtoNet learns these patterns through the assembled-mask objective.'
    ],{formulas:['yolactLoss'],figure:figure(59,[2,22,95,49],'Compare the same prototype across images. Look for recurring positions or boundaries rather than a fixed object category.'),
      check:['How can ProtoNet learn useful patterns without a labeled target for each prototype?', 'The assembled mask depends on the prototypes, so the mask loss can send training gradients back through the weighted sum.']})
  ]),
  lesson('Run YOLACT’s dense head and parallelize suppression',
    'Dense prediction produces many overlapping boxes. Greedy NMS repeatedly chooses a winner. YOLACT uses a matrix to compare each candidate with all higher-ranked boxes in parallel.',
    'Fast NMS rejects a detection if its maximum overlap with a higher-scored candidate reaches the threshold in the deck’s rule.',
    'Fast NMS lets a higher-scored candidate suppress a lower one even if the higher candidate is itself suppressed.', [
    section(61,62,'Read the prediction head and the sorted IoU matrix',[
      m`[[61:The prediction head]] runs on several pyramid levels. At every anchor it produces class, box, and coefficient outputs. As in Detection, candidate boxes need suppression before generating final masks.`,
      m`[[62:Fast NMS]] sorts each class’s candidates by confidence. In $X_{kij}$, $i$ is the candidate doing the comparison and $j$ is the box being considered. Keep only rows with $i<j$ for column $j$, so the comparison uses higher-ranked boxes. Take that column’s maximum overlap and compare it with threshold $t$.`,
      'Ordinary greedy NMS compares against selected boxes. Fast NMS can suppress a candidate using a higher-ranked box that was also suppressed. The matrix makes the operation parallel at the cost of this approximation.'
    ],{formulas:['fastNms'],figure:figure(61,[48,24,50,61],'Follow the shared feature into the class, box, and coefficient heads.'),
      check:['Can a box already suppressed by a stronger candidate still affect a lower-ranked box in Fast NMS?', 'Yes. The matrix uses all higher-ranked boxes, including those that are suppressed by another comparison.']}),
    section(63,64,'Read both sides of the speed–quality tradeoff',[
      '[[63:The performance slide]] reports frame rate and mask AP together. YOLACT’s shared mask assembly and parallel suppression improve speed in that comparison, while the compared two-stage systems obtain higher mask AP. The [[64:output montage]] helps show the range of shapes it handles at that setting.'
    ],{figure:figure(64,[0,1,97,90],'Inspect a thin object and an overlapping pair to see where mask detail matters.')})
  ]),
  lesson('See why a stricter box threshold needs better proposals',
    'A loose box can be acceptable as a starting proposal and still produce a clipped mask. A stricter definition of a good box sounds useful, until it leaves the learner with few positive examples.',
    'Cascade R-CNN addresses the tradeoff between localization quality and the scarcity of high-IoU training examples.',
    'The training IoU threshold labels a proposal. A confidence threshold or NMS threshold serves a different purpose.', [
    section(65,67,'Distinguish localization quality from sample availability',[
      'The [[66:threshold slide]] compares lenient and strict matching for boxes. IoU measures how much two rectangles share relative to their union. A lenient threshold accepts rough boxes as positives, making tight localization less important for the classifier. A strict threshold on the same rough proposals can leave too few positives to learn from.',
      '[[67:The curves]] show that a detector’s behavior depends on the quality of the boxes it receives. Raising a threshold changes labels. Refining the proposals changes the input distribution.'
    ],{figure:figure(67,[47,3,50,76],'Compare the plots and examples at the two quality settings.'),
      check:['What happens to the available positive examples if you raise the IoU threshold and keep all proposals fixed?', 'Some proposals become background and the number of positives can only stay the same or fall.']}),
    section(68,68,'Read the detector diagrams before adding stages',[
      'In [[68:the comparison diagram]], the Region Proposal Network (RPN) supplies initial regions. A detection head uses a classifier to score them and a box regressor to refine their coordinates. The later diagrams differ in which heads are repeated and which boxes flow into them.'
    ],{figure:figure(68,[3,36,94,46],'Compare the paths from the initial proposal to the classifier and box output in each diagram.')})
  ]),
  lesson('Separate iterative box refinement from integral loss',
    'There are two obvious ways to improve the first detector. You could run the same box head repeatedly, or ask different classifiers to judge the same boxes at several thresholds. The deck shows what each leaves unresolved.',
    'Iterative regression reuses a head as its inputs change. Integral loss trains classifiers for several IoU thresholds while sharing the initial proposal distribution.',
    'When a head is trained on rough boxes, later refined boxes can be outside the quality range it learned to handle.', [
    section(69,71,'Review the encoded offsets and trace the same head twice',[
      m`[[69:The localization review]] represents a box $\mathbf b$ by center, width, and height. The target $\mathbf g$ is the annotated box. As in Detection, center shifts are normalized by the proposal size and width and height changes use log ratios. The extra $\sigma$ factors rescale the four targets.`,
      '[[70:Iterative refinement]] applies the same learned head again to its own output. The [[71:scatter plots]] show that this changes the distribution of the boxes. A head trained with a fixed quality criterion may be poorly matched to those later inputs.'
    ],{formulas:['boxOffsets'],figure:figure(71,[46,10,52,66],'Compare later-stage distributions with the first. The refiner is receiving a different population of boxes.')}),
    section(72,74,'Train classifiers for several definitions of a positive',[
      '[[72:The label rule]] makes a box positive when its IoU clears the threshold, giving it the matched object’s class. In [[73:integral loss]], the training objective adds class losses for several thresholds. Each classifier gets its own notion of acceptable overlap.',
      '[[74:The proposal histograms]] show the remaining problem: the stricter classifier may still see few positive boxes if all classifiers start with the same low-quality proposals. The listed training thresholds illustrate this idea. COCO’s evaluation thresholds are a separate choice.'
    ],{formulas:['thresholdLoss'],figure:figure(74,[51,23,47,48],'Compare how many boxes are available toward the high-IoU end of the first-stage distribution.'),
      check:['How does integral loss change supervision while leaving the proposal-quality problem in place?', 'It changes the classifier targets across thresholds, but the classifiers still start from the same proposal distribution.']})
  ]),
  lesson('Specialize each Cascade R-CNN stage for its own inputs',
    'Give the stricter head boxes that have already been refined. It can then learn on inputs resembling the ones it will see when the whole cascade runs.',
    'A sequence of different heads refines boxes stage by stage and trains with increasing positive IoU thresholds.',
    'Each stage uses the boxes produced by its predecessor. The increasing thresholds are design settings in the described cascade.', [
    section(75,76,'Resample from the refined boxes',[
      '[[75:The specialized regressors]] apply a sequence of different heads. The next head receives the previous head’s refined boxes, so it can learn the smaller corrections appropriate for those inputs.',
      '[[76:The sampling distribution]] shows why the stricter stage can still get useful positives: earlier regression moves more proposals into the high-overlap range. This addresses the shortage of positives that occurs when you apply a strict threshold to the original proposals.'
    ],{formulas:['cascade'],figure:figure(76,[55,27,43,46],'Compare the quality distribution after refinement with the initial proposals.')}),
    section(77,78,'Score the labels and box offsets at each stage',[
      m`The [[77:stage loss]] includes classification for sampled proposals and box regression for positives. The threshold $u^t$ rises across stages. A proposal can become a stronger match after refinement even though the next stage demands more.`,
      '[[78:The results]] report box detection AP. The motivation for putting this in the Segmentation deck is that better boxes can give the later mask head better regions to work with.'
    ],{formulas:['cascadeLoss'],
      check:['Why can a stricter second stage still have positive samples?', 'It trains on refined proposals. Earlier box regression can move more proposals into its stricter positive range.']})
  ]),
  lesson('Let the mask head use the newly refined box in HTC',
    'A cascade can improve the box at each stage. Hybrid Task Cascade (HTC) asks how soon the mask head can take advantage of that improvement.',
    'Interleaving makes the mask head at stage t pool features from the box just refined at stage t.',
    'Track the RoI used to pool features. The box head starts from the previous stage’s RoI. The interleaved mask head uses the current stage’s RoI.', [
    section(79,82,'Read the three changes on the architecture comparison',[
      '[[80:The cascade recap]] identifies the starting point: refine progressively and train each stage on its own proposal distribution. The basic Cascade Mask R-CNN adds mask heads to that pipeline.',
      'The [[81:HTC design slide]] and [[82:four architectures]] introduce three changes: use the current refined box for the mask, pass intermediate mask features between stages, and add a scene-wide semantic branch.'
    ],{figure:figure(82,[4,13,93,67],'Compare the arrows in the four diagrams. Find the current-box arrow, the links between masks, and the added semantic branch.')}),
    section(83,84,'Follow the box refinement before pooling mask features',[
      m`In [[83:Cascade Mask R-CNN]], the box and mask heads both pool from the previous RoI $\mathbf r_{t-1}$. A box head can tighten the region, but the same stage’s mask still used features pooled from the older region.`,
      m`In [[84:interleaved execution]], first produce the refined box $\mathbf r_t$. Then pool mask features using that current box. The stage can use the better localized region immediately.`
    ],{formulas:['interleave'],figure:figure(84,[47,35,50,43],'Follow the arrow from the current stage’s box to its mask path.'),
      check:['In interleaved HTC, which RoI does stage t use for the mask features?', 'It uses the current stage’s refined RoI. The box head obtained it using features from the previous RoI.']})
  ]),
  lesson('Carry mask features forward and add scene context in HTC',
    'A later stage gets a better box and can also learn from what the earlier mask head saw. HTC passes that mask evidence forward and adds a semantic view of the whole scene.',
    'HTC combines the current RoI features, intermediate mask features from the previous stage, and RoI-aligned semantic features.',
    'The semantic branch supplies scene context. The instance mask branch still predicts one shape per detection.', [
    section(85,87,'Pass intermediate mask features between stages',[
      '[[85:Mask information flow]] gives a later mask head access to intermediate features from the preceding mask head. These are spatial features before the final mask prediction. They can carry useful shape cues that would be lost by passing just a final binary decision.',
      m`The [[87:feature transform]] uses $\mathcal G$ to adapt the prior mask features, then adds them to the current mask features. Use the [[86:combined architecture]] to locate this path alongside the current-box input.`
    ],{formulas:['maskFlow'],figure:figure(87,[46,18,50,65],'Trace the prior-stage intermediate features into the transform and then into the current mask branch.')}),
    section(88,89,'Pool scene-wide semantic context into each RoI and balance the losses',[
      'The [[88:semantic branch]] combines pyramid features into a dense context map. RoIAlign extracts context for each box or mask region, which is added to its usual features. This gives a crop information learned from the larger scene, an idea related to why PSPNet pools broad context.',
      '[[89:The objective]] weights the classification and box errors and the mask error from each cascade stage together. It adds a separately weighted scene-wide semantic loss. Stage weights control how strongly each stage contributes to training.'
    ],{formulas:['htcContext','htcLoss'],figure:figure(88,[54,12,43,86],'Follow the scene-wide feature map into both the box and mask paths.'),
      check:['What can the semantic branch tell a mask head that only sees an object crop?', 'It can provide cues from the surrounding scene. The mask head still uses its RoI to determine that particular instance’s shape.']}),
    section(90,91,'Read the mask AP table with the backbone in mind',[
      '[[90:The reported AP values]] vary with the backbone. To isolate what the cascade changes, compare settings that keep the backbone and protocol fixed. In the [[91:example outputs]], inspect partially hidden objects and overlapping masks.'
    ],{figure:figure(91,[19,1,64,94],'Look for nearby instances whose masks have to stay separate.')})
  ]),
  lesson('Use rotated RoIs when an object is long and tilted',
    'An axis-aligned rectangle around a diagonal pencil can contain more table than pencil. The extra space can also make boxes around neighboring pencils overlap.',
    'A rotated box adds an angle so it can fit the orientation of an elongated object and provide a tighter crop.',
    'A rotated rectangle still only encloses the object. The mask describes the pixels inside that region.', [
    section(92,93,'See which pixels enter the region of interest',[
      '[[92:Rotated Mask R-CNN]] illustrates using oriented rectangles. The center, width, and height describe the box, and an angle describes its rotation. Compare the two sets of regions on [[93:the crowded outdoor example]]. A rotated box can surround an angled object with less background.'
    ],{figure:figure(93,[1,28,97,70],'Look at the long diagonal shapes and compare the amount of surrounding area enclosed by the boxes.')}),
    section(94,94,'Compare the two approaches on the same set of objects',[
      '[[94:The pencil comparison]] uses elongated objects at many angles. The rotated crop can separate nearby regions before predicting masks. Angle conventions matter when implementing it, and the slide gives a qualitative comparison for these images.'
    ],{figure:figure(94,[2,22,96,68],'Compare the overlapping boxes in the left output with the boxes that follow the pencil orientations on the right.'),
      check:['When would a rotated box make the biggest difference to the RoI?', 'When the object is long and thin, tilted relative to the image axes, and surrounded by background or nearby objects that a wide axis-aligned box would include.']})
  ]),
  lesson('Prompt SAM 2 to segment an object across frames',
    'You might want the same dog in every frame, including when it turns or disappears behind a tree. Pointing at the dog gives the model a specific instance to follow.',
    'SAM 2 receives point, box, or mask prompts and predicts a mask or a sequence of masks for the selected object.',
    'A masklet is the sequence of masks for one prompted object over time.', [
    section(95,97,'Specify what to segment with a prompt',[
      '[[96:SAM 2]] handles images and video through promptable visual segmentation. A prompt can be a point, a box, or an existing mask. It tells the model what region or object you intend to segment. The output is a mask for an image or a masklet for a video.',
      '[[97:The overview]] separates the task, the model, and its data engine. For video, memory lets information from one frame help interpret another frame where the object looks different.'
    ],{figure:figure(97,[2,18,94,56],'Find the input prompts, the mask sequence, and the memory connection in the overview.'),
      check:['Why can a click on a particular dog be more useful than giving the class name “dog” when there are two dogs?', 'The click identifies which individual dog to segment and follow across frames.']}),
    section(98,99,'Follow a correction to later frames',[
      'The [[98:data engine example]] shows an early mask being propagated, a person correcting a later mistake, and the correction informing subsequent frames. The [[99:model diagram]] separates three operations: encode the current image, read previous memory to decode a mask, then encode new memory from that result.'
    ],{figure:figure(98,[1,7,91,62],'Trace the sequence in the first row. Then follow the correction arrow and look at what changes in later frames.')})
  ]),
  lesson('Read and update SAM 2’s memory',
    'The object can move, turn, or be hidden. When it reappears, recent frames and earlier prompted frames give the model evidence about which object you meant.',
    'Encode the current frame, attend to stored spatial memories and object pointers, decode using the prompt, then store new mask-conditioned memory.',
    'Recent frame memory rolls forward. Prompted frames have a separate queue, so a single initial prompt can remain available as recent predictions change.', [
    section(100,101,'Let the current frame retrieve useful past information',[
      'The [[100:Hiera image encoder]] turns the current frame into feature maps. An embedding is a learned numerical representation of an image region or object. [[101:Memory attention]] uses the current frame to retrieve information from stored frame features and object pointers.',
      'Cross-attention compares queries from the current frame with information from a different set of features. Object pointers are compact vectors from earlier mask decoder tokens. They supply object-level cues alongside the spatial memories.'
    ],{figure:figure(100,[4,15,92,44],'Locate the image encoder in the Hiera diagram and distinguish its output features from the task-specific mask.')}),
    section(102,103,'Resolve what the prompt refers to',[
      'The [[102:prompt encoder]] turns point and box locations into positional representations with learned prompt-type information. A mask prompt is encoded spatially with convolutions.',
      'The [[103:two-way decoder]] lets prompt and mask tokens exchange information with the spatial image features. An ambiguous point can give several plausible masks. A click on a bicycle tire could refer to the tire or the whole bike, so another prompt can clarify the target.'
    ]),
    section(104,105,'Write the prediction to memory and manage the queues',[
      'The [[104:memory encoder]] combines a downsampled mask with current frame features and fuses them into a spatial memory. In [[105:the memory bank]], FIFO means first in, first out. When a queue is full, an incoming item replaces the oldest item in that queue.',
      'The recent-frame and prompted-frame queues are separate. In the single-initial-prompt setting described in the SAM 2 paper, the first prompted frame can remain while the recent unprompted frames change. Use the demo to advance the frame and follow which entries stay.'
    ],{lab:'memory',check:['If the recent-frame queue fills, which frame leaves it first? What happens to a prompted frame in the other queue?', 'The oldest recent frame leaves first. The prompted frame remains in its own queue until that queue replaces it.']})
  ]),
  lesson('Train with corrections and build the SA-V dataset',
    'A deployed model often gets a second click after a bad mask. SAM 2 training gives it practice using that correction, and its dataset was built with a similar feedback loop.',
    'Simulate prompts during training. In the data engine, people and models cooperate to annotate masklets and refine mistakes.',
    'The training loop teaches responses to prompts. The annotation data engine uses prompts and edits to create supervision.', [
    section(106,107,'Make the training inputs resemble real interaction',[
      '[[106:The training slide]] uses image and video examples with known masks. Training can simulate a point or box prompt and a correction after an error, so the model learns both the initial segmentation and the response to feedback.',
      '[[107:The three annotation phases]] progress from image-by-image SAM assistance and manual brush corrections, to propagating masks through video, to an integrated SAM 2 workflow that accepts further clicks or boxes. The feedback makes it feasible to annotate more frames.'
    ]),
    section(108,109,'Read the annotation and dataset tables separately',[
      '[[108:The data engine table]] compares annotation effort and agreement across phases. [[109:The SA-V comparison]] describes the resulting video dataset in videos, masks, and masklets, with manual and automatically generated contributions shown separately.',
      'A video can contain several annotated objects and each masklet can contain many frame masks. Read the table column before interpreting any count.'
    ],{figure:figure(109,[5,26,90,54],'Compare the columns for videos, masks, and masklets. They count different units.'),
      check:['Why can a dataset have far more masks than masklets?', 'One masklet follows one object over time, so it can contribute a mask on many frames.']})
  ]),
  lesson('Measure both region overlap and boundary quality in video',
    'A predicted mask can cover most of an object and still have a jagged or misplaced edge. Video benchmarks report measures for both kinds of error.',
    'Video object segmentation uses region similarity J and boundary F. The combined J&F score averages them.',
    'Region J compares pixel sets. Boundary F combines precision and recall over matched boundary pixels.', [
    section(110,111,'Separate the prompt protocol from the metric',[
      'The [[110:image benchmark]] evaluates promptable image segmentation. In video object segmentation (VOS), the model has to maintain the target identity across frames. [[111:The VOS metrics]] score two properties of the masks.',
      m`Region similarity $\mathcal J$ is MaskIoU: intersection over union of the foreground pixels. Boundary $\mathcal F$ first matches contour pixels within the evaluation tolerance. Precision is the fraction of predicted contour pixels with a match, and recall is the fraction of ground-truth contour pixels with a match. The F-score is their harmonic mean, so it is low if either is low.`
    ],{formulas:['regionBoundary'],
      check:['Could two predictions with similar region overlap have different boundary F scores?', 'Yes. One can have more misplaced or missing contour pixels even when the total shared region is similar.']}),
    section(112,113,'Compare video results under the same prompt setting',[
      'The [[112:VOS benchmark]] reports results with a ground-truth mask prompt on the first frame. A score in that setting answers a different question from interactive video segmentation with multiple corrections. Compare the dataset, prompt budget, and metric before comparing results.',
      'Across this deck the output grew from per-pixel class labels, to separate masks for objects, to masklets across video. The evaluation has to match that output.'
    ],{figure:figure(112,[5,16,92,72],'Find the metric and dataset headers before comparing any two numbers.')})
  ])
];
