import Koa from 'koa';
import http from 'httpolyglot';
import body from 'koa-bodyparser';
import convert from 'koa-convert';
import session from 'koa-generic-session';
import sessionStore from 'koa-redis';
import ratelimit from 'koa-ratelimit';
import shortid from 'shortid';
import ioredis from 'ioredis';
import jwt from 'koa-jwt';
import cors from 'kcors';
import proximify from 'proximify';
import config from '../../config';
import { server as log } from './utils/log';
import * as routes from './routes';
import * as socket from './socket';
import { oauth } from './auth';

async function createServer({
  silent = config.silent,
  port = config.serverPort || config.port === config.clientPort && parseInt(config.port, 10) + 1 || config.port,
  ssl = {},
} = {}) {
  const app = proximify(new Koa(), { applyOnData: true });

  app.keys = ['keys', 'keyKeys'];

  app.use(log.koa);

  app.use(convert(session({
    store: new sessionStore({ url: config.redisUrl })
  })));

  app.use(ratelimit({
    db: new ioredis(config.redisUrl),
    id: ctx => ctx.session.id || (ctx.session.id = ctx.ip + '_' + shortid.generate()),
    duration: 10000,
    max: 10
  }));

  app.use(body());

  app.use(cors(config.clientHost));

  app.use(oauth());

  app.use(jwt({
    secret: config.secret,
    passthrough: true,
  }));

  app.use(async(ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.log.error(err);
      ctx.status = 500;
      ctx.body = err.message;
      // if (config.isDev) {
      //   ctx.body = err.stack;
      // } else {
      //   ctx.body = err.message;
      // }
    }
  });

  Object.entries(routes).forEach(([, route]) => app.use(route()));

  app.server = http.createServer(ssl, app.callback());

  socket.attach(app);

  await app.server.listenAsync(port);

  if (!silent) {
    log.info('Listening on', app.server.address().port);
  }

  if (ssl.port) {
    await app.server.listenAsync(ssl.port);
    if (!silent) {
      log.info('Listening on', ssl.port);
    }
  }

  return app;
}

export default createServer;

if (!module.parent) {
  const { connect } = require('./db/mongo/utils');

  const handleErr = (...e) => {
    e.forEach(console.error);
    process.exit(1);
  };
  process.on('unhandledRejection', handleErr);
  process.on('uncaughtException', handleErr);

  connect().then(() => createServer()).catch(handleErr);
}
