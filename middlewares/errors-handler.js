const SERVER_ERROR_CODE = require('../errors/errors-constants');

const errorsHandler = ((err, req, res, next) => {
  console.log(err);
  const { statusCode = SERVER_ERROR_CODE, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === SERVER_ERROR_CODE
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

module.exports = errorsHandler;
