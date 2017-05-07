import { Component } from 'preact';
import { autobind } from 'core-decorators';
import hs from 'preact-hyperstyler';
import md from 'preact-markdown';
import style from './style.styl';

const h = hs(style);

export default ({
  state,
  Error = require('app/components/Error').default(),
  Success = require('app/components/Success').default(),
  fetch = require('app/api').default(),
  // appLoad = require('app/../load/taxonomy').default(),
  form = require('app/components/utils/form'),
  Store = require('app/store/utils/Store').default(),
} = {}) => @Store.observe @autobind
class Load extends Component {
  static menuOrder = 3

  state = state || new Store([
    'loading',
    'error',
    'success',
  ]);

  render({
    parents,
    title,
    fetch,
    resolveHref = h => h,
  } = {}, {
    loading,
    error,
    success,
  } = {}) {
    return form.form(this.loadWiki, [
      h('h1', 'Wikipedia Vital Articles'),
      Error(error),
      Success(success),
      success ? h('p', {}, [md(`[Edit](${resolveHref('../edit')})`)]) : null,
      h('p', [
        md('Load [Wikipedia Vital Articles](https://en.wikipedia.org/wiki/Wikipedia:Vital_articles) as **Subject** Taxonomy'),
        md('This will ***replace*** current **Subject** Taxonomy entirely! Any documents referencing old subject taxonomy will lose their mappings. Use it only for the first time when initializing the subject taxonomy.'),
        md(`You'll still need to [save](${resolveHref('../save-all')}) the changes to server, and may choose to [edit](${resolveHref('../edit')}) or even [reset](${resolveHref('../reset')}).`),
      ]),
      form.button('Load Wiki', { loading }),
    ]);
  }

  async _fetch(path) {
    this.state.loading = true;
    this.state.error = null;
    this.state.success = null;
    const { error, ...data } = await fetch(path);
    this.state.loading = false;

    if (error) {
      this.state.error = error;
      throw new Error(error);
    } else if (!data || !data.taxonomy) {
      this.state.error = 'Unknown data received';
      console.error(data);
      throw new Error(this.state.error);
    } else {
      this.state.success = 'Data Loaded. ';
      return data;
    }
  }

  async loadWiki() {
    console.log('this.props.taxonomy.taxonomy:', this.props.taxonomy.taxonomy);
    const { taxonomy: newTaxonomy } = await this._fetch('/wiki/vital-articles');
    this.state.success += Object.keys(newTaxonomy).length + ' entries loaded. ';
    // console.log(taxonomy);
    // console.log(newTaxonomy);
    const taxonomy = this.props.taxonomy.toJS().taxonomy || {};

    Object.entries(taxonomy).forEach(([i, t]) => {
      if (t.taxonomy === 'subject') {
        t.delete = true;
        dirty: true;
        // delete taxonomy[i];
      }
    });
    Object.entries(newTaxonomy).forEach(([i, t]) => {
      taxonomy[i] = {
        ...t,
        delete: false,
        dirty: true,
      };
    });

    await this.props.taxonomy.loadTaxonomy({ taxonomy, ver: -1 }, this.state);
  }
};
