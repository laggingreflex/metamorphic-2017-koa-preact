document.getElementById('loading').style.display = 'none';

import { render } from 'preact';
import h from 'preact-hyperscript-h';
import 'preact-material-components/style.css';
import * as Material from 'preact-material-components/dist';


const app = h(Material.Select, {
  // dense: true,
  // raised: true,
  // // compact: true,
  // primary: true,
  // accent: true,
  // ripple: true,
  // // disabled: true,
  // // class: 'mdc-button--accent mdc-button--raised',
  // // 'data-mdc-auto-init': 'MDCRipple',
  hintText: 'Select',
}, [
  h(Material.Select.Item, ['one1111111'])
]);

// const app = h(Button, {
//   dense: true,
//   raised: true,
//   // compact: true,
//   primary: true,
//   accent: true,
//   ripple: true,
//   // disabled: true,
//   // class: 'mdc-button--accent mdc-button--raised',
//   // 'data-mdc-auto-init': 'MDCRipple',
// }, 'Click me');

// const app = h('button', {
//   // class: 'mdc-button--accent mdc-button--raised',
//   class: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent',
//   // 'data-mdc-auto-init': 'MDCRipple',
// }, 'Click me');

const target = document.getElementById('app');
render(app, target, target.lastChild);


// document.getElementById('app').innerHTML = 'ok'
// if (window.onModulesLoaded) {
//   window.onModulesLoaded();
// }

// import { render } from 'preact';
// import renderToString from 'preact-render-to-string';
// import hs from 'preact-hyperstyler';
// import style from './index.styl';

// const h = hs(style);

// import Markup from 'preact-markup';
// import README from './test.md';

// const el = h(Markup, { markup: README, trim: false, type: 'html' });
// const target = document.getElementById('app');
// render(el, target, target.lastChild);

// if (window.onModulesLoaded) {
//   window.onModulesLoaded();
// }



// // console.log('loading...');

// // console.log('Rendering...');
// // console.time('rendered in');
// // // render(h('div.hello', 'Hello'), document.getElementById('app'), document.getElementById('app').lastChild);
// // if (window.onModulesLoaded) {
// //   // document.getElementById('app').innerHTML = renderToString(h('div.hello', 'Hello'));
// //   render(h('div.hello', 'Hello'), document.getElementById('app'), document.getElementById('app').lastChild);
// // } else {
// //   render(h('div.hello', 'Hello'), document.getElementById('app'), document.getElementById('app').lastChild);
// // }
// // console.timeEnd('rendered in');

// // // document.getElementById('app').innerHTML = 'Hello world!';
// // // document.getElementById('app').innerHTML = `<div class='${style.hello}'>Hello world!</div>`;
// // document.getElementById('loading').style.display = 'none';

// // if (window.onModulesLoaded) {
// //   console.log('firing onModulesLoaded');
// //   window.onModulesLoaded();
// // } else {
// //   console.log('onModulesLoaded not found');
// // }
