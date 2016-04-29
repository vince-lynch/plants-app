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
var Plant = require('./models/plant');

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

/////////// Sockets DB communication
dblogin = function(email){
  Plant.findOne({ 'email': email }, function(err, plant){
  if(err) return  console.log("nothing to show");
    if (plant == null){
      console.log("user doesnt exist")
      Plant.create({email: email}, function(err, plant){
        if(err) return console.log(err);
        if(!plant) return console.log("Invalid data");
        io.emit('message', plant);
        return console.log(plant);
      });
    } else {
      io.emit('message', plant);
      return console.log(plant);
    }
  });
}

dbupdatePlant = function(email,plantHealth,lastwatered,palmX,palmY,text){
  Plant.findOneAndUpdate({email: email}, {$set:{plantHealth:plantHealth, lastwatered: lastwatered, palmX: palmX, palmY: palmY}}, {new: true}, function(err, plant){
      if(err){
          return console.log(err);
      }
      io.emit('message', plant);
      return console.log(plant);
  });
}

io.on('connect', function(socket) {
  console.log("User connected with socket id of: " + socket.conn.id);
  socket.on('message', function(message) {

    if (message.text == "login"){
      dblogin(message.username)
    } else if (message.text == "updatePlant"){
     dbupdatePlant(message.username,message.plantHealth,message.lastwatered,message.palmX,message.palmY)
    } else {
      io.emit('message', message);
    }
  });
});




app.use('/', router);

server.listen(port, function() {
  console.log('Server started on ' + port);
});