import memoize from 'fast-memoize';

export default memoize(({
  initial = window.taxonomyStore || { ver: 0, taxonomy: {} },
  Store = require('app/store/utils/Store').default(),
  fetch = require('app/api').default(),
  toastr = require('toastr'),
} = {}) => new class Taxonomy extends Store {
  constructor() {
    super('Taxonomy', initial, { autosave: ['taxonomy', 'ver'] });
    this.ready = this.ready.then(::this.getMeta);
  }

  get dirty() {
    return Object.entries(this.taxonomy).find(([, t]) => t.delete || t.dirty);
  }

  getMeta() {
    const distinctTaxonomies = {};
    const lastInTheirHierarchy = {};
    Object.entries(this.taxonomy).forEach(([_id, e]) => {
      if (!(e.taxonomy in distinctTaxonomies)) {
        distinctTaxonomies[e.taxonomy] = true;
      }
      if (e.hierarchy && e.hierarchy.length) {
        lastInTheirHierarchy[e.hierarchy[e.hierarchy.length - 1]] = true;
      }
    });
    this.distinctTaxonomies = distinctTaxonomies;
    this.lastInTheirHierarchy = lastInTheirHierarchy;
    return this;
  }

  async getLatest(state = {}) {
    const ref = toastr.info('Loading taxonomy data...');
    state.loading = true;
    const { error, ...data } = await fetch('/taxonomy');
    state.loading = false;
    ref.hide();
    if (data) {
      await this.loadTaxonomy(data, state);
    } else {
      this.handleError([error, 'Loading taxonomy failed'], state);
    }
  }
  async getUpdates(state = {}) {
    // return
    if (!this.isReady) {
      await this.ready;
    }
    if (!this.ver) {
      await this.getLatest(state);
    } else {
      console.log('Checking updates on taxonomy data...');
      const { error, ...data } = await fetch('/taxonomy/ver');
      // console.log('data:', data);
      // console.log('this.ver:', this.ver);
      if (error) {
        this.handleError([error, 'Couldn\'t check for updates'], state);
      }
      if (data.ver == this.ver) {
        console.log('Taxonomy data is already the latest.');
      } else {
        await this.getLatest(state);
      }
    }
  }

  async loadTaxonomy(data, state = { success: '' }) {
    const oldVer = this.ver;
    try {
      const { taxonomy, ver } = data;
      if (!ver) {
        return this.handleError([`Invalid version: ${ver}`], state);
      }
      Object.entries(taxonomy).forEach(([k, e]) => {
        if (!('delete' in e)) {
          e.delete = false;
        }
        if (!('dirty' in e)) {
          e.dirty = false;
        }
      });
      console.log('Loaded', { taxonomy });
      await Promise.all([
        this.setItem('taxonomy', taxonomy),
        this.setItem('ver', ver),
      ]);
      if (ver == '-1') {
        state.success = (state.success || '') + 'Taxonomy loaded from external source (unsaved)';
        toastr.info(state.success);
      } else if (oldVer) {
        if (oldVer == ver) {
          state.success = (state.success || '') + `Taxonomy restored (${ver})`;
          toastr.info(state.success);
        } else {
          state.success = (state.success || '') + `Taxonomy updated (${oldVer} -> ${ver})`;
          toastr.info(state.success);
        }
      } else {
        toastr.info(`Taxonomy loaded (${ver})`);
      }
      this.getMeta();
    } catch (error) {
      this.handleError([error], state);
    }
  }

  handleError(errors = [], state = {}) {
    if (!Array.isArray(errors)) {
      errors = [errors];
    }
    const errs = errors.length && errors.map(e => e.message || e).join('. ') || 'Unexpected error';
    const err = new Error(`Couldn't load/update taxonomy. (${errs}) Instant search might be unavailable/outdate`);
    state.error = err.message;
    toastr.error(err.message);
    console.error(err);
  }

  async upsert(data, state = {}) {
    state.loading = true;
    state.error = null;
    state.success = null;
    // const taxonomy = store.toJS().taxonomy;
    // console.log(`data:`, data);
    const response = await fetch('/taxonomy/update', data || this.taxonomy);
    const { error, result } = response;
    state.loading = false;
    if (!result || !result.updated || !result.deleted) {
      state.error = error || 'Unexpected response.';
      console.error(state.error);
      console.error('Expected the response to be like: `{updated, deleted}`, but instead received:', result);
      console.log({ response });
      return;
    }
    state.success = `Success! Added/updated ${Object.keys(result.updated).length}; Deleted ${Object.keys(result.deleted).length}. `;

    await this.getLatest(state);
    // await appLoad();
    // await update(state);
  }

}());
