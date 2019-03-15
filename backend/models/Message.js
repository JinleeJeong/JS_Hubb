const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({

  title :{
    type:String,
    required:true
  },

  body: {
    type: String,
    required: true
  },

  seen:{
    type: Boolean,
    default: false,
    required: true
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },

  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },

  sendedAt:{
    type: Date,
    required: true,
    default: Date.now
  }

});

module.exports = mongoose.model('messages',MessageSchema);
