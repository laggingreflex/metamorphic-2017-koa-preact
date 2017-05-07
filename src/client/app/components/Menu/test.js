import { initComponent } from '.../test/client';
import factory from './';

describe.skip('Menu', () => {
  let t;
  const init = (...args) => [t] = initComponent(factory)(...args);
  beforeEach(() => init());
  afterEach(() => t.cleanup());

  describe('component', () => {
    it('should initialize with store.expanded = false', () => {
      t.component.state.expanded.should.equal(false);
    });
  });

  describe('.menu', () => {
    const thisEl = () => t.element;
    it('should change store.expanded = false onmouseleave', () => {
      thisEl().dispatchEvent(new window.CustomEvent('mouseleave'));
      t.component.state.expanded.should.equal(false);
    });
  });
  describe('.parent', () => {
    const thisEl = () => t.element.querySelector('.parent');
    it('should change store.expanded = true onclick', () => {
      thisEl().dispatchEvent(new window.CustomEvent('click'));
      t.component.state.expanded.should.equal(true);
    });
  });
  describe('.children', () => {
    const thisEl = () => t.element.querySelector('.children');
    it('should not display when state.expanded=false', () => {
      thisEl().style.display.should.equal('none');
    });
    it('should display when state.expanded=true', () => {
      init({ state: { expanded: true } });
      thisEl().style.display.should.not.equal('none');
    });
  });
});
