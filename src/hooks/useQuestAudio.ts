import click from '../assets/sounds/click.mp3';
import success from '../assets/sounds/success.mp3';
import error from '../assets/sounds/error.mp3';
import engine from '../assets/sounds/engine.mp3';
import electro from '../assets/sounds/electro.mp3';

type SoundName = 'click' | 'success' | 'error' | 'engine' | 'electro';

class AudioPool {
  private sounds: Map<SoundName, HTMLAudioElement[]> = new Map();
  private currentIndex: Map<SoundName, number> = new Map();
  private poolSize = 3; // 3 копии каждого звука для возможности наложения

  register(name: SoundName, src: string) {
    const pool: HTMLAudioElement[] = [];
    for (let i = 0; i < this.poolSize; i++) {
      const audio = new Audio(src);
      audio.preload = 'auto';
      pool.push(audio);
    }
    this.sounds.set(name, pool);
    this.currentIndex.set(name, 0);
  }

  play(name: SoundName, volume = 0.8) {
    const pool = this.sounds.get(name);
    if (!pool) return;

    // Берём следующий аудио-элемент из пула (round-robin)
    let idx = this.currentIndex.get(name) || 0;
    const audio = pool[idx];

    // Обновляем индекс для следующего раза
    idx = (idx + 1) % this.poolSize;
    this.currentIndex.set(name, idx);

    // Сбрасываем и воспроизводим
    audio.currentTime = 0;
    audio.volume = volume;
    audio.play().catch((e) => console.log('Audio play error:', e));
  }
}

const audioPool = new AudioPool();

// Регистрируем звуки при импорте модуля (один раз)
audioPool.register('click', click);
audioPool.register('success', success);
audioPool.register('error', error);
audioPool.register('engine', engine);
audioPool.register('electro', electro);

export const useQuestAudio = () => {
  const play = (sound: SoundName) => {
    audioPool.play(sound);
  };

  return { play };
};
