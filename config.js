/* eslint-disable import/unambiguous, import/no-commonjs  */

try { require('dotenv').config() } catch (noop) {};

const Config = require('configucius').default;
const pkgJson = require('./package');

const isDev = Boolean((process.env.NODE_ENV || '').match(/dev|test/i));

const dbName = pkgJson.name + (process.env.SIMPLE_DB_NAME ? '' : isDev ? ('_' + process.env.NODE_ENV) : '');

const config = module.exports = new Config({
  configFile: './config.json', // custom .gitignored config
  options: {
    clientPort: {
      alias: ['port'],
      type: 'number',
      default: 8080,
      save: true,
    },
    clientHost: {
      type: 'string',
      save: true,
    },
    serverPort: {
      alias: ['apiServerPort', 'apiPort'],
      type: 'number',
      // default: clientPort+1,
      save: true,
    },
    apiHost: {
      type: 'string',
      save: true,
    },
    nodeEnv: {
      type: 'string',
    },
    isDev: {
      type: 'boolean',
    },
    dbName: {
      type: 'string',
      default: dbName,
      save: true,
    },
    mongodbUrl: {
      alias: ['mongodburl', 'mongoUrl', 'mongourl'],
      type: 'string',
      save: true,
    },
    redisUrl: {
      alias: ['redisurl'],
      type: 'string',
      save: true,
    },
    secret: {
      type: 'string',
      default: 'Secret cats',
    },
    googleOauthKey: {
      type: 'string',
      save: true,
    },
    googleOauthSecret: {
      type: 'string',
      save: true,
    },
    facebookOauthKey: {
      type: 'string',
      save: true,
    },
    facebookOauthSecret: {
      type: 'string',
      save: true,
    },
  }
});

config.serverPort = config.serverPort || (
  config.clientPort + 1
);
config.apiHost = config.apiHost || (
  'localhost:' + config.serverPort
);
config.clientHost = config.clientHost || (
  'localhost:' + config.clientPort
);
config.mongodbUrl = config.mongodbUrl || (
  'mongodb://localhost/' + config.dbName
);
config.redisUrl = config.redisUrl || (
  'redis://localhost/' + (config.redisDb || 0)
);
config.isDev = config.isDev || isDev;
