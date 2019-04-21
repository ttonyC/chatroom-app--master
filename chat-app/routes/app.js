var express = require('express');
var router = express.Router();
var events= require('../bin/event');
var rooms = require('../bin/rooms');
var chats = require('../bin/chats');
var mongo = require("mongoose");

var url = 'mongodb://ttonyC:123abc@ds153495.mlab.com:53495/chatroom';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*get eventhistory */
router.get('/api/eventlog', function(req, res, next) {

    events.find(function (err,events){
      if(err){
          console.log(err);

      }else{
          res.json(events);
          var eventArray = [];
          mongo.connect(url, function(err, db){
            assert.equal(null, err);
        
            var cursor = db.collection('event-data').find();
            cursor.forEach(function(doc, err){
              assert.equal(null, err);
              resultArray.push(doc);
            }, function(){
              db.close();
              res.render('app', {events: eventArray})
            });
          });
      }
  });
});

/*get roomhistory */
router.get('/api/roomhistory', function(req, res, next){
    rooms.find(function (err,room){
      if(err){
        console.log(err);
      }else{
        res.json(room);
        var roomArray = [];
  mongo.connect(url, function(err, db){
    assert.equal(null, err);

    var cursor = db.collection('room-data').find();
    cursor.forEach(function(doc, err){
      assert.equal(null, err);
      resultArray.push(doc);
    }, function(){
      db.close();
      res.render('app', {rooms: roomArray})
    });
  });
      }
    })
});

/* get chat history*/
router.get('/api/chathistory', function(req, res, next){
  chats.find(function (err,chats){
    if(err){
      console.log(err);
    }else{
      res.json(chats);
      var chatArray = [];
  mongo.connect(url, function(err, db){
    assert.equal(null, err);

    var cursor = db.collection('chat-data').find();
    cursor.forEach(function(doc, err){
      assert.equal(null, err);
      resultArray.push(doc);
    }, function(){
      db.close();
      res.render('app', {chats: chatArray})
    });
  });
    }
  })
});

/*Insert event route */
router.post('/insert-event', function(req,res,next){
  var Event_Hist = {
    title: req.events.title,
    socket: req.events.socket,
    room: req.events.room,
    time: req.events.created
  }
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection('user-data').insertOne(Event_Hist, function(){
      assert.equal(null, err);
      console.log('Item inserted');
      db.close();
    })
  })
  res.redirect('/');
});
 
/*Insert chat route */
  router.post('/insert-chat', function(req,res,next){
    var Chat_Hist = {
      user: req.chats.user,
      message: req.chats.message,
      room: req.chats.room,
      time: req.chats.created
  }
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection('user-data').insertOne(Chat_Hist, function(){
      assert.equal(null, err);
      console.log('Item inserted');
      db.close();
    })
  })
  res.redirect('/');
});

/*Insert room route */
    router.post('/insert-room', function(req,res,next){
      var Room_Hist = {
        user: req.rooms.user,
        room: req.rooms.room,
        time: req.rooms.created
    
      }
      mongo.connect(url, function(err, db){
        assert.equal(null, err);
        db.collection('user-data').insertOne(Room_Hist, function(){
          assert.equal(null, err);
          console.log('Item inserted');
          db.close();
        })
      })
      res.redirect('/');
  });

router.post('/delete', function(req, res, next) {

})

module.exports = router;
