import { arrifyViews } from '.';

export default function flattenViews(views, array = [], parents = []) {
  arrifyViews(views).forEach(view => {
    array.push({ view, parents });
    if (view.views) {
      flattenViews(view.views, array, [view, ...parents]);
    }
  });
  return array;
}
