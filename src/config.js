export default {
  port: process.env.PORT || 3000,
  mongoDatabaseUrl: (() => {
    if (process.env.NODE_ENV === 'test') return process.env.MONGODB_URL_TEST || 'mongodb://localhost/nxcms-api-test';
    if (process.env.NODE_ENV === 'development') return process.env.MONGODB_URL_DEV || 'mongodb://localhost/nxcms-api-dev';
    return process.env.MONGODB_URL || 'mongodb://localhost/nxcms-api';
  })(),
  isDemoMode: !!process.env.DEMO_MODE,
  bcryptSaltRounds: process.env.BCRYPT_ROUNDS ? parseInt(process.env.BCRYPT_ROUNDS, 10) : 10,
};
