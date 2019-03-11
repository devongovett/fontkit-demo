import autobind from 'autobind-decorator';
import {Component, cloneElement, h} from 'preact';
import isEqual from 'lodash/isEqual';
import mapValues from 'lodash/mapValues';
import findKey from 'lodash/findKey';

@autobind
export default class VariationSelector extends Component {
  componentWillMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(props) {
    let defaultSettings = mapValues(props.font.variationAxes, 'default');
    let defaultVariationName = findKey(props.font.namedVariations, n => isEqual(props.font.namedVariations[n], defaultSettings))
      || props.font.subfamilyName
      || 'Custom';

    let font = props.font;
    if (Object.keys(defaultSettings).length > 0) {
      font = font.getVariation(defaultSettings);
    }

    this.setState({
      font: font,
      variationName: defaultVariationName,
      variationSettings: defaultSettings
    });
  }

  onChange(e) {
    this.setState({
      font: this.props.font.getVariation(e.target.value),
      variationName: e.target.value,
      variationSettings: this.props.font.namedVariations[e.target.value]
    });
  }

  onAxisChange(tag, e) {
    let settings = Object.assign({}, this.state.variationSettings, {
      [tag]: e.target.value
    });

    this.setState({
      font: this.props.font.getVariation(settings),
      variationName: null,
      variationSettings: settings
    });
  }

  render() {
    let axes = this.props.font.variationAxes;

    return (
      <div className="variation-selector">
        {Object.keys(this.props.font.namedVariations).length > 0 &&
          <select onChange={this.onChange}>
            {Object.keys(this.props.font.namedVariations).map(name =>
              <option selected={name === this.state.variationName}>{name}</option>
            )}
            {!this.props.font.namedVariations[this.state.variationName] && <option selected disabled>{this.state.variationName || 'Custom'}</option>}
          </select>
        }
        {Object.keys(axes).map(tag =>
          <div className="axis">
            <label>{axes[tag].name}:</label>
            <input
              type="range"
              min={axes[tag].min}
              max={axes[tag].max}
              step={0.001}
              value={this.state.variationSettings[tag]}
              onInput={this.onAxisChange.bind(this, tag)} />
          </div>
        )}
        {this.props.children.map(c => cloneElement(c, {font: this.state.font}))}
      </div>
    );
  }
}
