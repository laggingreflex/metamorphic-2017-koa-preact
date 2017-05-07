import mockLocation from 'mock-location';
import global from './global';

export default () => {
  const location = mockLocation();
  const referrer = mockLocation();

  const document = { referrer };

  const locationGetter = {
    get: () => location,
    set: (val) => location.replace(val),
    configurable: true,
  };

  Object.defineProperty(document, 'location', locationGetter);

  return global({
    document,
    location: locationGetter
  });
};
