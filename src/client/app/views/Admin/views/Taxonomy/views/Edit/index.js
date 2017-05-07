import hs from 'preact-hyperstyler';
import { Component } from 'preact';
import { route } from 'preact-router';
import debounce from 'lodash.debounce';
import changeCase from 'change-case';
import md from 'preact-markdown';
import { mapHierarchies } from '../../utils';
import { getViewPath, arrayEqual } from 'app/utils';
import style from './style.styl';

const h = hs(style);

export default ({
  state,
  session,
  views = require('./views'),
  Store = require('app/store/utils/Store').default(),
  form = require('app/components/utils/form'),
  Error = require('app/components/Error').default(),
  Success = require('app/components/Success').default(),
} = {}) => @Store.observe
class Edit extends Component {
  static menuOrder = 1

  // static menu = false
  static views = views

  session = session || new Store('admin/taxonomy/edit/v1', [
    'hierarchy',
    'taxonomyKey',
    'single',
    'singleKey',
    'error',
    'success',
    'loading',
    'focus',
  ]);

  state = state || new Store([
    'error',
    'success',
    'loading',
  ]);

  render({
    taxonomy,
    resolveHref,
    parents,
  } = {}, {
    error,
    success,
    loading,
  } = {}) {
    const {
      taxonomyKey: taxonomyKeyArg,
      hierarchy,
      isReady,
      single,
      singleKey,
    } = this.session;

    if (!isReady || !taxonomy || !taxonomy.isReady) {
      return 'Loading session...';
    }
    if (!taxonomy || !Object.keys(taxonomy.taxonomy).length) {
      return h('p', {}, [
        md('No taxonomies exist.'),
        md(`Please [add](${resolveHref('../add/')})`),
        md(`or [load](${resolveHref('../load')}) a taxonomy`),
      ]);
    }

    const taxonomyKey = taxonomyKeyArg || Object.keys(taxonomy.distinctTaxonomies)[0];

    const taxonomyKeySelector = h('div.selector', {}, [
      'Choose a taxonomy to edit:',
      h('select', {
        // onchange: e=> this.linkState('taxonomyKey'),
        onchange: e => this.session.taxonomyKey = e.target.value,
        value: taxonomyKey,
      }, Object.keys(taxonomy.distinctTaxonomies).map(value => h('option', {
        value
      }, [changeCase.title(value)]))),
    ]);

    const cHierarchy = Array.from(hierarchy || []);
    // console.log()
    // const list2 = mapHierarchies(taxonomy.taxonomy, taxonomyKey, cHierarchy);
    // console.log('list2:', list2);
    const list = mapHierarchies(taxonomy.taxonomy, taxonomyKey, cHierarchy).map(levels => levels.map(([key, entry, {
      isExpanded,
      nHierarchy,
    }]) => h('p.entry.field.control.has-addons', {
      class: {
        [style.expanded]: isExpanded,
        [style.focused]: this.session.focus === key,
        expanded: isExpanded,
        focused: this.session.focus === key,
      }
    }, [
      form.input(entry._id, {
        value: entry.term,
        oninput: e => {
          taxonomy.taxonomy[key].term = e.target.value;
          taxonomy.taxonomy[key].dirty = true;
        },
        onfocus: () => {
          this.session.focus = key;
          if (key in taxonomy.lastInTheirHierarchy) {
            this.session.hierarchy = nHierarchy;
          }
        },
        class: {
          [style.dirty]: entry.dirty,
          'is-danger': entry.dirty,
          // 'is-light': !isExpanded,
          // 'is-info': isExpanded,
        },
      }),

      form.button.button('Edit', {
        href: parents ? getViewPath(parents[0], parents.slice(1)) + 'single/' : 'single/',
        onclick: () => {
          this.session.singleKey = key;
          this.session.single = entry;
        },
      }, '.is-warning'),

      form.button.button('Delete', {
        onclick: () => {
          console.log('before entry.delete:', entry.delete);
          entry.delete = true;
        },
      }, '.is-danger'),

    ])));

    return this.props.renderNestedView({ taxonomy, single, singleKey }) || h('div', {}, [
      Error(error),
      Success(success),
      form.form(::this.onsubmit, [
        this.props.taxonomy.dirty ? h('div.control.is-grouped', {}, [
          form.button('Save All', { loading }),
          form.button.button('Cancel/Reset', {
            loading,
            onclick: () => {
              this.state.success = null;
              this.state.error = null;
              this.props.taxonomy.getLatest(this.state);
            }
          }, '')
        ]) : null,
        taxonomyKeySelector,
        h('div.fieldset', {}, list.map(l =>
          h('fieldset', {}, l)))
      ])
    ]);
  }

  // componentOnUnmount({ store } = {}) {
  //   store.setState('taxonomy', taxonomy.taxonomy);
  // }

  async onsubmit() {
    const { parents } = this.props;
    // await store.save();
    route(parents ? getViewPath(parents[1], parents.slice(2)) + 'save-all/' : '../save-all/');
  }
};
