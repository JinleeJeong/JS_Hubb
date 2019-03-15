import React, { Component, Fragment } from 'react';
import './Main.css';
import SearchInput, { createFilter } from 'react-search-input';
import movie from '../../images/movie.mp4'
import {Link} from 'react-router-dom';
import { AppContext } from '../../contexts/appContext';


const KEYS_TO_FILTERS = ['title']

class Main extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      contents: [],
      searchTerm: ''
    }
    this.searchUpdated = this.searchUpdated.bind(this)
  }

  async componentDidMount() {
    
    // 진리님 코드재서님꺼 합치면 작업
    // axios.get('http://localhost:8080/api/user')
    // .then(res => {
    //   this.setState({ 
    //     users: res.data,      
    //   });
    //   // console.log(this.state.users);
    // });
    // 진리님 코드
    // axios.get('http://localhost:8080/api/contents/r2')
    // .then(res => {
    //   this.setState({
    //     contents : res.data,
    //   });
    //   console.log(this.state.contents);
    // });
    this.setState({
      contents: await this.context.actions.getContentsR2(),
    })
  };

  searchUpdated (term) {
    // if(term === ''){
    //   this.setState({searchTerm : 'ForExample'})
    // }
    // else {
    //   this.setState({searchTerm : term})
    // }
    this.setState({searchTerm: term})
  }
  
  
  render() {
    const filter = this.state.contents.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
  
    return (
      <Fragment>
        <div className="_container">
          <section className="background">
            <div className="background_video">
                <video loop muted={this.props.muted} autoPlay={true}>
                    <source type="video/mp4" data-reactid=".0.1.0.0.0" src={movie} />
                </video>
                
              <div className="background_search">
                <div className="background_search_Text">
                <SearchInput className="searchInput" onChange={this.searchUpdated} placeholder="Search Category" />
                  <Link to={`/category/`+this.state.searchTerm+`/`}>
                  <span className="glyphicon glyphicon-search" aria-hidden="true" ></span>
                  </Link>
                </div>
              </div>
            </div>
            
          </section>
          <section className="infomad">
            <div>
              <div>
                
                <div className="info_cate"> 

                      <div className = "info_category"> <div className="info_search">정렬 기준 : Hot Topic Ⅰ</div>
                        {this.state.contents.map((board, index) => 
                          { 
                            if(index < 3){
                            return (
                              <div className = "info_divide" key={index}>
                                
                                <button className="info_button"><div className ="info_named"><img src ={`http://localhost:8080/`+board.imageUrl} alt ="Testing" width ="70%" height="auto"/></div></button>
                                <div className ="info_titles">{board.title}</div>
                                {/* <div className ="info_description">{board.description}</div> */}
                                <div className ="info_category">{board.category}</div>
                              </div>
                          )
                          } else return console.log('end');
                          })
                        } 
                      </div>

                      <div className = "info_category"> <div className="info_search">정렬 기준 : Hot Topic Ⅱ </div>
                        {this.state.contents.map((board, index) => 
                          { 
                            if(index < 3){
                            return (
                              <div className = "info_divide" key={index}>
                                
                                <button className="info_button"><div className ="info_named"><img src ={`http://localhost:8080/`+board.imageUrl} alt ="Testing" width ="70%" height="auto"/></div></button>
                                <div className ="info_title">{board.title}</div>
                                <div className ="info_description">{board.description}</div>
                                <div className ="info_category">{board.category}</div>
                              </div>
                          )
                          } else return console.log('end');
                          })} 

                      </div>

                    
                </div>                        
              </div>
            </div>
          </section>
          <div className ="other_info"></div>
        </div>
        <div>
      </div>
      
      </Fragment>
    )
  }
  
}

export default Main;