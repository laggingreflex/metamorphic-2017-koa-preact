import URL from 'url';
import atob from 'atob';
import { stub, spy } from 'sinon';
import getRouter from '.../test/utils/router';
import getRoutes from '.'
import {User as UserFactory} from '.../server/db/mongo/models';

describe('auth', () => {
  let ct;
  beforeEach(function() { ct = this.currentTest });

  let route, init, User;
  const getRoute = (route, opts) => getRoutes({ router: getRouter(), ...opts })[route];
  beforeEach(() => init = (opts) => route = getRoute(ct.parent.title, opts));

  describe('/login/email/check', () => {
    it('should throw without email/pass', async() => {
      init();
      const ctx = { request: { body: {} } }
      await route(ctx);
      ctx.body.should.match(/invalid/)
    });
    it('user exists; invalid password', async() => {
      const email = 'some@email.test'
      const user = {};
      init({
        User: {
          findOne: async(args) => {
            args.should.deep.equal({ email });
            return user;
          }
        }
      })
      const ctx = { request: { body: { email } } }
      await route(ctx);
      ctx.body.should.deep.equal({ error: ct.title });
    });
    it('should return user as JSON', async() => {
      const email = 'some@email.test'
      const password = 'password'
      const user = { email };
      init({
        User: {
          findOne: async(args) => {
            args.should.deep.equal({ email });
            return {
              async verifyPassword(p) {
                if (p !== password) {
                  throw new Error(`verifyPassword error`)
                } else {
                  return true
                }
              },
              toAuthObject: () => user,
            };
          }
        }
      })
      const ctx = { request: { body: { email, password } } }
      await route(ctx);
      ctx.body.should.deep.equal({ data: user });
    });
    it('user exists; password incorrect', async() => {
      const email = 'some@email.test'
      const password = 'password'
      const user = { email };
      init({
        User: {
          findOne: async(args) => {
            args.should.deep.equal({ email });
            return {
              verifyPassword: async(p) => p === password,
              toAuthObject: () => user,
            };
          }
        }
      })
      const ctx = { request: { body: { email, password: 'invalid password' } } }
      await route(ctx);
      ctx.body.should.deep.equal({ error: ct.title });
    });
    it('should create new user', async() => {
      const email = 'some@email.test'
      const password = 'password'
      const user = { email };

      init({
        User: class {
          constructor(args) {
            args.should.deep.equal({ email });
            return {
              async storeHash(arg, ctx) {
                ctx.should.equal('password');
                arg.should.equal(password);
              },
              async save() {},
              toAuthObject: () => user
            }
          }
          static findOne = async() => null
        }
      })
      const ctx = { request: { body: { email, password } } }
      await route(ctx);
      ctx.body.should.deep.equal({ data: user });
    });
    it('user exists; password incorrect', async() => {
      const email = 'some@email.test'
      const password = 'password'
      const user = { email };

      init({
        User: class {
          static findOne = async(args) => {
            args.should.deep.equal({ email });
            return {
              verifyPassword: async(p) => p === password,
              toAuthObject: () => user,
            };
          }
        }
      })
      const ctx = { request: { body: { email, password: 'aaa' } } }
      await route(ctx);
      ctx.body.should.deep.equal({ error: ct.title });
    });
    it('new user; invalid password', async() => {
      const email = 'some@email.test'
      const password = 'password'
      const user = { email };

      init({
        User: class {
          constructor(args) {
            args.should.deep.equal({ email });
            return {
              async storeHash(arg, ctx) {
                ctx.should.equal('password');
                arg.should.equal(password);
              },
              async save() {},
              toAuthObject: () => user
            }
          }
          static findOne = async() => null
        }
      })
      const ctx = { request: { body: { email } } }
      await route(ctx);
      ctx.body.should.deep.equal({ error: ct.title });
    });
  });

  describe('/login/oauth/callback', () => {
    const provider = 'provider';
    const access_token = 'access_token';
    const email = 'some@email.com';
    const user = { email };
    const profile = { some: 'data' };
    const findUser = (args) => {
      args.should.deep.equal({ email });
      return {
        async storeHash(arg, ctx) {
          ctx.should.equal('access_token');
          arg.should.equal(access_token);
        },
        async save() {
          for (const key in profile) {
            this[key].should.equal(profile[key]);
          }
        },
        toAuthObject: () => user,
      };
    }
    const oauthProviders = {
      [provider]: {
        getProfile(arg) {
          arg.should.equal(access_token);
          return { email, ...profile };
        }
      }
    };
    it('should succeed', async() => {
      class User {
        constructor(...a) { return findUser(...a) }
        static findOne = findUser
      };
      init({ User, oauthProviders, });
      const redirect = (arg) => {
        const url = URL.parse(arg, true);
        JSON.parse(atob(url.query.data)).should.deep.equal(user);
      }
      await route({ session: { grant: { provider, response: { access_token } } }, redirect });

      User.findOne = () => null;
      await route({ session: { grant: { provider, response: { access_token } } }, redirect });

    });
  });

});
