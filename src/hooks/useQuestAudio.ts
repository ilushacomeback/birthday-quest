import { useEffect, useState } from 'react';
import click from '../assets/sounds/click.mp3';
import success from '../assets/sounds/success.mp3';
import error from '../assets/sounds/error.mp3';
import engine from '../assets/sounds/engine.mp3';
import electro from '../assets/sounds/electro.mp3';
import failedEngine from '../assets/sounds/failed-engine.mp3';
import typewriter from '../assets/sounds/typewriter.mp3';
import type { SoundName } from '../features/config/types';

class AudioPreloader {
  private sounds: Map<SoundName, HTMLAudioElement[]> = new Map();
  private ready = false;
  private poolSize = 2;

  private audioContext: AudioContext | null = null;
  private typewriterBuffer: AudioBuffer | null = null;
  private typewriterGain: GainNode | null = null;
  private typewriterLastPlayAt = 0;
  private typewriterMinIntervalMs = 90;
  private unlocked = false;

  private getAudioContext() {
    if (this.audioContext) return this.audioContext;

    const AudioContextCtor =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextCtor) return null;

    this.audioContext = new AudioContextCtor();
    this.typewriterGain = this.audioContext.createGain();
    this.typewriterGain.gain.value = 0.35;
    this.typewriterGain.connect(this.audioContext.destination);

    return this.audioContext;
  }

  async unlock() {
    const ctx = this.getAudioContext();
    if (!ctx || this.unlocked) return;

    if (ctx.state !== 'running') {
      await ctx.resume();
    }

    this.unlocked = true;
  }

  async preloadAll() {
    const items: { name: Exclude<SoundName, 'typewriter'>; src: string }[] = [
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

        const loadPromise = new Promise<void>((resolve) => {
          if (audio.readyState >= 2) {
            resolve();
            return;
          }

          const done = () => resolve();

          audio.addEventListener('canplaythrough', done, { once: true });
          audio.addEventListener('loadeddata', done, { once: true });
          audio.addEventListener('error', done, { once: true });

          audio.load();
        });

        loadPromises.push(loadPromise);
        pool.push(audio);
      }

      this.sounds.set(name, pool);
    }

    const ctx = this.getAudioContext();

    const typewriterPromise = (async () => {
      if (!ctx) return;

      const response = await fetch(typewriter);
      const arrayBuffer = await response.arrayBuffer();
      this.typewriterBuffer = await ctx.decodeAudioData(arrayBuffer);
    })();

    await Promise.all([...loadPromises, typewriterPromise]);

    this.ready = true;
    console.log('[Audio] Все звуки предзагружены');
  }

  play(name: SoundName) {
    if (name === 'typewriter') {
      this.playTypewriter();
      return;
    }

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

    audio.volume = 0.9;
    audio.currentTime = 0;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => console.log(`[Audio] Play ${name} error:`, e));
    }
  }

  private playTypewriter() {
    const now = performance.now();

    if (now - this.typewriterLastPlayAt < this.typewriterMinIntervalMs) {
      return;
    }

    const ctx = this.getAudioContext();

    if (
      !ctx ||
      !this.typewriterBuffer ||
      !this.typewriterGain ||
      !this.unlocked
    ) {
      return;
    }

    const source = ctx.createBufferSource();
    source.buffer = this.typewriterBuffer;
    source.connect(this.typewriterGain);
    source.start(0);

    this.typewriterLastPlayAt = now;
  }

  isReady() {
    return this.ready;
  }
}

export const audioPreloader = new AudioPreloader();

export const useQuestAudio = () => {
  const [ready, setReady] = useState(audioPreloader.isReady());

  useEffect(() => {
    if (ready) return;

    audioPreloader.preloadAll().then(() => {
      setReady(true);
    });
  }, [ready]);

  const play = (name: SoundName) => {
    if (!ready) {
      console.warn('[Audio] Звуки ещё не загружены');
      return;
    }

    audioPreloader.play(name);
  };

  const unlock = async () => {
    await audioPreloader.unlock();
  };

  return { play, ready, unlock };
};
