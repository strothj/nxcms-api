import { expect } from 'chai';
import mongoose, { Schema } from 'mongoose';
import { connect, disconnect, drop } from './database';

const disconnectedState = 0;
const connectedState = 1;

describe('database', () => {
  before(() => disconnect());
  afterEach(() => disconnect());

  describe('connect', () => {
    it('can call multiple times without error', async () => {
      await connect();
      await connect();
    });

    it('connects to database', async () => {
      await connect();
      expect(mongoose.connection.readyState).to.equal(connectedState);
    });
  });

  describe('disconnect', () => {
    it('disconnects from server', async () => {
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
      await Promise.all([drop(), connect()]);

      items = await SomeModel.find({});
      expect(items).to.have.length(0);
    });
  });
});
