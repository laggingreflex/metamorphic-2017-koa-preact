import MockLocalStorage from 'mock-localstorage';

export default () => {
  return {
    localStorage: new MockLocalStorage(),
    sessionStorage: new MockLocalStorage(),
  };
};
