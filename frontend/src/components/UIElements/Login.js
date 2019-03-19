import React, {Component} from 'react';
import './Login.css';
import {withRouter} from 'react-router';
import apiClient from '../../helpers/apiClient';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import { green,red } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => (
	{
		container: {
			display: 'flex',
			flexDirection: "column",
			margin: 20,
		  },
		
		  input:{
			width: 100
		  },
		
		  TextField: {
			marginLeft: theme.spacing.unit,
			marginRight: theme.spacing.unit,
		  },
		
		  Button:{
			width: 300,
		  },
		
		  ButtonMargin:{
			marginTop:theme.spacing.unit,
		  },
		
		  ItemCenter: {
			alignSelf:'center'
		  },
		main: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: theme.spacing.unit * 3,
		marginRight: theme.spacing.unit * 3,
		[theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
			width: 400,
			marginLeft: 'auto',
			marginRight: 'auto',
		},
		},
		paper: {
		marginTop: theme.spacing.unit * 8,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
		},
		avatar: {
		margin: theme.spacing.unit,
		backgroundColor: theme.palette.secondary.main,
		},
		form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing.unit,
		},
		submit: {
		marginTop: theme.spacing.unit * 3,
		},

		GoogleCol:{
			color: 'white',
			backgroundColor : red[600],
			'&:hover': {
			backgroundColor: red[800],
			},
		},
		
		NaverCol:{
			color: 'white',
			backgroundColor: green[600],
			'&:hover': {
			backgroundColor: green[800],
		},
  }});

class login extends Component {

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
	
	  onChange = name => e =>{
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
			this.props.history.push(res.url)
		  })
		  .catch(err=> console.log(err));
		}
		else
		  console.log('Submit conditions are not satisfied..');
	  }
	render (){
			const { classes } = this.props;

		return (
			<div className="login" style={{minHeight : "100vh" ,margin: "0", padding: "0"}}>
				<main className={classes.main} style={{position : "absolute", right : "25%", left : "25%", top : "15%"}}>
					<CssBaseline />
					<Paper className={classes.paper} style={{paddingTop : "0", marginTop: 0}}>
						
						<Avatar className={classes.avatar}>
							<LockOutlinedIcon />				
						</Avatar>
						<Typography component="h1" variant="h5">
						<h4 style={{fontWeight: "700"}}>Sign in</h4>
						</Typography>
							<form onSubmit = {this.onSubmit} className={classes.container}>
								<TextField
								id= "emailInp"
								label= "이메일 주소"
								className= {classes.textField}
								value= {this.state.formFieldInput.email}
								error= {this.state.formFieldValid.emailValid !== null ? true : null}
								helperText = {this.state.formFieldMessage.emailValError}
								onChange= {this.onChange('email')}
								margin="normal"
								>
								</TextField>
								<TextField
								id= "passwordInp"
								label= "비밀번호"
								type="password"
								className= {classes.textField}
								value= {this.state.formFieldInput.password}
								error= {this.state.formFieldValid.passwordValid !== null ? true : null}
								helperText = {this.state.formFieldMessage.passwordValError}
								onChange= {this.onChange('password')}
								margin="normal"
								>
								</TextField>
								<Button
									style = {{marginTop: 50}}
									className = {`${classes.Button} ${classes.ItemCenter}`}
									type="submit"
									fullWidth
									color="primary"
									variant="contained"
								>
									로그인
								</Button>
								<a className = {`removeLinkDec ${classes.ButtonMargin} ${classes.ItemCenter}`} href = "http://localhost:8080/api/users/google_auth"><Button variant="contained" className={`${classes.GoogleCol} ${classes.Button}`}>구글 계정으로 시작하기</Button></a>
								<a className = {`removeLinkDec ${classes.ButtonMargin} ${classes.ItemCenter}`} href = "http://localhost:8080/api/users/naver_auth"><Button variant="contained" className={`${classes.NaverCol} ${classes.Button}`}>네이버 계정으로 시작하기</Button></a>
							</form>
					</Paper>
					</main>
			</div>
		);
	}
};


login.propTypes = {
	classes: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
  };
export default withStyles(styles)(withRouter(login));