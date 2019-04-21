var express = require('express');
var router = express.Router();
var events= require('../bin/event');
var rooms = require('../bin/rooms');
var chats = require('../bin/chats');
var mongo = require('mongodb');
var assert = require('assert')

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

        

module.exports = router;
