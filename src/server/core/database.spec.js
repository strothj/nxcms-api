import { expect } from 'chai';
import mongoose from 'mongoose';
import {
  connect,
  disconnect,
  getTestConnectionString,
} from './database';

const disconnectedState = 0;
const connectedState = 1;

describe('database', () => {
  before(() => {
    disconnect();
    expect(mongoose.connection.readyState).to.equal(disconnectedState);
  });
  afterEach(() => disconnect());

  describe('connect', () => {
    it('can call multiple times without error', async () => {
      await connect();
      await connect();
    });

    describe('during unit tests', () => {
      it('gets connection string from environment', async () => {
        await connect();
        expect(mongoose.connection.readyState).to.equal(connectedState);
      });
    });

    describe('outside of unit tests', () => {
      before(() => { process.env.NODE_ENV = 'development'; });
      after(() => { process.env.NODE_ENV = 'test'; });

      it('rejects on connection failure', (done) => {
        connect('mongodb://99.99.99.99/non-existant')
          .catch(() => { done(); });
      });

      it('connects using provided connection string', async () => {
        expect(mongoose.connection.readyState).to.equal(disconnectedState);
        await connect(getTestConnectionString());
        expect(mongoose.connection.readyState).to.equal(connectedState);
      });
    });
  });

  describe('disconnect', () => {
    it('disconencts from server', async () => {
      await connect();
      expect(mongoose.connection.readyState).to.equal(connectedState);
      await disconnect();
      expect(mongoose.connection.readyState).to.equal(disconnectedState);
    });

    it('returns no error when called multiple times', async () => {
      await disconnect();
      await disconnect();
    });
  });
});
