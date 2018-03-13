import React from 'react';
import HandleUser from './handleUser';
import GenreDropDown from './genreDropDown';
import SearchResults from './SearchResults';
import axios from 'axios';
import config from './config.js';
import Footer from './footer';
import { Link } from 'react-router-dom';

class Splash extends React.Component {
    constructor() {
        super();
        this.state = {
            randoPosterURL: '',
            randoDetailsLink: '',
        }
    }

    componentDidMount() {

        axios.get(`${config.movieDBApiURL}/movie/now_playing`, {
            params: {
                api_key: config.movieDBApiKey,
            }
        }).then(({ data }) => {
            const moviesPlaying = data.results;
            const randomInt = (Math.floor(Math.random() * Math.floor(20))) - 1;
            const randoPosterURL = `http://image.tmdb.org/t/p/w780/${moviesPlaying[randomInt].poster_path}`
            const randoDetailsLink = `/movie/${moviesPlaying[randomInt].id}`

            this.setState({
                randoPosterURL: randoPosterURL ,
                randoDetailsLink: randoDetailsLink,
            })
    })
}

    render () {
        return(
            <div className="splash">
                <div className="halfPage">
                    <div>
                        <HandleUser />
                    </div>
                    <div className="splashWrapper">
                        <div className="brandName">
                            <img src="./images/yellowticket.svg" alt="logo" />
                            <h1>Just<br/>the<br/>Ticket</h1>
                        </div>
                        <h4>What do you want to see?</h4>
                        <GenreDropDown dropdownChange={this.props.dropdownChange} history={this.props.history} />
                        <Footer />
                    </div>
                </div>

                <div className="posterWrapper">
                    <Link to={this.state.randoDetailsLink}>
                        <img src={this.state.randoPosterURL} alt="Check this one out"/>
                    </Link>
                </div>
            </div>
        )
    }
}

export default Splash;