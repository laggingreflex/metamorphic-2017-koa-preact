import Path from 'path';
import Memoize from 'memoize-fs';

const memoize = Memoize({ cachePath: Path.join(__dirname, '../.cache') });

export default (target, opts) => {
  if (typeof target === 'function') {
    const memoized = memoize.fn(target, opts);
    return async(...args) => {
      try {
        const fn = await memoized;
        return fn.call(null, ...args);
      } catch (error) {
        console.error('Can\'t memoize.', error);
        return target.call(...args);
      }
    };
  } else {
    return new Proxy(target, {
      get(target, key) {
        if (typeof target[key] === 'function') {
          return target[key + '__memoized'] || (async(...args) => {
            const memoized = await memoize.fn(target[key], opts);
            target[key + '__memoized'] = memoized;
            return memoized.call(target, ...args);
          });
        }
      }
    });
  }
};
