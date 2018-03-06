import React from 'react';
import HandleUser from './handleUser';
import { Link } from 'react-router-dom';

class Nav extends React.Component {
    render(){
        return(
            <div className="nav">
                <Link to="/">
                <h1>In Theatres Now</h1>
                </Link>
                <HandleUser />
            </div>
        )
    }
}

export default Nav;