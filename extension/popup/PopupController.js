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

  constructor () {
    this.active = false;
    this.running = false;
    this.remaining = 0;

    this.elButtonArea = document.querySelector('.button');
    this.elStatus = document.querySelector('#status');
    this.elRemainingArea = document.querySelector('.remaining');
    this.elRemaining = document.querySelector('#remaining');
  }

  init () {
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
  }

  render () {
    this.elButtonArea.setAttribute('data-active', this.active.toString());
    this.elRemainingArea.setAttribute('data-active', this.active.toString());

    this.elStatus.textContent = this.statusText;
    this.elRemaining.textContent = `${this.remainingSeconds} s`;
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
