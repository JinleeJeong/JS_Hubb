const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },
  token: {
    type: String,
    required: true
  },
  createdAt:{
    type: Date,
    required: true,
    default: Date.now,
    expires: 43200
  }
});

module.exports = mongoose.model('tokens',TokenSchema);
