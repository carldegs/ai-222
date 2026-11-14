const math = String.raw;
const item = (slide, marks, prompt, answer, ...steps) => ({slide, marks, prompt, answer, steps});
const step = (formula, substitution, explanation) => ({formula, substitution, explanation});

export const practiceExams = {
  regularization: {
    problems: [
      {
        title: 'Fit the data or pay for larger weights',
        setup: math`Two rent models use the same features and data. Model A has data loss $1$ and weights $(2,-2)$. Model B has data loss $3$ and weights $(1,0)$. Use $J=L+\lambda\theta^T\theta$ with $\lambda=1/2$.`,
        parts: [
          item(5, 2, math`Compute $\theta^T\theta$ for each model.`,
            'Award 1 mark per model.',
            step(math`\theta^T\theta=\sum_j\theta_j^2`,
              math`\begin{aligned}\theta_A^T\theta_A&=2^2+(-2)^2=8\\\theta_B^T\theta_B&=1^2+0^2=1\end{aligned}`)),
          item(5, 3, 'Compute both penalized objectives. Which model does the objective prefer?',
            'B has the smaller objective. Award 1 mark per objective and 1 for the choice.',
            step(math`J=L+\lambda\theta^T\theta`,
              math`\begin{aligned}J_A&=1+\tfrac12(8)=5\\J_B&=3+\tfrac12(1)=\tfrac72\end{aligned}`)),
          item(5, 2, math`At what $\lambda$ do the models tie? Which model does the objective prefer above that value?`,
            'Award 1 mark for the tie value. Above it, B wins because A’s objective rises faster as the penalty gets stronger (1 mark).',
            step(math`L_A+\lambda\theta_A^T\theta_A=L_B+\lambda\theta_B^T\theta_B`,
              math`\begin{aligned}1+8\lambda&=3+\lambda\\7\lambda&=2\\\lambda&=\tfrac27\end{aligned}`)),
          item(2, 2, 'What evidence would you use to choose between these models for deployment? What would you reserve for the final evaluation?',
            'Compare their performance on the same validation data (1 mark). Reserve the test set for the final evaluation after fixing your choice (1 mark).')
        ]
      },
      {
        title: 'Compare likelihood and posterior',
        setup: math`Two parameter settings assign probabilities to the same two observed outcomes. A assigns $(1/2,1/2)$ and B assigns $(3/4,1/4)$. Treat the outcomes as independent given the inputs and parameters. The prior scores for A and B are $1/4$ and $1/2$, respectively.`,
        parts: [
          item(9, 2, 'Find each joint likelihood.',
            'Independence lets you multiply the two probabilities for each setting. Award 1 mark per likelihood.',
            step(math`p(y_1,y_2\mid X,\theta)=p(y_1\mid x_1,\theta)\,p(y_2\mid x_2,\theta)`,
              math`\begin{aligned}p(y_1,y_2\mid X,\theta_A)&=\tfrac12\cdot\tfrac12=\tfrac14\\p(y_1,y_2\mid X,\theta_B)&=\tfrac34\cdot\tfrac14=\tfrac3{16}\end{aligned}`,
              math`The two inputs are $X=(x_1,x_2)$, and their observed outcomes are $y_1$ and $y_2$. The weights for A and B are written $\theta_A$ and $\theta_B$. In each given pair, the first number is $p(y_1\mid x_1,\theta)$ and the second is $p(y_2\mid x_2,\theta)$. So A uses $1/2$ and $1/2$, while B uses $3/4$ and $1/4$. The prior scores enter in part (c).`)),
          item(10, 2, 'Which setting does maximum likelihood estimation (MLE) choose? Explain which has the smaller negative log-likelihood without evaluating any logs.',
            'MLE chooses A because its likelihood is higher (1 mark). Log is increasing and the negative sign reverses the ordering, so A has the smaller negative log-likelihood (1 mark).'),
          item(13, 3, 'Compute the unnormalized posterior score for each setting. Which does maximum a posteriori estimation (MAP) choose?',
            'B has the higher posterior score. Award 1 mark per score and 1 for the choice.',
            step(math`\operatorname{score}(\theta)=p(\mathcal D\mid\theta)\,p(\theta)`,
              math`\begin{aligned}\operatorname{score}(\theta_A)&=\tfrac14\cdot\tfrac14=\tfrac1{16}=\tfrac2{32}\\\operatorname{score}(\theta_B)&=\tfrac3{16}\cdot\tfrac12=\tfrac3{32}\end{aligned}`,
              math`The first factor comes from part (a), and the second is the prior score given in the question. A’s likelihood and prior score both happen to be $1/4$.`))
        ]
      },
      {
        title: 'Train a bird and cat classifier',
        setup: math`Both images are $6$ by $6$ pixels. The bird target is $(1,0)$ and the cat target is $(0,1)$. At a chosen pixel, the bird image has value $3$ and the cat image has value $0$.`,
        parts: [
          item(28, 2, math`Use MixUp with bird weight $\lambda=2/3$. Find the value of the chosen pixel and the new target.`,
            'Award 1 mark for the blended pixel and 1 for the blended target in bird/cat order.',
            step(math`\begin{aligned}\tilde{x}&=\lambda x_1+(1-\lambda)x_2\\\tilde{y}&=\lambda y_1+(1-\lambda)y_2\end{aligned}`,
              math`\begin{aligned}\tilde{x}&=\tfrac23(3)+\tfrac13(0)=2\\\tilde{y}&=\tfrac23(1,0)+\tfrac13(0,1)=(\tfrac23,\tfrac13)\end{aligned}`)),
          item(28, 3, math`On the MixUp image, the model assigns probability $1/4$ to bird and $3/4$ to cat. Compute the cross-entropy with the blended target from part (a). Leave the logs exact.`,
            'Award 1 mark for each weighted log term and 1 for adding them. The weights come from the target; the values inside the logs come from the prediction.',
            step(math`\mathrm{CE}(\tilde y,p)=-\sum_c\tilde y_c\ln p_c`,
              math`\begin{aligned}\mathrm{CE}(\tilde y,p)&=-\tfrac23\ln(\tfrac14)-\tfrac13\ln(\tfrac34)\\&=\tfrac43\ln 2+\tfrac13\ln(\tfrac43)\end{aligned}`)),
          item(29, 2, 'For CutMix, paste a 2-by-3 cat patch fully inside the bird image. Find the pasted fraction and the target.',
            'Award 1 mark for the pasted fraction and 1 for the area-weighted target.',
            step(math`\begin{aligned}1-\lambda&=\frac{\text{pasted area}}{\text{total area}}\\\tilde{y}&=\lambda y_1+(1-\lambda)y_2\end{aligned}`,
              math`\begin{aligned}1-\lambda&=\frac{2\cdot3}{6\cdot6}=\tfrac16\\\tilde{y}&=\tfrac56(1,0)+\tfrac16(0,1)=(\tfrac56,\tfrac16)\end{aligned}`)),
          item(27, 2, 'If you erased that region of the bird image with CutOut, what target would you use and under what assumption?',
            'Keep the original bird target (1 mark), assuming the remaining image still provides enough evidence for that label (1 mark).'),
          item(32, 2, math`In RandAugment you want to keep drawing two operations per image, but make ShearX less severe when it is drawn. What happens to $N$ and $M$?`,
            'Keep the operation count N at two (1 mark). Lower the strength M so ShearX is milder when selected (1 mark).')
        ]
      },
      {
        title: 'Train with dropout and pick a checkpoint',
        setup: math`A classifier uses inverted dropout with keep probability $p=3/4$. One unit has activation $h=9$ before masking. A full run recorded validation losses $6,3,3,4,2$ at epochs 1 through 5. Replay those scores with a rule that stops after two consecutive checks without a strict improvement.`,
        parts: [
          item(43, 2, 'Give both possible training outputs and their probabilities.',
            'Award 1 mark for each output and probability pair.',
            step(math`\tilde h=\begin{cases}h/p & \text{with probability }p\\0 & \text{with probability }1-p\end{cases}`,
              math`\tilde h=\begin{cases}9/(\tfrac34)=12 & \text{with probability }\tfrac34\\0 & \text{with probability }\tfrac14\end{cases}`)),
          item(43, 2, 'Compute the expected training output and give the ordinary evaluation output for the same activation.',
            'Award 1 mark for the expected output. At evaluation, disable the mask and use the original activation of 9 (1 mark).',
            step(math`\mathbb E[\tilde h]=p(h/p)+(1-p)\cdot 0`,
              math`\mathbb E[\tilde h]=\tfrac34(12)+\tfrac14(0)=9`)),
          item(41, 3, 'When does training stop, which checkpoint is restored, and does the run reach the lowest value in the listed sequence?',
            'Stop at epoch 4, after a tie and then a worse loss (1 mark). Restore epoch 2 (1 mark). Epoch 5 is never reached under this rule (1 mark).')
        ]
      },
      {
        title: 'Compare two settings across folds',
        setup: math`You have $80$ development images split into four equal folds. Candidate A’s validation accuracies are $1/2,3/4,3/4,1$. Candidate B’s are $3/4,1,3/4,1$. A separate test set is available.`,
        parts: [
          item(44, 2, 'How many images are used for training and validation in each fit? How many fits are needed to compare both candidates?',
            'Award 1 mark for both split sizes and 1 for the total number of fits.',
            step(math`\begin{aligned}N_{\rm val}&=N/K\\N_{\rm train}&=N-N_{\rm val}\\\text{Total fits}&=\text{candidates}\times K\end{aligned}`,
              math`\begin{aligned}N_{\rm val}&=80/4=20\\N_{\rm train}&=80-20=60\\\text{Total fits}&=2\cdot4=8\end{aligned}`)),
          item(44, 3, 'Find both mean accuracies and select a candidate by that metric.',
            'Choose B by mean validation accuracy. Award 1 mark per mean and 1 for the choice.',
            step(math`\bar s=\frac1K\sum_{k=1}^K s_k`,
              math`\begin{aligned}\bar s_A&=\tfrac14(\tfrac12+\tfrac34+\tfrac34+1)=\tfrac34\\\bar s_B&=\tfrac14(\tfrac34+1+\tfrac34+1)=\tfrac78\end{aligned}`)),
          item(44, 2, 'A classmate wants to estimate normalization statistics from all 80 images before running the folds. How should the procedure change, and why?',
            'In each fit, estimate the statistics on the three training folds and apply them to the held-out fold (1 mark). Using all 80 would let information from the held-out images enter the fit (1 mark).')
        ]
      }
    ],
    theory: [
      item(14, 2, 'Explain what is Gaussian in Gaussian regression and what is Gaussian in a zero-mean Gaussian prior on weights. Which gives the L2 penalty?',
        'Gaussian regression models the target residuals around the predictions (1 mark). The prior models preferences over weights and gives an L2 penalty when its covariance is isotropic (1 mark).'),
      item(30, 2, 'Two augmented views of a cat lead to the same wrong prediction. What does this show about agreement? What learning signal is still needed?',
        'The views agree even though the prediction is wrong (1 mark). The supervised objective must still reward correct predictions (1 mark).'),
      item(40, 2, 'How does sharing a backbone across tasks differ from tying weights in a two-branch Siamese network?',
        'Multi-task learning uses a shared representation to support different task heads (1 mark). The Siamese example runs the same encoder on separate inputs (1 mark).'),
      item(18, 2, 'A flexible curve gets very low training error but high held-out error. Name the likely issue and explain how it can arise.',
        'Overfitting (1 mark). The curve can follow sample-specific noise or quirks that do not recur in held-out examples (1 mark).')
    ]
  },
  optimization: {
    problems: [
      {
        title: 'Estimate the direction of an SGD step',
        setup: math`A model gives per-example losses $1,5,2,4$ on four training examples. At current weight $\theta=3$, a minibatch of two examples has scalar gradients $-2$ and $4$. Use learning rate $\epsilon=1/2$.`,
        parts: [
          item(4, 2, 'Find the empirical risk on all four examples.',
            'Award 1 mark for adding the four losses correctly and 1 for averaging.',
            step(math`L(\theta)=\frac1m\sum_{i=1}^m\ell_i`,
              math`L(\theta)=\frac{1+5+2+4}{4}=\frac{12}{4}=3`)),
          item(5, 2, 'Find the minibatch gradient. Explain why the result can differ across minibatches at the same weight.',
            'Award 1 mark for the mean. Different minibatches contain different examples, which can contribute different gradients (1 mark).',
            step(math`g=\frac1m\sum_{i=1}^m g_i`,
              math`g=\frac{-2+4}{2}=1`)),
          item(18, 2, 'Compute the next weight under SGD.',
            'Award 1 mark for the SGD rule and 1 for the next weight.',
            step(math`\theta_{\rm next}=\theta-\epsilon g`,
              math`\theta_{\rm next}=3-\tfrac12(1)=\tfrac52`)),
          item(17, 2, math`In a separate full-batch example, $L(\theta)=\theta^2/2$. Start at $\theta=2$ and use $\epsilon=3$. Compute the new weight and compare the losses.`,
            'Award 1 mark for the next weight. The loss rises, illustrating overshoot (1 mark for the comparison).',
            step(math`\begin{aligned}g(\theta)&=\frac{d}{d\theta}(\theta^2/2)=\theta\\\theta_{\rm next}&=\theta-\epsilon g(\theta)\end{aligned}`,
              math`\begin{aligned}g(2)&=2\\\theta_{\rm next}&=2-3(2)=-4\end{aligned}`,
              math`The question gives the loss $L(\theta)$. The update needs its slope $g(\theta)$, so differentiate with respect to the weight $\theta$. The power rule gives $\tfrac12(2\theta)=\theta$. Evaluate that slope at the starting weight, then use the original loss to compare the two weights.`),
            step(math`L(\theta)=\theta^2/2`,
              math`\begin{aligned}L(2)&=2^2/2=2\\L(-4)&=(-4)^2/2=8\end{aligned}`))
        ]
      },
      {
        title: 'Separate minibatch noise from bias',
        setup: math`At a fixed weight, a small training set has four examples with scalar gradients $0,0,4,4$. Each draw picks one of the four examples with equal probability. For a two-draw minibatch, put the first example back before drawing again, so the draws are independent and the same example can appear twice. Treat variance as the mean squared distance from the expected gradient.`,
        parts: [
          item(5, 3, 'Find the full-data gradient and the expected gradient and variance of a one-draw batch.',
            'Award 1 mark each for the full-data mean, the same expected value for a uniform draw, and the variance.',
            step(math`g_{\rm full}=\frac1N\sum_{i=1}^N g_i,\quad \mathbb E[g_1]=\tfrac12(0)+\tfrac12(4)`,
              math`g_{\rm full}=\frac{0+0+4+4}{4}=2,\qquad \mathbb E[g_1]=2`,
              'Two of the four examples have each gradient value, so a uniform draw gives either value with probability 1/2.'),
            step(math`\operatorname{Var}(g_1)=\mathbb E[(g_1-\mathbb E[g_1])^2]`,
              math`\operatorname{Var}(g_1)=\big[(0-2)^2+(4-2)^2\big]/2=4`)),
          item(5, 3, 'List the four equally likely ordered pairs of gradient values for two draws. Compute the average for each pair, then find the mean and variance of those averages.',
            'Award 1 mark each for the four averages including the repeated value, the mean, and the variance.',
            step(math`g=\frac{g_1+g_2}{2}`,
              math`\tfrac{0+0}{2}=0,\quad \tfrac{0+4}{2}=2,\quad \tfrac{4+0}{2}=2,\quad \tfrac{4+4}{2}=4`),
            step(math`\operatorname{Var}(g)=\mathbb E[(g-\mathbb E[g])^2]`,
              math`\begin{aligned}\mathbb E[g]&=(0+2+2+4)/4=2\\\operatorname{Var}(g)&=(4+0+0+4)/4=2\end{aligned}`)),
          item(5, 2, 'Which result shows that the estimates are unbiased? Which result shows the larger batch is less noisy?',
            'Both batch sizes have an expected gradient equal to the full-data gradient (1 mark). The larger batch has lower variance (1 mark).')
        ]
      },
      {
        title: 'Compare two uses of momentum',
        setup: math`Let $L(\theta)=\theta^2/4$, so $g(\theta)=\theta/2$. Start each method at $\theta=4$ and previous velocity $v=-2$. Use $\alpha=1/2$ and $\epsilon=1/2$. Use the deck’s convention of adding the new velocity to the weight.`,
        parts: [
          item(21, 3, 'Find the gradient, new velocity, and next weight for ordinary momentum.',
            'Award 1 mark each for the gradient, new velocity, and next weight.',
            step(math`\begin{aligned}g(\theta)&=\theta/2\\v_{\rm next}&=\alpha v-\epsilon g(\theta)\\\theta_{\rm next}&=\theta+v_{\rm next}\end{aligned}`,
              math`\begin{aligned}g(4)&=4/2=2\\v_{\rm next}&=\tfrac12(-2)-\tfrac12(2)=-2\\\theta_{\rm next}&=4+(-2)=2\end{aligned}`)),
          item(23, 3, 'Find the lookahead position and its gradient, then compute the next weight for Nesterov momentum.',
            'Award 1 mark each for the lookahead position, its gradient, and the next weight.',
            step(math`\begin{aligned}\theta_{\rm look}&=\theta+\alpha v\\g(\theta_{\rm look})&=\theta_{\rm look}/2\end{aligned}`,
              math`\begin{aligned}\theta_{\rm look}&=4+\tfrac12(-2)=3\\g(3)&=\tfrac32\end{aligned}`),
            step(math`\begin{aligned}v_{\rm next}&=\alpha v-\epsilon g(\theta_{\rm look})\\\theta_{\rm next}&=\theta+v_{\rm next}\end{aligned}`,
              math`\begin{aligned}v_{\rm next}&=\tfrac12(-2)-\tfrac12(\tfrac32)=-\tfrac74\\\theta_{\rm next}&=4-\tfrac74=\tfrac94\end{aligned}`)),
          item(20, 2, 'Explain why retaining velocity can reduce zigzagging in a narrow valley.',
            'The sideways gradient tends to alternate and partly cancels in the velocity (1 mark). Components that consistently point along the valley accumulate (1 mark).')
        ]
      },
      {
        title: 'Track the history of a gradient',
        setup: math`Consider a single weight with current gradient $g=-4$ and learning rate $\epsilon=1/4$. Ignore $\delta$ for these calculations. Treat each method independently.`,
        parts: [
          item(25, 2, math`For AdaGrad, the previous squared-gradient sum is $r=9$. Find the updated sum and the signed change in the weight.`,
            'Award 1 mark for the updated sum and 1 for the signed change.',
            step(math`\begin{aligned}r_{\rm next}&=r+g^2\\\Delta\theta&=-\frac{\epsilon g}{\delta+\sqrt{r_{\rm next}}}\end{aligned}`,
              math`\begin{aligned}r_{\rm next}&=9+(-4)^2=25\\\Delta\theta&=-\frac{\tfrac14(-4)}{\sqrt{25}}=\tfrac15\end{aligned}`)),
          item(27, 2, math`For RMSProp, the previous squared-gradient average is $r=2$. Use $\rho=1/2$ and find the updated average and signed change in the weight.`,
            'Award 1 mark for the updated average and 1 for the signed change.',
            step(math`\begin{aligned}r_{\rm next}&=\rho r+(1-\rho)g^2\\\Delta\theta&=-\frac{\epsilon g}{\delta+\sqrt{r_{\rm next}}}\end{aligned}`,
              math`\begin{aligned}r_{\rm next}&=\tfrac12(2)+\tfrac12(-4)^2=9\\\Delta\theta&=-\frac{\tfrac14(-4)}{\sqrt{9}}=\tfrac13\end{aligned}`)),
          item(29, 4, math`For Adam, this is the first step with $s_0=r_0=0$ and $\rho_1=\rho_2=1/2$. Find the raw and corrected moments, then the signed weight change.`,
            'Award 1 mark for both raw moments, 1 for each corrected moment, and 1 for the signed change.',
            step(math`\begin{aligned}s_t&=\rho_1 s_{t-1}+(1-\rho_1)g_t\\r_t&=\rho_2 r_{t-1}+(1-\rho_2)g_t^2\end{aligned}`,
              math`\begin{aligned}s_1&=\tfrac12(0)+\tfrac12(-4)=-2\\r_1&=\tfrac12(0)+\tfrac12(-4)^2=8\end{aligned}`),
            step(math`\begin{aligned}\hat s_t&=\frac{s_t}{1-\rho_1^t}\\\hat r_t&=\frac{r_t}{1-\rho_2^t}\end{aligned}`,
              math`\begin{aligned}\hat s_1&=\frac{-2}{1-\tfrac12}=-4\\\hat r_1&=\frac{8}{1-\tfrac12}=16\end{aligned}`),
            step(math`\Delta\theta=-\frac{\epsilon\hat s_t}{\delta+\sqrt{\hat r_t}}`,
              math`\Delta\theta=-\frac{\tfrac14(-4)}{\sqrt{16}}=\tfrac14`))
        ]
      },
      {
        title: 'Set the starting scale and the training pace',
        setup: math`A layer has fan-in $m=8$ and fan-out $n=24$. A training schedule warms up linearly from zero at epoch 0 to $\epsilon_0=1/4$ at epoch 4. Then it uses cosine decay to $\epsilon_{\min}=0$ at epoch 12.`,
        parts: [
          item(13, 2, 'Find the Glorot normal variance and standard deviation for this layer.',
            'Award 1 mark for the variance and 1 for the standard deviation.',
            step(math`\begin{aligned}\sigma^2&=\frac{2}{m+n}\\\sigma&=\sqrt{\sigma^2}\end{aligned}`,
              math`\begin{aligned}\sigma^2&=\frac{2}{8+24}=\tfrac1{16}\\\sigma&=\sqrt{\tfrac1{16}}=\tfrac14\end{aligned}`)),
          item(14, 2, 'Find the He normal variance and standard deviation for this layer.',
            'Award 1 mark for the variance and 1 for the standard deviation.',
            step(math`\begin{aligned}\sigma^2&=\frac{2}{m}\\\sigma&=\sqrt{\sigma^2}\end{aligned}`,
              math`\begin{aligned}\sigma^2&=\frac{2}{8}=\tfrac14\\\sigma&=\sqrt{\tfrac14}=\tfrac12\end{aligned}`)),
          item(42, 3, 'Find the learning rates at epochs 2, 4, and 8.',
            'Here W is the warmup length and T is the final epoch. The cosine phase measures time since warmup ended. Award 1 mark per rate.',
            step(math`\epsilon(e)=\epsilon_0\frac{e}{W}\quad(e<W)`,
              math`\epsilon(2)=\tfrac14\cdot\tfrac24=\tfrac18`),
            step(math`\epsilon(e)=\epsilon_{\min}+\frac{\epsilon_0-\epsilon_{\min}}2\left(1+\cos\!\frac{\pi(e-W)}{T-W}\right)\quad(e\ge W)`,
              math`\begin{aligned}\epsilon(4)&=0+\tfrac18(1+\cos 0)=\tfrac14\\\epsilon(8)&=0+\tfrac18(1+\cos(\pi/2))=\tfrac18\end{aligned}`))
        ]
      }
    ],
    theory: [
      item(7, 2, 'A differentiable loss has zero gradient at a point. Why could it still have a nearby downhill direction? Name the type of point and describe its shape.',
        'It could be a saddle point (1 mark). Nearby directions can go downhill in some directions and uphill in others even when the gradient is zero at the point (1 mark).'),
      item(8, 2, 'What does gradient norm clipping do when a gradient exceeds the cap? Why does it offer little help for a vanishing gradient?',
        'It scales down the gradient to the cap while preserving its direction (1 mark). A tiny gradient lies below the cap and remains tiny (1 mark).'),
      item(27, 2, 'Why can AdaGrad’s effective rates keep shrinking, and how does RMSProp address that mechanism?',
        'AdaGrad keeps adding squared gradients, so its denominator grows with the accumulated history (1 mark). RMSProp uses a moving average that lets old contributions fade (1 mark).'),
      item(44, 2, 'Adam reaches lower training loss than SGD with momentum on one run. What additional evidence would you want before choosing it, and why?',
        'Compare validation performance on the same task and evaluation setup (1 mark). Lower training loss alone does not show better performance on unseen examples (1 mark).')
    ]
  }
};
