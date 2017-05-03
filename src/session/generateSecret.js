import crypto from 'crypto';

// eslint-disable-next-line no-console
const generateSecret = async (env = process.env, logger = console.log) => {
  if (env !== 'production') {
    if (env === 'development') {
      logger(
        'WARNING: Using development mode secret for authorization middleware'
      );
    }
    return 'secret';
  }

  return new Promise((resolve, reject) => {
    crypto.randomBytes(100, (err, buf) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(buf);
    });
  });
};

export default generateSecret;
