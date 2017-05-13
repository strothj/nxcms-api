import { Controller } from '../shared';
import Article from './Article';
import * as articleValidation from './articleValidation';

const articleConstraints = {
  ...articleValidation,
};

class ArticleController extends Controller {
  constructor() {
    super('articles');

    this.router.get('/', this.requireSession, this.getAll);
    this.router.post(
      '/',
      this.requireSession,
      this.validateBody(articleConstraints),
      this.create
    );
  }

  getAll = async ctx => {
    const query = ctx.state.user.isAdmin
      ? {}
      : { editor: { _id: ctx.user._id } };
    const articles = await Article.find(query);
    ctx.body = articles;
  };

  create = async ctx => {
    const newArticle = this.lodash.pick(
      ctx.request.body,
      Object.keys(articleConstraints)
    );
    newArticle.editor = ctx.state.user._id;

    await Article.create(newArticle);
    ctx.body = { message: 'success' };
  };
}

export default ArticleController;
