const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbConfig = require('../../db');
const fs = require('fs');
const async = require('async');
const router = express.Router();
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cors = require('cors'),
expressSession = require('express-session'),
	http = require('http'),
  redis = require('redis'),
  RedisStore = require('connect-redis')(expressSession);
	require('./model');

mongoose.connect(dbConfig.db, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.json());
app.use(cors());
app.use(router);

fs.readdirSync(path.join(__dirname, '/config/routes')).map((file) => {
	require('./config/routes/' + file)(app);
});

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
const connection = mongoose.connection;
connection.once('open', function () {
	console.log('MongoDB database connection established successfully');
});



const publicPath = path.resolve(__dirname, '..', '..', 'public');
app.get('/', (req, res) => {
	res.sendFile(`${publicPath}/index.html`);
});

app.use(cookieParser());
app.use(cors({
  origin: function (_origin, callback) {
    if (!_origin) return callback(null, true);
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  credentials: true // enable set cookie
}));

const redisPort = 6379;
const redisHost = 'localhost';

app.use(expressSession({
	key: 'node_test',
	secret: 'nodetest',
	resave: false,
	saveUninitialized: false,
	store: new RedisStore({
		host: redisHost,
		port: redisPort,
		client: redis.createClient(redisPort, redisHost),
		// ttl: (60000 * 24 * 30)
	}),
	cookie: { maxAge: (1000 * 60 * 60 * 24 * 30) },
}));

app.use((req, res, next) => {
	if (req.cookies && req.cookies.user_sid && !req.session.user) {
		res.clearCookie('node_test');
	}
	next();
});


app.use(express.static(publicPath));
require('./tasks').startTasks();

const server = app.listen(4200, () => {
	console.log("Boilerplate listening on port 4200!");
});
