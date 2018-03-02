import React from 'react';
import Nav from './nav';
import axios from 'axios';
import config from './config.js';
import {Link} from 'react-router-dom';
class SearchResults extends React.Component {
    constructor() {
        super();
        this.state = {
            moviesPlaying: [],
            genreMoviesPlaying: [],
            page: 1,
        }
        // this.getOnePage = this.getOnePage.bind(this);
    }

    // getOnePage(i) {
    //     axios.get(`${config.movieApiURL}/movie/now_playing`, {
    //         params: {
    //             api_key: config.movieApiKey,
    //             page: i
    //         }
    //     })
    //         .then(({ data }) => {
    //             console.log(data);
    //             const moviesPlaying = data.results;
    //             const genreCodeNum = parseInt(this.props.match.params.genre_id);
    //             const newNewArray = moviesPlaying.filter(movie => movie.genre_ids.includes(genreCodeNum));
    //             newArray.push(newNewArray)
    //         })
    // }

    componentDidMount() {
        //Gets the NOW PLAYING movies sorted most popular first
        axios.get(`${config.movieApiURL}/movie/now_playing`, {
            params: {
                api_key: config.movieApiKey,
            }
        })
            .then(({ data }) => {
                const moviesPlaying = data.results;
                //The genre code is a string, and we need an interger
                //parseInt converts string to interget and we store that
                //in genreCodeNum
                const genreCodeNum = parseInt(this.props.match.params.genre_id);
                //This creates a new array from the movies in theatres, selecting only the movies that have the genre code we've selected
                const newArray = moviesPlaying.filter(movie => movie.genre_ids.includes(genreCodeNum));

                // So we check the legnth of the newArray 
                // for loop to check right after
                // if it's true it'll make the second call......

                // for (let i = 2; newArray.length < 5; i++) {
                // this.getOnePage(i);
                // console.log('We need More');
                // }
                //Now we take the new filtered array and set it to the state as genreMoviesPlaying
                this.setState({
                    genreMoviesPlaying: newArray,
                })
                

            });
    }
    ///HOWEVER sometimes the # of movies returned could be less than 5
    //We need to create a way to check for that & loop though another page
    //of API results
    render() {
        return (
            <div>
                <Nav />
                {/* Ternary operator only posts the movie info to the page
                after the data has been brought in from axios 
                We need to figure out how to link this to /movie/:movie_id*/}
                {this.state.genreMoviesPlaying.length !== 0 ?
                    this.state.genreMoviesPlaying.map((movie, i) => {
                        return (
                            <Link to={`/movie/284054`}>
                                <div key={this.state.genreMoviesPlaying[i].id}>
                                    <img src={`https://image.tmdb.org/t/p/w500/${this.state.genreMoviesPlaying[i].poster_path}`}
                                        alt={`Poster for ${this.state.genreMoviesPlaying[i].title}`} />
                                    <h1>{this.state.genreMoviesPlaying[i].title}</h1>
                                </div>
                            </Link>
                        )
                    })
                    : null}
            </div>
        )
    }
}
export default SearchResults;