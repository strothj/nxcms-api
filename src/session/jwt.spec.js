import { expect } from 'chai';
import * as jwt from './jwt';

const entity = { firstName: 'John', lastName: 'Doe' };
const secret = 'secret';

describe('jwt', () => {
  it('generates jwt', async () => {
    await jwt.sign(entity, secret);

    const token = await jwt.sign(entity, secret);
    expect(token).to.exist;

    await jwt.verify(token, secret);

    const decoded = await jwt.verify(token, secret);
    expect(decoded.firstName).to.equal(entity.firstName);
    expect(decoded.lastName).to.equal(entity.lastName);

    const invalidToken = `${token}...invalid`;
    let err;
    await jwt.verify(invalidToken, secret).catch(e => {
      err = e;
    });
    expect(err).to.exist;
  });
});
