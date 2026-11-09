# Skill: Minimalist Explainer Animation — Dracula Dark (MinutePhysics / Thought-Provoking Style)

Generates storyboards, timing sheets, visual scripts, and production prompts matching the visual and pacing style of minimalist hand-drawn conceptual explainer videos.

---

## 1. Visual Identity & Aesthetic Rules

* **Canvas:** Dracula night background (`#282A36`), zero gradients, zero drop shadows.
* **Linework:** Hand-drawn ink style (chalk/monoline with subtle organic roughness), consistent stroke weight (`3px–4px`), Dracula foreground (`#F8F8F2`). **Phone-safe floor:** no diagram stroke below `3px` at 1080p; groundlines use `4px`.
* **Phone-safe type floor (single 16:9 YouTube master):** No on-screen text below `36px` at 1080p. Secondary labels `36–44px`, key labels `48–56px`, headlines `72–80px`. If a label cannot fit at `36px`, cut it or move that detail into narration instead of shrinking it.
* **Palette (Dracula):**
  * Base: Dracula background (`#282A36`) + foreground (`#F8F8F2`).
  * Surface: Dracula current line (`#44475A`) for highlighted/active cards; use `#313342` for standard panels and `#1E1F29` for recessed wells/screens.
  * Functional Accent A: Dracula Red (`#FF5555`) — loss, layoffs, negative balance, friction.
  * Functional Accent B: Dracula Green (`#50FA7B`) — gains, employment, replacement, balance.
  * Support accents (use sparingly): Pink (`#FF79C6`), Purple (`#BD93F9`), Cyan (`#8BE9FD`), Orange (`#FFB86C`), Yellow (`#F1FA8C`).
  * Neutral Fill: Dracula current line (`#44475A`) — subtle object fills (desks, buildings).
  * Deep Fill: Dracula comment (`#6272A4`) — only for larger filled shapes, never body text.
* **Typography:**
  * Font Style: Clean handwritten sans or casual lettering (e.g., Caveat, Patrick Hand).
  * Word Density: Maximum 1–5 words per callout. Never transcribe full narration onto screen.
  * Placement: Positioned directly above, below, or adjacent to the associated visual anchor.
  * **No low-contrast text:** Secondary labels, eyebrows, and subtitles must stay readable on dark: Dracula foreground (`#F8F8F2`) or lavender-grey (`#B8B9C5`). Never use Dracula comment (`#6272A4`) or washed-out grey for text; it disappears on projectors.
  * **Horizontal labels only:** Never rotate text sideways or vertically. If a label does not fit horizontally, shorten it, move it, or cut it.
  * **Use the spoken ordinal:** When the narration enumerates rules, steps, or strategies (“rule two”, “step four”), put that number in the heading — `2) find the equation`, `4) speculative decoding`, `1) tensor parallelism`. Do not make the viewer infer the number from the sequence.
  * **No top-left scene headings:** Do not repeat the narration as a title + subtitle at the top of content scenes. The narration carries the sentence; the diagram carries short functional labels only. This avoids the “read top-left, then look center” eye ping-pong.
  * **Chapter cards are the only exception:** a chapter number + a single motif may be used as a full-screen transition. Keep them sparse and never add a paragraph.
  *

---

## 2. Character & Metaphor Design

* **Characters:** Simple stick or bean figures. Minimal faces (dot eyes, neutral/subtle mouth curve). Distinctions made through simple props (hat, desk, phone).
* **Conceptual Metaphors:**
  * Tasks/Jobs: Circular clusters, dotted outlines fading in/out.
  * Macroeconomics: Balance scales, 2D line graphs, dot grids/arrays (e.g., 1,000 dots).
  * Institutions: Basic geometric building line-art, doorframes representing access/vacancies.

---

## 3. Timing, Synchronization & Pacing Rules

* **Spoken-Sync Trigger:** Visual elements draw or pop on the exact syllable they are spoken.
* **Speech-locked reveals (hard rule):** Every label, value, formula term, or object must be keyed to the word that introduces it, using word-level timestamps — not segment starts. Never reveal a summary or conclusion before its sentence is spoken. If one line introduces several items, stagger each item onto its noun. If an element is only supporting context, hold it until the first relevant noun, then dim it when the next focus arrives.
* **Sequential Stagger:** Break complex concepts into discrete visual components introduced one-by-one (e.g., Task 1 $\rightarrow$ Task 2 $\rightarrow$ ATM arm pulls Task 1).
* **The "Breathing Room" Rule (Crucial):**
  * Never transition immediately after an asset appears.
  * Hold the completed frame for **1.5 to 3.0 seconds** or more as needed  after narration of that point concludes. we need to ensure the user is able to process everything.
  * Viewers need time to read callouts, register the relationship, and absorb the insight before movement resumes.
  * make sure the user is able to read every text, and see the figures properly- u need to calculate the appropiate time neccessary for them to process it and understand it.
* **Minimum Processing Hold (hard rule):**
  * The final visual reveal in a scene must have at least **2.0 seconds** of screen time before the cut. If narration makes that impossible, move the reveal earlier when it is contextual, or extend the scene into the next natural pause.
  * Never cut on the same word that completes a diagram.
  * If the final narration line is only a hand-off ("let's run the numbers", "adapters fix that"), move that copy into the next scene instead of leaving it 0.1–0.8 s on screen.
  * Dense scenes (multi-part diagrams, math, architecture) need the **final state held 2.5–3.5 s**. Simplify the last beat rather than rushing the cut.
