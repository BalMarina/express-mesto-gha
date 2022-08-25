const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const router = require('./routes/index');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6305de43c3ce720e8ef9a737',
  };

  next();
});

app.use(bodyParser.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
