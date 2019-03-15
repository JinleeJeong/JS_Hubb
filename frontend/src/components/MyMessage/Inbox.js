import React from 'react'
import {Image} from 'react-bootstrap';
import './Inbox.css';

const Inbox = (props) => {

  return (
        <li className = "list-group-item container">
          <div className = "row messageRowStyle">
            <div className = "col-md-1 no-float"><input type = "checkbox" value = ""/></div>
            <div className = "col-md-1 no-float">
              <Image className = "userProfile" src = "http://dimg.donga.com/egc/CDB/KOREAN/Article/14/91/17/17/1491171704037.jpg"/>
            </div>
            <div className = "col-md-9 no-float textContainer">
                <h4 class="list-group-item-heading"><b>{props.title}</b></h4>
                <p class="list-group-item-text">{props.body}</p>          
            </div>
            <div className = "col-md-1 no-float">
              <span>오늘</span>
            </div>
        </div>
        </li>
  );

}

export default Inbox;