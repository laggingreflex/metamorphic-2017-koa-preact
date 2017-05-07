import URL from 'url';
import config from '.../config';

export default ({
  mongodbUrl = config.mongodbUrl,
  dbName: argDbName = config.mongodbName || config.dbName,
  port = config.mongodbPort,
  host = config.mongodbHostname,
  hostname = config.mongodbProtocol || 'localhost',
  protocol = config.mongodbProtocol || 'mongodb:',
} = {}) => {
  let url;
  if (mongodbUrl) {
    try {
      url = URL.parse(mongodbUrl);
    } catch (err) {
      err.message = `Couldn't parse mongodbUrl specified: "${mongodbUrl}". ` + err.message;
      throw err;
    }
    const urlDbName = url.path;
    let chosenDbName
    if (argDbName) {
      chosenDbName = urlDbName + '_' + argDbName;
    } else {
      chosenDbName = urlDbName;
    }
    url.path = chosenDbName;
    url = URL.format(url);
  } else {
    url = URL.format({
      protocol,
      port,
      host,
      hostname,
      path: argDbName
    });
  }
  return url;
}
