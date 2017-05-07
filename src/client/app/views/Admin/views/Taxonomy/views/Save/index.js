import { Component } from 'preact';
import hs from 'preact-hyperstyler';
import md from 'preact-markdown';
import style from './style.styl';

const h = hs(style);

export default ({
  Error = require('app/components/Error').default(),
  Success = require('app/components/Success').default(),
  form = require('app/components/utils/form'),
  Store = require('app/store/utils/Store').default(),
  state,
} = {}) => @Store.observe
class SaveAll extends Component {
  static menuOrder = 4

  state = state || new Store([
    'error',
    'success',
    'loading',
  ]);

  render({ taxonomy, resolveHref } = {}, { error, success, loading, } = {}) {
    if (!taxonomy || !Object.keys(taxonomy.taxonomy).length) {
      return h.p([
        md('No taxonomies exist.'),
        md(`Please [add](${resolveHref('../add/')})`),
        md(`or [load](${resolveHref('../load')}) a taxonomy`),
      ]);
    }

    return h.div([
      Error(error),
      Success(success),
      form.form(::this.onsubmit, [
        h.p([md('This will update **all** taxonomies on the server.')]),
        h.p([md('Records that are removed may lose their mappings with any other existing records. (todo: figure out which data)')]),
        h.p([md('Are you sure?')]),
        form.button(error ? 'Retry?' : 'Save All', { loading }, '.is-warning')
      ]),
    ]);
  }

  async onsubmit() {
    await this.props.taxonomy.upsert(null, this.state);
    // await upsert(this.props.store.toJS().taxonomy, this.state);
  }
};
