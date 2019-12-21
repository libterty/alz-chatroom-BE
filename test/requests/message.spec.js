process.env.NODE_ENV = 'test';

const chai = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const app = require('../../index');
const bcrypt = require('bcryptjs');
const should = chai.should();
const expect = chai.expect;
const db = require('../../models');

describe('# Message Request', () => {
  context('When User Request messages data', () => {
    before(async () => {
      let token;
      await db.User.create({
        name: 'test1',
        email: 'test1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        isAdmin: true
      });
      await db.User.create({
        name: 'test2',
        email: 'test2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        isAdmin: false
      });
      await db.Message.create({ message: '測試1', UserId: 1 });
      await db.Message.create({ message: '測試2', UserId: 2 });
    });

    it('should return 200 and get token', done => {
      request(app)
        .post('/api/signin')
        .send({ email: 'test1@example.com', password: '12345678' })
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body.status).to.equal('success');
          expect(res.body.token).not.to.equal(undefined);
          token = res.body.token;
          done();
        });
    });

    it('should return 200 and get token', done => {
      request(app)
        .get('/api/chatroom')
        .set('Authorization', 'bearer ' + token)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body.status).to.equal('success');
          expect(res.body.messages[0].message).to.equal('測試1');
          expect(res.body.messages[1].message).to.equal('測試2');
          expect(res.body.messages[0].username).to.equal('test1');
          expect(res.body.messages[1].username).to.equal('test2');
          token = res.body.token;
          done();
        });
    });

    after(async () => {
      await db.User.destroy({ where: {}, truncate: true });
      await db.Message.destroy({ where: {}, truncate: true });
    });
  });

  context('When User Request to send message data', () => {
    before(async () => {
      let token;
      await db.User.create({
        name: 'test1',
        email: 'test1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        isAdmin: true
      });
      await db.User.create({
        name: 'test2',
        email: 'test2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
        isAdmin: false
      });
      await db.Message.create({ message: '測試1', UserId: 1 });
      await db.Message.create({ message: '測試2', UserId: 2 });
    });

    it('should return 200 and get token', done => {
      request(app)
        .post('/api/signin')
        .send({ email: 'test1@example.com', password: '12345678' })
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body.status).to.equal('success');
          expect(res.body.token).not.to.equal(undefined);
          token = res.body.token;
          done();
        });
    });

    it('should return 200 and should create new message', done => {
      request(app)
        .post('/api/chatroom/create')
        .send({ message: '測試3', UserId: 1 })
        .set('Authorization', 'bearer ' + token)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          db.Message.findByPk(3).then(msg => {
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal('Add New Message');
            expect(msg.dataValues.message).to.equal('測試3');
            return done();
          });
        });
    });

    after(async () => {
      await db.User.destroy({ where: {}, truncate: true });
      await db.Message.destroy({ where: {}, truncate: true });
    });
  });
});
