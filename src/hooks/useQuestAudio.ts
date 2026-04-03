
import { useEffect, useState } from 'react';
import click from '../assets/sounds/click.mp3';
import success from '../assets/sounds/success.mp3';
import error from '../assets/sounds/error.mp3';
import engine from '../assets/sounds/engine.mp3';
import electro from '../assets/sounds/electro.mp3';
import failedEngine from '../assets/sounds/failed-engine.mp3';

type SoundName = 'click' | 'success' | 'error' | 'engine' | 'electro' | 'failedEngine';

class AudioPreloader {
  private sounds: Map<SoundName, HTMLAudioElement[]> = new Map();
  private ready = false;
  private poolSize = 2;

  async preloadAll() {
    const items: { name: SoundName; src: string }[] = [
      { name: 'click', src: click },
      { name: 'success', src: success },
      { name: 'error', src: error },
      { name: 'engine', src: engine },
      { name: 'electro', src: electro },
      { name: 'failedEngine', src: failedEngine },
    ];

    const loadPromises: Promise<void>[] = [];

    for (const { name, src } of items) {
      const pool: HTMLAudioElement[] = [];

      for (let i = 0; i < this.poolSize; i++) {
        const audio = new Audio(src);
        audio.preload = 'auto';
        audio.volume = 0.8;

        // Ждём загрузки каждого аудио
        const loadPromise = new Promise<void>((resolve) => {
          if (audio.readyState >= 2) {
            resolve();
          } else {
            audio.addEventListener('canplaythrough', () => resolve(), {
              once: true,
            });
            audio.load(); // Принудительно начинаем загрузку
          }
        });

        loadPromises.push(loadPromise);
        pool.push(audio);
      }

      this.sounds.set(name, pool);
    }

    // Ждём загрузки ВСЕХ звуков
    await Promise.all(loadPromises);
    this.ready = true;
    console.log('[Audio] Все звуки предзагружены');

    // Прогреваем звуки (воспроизводим на долю секунды с громкостью 0)
    this.warmup();
  }

  private warmup() {
    this.sounds.forEach((pool, name) => {
      pool.forEach((audio) => {
        const originalVolume = audio.volume;
        audio.volume = 0;
        audio.currentTime = 0;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              audio.pause();
              audio.currentTime = 0;
              audio.volume = originalVolume;
            })
            .catch((e) => console.log(`Warmup ${name} failed:`, e));
        }
      });
    });
    console.log('[Audio] Прогрев завершён');
  }

  play(name: SoundName, volume = 0.8) {
    const pool = this.sounds.get(name);
    if (!pool) {
      console.warn(`[Audio] Звук ${name} не найден`);
      return;
    }

    let audio = pool.find((a) => a.paused || a.ended);

    if (!audio) {
      audio = pool[0];
      audio.pause();
      audio.currentTime = 0;
    }

    audio.volume = volume;
    audio.currentTime = 0;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => console.log(`[Audio] Play ${name} error:`, e));
    }
  }

  isReady() {
    return this.ready;
  }
}

export const audioPreloader = new AudioPreloader();

export const useQuestAudio = () => {
  const [ready, setReady] = useState(audioPreloader.isReady());

  useEffect(() => {
    if (ready) {
      return;
    }

    audioPreloader.preloadAll().then(() => {
      setReady(true);
    });
  }, []);

  const play = (name: SoundName) => {
    if (!ready) {
      console.warn('[Audio] Звуки ещё не загружены');
      return;
    }
    audioPreloader.play(name);
  };

  return { play, ready };
};
