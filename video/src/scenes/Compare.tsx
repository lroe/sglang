import React from 'react';
import {COMMENT, CYAN, GREEN, INK, MUTED, ORANGE, PINK, PURPLE, RED, SURFACE, SURFACE_2, WELL, YELLOW} from '../theme';
import {Arrow, Card, CheckMark, CrossMark, GPUChip, JsonCard, Panel, Person, Phone, Server, StackedPrompt, TokenRow, TokenSquare, TreeNode, TreeEdge, WavyUnderline} from '../lib/objects';
import {CueNumber, CuePill, CueT, MultiT, PopGroup, T} from '../lib/copy';
import {Svg, clamp01, dim, prog, useDim, useScene, useTime} from '../lib/scene';
import {SketchCheck, SketchCircle, SketchCross, SketchEllipse, SketchLine, SketchPath, SketchRect} from '../lib/rough';

/* ─────────────────────────────────────────────────────────────
   23. Speculative decoding: small drafter, big verifier
   ───────────────────────────────────────────────────────────── */
export const SpecDraft: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const spec = cue('speculative decoding', 0, [383.72, 387.8]);
  const auto = cue('autocomplete on a phone', 0, [385.7, 387.8]);
  const helper = cue('small, fast helper model', 0, [388.32, 391.36]);
  const drafts = cue('drafts the next few tokens', 0, [389.3, 391.36]);
  const big = cue('big model reads all of them', 0, [391.36, 395.82]);
  const agrees = cue('keeps the ones it agrees with', 0, [393.2, 395.82]);

  const phoneP = prog(t, spec.start - 0.1, 0.7);
  const autoP = prog(t, auto.start, 0.4);
  const helperP = prog(t, helper.start, 0.6);
  const draftP = prog(t, drafts.start, 0.5);
  const bigP = prog(t, big.start, 0.6);
  const agreeP = prog(t, agrees.start, 0.4);
  const phoneDim = useDim(helper.start, 0.3);

  return (
    <Svg>
      <T x={960} y={138} text="speculative decoding" size={62} color={INK} anchor="middle" font="head" opacity={phoneP} />

      <g opacity={phoneDim}>
        <Phone x={180} y={300} w={300} h={520} progress={phoneP} accent={CYAN} seed="spec-phone">
          <T x={330} y={386} text="the capital of" size={36} color={MUTED} anchor="middle" />
          <T x={330} y={432} text="France is" size={38} color={INK} anchor="middle" />
          <T x={330} y={492} text="Paris" size={48} color={GREEN} anchor="middle" opacity={prog(t, auto.start + 0.15, 0.4)} />
          <SketchLine x1={235} y1={515} x2={425} y2={515} progress={prog(t, auto.start + 0.2, 0.4)} seed="phone-underline" color={GREEN} strokeWidth={4} />
          <T x={330} y={570} text="ghost text" size={36} color={MUTED} anchor="middle" />
        </Phone>
      </g>

      <g opacity={helperP}>
        <T x={760} y={330} text="small model" size={46} color={CYAN} anchor="middle" />
        <SketchRect x={620} y={360} w={280} h={170} fill={SURFACE} progress={helperP} radius={16} seed="small-model" strokeWidth={4} color={CYAN} />
        <T x={760} y={425} text="draft" size={44} color={CYAN} anchor="middle" />
        {Array.from({length: 5}).map((_, i) => (
          <TokenSquare key={i} x={642 + i * 48} y={450} s={38} fill={SURFACE_2} color={GREEN} progress={prog(t, draftP ? drafts.start + i * 0.08 : 0, 0.35)} seed={`draft-tok-${i}`} />
        ))}
        <T x={760} y={570} text="fast + cheap" size={36} color={MUTED} anchor="middle" opacity={draftP} />
      </g>

      <g opacity={bigP}>
        <T x={1370} y={330} text="big model" size={46} color={PURPLE} anchor="middle" />
        <GPUChip x={1190} y={360} w={360} h={190} progress={bigP} label="verify" sub="one pass" color={PURPLE} seed="big-model" />
        <Arrow x1={910} y1={470} x2={1170} y2={450} progress={bigP} color={PURPLE} width={4} seed="draft-to-big" />
        <g opacity={agreeP}>
          <SketchCheck x={1570} y={390} size={50} progress={agreeP} color={GREEN} />
          <T x={1640} y={410} text="agree" size={40} color={GREEN} />
        </g>
      </g>
      <T x={760} y={670} text="small drafts; big checks" size={42} color={MUTED} anchor="middle" opacity={prog(t, big.start + 0.2, 0.4)} />
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   24. Five draft tokens for the price of one read
   ───────────────────────────────────────────────────────────── */
export const SpecWin: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const cost = cue('Reading five tokens costs about the same as writing one', 0, [396.62, 403.62]);
  const mostly = cue('mostly right', 0, [400.0, 403.62]);
  const several = cue('several tokens for the price of one', 0, [401.5, 403.62]);
  const wrong = cue('draft goes wrong', 0, [404.46, 411.7]);
  const mistake = cue('up to the first mistake', 0, [406.4, 411.7]);
  const fixes = cue('fixes that token itself', 0, [408.5, 411.7]);
  const quality = cue('quality stays the same', 0, [410.0, 411.7]);

  const draftP = prog(t, cost.start - 0.1, 0.7);
  const acceptP = prog(t, mostly.start, 0.5);
  const wrongP = prog(t, wrong.start, 0.5);
  const fixP = prog(t, fixes.start, 0.5);
  const qP = prog(t, quality.start, 0.4);

  return (
    <Svg>
      <T x={960} y={142} text="5 draft tokens, 1 read" size={56} color={YELLOW} anchor="middle" font="head" opacity={prog(t, cost.start, 0.4)} />

      <g opacity={draftP}>
        <T x={300} y={286} text="draft" size={44} color={CYAN} />
        {Array.from({length: 5}).map((_, i) => {
          const isWrong = i === 4 && wrongP > 0.15;
          return (
            <TokenSquare key={i} x={400 + i * 190} y={248} s={82} fill={isWrong ? RED : i < 4 && acceptP > 0.1 ? GREEN : SURFACE_2} color={isWrong ? RED : i < 4 && acceptP > 0.1 ? GREEN : INK} progress={prog(t, cost.start + i * 0.08, 0.4)} seed={`win-token-${i}`} />
          );
        })}
        <T x={1590} y={286} text="≈ 1 read" size={44} color={GREEN} anchor="middle" opacity={acceptP} />
        <T x={1250} y={352} text="first mistake" size={42} color={RED} opacity={wrongP} />
        <SketchLine x1={1200} y1={340} x2={1200} y2={400} progress={wrongP} seed="mistake-line" color={RED} strokeWidth={4} />
      </g>

      <g opacity={acceptP}>
        <SketchRect x={610} y={400} w={700} h={180} fill={SURFACE} progress={acceptP} radius={16} seed="win-big" strokeWidth={4} color={PURPLE} />
        <T x={960} y={470} text="big model" size={46} color={PURPLE} anchor="middle" />
        <T x={960} y={520} text="accepts the run" size={38} color={GREEN} anchor="middle" />
        <T x={960} y={640} text="keep up to here" size={38} color={MUTED} anchor="middle" opacity={prog(t, mistake.start, 0.4)} />
        {Array.from({length: 4}).map((_, i) => (
          <TokenSquare key={i} x={480 + i * 90} y={680} s={62} fill={GREEN} color={GREEN} progress={prog(t, mostly.start + i * 0.06, 0.35)} seed={`accepted-${i}`} />
        ))}
        <T x={660} y={790} text="4 accepted" size={36} color={GREEN} anchor="middle" />
      </g>

      <g opacity={fixP}>
        <SketchCircle cx={1080} cy={712} r={48} progress={fixP} strokeWidth={4} color={GREEN} seed="fix-circle" />
        <T x={1080} y={728} text="fix" size={38} color={GREEN} anchor="middle" />
        <T x={1180} y={712} text="fixes that token" size={40} color={GREEN} opacity={fixP} />
        <T x={960} y={850} text="answer quality stays the same" size={38} color={GREEN} anchor="middle" opacity={qP} />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   25. Prefill and Decode: two terms
   ───────────────────────────────────────────────────────────── */
export const PrefillDecode: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const two = cue('The second needs two terms', 0, [412.7, 414.38]);
  const prefill = cue('Prefill is the stage where the model reads the whole prompt', 0, [415.1, 417.6]);
  const decode = cue('Decode is the stage where it writes the answer', 0, [418.4, 420.42]);

  const p = prog(t, two.start - 0.1, 0.6);
  const pre = prog(t, 0.2, 0.7);
  const dec = prog(t, 0.35, 0.7);

  return (
    <Svg>

      <g opacity={pre}>
        <T x={520} y={312} text="Prefill" size={80} color={CYAN} anchor="middle" font="head" />
        <SketchRect x={250} y={360} w={540} h={360} fill={SURFACE} progress={pre} radius={18} seed="prefill-box" strokeWidth={4} color={CYAN} />
        <T x={520} y={424} text="reads the whole prompt" size={40} color={INK} anchor="middle" />
        <SketchRect x={350} y={476} w={340} h={170} fill={WELL} progress={pre} radius={8} seed="prefill-doc" strokeWidth={3} color={COMMENT} />
        {Array.from({length: 5}).map((_, i) => (
          <SketchLine key={i} x1={380} y1={514 + i * 26} x2={i === 4 ? 560 : 660} y2={514 + i * 26} progress={pre} seed={`prefill-line-${i}`} strokeWidth={3} color={CYAN} />
        ))}
        <T x={520} y={690} text="raw compute" size={38} color={MUTED} anchor="middle" />
      </g>

      <g opacity={dec}>
        <T x={1400} y={312} text="Decode" size={80} color={GREEN} anchor="middle" font="head" />
        <SketchRect x={1130} y={360} w={540} h={360} fill={SURFACE} progress={dec} radius={18} seed="decode-box" strokeWidth={4} color={GREEN} />
        <T x={1400} y={424} text="writes the answer" size={40} color={INK} anchor="middle" />
        <TokenRow x={1210} y={500} n={7} s={44} gap={14} fill={SURFACE_2} progress={dec} seed="decode-tokens" />
        <T x={1400} y={600} text="one token at a time" size={36} color={MUTED} anchor="middle" />
        <T x={1400} y={690} text="memory" size={38} color={MUTED} anchor="middle" />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   26. The kitchen: prep and plating
   ───────────────────────────────────────────────────────────── */
export const Kitchen: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const imagine = cue('Imagine a kitchen', 0, [421.36, 422.04]);
  const prep = cue('prefill is prep work', 0, [422.48, 427.58]);
  const mountain = cue('mountain of chopping', 0, [423.5, 427.58]);
  const hands = cue('lots of hands', 0, [425.0, 427.58]);
  const compute = cue('raw compute', 0, [426.5, 427.58]);
  const plate = cue('decode is plating', 0, [428.44, 433.28]);
  const counter = cue('big, fast counter', 0, [430.4, 433.28]);
  const memory = cue('memory', 0, [432.0, 433.28]);

  const room = prog(t, imagine.start - 0.1, 0.7);
  const prepP = prog(t, 0.2, 0.8);
  const plateP = prog(t, 0.4, 0.8);
  const prepDim = useDim(plate.start, 0.35);

  return (
    <Svg>
      <g opacity={room}>
        <SketchLine x1={180} y1={790} x2={1740} y2={790} progress={room} seed="kitchen-floor" color={INK} strokeWidth={4} />
        <SketchRect x={230} y={260} w={1460} h={530} fill="none" progress={room} radius={18} seed="kitchen-frame" strokeWidth={4} color={SURFACE_2} />
        <T x={960} y={214} text="one kitchen" size={46} color={MUTED} anchor="middle" opacity={room} />
      </g>

      <g opacity={prepDim}>
        <T x={560} y={340} text="prefill = prep" size={52} color={CYAN} anchor="middle" font="head" opacity={prog(t, prep.start, 0.4)} />
        <SketchRect x={300} y={390} w={520} h={240} fill={SURFACE} progress={prepP} radius={12} seed="prep-counter" strokeWidth={4} color={CYAN} />
        <T x={560} y={470} text="mountain of chopping" size={38} color={INK} anchor="middle" opacity={prog(t, mountain.start, 0.4)} />
        {Array.from({length: 9}).map((_, i) => (
          <SketchCircle key={i} cx={410 + (i % 3) * 120} cy={540 + Math.floor(i / 3) * 32} r={22} progress={prog(t, mountain.start + i * 0.05, 0.35)} strokeWidth={3} color={ORANGE} fill={SURFACE_2} seed={`veg-${i}`} />
        ))}
        <g opacity={prog(t, hands.start, 0.4)}>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${360 + i * 150} 680)`}>
              <SketchLine x1={0} y1={0} x2={0} y2={-70} progress={prog(t, hands.start, 0.35)} seed={`hand-${i}`} color={INK} strokeWidth={4} />
              <SketchLine x1={0} y1={-70} x2={-22} y2={-110} progress={prog(t, hands.start, 0.35)} seed={`hand-l-${i}`} color={INK} strokeWidth={4} />
              <SketchLine x1={0} y1={-70} x2={22} y2={-110} progress={prog(t, hands.start, 0.35)} seed={`hand-r-${i}`} color={INK} strokeWidth={4} />
            </g>
          ))}
        </g>
        <T x={560} y={770} text="raw compute" size={38} color={MUTED} anchor="middle" opacity={prog(t, compute.start, 0.4)} />
      </g>

      <g opacity={plateP}>
        <T x={1360} y={340} text="decode = plating" size={52} color={GREEN} anchor="middle" font="head" opacity={prog(t, plate.start, 0.4)} />
        <SketchRect x={1100} y={390} w={520} h={240} fill={SURFACE} progress={plateP} radius={12} seed="plate-counter" strokeWidth={4} color={GREEN} />
        <SketchEllipse cx={1360} cy={500} w={180} h={90} fill={SURFACE_2} progress={plateP} strokeWidth={4} color={GREEN} seed="plate" />
        <SketchCircle cx={1360} cy={500} r={28} progress={plateP} fill={GREEN} strokeWidth={0} seed="plate-food" />
        <T x={1360} y={600} text="one dish at a time" size={36} color={MUTED} anchor="middle" opacity={prog(t, plate.start + 0.3, 0.4)} />
        <T x={1360} y={770} text="memory" size={38} color={MUTED} anchor="middle" opacity={prog(t, memory.start, 0.4)} />
        <T x={1360} y={690} text="big, fast counter" size={38} color={GREEN} anchor="middle" opacity={prog(t, counter.start, 0.4)} />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   27. One kitchen blocks; split the work in two
   ───────────────────────────────────────────────────────────── */
export const SplitKitchen: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const one = cue('In one kitchen', 0, [434.06, 438.02]);
  const hold = cue('huge prep job can hold up everyone', 0, [435.5, 438.02]);
  const stutter = cue('answers stutter', 0, [439.0, 442.0]);
  const split = cue('split the work into two kitchens', 0, [442.3, 446.7]);
  const own = cue('each built for its own job', 0, [444.5, 446.7]);

  const oneP = prog(t, one.start - 0.1, 0.7);
  const holdP = prog(t, hold.start, 0.5);
  const splitP = prog(t, split.start, 0.8);
  const ownP = prog(t, own.start, 0.4);
  const oneDim = useDim(split.start - 0.1, 0.3);

  return (
    <Svg>
      <g opacity={oneDim * (1 - splitP)}>
        <T x={960} y={174} text="one kitchen" size={54} color={RED} anchor="middle" font="head" opacity={oneP} />
        <SketchRect x={250} y={230} w={1420} h={580} fill="none" progress={oneP} radius={20} seed="one-kitchen" strokeWidth={4.5} color={RED} />
        <SketchRect x={330} y={340} w={480} h={230} fill={SURFACE} progress={oneP} radius={12} seed="one-prep" strokeWidth={4} color={CYAN} />
        <T x={570} y={410} text="prep" size={48} color={CYAN} anchor="middle" />
        {Array.from({length: 6}).map((_, i) => (
          <SketchCircle key={i} cx={450 + (i % 3) * 110} cy={470 + Math.floor(i / 3) * 40} r={18} progress={oneP} strokeWidth={3} color={ORANGE} fill={SURFACE_2} seed={`one-veg-${i}`} />
        ))}
        <SketchRect x={1060} y={340} w={420} h={230} fill={SURFACE} progress={oneP} radius={12} seed="one-plate" strokeWidth={4} color={GREEN} />
        <T x={1270} y={410} text="plating" size={48} color={GREEN} anchor="middle" />
        <SketchEllipse cx={1270} cy={500} w={120} h={60} fill={SURFACE_2} progress={oneP} strokeWidth={3} color={GREEN} seed="one-dish" />
        <Arrow x1={820} y1={460} x2={1040} y2={460} progress={holdP} color={RED} width={5} seed="blocked-arrow" />
        <SketchCross x={910} y={420} size={62} progress={holdP} color={RED} strokeWidth={5} seed="blocked-cross" />
        <T x={930} y={650} text="blocked" size={52} color={RED} anchor="middle" opacity={holdP} />
        {[0, 1, 2].map((i) => (
          <Person key={i} x={1400 + i * 80} y={780} scale={0.9} color={MUTED} progress={prog(t, one.start + 0.3 + i * 0.1, 0.4)} opacity={1 - splitP * 0.8} />
        ))}
        <T x={1430} y={880} text="waiting" size={36} color={MUTED} anchor="middle" opacity={holdP} />
      </g>

      <g opacity={splitP}>
        <T x={960} y={156} text="two kitchens" size={56} color={GREEN} anchor="middle" font="head" />
        <SketchRect x={170} y={230} w={720} h={580} fill="none" progress={splitP} radius={20} seed="kitchen-a" strokeWidth={4} color={CYAN} />
        <SketchRect x={1030} y={230} w={720} h={580} fill="none" progress={splitP} radius={20} seed="kitchen-b" strokeWidth={4} color={GREEN} />
        <T x={530} y={310} text="prep kitchen" size={42} color={CYAN} anchor="middle" />
        <T x={1390} y={310} text="plating kitchen" size={42} color={GREEN} anchor="middle" />
        <SketchCircle cx={530} cy={500} r={110} progress={splitP} strokeWidth={4} color={CYAN} seed="prep-circle" />
        <T x={530} y={514} text="compute" size={40} color={CYAN} anchor="middle" />
        <SketchCircle cx={1390} cy={500} r={110} progress={splitP} strokeWidth={4} color={GREEN} seed="plate-circle" />
        <T x={1390} y={514} text="memory" size={40} color={GREEN} anchor="middle" />
        <Arrow x1={700} y1={500} x2={1030} y2={500} progress={splitP} color={GREEN} width={4} seed="kitchen-arrow" />
        <T x={960} y={858} text="each built for its job" size={44} color={GREEN} anchor="middle" opacity={ownP} />
      </g>
      <T x={960} y={922} text="a long prompt no longer blocks the plates" size={38} color={MUTED} anchor="middle" opacity={prog(t, stutter.start, 0.4)} />
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   28. Cache-aware load balancer; the other features
   ───────────────────────────────────────────────────────────── */
export const LoadBalancer: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const third = cue('third goes back to the tree', 0, [447.52, 449.26]);
  const balancer = cue('cache-aware load balancer', 0, [449.88, 457.96]);
  const machine = cue('machine that already has its prefix cached', 0, [453.2, 457.96]);
  const scale = cue('reuse keeps working at scale', 0, [456.2, 457.96]);
  const features = cue('Other features', 0, [458.78, 467.74]);
  const quant = cue('quantization', 0, [459.8, 461.0]);
  const splitBig = cue('splitting big models', 0, [461.0, 463.0]);
  const versions = cue('fine-tuned versions', 0, [463.0, 465.0]);
  const multi = cue('multimodal', 0, [465.0, 467.0]);
  const docs = cue('all in the docs', 0, [466.2, 467.74]);

  const treeP = prog(t, third.start - 0.1, 0.6);
  const balP = prog(t, 0.2, 0.6);
  const machP = prog(t, machine.start, 0.5);
  const featP = prog(t, features.start, 0.6);
  const docsP = prog(t, docs.start, 0.4);

  return (
    <Svg>
      <T x={960} y={140} text="cache-aware load balancer" size={56} color={GREEN} anchor="middle" font="head" opacity={treeP} />
      <T x={960} y={194} text="prefix-aware routing" size={40} color={MUTED} anchor="middle" opacity={balP} />

      <g opacity={balP}>
        <SketchCircle cx={960} cy={276} r={54} progress={balP} strokeWidth={4} color={GREEN} seed="balancer" />
        <T x={960} y={284} text="LB" size={38} color={GREEN} anchor="middle" />
      </g>

      {[
        {x: 300, label: 'server 1', hit: false, p: 0.0},
        {x: 820, label: 'server 2', hit: true, p: 0.3},
        {x: 1340, label: 'server 3', hit: false, p: 0.6},
      ].map((s, i) => (
        <g key={s.label} opacity={prog(t, third.start + i * 0.12, 0.5)}>
          <SketchRect x={s.x} y={360} w={280} h={220} fill={SURFACE} progress={treeP} radius={14} seed={`srv-${i}`} strokeWidth={4} color={s.hit && machP > 0.2 ? GREEN : INK} />
          <T x={s.x + 140} y={412} text={s.label} size={38} color={MUTED} anchor="middle" />
          <g opacity={machP}>
            <SketchCircle cx={s.x + 140} cy={478} r={26} progress={machP} strokeWidth={3} color={s.hit ? GREEN : COMMENT} seed={`srv-tree-${i}`} />
            <SketchLine x1={s.x + 140} y1={504} x2={s.x + 140} y2={536} progress={machP} seed={`srv-trunk-${i}`} color={s.hit ? GREEN : COMMENT} strokeWidth={3} />
            <SketchLine x1={s.x + 140} y1={520} x2={s.x + 110} y2={542} progress={machP} seed={`srv-l-${i}`} color={s.hit ? GREEN : COMMENT} strokeWidth={3} />
            <SketchLine x1={s.x + 140} y1={520} x2={s.x + 170} y2={542} progress={machP} seed={`srv-r-${i}`} color={s.hit ? GREEN : COMMENT} strokeWidth={3} />
            <SketchCircle cx={s.x + 110} cy={550} r={10} progress={machP} strokeWidth={3} color={s.hit ? GREEN : COMMENT} seed={`srv-ln-${i}`} />
            <SketchCircle cx={s.x + 170} cy={550} r={10} progress={machP} strokeWidth={3} color={s.hit ? GREEN : COMMENT} seed={`srv-rn-${i}`} />
          </g>
          {s.hit ? (
            <g opacity={machP}>
              <T x={s.x + 140} y={620} text="prefix cached" size={36} color={GREEN} anchor="middle" />
              <SketchCheck x={s.x + 30} y={380} size={34} progress={machP} color={GREEN} />
            </g>
          ) : null}
        </g>
      ))}

      <Arrow x1={960} y1={330} x2={960} y2={360} progress={prog(t, balancer.start + 0.3, 0.4)} color={GREEN} width={4} seed="lb-to-s2" />
      <Arrow x1={960} y1={330} x2={540} y2={360} progress={prog(t, balancer.start + 0.45, 0.4)} color={COMMENT} width={3.5} seed="lb-to-s1" />
      <Arrow x1={960} y1={330} x2={1480} y2={360} progress={prog(t, balancer.start + 0.55, 0.4)} color={COMMENT} width={3.5} seed="lb-to-s3" />
      <T x={960} y={704} text="reuse at scale" size={40} color={GREEN} anchor="middle" opacity={prog(t, scale.start, 0.4)} />

      <g opacity={featP}>
        <SketchLine x1={220} y1={752} x2={1700} y2={752} progress={featP} seed="feature-rule" color={SURFACE_2} strokeWidth={3} />
        {[
          {x: 240, text: 'quantization', c: quant, color: CYAN},
          {x: 610, text: 'multi-GPU', c: splitBig, color: PURPLE},
          {x: 980, text: 'many versions', c: versions, color: ORANGE},
          {x: 1350, text: 'multimodal', c: multi, color: PINK},
        ].map((f, i) => (
          <g key={f.text} opacity={prog(t, f.c.start, 0.35)}>
            <SketchRect x={f.x} y={782} w={300} h={70} fill={SURFACE} progress={prog(t, f.c.start, 0.35)} radius={10} seed={`feat-${i}`} strokeWidth={3} color={f.color} />
            <T x={f.x + 150} y={828} text={f.text} size={38} color={f.color} anchor="middle" />
          </g>
        ))}
        <T x={1500} y={900} text="…and more in the docs" size={36} color={MUTED} anchor="middle" opacity={docsP} />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   29. vLLM: what overlaps
   ───────────────────────────────────────────────────────────── */
export const Overlap: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const compare = cue('compare to VLLM', 0, [468.48, 470.58]);
  const overlap = cue('overlap a lot', 0, [471.28, 472.2]);
  const both = cue('Both are fast', 0, [472.9, 482.38]);
  const kv = cue('reuse the KV cache', 0, [474.0, 477.0]);
  const structured = cue('structured output', 0, [475.5, 478.5]);
  const api = cue('similar style of API', 0, [477.5, 480.0]);
  const cheap = cue('switching is often cheap', 0, [480.0, 482.38]);

  const p = prog(t, compare.start - 0.1, 0.7);
  const overlapP = prog(t, overlap.start, 0.5);
  const bothP = prog(t, both.start, 0.5);
  const kvP = prog(t, kv.start, 0.4);
  const structP = prog(t, structured.start, 0.4);
  const apiP = prog(t, api.start, 0.4);
  const cheapP = prog(t, cheap.start, 0.4);

  return (
    <Svg>

      <g opacity={p}>
        <SketchRect x={250} y={260} w={660} h={400} fill={SURFACE} progress={p} radius={20} seed="sglang-card" strokeWidth={4.5} color={GREEN} />
        <T x={580} y={360} text="SGLang" size={64} color={GREEN} anchor="middle" font="head" />
        <T x={580} y={412} text="radix tree" size={38} color={MUTED} anchor="middle" />
        <SketchRect x={515} y={470} w={130} h={46} fill={SURFACE_2} progress={p} radius={6} seed="ov-node-root" strokeWidth={3} color={GREEN} />
        <SketchLine x1={580} y1={516} x2={580} y2={548} progress={p} seed="ov-trunk" color={GREEN} strokeWidth={3} />
        <SketchLine x1={580} y1={538} x2={530} y2={566} progress={p} seed="ov-l" color={GREEN} strokeWidth={3} />
        <SketchLine x1={580} y1={538} x2={630} y2={566} progress={p} seed="ov-r" color={GREEN} strokeWidth={3} />
        <SketchRect x={485} y={566} w={90} h={38} fill={SURFACE_2} progress={p} radius={5} seed="ov-node-l" strokeWidth={3} color={GREEN} />
        <SketchRect x={585} y={566} w={90} h={38} fill={SURFACE_2} progress={p} radius={5} seed="ov-node-r" strokeWidth={3} color={GREEN} />
      </g>
      <g opacity={p}>
        <SketchRect x={1010} y={260} w={660} h={400} fill={SURFACE} progress={p} radius={20} seed="vllm-card" strokeWidth={4.5} color={CYAN} />
        <T x={1340} y={360} text="vLLM" size={64} color={CYAN} anchor="middle" font="head" />
        <T x={1340} y={412} text="paged blocks" size={38} color={MUTED} anchor="middle" />
        {[0, 1, 2].map((i) => (
          <SketchRect key={i} x={1240 + i * 90} y={500} w={74} h={64} fill={SURFACE_2} progress={p} radius={6} seed={`ov-block-${i}`} strokeWidth={3} color={CYAN} />
        ))}
      </g>

      <g opacity={bothP}>
        <T x={300} y={730} text="both are..." size={40} color={MUTED} />
        {[
          {text: 'fast', x: 600, w: 240, p: bothP, c: GREEN},
          {text: 'KV cache', x: 860, w: 240, p: kvP, c: GREEN},
          {text: 'structured output', x: 1190, w: 340, p: structP, c: PURPLE},
          {text: 'similar API', x: 1520, w: 240, p: apiP, c: CYAN},
        ].map((f, i) => (
          <g key={f.text} opacity={f.p}>
            <SketchRect x={f.x - f.w / 2} y={780} w={f.w} h={60} fill={SURFACE} progress={f.p} radius={30} seed={`overlap-${i}`} strokeWidth={3} color={f.c} />
            <T x={f.x} y={820} text={f.text} size={36} color={f.c} anchor="middle" />
          </g>
        ))}
        <T x={960} y={900} text="switching is cheap" size={44} color={GREEN} anchor="middle" opacity={cheapP} />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   30. Difference 1: radix tree vs fixed-size blocks
   ───────────────────────────────────────────────────────────── */
export const RadixVsPaged: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const diff = cue('first difference is how they match', 0, [483.28, 486.14]);
  const fine = cue('SGLang matches it more finely', 0, [486.84, 490.08]);
  const radix = cue('using the radix tree', 0, [488.0, 490.08]);
  const fixed = cue('VLLM matches it in fixed-size blocks', 0, [490.92, 495.28]);
  const paged = cue('Paged Attention', 0, [493.8, 495.28]);

  const p = prog(t, diff.start - 0.1, 0.6);
  const fineP = prog(t, 0.2, 0.6);
  const fixedP = prog(t, 0.35, 0.6);
  const pagedP = prog(t, paged.start, 0.4);

  return (
    <Svg>

      <g opacity={fineP}>
        <T x={480} y={286} text="SGLang" size={52} color={GREEN} anchor="middle" font="head" />
        <TreeEdge x1={480} y1={390} x2={340} y2={500} progress={fineP} seed="fine-e1" color={COMMENT} width={3.5} />
        <TreeEdge x1={480} y1={390} x2={620} y2={500} progress={fineP} seed="fine-e2" color={COMMENT} width={3.5} />
        <TreeNode x={350} y={310} w={260} h={80} label="shared" color={GREEN} fill={SURFACE} progress={fineP} seed="fine-root" labelSize={40} />
        <TreeNode x={220} y={500} w={240} h={76} label="path A" color={GREEN} fill={SURFACE} progress={fineP} seed="fine-a" labelSize={36} />
        <TreeNode x={500} y={500} w={240} h={76} label="path B" color={CYAN} fill={SURFACE} progress={fineP} seed="fine-b" labelSize={36} />
        <T x={480} y={650} text="radix tree" size={44} color={GREEN} anchor="middle" opacity={prog(t, radix.start, 0.4)} />
      </g>

      <T x={960} y={450} text="vs" size={48} color={MUTED} anchor="middle" opacity={prog(t, fixed.start, 0.3)} />

      <g opacity={fixedP}>
        <T x={1420} y={286} text="vLLM" size={52} color={CYAN} anchor="middle" font="head" />
        {[0, 1].map((block) => (
          <g key={block}>
            <SketchRect x={1100 + block * 280} y={330} w={250} h={190} fill={SURFACE} progress={fixedP} radius={10} seed={`block-${block}`} strokeWidth={3.5} color={CYAN} />
            <T x={1225 + block * 280} y={372} text={`block ${block + 1}`} size={36} color={MUTED} anchor="middle" />
            <TokenRow x={1120 + block * 280} y={396} n={4} s={38} gap={10} fill={SURFACE_2} progress={fixedP} seed={`block-tok-${block}`} />
            <TokenRow x={1120 + block * 280} y={444} n={4} s={38} gap={10} fill={SURFACE_2} progress={fixedP} seed={`block-tok2-${block}`} />
          </g>
        ))}
        <T x={1420} y={580} text="fixed-size blocks" size={42} color={CYAN} anchor="middle" />
        <T x={1420} y={646} text="Paged Attention" size={40} color={YELLOW} anchor="middle" opacity={pagedP} />
        <T x={1420} y={704} text="16 tokens each" size={36} color={MUTED} anchor="middle" />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   31. The 40-token maths
   ───────────────────────────────────────────────────────────── */
export const BlockMath: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const block = cue('block is sixteen tokens', 0, [495.9, 500.74]);
  const prompts = cue('two prompts share their first forty tokens', 0, [497.6, 500.74]);
  const firstBlocks = cue('first two full blocks', 0, [501.54, 507.56]);
  const reused = cue('which is thirty-two tokens', 0, [503.8, 507.56]);
  const recompute = cue('recomputes the other eight', 0, [506.2, 507.56]);
  const all = cue('radix tree reuses all forty', 0, [508.08, 510.28]);
  const gap = cue('one block of tokens', 0, [511.5, 514.48]);
  const millions = cue('Across millions of requests', 0, [515.12, 517.56]);

  const tokensP = prog(t, block.start - 0.1, 0.7);
  const secondP = prog(t, firstBlocks.start, 0.5);
  const recomputeP = prog(t, recompute.start, 0.5);
  const allP = prog(t, all.start, 0.5);
  const gapP = prog(t, gap.start, 0.4);

  const tokenW = 30;
  const gapW = 6;
  const totalW = 40 * (tokenW + gapW) - gapW;
  const x0 = 960 - totalW / 2;

  return (
    <Svg>
      <T x={960} y={142} text="40 shared tokens" size={60} color={INK} anchor="middle" font="head" opacity={tokensP} />
      <T x={960} y={198} text="16-token blocks" size={40} color={CYAN} anchor="middle" opacity={prog(t, block.start, 0.4)} />

      <g opacity={tokensP}>
        {Array.from({length: 40}).map((_, i) => {
          const isShared = i < 32;
          const isRecompute = i >= 32 && i < 40;
          const fill = allP > 0.2 ? GREEN : secondP > 0.1 && isShared ? GREEN : recomputeP > 0.2 && isRecompute ? RED : SURFACE_2;
          const color = allP > 0.2 ? GREEN : secondP > 0.1 && isShared ? GREEN : recomputeP > 0.2 && isRecompute ? RED : INK;
          return <TokenSquare key={i} x={x0 + i * (tokenW + gapW)} y={340} s={tokenW} fill={fill} color={color} progress={prog(t, 0.2 + i * 0.012, 0.25)} seed={`math-token-${i}`} />;
        })}
        {/* block brackets */}
        <SketchLine x1={x0} y1={312} x2={x0 + 16 * 36 - gapW} y2={312} progress={tokensP} seed="block1-bracket" color={CYAN} strokeWidth={4} />
        <T x={x0 + 16 * 18} y={296} text="16" size={38} color={CYAN} anchor="middle" />
        <SketchLine x1={x0 + 16 * 36} y1={312} x2={x0 + 32 * 36 - gapW} y2={312} progress={tokensP} seed="block2-bracket" color={CYAN} strokeWidth={4} />
        <T x={x0 + 24 * 36} y={296} text="16" size={38} color={CYAN} anchor="middle" />
        <SketchLine x1={x0 + 32 * 36} y1={312} x2={x0 + 39 * 36 + tokenW} y2={312} progress={tokensP} seed="block3-bracket" color={CYAN} strokeWidth={4} />
        <T x={x0 + 36 * 36} y={296} text="8" size={38} color={CYAN} anchor="middle" />
      </g>

      <g opacity={secondP * (1 - allP)}>
        <SketchPath d={`M ${x0} 400 Q ${960} 450 ${x0 + 32 * 36 - gapW} 400`} progress={secondP} seed="reuse-brace" color={GREEN} strokeWidth={4} />
        <T x={x0 + 16 * 36} y={470} text="32 reused" size={46} color={GREEN} anchor="middle" />
        <T x={x0 + 16 * 36} y={516} text="two full blocks" size={36} color={MUTED} anchor="middle" opacity={prog(t, reused.start, 0.4)} />
      </g>

      <g opacity={recomputeP * (1 - allP)}>
        <SketchPath d={`M ${x0 + 32 * 36} 400 Q ${x0 + 36 * 36} 450 ${x0 + 39 * 36 + tokenW} 400`} progress={recomputeP} seed="recompute-brace" color={RED} strokeWidth={4} />
        <T x={x0 + 36 * 36} y={470} text="8 recomputed" size={40} color={RED} anchor="middle" />
      </g>

      <g opacity={allP}>
        <T x={960} y={600} text="radix tree: all 40 reused" size={48} color={GREEN} anchor="middle" />
        <SketchRect x={700} y={636} w={520} h={70} fill={SURFACE} progress={allP} radius={35} seed="radix-reuse-pill" strokeWidth={3.5} color={GREEN} />
        <T x={960} y={682} text="zero recompute" size={38} color={GREEN} anchor="middle" />
      </g>

      <g opacity={gapP}>
        <T x={960} y={780} text="the gap: at most one block" size={42} color={YELLOW} anchor="middle" />
        <T x={960} y={832} text="across millions, it adds up" size={38} color={MUTED} anchor="middle" opacity={prog(t, millions.start, 0.4)} />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   32. Difference 2: maturity
   ───────────────────────────────────────────────────────────── */
export const Maturity: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const diff = cue('second difference is maturity', 0, [518.4, 520.2]);
  const vllm = cue('VLLM has been around longer', 0, [521.12, 525.88]);
  const community = cue('largest community', 0, [523.0, 525.88]);
  const track = cue('longest track record', 0, [524.5, 525.88]);
  const newer = cue('SGLang is newer', 0, [526.82, 531.02]);
  const grown = cue('grown fast', 0, [528.5, 531.02]);
  const companies = cue('many large companies', 0, [529.5, 531.02]);

  const p = prog(t, diff.start - 0.1, 0.6);
  const vP = prog(t, vllm.start, 0.9);
  const sP = prog(t, newer.start, 0.9);
  const communityP = prog(t, community.start, 0.4);
  const trackP = prog(t, track.start, 0.4);
  const grownP = prog(t, grown.start, 0.4);
  const companiesP = prog(t, companies.start, 0.4);

  return (
    <Svg>
      <SketchLine x1={240} y1={760} x2={1680} y2={760} progress={p} seed="maturity-axis" color={COMMENT} strokeWidth={3.5} />
      <SketchLine x1={240} y1={760} x2={240} y2={280} progress={p} seed="maturity-y" color={COMMENT} strokeWidth={3.5} />
      {['2023', '2024', '2025', '2026'].map((y, i) => (
        <T key={y} x={420 + i * 360} y={800} text={y} size={36} color={MUTED} anchor="middle" />
      ))}
      <T x={160} y={300} text="maturity" size={38} color={MUTED} anchor="middle" />

      <g opacity={vP}>
        <SketchPath d="M 390 620 Q 600 480 760 430 Q 1050 360 1540 330" progress={vP} seed="vllm-curve" color={CYAN} strokeWidth={5} />
        {[[390, 620], [760, 430], [1150, 365], [1540, 330]].map(([x, y], i) => (
          <SketchCircle key={i} cx={x} cy={y} r={9} progress={vP} fill={CYAN} strokeWidth={0} seed={`vllm-dot-${i}`} />
        ))}
        <T x={385} y={552} text="vLLM" size={44} color={CYAN} anchor="start" font="head" />
        <T x={1080} y={450} text="largest community" size={40} color={CYAN} anchor="middle" opacity={communityP} />
        <T x={1240} y={390} text="track record" size={36} color={MUTED} anchor="middle" opacity={trackP} />
      </g>

      <g opacity={sP}>
        <SketchPath d="M 820 680 Q 1050 650 1200 540 Q 1400 390 1540 300" progress={sP} seed="sglang-curve" color={GREEN} strokeWidth={5} />
        {[[820, 680], [1200, 540], [1400, 390], [1540, 300]].map(([x, y], i) => (
          <SketchCircle key={i} cx={x} cy={y} r={9} progress={sP} fill={GREEN} strokeWidth={0} seed={`sglang-dot-${i}`} />
        ))}
        <T x={820} y={648} text="SGLang" size={44} color={GREEN} anchor="start" font="head" />
        <T x={1180} y={700} text="newer, growing fast" size={40} color={GREEN} anchor="middle" opacity={grownP} />
        <T x={1320} y={640} text="many companies" size={36} color={MUTED} anchor="middle" opacity={companiesP} />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   33. Difference 3: frontend and structured output
   ───────────────────────────────────────────────────────────── */
export const ThirdAdd: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const third = cue('third is what SGLang adds', 0, [531.84, 537.98]);
  const frontend = cue('frontend language', 0, [534.0, 537.0]);
  const structured = cue('structured output', 0, [535.0, 537.98]);

  const p = prog(t, third.start - 0.1, 0.7);
  const fP = prog(t, 0.2, 0.5);
  const sP = prog(t, 0.35, 0.5);

  return (
    <Svg>
      <g opacity={p}>
        <SketchRect x={560} y={380} w={800} h={330} fill={SURFACE} progress={p} radius={20} seed="adds-box" strokeWidth={4.5} color={GREEN} />
        <T x={960} y={490} text="SGLang" size={76} color={GREEN} anchor="middle" font="head" />
        <T x={960} y={550} text="core engine" size={38} color={MUTED} anchor="middle" />
      </g>
      <g opacity={fP}>
        <SketchRect x={250} y={250} w={400} h={100} fill={SURFACE} progress={fP} radius={12} seed="adds-front" strokeWidth={3.5} color={PURPLE} />
        <T x={450} y={314} text="frontend language" size={38} color={PURPLE} anchor="middle" />
        <Arrow x1={450} y1={350} x2={660} y2={380} progress={fP} color={PURPLE} width={4} seed="adds-arrow1" />
      </g>
      <g opacity={sP}>
        <SketchRect x={1270} y={250} w={400} h={100} fill={SURFACE} progress={sP} radius={12} seed="adds-struct" strokeWidth={3.5} color={YELLOW} />
        <T x={1470} y={314} text="structured output" size={38} color={YELLOW} anchor="middle" />
        <Arrow x1={1470} y1={350} x2={1260} y2={380} progress={sP} color={YELLOW} width={4} seed="adds-arrow2" />
      </g>
      <T x={960} y={790} text="two things on top" size={44} color={GREEN} anchor="middle" opacity={prog(t, structured.start + 0.2, 0.4)} />
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   34. Raw speed: only your traffic is truth
   ───────────────────────────────────────────────────────────── */
export const SpeedTruth: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const raw = cue('On raw speed', 0, [538.68, 545.02]);
  const model = cue('model', 0, [540.0, 541.0]);
  const workload = cue('workload', 0, [541.0, 542.0]);
  const version = cue('version', 0, [542.0, 543.0]);
  const outdated = cue('benchmarks go out of date', 0, [545.7, 551.16]);
  const own = cue('measure on our own traffic', 0, [548.0, 551.16]);

  const p = prog(t, raw.start - 0.1, 0.7);
  const modelP = prog(t, model.start, 0.4);
  const workP = prog(t, workload.start, 0.4);
  const versionP = prog(t, version.start, 0.4);
  const oldP = prog(t, outdated.start, 0.6);
  const ownP = prog(t, own.start, 0.6);
  const dial = Math.sin(t * 1.7) * 24;

  return (
    <Svg>

      <g opacity={p}>
        <SketchCircle cx={620} cy={520} r={190} progress={p} strokeWidth={4.5} color={YELLOW} seed="speed-dial" />
        {Array.from({length: 7}).map((_, i) => {
          const a = Math.PI * 0.78 + (i / 6) * Math.PI * 1.44;
          return <SketchLine key={i} x1={620 + Math.cos(a) * 150} y1={520 + Math.sin(a) * 150} x2={620 + Math.cos(a) * 170} y2={520 + Math.sin(a) * 170} progress={p} seed={`dial-tick-${i}`} color={COMMENT} strokeWidth={3} />;
        })}
        <SketchLine x1={620} y1={520} x2={620 + Math.cos(-Math.PI / 2 + dial / 180 * Math.PI) * 130} y2={520 + Math.sin(-Math.PI / 2 + dial / 180 * Math.PI) * 130} progress={p} seed="dial-needle" color={RED} strokeWidth={5} />
        <SketchCircle cx={620} cy={520} r={12} progress={p} fill={YELLOW} strokeWidth={0} seed="dial-hub" />
        <T x={620} y={760} text="speed" size={42} color={YELLOW} anchor="middle" />
      </g>

      <g opacity={modelP}>
        <CuePill text="model" phrase="model" fallback={[540.0, 541.0]} x={400} y={840} w={170} color={CYAN} border={CYAN} size={38} />
      </g>
      <g opacity={workP}>
        <CuePill text="workload" phrase="workload" fallback={[541.0, 542.0]} x={620} y={840} w={210} color={PURPLE} border={PURPLE} size={38} />
      </g>
      <g opacity={versionP}>
        <CuePill text="version" phrase="version" fallback={[542.0, 543.0]} x={840} y={840} w={180} color={ORANGE} border={ORANGE} size={38} />
      </g>

      <g opacity={oldP}>
        <SketchRect x={1090} y={280} w={640} h={410} fill={SURFACE} progress={oldP} radius={14} seed="bench-paper" strokeWidth={4} color={COMMENT} />
        <T x={1410} y={360} text="public benchmarks" size={40} color={MUTED} anchor="middle" />
        {Array.from({length: 6}).map((_, i) => (
          <SketchLine key={i} x1={1140} y1={400 + i * 34} x2={i === 5 ? 1450 : 1630} y2={400 + i * 34} progress={oldP} seed={`bench-line-${i}`} strokeWidth={3} color={COMMENT} />
        ))}
        <g transform="rotate(-12 1410 540)">
          <SketchRect x={1230} y={490} w={360} h={90} fill="none" progress={oldP} radius={8} seed="outdated-stamp" strokeWidth={5} color={RED} />
          <T x={1410} y={552} text="OUTDATED" size={54} color={RED} anchor="middle" font="head" />
        </g>
      </g>

      <g opacity={ownP}>
        <SketchRect x={1080} y={740} w={660} h={130} fill={SURFACE} progress={ownP} radius={16} seed="own-traffic" strokeWidth={4} color={GREEN} />
        <T x={1410} y={796} text="your own traffic" size={44} color={GREEN} anchor="middle" />
        <T x={1410} y={840} text="the only number that matters" size={36} color={MUTED} anchor="middle" />
        <SketchCheck x={1105} y={765} size={38} progress={ownP} color={GREEN} />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   35. The choice follows your traffic
   ───────────────────────────────────────────────────────────── */
export const Choice: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const traffic = cue('choice comes down to our traffic', 0, [552.04, 554.1]);
  const multi = cue('multi-turn chat', 0, [554.58, 562.74]);
  const docs = cue('questions over the same documents', 0, [557.0, 562.74]);
  const prefixes = cue('long prefixes repeat', 0, [560.0, 562.74]);
  const test = cue('test SGLang first', 0, [562.0, 562.74]);
  const oneoff = cue('unrelated one-off requests', 0, [563.32, 569.64]);
  const community = cue('biggest community', 0, [566.0, 569.64]);
  const start = cue('start with VLLM', 0, [568.0, 569.64]);

  const p = prog(t, traffic.start - 0.1, 0.6);
  const sgP = prog(t, 0.2, 0.7);
  const vlP = prog(t, 0.35, 0.7);
  const startP = prog(t, start.start, 0.4);
  const communityP = prog(t, community.start, 0.4);

  return (
    <Svg>
      <g opacity={p}>
        <SketchCircle cx={960} cy={390} r={110} progress={p} strokeWidth={4.5} color={YELLOW} seed="traffic-circle" />
        <T x={960} y={378} text="your" size={36} color={MUTED} anchor="middle" />
        <T x={960} y={428} text="traffic" size={42} color={YELLOW} anchor="middle" />
      </g>

      <g opacity={sgP}>
        <SketchPath d="M 880 470 Q 700 560 560 700" progress={sgP} seed="traffic-left" color={GREEN} strokeWidth={5} />
        <SketchRect x={260} y={700} w={600} h={190} fill={SURFACE} progress={sgP} radius={16} seed="sg-choice" strokeWidth={4} color={GREEN} />
        <T x={560} y={764} text="SGLang" size={54} color={GREEN} anchor="middle" font="head" />
        <T x={560} y={810} text="repeated prefixes" size={38} color={MUTED} anchor="middle" />
        <T x={560} y={858} text="test first" size={36} color={GREEN} anchor="middle" opacity={prog(t, test.start, 0.4)} />
        <T x={820} y={600} text="multi-turn + documents" size={36} color={MUTED} anchor="middle" opacity={prog(t, docs.start, 0.4)} />
        <T x={820} y={650} text="long prefixes" size={38} color={GREEN} anchor="middle" opacity={prog(t, prefixes.start, 0.4)} />
      </g>

      <g opacity={vlP}>
        <SketchPath d="M 1040 470 Q 1220 560 1360 700" progress={vlP} seed="traffic-right" color={CYAN} strokeWidth={5} />
        <SketchRect x={1060} y={700} w={600} h={190} fill={SURFACE} progress={vlP} radius={16} seed="vl-choice" strokeWidth={4} color={CYAN} />
        <T x={1360} y={764} text="vLLM" size={54} color={CYAN} anchor="middle" font="head" />
        <T x={1360} y={810} text="one-off requests" size={38} color={MUTED} anchor="middle" />
        <T x={1360} y={858} text="big community" size={36} color={CYAN} anchor="middle" opacity={communityP} />
        <T x={1110} y={600} text="unrelated" size={38} color={CYAN} anchor="middle" opacity={prog(t, oneoff.start, 0.4)} />
        <T x={1110} y={650} text="start with vLLM" size={36} color={MUTED} anchor="middle" opacity={startP} />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   36. Open the logs; measure the identical fraction
   ───────────────────────────────────────────────────────────── */
export const Logs: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const idea = cue('idea behind all of this is simple', 0, [570.24, 572.18]);
  const repeats = cue('Text that repeats', 0, [572.78, 577.64]);
  const once = cue('computed once', 0, [574.0, 577.64]);
  const tree = cue('radix tree', 0, [575.0, 577.64]);
  const logs = cue('open our logs', 0, [578.14, 584.16]);
  const identical = cue('how much of our prompts is identical', 0, [580.5, 584.16]);
  const number = cue('That number tells us', 0, [584.56, 587.44]);

  const p = prog(t, idea.start - 0.1, 0.6);
  const repP = prog(t, repeats.start, 0.5);
  const logsP = prog(t, logs.start, 0.7);
  const identP = prog(t, identical.start, 0.6);
  const numberP = prog(t, number.start, 0.4);
  const ideaDim = useDim(logs.start - 0.2, 0.3);

  return (
    <Svg>
      <g opacity={ideaDim}>
        <T x={960} y={300} text="text that repeats" size={64} color={INK} anchor="middle" font="head" opacity={p} />
        <T x={960} y={382} text="should be computed once" size={52} color={GREEN} anchor="middle" opacity={repP} />
        <g opacity={prog(t, tree.start, 0.4)}>
          <SketchCircle cx={960} cy={520} r={40} progress={prog(t, tree.start, 0.4)} strokeWidth={4} color={GREEN} seed="logs-tree" />
          <SketchLine x1={960} y1={560} x2={960} y2={610} progress={prog(t, tree.start, 0.4)} seed="logs-trunk" color={GREEN} strokeWidth={4} />
          <SketchLine x1={960} y1={590} x2={920} y2={622} progress={prog(t, tree.start, 0.4)} seed="logs-l" color={GREEN} strokeWidth={4} />
          <SketchLine x1={960} y1={590} x2={1000} y2={622} progress={prog(t, tree.start, 0.4)} seed="logs-r" color={GREEN} strokeWidth={4} />
          <T x={960} y={700} text="radix tree" size={40} color={GREEN} anchor="middle" opacity={prog(t, tree.start, 0.4)} />
        </g>
      </g>

      <g opacity={logsP}>
        <SketchRect x={250} y={200} w={1420} h={630} fill={WELL} progress={logsP} radius={14} seed="logs-panel" strokeWidth={4} color={INK} />
        <T x={300} y={254} text="requests.log" size={36} color={MUTED} />
        {[0, 1, 2, 3].map((row) => (
          <g key={row} opacity={prog(t, logs.start + 0.3 + row * 0.12, 0.4)}>
            <T x={300} y={334 + row * 100} text={`POST /chat  prompt ${row + 1}`} size={36} color={MUTED} />
            <TokenRow x={720} y={302 + row * 100} n={8} s={26} gap={7} fill={GREEN} progress={prog(t, logs.start + 0.3 + row * 0.12, 0.4)} seed={`log-shared-${row}`} />
            <TokenRow x={720 + 8 * 33} y={302 + row * 100} n={4} s={26} gap={7} fill={SURFACE_2} progress={prog(t, logs.start + 0.3 + row * 0.12, 0.4)} seed={`log-unique-${row}`} />
          </g>
        ))}
        <T x={1220} y={334} text="same prefix" size={38} color={GREEN} opacity={prog(t, logs.start + 0.5, 0.4)} />
        <g opacity={identP}>
          <SketchRect x={1160} y={690} w={440} h={70} fill={SURFACE} progress={identP} radius={12} seed="identical-pill" strokeWidth={3} color={GREEN} />
          <T x={1380} y={736} text="identical / total" size={38} color={GREEN} anchor="middle" />
          <SketchCircle cx={540} cy={690} r={46} progress={identP} strokeWidth={4} color={YELLOW} seed="magnifier" />
          <SketchLine x1={575} y1={725} x2={620} y2={770} progress={identP} seed="magnifier-handle" color={YELLOW} strokeWidth={6} />
          <T x={540} y={800} text="measure this" size={40} color={YELLOW} anchor="middle" />
        </g>
      </g>

      <g opacity={numberP}>
        <T x={960} y={910} text="measure your logs" size={40} color={YELLOW} anchor="middle" />
      </g>
    </Svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   37. Outro
   ───────────────────────────────────────────────────────────── */
export const Outro: React.FC = () => {
  const t = useTime();
  const {cue} = useScene();
  const end = cue('That’s it for this one', 0, [588.3, 589.1]);
  const thanks = cue('Thanks for watching', 0, [589.42, 591.58]);
  const next = cue('next video soon', 0, [590.3, 591.58]);

  const p = prog(t, end.start - 0.1, 0.7);
  const thP = prog(t, thanks.start, 0.4);
  const nP = prog(t, next.start, 0.4);

  return (
    <Svg>
      <g opacity={p}>
        <SketchCircle cx={960} cy={300} r={30} progress={p} strokeWidth={4} color={GREEN} seed="outro-root" />
        <SketchLine x1={960} y1={330} x2={960} y2={378} progress={p} seed="outro-trunk" color={GREEN} strokeWidth={4} />
        <SketchLine x1={960} y1={356} x2={880} y2={408} progress={p} seed="outro-l" color={GREEN} strokeWidth={4} />
        <SketchLine x1={960} y1={356} x2={1040} y2={408} progress={p} seed="outro-r" color={GREEN} strokeWidth={4} />
        <SketchCircle cx={880} cy={420} r={22} progress={p} strokeWidth={4} color={GREEN} seed="outro-l1" />
        <SketchCircle cx={1040} cy={420} r={22} progress={p} strokeWidth={4} color={GREEN} seed="outro-r1" />
        <SketchLine x1={880} y1={442} x2={880} y2={474} progress={p} seed="outro-l2" color={GREEN} strokeWidth={3.5} />
        <SketchLine x1={1040} y1={442} x2={1040} y2={474} progress={p} seed="outro-r2" color={GREEN} strokeWidth={3.5} />
        <SketchCircle cx={880} cy={486} r={13} progress={p} strokeWidth={3} color={GREEN} seed="outro-l2a" />
        <SketchCircle cx={1040} cy={486} r={13} progress={p} strokeWidth={3} color={GREEN} seed="outro-r2a" />
        <T x={960} y={620} text="compute once" size={72} color={INK} anchor="middle" font="head" />
        <T x={960} y={692} text="SGLang" size={58} color={GREEN} anchor="middle" font="head" />
      </g>
      <g opacity={thP}>
        <T x={960} y={800} text="thanks for watching" size={44} color={MUTED} anchor="middle" />
      </g>
      <g opacity={nP}>
        <T x={960} y={858} text="next video soon" size={36} color={MUTED} anchor="middle" />
      </g>
    </Svg>
  );
};
