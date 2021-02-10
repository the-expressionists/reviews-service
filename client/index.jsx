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
    this.getReviews(1337)
      .then(response => {
        let reviews = response.map(review => (
        {
          title: review.title,
          user: review.user,
          date: review.date,
          likes: review.likes,
          body: review.body,
          stars: review.stars,
          thumbnail: review.thumbnail,
          recommend: review.recommend,
          product: review.productid,
          metrics: {
              difficulty: review.difficulty,
              value: review.value,
              quality: review.quality,
              appearance: review.appearance,
              works: review.works
          }
        }));
        //console.log(reviews[~~(Math.random() * reviews.length)]);
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
        <div className="reviews-title">
          <span className="reviews-title-header">Reviews</span>
          <span>{'  (' + this.state.reviews.length + ')'}</span>
        </div>
        <ReviewTable key={'rt-' + reviews.length} reviews={reviews} />
        {showModal
          ? (
        <Modal
          element=<ReviewList key={'rl-' + reviews.length} reviews={reviews} />
          closer={() => { }}
          opacity={0.8}
          />
        ) : null}
        {/* TODO add the modal back in*/}
        {/* <div onClick={toggle}>HHAAAUUUNNGHH???</div> */}

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

ReactDOM.render(<ReviewComponent getReviews={getReviews} />, document.getElementById('reviews'));