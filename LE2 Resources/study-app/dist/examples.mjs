// Original practice problems. $...$ marks authored inline KaTeX; math fields are display equations.
export const examples = [
  {
    "topic": 0,
    "title": "From examples to a minibatch update",
    "kind": "Computation",
    "slide": 4,
    "problem": "A scalar model predicts $\\theta$ for every input. Use squared error $\\ell=(\\theta-y)^2$, with no factor of $\\frac{1}{2}$. At $\\theta = 3$, the two targets are 1 and 3. Find the empirical risk, the mean gradient, and one SGD update with $\\epsilon = \\frac{1}{2}$.",
    "hint": "Compute each loss and derivative at the same $\\theta$, then average separately.",
    "solution": [
      {
        "text": "Evaluate the two losses at $\\theta = 3$.",
        "math": "\\ell_1=(3-1)^2=4,\\qquad\\ell_2=(3-3)^2=0"
      },
      {
        "text": "Average the losses over the two samples.",
        "math": "L(3)=\\frac{4+0}{2}=2"
      },
      {
        "text": "Differentiate each squared error and average the gradients.",
        "math": "g=\\frac{2(3-1)+2(3-3)}{2}=\\frac{4+0}{2}=2"
      },
      {
        "text": "Apply one step using the mean gradient.",
        "math": "\\theta_{\\mathrm{new}}=3-\\frac12(2)=2"
      }
    ],
    "takeaway": "The average loss is 2, the gradient is 2, and the updated parameter is 2. Loss values and gradients are different quantities even when their numbers happen to match.",
    "trap": "The derivative is 2($\\theta$ − y), not $\\theta$ − y, because this problem does not put $\\frac{1}{2}$ in front of the squared loss.",
    "practice": {
      "problem": "Keep the same loss, but use $\\theta = 2$ and targets 0 and 4. Find the average loss and mean gradient. Does an SGD step change $\\theta$?",
      "solution": [
        {
          "text": "The two losses are both 4.",
          "math": "L(2)=\\frac{(2-0)^2+(2-4)^2}{2}=4"
        },
        {
          "text": "The two gradients cancel.",
          "math": "g=\\frac{4+(-4)}2=0,\\qquad\\theta_{\\mathrm{new}}=2"
        },
        {
          "text": "A zero mean gradient does not require each individual loss to be zero. Here $\\theta = 2$ is the best constant prediction for these two targets."
        }
      ]
    }
  },
  {
    "topic": 1,
    "title": "A zero gradient that is not a minimum",
    "kind": "Theory + computation",
    "slide": 7,
    "problem": "Consider the illustrative loss $L(x,y)=x^2-y^2$. Classify the point (0, 0). Show why checking only the gradient gives an incomplete answer.",
    "hint": "Compare a small move along the x-axis with a small move along the y-axis.",
    "solution": [
      {
        "text": "Compute the gradient and evaluate it at the origin.",
        "math": "\\nabla L=(2x,-2y),\\qquad\\nabla L(0,0)=(0,0)"
      },
      {
        "text": "Move a nonzero distance a along each coordinate axis.",
        "math": "L(a,0)=a^2>0,\\qquad L(0,a)=-a^2<0"
      },
      {
        "text": "The loss increases in one direction and decreases in another, so the origin is a saddle, not a local minimum.",
        "math": "H=\\begin{pmatrix}2&0\\\\0&-2\\end{pmatrix}"
      },
      {
        "text": "The Hessian eigenvalues 2 and −2 confirm mixed curvature. This is an illustrative mathematical example, not a loss function specified in the deck."
      }
    ],
    "takeaway": "Stationarity is a first-order condition; it does not establish a minimum or global optimality.",
    "trap": "A saddle need not be a local maximum or minimum. Do not infer the point’s type from gradient magnitude alone.",
    "practice": {
      "problem": "A different training run has gradient (6, 8). Apply norm clipping with cap $c = 5$. What is the clipped vector, and does clipping change its direction?",
      "solution": [
        {
          "text": "Compute the gradient norm.",
          "math": "\\lVert g\\rVert_2=\\sqrt{6^2+8^2}=10"
        },
        {
          "text": "Apply the same scale factor to both coordinates.",
          "math": "g_{\\mathrm{clip}}=\\frac5{10}(6,8)=(3,4)"
        },
        {
          "text": "The norm is now 5 and the direction is preserved. Clipping caps magnitude; it does not resolve every landscape difficulty."
        }
      ]
    }
  },
  {
    "topic": 2,
    "title": "Variance is not standard deviation",
    "kind": "Computation",
    "slide": 13,
    "problem": "A layer has fan-in $m = 2$ and fan-out $n = 6$. Compute the variance and standard deviation for both Glorot normal and He normal initialization. Which scale is designed for rectifiers?",
    "hint": "The square root converts variance into standard deviation.",
    "solution": [
      {
        "text": "For Glorot normal, use both fan-in and fan-out.",
        "math": "\\operatorname{Var}(W)=\\frac2{m+n}=\\frac28=\\frac14"
      },
      {
        "text": "Take the square root to obtain its normal scale.",
        "math": "\\sigma_{\\mathrm{Glorot}}=\\sqrt{\\frac14}=\\frac12"
      },
      {
        "text": "For He normal, use fan-in only.",
        "math": "\\operatorname{Var}(W)=\\frac2m=1,\\qquad\\sigma_{\\mathrm{He}}=1"
      },
      {
        "text": "He initialization is designed around rectifier nonlinearities such as ReLU. It gives a larger variance in this example."
      }
    ],
    "takeaway": "Glorot: variance $\\frac{1}{4}$, standard deviation $\\frac{1}{2}$. He: variance 1, standard deviation 1.",
    "trap": "Normal standard deviation and uniform bounds use different formulas; do not substitute one for the other.",
    "practice": {
      "problem": "A ReLU layer has fan-in 8 and fan-out 16. Find He normal variance and standard deviation. Does fan-out enter this formula?",
      "solution": [
        {
          "text": "Use fan-in 8.",
          "math": "\\operatorname{Var}(W)=\\frac28=\\frac14"
        },
        {
          "text": "Take its square root.",
          "math": "\\sigma=\\frac12"
        },
        {
          "text": "Fan-out does not enter this fan-in version of He initialization."
        }
      ]
    }
  },
  {
    "topic": 3,
    "title": "Recompute the gradient at every step",
    "kind": "Computation",
    "slide": 18,
    "problem": "For $L(\\theta)=\\frac{\\theta^2}{2}$, start at $\\theta_{0} = 4$. Use gradient descent with $\\epsilon = \\frac{1}{2}$ for two steps. Find $\\theta_{1}$, $\\theta_{2}$, and the loss at each point.",
    "hint": "The derivative is $\\theta$, so it changes after the first update.",
    "solution": [
      {
        "text": "Differentiate the loss.",
        "math": "g(\\theta)=\\theta,\\qquad L(4)=8"
      },
      {
        "text": "Use $g_{0} = 4$ for the first step.",
        "math": "\\theta_1=4-\\frac12(4)=2,\\qquad L(2)=2"
      },
      {
        "text": "Recompute the gradient at $\\theta_{1} = 2$.",
        "math": "\\theta_2=2-\\frac12(2)=1,\\qquad L(1)=\\frac12"
      }
    ],
    "takeaway": "The parameters follow 4 → 2 → 1; the losses follow 8 → 2 → $\\frac{1}{2}$. This deterministic one-dimensional example isolates the update rule used in SGD.",
    "trap": "Reusing the first gradient would incorrectly give $\\theta_{2} = 0$.",
    "practice": {
      "problem": "For the same loss, start at $\\theta = 2$ but use $\\epsilon = 3$. Find one update and compare the old and new losses. Does subtracting a gradient guarantee a decrease?",
      "solution": [
        {
          "text": "Compute the update.",
          "math": "\\theta_{\\mathrm{new}}=2-3(2)=-4"
        },
        {
          "text": "Compare loss values.",
          "math": "L(2)=2,\\qquad L(-4)=8"
        },
        {
          "text": "The loss increases. A step can overshoot when the learning rate is too large, even for this convex objective."
        }
      ]
    }
  },
  {
    "topic": 4,
    "title": "Carry momentum across two updates",
    "kind": "Computation",
    "slide": 21,
    "problem": "Start with $\\theta_{0} = 3$ and $v_{0} = 0$. Set $\\alpha = \\frac{1}{2}$ and $\\epsilon = \\frac{1}{2}$. The gradients at the two successive parameter values are given as $g_{0} = 2$ and $g_{1} = 2$. Find both velocities and parameter values.",
    "hint": "Update velocity first, then add the new velocity to $\\theta$.",
    "solution": [
      {
        "text": "The first velocity has no history contribution.",
        "math": "v_1=\\frac12(0)-\\frac12(2)=-1"
      },
      {
        "text": "Apply the first parameter update.",
        "math": "\\theta_1=3+(-1)=2"
      },
      {
        "text": "The next velocity retains half of the previous velocity.",
        "math": "v_2=\\frac12(-1)-\\frac12(2)=-\\frac32"
      },
      {
        "text": "Add the new velocity.",
        "math": "\\theta_2=2-\\frac32=\\frac12"
      }
    ],
    "takeaway": "With the same signed gradient twice, the second move is larger because momentum carries history forward.",
    "trap": "The velocity already includes the negative learning-rate factor. Do not subtract $\\epsilon$v again.",
    "practice": {
      "problem": "Keep $\\theta_{1} = 2$ and $v_{1} = -1$, but let the next gradient reverse to $g_{1} = -2$. With the same $\\alpha$ and $\\epsilon$, find $v_{2}$ and $\\theta_{2}$.",
      "solution": [
        {
          "text": "Combine old velocity with the reversed gradient.",
          "math": "v_2=\\frac12(-1)-\\frac12(-2)=\\frac12"
        },
        {
          "text": "Apply the new velocity.",
          "math": "\\theta_2=2+\\frac12=\\frac52"
        },
        {
          "text": "Momentum partially offsets the reversed gradient instead of ignoring history."
        }
      ]
    }
  },
  {
    "topic": 4,
    "title": "Nesterov: evaluate at the lookahead",
    "kind": "Computation",
    "slide": 23,
    "problem": "Let $L(\\theta)=\\frac{\\theta^2}{2}$. At $\\theta = 2$ and $v = -1$, use $\\alpha = \\frac{1}{2}$ and $\\epsilon = \\frac{1}{2}$. Compute a Nesterov update and compare it with ordinary momentum from the same state.",
    "hint": "For Nesterov, the gradient equals the lookahead parameter in this quadratic example.",
    "solution": [
      {
        "text": "Compute the lookahead using the old velocity.",
        "math": "\\theta_{\\mathrm{look}}=2+\\frac12(-1)=\\frac32"
      },
      {
        "text": "Evaluate the gradient there and update velocity.",
        "math": "g_{\\mathrm{look}}=\\frac32,\\qquad v_{\\mathrm{new}}=\\frac12(-1)-\\frac12\\left(\\frac32\\right)=-\\frac54"
      },
      {
        "text": "Add the new velocity to the original parameter, not to the lookahead.",
        "math": "\\theta_{\\mathrm{new}}=2-\\frac54=\\frac34"
      },
      {
        "text": "Ordinary momentum evaluates the gradient at $\\theta = 2$ instead.",
        "math": "v_{\\mathrm{ordinary}}=-\\frac12-1=-\\frac32,\\qquad\\theta_{\\mathrm{ordinary}}=\\frac12"
      }
    ],
    "takeaway": "The evaluation point changes the gradient and therefore the resulting step. This comparison does not establish that one method is always better.",
    "trap": "Adding the velocity to the lookahead would count the old momentum contribution twice.",
    "practice": {
      "problem": "Use the same loss and coefficients, now with $\\theta = 4$ and $v = -2$. Find the lookahead, new velocity, and new parameter for Nesterov.",
      "solution": [
        {
          "text": "Look ahead and differentiate.",
          "math": "\\theta_{\\mathrm{look}}=4+\\frac12(-2)=3,\\qquad g_{\\mathrm{look}}=3"
        },
        {
          "text": "Update velocity and then the original parameter.",
          "math": "v_{\\mathrm{new}}=-1-\\frac32=-\\frac52,\\qquad\\theta_{\\mathrm{new}}=4-\\frac52=\\frac32"
        }
      ]
    }
  },
  {
    "topic": 5,
    "title": "AdaGrad works coordinate by coordinate",
    "kind": "Computation",
    "slide": 25,
    "problem": "Let $\\theta=(3,1)$, the previous accumulator $r=(0,9)$, and gradient $g=(2,-4)$. Use $\\epsilon = 1$ and ignore $\\delta$ for this exercise. Find the new accumulator, update vector, and parameters.",
    "hint": "Square gradients elementwise; do not use a vector norm in the denominator.",
    "solution": [
      {
        "text": "Accumulate squared gradients separately.",
        "math": "r_{\\mathrm{new}}=(0,9)+(4,16)=(4,25)"
      },
      {
        "text": "Take elementwise square roots.",
        "math": "\\sqrt{r_{\\mathrm{new}}}=(2,5)"
      },
      {
        "text": "Normalize each gradient coordinate, keeping its sign.",
        "math": "\\Delta\\theta=\\left(-\\frac22,-\\frac{-4}{5}\\right)=\\left(-1,\\frac45\\right)"
      },
      {
        "text": "Add the update to the old parameters.",
        "math": "\\theta_{\\mathrm{new}}=\\left(2,\\frac95\\right)"
      }
    ],
    "takeaway": "A negative gradient increases its parameter. Squaring the gradient in r does not erase the sign of the numerator.",
    "trap": "Use the new accumulator, not the previous one. Ignoring $\\delta$ is safe here because the new denominators are nonzero.",
    "practice": {
      "problem": "For one coordinate, previous $r = 9$, $g = -4$, and $\\epsilon = \\frac{1}{2}$. Ignore $\\delta$. Compute the new accumulator and parameter change.",
      "solution": [
        {
          "text": "Accumulate the square.",
          "math": "r_{\\mathrm{new}}=9+16=25"
        },
        {
          "text": "Compute the signed change.",
          "math": "\\Delta\\theta=-\\frac{(1/2)(-4)}{\\sqrt{25}}=\\frac25"
        }
      ]
    }
  },
  {
    "topic": 6,
    "title": "RMSProp forgets old large gradients",
    "kind": "Computation",
    "slide": 27,
    "problem": "For a scalar parameter $\\theta = 3$, let the previous squared-gradient average be $r = 4$, the current gradient be $g = 4$, and $\\rho = \\frac{3}{4}$. Use $\\epsilon = \\frac{1}{2}$, ignore $\\delta$, and compute one RMSProp update.",
    "hint": "The new squared gradient receives weight 1 − $\\rho$, not $\\rho$.",
    "solution": [
      {
        "text": "Mix old history with the current squared gradient.",
        "math": "r_{\\mathrm{new}}=\\frac34(4)+\\frac14(16)=7"
      },
      {
        "text": "The resulting update is exact, even without a decimal square root.",
        "math": "\\Delta\\theta=-\\frac{(1/2)(4)}{\\sqrt7}=-\\frac2{\\sqrt7}"
      },
      {
        "text": "Apply the update.",
        "math": "\\theta_{\\mathrm{new}}=3-\\frac2{\\sqrt7}"
      },
      {
        "text": "In a no-calculator exam, an exact radical can be the appropriate final form unless a numerical approximation is requested."
      }
    ],
    "takeaway": "RMSProp uses a weighted average rather than adding 16 directly to the old value of 4.",
    "trap": "Do not confuse the gradient’s sign with its squared contribution to r.",
    "practice": {
      "problem": "Let $r = 16$ and the current gradient be 0, with $\\rho = \\frac{3}{4}$. What are the new accumulator and update? Contrast this with AdaGrad from the same r.",
      "solution": [
        {
          "text": "RMSProp discounts the old state even with zero current gradient.",
          "math": "r_{\\mathrm{new}}=\\frac34(16)+\\frac14(0)=12,\\qquad\\Delta\\theta=0"
        },
        {
          "text": "AdaGrad does not forget the old state.",
          "math": "r_{\\mathrm{new,AdaGrad}}=16+0=16"
        },
        {
          "text": "This directly illustrates why the RMSProp accumulator need not increase monotonically."
        }
      ]
    }
  },
  {
    "topic": 7,
    "title": "Adam, including both bias corrections",
    "kind": "Computation",
    "slide": 29,
    "problem": "Start Adam at $\\theta_{0} = 3$ with $s_0=r_0=0$. At the first step $g_{1} = 2$. Use $\\rho_1=\\rho_2=\\frac12$ and $\\epsilon = \\frac{1}{10}$; ignore $\\delta$. Find the raw moments, corrected moments, and new parameter.",
    "hint": "At $t = 1$, both correction denominators are $1-\\frac12=\\frac12$.",
    "solution": [
      {
        "text": "Update the first and second raw moments.",
        "math": "s_1=\\frac12(0)+\\frac12(2)=1,\\qquad r_1=\\frac12(0)+\\frac12(4)=2"
      },
      {
        "text": "Correct both estimates for initialization at zero.",
        "math": "\\hat s_1=\\frac1{1-1/2}=2,\\qquad\\hat r_1=\\frac2{1-1/2}=4"
      },
      {
        "text": "Normalize with the square root of the corrected second moment.",
        "math": "\\Delta\\theta_1=-\\frac{(1/10)(2)}{\\sqrt4}=-\\frac1{10}"
      },
      {
        "text": "Apply the update.",
        "math": "\\theta_1=3-\\frac1{10}=\\frac{29}{10}"
      }
    ],
    "takeaway": "Adam’s two memories have different jobs: s tracks a signed average, while r tracks a squared scale.",
    "trap": "Correction uses $1-\\rho^t$. At $t = 0$ that denominator is zero, so increment the time step before correcting.",
    "practice": {
      "problem": "Continue from $s_{1} = 1$, $r_{1} = 2$, $\\theta_{1} = \\frac{29}{10}$ with $g_{2} = 2$ and the same settings. Compute the second update.",
      "solution": [
        {
          "text": "Update the raw moments.",
          "math": "s_2=\\frac12(1)+\\frac12(2)=\\frac32,\\qquad r_2=\\frac12(2)+\\frac12(4)=3"
        },
        {
          "text": "At $t = 2$ the denominator is $1-(\\frac12)^2=\\frac34$.",
          "math": "\\hat s_2=\\frac{3/2}{3/4}=2,\\qquad\\hat r_2=\\frac3{3/4}=4"
        },
        {
          "text": "The corrected moments match the constant gradient and its square.",
          "math": "\\Delta\\theta_2=-\\frac1{10},\\qquad\\theta_2=\\frac{28}{10}=\\frac{14}5"
        }
      ]
    }
  },
  {
    "topic": 8,
    "title": "Read a schedule at exact boundaries",
    "kind": "Computation",
    "slide": 34,
    "problem": "Cosine decay starts at $\\epsilon_{0} = \\frac{1}{10}$ and ends at $\\epsilon_{\\min}$ = $\\frac{1}{50}$ after $T = 100$ epochs. Find the learning rate at epochs 0, 50, and 100 without a calculator.",
    "hint": "Use $\\cos(0)=1$, $\\cos(\\pi/2)=0$, and $\\cos(\\pi)=-1$.",
    "solution": [
      {
        "text": "Compute the half-range once.",
        "math": "\\frac{\\epsilon_0-\\epsilon_{\\min}}2=\\frac{1/10-1/50}2=\\frac1{25}"
      },
      {
        "text": "At epoch 0 the cosine factor is 1 + 1 = 2.",
        "math": "\\epsilon(0)=\\frac1{50}+\\frac2{25}=\\frac1{10}"
      },
      {
        "text": "At the midpoint it is 1 + 0 = 1.",
        "math": "\\epsilon(50)=\\frac1{50}+\\frac1{25}=\\frac3{50}"
      },
      {
        "text": "At the final epoch it is 1 − 1 = 0.",
        "math": "\\epsilon(100)=\\frac1{50}"
      }
    ],
    "takeaway": "The midpoint is the average of the initial and final rates; it is not half the initial rate unless the final rate is zero.",
    "trap": "Keep $\\epsilon_{\\min}$ in the formula. This example deliberately has a nonzero floor.",
    "practice": {
      "problem": "A multistep schedule starts at $\\frac{1}{10}$, with γ = $\\frac{1}{2}$ and milestones at epochs 10 and 20. Find the rate at epochs 9, 10, and 20.",
      "solution": [
        {
          "text": "Before any milestone the rate is unchanged.",
          "math": "\\epsilon(9)=\\frac1{10}"
        },
        {
          "text": "Apply each decay as soon as its milestone is reached.",
          "math": "\\epsilon(10)=\\frac1{10}\\frac12=\\frac1{20},\\qquad\\epsilon(20)=\\frac1{10}\\left(\\frac12\\right)^2=\\frac1{40}"
        }
      ]
    }
  },
  {
    "topic": 8,
    "title": "Warmup, decay, and a restart",
    "kind": "Computation",
    "slide": 42,
    "problem": "Use a 4-epoch linear warmup to $\\epsilon_{0} = \\frac{1}{10}$, followed by cosine decay to zero through epoch 12. Compute the rate at epochs 2, 4, 8, and 12. Use the deck’s epoch convention, starting at epoch 0.",
    "hint": "After warmup, subtract 4 from both the current epoch and the total duration.",
    "solution": [
      {
        "text": "During warmup, scale the target rate by e/W.",
        "math": "\\epsilon(2)=\\frac1{10}\\frac24=\\frac1{20}"
      },
      {
        "text": "The cosine phase starts at epoch 4 with elapsed time 0 and duration 8.",
        "math": "\\epsilon(4)=\\frac1{10}"
      },
      {
        "text": "Epoch 8 is halfway through the cosine phase: (8−4)/(12−4) = $\\frac{1}{2}$.",
        "math": "\\epsilon(8)=\\frac1{20}(1+\\cos(\\pi/2))=\\frac1{20}"
      },
      {
        "text": "The rate reaches zero at the end.",
        "math": "\\epsilon(12)=\\frac1{20}(1+\\cos\\pi)=0"
      }
    ],
    "takeaway": "Warmup uses its own clock; cosine decay uses the remaining training duration.",
    "trap": "Using e/T directly after warmup puts the cosine schedule on the wrong timeline.",
    "practice": {
      "problem": "A separate cosine schedule restarts every $R = 4$ epochs, with initial rate $\\frac{1}{10}$ and floor zero. Find the rates at epochs 2 and 4.",
      "solution": [
        {
          "text": "At epoch 2 the phase is 2 mod 4 = 2, so it is halfway through the cycle.",
          "math": "\\epsilon(2)=\\frac1{20}"
        },
        {
          "text": "At epoch 4 the phase resets to zero.",
          "math": "4\\bmod4=0,\\qquad\\epsilon(4)=\\frac1{10}"
        },
        {
          "text": "The exact restart boundary returns to the initial rate; it is not the zero endpoint of a non-restarting cosine schedule."
        }
      ]
    }
  },
  {
    "topic": 9,
    "title": "Write a defensible optimizer recommendation",
    "kind": "Theory",
    "slide": 44,
    "problem": "A classmate says: “Adam has the lowest training loss after ten epochs, so it is the best optimizer for our task.” You also observe occasional enormous gradient norms. Give a short answer that evaluates the claim and proposes a justified next step.",
    "hint": "Separate the evidence for generalization from the intervention for exploding gradients.",
    "solution": [
      {
        "text": "State what the evidence actually establishes: Adam reached a lower training loss at this budget and with these settings. It does not establish the best validation performance."
      },
      {
        "text": "Propose a fair comparison: tune the learning rate and schedule for each method, compare under a stated compute budget, and use validation performance for selection. Keep the final test set for final evaluation."
      },
      {
        "text": "Address the observed instability directly: gradient clipping can cap exceptional gradient magnitudes. Monitor whether it improves stability; it does not guarantee improved generalization."
      },
      {
        "text": "Qualify the recommendation: Adam is a reasonable candidate, but SGD with momentum may perform differently after appropriate tuning. The task and evaluation criteria determine the choice."
      }
    ],
    "takeaway": "A strong theoretical answer connects observation → mechanism → evidence → limitation, rather than naming an optimizer alone.",
    "trap": "Do not promise that a lower training loss, clipping, or an adaptive learning rate automatically gives better test performance.",
    "practice": {
      "problem": "AdaGrad updates have become tiny after a long run. A classmate proposes increasing momentum as the only remedy. Identify the more direct mechanism to investigate and explain one alternative.",
      "solution": [
        {
          "text": "Inspect whether the cumulative squared-gradient accumulator has become large, shrinking AdaGrad’s effective learning rates."
        },
        {
          "text": "RMSProp replaces the cumulative sum with a decaying moving average, allowing old large gradients to fade. Explain that mechanism before recommending it."
        },
        {
          "text": "Check learning-rate choices and validation results as well. Tiny gradients or genuine convergence can also cause tiny updates, so the accumulator explanation needs evidence."
        }
      ]
    }
  }
];
