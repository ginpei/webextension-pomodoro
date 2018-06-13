/* global Settings, PopupController */

(() => {
  const settings = new Settings();
  const controller = new PopupController(settings);
  controller.init();
})();
