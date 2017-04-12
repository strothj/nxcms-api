import { errors } from '../core';
import Site from './site.model';

export const getTitleAndTagline = () => Site.findOne();

/* eslint-disable */
export const setTitleAndTagline = async (user, { title, tagline }) => {
  const err = new Error();
  err.code = errors.ERROR_NOT_AUTHORIZED;
  throw err;
};
