/* global Settings, PomodoroTimer, ChartRenderer */

// eslint-disable-next-line no-unused-vars
class BackgroundController {
  constructor () {
    this.settings = null;
    this.chartRenderer = null;
    this.timer = null;
    this.lastTimerStatus = PomodoroTimer.prototype.STATUS_OFF;

    this.elCanvas = document.querySelector('#chartRenderer');
    this.elChime = document.querySelector('#chime');
  }

  async start () {
    this.chartRenderer = new ChartRenderer({ el: this.elCanvas });
    this.settings = new Settings();
    await this.settings.load();
    this.timer = new PomodoroTimer(this.settings, this.chartRenderer);

    this.timer.onTick = () => {
      this.updateActionButtonIcon();
      this.sendTickMessage();
    };

    this.timer.onStatusChange = () => {
      this.notifyStatusChange();
    };

    browser.storage.onChanged.addListener(() => {
      this.settings.load();
    });

    browser.runtime.onMessage.addListener((message) => {
      if (message.type === 'TIMER_START') {
        this.timer.start();
      } else if (message.type === 'TIMER_STOP') {
        this.timer.stop();
      }
    });
  }

  updateActionButtonIcon () {
    const { chartRenderer, timer } = this;

    if (timer.active) {
      const roundedProgress = Math.floor(timer.progress * 100) / 100;
      if (roundedProgress !== this.renderedProgress) {
        this.renderedProgress = roundedProgress;
        chartRenderer.progress = roundedProgress;

        chartRenderer.render({ running: this.timer.running });
        const imageData = chartRenderer.getImageData();
        browser.browserAction.setIcon({ imageData });
      }
    } else {
      timer.renderedProgress = -1;

      const manifest = browser.runtime.getManifest();
      const path = browser.extension.getURL(manifest.browser_action.default_icon);
      browser.browserAction.setIcon({ path });
    }
  }

  async sendTickMessage () {
    const { timer } = this;

    const message = {
      type: 'TIMER_TICK',
      remaining: timer.remaining,
      active: timer.active,
      running: timer.running,
      breaking: timer.breaking,
    };
    try {
      await browser.runtime.sendMessage(message);
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

  async notifyStatusChange () {
    const m = this.settings.messages;

    const { status } = this.timer;
    let switchedRunningMode = false;
    let message;
    if (this.lastTimerStatus === this.timer.STATUS_OFF) {
      message = m.start;
    } else if (this.timer.active) {
      message = this.timer.running ? m.finishBreaking : m.finishRunning;
      switchedRunningMode = true;
    } else {
      message = m.stop;
    }
    this.lastTimerStatus = status;

    const id = await browser.notifications.create({
      type: browser.notifications.TemplateType.BASIC,
      iconUrl: this.settings.iconUrl,
      title: this.settings.title,
      message,
    });

    const clear = (targetId) => {
      if (targetId === id) {
        browser.notifications.clear(id);
        browser.notifications.onClicked.removeListener(clear);
      }
    };
    browser.notifications.onClicked.addListener(clear);

    if (switchedRunningMode) {
      this.playChime();
    }

    return id;
  }

  playChime () {
    if (!this.settings.playChime) {
      return;
    }

    const chime = this.elChime;
    chime.volume = this.settings.chimeVolume / 100;
    chime.play();
  }
}
