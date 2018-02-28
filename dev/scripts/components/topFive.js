import React from 'react';
import SingleMovie from './SingleMovie';

class TopFive extends React.Component{
    render(){
        return(
            <div>
                <h1>This is the TOP FIVE</h1>
                <SingleMovie />
            </div>
        )
    }
}

export default TopFive;