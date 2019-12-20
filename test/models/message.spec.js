process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const db = require('../../models');
const MessageModel = require('../../models/message');
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-test-helpers');

chai.use(require('sinon-chai'));

describe('# Message Model', () => {
  const Message = MessageModel(sequelize, dataTypes);
  checkModelName(Message)('Message');

  context('properties', () => {
    const message = new Message();
    ['message', 'UserId'].forEach(checkPropertyExists(message));
  });

  context('associations', () => {
    const User = 'User';
    before(() => {
      Message.associate({ User });
    });

    it('should belong to one user', done => {
      Message.belongsTo.should.have.been.calledWith(User);
      done();
    });
  });

  context('action', () => {
    let data = null;

    it('create', done => {
      db.Message.create()
        .then(message => {
          data = message;
          should.exist(data);
          done();
        })
        .catch(error => console.log(error));
    });

    it('read', done => {
      db.Message.findByPk(data.id)
        .then(message => {
          data.id.should.be.equal(message.id);
          done();
        })
        .catch(error => console.log(error));
    });

    it('update', done => {
      db.Message.update({}, { where: { id: data.id } })
        .then(() => db.Message.findByPk(data.id))
        .then(message => {
          data.updatedAt.should.be.not.equal(message.updatedAt);
          done();
        })
        .catch(error => console.log(error));
    });

    it('delete', done => {
      db.Message.destroy({ where: { id: data.id } })
        .then(() => db.Message.findByPk(data.id))
        .then(message => {
          should.not.exist(message);
          done();
        })
        .catch(error => console.log(error));
    });
  });
});
