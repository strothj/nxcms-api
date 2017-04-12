import { expect } from 'chai';
import mongoose, { Schema } from 'mongoose';
import {
  connect,
  disconnect,
  drop,
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

  describe('drop', () => {
    const someSchema = new Schema({ field: String });
    const SomeModel = mongoose.model('SomeModel', someSchema);

    beforeEach(async () => {
      await connect();
      await SomeModel.create({ field: '123' });
    });

    afterEach(() => (disconnect()));

    it('drops database after connection', async () => {
      let items = await SomeModel.find({});
      expect(items).to.have.length(1);

      await drop();
      items = await SomeModel.find({});
      expect(items).to.have.length(0);
    });

    it('drops database before connection', async () => {
      let items = await SomeModel.find({});
      expect(items).to.have.length(1);

      await disconnect();
      await Promise.all([
        drop(),
        connect(),
      ]);

      items = await SomeModel.find({});
      expect(items).to.have.length(0);
    });
  });
});
