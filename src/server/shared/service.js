import sanitize from 'mongo-sanitize';

const sanitizeWrapper = fn => (doc, ...rest) => {
  if (typeof doc !== 'object') {
    fn(doc, ...rest);
    return;
  }

  const unsanitizedDoc = Object.assign({}, doc);
  fn(sanitize(unsanitizedDoc), ...rest);
};

const applyFunctionWrapper = (target, mixins) => {
  /* eslint-disable no-param-reassign */
  mixins.forEach((mixin) => {
    Object.getOwnPropertyNames(target).forEach((key) => {
      if (typeof target[key] !== 'function') return;
      if (key === 'constructor') return;
      target[key] = mixin(target[key]);
    });
  });
  /* eslint-enable */
};

const service = (target) => {
  applyFunctionWrapper(target, [sanitizeWrapper]); // static methods
  applyFunctionWrapper(target.prototype, [sanitizeWrapper]); // instance methods
};

export default service;
