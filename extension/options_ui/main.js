/* global Settings, SettingsPageController */

(() => {
  const settings = new Settings();
  const controller = new SettingsPageController({ settings });
  controller.start();
})();
