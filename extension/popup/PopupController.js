/* globals ScheduleChart */

// eslint-disable-next-line no-unused-vars
class PopupController {
  get remainingSeconds () {
    return Math.ceil(this.remaining / 1000);
  }

  get statusText () {
    if (this.active) {
      return this.running ? 'Running' : 'Breaking';
    }
    return 'Off';
  }

  constructor (settings) {
    this.settings = settings;
    this.active = false;
    this.running = false;
    this.remaining = 0;

    this.elButtonArea = document.querySelector('.button');
    this.elStatus = document.querySelector('#status');
    this.elRemainingArea = document.querySelector('.remaining');
    this.elRemaining = document.querySelector('#remaining');
  }

  async init () {
    this.initChart();

    document.querySelector('#start').onclick = () => {
      this.start();
    };

    document.querySelector('#stop').onclick = () => {
      this.stop();
    };

    document.querySelector('#openSettings').onclick = (event) => {
      event.preventDefault();
      this.openSettings();
    };

    browser.runtime.onMessage.addListener((message) => {
      if (message.type === 'TIMER_TICK') {
        this.onTick(message);
      }
    });

    browser.storage.onChanged.addListener(async () => {
      await this.settings.load();

      this.renderChart({
        active: this.settings.active,
        running: this.settings.running,
      });
    });

    await this.settings.load();
  }

  initChart () {
    this.chart = new ScheduleChart({
      el: document.querySelector('#scheduleChart'),
    });

    browser.runtime.onMessage.addListener((message) => {
      if (message.type === 'TIMER_TICK') {
        this.renderChart(message);
      }
    });
  }

  render () {
    this.elButtonArea.setAttribute('data-active', this.active.toString());
    this.elRemainingArea.setAttribute('data-active', this.active.toString());

    this.elStatus.textContent = this.statusText;
    this.elRemaining.textContent = `${this.remainingSeconds} s`;
  }

  renderChart (message = {}) {
    const duration = 'duration' in message ? message.duration : 0;
    this.chart.render({
      runningDuration: this.settings.runningDuration,
      breakingDuration: this.settings.breakingDuration,
      active: 'active' in message ? message.active : this.active,
      running: 'running' in message ? message.running : this.running,
      duration,
      elapsed: 'remaining' in message ? duration - message.remaining : 0,
    });
  }

  start () {
    browser.runtime.sendMessage({
      type: 'TIMER_START',
    });
  }

  stop () {
    browser.runtime.sendMessage({
      type: 'TIMER_STOP',
    });
  }

  openSettings () {
    browser.runtime.openOptionsPage();
  }

  onTick (message) {
    this.active = message.active;
    this.running = message.running;
    this.remaining = message.remaining;
    this.render();
  }
}
