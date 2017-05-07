
# Layout

This is the layout.

It defines the Header, Menu, Breadcrumb, Content, and Footer components.

It takes only the argument `{view}` and expects it to have a parent with which it generates a `viewChain` (parent.parent.parent...) which is then rendered in a nested manner with the upper most view (top-most ancestor) having the option to either render itself or render the `renderNestedView(props)` with props as necessary to render the chain below.

Every view should that's why have this in its render function:
```
return this.props.renderNestedView() || h('div.', ...
```
so it could optionally render `renderNestedView` when available (i.e. a child of it has been requested/routed) or render itself.


Currently the control is passed down from top to bottom, parent to child, but it would be pretty easy to invert this control. In case you have an inner-most child that should, for example, not display the basic header/footer and instead has to take control over the entire view, it can easily be done from here. (todo at this point. it'd  be nice to have a way to make both options -- top->down|down->top -- possible easily. For now it's just top->down)
