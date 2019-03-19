import React, { Component } from 'react';
import {Dropdown, MenuItem, Image, Clearfix, Badge} from 'react-bootstrap';
import './Avatar.css';
import apiClient from '../../../../helpers/apiClient';
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import {AppContext} from '../../../../contexts/appContext';
import { Link } from 'react-router-dom';
class Avatar extends Component{
  static contextType = AppContext;

  constructor(props){
    super(props);
    
    this.state = {
      // 확인하지 않은 쪽지 개수
      unseenNumber : 0
    }
    
    this.onSelectHandler = this.onSelectHandler.bind(this);
    this.getUnseenMessage = this.getUnseenMessage.bind(this);
  }

  getUnseenMessage(data){
    if (data.recipient === this.context.state.signInInfo.id){
      this.setState({
        ...this.state,
        unseenNumber: this.state.unseenNumber + data.addNum
      });
    }
  }

  onSelectHandler (eventKey){
    if (eventKey === 'mypage'){
      this.props.history.push('/mypage')
    }else if (eventKey === 'mymessage'){
      this.props.history.push('/mymessagepage');
    }else {
      apiClient.post('/users/signout')
      .then (()=> {console.log("logout");window.location.reload()})
    }
  }

  /*
  static getDerivedStateFromProps(nextProps, prevState){
    console.log(nextProps)
    console.log("j")
    console.log(prevState)
  } */

  componentDidMount(){
    console.log("avatar mounted..");
    // 현재 로그인 유저가 읽지 않은 쪽지 개수를 요청한다. 

    apiClient.get('/messages/unseenmessages')
    .then (unseenInfo =>{
      this.setState({
        ...this.state,
        unseenNumber: unseenInfo.unseenNumber
      }) 
    });

    this.context.state.socketConnection.io.on('unseenMessage',(data) => this.getUnseenMessage(data));
  }

  componentWillUnmount(){
    console.log("avatar unmount..");
    console.log(this.context.state.socketConnection.io)
    this.context.state.socketConnection.io.removeListener('unseenMessage',this.getUnseenMessage);
  }

  render (){
    return (
      <Dropdown>
        <CustomToggle bsRole = "toggle">
          <Image className = "userProfile" src = "http://image.newsis.com/2018/05/28/NISI20180528_0014122801_web.jpg"/>
        </CustomToggle>
        <Clearfix bsRole = "menu">
          <MenuItem eventKey = "mypage" onSelect = {this.onSelectHandler}><Link to={`/mypage`}>마이페이지</Link></MenuItem>
          <MenuItem eventKey = "mymessage" onSelect = {this.onSelectHandler}> <span> 쪽지함 </span> <Badge style = {{color: 'white', background: '#ff4767'}}>{this.state.unseenNumber}</Badge></MenuItem>
          <MenuItem eventKey = "signout" onSelect = {this.onSelectHandler}>로그아웃</MenuItem>
        </Clearfix>
      </Dropdown> )
  }

}

Avatar.propType = {
  history: PropTypes.object.isRequired,
}

export default withRouter(Avatar);

class CustomToggle extends Component {
  
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onClick(e);
    console.log(e);
  }
  
  render() {
    return (
      <div onClick={this.handleClick}>
        {this.props.children}
      </div>
    );
  }
}

