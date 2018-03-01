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
      movies: []
    };
  }

  componentDidMount() {
    axios.get(`${config.apiURL}`,{
      params: {
        api_key: config.api_key
      }
    })
      .then(({ data }) => {
      console.log(data);
      this.setState({
        movies: data.results
      })
    });
  }

  render() {
    return (
     <Router>
        <div>
          <Route path ="/" exact component={Splash} />
          {/* Search Results gets imported into the app */}
          <Route path="/searchResults" exact component={SearchResults}/>
          <Route path="/movie" exact component={SingleMovie}/>
        </div>
     </Router>
    )
  }

}

ReactDOM.render(<App />, document.getElementById('app'));
