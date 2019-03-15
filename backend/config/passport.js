const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
// Load User Model
const {GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET} = require('./keys');
const {NAVER_CLIENT_ID,NAVER_CLIENT_SECRET} = require('./keys');

// Oauth API를 통해 얻은 유저 정보를 바탕으로 로그인, 회원가입을 진행하는 함수이다. 
function socialLogin (service,profile,done){
  //유저 객체
  let userProfile = {
    email: profile.emails[0].value,
    password: null,
    name: null,
    address: null ,
    interests: null ,
    image: null ,
    sex: null ,
    birth: null ,
    about: null ,
    strategy: service,
    verified: true,
  }
  // API를 통해 얻은 정보를 객체에 넣는다.
  switch(service){
    case 'Google':
      userProfile.name = profile.name.familyName + profile.name.givenName;
      userProfile.gender = profile.gender;
      break;
    
    case 'Naver':
      userProfile.name = profile.displayName
      break;

    default:
      break;
  }

  // 로그인 or 회원가입을 요청한 유저의 Email이 DB에 존재하는지 판단한다. 
  User.findOne({email: userProfile.email})
    .then(user => { 
      // 회원가입이 되어있지 않은 유저인 경우
      if (!user){
        // 유저 정보를 바탕으로 user model을 만든다.  
        newUser = new User(userProfile)

        // User DB에 유저를 저장한다. 
        //URL필드는 request 이후 어느 페이지로 돌아갈지에 대한 정보를 나타낸다. 
        //null -> 초기 요청 페이지로 돌아간다.(ex. SignInpage에서 요청을 한 경우 SignInpage로 돌아간다.)
        newUser.save()
          .then(user => done(null,user,{state: 'fail', message:'로그인에 성공했습니다.', url: 'http://localhost:3000'}))
          .catch(err => done(err,null,{state: 'fail', message:'회원 가입중 오류가 발생했습니다.', url: null}));   

      }else{
        // 이미 회원인 경우
        if (user.strategy == "local")  // local strategy로 가입한 경우
          done(null,null,{state: 'fail', message:'이미 가입된 아이디입니다.', url: null});
        else // 로그인 성공
          done(null,user,{state: 'success', message:'로그인에 성공했습니다.', url: 'http://localhost:3000'});
      }
    })
    .catch(err => done(err,null,{state: 'fail', message:'회원 조회중 오류가 발생했습니다.', url: null}));
}

module.exports = (passport) => {
  // 각 인증 Strategy에 따른 로직 설정
  // Custom 인증 방식을 사용할 경우  
  passport.use(
    new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
      // 유저가 이미 회원인지 조회한다. 
      User.findOne({email: email})
        .then(user => {
          // 회원이 아닌 경우 
          if (!user) {
            return done(null, null,{state: 'fail', message: '등록되지 않은 email입니다.', url:'/signin'});
          }
          // 해당 유저가 LocalStrategy를 사용해 가입했는지 확인한다. 
          // ex) Google Oauth로 가입한 경우 Google Oauth 로그인을 방식을 이용해 로그인을 진행해야 한다.  
          if (user.password == null && user.strategy != 'local') {
            return done(null, null, {state: 'fail', message: '비밀번호가 일치하지 않습니다.', url:'/signin'});
          }

          // 입력한 Password가 DB 정보와 일치하는지 확인한다. 
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) return new Error(err);
            
            // 일치할 경우 
            if(isMatch) {
              // executing done method -> passport.serializeUser
              return done(null, user, {state: 'success', message: '로그인에 성공했습니다.', url:''});
            } else{
              // 일치하지 않는 경우
              return done(null, null, {state: 'fail', message: '비밀번호가 일치하지 않습니다.', url:'/signin'});
            }
          });
        })
        .catch(err => {return new Error('DB 유저 검색 중 오류가 발생했습니다.')});
      })
    );
    
    // Google 인증 방식을 사용할 경우 
    passport.use(
      new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/users/google_auth/redirect'	
      },
      (accessToken, refreshToken, profile, done) => {
        socialLogin('Google',profile,done);
        }
      )
    );

    // Naver 인증 방식을 사용할 경우
    passport.use(
      new NaverStrategy({
        clientID: NAVER_CLIENT_ID,
        clientSecret: NAVER_CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/users/naver_auth/redirect'	
      },
      (accessToken, refreshToken, profile, done) => {
        socialLogin('Naver',profile,done);
        }
      )
    );

  passport.serializeUser((user, done) =>{
    // 유저 객체를 통해 회원 신원에 대한 정보를 얻는다. 
    // done -> 다음 단계로 이동한다. 
    // 쿠키에 user.id를 저장한다. 
    done(null,user.id);
  });

  passport.deserializeUser((id, done) => {
    // just retrieving the user id from cookie which a browser sent
    // 브라우저가 보낸 쿠키에서 user.id에 대한 정보를 얻는다.
    // DB에서 해당 유저에 대한 정보를 찾는다.
    User.findById(id, (err, user) => {
      // user: DB에 저장된 user 정보 
      // user 객체를 다음 단계에 전해준다. 
      done(err, user);
    })
  });
}
