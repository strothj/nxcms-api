import http from 'http';
import config from './config';
import app from './server';

const server = http.createServer(app.callback());
server.listen(config.port);

if (module.hot) {
  module.hot.accept('./server', () => {
    server.removeAllListeners('request');
    server.on('request', app.callback());
  });
}
