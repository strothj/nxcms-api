import bodyParser from 'koa-bodyparser';

const createBodyParserMiddleware = enabledType => (
  bodyParser({
    enabledTypes: [enabledType],
  })
);

export default createBodyParserMiddleware;
