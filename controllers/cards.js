const Card = require('../models/card');

const InvalidDataError = require('../errors/invalid-data-error');
const NotFoundError = require('../errors/not-found-error');
const UserAccessError = require('../errors/user-access-error');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Некорректные данные для создания карточки'));
      } else {
        next(err);
      }
    });
};

const delCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      if (cards.owner.toString() !== req.user._id) {
        throw new UserAccessError('Вы не можете удалить чужую карточку');
      }
      return cards.remove()
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Передан невалидный _id карточки.'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
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
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      return res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Переданы некорректные данные для постановки/снятии лайка.'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
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
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      return res.status(200).send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Переданы некорректные данные для постановки/снятии лайка.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  delCard,
  likeCard,
  dislikeCard,
};
