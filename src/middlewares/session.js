const session = require('express-session');
const MongoStore = require('connect-mongo');
const { MONGO_URL: URL } = require('../config');
const passport = require('./passport');

const sessionConfig = session({
  store: MongoStore.create({
    mongoUrl: URL,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  }),
  secret: 'A secret',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge: 600000,
  },
});

const sessionMiddleware = (app) => {
  app.use(sessionConfig);
  app.use(passport.initialize());
  app.use(passport.session());
};

module.exports = sessionMiddleware;
