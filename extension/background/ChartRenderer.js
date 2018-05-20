// eslint-disable-next-line no-unused-vars
class ChartRenderer {
  constructor ({ el }) {
    if (!el || el.tagName !== 'CANVAS') {
      throw new Error('Canvas element must be given.');
    }

    this.elCanvas = el;
    this.ctx = this.elCanvas.getContext('2d');
    this.progress = 0;
    this.settings = {
      colors: {
        runningFore: 'tomato',
        runningBack: 'khaki',
        breakingFore: 'teal',
        breakingBack: 'khaki',
      },
    };
  }

  render (status = {}) {
    const { ctx } = this;
    const { colors } = this.settings;
    const { width, height } = ctx.canvas;
    const { running } = status;

    const x = width / 2;
    const y = height / 2;
    const outerRadius = Math.min(x, y);
    const innerRadius = outerRadius * 0.4;
    const allAngle = 2 * Math.PI;
    const startAngle = allAngle * (-1 / 4);
    const progressAngle = startAngle + (allAngle * (1 - this.progress));

    ctx.beginPath();
    ctx.fillStyle = running ? colors.runningBack : colors.breakingBack;
    ctx.arc(x, y, outerRadius, startAngle, allAngle, false);
    ctx.arc(x, y, innerRadius, allAngle, startAngle, true);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = running ? colors.runningFore : colors.breakingFore;
    ctx.arc(x, y, outerRadius, startAngle, progressAngle, false);
    ctx.arc(x, y, innerRadius, progressAngle, startAngle, true);
    ctx.lineTo(x, y);
    ctx.fill();
  }

  getImageData () {
    const { width, height } = this.ctx.canvas;
    return this.ctx.getImageData(0, 0, width, height);
  }
}
