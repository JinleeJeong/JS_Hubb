import React, { Component } from 'react';
import { AppContext } from '../../contexts/appContext';
import queryString from 'query-string';
/* global naver */

class NearContentsListView extends Component {
  static contextType = AppContext;

  state = {
    contents: [],
    addresses: [],
  }

  getContents = async () => {
    const contents = await this.context.actions.getContents();
    this.setState({
      contents: contents,
    });
  }
  
  async componentDidMount() {
    this.getContents();
    const currentPosition = queryString.parse(this.props.location.search);
    const currentLatLng = new naver.maps.LatLng(currentPosition.lat, currentPosition.lng);

    this.setState({
      addresses: await this.getAddresses(currentLatLng),
    });
  }

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
    return (
      this.state.contents.map((contents, index) => {
        if(contents.studyLocation.split(' ').splice(0,2).join(' ') === '서울특별시 중구')
        return <div key={index}>
          <h1>{contents.title}</h1> 
          <p>분류 : {contents.category}</p> 
          <p>스터디 설명 : {contents.description}</p>
          <img src={`http://localhost:8080/${contents.imageUrl}`} width="250" height="250" alt="coverimg" />
          <p>{contents.studyLocation}</p>
        </div>
      })
    );
  }
}

export default NearContentsListView;