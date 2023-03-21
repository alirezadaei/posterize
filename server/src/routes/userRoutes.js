const express = require('express');

const {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const verifyJWT = require('../middlewares/verifyJWT');

const userRouter = express.Router();

userRouter.use(verifyJWT);

userRouter
  .route('/')
  .get(getAllUsers)
  .post(createNewUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = userRouter;
