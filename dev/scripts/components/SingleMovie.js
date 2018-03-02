import React from 'react';
import Nav from './nav';

class SingleMovie extends React.Component{
    render(){
        return(
            <div>
                <Nav />
                <p>{`config.movieApiURL`}</p>
                <button><i class="far fa-heart"></i></button>
            </div>
        )
    }
}

export default SingleMovie;