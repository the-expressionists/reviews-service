import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import getReviews from './network.js';
import ReviewList from './components/ReviewList.jsx';
import ReviewTable from './components/ReviewTable.jsx';
import Modal from './components/Modal.jsx';
import './style/reviewBar.scss';

class ReviewComponent extends React.Component {
  constructor(props) {
    super(props);
    let { getReviews } = props;
    this.getReviews = getReviews;
    this.state = { showModal: false };
  }

  componentDidMount() {
    this.getReviews()
      .then(reviews => {
        console.log(reviews[~~(Math.random() * reviews.length)]);
        this.setState({ reviews });
        console.log(this.state);
      });
  }

  render() {
    let { reviews, showModal } = this.state;
    let toggle = (ev) => {
      ev.preventDefault();
      this.setState({showModal: true});
    };
    let content = () => (
      <>
        <ReviewTable key={'rt-' + reviews.length} reviews={reviews} />
        {showModal
          ? (
        <Modal
          element=<ReviewList key={'rl-' + reviews.length} reviews={reviews} />
          closer={() => { }}
          opacity={0.8}
          />
        ) : null}
        <div onClick={toggle}>HHAAAUUUNNGHH???</div>
        
      </>
    );
    return (
      <div>
        {reviews
          ? content()
          : null}
      </div>
    );
  }
}

ReactDOM.render(<ReviewComponent getReviews={getReviews} />, document.getElementById('app'));