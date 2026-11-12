const m = String.raw;
const work = (text, math) => ({text, math});
const worked = (slide, discussion, title, problem, hint, solution, takeaway, trap, variation, variationSolution) =>
  ({slide, discussion, title, kind:'Computation', problem, hint, solution, takeaway, trap,
    practice:{problem:variation, solution:variationSolution}});

export const examples = [
  worked(11,11,'Find the average loss on two pixels',
    m`The FCN assigns the correct classes probabilities $1/2$ and $1/8$ on two pixels. Find the mean cross-entropy and leave your answer in terms of $\ln 2$.`,
    'Use the negative log of the correct-class probability for each pixel.',
    [work('Calculate the two losses.',m`-\ln(1/2)=\ln 2,\qquad -\ln(1/8)=3\ln 2`),
     work('Average them.',m`\mathcal L_{\mathrm{CE}}=(\ln2+3\ln2)/2=2\ln2`)],
    'The model is less confident about the second pixel’s true class, so that pixel contributes more.',
    'Take the log of each probability before averaging the losses.',
    m`Both true classes now get probability $1/2$. What is the loss?`,
    [work('Both terms are identical.',m`\mathcal L_{\mathrm{CE}}=(\ln2+\ln2)/2=\ln2`)]),
  worked(16,16,'Compare global pooling with four regional averages',
    m`One feature channel is a $4\times4$ grid. Its four equal quadrants are filled with 0, 2, 4, and 6. Find the single global average and the four values in a $2\times2$ pooling branch.`,
    'Each quadrant contains the same number of entries.',
    [work('Compute the global average.',m`\bar x=(0+2+4+6)/4=3`),
     work('Average each quadrant independently. In the same order, the regional values are 0, 2, 4 and 6.')],
    'The global branch supplies the same context at all locations. The regional branch can distinguish parts of the image.',
    'A 2-by-2 pooling grid means four output bins.',
    'Change just the first quadrant from 0 to 4. Find the new global average.',
    [work('Its four entries contribute the same weight as any other quadrant.',m`\bar x=(4+2+4+6)/4=4`)]),
  worked(22,21,'Spot a small class hidden by pixel accuracy',
    'An image has eight background and two object pixels. The model predicts background everywhere. Count both classes when computing mIoU.',
    'For each class, form its own predicted and annotated pixel sets.',
    [work('Eight of ten pixels are correct.',m`\mathrm{Acc}=8/10=4/5`),
     work('Background has eight shared pixels out of ten. The object has zero shared out of two.',m`\mathrm{IoU}_{\mathrm{bg}}=4/5,\quad \mathrm{IoU}_{\mathrm{obj}}=0`),
     work('Give both classes equal weight.',m`\mathrm{mIoU}=(4/5+0)/2=2/5`)],
    'The missed object gets its own zero term in mIoU.',
    'Compute the two ratios before averaging them.',
    'Now one object pixel is correctly found and no background pixel is called object. Recompute the metrics.',
    [work('One pixel remains wrong.',m`\mathrm{Acc}=9/10`),
     work('Compute the two overlaps and take their mean.',m`\mathrm{mIoU}=\frac12(8/9+1/2)=25/36`)]),
  worked(26,24,'Sample a feature between four grid cells',
    m`The top row of a grid square is $(0,4)$ and the bottom row is $(2,6)$. Sample at $a=1/4$ horizontally and $b=1/2$ vertically.`,
    'Interpolate along each row, then blend the row results.',
    [work('Get the two horizontal results.',m`v_{\mathrm{top}}=(3/4)0+(1/4)4=1,\quad
       v_{\mathrm{bottom}}=(3/4)2+(1/4)6=3`),
     work('Blend the rows equally.',m`v=(1/2)1+(1/2)3=2`)],
    'The sample depends on its exact position inside the feature cell.',
    'Use the horizontal and vertical fractions for their own axes.',
    m`Keep $b=1/2$ and move to $a=1/2$. Find the new value.`,
    [work('The row averages are 2 and 4.',m`v=(2+4)/2=3`)]),
  worked(30,29,'Select the supervised mask and score two of its pixels',
    m`A positive RoI’s true class is person. In that mask channel, a foreground pixel has $p=1/2$ and a background pixel has $p=3/4$. Find their mean binary cross-entropy.`,
    'For the background pixel the correct outcome has probability one minus the foreground probability.',
    [work('Use the person channel. For target 1, use the foreground probability.',m`\ell_1=-\ln(1/2)=\ln2`),
     work('For target 0, use the complement.',m`\ell_2=-\ln(1-3/4)=\ln4`),
     work('Average the two losses.',m`\bar\ell=(\ln2+\ln4)/2=(3/2)\ln2`)],
    'The ground-truth class decides which grid to score. The two binary targets decide which probabilities to read from that grid.',
    'A probability of 3/4 for foreground is a confident error at a background pixel.',
    m`If the background pixel’s foreground probability drops to $1/2$, what is the new mean?`,
    [work('Both true outcomes have probability one half.',m`\bar\ell=(\ln2+\ln2)/2=\ln2`)]),
  worked(47,46,'Re-rank two masks by class and quality',
    m`Mask A has class score $3/4$ and estimated MaskIoU $1/2$. Mask B has class score $2/3$ and estimated MaskIoU $3/4$. Which ranks first under each scoring rule?`,
    'First compare the class scores. Then multiply each class score by its predicted overlap.',
    [work('By class score, A ranks first.',m`3/4>2/3`),
     work('Compute both mask scores.',m`s_A=(3/4)(1/2)=3/8,\quad s_B=(2/3)(3/4)=1/2`),
     work('By the calibrated mask score, B ranks first.')],
    'The mask with the strongest class evidence can give way to one with better estimated pixel coverage.',
    'Use the learned overlap estimate at inference.',
    m`If A’s predicted MaskIoU rises to $2/3$, what happens to the ranking?`,
    [work('The calibrated scores tie.',m`s_A=(3/4)(2/3)=1/2=s_B`)]),
  worked(56,56,'Build an instance score from two prototype values',
    m`At one pixel the prototype values are $(2,1)$. The instance uses weights $(1/2,-1/2)$. Compute the combined logit and decide whether the probability is above $1/2$.`,
    'Sigmoid maps a positive logit to a probability above one half.',
    [work('Take the weighted sum.',m`z=(2)(1/2)+(1)(-1/2)=1/2`),
     work('The logit is positive, so the sigmoid probability is above one half.')],
    'Negative coefficients can cancel some of a shared pattern for this instance.',
    'Use the signed coefficient before taking sigmoid.',
    m`Now the prototype values are $(1,1)$. Keep the weights fixed. What is the probability?`,
    [work('The two terms cancel.',m`z=1/2-1/2=0,\quad \sigma(0)=1/2`)]),
  worked(62,61,'Trace where Fast NMS differs from greedy suppression',
    m`Boxes A, B, C have decreasing scores within one class. Their IoUs are $AB=3/5$, $AC=1/3$, $BC=3/5$. Use threshold $1/2$.`,
    'For Fast NMS, compare each box to all higher-ranked boxes.',
    [work('Keep A. B’s maximum is its overlap with A.',m`K_B=3/5\ge1/2`),
     work('C’s maximum includes B even though B is removed.',m`K_C=\max(1/3,3/5)=3/5\ge1/2`),
     work('Fast NMS keeps only A. Greedy NMS keeps A and C, since B is removed before it can affect C.')],
    'The parallel approximation can discard an additional box.',
    'Fast NMS builds its comparison matrix from the original score order.',
    m`Now $BC=1/4$. Which boxes survive Fast NMS?`,
    [work('C’s maximum overlap becomes one third, so A and C survive.',m`K_C=\max(1/3,1/4)=1/3<1/2`)]),
  worked(76,75,'Compare positive counts before and after box refinement',
    m`Three original proposals have IoUs $0.55,0.65,0.75$. After one cascade stage they have $0.65,0.75,0.85$. Count positives using threshold $0.7$ before and after refinement.`,
    'Count only overlaps greater than the given threshold.',
    [work('Before refinement, only 0.75 clears the threshold.'),work('After refinement, 0.75 and 0.85 both clear it.')],
    'A better input distribution can give a stricter head enough positives to train on.',
    'Apply the same threshold to both distributions for this comparison.',
    m`If the threshold rises to $0.8$, what are the two counts?`,
    [work('None of the original proposals clear 0.8. One refined proposal, at 0.85, clears it.')]),
  worked(89,88,'Weight the three stages of the HTC objective',
    m`The box-plus-mask stage losses are $2,4,4$ and the semantic loss is $1/2$. Use $\alpha=(1,1/2,1/4)$ and $\beta=1$.`,
    'Multiply each stage sum by its own weight. Add the semantic loss once.',
    [work('Calculate the weighted stage sum.',m`1(2)+(1/2)(4)+(1/4)(4)=5`),
     work('Add the semantic term.',m`\mathcal L=5+1/2=11/2`)],
    'The semantic branch has its own weight outside the cascade sum.',
    'Apply a stage weight to both the box and mask losses at that stage.',
    m`What happens if only the third stage loss increases from 4 to 8?`,
    [work('The added contribution is one quarter of four.',m`\mathcal L=11/2+(1/4)(8-4)=13/2`)]),
  worked(111,110,'Score the region and the contour separately',
    'Both masks have 24 foreground pixels and share 16. Twelve of the 16 predicted contour pixels and twelve of the 24 true contour pixels have matches. Find J, boundary F and J&F.',
    'Use mask pixels for J, and matched contour pixels for precision and recall.',
    [work('Compute region overlap.',m`\mathcal J=16/(24+24-16)=1/2`),
     work('Compute boundary precision, recall and their harmonic mean.',m`P_b=12/16=3/4,\quad R_b=12/24=1/2,\quad \mathcal F=\frac{2(3/4)(1/2)}{3/4+1/2}=3/5`),
     work('Average the region and boundary scores.',m`\mathcal J\&\mathcal F=(1/2+3/5)/2=11/20`)],
    'The two metrics reveal different kinds of error.',
    'Compute F with the harmonic mean. Use an arithmetic mean only for the combined J&F score.',
    'If all the boundary matches are perfect and the same region J is supplied, what would the combined score be?',
    [work('With boundary precision and recall both one, F is one.',m`\mathcal J\&\mathcal F=(1/2+1)/2=3/4`)])
];

