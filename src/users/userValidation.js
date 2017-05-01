export const username = {
  presence: true,
  format: {
    pattern: /^[a-zA-Z][0-9a-zA-Z]*$/,
    message: 'can only contain letters and numbers',
  },
  length: {
    minimum: 3,
    maximum: 30,
  },
};

export const password = {
  presence: true,
  length: {
    minimum: 5,
    maximum: 100,
  },
};

export const displayNameUse = {
  presence: true,
  inclusion: {
    within: ['name', 'email', 'username'],
    message: 'must be name, email, or username',
  },
};

export const isAdmin = {
  inclusion: [true, false],
};
