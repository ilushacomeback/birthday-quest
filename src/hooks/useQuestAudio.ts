import { useEffect, useState } from 'react';
import click from '../assets/sounds/click.mp3';
import success from '../assets/sounds/success.mp3';
import error from '../assets/sounds/error.mp3';
import engine from '../assets/sounds/engine.mp3';
import electro from '../assets/sounds/electro.mp3';
import failedEngine from '../assets/sounds/failed-engine.mp3';
import typewriter from '../assets/sounds/typewriter.mp3';
import type { SoundName } from '../features/config/types';

type SoundConfig = {
  src: string;
  volume: number;
  loop?: boolean;
  minIntervalMs?: number;
};

type ActivePlayback = {
  source: AudioBufferSourceNode;
  gainNode: GainNode;
};

class AudioManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private buffers = new Map<SoundName, AudioBuffer>();
  private ready = false;
  private unlocked = false;
  private loadingPromise: Promise<void> | null = null;

  private active = new Map<SoundName, Set<ActivePlayback>>();
  private lastPlayAt = new Map<SoundName, number>();

  private soundConfig: Record<SoundName, SoundConfig> = {
    click: {
      src: click,
      volume: 0.8,
      minIntervalMs: 40,
    },
    success: {
      src: success,
      volume: 0.9,
      minIntervalMs: 80,
    },
    error: {
      src: error,
      volume: 0.9,
      minIntervalMs: 80,
    },
    engine: {
      src: engine,
      volume: 0.7,
      minIntervalMs: 120,
    },
    electro: {
      src: electro,
      volume: 0.85,
      minIntervalMs: 60,
    },
    failedEngine: {
      src: failedEngine,
      volume: 0.9,
      minIntervalMs: 100,
    },
    typewriter: {
      src: typewriter,
      volume: 0.35,
      minIntervalMs: 90,
    },
  };

  private getContext() {
    if (this.context) return this.context;

    const AudioContextCtor =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextCtor) {
      console.warn('[Audio] AudioContext is not supported');
      return null;
    }

    this.context = new AudioContextCtor();
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = 1;
    this.masterGain.connect(this.context.destination);

    return this.context;
  }

  async preloadAll() {
    if (this.ready) return;
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = (async () => {
      const ctx = this.getContext();
      if (!ctx) return;

      const entries = Object.entries(this.soundConfig) as [
        SoundName,
        SoundConfig,
      ][];

      await Promise.all(
        entries.map(async ([name, config]) => {
          const response = await fetch(config.src);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
          this.buffers.set(name, audioBuffer);
        }),
      );

      this.ready = true;
      console.log('[Audio] All sounds preloaded');
    })();

    return this.loadingPromise;
  }

  async unlock() {
    const ctx = this.getContext();
    if (!ctx) return;

    if (ctx.state !== 'running') {
      await ctx.resume();
    }

    this.unlocked = true;

    // тихий "прогрев" для iOS
    const silentBuffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();

    gain.gain.value = 0;
    source.buffer = silentBuffer;
    source.connect(gain);
    gain.connect(this.masterGain!);
    source.start(0);

    console.log('[Audio] Unlocked');
  }

  play(name: SoundName) {
    const ctx = this.getContext();
    const masterGain = this.masterGain;
    const buffer = this.buffers.get(name);
    const config = this.soundConfig[name];

    if (!ctx || !masterGain || !buffer) {
      console.warn(`[Audio] Sound ${name} is not ready`);
      return;
    }

    if (!this.unlocked) {
      console.warn(`[Audio] Sound ${name} skipped: audio is locked`);
      return;
    }

    const now = performance.now();
    const lastPlayAt = this.lastPlayAt.get(name) ?? 0;
    const minIntervalMs = config.minIntervalMs ?? 0;

    if (now - lastPlayAt < minIntervalMs) {
      return;
    }

    if (config.loop) {
      this.stop(name);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = !!config.loop;

    const gainNode = ctx.createGain();
    gainNode.gain.value = config.volume;

    source.connect(gainNode);
    gainNode.connect(masterGain);

    const playback: ActivePlayback = { source, gainNode };

    if (!this.active.has(name)) {
      this.active.set(name, new Set());
    }

    this.active.get(name)!.add(playback);

    source.onended = () => {
      const activeSet = this.active.get(name);
      activeSet?.delete(playback);
      if (activeSet && activeSet.size === 0) {
        this.active.delete(name);
      }
    };

    try {
      source.start(0);
      this.lastPlayAt.set(name, now);
    } catch (error) {
      console.log(`[Audio] Play ${name} error:`, error);
      this.active.get(name)?.delete(playback);
    }
  }

  stop(name: SoundName) {
    const activeSet = this.active.get(name);
    if (!activeSet?.size) return;

    for (const playback of activeSet) {
      try {
        playback.source.stop(0);
      } catch {
        //
      }
    }

    this.active.delete(name);
  }

  stopAll() {
    for (const [name] of this.active) {
      this.stop(name);
    }
  }

  setVolume(name: SoundName, volume: number) {
    this.soundConfig[name] = {
      ...this.soundConfig[name],
      volume,
    };
  }

  isReady() {
    return this.ready;
  }

  isUnlocked() {
    return this.unlocked;
  }
}

export const audioManager = new AudioManager();

export const useQuestAudio = () => {
  const [ready, setReady] = useState(audioManager.isReady());

  useEffect(() => {
    if (ready) return;

    audioManager.preloadAll().then(() => {
      setReady(true);
    });
  }, [ready]);

  const play = (name: SoundName) => {
    if (!audioManager.isReady()) {
      console.warn('[Audio] Sounds are not ready yet');
      return;
    }

    audioManager.play(name);
  };

  const stop = (name: SoundName) => {
    audioManager.stop(name);
  };

  const stopAll = () => {
    audioManager.stopAll();
  };

  const unlock = async () => {
    await audioManager.unlock();
  };

  const setVolume = (name: SoundName, volume: number) => {
    audioManager.setVolume(name, volume);
  };

  return {
    ready,
    play,
    stop,
    stopAll,
    unlock,
    setVolume,
  };
};
