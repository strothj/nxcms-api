import { expect } from 'chai';
import sinon from 'sinon';
import generateSecret from './generateSecret';

const noOpLogger = () => {};

describe('generateSecret', () => {
  it('returns "secret" in development and testing environments', async () => {
    expect(await generateSecret('development', noOpLogger)).to.equal('secret');
    expect(await generateSecret('test')).to.equal('secret');
    expect(await generateSecret('production')).to.not.equal('secret');
  });

  it('generates crypto string in production', async () => {
    expect(await generateSecret('production')).to.have.length(100);
  });

  it('emits warning in development mode', async () => {
    const logger = sinon.spy();

    await generateSecret('development', logger);

    expect(logger.called).to.be.true;
  });
});
