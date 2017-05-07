import Router from 'koa-router';

export default ({
  router = new Router(),
} = {}) => {
  router.get('/initial-data.js', (ctx) => {
    const user = ctx.state.user;
    const data = { user };
    ctx.body = `
    window.initialData = ${JSON.stringify(data)}
  `;
  });

  return router.routes();
}
