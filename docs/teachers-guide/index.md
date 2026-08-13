# Teachers Guide

Welcome to the teacher's guide for *Learning MicroPython and Physical Computing*. This guide explains every feature of the textbook, how to use it in your classroom or coding club, and how to customize it for your own students. No prior technical knowledge is assumed — every technical term is defined before it is used.

## About This Interactive Intelligent Textbook

### What is an Intelligent Textbook?

An **intelligent textbook** is a digital textbook that goes beyond static text and images. It includes interactive simulations, self-grading quizzes, a searchable glossary, and a structured map of how concepts relate to each other. The goal is to give students a richer, more engaging learning experience than a traditional printed textbook or PDF.

### The Five Levels of Intelligent Textbooks

Not all digital textbooks are created equal. We categorize intelligent textbooks into five levels based on how interactive and adaptive they are:

<iframe src="https://dmccreary.github.io/intelligent-textbooks/sims/book-levels/main.html" height="500px" scrolling="no"
  style="overflow: hidden;"></iframe>

| Level | Name | Description | Example Features |
|-------|------|-------------|-----------------|
| **Level 1** | Static Digital | A PDF or basic web version of a print textbook | Text and images only, no interactivity |
| **Level 2** | Interactive | Adds interactive elements like simulations, quizzes, and searchable glossaries | MicroSims, self-check quizzes, concept search |
| **Level 3** | Adaptive | Adjusts content based on student performance | Personalized learning paths, difficulty adjustment |
| **Level 4** | AI-Assisted | Includes an AI tutor that can answer student questions | Chatbot integration, automated feedback |
| **Level 5** | Fully Adaptive AI | Continuously learns from student interactions and optimizes the experience | Real-time content generation, predictive analytics |

**This textbook is a Level 2 Intelligent Textbook.** It includes 26+ interactive MicroSims, per-chapter quizzes, a 500+ term glossary, and a searchable FAQ — but it does not yet adapt automatically to individual student performance.

### What Makes This Textbook Different

- **Interactive MicroSims** let students manipulate models directly in their browser — no software installation required
- **Real hardware, low cost** — every project runs on a Raspberry Pi Pico ($4) or similar board, plus a solderless breadboard and inexpensive components, so a full classroom set costs under $20 per student
- **Computational thinking emphasis** — every chapter helps students practice decomposition, pattern recognition, abstraction, and algorithm design while building something they can hold in their hands
- **"Let's build something amazing!" framing** — a positive, encouraging tone that makes programming and electronics feel approachable, not intimidating
- **Learning graph** — a visual map showing how all 486 concepts connect and build on each other
- **Monty the MicroPython Snake** — a friendly mascot character (called a "pedagogical agent") who guides students through each chapter with tips, encouragement, and key insights
- **Completely free and open source** — licensed under Creative Commons for non-commercial use

## Using the Chapters

### Chapter Structure

The textbook contains **23 chapters** organized in a deliberate sequence, covering Python programming fundamentals through advanced hardware topics and a capstone project. Each chapter builds on concepts from previous chapters, so students should work through them in order:

| Chapters | Topic Area |
|----------|-----------|
| 1–2 | Python programming foundations (variables, data types, operators, collections, control flow, functions, error handling) |
| 3–5 | Getting set up (Thonny, the REPL, `mpremote`) and electronics fundamentals (voltage, current, resistance, breadboards) |
| 6–8 | Digital and analog I/O, PWM, and communication protocols (I2C, SPI, UART) |
| 9–11 | Sensors — temperature/humidity, distance, motion, orientation, light, rotary encoders, touch, and audio input |
| 12–13 | Motors, servos, stepper motors, and building line-following/collision-avoidance robots |
| 14–17 | Displays — NeoPixels, LED matrices, character LCDs, OLED (SSD1306/SH1106), color TFT, and e-paper screens |
| 18 | Sound, music, and audio generation |
| 19–20 | Wireless/IoT (Wi-Fi, web servers, REST APIs) and timers/multi-core programming |
| 21–22 | File systems, debugging strategies, and advanced hardware topics (PIO, FFT, AI-assisted coding) |
| 23 | Applied learning and a student capstone project |

See the full [List of Chapters](../chapters/index.md) for a one-paragraph description of every chapter.

