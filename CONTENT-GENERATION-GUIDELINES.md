# Content Generation Guidelines

This file defines the rules for all student-facing content in the
**Learning MicroPython** textbook. Read it before generating chapters,
quizzes, glossary entries, FAQ answers, or any other text a student will read.

Instructor-facing content (teacher guides, lesson plans for educators) does
not need to follow the mascot rules in this file, but should still follow the
audience and reading-level rules in the first section.

---

## Target Audience and Reading Level

**Primary target:** 10-year-old students with no prior programming experience.  
**Full age range:** 10–18 — content should be accessible to the younger end
without feeling childish to older students.

### Writing Rules

- Write at a **5th-grade reading level** for all explanatory prose.
  - Short sentences (≤ 20 words preferred).
  - One idea per sentence.
  - Active voice: "The Pico reads the sensor" not "The sensor is read by the Pico."
- **Define every technical term** the first time it appears in a chapter. Do
  not assume prior knowledge of electronics, Python, or computing concepts.
- Use **concrete, physical analogies** to explain abstract concepts.
  Example: "Think of voltage like water pressure, and current like the flow of water."
- **Avoid jargon** unless you immediately define it. Never use an acronym
  without first spelling it out (e.g., "General-Purpose Input/Output (GPIO)").
- Prefer **second-person** ("You will connect…") over third-person
  ("Students connect…") — it feels more direct and personal.
- **Hardware steps** must be numbered lists, never prose. Students follow
  wiring instructions one step at a time.
- Code blocks must include **inline comments** explaining what each line does.
  Students copy code first, then learn to read it.
- Chapter length target: **800–1,500 words** of prose (excluding code blocks
  and diagrams).

### Vocabulary to Avoid

Prefer simpler synonyms when possible:

| Avoid | Use instead |
|-------|-------------|
| initialize | set up |
| instantiate | create |
| subsequently | then / next |
| utilize | use |
| implement | build / write |
| facilitate | help |
| approximately | about |

---

## Learning Mascot: Monty the MicroPython Snake

Monty is the pedagogical agent (guide character) for this textbook. Monty
appears in custom admonition boxes throughout chapters to welcome students,
highlight key ideas, share tips, flag common mistakes, encourage students
through hard sections, and celebrate their progress.

### Mascot File Index

The canonical files for Monty. When editing any of these, keep the others
in sync.

| File | Purpose |
|------|---------|
| [`docs/img/mascot/mascot-image-prompts.md`](docs/img/mascot/mascot-image-prompts.md) | Canonical character description and AI image prompts for all seven poses |
| [`docs/img/mascot/neutral.png`](docs/img/mascot/neutral.png) | Default / general-purpose pose |
| [`docs/img/mascot/welcome.png`](docs/img/mascot/welcome.png) | Chapter-opening pose |
| [`docs/img/mascot/thinking.png`](docs/img/mascot/thinking.png) | Key-concept / insight pose |
| [`docs/img/mascot/tip.png`](docs/img/mascot/tip.png) | Hint / helpful-guidance pose |
| [`docs/img/mascot/warning.png`](docs/img/mascot/warning.png) | Common-mistake / pitfall pose |
| [`docs/img/mascot/encouraging.png`](docs/img/mascot/encouraging.png) | Difficult-content / struggle pose |
| [`docs/img/mascot/celebration.png`](docs/img/mascot/celebration.png) | End-of-chapter / achievement pose |
| [`docs/css/extra.css`](docs/css/extra.css) | Custom admonition styles for the seven pose contexts |

### Character Overview

- **Name**: Monty
- **Species**: Python snake (cartoon)
- **Personality**: Curious, encouraging, patient, creative, inventive, playful — never sarcastic or intimidating
- **Catchphrase**: "Let's build something amazing!"
- **Visual**: Cheerful cartoon python with a compact rounded body and oversized expressive head. Bright emerald green scales with lime-green markings and a cream belly. Oversized round wire-rim glasses. Small Raspberry Pi Pico badge on the upper chest. Two small cartoon arms for expressive gestures. A flexible tail that often curls into question marks, spirals, or loops of code.
- **Art style**: Modern flat vector cartoon, clean lines, bright educational color palette, fully transparent background.

### Voice Characteristics

- Speaks directly to the student in second person: "You did it!" not "Students have done it."
- Uses simple, encouraging language appropriate for a 10-year-old.
- Occasionally uses Python or electronics puns, but keeps them gentle and groan-worthy rather than clever — humor should make students smile, not feel excluded.
- Refers to students as "coders" or "makers" to give them an identity.
- Normalizes struggle: "This part is tricky for everyone — that's completely normal."
- Never talks down to students or uses condescending language.
- Signature phrases: "Let's build something amazing!", "You've got this, coder!", "Bugs are just puzzles waiting to be solved!"

