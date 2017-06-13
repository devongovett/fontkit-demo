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
      fontSize: this.props.fontSize || 50,
      features: {},
      script: null,
      language: null,
      direction: null
    };
  }

  onTextChange(e) {
    this.setState({text: e.target.value});
  }

  onFontSizeChange(e) {
    this.setState({fontSize: e.target.value});
  }

  onScriptChange(e) {
    this.setState({
      script: e.target.value,
      language: null,
      features: {}
    });
  }

  onLangChange(e) {
    this.setState({
      language: e.target.value,
      features: {}
    });
  }

  onDirChange(e) {
    this.setState({
      direction: e.target.value
    });
  }

  onFeatureChange(feature, e) {
    this.setState({
      features: {...this.state.features, [feature]: e.target.checked}
    });
  }

  render() {
    let font = this.props.font;
    let run = font.layout(this.state.text, this.state.features, this.state.script, this.state.language, this.state.direction);
    let scripts = (font.GSUB ? font.GSUB.scriptList : []).concat(font.GPOS ? font.GPOS.scriptList : []);
    let scriptTags = Array.from(new Set(scripts.map(s => s.tag)));
    let selectedScript = scripts.find(s => s.tag === run.script);
    let languages = selectedScript ? selectedScript.script.langSysRecords : [];
    let directions = ["ltr", "rtl"];

    return (
      <div className="preview">
        <PreviewCanvas run={run} text={this.state.text} font={this.props.font} fontSize={this.state.fontSize} features={this.state.features} />
        <div className="text-input">
          <input type="text" value={this.state.text} onInput={this.onTextChange} />
        </div>
        <div className="font-size">
          <label>Size:</label>
          <input type="range" min={0} max={100} value={this.state.fontSize} onInput={this.onFontSizeChange} />
        </div>

        <div className="feature-selector">
          <label>Script:</label>
          <select onChange={this.onScriptChange}>
            {scriptTags.map(script =>
              <option selected={run.script === script}>{script}</option>
            )}
          </select>

          <label>Language:</label>
          <select onChange={this.onLangChange}>
            <option>Default</option>
            {languages.map(lang =>
              <option value={lang.tag} selected={run.language === lang.tag}>{lang.tag}</option>
            )}
          </select>

          <label>Direction:</label>
          <select onChange={this.onDirChange}>
            <option value=''>Default</option>
            {directions.map(direction =>
              <option selected={run.direction === direction}>{direction}</option>
            )}
          </select>

          <div className="features">
            {this.props.font.getAvailableFeatures(run.script, run.language).map(feat =>
              <label><input type="checkbox" checked={run.features[feat]} onChange={this.onFeatureChange.bind(this, feat)} /> {feat}</label>
            )}
          </div>
        </div>
      </div>
    );
  }
}
