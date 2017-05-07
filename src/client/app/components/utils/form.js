import h from 'preact-hyperscript-h';
import changeCase from 'change-case';
import debounce from 'lodash.debounce';
import * as MD from 'preact-material-components/dist';

export const form = (onsubmit, children) => {
  const debounced = debounce(onsubmit, 200);
  return h('form', {
    onsubmit: e => {
      e.preventDefault();
      debounced();
    }
  }, children);
};

export const select = ({
  items = [],
  label = 'Select',
  select: selectProps = {},
  item: itemProps = {},
  ...props
} = {}) => {
  let selectElement;
  let hintText = label;
  const selected = items.find(i => i.selected);
  if (selected) {
    hintText = selected.text
  }
  return h(MD.Select, {
    hintText,
    ref: ref => {
      if (ref) {
        selectElement = ref;
        if (ref.control) {
          ref.control.style.width = '';
        }
      }
    },
    onChange: () => {
      const i = selectElement.MDComponent.selectedIndex;
      const selected = items[i];
      if (props.onChange) {
        props.onChange(selected);
      }
    },
    ...selectProps,
  }, items.map(({ text, ...props }) =>
    h(MD.Select.Item, { ...props, ...itemProps }, [text])));
};


export const label = label => h('label.label', { for: label }, [changeCase.title(label)]);

export const input = (name, props) => h('p.control', { class: props.class }, [h('input.input', {
  name,
  tabindex: 1,
  ...props,
  ...(props.oninput ? {
    oninput: debounce(props.oninput, 100),
  } : {}),
})]);

export const button0 = text => h(MD.Button, [text]);

export const button = (text, props, classes = '.is-primary') => h('p.control', { class: props.class }, [
  h(MD.Button, {
    dense: true,
    raised: true,
    // compact: true,
    primary: true,
    accent: true,
    ripple: true,
    tabindex: 1,
    ...props,
    ...('loading' in (props || {}) ? {
      disabled: props.loading,
      class: [{
        ...props.class,
        'is-loading': props.loading,
      }, classes.split(/[\. ]/g).filter(Boolean)],
    } : {}),
  }, [text]),
]);
button.button = (text, props, classes) => button(text, {
  tabindex: 1,
  ...props,
  type: 'button',
}, classes);
