import { Component } from 'preact';
import Store from 'mobx-localforage-store';

export default ({
  state
} = {}) => @Store.observe
class View extends Component {
  constructor(...a) {
    super(...a);

    this.state = state || new Store(...[this.storeNamespace, this.initialState || {}, {
      autosave: true,
    }].filter(Boolean));
  }
};
