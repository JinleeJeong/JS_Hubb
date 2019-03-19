import React, { Component } from 'react';
import {Card} from 'react-bootstrap'
import {Button} from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
class CardInfo extends Component {
  static defaultProps = {
    info: {
      name: '이름',
      phone: '010-0000-0000',
      id: 0
    },
  }

  handleRemove = () => {
    // 삭제 버튼이 클릭되면 onRemove 에 id 넣어서 호출
    const { info, onRemove } = this.props;
    onRemove(info.id);
  }

  render() {
    const style = {
      width: '8.5rem', 
      border: '1px solid gray',
      padding: '3px',
      margin: '5px'
    };
    const style2 = {
      border: '1px solid gray',
      
    };
    const {
      name, phone
    } = this.props.info;

    return (
 
        <Row>
      <Card style={style} id="cardsty">
        <Card.Img style = {style2} variant="top" src="http://cdnweb01.wikitree.co.kr/webdata/editor/201603/03/img_20160303113112_20663c74.jpg" thumbnail />
        <Card.Body>
          <Card.Title><div><b>{name}</b></div></Card.Title>
          <Card.Text>{phone}</Card.Text>
          <Button variant="primary" onClick={this.handleRemove}>삭제</Button>
        </Card.Body>
      </Card>
      </Row>

    );
  }
}

export default CardInfo;