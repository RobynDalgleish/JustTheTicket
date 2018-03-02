import React from 'react';
import Nav from './nav';
import axios from 'axios';
import config from './config.js';
import TheatreLocations from './theatreLocations.js';

// Initialize Firebase
const configuration = {
    apiKey: "AIzaSyAy4PXK2rmuB3mf9nW-OH2j5zIun36oxkQ",
    authDomain: "justtheticket-3b06f.firebaseapp.com",
    databaseURL: "https://justtheticket-3b06f.firebaseio.com",
    projectId: "justtheticket-3b06f",
    storageBucket: "",
    messagingSenderId: "690914500190"
};

firebase.initializeApp(configuration);

class SingleMovie extends React.Component{

    constructor() {
        super();
        this.state = {
            movieObject: {},
            movieTitle: '',
            reviewObject: {}
        }
    }

    componentDidMount() {
        //Connect to MovieDB
        // console.log(this)
        axios.get(`${config.movieApiURL}/movie/${this.props.match.params.movie_id}`, {
            params: {
                api_key: config.movieApiKey,
            }
        })
            .then(({ data }) => {
                console.log(data)
                this.setState({
                    movieObject: data,
                    movieTitle: data.title,
                })

                //Connect to New York Times
                axios.get(`${config.apiURL}`, {
                    params: {
                        api_key: config.api_key,
                        query: this.state.movieTitle
                    }
                })
                    .then(({ data }) => {
                        console.log(data.results[0])
                        this.setState({
                            reviewObject: data.results[0]
                        })
                    });
            });
    }

    render(){
        return(
            <div>
                <Nav />
                
                <img src={`https://image.tmdb.org/t/p/w500/${this.state.movieObject.poster_path}`}
                    alt={`Poster`} />
                <a href={this.state.movieObject.homepage} target="_blank">
                    <h1>{this.state.movieObject.title}</h1>
                </a>

                <p>
                {this.state.reviewObject.mpaa_rating} | 
                {this.state.movieObject.runtime} minutes | 
                </p>
                
                <TheatreLocations movieTitle={this.state.movieTitle}/>

            </div>
        )
    }
}

export default SingleMovie;