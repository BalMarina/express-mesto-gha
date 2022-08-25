const router = require('express').Router();

const userRouter = require('./users');
const cardsRouter = require('./cards');

router.all('*', userRouter, cardsRouter, (req, res) => {
  res
    .status(404)
    .send({ message: 'Неправильный путь запроса' });
});

module.exports = router;
