import { expect } from 'chai';
import mongoose, { Schema } from 'mongoose';
import { database } from '../core';
import service from './service';

const schema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
  },
});

const Model = mongoose.model('serviceTestModel', schema);

describe('Service', () => {
  before(() => database.connect());
  beforeEach(() => Model.remove({}));

  it('filters out MongoDB query strings', (done) => {
    /* eslint-disable class-methods-use-this */
    const expected = { username: {} };
    const injected = { username: {}, $gt: '' };

    @service
    class SomeService {
      someMethod(doc) {
        expect(doc).to.deep.equal(expected);
      }

      nonObjectMethod(nonDoc) {
        expect(nonDoc).to.equal(3);
      }

      static staticMethod(doc) {
        expect(doc).to.deep.equal(expected);
        done();
      }
    }

    const svc = new SomeService();
    svc.someMethod(injected);
    svc.nonObjectMethod(3);
    SomeService.staticMethod(injected);
    /* eslint-enable */
  });

  xit('converts Mongo validation errors into service validation errors', async () => {

  });
});
