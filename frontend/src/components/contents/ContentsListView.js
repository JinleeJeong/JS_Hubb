import React, { Component } from 'react';
import { AppContext } from '../../contexts/appContext';

class ContentsListView extends Component {
  static contextType = AppContext;

  state = {
    contents: [],
  }

  getContents = async () => {
    const contents = await this.context.actions.getContentsR1();
    this.setState({
      contents: contents,
    })
  }
  
  componentDidMount() {
    this.getContents();
  }

  render() {
    return (
      this.state.contents.map((contents, index) => {
        return <div key={index}>
          <h1>{contents.title}</h1> 
          <p>분류 : {contents.studyCategories}</p> 
          <p>스터디 설명 : {contents.description}</p>
          <img src={`http://localhost:8080/${contents.imageUrl}`} width="250" height="250" alt="coverimg" />
          <p>{contents.studyLocation}</p>
        </div>
      })
    );
  }
}

export default ContentsListView;