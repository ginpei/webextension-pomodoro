document.querySelector('#start').onclick = () => {
  browser.runtime.sendMessage({
    type: 'TIMER_START',
  });
};

browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'TIMER_TICK') {
    let text = '';
    if (message.running) {
      const remainingSeconds = Math.ceil(message.remaining / 1000);
      text = `${remainingSeconds} s`;
    }
    const elRemaining = document.querySelector('#remaining');
    elRemaining.textContent = text;
  }
});
