import React from 'react';
import HandleUser from './handleUser';

class Nav extends React.Component {
    render(){
        return(
            <div>
                <h1>THE NAV</h1>
                <HandleUser />
            </div>
        )
    }
}

export default Nav;