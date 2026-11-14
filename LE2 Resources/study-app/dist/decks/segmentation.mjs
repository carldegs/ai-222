import {segmentationLessons} from './segmentation-lessons.mjs';
import {segmentationEquations} from './segmentation-equations.mjs';
import {segmentationExam,examples} from './segmentation-practice.mjs';
import {segmentationLabMarkup,mountSegmentationLabs} from './segmentation-labs.mjs';
import {buildGroupedContent} from './grouped-content.mjs';

const m = String.raw;
const {lessons,topics,quickReference,topicFor,equationContext} = buildGroupedContent(segmentationLessons,segmentationEquations);
const tutor = {topics,labMarkup:segmentationLabMarkup,mountLab:mountSegmentationLabs};

const flashcards = [
  [2,'What makes panoptic segmentation different from semantic segmentation?','Panoptic segmentation assigns class labels scene-wide and also distinguishes individual instances of countable objects.'],
  [3,'What is a stuff region?','An amorphous region such as sky, grass, or road that is labeled by category without a separate ID for each object.'],
  [8,'Where does a semantic model apply softmax?','Across the classes for a single pixel. It repeats this for every pixel.'],
  [10,'What does a skip connection supply to an FCN?','Finer spatial information from an earlier layer.'],
  [16,'What does the one-bin PSPNet branch store?','One global average for each feature channel.'],
  [22,'How does semantic mIoU combine classes?','Compute each included class’s IoU, then take their arithmetic mean.'],
  [26,'Why does RoIAlign keep fractional coordinates?','It avoids shifts from rounding the region and interpolates feature values at the intended locations.'],
  [29,'How many mask values does the class-specific Mask R-CNN head emit per RoI?',m`$Km^2$, one $m\times m$ grid for each of $K$ foreground classes.`],
  [33,'Which mask channel is resized at inference?','The one corresponding to the predicted class of the detection.'],
  [38,'Where is the predicted RoI mask placed?','It is resized to the selected detection box and placed at those image coordinates.'],
  [44,'What are the numerator and denominator of MaskIoU?','The number of foreground pixels in both masks and the number in either mask.'],
  [47,'How does Mask Scoring R-CNN compute the ranking score?','Multiply the classification score by the learned estimate of MaskIoU.'],
  [54,'What does YOLACT’s ProtoNet share between detections?','The image-wide prototype maps. Each detection has its own coefficients.'],
  [56,'When does YOLACT apply sigmoid during mask assembly?','After taking the weighted sum of the prototypes at each pixel.'],
  [62,'Which boxes enter the Fast NMS column maximum?','All higher-scoring boxes of the same class.'],
  [66,'Why can a strict IoU threshold leave few training positives?','Fewer rough proposals overlap their annotated boxes enough to pass.'],
  [73,'What is added together in integral loss?','The classification losses defined using several training IoU thresholds.'],
  [75,'What boxes does each Cascade R-CNN stage receive?','The refined boxes from the preceding stage.'],
  [84,'Which RoI does the interleaved mask head use in HTC?','The RoI just refined by the same stage’s box head.'],
  [87,'What passes from one mask head to the next in HTC?','Intermediate spatial mask features, transformed before being fused with the current features.'],
  [94,'What additional quantity describes a rotated box?','An orientation angle.'],
  [96,'What is a masklet?','A sequence of masks for the same prompted instance across video frames.'],
  [105,'What does FIFO mean for SAM 2 memory?','First in, first out. When a queue is full, the oldest entry is the first one replaced.'],
  [109,'Why does SA-V count masks and masklets separately?','A mask covers one frame. A masklet can contain many masks for one instance across frames.'],
  [111,'What does boundary F combine?','The precision and recall of boundary matches, using their harmonic mean.']
];
const question = (type,slide,prompt,answer,check) =>
  ({id:`seg-${type}-${slide}`,type,topic:topicFor(slide),prompt,answer,check});
const questions = [
  ...flashcards.map(([slide,prompt,answer])=>question('flashcard',slide,prompt,answer,
    'Name the concept and what it measures or produces.')),
  ...segmentationLessons.flatMap(({steps})=>steps.filter(step=>step.check).map(({slide,check})=>
    question('theory',slide,...check,'Explain the mechanism and connect it to the example.'))),
  ...examples.map(example=>question('computation',example.slide,example.problem,
    example.solution.map(({text,math})=>math?`${text} $${math}$`:text).join(' '),example.takeaway))
];

