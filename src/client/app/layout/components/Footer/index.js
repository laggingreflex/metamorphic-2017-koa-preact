import hs from 'preact-hyperstyler';
import style from './style.styl';

const h = hs(style);

export default ({

} = {}) => () => h('div.footer', ['footer goes here']);
