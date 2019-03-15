import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, ButtonGroup, Button } from 'react-bootstrap';
import { AppContext } from '../../contexts/appContext';
import queryString from 'query-string';

/* global naver */

class ContentsController extends Component {
  static contextType = AppContext;

  state = {
    title: '',
    category: [],
    description: '',
    addresses: [],
    selectedLocation: '',
  }
  
  //확인 버튼 클릭시 formData 초기화 후 context addContents에 formData 전달하여 호출
  addContents = async (e) => {
    e.preventDefault();
    const { title, category, description, selectedLocation: studyLocation } = this.state;
    const coverImg = document.getElementById('coverImg').files[0];
    const dataInObject = {
      title,
      category,
      description,
      studyLocation,
      coverImg,
    };
    const formData = new FormData();

    Object.keys(dataInObject).map((key) => {
      return formData.append(key, dataInObject[key]);
    });

    await this.context.actions.addContents(formData);
  }

  async componentDidMount() {
    const currentPosition = queryString.parse(this.props.location.search);
    const currentLatLng = new naver.maps.LatLng(currentPosition.lat, currentPosition.lng);
    
    this.setState({
      addresses: await this.getAddresses(currentLatLng),
    });

    const map = new naver.maps.Map('naverMap', {
      center: currentLatLng,
      zoom: 10
    });
    const marker = new naver.maps.Marker({
      position: currentLatLng,
      map: map,
    });
    naver.maps.Event.addListener(map, 'click', async (e) => {
      marker.setPosition(e.latlng);
      this.setState({
        addresses: await this.getAddresses(e.latlng),
      });
    });
  };

  getAddresses = (latlng) => {
    const tm128 = naver.maps.TransCoord.fromLatLngToTM128(latlng);
    
    return new Promise((resolve, reject) => {
      naver.maps.Service.reverseGeocode({
        location: tm128,
        coordType: naver.maps.Service.CoordType.TM128
      },(status, response) => {
          if (status === naver.maps.Service.Status.ERROR) {
            return reject(alert('지도 API 오류입니다.'));
          };
  
          const { items } = response.result;
          const addresses = [];

          for (let i=0, ii=items.length, item; i<ii; i++) {
            item = items[i];
            addresses.push(item.address);
          };
          return resolve(addresses);
      });
    });
  }

  render() {
    return(
      <div className = "row">
        <div className = "col-md-4 col-md-offset-4">
          <h1 className = "FormHeader">스터디 작성 페이지</h1>
          <form>
            <FormGroup>
              <ControlLabel>제목</ControlLabel>
              <FormControl
                type = "text"
                name="title"
                onChange={(e) => { this.setState({ title: e.target.value})}}
              >
              </FormControl>
            </FormGroup>

            <FormGroup>
              <ControlLabel>분류 선택</ControlLabel><br />
              <ButtonGroup>
                <Button onClick={(e) => { this.setState({ category: [...this.state.category, e.target.value] })}} name="category" value="영어 회화">영어 회화</Button>
                <Button onClick={(e) => { this.setState({ category: [...this.state.category, e.target.value] })}} name="category" value="자소서">자소서</Button>
                <Button onClick={(e) => { this.setState({ category: [...this.state.category, e.target.value] })}} name="category" value="면접">면접</Button>
                <Button onClick={(e) => { this.setState({ category: [...this.state.category, e.target.value] })}} name="category" value="알고리즘">알고리즘</Button>
                <Button onClick={(e) => { this.setState({ category: [...this.state.category, e.target.value] })}} name="category" value="프로젝트">프로젝트</Button>
              </ButtonGroup>
            </FormGroup>

            <FormGroup controlId="formControlsSelect">
              <ControlLabel>주소 선택</ControlLabel>
              <div id="naverMap" style={{ width:'100%', height:'400px'}} />
              <FormControl 
                componentClass="select" 
                onChange={(e) => { this.setState({ selectedLocation: e.target.value }) }}
              >
              <option>주소 선택</option>
              {this.state.addresses.map((address, index) => {
                return <option value={address} key={index}>{address}</option>
              })}
              </FormControl>
            </FormGroup>
            
            <FormGroup controlId="formControlsTextarea">
              <ControlLabel>스터디 설명</ControlLabel>
              <FormControl 
                name="description" 
                componentClass="textarea"
                onChange={(e) => { this.setState({ description: e.target.value})}} 
                placeholder="스터디 설명/모임 시간 등을 적어주세요." />
              </FormGroup>

              <FormGroup>
                <ControlLabel>커버 이미지</ControlLabel>
                <input type="file" id="coverImg" multiple/>
              </FormGroup>

            <Button bsStyle="primary" block type = "submit" onClick={this.addContents}>
              확인
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default ContentsController;