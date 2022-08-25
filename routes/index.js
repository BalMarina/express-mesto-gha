const router = require('express').Router();

const userRouter = require('./users');
const cardsRouter = require('./cards');

router.all('*', userRouter, cardsRouter);

module.exports = router;
