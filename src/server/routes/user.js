import Router from 'koa-router';

export default ({
  router = new Router(),
  // User = getUserModel(),
} = {}) => {
  router.get('/user', (ctx) => {
    const user = { name: 'guest' };
    ctx.body = `window.user = ${JSON.stringify(user)}`;
  });

  return router.routes();
}
