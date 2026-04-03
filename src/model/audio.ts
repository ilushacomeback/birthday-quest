type RegisterItem = {
  name: string;
  src: string;
};

class AudioManager {
  private context: AudioContext | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private initialized = false;
  private loadingPromise: Promise<void> | null = null;

  private getContext() {
    if (!this.context) {
      this.context = new AudioContext();
    }

    return this.context;
  }

  async init() {
    const context = this.getContext();

    if (context.state === 'suspended') {
      await context.resume();
    }

    this.initialized = true;
  }

  async registerMany(items: RegisterItem[]) {
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = (async () => {
      const context = this.getContext();

      await Promise.all(
        items.map(async ({ name, src }) => {
          if (this.buffers.has(name)) return;

          const response = await fetch(src);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await context.decodeAudioData(arrayBuffer);

          this.buffers.set(name, audioBuffer);
        }),
      );
    })();

    try {
      await this.loadingPromise;
    } finally {
      this.loadingPromise = null;
    }
  }

  play(name?: string, volume = 1) {
    if (!name) return;
    if (!this.initialized) return;

    const context = this.getContext();
    const buffer = this.buffers.get(name);

    if (!buffer) {
      console.log(`Audio buffer "${name}" not loaded`);
      return;
    }

    const source = context.createBufferSource();
    source.buffer = buffer;

    const gainNode = context.createGain();
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(context.destination);

    source.start(0);
  }
}

export const audioManager = new AudioManager();
