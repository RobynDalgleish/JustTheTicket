import React from 'react';
import Nav from './nav';
import axios from 'axios';
import config from './config.js';

class SearchResults extends React.Component{
    componentDidMount() {

        // console.log(this.props.match.params.genre_id)

        //MovieDB Call
        axios.get(`${config.movieApiURL}/discover/movie`, {
            params: {
                api_key: config.movieApiKey,
                with_genres: '10751'
            }
        })
            .then(({ data }) => {
                console.log(data);
                this.setState({
                    movies: data.results
                })
            });

    }
    render(){
        return(
            <div>
                <Nav />
                <h1>This is the TOP FIVE</h1>
            </div>
        )
    }
}

export default SearchResults;