import _ from 'lodash';
import URL from 'url';
import Router from 'koa-router';
import btoa from 'btoa';
import config from '.../config';
import { grantConfig } from '.../server/auth/oauth';
import {
  User as getUserModel,
} from '.../db/mongo/models';

export default ({
  router = new Router(),
  User = getUserModel(),
  oauthProviders = require('.../server/auth/oauth/providers'),
} = {}) => {
  router.post('/login/email/check', async(ctx) => {
    const { email, password } = ctx.request.body;
    // ctx.log.info('Login request', { email, password });
    if (!email) {
      ctx.status = 400;
      ctx.body = 'invalid email';
      return;
    }
    let user = await User.findOne({ email });
    if (user) {
      if (!password) {
        ctx.status = 400;
        ctx.body = { error: 'user exists; invalid password' };
      } else if (await user.verifyPassword(password)) {
        ctx.body = { data: user.toAuthObject() };
      } else {
        ctx.status = 401;
        ctx.body = { error: 'user exists; password incorrect' };
      }
    } else if (password) {
      user = new User({ email });
      await user.storeHash(password, 'password');
      await user.save();
      ctx.body = { data: user.toAuthObject() };
    } else {
      ctx.status = 400;
      ctx.body = { error: 'new user; invalid password' };
    }
  });

  router.get('/login/oauth/callback', async(ctx) => {
    const { provider, response: { access_token } } = ctx.session.grant;
    const { email, ...profile } = await oauthProviders[provider].getProfile(access_token);
    const user = await User.findOne({ email }) || new User({ email });
    Object.assign(user, profile);
    await user.storeHash(access_token, 'access_token');
    await user.save();
    ctx.redirect(`http://${config.clientHost}/login?success&data=` + btoa(JSON.stringify(user.toAuthObject())));
  });

  return router.routes();
};
