import { Component } from 'preact';
import hs from 'preact-hyperstyler';
import Store from 'mobx-localforage-store';
import style from './style.styl';

const h = hs(style);

export default ({} = {}) => @Store.observe

class Error404NotFound extends Component {
  static defaultRoute = true;

  render() {
    return h('div.404', {}, ['Error 404 Not Found']);
  }

};
