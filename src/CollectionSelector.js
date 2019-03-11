import autobind from 'autobind-decorator';
import {Component, cloneElement, h} from 'preact';

@autobind
export default class CollectionSelector extends Component {
  state = {
    font: this.props.font.fonts ? this.props.font.fonts[0] : this.props.font
  }

  componentWillReceiveProps(props) {
    if (props.font !== this.props.font) {
      this.setState({
        font: props.font.fonts ? props.font.fonts[0] : props.font
      });
    }
  }

  onChange(e) {
    this.setState({
      font: this.props.font.fonts[e.target.value]
    });
  }

  render() {
    let fonts = this.props.font.fonts;

    return (
      <div className="collection-selector">
        {Array.isArray(fonts) &&
          <select onChange={this.onChange}>
            {fonts.map((f, i) =>
              <option value={i}>{f.fullName}</option>
            )}
          </select>
        }
        {this.props.children.map(c => cloneElement(c, this.state))}
      </div>
    );
  }
}
