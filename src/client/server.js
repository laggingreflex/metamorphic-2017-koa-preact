import path from 'path';
import Koa from 'koa';
import http from 'httpolyglot';
import convert from 'koa-convert';
import session from 'koa-generic-session';
import sessionStore from 'koa-redis';
import ratelimit from 'koa-ratelimit';
import shortid from 'shortid';
import ioredis from 'ioredis';
import proximify from 'proximify';
import koaStatic from 'koa-static';
import koaSSR from 'koa-ssr';
import { cacheToDisk } from 'koa-ssr/helpers';
import MockLocalStorage from 'mock-localstorage';
import {
  User as getUserModel,
  Taxonomy as getTaxonomyModel,
} from '../server/db/mongo/models';
import { client as log } from '../server/utils/log';
import config from '../../config';

const staticDir = p => path.join(__dirname, p || '.');

async function createClientServer({
  silent = config.silent,
  port = config.clientPort,
  ssl = {},
  User = getUserModel(),
  Taxonomy = getTaxonomyModel(),
} = {}) {
  const app = proximify(new Koa(), { applyOnData: true });

  app.keys = ['keys', 'keyKeys'];

  app.use(log.koa);

  app.use(koaStatic(staticDir(), {
    index: false,
  }));

  app.use(convert(session({
    store: new sessionStore({ url: config.redisUrl }),
  })));

  app.use(ratelimit({
    db: new ioredis(config.redisUrl),
    id: ctx => ctx.session.id || (ctx.session.id = ctx.ip + '_' + shortid.generate()),
    duration: 10000,
    max: 10
  }));

  app.use((ctx, next) => koaSSR(staticDir(), {
    console: { log: ctx.log.info, ...ctx.log },
    // timeout: 15000,
    jsdom: {
      created: (e, window) => {
        window.localStorage = new MockLocalStorage();
        window.sessionStorage = new MockLocalStorage();
        window.sessionLoaded = (async() => {
          const [taxonomy, ver] = await Promise.all([Taxonomy.getAll(), Taxonomy.getVer()])
          window.taxonomyStore = {
            taxonomy,
            ver,
            renderedOnServer: true,
          };
        })();
      },
    },
    cache: cacheToDisk({
      invalidatePrevious: true,
    }),

    // render: async(ctx, html, window, serialize) => {
    //   // console.log('ctx.state:', ctx.state);
    //   // console.log('ctx.session:', ctx.session);
    //   ctx.session.lastLoad = Date.now();
    //   ctx.body = html;
    // },
  })(ctx, next));

  app.server = http.createServer(ssl, app.callback());

  await app.server.listenAsync(port);

  if (!silent) {
    log.info('Listening on', port);
  }

  if (ssl.port) {
    await app.server.listenAsync(ssl.port);
    if (!silent) {
      log.info('Listening on', ssl.port);
    }
  }

  return app;
}

export default createClientServer;

if (!module.parent) {
  const { connect } = require('.../server/db/mongo/utils');

  const handleErr = (...e) => {
    e.forEach(console.error);
    process.exit(1);
  };
  process.on('unhandledRejection', handleErr);
  process.on('uncaughtException', handleErr);

  connect().then(() => createClientServer()).catch(handleErr);
}
