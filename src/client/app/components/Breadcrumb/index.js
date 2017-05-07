import hs from 'preact-hyperstyler';
import changeCase from 'change-case';
import { getViewPath } from 'app/utils';
import style from './style.styl';

const h = hs(style);

export default ({} = {}) => ({ chain = [] } = {}) =>
h('ol.breadcrumb', {}, chain.map((c, i) =>
  h('li.item', {}, [
    h('a', {
      href: getViewPath(c, chain.slice(0, i).reverse())
    }, [
      changeCase.titleCase(c.title || c.exportedName || c.name)
    ])
  ])
));
