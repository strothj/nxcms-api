const validUsers = () =>
  [
    {
      username: 'bob',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    },
    { username: 'jane', password: 'anotherPassword' },
  ].map(u => ({
    // Add common fields
    ...u,
    displayNameUse: 'username',
    isAdmin: false,
  }));

export default validUsers;
