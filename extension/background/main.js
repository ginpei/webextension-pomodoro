/* global Settings, BackgroundTimer, ChartRenderer */

(async () => {
  const elCanvas = document.querySelector('#chartRenderer');
  const chartRenderer = new ChartRenderer({ el: elCanvas });

  const settings = new Settings();
  await settings.load();
  const timer = new BackgroundTimer(settings, chartRenderer);
  browser.runtime.onMessage.addListener((message) => {
    if (message.type === 'TIMER_START') {
      timer.start();
    } else if (message.type === 'TIMER_STOP') {
      timer.stop();
    }
  });
})();
