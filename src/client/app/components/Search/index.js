import { Component } from 'preact';
import hs from 'preact-hyperstyler';
import Store from 'mobx-localforage-store';
import Markup from 'preact-markup';
import debounce from 'debounce-queue';
import fuzzy from 'fuzzy';
import style from './style.styl';

const h = hs(style);

export default ({
  placeholder = '🔍 Search',
  tabindex = 5,
  state,
} = {}) => @Store.observe

class Search extends Component {

  constructor(...args) {
    super(...args);
    this.debouncedAutocomplete = debounce(() => this.autocomplete(), this.props.autocompleteDebounceTimeout || 100);
    this.debouncedSuggest = debounce(() => this.suggest(), this.props.suggestDebounceTimeout || 500);
    if (this.props.data && !Array.isArray(this.props.data)) {
      throw new Error('props.data must be an array');
    }
  }

  state = state || new Store({
    working: null,
    input: null,
    autocomplete: '',
    suggestions: [],
  });

  render() {
    const underlyingAutocompleteInputBox = h('input.autocomplete', {
      disabled: true,
      value: this.state.input ? this.state.autocomplete || '' : placeholder,
    });

    const mainInputBox = h('input.main', {
      name: 'search',
      tabindex,
      ref: ref => this.input = ref,
      oninput: e => [this.oninput(e)],
    });

    const suggestionList = this.state.suggestions && this.state.suggestions.length && h('ol.suggestions', {}, [...this.state.suggestions.map(s => h('li', {}, [
      h(
        this.props.suggestListItem
        && this.props.suggestListItem(s)
        || 'div.li', { tabindex }, [h(Markup, { markup: s.string })]
      )
    ]))]);

    const button = h('button', { tabindex: tabindex + 1 }, [
      // '.fa.fa-arrow-right'
      '↵',
    ]);

    return h('form.form', {
      onsubmit: e => [this.onsubmit(), e.preventDefault()],
    }, [
      underlyingAutocompleteInputBox,
      mainInputBox,
      button,
      suggestionList,
    ].filter(Boolean));
  }

  oninput({ target: { value } }) {
    this.state.input = value;
    this.state.working = true;
    this.debouncedAutocomplete();
    this.debouncedSuggest();
    this.state.working = false;
  }
  async autocomplete() {
    if (!this.props.data || !this.props.data.length) {
      return;
    }
    if (this.props.autocomplete) {
      return this.props.autocomplete(state.input);
    }
    if (state.input) {
      const input = this.state.input.toLowerCase();
      const startsWith = this.props.data.find(k => k.toLowerCase().startsWith(input));
      if (startsWith) {
        this.state.autocomplete = input + startsWith.substr(input.length);
      } else {
        this.state.autocomplete = '';
      }
    } else {
      this.state.autocomplete = '';
    }
  }
  async suggest() {
    if (!this.props.data || !this.props.data.length) {
      this.state.suggestions = [];
      return;
    }
    if (!this.state.input) {
      this.state.suggestions = [];
      return;
    }
    if (this.props.suggest) {
      return this.props.suggest(state.input);
    }
    let suggestions = fuzzy.filter(state.input, this.props.data, {
      pre: '<strong>',
      post: '</strong>',
    });
    suggestions = suggestions.slice(0, 5);
    this.state.suggestions = suggestions;
  }

  async onsubmit() {

  }
};
