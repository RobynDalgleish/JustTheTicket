import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import config from './components/config.js';
import Splash from './components/splash';
import Nav from './components/nav';
import SearchResults from './components/SearchResults';
import SingleMovie from './components/SingleMovie';
import {
  BrowserRouter as Router,
  Route,
  Link

} from 'react-router-dom';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      userSelectedGenre: '',
    };
  }

  componentDidMount() {
    axios.get(`${config.nytApiURL}`,{
      params: {
        api_key: config.nytApiKey
      }
    })
      .then(({ data }) => {
      this.setState({
        movies: data.results
      })
    });

  }


  render() {
    return (
      <Router onUpdate={() => window.scrollTo(0, 0)} >
        <div>
          <Route path="/" exact component={Splash} />
          {/* :genre_id creates a variable. Now from the componant "SearchResults" you can access a piece of data passed through the URL. (So /searchResults/:apple would make {this.props.params.genre_id} === 'apple'*/}
          <Route path="/searchResults/:genre_id" exact component={SearchResults}/>
          <Route path="/movie/:movie_id" exact component={SingleMovie}/>
        </div>
     </Router>
    )
  }

}

ReactDOM.render(<App />, document.getElementById('app'));
