import changeCase from 'change-case';

export default function getViewPath(view, parents) {
  if (view) {
    let path;
    if (view.path) {
      path = view.path;
    }
    if (!path) {
      const name = view.exportedName || view.name;
      if (!name) {
        throw new Error('Couldn\'t get a valid path for this view');
      }
      path = '/' + changeCase.paramCase(name);
    }
    if (parents) {
      parents.forEach(parent => {
        let parentPath = getViewPath(parent);
        if (parentPath) {
          if (parentPath.endsWith('/')) {
            parentPath = parentPath.substr(0, parentPath.length - 1);
          }
          if (path.startsWith('/')) {
            path = path.substr(1);
          }
          path = parentPath + '/' + path;
        }
      });
    } else if (view.parent) {
      let parentPath = getViewPath(view.parent);
      if (parentPath) {
        if (parentPath.endsWith('/')) {
          parentPath = parentPath.substr(0, parentPath.length - 1);
        }
        if (path.startsWith('/')) {
          path = path.substr(1);
        }
        path = parentPath + '/' + path;
      }
    }
    if (!path.endsWith('/')) {
      path += '/';
    }
    return path;
  } else {
    return '';
  }
}
