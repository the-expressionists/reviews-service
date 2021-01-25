import React from 'react';
import PropTypes from 'prop-types';
import RatingsBar from './RatingsBar.jsx';
import {aggregate} from '../renderHelpers.js';

// exported in case we need more flexibility
const StatsRow = (props) => {        // <div key={key + i} className='stats-table-row'>
  let { val, placeHolder, places } = props;
  // wrap in react fragments since the grid will take care of formatting
  return (
    <>
      <div className='metrics-placeholder'>{placeHolder}</div>
      <RatingsBar value={val} />
      <div className='metrics-value'>{val.toFixed(places)}</div>
    </>
  );
};

const StatsTable = (props) => {
  // take the arithmetic mean of the metrics if we're passed multiple
  let { placeHolders, reviews, places } = props;
  let plural = Array.isArray(reviews);
  let metrics = plural ? aggregate(reviews) : reviews.metrics;


  return (
    <div className='stats-table'>
      {do {
              // render an Overall header if we're given a bunch of reviews
              if (plural) {
        (<div className='metrics-placeholder'>Overall</div>);
              } else {
        null;
              }
            }}
      {placeHolders.map(([key, placeHolder], i) => (
        <StatsRow places={places} val={metrics[key]} placeHolder={placeHolder} key={i}/>
      ))}
    </div>
  );
  return res;
};

StatsRow.propTypes = {
  val: PropTypes.number.isRequired,
  placeHolder: PropTypes.string.isRequired,
  places: PropTypes.number
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

StatsTable.defaultProps = {
  places: 0
};

StatsRow.defaultProps = {
  places: 0
};

export default StatsTable;

export { StatsRow };