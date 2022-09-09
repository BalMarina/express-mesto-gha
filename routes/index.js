const router = require('express').Router();
const NotFoundError = require('../errors/not-found-error');
const auth = require('../middlewares/auth');
const validateAuth = require('../middlewares/validity-params');

const userRouter = require('./users');
const cardsRouter = require('./cards');

const { createUser, login } = require('../controllers/users');
const { validitySignup, validitySignin } = require('../middlewares/validity-params');

router.use(userRouter);
router.use(cardsRouter);
router.use(validateAuth, auth);

router.post('/signin', validitySignin, login);
router.post('/signup', validitySignup, createUser);

router.get('/logout', (req, res) => {
  res.clearCookie('token').send();
});

router.use((req, res, next) => {
  next(new NotFoundError('Такой страницы нет'));
});

module.exports = router;
