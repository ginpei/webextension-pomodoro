// eslint-disable-next-line no-unused-vars
class BackgroundTimer {
  get active () {
    return this.startedAt !== 0;
  }

  get running () {
    return this.active && this._running;
  }

  get breaking () {
    return this.active && this._breaking;
  }

  get remaining () {
    const elapsed = Date.now() - this.startedAt;
    const duration = this.running ? this.settings.runningDuration : this.settings.breakingDuration;
    const remaining = duration - elapsed;
    return remaining >= 0 ? remaining : 0;
  }

  constructor () {
    this.tmNotify = 0;
    this.tmTick = 0;
    this.startedAt = 0;
    this._running = false;
    this._breaking = false;

    this.settings = {
      runningDuration: 25 * 60 * 1000, // 25 min
      breakingDuration: 5 * 60 * 1000, // 5 min
      title: 'Pomodoro',
      iconUrl: '/icons/icon-90.png',
      messages: {
        done: 'It\'s time!',
        finishBreaking: 'OK. Let\'s rock!',
      },
    };
  }

  start () {
    if (this.active) {
      return;
    }

    this.stop();
    this.startRunning();
    this.startTicking();
  }

  stop () {
    if (!this.active) {
      return;
    }

    if (this._running) {
      this.stopRunning();
    } else {
      this.stopBreaking();
    }

    this.stopTicking();

    this.tick();
  }

  startRunning () {
    this._running = true;
    this.startedAt = Date.now();
    this.tmNotify = setTimeout(() => {
      this.notifyRunningDone();
      this.stopRunning();

      this.startBreaking();
    }, this.settings.runningDuration);
  }

  stopRunning () {
    this._running = false;
    clearTimeout(this.tmNotify);
    this.startedAt = 0;
  }

  notifyRunningDone () {
    browser.notifications.create({
      type: browser.notifications.TemplateType.BASIC,
      iconUrl: this.settings.iconUrl,
      title: this.settings.title,
      message: this.settings.messages.done,
    });
  }

  startBreaking () {
    this._breaking = true;
    this.startedAt = Date.now();
    this.tmNotify = setTimeout(() => {
      this.notifyBreakingDone();
      this.stopBreaking();

      this.startRunning();
    }, this.settings.breakingDuration);
  }

  stopBreaking () {
    this._breaking = false;
    clearTimeout(this.tmNotify);
    this.startedAt = 0;
  }

  notifyBreakingDone () {
    browser.notifications.create({
      type: browser.notifications.TemplateType.BASIC,
      iconUrl: this.settings.iconUrl,
      title: this.settings.title,
      message: this.settings.messages.finishBreaking,
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
      active: this.active,
      running: this.running,
      breaking: this.breaking,
    });
  }
}
