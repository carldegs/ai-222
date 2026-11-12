# Margin · AI 222 Study Companion

A local desktop study app for the supplied Rowel Atienza decks (UP, updated 2025).

## Run locally

From this folder, run `npm start`, then visit http://localhost:5173.
No dependency installation or build is required. Node runs checks; Python serves the app.

- Optimization: http://localhost:5173/#learn/1
- Regularization: http://localhost:5173/regularization.html#learn/1
- Detection: http://localhost:5173/detection.html#learn/1
- Segmentation: http://localhost:5173/segmentation.html#learn/1

The decks are linked in the sidebar. Each deck stores its completion and recall ratings separately in this browser. Exam drafts last until reload, and you self-grade with the marks in each solution.

## Modules

| Deck | Slides | Lessons | Worked problems + variations | Recall questions |
| --- | --- | --- | --- | --- |
| Optimization | 44 | 18 | 12 + 12 | 28 |
| Regularization | 46 | 17 | 13 + 13 | 39 |
| Detection | 132 | 24 | 14 + 14 | 64 |
| Segmentation | 113 | 23 | 11 + 11 | 59 |

Learn groups related slides into lessons in deck order. The sidebar and lesson navigation follow the same list. Links such as /#slide/13 open the lesson containing that slide and show the selected source in the panel. Each lesson starts with context, and equations, notes and worked problems appear where the discussion teaches their concepts.

The decks include beginner explanations, equation context, compact symbol tables, inline and display KaTeX, worked solutions, caveats, and source-linked terminology. Quick reference offers formula and concept search. Test yourself opens a practice exam with per-question solutions and marks. It also offers theory drills, computations, flashcards, and weak-question review. Further learning links to original sources.

Optimization includes a step-through comparison of SGD, momentum, and Nesterov on shared toy loss surfaces. It also explains eight minibatch advantages and tradeoffs. Regularization covers generalization/capacity, L1/L2, MLE and Gaussian residual models, MAP and Gaussian priors, label-preserving augmentation, STRAug, CutOut/MixUp/CutMix, AgMax/RandAugment, noise/domain randomization, multi-task learning, tied parameters, early stopping, dropout and cross-validation. The augmentation demo uses the deck’s bird and cat photos to compare CutOut, MixUp, and CutMix. Supplements and slide simplifications are labeled explicitly.

Detection covers box coordinates and anchors, SSD and YOLO, IoU and AP, Fast and Faster R-CNN, FPN, RetinaNet, FSAF, and FCOS. It includes interactive IoU, centerness, and hard and Soft-NMS demos.

Segmentation covers pixel and instance labels, FCN and PSPNet, Mask R-CNN and Mask Scoring R-CNN, YOLACT, Cascade R-CNN and HTC, rotated regions, and SAM 2. Its demos illustrate 2D RoIAlign interpolation, prototype assembly, greedy versus Fast NMS, and video memory.

All source pages and original PDFs are included locally. Concept links open the exact source page. The slide panel supports resizing, hiding, enlargement and direct PDF access. External appendix links require internet. Mobile refinement is deferred.

## Checks

Run `npm test`. Checks cover KaTeX rendering, source assets, practice coverage, inline-text escaping, slide bounds, independent storage keys and progress restoration.

## Editing

Use [the deck creation rules](DECK_RULES.md) when adding a new deck or writing its study sections.

- `dist/app.mjs`: shared UI and deck-aware behavior.
- `dist/decks.mjs`: deck registry, source paths, counts and storage keys.
- `dist/optimization-tutor-content.mjs`: guided steps, source links and illustration highlights.
- `dist/tutor.mjs`, `dist/walkthrough.mjs`, `dist/walkthrough-pages.mjs`, `dist/walkthrough-groups.mjs`: shared walkthrough UI, source-specific explanations and group introductions.
- `dist/optimization-labs.mjs` and `dist/decks/regularization-labs.mjs`: interactive demos.
- `dist/content.mjs`, `examples.mjs`, `equation-context.mjs`, `training-connections.mjs`: Optimization content.
- `dist/decks/regularization.mjs`: Regularization lessons and equation context.
- `dist/decks/regularization-practice.mjs`: Regularization worked problems and questions.
- `dist/decks/regularization-support.mjs`: Regularization source mappings, challenge guide, comparisons, notation and resources.
- `dist/decks/detection*.mjs`: Detection lessons, equations, practice, demos and resources.
- `dist/decks/segmentation*.mjs`: Segmentation lessons, equations, practice, demos and resources.
- `dist/inline-math.mjs`, `references.mjs`, `state.mjs`: safe inline rendering, concept references and persistent-state helpers.
- `dist/style.css`: visual design.

Write each understanding check so a reader arriving directly at the slide can answer from its explanation, figure, equation or demo. Define necessary terms before the check and add new named methods to the terminology regression test.

Inline formulas use explicit `$...$` markup, escaped before DOM insertion. If changing entry scripts or shared runtime contracts, update the asset-version query in the deck HTML files to avoid stale browser caches. Serve `dist/` over HTTP.

Figures and source PDFs remain attributed to the instructor for personal study. Explanations and practice questions are authored supplements, not predictions of exam coverage. KaTeX's MIT license is included at `dist/vendor/katex/LICENSE`. The locally served D3 7.9.0 browser bundle and its ISC license are in `dist/vendor/d3/`.

Hosting remains pending explicit permission to export the supplied material; this implementation is available locally.
