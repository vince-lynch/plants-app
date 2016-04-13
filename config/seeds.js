var mongoose = require('mongoose');
var User = require('../models/user.js');
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://heroku_clxsvx42:m54mdijfr0lcgh1qronm5094sc@ds023550.mlab.com:23550/heroku_clxsvx42';
mongoose.connect(mongoURI);

User.collection.drop();
