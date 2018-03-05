import React from 'react';
import HandleUser from './handleUser';

class Nav extends React.Component {
    render(){
        return(
            <div className="nav">
                <h1>In Theatres Now</h1>
                <HandleUser />
            </div>
        )
    }
}

export default Nav;