import { Component } from 'preact';
import hs from 'preact-hyperstyler';
import Store from 'mobx-localforage-store';
import changeCase from 'change-case';
import style from './style.styl';

const h = hs(style);

export default ({
  api: { fetch } = require('../../../api'),
  appStore = require('../../../store').default(),
  Menu = require('../../../components/Menu').default(),
  state,
} = {}) => @Store.observe

class Wiki extends Component {

  state = state || new Store({
    mouseenter: false,
  });

  render() {
    if (!appStore.wikiSearchData) {
      return;
    }
    return h(Menu, {}, [
      h('a', {
        href: '/wiki',
        tabindex: 100,
      }, 'Wiki'),

      appStore.wikiSearchData.data.map(([subject, categories]) =>
        h('li', {}, [h(Menu, {}, [
          h('a', {
            href: '/wiki/' + changeCase.param(subject),
            tabindex: 100
          }, [subject]),
          h('ul', {}, categories.map(([category]) => h('li', [
            h('a', {
              href: '/wiki/' + changeCase.param(subject) + '/' + changeCase.param(category),
              tabindex: 100
            }, [category]),
          ])))
        ])]))
    ]);

    return h('div', { class: style.menu }, [h(Menu, {}, [
      h('a', {
        href: '/wiki',
        tabindex: 100,
      }, 'Wiki'),
      h('ul', {}, appStore.wikiSearchData.data.map(([subject, categories]) =>
        h('li', {}, [h(Menu, {}, [
          h('a', {
            href: '/wiki/' + changeCase.param(subject),
            tabindex: 100
          }, [subject]),
          h('ul', {}, categories.map(([category]) => h('li', [
            h('a', {
              href: '/wiki/' + changeCase.param(subject) + '/' + changeCase.param(category),
              tabindex: 100
            }, [category]),
          ])))
        ])])))
    ])]);
  }
};
