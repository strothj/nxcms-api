import crypto from 'crypto';

const generateSecret = async () => {
  if (process.env.NODE_ENV !== 'production') {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(
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
