const math = String.raw;

export const referenceOverview = {
  title: 'Segmentation at a glance',
  intro: 'Start with the output you need. Semantic segmentation labels each pixel by category. Instance segmentation gives individual objects their own masks. Panoptic segmentation combines scene-wide labels with separate IDs for individual objects.',
  rows: [
    {name:'FCN and skip connections', slide:10, when:'Use to assign a category to every pixel and recover fine boundaries.', step:'Combine coarse class scores with finer spatial scores before the final upsampling.', mechanism:'FCN-16s adds pool4 scores. FCN-8s adds pool3 scores as well.'},
    {name:'PSPNet', slide:16, when:'Use when local appearance is ambiguous and wider scene context helps.', step:'Pool features over regions at several scales, then upsample and concatenate before classifying pixels.', equations:[math`\bar x_{R,c}=\frac1{|R|}\sum_{(i,j)\in R}x_{i,j,c}`]},
    {name:'Pixel cross-entropy', slide:11, when:'Use to penalize low probability for the annotated category at each pixel.', step:'Train on per-pixel class probabilities from softmax.', equations:[math`\mathcal L_{\mathrm{CE}}=-\frac1N\sum_i\log p_{i,y_i}`]},
    {name:'Semantic mean IoU', slide:22, when:'Use alongside pixel accuracy to see how well the model covers each class, including small ones.', step:'Evaluate predicted pixel labels against the annotated labels.', equations:[math`\mathrm{IoU}_c=\frac{\mathrm{TP}_c}{\mathrm{TP}_c+\mathrm{FP}_c+\mathrm{FN}_c}`], mechanism:'Average the per-class IoUs to get mIoU.'},
    {name:'Mask R-CNN', slide:29, when:'Use to get a separate pixel mask for each detected object.', step:'Align each region’s features and predict its class, box, and mask.', equations:[math`\mathcal L=\mathcal L_{\mathrm{cls}}+\mathcal L_{\mathrm{off}}+\mathcal L_{\mathrm{mask}}`]},
    {name:'Mask Scoring R-CNN', slide:46, when:'Use when high class confidence can coexist with a poorly shaped mask.', step:'Combine class confidence with estimated mask overlap when ranking predictions.', equations:[math`s_{\mathrm{mask}}=s_{\mathrm{cls}}s_{\mathrm{iou}}`]},
    {name:'YOLACT', slide:56, when:'Use as the deck’s example of fast instance segmentation with shared masks.', step:'Predict image-wide prototypes and combine them with coefficients for each detection.', equations:[math`M=\sigma(PC^T)`]},
    {name:'Hybrid Task Cascade', slide:83, when:'Compare how mask prediction can benefit from successively refined boxes.', step:'At each stage, refine the box before extracting features for its mask.', mechanism:'Later mask stages can also use earlier mask features.'},
    {name:'SAM 2', slide:95, when:'Use to specify an object with a prompt and follow its mask across frames.', step:'Read memory from earlier frames, predict the mask, and update memory.', mechanism:'Add prompts to correct the object mask when it drifts.'}
  ]
};

export const referenceEquationContext = {
  'Per-pixel softmax':'An FCN gives every pixel a list of class scores. Softmax converts that pixel’s scores to probabilities by normalizing across its classes.',
  'Pixel-wise categorical cross-entropy':'Once you have the probabilities, look up the one assigned to the annotated class at each pixel. Cross-entropy penalizes low probability for that class and averages the penalty across pixels.',
  'Average pooling within a pyramid bin':'A single pixel’s local features can be ambiguous. Average each feature channel within a region to give nearby pixels shared context. Different bin sizes provide different amounts of context.',
  'Pixel accuracy and semantic mean IoU':'After predicting pixel labels, accuracy counts all correct pixels together. Mean IoU first measures overlap class by class, then gives each evaluated class equal weight.',
  'RoIAlign interpolation at a fractional location':'A box edge can land between feature-map cells. RoIAlign samples at fractional locations by blending four neighbors, which avoids snapping the region to the grid before predicting a mask.',
  'Mask R-CNN multi-task loss':'Once the region features are aligned, the model learns what the object is, how to refine its box, and which pixels are inside it. The three losses train those outputs together.',
  'Binary cross-entropy for one mask channel':'The mask term supervises the channel for the annotated object class. Within that channel, each pixel is a foreground-or-background decision.',
  'Mask Intersection over Union (MaskIoU)':'After predicting a mask, compare the pixels it covers with the annotated mask. Their overlap tells you how well the shape fits that individual object.',
  'Mask Scoring R-CNN calibrated score':'At inference the true mask is unavailable. Use the model’s predicted MaskIoU to adjust the class confidence before ranking masks.',
  'YOLACT outputs per anchor':'YOLACT shares a bank of mask prototypes across the image. Each anchor needs class scores, four box offsets, and one coefficient per prototype to specify its own mask.',
  'YOLACT prototype mask assembly':'Use a detection’s coefficients to combine the shared prototypes at every pixel. Apply sigmoid to turn the resulting scores into mask probabilities.',
  'YOLACT area-normalized mask loss':'Once the mask has been assembled, train it against the annotated mask inside the ground-truth box. Average over that box’s area so larger boxes do not dominate solely because they contain more pixels.',
  'Fast NMS column maximum':'Before returning masks, remove duplicate detections. For each candidate, find its maximum box overlap with any higher-scoring candidate of the same class and compare it with the threshold.',
  'Cascade box encoding':'Each refinement stage starts with the previous stage’s box. Express how far that box must shift and resize to match the ground truth in the current stage’s units.',
  'Integral classification loss at several IoU thresholds':'One way to train for multiple quality levels is to add classification losses defined at several overlap thresholds. This gives supervision at each threshold.',
  'Sequential Cascade R-CNN box refinement':'Cascade R-CNN feeds each stage’s refined boxes to the next stage. The next stage can learn on the kinds of boxes it actually receives.',
  'Cascade R-CNN stage loss':'After passing boxes forward, train each stage using its own positive-match threshold. Later stages demand better overlap and regress offsets for their positive boxes.',
  'HTC interleaved execution':'Cascade box refinement gives you a better region at the current stage. HTC extracts mask features from that updated box before predicting the mask.',
  'HTC mask information flow':'A refined box improves where the mask looks. Passing features forward from the previous mask head also lets the next mask head build on its shape information.',
  'HTC semantic feature fusion':'A region may be ambiguous on its own. Pool semantic scene features from the same region and add them to the mask features to supply context.',
  'Hybrid Task Cascade multi-task loss':'The box and mask heads receive supervision at each stage. A separate semantic loss trains the scene branch whose features help those heads.',
  'Video region J, boundary F, and J&F':'Once the model predicts masks across frames, region J measures how much area they share with the annotations. Boundary F measures contour agreement. J&F averages the two.'
};
