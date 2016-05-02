var mongoose = require('mongoose');

var plantSchema = mongoose.Schema({
  email: String,
  palmHealth: Number,
  lastwatered: Number,
  palmX: Number,
  palmY: Number,
  text: String,
  lastWeatherState: String,
  history: []
});

module.exports = mongoose.model("plant", plantSchema);