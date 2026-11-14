const m = String.raw;
const work = (text, math) => ({text, math});
const worked = (slide, discussion, title, problem, hint, solution, takeaway, trap, variation, variationSolution) =>
  ({slide, discussion, title, kind:'Computation', problem, hint, solution, takeaway, trap,
    practice:{problem:variation, solution:variationSolution}});

export const examples = [
  worked(13,11,'Encode and recover the can’s box',
    m`Use corner order. An anchor is $(0,0,8,8)$ and the object is $(2,1,6,7)$. Find the offsets, then recover the object from them.`,
    'Subtract the anchor coordinates from the corresponding object coordinates.',
    [work('Encode by subtracting corresponding edges.',m`(2-0,1-0,6-8,7-8)=(2,1,-2,-1)`),
     work('Decode by adding the anchor back.',m`(0,0,8,8)+(2,1,-2,-1)=(2,1,6,7)`)],
    'The left edge moves right while the right edge moves left, making the box narrower.',
    'Negative offsets are valid. They indicate leftward or upward motion.',
    m`Use the same anchor with offsets $(1,0,1,0)$. Find the decoded box.`,
    [work('Add the coordinates.',m`(0,0,8,8)+(1,0,1,0)=(1,0,9,8)`),work('Both x edges move right one pixel, preserving width.')]),
  worked(22,22,'Compute IoU from two rectangles',
    m`The two $4\times4$ boxes share a $2\times4$ rectangle. Find their IoU.`,
    'The shared strip counts once in the union.',
    [work('Compute the intersection.',m`|A\cap B|=2\cdot4=8`),
     work('Add both areas and subtract the shared area once.',m`|A\cup B|=16+16-8=24`),
     work('Divide the two areas.',m`\operatorname{IoU}=8/24=1/3`)],
    'Each box has half its own area in the overlap, but the union is larger than either box.',
    'The denominator includes the areas covered by either rectangle.',
    'If the same boxes overlap in a 3-by-4 strip, what is IoU?',
    [work('Compute the two areas.',m`|A\cap B|=12,\qquad |A\cup B|=16+16-12=20`),work('Divide.',m`\operatorname{IoU}=12/20=3/5`)]),
  worked(29,29,'Write the four instructions for the boxes in the diagram',
    m`The anchor has center $(6,5)$, width $8$, and height $6$. The labeled object box has center $(10,7)$, width $4$, and height $8$. Find the four instructions before extra scaling.`,
    'For movement, subtract the centers and divide by the anchor dimension. For size, divide the dimensions first and then take the log.',
    [work('Write the rule for the two center shifts.',m`\left(\frac{c_{bx}-c_{ax}}{w_a},\frac{c_{by}-c_{ay}}{h_a}\right)`),
     work('Substitute the centers and anchor dimensions.',m`\left(\frac{10-6}{8},\frac{7-5}{6}\right)=\left(\frac12,\frac13\right)`),
     work('Write the rule for the two size changes.',m`\left(\log\frac{w_b}{w_a},\log\frac{h_b}{h_a}\right)`),
     work('Substitute the widths and heights.',m`\left(\log\frac48,\log\frac86\right)=\left(\log\frac12,\log\frac43\right)`),
     work('Put the results in slide order.',m`y_{\mathrm{gt}}=\left(\frac12,\frac13,\log\frac12,\log\frac43\right)`)],
    'Move right half an anchor width and down one third of an anchor height. Halve the width and make the height four thirds as large.',
    'Both center-shift denominators use the anchor dimensions.',
    m`What would the unscaled encoding be if the target had the anchor’s center and size?`,
    [work('The center shifts are zero and both size ratios are one.',m`y_{\mathrm{gt}}=(0,0,\log1,\log1)=(0,0,0,0)`)]),
  worked(31,31,'Score two guesses for the can’s horizontal shift',
    m`The correct horizontal instruction from the diagram is $1/2$ before extra scaling. Compare an SSD prediction of $0$ with a prediction of $-3/2$. Find the Smooth L1 penalty for each guess using $\sigma=1$.`,
    'Subtract the correct instruction from each guess. Compare the magnitude of each error with 1.',
    [work('Compute prediction minus target for each guess.',m`\begin{gathered}
      u=y_{\mathrm{pred},x}-y_{\mathrm{gt},x}\\
      0-\frac12=-\frac12,\qquad -\frac32-\frac12=-2
    \end{gathered}`),
     work('For magnitude below 1, use the square.',m`\begin{aligned}
       L1_{\mathrm{smooth}}(u)&=\frac{u^2}{2}\\
       L1_{\mathrm{smooth}}(-1/2)&=\frac{(-1/2)^2}{2}=\frac18
     \end{aligned}`),
     work('For magnitude at least 1, use the linear branch.',m`\begin{aligned}
       L1_{\mathrm{smooth}}(u)&=|u|-\frac12\\
       L1_{\mathrm{smooth}}(-2)&=2-\frac12=\frac32
     \end{aligned}`)],
    'Leaving the center alone costs less than moving it left when the correct move is to the right.',
    'Use the magnitude to pick the branch. The error of −2 has magnitude 2.',
    m`At the join $u=1$ and $\sigma=1$, evaluate both expressions.`,
    [work('The quadratic gives the same value as the linear tail.',m`1^2/2=1/2=1-1/2`)]),
  worked(41,40,'Trace one NMS pass on three predictions',
    m`Boxes A, B, C of the same class have scores $9/10,8/10,7/10$. IoU(A,B) is $3/4$, IoU(A,C) is $1/4$. Apply hard NMS with threshold $1/2$.`,
    'Start with the score ranking. Compare the remaining boxes with the current winner.',
    [work('Keep A because it has the highest score.'),work('B reaches the suppression threshold and C does not.',m`3/4\ge1/2,\qquad1/4<1/2`),
     work('Keep C on the next pass. The output is A and C.')],
    'The scores determine which box wins. IoU determines what that winner suppresses.',
    'Suppress a lower-scoring box only if its overlap reaches the threshold.',
    'What changes if the IoU threshold rises to 1 and B and C are distinct?',
    [work('Neither IoU with A reaches 1. Distinct B and C also have IoU below 1. All three survive.')]),
  worked(43,42,'Count errors before dividing',
    'There are four labeled cans. The detector makes five reports. Three can be matched to distinct labeled cans, one is a duplicate and one is background. Find precision and recall.',
    'The duplicate has no remaining valid object match.',
    [work('Count matches, unused reports and missed objects.',m`tp=3,\quad fp=2,\quad fn=4-3=1`),
     work('Use the reports as the precision denominator and the labels as the recall denominator.',
       m`\mathrm{precision}=3/(3+2)=3/5,\qquad \mathrm{recall}=3/(3+1)=3/4`)],
    'The same three correct detections lead to two different fractions.',
    'A second prediction for an already matched can is a false positive.',
    'Remove just the duplicate. What are the new scores?',
    [work('The false positives fall to one and the matches stay at three.',m`\mathrm{precision}=3/4,\qquad \mathrm{recall}=3/4`)]),
  worked(48,47,'Read an eleven-point precision envelope',
    'One class has two labeled objects. Three reports in descending score order are TP, FP, TP. Find the VOC 2007 AP.',
    'For each recall cutoff, use the best precision at that recall or higher.',
    [work('Compute precision and recall at each prefix.',m`(r,P)=(1/2,1),\ (1/2,1/2),\ (1,2/3)`),
     work('Use precision 1 at six levels from 0 to 0.5 and 2/3 at five levels from 0.6 to 1.',m`\mathrm{AP}_{07}=\frac{6(1)+5(2/3)}{11}=\frac{28}{33}`)],
    'Interpolation uses the best reachable precision at each of the eleven recall targets.',
    'Count recall zero as one of the eleven sample levels.',
    'What is AP if the last true-positive report is missing?',
    [work('Recall above 1/2 becomes unreachable and contributes zero.',m`\mathrm{AP}_{07}=\frac{6(1)+5(0)}{11}=\frac6{11}`)]),
  worked(56,55,'Pool a region to the expected shape',
    'A projected RoI is 4 cells high and 6 wide. Pool to 2 rows and 2 columns. The first bin in one channel contains 1, 0, 2, 3, 1, and 4. Find its size and output.',
    'Pool each bin independently.',
    [work('Divide the height and width by their output sizes.',m`h/H=4/2=2,\qquad w/W=6/2=3`),
     work('Keep the maximum in the first bin.',m`\max(1,0,2,3,1,4)=4`)],
    'Even a different-sized RoI still produces a 2-by-2 grid in this setup.',
    'The region is pooled on the feature map, one channel at a time.',
    'If you pool to 1 row and 3 columns, how many cells are in each bin?',
    [work('The new bins are 4 high and 2 wide.',m`(4/1)(6/3)=8`)]),
  worked(68,67,'Count RPN predictions at different scales',
    m`The feature map is $5\times4$ with 3 scales and 2 ratios per scale. Find the anchor count and the two output sizes at each location.`,
    'First compute how many scale–ratio combinations there are.',
    [work('Find the number of anchors per location.',m`k=3\cdot2=6`),
     work('Count anchors on the map, then the outputs at one location.',m`WHk=5\cdot4\cdot6=120,\qquad (2k,4k)=(12,24)`)],
    'Those 12 scores are objectness scores. The final detector assigns the category.',
    'Keep the counts for one location separate from the totals for the map.',
    'Keep the same feature map and use three ratios per scale. How many anchors?',
    [work('There are now nine templates per point.',m`WHk=5\cdot4\cdot9=180`)]),
  worked(87,87,'Route a rectangular proposal to an FPN level',
    m`An RoI is $224\times56$ pixels. Apply the original FPN level rule with $k_0=4$.`,
    'The formula uses the square root of the area.',
    [work('Find the effective size.',m`\sqrt{wh}=\sqrt{224\cdot56}=112`),
     work('Compare with the canonical size.',m`k=\lfloor4+\log_2(112/224)\rfloor=3`)],
    'The shape is rectangular, but its effective size matches a square of side 112.',
    'Include both dimensions when calculating the geometric mean.',
    'If both dimensions double, which level is selected?',
    [work('The effective size doubles to 224.',m`k=\lfloor4+\log_2(1)\rfloor=4`)]),
  worked(98,97,'Compare how strongly focal loss weights two examples',
    m`For two examples of the same class, $p_t$ is $1/2$ and $3/4$. Compare the difficulty factors for $\gamma=2$.`,
    'Evaluate the power term by itself.',
    [work('Write the factor.',m`f(p_t)=(1-p_t)^\gamma`),
     work('Substitute the two true-label probabilities.',m`f(1/2)=1/4,\qquad f(3/4)=1/16`)],
    'The easier example keeps only one quarter of the harder example’s difficulty factor. The cross-entropy terms also differ.',
    'The full loss also depends on the cross-entropy term.',
    m`What happens to both factors when $\gamma=0$?`,
    [work('Both factors become one.',m`(1-1/2)^0=(1-3/4)^0=1`)]),
  worked(114,113,'Choose a level for one FSAF training object',
    m`At $P_3$, two effective points have focal losses $(1/2,1/2)$ and box losses $(1/4,1/4)$. At $P_4$, one effective point has focal loss $1/4$ and box loss $1/4$. Which level trains the instance?`,
    'Average per level before comparing.',
    [work('Add the two mean losses at level 3.',m`(1/2+1/2)/2+(1/4+1/4)/2=3/4`),
     work('Compute the level 4 sum and compare.',m`1/4+1/4=1/2<3/4`),work('Choose level 4.')],
    'The average makes the comparison meaningful when effective regions contain different numbers of points.',
    'Compare the sum of both loss terms at each level.',
    'If the level 4 box loss rises to 3/4, what changes?',
    [work('The new level 4 total is 1, so level 3 wins.',m`1/4+3/4=1>3/4`)]),
  worked(125,122,'Find FCOS targets from a feature point',
    m`At stride $8$, use feature point $(1,2)$ and box with corners $(8,12)$ and $(20,24)$. Find the point in image coordinates and its four targets.`,
    'Project first, then measure each distance in image units.',
    [work('Back-project the point.',m`(x',y')=(4+1\cdot8,4+2\cdot8)=(12,20)`),
     work('Measure left, top, right and bottom.',m`\mathbf t^*=(12-8,20-12,20-12,24-20)=(4,8,8,4)`)],
    'The point lies inside the box and can learn this target on an eligible level.',
    'The top distance subtracts the box’s top y coordinate from the point’s y coordinate.',
    'At the same stride, what image point comes from (2,1)?',
    [work('Repeat the half-stride shift after multiplying.',m`(x',y')=(4+2\cdot8,4+1\cdot8)=(20,12)`)]),
  worked(129,129,'See how centerness changes a ranking',
    m`Two predicted boxes have class score $4/5$. One point has equal opposing distances and the other has distances $(1,2,4,2)$ in FCOS order. Assume the head predicts their exact centerness targets. Compare combined scores.`,
    'Take the square root of the product of the horizontal and vertical ratios.',
    [work('Compute both centerness values.',m`c_1=\sqrt{1\cdot1}=1,\qquad c_2=\sqrt{(1/4)\cdot1}=1/2`),
     work('Multiply each class score by its centerness.',m`s_1=(4/5)\cdot1=4/5,\qquad s_2=(4/5)\cdot(1/2)=2/5`)],
    'The detector can prioritize the more central location even when the class head scores tie.',
    'Use the product of the class score and centerness.',
    'If both axes have distance ratio 1/4, what is the centerness?',
    [work('Multiply the ratios, then take the square root.',m`c=\sqrt{(1/4)(1/4)}=1/4`)]),
];

