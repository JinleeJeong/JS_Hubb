import React, {Component} from 'react';
import Validation from '../methods/Validation';
import FormChecker from '../methods/FormChecker';
import validator from 'validator';
import { Form, FormGroup, ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';
import axios from 'axios';
import { Redirect } from 'react-router-dom'
import './SignIn.css';

class SignUpForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      formFieldInput : 
      {
        email: '',
        password:'',
        passwordConfirmation : ''
      },
      formFieldValid :
      {
        emailValid : null,
        passwordValid : null,
        passwordConfirmationValid : null,
      },
      formFieldMessage :
      {
        emailValError : '',
        passwordValError : '',
        passwordConfirmationValError : ''
      },
  }
  
  this.onChange = this.onChange.bind(this);
  this.onSubmit = this.onSubmit.bind(this);
}

validateFields(){
  
  const entries = Object.entries(this.state.formFieldInput);
  let formChecker,validationResult;
  let newFormFieldValid = {},newFormFieldMessage = {};

  for (const [fieldName,value] of entries) {
    switch (fieldName){

      case 'email' :
          formChecker = new FormChecker (fieldName,value,[
              {
                  method : Validation.isNotEmpty,
                  args : [],
                  message : '공란일 수 없습니다'
              },
              {
                  method : validator.isEmail,
                  args : [],
                  message : '올바른 이메일 형식이 아닙니다'
              }
          ]);
      break

      case 'password' :
          formChecker = new FormChecker (fieldName,value,[
              {
                  method : Validation.isNotEmpty,
                  args : [],
                  message : '공란일 수 없습니다'
              },
              {
                  method : Validation.passwordStrengthCondition,
                  args : [],
                  message : '특수문자 포함 최소 8자 ~ 최대 20자 이내로 입력합니다.'
              }
          ]);
          //console.log('password');
      break;

      case 'passwordConfirmation' :
          formChecker = new FormChecker (fieldName,value,[
              {
                  method : Validation.isNotEmpty,
                  args : [],
                  message : '공란일 수 없습니다'
              },
              {
                  method : Validation.sameAsPassword,
                  args : [{confirmationStr : this.state.formFieldInput.password}],
                  message : '비밀번호가 일치하지 않습니다'
              }
          ]);
          //console.log('passwordConfirmation');
        break;
        default :
        break;
      }
      
      validationResult = formChecker.validate();
      newFormFieldValid[validationResult['fieldName'] + 'Valid'] = validationResult['isCorrect'];
      newFormFieldMessage[validationResult['fieldName'] + 'ValError'] = validationResult['message'];
  }

  console.log(newFormFieldValid)
  /*
  this.setState(prevState =>({
      formFieldValid : {
          ...prevState.formFieldValid,
          [validationResult['fieldName']+'Valid'] : validationResult['isCorrect'] 
      },
      formFieldMessage : {
          ...prevState.formFieldMessage,
          [validationResult['fieldName']+'ValError'] : validationResult['message']
      } 
  }));*/
  this.setState(prevState =>({
      ...prevState,
      formFieldValid :  newFormFieldValid,
      formFieldMessage : newFormFieldMessage
  }));
}

onChange(e){
  const name = e.target.name;
  const value = e.target.value;
  // Computed property name 
  // callback에 e.target.~ 하면 왜 에러가 나는 것일까 ? 
  //this.setState({ [name] : value});
  this.setState(prevState =>({
    formFieldInput:{
        ...prevState.formFieldInput,
        [name] : value,
    },

  }));
}

onSubmit(e){
  //you cannot return false to prevent default behavior in React. You must call preventDefault explicitly. 
  const {emailValid, passwordValid, passwordConfirmationValid} = this.state.formFieldValid;
  e.preventDefault();
  const signin = this.state.formFieldInput;
  
  this.validateFields();
  console.log(emailValid+passwordValid+passwordConfirmationValid);
  if(emailValid === 'error' || passwordValid === 'error' || passwordConfirmationValid === 'error'){
    return <Redirect to ='/signin'/>
  }
  // if 문 수정 필요... 서버 단에서 처리 예정
  else {
  axios.post('http://localhost:8080/api/user', signin)
  .then(result => {
    return <Redirect to='/signin'/>
  })
  .catch((err) => { console.log(err) });
  }
}con

render (){
  return (
    <div className="row">
      <div className="col-md-4 col-md-offset-4">
        <Form onSubmit = {this.onSubmit}>
          <h1 className = "FormHeader">로그인</h1>
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
          <FormGroup validationState = {this.state.formFieldValid.passwordConfirmationValid}>
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
            <Button bsStyle="primary" block type = "submit">
              확인
            </Button>
          </FormGroup>
        </Form>
      </div>
    </div>
    );
  }
}

export default SignUpForm