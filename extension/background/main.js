/* global Settings, BackgroundTimer */

(async () => {
  const settings = new Settings();
  await settings.load();
  const timer = new BackgroundTimer(settings);
  browser.runtime.onMessage.addListener((message) => {
    if (message.type === 'TIMER_START') {
      timer.start();
    } else if (message.type === 'TIMER_STOP') {
      timer.stop();
    }
  });
})();
