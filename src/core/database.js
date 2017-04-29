import mongoose from 'mongoose';
import config from '../config';

mongoose.Promise = Promise;

let initialized = false;

export const connect = async () => {
  if (!config.mongoDatabaseUrl)
    throw new Error('database connection string is required');

  if (initialized) return;

  if (process.env.NODE_ENV !== 'test') {
    console.log('Starting database connection'); // eslint-disable-line no-console
  }
  await mongoose.connect(config.mongoDatabaseUrl);
  initialized = true;
};

export const disconnect = () =>
  new Promise((resolve, reject) => {
    if (!initialized) {
      resolve();
      return;
    }

    const resetState = () => {
      initialized = false;
      if (mongoose.connection.readyState !== 0 /* disconnected */) {
        reject(new Error('mongo connection could not be disconnected'));
        return;
      }
      resolve();
    };

    // disconnect callback is called while connection is in the "disconnecting"
    // state rather than the "disconnected" state. Only call resetState through
    // the callback when the connection is reported to be disconnected.
    mongoose.connection.once('disconnected', resetState);
    mongoose.disconnect(err => {
      if (err) resetState();
    });
  });

export const drop = () => mongoose.connection.dropDatabase();

// Ignore changes to config file during development to squash already connected
// errors.
if (module.hot) {
  module.hot.accept('../config');
}
