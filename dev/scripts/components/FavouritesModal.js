// Called from anywhere user is logged in 

import React from 'react';
import { Link } from 'react-router-dom';

// Initialize Firebase
const fbconfig = {
    apiKey: "AIzaSyA6WGA6Y1VlX557CyvHXY9TM2zExStdxL8",
    authDomain: "justtheticket-dba5e.firebaseapp.com",
    databaseURL: "https://justtheticket-dba5e.firebaseio.com",
    projectId: "justtheticket-dba5e",
    storageBucket: "",
    messagingSenderId: "1013885392178"
};
firebase.initializeApp(fbconfig);

class FavouritesModal extends React.Component {
    constructor(){
        super();
        this.state = {
            favourites: [],
        }
    }
    componentDidMount() {
        const movieDB = firebase.database().ref();
        // console.log(this.state);
        // console.log(movieDB);
        movieDB.on('value', (snapshot) => {
            const movieArray = [];
            const selectedMovie = snapshot.val();
            
            for (let itemKey in selectedMovie) {
                selectedMovie[itemKey].key = itemKey;
                movieArray.push(selectedMovie[itemKey]);
            }
            
            this.setState({
                favourites: movieArray,
            })
            // console.log(this.state.favourites);
        });
    }
    render(){
        return(
            <div className="overlay"> 
                <div className ="modal">
                    <ul>
                        {
                            this.state.favourites.map((item) => {
                                console.log(item);
                                return (
                                    <li><Link to={`/movie/${item.movieID}`}>{item.movieName}</Link></li>
                                )
                            }) 
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

export default FavouritesModal;