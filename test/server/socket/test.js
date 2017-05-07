import Counter from 'assertions-counter';
import createServer from '.../test/server';

describe.skip('server socket', () => {
  let app, destroy, getClientSocket;

  beforeEach(async() => [{ app, destroy, getClientSocket }] = await createServer());
  afterEach(() => destroy());

  it('should test socket', (done) => {
    const { add: ok } = new Counter(2, done);
    app.io.on('connection', () => ok());
    getClientSocket().on('connect', () => ok());
  });
});
