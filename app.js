var morgan  = require('morgan');
var express = require('express');
var app     = express();
var bodyParser = require('body-parser');
var server  = require('http').createServer(app);
var io      = require('socket.io')(server);
var knox    = require('knox');
var fs = require('fs');
var fsPath = require('fs-path'); // makedirs with FS
var gm = require('gm');
////////////////// Routes Stuff
var cors = require('cors');
var router = require('./config/routes');
var config = require('./config/app');

var port    = process.env.PORT || 8000;


var mongoose = require('mongoose');
mongoose.connect(config.databaseUrl);


app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
/*app.use(cors({
  origin: config.appUrl,
  credentials: true
}));*/

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {
  res.render('index');
});



app.use('/scripts/gifshot', express.static(__dirname + '/node_modules/gifshot/build/'));

app.use('/', router);

server.listen(port, function() {
  console.log('Server started on ' + port);
});