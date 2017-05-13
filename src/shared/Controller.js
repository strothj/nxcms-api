import lodash from 'lodash';
import Router from 'koa-router';
import requireAdmin from './requireAdmin';
import requireSession from './requireSession';
import validateBody from './validateBody';
import validateHeaders from './validateHeaders';

export default class Controller {
  constructor(name) {
    this.lodash = lodash;
    this.router = new Router();
    this.name = name;
    this.requireAdmin = requireAdmin;
    this.requireSession = requireSession;
    this.validateBody = validateBody;
    this.validateHeaders = validateHeaders;
  }

  // eslint-disable-next-line class-methods-use-this
  async bootstrap() {
    return Promise.resolve();
  }
}
