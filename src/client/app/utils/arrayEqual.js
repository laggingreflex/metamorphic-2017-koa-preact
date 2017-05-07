export default (a = [], b = [], strict = false) => {
  if (strict && a.length !== b.length) {
    return false;
  }
  const [shortest, largest] = [a.length, b.length].sort();

  for (let i = 0; i < shortest; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
};
