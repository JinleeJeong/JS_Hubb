import React, {Component} from 'react';
import { Form, FormGroup, ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';
import {withRouter} from 'react-router'
import PropTypes from 'prop-types';
import apiClient from '../../helpers/apiClient';
import InputValidator from '../../helpers/InputValidator';
import FormChecker from '../../helpers/FormChecker';

class SignUpForm extends Component {

  constructor(props){
    super(props);

    // formFieldInput : 해당 객체의 property에 사용자가 각 칸에 입력한 값들을 저장한다.
    // formFieldValid : 각 칸에 입력된 값 (formFiledInput 객체의 properties)의 상태를 저장한다(null, error, warning etc)  
    // formFieldMessage : 유효성 검사를 통과하지 못한 칸 아래에 나타낼 오류 메시지를 저장한다. 
    this.state = {
      formFieldInput : 
      {
        userName : '' ,
        email: '',
        password:'',
        passwordConfirmation : ''
      },
      formFieldValid :
      {
        userNameValid : null,
        emailValid : null,
        passwordValid : null,
        passwordConfirmationValid : null,
      },
      formFieldMessage :
      {
        userNameValError : '',
        emailValError : '',
        passwordValError : '',
        passwordConfirmationValError : ''
      }
  }

  this.onChange = this.onChange.bind(this);
  this.onSubmit = this.onSubmit.bind(this);
}

registrationApiCall (){
  apiClient.post('/users/register',{
    email: this.state.formFieldInput.email,
    password: this.state.formFieldInput.password,
    name: this.state.formFieldInput.userName,
  })
  .then(res => {
    if (res.message == "회원가입에 성공했습니다."){
      console.log("성공");
      this.props.history.push('/signin');
    }
    else if(res.message == "중복된 아이디입니다.")
      this.setValidationResult({
        fieldName: 'email',
        isCorrect: 'error',
        message: "이미 존재하는 아이디입니다."
      });
  })
  .catch(err=> console.log(err));
}

setValidationResult (validationResult){
  
  let {formFieldValid, formFieldMessage} = this.state;

  formFieldValid[validationResult['fieldName'] + 'Valid'] = validationResult['isCorrect'];
  formFieldMessage[validationResult['fieldName'] + 'ValError'] = validationResult['message'];
  
  this.setState (
    prevState => ({
      ...prevState,
      formFieldValid :  formFieldValid,
      formFieldMessage : formFieldMessage
    }));
}

// 회원가입 버튼을 누를 때 실행되는 함수로서 사용자 입력 값의 유효성을 검사한 후 state를 업데이트한다. 
validateChangedField(fieldName,value){
  
  let formChecker,validationResult;

  switch (fieldName){
    case 'userName' :
      // FormChecker 객체의 3번째 parameter는 만족해야 하는 유효성 정보 객체의 list이다. 
      // list에서 n번째 객체의 조건이 만족되어야 n+1번째 조건을 검사하게 된다.
      // 따라서 우선하여야 할 조건 순서를 고려하여 list를 구성해야 한다는 점에 유의해야 한다.
      formChecker = new FormChecker (fieldName,value,[
          {
            method : InputValidator.isNotEmpty,
            args : [],
            message : '공란일 수 없습니다'
          },
          {
            method : InputValidator.letterCondition,
            args : ['hangul','alphabet','number'],
            message : '한글, 알파벳, 숫자만 입력 가능합니다.'
          },
          {
            method : InputValidator.strLengthCondition,
            args : [{min : 2, max : 10}],
            message : 2 + ' 글자 이상 ' + 10 + ' 글자 이하여야 합니다' 
          }
      ]);
      break;

    case 'email' :
      formChecker = new FormChecker (fieldName,value,[
        {
          method : InputValidator.isNotEmpty,
          args : [],
          message : '공란일 수 없습니다'
        },
        {
          method : InputValidator.validate.isEmail,
          args : [],
          message : '올바른 이메일 형식이 아닙니다'
        }
      ]);
      break

  case 'password' :
    formChecker = new FormChecker (fieldName,value,[
      {
        method : InputValidator.isNotEmpty,
        args : [],
        message : '공란일 수 없습니다'
      },
      {
        method : InputValidator.passwordStrengthCondition,
        args : [],
        message : '특수문자 포함 최소 8자 ~ 최대 20자 이내로 입력합니다.'
      }
    ]);
    break;

  case 'passwordConfirmation' :

    formChecker = new FormChecker (fieldName,value,[
      {
        method : InputValidator.isNotEmpty,
        args : [],
        message : '공란일 수 없습니다'
      },
      {
        method : InputValidator.sameAsPassword,
        args : [{confirmationStr : this.state.formFieldInput.password}],
        message : '비밀번호가 일치하지 않습니다'
      }
    ]);
    break;

  default :
    break;

  }
      
  validationResult = formChecker.validate();  
  this.setValidationResult(validationResult);
}

onChange(e){
  const name = e.target.name;
  const value = e.target.value;

  this.setState(prevState =>({
      formFieldInput:{
          ...prevState.formFieldInput,
          [name] : value
      }
  }), () => this.validateChangedField (name,value) );
}

onSubmit(e){
  //you cannot return false to prevent default behavior in React. You must call preventDefault explicitly. 
  e.preventDefault();

  const {emailValid,userNameValid,passwordValid,passwordConfirmationValid} = this.state.formFieldValid;

  if (emailValid === null && 
      userNameValid === null && 
      passwordValid === null &&
      passwordConfirmationValid === null) {
    
        this.registrationApiCall();
  }
  else
    console.log('Submit conditions are not satisfied..');
}

render (){
  return (
    <div>
        <Form onSubmit = {this.onSubmit}>
        <h1 className = "FormHeader">회원가입</h1>
          <FormGroup
            validationState = {this.state.formFieldValid.userNameValid} 
          >
          <ControlLabel>이름</ControlLabel>
            <FormControl
              value = {this.state.formFieldInput.userName}
              onChange={this.onChange}
              type = "text"
              name="userName">
            </FormControl>
            <FormControl.Feedback/>
              <HelpBlock>{this.state.formFieldMessage.userNameValError}</HelpBlock>
            </FormGroup>

            <FormGroup
              validationState = {this.state.formFieldValid.emailValid}
            >
            <ControlLabel>이메일 주소</ControlLabel>
              <FormControl
                value = {this.state.formFieldInput.email}
                onChange={this.onChange}
                type = "text"
                name="email">
              </FormControl>
              <FormControl.Feedback/>
                <HelpBlock>{this.state.formFieldMessage.emailValError}</HelpBlock>
              </FormGroup>
            <FormGroup
              validationState = {this.state.formFieldValid.passwordValid}
            >
            <ControlLabel>비밀번호</ControlLabel>
            <FormControl
              value = {this.state.formFieldInput.password}
              onChange={this.onChange}
              type = "password"
              name="password">
            </FormControl>
            <FormControl.Feedback/>
              <HelpBlock>{this.state.formFieldMessage.passwordValError}</HelpBlock>
            </FormGroup>
            <FormGroup
              style = {{marginBottom: '50px'}}
              validationState = {this.state.formFieldValid.passwordConfirmationValid}
            >
            <ControlLabel>비밀번호 확인</ControlLabel>
              <FormControl
                value = {this.state.formFieldInput.passwordConfirmation}
                onChange={this.onChange}
                type = "password"
                name="passwordConfirmation">
              </FormControl>
              <FormControl.Feedback/>
              <HelpBlock>{this.state.formFieldMessage.passwordConfirmationValError}</HelpBlock>
            </FormGroup>
            <FormGroup>
              <Button bsStyle = 'primary' block type = "submit">
                확인
              </Button>
            </FormGroup>
        </Form>
        <div>
            <a className = "removeLinkDec" href = "http://localhost:8080/api/users/google_auth"><Button style = {{marginBottom: '15px'}} bsStyle ="danger" block>구글 계정으로 시작하기</Button></a>
            <a className = "removeLinkDec" href = "http://localhost:8080/api/users/naver_auth"><Button style = {{marginBottom: '15px'}} bsStyle ="success" block>네이버 계정으로 시작하기</Button></a>
        </div>
      </div>
    );
  }
}

SignUpForm.propTypes = {
  history: PropTypes.object.isRequired
}

export default withRouter(SignUpForm)