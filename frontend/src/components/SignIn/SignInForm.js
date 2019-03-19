import React, {Component} from 'react';
import { Form, FormGroup, ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import apiClient from '../../helpers/apiClient';

class SignInForm extends Component {

  constructor(props){
    super(props);

    // formFieldInput : 해당 객체의 property에 사용자가 각 칸에 입력한 값들을 저장한다.
    // formFieldValid : 각 칸에 입력된 값 (formFiledInput 객체의 properties)의 상태를 저장한다(null, error, warning etc)  
    // formFieldMessage : 유효성 검사를 통과하지 못한 칸 아래에 나타낼 오류 메시지를 저장한다. 
    this.state = {
      formFieldInput : 
      {
        email: '',
        password:'',
      },
      formFieldValid :
      {
        emailValid : null,
        passwordValid : null,
      },
      formFieldMessage :
      {
        emailValError : '',
        passwordValError : '',
      }
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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
    }))
}

  onChange(e){
    const name = e.target.name;
    const value = e.target.value;
  
    this.setState(prevState =>({
        formFieldInput:{
            ...prevState.formFieldInput,
            [name] : value
        }
    }));
  }

  onSubmit(e){
    //you cannot return false to prevent default behavior in React. You must call preventDefault explicitly. 
    e.preventDefault();
  
    const {emailValid,passwordValid} = this.state.formFieldValid;
    const {email,password} = this.state.formFieldInput;

    if (emailValid === null && passwordValid === null) {
      apiClient.post('/users/signin',{
        email: email,
        password: password,
      })
      .then(res => {
        console.log(res.message)
        this.props.history.push('/templates')
      })
      .catch(err=> console.log(err));
    }
    else
      console.log('Submit conditions are not satisfied..');
  }
  
  render (){
    return (
      <div>
        <Form  onSubmit = {this.onSubmit}>
        <h1 className = "FormHeader">로그인</h1>
          <FormGroup
            validationState = {this.state.formFieldValid.emailValid}
          >
            <ControlLabel>아이디</ControlLabel>
              <FormControl
                value = {this.state.formFieldInput.email}
                onChange={this.onChange}
                type = "text"
                name="email"
                placeholder = "이메일">
              </FormControl>
              <FormControl.Feedback/>
                <HelpBlock>{this.state.formFieldMessage.emailValError}</HelpBlock>
              </FormGroup>
            <FormGroup
              style = {{marginBottom: '50px'}}
              validationState = {this.state.formFieldValid.passwordValid}
            >
            <ControlLabel>비밀번호</ControlLabel>
            <FormControl
              value = {this.state.formFieldInput.password}
              onChange={this.onChange}
              type = "password"
              name="password"
              placeholder="특수문자 포함 최소 8자 ~ 최대 20자 이내로 입력합니다.">
            </FormControl>
            <FormControl.Feedback/>
              <HelpBlock>{this.state.formFieldMessage.passwordValError}</HelpBlock>
            </FormGroup>
            <FormGroup>
              <Button bsStyle="primary" block type = "submit">
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

SignInForm.propTypes = {
  history: PropTypes.object.isRequired
}

export default withRouter(SignInForm);