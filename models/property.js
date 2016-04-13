var mongoose = require('mongoose');

var propertySchema = mongoose.Schema({
  adId: Number,
  adOperationId: Number,
  adTypologyId: Number,
  desc: String,
  detailURL: String,
  iconType: Number,
  latitude: Number,
  longitude: Number,
  numPics: Number,
  picturesURL: String,
  price: String,
  promocion: Boolean,
  textInfo: String,
  thumbnail: String
});

module.exports = mongoose.model("property", propertySchema);