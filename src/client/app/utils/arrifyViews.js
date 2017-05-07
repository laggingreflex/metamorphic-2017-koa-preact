import changeCase from 'change-case';
import { getViewPath } from '.';

export default (views) => Object.entries(views).map(([name, viewFactory]) => {
  const view = viewFactory();
  view.exportName = viewFactory.name || name;
  view.title = view.title || changeCase.titleCase(view.exportedName || view.name);
  return view;
});
