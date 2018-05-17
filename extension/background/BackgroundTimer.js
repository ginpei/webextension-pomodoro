// eslint-disable-next-line no-unused-vars
class BackgroundTimer {
  get running () {
    return this.startedAt !== 0;
  }

  get remaining () {
    const elapsed = Date.now() - this.startedAt;
    const remaining = this.settings.delay - elapsed;
    return remaining >= 0 ? remaining : 0;
  }

  constructor () {
    this.tmNotify = 0;
    this.tmTick = 0;
    this.startedAt = 0;

    this.settings = {
      delay: 3000,
      title: 'Pomodoro',
      iconUrl: '/icons/icon-90.png',
      messages: {
        done: 'It\'s time!',
      },
    };
  }

  start () {
    this.stop();

    this.startedAt = Date.now();
    this.tmNotify = setTimeout(() => {
      this.notifyDone();
      this.stop();
    }, this.settings.delay);

    this.startTicking();
  }

  stop () {
    clearTimeout(this.tmNotify);
    this.startedAt = 0;
    this.stopTicking();

    this.tick();
  }

  notifyDone () {
    browser.notifications.create({
      type: browser.notifications.TemplateType.BASIC,
      iconUrl: this.settings.iconUrl,
      title: this.settings.title,
      message: this.settings.messages.done,
    });
  }

  startTicking () {
    this.tmTick = setTimeout(() => {
      this.tick();
      this.startTicking();
    }, 100);
  }

  stopTicking () {
    clearTimeout(this.tmTick);
  }

  tick () {
    browser.runtime.sendMessage({
      type: 'TIMER_TICK',
      remaining: this.remaining,
      running: this.running,
    });
  }
}
