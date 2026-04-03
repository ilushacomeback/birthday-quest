import useSound from 'use-sound';
import click from '../assets/sounds/click.mp3';
import success from '../assets/sounds/success.mp3';
import error from '../assets/sounds/error.mp3';
import engine from '../assets/sounds/engine.mp3';
import electro from '../assets/sounds/electro.mp3';

type SoundName = 'click' | 'success' | 'error' | 'engine' | 'electro';

export const useQuestAudio = () => {
  const [playClick] = useSound(click, { volume: 0.8 });
  const [playSuccess] = useSound(success, { volume: 0.8 });
  const [playError] = useSound(error, { volume: 0.8 });
  const [playEngine] = useSound(engine, { volume: 0.8 });
  const [playElectro] = useSound(electro, { volume: 0.8 });

  const play = (sound: SoundName) => {
    console.log('start play', sound);
    switch (sound) {
      case 'click':
        playClick();
        break;
      case 'success':
        playSuccess();
        break;
      case 'error':
        playError();
        break;
      case 'engine':
        playEngine();
        break;
      case 'electro':
        playElectro();
        break;
    }
    console.log('finish play', sound);
  };

  return { play };
};
