import React from 'react';
import config from './config'
import axios from 'axios';
class GenreDropDown extends React.Component {
    constructor() {
        super();
        this.state = {
            genres: [],
            // userSelectedGenre: '',
        };
        this.dropdownChange = this.dropdownChange.bind(this);
        this.getMoviesByGenre = this.getMoviesByGenre.bind(this);
    }
    componentDidMount() {
        axios.get(`${config.movieDBApiURL}/genre/movie/list`, {
            params: {
                api_key: config.movieDBApiKey
            }
        })
            .then(({ data }) => {

                let genreList = data.genres;
                genreList.unshift({
                    id: 'i',
                    name: 'Choose a Genre'
                });
                this.setState({
                    genres: genreList,
                })
            });
    }
    getMoviesByGenre() {
    }
    //This captures the genre id from the genre dropdown
    //and sets it on the App state so we can pass it to a sibling component
    dropdownChange(e) {
        // this.setState({
        //     userSelectedGenre: 
        // })
        //Figure out how to redirect to a new url with react router
        ///searchResults/{}}
        //this.props.history.push -- history,push is a function in the dataset of router
        //the function pushes to the end of the array, which is the URL 
        this.props.history.push(`/searchResults/${e.target.value}`)
    }
    render() {
        return (
            <div className="genreWrapper">
                <select onChange={this.dropdownChange}>
                    {
                        this.state.genres.map((gnr, i) => {

                            return (
                                <option key={i} value={this.state.genres[i].id}>{this.state.genres[i].name}</option>
                            )
                        })

                    }
                </select>
                {/* <button onClick={this.getMoviesByGenre}>🔎</button> */}
            </div>
        )
    }
}
export default GenreDropDown;