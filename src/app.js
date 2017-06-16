import 'isomorphic-fetch';
import Preact, {Component} from 'preact';
import FontLoader from './FontLoader';
import CollectionSelector from './CollectionSelector';
import VariationSelector from './VariationSelector';
import Preview from './Preview';
import qs from 'querystring';

const query = qs.parse(window.location.search.slice(1));

const App = () => (
  <div className="app">
    <FontLoader url={query.url || "AdobeVFPrototype.otf"}>
      <CollectionSelector>
        <VariationSelector>
          <Preview />
        </VariationSelector>
      </CollectionSelector>
    </FontLoader>
    <footer>Built with <a href="https://github.com/devongovett/fontkit">fontkit</a></footer>
  </div>
);

Preact.render(<App />, document.body);
