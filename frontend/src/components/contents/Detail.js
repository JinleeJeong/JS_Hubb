import React, { Component } from 'react';
import './Detail.css';

import { AppContext } from '../../contexts/appContext';

// import { ButtonToolbar, Button, Row, Col, Image } from 'react-bootstrap';
class Detail extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      boards: [],
      detailTerm: props.match.params.id,
    }
    // this.searchUpdated = this.searchUpdated.bind(this)
  }

  async componentDidMount() {
    // 진리님 코드
    // axios.get('http://localhost:8080/api/contents/detail/'+this.state.detailTerm)
    //   .then(res => {
    //     this.setState({
    //   boards : res.data,
    //   });
    //     console.log(this.state.contents);
    //   });
    const { detailTerm } = this.state;
    this.setState({
      boards: await this.context.actions.getContentsDetail(detailTerm),
    })
  };

  render() {
    console.log(this.state.detailTerm);
    return (
      <section className="infoma">
      <div>
        <div>
          <div className="info_search">정렬 기준 : 정확도 순</div>
          <div className="info_cate"> 
                <div className = "info_category_1">
                
                    <div className = "info_divided">
                          <button className="info_button"><div className ="info_named"><img src ={`http://localhost:8080/`+this.state.boards.imageUrl} alt ="Testing" width ="50%" height="50%"/></div></button>
                          <div className ="info_title">{this.state.boards.title}</div>
                          <div className ="info_description">{this.state.boards.description}</div>
                          <div className ="info_category">{this.state.boards.category}</div>
                        </div>

                </div>
          </div>                        
        </div>
      </div>
    </section>
    );
  }
}

export default Detail;