export default (obj) => {
  const prev = {};
  for (const key in obj) {
    prev[key] = global[key];
    Object.defineProperty(global, key, {
      configurable: true
    });
    delete global[key];
    if (obj[key].get) {
      Object.defineProperty(global, key, obj[key]);
    } else {
      Object.defineProperty(global, key, {
        get: () => obj[key],
        set: (val) => obj[key] = val,
        configurable: true,
      });
    }
  }
  return () => {
    for (const key in obj) {
      Object.defineProperty(global, key, {
        configurable: true
      });
      delete global[key];
      if (prev[key] !== undefined) {
        global[key] = prev[key];
      }
    }
  };
};
