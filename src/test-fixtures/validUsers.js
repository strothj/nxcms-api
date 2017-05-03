const validUsers = () =>
  [
    { username: 'bob', password: 'password123' },
    { username: 'jane', password: 'anotherPassword' },
  ].map(u => ({
    // Add common fields
    ...u,
    displayNameUse: 'username',
    isAdmin: false,
  }));

export default validUsers;
