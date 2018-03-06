import React from 'react';
import Nav from './nav';
import axios from 'axios';
import config from './config.js';
import TheatreLocations from './theatreLocations.js';

class SingleMovie extends React.Component{

    constructor() {
        super();
        this.state = {
            loggedIn: false,
            user:{},
            movieObject: {},
            movieTitle: '',
            movieGenres: [],
            youtubeKey: '',
            reviewObject: {},
            reviewLink: '',
            movieID: '',
        }
        this.addMovie = this.addMovie.bind(this);
        window.scrollTo(0, 0);
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            // console.log(user);
            this.setState ({
                user: user
            })
        })
        // firebase.database().ref().on('value', (res) => {
        //     // console.log(res);
        // });

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
                        // console.log(data);
                        this.setState({
                            reviewObject: data.results[0],
                            reviewLink: data.results[0].link.url
                            // Error when results = 0
                        })

                    });
            });


    }

    // Create a function for onClick of the button it will add to firebase and to favourites
    addMovie() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                const movieInfo = {
                    movieID: this.state.movieObject.id,
                    movieName: this.state.movieObject.title
                }
        
                // console.log(movieInfo);
        
                const movieDB = firebase.database().ref(`users/${this.state.user.uid}`);
                
                movieDB.on('value', (snapshot) => {
                    const movieArray = [];
                    const selectedMovie = snapshot.val();
                    for (let itemKey in selectedMovie) {
                        selectedMovie[itemKey].key = itemKey;
                        movieArray.push(selectedMovie[itemKey]);
                    }

                    const testNewArray = movieArray.filter(movie => movie.movieName.includes(movieInfo.movieName));
                    
                    if (testNewArray.length <= 0 ) {
                        movieDB.push(movieInfo);
                        console.log(movieInfo);
                    } 


                });

            }
        })
    }

    render(){
        return(
            <div>
                <Nav />
                <div className="singleMovie" >
                
                    <div className="imgContainer">
                        <img src={`https://image.tmdb.org/t/p/w500/${this.state.movieObject.poster_path}`}
                        alt={`Poster`} />
                    </div>

                    <ul className="pageLinks">
                        <li><a href="#summary">Summary</a> | </li>
                        <li><a href="#review">Review</a> | </li>
                        <li><a href="#trailer">Trailer</a> | </li>
                        <li><a href="#showtimes">Showtimes</a> </li>
                    </ul>
                    
                <div className="description">
                    <div className="movieDetails" id="summary">
                        <h2>{this.state.movieObject.title}</h2>


                        <p>
                            {this.state.reviewObject.mpaa_rating} | 
                            {this.state.movieObject.runtime} minutes
                        </p>

                <button className="addMovie" onClick={this.addMovie} value={this.state.movieTitle}><i className="far fa-heart"></i></button>

                <h3>{this.state.movieObject.tagline}</h3>
                <p>{this.state.movieObject.overview}</p>
                <p><a href={this.state.movieObject.homepage} target="_blank">Visit the official website</a></p>
                </div>

                 {/* {this.state.reviewObject.length === undefined ? 
                    null 
                    :
                    
                 } */}
                    <div className="review" id="review">
                        {this.state.reviewObject.critics_pick === 0
                            ? null
                            : <span>Critic's Pick</span>}
                        <h2>{this.state.reviewObject.headline}</h2>
                        {/* The name of a publication is meant to be italicized - style guide, hence <em> */}
                        <p>{this.state.reviewObject.byline}, <em>New York Times</em></p>
                        <p>{this.state.reviewObject.summary_short}</p>
                        <a href={this.state.reviewLink} target="_blank">Read Review</a>
                    </div>

                    <div className="Trailer" id="trailer">
                        <iframe width="560" height="315" src={this.state.youtubeKey} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                    </div>

                    
                
                    {
                        // Making sure the TheaterLocations component has the movie information before calling a function on componentDidMount in that component. Once we update this state with a movie title (waiting for the api data to cpme back), React will check the render method again
                        this.state.movieTitle
                            ? <TheatreLocations movieTitle={this.state.movieTitle} />
                            : null
                    }
                </div>
                </div>
            </div>
        )
    }
}
export default SingleMovie;
