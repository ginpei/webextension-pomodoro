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
        bg: 'tomato',
        fg: 'green',
      },
    };
  }

  render () {
    const { ctx } = this;
    const { width, height } = ctx.canvas;

    const x = width / 2;
    const y = height / 2;
    const radius = Math.min(x, y);
    const allAngle = 2 * Math.PI;
    const startAngle = allAngle * (-1 / 4);
    const progressAngle = startAngle + (allAngle * (1 - this.progress));

    ctx.beginPath();
    ctx.fillStyle = this.settings.colors.bg;
    ctx.arc(x, y, radius, startAngle, allAngle);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = this.settings.colors.fg;
    ctx.arc(x, y, radius, startAngle, progressAngle);
    ctx.lineTo(x, y);
    ctx.fill();
  }

  getImageData () {
    const { width, height } = this.ctx.canvas;
    return this.ctx.getImageData(0, 0, width, height);
  }
}
