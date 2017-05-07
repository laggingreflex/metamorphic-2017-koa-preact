/*
  start-runner: Highly composable and modular Nodejs tasks runner for the new functional JS era
  https://github.com/start-runner/start

  See README.MD ## Task scripts

*/
/* eslint-disable import/max-dependencies */
import 'require-up/register';
import Start from 'start';
import Reporter from 'start-pretty-reporter';
import env from 'start-env';
import getFiles from 'start-files';
import concurrent from 'start-concurrent';
import cleanStart from 'start-clean';
import readFile from 'start-read';
import babel from 'start-babel';
import write from 'start-write';
import copy from 'start-copy';
import watch from 'start-watch-debounce';
import webpack from 'start-webpack';
import webpackDevServer from 'start-webpack-dev-server-hot';
import webpackOnBuild from 'on-build-webpack';
import merge from 'webpack-merge';
import mochista from 'start-mochista';
import createIndexStart from 'start-create-index';
import spawn from 'start-spawn';
import _ from 'lodash';
import mainConfig from '../config';
// import eslint from 'start-eslint';

const start = Start(Reporter());
// const start = Start((...msg) => console.log(`[${moment().format('HH:mm:ss')}]`, ...msg));

const defaultBabelOpts = {
  sourceMaps: true,
  retainLines: true,
  // compact: true,
};

const defaultMochistaOpts = {
  timeout: 12000,
  // checkLeaks: true,
  all: true,
  instrument: false,
  compilers: ['js:babel-register'],
  require: [
    'babel-polyfill',
    'source-map-support/register',
    // 'require-no-realpath',
    'require-up/register',
    // 'ignore-styles',
    'test/index.js',
  ],
  // sourceFiles: [
  //   'src/**/*.js'
  // ],
  testFiles: [
    'src/**/*.test.js',
    'src/**/test/*.js',
    'src/**/test.js',
    'test/**/*.js',
  ],
  // verbose: 3,
  debug: true,
  cacheDir: 'coverage/.cache',
  reporter: 'test/reporter.js',
  coverageReporter: [
    'lcov',
    // 'text',
  ]
};

switch (true) {
case mainConfig._.includes('unit'):
  defaultMochistaOpts.testFiles = [
    'src/**/*.test.js',
    'src/**/test/*.js',
    'src/**/test.js',
  ];
  break;
case mainConfig._.includes('e2e'):
  defaultMochistaOpts.testFiles = [
    'test/e2e/**/*.js',
  ];
  break;
case mainConfig._.includes('client'):
  defaultMochistaOpts.testFiles = [
    'src/client/**/*.test.js',
    'src/client/**/test/*.js',
    'src/client/**/test.js',
    'test/client/**/*.js',
  ];
  break;
case mainConfig._.includes('server'):
  defaultMochistaOpts.testFiles = [
    'src/server/**/*.test.js',
    'src/server/**/test/*.js',
    'src/server/**/test.js',
    'test/server/**/*.js',
  ];
  break;
}

const getDefaultWebpackConfig = (opts = {}) => merge(require('../webpack.config.babel').default, opts);
const defaultDevServerOptions = {
  historyApiFallback: true,
  port: mainConfig.clientPort || mainConfig.clientPort,
  // host: '0.0.0.0',
};

const prodEnv = () => start(env('NODE_ENV', 'production'));
const devEnv = () => start(env('NODE_ENV', 'development'));
const testEnv = () => start(env('NODE_ENV', 'test'));

const node = (f, opts = {}) => spawn('node '
  + '-r babel-polyfill '
  + '-r source-map-support/register '
  + '-r require-up/register '
  + f, { forever: true, ...opts }
);

export const cleanBase = (files = 'dist/*') => start(getFiles(files), cleanStart());
export const cleanClient = () => cleanBase('dist/client/*');
export const cleanServer = () => cleanBase('dist/server/*');
export const cleanCoverage = () => cleanBase('coverage/*');
export const clean = () => concurrent(cleanServer, cleanClient, cleanCoverage);

export const createIndexBase = (dirs = ['./src']) => start(createIndexStart(dirs, {
  banner: '/* eslint-disable */',
  ignoreUnsafe: true,
  recursive: true,
}));
export const createIndexServer = () => createIndexBase(['./src/server']);
export const createIndexClient = () => createIndexBase(['./src/client']);
export const createIndexTest = () => createIndexBase(['./test']);
export const createIndex = () => start(concurrent(createIndexServer, createIndexClient, createIndexTest));

