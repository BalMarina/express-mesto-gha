const userRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {
  validityUser,
  validityProfile,
  validityAvatar,
} = require('../middlewares/validity-params');

const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/users', auth, getUsers);

userRouter.get('/users/:userId', auth, getUserById);

userRouter.get('/users/me', validityUser, getCurrentUser);

userRouter.patch('/users/me', validityProfile, updateUser);

userRouter.patch('/users/me/avatar', validityAvatar, updateAvatar);

module.exports = userRouter;
