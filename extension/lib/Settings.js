// eslint-disable-next-line no-unused-vars
class Settings {
  set runningDurationMin (durationMin) {
    this.runningDuration = durationMin * 60 * 1000;
  }
  get runningDurationMin () {
    return Math.floor(this.runningDuration / 60 / 1000);
  }

  set breakingDurationMin (durationMin) {
    this.breakingDuration = durationMin * 60 * 1000;
  }
  get breakingDurationMin () {
    return Math.floor(this.breakingDuration / 60 / 1000);
  }

  get defaultValues () {
    return {
      runningDuration: 25 * 60 * 1000, // 25 min
      breakingDuration: 5 * 60 * 1000, // 5 min
      playChime: true,
      chimeVolume: 100,
    };
  }

  get version () {
    return browser.runtime.getManifest().version;
  }

  constructor () {
    this.runningDuration = 0;
    this.breakingDuration = 0;

    this.title = 'Pomodoro';
    this.iconUrl = '/icons/icon-90.png';
    this.messages = {
      finishRunning: 'Well done! Please have a break.',
      finishBreaking: 'OK. Let\'s rock!',
      start: 'Start!',
      stop: 'Stop. Good job!',
    };
  }

  async load () {
    const keys = [
      'runningDuration',
      'breakingDuration',
      'playChime',
      'chimeVolume',
    ];
    const values = await browser.storage.local.get(keys);
    const defaults = this.defaultValues;
    this.runningDuration = values.runningDuration || defaults.runningDuration;
    this.breakingDuration = values.breakingDuration || defaults.breakingDuration;
    this.playChime = 'playChime' in values ? values.playChime : defaults.playChime;
    this.chimeVolume = 'chimeVolume' in values ? values.chimeVolume : defaults.chimeVolume;
  }

  async save () {
    const keys = {
      runningDuration: this.runningDuration,
      breakingDuration: this.breakingDuration,
      playChime: this.playChime,
      chimeVolume: this.chimeVolume,
      version: this.version,
    };
    await browser.storage.local.set(keys);
  }
}
