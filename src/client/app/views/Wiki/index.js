import { Component } from 'preact';
import hs from 'preact-hyperstyler';
import Store from 'mobx-localforage-store';
import changeCase from 'change-case';
import style from './style.styl';

const h = hs(style);

export default ({
  api: { fetch } = require('../../api'),
  appStore = require('app/store/models/App').default(),
  // Menu = require('./Menu').default(),
  state,
  data,
} = {}) => @Store.observe

class Wiki extends Component {
  static path = '/wiki/:subject?/:category?/:article?'
  static menu = {
    // render: () => h(Menu)
  }

  state = state || new Store({

  });
  data = data || new Store('topic', {

  });

  get topic() {
    return this.props.article || this.props.category || this.props.subject;
  }

  async load() {
    const topic = this.topic;
    if (!topic) {
      return;
    }
    return;
    if (this.state.topic[topic]) {
      console.log('already loaded', topic);
    }
    console.log('loading', topic);
    this.setState({ topic: { ...this.state.topic, [topic]: 'Loading...' } });
    let data = await topicStore.getItem(topic);
    if (!data) {
      try {
        data = await fetch('/wiki/topic/' + changeCase.param(topic));
        data = data.summary;
      } catch (error) {
        throw error;
      }
      await topicStore.setItem(topic, data);
    }
    this.setState({ topic: { ...this.state.topic, [topic]: data } });
    console.log('loaded', topic);
  }

  componentWillMount() {
    this.load();
  }
  componentWillUpdate() {
    this.load();
  }
  componentWillReceiveProps() {
    this.load();
  }
  componentDidUpdate() {
    this.load();
  }

  render() {
    if (this.topic) {
      return 'You\'ve chosen: ' + this.topic;
      if (this.state.topic[this.topic]) {
        return this.state.topic[this.topic];
      } else {
        return 'Loading...';
      }
    } else {
      return 'Choose a /:subject?/:category?/:article?';
    }
  }

};
