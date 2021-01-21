import React from 'react';
import PropTypes from 'prop-types';
import StatsTable from './StatsTable.jsx';

import RatingsBar from './RatingsBar.jsx';
import {aggregate, fmtStar, mean} from '../renderHelpers.js';

const placeHolders =
  [ ['difficulty', 'Ease of assembly/installation']
  , ['value'     , 'Value for money'              ]
  , ['quality'   , 'Product quality'              ]
  , ['appearance', 'Appearance'                   ]
  , ['works'     , 'Works as expected'            ]
  ] ;

const ReviewHeader = (props) => {
  let {reviews} = props;
  let stats = aggregate(reviews);
  let overall = mean(reviews.map(k => k.stars));
  return (
    <div className='review-aggregator'>
      <h2 className='review-agg-header'>Reviews</h2>
      <h2 className='overall-score'>{overall.toFixed(1)}</h2>
      <span>{fmtStar(~~overall)} {`(${reviews.length})`}</span>
    
      <h4>Average customer ratings</h4>
      <StatsTable placeHolders={placeHolders} reviews={reviews} />
    
    </div>
  );
};

ReviewHeader.propTypes = {
  reviews: PropTypes.array.isRequired,
};
export default ReviewHeader;
export {placeHolders};