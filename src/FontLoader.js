import autobind from 'autobind-decorator';
import {Component, cloneElement, h} from 'preact';
import fontkit from 'fontkit';
import blobToBuffer from 'blob-to-buffer';

@autobind
export default class FontLoader extends Component {
  state = {
    font: null
  }

  componentWillMount() {
    if (this.props.url) {
      this.loadURL(this.props.url);
    }
  }

  componentWillReceiveProps(props) {
    if (this.props.url && props.url !== this.props.url) {
      this.loadURL(props.url);
    }
  }

  onChange(e) {
    let file = e.target.files && e.target.files[0];
    if (file) {
      this.loadBlob(file);
    }
  }

  loadURL(url) {
    fetch(this.props.url)
      .then(res => res.blob())
      .then(this.loadBlob, console.error);
  }

  loadBlob(blob) {
    blobToBuffer(blob, (err, buffer) => {
      if (err) {
        throw err;
      }

      this.setState({
        font: fontkit.create(buffer)
      });
    });
  }

  render() {
    return (
      <div className="font-loader">
        <input type="file" onChange={this.onChange} />
        {this.state.font && this.props.children.map(c => cloneElement(c, {font: this.state.font}))}
      </div>
    );
  }
}
