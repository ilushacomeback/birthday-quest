class AudioManager {
  private sounds = new Map<string, HTMLAudioElement>();

  register(name: string, src: string) {
    if (this.sounds.has(name)) return;

    const audio = new Audio(src);
    audio.preload = 'auto';

    this.sounds.set(name, audio);
  }

  registerMany(items: Array<{ name: string; src: string }>) {
    items.forEach((item) => this.register(item.name, item.src));
  }

  async play(name?: string) {
    if (!name) return;

    const sound = this.sounds.get(name);
    if (!sound) return;

    try {
      sound.currentTime = 0;
      console.log('start play')
      await sound.play();
      console.log('finish play')
    } catch (e) {
      console.log('play error', e);
      //
    }
  }
}

export const audioManager = new AudioManager();