### What Each Chapter Contains

Every chapter follows a consistent structure:

1. **YAML front matter** — Metadata at the top of each chapter file (title, description, reading level, version). Students don't see this; it's used by search engines and the website builder.
2. **Summary** — A brief overview of what the chapter covers and what students will learn.
3. **Concepts covered** — A numbered list of the specific concepts addressed in the chapter, drawn from the learning graph.
4. **Prerequisites** — Links to prior chapters that should be completed first.
5. **Welcome from Monty** — A mascot admonition that introduces the chapter topic in Monty's friendly voice.
6. **Main content** — The core instructional material, written at a 5th-grade reading level for a primary audience of 10-year-olds (while staying useful for older teens and adult learners). Includes tables, real-world analogies, embedded MicroSims, and runnable MicroPython code with inline comments.
7. **Mascot admonitions** — Throughout the chapter, Monty appears to highlight key insights (thinking), share practical tips (tip), warn about common mistakes (warning), and offer encouragement on harder sections (encourage).
8. **Key takeaways** — A numbered summary of the most important concepts, preceded by a celebration from Monty.
9. **References** — A link out to the chapter's separate, more detailed Annotated References page.

Each chapter also has two separate linked pages in the navigation sidebar:

- **Quiz** — A self-check multiple-choice quiz for that chapter
- **Annotated References** — About 10 curated sources for further reading

### Using the Hands-On Labs

This textbook is split into two complementary parts, both visible in the left navigation:

- **Chapters** — the conceptual content described above: what a sensor is, how PWM works, why I2C needs two wires
- **Hands-On Labs** — step-by-step wiring and build instructions for real hardware, organized by topic (Basic Examples, Sensors, Motors and Servos, Robots, Displays, and more)

Assign the matching chapter as reading first, then move to the hands-on lab so students wire up the real component and run the code themselves. The labs assume a solderless breadboard for every project — no soldering is required anywhere in this textbook.

### Suggested Classroom Use

- **Before class**: Assign the chapter as reading homework. The MicroSims keep students engaged during independent reading, even without hardware in hand.
- **During class**: Use the MicroSims on a projector for whole-class demonstrations. Ask students to predict what will happen when you change a slider, then test their predictions. Move to the matching Hands-On Lab so students wire the circuit and run the code.
- **After class**: Assign the chapter quiz as a quick formative check, and point students to the FAQ and glossary for extra support.
- **Pacing**: Each chapter plus its matching hands-on lab is designed for approximately 2–3 class periods (90–135 minutes of instruction). Chapters with more sensors or wiring steps may take longer.

## Using the MicroSims

### What is a MicroSim?

A **MicroSim** (short for "micro-simulation") is a small, interactive simulation that runs directly in a web browser. Students don't need to install any software — MicroSims work on any device with a modern web browser (Chrome, Firefox, Safari, Edge).

Each MicroSim lets students manipulate one or more variables (using sliders, buttons, or drag-and-drop) and immediately see how the model responds. This "learn by doing" approach helps students build intuition for abstract concepts like PWM duty cycle, Ohm's law, or I2C timing before they ever touch a breadboard.

### How MicroSims Are Embedded

MicroSims appear within chapter text as rectangular interactive areas. They are embedded using **iframes** — a web technology that displays one web page inside another. You don't need to understand how iframes work; just know that the MicroSims load automatically when students view the chapter page.

### Types of MicroSims

The textbook includes over 26 MicroSims covering topics across the whole course, including:

- **Resistor Color Code Calculator** and **Ohm's Law Calculator** — for the electronics fundamentals chapter
- **ADC Potentiometer Explorer** and **Digital I/O Explorer** — for analog and digital I/O
- **Protocol Comparison** and **Pico Pinout Explorer** — for communication protocols and hardware
- **Accelerometer Axes**, **Ultrasonic Ranging**, and **Collision Avoidance Flowchart** — for sensors and robots
- **Servo PWM Explorer** and **NeoPixel Color Mixer** — for motors and displays
- **OLED Coordinate System** and **OLED Wiring Guide** — for graphical displays
- **Piano Tone Generator** and **Spectrum Analyzer Concept** — for sound and audio
- **IoT Data Flow** and **Prompt Engineering Workshop** — for wireless projects and using AI tools
- **Graph Viewer** — the interactive Learning Graph Viewer described below

