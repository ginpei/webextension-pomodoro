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

  get duration () {
    const s = this.settings;
    return this.running ? s.runningDuration : s.breakingDuration;
  }

  get remaining () {
    const elapsed = Date.now() - this.startedAt;
    const remaining = this.duration - elapsed;
    return remaining >= 0 ? remaining : 0;
  }

  get progress () {
    return 1 - (this.remaining / this.duration);
  }

  constructor (settings, chartRenderer) {
    this.settings = settings;
    this.chartRenderer = chartRenderer;

    this.tmNotify = 0;
    this.tmTick = 0;
    this.startedAt = 0;
    this._running = false;
    this._breaking = false;
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
      this.tick();
    this.tmTick = setTimeout(() => {
      this.startTicking();
    }, 100);
  }

  stopTicking () {
    clearTimeout(this.tmTick);
  }

  async tick () {
    this.updateActionButtonIcon();

    try {
      await browser.runtime.sendMessage({
        type: 'TIMER_TICK',
        remaining: this.remaining,
        active: this.active,
        running: this.running,
        breaking: this.breaking,
      });
    } catch (error) {
      const expectedMessages = [
        'The message port closed before a response was received.',
        'Could not establish connection. Receiving end does not exist.',
      ];
      if (!expectedMessages.includes(error.message)) {
        throw error;
      }
    }
  }

  updateActionButtonIcon () {
    if (this.active) {
      this.chartRenderer.progress = this.progress;
      this.chartRenderer.render();
      const imageData = this.chartRenderer.getImageData();
      browser.browserAction.setIcon({ imageData });
    } else {
      const manifest = browser.runtime.getManifest();
      const path = browser.extension.getURL(manifest.browser_action.default_icon);
      browser.browserAction.setIcon({ path });
    }
  }
}
