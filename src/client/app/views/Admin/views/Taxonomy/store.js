import memoize from 'fast-memoize';
import Store from 'mobx-localforage-store';
import { version } from 'app/store';

export default memoize(({
  appStore = require('app/store/models/App').default(),
} = {}) => new Store(`admin/taxonomy/${version}/v1d`, {
  taxonomy: appStore.taxonomy,
}, {
  autosave: true,
}));
