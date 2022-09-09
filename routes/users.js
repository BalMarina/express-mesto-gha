const userRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {
  validityProfile,
  validityAvatar,
  validityUser,
} = require('../middlewares/validity-params');

const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/users', auth, getUsers);

userRouter.get('/users/me', auth, getCurrentUser);

userRouter.get('/users/:userId', auth, validityUser, getUserById);

userRouter.patch('/users/me', auth, validityProfile, updateUser);

userRouter.patch('/users/me/avatar', auth, validityAvatar, updateAvatar);

module.exports = userRouter;
