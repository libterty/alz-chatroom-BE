process.env.NODE_ENV = 'test';

const chai = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const app = require('../../index');
const bcrypt = require('bcryptjs');
const should = chai.should();
const expect = chai.expect;
const db = require('../../models');

describe('# Admin Request', () => {
  context('When Admin request all users data', () => {
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

    it('should return 200 with users data', done => {
      request(app)
        .get('/api/admin/users')
        .set('Authorization', 'bearer ' + token)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body.status).to.equal('success');
          expect(res.body.users[0].name).to.equal('test1');
          expect(res.body.users[0].isAdmin).to.equal(true);
          done();
        });
    });

    after(async () => {
      await db.User.destroy({ where: {}, truncate: true });
    });
  });

  context('When Admin request to change users auth', () => {
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

    it('should return 200 with Update user success', done => {
      request(app)
        .put('/api/admin/users/2')
        .set('Authorization', 'bearer ' + token)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          db.User.findByPk(2).then(user => {
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal('Update user success');
            expect(user.dataValues.isAdmin).to.equal(true);
            return done();
          });
        });
    });

    after(async () => {
      await db.User.destroy({ where: {}, truncate: true });
    });
  });

  context('When Admin request to delete user', () => {
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

    it('should return 200 with delete user success', done => {
      request(app)
        .delete('/api/admin/users/2')
        .set('Authorization', 'bearer ' + token)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          db.User.findAll().then(users => {
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal('Delete user success');
            expect(users[1]).to.equal(undefined);
            return done();
          });
        });
    });

    after(async () => {
      await db.User.destroy({ where: {}, truncate: true });
    });
  });
});
