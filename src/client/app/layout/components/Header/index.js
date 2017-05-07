import { Component } from 'preact';
import hs from 'preact-hyperstyler';
import Store from 'mobx-localforage-store';
import changeCase from 'change-case';
import icon from 'app/../assets/icon.png';
import style from './style.styl';

const h = hs(style);

export default ({
  name = require('app/../../../package.json').name,
  Search = require('app/components/Search').default(),
  appStore = require('app/store/models/App').default(),
} = {}) => {
  const logo = () => h('a.logo', { href: '/' }, [
    h('img', { src: icon }),
    h('span.title', {}, [changeCase.title(name)]),
  ]);

  const topSocial = () => h('div.social', {}, [
    'rss-square', 'twitter-square', 'google-plus-official', 'youtube-play', 'facebook-official'
  ].map((icon) =>
    h('a', {
      class: 'fa fa-' + icon,
      href: '/social/' + icon.split('-')[0],
      tabindex: -1,
      // tabindex: 1000,
    })
  ));

  @Store.observe
  class topSearch extends Component {
    render() {
      return h(Search, {
        class: [style.search],
        data: (!appStore || !appStore.wikiSearchData) && [] || appStore.wikiSearchData.keys,
        suggestListItem: ({ original, tabindex }) => (!appStore || !appStore.wikiSearchData) && 'div'
          || (({ children }) => h('a', {
            href: '/wiki/' + appStore.wikiSearchData.index[original].parent.map(changeCase.param).join('/') + '/' + changeCase.param(original),
            tabindex,
          }, children))
      });
    }
  }

  // const topProfile = div()

  const Header = () => h('div.header', {}, [
    h(logo),
    h('div.grow', {}),
    h(topSocial),
    h(topSearch),
  ]);

  return Header;
};