* **Transitions = short fade through the Dracula background (hard rule):**
  * Use a **4–6 frame** fade through `#282A36` at 30 fps (0.13–0.2 s). Do not use a left-to-right wipe; it makes the cut feel mechanical.
  * Pre-roll the next scene's first visual so the dark gap is only a blink, never a blank scene. Never expose an empty canvas for more than ~0.2 s.
  * If a scene truly needs a chapter card, keep a motif on screen so the card is never an empty text slide.
  * Verify with a still at **scene start + 0.4 s**. If it is more than ~80% empty, move the first visual earlier.

---

## 4. Composition & Negative Space

* **Negative Space:** Keep 60%–80% of the canvas empty at all times.
* **Groundline / Baseline:** Anchor figures and buildings to an uninterrupted bottom horizontal guideline **only when the scene needs a physical floor**. Do not draw a decorative groundline across every scene; it competes with lower-third labels and adds visual noise.
* **Focal Point Isolation:** Keep **1 active focus zone per beat (left, center, or right)**. Do not animate multiple unrelated quadrants simultaneously.
* **One focal zone at a time (hard rule):** The eye can only lock onto one new thing at a time. Never reveal two new visuals in separate screen regions on the same beat. Sequence them: let the first draw, land, and be readable; then reveal the second. As a working minimum, separate cross-screen reveals by **0.8–1.0 s**, and hold a new label for **1.5 s** before introducing another. If the two items must be compared, reveal them one at a time, then hold both together and connect them with a single arrow, bracket, or shared label. If that still creates two competing focal points, remove one item. The same applies to text: do not pop two unrelated labels in different corners at once.
* **Guide the eye (hard rule):** Every scene needs a deliberate reading path. Establish the anchor first, then reveal the next object/label **adjacent to the current focus**, and dim the previous focus as the new one arrives. Never make the viewer search opposite corners. If two ideas must coexist, hold the first for 1.5 s, then put the second next to it or connect them with one line/arrow. If neither is possible, cut the second idea.
* **Transitions:** Short fade through the Dracula background `#282A36` (4–6 frames), lateral pan along the groundline, or sudden clear-to-dark. No left-to-right wipes, flashy zooms, or rotations.
* keep font size big

---

## 5. Storyboard Generation Workflow

When given a narration script or conceptual topic:

1. **Task-Level Breakdown:** Segment narration into 3–7 second visual beats.
2. **Visual Metaphor Mapping:** Assign concrete, minimal metaphors to abstract economic/technical claims.
3. **Screen Text Selection:** Select $\le 3$ anchor words per beat for on-screen emphasis.
4. **Timing & Hold Allocation:** Mark exact sync points (`[SYNC]`) and pause/hold durations (`[HOLD: Xs]`).

---

## 6. Output Template

For each video scene, format output as follows:

```markdown
### Scene [Number]: [Scene Title]
**Audio Timestamp:** [MM:SS - MM:SS]
**Narration:** "[Exact transcript segment]"

* **Visual Description:** (1-2 sentences on visual layout and assets)
* **On-Screen Text:** "[Exact text]" | Position: [e.g., Top-Center] | Color: [e.g., Dracula Red]
* **Animation Sequence:**
  1. `[00:00.0 - Word]` Draw [Asset A] on baseline.
  2. `[00:02.0 - Word]` Fade/slide [Asset B] into [Asset A].
  3. `[00:03.5 - Word]` Label pops up with small bounce.
* **Post-Animation Hold:** [X.X seconds] (Static frame hold to ensure comprehension before transition)
* **Transition Out:** [Cut / Groundline Pan Left / Fade to Dark]
  
  
  
  

#### 1. Linework & Metaphor Engine: **Rough.js**

- **Why:** You cannot rely on static SVGs if you want the MinutePhysics organic hand-drawn feel. [Rough.js](https://www.google.com/url?sa=E&q=https%3A%2F%2Froughjs.com%2F) is a lightweight canvas/SVG library that takes geometric shapes, lines, and paths and renders them with adjustable "roughness", "bowing", and sketchy pen strokes.
    
- **LLM Friendliness:** Very high. Instead of complex spline coordinates, the LLM simply calls:
    
    codeTsx
    
    ```
    rc.line(x1, y1, x2, y2, { roughness: 1.5, stroke: '#F8F8F2', strokeWidth: 3 });
    rc.circle(x, y, diameter, { fill: '#50FA7B', fillWeight: 3, roughness: 1.2 });
    ```
    

#### 2. Animation & Timing Runtime: **Remotion (React + TypeScript)**

- **Why:**
    
    - Unlike traditional CSS/browser animations which can drop frames, Remotion renders frame-by-frame (fps = 30 or 60).
        
    - Has built-in hooks like interpolate() and spring() for pop-ins and linear writes.
        
    - Native handling of audio timing via useCurrentFrame().
        
- **Implementing the "Draw-in" Effect:** For SVG line strokes, an LLM animates strokeDashoffset from the path’s total length to 0.
    

#### 3. Typography: **Google Fonts (Caveat or Patrick Hand)**

- Embed the fonts directly via @remotion/google-fonts or local @font-face.
    
- Set styling strictly to #F8F8F2 with max 1–5 words per callout.
    

#### 4. Audio-Sync Pipeline (Upstream): **OpenAI Whisper (Word-Level Timestamps)**

- Before the LLM animates, the raw voiceover is transcribed with word-level JSON timestamps (e.g., via Whisper timestamp_granularities=["word"]).
    
- The LLM receives the transcript with timestamps and converts them to frame numbers:  
    
    ```
    Target Frame=Timestamp (seconds)×FPSTarget Frame=Timestamp (seconds)×FPS
    ```


