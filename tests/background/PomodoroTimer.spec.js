/* globals Settings, PomodoroTimer */

describe('PomodoroTimer', () => {
  const { expect } = chai;

  const min = 1 * 60 * 1000; // 1 min

  let settings;
  let timer;

  beforeEach(() => {
    settings = new Settings();
    settings.runningDuration = 25 * min;
    settings.breakingDuration = 5 * min;
    timer = new PomodoroTimer(settings);
    timer.tickInterval = min;
  });

  describe('start()', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers(new Date());
      timer.onStatusChange = sinon.spy();
      timer.onTick = sinon.spy();
      timer.start();
    });

    afterEach(() => {
      timer.stop();
    });

    it('does not starts again while running', () => {
      const spy = sinon.spy(timer, 'startRunning');
      timer.start();
      expect(spy).to.have.been.callCount(0);
    });

    it('becomes active', () => {
      expect(timer.active).to.eql(true);
    });

    it('becomes running', () => {
      expect(timer.running).to.eql(true);
    });

    it('does not become breaking', () => {
      expect(timer.breaking).to.eql(false);
    });

    it('calls status change event handler', () => {
      const spy = timer.onStatusChange;
      expect(spy).to.have.been.callCount(1);
    });

    it('starts breaking later', () => {
      clock.tick(25 * min);
      expect(timer.running).to.eql(false);
      expect(timer.breaking).to.eql(true);
    });

    it('restarts running after breaking', () => {
      clock.tick(25 * min);
      clock.tick(5 * min);
      expect(timer.running).to.eql(true);
      expect(timer.breaking).to.eql(false);
    });

    it('calls tick event listener many times', () => {
      clock.tick(5 * min);
      const spy = timer.onTick;
      expect(spy).to.have.been.callCount(1 + 5);
    });
  });

  describe('stop()', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers(new Date());
      timer.onStatusChange = sinon.spy();
      timer.onTick = sinon.spy();

      timer.start();
      timer.onStatusChange.resetHistory();
      timer.onTick.resetHistory();

      timer.stop();
    });

    // afterEach(() => {
    //   timer.stop();
    // });

    it('does nothing if not active', () => {
      const spy = timer.onStatusChange;
      spy.resetHistory();
      timer.stop();

      expect(spy).to.have.been.callCount(0);
    });

    it('becomes inactive', () => {
      expect(timer.active).to.eql(false);
    });

    it('stops running if running', () => {
      timer.start();
      expect(timer.running).to.eql(true);
      timer.stop();

      expect(timer.running).to.eql(false);
    });

    it('stops breaking if breaking', () => {
      timer.start();
      clock.tick(25 * min);
      expect(timer.breaking).to.eql(true);
      timer.stop();

      expect(timer.breaking).to.eql(false);
    });

    it('calls the last tick event listener', () => {
      const spy = timer.onTick;
      expect(spy).to.have.been.callCount(1);
    });

    it('stops ticking', () => {
      const spy = timer.onTick;
      spy.resetHistory();
      clock.tick(5 * min);

      expect(spy).to.have.been.callCount(0);
    });

    it('calls status change event handler', () => {
      const spy = timer.onStatusChange;
      expect(spy).to.have.been.callCount(1);
    });
  });
});
