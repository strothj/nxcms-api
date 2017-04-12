import mongoose from 'mongoose';

const DEFAULT_TEST_DB = 'mongodb://localhost/nxcms-api-test';

export const getTestConnectionString = () => (
  process.env.DB_TEST || DEFAULT_TEST_DB
);

mongoose.Promise = Promise;

let initialized = false;

export const connect = async (connectionString) => {
  if (process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line no-param-reassign
    connectionString = getTestConnectionString();
  }

  if (!connectionString) throw new Error('database connection string is required');

  const opts = process.env.NODE_ENV !== 'development' ? {} : {
    server: { socketOptions: { connectTimeoutMS: 25 } },
  };

  if (initialized) return;

  await mongoose.connect(connectionString, opts);
  initialized = true;
};

export const disconnect = () => new Promise((resolve, reject) => {
  if (!initialized) { resolve(); return; }

  const resetState = () => {
    initialized = false;
    if (mongoose.connection.readyState !== 0 /* disconnected */) {
      reject(new Error('mongo connection could not be disconnected')); return;
    }
    resolve();
  };

  // disconnect callback is called while connection is in the "disconnecting"
  // state rather than the "disconnected" state. Only call resetState through
  // the callback when the connection is reported to be disconnected.
  mongoose.connection.once('disconnected', resetState);
  mongoose.disconnect((err) => {
    if (err) resetState();
  });
});

export const drop = () => (mongoose.connection.dropDatabase());
