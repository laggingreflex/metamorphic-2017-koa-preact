
# App

This is the main code for the client-side app

It's built on [Preact] and uses [Hyperscript] for creating DOM.

[preact]: https://preactjs.com
[hyperscript]: https://github.com/hyperhype/hyperscript

It uses [preact-router] to render all the views as its children and assigning them proper `path` attributes

`./views/MyComponent.js`:

```js
export default MyComponent {

  static path = '/my-component'

  render(){...}
}
```

`./index.js`:

```js
import {h} from 'preact'
import router from 'preact-router'
import MyComponent from './views/MyComponent'

export default h(router, {}, [
  h(MyComponent, { path: MyComponent.path || '/my-component' })
])
```

Only it takes ***all*** the views (./views) and itreates through them doing the same, as well as passing them through the Template too.


[preact-router]: https://github.com/developit/preact-router
