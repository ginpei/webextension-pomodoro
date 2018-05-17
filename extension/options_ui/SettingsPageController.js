// eslint-disable-next-line no-unused-vars
class SettingsPageController {
  constructor ({ settings }) {
    this.settings = settings;

    this.elRunningDurationMin = document.querySelector('#runningDurationMin');
    this.elBreakingDurationMin = document.querySelector('#breakingDurationMin');
  }

  async start () {
    this.elRunningDurationMin.oninput = () => {
      this.save();
    };

    this.elBreakingDurationMin.oninput = () => {
      this.save();
    };

    await this.settings.load();
    this.render();
  }

  render () {
    this.elRunningDurationMin.value = this.settings.runningDurationMin;
    this.elBreakingDurationMin.value = this.settings.breakingDurationMin;
  }

  async save () {
    this.settings.runningDurationMin = Number(this.elRunningDurationMin.value);
    this.settings.breakingDurationMin = Number(this.elBreakingDurationMin.value);
    this.settings.save();
  }
}
