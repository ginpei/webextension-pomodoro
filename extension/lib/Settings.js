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
    };
  }

  constructor () {
    this.runningDuration = 0;
    this.breakingDuration = 0;

    this.title = 'Pomodoro';
    this.iconUrl = '/icons/icon-90.png';
    this.messages = {
      done: 'It\'s time!',
      finishBreaking: 'OK. Let\'s rock!',
    };
  }

  async load () {
    const keys = [
      'runningDuration',
      'breakingDuration',
    ];
    const values = await browser.storage.local.get(keys);
    const defaults = this.defaultValues;
    this.runningDuration = values.runningDuration || defaults.runningDuration;
    this.breakingDuration = values.breakingDuration || defaults.breakingDuration;
  }

  async save () {
    const keys = {
      runningDuration: this.runningDuration,
      breakingDuration: this.breakingDuration,
    };
    await browser.storage.local.set(keys);
  }
}
