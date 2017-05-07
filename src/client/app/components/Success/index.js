import hs from 'preact-hyperstyler';
import style from './style.styl';

const h = hs(style);

export default () => (props) => props &&
  h('div.success.notification.is-info', {}, [typeof props === 'string' ? props : props.message]) ||
  null;
