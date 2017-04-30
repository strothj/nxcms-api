import bcrypt from 'bcrypt';
import validUserCredentials from './validUserCredentials';

const validUsers = validUserCredentials.map(u => ({
  username: u.username,
  password: bcrypt.hashSync(u.password, 1),
  displayNameUse: 'username',
  isAdmin: false,
}));

export default validUsers;
