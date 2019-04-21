var app = require('../app');
var debug = require('debug')('angular2-nodejs:server');
var http = require('http');
var mongo = require("mongoose");




var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


/**
 * connecting mongodb
 */
var db = mongo.connect("mongodb://ttonyC:123abc@ds153495.mlab.com:53495/chatroom",{ useNewUrlParser: true }, function(err, res){
  if(err){
    console.log(err);
  }else{
    console.log( 'Connected succefull');
  }
})


/**
 * Create HTTP server.
 */

var server = http.createServer(app);

var io = require('socket.io').listen(server);

/*
    MOVE THIS TO A SEPARATE FILE
*/

var Schema = mongo.Schema;
var eventSchema = new Schema({
  event: String,
  room: String,
  connect: {type:Date, default:Date}, 
});
var userSchema = new Schema({
  user: String
  
})
var chatSchema = new Schema({
  user: String,
  msg: String,
  room:String,
  created: {type:Date, default:Date}
})
var roomSchema = new Schema({
  user: String,
  room: String,
  created: {type:Date, default:Date}
})

var Event = mongo.model('event', eventSchema);
var User = mongo.model('user', userSchema);
var Chat = mongo.model('chat',chatSchema);
var Room = mongo.model('room',roomSchema);
/*
    MOVE ABOVE
*/

io.on('connection',(socket)=>{

    console.log('new connection made.');

    let evt = new Event({event: 'connection'});
    let user = new User({user: 'jonined'});
    let chat = new Chat({chat:'make chat'});
    let room = new Room({room:'room histroy'});

    
    /* test code
    evt.save(function(err, res) {
      console.log("Connection event was saved!");
    });
    
    user.save(function(err,res){
      console.log("user is joined");
    });
    
    chat.save(function(err,res){
      console.log("chat seaved");
    });
    
    room. save(function(err, res){
      console.log("jonin room ")
    })
    */
    socket.on('join', function(data){
      //joining
      socket.join(data.room);

      //evet
      evt = new Event({event: data.user + ' joined the room: ' + data.room});
      evt.save(function(err, res) {
        console.log(data.user + 'joined the room : ' + data.room);
      });
      // user .
      user = new User({user: data.user});
      user.save(function(err, res){
        console.log('name is ' + data.user);
      });
      // chat
      chat = new Chat({chat: data.user + data.message});
      chat.save(function(err,res){
        console.log(data.user + data.msg);
      })
      // room
      room = new Room({room: data.user +' in '+ data.room});
      room.save(function(err,res){
       console.log( data.user +' in '+ data.room);
      })

      socket.broadcast.to(data.room).emit('new user joined', {user:data.user, message:' has joined this room.'});
      });


    socket.on('leave', function(data){
      // leave room
      room = new Room({room: data.user + ' left the room: ' + data.room});
      room.save(function(err, res) {
        console.log(data.user + 'left the room : ' + data.room);
      })
      //

      console.log(data.user + 'left the room : ' + data.room);

      socket.broadcast.to(data.room).emit('left room', {user:data.user, message:'has left this room.'});

      socket.leave(data.room);
    });

    socket.on('message',function(data){
      chat = new Chat(data);
      chat.save((err, data) => {
        console.log(err, data);
        io.in(data.room).emit('new message', {user:data.user, message:data.msg});
      });
    })
});

/**
 * Listen port.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * fixed a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  
  // Prompt listening error 
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
