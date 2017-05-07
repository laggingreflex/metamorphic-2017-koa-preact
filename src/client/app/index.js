import h from 'preact-hyperscript-h';
import router from 'preact-router';
import { render as _render } from 'preact';
import Store from 'mobx-localforage-store';
// import AsyncRoute from 'preact-async-route';
import {
  flattenViews,
  getViewPath,
} from './utils';

export const appFactory = ({
  Layout = require('./layout').default(),
  views = require('./views'),
} = {}) => () => h(router, {}, flattenViews(views).map(({
    view,
    parents,
    path = getViewPath(view, parents),
  }) => h(props => h(Layout, {
    ...props,
    view,
    parents,
  }), {
    path,
    default: view.defaultRoute,
  })
  // h(AsyncRoute, {
  //   // eslint-disable-next-line require-await
  //   // component: async() => () => h(Layout, { view, parents, path }),
  //   component: async() => (props) => {
  //     console.log(`props:`, props);
  //     return h(Layout, { view, parents, path })
  //   },
  //   loading: () => 'Loading...',
  //   path,
  //   default: view.defaultRoute,
  // })
));

export const loadSession = async(
  modelFactories = require('./store/models')
) => {
  const models = Object.entries(modelFactories).map(([, f]) => f());
  await Promise.all(models.map(m => m.ready));
  return {
    models,
    getUpdates: () => Promise.all(models.map(m => m.getUpdates && m.getUpdates()))
  };
};

export const render = (
  target = document.getElementById('app'),
) => {
  const AppComponent = appFactory();
  const AppComponentStoreAware = Store.observe(AppComponent);
  const appElement = h(AppComponentStoreAware);
  _render(appElement, target, target.lastChild);
  // walk(target.lastChild._component, (component, children) => {
  //   console.log(window.ctr = (window.ctr || (window.ctr = 1)) + 1, { component, children });
  //   // return component
  // });
};

export default appFactory;
