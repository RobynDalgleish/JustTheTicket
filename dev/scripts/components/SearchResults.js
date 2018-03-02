import React from 'react';
import Nav from './nav';
import axios from 'axios';
import config from './config.js';

class SearchResults extends React.Component{

    constructor(){
        super();
        this.state = {
            genreCode: '', 
            moviesPlaying: [],
            genreMoviesPlaying: [],
            page: 1,
        }
    }
    
    componentDidMount() {

        //Gets the NOW PLAYING movies sorted most popular first
        axios.get(`${config.movieApiURL}/movie/now_playing`, {
            params: {
                api_key: config.movieApiKey,
            }
        })
            .then(({ data }) => {

                //This pulls our genre code from the URL
                //And the results from our axios call
                //And sets them to the state
                this.setState({
                    genreCode: this.props.match.params.genre_id,
                    moviesPlaying: data.results
                })

                //The genre code is a string, and we need an interger
                //parseInt converts string to interget and we store that
                //in genreCodeNum
                const genreCodeNum = parseInt(this.state.genreCode)

                //This creates a new array from the movies in theatres, selecting only the movies that have the genre code we've selected
                const newArray = this.state.moviesPlaying.filter(movie => movie.genre_ids.includes(genreCodeNum));

                //Now we take the new filtered array and set it to the state as genreMoviesPlaying
                this.setState({
                    genreMoviesPlaying: newArray,
                })

                console.log(this.state.genreMoviesPlaying);
            

            });

            }
    
            ///HOWEVER sometimes the # of movies returned could be less than 5
            //We need to create a way to check for that & loop though another page
            //of API results


    render(){

        return(
            <div>
                <Nav />

                {/* Ternary operator only posts the movie info to the page
                after the data has been brought in from axios */}
                {this.state.genreMoviesPlaying.length !== 0 ?

                    this.state.genreMoviesPlaying.map((movie, i) => {
                        return (
                        <div key={this.state.genreMoviesPlaying[i].id}>
                            <img src={`https://image.tmdb.org/t/p/w500/${this.state.genreMoviesPlaying[i].poster_path}`}
                                    alt={`Poster for ${this.state.genreMoviesPlaying[i].title}`} />
                            <h1>{this.state.genreMoviesPlaying[i].title}</h1>
                        </div>
                        )
                    })

                    : null}

            </div>
        )
    }
}

export default SearchResults;