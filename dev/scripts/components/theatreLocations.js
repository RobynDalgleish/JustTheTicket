import React from 'react';
import axios from 'axios';
import config from './config.js';
import Qs from 'qs';

class TheatreLocations extends React.Component {

  constructor(props) {
    super();
    this.state = {
      lat: '',
      lng: '',
      userText: '',
      searchDate: '',
      movieId: '',
    };
    this.getMovieId = this.getMovieId.bind(this);
    this.getLatLng = this.getLatLng.bind(this);
    this.submit = this.submit.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.getTheatreLocations = this.getTheatreLocations.bind(this);
  }

  // Now we have all the movie information (passing the prop with a ternary operation in the singleMovie component), on componentDidMount call the movieId function. We need the movie title before we can GET the id.
  componentDidMount() {
    this.getMovieId();
  }
  // get the film id for the movieGlu api from the movie title prop
  getMovieId() {
    // .replace = regex. -> '/ /' are separating elements, \ not sure, 'g' is global(replace every instance and not just the first), the '+' is what we are replacing empty space with
    const movieTitle = this.props.movieTitle.replace(/ /g, '+').toLowerCase();

    axios({
      method: 'GET',
      url: 'http://proxy.hackeryou.com',
      dataResponse: 'json',
      paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: 'brackets' })
      },
      params: {
        reqUrl: `${config.movieGluApiURL}filmLiveSearch/`,
        params: {
          "query": movieTitle
        },
        proxyHeaders: {
          "header_params": "value",
          "x-api-key": config.movieGluApiKey,
          "client": "NONE_4",
          "Authorization": "Basic Tk9ORV80OnVZWFY5ME1WckpacA==",
          "api-version": "v102",
          "Credential": "uYXV90MVrJZp"
        },
        xmlToJSON: false
      }
    }).then((res) => {
      if (res.data.films.length === 0) {
        this.setState({
          // null leads to 'Sorry, we could not find any showtimes for that movie.' in render
          // using 'movieId: null' is better than creating a new state (a noMoviesAvailable state, for example) because it keeps the narrative linear instead of creating 2 arbitrary conditions - keeps the two states connected, as they are.
          movieId: null
        })
      } else {
        this.setState({
          movieId: res.data.films[0].film_id
        })
      }
      console.log(this.state.movieId);
    });
  }

  submit(e) {
    e.preventDefault();
    // prevents page reload and passes the inputed text to the getLatlng, and also calls that functions
    const inputedLocation = this.state.userText;
    const inputedDate = this.state.searchDate;
    // const inputedDate = this.state.searchDate;
    this.getLatLng(inputedLocation)
    // this.getLocation(inputedDate)
  }

  // let's us track every key pressed in the location input
  handleLocationChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    })
    console.log(e.target.value)
  }

  handleDateChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    })
    console.log(e.target.value)
  }

  getLatLng(inputedLocation) {
    // get latitude and longitude from the user inputed address
    axios
      .get(config.googleApiURL, {
        params: {
          key: config.googleApiKey,
          address: inputedLocation
        }
      })
      .then(({ data }) => {
        this.setState({
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lat,
        })
        this.getTheatreLocations()
      });
  }

  getTheatreLocations() {
    axios({
      method: 'GET',
      url: 'http://proxy.hackeryou.com',
      dataResponse: 'json',
      paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: 'brackets' })
      },
      params: {
        reqUrl: `${config.movieGluApiURL}filmShowTimes/?`,
        params: {
          "film_id": movieId,
          "date": searchDate,
        },
        proxyHeaders: {
          "header_params": "value",
          "x-api-key": config.movieGluApiKey,
          "client": "NONE_4",
          "Authorization": "Basic Tk9ORV80OnVZWFY5ME1WckpacA==",
          "api-version": "v102",
          "Credential": "uYXV90MVrJZp",
          "Geolocation": `${lat};${lng}`
        },
        xmlToJSON: false
      }
    }).then((res) => {
      console.log(res);
    });
  }

  render() {
    return (
      <div>
        {
          // if there is anything in state that says there are no movies available, then show no movies available message
          this.state.movieId
            ? <form onSubmit={this.submit}>
              <input type="text" id="userText" value={this.state.userText} onChange={this.handleLocationChange} placeholder="Enter city, address, or postal code" />
              <label htmlFor="userText"><span className="visuallyhidden">Enter city, address, or postal code</span>where?</label>
              {/* how do I pass this date value AND the movie id to the final function? */}
              <input type="date" id="searchDate" value={this.state.searchDate} onChange={this.handleDateChange} min="" />
              <label htmlFor="searchDate">when?</label>
              <input type="submit" value="Search for showtimes" />
            </form>
            : <p>Sorry, we could not find any showtimes for that movie.</p>
          // else, show the form
        }
      </div>
    )
  }
}

export default TheatreLocations