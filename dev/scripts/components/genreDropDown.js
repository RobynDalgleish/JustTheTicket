import React from 'react';
import TopFive from './topFive';
import config from './config'
import axios from 'axios';

class GenreDropDown extends React.Component{

    constructor() {
        super();
        this.state = {
            overview: '',
            title: '',
            poster_path: '',
            tagline: ''
        };
    }

    componentDidMount() {
        axios.get(`${config.movieApiURL}/genre/movie/list`, {
            params: {
                api_key: config.movieApiKey
            }
        })
            .then(({ data }) => {
                console.log(data.genres[0]);
                this.setState({
                    genre: data.name,
                })
            });
    }

    render() {
        return(
            <div>
                <h1>GenreDropDown drpdownnnnn</h1>
                <TopFive />
            </div>
        )
    }
}

export default GenreDropDown;