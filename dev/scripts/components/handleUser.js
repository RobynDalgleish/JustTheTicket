import React from 'react';
import FavouritesModal from './FavouritesModal.js';

class HandleUser extends React.Component {
    render() {
        return(
            <div>
                <p>HandleUser thingyyyyy</p>
                <FavouritesModal />
                {/* Or we have Favourite Modal living inside Handle User */}
            </div>
        ) 
    }
}

export default HandleUser;