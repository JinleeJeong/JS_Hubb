const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
  },
  interests: {
    type: Array,
  },
  image: {
    type: String
  },
  sex: {
    type : String,
  },
  birth: {
    type : Date,
  },
  about: {
    type : String,
  },
  date :{
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false
  },
  strategy : {
    type: String,
    default : 'local',
  }
});

let User = module.exports = mongoose.model('users',UserSchema);

module.exports.hashPassword = (password) => {

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password,salt);
  return hash;
}

module.exports.checkExistingUser = (user) => {
  
  return User.findOne({email : user.email})
    .then((err,user) => {
      if (err)
        return new Error('계정 중복 검사 실패');
      if (!user) // 이미 가입하지 않은 경우
        return false;
      else // 가입한 경우
        return true;
    });  
}