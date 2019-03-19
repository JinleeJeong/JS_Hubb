import React, { Component } from 'react';
import {Carousel} from 'react-bootstrap'
import './Carou.css';
import groupstudy from './group-study.jpg'
import groupstudy2 from './groupstudy.jpg'
import groupstudy3 from './groupstudy3.jpg'
class Carou extends Component {
  
  render() {
    const { pictureUrl } = this.props;
    console.log(groupstudy);
    return (
      
      <div className="App">
        <Carousel className = "card">
          <Carousel.Item>
            <img width={500} height={500}
              className="d-block w-100"
              src={pictureUrl}
              
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img width={500} height={500}
              className="d-block w-100"
              src={groupstudy2}
              alt="Second slide" 
            />

            <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img width={500} height={500}
              className="d-block w-100"
              src={groupstudy3}
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    );
  }
}

export default Carou;