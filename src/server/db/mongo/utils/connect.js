import mongoose from 'mongoose';
import URL from 'url';
import getUrl from './getUrl';
import { db as log } from '.../server/utils/log';

mongoose.Promise = Promise;

let connected = false;

export default async(opts) => {
  const url = getUrl(opts);

  if (connected) {
    log.info('Already connected to', url);
    return;
  }
  try {
    log.info('Connecting to', url + '...');
    await mongoose.connect(url);
    log.info('Connected to', url);
    connected = true;
  } catch (err) {
    let parsed = URL.parse(url);
    if (parsed.protocol !== 'mongodb:') {
      log.warn(`It's adviced to use 'mongodb://' protocol`)
      if (!parsed.port) {
        log.warn(`'${parsed.protocol}' protocol is used without a port specified`)
      } else if (parseInt(parsed.port) !== 27018) {
        log.warn(`'${parsed.protocol}' protocol is used with ${27018} port`)
      }
    }
    log.error(`Couldn't connect to`, url, err.message);
    throw err;
  }
};
