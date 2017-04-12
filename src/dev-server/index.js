import http from 'http';
import createServer from './server';

const server = http.createServer();
server.listen(3001);

const setHandler = async () => {
  try {
    const app = await createServer();
    app.keys = ['dev-key'];
    server.on('request', app.callback());
  } catch (e) {
    console.error('createServer:', e); // eslint-disable-line no-console
  }
};

setHandler();

module.hot.accept('./server', () => {
  server.removeAllListeners('request');
  setHandler();
});
