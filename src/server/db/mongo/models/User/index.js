import { Schema } from 'mongoose';
import _ from 'lodash';
import { getName, getModel } from '.../mongo/utils';
import { hash, compare } from '.../server/utils/hash';
import { db as log } from '.../server/utils/log';

export const name = getName(__dirname);

export const schema = Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String },
  access_token: String,
  verifiedEmail: Boolean,
  role: {
    admin: { type: Boolean, default: true }, // DANGER
    moderator: Boolean,
  },
});

schema.methods = {
  async storeHash(text, key = 'password') {
    this[key] = await hash(text);
    log.info('storeHash', { text, key, hash: this[key] });
  },
  verifyPassword(text) {
    const result = compare(text, this.password);
    log.info('verifyPassword', { text, hash: this.password, result });
    return result;
  },
  toAuthObject() {
    return _.pick(this.toObject(), 'id,name,email,access_token,role'.split(/,/g));
  },
};

export default (connection = name) => getModel(connection, name, schema);
