import { Component } from 'preact';
import hs from 'preact-hyperstyler';
import Store from 'mobx-localforage-store';
import changeCase from 'change-case';
import keynameOf from 'keyname-of';
import { getViewPath } from 'app/utils';
import { autobind } from 'core-decorators';
import style from './style.styl';

export default ({
  state,
} = {}) => @Store.observe @autobind

class Menu extends Component {

  state = state || new Store({
    expanded: false,
    children: [],
  });

  constructor(...a) {
    super(...a);
    this.state.expanded = this.props.expanded;
    this.children = this.props.views && this.processViews(this.props.views) || this.props.children;
    if (this.children && this.children.length) {
      // throw new Error('Need at least one child to render menu item');
      this.children = this.children.map(this.attachOrder);
      this.children = this.sort(this.children);
      this.isSingle = this.children.length <= 1;
      if (this.props.showAll) {
        this.state.expanded = true;
      }
    }
    this.props.styles = this.props.styles || {};
    this.h = hs([style, this.props.styles]);
  }

  refs = {}

  get parent() {
    return this.props.parent;
  }

  get commonState() {
    return this.props.state || this.state;
  }

  componentDidMount() {
    if (this.parent) {
      this.parent.state.children.push(this);
    }
  }
  componentWillUnmount() {
    if (this.parent) {
      const index = this.parent.state.children.indexOf(this);
      if (index) {
        this.parent.state.children.splice(index, 1);
      }
    }
  }

  render() {
    if (!this.children || !this.children.length) {
      return;
      // throw new Error('Need at least one child to render menu item');
    }

    const depth = 'depth' in this.props ? this.props.depth : 100;

    const propsStyles = this.props.styles || {};

    if (this.isSingle) {
      const item = this.children[0];
      const el = this.processSingle(item);
      if (!el) {
        return;
      }
      if (item.views && depth) {
        return this.h('ol.parent', {
          class: {
            expanded: this.state.expanded,
              expandable: !this.state.expanded,
              isCurrentPath: el.isCurrentPath,
          },
          onclick: this.onmouseenter,
          onfocus: this.onmouseenter,
          onmouseenter: this.onmouseenter,
          onblur: this.onblur,
          onmouseleave: this.onmouseleave,
          onkeyup: this.onkeyup,
          ref: ref => this.refs.parent = ref,
        }, [
          this.h('li', {
            class: {
              // isCurrentPath: el.isCurrentPath,
            }
          }, [this.h(el)]),
          // this.state.expanded &&
          item.views && this.h('li.nested.children', {
            // onblur: this.onblur,
            ref: ref => this.refs.children = ref,
          }, [this.h(this.constructor, {
            views: item.views,
            styles: propsStyles,
            showAll: this.props.showAll,
            parents: [item, ...(this.props.parents || [])],
            depth: depth - 1,
            path: this.props.path,
            parent: this,
            parentEls: [this].concat(this.props.parents || []),
            // state: this.state,
            parentState: this.state,
            parentStates: [this.state, ...(this.props.parentStates || [])],
            state: this.props.state || this.state,
          })]),
        ].filter(Boolean));
      } else {
        return this.h('ol.last', {
          onclick: this.onmouseenter,
          onfocus: this.onmouseenter,
          onmouseenter: this.onmouseenter,
          onmouseleave: this.onmouseleave,
          onkeyup: this.onkeyup,
          class: {
            isCurrentPath: el.isCurrentPath,
          }
        }, [this.h('li.last', {
          onblur: this.onblur,
        }, [this.h(el)])]);
      }
    } else if (depth) {
      const [a, b] = this.separateByOrder(this.children);
      const li = c => this.h('li', {
        onclick: this.onmouseenter,
        onfocus: this.onmouseenter,
        onmouseenter: this.onmouseenter,
        onmouseleave: this.onmouseleave,
        onkeyup: this.onkeyup,
        onblur: this.onblur,
      }, [this.h(this.constructor, {
        class: 'children',
        styles: propsStyles,
        ref: ref => this.refs.children = ref,
        showAll: this.props.showAll,
        parents: this.props.parents,
        depth: depth - 1,
        path: this.props.path,
        parent: this,
        parentEls: [this].concat(this.props.parents || []),
        // state: this.state,
        parentState: this.state,
        parentStates: [this.state, ...(this.props.parentStates || [])],
        state: this.props.state || this.state,
      }, [c])]);
      return this.h('ol.parent', {
        onclick: this.onmouseenter,
        onfocus: this.onmouseenter,
        onmouseenter: this.onmouseenter,
        onmouseleave: this.onmouseleave,
        onkeyup: this.onkeyup,
        ref: ref => this.refs.parent = ref,
      }, [
        ...a.map(li),
        a.length && b.length && this.h('li.grow'),
        ...b.map(li)
      ].filter(Boolean));
    }
  }