const resource = (title,author,url,time,text,slides,tag='ORIGINAL PAPER') => ({
  title,author,url,time,text,tag,topics:[...new Set(slides.map(topicFor))]
});
const resources = [
  resource('Panoptic Segmentation','Kirillov et al.','https://arxiv.org/abs/1801.00868','7 min',
    'Compare the outputs in Figure 1 and read the task definition for the role of stuff and thing IDs.',[2]),
  resource('Fully Convolutional Networks for Semantic Segmentation','Long, Shelhamer, and Darrell','https://arxiv.org/abs/1411.4038','9 min',
    'Use Figure 3 to follow the skip architecture and Figure 4 to compare the output stride variants.',[8,10]),
  resource('Pyramid Scene Parsing Network','Zhao et al.','https://arxiv.org/abs/1612.01105','9 min',
    'Read Section 3 and Figure 3 for the four pooling grids, projection, upsampling, and concatenation.',[16,20]),
  resource('Mask R-CNN','He et al.','https://arxiv.org/abs/1703.06870','12 min',
    'Section 3 explains class-specific binary mask training and the difference between RoI pooling and RoIAlign.',[26,30,36]),
  resource('Mask Scoring R-CNN','Huang et al.','https://arxiv.org/abs/1903.00241','9 min',
    'Use Figures 2 and 3 to connect the ranking scatter plots to the predicted MaskIoU head.',[44,47]),
  resource('YOLACT: Real-time Instance Segmentation','Bolya et al.','https://arxiv.org/abs/1904.02689','12 min',
    'Trace prototypes and coefficients through Figure 2, then compare Fast NMS and greedy NMS in Section 3.',[53,56,62]),
  resource('Cascade R-CNN','Cai and Vasconcelos','https://arxiv.org/abs/1712.00726','12 min',
    'Compare the alternatives in Figure 3 and the proposal quality histograms in Figure 4.',[68,74,75]),
  resource('Hybrid Task Cascade for Instance Segmentation','Chen et al.','https://arxiv.org/abs/1901.07518','12 min',
    'Read the architecture diagrams and Section 3 to trace interleaving, intermediate mask features, and semantic context.',[84,88]),
  resource('Rotated Mask R-CNN','Project repository','https://github.com/mrlooi/rotated_maskrcnn','6 min',
    'Compare the example images and their oriented boxes with the examples in slides 93–94.',[94],'IMPLEMENTATION'),
  resource('SAM 2: Segment Anything in Images and Videos','Ravi et al.','https://arxiv.org/abs/2408.00714','15 min',
    'Read the task and architecture sections for prompts and memory, then the data engine section and the first-frame mask benchmark.',[96,105,109,112]),
  resource('DAVIS video segmentation benchmark','DAVIS Challenge organizers','https://davischallenge.org/','6 min',
    'Explore the benchmark and examples to connect region and contour measures to densely annotated videos.',[111],'BENCHMARK')
];

export const segmentation = {
  id:'segmentation',number:'04',title:'Segmentation',href:'segmentation.html',slideCount:113,
  optionalFromSlide:24,
  optionalScopeNote:'Tentative cutoff from class discussion. The lecture reportedly ended before instance segmentation.',
  assetPrefix:'assets/segmentation/slide-',pdf:'assets/segmentation/deck.pdf',storageKey:'ai222-segmentation-v1',
  lessons,tutor,examples,questions,resources,quickReference,equationContext,exam:segmentationExam,
  notationTitle:'New to the notation? Start with masks, RoIs, and overlap',
  notationBasics:[
    [m`$M,\widehat M$`,'Ground-truth and predicted masks. A binary mask marks foreground pixels with 1.'],
    ['RoI','Region of interest. A box tells the network where to extract features.'],
    ['IoU','Number of shared pixels divided by the number of pixels in either mask. For boxes, use areas instead.'],
    [m`$\mathcal L_{\mathrm{cls}},\mathcal L_{\mathrm{off}}$`,'Classification and box-offset losses.'],
    [m`$\mathcal J,\mathcal F$`,'Video region overlap and boundary agreement.']
  ],
  references:[],minibatchAdvantages:[],challengeConnections:[],trainingScenario:[]
};
