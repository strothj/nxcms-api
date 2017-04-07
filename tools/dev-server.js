import http from 'http';
import express from 'express';
import apiServer from '../src/server';

const createApp = () => {
  const app = express();
  app.use('/api/', apiServer);
  return app;
};

const port = process.env.PORT || 3001;

let currentApp = createApp();
const server = http.createServer(currentApp);
server.listen(port);
console.log(`Server listening on port ${port}`); // eslint-disable-line no-console

module.hot.accept('../src/server', () => {
  server.removeListener('request', currentApp);
  currentApp = createApp();
  server.on('request', currentApp);
});
