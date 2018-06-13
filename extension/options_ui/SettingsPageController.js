/* globals ScheduleChart */

// eslint-disable-next-line no-unused-vars
class SettingsPageController {
  constructor ({ settings }) {
    this.settings = settings;

    this.elRunningDurationMin = document.querySelector('#runningDurationMin');
    this.elBreakingDurationMin = document.querySelector('#breakingDurationMin');
    this.elTotalDurationMin = document.querySelector('#totalDurationMin');
    this.elPlayChime = document.querySelector('#playChime');
    this.elChimeVolume = document.querySelector('#chimeVolume');
    this.elChimeVolumeValue = document.querySelector('#chimeVolumeValue');
  }

  async start () {
    this.chart = new ScheduleChart({
      el: document.querySelector('#scheduleChart'),
    });

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

    browser.storage.onChanged.addListener(async () => {
      await this.settings.load();
      this.render();
    });

    await this.settings.load();
    this.render();
  }

  render () {
    const s = this.settings;
    const { runningDurationMin, breakingDurationMin } = s;

    this.elRunningDurationMin.value = runningDurationMin;
    this.elBreakingDurationMin.value = breakingDurationMin;
    this.elTotalDurationMin.textContent = runningDurationMin + breakingDurationMin;
    this.elPlayChime.checked = s.playChime;
    this.elChimeVolume.value = s.chimeVolume;
    this.elChimeVolume.disabled = !s.playChime;
    this.elChimeVolumeValue.textContent = s.chimeVolume;

    this.renderChart();
  }

  renderChart () {
    this.chart.render({
      runningDuration: this.settings.runningDuration,
      breakingDuration: this.settings.breakingDuration,
      active: false,
    });
  }

  async save () {
    this.settings.runningDurationMin = Number(this.elRunningDurationMin.value);
    this.settings.breakingDurationMin = Number(this.elBreakingDurationMin.value);
    this.settings.playChime = this.elPlayChime.checked;
    this.settings.chimeVolume = Number(this.elChimeVolume.value);
    this.settings.save();
  }
}
