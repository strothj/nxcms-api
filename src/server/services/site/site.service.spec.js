import { expect } from 'chai';
import { database, errors } from '../../core';
import Site from './site.model';
import {
  getTitleAndTagline,
  setTitleAndTagline,
} from './site.service';

const validSiteEntry = { title: 'blog title', tagline: 'blog tagline' };
const nonAdminUser = {};
// eslint-disable-next-line
const adminUser = { isAdmin: true };

describe('Site service', () => {
  before(() => database.connect());

  beforeEach(() => Site.remove({}));

  describe('getTitleAndTagline', () => {
    it('returns existing', async () => {
      const expected = (await Site.create(validSiteEntry)).toJSON();
      const actual = (await getTitleAndTagline()).toJSON();

      expect(actual).to.deep.equal(expected);
    });
  });

  describe('setTitleAndTagline', () => {
    it('rejects if not admin', async () => {
      let err;

      try { await setTitleAndTagline(nonAdminUser, validSiteEntry); } catch (e) { err = e; }

      expect(err.code).to.equal(errors.ERROR_NOT_AUTHORIZED);
    });

    it('updates if admin', async () => {
      //
    });
  });
});
