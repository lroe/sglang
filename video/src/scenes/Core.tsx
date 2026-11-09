import React from 'react';
import {COMMENT, CYAN, GREEN, INK, MUTED, ORANGE, PURPLE, RED, SURFACE, SURFACE_2, WELL, YELLOW} from '../theme';
import {Arrow, Card, CheckMark, FolderIcon, GPUChip, Panel, Person, Server, StackedPrompt, TokenRow, TokenSquare, TreeNode, TreeEdge, WavyUnderline} from '../lib/objects';
import {CueNumber, CuePill, CueT, MultiT, PopGroup, T} from '../lib/copy';
import {Svg, clamp01, dim, prog, useDim, useScene, useTime} from '../lib/scene';
import {SketchCheck, SketchCircle, SketchCross, SketchEllipse, SketchLine, SketchPath, SketchRect} from '../lib/rough';

/* ─────────────────────────────────────────────────────────────
   5. The LLM's notes: a student reading a long story
   ───────────────────────────────────────────────────────────── */
export const Student: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const one = cue('one token at a time', 0, [62.46, 64.94]);
  const look = cue('look at every token before it', 0, [65.4, 68.92]);
  const student = cue('student reading a long story', 0, [68.92, 73.12]);
  const notes = cue('taking notes on each sentence', 0, [70.5, 73.12]);
  const check = cue('checks the notes', 0, [73.68, 78.72]);
  const again = cue('instead of reading', 0, [75.8, 78.72]);
  const kv = cue('KV cache', 0, [79.44, 83.54]);

  const tokenP = prog(t, 0.15, 0.8);
  const lookP = prog(t, look.start, 0.6);
  const studentP = prog(t, student.start, 0.9);
  const notesP = prog(t, notes.start, 0.6);
  const checkP = prog(t, check.start, 0.5);
  const tokenDim = useDim(student.start, 0.35);
  const bookDim = useDim(check.start, 0.4);

  return (
    <Svg>
      <g opacity={tokenDim}>
        {Array.from({length: 14}).map((_, i) => {
          const p = prog(t, 0.2 + i * 0.04, 0.3);
          return <TokenSquare key={i} x={390 + i * 52} y={200} s={40} fill={i < 11 ? SURFACE_2 : GREEN} color={i < 11 ? INK : GREEN} progress={p} seed={`story-token-${i}`} />;
        })}
        <g opacity={lookP}>
          <SketchPath d="M 385 272 Q 760 340 1135 272" progress={lookP} seed="look-arc" color={YELLOW} strokeWidth={4} />
          <T x={760} y={338} text="look back at every token" size={40} color={YELLOW} anchor="middle" />
        </g>
      </g>

      <g opacity={studentP}>
        <g opacity={bookDim}>
          <Person x={470} y={844} scale={1.25} reading progress={studentP} color={INK} />
          <SketchRect x={540} y={680} w={270} h={150} fill={WELL} progress={studentP} radius={8} seed="story-book" strokeWidth={3.5} color={COMMENT} />
          <T x={675} y={640} text="a long story" size={40} color={MUTED} anchor="middle" />
          {Array.from({length: 4}).map((_, i) => (
            <SketchLine key={i} x1={570} y1={712 + i * 28} x2={i === 3 ? 720 : 780} y2={712 + i * 28} progress={studentP} seed={`story-line-${i}`} strokeWidth={3} color={COMMENT} />
          ))}
        </g>

        <g opacity={notesP}>
          <SketchRect x={1010} y={360} w={440} h={390} fill={SURFACE} progress={notesP} radius={14} seed="student-notes" strokeWidth={4} color={YELLOW} />
          <T x={1230} y={424} text="notes" size={52} color={YELLOW} anchor="middle" font="head" />
          {Array.from({length: 5}).map((_, i) => (
            <SketchLine key={i} x1={1050} y1={480 + i * 46} x2={i === 4 ? 1240 : 1410} y2={480 + i * 46} progress={notesP} seed={`note-line-${i}`} strokeWidth={3} color={COMMENT} />
          ))}
          <T x={1230} y={716} text="one note per token" size={36} color={MUTED} anchor="middle" />
        </g>

        <Arrow x1={660} y1={760} x2={990} y2={600} progress={checkP} color={GREEN} width={4} seed="student-check" />

        <g opacity={prog(t, kv.start, 0.4)}>
          <SketchLine x1={1020} y1={780} x2={1440} y2={780} progress={prog(t, kv.start, 0.4)} seed="kv-rule" color={GREEN} strokeWidth={3.5} />
          <T x={1230} y={842} text="KV cache" size={62} color={GREEN} anchor="middle" font="head" />
          <T x={1230} y={888} text="key + value" size={38} color={MUTED} anchor="middle" />
        </g>
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   6. Shared prefixes share notes; one word changes everything
   ───────────────────────────────────────────────────────────── */
export const PrefixShare: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const depend = cue('notes for each token depend', 0, [84.4, 87.74]);
  const sameStart = cue('two requests start with the exact same text', 0, [88.04, 92.96]);
  const sameNotes = cue('their notes come out the same', 0, [90.6, 92.96]);
  const share = cue('we can share them', 0, [92.0, 92.96]);
  const oneWord = cue('one word at the very start is different', 0, [92.96, 96.5]);
  const allChange = cue('all the notes after it change', 0, [96.3, 98.46]);

  const rowA = prog(t, 0.15, 0.7);
  const rowB = prog(t, 0.32, 0.7);
  const shared = prog(t, sameNotes.start, 0.5);
  const changed = prog(t, oneWord.start + 0.2, 0.6);
  const cascade = prog(t, allChange.start, 0.6);

  return (
    <Svg>

      {/* request A */}
      <g opacity={rowA}>
        <T x={260} y={246} text="request A" size={42} color={GREEN} />
        {Array.from({length: 12}).map((_, i) => (
          <TokenSquare key={i} x={260 + i * 78} y={272} s={56} fill={i < 5 ? SURFACE_2 : SURFACE} color={i < 5 ? GREEN : INK} progress={prog(t, 0.2 + i * 0.03, 0.3)} seed={`a-tok-${i}`} />
        ))}
        <T x={260} y={386} text="same text" size={36} color={GREEN} opacity={shared} />
        <SketchLine x1={260} y1={412} x2={780} y2={412} progress={shared} seed="same-brace" color={GREEN} strokeWidth={4} />
        <T x={520} y={452} text="shared prefix" size={38} color={GREEN} anchor="middle" opacity={shared} />
      </g>

      {/* request B */}
      <g opacity={rowB}>
        <T x={260} y={596} text="request B" size={42} color={GREEN} />
        {Array.from({length: 12}).map((_, i) => {
          const isFirst = i === 0;
          const after = i >= 1;
          const fill = isFirst && changed > 0.2 ? RED : i < 5 ? SURFACE_2 : SURFACE;
          const col = isFirst && changed > 0.2 ? RED : i < 5 ? GREEN : INK;
          const op = after && cascade > 0.1 ? 0.7 + 0.3 * (1 - cascade) : 1;
          return <TokenSquare key={i} x={260 + i * 78} y={622} s={56} fill={fill} color={col} progress={prog(t, 0.3 + i * 0.03, 0.3)} seed={`b-tok-${i}`} opacity={op} />;
        })}
        <T x={260} y={736} text={changed > 0.2 ? 'one different word' : 'same text'} size={36} color={changed > 0.2 ? RED : GREEN} opacity={changed > 0.2 ? 1 : shared} />
        <SketchLine x1={260} y1={762} x2={780} y2={762} progress={shared} seed="b-brace" color={changed > 0.2 ? RED : GREEN} strokeWidth={4} />
      </g>

      <g opacity={shared}>
        <T x={1140} y={500} text="same notes" size={44} color={GREEN} anchor="middle" />
      </g>

      <g opacity={cascade}>
        <T x={540} y={890} text="all notes after it change" size={42} color={RED} opacity={cascade} />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   7. Automatic prefix reuse at thousands of requests
   ───────────────────────────────────────────────────────────── */
export const Automatic: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const redo = cue('second request does not need to redo', 0, [99.16, 103.5]);
  const already = cue('already read', 0, [101.8, 103.5]);
  const hard = cue('hard part', 0, [104.24, 110.26]);
  const automatic = cue('automatically', 0, [105.0, 106.6]);
  const thousands = cue('thousands of requests', 0, [107.0, 108.6]);
  const different = cue('different amounts of text', 0, [108.6, 110.26]);

  const card = prog(t, redo.start - 0.1, 0.7);
  const hardP = prog(t, hard.start, 0.7);
  const cardDim = useDim(hard.start - 0.1, 0.22);

  return (
    <Svg>
      <g opacity={cardDim}>
        <T x={520} y={210} text="request B" size={48} color={GREEN} anchor="middle" font="head" />
        <SketchRect x={220} y={250} w={600} h={260} fill={SURFACE} progress={card} radius={16} seed="auto-card" strokeWidth={4} color={INK} />
        <T x={280} y={316} text="read once" size={38} color={GREEN} />
        {Array.from({length: 8}).map((_, i) => (
          <TokenSquare key={i} x={280 + i * 58} y={340} s={42} fill={GREEN} color={GREEN} progress={prog(t, redo.start + i * 0.05, 0.3)} seed={`auto-shared-${i}`} />
        ))}
        <T x={280} y={446} text="skip" size={38} color={YELLOW} />
        {Array.from({length: 4}).map((_, i) => (
          <TokenSquare key={i} x={370 + i * 58} y={412} s={42} fill={SURFACE_2} color={YELLOW} progress={prog(t, redo.start + 0.4 + i * 0.05, 0.3)} seed={`auto-new-${i}`} />
        ))}
        <Arrow x1={240} y1={468} x2={780} y2={468} progress={prog(t, already.start, 0.4)} color={GREEN} width={4} seed="skip-arrow" />
        <T x={520} y={530} text="already read" size={42} color={GREEN} anchor="middle" opacity={prog(t, already.start, 0.4)} />
      </g>

      <g opacity={hardP}>
        <SketchCircle cx={960} cy={430} r={62} progress={hardP} strokeWidth={4} color={GREEN} seed="auto-gear" />
        {Array.from({length: 8}).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <SketchLine key={i} x1={960 + Math.cos(a) * 62} y1={430 + Math.sin(a) * 62} x2={960 + Math.cos(a) * 82} y2={430 + Math.sin(a) * 82} progress={hardP} seed={`gear-${i}`} color={GREEN} strokeWidth={4} />;
        })}
        <T x={960} y={438} text="auto" size={36} color={GREEN} anchor="middle" />
        {Array.from({length: 10}).map((_, i) => {
          const col = i % 5;
          const rowI = Math.floor(i / 5);
          const x = 620 + col * 170;
          const y = 560 + rowI * 120;
          const p = prog(t, thousands.start + i * 0.06, 0.35);
          return (
            <g key={i} opacity={p}>
              <SketchRect x={x} y={y} w={120} h={78} fill={SURFACE} progress={p} radius={8} seed={`req-${i}`} strokeWidth={3} color={i % 3 === 0 ? GREEN : INK} />
              <TokenRow x={x + 12} y={y + 14} n={5} s={12} gap={5} fill={i % 3 === 0 ? GREEN : SURFACE_2} progress={p} seed={`req-tok-${i}`} />
              <SketchLine x1={x + 12} y1={y + 54} x2={x + 108} y2={y + 54} progress={p} seed={`req-line-${i}`} strokeWidth={3} color={COMMENT} />
            </g>
          );
        })}
        <T x={960} y={830} text="thousands, all different" size={44} color={GREEN} anchor="middle" opacity={prog(t, thousands.start + 0.3, 0.4)} />
        <T x={960} y={878} text="different prefix lengths" size={36} color={MUTED} anchor="middle" opacity={prog(t, different.start, 0.4)} />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   8. SGLang: runtime + frontend, tree inside the runtime
   ───────────────────────────────────────────────────────────── */
export const Framework: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const serving = cue('serving framework', 0, [111.36, 115.9]);
  const name = cue('structured generation and language', 0, [115.9, 119.16]);
  const two = cue('two parts', 0, [119.72, 120.6]);
  const runtime = cue('runtime', 0, [121.46, 124.26]);
  const frontend = cue('frontend language', 0, [124.62, 128.28]);
  const tree = cue('tree lives in the runtime', 0, [129.04, 131.48]);

  const word = prog(t, serving.start - 0.1, 0.7);
  const origin = prog(t, name.start, 0.5);
  const split = prog(t, two.start, 0.5);
  const runP = prog(t, runtime.start, 0.6);
  const frontP = prog(t, frontend.start, 0.6);
  const treeP = prog(t, tree.start, 0.5);

  return (
    <Svg>
      <g opacity={word}>
        <T x={960} y={262} text="SGLang" size={138} color={INK} anchor="middle" font="head" />
        <T x={960} y={324} text="serving framework" size={42} color={MUTED} anchor="middle" opacity={prog(t, serving.start + 0.4, 0.4)} />
      </g>
      <g opacity={origin}>
        <T x={960} y={386} text="structured generation + language" size={44} color={CYAN} anchor="middle" />
      </g>
      <T x={960} y={454} text="two parts" size={50} color={INK} anchor="middle" font="head" opacity={split} />

      <g opacity={runP}>
        <SketchRect x={270} y={520} w={620} h={320} fill={SURFACE} progress={runP} radius={18} seed="runtime-box" strokeWidth={4.5} color={INK} />
        <T x={580} y={588} text="runtime" size={58} color={CYAN} anchor="middle" font="head" />
        <T x={580} y={636} text="the engine" size={38} color={MUTED} anchor="middle" />
        {Array.from({length: 3}).map((_, i) => (
          <SketchLine key={i} x1={330} y1={680 + i * 34} x2={i === 2 ? 700 : 830} y2={680 + i * 34} progress={runP} seed={`runtime-line-${i}`} strokeWidth={3} color={COMMENT} />
        ))}
        <g opacity={treeP}>
          <SketchCircle cx={580} cy={722} r={34} progress={treeP} strokeWidth={4} color={GREEN} seed="runtime-tree" />
          <SketchLine x1={580} y1={756} x2={580} y2={796} progress={treeP} seed="runtime-tree-trunk" color={GREEN} strokeWidth={4} />
          <SketchLine x1={580} y1={776} x2={550} y2={800} progress={treeP} seed="runtime-tree-l" color={GREEN} strokeWidth={4} />
          <SketchLine x1={580} y1={776} x2={610} y2={800} progress={treeP} seed="runtime-tree-r" color={GREEN} strokeWidth={4} />
          <SketchCircle cx={550} cy={808} r={9} progress={treeP} strokeWidth={3} color={GREEN} seed="runtime-node-l" />
          <SketchCircle cx={610} cy={808} r={9} progress={treeP} strokeWidth={3} color={GREEN} seed="runtime-node-r" />
        </g>
      </g>

      <g opacity={frontP}>
        <SketchRect x={1030} y={520} w={620} h={320} fill={SURFACE} progress={frontP} radius={18} seed="frontend-box" strokeWidth={4.5} color={INK} />
        <T x={1340} y={588} text="frontend" size={58} color={PURPLE} anchor="middle" font="head" />
        <T x={1340} y={636} text="programs with steps" size={38} color={MUTED} anchor="middle" />
        {Array.from({length: 3}).map((_, i) => (
          <SketchLine key={i} x1={1090} y1={680 + i * 34} x2={i === 2 ? 1450 : 1590} y2={680 + i * 34} progress={frontP} seed={`frontend-line-${i}`} strokeWidth={3} color={COMMENT} />
        ))}
        <T x={1340} y={800} text={'{ summarize; translate }'} size={40} color={PURPLE} anchor="middle" opacity={frontP} />
      </g>

      <g opacity={treeP}>
        <SketchLine x1={890} y1={690} x2={1028} y2={690} progress={treeP} seed="frontend-arrow" color={GREEN} strokeWidth={4} />
        <T x={960} y={654} text="tree" size={38} color={GREEN} anchor="middle" />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   9. Radix Attention: prefix, shared path, split
   ───────────────────────────────────────────────────────────── */
export const Radix: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const title = cue('Radix Attention', 0, [132.54, 134.54]);
  const prefix = cue('prefix is the beginning', 0, [135.34, 138.88]);
  const sky = cue('The sky is blue', 0, [139.2, 143.8]);
  const clear = cue('The sky is clear', 0, [140.8, 144.68]);
  const shared = cue('share the prefix', 0, [143.3, 144.68]);
  const tree = cue('radix tree stores texts', 0, [145.44, 153.04]);
  const split = cue('paths split', 0, [150.0, 151.6]);
  const kv = cue('KV cache', 0, [153.84, 157.3]);

  const titleP = prog(t, title.start - 0.1, 0.5);
  const prefixP = prog(t, 0.2, 0.5);
  const skyP = prog(t, 0.2, 0.5);
  const clearP = prog(t, 0.35, 0.5);
  const treeP = prog(t, tree.start, 0.8);
  const splitP = prog(t, split.start, 0.5);
  const kvP = prog(t, kv.start, 0.4);
  const cardsDim = useDim(tree.start, 0.25);

  return (
    <Svg>
      <T x={960} y={136} text="Radix Attention" size={76} color={INK} anchor="middle" font="head" opacity={titleP} />
      <T x={960} y={194} text="a prefix is a shared beginning" size={40} color={CYAN} anchor="middle" opacity={prefixP} />

      <g opacity={cardsDim}>
        <g opacity={skyP}>
          <SketchRect x={330} y={248} w={520} h={92} fill={SURFACE} progress={skyP} radius={10} seed="sky-blue" strokeWidth={3.5} color={INK} />
          <T x={590} y={306} text="The sky is blue" size={44} color={INK} anchor="middle" opacity={prog(t, sky.start, 0.4)} />
        </g>
        <g opacity={clearP}>
          <SketchRect x={1070} y={248} w={520} h={92} fill={SURFACE} progress={clearP} radius={10} seed="sky-clear" strokeWidth={3.5} color={INK} />
          <T x={1330} y={306} text="The sky is clear" size={44} color={INK} anchor="middle" opacity={prog(t, clear.start, 0.4)} />
        </g>
        <SketchLine x1={360} y1={390} x2={1010} y2={390} progress={prefixP} seed="prefix-brace" color={GREEN} strokeWidth={4} />
        <T x={960} y={444} text="shared prefix: “The sky is”" size={40} color={GREEN} anchor="middle" opacity={prog(t, shared.start, 0.4)} />
      </g>

      <g opacity={treeP}>
        <TreeEdge x1={960} y1={548} x2={700} y2={688} progress={treeP} seed="radix-e1" color={COMMENT} width={4} />
        <TreeEdge x1={960} y1={548} x2={1220} y2={688} progress={treeP} seed="radix-e2" color={COMMENT} width={4} />
        <TreeNode x={750} y={470} w={420} h={84} label="The sky is" color={INK} fill={SURFACE} progress={treeP} seed="radix-root" labelSize={44} />
        <TreeNode x={540} y={688} w={320} h={82} label="blue" color={GREEN} fill={SURFACE} progress={prog(t, tree.start + 0.35, 0.5)} seed="radix-blue" labelSize={44} />
        <TreeNode x={1060} y={688} w={320} h={82} label="clear" color={CYAN} fill={SURFACE} progress={prog(t, tree.start + 0.5, 0.5)} seed="radix-clear" labelSize={44} />
        <T x={960} y={822} text="radix tree" size={52} color={GREEN} anchor="middle" opacity={prog(t, tree.start + 0.4, 0.4)} />
        <g opacity={splitP}>
          <T x={960} y={640} text="split here" size={36} color={YELLOW} anchor="middle" />
        </g>
        <g opacity={kvP}>
          <SketchRect x={720} y={860} w={480} h={72} fill={SURFACE} progress={kvP} radius={36} seed="kv-pill" strokeWidth={3.5} color={GREEN} />
          <T x={960} y={906} text="KV cache lives in the tree" size={38} color={GREEN} anchor="middle" />
        </g>
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   10. Folders: three requests become one tree
   ───────────────────────────────────────────────────────────── */
export const FolderTree: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const folders = cue('folders on our computer', 0, [158.22, 162.4]);
  const three = cue('Take three requests', 0, [162.98, 163.92]);
  const first = cue('The first says', 0, [164.46, 166.42]);
  const france = cue('France', 0, [167.8, 169.0]);
  const japan = cue('Japan', 0, [169.0, 170.16]);
  const third = cue('The third says', 0, [170.64, 172.68]);
  const joke = cue('Tell me a joke', 0, [172.9, 173.6]);
  const top = cue('top folder', 0, [174.32, 179.46]);
  const prompt = cue('system prompt', 0, [175.0, 179.46]);
  const once = cue('computed once', 0, [177.2, 179.46]);
  const capital = cue('capital of', 0, [180.14, 184.6]);
  const leaves = cue('one for France and one for Japan', 0, [184.6, 188.84]);
  const jokeFolder = cue('joke request', 0, [189.54, 192.14]);

  const folderP = prog(t, folders.start - 0.1, 0.6);
  const cards = prog(t, 0.2, 0.5);
  const cardsOut = 1 - prog(t, top.start, 0.3);
  const treeP = prog(t, top.start, 0.8);
  const rootP = prog(t, prompt.start, 0.5);
  const capitalP = prog(t, capital.start, 0.5);
  const leafP = prog(t, leaves.start, 0.5);
  const jokeP = prog(t, jokeFolder.start, 0.5);

  return (
    <Svg>
      <g opacity={prog(t, folders.start, 0.4)}>
        <FolderIcon x={140} y={170} w={190} h={100} label="our" color={COMMENT} fill={SURFACE} progress={folderP} seed="folder-icon" labelSize={38} />
        <T x={235} y={320} text="folders" size={40} color={MUTED} anchor="middle" />
      </g>

      <g opacity={cards * cardsOut}>
        {[
          {x: 300, tone: GREEN, label: 'France', start: first.start, value: france.start},
          {x: 770, tone: CYAN, label: 'Japan', start: first.start + 0.5, value: japan.start},
          {x: 1240, tone: PURPLE, label: 'a joke', start: third.start, value: joke.start},
        ].map((c, i) => (
          <g key={c.label} opacity={prog(t, 0.25 + i * 0.08, 0.4)}>
            <SketchRect x={c.x} y={190} w={390} h={165} fill={SURFACE} progress={prog(t, 0.25 + i * 0.08, 0.4)} radius={12} seed={`req-card-${i}`} strokeWidth={3.5} color={c.tone} />
            <T x={c.x + 26} y={234} text={`request ${i + 1}`} size={36} color={MUTED} opacity={prog(t, c.start - 0.15, 0.4)} />
            <T x={c.x + 26} y={282} text="helpful assistant" size={38} color={INK} opacity={prog(t, c.start - 0.15, 0.4)} />
            <T x={c.x + 364} y={322} text={c.label} size={44} color={c.tone} anchor="end" opacity={prog(t, c.value - 0.1, 0.35)} />
          </g>
        ))}
      </g>

      <g opacity={treeP}>
        <T x={960} y={246} text="system prompt" size={38} color={GREEN} anchor="middle" opacity={rootP} />
        <g opacity={rootP}>
          <FolderIcon x={700} y={268} w={520} h={112} label="helpful assistant" color={GREEN} fill={SURFACE} progress={rootP} seed="root-folder" labelSize={44} />
        </g>
        <TreeEdge x1={960} y1={380} x2={960} y2={450} progress={capitalP} seed="folder-e1" color={COMMENT} width={4} />
        <g opacity={capitalP}>
          <FolderIcon x={790} y={450} w={340} h={100} label="capital of" color={YELLOW} fill={SURFACE} progress={capitalP} seed="capital-folder" labelSize={42} />
        </g>
        <TreeEdge x1={860} y1={550} x2={630} y2={630} progress={leafP} seed="folder-e2" color={COMMENT} width={3.5} />
        <TreeEdge x1={1060} y1={550} x2={1290} y2={630} progress={leafP} seed="folder-e3" color={COMMENT} width={3.5} />
        <g opacity={leafP}>
          <FolderIcon x={520} y={630} w={240} h={80} label="France" color={GREEN} fill={SURFACE} progress={leafP} seed="leaf-fr" labelSize={40} />
          <FolderIcon x={1180} y={630} w={240} h={80} label="Japan" color={CYAN} fill={SURFACE} progress={leafP} seed="leaf-jp" labelSize={40} />
        </g>
        <TreeEdge x1={1220} y1={324} x2={1380} y2={450} progress={jokeP} seed="folder-e4" color={COMMENT} width={3.5} />
        <g opacity={jokeP}>
          <FolderIcon x={1320} y={450} w={280} h={100} label="a joke" color={PURPLE} fill={SURFACE} progress={jokeP} seed="joke-folder" labelSize={42} />
          <T x={1460} y={602} text="separate branch" size={36} color={MUTED} anchor="middle" />
        </g>
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   11. Italy walks the existing path; only one new folder
   ───────────────────────────────────────────────────────────── */
export const Italy: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const arrive = cue('new request arrives', 0, [193.32, 195.9]);
  const italy = cue('Italy', 0, [194.6, 195.9]);
  const walk = cue('walks down the same path', 0, [196.74, 202.06]);
  const there = cue('already there', 0, [200.0, 202.06]);
  const works = cue('only the word Italy', 0, [202.52, 206.28]);
  const folder = cue('adds a new folder', 0, [204.4, 206.28]);
  const never = cue('never turn this on', 0, [206.78, 207.68]);
  const every = cue('every request', 0, [207.86, 209.28]);

  const treeP = prog(t, arrive.start - 0.1, 0.7);
  const cardP = prog(t, arrive.start + 0.2, 0.5);
  const walkP = prog(t, walk.start, 0.8);
  const newP = prog(t, works.start + 0.3, 0.6);
  const alwaysP = prog(t, never.start, 0.4);

  return (
    <Svg>
      <g opacity={treeP}>
        <FolderIcon x={700} y={172} w={440} h={104} label="helpful assistant" color={GREEN} fill={SURFACE} progress={treeP} seed="italy-root" labelSize={42} />
        <TreeEdge x1={920} y1={276} x2={920} y2={340} progress={treeP} seed="italy-e1" color={COMMENT} width={3.5} />
        <FolderIcon x={760} y={340} w={340} h={92} label="capital of" color={YELLOW} fill={SURFACE} progress={treeP} seed="italy-cap" labelSize={40} />
        <TreeEdge x1={840} y1={432} x2={600} y2={512} progress={treeP} seed="italy-e2" color={COMMENT} width={3.5} />
        <TreeEdge x1={920} y1={432} x2={920} y2={512} progress={treeP} seed="italy-e3" color={COMMENT} width={3.5} />
        <TreeEdge x1={1000} y1={432} x2={1240} y2={512} progress={treeP} seed="italy-e4" color={COMMENT} width={3.5} />
        <FolderIcon x={500} y={512} w={210} h={78} label="France" color={GREEN} fill={SURFACE} progress={treeP} seed="italy-fr" labelSize={38} />
        <FolderIcon x={815} y={512} w={210} h={78} label="Japan" color={CYAN} fill={SURFACE} progress={treeP} seed="italy-jp" labelSize={38} />
        <TreeEdge x1={1140} y1={280} x2={1330} y2={340} progress={treeP} seed="italy-e5" color={COMMENT} width={3.5} />
        <FolderIcon x={1280} y={340} w={240} h={92} label="a joke" color={PURPLE} fill={SURFACE} progress={treeP} seed="italy-joke" labelSize={40} />
      </g>

      {/* request arrives from the left */}
      <g opacity={cardP}>
        <SketchRect x={150} y={312} w={300} h={190} fill={SURFACE} progress={cardP} radius={14} seed="italy-card" strokeWidth={4} color={ORANGE} />
        <T x={300} y={386} text="request" size={38} color={MUTED} anchor="middle" />
        <T x={300} y={454} text="Italy" size={64} color={ORANGE} anchor="middle" font="head" />
      </g>

      <g opacity={walkP}>
        <SketchPath d="M 920 432 L 920 512" progress={walkP} seed="walk-line" color={GREEN} strokeWidth={5} />
        <SketchPath d="M 1000 432 Q 1060 470 1240 512" progress={walkP} seed="walk-line-2" color={GREEN} strokeWidth={5} />
        <T x={720} y={720} text="already cached" size={40} color={GREEN} anchor="middle" opacity={prog(t, there.start, 0.4)} />
      </g>

      <g opacity={newP}>
        <FolderIcon x={1120} y={512} w={240} h={78} label="Italy" color={ORANGE} fill={SURFACE} progress={newP} seed="italy-new" labelSize={42} />
        <T x={1240} y={650} text="only this is new" size={40} color={ORANGE} anchor="middle" />
        <T x={1240} y={696} text="one folder" size={36} color={MUTED} anchor="middle" opacity={prog(t, folder.start, 0.35)} />
      </g>

      <g opacity={alwaysP}>
        <SketchRect x={700} y={760} w={440} h={82} fill={SURFACE} progress={alwaysP} radius={41} seed="always-on" strokeWidth={4} color={GREEN} />
        <T x={920} y={814} text="always on" size={46} color={GREEN} anchor="middle" font="head" />
        <T x={920} y={890} text="for every request" size={38} color={MUTED} anchor="middle" opacity={prog(t, every.start, 0.35)} />
      </g>
    </Svg>
  );
};
