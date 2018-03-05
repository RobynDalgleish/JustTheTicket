import React from 'react';
import Nav from './nav';
import axios from 'axios';
import config from './config.js';
import { Link } from 'react-router-dom';

class SearchResults extends React.Component {
    constructor() {
        super();
        this.state = {
            genreMoviesPlaying: [],
            fiveGenreMoviesPlaying: [],
        }
        // this.getOnePage = this.getOnePage.bind(this);
    }

    //This makes an axios call to get one page of data from the now playing section of MovieDB API
    //It takes on argument which is the page of results it should pull
    getOnePage(i) {
        axios.get(`${config.movieDBApiURL}/movie/now_playing`, {
            params: {
                api_key: config.movieDBApiKey,
                page: i
            }
        })
            //Next, the function filters the results to create an array that only contains objects from the
            //API where the genre matches the genre selected by the user
            .then(({ data }) => {
                const moviesPlaying = data.results;
                const genreCodeNum = parseInt(this.props.match.params.genre_id);
                const newNewArray = moviesPlaying.filter(movie => movie.genre_ids.includes(genreCodeNum));
                //These filtered results are added to the array in the state and saved on the variable newGenreMoviesPlaying
                let newGenreMoviesPlaying = this.state.genreMoviesPlaying.concat(newNewArray);
                //This new array is added to the state
                this.setState ({
                    genreMoviesPlaying: newGenreMoviesPlaying,
                },() =>{
                    //Next, in a callback function, we test to see if the length of the genreMoviesPlaying in the state is less than 5. If it is, we iterate i and pass it up to call the next page.
                    if(this.state.genreMoviesPlaying.length < 5){
                        this.getOnePage(i+1);
                    //This is reccursion, Jonathan taught me about it, and it's BEAUTIFUL
                    }

                })
                //Finally we take the resulting array and create a new one that takes only the first five. This is what we display to the page!
                const fiveGenreMoviesPlaying = this.state.genreMoviesPlaying.slice(0,5);
                this.setState({
                    fiveGenreMoviesPlaying: fiveGenreMoviesPlaying
                })
            })
    }

    //It's so lovely. All we have to do is call this function here and it will fun itself until the basis is met.
    componentDidMount() {
        this.getOnePage(1);
    }

    render() {
        return (
            <div>
                <Nav />
                <div className="searchWrapper">
                <div className="main-carousel" data-flickity='{ "cellAlign": "left", "contain": true }'>
                {/* Ternary operator only posts the movie info to the page
                after the data has been brought in from axios 
                We need to figure out how to link this to /movie/:movie_id*/}
                {this.state.fiveGenreMoviesPlaying.length !== 0 ?
                    this.state.fiveGenreMoviesPlaying.map((movie, i) => {
                        return (
                            
                                <div className="carousel-cell">
                            <Link to={`/movie/${this.state.fiveGenreMoviesPlaying[i].id}`}>
                            <div key={this.state.fiveGenreMoviesPlaying[i].id}>
                                
                                <img src={`https://image.tmdb.org/t/p/w500/${this.state.genreMoviesPlaying[i].poster_path}`}
                                    alt={`Poster for ${this.state.genreMoviesPlaying[i].title}`} />
                                <h1>{this.state.genreMoviesPlaying[i].title}</h1>
                            </div>
                            </Link>
                            </div>
                        )
                    })
                    : null}
                    </div>
                    </div>
            </div>
        )
    }
}
export default SearchResults;