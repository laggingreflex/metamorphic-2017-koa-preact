# Search

Fuzzy search autocompletion  enabled search box.

It takes an array data as `keys` and matches input from it and displays autocompletion and top 5 suggested items.

```js
hyperscript.h(Search, {
  keys: ['keys', 'to', 'search'],
});
```

By default it renders suggested items as text (with relevant input keys highlighted) in a list.

It takes a function `suggestListItem` that lets you decide how to render that list.

The function must return a **component**. It then renders this component as an element and passes it the original list item which you can also use in this component.

```js
function suggestListItem (item) {
  return class item extends preact.Component {
    render() {
      return hyperscript.h('div.virtually.unchanged', {}, this.props.children)
    }
  }
}
hyperscript.h(Search, {
  keys: ['keys', 'to', 'search'],
  suggestListItem: suggestListItem,
});
```
