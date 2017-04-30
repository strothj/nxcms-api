import { expect } from 'chai';
import { promiseError } from '../test-utils';
import * as jwt from './jwt';

const entity = { firstName: 'John', lastName: 'Doe' };
const secret = 'secret';

describe('jwt', () => {
  it('generates jwt', async () => {
    let err = await promiseError(jwt.sign(entity, secret));
    expect(err).to.not.exist;

    const token = await jwt.sign(entity, secret);
    expect(token).to.exist;

    err = await promiseError(jwt.verify(token, secret));
    expect(err).to.not.exist;

    const decoded = await jwt.verify(token, secret);
    expect(decoded.firstName).to.equal(entity.firstName);
    expect(decoded.lastName).to.equal(entity.lastName);

    const invalidToken = `${token}...invalid`;
    err = await promiseError(jwt.verify(invalidToken, secret));
    expect(err).to.exist;
  });
});
