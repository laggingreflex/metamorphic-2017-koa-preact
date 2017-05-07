import { Component } from 'preact';
import hs from 'preact-hyperstyler';
import Store from 'mobx-localforage-store';
import style from './style.styl';

const h = hs(style);

export default ({
} = {}) => @Store.observe

class Home extends Component {
  static path = '/';
  static menu = {
    order: -100
  }

  render() {
    return h('div.home', {}, ['Home!']);
  }

};
