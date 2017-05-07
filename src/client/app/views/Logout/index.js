import { Component } from 'preact';
import hs from 'preact-hyperstyler';
import style from './style.styl';

const h = hs(style);

export default ({
  router: { route } = require('preact-router'),
  toastr = require('toastr'),
  appStore = require('app/store/models/App').default(),
} = {}) =>

class Logout extends Component {
  static menu = {
    order: 100,
    render: () => appStore.profile && 'Logout'
  }

  render() {
    return h('button.logout.button.is-danger', {
      onclick: async() => {
        await appStore.removeItem('profile');
        route('/');
        toastr.success('You\'ve been logged out');
      }
    }, ['Logout']);
  }

};
