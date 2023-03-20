import express from 'express';

import {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { verifyJWT } from '../middlewares/verifyJWT';

const router = express.Router();

router.use(verifyJWT);

router
  .route('/')
  .get(getAllUsers)
  .post(createNewUser)
  .patch(updateUser)
  .delete(deleteUser);

export { router };
