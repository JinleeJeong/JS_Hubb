import React, { Component } from 'react';
import Carou from './Carou';
import { Button } from 'react-bootstrap';
// import CardList from './CardList';
// import CardForm from './CardForm';
import './Carou.css';
import './study.css';
import { AppContext } from '../../contexts/appContext';
class study extends Component {
  static contextType = AppContext;

  state = {
    contents: [],
    Participants:[],
  }

  getContents = async () => {
    const contents = await this.context.actions.getContentsR1();
    this.setState({
      contents: contents,
    })
  }
  addParticipants = async (e) => {
    e.preventDefault();
    
    const { Participants } = this.state;
    
    const dataInObject = {
      Participants
    };
    const formData = new FormData();
    Object.keys(dataInObject).map((key) => {
      return formData.append(key, dataInObject[key]);
    });

    await this.context.actions.addParticipants(formData);
  }




  componentDidMount() {
    this.getContents();
  }




  render() {
    const { information } = this.state;
    return (
      this.state.contents.map((contents, index) => {
        return <div key={index}>
          <body>

            <div class="navbar">
              <a href="#">Link</a>
              <a href="#">Link</a>
              <a href="#">Link</a>
              <a href="#">Link</a>
            </div>

            <div class="row">
              <div class="side2"></div>
              <div class="main">

              <h1>{contents.title}</h1>
                <h5>Title description, Dec 7, 2017</h5>
                <Button onClick={
                  
                  (e) => { this.setState({ Participants: [...this.state.Participants, e.target.value] })}
                  } name="Participants" value="참여자1">참여하기</Button>
                  <Button bsStyle="primary" block type = "submit" onClick={this.addParticipants}>
              확인
            </Button>
                {/* 스터디 참여기능 */}
                 <Carou pictureUrl={`http://localhost:8080/${contents.imageUrl}`}></Carou> 
                <p>스터디 내용..</p>
                <p>{contents.description}</p>
                <br></br>
                <div className="cardList">
                  <h2>Attendees</h2>

                  {/* <CardForm
                onCreate={this.handleCreate}
              />
              <CardList 
                data={information}
                onRemove={this.handleRemove}
              /> */}
                </div>
                
              </div>
              <div class="side">
                <h2>What?</h2>
                <p>분류 : {contents.category}</p>
                <h2>Where?</h2>
                <p>{contents.studyLocation}</p>
                <h2>How?</h2>
                <p>You can reach Chania airport from all over Europe.</p>
                <h3>More Text</h3>
                <p>Lorem ipsum dolor sit ame.</p>
                <div class="fakeimg">Image</div><br></br>
                <div class="fakeimg">Image</div><br></br>
                <div class="fakeimg">Image</div>
              </div>
              <div class="side2"></div>
            </div>
          </body>
        </div>
      })
      );
  }
}

  export default study;