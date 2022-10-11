const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();
const notImplemented = require('./controllers/checkController');
const prodsRouter = require('./routers/products');
const loginRouter = require('./routers/login');

//IMPLEMENTACION DE IO
const socketConnection = require('./utils/socket.io');
const httpServer = require('http').createServer(app);
socketConnection(httpServer);

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        'mongodb+srv://admin:admin@cluster0.bjodeia.mongodb.net/?retryWrites=true&w=majority',
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
  })
);
// ROUTERS
app.use(loginRouter);
app.use(prodsRouter);
// ATRAPA RUTAS NO IMPLEMENTADAS
app.use(notImplemented);

// HBS CONFIG
app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
  'hbs',
  engine({
    extname: 'hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
  })
);

//SERVER
const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () =>
  console.log(`SERVER ON PORT http://localhost:${PORT}/`)
);

httpServer.on('error', (error) => {
  `Error en el servidor ${error}`;
});
