var mongo = require('mongoose');
var Schema = mongo.Schema;
var roomSchema = new Schema({
  user: String,
  room: String,
  created: {type:Date, default:Date}
})

module.exports = mongo.model('rooms', roomSchema);