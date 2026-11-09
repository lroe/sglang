import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {FPS, FRAMES} from './timing';
import './fonts';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SGLangExplainer"
      component={Video}
      durationInFrames={FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
