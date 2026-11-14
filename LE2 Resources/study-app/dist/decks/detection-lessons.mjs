const math = String.raw;
const figure = (page, box, caption) => ({page, box, caption});
const section = (slide, end, title, explain, options = {}) =>
  ({slide, end, title, explain, ...options});
const lesson = (title, context, summary, recall, steps) =>
  ({title, context, summary, recall, steps});

export const detectionLessons = [
  lesson('Find what is in the image and where',
    'If there are three cans in a photo, “soda can” alone gives you no way to point to any one of them. Detection gives each recognized object its own label and location.',
    'A detection couples a class label with a bounding box around one instance.',
    'Start at the upper-left image corner. Increasing x moves right and increasing y moves down.', [
    section(1, 1, 'Object detection', ['The cover names the task and the course.']),
    section(2, 4, 'What question is the detector answering?', [
      'The [[2:deck outline]] compares detectors that predict directly with detectors that first propose places to look. [[3:SSD]] (Single Shot MultiBox Detector) is our first direct, or single-stage, detector. We’ll use it to unpack what an object detector produces.'
    ]),
    section(5, 8, 'Read a label and a box together', [
      math`In the [[5:soda can example]], the class ID tells you what kind of object it is. A bounding box is the rectangle around it. The upper-left corner is $(x_{\min},y_{\min})$ and the lower-right corner is $(x_{\max},y_{\max})$. The image origin is at the upper left.`,
      'An instance is one particular object. [[6:Three cans]] need three boxes even when all three share a class. A soda-only detector can leave [[7:the other objects]] unlabeled. With examples and labels for more categories, a detector can learn [[8:multiple classes and appearances]], including changes in lighting or orientation.'
    ], {figure:figure(5,[54,36,43,57],'Find the top-left and bottom-right corners marked around the soda can.'),
      check:['A detector puts one large box around three separate soda cans. What has it missed?', 'It has identified the class but failed to localize the three instances separately.']})
  ]),
  lesson('Start from an anchor and adjust its corners',
    'Guessing four coordinates from scratch is like drawing a rectangle on a blank page. SSD gives the model rectangles to start from and asks it how far to move each edge.',
    'An anchor is a preset reference box. The detector predicts a class and four corrections for each anchor.',
    'Use the same coordinate order for the anchor and object. Encode by subtracting the anchor and decode by adding it back.', [
    section(9, 10, 'A reference box gives the prediction a starting point', [
      'An [[9:anchor box]] is a rectangle fixed by the model design at a grid location. Many anchors overlap. The model asks whether each reference contains an object worth predicting and estimates an offset, the amount the reference must move to fit that object.',
      'The [[10:proposals divider]] introduces candidate predictions. Here those are decoded predictions made directly from anchors. Later, Faster R-CNN uses proposals as inputs to a separate detection head.'
    ]),
    section(11, 13, 'Compare three starting rectangles around the same can', [
      'Start with [[11:the full image]] as the anchor. Its right edge may be far from the can, so the right-edge correction is large. The [[12:two-column grid]] and [[13:three-by-two grid]] offer smaller anchors nearer the can. A reference with similar location and size can turn a large coordinate into a small local correction.',
      math`An offset is signed. If the anchor ends at $x=8$ and the object ends at $x=6$, the right edge needs to move $-2$ pixels, to the left. In this lesson we list coordinates in corner order $(x_{\min},y_{\min},x_{\max},y_{\max})$. Slides 25–26 later list the same kinds of values in axis order.`
    ], {formulas:['corners'],figure:figure(13,[49,21,44,62],'Find the central anchor and trace the short adjustments to the can’s box.'),
      check:['An anchor and the true box have the same width. The true box is shifted two pixels to the right. What happens to both x offsets?', 'Both are +2. An offset changes a particular edge, so translating the box changes both horizontal edges equally.']})
  ]),
  lesson('Cover small, large, wide, and tall objects',
    '[[3:SSD]] stands for Single Shot MultiBox Detector. It predicts object labels and locations in one pass through the network. A bounding box is a rectangle around an object, like the [[5:box around the soda can]]. During training, the labeled box shows where the object actually is. During detection, SSD predicts a box of its own.',
    'Feature-map grids provide anchor centers. Scale sets size and aspect ratio changes shape.',
    'Multiply grid locations by templates per location. The slide’s 9,648 counts the templates in its illustrative grids.', [
    section(14, 15, 'Which pixels can one feature cell see?', [
      'Imagine a photo of a soda can. The backbone is the part of the detector that turns the photo into a grid of measurements called a feature map. A location in this grid can carry clues about the image, such as whether there is an edge nearby. To find out which original pixels could change those measurements, trace the computation backward. That patch of the original photo is the location’s receptive field.',
      'Here is how the patch grows. A convolution combines values from a small window. In the demo, one cell in the first layer reads a 3 × 3 window of pixels. One cell in the second layer reads a 3 × 3 window of first-layer cells. Each of those cells already read its own patch of pixels. Put their overlapping patches together and the second-layer cell can draw on a 5 × 5 patch of the original image.',
      math`The [[14:six example grids]] give SSD places to center anchors. In [[15:the backbone diagram]], the input is $640\times480$ and the grid is $40\times30$. Dividing each dimension gives a spacing of 16 input pixels between neighboring grid centers. This spacing is the stride. The slide calls its $16\times16$ patch a receptive field. For the actual backbone, you need to trace which pixels feed a cell through the layers to know how wide its receptive field is. Neighboring cells can have overlapping receptive fields.`,
      'An [[9:anchor box]] is a preset starting rectangle that SSD puts at a grid location before it sees the photo. For each anchor, SSD uses the feature measurements to score object classes and predict how to move or resize the rectangle. Applying those corrections gives a candidate bounding box. For example, if a can sits slightly to the right of a tall anchor, SSD can shift the rectangle right to line it up with the can.'
    ], {formulas:['grid'],lab:'receptive-field',
      figure:figure(15,[19,31,75,64],'Follow the red lines from one feature location down toward the image. They trace where its input comes from.'),
      check:['Two feature locations have centers 16 pixels apart. What else would you need to know to tell whether their receptive fields overlap?', 'You need to know how far each cell’s input patch extends. For example, two 32-pixel-wide patches with centers 16 pixels apart on the same row overlap by 16 pixels.']}),
    section(16, 17, 'Give each center a choice of shapes', [
      'Grid locations give SSD many places to start because an object could appear anywhere in the photo. At a single location, it also helps to have different sizes and shapes. Think of an upright can and the same can lying on its side. A tall anchor starts closer to the upright can and a wide one starts closer to the sideways can, so each needs less reshaping. A can close to the camera may need a larger anchor than a distant can, even when both cans have the same shape.',
      'Aspect ratio means width divided by height. A 2-by-4 rectangle has ratio 1:2 and is tall. A 4-by-2 rectangle has ratio 2:1 and is wide. A 4-by-8 rectangle is bigger than the 2-by-4 rectangle, but both have ratio 1:2.',
      math`For a square base anchor, the aspect ratio $a$ is the desired width divided by height. In the [[16:ratio equation]], multiplying a base width by $\sqrt a$ and dividing its base height by $\sqrt a$ changes the shape while preserving area. With a square base, $a=4$ doubles width and halves height, giving a 4:1 rectangle.`,
      math`The [[17:extra square template]] uses the geometric mean of adjacent scales, $\sqrt{s_j s_{j+1}}$, to fill a size gap. In the deck’s illustrative grids, six templates at each of $1{,}608$ centers give $9{,}648$ anchors. SSD chooses its actual templates per feature level, so this example teaches the counting method.`
    ], {formulas:['shapes'],figure:figure(17,[53,37,43,56],'Compare the rectangles around the can. A shared center can support multiple sizes and shapes.'),
      check:['Why add a tall anchor if a square anchor is already centered on the can?', 'The tall template can overlap the can better before regression and requires smaller shape corrections.']})
  ]),
  lesson('Use IoU to choose which anchors learn each object',
    'A training image comes with boxes drawn by an annotator. SSD still needs to decide which of its thousands of reference boxes should learn the can.',
    'IoU measures shared area divided by total covered area. SSD matches the best anchor for each object, then adds sufficiently overlapping anchors.',
    'An anchor can be a positive by best match even when it falls below the extra-match threshold.', [
    section(18, 21, 'Turn object annotations into anchor targets', [
      '[[20:Ground truth]] means the labels supplied for training. Each annotated object comes with a class ID and a box. The model has a different list, its predefined anchors. Matching joins those two lists so each positive anchor has a class and a box correction to learn.',
      'The [[21:background rule]] gives unmatched anchors class ID 0. There is no object box for them to regress. The next question is what “a good match” means.'
    ]),
    section(22, 22, 'Measure how much two boxes overlap', [
      '[[22:Intersection over Union]] (IoU) divides the area covered by both rectangles by the area covered by either. If you add both areas to find the union, subtract the shared part once because it was counted twice.',
      'Identical boxes have IoU 1. Boxes that just touch at an edge have zero overlap area and IoU 0. In the demo, move one 4-by-4 box and watch both the shared area and the union change.'
    ], {formulas:['iou'],lab:'overlap',figure:figure(22,[69,5,29,89],'Green shows the intersection and blue shows the union for the same pair.')}),
    section(23, 24, 'Give each object a match, then accept more good matches', [
      'Start with the [[23:best-overlap anchor]] for each labeled object, measured by IoU. Then give [[24:the remaining anchors a second chance]]. If an anchor’s overlap with a ground-truth box exceeds the given threshold, it can also learn that object.',
      'A positive anchor is assigned an object. A negative anchor learns background. Several anchors can learn the same object, so several can also predict that object at test time. That is one reason we’ll need to remove duplicate detections.'
    ], {check:['The best IoU for a can is 0.4 and the additional-match threshold is 0.5. Does the can still get a training match?', 'Yes. The best-match rule provides its first positive. The threshold governs the additional matches.']})
  ]),
  lesson('Train the class prediction and the box correction together',
    'An anchor can get the label right while putting its box in the wrong place. The training loss needs a way to measure each error.',
    'SSD classifies selected anchors and scores box corrections for positive anchors.',
    'A zero indicator turns off the box term for background. Keep the classification term for selected negatives.', [
    section(25, 26, 'Give the prediction two targets', [
      math`In [[25:the prediction slide]], $y_{\mathrm{cls}}$ is the correct label written as a list of numbers. Say our class order is background, soda can, bottle. An anchor matched to a soda can gets the target $(0,1,0)$. This is called one-hot because exactly one slot is 1. SSD predicts a score for each class and four numerical corrections, or offsets, for the box.`,
      math`The [[26:training target]] $y_{\mathrm{gt}}$ is calculated from the annotated object box and its assigned anchor. The slide groups the offsets in axis order: both $x$ offsets, then both $y$ offsets. Keep that order when comparing $y_{\mathrm{pred}}$ with $y_{\mathrm{gt}}$.`
    ]),
    section(27, 28, 'Ask the loss to score both errors', [
      math`The [[28:SSD loss]] uses cross-entropy to score the class prediction. The one-hot target tells us which probability to look up. For a soda can target $(0,1,0)$, read the second probability. If $u$ is the correct class and $p_u$ is the probability SSD gave it, the class loss is $-\log p_u$.`,
      math`Suppose SSD gives the correct label probability $1/2$. The loss is $-\log(1/2)=\log 2$. If it gives the correct label only $1/4$, the loss rises to $-\log(1/4)=2\log 2$. Giving the correct label probability 1 yields zero class loss. A separate box term measures how far the predicted offsets are from their targets.`,
      'A background anchor has a correct class but no correct object box. In the equation, the square-bracket condition equals 1 for a positive and 0 for background. The class term still needs background examples so the detector learns when to say “nothing here.”'
    ], {formulas:['ssdLoss'],
      check:['The label is background and the model predicted a large offset. Does that offset directly add to the SSD box loss?', 'The localization term is gated off for background. The classification term can still penalize an incorrect object prediction.']})
  ]),
  lesson('Express box changes relative to size and use Smooth L1',
    'Imagine SSD’s starting rectangle is too wide and sits a little to the left of the can. During training we have the labeled rectangle around the can. We can use it to write the correct instructions for moving and resizing the starting box, then score how closely SSD predicted those instructions.',
    'Once an anchor is matched to an object, use the labeled box to figure out the correct adjustment. Write that adjustment as four numbers: move right or left, move down or up, change the width, and change the height. The detector predicts its own four numbers. Smooth L1 scores how far each prediction is from the correct adjustment.',
    'During training, the labeled box gives you the target offsets. During inference, the model’s predicted offsets tell you how to move and resize the anchor to recover a box.', [
    section(29, 30, 'Turn two boxes into four instructions', [
      math`The anchor is the preset rectangle ($a$). The object box is the rectangle drawn around the can by the annotator ($b$). Each box has a center $(c_x,c_y)$, a width $w$, and a height $h$. In the diagram, $c_x$ counts pixels to the right from the image origin and $c_y$ counts pixels down. The dot sits halfway between the edges in each direction.`,
      math`[[29:Slide 29]] asks four questions about the object box relative to the anchor. How far right or left should the center move? How far down or up? How much wider or narrower should the box be? How much taller or shorter? The four answers together are the training target $y_{\mathrm{gt}}$.`,
      math`For the first two answers, measure movement in anchor widths and heights. In the diagram, the center moves 4 pixels right. That is half the width of this 8-pixel anchor. The same 4 pixels would be a full anchor width for a 4-pixel anchor. Dividing by the anchor size captures that difference.`,
      math`For the last two answers, divide the object size by the anchor size along that dimension, then take the log. An unchanged size gives ratio 1 and $\log 1=0$. Doubling and halving give $\log 2$ and $-\log 2$. That gives opposite signs for opposite changes and makes zero mean “keep the same size.”`,
      math`[[30:Slide 30]] adds an optional change of units. Divide each of the four instructions by its own constant. For the horizontal shift, $\sigma_x=0.1$ makes a shift of one tenth of the anchor width count as 1. The diagram’s shift is half an anchor width, so that same move is $0.5/0.1=5$ in the scaled units.`,
      math`To recover a box from SSD’s predictions, undo the operations in reverse. If extra scaling was used, multiply each number by its $\sigma$ first. Multiply a center shift by the anchor dimension to get pixels, then add it to the anchor center. For a size change, undo the log with an exponential to get the size ratio, then multiply by the anchor dimension.`
    ], {formulas:['encode','scale'],lab:'box-offsets',labBeforeFormulas:true,
      check:['The object is twice as wide as the anchor and has the same center and height. What are the four instructions before extra scaling?', 'Only the width instruction is nonzero. It is log 2. Both center shifts and the height instruction are zero.']}),
    section(31, 31, 'Score the gap between the predicted and correct instructions', [
      math`The diagram’s correct horizontal instruction is $1/2$ before extra scaling. Suppose SSD predicts $0$, which means “leave the center where it is.” The prediction error is $u=0-1/2=-1/2$. The minus sign tells us SSD fell short of the required rightward shift. The size of the mistake is $|u|=1/2$.`,
      math`[[31:Smooth L1]] turns that error into a penalty. Start with the simple case $\sigma=1$ for the loss. This setting controls where the two pieces of the curve meet. For $|u|<1$, square the error and divide by 2. For $|u|\ge 1$, use the error magnitude minus $1/2$. At zero error, the loss is zero.`,
      math`Why call it smooth? At $u=1$, the quadratic and linear pieces both give $1/2$, and their slopes both equal $1$. At $u=-1$, both pieces again give $1/2$ and their slopes both equal $-1$. The height and slope agree at each join.`,
      'The curve is nearly flat close to zero, so a tiny remaining error gives a small push during training. For big errors the graph becomes a straight line, so an unusually bad prediction cannot make that push grow without bound. Apply the rule to each of the four offset errors and add the penalties for the matched box.'
    ], {formulas:['smooth'],figure:figure(31,[21,45,41,52],'Follow the dashed orange curve for σ = 1. The horizontal axis shows the error, and the vertical axis shows the penalty. The curve is rounded between −1 and 1 and straight beyond those points.'),
      check:['SSD predicts the exact horizontal instruction for this can. What is the horizontal error and what does it add to the box loss?', 'The error is zero, so it contributes zero. The other three instructions are scored separately.']})
  ]),
  lesson('Follow an image through SSD and YOLO',
    'Imagine a photo with a soda can close to the camera and another far away. How does a detector turn that photo into two “soda can” labels, each with its own rectangle? An architecture is the arrangement of the parts that do that job. Follow the arrows to see what each part receives and what it passes on.',
    'The backbone extracts clues, feature maps organize the clues by location, and prediction heads turn them into boxes and scores. The detector collects those predictions and filters repeated boxes.',
    'Read the arrows as photo → grids of clues → candidate boxes and scores → final detections. SSD and the YOLO examples in the deck both predict directly from feature maps.', [
    section(32, 34, 'SSD uses several grids to look for cans of different sizes', [
      'Start with the photo at the bottom of the [[32:SSD diagram]]. The backbone reads it and produces a feature map, a grid of measurements the model learned to make. A cell might carry clues about edges or shapes in a patch of the photo. The grids drawn over the can on the right show where the feature cells line up with the photo.',
      'Follow the branches on the right. One grid is fine, with many closely spaced locations, giving a small distant can more places where a prediction can start. Another grid is coarse, with fewer locations and larger anchor templates for bigger objects. SSD looks for both cans using feature maps from the same pass through the network.',
      'At each grid location, SSD has preset starting rectangles called anchors. A prediction head is the part that reads the clues at that location and makes predictions. On the slide, the class branch scores labels such as “soda can” or “background.” The offset branch predicts how to shift and resize each anchor, using the box adjustments from the previous lesson.',
      'The [[33:Keras slide]] points to code for building and training the detector. The [[34:SSD flowchart]] shows what happens after the heads make their predictions. All the candidate boxes go into one list. Two nearby anchors might both find the same can, so non-maximum suppression (NMS) filters likely duplicates. The next lesson walks through how it chooses which boxes to keep.'
    ], {figure:figure(32,[16,20,62,79],'Start at the photo at the bottom. Follow the arrows up and right to compare the dense grid below with the sparse grid above. Each has a class branch and a box-offset branch.')}),
    section(35, 37, 'YOLO follows the same path from photo to detections', [
      'YOLO stands for You Only Look Once. In the [[35:YOLO flowchart]], one pass through the network produces candidate detections across the feature grids. The center tells you where to place a rectangle, width and height tell you how big to draw it, confidence gives a score for the candidate, and class probabilities help name the object. The slide’s final steps collect the candidates and use NMS to filter repeated boxes.',
      'Both SSD and the YOLO examples here predict from feature maps and can use grids at several resolutions. SSD’s diagram emphasizes the class score and box adjustments for each anchor. The YOLO slide lists the information in each candidate box. The exact way YOLO produces those numbers depends on the version.',
      '[[36:Darknet-53 and CSPDarknet]] are designs for the clue-making part. On the left, Darknet-53 repeats blocks that refine the clues and uses downsampling to make the grid smaller. A residual block lets earlier clues pass along a shortcut while the block learns what to add to them. On the right, CSPDarknet splits the incoming clues into two groups, sends one through extra blocks, then joins the two groups again. The diagram calls that join “concatenate,” meaning put the two groups side by side.',
      'The [[37:annotation tool]] is where people draw the correct boxes and give them labels. Those labels teach the prediction heads what answers to produce for training photos. On a new photo, the network uses what it learned to make its own predictions.'
    ], {figure:figure(35,[6,9,68,82],'Read down from the input image. The middle lists what comes out of a prediction, and the bottom shows how the candidates become final detections.'),
      check:['Two SSD anchors both predict a box around the same can. Which part predicts the boxes, and which later step filters the duplicate?', 'The prediction heads give the class scores and box offsets. NMS filters repeated detections after the candidates are collected.']})
  ]),
  lesson('Remove duplicate detections with NMS',
    'Suppose two anchors both fire on the same can. Reporting two cans would be misleading, even though each box looks reasonable by itself.',
    'Several anchors can predict the same can, so one object can leave multiple boxes after decoding. Non-maximum suppression (NMS) filters those predictions before reporting them. For each class, keep the highest-scoring remaining box, compare it with the other boxes using IoU, and suppress the ones that overlap it enough. Repeat with the highest-scoring box still in play.',
    math`For example, if two can predictions have scores $0.9$ and $0.8$ and overlap at IoU $3/4$, hard NMS with a cutoff of $1/2$ keeps the $0.9$ box and removes the $0.8$ box. Two real cans can also overlap. Soft-NMS lowers the second box’s score and re-ranks the remaining boxes, so a nearby object can still be reported if its score stays high enough.`, [
    section(38, 39, 'Keep the best-scoring box and test the others for duplication', [
      'In [[38:the overlapping predictions]], several boxes may surround the same object. Non-maximum suppression (NMS) starts with the highest-confidence remaining box for a class. It keeps that box and removes remaining boxes of that class whose IoU with it reaches the threshold in the deck’s pseudocode.',
      'Then repeat from the best box still available. In [[39:the can example]], the score 0.99 wins. High overlap is a useful clue for duplication, but two nearby real objects of the same class can overlap too.'
    ], {figure:figure(39,[42,23,57,75],'Compare the two confidence labels above the same can.')}),
    section(40, 41, 'Lower the score when deletion may be too harsh', [
      '[[40:Soft-NMS]] keeps a lower-scoring box in play with a reduced score. A higher IoU produces a larger reduction. Re-rank after changing the scores, since the next-best box may now be somewhere else.',
      'The [[41:pseudocode]] shows the Gaussian rule. A later score filter can still remove a low-scoring box. This gives close real objects a chance to survive if their evidence remains strong.'
    ], {formulas:['softNms'],lab:'nms',
      check:['If the two predictions have IoU zero, how much does Gaussian Soft-NMS lower the second score?', 'It leaves the score unchanged. The exponential factor is 1 when the overlap is zero.']})
  ]),
  lesson('Separate box fit, false alarms, and missed objects',
    'One detector puts tight boxes around only half the cans. Another finds every can but also reports cans that aren’t there. A single overlap score won’t tell you which mistake each detector made.',
    'Mean best IoU measures overlap. Precision asks how many reported detections are correct. Recall asks how many real objects were found.',
    'For detection precision and recall, match predictions to ground truth by class and IoU, at most once per object.', [
    section(42, 43, 'Give each metric its own denominator', [
      'The [[42:mean IoU slide]] takes the best overlap for each ground-truth box and averages those overlaps. The expression can reuse a prediction for different objects. This simplified check measures box fit. Use precision to count extra detections.',
      'For [[43:precision and recall]], a true positive (TP) is a prediction matched to an as-yet-unmatched object of the right class with enough overlap. A false positive (FP) is a reported detection that fails the match, including a duplicate. A false negative (FN) is an annotated object left unmatched. Process detections in descending score when evaluating a ranked list.'
    ], {formulas:['meanIou','precision']}),
    section(44, 46, 'Read a result table by the mistake you care about', [
      'Compare the sample predictions for [[44:raw offsets]] and [[45:normalized offsets]], then look at [[46:the table]]. In this experiment, the normalized-offset column reports higher average precision than the raw-offset column, while its mean IoU is lower.',
      'Precision, recall, and mean IoU answer different questions. To claim an architectural change caused a gain, check whether the other settings and the evaluation protocol match.'
    ], {figure:figure(46,[2,6,94,74],'Compare the mIoU and average-precision rows across the same two columns.'),
      check:['Can adding a false alarm change precision without changing recall?', 'Yes. It raises the number of reported predictions while the numbers of found and missed objects stay the same.']})
  ]),
  lesson('Read AP and mAP across confidence thresholds',
    'Imagine two versions of SSD taking the same test. VOC stands for Visual Object Classes. PASCAL VOC 2007 is the object-detection benchmark on [[47:slide 47]]. It gives both detectors the same test photos, labeled object boxes, and scoring rules so their results can be compared.',
    'AP summarizes the precision–recall curve for a class under a specified protocol. mAP averages across classes, and in COCO also across IoU thresholds.',
    'A score threshold decides which predictions to report. An evaluation IoU threshold decides which reported boxes qualify as matches.', [
    section(47, 48, 'Start with the VOC test, then see how it scores the boxes', [
      'The [[47:VOC 2007 results]] show mean average precision (mAP) of 68.0 for SSD 300 and 71.6 for SSD 512. The numbers 300 and 512 are the input image widths and heights. Both results use the same benchmark. To read those scores, start by scoring predictions for one object class.',
      math`Suppose we are checking bottle detections. VOC 2007 requires a predicted bottle box to overlap a labeled bottle box with IoU of at least $0.5$ to count as a match. Each labeled bottle can be matched only once. This overlap rule is separate from the confidence cutoff, which decides how far down the ranked list of predictions we look.`,
      math`Say the test photo has two labeled bottles. The highest-scoring prediction finds one, the second is a false alarm, and the third finds the other bottle. Keep only the top box and precision is $1/1$ (one correct out of one reported) while recall is $1/2$ (one found out of two labeled). Keep all three and precision is $2/3$ while recall is $2/2$.`,
      math`Average precision (AP) summarizes the tradeoff for that class. In the [[48:VOC 2007 calculation]], check 11 recall levels from $0$ to $1$. At each level, use the best precision achieved at that recall or higher, or zero if the detector never reaches that recall. Average those 11 values to get AP, then average the class APs across VOC’s 20 classes to get mAP.`,
      math`COCO (Common Objects in Context) is another benchmark. Slide 48’s COCO score averages across 80 object classes and ten IoU thresholds from $0.50$ to $0.95$. At $0.95$, a prediction needs to fit the labeled box much more tightly than at $0.50$.`
    ], {formulas:['ap'],lab:'voc-ap',
      check:['Can you compare VOC 2007 mAP at IoU 0.5 directly with COCO AP as if they were the same score?', 'The datasets, classes, and evaluation protocols differ. The COCO average also includes stricter localization thresholds.']}),
    section(49, 50, 'Use output pictures to diagnose what a score hides', [
      'The [[49:bottle demo]] shows the detector applied to one scene. The [[50:COCO montage]] shows many scenes. Pick a picture and ask separately whether the labels are right, whether boxes fit, and whether some visible instances lack a box.',
      'Use the benchmark to estimate how often the successes you see in examples occur across the test set.'
    ], {figure:figure(50,[47,0,52,98],'Choose one photo and look for a tight box, a possible duplicate, or an object the detector might have missed.')})
  ]),
  lesson('Fast R-CNN shares the image features across proposals',
    'Imagine cropping a thousand overlapping rectangles and running the same network on each one. Most of that work repeats. Fast R-CNN computes the image features once.',
    'Fast R-CNN runs one backbone on the whole image and reuses its features for externally generated regions of interest.',
    'Fast R-CNN’s joint training loss and its proposal-then-detect inference pipeline describe different things.', [
    section(51, 53, 'Find the repeated work in classic R-CNN', [
      'A proposal is a rectangle worth investigating. Classic [[52:R-CNN]] generated proposals with Selective Search, ran the feature extractor on each crop, classified the result with a support vector machine (SVM), and refined the box separately. Many proposals shared the same image pixels.',
      '[[53:Fast R-CNN]] still gets precomputed proposals, also called regions of interest (RoIs). It projects them onto a feature map computed for the whole image.'
    ]),
    section(54, 54, 'Share the backbone and learn the two outputs together', [
      'In [[54:the Fast R-CNN architecture]], each proposed region gets its own extracted feature vector from the shared map. Two output heads learn together to classify the region and refine the box. The shared feature extractor can be updated during detector training.',
      'This removes repeated CNN computation and intermediate feature caching. The external proposal generator remains, so there is still a first step that finds candidate regions.'
    ], {figure:figure(54,[41,17,57,44],'Follow the whole image into the convolutional layers, then follow a single RoI into the two heads.'),
      check:['Which part of the older pipeline does Fast R-CNN still need?', 'It still needs candidate regions from an external proposal method such as Selective Search.']})
  ]),
  lesson('Turn variable-sized proposals into fixed-size inputs',
    'A proposal around a dog could cover many feature cells. One around a tennis ball could cover very few. How can the same classifier read both?',
    'RoI pooling divides the projected region into a fixed grid of bins and max-pools each bin in each channel.',
    'RoI pooling changes the size of the extracted features. The detector’s box head separately changes the predicted box.', [
    section(55, 56, 'Pool each region into the same grid shape', [
      math`The [[55:RoI pooling diagram]] shows a projected region of height $h$ and width $w$ on the feature map. [[56:Divide that region]] into $H$ rows and $W$ columns of bins. Within each bin, max pooling keeps the strongest feature response per channel. A $7\times7$ output always has 49 entries per channel even if the regions started at different sizes.`,
      'For a hand calculation, use dimensions that divide evenly. Real pooling must quantize the projected bin boundaries to a discrete grid.'
    ], {formulas:['roi'],figure:figure(56,[7,22,90,63],'Follow the box through the backbone to the pooled grid. The output grid size is fixed.')}),
    section(57, 58, 'Read the class scores and class-specific corrections', [
      math`The [[57:two heads]] read the pooled features from the RoI. With $K$ foreground classes, the classifier gives $K+1$ scores including background. The original Fast R-CNN regression head gives $4K$ values, four offsets for each foreground class. The [[58:VGG setup]] replaces the final pooling and classifier of the original classification network with these detector components.`
    ], {check:['With three foreground classes, how many class scores and box values does this head produce per RoI?', 'Four class scores and 12 box values. Background has a classification score but no class-specific box regression target.']})
  ]),
  lesson('Train Fast R-CNN on proposals from Selective Search',
    'RoI pooling can read any proposed rectangle. We still need a way to generate candidate rectangles and label them for training.',
    'Selective Search merges similar image regions. Fast R-CNN labels its proposals by overlap and applies box loss only to foreground proposals.',
    'Fast R-CNN’s foreground/background RoI thresholds differ from the RPN’s anchor thresholds.', [
    section(59, 60, 'Label proposals and apply the two-part loss', [
      math`For each image, [[59:the training setup]] supplies RoIs plus the annotated classes and boxes. The [[60:IoU rule]] makes a proposal foreground if its best overlap is at least $0.5$. In the deck’s background sampling rule, proposals with best IoU in $[0.1,0.5)$ are eligible as background.`,
      math`The loss takes $-\log p_u$ for the true class $u$ and includes the offset term only for $u\ge1$. The logic is the same as SSD’s positive-only box training. The unit being classified here is a proposed region.`
    ], {formulas:['fastLoss']}),
    section(61, 63, 'Make proposals by merging similar neighboring regions', [
      '[[61:Selective Search]] starts by dividing the image into many small regions, called superpixels. It joins similar neighbors based on cues like color, texture, size, and shape. Boxes around regions at different stages of merging become proposals.',
      'The [[62:training setup]] starts with a VGG backbone pretrained on ImageNet and fine-tunes it for detection. Read the [[63:reported scores]] alongside their benchmark versions. The external grouping operation still takes time during inference.'
    ], {figure:figure(61,[51,25,46,43],'Look at the different region groupings to see why this algorithm produces proposals of several sizes.'),
      check:['Why can a box from Selective Search include background and still be useful?', 'A proposal just needs to bring a promising area to the detector. The classification and box heads can recognize and refine it.']})
  ]),
  lesson('Faster R-CNN learns where to look with an RPN',
    'Fast R-CNN made feature extraction cheaper, but still waits for Selective Search. Faster R-CNN learns to propose regions using the same image features.',
    'A Region Proposal Network predicts objectness and box adjustments. The second-stage Fast R-CNN head assigns the final classes and refines the proposals.',
    'The RPN uses two objectness scores per anchor, regardless of how many foreground categories the final head recognizes.', [
    section(64, 66, 'Replace the slow external proposal step', [
      'The [[65:timing comparison]] identifies external proposal generation as the bottleneck in the example. Faster R-CNN adds a Region Proposal Network (RPN), a small learned head for asking “might there be an object here?” Its [[66:shared feature map]] also feeds the region classifier.',
      'Follow the two stages: propose plausible boxes, then crop or pool each chosen region’s features to decide its class and refine its location.'
    ], {figure:figure(66,[50,2,47,85],'Trace the arrows from the shared map into the RPN and up into the detector.')}),
    section(67, 70, 'Count objectness scores and offsets at each location', [
      math`The [[67:sliding-window head]] reads a small neighborhood of feature cells. At each location, [[68:the RPN]] uses $k$ reference anchors with different sizes and aspect ratios. For every anchor it emits two scores (object and background) plus four offset values. A high objectness score can produce a proposal regardless of which object class will later win.`,
      'The [[69:RPN diagram]] separates the two output heads. In [[70:the pyramid of anchors]], multiple shapes and scales start from the same feature-map location.'
    ], {formulas:['rpnCount'],figure:figure(69,[13,24,73,72],'The same local feature feeds the classification and regression outputs for the anchors.'),
      check:['Would adding a new final category change the RPN’s two scores per anchor?', 'The RPN still predicts object versus background. The final classifier learns the additional category.']})
  ]),
  lesson('Choose RPN training anchors and share the backbone',
    'The RPN generates many anchors. Some clearly match objects, some are clearly background, and some fall between. Training needs a policy for all three.',
    'RPN training labels strong matches positive, weak matches negative, and leaves ambiguous anchors out. It samples a minibatch and trains proposal and detector heads on shared features.',
    'Slides 71–73 distinguish positive, negative, and ignored anchors. The best-match exception can make an anchor positive even below 0.7.', [
    section(71, 73, 'Keep positives and negatives, skip ambiguous anchors', [
      math`Under [[71:the RPN rules]], use the best-IoU anchor for every object and any anchor with IoU above $0.7$ for any object as positives. Remaining anchors below $0.3$ with every object are negatives. Others are ignored. For example, an anchor at $0.5$ is ignored unless the best-match rule applies.`,
      'The [[72:RPN loss]] classifies sampled positive and negative anchors and regresses only positives. It uses the same center-and-log-size idea as SSD, with separate normalizers for classification and regression. [[73:Sampling]] aims for roughly equal positives and negatives when enough positives exist, so easy background does not swamp the minibatch.'
    ], {formulas:['rpnLoss'],
      check:['An anchor has best IoU 0.45 and is not any object’s best anchor. What target does it get?', 'It is ignored under these rules, so it contributes to neither training loss term.']}),
    section(74, 78, 'Read the four training passes as a way to share features', [
      'In [[74:the original alternating recipe]], train an RPN, then train a detector using its proposals. Copy the detector’s shared convolutional weights to the RPN, freeze that shared part, and tune the RPN-specific layers. Finally, use its updated proposals and tune the detector-specific layers with the same shared weights frozen.',
      'The [[75:four-step diagram]] makes the handoff visible. [[76:The setup]] lists anchor sizes, ratios, stride and the exclusion of boundary-crossing anchors during training. [[77:Benchmark values]] and [[78:sample outputs]] describe the resulting detector under particular settings.'
    ], {figure:figure(75,[5,22,92,75],'Read the columns from left to right and watch which parts are shared by the last stage.')})
  ]),
  lesson('Build a feature pyramid that combines detail with meaning',
    'A fine grid helps place a tiny object, but shallow features can have weak evidence about what it is. A coarse grid has deeper features but fewer positions. FPN combines the two.',
    'FPN upsamples coarse, semantically stronger features and adds them to finer backbone maps through lateral connections.',
    'Changing anchor size on one feature map and changing the feature-map resolution address different parts of the scale problem.', [
    section(79, 82, 'Separate anchor size from feature-map resolution', [
      'The [[80:scale comparison]] points out that classic Faster R-CNN can use different anchor sizes on one map. This changes reference rectangles while the head reads the same spatial resolution. SSD reads several maps to make predictions at different resolutions. Feature Pyramid Network (FPN, written PFN on some slides) adds top-down feature fusion.',
      'In [[81:the pyramid alternatives]], compare running a backbone at several image sizes, reading one layer, reading several independent layers, and merging features across levels. [[82:The top-down comparison]] shows FPN making predictions at multiple merged resolutions.'
    ], {figure:figure(81,[40,4,58,62],'Compare the arrows and prediction points. Follow the connections that bring information across scales.')}),
    section(83, 85, 'Bring deeper information back to a finer grid', [
      math`The [[83:bottom-up backbone]] produces progressively coarser maps $C_2, C_3, C_4, C_5$. Deeper maps have seen larger input regions and can carry stronger evidence about object identity. The [[84:top-down pathway]] upsamples a coarse map so its spatial size matches the finer level.`,
      math`A [[85:lateral connection]] uses a $1\times1$ convolution to put the backbone map into the same number of channels. Add it to the upsampled map, then use the resulting pyramid feature for prediction. The lateral map provides the finer spatial evidence that upsampling alone cannot recover.`
    ], {formulas:['fpn'],figure:figure(84,[20,16,78,72],'Start at C₅, follow a top-down arrow, then see where the same-scale backbone map joins it.'),
      check:['What does the lateral connection add for small objects?', 'Upsampling creates more grid locations from the same coarse features. The lateral input brings the finer information from the backbone.']})
  ]),
  lesson('Use FPN for proposals and for RoI pooling',
    'FPN gives the detector a stack of feature maps. Now decide which levels generate proposals and which level should provide features for each proposed box.',
    'The RPN assigns anchor scales to pyramid levels. The RoI head chooses a feature level from the proposal’s size.',
    'The two assignments use different inputs: a preset anchor size for RPN and a measured RoI size for the region classifier.', [
    section(86, 86, 'Spread RPN anchor sizes across feature levels', [
      math`The [[86:RPN pyramid]] puts small anchors on fine maps and large anchors on coarse maps. The deck shows five scales from $32^2$ to $512^2$ and three aspect ratios per scale. The 15 scale/ratio combinations are spread across the levels and repeated over the locations on their respective maps.`,
      'The RPN still uses overlap to match anchors to objects. FPN changes which feature map an anchor reads.'
    ], {figure:figure(86,[40,12,51,74],'Follow the small anchors toward the finer maps and the large anchors toward the coarser maps.')}),
    section(87, 89, 'Send each proposed box to a sensible resolution', [
      math`For the RoI head, [[87:the routing equation]] measures proposal size by $\sqrt{wh}$. A proposal with that scale equal to 224 routes to $P_4$. Halving its scale routes one level finer. The original FPN paper specifies base 2 and floors the index, then RoIs use the available detector levels $P_2$ through $P_5$. $P_6$ in the paper is used by the RPN.`,
      'Use [[88:the benchmark table]] and [[89:the baseline comparisons]] to look for controlled comparisons. A row that also changes the backbone cannot isolate the gain from the pyramid alone.'
    ], {formulas:['roiLevel'],check:['What happens to the RoI’s level when both width and height double, provided we are inside the available levels?', 'Its size √(wh) doubles. The base-2 log increases by 1, so it goes one level coarser.']})
  ]),
  lesson('Use focal loss when easy negatives overwhelm the signal',
    'Imagine one can and a thousand obvious background regions. Each correct background decision makes a small loss, but together they can drown out the few examples the model still needs to learn.',
    'Focal loss multiplies cross-entropy by a factor that shrinks as the probability of the true label rises.',
    'Use the probability of the true label, including for background. Class weighting and difficulty weighting are separate.', [
    section(90, 94, 'See why many tiny losses can matter', [
      '[[91:Foreground and background imbalance]] means positives are rare among dense anchors. A hard example is one the model currently assigns low probability to its true label. A negative can be hard too, such as a water bottle that resembles a soda can.',
      '[[92:Sampling and hard negative mining]] decide which examples enter training. Sampling caps the number of background examples. In SSD, hard negative mining sorts background anchors by their current classification loss and keeps the hardest, up to a fixed ratio to the positives. [[93:SSD’s dense anchors]] show why this matters. [[94:Focal loss]] changes how much each example contributes, reducing the weight of examples the model already handles confidently.'
    ]),
    section(95, 96, 'Start with the probability assigned to the correct answer', [
      math`On [[95:the cross-entropy slide]], $p$ is the probability of foreground. If the actual label is foreground, the model assigns probability $p$ to the correct answer. If the actual label is background, it assigns $1-p$. Call that true-label probability $p_t$ in either case.`,
      math`The loss $-\log p_t$ is close to zero when $p_t$ is close to one. [[96:The loss curves]] show why this still matters for dense prediction: add enough small terms and the sum can outweigh the losses from hard objects.`
    ], {formulas:['ce']}),
    section(97, 98, 'Tell apart class balance and example difficulty', [
      math`[[97:Class weighting]] multiplies by $\alpha_t$, which is shared by examples of the same true class. The RetinaNet paper writes $\alpha_t=\alpha$ for foreground and $1-\alpha$ for background. Slide 97 prints 1 for foreground, so check which convention an exam question specifies.`,
      math`[[98:Focal loss]] adds $(1-p_t)^\gamma$. With $\gamma=2$, a correct prediction at $p_t=0.9$ retains $1/100$ of its cross-entropy before class weighting. At $p_t=0.5$ it retains $1/4$. The easier example is downweighted more, even if both belong to the same class.`
    ], {formulas:['focal'],figure:figure(98,[50,6,46,49],'Read the curves near the right side. The loss falls faster as the model becomes confident about the correct answer.'),
      check:['For a background example with foreground probability 0.1, which value goes into the focal factor?', 'Use 0.9. That is the probability assigned to its true class, background.']})
  ]),
  lesson('Assemble RetinaNet from an FPN and dense heads',
    'Focal loss changes the training signal. RetinaNet puts that change into a single-stage detector with feature maps at several resolutions.',
    'RetinaNet shares classification and box heads across feature levels. A small initial foreground probability reduces early background loss.',
    'The prior probability sets the starting bias. Focal loss changes the contribution of examples throughout training.', [
    section(99, 100, 'Predict on each level, with a conservative starting score', [
      math`The [[99:RetinaNet diagram]] takes pyramid levels $P_3$ through $P_7$. At each location, the classification head makes $K$ foreground-class predictions for each of $A$ anchors, using independent sigmoid scores. The regression head makes four box corrections per anchor.`,
      math`At initialization, [[100:the bias choice]] makes a sigmoid output close to $\pi=0.01$ when its other inputs are near zero. A sigmoid converts a raw score to a probability between zero and one. Starting low avoids treating huge numbers of background anchors as likely objects before learning begins.`
    ], {formulas:['prior'],figure:figure(99,[1,14,97,52],'Trace the backbone into the pyramid, then compare the classification and regression subnets at the right.')}),
    section(101, 102, 'Read speed and accuracy as a tradeoff', [
      '[[101:The reported AP and speed]] belong to a particular configuration. In [[102:the performance plot]], a point farther up scores higher in AP. A point farther right takes longer per image. Compare points under the same benchmark and timing setup before drawing a conclusion.'
    ], {figure:figure(102,[51,0,47,60],'Read the vertical axis for AP and the horizontal axis for time per image.'),
      check:['Does the initial foreground probability keep a trained model from ever predicting a confident object?', 'It sets the starting bias. Training can change that bias and the feature-dependent scores.']})
  ]),
  lesson('FSAF lets a feature-map point predict a box without an anchor',
    'Two cars with similar box sizes could be easier to detect on different feature maps. Feature Selective Anchor-Free (FSAF) asks which level actually predicts each car best.',
    'FSAF adds anchor-free classification and box heads to a feature pyramid, alongside optional anchor-based heads.',
    'Anchor-free keeps the feature grid. It removes preset reference rectangles from that prediction branch.', [
    section(103, 105, 'Ask what the heuristic might be missing', [
      'The [[104:two-car example]] shows how a fixed rule can send similar-sized boxes to the same level even if their appearances differ. FSAF treats choosing a level as a training decision based on the object and the model’s current predictions.',
      'In [[105:the FSAF layout]], every pyramid level offers an anchor-free path. “Anchor-free” means a grid location is the reference. The head predicts the distances from that point to a box’s sides.'
    ], {figure:figure(104,[57,18,41,66],'Follow both car examples to the fixed scale assignment, then ask what a loss-based choice could change.')}),
    section(106, 107, 'Read the two outputs at a grid point', [
      'In [[106:RetinaNet plus FSAF]], the original anchor-based branch can run alongside the point-based branch. [[107:The output maps]] show a classification stack and four offset maps. Each grid point can score the foreground classes and predict one set of box-side distances.'
    ], {check:['Does anchor-free mean the detector no longer uses a feature pyramid?', 'FSAF predicts on the same pyramid grid. Each grid point serves as the reference for the box distances.']})
  ]),
  lesson('Teach FSAF which points to use and how to decode their boxes',
    'After removing anchors, a feature point still needs a training label and a box target. FSAF gives the center of a projected object box the job of predicting it.',
    'Project a box onto a pyramid level. Its central effective region supplies positives. Predict top, left, bottom and right distances, then convert back to image coordinates.',
    'Keep row and column order straight when decoding. Multiply by both the normalization constant and the level’s stride at the appropriate step.', [
    section(108, 109, 'Give the center a target and leave an uncertain band around it', [
      math`[[108:Project the box]] onto level $P_l$ by dividing its image center and dimensions by $2^l$. Keep the same projected center and shrink the width and height by $\epsilon_e$ to obtain the effective box. Enlarge that region to the size defined by $\epsilon_i$ to get the ignoring box. A point in the effective region learns the object class. When effective boxes overlap, the smaller object takes priority.`,
      'In [[109:the supervision figure]], the gray band around the effective area is ignored. For classification, the FSAF paper treats the black area outside the ignoring region as negative; the slide’s black-area caption is best read with that distinction in mind. Neighboring levels can also receive ignore regions for the same object.'
    ], {formulas:['projection'],figure:figure(109,[56,20,42,54],'Find the white effective region and the gray band around it. Only the center is assigned the object as a positive target.')}),
    section(110, 112, 'Predict four distances and compare the whole box', [
      math`At an effective point, the [[110:offset map targets]] give distances in top, left, bottom, right order, divided by $S=4$. To [[112:decode a prediction]], undo that division, subtract top and left from the point coordinates, and add bottom and right. Multiply by $2^l$ to return to the image scale.`,
      math`[[111:UnitBox IoU loss]] scores the four boundaries together by measuring the overlap of the resulting boxes. It uses $-\ln(\mathrm{IoU})$ for positive overlap. Better overlap means smaller loss, with zero at a perfect fit.`
    ], {formulas:['fsafOffsets','iouLoss'],figure:figure(110,[40,71,16,28],'The yellow box shows the distances from one point to each side.'),
      check:['A predicted top distance is 1 after normalization with S = 4. How far up is the top edge in feature-map units?', 'Four feature-map units. Multiply by the level’s stride as well to express that distance in image pixels.']})
  ]),
  lesson('Let FSAF choose the lowest-loss feature level',
    'Suppose the same annotated car can be supervised at two levels. One gives it a better class score, while the other draws a much better box. FSAF compares both errors together.',
    'During training, choose the pyramid level with the lowest mean focal plus IoU loss for each instance. At inference, decode high-scoring candidates and apply NMS.',
    'Feature selection during training uses ground truth. Inference has no ground truth, so it ranks predictions by their scores.', [
    section(113, 114, 'Compare the losses for the same object at different levels', [
      '[[113:Online feature selection]] in FSAF evaluates the current classification and box predictions for one object across levels. The [[114:loss calculation]] averages each loss over that level’s effective region so a region with more feature points does not automatically count more.',
      'Select the level whose two averages add to the smallest number. That level supplies positive supervision for this object. This differs from FPN’s RoI size rule, which routes boxes based on width and height.'
    ], {formulas:['fsafLevel'],figure:figure(113,[1,22,97,50],'Follow the instance through each level, then find where the loss comparison chooses one level.'),
      check:['If P₃ has lower classification loss but much higher regression loss than P₄, can P₄ win?', 'Yes. FSAF chooses the smaller sum of the two losses.']}),
    section(115, 118, 'Combine the two branches at inference', [
      'In [[115:joint training]], the detector combines the RetinaNet loss with a weighted FSAF loss. At inference, FSAF decodes high-scoring locations at each level, combines those boxes with RetinaNet’s predictions, then applies NMS to filter duplicates.',
      '[[116:The reported results]] and [[117:the full table]] use particular backbones. In [[118:the example comparison]], compare the same image with and without the added branch to see what type of object it helped find.'
    ], {figure:figure(118,[0,22,99,61],'Read each image pair vertically and identify a detection that changes with FSAF.')})
  ]),
  lesson('FCOS predicts distances from a point inside the object',
    'Draw a dot inside a rectangle. If you know how far it is from all four sides, you can reconstruct the entire box. FCOS uses that idea at feature-map locations.',
    'FCOS projects a feature-grid point back to the image and learns its distances to the four sides of a ground-truth box.',
    'FCOS uses left, top, right, bottom order. FSAF presented top, left, bottom, right.', [
    section(119, 121, 'Use feature locations as box references', [
      '[[119:FCOS]] stands for Fully Convolutional One-Stage Object Detection. The [[120:motivation]] is to remove the need to choose large collections of anchor shapes and match them by IoU. In [[121:the example]], several feature points inside an object can learn to predict its box.'
    ], {figure:figure(121,[46,13,52,50],'Look for the locations inside the labeled boxes and where boxes overlap.')}),
    section(122, 125, 'Map the point back to the image and measure four distances', [
      math`The [[122:notation slide]] uses a feature map with height $H$ and width $W$. Its stride $s$ tells you how far apart its points are in image pixels. Under [[123:the deck’s projection]], feature coordinates $(x,y)$ become image coordinates $(x',y')$ with a half-stride shift to the center of the corresponding cell.`,
      math`In [[124:the training rule]], a point inside an eligible annotated box learns that class and its four side distances. Outside all eligible boxes it is background. If two eligible boxes contain it, the smaller one wins. In [[125:the distance diagram]], $l^*$ is the distance to the left edge and $t^*$ the distance to the top. The other two distances are $r^*$ and $b^*$.`
    ], {formulas:['backproject','fcosOffsets'],figure:figure(125,[53,12,39,78],'Start at the red point and follow each dashed segment to the side it measures.'),
      check:['Do the left and right distances need to be equal for a point to be a positive sample?', 'A point can sit off-center and still have a valid box target as long as it lies inside an eligible object box.']})
  ]),
  lesson('Assign FCOS targets by scale and rank boxes with centerness',
    'A point near the edge can still be a valid training location. Its box estimate may be less reliable than one from near the center. FCOS addresses both scale and ranking.',
    'FCOS restricts regression ranges by level. It predicts centerness to lower the scores of boxes from off-center locations.',
    'For the original FCOS scale rule, compare the maximum of all four target distances with both range bounds.', [
    section(126, 128, 'Train the heads and make each level handle a size range', [
      'The [[126:FCOS heads]] produce foreground-class scores and four box distances. The exponential makes the predicted distances positive. [[127:The training loss]] uses focal loss for classes and IoU loss for boxes. Only foreground locations have a regression target.',
      math`The [[128:scale slide]] gives $P_3$ through $P_7$ different regression ranges. The original FCOS paper compares the maximum of the four distances against both limits. Slide 128 prints a minimum for the lower test. With the paper’s rule, distances $(20,30,80,10)$ are eligible for $P_4$ because their maximum is 80, in $[64,128]$.`
    ], {formulas:['fcosLoss','fcosRange']}),
    section(129, 132, 'Lower the score when a prediction comes from the edge', [
      '[[129:Centerness]] asks whether the left and right distances are balanced, and whether the top and bottom distances are balanced. The center scores 1. Near an edge, one ratio shrinks. The square root slows the drop so the score does not fall quite as quickly.',
      'A separate head learns to predict this score. At inference, the deck multiplies it by the class score before filtering and NMS. Try moving the point in the demo. The true box stays fixed while the score changes.',
      'In [[130:the results table]] and [[131:the sample outputs]], FCOS is still doing the same “what and where” task as SSD. Its starting reference is a point, FPN supplies the different resolutions, focal loss handles dense classification, and NMS still removes repeated predictions.'
    ], {formulas:['centerness'],lab:'centerness',
      check:['Two FCOS boxes have the same class probability. How can centerness change their order?', 'The one with higher predicted centerness gets a higher combined score, so it can be considered first by NMS.']})
  ])
];
