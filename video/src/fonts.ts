import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Bundled locally so previews and renders never touch the network.
loadFont({
  family: 'Caveat',
  url: staticFile('fonts/Caveat.ttf'),
  weight: '400',
});

loadFont({
  family: 'Caveat Brush',
  url: staticFile('fonts/CaveatBrush-Regular.ttf'),
  weight: '400',
});

loadFont({
  family: 'Patrick Hand',
  url: staticFile('fonts/PatrickHand-Regular.ttf'),
  weight: '400',
});
