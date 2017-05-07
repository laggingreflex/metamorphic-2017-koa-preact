import URL from 'url';
import { stub, spy } from 'sinon';
import atob from 'atob';
import btoa from 'btoa';
import { initComponent } from '.../test/client';
import factory from './';

describe('Login', () => {
  let t;
  const init = (...args) => [t] = initComponent(factory)(...args);
  beforeEach(() => init());
  afterEach(() => t.cleanup());
  describe('menu item', () => {
    it('should only render appStore.profile does not exist', () => {
      Boolean(t.Component.menu.render()).should.equal(true);
      init({ appStore: { profile: {} } });
      Boolean(t.Component.menu.render()).should.equal(false);
    });
  });

  describe('redirect()', () => {
    let router;
    beforeEach(() => {
      router = { route: spy() };
      init({ router });
    });
    it('should redirect to path', async() => {
      const path = '/path';
      await t.component.redirect(path);
      router.route.should.have.been.calledWith(path);
    });
    it('should redirect to sessionStorage.referrer', async() => {
      const path = '/path';
      t.sessionStorage.setItem('referrer', path);
      await t.component.redirect();
      router.route.should.have.been.calledWith(path);
    });
    it('should redirect to /', async() => {
      await t.component.redirect();
      router.route.should.have.been.calledWith('/');
    });
  });

  describe('updateProfile()', () => {
    beforeEach(() => {
      init({ atob });
    });
    it('should throw on invalid profile', async() => {
      try {
        await t.component.updateProfile('some string');
      } catch (error) {
        return;
      }
      throw new Error('Didn\'t throw');
    });
    it('should store valid JSON profile in appStore', async() => {
      const profile = { user: 'abc' };
      t.appStore.setItem = spy();
      await t.component.updateProfile(profile);
      t.appStore.setItem.should.have.been.calledWith('profile', profile);
    });
    it('should store valid string profile in appStore', async() => {
      const profile = { user: 'abc' };
      const encoded = btoa(JSON.stringify(profile));
      t.appStore.setItem = spy();
      await t.component.updateProfile(encoded);
      t.appStore.setItem.should.have.been.calledWith('profile', profile);
    });
  });

  describe('componentWillMount', () => {
    const location = URL.parse('http://test.com/login');
    const referrer = 'http://test.com/some-path';
    it('should set sessionStorage with document.referrer', async() => {
      init({ document: { referrer }, location });
      t.component.componentWillMount();
      String(t.sessionStorage.getItem('referrer')).should.equal('/some-path');
    });
    it('should set sessionStorage with document.referrer only when same domain', async() => {
      const referrer = 'http://test2.com/some-path';
      init({ document: { referrer }, location });
      t.component.componentWillMount();
      String(t.sessionStorage.getItem('referrer')).should.not.equal('/some-path');
    });
    it('should set sessionStorage with document.referrer only path isnt /login', async() => {
      const referrer = 'http://test.com/login';
      init({ document: { referrer }, location });
      t.component.componentWillMount();
      String(t.sessionStorage.getItem('referrer')).should.not.equal('/login');
    });
    it('should update profile', async() => {
      const data = { some: 'data' };
      const location = URL.parse(
        'http://test.com/login?success&data=' +
        btoa(JSON.stringify(data))
      );
      init({ document: { referrer }, location });
      t.component.updateProfile = stub();
      t.component.updateProfile.returns(Promise.resolve());
      await t.component.componentWillMount();
      t.component.updateProfile.should.have.been.called;
    });
  });

  describe('render()', () => {
    it('should not render when redirecting', () => {
      init({ state: { redirecting: 'path' } });
      t.component.render().should.match(/redirecting/i);
    });

    describe('form.email', () => {
      const getEl = () => t.element.querySelector('form.email');
      describe('label[for=email]', () => {
        const getEl = () => t.element.querySelector('form.email label[for=email]');
        it('should show "loading" text when loading=true', () => {
          init({ state: { loading: true } });
          String(getEl().innerHTML).should.match(/loading/i);
        });
      });
      describe('input[name=email]', () => {
        const getEl = () => t.element.querySelector('form.email input[name=email]');
        it('should set state.email onInput', () => {
          const state = {};
          init({ state });
          const input = 'input';
          getEl().value = input;
          getEl().dispatchEvent(new window.CustomEvent('input'));
          String(state.email).should.equal(input);
        });
      });
      describe('input[name=password]', () => {
        const getEl = () => t.element.querySelector('form.email input[name=password]');
        it('should set state.password onInput', () => {
          const state = {};
          init({ state });
          const input = 'input';
          getEl().value = input;
          getEl().dispatchEvent(new window.CustomEvent('input'));
          String(state.password).should.equal(input);
        });
      });
      it('should call fetch on form submission', (done) => {
        const fetch = spy();
        const loginFetchApiPath = '/loginFetchApiPath';
        const data = { email: 'email', password: 'password' };
        init({ fetch, loginFetchApiPath, state: { ...data } });
        getEl().dispatchEvent(new window.CustomEvent('submit'));
        setTimeout(() => {
          fetch.should.be.calledWith(loginFetchApiPath, data);
          done();
        }, 100);
      });
    });
  });

  describe('componentDidUpdate()', () => {
    it('focus focused ref', () => {
      t.component.componentDidUpdate();
      const state = { focused: 'someEl' };
      init({ state });
      const someEl = { focus: spy() };
      t.component.refs.someEl = someEl;
      t.component.componentDidUpdate();
      someEl.focus.should.be.called;
      should.not.exist(state.focused);
    });
  });

  describe('onsubmit()', () => {
    let fetch;
    beforeEach(() => {
      fetch = stub();
    });
    it('should call fetch', async() => {
      init({ fetch, state: { email: 'email', password: 'password' } });
      try {
        fetch.returns(Promise.resolve());
      } catch (error) {}
      await t.component.onsubmit();
      fetch.should.be.called;
    });
    it('should handle fetch error', async() => {
      const state = {};
      init({ fetch, state });
      fetch.returns(Promise.reject(new Error('error')));
      await t.component.onsubmit();
      state.error.should.match(/error/);
    });
    [
      'invalid email',
      'user exists; invalid password',
      'user exists; password incorrect',
      'new user; invalid password',
      'general error',
    ].forEach(error => it('should handle fetch result error: ' + error, async() => {
      const state = {};
      init({ fetch, state });
      fetch.returns(Promise.resolve({ error }));
      await t.component.onsubmit();
      (String(state.error).length > 3).should.be.true;
    }));
    it('should handle unexpected result error', async() => {
      const state = {};
      init({ fetch, state });
      fetch.returns(Promise.resolve('this ought to be an error'));
      await t.component.onsubmit();
      state.error.should.equal('Invalid or unexpected response');
    });
    it('should handle correct email/password', async() => {
      const state = {};
      const appStore = { setItem: spy() };
      init({ fetch, appStore });
      const profile = { email: 'email', some: { other: 'data' } };
      fetch.returns(Promise.resolve({ data: profile }));
      await t.component.onsubmit();
      Boolean(state.error).should.be.false;
      appStore.setItem.should.be.calledWith('profile', profile);
    });
  });
});
