// eslint-disable-next-line no-unused-vars
class SettingsPageController {
  constructor ({ settings }) {
    this.settings = settings;

    this.elRunningDurationMin = document.querySelector('#runningDurationMin');
    this.elBreakingDurationMin = document.querySelector('#breakingDurationMin');
    this.elPlayChime = document.querySelector('#playChime');
    this.elChimeVolume = document.querySelector('#chimeVolume');
    this.elChimeVolumeValue = document.querySelector('#chimeVolumeValue');
  }

  async start () {
    this.elRunningDurationMin.oninput = () => {
      this.save();
    };

    this.elBreakingDurationMin.oninput = () => {
      this.save();
    };

    this.elPlayChime.onclick = () => {
      this.save();
      this.render();
    };

    this.elChimeVolume.oninput = () => {
      this.save();
      this.render();
    };

    await this.settings.load();
    this.render();
  }

  render () {
    this.elRunningDurationMin.value = this.settings.runningDurationMin;
    this.elBreakingDurationMin.value = this.settings.breakingDurationMin;
    this.elPlayChime.checked = this.settings.playChime;
    this.elChimeVolume.value = this.settings.chimeVolume;
    this.elChimeVolume.disabled = !this.settings.playChime;
    this.elChimeVolumeValue.textContent = this.settings.chimeVolume;
  }

  async save () {
    this.settings.runningDurationMin = Number(this.elRunningDurationMin.value);
    this.settings.breakingDurationMin = Number(this.elBreakingDurationMin.value);
    this.settings.playChime = this.elPlayChime.checked;
    this.settings.chimeVolume = Number(this.elChimeVolume.value);
    this.settings.save();
  }
}
