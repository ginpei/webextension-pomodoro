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

  renderChart (message) {
    const { chart } = this;
    const { runningDuration, breakingDuration } = this.settings;
    const { duration } = message;
    chart.render({
      runningDuration,
      breakingDuration,
      active: message.active,
      running: message.running,
      duration,
      elapsed: duration - message.remaining,
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
