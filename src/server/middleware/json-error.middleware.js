import error from 'koa-json-error';

const formatError = err => ({
  message: (() => {
    if (err.status === 422) return err.message;
    return 'an unexpected error occured';
  })(),
  name: err.status === 422 ? 'ValidationError' : 'Error',
  status: err.status,
  stack: process.env.NODE_ENV === 'development' ? err.stack : null,
});

const createErrorMiddleware = () => (
  error({
    format: formatError,
  })
);

export default createErrorMiddleware;
