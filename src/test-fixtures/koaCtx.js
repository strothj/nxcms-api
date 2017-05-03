const throwMock = (status, message, mergeFields) => {
  const err = new Error(message);
  err.status = status;
  if (mergeFields) {
    Object.getOwnPropertyNames(mergeFields).forEach(f => {
      err[f] = mergeFields[f];
    });
  }
  throw err;
};

/**
 * Returns an empty Koa mock context with empty request and response body. It
 * also has a basic implementation of the throw method.
 * {@link http://koajs.com/#context}
 */
const koaCtx = () => ({
  body: {},
  headers: {},
  request: { body: {} },
  state: {},
  throw: throwMock,
});

export default koaCtx;
