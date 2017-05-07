import URL from 'url';
import { Component } from 'preact';
import hs from 'preact-hyperstyler';
import changeCase from 'change-case';
import Store from 'mobx-localforage-store';
import style from './style.styl';

const h = hs(style);

export default ({
  router: { route } = require('preact-router'),
  toastr = require('toastr'),
  document = global.document,
  location = global.location,
  atob = global.atob,
  sessionStorage = global.sessionStorage,
  apiHost = require('app/api').apiHost,
  fetch = require('app/api').default(),
  appStore = require('app/store/models/App').default(),
  state,
  loginFetchApiPath = '/login/email/check',
} = {}) => @Store.observe

class Login extends Component {
  static menu = {
    order: 100,
    render: () => !appStore.profile && 'Login/Register'
  }

  state = state || new Store('/login/v5', [
    'loading',
    'redirecting',
    'error',
    'email',
    'password',
    'focused',
  ], {
    autosave: ['email', 'focused'],
  });

  async redirect(path) {
    path = path || sessionStorage.getItem('referrer') || '/';
    this.state.redirecting = path;
    await route(path);
    this.state.redirecting = false;
  }

  async updateProfile(profile) {
    if (typeof profile === 'string') {
      try {
        profile = JSON.parse(atob(profile));
      } catch (err) {
        err.message = 'Error reading query data ' + err.message;
        throw err;
      }
    }

    console.log('appStore.profile:', appStore.profile);
    await appStore.setItem('profile', profile);
    console.log('appStore.profile:', appStore.profile);
    return appStore.setItem('profile', profile);
  }

  refs = {};

  componentWillMount() {
    const url = URL.parse(location.href, true);
    if (url.query && typeof url.query.success !== 'undefined' && url.query.data) {
      return this.updateProfile(url.query.data)
        .then(() => this.redirect())
        .catch((err) => this.redirect('/login'));
    } else {
      const referrer = URL.parse(document.referrer);
      if (referrer.host === location.host && referrer.pathname !== '/login') {
        return sessionStorage.setItem('referrer', referrer.pathname);
      }
    }
  }

  componentWillUnmount() {
    this.state.save(['email']);
  }

  render() {
    if (this.state.redirecting) {
      return `Redirecting to ${this.state.redirecting}...`;
    }

    const disableOnloading = { disabled: this.state.loading };

    const loadingText = (text) => this.state.loading && ` (${text || 'loading'}...) ` || '';

    const emailField = {};
    emailField.label = h('label.label', { for: 'email' }, 'Email' + loadingText());
    emailField.input = h('input.input', {
      name: 'email',
      type: 'email',
      value: this.state.email,
      autofocus: true,
      // onInput: this.linkState('email'),
      onInput: ({ target: { value } }) => {
        this.state.email = value;
        this.state.focused = 'email';
      },
      ref: (email) => this.refs.email = email,
      tabindex: 10,
      ...disableOnloading
    });

    const passwordField = {};
    passwordField.label = h('label.label', { for: 'password' }, 'Password');
    passwordField.input = h('input.input', {
      name: 'password',
      type: 'password',
      value: this.state.password,
      // onInput: this.linkState('password'),
      onInput: ({ target: { value } }) => {
        this.state.password = value;
        this.state.focused = 'password';
      },
      ref: password => this.refs.password = password,
      tabindex: 10,
      ...disableOnloading
    });

    const submitButton = h('button.button.is-info', 'Submit', {
      tabindex: 10,
      ...disableOnloading
    });

    const emailForm = h('form.email', {
      onsubmit: (e) => {
        e.preventDefault();
        this.onsubmit();
      }
    }, [
      emailField.label,
      emailField.input,
      passwordField.label,
      passwordField.input,
      submitButton,
    ].filter(Boolean));

    const getAuthButton = (name, opts = {}) => h(`form.${name}`, {
      class: [style.auth],
      // action: `//${apiHost}/connect/${name}`,
      onsubmit: (e) => {
        e.preventDefault();
        this.state.loading = true;
        location.assign(`//${apiHost}/connect/${name}`);
      }
    }, [
      h('button.button.is-warning', {
        tabindex: 10,
        ...disableOnloading
      }, [`Login with ${changeCase.title(name)}`])
    ]);
    const google = getAuthButton('google');
    const facebook = getAuthButton('facebook');

    return h('div.login', {}, [
      this.state.error && h('div.error', this.state.error),
      emailForm,
      google,
      facebook,
    ].filter(Boolean));
  }

  async onsubmit() {
    const email = this.state.email;
    const password = this.state.password;
    let result;
    this.state.loading = true;
    try {
      result = await fetch(loginFetchApiPath, { email, password });
      if (!result) {
        throw new Error('Fetch didn\'t return a result');
      }
      this.state.loading = false;
    } catch (err) {
      this.state.loading = false;
      this.state.focused = 'email';
      if (err.error) {
        result = err;
      } else {
        this.state.error = 'Unexpected Error ' + (err.body || err.message);
        return;
      }
    }
    this.state.error = null;
    if (result.error) {
      switch (result.error) {
      case 'invalid email':
        this.state.email = null;
        this.state.password = null;
        this.state.error = 'Invalid email or password';
        this.state.focused = 'email';
        break;
      case 'user exists; invalid password':
        this.state.password = null;
        this.state.error = 'Invalid email or password';
        this.state.focused = 'password';
        break;
      case 'user exists; password incorrect':
        this.state.password = null;
        this.state.error = 'Incorrect password';
        this.state.focused = 'password';
        break;
      case 'new user; invalid password':
        this.state.password = null;
        this.state.error = 'Invalid password';
        this.state.focused = 'password';
        break;
      default:
        this.state.error = result.error;
        this.state.focused = 'email';
      }
    } else if (result && result.data && result.data.email) {
      await this.updateProfile(result.data);
      toastr.success('Welcome!');
      this.redirect();
      if (process.browser) {
        console.log(result.data);
      }
    } else {
      this.state.error = 'Invalid or unexpected response';
      if (process.browser) {
        console.error(this.state.error);
        console.error(result);
      }
    }
  }

  componentDidUpdate() {
    if (this.state.focused && this.refs[this.state.focused]) {
      this.refs[this.state.focused].focus();
      this.state.focused = null;
    }
  }

};
