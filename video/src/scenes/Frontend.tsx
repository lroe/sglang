import React from 'react';
import {BG, COMMENT, CYAN, GREEN, INK, MUTED, ORANGE, PURPLE, RED, SURFACE, SURFACE_2, WELL, YELLOW} from '../theme';
import {Arrow, Card, CheckMark, CrossMark, GPUChip, JsonCard, Panel, Person, Phone, Server, StackedPrompt, TokenRow, TokenSquare, TreeNode, TreeEdge, WavyUnderline} from '../lib/objects';
import {CueNumber, CuePill, CueT, MultiT, PopGroup, T} from '../lib/copy';
import {Svg, clamp01, dim, prog, useDim, useScene, useTime} from '../lib/scene';
import {SketchCheck, SketchCircle, SketchCross, SketchEllipse, SketchLine, SketchPath, SketchRect} from '../lib/rough';

/* ─────────────────────────────────────────────────────────────
   12. One catch: matching starts at the first token
   ───────────────────────────────────────────────────────────── */
export const Catch: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const catchCue = cue('There is one catch', 0, [209.28, 210.78]);
  const match = cue('matching starts from the very first token', 0, [211.56, 216.48]);
  const first = cue('first token', 0, [212.5, 216.48]);
  const timestamp = cue('timestamp at the top', 0, [217.1, 223.26]);
  const different = cue('every request looks different', 0, [219.8, 223.26]);
  const cannot = cue('cache cannot help', 0, [222.0, 223.26]);
  const fix = cue('The fix', 0, [223.84, 227.7]);
  const fixed = cue('fixed text at the front', 0, [224.2, 227.7]);
  const changing = cue('changing text at the end', 0, [225.2, 227.7]);

  const rowP = prog(t, 0.15, 0.7);
  const bracketP = prog(t, match.start + 0.2, 0.5);
  const stampP = prog(t, timestamp.start, 0.4);
  const cascade = prog(t, different.start, 0.6);
  const fixP = prog(t, fix.start, 0.6);
  const rowADim = useDim(fix.start - 0.1, 0.25);

  const row = (y: number, stamp: boolean) => (
    <g>
      {stamp ? (
        <g opacity={stampP}>
          <SketchRect x={180} y={y - 6} w={180} h={66} fill={SURFACE} progress={stampP} radius={8} seed="timestamp-stamp" strokeWidth={3.5} color={RED} />
          <T x={270} y={y + 38} text="12:04" size={38} color={RED} anchor="middle" />
        </g>
      ) : null}
      {Array.from({length: 12}).map((_, i) => {
        const x = (stamp ? 390 : 220) + i * 86;
        const bad = stamp && i < 11 && cascade > 0.15;
        return (
          <TokenSquare
            key={i}
            x={x}
            y={y}
            s={58}
            fill={bad ? RED : i === 0 ? SURFACE_2 : SURFACE}
            color={bad ? RED : i === 0 ? YELLOW : INK}
            progress={rowP}
            seed={`${stamp ? 'bad' : 'good'}-tok-${i}`}
          />
        );
      })}
    </g>
  );

  return (
    <Svg>

      <g opacity={rowADim}>
        <T x={260} y={246} text="matching starts at the first token" size={42} color={INK} />
        {row(278, false)}
        <g opacity={bracketP}>
          <SketchPath d="M 210 236 Q 240 206 280 236" progress={bracketP} seed="first-bracket" color={YELLOW} strokeWidth={4} />
          <T x={280} y={210} text="first token" size={38} color={YELLOW} anchor="middle" />
        </g>
        <g opacity={stampP}>
          {row(430, true)}
          <T x={960} y={530} text="cache misses everywhere" size={42} color={RED} anchor="middle" opacity={prog(t, cannot.start, 0.4)} />
        </g>
      </g>

      <g opacity={fixP}>
        <T x={960} y={620} text="fix: put the fixed text first" size={46} color={GREEN} anchor="middle" font="head" />
        <SketchRect x={220} y={670} w={650} h={80} fill={SURFACE} progress={fixP} radius={10} seed="fixed-row" strokeWidth={3.5} color={GREEN} />
        <T x={545} y={722} text="fixed text" size={40} color={GREEN} anchor="middle" />
        <SketchRect x={900} y={670} w={380} h={80} fill={SURFACE} progress={fixP} radius={10} seed="changing-row" strokeWidth={3.5} color={YELLOW} />
        <T x={1090} y={722} text="changing text" size={40} color={YELLOW} anchor="middle" />
        <SketchRect x={1320} y={670} w={180} h={80} fill={SURFACE} progress={fixP} radius={10} seed="timestamp-end" strokeWidth={3.5} color={RED} />
        <T x={1410} y={722} text="12:04" size={40} color={RED} anchor="middle" />
        <T x={1410} y={790} text="at the end" size={36} color={MUTED} anchor="middle" />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   13. LRU eviction in GPU memory
   ───────────────────────────────────────────────────────────── */
export const LRU: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const memory = cue('cache lives in GPU memory', 0, [227.7, 231.46]);
  const fills = cue('memory fills up', 0, [230.0, 231.46]);
  const lru = cue('least recently used', 0, [231.82, 235.28]);
  const stays = cue('system prompt that every request touches stays', 0, [235.8, 238.26]);
  const goes = cue('odd one-off question that nobody repeats goes', 0, [238.92, 241.72]);

  const memP = prog(t, 0.15, 0.7);
  const fillP = prog(t, 0.2, 0.7);
  const lruP = prog(t, 0.2, 0.6);
  const staysP = prog(t, stays.start, 0.5);
  const goesP = prog(t, goes.start, 0.5);

  return (
    <Svg>
      <T x={360} y={176} text="GPU memory" size={48} color={CYAN} font="head" opacity={memP} />
      <SketchRect x={290} y={212} w={180} h={620} fill={WELL} progress={memP} radius={12} seed="mem-bar" strokeWidth={4} color={INK} />
      {Array.from({length: 8}).map((_, i) => {
        const filled = i < 7;
        return (
          <g key={i} opacity={filled ? fillP : 0.35}>
            <SketchRect x={306} y={230 + i * 74} w={148} h={58} fill={filled ? (i === 6 ? RED : SURFACE_2) : 'none'} progress={fillP} radius={6} seed={`mem-block-${i}`} strokeWidth={3} color={filled ? (i === 6 ? RED : INK) : COMMENT} />
            <TokenRow x={320} y={244 + i * 74} n={5} s={16} gap={5} fill={filled ? GREEN : SURFACE_2} progress={fillP} seed={`mem-tok-${i}`} />
          </g>
        );
      })}
      <T x={380} y={872} text="fills up" size={44} color={RED} anchor="middle" opacity={prog(t, fills.start, 0.4)} />

      <g opacity={lruP}>
        <T x={1180} y={176} text="least recently used" size={46} color={YELLOW} anchor="middle" font="head" opacity={prog(t, lru.start, 0.4)} />
        <TreeNode x={1020} y={230} w={340} h={94} label="system prompt" color={GREEN} fill={SURFACE} progress={lruP} seed="lru-root" labelSize={38} glow={staysP} />
        <TreeEdge x1={1120} y1={324} x2={920} y2={430} progress={lruP} seed="lru-e1" color={COMMENT} width={3.5} />
        <TreeEdge x1={1260} y1={324} x2={1460} y2={430} progress={lruP} seed="lru-e2" color={COMMENT} width={3.5} />
        <TreeNode x={780} y={430} w={300} h={86} label="every request" color={GREEN} fill={SURFACE} progress={lruP} seed="lru-shared" labelSize={36} />
        <g opacity={1 - goesP * 0.75}>
          <TreeNode x={1310} y={430} w={300} h={86} label="one-off" color={RED} fill={SURFACE} progress={lruP} seed="lru-one" labelSize={38} />
          <TreeEdge x1={1460} y1={516} x2={1460} y2={590} progress={lruP} seed="lru-e3" color={COMMENT} width={3.5} />
          <TreeNode x={1320} y={590} w={280} h={80} label="nobody repeats" color={MUTED} fill={SURFACE} progress={lruP} seed="lru-odd" labelSize={36} />
        </g>
        <g opacity={goesP}>
          <T x={1460} y={740} text="goes" size={52} color={RED} anchor="middle" font="head" />
        </g>
        <g opacity={staysP}>
          <T x={930} y={760} text="stays" size={52} color={GREEN} anchor="middle" font="head" />
          <SketchCheck x={850} y={715} size={44} progress={staysP} color={GREEN} />
        </g>
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   14. A quick subscribe side-note
   ───────────────────────────────────────────────────────────── */
export const Subscribe: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const side = cue('Quick side note', 0, [242.94, 243.5]);
  const subscribe = cue('subscribe', 0, [245.6, 247.58]);
  const tech = cue('new AI tech', 0, [244.5, 247.58]);
  const jargon = cue('without the jargon', 0, [246.0, 247.58]);
  const simple = cue('simple words', 0, [248.16, 252.4]);

  const bell = prog(t, side.start - 0.1, 0.7);
  const sub = prog(t, subscribe.start - 0.1, 0.5);
  return (
    <Svg>
      <g transform="translate(960 390)" opacity={bell}>
        <SketchPath d="M -90 100 Q -90 10 -60 -36 Q -32 -80 0 -80 Q 32 -80 60 -36 Q 90 10 90 100 Z" fill={SURFACE} progress={bell} seed="bell-body" strokeWidth={5} color={YELLOW} />
        <SketchPath d="M -110 100 Q 0 128 110 100" fill="none" progress={bell} seed="bell-rim" strokeWidth={5} color={YELLOW} />
        <SketchCircle cx={0} cy={116} r={17} progress={bell} strokeWidth={4} color={YELLOW} seed="bell-clap" />
        {[0, 1, 2].map((i) => (
          <SketchPath key={i} d={`M ${110 + i * 20} ${-60 + i * 26} Q ${160 + i * 20} ${-20 + i * 26} ${110 + i * 20} ${50 + i * 26}`} progress={bell} seed={`bell-ring-${i}`} strokeWidth={3.5} color={YELLOW} />
        ))}
      </g>
      <T x={960} y={650} text="subscribe" size={86} color={INK} anchor="middle" font="head" opacity={sub} />
      <g opacity={prog(t, tech.start, 0.4)}>
        <CuePill text="new AI" phrase="new AI tech" fallback={[244.5, 247.58]} x={720} y={744} w={190} color={GREEN} border={GREEN} size={40} />
        <CuePill text="no jargon" phrase="without the jargon" fallback={[246.0, 247.58]} x={960} y={744} w={220} color={CYAN} border={CYAN} size={40} />
        <CuePill text="plain words" phrase="simple words" fallback={[248.16, 252.4]} x={1210} y={744} w={240} color={YELLOW} border={YELLOW} size={40} />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   15. Frontend language: summarize, then translate
   ───────────────────────────────────────────────────────────── */
export const FrontendSteps: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const title = cue('Next, the frontend language', 0, [255.18, 257.08]);
  const steps = cue('more than one step', 0, [257.98, 260.44]);
  const example = cue('summarize a paragraph', 0, [260.92, 265.14]);
  const french = cue('translate that summary into French', 0, [262.5, 265.14]);

  const p1 = prog(t, 0.2, 0.6);
  const p2 = prog(t, 0.35, 0.6);
  return (
    <Svg>
      <T x={960} y={164} text="frontend language" size={64} color={PURPLE} anchor="middle" font="head" opacity={prog(t, title.start, 0.4)} />

      <g opacity={p1}>
        <SketchRect x={220} y={340} w={420} h={330} fill={SURFACE} progress={p1} radius={16} seed="step-source" strokeWidth={4} color={INK} />
        <T x={430} y={404} text="paragraph" size={48} color={INK} anchor="middle" opacity={prog(t, example.start, 0.4)} />
        {Array.from({length: 5}).map((_, i) => (
          <SketchLine key={i} x1={270} y1={450 + i * 34} x2={i === 4 ? 520 : 590} y2={450 + i * 34} progress={p1} seed={`para-line-${i}`} strokeWidth={3} color={COMMENT} />
        ))}
      </g>
      <Arrow x1={660} y1={510} x2={760} y2={510} progress={p1} color={GREEN} width={4} seed="sum-arrow" />
      <g opacity={p1}>
        <SketchRect x={770} y={400} w={340} h={210} fill={SURFACE} progress={p1} radius={16} seed="step-summary" strokeWidth={4} color={GREEN} />
        <T x={940} y={466} text="summary" size={46} color={GREEN} anchor="middle" opacity={prog(t, example.start + 0.2, 0.4)} />
        <T x={940} y={518} text="short version" size={36} color={MUTED} anchor="middle" opacity={prog(t, example.start + 0.2, 0.4)} />
      </g>
      <Arrow x1={1130} y1={510} x2={1230} y2={510} progress={p2} color={YELLOW} width={4} seed="trans-arrow" />
      <g opacity={p2}>
        <SketchRect x={1240} y={400} w={380} h={210} fill={SURFACE} progress={p2} radius={16} seed="step-french" strokeWidth={4} color={YELLOW} />
        <T x={1430} y={466} text="French" size={48} color={YELLOW} anchor="middle" opacity={prog(t, french.start, 0.4)} />
        <T x={1430} y={518} text="translated" size={36} color={MUTED} anchor="middle" opacity={prog(t, french.start, 0.4)} />
      </g>
      <T x={960} y={710} text="one program, two steps" size={44} color={PURPLE} anchor="middle" opacity={prog(t, french.start + 0.2, 0.4)} />
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   16. The worksheet: summary, french, and gen()
   ───────────────────────────────────────────────────────────── */
export const Worksheet: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const python = cue('Python function', 0, [265.82, 271.08]);
  const worksheet = cue('fill-in-the-blanks worksheet', 0, [267.5, 271.08]);
  const summary = cue('blank called summary', 0, [271.56, 275.4]);
  const fill = cue('model fills it in', 0, [273.8, 275.4]);
  const french = cue('blank called french', 0, [275.4, 282.48]);
  const carried = cue('summary already on the page', 0, [278.0, 282.48]);
  const gen = cue('Each blank is one call', 0, [283.24, 286.66]);

  const p = prog(t, python.start - 0.1, 0.8);
  const sP = prog(t, summary.start, 0.5);
  const fP = prog(t, french.start, 0.5);
  const gP = prog(t, gen.start, 0.5);

  return (
    <Svg>
      <T x={960} y={146} text="a Python function" size={54} color={PURPLE} anchor="middle" font="head" opacity={prog(t, python.start, 0.4)} />
      <SketchRect x={290} y={196} w={1340} h={720} fill={SURFACE} progress={p} radius={20} seed="worksheet-panel" strokeWidth={4.5} color={INK} />
      <SketchLine x1={330} y1={278} x2={1590} y2={278} progress={p} seed="worksheet-rule" strokeWidth={3} color={SURFACE_2} />
      <T x={350} y={254} text="worksheet.py" size={38} color={MUTED} />
      <T x={350} y={356} text="def summarize_then_translate(text):" size={42} color={CYAN} />
      <T x={350} y={436} text="    summary = gen(" size={42} color={INK} />
      <T x={350} y={516} text="    french  = gen(" size={42} color={INK} />
      <T x={350} y={596} text="    return french" size={42} color={INK} />

      <g opacity={sP}>
        <SketchRect x={720} y={396} w={210} h={54} fill={GREEN} progress={sP} radius={6} seed="summary-blank" strokeWidth={3} color={GREEN} />
        <T x={825} y={434} text="summary" size={38} color={BG} anchor="middle" />
        <T x={980} y={360} text="blank = summary" size={42} color={GREEN} />
        <T x={980} y={402} text="model fills it" size={36} color={MUTED} opacity={prog(t, fill.start, 0.35)} />
      </g>

      <g opacity={fP}>
        <SketchRect x={720} y={476} w={190} h={54} fill={YELLOW} progress={fP} radius={6} seed="french-blank" strokeWidth={3} color={YELLOW} />
        <T x={815} y={514} text="french" size={38} color={BG} anchor="middle" />
        <T x={980} y={522} text="blank = french" size={42} color={YELLOW} />
        <T x={980} y={566} text="uses summary" size={36} color={MUTED} />
      </g>

      <g opacity={gP}>
        <SketchRect x={1210} y={668} w={240} h={78} fill={WELL} progress={gP} radius={10} seed="gen-pill-1" strokeWidth={3.5} color={PURPLE} />
        <T x={1330} y={718} text="gen()" size={42} color={PURPLE} anchor="middle" />
        <T x={1470} y={718} text="×2" size={42} color={GREEN} />
        <T x={350} y={690} text="each blank = one call to gen" size={42} color={PURPLE} opacity={gP} />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   17. The program shows the runtime what is fixed and new
   ───────────────────────────────────────────────────────────── */
export const ProgramShows: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const shows = cue('program itself shows the runtime', 0, [287.58, 293.4]);
  const fixed = cue('which text is fixed', 0, [289.4, 293.4]);
  const newText = cue('which text is new', 0, [290.8, 293.4]);
  const many = cue('many requests run the same program', 0, [293.82, 300.54]);
  const shared = cue('shared beginnings go into the radix tree', 0, [296.0, 300.54]);
  const noWork = cue('without any extra work', 0, [298.0, 300.54]);

  const p = prog(t, 0.15, 0.8);
  const fP = prog(t, fixed.start, 0.5);
  const nP = prog(t, newText.start, 0.5);
  const manyP = prog(t, 0.3, 0.6);
  const treeP = prog(t, 0.45, 0.7);

  return (
    <Svg>
      <SketchRect x={170} y={230} w={620} h={560} fill={SURFACE} progress={p} radius={18} seed="program-card" strokeWidth={4.5} color={INK} />
      <T x={480} y={290} text="the program" size={42} color={MUTED} anchor="middle" />
      <T x={220} y={380} text="text = “fixed prompt”" size={40} color={GREEN} opacity={fP} />
      <T x={220} y={450} text="answer = gen(text)" size={40} color={YELLOW} opacity={nP} />
      <T x={220} y={520} text="more = gen(answer)" size={40} color={YELLOW} />
      <T x={220} y={620} text="fixed" size={42} color={GREEN} opacity={fP} />
      <SketchLine x1={320} y1={640} x2={620} y2={640} progress={fP} seed="fixed-under" color={GREEN} strokeWidth={4} />
      <T x={220} y={720} text="new" size={42} color={YELLOW} opacity={nP} />
      <SketchLine x1={300} y1={740} x2={620} y2={740} progress={nP} seed="new-under" color={YELLOW} strokeWidth={4} />

      <g opacity={manyP}>
        <SketchRect x={1020} y={210} w={700} h={640} fill={SURFACE} progress={manyP} radius={18} seed="runtime-panel" strokeWidth={4.5} color={INK} />
        <T x={1370} y={272} text="runtime + radix tree" size={42} color={CYAN} anchor="middle" />
        <Arrow x1={790} y1={510} x2={1000} y2={510} progress={manyP} color={PURPLE} width={4} seed="program-arrow" />
        <g opacity={treeP}>
          <TreeNode x={1210} y={330} w={320} h={80} label="fixed prompt" color={GREEN} fill={SURFACE} progress={treeP} seed="prog-root" labelSize={36} />
          <TreeEdge x1={1250} y1={410} x2={1180} y2={520} progress={treeP} seed="prog-e1" color={COMMENT} width={3.5} />
          <TreeEdge x1={1460} y1={410} x2={1540} y2={520} progress={treeP} seed="prog-e2" color={COMMENT} width={3.5} />
          <TreeNode x={1030} y={520} w={300} h={76} label="request A" color={GREEN} fill={SURFACE} progress={treeP} seed="prog-a" labelSize={36} />
          <TreeNode x={1400} y={520} w={300} h={76} label="request B" color={YELLOW} fill={SURFACE} progress={treeP} seed="prog-b" labelSize={36} />
          <T x={1370} y={730} text="no extra work" size={40} color={GREEN} anchor="middle" opacity={prog(t, noWork.start, 0.4)} />
        </g>
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   18. Batching: the empty slot and the tree
   ───────────────────────────────────────────────────────────── */
export const Batching: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const next = cue('Next, batching', 0, [301.24, 302.66]);
  const standard = cue('Continuous batching is standard', 0, [303.36, 308.44]);
  const notDifferent = cue('not what makes SGLang different', 0, [307.0, 308.44]);
  const normal = cue('normal batch', 0, [309.16, 313.62]);
  const empty = cue('empty slot', 0, [311.0, 313.62]);
  const continuous = cue('next waiting request takes that slot', 0, [314.26, 317.98]);
  const tree = cue('batches also go through the radix tree', 0, [318.8, 326.7]);
  const prefixes = cue('reuse each other’s prefixes', 0, [323.0, 326.7]);

  const gridP = prog(t, next.start - 0.1, 0.6);
  const stdP = prog(t, standard.start, 0.5);
  const normalP = prog(t, normal.start, 0.5);
  const emptyP = prog(t, empty.start, 0.4);
  const contP = prog(t, continuous.start, 0.5);
  const treeP = prog(t, tree.start, 0.7);

  const slots = Array.from({length: 6}).map((_, i) => ({x: 170 + (i % 3) * 300, y: 310 + Math.floor(i / 3) * 200}));

  return (
    <Svg>
      <T x={960} y={142} text="batching" size={64} color={INK} anchor="middle" font="head" opacity={gridP} />
      <T x={380} y={250} text="normal batch" size={40} color={YELLOW} opacity={normalP} />
      <T x={380} y={286} text="finished slot waits" size={36} color={RED} opacity={emptyP} />
      <T x={760} y={250} text="continuous" size={40} color={GREEN} opacity={contP} />
      <T x={760} y={286} text="next request enters" size={36} color={GREEN} opacity={contP} />

      {slots.map((s, i) => {
        const isEmptied = i === 1;
        const isEmpty = isEmptied && emptyP > 0.2 && contP < 0.15;
        const refill = isEmptied && contP > 0.15;
        const p = prog(t, next.start + i * 0.06, 0.4);
        return (
          <g key={i} opacity={p}>
            <SketchRect x={s.x} y={s.y} w={260} h={160} fill={isEmpty ? 'none' : SURFACE} progress={p} radius={12} seed={`batch-${i}`} strokeWidth={3.5} color={isEmpty ? RED : refill ? GREEN : INK} />
            <T x={s.x + 18} y={s.y + 40} text={refill ? 'new' : `request ${i + 1}`} size={36} color={refill ? GREEN : MUTED} />
            {isEmpty ? (
              <T x={s.x + 130} y={s.y + 100} text="empty" size={40} color={RED} anchor="middle" />
            ) : (
              <TokenRow x={s.x + 18} y={s.y + 66} n={6} s={26} gap={8} fill={refill ? GREEN : SURFACE_2} progress={p} seed={`batch-tok-${i}`} />
            )}
          </g>
        );
      })}

      <g opacity={treeP}>
        <Arrow x1={980} y1={450} x2={1190} y2={430} progress={treeP} color={GREEN} width={4} seed="batch-tree-arrow" />
        <TreeNode x={1250} y={300} w={320} h={80} label="radix tree" color={GREEN} fill={SURFACE} progress={treeP} seed="batch-root" labelSize={38} />
        <TreeEdge x1={1320} y1={380} x2={1270} y2={470} progress={treeP} seed="batch-e1" color={COMMENT} width={3.5} />
        <TreeEdge x1={1500} y1={380} x2={1550} y2={470} progress={treeP} seed="batch-e2" color={COMMENT} width={3.5} />
        <TreeNode x={1160} y={470} w={220} h={72} label="reuse" color={GREEN} fill={SURFACE} progress={treeP} seed="batch-reuse" labelSize={36} />
        <TreeNode x={1440} y={470} w={220} h={72} label="reuse" color={GREEN} fill={SURFACE} progress={treeP} seed="batch-reuse2" labelSize={36} />
        <T x={1400} y={600} text="prefixes shared" size={40} color={GREEN} anchor="middle" opacity={prog(t, prefixes.start, 0.4)} />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   19. JSON and the 3 a.m. parser crash
   ───────────────────────────────────────────────────────────── */
export const JsonCrash: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const structured = cue('structured generation', 0, [326.7, 330.34]);
  const ask = cue('JSON with a name and a capital', 0, [331.36, 334.46]);
  const works = cue('Most of the time it works', 0, [334.92, 335.94]);
  const forgets = cue('forgets a closing bracket', 0, [336.56, 340.0]);
  const chatter = cue('friendly sentence before the JSON', 0, [338.4, 341.0]);
  const crash = cue('parser crashes', 0, [340.4, 342.5]);
  const three = cue('three in the morning', 0, [342.0, 344.0]);

  const cardP = prog(t, 0.15, 0.7);
  const worksP = prog(t, works.start, 0.4);
  const badP = prog(t, forgets.start, 0.4);
  const chatP = prog(t, chatter.start, 0.4);
  const crashP = prog(t, crash.start, 0.5);
  const clockP = prog(t, three.start, 0.4);

  return (
    <Svg>
      <T x={960} y={146} text="structured generation" size={56} color={GREEN} anchor="middle" font="head" opacity={prog(t, structured.start, 0.4)} />

      <g opacity={cardP}>
        <JsonCard
          x={300}
          y={244}
          w={780}
          h={520}
          title="JSON"
          progress={cardP}
          seed="crash-json"
          codeSize={44}
          lines={[
            {text: '{', color: INK},
            {text: '"name": "Ada",', color: GREEN, indent: 24},
            {text: '"capital": "Paris"', color: GREEN, indent: 24},
            {text: badP > 0.3 ? '' : '}', color: badP > 0.3 ? RED : INK},
          ]}
        />
        <g opacity={worksP * (1 - badP)}>
          <SketchCheck x={900} y={690} size={48} progress={worksP} color={GREEN} />
          <T x={980} y={712} text="works" size={44} color={GREEN} />
        </g>
        <g opacity={badP}>
          <T x={300} y={820} text="missing closing bracket" size={40} color={RED} />
        </g>
      </g>

      <g opacity={chatP}>
        <SketchRect x={1160} y={244} w={560} h={150} fill={SURFACE} progress={chatP} radius={18} seed="chatter" strokeWidth={3.5} color={RED} />
        <T x={1440} y={300} text="“Sure! Here you go:”" size={38} color={RED} anchor="middle" />
        <T x={1440} y={352} text="extra chatter" size={36} color={MUTED} anchor="middle" />
        <SketchCross x={1620} y={220} size={46} progress={chatP} color={RED} strokeWidth={4} seed="chatter-cross" />
      </g>

      <g opacity={crashP}>
        <SketchRect x={1160} y={450} w={260} h={160} fill={SURFACE} progress={crashP} radius={12} seed="parser-box" strokeWidth={4} color={RED} />
        <T x={1290} y={512} text="parser" size={40} color={INK} anchor="middle" />
        <T x={1290} y={560} text="crash" size={38} color={RED} anchor="middle" />
        <SketchCross x={1180} y={455} size={58} progress={crashP} color={RED} strokeWidth={4} seed="parser-cross" />
      </g>

      <g opacity={clockP}>
        <SketchCircle cx={1580} cy={620} r={92} progress={clockP} strokeWidth={4} color={YELLOW} seed="clock-face" />
        <SketchLine x1={1580} y1={620} x2={1580} y2={560} progress={clockP} seed="clock-h" strokeWidth={4} color={YELLOW} />
        <SketchLine x1={1580} y1={620} x2={1630} y2={650} progress={clockP} seed="clock-m" strokeWidth={4} color={YELLOW} />
        <T x={1580} y={770} text="3:00 AM" size={54} color={YELLOW} anchor="middle" font="head" />
        <T x={1580} y={818} text="good luck" size={36} color={MUTED} anchor="middle" />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   20. Constrained decoding: a form with a dropdown
   ───────────────────────────────────────────────────────────── */
export const Constrained: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const title = cue('SGLang handles this with constrained decoding', 0, [344.7, 347.24]);
  const rule = cue('rule for the format', 0, [347.96, 353.62]);
  const valid = cue('keep the output valid', 0, [351.0, 353.62]);
  const dropdown = cue('form with a dropdown', 0, [354.3, 357.32]);
  const bracket = cue('opening bracket must come next', 0, [357.9, 365.28]);
  const blocked = cue('every other token is blocked', 0, [361.0, 365.28]);
  const chatter = cue('extra chatter before the JSON becomes impossible', 0, [362.8, 365.28]);

  const p = prog(t, title.start - 0.1, 0.7);
  const rP = prog(t, 0.15, 0.6);
  const dP = prog(t, dropdown.start, 0.6);
  const bP = prog(t, bracket.start, 0.6);
  const blockP = prog(t, blocked.start, 0.5);
  const chatP = prog(t, chatter.start, 0.4);

  const tokens = ['the', 'name', 'is', '{', 'capital', 'Paris', 'a', 'joke', 'sure', 'text'];

  return (
    <Svg>
      <T x={960} y={144} text="constrained decoding" size={62} color={GREEN} anchor="middle" font="head" opacity={p} />
      <SketchRect x={470} y={198} w={980} h={700} fill={SURFACE} progress={p} radius={22} seed="form-box" strokeWidth={4.5} color={INK} />
      <T x={960} y={262} text="format rule" size={38} color={MUTED} anchor="middle" />
      <g opacity={rP}>
        <SketchRect x={620} y={292} w={680} h={82} fill={WELL} progress={rP} radius={10} seed="rule-pill" strokeWidth={3} color={GREEN} />
        <T x={960} y={346} text="next token must be " size={42} color={INK} anchor="middle" />
        <T x={1200} y={346} text="{" size={48} color={GREEN} anchor="middle" />
      </g>

      <g opacity={dP}>
        <SketchRect x={660} y={430} w={600} h={94} fill={WELL} progress={dP} radius={12} seed="dropdown" strokeWidth={3.5} color={YELLOW} />
        <T x={700} y={490} text="output so far: { ..." size={40} color={MUTED} />
        <SketchPath d="M 1170 462 L 1200 492 L 1230 462" progress={dP} seed="dropdown-arrow" strokeWidth={4} color={YELLOW} />
      </g>

      <g opacity={bP}>
        <T x={960} y={590} text="allowed next tokens" size={38} color={MUTED} anchor="middle" />
        {tokens.map((tok, i) => {
          const x = 600 + (i % 5) * 160;
          const y = 620 + Math.floor(i / 5) * 86;
          const good = tok === '{';
          const bad = !good && blockP > 0.2;
          return (
            <g key={tok} opacity={prog(t, bracket.start + 0.1 + i * 0.05, 0.35)}>
              <SketchRect x={x} y={y} w={130} h={60} fill={good ? GREEN : SURFACE_2} progress={prog(t, bracket.start + 0.1 + i * 0.05, 0.35)} radius={10} seed={`token-${i}`} strokeWidth={3} color={bad ? RED : good ? GREEN : INK} />
              <T x={x + 65} y={y + 40} text={tok} size={40} color={good ? BG : INK} anchor="middle" />
              {bad ? <SketchCross x={x + 40} y={y + 10} size={44} progress={blockP} color={RED} strokeWidth={4} seed={`block-${i}`} /> : null}
            </g>
          );
        })}
        <T x={960} y={820} text={'only { is allowed'} size={38} color={GREEN} anchor="middle" opacity={blockP} />
      </g>

    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   21. Speed bonus: fixed keys are filled directly
   ───────────────────────────────────────────────────────────── */
export const SpeedBonus: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const bonus = cue('speed bonus', 0, [366.02, 367.78]);
  const fixes = cue('format already fixes part', 0, [368.44, 378.44]);
  const keys = cue('key names in the JSON', 0, [371.0, 374.0]);
  const directly = cue('fill those parts in directly', 0, [373.4, 376.0]);
  const instead = cue('instead of generating', 0, [375.5, 378.44]);

  const p = prog(t, bonus.start - 0.1, 0.7);
  const kP = prog(t, keys.start, 0.5);
  const dP = prog(t, directly.start, 0.5);

  return (
    <Svg>
      <JsonCard
        x={420}
        y={250}
        w={1080}
        h={560}
        title="JSON"
        progress={p}
        seed="speed-json"
        codeSize={46}
        lines={[
          {text: '{', color: INK},
          {text: '"name": "Ada",', color: kP > 0.2 ? GREEN : INK, indent: 24},
          {text: '"capital": "Paris"', color: kP > 0.2 ? GREEN : INK, indent: 24},
          {text: '}', color: INK},
        ]}
      />
      <g opacity={kP}>
        <SketchPath d="M 620 830 Q 960 860 1300 830" progress={kP} seed="keys-brace" color={GREEN} strokeWidth={4} />
      </g>
      <g opacity={dP}>
        <T x={700} y={900} text="key names: pre-filled" size={44} color={GREEN} anchor="middle" />
        <T x={1400} y={900} text="free speed" size={54} color={YELLOW} anchor="middle" font="head" />
        <T x={960} y={952} text="values generate; keys do not" size={38} color={MUTED} anchor="middle" opacity={prog(t, instead.start, 0.4)} />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   22. Three features worth knowing
   ───────────────────────────────────────────────────────────── */
export const ThreeFeatures: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const c = cue('three features', 0, [380.2, 383.04]);
  const p = prog(t, c.start - 0.1, 0.8);
  return (
    <Svg>
      <g opacity={p}>
        <T x={960} y={420} text="3 features" size={130} color={INK} anchor="middle" font="head" />
        <SketchLine x1={630} y1={470} x2={1290} y2={470} progress={p} seed="three-rule" color={GREEN} strokeWidth={4} />
        <g transform="translate(560 650)" opacity={prog(t, c.start + 0.2, 0.4)}>
          <Phone x={-70} y={-120} w={140} h={240} progress={prog(t, c.start + 0.2, 0.4)} accent={CYAN} />
          <T x={0} y={180} text="draft" size={36} color={CYAN} anchor="middle" />
        </g>
        <g transform="translate(960 650)" opacity={prog(t, c.start + 0.35, 0.4)}>
          <SketchRect x={-100} y={-90} w={200} h={140} fill={SURFACE} progress={prog(t, c.start + 0.35, 0.4)} radius={8} seed="feature-kitchen" strokeWidth={3.5} color={ORANGE} />
          <SketchLine x1={-70} y1={-30} x2={70} y2={-30} progress={1} seed="kitchen-line" strokeWidth={4} color={ORANGE} />
          <SketchCircle cx={-35} cy={-55} r={14} progress={1} strokeWidth={3} color={ORANGE} seed="kitchen-pan" />
          <T x={0} y={180} text="kitchens" size={36} color={ORANGE} anchor="middle" />
        </g>
        <g transform="translate(1380 650)" opacity={prog(t, c.start + 0.5, 0.4)}>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <SketchCircle cx={-60 + i * 60} cy={-60} r={28} progress={1} strokeWidth={3.5} color={GREEN} seed={`net-${i}`} />
              <SketchLine x1={-60 + i * 60} y1={-32} x2={0} y2={30} progress={1} seed={`net-e-${i}`} strokeWidth={3} color={GREEN} />
            </g>
          ))}
          <SketchCircle cx={0} cy={48} r={18} progress={1} strokeWidth={3.5} color={GREEN} seed="net-root" />
          <T x={0} y={180} text="one tree" size={36} color={GREEN} anchor="middle" />
        </g>
        <T x={960} y={900} text="1) draft  2) split  3) route" size={40} color={MUTED} anchor="middle" />
      </g>
    </Svg>
  );
};
