import {detectionLessons} from './detection-lessons.mjs';
import {detectionEquations} from './detection-equations.mjs';
import {detectionExam, examples} from './detection-practice.mjs';
import {detectionLabMarkup, mountDetectionLabs} from './detection-labs.mjs';
import {buildGroupedContent} from './grouped-content.mjs';

const m = String.raw;
const {lessons,topics,quickReference,topicFor,equationContext} = buildGroupedContent(detectionLessons,detectionEquations);
const tutor = {topics,labMarkup:detectionLabMarkup,mountLab:mountDetectionLabs};

const flashcards = [
  [5,'What are the two pieces of an object detection?','A class label (what it is) and a bounding box (where one instance is).'],
  [9,'What is an anchor box?','A preset reference rectangle from which the model predicts a correction.'],
  [15,'What is a feature map’s stride?','The distance in input-image pixels between neighboring feature locations.'],
  [16,'What does changing an anchor aspect ratio change?','The shape. The slide’s square-root scaling changes width and height while preserving the base area.'],
  [22,'What are the numerator and denominator of IoU?','The shared area and the area covered by either box, respectively.'],
  [24,'Can multiple SSD anchors learn the same object?','Yes. The best match is assigned first, and other anchors can qualify by overlap.'],
  [28,'Which anchors contribute to the SSD box loss?','Positive anchors matched to a labeled object.'],
  [31,'What two shapes make up Smooth L1?','A quadratic near zero and linear tails.'],
  [38,'What is NMS for?','Removing redundant predictions when multiple boxes fire on the same object.'],
  [43,'Which metric asks what fraction of reported boxes were correct?','Precision. Recall asks what fraction of the annotated objects were found.'],
  [48,'What makes VOC 2007 AP an eleven-point metric?','It averages interpolated precision at recall levels from zero to one in increments of 0.1.'],
  [54,'What computation is shared in Fast R-CNN?','The convolutional feature map of the entire input image.'],
  [56,'What does RoI pooling output?','A fixed-size grid of pooled features per channel for a proposed region.'],
  [61,'How does Selective Search get multiple proposal sizes?','It merges similar neighboring regions and makes proposals from regions at several stages of merging.'],
  [68,'What is objectness in an RPN?','A score for whether a reference contains any object, regardless of its category.'],
  [71,'What happens to an RPN anchor labeled ignored?','It supplies neither an objectness nor a regression training target.'],
  [85,'What does an FPN lateral connection join?','Same-resolution backbone detail and upsampled features from the coarser top-down level.'],
  [87,'What size does the FPN RoI assignment formula measure?',m`The geometric mean of width and height, $\sqrt{wh}$.`],
  [95,'What does the subscript t mean in focal loss’s pₜ?','The true label. It refers to the probability assigned to the correct class.'],
  [100,'What is the role of π in RetinaNet initialization?','It sets the desired starting foreground probability through the classification bias.'],
  [105,'What does anchor-free remove from FSAF’s point branch?','Preset reference boxes. It still uses spatial points on a pyramid of feature maps.'],
  [108,'Where is an FSAF instance assigned as a positive?','At the points inside its effective box on the chosen level.'],
  [114,'What selects an FSAF level during training?','The smallest sum of mean focal and IoU regression losses for that instance.'],
  [125,'What is the FCOS target’s distance order?','Left, top, right, bottom.'],
  [129,'What is the centerness target at the exact center of an FCOS box?','One. Both opposing-distance ratios equal one.']
];

const question = (type, slide, prompt, answer, check) =>
  ({id:`det-${type}-${slide}`, type, topic:topicFor(slide), prompt, answer, check});
const questions = [
  ...flashcards.map(([slide,prompt,answer])=>question('flashcard',slide,prompt,answer,
    'Recall the definition and explain what it describes in the detector.')),
  ...detectionLessons.flatMap(({steps})=>steps.filter(step=>step.check).map(({slide,check})=>
    question('theory',slide,...check,'State the mechanism and connect it to the situation in the question.'))),
  ...examples.map(example=>question('computation',example.slide,example.problem,
    example.solution.map(({text,math})=>math?`${text} $${math}$`:text).join(' '),example.takeaway))
];

