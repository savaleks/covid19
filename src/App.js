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
    Axios.get(`https://covid19.mathdro.id/api/countries`)
    .then(res => 
      res.data.countries.map(country => ({
        name: `${country.name}`
      })))
      .then(countries => {
        this.setState({
          countries
        });
      })
  }

  async getData() {
    const res = await Axios.get("https://covid19.mathdro.id/api");

    this.setState({
      confirmed: res.data.confirmed.value,
      recovered: res.data.recovered.value,
      deaths: res.data.deaths.value
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
        return <option>{country.name}</option> 
    });
  }

  render() {
    
    return (
      <div className="container">
        <h1 className="header-text">Corona Virus Online</h1>
        <h4 className="warning">Warning: the data can be inaccurate.</h4>

        <select className="dropdown" onChange={this.getCountryData}>
            <option>Worldwide</option>
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
