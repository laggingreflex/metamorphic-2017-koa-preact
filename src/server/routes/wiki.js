import Router from 'koa-router';
import {
  vital as getWikiVitalCrawler
} from '.../crawler/wiki';

export default ({
  router = new Router(),
  wikiVital = getWikiVitalCrawler(),
} = {}) => {
  router.get('/wiki/vital-articles', async(ctx) => {
    ctx.body = {
      taxonomy: await wikiVital()
    };
  });

  // router.post('/wiki/topic/:topic', async(ctx) => {
  //   ctx.body = { summary: await getTopic(ctx.params.topic) };
  // });

  return router.routes();
};
