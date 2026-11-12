# Rules for adding a deck to Margin

Use the instructor’s slides as the primary source. Build the guide for a reader who is new to the topic and preparing for a master’s-level, no-calculator exam. Keep the explanations approachable and ask the reader to apply ideas, justify choices, and show their working.

## Learn

- Follow the original deck order. Group related slides into one lesson with a clear teaching goal. Account for every slide, including transitions and recaps, without turning each slide into a separate navigation stop. Use the same lesson list for the sidebar and lesson navigation.
- Start each lesson with a concrete question, situation, or reminder of the idea the reader needs next. Write the opening so it still makes sense when the reader lands there directly from a slide or quick reference link. Define new terms in plain language before using them in an equation, exercise, or understanding check.
- Teach in the order a tutor would. Show what is happening, explain why it matters, then explain how to apply it. When several techniques solve different problems, name the symptom, explain what each technique changes, and give the main tradeoff. Connect lessons when a later idea uses or clarifies an earlier one.
- Put study notes and worked problems in the discussion that teaches them. Place each problem after its prerequisites. Give the reader a chance to try it, then offer a revealable solution and a short variation where it adds practice. An understanding check should be answerable from the discussion up to that point.
- Introduce each equation with what it calculates and when to use it. Display the equation, read it in words, and put symbol definitions in a compact table. Use the slide’s terms and variables. Explain any notation change or extra assumption near the equation. Follow the general formula with a small substitution example.

### Slides and illustrations

- Keep the original deck available beside the guide. Link the relevant words, figure captions, and explanations to the exact slide they discuss. A deep link to a slide should open the lesson containing it and select that slide in the source panel.
- Reuse a slide illustration when it can answer a question better than prose. Outline the relevant region, preserve the original white background, and tell the reader where to look or what to compare. Keep the full slide available to enlarge.
- Add an interactive or animated illustration when changing a value or tracing a sequence helps the reader see cause and effect. Start it in a meaningful state and label the controls with terms used in the lesson. Attribute outside figures and explain how they relate to the slide.
- Check the desktop layout with the lesson and slide panel side by side. The current app is desktop-first.

## Quick reference

- Make one searchable entry per walkthrough lesson, in the same order and with the same title. Give it a short plain-language recap and one exam-useful reminder, such as an assumption, a common mistake, or a tiny example.
- Reuse the equation cards from the relevant lesson. Show the equations by default and keep the symbol table and example inside a collapsed explanation. Place each equation with the concept it serves, including when a legacy topic spans several lessons.
- Give each entry a link back to its lesson and buttons for the original slides that support the recap. Check that searching by a method name or equation title finds the intended entry.

## Test yourself

- Open with a no-calculator practice exam. Use multi-part problems that share a scenario and build from a simple calculation or observation to interpretation. Include a short-answer theory section that asks for mechanisms, comparisons, or the conditions under which a claim holds.
- Use small integers, exact fractions, simple radicals, or standard angles where calculation is needed. State the relevant conventions in the question, such as whether a dropout probability means keep or drop. Base the material on the slides and teach any supplement in Learn before assessing it.
- Put a collapsed **Solution and marks** disclosure directly under each question or subquestion. Give each part a point value and enough marking guidance to self-grade. Link the solution to its source slide.
- In a calculation solution, display the general formula first. Then substitute the given values and simplify on separate display lines. Repeat that sequence if the next step uses a different formula. Give conceptual answers as brief explanations.
- Keep flashcards, standalone theory and computation drills, and weak-spot review available for shorter sessions. Use flashcards for definitions, notation, and quick distinctions. Use theory for explanations and computations for hand-worked practice. Keep existing recall ratings stable when editing a deck.

## Further learning

- Keep optional outside reading in the last section. Prefer the original paper, an authoritative textbook, or official documentation. Verify the link and say which section, figure, or example helps with which lesson.
- If an outside source helps explain a slide, align its terms and notation with the deck and label added detail as a supplement. Keep the slide as the primary reference in the lesson.

## Add the deck and check it

1. Add the entry HTML page, source PDF, and numbered slide images. In [the deck registry](dist/decks.mjs), add the deck’s metadata, asset paths, slide count, and its own progress storage key. Update the entry-page lookup so the new URL selects the right deck.
2. Define lesson boundaries in [the walkthrough groups](dist/walkthrough-groups.mjs) and add the deck’s [slide-level content mappings](dist/walkthrough-pages.mjs). Use the current decks as examples for slide explanations, equations, practice, and notation. Key Quick reference entries by the first slide of their walkthrough lesson, as in [Optimization’s reference](dist/optimization-reference.mjs).
3. Add the practice exam to [the exam content](dist/practice-exams.mjs). Author inline math with `$...$`. For exam solution calculations, supply a `formula` and a `substitution` for each step so the app typesets them as display math.
4. Run `npm test` from `study-app`. In the browser, open a lesson from a direct slide link, follow an inline reference, find and expand an equation in Quick reference, and reveal a calculation and a theory answer in Test yourself. Check that slide links select the right page, formulas render, and marks match the parts.
