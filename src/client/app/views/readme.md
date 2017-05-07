
# Views

The views components are made with Preact (like React, but lighter) and uses Hyperscript to create DOM elements.

[preact]: https://preactjs.com
[hyperscript]: https://github.com/hyperhype/hyperscript

It's basically a class with the main method `render()` which returns DOM element created with Hyperscript.

It can use `this.state` to manage state. (but we'll be using a store, detailed below)

Example:

```
class App {
  render() {
    return "This will display this simple text in the browser when rendered"
  }
}

import { h, render } from 'preact';
render(h(App), document.getElementById('app'));
```

Checkout https://preactjs.com/guide/getting-started and https://github.com/hyperhype/hyperscript


