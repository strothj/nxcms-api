import validate from 'validate.js';

const singleWord = /^[a-z]+$/;

validate.validators.tags = value => {
  if (!value) return null;
  if (!validate.isArray(value)) return 'must be an array';
  if (value.length === 0) return 'can not be empty';
  for (let i = 0; i < value.length; i += 1) {
    if (!singleWord.test(value[i])) return 'must be lowercase single word';
  }
  return null;
};

export const editor = { length: { is: 24 } }; // Mongoose ID hex length

export const publishDate = {};

export const title = { length: { minimum: 4, maximum: 100 } };

export const headerImageURL = { url: true };

export const headerImageAttributionURL = { url: true };

export const headerImageAttributionText = {
  length: { minimum: 4, maximum: 30 },
};

export const slug = {
  format: { pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ },
  length: { maximum: 200 },
};

export const category = {
  format: { pattern: singleWord },
  length: { minimum: 4, maximum: 30 },
};

export const tags = {
  tags: true,
};

export const synopsis = { length: { minimum: 4, maximum: 500 } };

export const youtubeVideoID = { length: { minimum: 4, maximum: 30 } };

export const content = { length: { minimum: 10 } };
