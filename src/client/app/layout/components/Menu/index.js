import hs from 'preact-hyperstyler';
import style from './style.styl';

const h = hs(style);

export default ({
  views = require('app/views'),
  Menu = require('app/components/Menu').default(),
} = {}) => (props) => h('div.menu', props, [
  h(Menu, { views, styles: style, ...props })
]);
