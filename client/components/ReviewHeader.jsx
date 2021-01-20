import React from 'react';
import PropTypes from 'prop-types';

import RatingsBar from './RatingsBar.jsx';
import {aggregate, fmtStar, mean} from '../renderHelpers.js';


const ReviewHeader = (props) => {
  let {reviews} = props;
  let stats = aggregate(reviews);
  let overall = mean(reviews.map(k => k.stars));
  return (
    <div className='review-aggregator'>
      <h1>Reviews</h1>
      <h2 style={{margin: '0 auto'}}>{overall.toFixed(1)}</h2>
      <span>{fmtStar(~~overall)} {`(${reviews.length})`}</span>
    
      <h3>Average customer ratings</h3>
    </div>
  );
};

ReviewHeader.propTypes = {
  reviews: PropTypes.array.isRequired,
};
export default ReviewHeader;
export {RatingsBar};