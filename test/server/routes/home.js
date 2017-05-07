import createServer from '.../test/server';

describe.skip('server route: /home', () => {
  let destroy, request;

  beforeEach(async() => [{destroy, request}] = await createServer());
  afterEach(() => destroy());

  it('should display welcome on home page', () => {
    return request('/')
      .status(200)
      .body(/welcome/i);
  });
});
