import Store from 'mobx-localforage-store';
import ority from 'ority';

export default ({
  version = (require('app/../../../package.json').version || '0.0.0') + '-' +
  '912111111111111111111'
} = {}) => class BaseStore extends Store {
  constructor(...args) {
    const { namespace, initial, opts } = ority(args, [{
      namespace: 'string',
      initial: 'object|array',
      opts: 'object',
    }, {
      initial: 'object|array',
      opts: 'object',
    }, {
      namespace: 'string',
      initial: 'object|array',
    }, {
      initial: 'object|array',
    }]);

    if (namespace) {
      super(`app/${version}/${namespace}`, initial, { autosave: true, ...(opts || {}) });
    } else {
      super(initial);
    }
  }

};