  onkeyup(e) {
    const keyname = keynameOf(e.keyCode);
    // this.state.expanded = true;
  }
  onmouseenter() {
    if (this.props.showAll) {
      return;
    }
    this.state.expanded = true;
    this.unExpandParentSiblings();

    clearTimeout(this.state.onmouseleaveTimeout);
    this.forEachParent(p => clearTimeout(p.state.onmouseleaveTimeout));
  }

  onmouseleave() {
    // this.state.expanded = false;
    this.state.onmouseleaveTimeout = setTimeout(() => {
      this.state.expanded = false;
    }, 500);
  }

  onblur() {
    this.onmouseleave();
    // this.state.expanded = false;
  }

  isAnyChildExpanded() {
    return this.state.children.find(c => c.isAnyChildExpanded() || c.state.expanded);
  }

  unExpandParentSiblings() {
    if (this.parent) {
      this.parent.state.children
        .filter(c => c !== this)
        .forEach(c => c.state.expanded = false);
      this.parent.unExpandParentSiblings();
    }
  }

  unExpandParents() {
    // console.log('unexpanded');
    if (this.parent) {
      this.parent.state.children
        .forEach(c => c.state.expanded = false);
      this.parent.unExpandParents();
    }
  }

  forEachParent(fn) {
    // console.log('unexpanded');
    if (this.parent) {
      fn.call(this, this.parent);
      this.parent.forEachParent(fn.bind(this));
    }
  }

  processViews = views => Object.entries(views).map(([, v]) => v())
    .sort((a, b) => (a.menu && a.menu.order || a.menuOrder || 0) - (b.menu && b.menu.order || b.menuOrder || 0))
    .filter(view => view.path !== false && view.menu !== false && !view.defaultRoute);

  attachOrder = item => {
    item.order = item.menu && item.menu.order || item.menuOrder || 0;
    return item;
  }

  sort = items => items.sort((a, b) => a.order - b.order)

  separateByOrder = items => [items.filter(l => l.order <= 0), items.filter(l => l.order > 0)]

  processSingle(view, props) {
    const viewMenu = view.menu || {};
    const className = changeCase.param(view.name);
    const href = getViewPath(view, this.props.parents);
    const isCurrentPath = href.length > 1 && this.props.path && this.props.path.includes(href);
    const displayName = changeCase.title(viewMenu.name || view.menuName || view.exportedName || view.name);
    this.displayName = this.state.displayName = displayName;
    const order = viewMenu.order || 0;
    const render = viewMenu.render || view.menuRender || (() => displayName);
    const res = render(props);
    if (!res) {
      return;
    }
    let el;
    if (typeof res === 'string') {
      el = this.h('a.parent', {
        class: className,
        href,
        tabindex: 100
      }, [res]);
    } else if (res) {
      el = res;
    } else {
      el = '';
    }
    const EL = () => el;
    EL.order = order;
    if (view.views) {
      EL.children = view.views;
    }
    EL.isCurrentPath = isCurrentPath;
    return EL;
  }

};