### Tips for Using MicroSims in Class

1. **Project them on a screen** — MicroSims are designed to be visible on a projector. Have students call out predictions before you move a slider.
2. **Let students explore independently** — After a demonstration, give students 5–10 minutes to experiment on their own devices.
3. **Use the "Reset" button** — Most MicroSims have a reset button. Encourage students to reset and try different scenarios.
4. **Connect to the text** — Each MicroSim is placed near the concept it illustrates. After exploring the sim, have students re-read the surrounding text.
5. **Offline access** — MicroSims require an internet connection unless you have built the site locally (see "Customizing Your Own Textbook" below).

!!! mascot-tip "Monty's Tip: Embed MicroSims Anywhere!"
    ![Monty shares a tip](../img/mascot/tip.png){ class="mascot-admonition-img" }
    You can add any MicroSim to **any web page** — a Google Site, a
    WordPress blog, an LMS like Canvas or Schoology, or even a plain
    HTML file. Just paste a single line of HTML:

    ```html
    <iframe src="https://dmccreary.github.io/learning-micropython/sims/YOUR-MICROSIM-NAME/main.html"
        width="100%" height="450px"
        scrolling="no">
    </iframe>
    ```

    Replace `YOUR-MICROSIM-NAME` with the name of any MicroSim from
    the MicroSims list in the Learning Graph section. That's it — one
    line of code and your students have an interactive simulation on
    any page you control.

## Using the Glossary

### What is the Glossary?

The **glossary** is an alphabetical list of over 500 key terms used in the textbook, each with a precise, concise definition and a worked example. It serves as a quick-reference dictionary for students encountering unfamiliar electronics or programming vocabulary.

### How to Access the Glossary

- Click **"Glossary"** in the left navigation sidebar from any page
- Use the browser's built-in search (Ctrl+F on Windows/Linux, Cmd+F on Mac) to find a specific term on the glossary page
- Use the site-wide **search bar** at the top of any page to search for a term across the entire textbook

### Tips for Using the Glossary in Class

- **Vocabulary preview** — Before starting a new chapter, have students look up the key terms in the glossary to build familiarity.
- **Definition matching** — Create a warm-up activity where students match glossary definitions to terms from the current chapter.
- **Student-generated definitions** — After reading a chapter, have students write their own definitions, then compare with the glossary.
- **Glossary quizzes** — Use glossary terms for quick formative assessments (flash cards, quiz games, etc.).

## Using the FAQ

### What is the FAQ?

The **FAQ** (Frequently Asked Questions) is a curated list of common questions students ask about MicroPython and physical computing, organized by topic. Each question includes a clear, concise answer written at the same reading level as the chapters.

### Tips for Using the FAQ in Class

- **Discussion starters** — Pick 2–3 FAQ questions at the start of class and have students discuss before revealing the answer.
- **Homework support** — Point students to the FAQ when they have questions outside of class hours, especially about wiring or hardware troubleshooting.
- **Extension reading** — The FAQ often covers angles not addressed in the main chapter text, making it good supplementary material.
- **Test review** — Students can use the FAQ as a study guide before assessments.

## Using the Quizzes

### What Are the Quizzes?

Each chapter has an accompanying **quiz page** with multiple-choice questions designed for self-assessment. Quizzes test understanding of the concepts covered in that chapter.

### How Quizzes Work

- Quizzes are accessed by clicking **"Quiz"** under each chapter in the left navigation
- Each quiz contains multiple-choice questions, each tagged with the specific concept it tests
- Questions are presented as expandable sections — students click **"Show Answer"** to reveal the correct answer and a short explanation after attempting the question
- Quizzes are **not graded automatically** — they are designed as formative self-check tools, not summative assessments

### Tips for Using Quizzes in Class

- **Exit tickets** — Have students complete the quiz at the end of a class period as a quick check for understanding.
- **Pre-reading check** — Assign the quiz before the chapter to see what students already know (diagnostic assessment).
- **Post-reading review** — Use the quiz after reading to identify concepts that need re-teaching.
- **Collaborative quiz** — Have students work in pairs to discuss each question before revealing the answer.
- **Custom assessments** — Use the quiz questions as a bank to create your own tests. The questions are openly licensed (see "Understanding the License" below).

