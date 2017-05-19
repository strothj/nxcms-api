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
    this.router.del('/:id', this.requireSession, this.remove);
    this.router.put(
      '/:id',
      this.requireSession,
      this.validateBody(articleConstraints),
      this.update
    );
  }

  getAll = async ctx => {
    const query = ctx.state.user.isAdmin
      ? {}
      : { editor: { _id: ctx.state.user._id } };
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

  remove = async ctx => {
    const query = ctx.state.user.isAdmin
      ? {}
      : { editor: { _id: ctx.user._id } };
    query._id = ctx.params.id;

    await Article.remove(query);
    ctx.body = { message: 'success' };
  };

  update = async ctx => {
    const articleUpdate = this.lodash.pick(
      ctx.request.body,
      Object.keys(articleConstraints)
    );
    const article = await Article.findById(ctx.params.id);

    // Only admin can edit posts from other users
    if (
      ctx.state.user._id.toString() !== article.editor &&
      !ctx.state.user.isAdmin
    ) {
      ctx.throw(401, 'not authorized');
    }

    // Only admin can reassign editor
    articleUpdate.editor = articleUpdate.editor || article.editor;
    if (articleUpdate.editor !== article.editor && !ctx.state.user.isAdmin) {
      ctx.throw(401, 'not authorized');
    }

    await Article.updateOne({ _id: ctx.params.id }, articleUpdate);
    ctx.body = { message: 'success' };
  };
}

export default ArticleController;
