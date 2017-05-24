import Preact, {Component} from 'preact';

export default class PreviewCanvas extends Component {
  static defaultProps = {
    width: 500,
    height: 100
  };

  state = {
    ratio: 1
  };

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
    this.setState({ratio: window.devicePixelRatio || 1});
  }

  componentDidUpdate() {
    this.draw(this.ctx);
  }

  draw(ctx) {
    let {font, run, fontSize, width, height} = this.props;

    ctx.save();
    ctx.scale(this.state.ratio, this.state.ratio);
    ctx.clearRect(0, 0, width, height);

    let scale = 1 / font.unitsPerEm * fontSize;
    let x = 0;
    let y = 0;

    ctx.translate(0, 80);
    ctx.scale(1, -1);

    run.glyphs.forEach((glyph, index) => {
      let pos = run.positions[index];
      ctx.save();
      ctx.translate((x + pos.xOffset) * scale, (y + pos.yOffset) * scale);
      ctx.beginPath();
      glyph.render(ctx, fontSize);
      ctx.restore();

      x += pos.xAdvance;
      y += pos.yAdvance;
    });

    ctx.restore();
  }

  render() {
    let {width, height} = this.props;
    return (
      <canvas
        width={width * this.state.ratio}
        height={height * this.state.ratio}
        style={{width, height}}
        ref={c => this.canvas = c} />
    );
  }
}