### Mascot Admonition Format

Always place mascot images in the **admonition body**, never in the title bar.
Use Markdown image syntax with the `mascot-admonition-img` class.

**Image path** — the path is relative to the *rendered* page URL, not the
markdown file. For a chapter at `docs/chapters/NN-name/index.md` (which
renders at `chapters/NN-name/index.html`), use `../../img/mascot/POSE.png`.

```markdown
!!! mascot-welcome "Welcome to Chapter N"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this chapter, you'll learn how to make an LED blink using MicroPython.
    Get ready to write your first program!

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A loop keeps running the same code over and over. That's how your LED
    keeps blinking without you having to tell it to blink each time!

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    If your LED doesn't blink, check that the longer leg (the anode) is in
    the row connected to your GPIO pin, not to ground.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Never connect an LED directly to 3.3V without a resistor — you'll burn
    it out instantly. Always use a 330Ω resistor in series!

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    PWM can feel confusing at first. That's completely normal — even
    experienced coders have to look it up. You've got this, coder!

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You've built your first working circuit and written your first
    MicroPython program. That's a huge milestone — you're a maker now!

!!! mascot-neutral "A Note from Monty"
    ![Monty neutral pose](../../img/mascot/neutral.png){ class="mascot-admonition-img" }
    Use this for general sidebars or notes that don't fit another tone.
```

### Placement Rules

| Context | Admonition type | Target frequency per chapter |
|---------|----------------|------------------------------|
| Chapter opening | `mascot-welcome` | Exactly 1 — always first |
| Key concept or insight | `mascot-thinking` | 1–3 |
| Helpful tip or shortcut | `mascot-tip` | 0–2 |
| Common mistake / pitfall | `mascot-warning` | 0–2 |
| Difficult section | `mascot-encourage` | 0–2 |
| End-of-chapter wrap-up | `mascot-celebration` | 0–1 — always last |
| General note / aside | `mascot-neutral` | 0–1 |

**Hard limits:**

- **Maximum 5–6 mascot admonitions per chapter total.**
- **Never place two mascot admonitions back-to-back.** There must be at least
  one paragraph of regular prose between any two mascot admonitions.
- Admonition body text must be **1–3 sentences**. Longer text turns the
  admonition into primary content, which defeats its purpose.
- Every mascot admonition must carry a message the reader gains something
  from — no purely decorative placements.

### Do's and Don'ts

**Do:**

- Use Monty to introduce new topics warmly at the start of every chapter.
- Include a catchphrase in welcome admonitions where it fits naturally.
- Match the pose image to the emotional tone of the content.
- Write in Monty's voice — curious, encouraging, and age-appropriate.
- Reference the chapter's actual content specifically ("the `time.sleep()`
  call" not "this function").
- End `mascot-celebration` with a call-forward to what the student will build next.
- End `mascot-warning` with the *specific* mistake and how to avoid it.

**Don't:**

- Use Monty more than 5–6 times per chapter.
- Place mascot admonitions back-to-back.
- Use Monty for purely decorative purposes with no real message.
- Put the mascot image in the admonition title bar (use body only).
- Change Monty's personality or speech patterns — keep the voice consistent.
- Use gendered pronouns for Monty — always use "Monty" or "they/them."
- Write mascot text that sounds like it was written for adults.

---

## Images and Diagrams

- Every wiring diagram must include **pin labels** and **component values**
  (e.g., "330Ω resistor", "GPIO 15").
- Diagrams must be generated or described at a level a 10-year-old can
  follow without additional explanation.
- MicroSim interactive simulations should include clear labels and a brief
  "How to use this" note at the top.
- Alt text for all images must describe what the image shows, not just name it.
  Example: "Breadboard wiring diagram showing an LED connected to GPIO 15
  through a 330Ω resistor" not just "wiring diagram."

---

## Code Examples

- All code must run on a Raspberry Pi Pico or Pico W with MicroPython.
- Every code block must have a comment on each non-obvious line.
- Introduce one new concept per code example — do not combine multiple new
  ideas in a single listing.
- After every code block, provide a **"What each line does"** table or
  numbered explanation for any chapter targeting beginners.
- Variable and function names must be self-explanatory:
  `led_pin` not `p`, `blink_delay` not `d`.
