import React from "react";
import Axios from "axios";
import "./style.css";

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.getCountryData = this.getCountryData.bind(this);
    }    

  state = {
    confirmed: 0,
    recovered: 0,
    deaths: 0,
    countries: []
  };

  componentDidMount() {
    this.getData();
  }

  async getData() {
    const res = await Axios.get("https://covid19.mathdro.id/api");
    const resCountries = await Axios.get("https://covid19.mathdro.id/api/countries");
    const countries = Object.keys(resCountries.data.countries);
    this.setState({
      confirmed: res.data.confirmed.value,
      recovered: res.data.recovered.value,
      deaths: res.data.deaths.value,
      countries
    });
  }

  async getCountryData(e) {
      if(e.target.value === "Select country"){
          return this.getData();
      }
      try {
        const res = await Axios.get(`https://covid19.mathdro.id/api/countries/${e.target.value}`);
        this.setState({
            confirmed: res.data.confirmed.value,
            recovered: res.data.recovered.value,
            deaths: res.data.deaths.value
        });
      } catch (error) {
          if(error.response.status === 404)    
          this.setState({
            confirmed: "No data available",
            recovered: "No data available",
            deaths: "No data available"
          })
      }
  }

  renderCountryOptions(){
    return this.state.countries.map((country, i) => {
        return <option key={i}>{country}</option> 
    });
  }

  render() {
    return (
      <div className="container">
        <h1>Corona Update</h1>

        <select className="dropdown" onChange={this.getCountryData}>
            <option>Select country</option>
            {this.renderCountryOptions()}
        </select>

        <div className="flex">
          <div className="box confirmed">
            <h2>Confirmed cases</h2>
            <h3>{this.state.confirmed}</h3>
          </div>
          <div className="box recovered">
            <h2>Recovered cases</h2>
            <h3>{this.state.recovered}</h3>
          </div>
          <div className="box deaths">
            <h2>Deaths</h2>
            <h3>{this.state.deaths}</h3>
          </div>
        </div>
      </div>
    );
  }
}