## Using the References

### What Are the References?

Each chapter has an accompanying **Annotated References** page with a curated list of approximately 10 high-quality sources that students can use for further reading. References prioritize Wikipedia for accessibility and reliability, supplemented by authoritative books and tutorials.

### How References Are Organized

Each reference includes:

- **Title** — The name of the source, linked directly to the article or page
- **Source** — Where the reference comes from (Wikipedia, a book, a tutorial site)
- **Relevance** — A brief description of why this source is useful and how it connects to the chapter content

### A Note About Link Rot

**Link rot** is when a web link (URL) stops working because the page has been moved, renamed, or deleted. This is a common problem with any resource that links to external websites. While we prioritize Wikipedia (which has very stable URLs), some links may become outdated over time.

If you or your students encounter a broken link:

1. Try searching for the article title on the source website
2. Use the [Wayback Machine](https://web.archive.org/) to find archived versions of the page
3. Report the broken link using GitHub Issues (see "Feedback" below)

## Feedback

### Reporting Issues and Suggestions

This textbook is an open-source project hosted on **GitHub**, a website where software and content projects are developed collaboratively. You don't need to understand programming to report a problem or suggest an improvement.

### What is a GitHub Issue?

A **GitHub Issue** is like a support ticket — it's a way to report a bug, suggest an improvement, or ask a question. Each issue gets a unique number and can be discussed by the project team and community.

### How to Submit Feedback

1. Go to the textbook's GitHub repository: [dmccreary/learning-micropython](https://github.com/dmccreary/learning-micropython)
2. Click the **"Issues"** tab at the top of the page
3. Click the green **"New issue"** button
4. Give your issue a clear title (e.g., "Broken link in Chapter 9 references" or "Suggestion: Add MicroSim for topic X")
5. In the description, provide as much detail as possible:
    - Which page or chapter has the problem
    - What you expected to see vs. what you actually see
    - Your browser and device (if relevant)
6. Click **"Submit new issue"**

You will need a free GitHub account to submit issues. If you prefer not to create an account, you can use the [Contact](../misc/contact.md) page instead.

### Types of Feedback Welcome

- **Typos and errors** — factual mistakes, spelling errors, broken formatting
- **Broken links** — URLs that no longer work
- **MicroSim bugs** — simulations that don't load or behave unexpectedly
- **Content suggestions** — topics that should be covered, examples that could be improved
- **Accessibility issues** — content that is difficult to read or navigate for students with disabilities

## Understanding the License

### What is a Creative Commons License?

A **license** is a legal document that explains what others are allowed to do with a piece of work. A **Creative Commons (CC) license** is a standardized, easy-to-understand license used for educational and creative content. It tells you exactly what permissions you have without needing a lawyer.

### This Textbook's License

This textbook uses the **CC BY-NC-SA 4.0** license. Here's what each part means:

| Code | Full Name | What It Means |
|------|-----------|---------------|
| **CC** | Creative Commons | A standard open license |
| **BY** | Attribution | You must give credit to the original author |
| **NC** | Non-Commercial | You cannot use the material to make money |
| **SA** | Share-Alike | If you modify the material, you must share it under the same license |
| **4.0** | Version 4.0 | The version of the license (the current standard) |

### What You CAN Do

- **Copy** the entire textbook or individual chapters for your students
- **Share** the textbook link with other teachers, students, or parents
- **Print** chapters for classroom use
- **Modify** the content — add your own examples, remove sections, change the order
- **Translate** the content into other languages
- **Create derivative works** — build your own version of the textbook based on this one

### What You CANNOT Do

- **Sell** the textbook or charge students for access
- **Remove attribution** — you must credit the original author (Dan McCreary)
- **Use a different license** — if you modify and share, it must remain CC BY-NC-SA 4.0
- **Claim it as your own work** — the attribution requirement means you must acknowledge the original source

For the full legal text, see the [Creative Commons License](../license.md) page.

## Customizing Your Own Textbook

One of the most powerful features of this textbook is that you can create your own customized version. This section explains how, step by step.

### Key Technical Terms

Before we begin, here are some terms you'll need to understand:

- **Repository (repo)** — A folder on GitHub that contains all the files for a project. Think of it as the project's home directory.
- **Git** — A version control tool that tracks changes to files. It lets you see what changed, when, and by whom.
- **Clone** — Making a complete copy of a repository on your own computer.
- **Fork** — Making a complete copy of a repository on your own GitHub account (stays on GitHub, not your computer).
- **MkDocs** — The software that converts the textbook's markdown files into a website. You don't need to learn MkDocs deeply — just enough to make basic changes.
- **Markdown** — A simple text formatting language. If you can write an email, you can write Markdown. `**bold**` makes **bold**, `# Heading` makes a heading, and `-` makes a bullet point.
- **mkdocs.yml** — The main configuration file for the textbook website. It controls the site title, navigation structure, colors, and which features are enabled.

### Step 1: Create a GitHub Account

If you don't already have one, go to [github.com](https://github.com) and create a free account.

### Step 2: Fork or Clone the Repository

**Option A: Fork (easier, stays on GitHub)**

1. Go to [dmccreary/learning-micropython](https://github.com/dmccreary/learning-micropython)
2. Click the **"Fork"** button in the upper-right corner
3. This creates a copy in your own GitHub account that you can edit

**Option B: Clone (more control, works on your computer)**

1. Install Git on your computer ([git-scm.com](https://git-scm.com/))
2. Open a terminal (Command Prompt on Windows, Terminal on Mac)
3. Run this command:

```bash
git clone https://github.com/dmccreary/learning-micropython.git
```

This downloads the entire textbook to your computer.

### Step 3: Make Changes

All content files are in the `docs/` folder. They are written in **Markdown** (`.md` files) — plain text files with simple formatting. You can edit them with any text editor.

#### Changing the Title and Description

Open `mkdocs.yml` and edit these lines:

```yaml
site_name: "Your Custom Textbook Title"
site_description: "Your description here"
site_author: "Your Name"
```

#### Changing the Colors

In `mkdocs.yml`, find the `palette` section:

```yaml
palette:
  primary: '#642580'    # Change to any hex color code, e.g. '#1565C0' for blue
  accent: '#41BAC1'      # Change the accent color the same way
```

This project uses custom hex color codes rather than the named Material color palette, so you can pick any color you like — just make sure the primary/accent pair has enough contrast for readability.

#### Changing the Logo

Replace the file `docs/img/logo.png` with your own logo image (PNG format, approximately 128x128 pixels).

### Step 4: Preview Your Changes Locally

1. Install Python (version 3.8 or newer) from [python.org](https://python.org)
2. Install MkDocs and the Material theme:

```bash
pip install -r requirements.txt
```

3. Navigate to the project folder and start the preview server:

```bash
cd learning-micropython
mkdocs serve
```

4. Open your browser to `http://127.0.0.1:8000/learning-micropython/` to see your customized version

The preview server watches for file changes. When you edit and save a Markdown file, the page automatically refreshes in your browser.

### Step 5: Publish Your Version

To publish your customized textbook as a free website using GitHub Pages:

```bash
mkdocs gh-deploy
```

This command builds the website and publishes it to `https://YOUR-USERNAME.github.io/learning-micropython/`. The process takes about 1–2 minutes.

## Customizing Your Analytics

### What is Web Analytics?

**Web analytics** is the process of measuring how visitors use a website — which pages they visit, how long they stay, and where they come from. For an educational textbook, analytics can help you understand which chapters students read most, which MicroSims they interact with, and where they might be struggling.

### Google Analytics

This textbook includes **Google Analytics** — a free service from Google that tracks website visits. The author's analytics property is already configured in `mkdocs.yml`, but if you create your own fork, you'll want to set up your own.

#### Setting Up Your Own Google Analytics

1. Go to [analytics.google.com](https://analytics.google.com/) and sign in with a Google account
2. Create a new **property** (Google's term for a tracked website)
3. Google will give you a **Measurement ID** — a code that looks like `G-XXXXXXXXXX`
4. In your `mkdocs.yml`, update this section:

```yaml
extra:
  analytics:
    provider: google
    property: G-YOUR-MEASUREMENT-ID
```

5. Rebuild and deploy your site. Analytics data will start appearing within 24–48 hours.

#### What You Can Learn from Analytics

- **Which chapters are most/least visited** — helps you identify where students might be skipping content
- **Average time on page** — longer times may indicate engagement or confusion
- **Device breakdown** — what percentage of students use phones vs. computers
- **Geographic distribution** — where your students are accessing from
- **Search terms** — what students search for on your site

### xAPI Monitoring (Advanced)

**xAPI** (Experience API, also called "Tin Can API") is an advanced standard for tracking detailed learning activities — not just page views, but specific interactions like "student moved a slider to position X" or "student answered quiz question 3 correctly."

#### What is an LRS?

An **LRS** (Learning Record Store) is a database that stores xAPI learning records. Think of it as a specialized analytics system designed specifically for education. If you use an LRS, you can track granular student learning data.

#### Important: Regulatory Considerations

Before collecting student-specific learning data, be aware of these regulations:

- **FERPA** (Family Educational Rights and Privacy Act) — U.S. federal law that protects student education records. If you collect data that can identify individual students, you must comply with FERPA.
- **COPPA** (Children's Online Privacy Protection Act) — U.S. federal law that applies to children under 13. Since this textbook's primary audience is 10-year-olds, this applies directly if you track individual students.
- **State laws** — Many U.S. states have additional student privacy laws.
- **GDPR** (General Data Protection Regulation) — European Union law that applies if any of your students are in the EU.

**Recommendation**: The Google Analytics setup described above is anonymous by default — it tracks aggregate page views, not individual students. This is the safest approach. If you want individual student tracking via xAPI, consult your school district's data privacy officer before proceeding.

## The Learning Graph

### What is a Learning Graph?

A **learning graph** is a visual map showing how the 486 concepts in the textbook depend on each other. It is structured as a **DAG** (Directed Acyclic Graph) — a diagram where arrows show which concepts must be understood before others.

For example, understanding PWM-based servo control requires mastering digital I/O and PWM fundamentals first. The learning graph makes these dependency chains visible.

### How Teachers Can Use the Learning Graph

- **Prerequisite checking** — Before teaching a concept, verify that students have covered its prerequisites
- **Remediation** — If a student struggles with a concept, trace back to its prerequisites to find the gap
- **Curriculum mapping** — Compare the learning graph to your existing syllabus or standards to identify coverage gaps
- **Enrichment** — Advanced students can explore concepts ahead of the current chapter by following the graph forward

The interactive Learning Graph Viewer is available in the "Learning Graph" section of the left navigation.

## Monty the MicroPython Snake: Your Pedagogical Agent

### What is a Pedagogical Agent?

A **pedagogical agent** is a character that appears throughout a textbook to guide students. Research shows that pedagogical agents improve student engagement and perception of learning — a phenomenon called the **persona effect**.

### How Monty Appears

Monty is a curious, encouraging cartoon python snake who wears round glasses and a small Raspberry Pi Pico badge. He appears as colored callout boxes (called **admonitions**) throughout each chapter. There are six admonition types:

| Type | Purpose | Frequency |
|------|---------|-----------|
| Welcome | Introduces the chapter | Once, at the start of every chapter |
| Thinking | Highlights a key idea or insight | 1–2 per chapter |
| Tip | Shares practical advice | As needed |
| Warning | Alerts to a common mistake | As needed |
| Encourage | Supports students on harder concepts | Where students may struggle |
| Celebration | Celebrates progress | Once, at the end of every chapter (with Key Takeaways) |

Monty's signature phrases are "Let's build something amazing!", "You've got this, coder!", and "Bugs are just puzzles waiting to be solved!" He refers to students as "coders" or "makers" and never talks down to them.

### Tips for Teachers

- **Read Monty's tips aloud** — They're written in a conversational tone that works well when spoken to the class.
- **Use as discussion prompts** — Monty's "thinking" admonitions highlight the most important insights in each chapter.
- **Encourage struggling students** — Point students to Monty's "encourage" admonitions when they're frustrated with a bug or a tricky wiring step. Monty normalizes struggle: "This part is tricky for everyone — that's completely normal."

## Additional Resources

- [Computational Thinking](computational-thinking.md) — how this textbook teaches decomposition, pattern recognition, abstraction, and algorithm design
- [Sample AI Prompts](prompts/index.md) — example prompts for using AI assistants like Claude or ChatGPT alongside this textbook
