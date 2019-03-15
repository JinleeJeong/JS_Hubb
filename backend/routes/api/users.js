const express = require('express');
const bcrypt = require('bcryptjs');
const randomstring = require('randomstring');
const User = require('../../models/Users');
const Token = require('../../models/Token');
const mailer = require('../../service/mailer');
const passport = require('passport');
const url = require('url');
const router = express.Router();
let newUser;

// 소셜 로그인 로직
function socialLoginRedirect(service, req, res, next) {
  return passport.authenticate(service,async (err, user, info) => {
    const message = encodeURIComponent(info.message);
    const state = encodeURIComponent(info.state);
    const redirectURL = !info.url ? req.session.redirectTo : info.url;

    if (user){
      await req.logIn(user, (err)=>{
        if (err)
          next(err);
      })
    }
    
    res.redirect(`${redirectURL}/?message = ${message}&state = ${state}`);
  })(req, res, next)
}

// test용 router
router.get('/', (req,res) => {
  User.find()
    .then(users=> res.json(users))
});

// 회원가입 router
router.post('/register', (req, res, next) => {
  
  let email =  req.body.email;
  let password = User.hashPassword(req.body.password);
  let name = req.body.name;  

  newUser = new User ({
    email: email,
    password: password,
    name: name,
    address: null ,
    interests: null ,
    image: null ,
    sex: null ,
    birth: null ,
    about: null ,
  });
  // 유저가 존재하는지 확인 
  User.checkExistingUser(newUser)
    .then(dup => {
      // 가입하지 않은 경우 
      if (!dup){
        // 토큰 생성
        const secretToken = randomstring.generate();
        // 저장
        newUser.save()
          .then(() => {
            newToken = new Token({
              //userId
              _id: newUser._id,
              token: secretToken
            });
            // 토큰 document 저장
            newToken.save()
              .then(() => res.send({state: 'success', message:'회원가입에 성공했습니다.', url: 'http://localhost:3000'}))
              .catch(err => next(err));
        })
        .catch(err => next(err));   
/*
        mailgun service 잠시 중지됨
        
        const html = `안녕하세요,
        <br/>
        회원가입을 위해서 아래의 링크를 눌러주세요.
        <br/>
        ToKen: <b>${secretToken}</b>
        <br/>
        <a href= "http://localhost:8080/api/users/verify?token=${secretToken}"> 인증확인 </a>
        <br/>
        <br/>
        감사합니다.`;
        
        
        mailer.sendEmail('yjs08090@naver.com',email,'이메일을 통해 인증해주세요', html)
          .then(() => {
            newUser.save()
              .then(() => {
                newToken = new Token({
                  //userId
                  _id: newUser._id,
                  token: secretToken
                });

                newToken.save()
                  .then(() => res.send({message: "회원가입에 성공했습니다."}))
                  .catch(err => next(err));
              })
              .catch(err => next(err));   
          })
          .catch((err)=> {next(err)})  // 유효하지 않은 이메일 사용자가 볼 수 있게 해야한다.*/
      }
      // 이미 가입한 경우
      else{
        res.send({state: 'fail', message:'이미 가입한 아이디입니다.', url: 'http://localhost:3000'});
      }
    })
    .catch(err => next(err))
});

// Email을 통한 토큰 인증 router
router.get('/verify',(req, res , next)=>{
  const urlToken = req.query.token;
  // 일치하는 Token을 찾는다.
  Token.findOne({token: urlToken})
    .exec((err, token)=> {
      
      if (err) next(err)
      // redirect 추가
      if (!token){
        res.send({state: 'fail', message:'해당하는 토큰이 존재하지 않습니다.', url: 'http://localhost:3000'})
      }
      else{
        User.update({_id: token._id},{ $set: {verified: true}})
          .exec((err,user)=>{
            if (err) next(err);
            res.send({state: 'success', message:'토큰 인증에 성공했습니다.', url: 'http://localhost:3000'})
        });
      }
    })
});

// 로그인 router
router.post('/signin',(req, res, next) => {
  passport.authenticate('local', async (err,user,info)=>{
    if (err) return next(err)
    
    if (user){
      await req.logIn(user, (err)=>{
        if (err)
          next(err);
      })
    }
    
    res.send(info)
  })(req, res, next)
// If this function gets called, authentication was successful.
})

// test 용 router
router.get('/session',(req, res, next)=>{
  console.log(req.session.passport.user);
  res.send(req.session)
});

//If user is logged in, passport.js will create user object in req for every request in express.js,
//which you can check for existence in any middleware:
router.post('/checkAuth',(req, res, next )=>{
  if (req.user){
    res.json({
      status : true,
      id : req.user._id,
      email : req.user.email
    });
  }
  else{
    res.json({
      status : false,
      id: '',
      email : ''
    });
  }
});
// 로그아웃 router
router.post('/signout',(req, res, next)=>{
  req.logOut();
  res.send({
    status:false,
    email:''
  });
})

router.get('/google_auth',(req, res, next)=>{
  req.session.redirectTo = req.headers.referer;
  passport.authenticate('google', {scope: ['email','profile']})(req,res,next);
})

router.get('/google_auth/redirect', (req, res, next) => {
  socialLoginRedirect('google', req, res, next)
});

router.get('/naver_auth',(req, res, next)=>{
  req.session.redirectTo = req.headers.referer;
  passport.authenticate('naver')(req,res,next);
});

router.get('/naver_auth/redirect',(req, res, next) =>{
  socialLoginRedirect('naver', req, res, next)
});

module.exports = router;