const paper = (title, author, url, time, text, slides, tag='ORIGINAL PAPER') => ({
  title, author, url, time, text, tag, topics:slides.map(topicFor)
});
const resources = [
  paper('SSD: Single Shot MultiBox Detector','Liu et al.','https://arxiv.org/abs/1512.02325','10 min',
    'Read Figure 1 for default boxes and Section 2.2 for matching, the training objective and hard negative mining.',[22,28,32]),
  paper('Soft-NMS','Bodla et al.','https://arxiv.org/abs/1704.04503','8 min',
    'Use Figure 1 and the score update to see why suppression can discard a second real object in a crowded image.',[38]),
  paper('PASCAL VOC 2007 evaluation','Visual Geometry Group, University of Oxford','https://www.robots.ox.ac.uk/~vgg/projects/pascal/VOC/voc2007/','8 min',
    'Open the development kit and results to connect the eleven-point protocol to the original challenge.',[48],'BENCHMARK'),
  paper('Fast R-CNN','Ross Girshick','https://arxiv.org/abs/1504.08083','8 min',
    'Read Section 2 and Figure 1 to trace RoI pooling and the shared classification and regression architecture.',[54,56]),
  paper('Faster R-CNN','Ren et al.','https://arxiv.org/abs/1506.01497','12 min',
    'Read Section 3.1 for the RPN’s anchor outputs and Section 3.2 for the original alternating training procedure.',[68,75]),
  paper('Feature Pyramid Networks','Lin et al.','https://arxiv.org/abs/1612.03144','10 min',
    'Compare the lateral merge in Section 3 with the two pyramid routing rules in Section 4.',[84,87]),
  paper('Focal Loss for Dense Object Detection','Lin et al.','https://arxiv.org/abs/1708.02002','12 min',
    'Read Section 3 for true-label probability and both weighting terms, then Section 4 for the RetinaNet heads.',[98,100]),
  paper('Feature Selective Anchor-Free Module','Zhu et al.','https://arxiv.org/abs/1903.00621','12 min',
    'Use Figures 5 and 6 to connect the effective region to the per-instance loss comparison across pyramid levels.',[108,113]),
  paper('UnitBox','Yu et al.','https://arxiv.org/abs/1608.01471','6 min',
    'Read Figure 1 and Section 2.2 for the negative-log IoU loss used as a box regression objective.',[111]),
  paper('FCOS: Fully Convolutional One-Stage Object Detection','Tian et al.','https://arxiv.org/abs/1904.01355','12 min',
    'Read Sections 3.1–3.3 for point assignment, regression ranges and the centerness target.',[125,129])
];

export const detection = {
  id:'detection', number:'03', title:'Detection', sourceTitle:'Object Detection', href:'detection.html', slideCount:132,
  optionalFromSlide:51,
  optionalScopeNote:'SSD and YOLO were reported in scope. The guide includes their evaluation slides through slide 50.',
  assetPrefix:'assets/detection/slide-', pdf:'assets/detection/deck.pdf', storageKey:'ai222-detection-v1',
  lessons, tutor, examples, questions, resources, quickReference, exam:detectionExam,
  notationTitle:'New to the notation? Start with coordinates, IoU, and offsets',
  notationBasics:[
    [m`$(x,y)$`,'Image coordinate. x increases rightward and y downward from the upper-left corner.'],
    ['Anchor','Reference rectangle. An offset is a signed change relative to that reference.'],
    ['IoU','Area shared by two boxes divided by the area covered by either.'],
    [m`$P_l$`,'Feature map at pyramid level l. Larger indices usually have a coarser spatial grid.'],
    [m`$[u\ge1]$`,'Indicator that is 1 for a foreground label and 0 otherwise.']
  ],
  equationContext,
  references:[], minibatchAdvantages:[], challengeConnections:[], trainingScenario:[]
};