export const buildServer = () => start(
  prodEnv,
  cleanServer,
  createIndexServer,
  getFiles('src/server/**/*.js'),
  readFile(),
  babel(defaultBabelOpts),
  write('dist'),
);

export const buildServerDev = (postBuildTask = () => start()) => start(
  devEnv,
  cleanServer,
  watch('src/server/**/*.js', ['add', 'change', 'unlink'], {
    sleep: true,
  })(file => start(
    createIndexServer,
    () => start(
      getFiles(file),
      readFile(),
      babel(defaultBabelOpts),
      write('dist/'),
    ),
    postBuildTask,
  ))
);

export const buildClient = () => start(
  prodEnv,
  cleanClient,
  createIndexClient,
  concurrent(
    () => start(webpack(getDefaultWebpackConfig())),
    () => start(
      // getFiles('src/client/server/**/*.js'),
      getFiles('src/client/server.js'),
      readFile(),
      babel(defaultBabelOpts),
      write('dist'),
    ),
    () => start(
      getFiles('src/client/favicon.ico'),
      copy('dist'),
    ),
  ),
);

export const buildClientDev = (postBuildTask = () => start()) => start(
  devEnv,
  // prodEnv,
  cleanClient,
  createIndexClient,
  concurrent(
    () => start(webpack(getDefaultWebpackConfig({
      watch: true,
      plugins: [new webpackOnBuild(postBuildTask)],
    }))),
    watch('src/client/server.js', ['add', 'change', 'unlink'], {})(file => start(
      () => start(
        getFiles(file),
        readFile(),
        babel(defaultBabelOpts),
        write('dist'),
        postBuildTask,
      ),
    ))
  )
);

export const runClientDev = () => start(
  devEnv,
  createIndexClient,
  webpackDevServer(getDefaultWebpackConfig(), defaultDevServerOptions, defaultDevServerOptions)
);

export const build = () => start(concurrent(buildClient, buildServer));
export const buildDev = () => start(concurrent(buildClientDev, buildServerDev));

export const test = (opts = {}) => start(
  testEnv,
  cleanCoverage,
  createIndexTest,
  mochista({ ...defaultMochistaOpts, ...opts }),
);

export const testDev = (opts = {}) => test({ watch: true, bail: true, ...opts });

const runServerTask = node('./dist/server');
const runClientTask = node('./dist/client/server');

export const runServer = () => start(prodEnv, runServerTask);
export const buildRunServer = () => start(buildServer, runServer);

export const runServerDev = () => buildServerDev(() => {
  start(runServerTask);
  return Promise.resolve();
});

export const runClient = () => start(prodEnv, runClientTask);

export const buildRunClient = () => start(buildClient, runClient);
export const buildRunClientDev = () => start(() => buildClientDev(runClient));

export const run = () => start(concurrent(runClient, runServer));

export const buildRun = () => start(concurrent(buildRunServer, buildRunClient));

export const runDev = () => start(concurrent(runServerDev, runClientDev));
export const buildRunDev = () => start(concurrent(runServerDev, buildRunClientDev));

export const dev = () => start(concurrent(
  // buildDev,
  runDev,
  () => testDev({ timeout: 60000 })
));

export const createUser = () => start(() => {
  try {
    require('babel-polyfill');
    return require('./createUser').default();
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const crawler = () => start(() => {
  try {
    require('babel-polyfill');
    return require('./crawler').default();
  } catch (error) {
    console.error(error);
    throw error;
  }
});

const crawlerStartTask = spawn('node ./dist/server/run', { forever: true });
export const crawlerStart = () => start(() => {
  try {
    require('babel-polyfill');
    return require('./crawler').default();
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const config = () => start(() => {
  try {
    // require('babel-polyfill');
    return mainConfig
      .prompt({ savable: true })
      .then(() => mainConfig.save())
      .catch(console.error);
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Create short aliases (like 'rs' for 'runServer')
Object.assign(exports,
  Object.entries(
    require(__filename)).reduce(
    (exports, [name, task]) => Object.assign(exports, {
      [
        _.startCase(name)
        .split(/ /g)
        .map(c => c.charAt(0))
        .join('')
        .toLowerCase()
      ]: task
    }), {}));
