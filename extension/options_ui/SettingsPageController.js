// eslint-disable-next-line no-unused-vars
class SettingsPageController {
  constructor () {
    this.elRunningDurationMin = document.querySelector('#runningDurationMin');
    this.elBreakingDurationMin = document.querySelector('#breakingDurationMin');

    this.runningDurationMin = 25;
    this.breakingDurationMin = 5;
  }

  start () {
    this.elRunningDurationMin.oninput = () => {
      const runningDurationMin = this.elRunningDurationMin.value;
      this.updateValues({ runningDurationMin });
    };

    this.elBreakingDurationMin.oninput = () => {
      const breakingDurationMin = this.elBreakingDurationMin.value;
      this.updateValues({ breakingDurationMin });
    };

    this.render();
  }

  render () {
    this.elRunningDurationMin.value = this.runningDurationMin;
    this.elBreakingDurationMin.value = this.breakingDurationMin;
  }

  async updateValues (values) {
    console.log('# values', values);
  }
}
