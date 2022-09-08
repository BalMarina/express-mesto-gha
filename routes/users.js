const userRouter = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
} = require('../controllers/users');

userRouter.post('/signin', login);

userRouter.post('/signup', createUser);

userRouter.get('/users', auth, getUsers);

userRouter.get('/users/:userId', auth, getUserById);

userRouter.get('/users/me', auth, getCurrentUser);

userRouter.patch('/users/me', auth, updateUser);

userRouter.patch('/users/me/avatar', auth, updateAvatar);

module.exports = userRouter;
