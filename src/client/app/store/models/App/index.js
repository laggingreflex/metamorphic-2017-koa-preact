import memoize from 'fast-memoize';

export default memoize(({
  Store = require('app/store/utils/Store').default(),
  profile = false,
  initial = window.appStore || { profile },
} = {}) => window.appStore || new class App extends Store {
  constructor(
    namespace = 'AppStore/v1',
  ) {
    super(namespace, initial);
  }
}());
