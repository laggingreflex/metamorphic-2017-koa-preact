import Router from 'koa-router';
import {
  User as getUserModel,
  Taxonomy as getTaxonomyModel,
} from '.../db/mongo/models';

export default ({
  router = new Router(),
  User = getUserModel(),
  Taxonomy = getTaxonomyModel(),
} = {}) => {
  // todo: check if user is admin

  router.get('/taxonomy', async(ctx) => {
    ctx.body = {
      taxonomy: await Taxonomy.getAll(),
      ver: await Taxonomy.getVer(),
    };
  });

  router.get('/taxonomy/ver', async(ctx) => {
    ctx.body = {
      ver: await Taxonomy.getVer(),
    };
  });

  router.post('/taxonomy/update', async(ctx) => {
    ctx.body = {
      result: await Taxonomy.updateAll(ctx.request.body)
    };
  });

  router.post('/taxonomy/upsert', async(ctx) => {
    ctx.body = {
      result: await Taxonomy.addOrUpdate(ctx.request.body)
    };
  });

  // router.post('/taxonomy/wiki-vital-articles', async(ctx) => {
  //   ctx.body = { data: await wikiVital() };
  // });

  // router.post('/taxonomy/create', async(ctx) => {
  //   const [newData, oldData] = await Promise.all([wikiVital(), Wiki.getAll()]);
  //   console.log('await wikiVital():', );
  // });
  return router.routes();
};
