/* globals Settings, ScheduleChart */

describe('ScheduleChart', () => {
  const { expect } = chai;

  const min = 1 * 60 * 1000; // 1 min

  let settings;
  let canvas;
  let chart;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', '100');
    canvas.setAttribute('height', '100');
    settings = new Settings();
    settings.runningDuration = 25 * min;
    settings.breakingDuration = 5 * min;
    chart = new ScheduleChart({ el: canvas });
    sinon.spy(chart, 'drawChart');
  });

  describe('render()', () => {
    beforeEach(() => {
      const status = {
        active: false,
        breakingDuration: 5 * min,
        duration: 0,
        elapsed: 0,
        running: false,
        runningDuration: 25 * min,
      };
      chart.render(status);
    });

    it('is called once (just in case)', () => {
      const spy = chart.drawChart;
      expect(spy).have.been.callCount(1);
    });

    it('is calculated correctly', () => {
      // lazy test :P

      expect(chart.drawChart).have.been.calledWith({
        active: false,
        colors: { breakingFore: 'teal', progress: 'khaki', runningFore: 'tomato' },
        ctx: canvas.getContext('2d'),
        height: 100,
        innerRadius: 40,
        progressAngle: 3.6651914291880923,
        radius: 50,
        runningAngle: 3.6651914291880923,
        startAngle: -1.5707963267948966,
        width: 100,
        x0: 50,
        y0: 50,
      });
    });
  });
});
