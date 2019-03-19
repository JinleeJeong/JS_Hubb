import React, {Component} from 'react';
import './MyMessagePage.css';
import Inbox from './Inbox';
import { AppContext } from '../../contexts/appContext';
import apiClient from '../../helpers/apiClient';

class MyMessagePage extends Component {
    static contextType = AppContext;

    constructor (props){
      super(props);

      this.state = {
        // 메세지 list와 pager를 위한 정보 
        messages: [],
        messagePagerInfo: {
          total : null,
          showNum : 10,
          page: 1
        }
      }

      this.getMessagesApi = this.getMessagesApi.bind(this);
      this.getArrivalMessage = this.getArrivalMessage.bind(this);
      this.messagePagerHandler = this.messagePagerHandler.bind(this);
    }

    // message를 server로 부터 가져오기 위한 function
    getMessagesApi(data, type = null){
      apiClient.post('/messages',data)
        .then(res => {
          const total = type === "newMessage" ? res.total + 1 : res.total;
          this.setState({
            ...this.state,
            messages: res.list,
            messagePagerInfo: {
              ...this.state.messagePagerInfo,
              total: total,
              page: res.page
            } 
          });
        })
        .catch(err => console.log(err));
    }
    // change stream 이벤트 핸들러(메세지가 왔을 때)
    getArrivalMessage(data){
      if(!this.context.state.signInInfo.status || this.context.state.signInInfo.id !== data.recipient)
        return true

      this.getMessagesApi(this.state.messagePagerInfo, 'newMessage');
    }

    renderingList = ()=>{
      const messages = this.state.messages.map(message=>{
        return <Inbox key = {message._id}
          title = {message.title}
          body = {message.body}
          seen = {message.seen}
          sender = {message.sender}
          recipient = {message.recipient}
          sendedAt = {message.sendedAt}
        ></Inbox>
      });

      return <ul className = "list-group"> {messages} </ul>;
    }

    async componentDidMount(){
      this.context.actions.checkAuth()
        .then (()=> {

          if (!this.context.state.signInInfo.status)
            return;
          // 핸들러 등록 
          this.context.state.socketConnection.io.on('test',(data) => this.getArrivalMessage(data));
          this.getMessagesApi(this.state.messagePagerInfo);
        });
    }

    componentWillUnmount(){
      console.log("unmount");
      // 핸들러 해제 
      if (this.context.state.socketConnection.io)
        this.context.state.socketConnection.io.off('test');
    }
    // 페이지 이동에 따른 message를 가져온다. 
    messagePagerHandler (id) {
      let {page} = this.state.messagePagerInfo;

      if (id === "right")
          page = page + 1;
      else
          page = page - 1;

      this.getMessagesApi({...this.state.messagePagerInfo, page: page});      
    }

    render (){
      const{total,showNum ,page} = this.state.messagePagerInfo;
        return (
          <div className = "page">
            <div className = "aboveList">
              <div class = "btn-group" style = {{width: '100px'}}>
              <button disabled = {page === 1} onClick = {()=>this.messagePagerHandler("left")} type ="button" class ="btn btn-default">
                <span class="glyphicon glyphicon-chevron-left"></span>
              </button>
              <button disabled = {total === 0 || page === Math.ceil(total/showNum)} onClick = {()=>this.messagePagerHandler("right")} type ="button" class ="btn btn-default">
                <span class="glyphicon glyphicon-chevron-right"></span>
              </button>
              </div>
            </div>

            <div>
              {this.renderingList()}
            </div>

          </div>
        );
    }
}

export default MyMessagePage;