const item = (slide, marks, prompt, answer, ...steps) => ({slide, marks, prompt, answer, steps});
const step = (formula, substitution) => ({formula, substitution});

export const detectionExam = {
  problems: [
    {
      title:'Match anchors to a labeled can',
      setup:m`One labeled can has box $(2,0,6,4)$. Anchor A is $(2,0,5,4)$, B is $(1,0,5,4)$ and C is $(6,0,10,4)$. Use continuous area and corner order. Use the slide’s best-match rule, then add other anchors with IoU strictly greater than $1/2$.`,
      parts:[
        item(22,3,'Compute the IoU of each anchor with the can.','Award 1 mark for each correct overlap.',
          step(m`\operatorname{IoU}(A,B)=\frac{|A\cap B|}{|A|+|B|-|A\cap B|}`,
            m`\begin{aligned}\operatorname{IoU}(A,\mathrm{can})&=\frac{3\cdot4}{12+16-12}=\tfrac34\\
            \operatorname{IoU}(B,\mathrm{can})&=\frac{3\cdot4}{16+16-12}=\tfrac35\\
            \operatorname{IoU}(C,\mathrm{can})&=\frac{0}{16+16}=0\end{aligned}`)),
        item(24,2,'Give the positive anchors and explain how the rest are treated.',
          'A is the best match (1 mark). B is an extra positive because its overlap exceeds the threshold, and C is background (1 mark).'),
        item(26,2,'Give the raw corner offsets for the best anchor.',
          'Award 1 mark for subtracting the anchor from the target and 1 for the four offsets in order.',
          step(m`y_{\mathrm{off}}=y_{\mathrm{box}}-y_{\mathrm{anchor}}`,
            m`(2,0,6,4)-(2,0,5,4)=(0,0,1,0)`))
      ]
    },
    {
      title:'Encode an object box and score the regression',
      setup:m`An anchor has center $(4,4)$ and width and height $8$. Its matched object has center $(8,4)$, width $16$ and height $8$. Use natural logs and omit the extra scaling from slide 30. A network predicts the x target and width target with errors $-1/2$ and $2$ respectively; other offset errors are zero.`,
      parts:[
        item(29,3,'Find the encoded target. Leave logarithms exact.',
          'Award 1 mark for the center-shift terms, 1 for the width ratio, and 1 for the unchanged height.',
          step(m`y_{\mathrm{gt}}=\left(\frac{c_{bx}-c_{ax}}{w_a},\frac{c_{by}-c_{ay}}{h_a},
            \log\frac{w_b}{w_a},\log\frac{h_b}{h_a}\right)`,
            m`y_{\mathrm{gt}}=((8-4)/8,(4-4)/8,\log(16/8),\log(8/8))
              =(\tfrac12,0,\log2,0)`)),
        item(31,3,m`Use $\sigma=1$ to calculate the Smooth L1 contributions and their sum.`,
          'Award 1 mark for each correct branch and value, and 1 for the sum.',
          step(m`L1_{\mathrm{smooth}}(u)=\begin{cases}u^2/2&|u|<1\\|u|-1/2&\text{otherwise}\end{cases}`,
            m`\begin{aligned}L1_{\mathrm{smooth}}(-1/2)&=\tfrac18\\
              L1_{\mathrm{smooth}}(2)&=\tfrac32\\
              \mathcal L_{\mathrm{off}}&=\tfrac18+\tfrac32=\tfrac{13}8\end{aligned}`)),
        item(28,2,'Should this box loss be included for an unmatched anchor? What training signal should a sampled unmatched anchor receive?',
          'The box term is gated off because there is no matched object (1 mark). A selected negative trains the class head to predict background (1 mark).')
      ]
    },
    {
      title:'Score a positive and a background anchor',
      setup:m`SSD samples two anchors. A is matched to a can and B is labeled background. The model assigns probability $1/2$ to the true class of each. Anchor A has one offset error of $1/2$ and three zero errors. Use natural logs and Smooth L1 with $\sigma=1$.`,
      parts:[
        item(27,2,'Find the classification loss for each anchor.',
          'Award 1 mark for each classification term, using the target class for that anchor.',
          step(m`\mathcal L_{\rm cls}=-\ln p_{\rm true}`,
            m`\mathcal L_{\rm cls,A}=\mathcal L_{\rm cls,B}=-\ln(1/2)=\ln 2`)),
        item(31,2,'Find the box-loss contribution of A and explain how B is treated.',
          'Award 1 mark for the Smooth L1 result. B has no matched object, so it contributes no box loss (1 mark).',
          step(m`\mathcal L_{\rm off,A}=\sum_j L1_{\rm smooth}(u_j),\quad L1_{\rm smooth}(u)=u^2/2\quad (|u|<1)`,
            m`\mathcal L_{\rm off,A}=\tfrac12(\tfrac12)^2+0+0+0=\tfrac18`))
      ]
    },
    {
      title:'Suppress duplicates, then evaluate the remaining predictions',
      setup:m`For one class, A, B, C and D have descending confidence scores. IoU(A,B) is $3/4$. All other prediction-pair overlaps are below $1/2$. There are two labeled objects. A and B both match the first, C is a false alarm, and D matches the second. Use hard NMS with threshold $1/2$.`,
      parts:[
        item(41,2,'List the surviving boxes in score order.',
          'Keep A and suppress B based on their overlap (1 mark). Keep C and D, giving A, C, D (1 mark).'),
        item(43,3,'Compute final precision and recall.',
          'Award 1 mark for the counts, 1 for precision and 1 for recall.',
          step(m`P=\frac{tp}{tp+fp},\qquad R=\frac{tp}{tp+fn}`,
            m`tp=2,\quad fp=1,\quad fn=0,\qquad P=\tfrac23,\quad R=1`)),
        item(48,3,'Compute the interpolated VOC 2007 AP for the surviving ranked list.',
          'Award 1 mark for the precision envelope, 1 for counting the two sets of recall levels, and 1 for AP.',
          step(m`\mathrm{AP}_{07}=\frac1{11}\sum_{r\in\{0,0.1,\ldots,1\}}
            \max_{\tilde r\ge r}P(\tilde r)`,
            m`\begin{aligned}P_r&=1\quad(r=0,\ldots,0.5)\\P_r&=\tfrac23\quad(r=0.6,\ldots,1)\\
            \mathrm{AP}_{07}&=\frac{6(1)+5(2/3)}{11}=\tfrac{28}{33}\end{aligned}`)),
        item(48,3,'Now suppose there is a third labeled object that no surviving box matches. The ranked list is otherwise unchanged. Recompute VOC 2007 AP.',
          'Award 1 mark for the new recalls, 1 for giving unreachable recall levels zero precision, and 1 for AP.',
          step(m`\mathrm{AP}_{07}=\tfrac1{11}\sum_{r\in\{0,0.1,\ldots,1\}}P_r`,
            m`\begin{aligned}
              R&=(1/3,1/3,2/3)\\
              P_r&=1\quad(r=0,\ldots,0.3)\\
              P_r&=\tfrac23\quad(r=0.4,0.5,0.6)\\
              P_r&=0\quad(r=0.7,\ldots,1)\\
              \mathrm{AP}_{07}&=\frac{4(1)+3(2/3)+4(0)}{11}=\tfrac6{11}
            \end{aligned}`))
      ]
    },
    {
      title:'Generate proposals and route one to a feature level',
      setup:m`An RPN uses a $6\times4$ feature map with three scales and two aspect ratios at each location. A proposal from the RPN is $224\times56$ image pixels.`,
      parts:[
        item(68,3,'Find the total anchors and both output sizes at one location.',
          'Award 1 mark for the total anchors, 1 for objectness scores and 1 for offsets.',
          step(m`N=WHk,\qquad (n_{\mathrm{cls}},n_{\mathrm{off}})=(2k,4k)`,
            m`k=3\cdot2=6,\qquad N=6\cdot4\cdot6=144,\qquad (2k,4k)=(12,24)`)),
        item(87,2,'Choose the RoI level using the original FPN equation.',
          'Award 1 mark for the geometric-mean size and 1 for level P3.',
          step(m`k=\left\lfloor 4+\log_2\left(\frac{\sqrt{wh}}{224}\right)\right\rfloor`,
            m`\sqrt{224\cdot56}=112,\qquad k=\lfloor4+\log_2(1/2)\rfloor=3`)),
        item(85,2,'What does the lateral input add that upsampling the coarse map alone cannot supply?',
          'It supplies finer spatial information from the matching-resolution backbone map (1 mark). The upsampled map provides deeper semantic evidence but cannot recreate the lost detail by itself (1 mark).')
      ]
    },
    {
      title:'Train a dense detector with focal loss and select a feature level',
      setup:m`A background example has foreground probability $1/4$. A foreground example has foreground probability $1/2$. Use $\gamma=2$ and consider the focal difficulty factor alone. Separately, FSAF is comparing two levels for one annotated object: the level’s mean focal and IoU losses are $(1/2,1/4)$ at $P_3$ and $(1/4,1/4)$ at $P_4$.`,
      parts:[
        item(95,2,'Find the probability of the true label for each example.',
          'Award 1 mark for each true-label probability.',
          step(m`p_t=\begin{cases}p&y=1\\1-p&y=-1\end{cases}`,
            m`p_{t,\mathrm{bg}}=1-\tfrac14=\tfrac34,\qquad p_{t,\mathrm{fg}}=\tfrac12`)),
        item(98,3,'Find the difficulty factors and say which example is downweighted more by this factor.',
          'Award 1 mark for each factor and 1 for identifying background as the easier example in this scenario.',
          step(m`f(p_t)=(1-p_t)^\gamma`,
            m`f_{\mathrm{bg}}=(1-\tfrac34)^2=\tfrac1{16},\qquad f_{\mathrm{fg}}=(1-\tfrac12)^2=\tfrac14`)),
        item(114,2,'Choose the FSAF training level and explain the criterion.',
          'Award 1 mark for the totals and 1 for choosing level P4 by the smallest sum.',
          step(m`l^*=\arg\min_l\left(L_{\mathrm{FL}}^I(l)+L_{\mathrm{IoU}}^I(l)\right)`,
            m`L^I(3)=\tfrac12+\tfrac14=\tfrac34,\qquad L^I(4)=\tfrac14+\tfrac14=\tfrac12\quad\Longrightarrow\quad l^*=4`))
      ]
    },
    {
      title:'Decode and rank an anchor-free FCOS prediction',
      setup:m`At stride $8$, use feature point $(1,1)$ and a ground-truth box with corners $(10,10)$ and $(20,14)$. Its class score is $3/4$. Assume its predicted centerness equals its target.`,
      parts:[
        item(123,2,'Back-project the point to image coordinates.',
          'Award 1 mark for using the half-stride shift and 1 for the point.',
          step(m`(x',y')=(s/2+xs,s/2+ys)`,m`(x',y')=(4+1\cdot8,4+1\cdot8)=(12,12)`)),
        item(125,2,'Find the target offsets in FCOS order.',
          'Award 1 mark for both horizontal distances and 1 for both vertical distances in the right order.',
          step(m`\mathbf t^*=(x'-x_0,y'-y_0,x_1-x',y_1-y')`,
            m`\mathbf t^*=(12-10,12-10,20-12,14-12)=(2,2,8,2)`)),
        item(129,3,'Compute centerness and the combined score.',
          'Award 1 mark for setting up the two ratios, 1 for the centerness and 1 for the ranking score.',
          step(m`c=\sqrt{\frac{\min(l^*,r^*)}{\max(l^*,r^*)}
                         \frac{\min(t^*,b^*)}{\max(t^*,b^*)}}`,
            m`c=\sqrt{(2/8)(2/2)}=\tfrac12`),
          step(m`s_{\mathrm{rank}}=p_{\mathrm{cls}}c`,m`s_{\mathrm{rank}}=\tfrac34\cdot\tfrac12=\tfrac38`))
      ]
    }
  ],
  theory:[
    item(23,3,'Describe one way IoU is used during training, one during suppression, and one during evaluation. Name the two boxes in each comparison.',
      'Award 1 mark each for matching an anchor to a ground-truth box, suppressing one predicted box using its overlap with another predicted box, and testing a predicted detection against ground truth.'),
    item(65,3,'Which repeated work did Fast R-CNN remove? What remaining bottleneck does Faster R-CNN address, and how?',
      'Fast R-CNN avoids running a CNN independently on every proposal (1 mark). The external Selective Search proposal step remains costly (1 mark). Faster R-CNN replaces it with an RPN on shared features (1 mark).'),
    item(98,2,'Why can weighting the foreground and background classes still leave a need for focal loss?',
      'Class weighting gives examples with the same label a shared multiplier (1 mark). The focal factor can distinguish easy and hard examples of that same class by their true-label probability (1 mark).'),
    item(114,3,'Compare the feature-level choices in FPN RoI pooling, FSAF training and FCOS target assignment.',
      'Award 1 mark each for FPN using the geometric-mean proposal size, FSAF using the minimum sum of mean losses per instance, and FCOS using per-level ranges for the maximum box-side distance.'),
    item(129,2,'Why can the FCOS class score be high when the box is a poor candidate? What does centerness change?',
      'A feature can recognize the class from a point that is far from the object center (1 mark). Predicted centerness adjusts the ranking score before filtering and suppression (1 mark).')
  ]
};
