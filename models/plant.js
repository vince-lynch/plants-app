var mongoose = require('mongoose');

var plantSchema = mongoose.Schema({
  email: String,
  palmHealth: Number,
  daisyHealth: Number,
  lastwatered: Number,
  palmX: Number,
  palmY: Number,
  daisyX: Number,
  daisyY: Number,
  text: String,
  lastWeatherState: String,
  history: []
});

module.exports = mongoose.model("plant", plantSchema);