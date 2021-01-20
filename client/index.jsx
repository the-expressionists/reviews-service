import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import getReviews from './network.js';
import ReviewList from './components/ReviewList.jsx';
import './style/reviewBar.scss';

class App extends React.Component {
    constructor(props) {
        super(props);
        let {getReviews} = props;
        this.getReviews = getReviews;
        this.state = {};
    }
    
    componentDidMount() {
        this.getReviews()
          .then(reviews => {
              console.log(reviews[~~(Math.random() * reviews.length)]);
              this.setState({reviews});
              console.log(this.state);
          });
    }

    render() {
        let {reviews} = this.state;
        // the key thing is a hack to get it to rerender after load
        // necessary??
        return (
            <div>
                hello, world!
                {reviews  
                ? (<ReviewList key={'rl-' + reviews.length} reviews={reviews}/>)
                : null}
            </div>
        );
    }
}

ReactDOM.render(<App getReviews={getReviews}/>, document.getElementById('app'));