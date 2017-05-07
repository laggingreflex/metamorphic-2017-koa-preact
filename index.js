#!/usr/bin/env node

/* eslint-disable */

const config = require('./config');

if (config.editConfig || config.e) {
  config
    .prompt({ savable: true })
    .then(() => config.save())
    .catch(console.error);
} else if (config._.length) {
  require('babel-register');
  require('babel-polyfill');
  const tasks = require('./tasks');
  const task = tasks[config._[0]];
  switch (true) {
    case config._[0] === 'hash':
      require('./src/server/utils/hash')
        .hash(config._.slice(1).join(' '))
        .then(console.log).catch(console.error);
      break;
    case Object.keys(tasks).includes(task):
      task(...config._.slice(1))
      break;
    default:
      console.error('Unknown task:', ...config._);
      console.log('Possible tasks:', Object.keys(tasks).join(', '));
  }
} else {
  console.error('Need a task to run. Use --edit-config [or -e] to edit the config');
}
