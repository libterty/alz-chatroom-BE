const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const helpers = require('./_helpers');

const app = express();
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req);
  next();
});

app.listen(port, () =>
  console.log(`Example app listening on port http://localhost:${port}`)
);

require('./routes')(app);

module.exports = app;
