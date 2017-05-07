import Grant from 'grant-koa';
import mount from 'koa-mount';
import convert from 'koa-convert';
import merge from 'lodash.merge';
import * as providers from './providers';
import config from '../../../../config'

export const grantConfig = {
  server: {
    protocol: 'http',
    host: config.apiHost,
    callback: '/login/oauth/callback',
    transport: 'session',
    state: true
  },
  ...Object.entries(providers).reduce((config, [provider, { grantConfig }]) => ({ ...config, [provider]: grantConfig }), {})
};

export const grant = (config = {}) => convert(mount(new Grant(merge({}, grantConfig, config))));

export default grant;
