import Purest from 'purest';
import request from 'request';
import config from '@purest/providers';

// https://simov.gitbooks.io/purest/content/docs/04-complete-example.html
// https://github.com/simov/purest/blob/2.x/test/request/get.js

export const purest = Purest({ request, promise: Promise });

export const getProvider = provider => purest({ provider, config });

export const Providers = new Proxy({}, {
  get(target, provider) {
    target[provider] = target[provider] || getProvider(provider);
    return target[provider];
  }
});


