import { spy } from 'sinon';
import { initComponent } from '.../test/client';
import factory from './';

describe('Admin', () => {
  let t;
  const init = (...args) => [t] = initComponent(factory)(...args);
  beforeEach(() => init());
  afterEach(() => t.cleanup());
  describe('menu item', () => {
    it('should only render when profile.role.admin=true', () => {
      Boolean(t.Component.menu.render()).should.equal(false);
      init({ appStore: { profile: {} } });
      Boolean(t.Component.menu.render()).should.equal(false);
      init({ appStore: { profile: { role: { admin: true } } } });
      Boolean(t.Component.menu.render()).should.equal(true);
    });
  });

  describe('render()', () => {
    it('should only render when profile.role.admin=true', () => {
      String(t.component.render()).should.match(/need.*admin.*view.*this/i);
      init({ appStore: { profile: {} } });
      String(t.component.render()).should.match(/need.*admin.*view.*this/i);
      init({ appStore: { profile: { role: { admin: true } } } });
      String(t.component.render()).should.not.match(/need.*admin.*view.*this/i);
    });
  });
});
