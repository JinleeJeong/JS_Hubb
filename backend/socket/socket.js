const Message = require('../models/Message');
ObjectId = require('mongodb').ObjectID;
let sockets = {};

sockets.init = (server,sessionMiddleware) => {
  
  const io = require('socket.io').listen(server);
  
  // INSERT에 한해 Change Streams 동작 
  const pipeline = [
    {$match: {operationType: "insert"}}
  ]
  // Message Collection watch 
  const changeStream = Message.watch(pipeline, { fullDocument: 'updateLookup' });
  
  changeStream.on('change',(change)=>{
    // BroadCast 
    io.emit('unseenMessage',{recipient: change.fullDocument.recipient, addNum : 1});    
    io.emit('test',change.fullDocument);
  });  


  io.use(function(socket, next){
    // Wrap the express middleware
    // Socket.request.session 가능 
    sessionMiddleware(socket.request, {}, next);
  });
  
  // Event handler
  io.sockets.on('connection', (socket)=> {
    console.log('socket connected');
    socket.on('disconnect',()=>{
      console.log('socket disconnected');
    });
  });
}

module.exports = sockets;