const express = require('express');

const {
  login,
  register,
  refresh,
  logout,
} = require('../controllers/authController');

const authRouter = express.Router();

authRouter.route('/login').post(login);

authRouter.route('/register').post(register);

authRouter.route('/refresh').get(refresh);

authRouter.route('/logout').post(logout);

module.exports = authRouter;
