const express = require('express');
const app = express();
app.enable('trust proxy');

const { dbConnect } = require('./daos/mongoConn');
dbConnect();

// -------IMPORT SESSION, HBS Y ROUTER-------
const sessionMiddleware = require('./middlewares/session');
const viewEngine = require('./middlewares/viewEngine');
const Router = require('./routes/router');
sessionMiddleware(app);
viewEngine(app, express);
Router(app);

//INICIA SERVER EN MODO FORK SI ENV.MODE=development O CLUSTER EN production
const httpServer = require('http').createServer(app);
const clusterHandle = require('./helpers/cluster');
clusterHandle(httpServer);
