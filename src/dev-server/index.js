import http from 'http';
import app from './server';

const server = http.createServer(app.callback()).listen(3001);

module.hot.accept('./server', () => {
  server.removeAllListeners('request', server);
  server.on('request', app.callback());
});
