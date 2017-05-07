import Counter from 'assertions-counter';
import createServer from '.../test/server';

describe.skip('e2e socket', () => {
  let app, destroy, getClientSocket;

  beforeEach(async() => [{ app, destroy, getClientSocket }] = await createServer());
  afterEach(() => destroy());

  it('should test e2e socket', (done) => {
    const { add: ok } = new Counter(2, done);
    const testData = { some: 'data' };
    let clientSocket;
    app.io.on('connection', serverSocket => {
      clientSocket.on('test', data => {
        data.should.deep.equal(testData);
        ok();
      });
      serverSocket.emit('test', testData);

      serverSocket.on('test', data => {
        data.should.deep.equal(testData);
        ok();
      });
      clientSocket.emit('test', testData);
    });
    clientSocket = getClientSocket();
  });
});
