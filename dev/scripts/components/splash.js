import React from 'react';
import HandleUser from './handleUser';
import GenreDropDown from './genreDropDown';


class Splash extends React.Component {
    render () {
        return(
            <div>
                <HandleUser />
                <h1>Splassshhhhh</h1>
                <GenreDropDown />
            </div>
        )
    }
}

export default Splash;