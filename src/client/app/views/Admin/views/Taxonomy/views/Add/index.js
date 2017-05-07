import { Component } from 'preact';
import hs from 'preact-hyperstyler';
import md from 'preact-markdown';
import { route } from 'preact-router';
import changeCase from 'change-case';
import { getViewPath, arrayEqual } from 'app/utils';
import { mapHierarchies } from '../../utils';
import style from './style.styl';

const h = hs(style);

export default ({
  state,
  Store = require('app/store/utils/Store').default(),
  taxonomy,
  Error = require('app/components/Error').default(),
  Success = require('app/components/Success').default(),
  // upsert = require('../../utils/upsert').default(),
  form = require('app/components/utils/form'),
} = {}) => @Store.observe
class Add extends Component {
  static menuOrder = 2

  taxonomy = taxonomy || new Store('admin/taxonomy/add/v1', {
    taxonomy: '',
    hierarchy: [],
    term: '',
    misc: {},
  });

  state = state || new Store([
    'error',
    'success',
    'loading',
  ]);

  // componentDidUpdate() {
  //   if (this.taxonomy.hierarchy && this.taxonomy.hierarchy.length) {
  //     const select = this.refs.hierarchySelect[(this.taxonomy.hierarchy || []).length];
  //     if (select && select.focus) {
  //       select.focus();
  //     }
  //   }
  // }

  refs = {
    hierarchySelect: [],
  }

  render({
    taxonomy,
    resolveHref,
  } = {}, {
    error,
    success,
    loading,
  } = {}) {
    if (!taxonomy || !taxonomy.isReady) {
      return 'Loading session...';
    }

    if (this.props.taxonomy.dirty) {
      return h('p', [
        md('Some taxonomies have been edited or marked for deletion.'),
        md(`Please [save all](${resolveHref('../save-all/')}) changes before proceeding.`),
      ]);
    }

    const taxonomyField = [
      form.label('taxonomy'),
      form.input('taxonomy', {
        list: 'distinctTaxonomies',
        value: this.taxonomy.taxonomy,
        oninput: ({ target: { value } }) => {
          this.taxonomy.taxonomy = value && value.toLowerCase() || '';
          if (!(this.taxonomy.taxonomy in taxonomy.distinctTaxonomies)) {
            this.taxonomy.hierarchy = [];
          }
        },
      }),
      h('datalist#distinctTaxonomies', Object.keys(taxonomy.distinctTaxonomies || {}).map(t => h('option', { value: t }, [changeCase.title(t)])))
    ];

    const hierarchyField = [
      form.label('hierarchy'),
    ];

    const list = mapHierarchies(taxonomy.taxonomy, this.taxonomy.taxonomy, this.taxonomy.hierarchy);
    if (!list.length) {
      list.push([]);
    }
    const hierarchyList = h('div.control.is-horizontal', {}, list.map((level, i) => h('span.select-hierarchy', [
      h('select.select', {
        tabindex: 1,
        value: this.taxonomy.hierarchy.length - 1 >= i ? this.taxonomy.hierarchy[i] : 'null',
        oninput: ({ target: { value } }) => {
          this.taxonomy.hierarchy = this.taxonomy.hierarchy.slice(0, i);
          if (level.find(([_id]) => value === _id)) {
            this.taxonomy.hierarchy.push(value);
          }
        },
      }, [h('option', {
        value: 'null',
        selected: true,
      }, [
        '(+) ' + (i ? this.taxonomy.term || 'Here' : 'Top Level')
      ])].concat(level.map(([_id, entry]) => h('option', { value: _id }, [entry.term]))))
    ])));

    hierarchyField.push(hierarchyList);

    const termField = [
      form.label('term'),
      form.input('term', {
        value: this.taxonomy.term || '',
        // oninput: debounce(::this.linkState('term'), 100),
        oninput: ({ target: { value } }) => {
          this.taxonomy.term = value;
        },
      }),
    ];

    // const miscFields = Object.keys(this.taxonomy.misc)

    return h('div.main', [
      Error(error),
      Success(success),
      form.form(::this.onsubmit, [
        ...taxonomyField,
        ...hierarchyField,
        ...termField,
        h('div.field.is-grouped', {}, [
          form.button('Add', { loading }),
          form.button('Cancel', {
            type: 'button',
            loading,
            onclick: () => {
              route(parents ? getViewPath(parents[1], parents.slice(2)) + 'edit' : '../edit');
              this.state.discard = true;
            }
          })
        ])
      ])
    ]);
  }

  async onsubmit() {
    if (this.props.taxonomy.dirty) {
      this.state.error = 'Current state is dirty (more than one taxonomies have been edited or marked for deletion). Please use the "Save All" option. (data on this form will be preserved for later)';
    } else {
      await this.props.taxonomy.upsert([this.taxonomy], this.state);
    }
  }
};
