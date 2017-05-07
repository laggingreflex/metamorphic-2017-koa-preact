import { Component } from 'preact';
import hs from 'preact-hyperstyler';
import Store from 'mobx-localforage-store';
import style from './style.styl';

const h = hs(style);

export default ({
  appStore = require('app/store/models/App').default(),
} = {}) => @Store.observe

class Profile extends Component {
  static menu = {
    order: 10,
    render: () => appStore.profile && 'Profile'
  }

  render() {
    if (!appStore.profile) {
      return 'You need to be logged in to view this';
    }
  }

};
