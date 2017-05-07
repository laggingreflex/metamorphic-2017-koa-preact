import * as preact from 'preact';
import h from 'preact-hyperscript-h';
import jsdom from 'jsdom-global';
import MockLocalStorage from 'mock-localstorage';

export const initComponent = (factory) => (opts, { children = [], ...props } = {}) => {
  const appStore = {};
  const sessionStorage = new MockLocalStorage();
  const cleanup = jsdom();
  const Component = factory({ appStore, sessionStorage, ...opts });
  const element = preact.render(h(Component, props, [...children]), document.body);
  const component = element._component;
  return [{ appStore, sessionStorage, cleanup, Component, element, component }];
};
