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

// Only allow user to set their name display setting to a field that was provided.
export const displayNameUse = (value, attributes) => {
  const allowedFields = [];
  if (attributes.username) allowedFields.push('username');
  if (attributes.firstName && attributes.lastName) allowedFields.push('name');
  if (attributes.email) allowedFields.push('email');
  return {
    presence: true,
    inclusion: {
      within: allowedFields,
      message: 'can only be one of supplied fields "name", "email", "username',
    },
  };
};

export const isAdmin = {
  inclusion: [true, false],
};
