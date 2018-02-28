import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    render() {
      return (
        <div>
          Go team!!!
          I am now making a change I would like you a to pull into the master :) .
        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
