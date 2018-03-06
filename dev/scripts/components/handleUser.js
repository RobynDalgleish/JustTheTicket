import React from 'react';
import { Link } from 'react-router-dom';

const fbconfig = {
    apiKey: "AIzaSyA6WGA6Y1VlX557CyvHXY9TM2zExStdxL8",
    authDomain: "justtheticket-dba5e.firebaseapp.com",
    databaseURL: "https://justtheticket-dba5e.firebaseio.com",
    projectId: "justtheticket-dba5e",
    storageBucket: "",
    messagingSenderId: "1013885392178"
};
firebase.initializeApp(fbconfig);

class HandleUser extends React.Component {
    constructor() {
        super();
        this.state = {
            favourites: [],
            loggedIn: false,
            user: {}
        }
        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
        this.toggleFavourites = this.toggleFavourites.bind(this);
        this.removeFav = this.removeFav.bind(this);
    }
    componentDidMount() {
        
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const movieDB = firebase.database().ref(`users/${user.uid}`);
                console.log(movieDB);
                movieDB.on('value', (snapshot) => {
                    const movieArray = [];
                    const selectedMovie = snapshot.val();
                    for (let itemKey in selectedMovie) {
                        selectedMovie[itemKey].key = itemKey;
                        movieArray.push(selectedMovie[itemKey]);
                    }
                    // console.log(itemKey);

                    this.setState({
                        favourites: movieArray,
                    })
                    // console.log(this.state.favourites);
                });
                this.setState({
                    loggedIn: true,
                    user: user
                });
            }
            else {
                this.setState({
                    loggedIn: false,
                    user: {}
                })
            }
        })
    }
    signIn(){
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({
            prompt:'select_account'
        });
        firebase.auth().signInWithPopup(provider)
            .then((user) => {
                // console.log(`Should we be capturing`, user);
            })
    }
    signOut(){
        firebase.auth().signOut();
        this.setState({
            loggedIn: false,
        })
    }
    toggleFavourites(){
        this.overlay.classList.toggle('show');
        this.modal.classList.toggle('show');
    }
    removeFav(favID){
        console.log(favID);
        const dbRef = firebase.database().ref(`users/${this.state.user.uid}/${favID}`);
        dbRef.remove();
    }
    render() {
        return(
            <div className="handleUser">
                {
                    this.state.loggedIn ?
                    <div className="loggedIn">
                        <button className="signout" onClick={this.signOut}>Sign Out</button>
                        <button className="favourites" onClick={this.toggleFavourites}>Favourites</button>
                    </div>
                    :
                    <button className="create Account" onClick={this.signIn}>Login/Create Account</button>
                }
                    <div className="overlay" ref={ref => this.overlay = ref}>
                        <div className="modal" ref={ref => this.modal = ref}>
                            <div className="closeButton" onClick={this.toggleFavourites}>
                                <i className="fa fa-times"></i>
                            </div>

                            <ul>
                                
                                {
                                    this.state.favourites.map((item) => {
                                        return (
                                            <li key={item.key}><button className="remove" onClick={() => this.removeFav(item.key)}>x</button><Link to={`/movie/${item.movieID}`}>{item.movieName}</Link></li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                {/* <FavouritesModal toggleFavourites={this.toggleFavourites}/> */}
            </div>
        ) 
    }
}

export default HandleUser;