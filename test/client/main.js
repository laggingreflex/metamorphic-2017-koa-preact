import createApp from './';

describe.skip('client', () => {
  let dom, destroy;
  beforeEach(() => [{dom, destroy}] = createApp());
  afterEach(() => destroy());

  it('test', () => {
    // console.log({ app: app.innerHTML });
    dom.should.contain('.shell');
    dom.should.contain('.menu');
  });
});
