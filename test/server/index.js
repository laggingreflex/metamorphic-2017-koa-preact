// import AssertRequest from 'assert-request';
// import enableDestroy from 'server-destroy';
// import Browser from 'zombie';
// import { findAPortNotInUse } from 'portscanner';
// import io from 'socket.io-client';
// import proximify from 'proximify';
// import createServer from '.../src/server';

export default async() => {
  console.log('even?');
  const AssertRequest = require('assert-request');
  const enableDestroy = require('server-destroy');
  const Browser = require('zombie');
  const io = require('socket.io-client');
  const proximify = require('proximify');
  const { findAPortNotInUse } = require('portscanner');
  const createServer = require('.../src/server').default;

  const port = () => findAPortNotInUse(3000, 3010);

  const app = await createServer({ port, silent: true });
  const host = `http://localhost:${app.server.address().port}`;

  const server = app.server;
  enableDestroy(server);

  let request;
  const getRequest = () => request = request || AssertRequest(app);

  let clientSocket;
  const getClientSocket = () => {
    clientSocket = clientSocket || proximify(io(host));
    return clientSocket;
  };

  let browser;
  const getBrowser = () => {
    browser = browser || new Browser();
    browser.site = browser.site || host;
    return browser;
  };

  const destroy = () => {
    if (server.destroy) {
      server.destroy();
    }
    if (clientSocket) {
      clientSocket.destroy();
    }
    if (app.io) {
      app.io.removeAllListeners();
    }
    if (browser) {
      browser.destroy();
    }
  };

  return [new Proxy({
    app,
    destroy,
    getBrowser,
    getClientSocket,
    host,
    getRequest,
    request,
  }, {
    get(t, name) {
      switch (name) {
      case 'browser':
        return getBrowser();
      case 'clientSocket':
        return getClientSocket();
      case 'request':
        return getRequest();
      default:
        return t[name];
      }
    }
  })];
};
