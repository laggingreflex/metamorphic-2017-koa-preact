import Router from 'koa-router';

export default ({
  router = new Router(),
} = {}) => {
  router.get('/', (ctx) => {
    ctx.body = 'Welcome!';
  });

  return router.routes();
}
