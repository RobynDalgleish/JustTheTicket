import React from 'react';
import axios from 'axios';
import config from './config.js';

class TheatreLocations extends React.Component {

  constructor() {
    super();
    this.state = {
      lat: '',
      lng: '',
    };
    this.getMovieId = this.getMovieId.bind(this);
  }
  componentDidMount(props) {
    // get latitude and longitude from the user inputed address
      axios
        .get(config.googleURL, {
          params: {
            key: config.googleKey,
            address: '483 Queen Street West, Toronto, ON'
          }
        })
        .then(({ data }) => {
          this.setState({
            lat: data.results[0].geometry.location.lat,
            lng: data.results[0].geometry.location.lat,
          })
        });
      this.getMovieId();
    }

    
  
  // get the film id for the movieGlu api from the movie title prop
  getMovieId() {

  }


    // get the user inputed date

    // get the location of a cinema using the aquired latitude, longitude, movie id, and user inputed date
    // getCinema() {
    //   axios
    //     .get(``, {
    //       headers: {
    //         "user-key": `53314a8415a07eafa4656461b1c6272d`
    //       },
    //       params: {
    //         // q: 'toronto'      

    //         latitude: lat,
    //         longitude: lon,
    //         // radius: '50',
    //       }
    //     })
        
    //     .then(({ data }) => {
    //       console.log(data);
    //       // const restRes = data.restaurants[4].restaurant.name;
    //       // // console.log(restRes);
    //       // const restAdd = data.restaurants[4].restaurant.location.address;

    //       // const newList = {

    //       // };

    //       const newArray = Array.from(this.state.restaurants);

    //       data.restaurants.forEach(eatingPlace => {
    //         // console.log(eatingPlace.restaurant.name);
    //         // console.log(eatingPlace.restaurant.location.address);

    //         const restObj = { name: eatingPlace.restaurant.name, address: eatingPlace.restaurant.location.address };
    //         newArray.push(restObj);
    //       });

    //       console.log(newArray);

    //       this.setState({ restaurants: newArray });
    //     });
    //   }
    // }
  render() {
    return(
      <h1>ngnhg</h1>
    )
  }
}

export default TheatreLocations