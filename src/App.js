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
      hasTemp: false,
      temp: null,
      city: null,
      state: null,
      Country: null,
      hasCity: false,
      weather:''
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
        console.log(data);
        this.setState({
          loadingLatlng: false,
          hasLatlng: false,
        })

        throw new Error(`Did not get lat long`)
      } else {

        this.setState({
          loadingLatlng: false,
          hasLatlng: true,
          latlng: data.results[0].geometry.location,
          city: data.results[0].address_components[0].long_name,
          state: data.results[0].address_components[1].short_name,
          country:data.results[0].address_components[2].long_name
        })
      this.getTemp(this.state.latlng.lat, this.state.latlng.lng)
      return data.results[0].geometry.location
      }
    })
  }

  getTemp(lat,lng) {
    return fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=72af66db614bf9fd03583352142dd7a7`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        console.log(data.weather[0].main);

        this.setState({
          hasTemp: true,
          temp: parseInt(data.main.temp - 273.15),
          weather: data.weather[0].main
        })
      })
  }

  getCity(){
    var city = document.getElementById("city").value
    this.getlatlng(city)

    this.setState({
      city: city,
      hasCity: true
    })
  }


  componentDidMount() {
    if(this.state.hasCity){
      this.getlatlng(this.state.city)       //life cycle hook
    //.then(result => this.getTemp(result.lat, result.lng))
    }
  }


  renderMsg() {
    if(this.state.loadingLatlng) {
      return(
        <div>Loading . . .</div>
      )
    }if(!this.state.loadingLatlng && this.state.hasLatlng){
      return(

          <div>
            <div> The weather in {this.state.city}, {this.state.country} is</div>
            <h1>{this.state.temp } &#8451;</h1>
            <h3> {this.state.weather} </h3>
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
          <br/><br/><br/><br/>
          {this.renderMsg()}
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
