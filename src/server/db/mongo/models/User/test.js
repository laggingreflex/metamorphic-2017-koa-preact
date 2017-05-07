// import {
//   name,
//   schema,
//   __RewireAPI__,
// } from './';

// describe('User', () => {
//   describe('storeHash', () => {
//     it('should convert string to hash and store', async() => {
//       const model = {};
//       const string = 'some string';
//       await schema.methods.storeHash.call(model, string);
//       model.password.should.exist;
//       model.password.should.not.equal(string);
//     });
//     it('should convert string to hash and store as "somekey"', async() => {
//       const model = {};
//       const string = 'some string';
//       await schema.methods.storeHash.call(model, string, 'somekey');
//       model.somekey.should.exist;
//       model.somekey.should.not.equal(string);
//     });
//   });
//   describe('verifyPassword', () => {
//     it('verifyPassword', async() => {
//       const model = {};
//       const string = 'some string';
//       await schema.methods.storeHash.call(model, string);
//       assert(await schema.methods.verifyPassword.call(model, string));
//       assert(!await schema.methods.verifyPassword.call(model, 'some other string'));
//     });
//   });
// });
