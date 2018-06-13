// eslint-disable-next-line no-unused-vars
class ScheduleChart {
  constructor ({ el }) {
    this.ctx = el.getContext('2d');
    const { width, height } = el;
    this.settings = {
      x0: width / 2,
      y0: height / 2,
      radius: Math.min(width, height) / 2,
      colors: {
        runningFore: 'tomato',
        breakingFore: 'teal',
        progress: 'khaki',
      },
    };
  }

  /**
   * @param {object} status
   * @param {number} status.runningDuration
   * @param {number} status.breakingDuration
   * @param {boolean} status.active
   * @param {boolean} status.running
   * @param {number} status.elapsed
   * @param {number} status.duration
   */
  render (status) {
    const { ctx } = this;
    const {
      x0,
      y0,
      radius,
      colors,
    } = this.settings;
    let {
      runningDuration,
      breakingDuration,
    } = status;
    const {
      active,
      running,
      elapsed,
    } = status;

    if (active) {
      if (running) {
        runningDuration = status.duration;
      } else {
        breakingDuration = status.duration;
      }
    }

    const wholeDuration = runningDuration + breakingDuration;
    const wholeElapsed = running ? elapsed : runningDuration + elapsed;
    const progress = wholeElapsed / wholeDuration;
    const innerRadius = radius * 0.8;
    const allAngle = 2 * Math.PI;
    const startAngle = allAngle * (-1 / 4);
    const runningAngle = startAngle + (allAngle * (runningDuration / wholeDuration));
    const progressAngle = startAngle + (allAngle * progress);
    const { width, height } = ctx.canvas;

    this.drawChart({
      active,
      colors,
      ctx,
      height,
      innerRadius,
      progressAngle,
      radius,
      runningAngle,
      startAngle,
      width,
      x0,
      y0,
    });
  }

  drawChart (params) {
    const {
      active,
      colors,
      ctx,
      height,
      innerRadius,
      progressAngle,
      radius,
      runningAngle,
      startAngle,
      width,
      x0,
      y0,
    } = params;

    ctx.clearRect(0, 0, width, height);

    // running
    ctx.beginPath();
    ctx.fillStyle = colors.runningFore;
    ctx.arc(x0, y0, radius, startAngle, runningAngle, false);
    ctx.arc(x0, y0, innerRadius, runningAngle, startAngle, true);
    ctx.fill();

    // breaking
    ctx.beginPath();
    ctx.fillStyle = colors.breakingFore;
    ctx.arc(x0, y0, radius, runningAngle, startAngle, false);
    ctx.arc(x0, y0, innerRadius, startAngle, runningAngle, true);
    ctx.fill();

    // progress
    if (active) {
      ctx.beginPath();
      ctx.fillStyle = colors.progress;
      const progressOuterRadius = radius * 0.95;
      const progressInnerRadius = innerRadius * 1.05;
      ctx.arc(x0, y0, progressOuterRadius, startAngle, progressAngle, false);
      ctx.arc(x0, y0, progressInnerRadius, progressAngle, startAngle, true);
      ctx.fill();
    }
  }
}
