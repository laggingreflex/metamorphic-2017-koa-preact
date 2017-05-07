import { Component } from 'preact';
import hs from 'preact-hyperstyler';
import Store from 'mobx-localforage-store';
import style from './style.styl';

const h = hs(style);

export default ({
  appStore = require('app/store/models/App').default(),
  Menu = require('app/components/Menu').default(),
  views = require('./views'),
} = {}) => @Store.observe

class Memes extends Component {

  static views = views

  render({
    renderNestedView
  } = {}, {

  } = {}) {
    return this.props.renderNestedView() || h('div.admin', {}, [
      h('p.subtitle', {}, 'Please use the links below to go to the specific section.'),
      h(Menu, { views, showAll: true, parents: this.props.parents }),
    ]);
  }

};
