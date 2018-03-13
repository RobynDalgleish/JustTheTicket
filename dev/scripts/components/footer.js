import React from 'react';

const Footer = () => {
    return(
        <footer className="footer">
            <p>Created by
                : <a href="http://natashateng.ca/">Natasha Teng</a>
                , <a href="http://robyndalgleish.com/">Robyn Dalgleish</a>, 
                & <a href="http://www.carolynmcneillie.com/">Carolyn McNeillie</a>. </p>
            <p>Ticket icon by <a href="https://thenounproject.com/365/" target="_blank">Three Six Five</a> from the Noun Project</p>
            
            <p>
                Powered by 
                the <a href="https://www.themoviedb.org/documentation/api" target="_blank">Movie DB API</a> 
                , <a href="http://developer.nytimes.com/" target="_blank">The New York Times API</a>, 
                and the <a href="https://api.internationalshowtimes.com/documentation/v4/" target="_blank">International Showtimes API</a>.
            </p>
    
        </footer>
    )
}

export default Footer;
