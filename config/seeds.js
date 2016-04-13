var mongoose = require('mongoose');
var User = require('../models/user.js');
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/portugueseproperty';
mongoose.connect(mongoURI);

User.collection.drop();
