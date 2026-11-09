import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BG, COMMENT, CYAN, GREEN, INK, MUTED, ORANGE, RED, SURFACE, SURFACE_2, WELL, YELLOW} from '../theme';
import {Arrow, Card, ChatWindow, CheckMark, GPUChip, Panel, Person, StackedPrompt, TokenRow, TokenSquare, TreeNode, TreeEdge, WavyUnderline} from '../lib/objects';
import {CueNumber, CuePill, CueT, MultiT, PopGroup, T} from '../lib/copy';
import {Svg, clamp01, dim, prog, useDim, useScene, useTime} from '../lib/scene';
import {SketchCheck, SketchCircle, SketchCross, SketchEllipse, SketchLine, SketchPath, SketchRect} from '../lib/rough';

/* ─────────────────────────────────────────────────────────────
   1. A chatbot with a two-thousand-token system prompt
   ───────────────────────────────────────────────────────────── */
export const Chatbot: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const build = cue('Say we are building a chatbot', 0, [0, 2]);
  const prompt = cue('system prompt', 0, [2.6, 5]);
  const tokens = cue('2000 tokens', 0, [3.88, 4.94]);
  const rules = cue('rules', 0, [5.86, 6.2]);
  const tone = cue('tone of voice', 0, [6.58, 7.22]);
  const examples = cue('examples', 0, [7.48, 8.16]);
  const instructions = cue('every instruction', 0, [8.84, 9.68]);

  const chatOut = 1 - prog(t, prompt.start - 0.15, 0.15);
  const card = prog(t, prompt.start - 0.15, 0.6);
  const big = prog(t, tokens.start, 0.5);
  const row = (c: {start: number}) => prog(t, c.start, 0.35);

  return (
    <Svg>
      <g opacity={chatOut}>
        <ChatWindow
          x={170}
          y={300}
          w={570}
          h={500}
          label="chatbot"
          progress={prog(t, build.start - 0.1, 0.9)}
          bubbles={[
            {text: 'hello', y: 104, side: 'right', color: GREEN, w: 180, opacity: prog(t, build.start + 0.35, 0.25)},
            {text: 'hi!', y: 184, side: 'left', w: 120, opacity: prog(t, build.start + 0.8, 0.25)},
            {text: 'this PDF', y: 280, side: 'right', color: GREEN, w: 230, opacity: prog(t, build.start + 1.25, 0.25)},
          ]}
        />
        <CueT
          x={180}
          y={245}
          text="building a chatbot"
          phrase="Say we are building a chatbot"
          fallback={[0, 2]}
          size={56}
          color={INK}
          font="head"
          delay={0.1}
          mode="type"
        />
      </g>

      <g opacity={card} transform="translate(-350 0)">
        <SketchRect x={920} y={180} w={780} h={720} fill={SURFACE} progress={card} radius={22} seed="prompt-card" strokeWidth={4.5} color={INK} />
        <T x={1310} y={246} text="system prompt" size={52} color={INK} anchor="middle" font="head" />
        <g opacity={big}>
          <T x={1240} y={470} text="2,000" size={146} color={GREEN} anchor="middle" font="head" />
          <T x={1460} y={454} text="tokens" size={46} color={GREEN} anchor="middle" />
          <WavyUnderline x1={1140} x2={1510} y={492} progress={big} color={GREEN} seed="prompt-underline" />
        </g>
        {[
          {label: 'rules', c: rules, y: 588, icon: 'rule'},
          {label: 'tone of voice', c: tone, y: 668, icon: 'tone'},
          {label: 'examples', c: examples, y: 748, icon: 'star'},
          {label: 'instructions', c: instructions, y: 828, icon: 'arrow'},
        ].map((r) => (
          <g key={r.label} opacity={row(r.c)}>
            <SketchCircle cx={990} cy={r.y - 12} r={13} progress={row(r.c)} strokeWidth={3} color={GREEN} seed={`prompt-dot-${r.label}`} />
            <SketchCheck x={978} y={r.y - 20} size={22} progress={row(r.c)} color={GREEN} />
            <T x={1028} y={r.y} text={r.label} size={46} color={INK} />
          </g>
        ))}
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   2. Ten thousand users × the same prompt
   ───────────────────────────────────────────────────────────── */
export const TenThousand: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const users = cue('10000 users', 0, [12.96, 14.58]);
  const message = cue('send a message', 0, [13.82, 14.58]);
  const everyone = cue('for every one of them', 0, [15.12, 16.08]);
  const reads = cue('reads those same 2000 tokens', 0, [16.44, 20]);
  const million = cue('20000000 tokens', 0, [21.56, 22.62]);
  const same = cue('same every time', 0, [24.56, 25.44]);
  const notCheap = cue('not cheap', 0, [26.32, 27.84]);
  const homework = cue('same homework', 0, [28.6, 31.32]);

  const grid = prog(t, users.start, 1.0);
  const gpuIn = prog(t, reads.start - 0.2, 0.8);
  const price = prog(t, notCheap.start, 0.4);
  const stack = prog(t, homework.start, 0.8);
  const gridDim = useDim(notCheap.start, 0.22);

  return (
    <Svg>
      <g opacity={gridDim}>
        <T x={360} y={218} text="10,000 users" size={58} color={INK} anchor="middle" font="head" opacity={prog(t, users.start, 0.4)} />
        {Array.from({length: 100}).map((_, i) => {
          const col = i % 10;
          const rowI = Math.floor(i / 10);
          const p = clamp01((grid - (i / 130)) * 2.2);
          return (
            <g key={i} opacity={p}>
              <SketchCircle cx={190 + col * 36} cy={292 + rowI * 36} r={6.5} progress={p} strokeWidth={2.5} color={i % 7 === 0 ? GREEN : MUTED} fill={i % 7 === 0 ? GREEN : 'none'} seed={`user-${i}`} />
            </g>
          );
        })}
        <g opacity={prog(t, message.start, 0.45)}>
          <SketchRect x={160} y={660} w={370} h={116} fill={SURFACE} progress={prog(t, message.start, 0.45)} radius={12} seed="message-card" strokeWidth={3.5} color={MUTED} />
          <T x={345} y={712} text="a message" size={42} color={INK} anchor="middle" />
          <T x={345} y={750} text="from each one" size={36} color={MUTED} anchor="middle" opacity={prog(t, everyone.start, 0.35)} />
        </g>
      </g>

      <Arrow x1={540} y1={450} x2={748} y2={440} progress={prog(t, reads.start - 0.3, 0.55)} color={GREEN} width={4} seed="to-gpu" />
      <g opacity={gpuIn}>
        <GPUChip x={770} y={330} w={360} h={240} progress={gpuIn} label="GPU" sub="same work, again" color={CYAN} seed="big-gpu" />
        <T x={950} y={226} text="2,000 tokens" size={44} color={GREEN} anchor="middle" opacity={prog(t, reads.start + 0.2, 0.4)} />
        <TokenRow x={806} y={252} n={12} s={24} gap={9} fill={SURFACE_2} progress={prog(t, reads.start + 0.4, 0.6)} seed="gpu-tokens" />
      </g>

      <g opacity={prog(t, million.start, 0.35)}>
        <T x={1560} y={324} text="tokens read" size={40} color={MUTED} anchor="middle" />
        <CueNumber value="20M" phrase="20000000 tokens" fallback={[21.56, 22.62]} x={1560} y={452} size={148} color={YELLOW} />
        <SketchLine x1={1400} y1={492} x2={1710} y2={492} progress={prog(t, million.start + 0.2, 0.5)} seed="20m-rule" color={YELLOW} strokeWidth={3.5} />
        <T x={1560} y={548} text="the result: identical" size={38} color={MUTED} anchor="middle" opacity={prog(t, same.start - 0.15, 0.35)} />
      </g>

      {/* not cheap */}
      <g opacity={prog(t, notCheap.start, 0.4)}>
        <g transform="rotate(-7 1130 660)">
          <SketchRect x={1040} y={570} w={190} h={92} fill={SURFACE} progress={prog(t, notCheap.start, 0.35)} radius={10} seed="price-tag" strokeWidth={3.5} color={RED} />
          <SketchCircle cx={1050} cy={582} r={7} progress={1} strokeWidth={2.5} color={RED} fill={BG} seed="tag-hole" />
          <T x={1140} y={626} text="not cheap" size={42} color={RED} anchor="middle" />
        </g>
      </g>

      {/* the same homework, ten thousand times */}
      <g opacity={stack}>
        {Array.from({length: 5}).map((_, i) => (
          <SketchRect
            key={i}
            x={720 + (4 - i) * 9}
            y={700 - (4 - i) * 9}
            w={520}
            h={140}
            fill={i === 4 ? SURFACE : SURFACE_2}
            progress={prog(t, homework.start + i * 0.06, 0.45)}
            radius={8}
            seed={`homework-${i}`}
            strokeWidth={3}
            color={i === 4 ? ORANGE : COMMENT}
          />
        ))}
        <T x={980} y={740} text="same homework" size={52} color={ORANGE} anchor="middle" font="head" />
        <T x={980} y={786} text="ten thousand times" size={38} color={MUTED} anchor="middle" />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   3. The same pattern in chat, documents and agents
   ───────────────────────────────────────────────────────────── */
export const Examples: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const easy = cue('system prompt', 1, [32.16, 34.44]);
  const chat = cue('In a chat', 0, [35.02, 38.66]);
  const conversation = cue('whole conversation', 0, [36.3, 38.3]);
  const doc = cue('document question answering', 0, [39.14, 42.82]);
  const sameDoc = cue('same document', 0, [41.4, 42.82]);
  const agent = cue('In an agent', 0, [43.26, 46.66]);
  const tools = cue('tool descriptions', 0, [44.5, 46.66]);

  const frame = prog(t, 0.1, 0.8);
  const phase = (start: number, next: number) => {
    const inP = prog(t, start, 0.42);
    const outP = next > 0 ? prog(t, next, 0.28) : 0;
    return inP * (1 - outP);
  };

  const chatP = phase(chat.start, doc.start);
  const docP = phase(doc.start, agent.start);
  const agentP = prog(t, agent.start, 0.5);

  return (
    <Svg>
      <SketchRect x={620} y={194} w={680} h={700} fill={SURFACE} progress={frame} radius={24} seed="examples-frame" strokeWidth={4.5} color={INK} />
      <SketchLine x1={660} y1={266} x2={1260} y2={266} progress={frame} seed="examples-rule" strokeWidth={3} color={SURFACE_2} />

      {/* easy system prompt */}
      <g opacity={phase(easy.start, chat.start)}>
        <T x={960} y={330} text="system prompt" size={48} color={GREEN} anchor="middle" />
        <T x={960} y={388} text="2,000 tokens" size={38} color={MUTED} anchor="middle" />
        <g transform="translate(810 460)">
          <SketchRect x={0} y={0} w={300} h={210} fill={WELL} progress={phase(easy.start, chat.start)} radius={8} seed="easy-paper" strokeWidth={3.5} color={COMMENT} />
          {[0, 1, 2, 3, 4].map((i) => (
            <SketchLine key={i} x1={30} y1={42 + i * 32} x2={i === 4 ? 190 : 270} y2={42 + i * 32} progress={phase(easy.start, chat.start)} seed={`easy-line-${i}`} strokeWidth={3} color={i === 0 ? GREEN : COMMENT} />
          ))}
        </g>
        <T x={960} y={740} text="easy example" size={44} color={GREEN} anchor="middle" opacity={phase(easy.start, chat.start)} />
      </g>

      {/* chat: whole conversation */}
      <g opacity={chatP}>
        <SketchRect x={690} y={310} w={540} h={480} fill={WELL} progress={chatP} radius={18} seed="convo-frame" strokeWidth={3} color={SURFACE_2} />
        {[
          {y: 360, right: true, w: 300},
          {y: 446, right: false, w: 330},
          {y: 532, right: true, w: 260},
          {y: 618, right: false, w: 300},
          {y: 704, right: true, w: 240},
        ].map((b, i) => {
          const bx = b.right ? 1200 - b.w : 720;
          const p = prog(t, chat.start + 0.3 + i * 0.16, 0.3) * chatP;
          return (
            <g key={i} opacity={p}>
              <SketchRect x={bx} y={b.y} w={b.w} h={58} fill={b.right ? SURFACE_2 : SURFACE} progress={p} radius={18} seed={`convo-${i}`} strokeWidth={3} color={b.right ? GREEN : COMMENT} />
              <SketchLine x1={bx + 18} y1={b.y + 22} x2={bx + b.w - 22} y2={b.y + 22} progress={p} seed={`convo-l1-${i}`} strokeWidth={3} color={b.right ? GREEN : MUTED} />
              <SketchLine x1={bx + 18} y1={b.y + 40} x2={bx + b.w - 58} y2={b.y + 40} progress={p} seed={`convo-l2-${i}`} strokeWidth={3} color={b.right ? GREEN : MUTED} />
            </g>
          );
        })}
        <T x={960} y={272} text="whole conversation" size={44} color={GREEN} anchor="middle" opacity={conversation.start <= t ? 1 : 0} />
      </g>

      {/* document */}
      <g opacity={docP}>
        <SketchRect x={760} y={310} w={400} h={480} fill={WELL} progress={docP} radius={10} seed="doc-paper" strokeWidth={3.5} color={COMMENT} />
        <T x={960} y={356} text="the document" size={42} color={YELLOW} anchor="middle" />
        {Array.from({length: 9}).map((_, i) => (
          <SketchLine key={i} x1={800} y1={398 + i * 34} x2={i === 8 ? 1000 : 1120} y2={398 + i * 34} progress={docP} seed={`doc-line-${i}`} strokeWidth={3} color={i < 5 ? COMMENT : GREEN} />
        ))}
        <T x={960} y={742} text="same document" size={44} color={GREEN} anchor="middle" opacity={sameDoc.start <= t ? 1 : 0} />
      </g>

      {/* agent tools */}
      <g opacity={agentP}>
        <T x={960} y={310} text="tool descriptions" size={46} color={GREEN} anchor="middle" />
        {[
          {name: 'search', icon: 'magnifier'},
          {name: 'calendar', icon: 'calendar'},
          {name: 'send email', icon: 'mail'},
        ].map((tool, i) => (
          <g key={tool.name} opacity={prog(t, agent.start + 0.35 + i * 0.18, 0.35)}>
            <SketchRect x={720} y={368 + i * 108} w={480} h={82} fill={WELL} progress={prog(t, agent.start + 0.35 + i * 0.18, 0.35)} radius={10} seed={`tool-${i}`} strokeWidth={3} color={SURFACE_2} />
            <SketchCircle cx={770} cy={409 + i * 108} r={20} progress={prog(t, agent.start + 0.35 + i * 0.18, 0.35)} strokeWidth={3} color={GREEN} seed={`tool-dot-${i}`} />
            <T x={810} y={422 + i * 108} text={tool.name} size={42} color={INK} />
            <T x={1150} y={422 + i * 108} text="same" size={36} color={GREEN} anchor="end" />
          </g>
        ))}
        <T x={960} y={742} text="every request" size={44} color={GREEN} anchor="middle" opacity={tools.start <= t ? 1 : 0} />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   4. The tree is the trick; SGLang is the framework
   ───────────────────────────────────────────────────────────── */
export const TreeIdea: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const skip = cue('a tree is how we skip it', 0, [48.5, 52.16]);
  const serving = cue('serving framework called SGLang', 0, [52.7, 56.24]);
  const sglang = cue('SGLang', 0, [55.48, 56.24]);
  const notes = cue('what an LLM saves', 0, [56.9, 61.58]);

  const cardsP = prog(t, 0.15, 0.7);
  const sharedP = prog(t, skip.start, 0.6);
  const tree = prog(t, serving.start - 0.1, 0.8);
  const brand = prog(t, sglang.start, 0.5);
  const notesP = prog(t, notes.start, 0.8);
  const cardsOut = 1 - prog(t, serving.start - 0.15, 0.3);
  const treeDim = useDim(notes.start - 0.1, 0.3);

  const request = (x: number, label: string, ending: string, color: string, delay: number) => (
    <g opacity={prog(t, 0.2 + delay, 0.5) * cardsOut}>
      <SketchRect x={x} y={140} w={620} h={190} fill={SURFACE} progress={prog(t, 0.2 + delay, 0.5)} radius={16} seed={`request-${label}`} strokeWidth={4} color={INK} />
      <T x={x + 26} y={182} text={label} size={36} color={MUTED} />
      <T x={x + 26} y={250} text="The cat sat on" size={42} color={GREEN} />
      <T x={x + 26} y={302} text={ending} size={42} color={color} />
      <SketchLine x1={x + 24} y1={268} x2={x + 250} y2={268} progress={prog(t, 0.2 + delay, 0.5)} seed={`prefix-rule-${label}`} strokeWidth={3} color={GREEN} />
    </g>
  );

  return (
    <Svg>
      {request(220, 'request A', 'the mat', YELLOW, 0)}
      {request(1080, 'request B', 'the roof', ORANGE, 0.2)}

      <g opacity={sharedP * cardsOut}>
        <SketchRect x={640} y={356} w={640} h={60} fill={SURFACE} progress={sharedP} radius={30} seed="read-once-pill" strokeWidth={3.5} color={GREEN} />
        <SketchCheck x={675} y={374} size={30} progress={sharedP} color={GREEN} />
        <T x={960} y={398} text="read once" size={44} color={GREEN} anchor="middle" font="head" />
      </g>

      <g opacity={treeDim}>
        <TreeNode x={720} y={430} w={480} h={100} label="The cat sat on..." color={GREEN} fill={SURFACE} progress={tree} seed="cat-root" labelSize={42} glow={sharedP * tree} />
        <SketchCheck x={795} y={366} size={30} progress={tree} color={GREEN} />
        <T x={835} y={392} text="read once" size={38} color={GREEN} opacity={tree} />
        <TreeEdge x1={960} y1={530} x2={660} y2={610} progress={tree} seed="cat-e1" color={GREEN} width={4} />
        <TreeEdge x1={960} y1={530} x2={1060} y2={610} progress={tree} seed="cat-e2" color={ORANGE} width={4} />
        <TreeNode x={530} y={610} w={260} h={82} label="the mat" color={YELLOW} fill={SURFACE} progress={prog(t, serving.start + 0.35, 0.5)} seed="cat-leaf-a" labelSize={40} />
        <TreeNode x={930} y={610} w={260} h={82} label="the roof" color={ORANGE} fill={SURFACE} progress={prog(t, serving.start + 0.5, 0.5)} seed="cat-leaf-b" labelSize={40} />
        <T x={960} y={750} text="different endings" size={38} color={MUTED} anchor="middle" opacity={prog(t, serving.start + 0.55, 0.4)} />
      </g>

      <g opacity={brand}>
        <T x={960} y={850} text="SGLang" size={104} color={INK} anchor="middle" font="head" />
        <T x={960} y={898} text="a serving framework" size={40} color={MUTED} anchor="middle" />
      </g>

      <g opacity={notesP}>
        <T x={1550} y={314} text="what it saves" size={46} color={YELLOW} anchor="middle" opacity={prog(t, notes.start + 0.15, 0.4)} />
        <SketchRect x={1360} y={350} w={380} h={460} fill={SURFACE} progress={notesP} radius={14} seed="notes-card" strokeWidth={4} color={YELLOW} />
        <T x={1550} y={416} text="notes" size={52} color={YELLOW} anchor="middle" font="head" />
        {Array.from({length: 5}).map((_, i) => (
          <SketchLine key={i} x1={1405} y1={470 + i * 48} x2={i === 4 ? 1580 : 1695} y2={470 + i * 48} progress={notesP} seed={`notes-line-${i}`} strokeWidth={3} color={i === 2 ? YELLOW : COMMENT} />
        ))}
        <T x={1550} y={768} text="one note per token" size={38} color={MUTED} anchor="middle" />
      </g>
      <Arrow x1={1290} y1={560} x2={1350} y2={560} progress={notesP} color={YELLOW} width={4} seed="to-notes" />
    </Svg>
  );
};
