import express from 'express';

import {
  login,
  register,
  refresh,
  logout,
} from '../controllers/authController';

const router = express.Router();

router.route('/login').post(login);

router.route('/register').post(register);

router.route('/refresh').get(refresh);

router.route('/logout').post(logout);

export { router };
