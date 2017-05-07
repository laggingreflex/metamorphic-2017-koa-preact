/* eslint-disable import/order, import/newline-after-import, import/first */

import chai from 'chai';

import sinon from 'sinon-chai';
chai.use(sinon);

import generator from 'chai-generator';
chai.use(generator);

import like from 'chai-like';
chai.use(like);

import promise from 'chai-as-promised';
chai.use(promise);

// import dom from 'chai-dom';
// chai.use(dom);

global.should = chai.should();
global.expect = chai.expect;

import assert from 'assert';
global.assert = assert;

import MockLocalStorage from 'mock-localstorage';
global.localStorage = new MockLocalStorage();
global.sessionStorage = new MockLocalStorage();

import path from 'path';
import { addPath } from 'app-module-path';
// to mimic webpack's {resolve: {modules: ['.../src/client']}}
addPath(path.join(__dirname, '../src/client'));

import ignore from 'require-ignore';

ignore.install('styl,css,md'.split(/,/g));

process.on('unhandledRejection', e => {
  throw e;
});
