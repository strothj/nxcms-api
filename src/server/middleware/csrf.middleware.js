import CSRF from 'koa-csrf';

const createCSRFMiddleware = () => (
  new CSRF({
    disableQuery: true,
  })
);

export default createCSRFMiddleware;
