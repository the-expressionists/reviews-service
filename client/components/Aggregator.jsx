import React from 'react';
import {aggregate, fmtStar, mean} from '../renderHelpers.js';

const RatingsBar = ({n}) => {
  let containerStyle= {
    // display: 'inline-block', // <-- use flexbox for this
    boxSizing: 'border-box',
    position: 'relative',
    // height: '1rem',
    border: 'solid',
    borderWidth: '0.7rem',
    borderColor: 'white',
    // height: '0.5em',
    maxWidth: '30%',

  };
  let flexStyle = {
    display: 'inline-flex',
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  };
  let dotStyle = {
      color: 'white',
      zIndex: 2,
  };
  
  console.log(n);
  console.log(`${n / 5 * 100}%`);
  let barStyle = {
    backgroundColor: 'black',
    // maxHeight: '100%',
    width: `${n / 5 * 100}%`,
    position: 'absolute',
    left: 0,
    zIndex: 1,
    display: 'inline',
    // paddingBotton: '0.5rem',
  };

  let dots = (
    <div style={flexStyle} className='dots-container'>
      {[0,1,2,3]
      .map(i =>
        (<div style={dotStyle} key={i} className='ratingsBarDot'>•</div>)
      )}
    </div>
    );

  return (
    <div style={containerStyle}>
      {dots}
      <div style={barStyle} className='ratingsBarBar'>.</div>
    </div>
  );
};
const Aggregator = (props) => {
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
export default Aggregator;