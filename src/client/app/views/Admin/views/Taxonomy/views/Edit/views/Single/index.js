import { Component } from 'preact';
import hs from 'preact-hyperstyler';
import { route } from 'preact-router';
import changeCase from 'change-case';
import md from 'preact-markdown';
import { getViewPath } from 'app/utils';
import style from './style.styl';

const h = hs(style);

export default ({
  Error = require('app/components/Error').default(),
  Success = require('app/components/Success').default(),
  form = require('app/components/utils/form'),
  Store = require('app/store/utils/Store').default(),
  state,
  store,
} = {}) => @Store.observe
class Single extends Component {

  static menu = false
  static path = '/single/:singleKey?'

  state = state || new Store({
    error: null,
    success: null,
    loading: false,
  });

  get singleKey() {
    return this.props.singleKey
      || this.props.matches
      && this.props.matches.singleKey;
  }

  get single() {
    return this.props.single
      || this.props.taxonomy
      && this.singleKey
      && this.props.taxonomy.taxonomy[this.singleKey];
  }

  get backLink() {
    const { parents } = this.props;
    return parents ? getViewPath(parents[1], parents.slice(2)) : '../edit/';
  }
  get saveAllLink() {
    const { parents } = this.props;
    return parents ? getViewPath(parents[2], parents.slice(3)) + 'save-all/' : '../../save-all/';
  }

  render(props = {}, state = {}) {
    const { taxonomy, parents, } = props;
    const { error, success, loading } = state;

    const { single } = this;

    if (!taxonomy || !taxonomy.isReady) {
      return 'Loading session...';
    }

    if (!single || !Object.keys(single).length) {
      return md(`Please [choose an entry](${this.backLink}) to be edited.`);
    }

    const dirtyNote = h('p', [
      md(`Some taxonomies have been edited or marked for deletion.`),
      md(`Please [Save All](${this.saveAllLink}) changes to avoid inconsistencies.`),
    ])

    // if (taxonomy.dirty) {
    //   return h('p', [
    //     md(`Some taxonomies have been edited or marked for deletion.`),
    //     md(`Please [Save All](${this.saveAllLink}) changes before proceeding.`),
    //   ])
    // }

    // if (single.hierarchy.find(i => !taxonomy.taxonomy[i] || taxonomy.taxonomy[i].dirty)) {
    //   return h('p', [
    //     'One or more hierarchies are dirty',
    //     md(`Please [Save All](${this.saveAllLink}) changes before proceeding.`),
    //   ]);
    // }

    return h('div', {}, [
      Error(error),
      Success(success),
      taxonomy.dirty && dirtyNote,
      form.form(() => this.onsubmit(), [
        form.label('_id'),
        form.input('_id', {
          disabled: true,
          value: single._id,
        }),
        form.label('taxonomy'),
        form.input('taxonomy', {
          disabled: true,
          value: changeCase.title(single.taxonomy),
        }),

        form.label('hierarchy'),
        form.input('hierarchy', {
          disabled: true,
          value: single.hierarchy.map(k => changeCase.title(props.taxonomy.taxonomy[k].term)).join(' > '),
        }),

        form.label('term'),
        form.input('term', {
          value: single.term,
          oninput: e => {
            single.term = e.target.value;
            single.dirty = true;
            // taxonomy.taxonomy.dirty = true;
          },
        }),

        ...(Object.entries(single.misc).length ? Object.entries(single.misc).reduce((p, [key, value]) => p.concat([
          form.label('misc.' + key),
          form.input('misc.' + key, {
            value,
            oninput: e => {
              single.misc[key] = e.target.value;
              single.dirty = true;
              // if (!store.misc) {
              //   store.misc = {};
              // }
              // store.misc[key] = e.target.value;
              // taxonomy.dirty = true;
            },
          }),
        ]), []) : []),
        // form.button('Cancel/Back', {
        //   loading,
        //   onclick: () => {
        //     this.state.discard = true;
        //     taxonomy.taxonomy.dirty = false;
        //   }
        // }, '')

        h('div.field.is-grouped', {}, [
          form.button('Update', { loading }),
          form.button.button('Back', {
            loading,
            onclick: () => route(this.backLink)
          }, '')
          // form.button('Cancel/Back', {
          //   loading,
          //   onclick: () => {
          //     this.state.discard = true;
          //     taxonomy.taxonomy.dirty = false;
          //   }
          // }, '')
          // form.button('Cancel/Back', {
          //   loading,
          //   onclick: () => {
          //     this.state.discard = true;
          //     taxonomy.taxonomy.dirty = false;
          //   }
          // }, '')
        ])
      ])
    ]);
  }

  async onsubmit() {
    // const { taxonomy, parents } = this.props;
    // const { single } = this;
    // const { state, discard } = this.state;
    await this.props.taxonomy.upsert([this.single], this.state);
    // if (discard) {
    //   route(parents ? getViewPath(parents[2], parents.slice(3)) + 'edit' : '../edit');
    // } else {
    //   // await taxonomy.upsert([Object.assign(single, taxonomy.taxonomy)], this.state);
    //   await taxonomy.upsert([{ ...single, ...store }], this.state);
    //   // console.log('state:', this.state.toJS());
    //   // const data = Object.assign(store.toJS().taxonomy[singleKey], this.state.toJS().state);
    //   // console.log('data:', data);
    //   // await upsert([data], this.state);
    // }
  }
};
