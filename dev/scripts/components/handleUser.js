import React from 'react';
import FavouritesModal from './FavouritesModal.js';

class HandleUser extends React.Component {
    render() {
        return(
            <div>
                <h1>HandleUser thingyyyyy</h1>
                <FavouritesModal />
                {/* Or we have Favourite Modal living inside Handle User */}
            </div>
        ) 
    }
}

export default HandleUser;