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
            movieGenres: [],
            youtubeKey: '',
            reviewObject: {},
            reviewLink: '',
        }
    }

    componentDidMount() {
        //Connect to MovieDB for videos
        axios.get(`${config.movieDBApiURL}/movie/${this.props.match.params.movie_id}/videos`, {
            params: {
                api_key: config.movieDBApiKey,
            }
        })
            .then(({ data }) => {
                const videos = data.results
                const trailers = videos.filter(video => video.type.includes('Trailer') && video.site.includes('YouTube'));
                this.setState({
                    youtubeKey: `https://www.youtube.com/embed/${trailers[0].key}?rel=0&amp;showinfo=0`,
                })
                })

        //Connect to MovieDB
        axios.get(`${config.movieDBApiURL}/movie/${this.props.match.params.movie_id}`, {
            params: {
                api_key: config.movieDBApiKey,
            }
        })
            .then(({ data }) => {
                // console.log(data)
                this.setState({
                    movieObject: data,
                    movieTitle: data.title,
                    movieID: data.id,
                    movieGenres: data.genres
                })
                
                //Connect to New York Times
                axios.get(`${config.nytApiURL}`, {
                    params: {
                        api_key: config.nytApiKey,
                        query: this.state.movieTitle
                    }
                })
                    .then(({ data }) => {
                        this.setState({
                            reviewObject: data.results[0],
                            reviewLink: data.results[0].link.url
                        })

                    });
            });


    }
    

    render(){
        return(
            <div>
                <Nav />
                
                <div className="movieDetails">
                <img src={`https://image.tmdb.org/t/p/w200/${this.state.movieObject.poster_path}`}
                    alt={`Poster`} />
                
                    <h2>{this.state.movieObject.title}</h2>


                <p>
                {this.state.reviewObject.mpaa_rating} | 
                {this.state.movieObject.runtime} minutes
                </p>

                <h3>{this.state.movieObject.tagline}</h3>
                <p>{this.state.movieObject.overview}</p>
                <p><a href={this.state.movieObject.homepage} target="_blank">Visit the official website</a></p>
                </div>


                <div className="review">
                
                {this.state.reviewObject.critics_pick === 0 ?
                null
                : <span>Critic's Pick</span>}

                    <h2>{this.state.reviewObject.headline}</h2>
                <p>
                        {this.state.reviewObject.byline}, <em>New York Times</em>
                </p>
                    <p>{this.state.reviewObject.summary_short}
                </p>
                    <a href={this.state.reviewLink} target="_blank">Read Review</a>
                </div>

                <div className="Trailer">
                    <iframe width="560" height="315" src={this.state.youtubeKey} frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                </div>
            
                {
                    // Making sure the TheaterLocations component has the movie information before calling a function on componentDidMount in that component. Once we update this state with a movie title (waiting for the api data to cpme back), React will check the render method again
                    this.state.movieTitle
                        ? <TheatreLocations movieTitle={this.state.movieTitle} />
                        : null
                }
            </div>
        )
    }
}

export default SingleMovie;