import { expect } from 'chai';

describe('Test environment', () => {
  it('environment should equal "test"', () => {
    expect(process.env.NODE_ENV).to.equal('test');
  });
});
