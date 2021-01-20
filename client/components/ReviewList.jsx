import React from 'react';
import PropTypes from 'prop-types';
import ReviewHeader from './ReviewHeader.jsx';
import StatsTable from './StatsTable.jsx';
import { fmtStar, prettyDate } from '../renderHelpers.js';

const fmtRecommend = (b) => b ? (<p>✅ Yes, I recommend this product</p>) : null;

const placeHolders =
  [ ['difficulty', 'Ease of assembly/installation']
  , ['value'     , 'Value for money'              ]
  , ['quality'   , 'Product quality'              ]
  , ['appearance', 'Appearance'                   ]
  , ['works'     , 'Works as expected'            ]
  ] ;

const ReviewListItem = (props) => {
  let { review } = props;
  let { title, user, date, likes, body, stars, recommend, metrics } = review;
  let style = {
    borderBottom: '1px solid grey'
  };
  return (
    <div className='review-list-item' >
      <h5>
        {fmtStar(stars)} {`${user} - ${prettyDate(date)}`}
      </h5>
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

    let style = {
      padding: '0 5%'
    };
    return (
      <div style={style} className='review-list'>
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