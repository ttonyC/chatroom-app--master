
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const eventSchema = new Schema({
  event: String,
  socket: String,
  room: String,
  connect: {type:Date, default:Date},
  
  
});
module.exports = mongoose.model('events', eventSchema);