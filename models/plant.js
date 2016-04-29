var mongoose = require('mongoose');

var plantSchema = mongoose.Schema({
  email: String,
  plantHealth: Number,
  lastwatered: String,
  palmX: Number,
  palmY: Number
});

module.exports = mongoose.model("plant", plantSchema);