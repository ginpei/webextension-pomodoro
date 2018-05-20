// eslint-disable-next-line no-unused-vars
class PomodoroTimer {
  get status () {
    if (this.running) {
      return this.STATUS_RUNNING;
    } else if (this.breaking) {
      return this.STATUS_BREAKING;
    }
    return this.STATUS_OFF;
  }

  get active () {
    return this.startedAt !== 0;
  }

  get running () {
    return this.active && this._running;
  }

  get breaking () {
    return this.active && this._breaking;
  }

  get remaining () {
    const elapsed = Date.now() - this.startedAt;
    const remaining = this.duration - elapsed;
    return remaining >= 0 ? remaining : 0;
  }

  get progress () {
    return 1 - (this.remaining / this.duration);
  }

  constructor (settings) {
    this.settings = settings;

    this.tmNotify = 0;
    this.tmTick = 0;
    this.duration = 0;
    this.startedAt = 0;
    this._running = false;
    this._breaking = false;
    this.renderedProgress = -1;
  }

  start () {
    if (this.active) {
      return;
    }

    this.stop();
    this.startRunning();
    this.startTicking();
  }

  stop () {
    if (!this.active) {
      return;
    }

    if (this._running) {
      this.stopRunning();
    } else {
      this.stopBreaking();
    }

    this.stopTicking();

    this.emitTick();
    this.emitStatusChange();
  }

  startRunning () {
    this._running = true;
    this.startedAt = Date.now();
    this.duration = this.settings.runningDuration;
    this.tmNotify = setTimeout(() => {
      this.stopRunning();
      this.startBreaking();
    }, this.settings.runningDuration);

    this.emitStatusChange();
  }

  stopRunning () {
    this._running = false;
    clearTimeout(this.tmNotify);
    this.startedAt = 0;
    this.duration = 0;
  }

  startBreaking () {
    this._breaking = true;
    this.startedAt = Date.now();
    this.duration = this.settings.breakingDuration;
    this.tmNotify = setTimeout(() => {
      this.stopBreaking();
      this.startRunning();
    }, this.settings.breakingDuration);

    this.emitStatusChange();
  }

  stopBreaking () {
    this._breaking = false;
    clearTimeout(this.tmNotify);
    this.startedAt = 0;
    this.duration = 0;
  }

  startTicking () {
    this.emitTick();
    this.tmTick = setTimeout(() => {
      this.startTicking();
    }, 100);
  }

  stopTicking () {
    clearTimeout(this.tmTick);
  }

  async emitTick () {
    if (typeof this.onTick === 'function') {
      this.onTick(this);
    }
  }

  emitStatusChange () {
    if (typeof this.onStatusChange === 'function') {
      this.onStatusChange(this);
    }
  }
}

PomodoroTimer.prototype.STATUS_OFF = 1;
PomodoroTimer.prototype.STATUS_RUNNING = 2;
PomodoroTimer.prototype.STATUS_BREAKING = 3;
