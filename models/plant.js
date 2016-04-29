var mongoose = require('mongoose');

var plantSchema = mongoose.Schema({
  email: String,
  plantHealth: Number,
  lastwatered: String,
  palmX: Number,
  palmY: Number,
  text: String
});

module.exports = mongoose.model("plant", plantSchema);