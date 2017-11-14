import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props)

    this.renderMsg = this.renderMsg.bind(this)
    this.getlatlng = this.getlatlng.bind(this)
    this.getTemp = this.getTemp.bind(this)
    this.getCity = this.getCity.bind(this)

  this.state = {
    loadingLatlng: false,
    hasLatlng: false,
    latlng: {},
    temp: '',
    city: 'Sydney',
    hasCity: false
  }

}


getSomethignElse(result) {
  console.log(result);

}


getlatlng(city) {
  this.setState({
    loadingLatlng: true
  })
  return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}`)
    .then(response => response.json())
    .then(data => {
    if(data.status !== `OK`) {

      this.setState({
        loadingLatlng: false,
        hasLatlng: false,
      })

      throw new Error(`Did not get lat long`)
  } else {
    this.setState({
      loadingLatlng: false,
      hasLatlng: true,
      latlng: data.results[0].geometry.location
    })
    return data.results[0].geometry.location
  }
})
}

getTemp(lat,lng) {
  return fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=72af66db614bf9fd03583352142dd7a7`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      this.setState({
        temp: data.main.temp - 273.15
      })

    })
}


getCity(){
  var city = document.getElementById("city").value
  this.getlatlng(city)
  this.getTemp(this.state.latlng.lat, this.state.latlng.lng)
  this.setState({
    city: city,
    hasCity: true

  })
}


componentDidMount() {
  //if(this.state.hasCity){
    this.getlatlng(this.state.city)       //life cycle hook
    .then(result => this.getTemp(result.lat, result.lng))

  //}
}


renderMsg() {
  if(this.state.loadingLatlng) {
    return(
      <div>Loading . . .</div>
    )


} if(!this.state.loadingLatlng && this.state.hasLatlng){
    return(

      <div>
        <div> The lattitude and longitude of {this.state.city} is</div>
        <div> Lattitude: {this.state.latlng.lat} </div>
        <div> Longitude: {this.state.latlng.lng} </div>

        <div> The Temp of {this.state.city} is </div>
        <div> Temp {this.state.temp} </div>


      </div>

    )
  }
}


  render() {
    if(!this.hasCity){
      return (
        <div className="App">
          <h3> Weather App </h3><br/>
          <input  id="city" type="text"></input>
          <button id="getWeather" class="btn btn-default" onClick={this.getCity}>Get Weather</button>
          {this.renderMsg()}
          <br/><br/><br/><br/>
       </div>
      )
    }else{
      return(
        <div>
          <div className="App">
            <h3> Weather App </h3>
          </div>
          <div>
            {this.renderMsg()}
          </div>
        </div>
      )
    }
  }
}

export default App;