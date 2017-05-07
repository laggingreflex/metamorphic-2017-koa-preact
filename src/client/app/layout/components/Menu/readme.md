
# Menu

Creates a menu from '../../views'

It takes all the views from '../../views' and corresponding menu items.

It doesn't actually render the views, simply use a name and configures stuff like their order, display name, whether they should be rendered etc.

In the view you can define a static property `menu` to control these aspects

```
class MyView {
  static path = '/my-view';
  static menu = {
    order: 99,
    render: () => shouldRenderOrNot() && "Name to use in menu"
  }
  ...
}
```
