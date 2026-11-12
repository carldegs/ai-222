const m = String.raw;
const equation = (slide, title, tex, purpose, read, symbols, example, insight) =>
  ({slide, formula:[title, tex, 'Source slide ' + slide + '.'], context:{purpose, read, symbols, example, insight}});

export const segmentationEquations = {
  softmax:equation(8,'Per-pixel softmax',m`p_{i,c}=\frac{e^{z_{i,c}}}{\sum_{j=1}^{K}e^{z_{i,j}}}`,
    'Convert the class scores illustrated on slide 8 into probabilities at a pixel.',
    'Exponentiate the score for class c and divide by the sum across all classes at this pixel.',
    [[m`$i,c$`,'Pixel index and class index.'],[m`$z_{i,c}$`,'Raw score, or logit.'],[m`$p_{i,c},K$`,'Class probability and number of classes.']],
    m`With four equal logits, each class has probability $1/4$ at that pixel.`,
    'Every location repeats the same calculation over its own class scores.'),
  pixelCE:equation(11,'Pixel-wise categorical cross-entropy',m`\mathcal L_{\mathrm{CE}}
    =-\frac1N\sum_{i=1}^{N}\log p_{i,y_i}`,
    'Measure how much probability the semantic model assigned to the annotated labels. This writes the per-pixel loss on the slide as a mean.',
    'Read the probability of the correct class at each pixel. Average its negative log.',
    [[m`$N$`,'Number of labeled pixels being scored.'],[m`$y_i$`,'Correct class of pixel i.'],[m`$p_{i,y_i}$`,'Probability of that correct class at pixel i.']],
    m`Correct-class probabilities $1/2$ and $1/4$ give mean loss $(\log 2+\log 4)/2=3\log 2/2$.`,
    'If the model gives a correct answer a lower probability, that pixel contributes a larger loss.'),
  pool:equation(16,'Average pooling within a pyramid bin',m`\bar x_{R,c}=\frac1{|R|}\sum_{(i,j)\in R}x_{i,j,c}`,
    'Work out what one branch of the PSPNet pyramid pooling module stores.',
    'Average the feature values within a bin separately for each channel.',
    [[m`$R,|R|$`,'One pooling bin and its number of positions.'],[m`$x_{i,j,c}$`,'Feature value in channel c at row i, column j.'],[m`$\bar x_{R,c}$`,'Mean feature value for this bin and channel.']],
    m`A bin with values $2,0,4,2$ in one channel stores $(2+0+4+2)/4=2$.`,
    'A one-bin grid produces a whole-image summary. Several bins keep separate summaries for different regions.'),
  semanticMetrics:equation(22,'Pixel accuracy and semantic mean IoU',m`\begin{aligned}
    \mathrm{Acc}&=\frac{\#\text{ correctly labeled pixels}}{\#\text{ evaluated pixels}}\\
    \mathrm{IoU}_c&=\frac{\mathrm{TP}_c}{\mathrm{TP}_c+\mathrm{FP}_c+\mathrm{FN}_c},
    \qquad \mathrm{mIoU}=\frac1K\sum_{c=1}^K\mathrm{IoU}_c
    \end{aligned}`,
    'Quantify overall label accuracy and class-by-class mask overlap. These formulas expand the metric names on slide 22.',
    'Count all correct labels for accuracy. For mIoU, first form the overlap ratio for each evaluated class, then average.',
    [[m`$\mathrm{TP}_c,\mathrm{FP}_c,\mathrm{FN}_c$`,'Correct class-c pixels, extra predictions of c, and missed class-c pixels.'],[m`$K$`,'Number of classes included under the evaluation convention.']],
    m`If 9 of 10 pixels are correctly labeled background and the only can pixel is missed, accuracy is $9/10$ but mIoU is $(9/10+0)/2=9/20$ when both classes count.`,
    'A large background region can dominate pixel accuracy. Class averaging gives the small class its own term.'),
  align:equation(26,'RoIAlign interpolation at a fractional location',m`\begin{aligned}
    v(a,b)&=(1-a)(1-b)v_{00}+a(1-b)v_{10}\\
          &\quad+(1-a)bv_{01}+abv_{11}
    \end{aligned}`,
    'Estimate the feature at a fractional sample point. This writes out the interpolation used by RoIAlign.',
    'Interpolate between the two neighbors on each row, then interpolate between the row results.',
    [[m`$a,b$`,'Fractional horizontal and vertical position within one grid square.'],[m`$v_{xy}$`,'Feature value at a corner, with x first and y second.']],
    m`With top-row values 0 and 4 and $a=1/4,b=0$, the result is $1$.`,
    'RoIAlign can use several interpolated sample points in a bin and aggregate them. The formula shows one sample.'),
  maskLoss:equation(29,'Mask R-CNN multi-task loss',m`\mathcal L=\mathcal L_{\mathrm{cls}}+\mathcal L_{\mathrm{off}}+\mathcal L_{\mathrm{mask}}`,
    'Train the region’s class, box correction, and instance mask together.',
    'Add the class loss, localization loss, and mask loss. Box and mask supervision apply to positive RoIs.',
    [[m`$\mathcal L_{\mathrm{cls}}$`,'Loss for the RoI class.'],[m`$\mathcal L_{\mathrm{off}}$`,'Loss for the predicted box correction.'],[m`$\mathcal L_{\mathrm{mask}}$`,'Mean per-pixel BCE for the ground-truth-class mask channel on a positive RoI.']],
    m`Losses $1/2$, $1/4$, and $1/4$ add to $1$.`,
    'The ground-truth class selects the mask during training. The predicted class selects it at inference.'),
  maskBCE:equation(29,'Binary cross-entropy for one mask channel',m`\mathcal L_{\mathrm{mask}}=-\frac1{m^2}\sum_{i=1}^{m^2}
    \left[y_i\log p_i+(1-y_i)\log(1-p_i)\right]`,
    'Train the positive RoI’s chosen mask channel to identify foreground pixels.',
    'Use the negative log of the foreground probability at an object pixel and of the background probability at another pixel.',
    [[m`$m$`,'Side length of the RoI mask grid.'],[m`$y_i$`,'Target for pixel i, 1 for the instance and 0 otherwise.'],[m`$p_i$`,'Sigmoid probability that pixel i belongs to the instance.']],
    m`At a background pixel with $p_i=1/4$, the loss is $-\log(3/4)$.`,
    'Each mask grid makes a binary membership prediction at each location.'),
  maskIoU:equation(44,'Mask Intersection over Union (MaskIoU)',m`\mathrm{MaskIoU}(M,\widehat M)=
    \frac{|M\cap\widehat M|}{|M|+|\widehat M|-|M\cap\widehat M|}`,
    'Measure overlap using pixels inside the masks.',
    'Divide the count of pixels in both masks by the count of pixels in either mask.',
    [[m`$M,\widehat M$`,'Ground-truth and predicted foreground pixel sets.'],[m`$|\cdot|$`,'Number of pixels in the set.']],
    m`Masks with 6 and 5 pixels and 4 shared have union $6+5-4=7$ and MaskIoU $4/7$.`,
    'The region score J in video segmentation uses the same foreground-pixel comparison.'),
  qualityScore:equation(47,'Mask Scoring R-CNN calibrated score',m`s_{\mathrm{mask}}=s_{\mathrm{cls}}\,s_{\mathrm{iou}}`,
    'Rank instances using recognition and estimated pixel overlap.',
    'Multiply the classification score by the MaskIoU predicted by the quality head.',
    [[m`$s_{\mathrm{cls}}$`,'Classification score for the detection.'],[m`$s_{\mathrm{iou}}$`,'Predicted overlap from the MaskIoU head.'],[m`$s_{\mathrm{mask}}$`,'Final mask confidence.']],
    m`A class score $3/4$ and predicted MaskIoU $2/3$ give $s_{\mathrm{mask}}=1/2$.`,
    'The head is supervised using measured MaskIoU during training. At inference it estimates the overlap without annotations.'),
  yolactCount:equation(55,'YOLACT outputs per anchor',m`D=c+4+k`,
    'Count the outputs of the three YOLACT prediction heads for one anchor.',
    'Add the class scores, four box offsets, and one coefficient for each prototype.',
    [[m`$c,k$`,'Number of class outputs and prototype maps.'],[m`$D$`,'Prediction values per anchor.']],
    m`With $c=3$ and $k=8$, there are $3+4+8=15$ values.`,
    'The prototype maps themselves are produced once per image.'),
  assembly:equation(56,'YOLACT prototype mask assembly',m`M=\sigma(PC^T),\qquad
    M_{ij}=\sigma\left(\sum_{r=1}^{k}P_{ir}C_{jr}\right)`,
    'Use one detection’s coefficient vector to build its foreground probabilities.',
    'At each pixel, multiply the prototype values by the instance’s weights, sum them, and apply sigmoid.',
    [[m`$P$`,'Prototype array, reshaped from h × w × k to one row per pixel.'],[m`$C$`,'One row of k coefficients per surviving detection.'],[m`$\sigma,M_{ij}$`,'Sigmoid and the probability at pixel i for detection j.']],
    m`Prototype values $(1,1)$ and weights $(1/2,-1/2)$ give logit $0$ and probability $1/2$.`,
    'The matrix operation assembles many instance masks from the same feature maps.'),
  yolactLoss:equation(57,'YOLACT area-normalized mask loss',m`\mathcal L_{\mathrm{mask}}
    =\frac{\sum_{i\in B_{\mathrm{gt}}}\mathrm{BCE}(M_i,M_{\mathrm{gt},i})}{|B_{\mathrm{gt}}|}`,
    'Scale the total mask error by the size of the supervised crop.',
    'Sum pixel losses inside the ground-truth box and divide by the box area.',
    [[m`$B_{\mathrm{gt}},|B_{\mathrm{gt}}|$`,'Ground-truth bounding box and its area in the mask grid.'],[m`$M_i,M_{\mathrm{gt},i}$`,'Predicted foreground probability and annotated target.']],
    m`A summed pixel loss of 2 over an 8-pixel box gives $2/8=1/4$.`,
    'This follows the original paper. Slide 57 describes the denominator as ground-truth mask area.'),
  fastNms:equation(62,'Fast NMS column maximum',m`K_{kj}=\max_{i<j}X_{kij},\qquad
    \text{suppress }j\text{ if }K_{kj}\ge t`,
    'Use a parallel comparison to remove overlapping lower-ranked candidates.',
    'For a candidate, take the largest IoU against boxes of its class that score higher. Apply the slide’s threshold rule.',
    [[m`$k,i,j$`,'Class and ranked box indices. Lower index means higher confidence.'],[m`$X_{kij},K_{kj}$`,'Pairwise IoU and the largest eligible IoU for candidate j.'],[m`$t$`,'Suppression threshold. The first box has no higher-scored comparison and is kept.']],
    m`If a third box overlaps the first two by $1/4$ and $3/4$, its maximum is $3/4$. With $t=1/2$ it is suppressed.`,
    'A higher-ranked box can suppress another even if the higher-ranked box was also suppressed.'),
  boxOffsets:equation(69,'Cascade box encoding',m`\boldsymbol\Delta=\left(
    \frac{g_x-b_x}{b_w\sigma_x},\frac{g_y-b_y}{b_h\sigma_y},
    \frac{\log(g_w/b_w)}{\sigma_w},\frac{\log(g_h/b_h)}{\sigma_h}\right)`,
    'Calculate a regression target from the stage’s current proposal to its ground-truth box.',
    'Scale center shifts by proposal dimensions and take log size ratios. Divide each component by its scale factor.',
    [[m`$\mathbf b,\mathbf g$`,'Proposal and ground-truth box in center-size order.'],[m`$\sigma_x,\sigma_y,\sigma_w,\sigma_h$`,'Scaling factors for the four components.']],
    m`With $b_w=8$, $g_x-b_x=2$, and $\sigma_x=1$, the encoded horizontal shift is $1/4$.`,
    'Each stage recomputes its correction relative to the box it receives.'),
  thresholdLoss:equation(73,'Integral classification loss at several IoU thresholds',m`\mathcal L'_{\mathrm{cls}}
    =\sum_{u\in U}\mathcal L_{\mathrm{cls}}^{(u)}`,
    'Train classifiers under multiple overlap requirements on the available proposals.',
    'For every threshold, label the proposals under that rule, compute the classification loss, and add the losses.',
    [[m`$U,u$`,'Set of training IoU thresholds and one member.'],[m`$\mathcal L_{\mathrm{cls}}^{(u)}$`,'Classification loss using targets defined by threshold u.']],
    m`An overlap $0.65$ exceeds $0.5$ and $0.6$, so those classifiers train it as positive. It falls below $0.7$.`,
    'A stricter classifier trained on the same initial proposals may see fewer positive samples.'),
  cascade:equation(75,'Sequential Cascade R-CNN box refinement',m`\mathbf b^{t+1}=f_t(\mathbf x^t,\mathbf b^t)`,
    'Track which boxes each stage refines.',
    'Use the stage-t head on the stage-t features and box, then feed the resulting box to the next stage.',
    [[m`$t,f_t$`,'Stage index and its specialized regressor.'],[m`$\mathbf x^t,\mathbf b^t$`,'Features and input box at stage t.']],
    m`With three heads, $f_2$ receives the box produced by $f_1$, and $f_3$ receives the one produced by $f_2$.`,
    'Training each head on its own incoming boxes helps align its training and inference inputs.'),
  cascadeLoss:equation(77,'Cascade R-CNN stage loss',m`\mathcal L^t=\mathcal L^t_{\mathrm{cls}}+
    \lambda[c\ge1]\mathcal L^t_{\mathrm{off}},\qquad u^t>u^{t-1}\; (t\ge2)`,
    'Train classification and positive-only localization at each cascade stage.',
    'Add the class loss and, for a foreground proposal, the weighted box loss.',
    [[m`$c,\lambda$`,'Target class and box-loss weight. The bracket is 1 for foreground.'],[m`$u^t$`,'Training IoU threshold for stage t.'],[m`$\mathcal L^t_{\mathrm{cls}},\mathcal L^t_{\mathrm{off}}$`,'Classification and regression losses for the current stage.']],
    m`At a positive proposal, losses $1/2$ and $1/4$ with $\lambda=1$ give $3/4$. For background with the same class loss, the total is $1/2$.`,
    'The background label depends on the stage’s IoU requirement and its incoming proposals.'),
  interleave:equation(84,'HTC interleaved execution',m`\begin{aligned}
    \mathbf x_t^{\mathrm{box}} &= \mathcal P(\mathbf x,\mathbf r_{t-1}),\quad
      \mathbf r_t = B_t(\mathbf x_t^{\mathrm{box}})\\
    \mathbf x_t^{\mathrm{mask}} &= \mathcal P(\mathbf x,\mathbf r_t),\quad
      \mathbf m_t = M_t(\mathbf x_t^{\mathrm{mask}})
    \end{aligned}`,
    'Trace which region goes to the box head and the mask head within one stage.',
    'Pool box features from the previous region, refine it, then pool mask features from the refined region.',
    [[m`$\mathcal P,\mathbf x$`,'Region pooling and backbone features.'],[m`$\mathbf r_{t-1},\mathbf r_t$`,'Incoming and refined RoIs.'],[m`$B_t,M_t$`,'Current box and mask heads.']],
    m`At stage 2, the box head reads $\mathbf r_1$. Its output $\mathbf r_2$ determines the mask crop.`,
    'The mask head benefits from the current refinement before another stage runs.'),
  maskFlow:equation(87,'HTC mask information flow',m`\mathcal F(\mathbf x_t^{\mathrm{mask}},\mathbf m_{t-1}^{-})
    =\mathbf x_t^{\mathrm{mask}}+\mathcal G(\mathbf m_{t-1}^{-})`,
    'Bring an earlier mask head’s spatial information into the current mask head.',
    'Transform the earlier intermediate mask features into compatible features, then add them to the current input.',
    [[m`$\mathbf x_t^{\mathrm{mask}}$`,'Current RoI mask features.'],[m`$\mathbf m_{t-1}^{-}$`,'Previous-stage intermediate mask features.'],[m`$\mathcal G,\mathcal F$`,'Feature transform and fusion.']],
    m`If one current feature value is 2 and the transformed previous value is 1, their fused value is 3.`,
    'The intermediate features can convey more shape information than a thresholded mask.'),
  htcContext:equation(86,'HTC semantic feature fusion',m`\mathbf x_t^{\mathrm{mask}}=
    \mathcal P(\mathbf x,\mathbf r_t)+\mathcal P(\mathcal S(\mathbf x),\mathbf r_t)`,
    'Feed scene-wide semantic context into the features of an individual instance.',
    'Pool features from the backbone and the semantic branch using the same RoI, then add.',
    [[m`$\mathcal S(\mathbf x)$`,'Dense features computed by the semantic branch.'],[m`$\mathcal P,\mathbf r_t$`,'RoI feature extraction and the current refined region.']],
    m`For a stage-2 mask, both terms are pooled at $\mathbf r_2$. The analogous box calculation uses $\mathbf r_1$.`,
    'RoI alignment puts the two sources of information at matching spatial locations.'),
  htcLoss:equation(89,'Hybrid Task Cascade multi-task loss',m`\mathcal L=\sum_{t=1}^{T}\alpha_t
    (\mathcal L_{\mathrm{bbox}}^t+\mathcal L_{\mathrm{mask}}^t)+\beta\mathcal L_{\mathrm{seg}}`,
    'Balance refinement losses from each stage with the scene-wide semantic objective.',
    'Weight each stage’s detection and instance-mask losses together, sum the stages, and add weighted semantic loss.',
    [[m`$T,\alpha_t$`,'Number of cascade stages and current stage weight.'],[m`$\mathcal L_{\mathrm{bbox}}^t,\mathcal L_{\mathrm{mask}}^t$`,'Detection and instance-mask losses for stage t.'],[m`$\beta,\mathcal L_{\mathrm{seg}}$`,'Semantic branch weight and semantic cross-entropy.']],
    m`If the three stage sums are all 2, the slide’s weights $(1,1/2,1/4)$ give $7/2$ before adding the semantic loss.`,
    'The semantic branch and the RoI mask branches receive different supervision.'),
  regionBoundary:equation(111,'Video region J, boundary F, and J&F',m`\begin{aligned}
    \mathcal J&=\frac{|M\cap\widehat M|}{|M\cup\widehat M|}\\
    \mathcal F&=\frac{2P_bR_b}{P_b+R_b},\qquad
    \mathcal J\&\mathcal F=\frac{\mathcal J+\mathcal F}{2}
    \end{aligned}`,
    'Evaluate both mask coverage and contour agreement. The last expression names the combined score reported in slide 112.',
    'Compute region overlap and the harmonic mean of boundary precision and recall. Average the region and boundary scores for J&F.',
    [[m`$M,\widehat M$`,'Ground-truth and predicted foreground pixel sets.'],[m`$P_b,R_b$`,'Precision and recall for boundary matches under the benchmark’s tolerance.']],
    m`If $P_b=1/2$, $R_b=1$ and $\mathcal J=1/3$, then $\mathcal F=2/3$ and $\mathcal J\&\mathcal F=1/2$.`,
    'Good coverage and a good contour are complementary. Check both when diagnosing a mask error.')
};
