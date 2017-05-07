import mongoose from 'mongoose';
import config from '.../config';

export default (connection = mongoose, name, schema) => {
  if (typeof connection === 'string') {
    connection = (config.mongodbName || config.dbName) + '_' + connection;
    connection = mongoose.connections.find(c => c.name === connection) || mongoose.connections[0].useDb(connection);
  }
  let model;
  try {
    model = connection.model(name);
  } catch (err) {
    model = connection.model(name, schema);
  }
  return model;
};
