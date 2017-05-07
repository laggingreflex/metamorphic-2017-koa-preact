import IO from 'socket.io';
import wildcard from 'socketio-wildcard';
import _ from 'lodash';
import { createLogger } from '../utils/log';

const Log = createLogger({ name: 'sio' });

export const attach = app => {
  const io = app.io = new IO(app.server);

  app.io.log = Log;

  io.use(wildcard());
  io.use((socket, next) => {
    socket.log = Log.child(_.pick(socket, ['id']));
    socket.log.info('Incoming socket');
    socket.on('*', ({ data: [event, data] }) => socket.log.info(`on('${event}')`, data));
    return next();
  });

  io.on('connection', socket => socket.log.info('on(\'connection\')'));
  io.on('disconnect', socket => socket.log.info('on(\'disconnect\')'));
  io.on('reconnect', socket => socket.log.info('on(\'reconnect\')'));
};
