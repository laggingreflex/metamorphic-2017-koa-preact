// import Counter from 'assertions-counter';
// import { route } from 'preact-router'
// import createServer from '.../test/server';
// import createApp from '.../test/client/app';

describe.skip('e2e login', () => {
  let browser, dom, destroy;

  // beforeEach(async() => [{ browser, destroy }] = await createServer());
  beforeEach(async() => [{ browser, dom, destroy }] = await createApp());
  afterEach(() => destroy());

  it('should not login with invalid email', async() => {
    // const loginMenuLink = document.querySelector('.menu a.login');
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
