import bcrypt from 'bcrypt';
import validUsers from './validUsers';

const validUsersDB = () =>
  validUsers().map(u => ({
    ...u,
    password: bcrypt.hashSync(u.password, 1),
  }));

export default validUsersDB;
