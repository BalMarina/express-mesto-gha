const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SUCCESS_CODE = 200;
const INVALID_DATA_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const SERVER_ERROR_CODE = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res
      .status(SERVER_ERROR_CODE)
      .send({ message: 'Произошла ошибка на сервере.' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(INVALID_DATA_ERROR_CODE)
          .send({ message: 'Передан некорректный _id пользователя.' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Произошла ошибка на сервере.' });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(INVALID_DATA_ERROR_CODE)
          .send({ message: 'Передан некорректный _id пользователя.' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Произошла ошибка на сервере.' });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash({ password }, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(INVALID_DATA_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Произошла ошибка на сервере.' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findOneAndUpdate(
    { _id: userId },
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(SUCCESS_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(INVALID_DATA_ERROR_CODE)
          .send({ message: 'Преданы некорректные данные при обновлении профиля' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Произошла ошибка на сервере.' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findOneAndUpdate(
    { _id: userId },
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(SUCCESS_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(INVALID_DATA_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Произошла ошибка на сервере.' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then(() => {
      const token = jwt.sign(
        { _id: '6305e24749b35cc2a3d01d93' },
        process.env.JWT_SECRET,
        // записать JWT в httpOnly куку Или отправить в теле ответа
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, { httpOnly: true, sameSite: true });

      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
