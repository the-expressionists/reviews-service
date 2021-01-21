import React from 'react';
import PropTypes from 'prop-types';

import {aggregate, fmtStar, mean} from '../renderHelpers.js';

const RatingsBar = ({value}) => {
  let barStyle = {
    // need to specify this in the component
    width: `${value / 5 * 100}%`,
  };

  let dots = (
    <div className='dots-container'>
      {[0,1,2,3]
      .map(i =>
        (<div key={i} className='ratings-bar-dot'>•</div>)
      )}
    </div>
    );

  return (
    <div className='ratings-bar'>
      {dots}
      <div className='ratings-bar-inner-bar bg'></div>
      <div style={barStyle} className='ratings-bar-inner-bar fg'></div>
    </div>
  );
};

RatingsBar.propTypes = {
    value: PropTypes.number.isRequired,
};

export default RatingsBar;
