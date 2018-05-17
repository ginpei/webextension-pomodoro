document.querySelector('#start').onclick = () => {
  browser.runtime.sendMessage({
    type: 'TIMER_START',
  });
};

document.querySelector('#stop').onclick = () => {
  browser.runtime.sendMessage({
    type: 'TIMER_STOP',
  });
};

browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'TIMER_TICK') {
    const elButtonArea = document.querySelector('.button');
    const elStatus = document.querySelector('#status');
    const elRemainingArea = document.querySelector('.remaining');

    elButtonArea.setAttribute('data-active', message.active.toString());
    elRemainingArea.setAttribute('data-active', message.active.toString());

    // eslint-disable-next-line no-nested-ternary
    elStatus.textContent = message.active ? (message.running ? 'Running' : 'Breaking') : 'Off';

    let text = '';
    if (message.active) {
      const remainingSeconds = Math.ceil(message.remaining / 1000);
      text = `${remainingSeconds} s`;
    }
    const elRemaining = document.querySelector('#remaining');
    elRemaining.textContent = text;
  }
});
