import React from 'react';
import PropTypes from 'prop-types';
import RatingsBar from './RatingsBar.jsx';
import {aggregate} from '../renderHelpers.js';

// this definitely isn't correct
/**
 * @component
 * @param {Array<object>| object} reviews 
 * @extends {Component<Props>}
 */
const StatsTable = (props) => {
    // take the arithmetic mean of the metrics if we're passed multiple
    let {placeHolders, reviews} = props;
    let plural = Array.isArray(reviews);
    let metrics = plural ? aggregate(reviews) : reviews.metrics;

  let mkRow = ([key, plsHldr], i) => {        // <div key={key + i} className='stats-table-row'>
      let val = metrics[key];
      let fmtted = plural ? val.toFixed(1) : val; // show integer if it's not an avg
    // wrap in react fragments since the grid will take care of formatting
      return (
        <> 
          <div className='metrics-placeholder'>{plsHldr}</div>
          <RatingsBar value={val} />
          <div className='metrics-value'>{fmtted}</div>
        </>
      );
  };

    return (
        <div className='stats-table'>
            {do {
              // render an Overall rating bar if we're given a bunch of reviews
              if (plural) {
                (<div className='metrics-placeholder'>Overall</div>);
              } else {
                null;
              }
            }}
            {placeHolders.map(mkRow)}
        </div>
    );
  return res;
};

StatsTable.propTypes = {
    /**
     * Array of reviews or a single one.
     */
    reviews: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]).isRequired,
    /**
     * An array [[key, val]...] mapping review.metrics' keys to strings of text
     * to be displayed alongside the data.
    * The array is necessary to maintain a specific order 
     */
    placeHolders: PropTypes.array.isRequired,
};

export default StatsTable;