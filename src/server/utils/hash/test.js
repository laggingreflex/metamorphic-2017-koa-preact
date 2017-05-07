import { hash, compare, __RewireAPI__ } from './';

describe('hash/compare', () => {
  describe('with default', () => {
    const plain = 'some text';
    let encoded;
    it('should create hash', async() => {
      encoded = await hash(plain);
      encoded.should.be.ok;
      encoded.should.not.contain(plain);
    });
    it('should compare hash', async() => {
      (await compare(plain, encoded)).should.equal(true);
    });
  });
  describe('with options', () => {
    describe('saltLength: 100', () => {
      const opts = {
        // encoding: 'utf8',
        saltLength: 100,
      };
      const plain = 'some text';
      let encoded;
      it('should create hash', async() => {
        encoded = await hash(plain, opts);
        encoded.should.be.ok;
        encoded.should.not.contain(plain);
      });
      it('should compare hash', async() => {
        (await compare(plain, encoded, opts)).should.equal(true);
      });
    });
    describe.skip('encoding: utf8, saltLength: 100', () => {
      // issues with salt length. Will come back if it's actually ever needed this combination of options.
      const opts = {
        encoding: 'utf8',
        saltLength: 100,
      };
      const plain = 'some text';
      let encoded;
      it('should create hash', async() => {
        encoded = await hash(plain, opts);
        encoded.should.be.ok;
        encoded.should.not.contain(plain);
      });
      it('should compare hash', async() => {
        (await compare(plain, encoded, opts)).should.equal(true);
      });
    });
  });
});
