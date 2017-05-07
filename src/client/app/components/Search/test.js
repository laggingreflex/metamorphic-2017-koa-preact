import { spy } from 'sinon';
import { initComponent } from '.../test/client';
import factory from './';

describe('Search', () => {

  let t;
  const init = (...args) => [t] = initComponent(factory)(...args);
  beforeEach(() => init());
  afterEach(() => t.cleanup());


  describe('element', () => {
    it('should render a form with two inputs', () => {
      t.element.tagName.should.equal('FORM');
      t.element.querySelectorAll('input').should.have.length(2);
    });
    it('should throw if data prop is not array', () => {
      (() => init({}, { data: 1 })).should.throw(/array/i);
    });
    it('should not throw if data prop is array', () => {
      (() => init({}, { data: [] })).should.not.throw(/array/i);
    });
  });
  describe('input.autocomplete', () => {
    const getEl = () => t.element.querySelector('input.autocomplete');
    it('should initialize with placeholder', () => {
      const placeholder = 'aslaksjhlkjh';
      init({ placeholder });
      getEl().value.should.equal(placeholder);
    });
    it('should display state.autocomplete when state.input is present', () => {
      const autocomplete = 'aasdfasdfdsf';
      init({ state: { input: 'something', autocomplete } });
      getEl().value.should.equal(autocomplete);
    });
    it('should not display anything if state.autocomplete is empty', () => {
      init({ state: { input: 'something', autocomplete: '' } });
      getEl().value.should.equal('');
    });
  });
  describe('input.main', () => {
    const getEl = () => t.element.querySelector('input.main');
    it('should trigger oninput', () => {
      t.component.oninput = spy();
      getEl().dispatchEvent(new window.CustomEvent('input'));
      t.component.oninput.should.be.called;
    });
  });
  describe('ol.suggestions', () => {
    const getEl = () => t.element.querySelector('ol.suggestions');
    it('should not exist without state.suggestions', () => {
      Boolean(getEl()).should.equal(false);
    });
    it('should not exist with empty state.suggestions', () => {
      init({ state: { suggestions: [] } });
      Boolean(getEl()).should.equal(false);
    });
    it('should exist with state.suggestions=[some]', () => {
      init({ state: { suggestions: ['some'] } });
      Boolean(getEl()).should.equal(true);
    });
    it('should use this.props.suggestListItem', () => {
      const suggestListItem = spy();
      init({ state: { suggestions: ['some'] } }, { suggestListItem });
      suggestListItem.should.have.been.called;
    });
  });
  describe('form', () => {
    const getEl = () => t.element;
    it('should trigger onsubmit', () => {
      t.component.onsubmit = spy();
      getEl().dispatchEvent(new window.CustomEvent('submit'));
      t.component.onsubmit.should.be.called;
    });
  });
  describe('oninput()', () => {
    it('should trigger autocomplete() & suggest()', (done) => {
      init({}, { autocompleteDebounceTimeout: 1, suggestDebounceTimeout: 1 });
      t.component.autocomplete = spy();
      t.component.suggest = spy();
      const value = 'asdasda';
      t.component.oninput({ target: { value } });
      setTimeout(() => {
        t.component.autocomplete.should.have.been.called;
        t.component.suggest.should.have.been.called;
        done();
      }, 100);
    });
  });
  describe('autocomplete()', () => {
    it('should return without props.data', async() => {
      Boolean(await t.component.autocomplete()).should.equal(false);
      init({}, { data: [] });
      Boolean(await t.component.autocomplete()).should.equal(false);
    });
    it('should trigger props.autocomplete', async() => {
      const autocomplete = spy();
      const input = 'asasdsdf';
      init({ state: { input } }, { data: ['1'], autocomplete });
      await t.component.autocomplete();
      autocomplete.should.have.been.calledWith(input);
    });
    it('should match input from data', async() => {
      const input = 'asasdsdf';
      const state = { input };
      const data = [input];
      init({ state }, { data });
      await t.component.autocomplete();
      String(state.autocomplete).should.equal(input);
    });
    it('should be blank when input is not matched by data', async() => {
      const input = 'asasdsdf';
      const state = { input };
      const data = ['input'];
      init({ state }, { data });
      await t.component.autocomplete();
      String(state.autocomplete).should.equal('');
    });
    it('should be blank when input is empty', async() => {
      const input = '';
      const state = { input };
      const data = ['input'];
      init({ state }, { data });
      await t.component.autocomplete();
      String(state.autocomplete).should.equal('');
    });
  });
  describe('suggest()', () => {
    it('should empty the suggestions data when data is empty', async() => {
      const state = {};
      init({ state });
      await t.component.suggest();
      state.suggestions.should.deep.equal([]);
      init({ state }, { data: [] });
      await t.component.suggest();
      state.suggestions.should.deep.equal([]);
    });
    it('should empty the suggestions data when input is empty', async() => {
      const state = { input: '' };
      init({ state }, { data: ['s'] });
      await t.component.suggest();
      state.suggestions.should.deep.equal([]);
    });
    it('should call props.suggest', async() => {
      const input = 'dsfgsdfg';
      const suggest = spy();
      init({ state: { input } }, { data: [input], suggest });
      await t.component.suggest();
      suggest.should.have.been.calledWith(input);
    });
    it('should fuzzy match suggestions', async() => {
      const data = ['barak obama'];
      const input = 'r';
      init({ state: { input } }, { data });
      await t.component.suggest();
      t.component.state.suggestions[0].string.should.match(/o.*b.*a.*m.*a/i);
    });
  });

});
