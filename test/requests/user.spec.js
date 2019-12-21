process.env.NODE_ENV = 'test';

const chai = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const app = require('../../index');
const bcrypt = require('bcryptjs');
const should = chai.should();
const expect = chai.expect;
const db = require('../../models');

describe('# User Auth Request', () => {
  context('# SignIn Request', () => {
    describe('When request signin', () => {
      before(async () => {
        await db.User.create({
          name: 'tes1',
          email: 'test1@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          admin: true
        });
      });

      it('should return 400 and get error message', done => {
        request(app)
          .post('/api/signin')
          .send({ email: '', password: '' })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal("required fields didn't exist");
            done();
          });
      });

      it('should return 401 and get error message', done => {
        request(app)
          .post('/api/signin')
          .send({ email: 'test@example.com', password: '12345678' })
          .set('Accept', 'application/json')
          .expect(401)
          .end((err, res) => {
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal(
              'no such user found or passwords did not match'
            );
            done();
          });
      });

      it('should return 401 and get error message', done => {
        request(app)
          .post('/api/signin')
          .send({ email: 'test1@example.com', password: '1234' })
          .set('Accept', 'application/json')
          .expect(401)
          .end((err, res) => {
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal(
              'no such user found or passwords did not match'
            );
            done();
          });
      });

      it('should return 200 and get user data', done => {
        request(app)
          .post('/api/signin')
          .send({ email: 'test1@example.com', password: '12345678' })
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.equal('success');
            expect(res.body.token).not.to.equal(undefined);
            done();
          });
      });

      after(async () => {
        await db.User.destroy({ where: {}, truncate: true });
      });
    });
  });

  context('# SignUp Request', () => {
    describe('When request signup', () => {
      before(async () => {
        await db.User.create({
          name: 'test1',
          email: 'test1@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          admin: false
        });
        await db.User.create({
          name: 'test2',
          email: 'test2@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          admin: false
        });
      });

      it('should return 400 with 請填入使用者名稱！', done => {
        request(app)
          .post('/api/signup')
          .send({
            name: '',
            email: '',
            password: '',
            passwordCheck: ''
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal('請填入使用者名稱！');
            done();
          });
      });

      it('should return 400 with 請填入信箱！！', done => {
        request(app)
          .post('/api/signup')
          .send({
            name: 'test3',
            email: '',
            password: '',
            passwordCheck: ''
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal('請填入信箱！！');
            done();
          });
      });

      it('should return 400 with 請填入密碼或認證密碼！', done => {
        request(app)
          .post('/api/signup')
          .send({
            name: 'test3',
            email: 'test3@example.com',
            password: '',
            passwordCheck: ''
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal('請填入密碼或認證密碼！');
            done();
          });
      });

      it('should return 400 with 密碼強度太弱，密碼長度需大等於8字元！', done => {
        request(app)
          .post('/api/signup')
          .send({
            name: 'test3',
            email: 'test3@example.com',
            password: '123',
            passwordCheck: '123'
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal('密碼強度太弱，密碼長度需大等於8字元！');
            done();
          });
      });

      it('should return 400 with 兩次密碼輸入不同！', done => {
        request(app)
          .post('/api/signup')
          .send({
            name: 'test3',
            email: 'test3@example.com',
            password: '1234465465',
            passwordCheck: '12367867868'
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal('兩次密碼輸入不同！');
            done();
          });
      });

      it('should return 400 with 信箱重複！', done => {
        request(app)
          .post('/api/signup')
          .send({
            name: 'test3',
            email: 'test1@example.com',
            password: '12345678',
            passwordCheck: '12345678'
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal('信箱重複！');
            done();
          });
      });

      it('should return 400 with 使用者名稱重複', done => {
        request(app)
          .post('/api/signup')
          .send({
            name: 'test1',
            email: 'test3@example.com',
            password: '12345678',
            passwordCheck: '12345678'
          })
          .set('Accept', 'application/json')
          .expect(400)
          .end((err, res) => {
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal('使用者名稱重複！');
            done();
          });
      });

      it('should return 200 with 帳號建立成功', done => {
        request(app)
          .post('/api/signup')
          .send({
            name: 'test3',
            email: 'test3@example.com',
            password: '12345678',
            passwordCheck: '12345678'
          })
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal('帳號建立成功');
            done();
          });
      });

      after(async () => {
        await db.User.destroy({ where: {}, truncate: true });
      });
    });
  });
});
