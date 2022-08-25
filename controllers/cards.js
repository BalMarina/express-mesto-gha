const Card = require('../models/card');

const INVALID_DATA_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const SERVER_ERROR_CODE = 500;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res
      .status(SERVER_ERROR_CODE)
      .send({ message: 'Произошла ошибка на сервере.' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(INVALID_DATA_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Произошла ошибка на сервере.' });
    });
};

const delCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((cards) => {
      if (!cards) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.send(cards);
    })
    .catch(() => {
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Произошла ошибка на сервере.' });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: ownerId } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((cards) => {
      if (!cards) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(INVALID_DATA_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные для постановки/снятии лайка.', err });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Произошла ошибка на сервере.' });
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: ownerId } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((cards) => {
      if (!cards) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(INVALID_DATA_ERROR_CODE)
          .send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Произошла ошибка на сервере.' });
    });
};

module.exports = {
  getCards,
  createCard,
  delCard,
  likeCard,
  dislikeCard,
};
