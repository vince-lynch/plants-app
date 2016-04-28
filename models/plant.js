var mongoose = require('mongoose');

var plantSchema = mongoose.Schema({
  email: String,
  plantHealth: Number
});

module.exports = mongoose.model("plant", plantSchema);