import React from 'react';
import PropTypes from 'prop-types';
import Nav from './Nav.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: [],
    };
  }
  
  render() {
    return (
      <div>
        Hello, world!
      </div>
    )
  }
}

App.propTypes = {
  db: PropTypes.shape({
    connection: PropTypes.func.isRequired,
  }).isRequired,
};
