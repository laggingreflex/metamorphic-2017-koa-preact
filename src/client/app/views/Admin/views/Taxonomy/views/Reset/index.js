import { Component } from 'preact';
import hs from 'preact-hyperstyler';
import md from 'preact-markdown';
import { route } from 'preact-router';
import { getViewPath } from 'app/utils';
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
} = {}) => @Store.observe
class Reset extends Component {
  static menuOrder = 5

  state = state || new Store([
    'loading',
    'error',
    'success',
  ]);

  render({ taxonomy, resolveHref } = {}, { loading, error, success, } = {}) {
    return form.form(() => taxonomy.getLatest(this.state), [
      h.h1('Reset'),
      Error(error),
      Success(success),
      // success ? h('p', [md(`[edit](${resolveHref('../edit/')})`)]) : null,
      h.p([md('This will update **all** Taxonomy to current version from the server.')]),
      h.p([md('All unsaved changes will be lost.')]),
      h.p([md('Are you sure?')]),
      form.button('Reset', { loading })
    ]);
  }
};
