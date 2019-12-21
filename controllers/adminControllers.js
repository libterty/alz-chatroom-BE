const db = require('../models');
const User = db.User;

const adminController = {
  hiAdmin: (req, res) => {
    res.status(200).json({ status: 'success', message: 'Hello Admin!' });
  },
  getAllUsers: (req, res) => {
    return User.findAll().then(users => {
      users = users.map(user => ({ ...user.dataValues }));
      return res.status(200).json({ status: 'success', users });
    });
  },
  putUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        user
          .update({
            isAdmin: !user.dataValues.isAdmin
          })
          .then(() => {
            return res
              .status(200)
              .json({ status: 'success', message: 'Update user success' });
          });
      })
      .catch(err => {
        return res.status(404).json({ status: 'error', message: err.message });
      });
  },
  deleteUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        user.destroy().then(() => {
          return res
            .status(200)
            .json({ status: 'success', message: 'Delete user success' });
        });
      })
      .catch(err => {
        return res.status(404).json({ status: 'error', message: err.message });
      });
  }
};

module.exports = adminController;
