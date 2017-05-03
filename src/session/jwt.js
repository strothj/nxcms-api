import jwt from 'jsonwebtoken';

const sign = (entity, secret) =>
  new Promise((resolve, reject) => {
    jwt.sign(entity, secret, {}, (err, t) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(t);
    });
  });

const verify = (token, secret) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, {}, (err, t) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(t);
    });
  });

export { sign, verify };
