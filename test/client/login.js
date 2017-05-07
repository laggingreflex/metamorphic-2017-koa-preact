import { stub } from 'sinon';
import { render } from '.../test/client';
import Login, { __RewireAPI__ } from '.../src/client/app/views/Login';
import mockLocation from '.../test/client/mocks/location';
import mockLocalStorage from '.../test/client/mocks/localstorage';

describe.skip('Login', () => {
  let element, fetch, cleanup, mockLocationCleanup, mockLocalStorageCleanup;

  beforeEach(() => {
    fetch = stub();
    __RewireAPI__.__Rewire__('fetch', fetch);
    mockLocationCleanup = mockLocation();
    mockLocalStorageCleanup = mockLocalStorage();
    [{ cleanup, element }] = render(Login);
  });
  afterEach(() => {
    cleanup();
    mockLocalStorageCleanup();
    mockLocationCleanup();
    __RewireAPI__.__ResetDependency__('fetch');
  });

  it('should not login with invalid email', async() => {
    const loginButton = element.querySelector('form.email button');
    // console.log(`loginButton:`, loginButton);
    fetch.returns(Promise.reject(new Error('some error')))
    loginButton.click();
    console.log('clicked');
    console.log(`element:`, element.innerHTML);

    // const loginMenuLink = document.querySelector('div');
    // const loginMenuLink = document.querySelector('.menu a.login');
    // console.log({ loginMenuLink });
    // console.log(`document.innerHTML:`, document.innerHTML);
    // document.location = 'http://localhost/';
    // loginMenuLink.click()
    // route('/');
    // route('/login');
    // console.log(document.querySelector('.shell .content').innerHTML);
    // console.log('+' + document.location.valueOf());
    // await browser.visit('/login');
    // await browser.click('.menu a.login')
    // console.log({ text: await browser.text() });
  });
});
