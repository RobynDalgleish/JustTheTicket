import React from 'react';
import HandleUser from './handleUser';
import GenreDropDown from './genreDropDown';
import SearchResults from './SearchResults';

class Splash extends React.Component {

    componentDidMount() {
        
    }
    
    render () {
        // console.log('this props', this.props)
        return(
            <div className="splash">
                <HandleUser />
                <h1>Just<br/>the<br/>Ticket</h1>
                <h4>What do you want to see?</h4>
                <GenreDropDown dropdownChange={this.props.dropdownChange} history={this.props.history} />


            </div>
        )
    }
}

export default Splash;