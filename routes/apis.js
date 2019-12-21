const express = require('express');
const router = express.Router();

const passport = require('../config/passport');
const helpers = require('../_helpers');
const authenticated = passport.authenticate('jwt', { session: false });
const userControlloer = require('../controllers/userControllers');
const adminController = require('../controllers/adminControllers');

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).isAdmin) {
      return next();
    }
    return res
      .status(400)
      .json({ status: 'error', message: 'permission denied' });
  }
  return res
    .status(400)
    .json({ status: 'error', message: 'permission denied' });
};

router.get('/', (req, res) =>
  res.status(200).json({ status: 'success', message: 'Hello World!' })
);

router.get('/test', authenticated, (req, res) =>
  res.status(200).json({ status: 'success', message: 'Auth Test!' })
);
// admin User
router.get(
  '/admin',
  authenticated,
  authenticatedAdmin,
  adminController.hiAdmin
);
router.get(
  '/admin/users',
  authenticated,
  authenticatedAdmin,
  adminController.getAllUsers
);
router.put(
  '/admin/users/:id',
  authenticated,
  authenticatedAdmin,
  adminController.putUser
);
router.delete(
  '/admin/users/:id',
  authenticated,
  authenticatedAdmin,
  adminController.deleteUser
);

router.post('/signin', userControlloer.signIn);
router.post('/signup', userControlloer.signUp);

module.exports = router;
