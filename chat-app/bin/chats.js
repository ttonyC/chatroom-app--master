var mongo = require('mongoose');
var Schema = mongo.Schema;
var chatSchema = new Schema({
    user: String,
    msg: String,
    room:String,
    
    created: {type:Date, default:Date}
  })
module.exports = mongo.model('chats', chatSchema);