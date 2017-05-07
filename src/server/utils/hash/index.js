import hashifier from 'hashifier';
import config from '../../../../config';

const defaults = {
  iterations: 1000 * config.isDev ? 1 : 100,
  algorithm: 'sha512',
  encoding: 'hex',
  saltLength: 128,
  keyLength: 128,
};

export const hash = async(text, opts = {}) => {
  const { hash, salt } = await hashifier.hash(text, { ...defaults, ...opts });
  // console.log({ salt, hash });
  // console.log({ saltLength: salt.length });
  return salt + hash;
};
export const compare = (text, saltedHash, opts = {}) => {
  opts = Object.assign({}, defaults, opts);

  const saltLength = opts.saltLength * 2;
  // const saltLength = parseInt(opts.saltLength * ((opts.saltLength + opts.keyLength) / opts.saltLength), 10);
  // const saltLength = opts.saltLength + opts.keyLength;

  const salt = saltedHash.substr(0, saltLength);
  const hash = saltedHash.substr(saltLength);

  // console.log({ saltLength });
  // console.log({ salt, hash });

  return hashifier.compare(text, hash, salt, opts);
};
