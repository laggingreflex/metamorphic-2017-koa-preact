import { Component } from 'preact';
import hs from 'preact-hyperstyler';
import style from './style.styl';

const h = hs(style);

export default () => (props) => props
  ? h('div.error.notification.is-error', {}, [typeof props === 'string' ? props : props.error])
  : null;
