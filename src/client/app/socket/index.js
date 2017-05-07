import io from 'socket.io-client';

const socket = io(process.env.API_HOST);

export default socket;
