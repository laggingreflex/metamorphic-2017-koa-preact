import { Component } from 'preact';
import hs from 'preact-hyperstyler';
import Store from 'mobx-localforage-store';
import md from 'preact-markdown';
import README from './README.md';
import style from './style.styl';

const h = hs(style);

export default ({
  taxonomy = require('app/store/models/Taxonomy').default(),
  // store = require('./store').default(),
  Menu = require('app/components/Menu').default(),
  views = require('./views'),
  state,
} = {}) => @Store.observe

class Taxonomy extends Component {
  static views = views

  state = state || new Store([]);

  render({ nestedView } = {}, {} = {}) {
    if (!taxonomy.isReady) {
      return 'Loading session...';
    }

    return this.props.renderNestedView({ taxonomy }) || h.div([
      h('p.subtitle', {}, 'Please use the links below to go to the specific section.'),
      h(Menu, { views, showAll: true, parents: this.props.parents, depth: 1 }),
      md(README),
      // h(Markup, { markup: README, trim: false, type: 'html' }),
    ]);
  }

};
