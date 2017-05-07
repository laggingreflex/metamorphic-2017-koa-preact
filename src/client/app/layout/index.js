import Path from 'path';
import hs from 'preact-hyperstyler';
import {
  getViewPath,
  getViewChain,
} from 'app/utils';
import style from './style.styl';

const h = hs(style);

export default ({
  Header = require('./components/Header').default(),
  Menu = require('./components/Menu').default(),
  Breadcrumb = require('app/components/Breadcrumb').default(),
  Footer = require('./components/Footer').default(),
} = {}) =>
({ view, parents, path, ...routeProps } = {}) => {
  const chain = [view, ...parents];

  const header = (props) => h('div.header', {}, [h(Header, props)]);
  const menu = (props) => h('div.menu', {}, [h(Menu, props)]);
  const breadcrumb = (props) =>
    h('div.breadcrumb.title', {}, [h(Breadcrumb, {
      ...props,
      chain: chain.slice().reverse()
    })]);
  const wrapper = ({ renderNestedView }) => h('div.wrapper', {}, [renderNestedView()]);
  const content = (props1 = {}) => h('div.content', {}, [h([...chain, wrapper].reduce((a, b) => (props2 = {}) =>
    h(b, {
      ...props1,
      ...props2,
      nestedView: a,
      renderNestedView: (props3 = {}) => h('div.nested-view', {}, [
        h(a, {
          ...props1,
          ...props2,
          ...props3,
          parents: chain,
          resolveHref: path => Path.join(getViewPath(chain[0], chain.slice(1)), path),
          renderNestedView: () => false,
        }),
      ])
    })))]);
  const footer = (props) => h('div.footer', {}, [h(Footer, props)]);

  const layout = (props) => h('div.layout', {}, [
    header(props),
    menu({ ...props, path }),
    breadcrumb(props),
    content({...routeProps, ...props}),
    footer(props),
  ]);

  return layout();
};
