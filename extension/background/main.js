/* global BackgroundTimer */

(() => {
  const timer = new BackgroundTimer();
  browser.runtime.onMessage.addListener((message) => {
    if (message.type === 'TIMER_START') {
      timer.start();
    } else if (message.type === 'TIMER_STOP') {
      timer.stop();
    }
  });
})();
