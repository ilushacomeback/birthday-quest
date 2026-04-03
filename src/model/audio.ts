class AudioManager {
  private sounds = new Map<string, HTMLAudioElement>();
  private unlocked = false;

  register(name: string, src: string) {
    if (this.sounds.has(name)) return;

    const audio = new Audio(src);
    audio.preload = 'auto';

    this.sounds.set(name, audio);
  }

  registerMany(items: Array<{ name: string; src: string }>) {
    items.forEach((item) => this.register(item.name, item.src));
  }

  // async unlock() {
  //   if (this.unlocked) return;

  //   try {
  //     const audio = new Audio();
  //     audio.volume = 0;
  //     console.log('start unlock');
  //     await audio.play().catch((e) => {
  //       console.log('unlock play error', e);
  //     });
  //     console.log('finish unlock');
  //   } catch (e) {
  //     console.log('unlock error', e);
  //     //
  //   }

  //   this.unlocked = true;
  // }

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
