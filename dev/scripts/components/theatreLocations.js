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
      combinedData: [],
      theatreSearchResults : [],
      searchHasBeenDone : false
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
    const movieTitle = this.props.movieTitle;
    axios({
      method: 'GET',
      url: 'http://proxy.hackeryou.com',
      dataResponse: 'json',
      paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: 'brackets' })
      },
      params: {
        reqUrl: `${config.internationalshowtimesApiURL}movies/`,
        params: {
          "search_query": movieTitle,
          "search_field": "title",
          "countries": "CA"
        },
        proxyHeaders: {
          "header_params": "value",
          "x-api-key": config.internationalshowtimesApiKey
        },
        xmlToJSON: false
      }
    }).then((res) => {
      console.log(res.data);
      if (res.data.movies.length === 0) {
        this.setState({
          // null leads to 'Sorry, we could not find any showtimes for that movie.' in render
          // using 'movieId: null' is better than creating a new state (a noMoviesAvailable state, for example) because it keeps the narrative linear instead of creating 2 arbitrary conditions - keeps the two states connected, as they are.
          movieId: null
        })
      } else {
        this.setState({
          movieId: res.data.movies[0].id
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
          lng: data.results[0].geometry.location.lng,
        })
        console.log(this.state.lat);
        console.log(this.state.lng);
        this.getTheatreLocations()
      });
  }

  getTheatreLocations() {
    this.setState({
      searchHasBeenDone : false
    });
    axios({
      method: 'GET',
      url: 'http://proxy.hackeryou.com',
      dataResponse: 'json',
      paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: 'brackets' })
      },
      params: {
        reqUrl: `${config.internationalshowtimesApiURL}showtimes/`,
        params: {
          "movie_id": this.state.movieId,
          "time_from": `${this.state.searchDate}T00:00:01-05:00`,
          "time_to": `${this.state.searchDate}T23:59-05:00`,
          "location": `${this.state.lat},${this.state.lng}`,
          "append": "cinemas",
          "cinema_fields": "name,id,location.address.display_text",
        },
        proxyHeaders: {
          "header_params": "value",
          "x-api-key": config.internationalshowtimesApiKey,
        },
        xmlToJSON: false
      }
    }).then((res) => {
      // make an object which will store our theatres (object of objects)
      // we do this because its easy to look up values using keys with objects
      let theatres = {}; 
      // in the axios response, there is a property 'data' which has a property 'cinemas' which is an array.
      res.data.cinemas.forEach((item) =>{
        // getting the exact info we want, and only that from each item in res.data.cinemas
        let newTheatre = {
          name : item.name,
          address : item.location.address.display_text,
          showtimes : []
        } 
        // insert the newthertare object with the key of item.id, so we can look it up later....the theatres object above at the index 'itemId' make the object 'newThetre'
        theatres[item.id] = newTheatre;
      })

      res.data.showtimes.forEach((showtime) => {
        console.log(showtime);
        let cinemaId = showtime.cinema_id;
        // if our theatres object has a property of showtime.cinema_id, then add that time to the theatre object at that key
        if(theatres[cinemaId]){
          let originalTime = showtime.start_at;
          // time = the time returned in the getFormatedTime function below
          let timeA = this.getFormattedTime(originalTime,false);
          let timeB = this.getFormattedTime(originalTime, true);
          // push the newly formatted time into the array [cinemaId].showtimes in the theatres object
          // we push an array of two times into the showtimes array
          //one of those times (timeA) is between 0 and 24 and timeB is between 0 and 12
          theatres[cinemaId].showtimes.push([timeA,timeB]);
        }
      })

      console.log(theatres);
      // for the theatre object, took each key value pair, and discarded the key and just kept the values as an array of objects
      console.log(Object.values(theatres));

      this.setState({
        // the state theaterSearchResults is the values of the theatres object we created above
        theatreSearchResults: Object.values(theatres),
        searchHasBeenDone : true
      })
    });
  }

  // helper method that takes unformatted time and returns it as a formatted time for getTheaterLocations
  getFormattedTime(unformattedTime,normalized){
    // split splits the array into two, then you are left with 2 items with an index of [0] and [1]
    // so exaple for below, split "2018-03-08T20:45:00-05:00" at 'T' and take the second item (item with the index of [1]), then split that at '-' and take the first item, the item with the index of [0]
    let clock = unformattedTime.split("T")[1].split("-")[0];
    // continuing from the example above, let day = 2018-03-08
    let day = unformattedTime.split("T")[0];
    // let split time = '20', '45', and '00'
    let splitTime = clock.split(":");
    // let hour = '20'
    let hour = splitTime[0];
    // let minute = '45'
    let minute = splitTime[1];
    // We do the below so we can identify AM vs PM: anything 12 and on would be afterneoon
    let afternoon = (hour > 11);
    // if its 12 o'clock, formatted hour should be 12 (trying to change it from 00 or 24), otherwise hour modulo 12. 
    let formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    // if afternoon is truthy, the return 'PM', else 'AM'
    // return the below into the above 
    if(normalized){
      return `${formattedHour}:${minute} ${afternoon ? "PM" : "AM"}`;  
    }
    else{
      return `${hour}:${minute}`;
    }
      
  }

  render() {
    return (
      <div>
        {
          // if there is something in the this.state.movieId, show: 
          this.state.movieId ?
             <form onSubmit={this.submit}>
                <input type="text" id="userText" value={this.state.userText} onChange={this.handleLocationChange} placeholder="Enter city, address, or postal code" />
                <label htmlFor="userText"><span className="visuallyhidden">Enter city, address, or postal code</span>where?</label>
                <input type="date" id="searchDate" value={this.state.searchDate} onChange={this.handleDateChange} min="" />
                <label htmlFor="searchDate">when?</label>
                <input type="submit" value="Search for showtimes" />
              </form>
              // else display this message:
            : <p>Sorry, we could not find any showtimes for that movie.</p>
        }
        {!(this.state.theatreSearchResults.length === 0) ?
          <div>
              {/* Reminder: this.state.theatreSearchResults is the array of values (object.values) of the theatres object we made in the function getTheatreLocations */}
              {this.state.theatreSearchResults.map((theatre) => {
                return (
                  <div>
                    <h4>{theatre.name}</h4>
                    <h4>{theatre.address}</h4>
                    {/* map through the object.values of theatres and sort theatre.showtimes (at [0] looks like 2:45 PM, for example). Make each part of the string before the ':' (at [0]) an integer. Then retun the bigger integer first (order the tim from smallest to largest) */}
                    {theatre.showtimes.sort((a, b) => {
                    // a is one item, b another, the function can only compare 2 at a time, but it compares all the times
                      // this is a helper method too; it retuns the order which is then maintained when maped below
                      // we sort the showtimes by their 0-24:00 time
                      return parseInt(a[0].split(":")[0]) > parseInt(b[0].split(":")[0]);
                    // then find all the showtime items and render them below.
                    }).map((showtime) => {
                      return <h5>{showtime[1]}</h5>
                    })}
                  </div>
                )
              })}
            </div>
          : <div>
              {this.state.searchHasBeenDone ? 
                <p>Sorry, we could not find any showtimes for that movie.</p> : null}
            </div>   
        }
      </div>
    )
  }
}

export default TheatreLocations