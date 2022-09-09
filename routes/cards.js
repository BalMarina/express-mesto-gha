const cardsRouter = require('express').Router();

const {
  getCards,
  createCard,
  delCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { validityInitialCard, validityCard } = require('../middlewares/validity-params');

cardsRouter.get('/cards', getCards);

cardsRouter.post('/cards', validityInitialCard, createCard);

cardsRouter.delete('/cards/:cardId', validityCard, delCard);

cardsRouter.put('/cards/:cardId/likes', validityCard, likeCard);

cardsRouter.delete('/cards/:cardId/likes', validityCard, dislikeCard);

module.exports = cardsRouter;