const item = (slide, marks, prompt, answer, ...steps) => ({slide, marks, prompt, answer, steps});
const step = (formula, substitution) => ({formula, substitution});

export const segmentationExam = {
  problems:[
    {
      title:'Evaluate a semantic map with a small foreground class',
      setup:'A test image has 8 background pixels and 4 can pixels. The FCN gets all 8 background pixels right and gets 2 of the 4 can pixels right. It labels the remaining pixels background. Both classes count in mIoU.',
      parts:[
        item(22,2,'Find pixel accuracy.',
          'Award 1 mark for 10 correct labels and 1 for the simplified accuracy.',
          step(m`\mathrm{Acc}=\frac{\#\text{ correct}}{\#\text{ evaluated}}`,
            m`\mathrm{Acc}=(8+2)/(8+4)=5/6`)),
        item(22,3,'Compute each class IoU and their mean.',
          'Award 1 mark for each class overlap and 1 for their mean.',
          step(m`\mathrm{IoU}_c=\frac{\mathrm{TP}_c}{\mathrm{TP}_c+\mathrm{FP}_c+\mathrm{FN}_c},
            \quad\mathrm{mIoU}=\frac1K\sum_c\mathrm{IoU}_c`,
            m`\begin{aligned}\mathrm{IoU}_{\mathrm{bg}}&=8/(8+2+0)=4/5\\
              \mathrm{IoU}_{\mathrm{can}}&=2/(2+0+2)=1/2\\
              \mathrm{mIoU}&=(4/5+1/2)/2=13/20\end{aligned}`)),
        item(16,2,'How can a regional pooling branch give a pixel more spatial context than a global pooling branch?',
          'Regional pooling keeps a separate summary for each subregion (1 mark). Upsampling provides the local classifier with the context of its location within the scene (1 mark).')
      ]
    },
    {
      title:'Align a RoI and supervise its mask',
      setup:m`The projected RoI samples a feature grid square with top values $(0,4)$ and bottom values $(4,8)$. The sample is $1/4$ across and $1/4$ down. The annotated class is person, but the class head predicts cyclist.`,
      parts:[
        item(26,3,'Find the RoIAlign sample value by interpolating each row and then the two results.',
          'Award 1 mark for each row and 1 for the final sample.',
          step(m`v=(1-b)v_{\mathrm{top}}+bv_{\mathrm{bottom}},
            \quad v_{\mathrm{row}}=(1-a)v_L+av_R`,
            m`\begin{aligned}v_{\mathrm{top}}&=(3/4)0+(1/4)4=1\\
              v_{\mathrm{bottom}}&=(3/4)4+(1/4)8=5\\
              v&=(3/4)1+(1/4)5=2\end{aligned}`)),
        item(30,2,'Which mask channel receives the loss at training? Which channel would be used at inference for the stated prediction?',
          'Person at training because that is the ground-truth class (1 mark). Cyclist at inference because that is the predicted class (1 mark).'),
        item(29,3,m`In the training channel, a foreground pixel has probability $1/4$ and a background pixel has foreground probability $1/2$. Find their mean BCE. Use natural logs and leave the result exact.`,
          'Award 1 mark for each correct pixel loss and 1 for the mean.',
          step(m`\bar\ell=\frac1N\sum_i -[y_i\ln p_i+(1-y_i)\ln(1-p_i)]`,
            m`\bar\ell=(-\ln(1/4)-\ln(1-1/2))/2=\tfrac32\ln2`))
      ]
    },
    {
      title:'Use mask overlap to improve the ranking',
      setup:m`A predicted mask has 6 foreground pixels and its annotation has 8. They share 5. At inference, mask A has class score $4/5$ and predicted MaskIoU $1/2$. Mask B has class score $3/4$ and predicted MaskIoU $2/3$.`,
      parts:[
        item(44,2,'Find the measured MaskIoU of the annotated pair.',
          'Award 1 mark for forming the union and 1 for the ratio.',
          step(m`\mathrm{MaskIoU}=\frac{|M\cap\widehat M|}{|M|+|\widehat M|-|M\cap\widehat M|}`,
            m`\mathrm{MaskIoU}=5/(8+6-5)=5/9`)),
        item(47,3,'Compute the two calibrated scores and give their order.',
          'Award 1 mark per score and 1 for putting B before A.',
          step(m`s_{\mathrm{mask}}=s_{\mathrm{cls}}s_{\mathrm{iou}}`,
            m`s_A=(4/5)(1/2)=2/5,\quad s_B=(3/4)(2/3)=1/2`)),
        item(48,2,'Why use predicted MaskIoU at inference? Can the changed ranking improve AP while leaving the mask shapes unchanged?',
          'Inference lacks the annotated mask needed to measure actual overlap (1 mark). AP depends on score order, so better ranking alone can improve it (1 mark).')
      ]
    },
    {
      title:'Build two instance masks from shared YOLACT prototypes',
      setup:m`At a pixel, two prototype values are $(2,1)$. Detection A has coefficients $(1/2,-1/2)$ and B has $(-1/2,1/2)$. For suppression, boxes A, B, C have decreasing scores in one class, with overlaps $AB=3/5$, $AC=1/3$, and $BC=3/5$. Use threshold $1/2$.`,
      parts:[
        item(56,3,'Find the mask logit for A and B. For each, say whether its sigmoid probability exceeds one half.',
          'Award 1 mark for each logit and 1 for correctly identifying that only A is above one half.',
          step(m`z_j=\sum_r P_{ir}C_{jr},\quad M_{ij}=\sigma(z_j)`,
            m`z_A=2(1/2)+1(-1/2)=1/2,\quad z_B=2(-1/2)+1(1/2)=-1/2`)),
        item(62,3,'Find the Fast NMS column maxima for B and C and list the boxes kept.',
          'Award 1 mark for each maximum and 1 for keeping only A.',
          step(m`K_{kj}=\max_{i<j}X_{kij}`,
            m`K_B=3/5,\quad K_C=\max(1/3,3/5)=3/5\ge1/2`)),
        item(62,2,'What would greedy NMS keep here, and why does it differ?',
          'Greedy NMS keeps A and C (1 mark). It removes B before B could suppress C, whereas Fast NMS compares C with all higher-scoring boxes (1 mark).')
      ]
    },
    {
      title:'Refine boxes and train an HTC mask cascade',
      setup:m`Original proposal IoUs are $0.55,0.65,0.75$. A box stage changes them to $0.65,0.75,0.85$. The next stage uses threshold $0.7$ with a strict greater-than comparison. The three HTC stage sums for box plus mask are $1,2,4$ and the semantic loss is $1/2$.`,
      parts:[
        item(76,2,'How many positives does the strict stage get from the original boxes and from the refined boxes?',
          'One from the original proposals (1 mark) and two from the refined proposals (1 mark).'),
        item(84,2,'At stage 2, which RoI is used to pool features for the box head, and which for the interleaved mask head?',
          'Use the output of stage 1 for box pooling (1 mark) and the newly refined stage-2 RoI for mask pooling (1 mark).'),
        item(89,3,m`Find the total loss with $\alpha=(1,1/2,1/4)$ and $\beta=1$.`,
          'Award 1 mark for stage weighting, 1 for adding semantic loss once, and 1 for the total.',
          step(m`\mathcal L=\sum_t\alpha_t(\mathcal L_{\mathrm{bbox}}^t+\mathcal L_{\mathrm{mask}}^t)
            +\beta\mathcal L_{\mathrm{seg}}`,
            m`\mathcal L=1(1)+(1/2)2+(1/4)4+1(1/2)=7/2`))
      ]
    },
    {
      title:'Track a prompted object and score a later frame',
      setup:'In a simplified SAM 2 memory bank, keep one prompted frame and the two most recent unprompted frames. Frame 1 has the prompt. Frames 2, 3, and 4 have been processed without prompts. On frame 4, the predicted and true masks have 24 pixels each and share 12. Each contour has 16 pixels, of which 12 match on each side.',
      parts:[
        item(105,2,'Which frames remain in the two queues after processing frame 4?',
          'Frame 1 stays in the prompted queue (1 mark). Frames 3 and 4 stay in recent memory and frame 2 is evicted (1 mark).'),
        item(111,2,'Find region J.',
          'Award 1 mark for the union and 1 for the simplified J.',
          step(m`\mathcal J=\frac{|M\cap\widehat M|}{|M|+|\widehat M|-|M\cap\widehat M|}`,
            m`\mathcal J=12/(24+24-12)=1/3`)),
        item(111,3,'Find boundary F and the combined J&F score.',
          'Award 1 mark for both contour ratios, 1 for F, and 1 for J&F.',
          step(m`\mathcal F=\frac{2P_bR_b}{P_b+R_b}`,
            m`P_b=R_b=12/16=3/4,\quad \mathcal F=3/4`),
          step(m`\mathcal J\&\mathcal F=(\mathcal J+\mathcal F)/2`,
            m`\mathcal J\&\mathcal F=(1/3+3/4)/2=13/24`))
      ]
    }
  ],
  theory:[
    item(2,3,'Describe the semantic, instance, and panoptic outputs for a photo containing two people standing on a road.',
      'Semantic labels the people’s pixels as person and labels road (1 mark). Instance gives each person a separate mask (1 mark). Panoptic provides the separate person IDs and the scene-wide labels, including road, in one map (1 mark).'),
    item(10,3,'Why does an FCN fuse earlier and later features? What does PSPNet’s pooling add?',
      'Earlier maps have finer spatial detail (1 mark). Later features support recognition (1 mark). PSPNet adds context pooled over multiple region sizes so the local prediction can use the surrounding scene (1 mark).'),
    item(75,3,'Why can increasing the IoU threshold on fixed proposals hurt training, and how does a cascade help?',
      'A strict threshold leaves fewer positive examples (1 mark). A cascade first refines incoming boxes (1 mark). Later heads train on those refined inputs under stricter criteria (1 mark).'),
    item(85,2,'Distinguish HTC’s interleaved execution from its mask information flow.',
      'Interleaving changes which box supplies mask features within a stage (1 mark). Mask information flow passes intermediate mask features across stages (1 mark).'),
    item(103,2,'Why might a click on a bicycle tire give SAM 2 several plausible masks? How can the user resolve this?',
      'The click could refer to the tire or the entire bicycle (1 mark). Another prompt can clarify the intended region (1 mark).')
  ]
};
