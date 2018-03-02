import React from 'react';
import Nav from './nav';

// Initialize Firebase
const config = {
apiKey: "AIzaSyAy4PXK2rmuB3mf9nW-OH2j5zIun36oxkQ",
authDomain: "justtheticket-3b06f.firebaseapp.com",
databaseURL: "https://justtheticket-3b06f.firebaseio.com",
projectId: "justtheticket-3b06f",
storageBucket: "",
messagingSenderId: "690914500190"
};
firebase.initializeApp(config);

class SingleMovie extends React.Component{

pushToFirebase() {
    const chosenSingleMovie = 284054;
    const dbRef = firebase.database().ref();
    dbRef.push(chosenSingleMovie);
}

    render(){
        return(
            <div>
                <Nav />
                <h1>Single Movie Page</h1>
            </div>
        )
    }
}

export default SingleMovie;