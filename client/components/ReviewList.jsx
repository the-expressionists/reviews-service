import React from 'react';
import PropTypes from 'prop-types';
import ReviewHeader, {placeHolders} from './ReviewHeader.jsx';
import StatsTable from './StatsTable.jsx';
import { fmtStar, prettyDate } from '../renderHelpers.js';

const fmtRecommend = (b) => b ? (<p>✅ Yes, I recommend this product</p>) : null;


const ReviewListItem = (props) => {
  let { review } = props;
  let { title, user, date, likes, body, stars, recommend, metrics } = review;
  return (
    <div className='review-list-item' >
      <div className='review-list-item-header'>
        <div className='stars'>{fmtStar(stars)}</div>
         <div>{`${user} - ${prettyDate(date)}`}</div>
      </div>
      <h4>{title}</h4>
      <p>{body}</p>
      {fmtRecommend(recommend)}
      <StatsTable placeHolders={placeHolders} reviews={review} />
    </div>
  );
};
class ReviewList extends React.Component {
  constructor(props) {
    super(props);
    let { reviews } = props;
    this.state = {
      reviews,
    };
  }

  render() {
    let { reviews } = this.state;

    return (
      <div className='review-list'>
        <ReviewHeader reviews={reviews} />
        {reviews.map((r, i) => (
          <ReviewListItem key={i} review={r} />
        ))}
      </div>
    );
  }
}

ReviewList.propTypes = {
  reviews: PropTypes.array.isRequired,
};

export default ReviewList;