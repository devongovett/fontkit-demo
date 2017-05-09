import autobind from 'autobind-decorator';
import Preact, {Component} from 'preact';
import PreviewCanvas from './PreviewCanvas';

@autobind
export default class Preview extends Component {
  state = this.getNextState(this.props);

  componentWillReceiveProps(props) {
    if (props.font.postscriptName !== this.props.font.postscriptName) {
      this.setState(this.getNextState(props));
    }
  }

  getNextState(props) {
    return {
      text: props.font.getName('sampleText') || 'Hello World',
      fontSize: this.props.fontSize || 50
    };
  }

  onTextChange(e) {
    this.setState({text: e.target.value});
  }

  onFontSizeChange(e) {
    this.setState({fontSize: e.target.value});
  }

  render() {
    return (
      <div className="preview">
        <PreviewCanvas text={this.state.text} font={this.props.font} fontSize={this.state.fontSize} />
        <input type="text" value={this.state.text} onInput={this.onTextChange} />
        <label>Size: </label><input type="range" min={0} max={100} value={this.state.fontSize} onInput={this.onFontSizeChange} />
      </div>
    );
  }
}
