import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {BG} from './theme';
import {FPS, FRAMES} from './timing';
import {SceneFrame} from './lib/scene';
import {Chatbot, Examples, TenThousand, TreeIdea} from './scenes/Intro';
import {Automatic, FolderTree, Framework, Italy, PrefixShare, Radix, Student} from './scenes/Core';
import {Batching, Catch, Constrained, FrontendSteps, JsonCrash, LRU, ProgramShows, SpeedBonus, Subscribe, ThreeFeatures, Worksheet} from './scenes/Frontend';
import {BlockMath, Choice, Kitchen, LoadBalancer, Logs, Maturity, Outro, Overlap, PrefillDecode, RadixVsPaged, SpecDraft, SpecWin, SpeedTruth, SplitKitchen, ThirdAdd} from './scenes/Compare';

type SceneSpec = {name: string; start: number; end: number; node: React.ReactNode};

const scenes: SceneSpec[] = [
  {name: '01 chatbot', start: 0, end: 12.4, node: <Chatbot />},
  {name: '02 ten thousand users', start: 12.4, end: 32.16, node: <TenThousand />},
  {name: '03 more context', start: 32.16, end: 47.22, node: <Examples />},
  {name: '04 the tree', start: 47.22, end: 62.46, node: <TreeIdea />},
  {name: '05 the KV notebook', start: 62.46, end: 84.4, node: <Student />},
  {name: '06 shared prefixes', start: 84.4, end: 99.16, node: <PrefixShare />},
  {name: '07 automatic reuse', start: 99.16, end: 111.36, node: <Automatic />},
  {name: '08 runtime + frontend', start: 111.36, end: 132.54, node: <Framework />},
  {name: '09 radix attention', start: 132.54, end: 158.22, node: <Radix />},
  {name: '10 folders', start: 158.22, end: 193.32, node: <FolderTree />},
  {name: '11 Italy', start: 193.32, end: 209.28, node: <Italy />},
  {name: '12 first-token catch', start: 209.28, end: 227.7, node: <Catch />},
  {name: '13 LRU', start: 227.7, end: 242.94, node: <LRU />},
  {name: '14 subscribe', start: 242.94, end: 255.18, node: <Subscribe />},
  {name: '15 frontend steps', start: 255.18, end: 265.82, node: <FrontendSteps />},
  {name: '16 worksheet + gen', start: 265.82, end: 287.58, node: <Worksheet />},
  {name: '17 program shows runtime', start: 287.58, end: 301.24, node: <ProgramShows />},
  {name: '18 continuous batching', start: 301.24, end: 326.7, node: <Batching />},
  {name: '19 JSON crash', start: 326.7, end: 344.7, node: <JsonCrash />},
  {name: '20 constrained decoding', start: 344.7, end: 366.02, node: <Constrained />},
  {name: '21 fixed keys', start: 366.02, end: 379.42, node: <SpeedBonus />},
  {name: '22 three features', start: 379.42, end: 383.72, node: <ThreeFeatures />},
  {name: '23 speculative draft', start: 383.72, end: 396.62, node: <SpecDraft />},
  {name: '24 draft economics', start: 396.62, end: 412.7, node: <SpecWin />},
  {name: '25 prefill + decode', start: 412.7, end: 421.36, node: <PrefillDecode />},
  {name: '26 kitchen', start: 421.36, end: 434.06, node: <Kitchen />},
  {name: '27 split kitchen', start: 434.06, end: 447.52, node: <SplitKitchen />},
  {name: '28 load balancer', start: 447.52, end: 468.48, node: <LoadBalancer />},
  {name: '29 overlap with vLLM', start: 468.48, end: 483.28, node: <Overlap />},
  {name: '30 radix vs blocks', start: 483.28, end: 495.9, node: <RadixVsPaged />},
  {name: '31 40-token maths', start: 495.9, end: 518.4, node: <BlockMath />},
  {name: '32 maturity', start: 518.4, end: 531.84, node: <Maturity />},
  {name: '33 SGLang extras', start: 531.84, end: 538.68, node: <ThirdAdd />},
  {name: '34 raw speed truth', start: 538.68, end: 552.04, node: <SpeedTruth />},
  {name: '35 the choice', start: 552.04, end: 570.24, node: <Choice />},
  {name: '36 logs', start: 570.24, end: 588.3, node: <Logs />},
  {name: '37 outro', start: 588.3, end: 594.6, node: <Outro />},
];

const f = (seconds: number) => Math.round(seconds * FPS);

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: BG}}>
      <Audio src={staticFile('audio/vo.wav')} />
      {scenes.map((s) => (
        <Sequence key={s.name} from={f(s.start)} durationInFrames={f(s.end) - f(s.start)} name={s.name} premountFor={30}>
          <SceneFrame start={s.start} end={s.end}>
            {s.node}
          </SceneFrame>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export {scenes, FRAMES};
