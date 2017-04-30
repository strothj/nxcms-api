// import { expect } from 'chai';
// import { promiseError } from '../test-utils';
import { database } from '../core';
// import { userController} from '../users';
// import sessionController from './sessionController';

describe('SessionController', () => {
  before(() => database.connect());

  beforeEach(async () => {
    await database.drop();
    // await userController.bootstrap();
  });

  describe('login', () => {
    it('throws 401 error on incorrect username', async () => {
      // const err = await promiseError()
    });
  });
});
