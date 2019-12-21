const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

const userController = {
  signUp: async (req, res) => {
    if (!req.body.name) {
      return res
        .status(400)
        .json({ status: 'error', message: '請填入使用者名稱！' });
    }
    if (!req.body.email) {
      return res
        .status(400)
        .json({ status: 'error', message: '請填入信箱！！' });
    }
    if (!req.body.password || !req.body.passwordCheck) {
      return res
        .status(400)
        .json({ status: 'error', message: '請填入密碼或認證密碼！' });
    }
    if (req.body.password.length < 8) {
      return res.status(400).json({
        status: 'error',
        message: '密碼強度太弱，密碼長度需大等於8字元！'
      });
    }
    if (req.body.passwordCheck !== req.body.password) {
      return res
        .status(400)
        .json({ status: 'error', message: '兩次密碼輸入不同！' });
    }
    // 確認使用者名稱有沒有被使用過
    const isName = await User.findOne({
      where: { name: req.body.name }
    }).then(name => {
      return name;
    });

    User.findOne({ where: { email: req.body.email } }).then(user => {
      if (user) {
        return res.status(400).json({ status: 'error', message: '信箱重複！' });
      }
      if (isName) {
        return res
          .status(400)
          .json({ status: 'error', message: '使用者名稱重複！' });
      }
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10),
          null
        )
      }).then(() => {
        return res
          .status(200)
          .json({ status: 'success', message: '帳號建立成功' });
      });
    });
  },
  signIn: (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        status: 'error',
        message: "required fields didn't exist"
      });
    }
    let username = req.body.email;
    let password = req.body.password;

    User.findOne({ where: { email: username } }).then(user => {
      if (!user)
        return res.status(401).json({
          status: 'error',
          message: 'no such user found or passwords did not match'
        });
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({
          status: 'error',
          message: 'no such user found or passwords did not match'
        });
      }
      let payload = {
        id: user.id,
        name: user.name,
        isAdmin: user.admin,
        iat: Date.now()
      };
      let token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
        { algorithm: 'RS256' }
      );

      return res.status(200).json({
        status: 'success',
        message: 'ok',
        token,
        user: {
          id: user.id,
          name: user.name,
          isAdmin: user.isAdmin
        }
      });
    });
  }
};

module.exports = userController;
