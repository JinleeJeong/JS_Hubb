import React, { Component } from 'react';
import CardInfo from './CardInfo';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
class CardList extends Component {
  static defaultProps = {
    list: [],
    onRemove: () => console.warn('onRemove not defined'),
  }

  render() {
    

    const { data, onRemove } = this.props;
    const list = data.map(
      info => (
        <div>
        <Col margin = '-50px'>
        <CardInfo  
          key={info.id}
          info={info}
          onRemove={onRemove}
        />
        </Col>
        </div>
        )
    );

    return (
      <div>
        <Row>
        {list}
        </Row>    
      </div>
    );
  }
}

export default CardList;