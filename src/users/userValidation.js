export const username = {
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
  length: {
    minimum: 5,
    maximum: 100,
  },
};

export const email = {
  length: {
    minimum: 5,
    maximum: 100,
  },
  email: true,
};

export const firstName = (value, attributes, attributeName) => {
  if (attributes.firstName || attributes.lastName)
    return {
      presence: {
        message: `must be supplied with ${attributeName === 'firstName' ? 'last name' : 'first name'}`,
      },
    };
  return { presence: false };
};

export const lastName = firstName;

// Only allow user to set their name display setting to a field that was provided.
export const displayNameUse = (value, attributes) => {
  const allowedFields = [];
  if (attributes.username) allowedFields.push('username');
  if (attributes.firstName && attributes.lastName) allowedFields.push('name');
  if (attributes.email) allowedFields.push('email');
  return {
    inclusion: {
      within: allowedFields,
      message: 'can only be one of supplied fields "name", "email", "username',
    },
  };
};
