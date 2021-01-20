import React from 'react';
import PropTypes from 'prop-types';
import RatingsBar from './RatingsBar.jsx';

// this definitely isn't correct
/**
 * @component
 * @param {Array<object>| object} reviews 
 * @extends {Component<Props>}
 */
const StatsTable = (props) => {
    // take the arithmetic mean of the metrics if we're passed multiple
    let {placeHolders, reviews} = props;
    let metrics = Array.isArray(reviews) ? aggregate(reviews) : reviews.metrics;

    let mkRow = ([key, plsHldr], i) => (
        // <div key={key + i} className='stats-table-row'>
      <>
            <div className='metrics-placeholder'>{plsHldr}</div>
            <RatingsBar n={metrics[key]}/>
            <div className='metrics-value'>{metrics[key]}</div>
      </>
    );

    return (
        <div className='stats-table'>
            {placeHolders.map(mkRow)}
        </div>
    );
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