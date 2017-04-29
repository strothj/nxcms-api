import http from 'http';
import config from './config';
import createApp from './server';

const server = http.createServer();

createApp().then(app => {
  server.on('request', app.callback());
  server.listen(config.port);
  console.log(`Server listening on port ${config.port}`); // eslint-disable-line no-console
});

if (module.hot) {
  module.hot.accept('./server', async () => {
    server.removeAllListeners('request');
    server.on('request', (await createApp()).callback());
  });

  // Ignore changes in config file during development.
  module.hot.accept('./config');
}
