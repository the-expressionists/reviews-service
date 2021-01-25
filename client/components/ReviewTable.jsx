import React, { useState } from 'react';
import PropTypes from 'prop-types';

import RatingsBar from './RatingsBar.jsx';
import StatsTable, { StatsRow } from './StatsTable.jsx';
import ReviewHeader, { placeHolders } from './ReviewHeader.jsx';
import * as rh from '../renderHelpers.js';
import { getImg } from '../network.js';

const TableView = ({ review }) => {
  let { user, thumbnail, date, body } = review;
  let [getHide, setHide] = useState(true);
  let toggle = () => setHide(getHide ^ 1);

  return (
    <div className="table-view" >
      <div className="table-view-head-container">
        <img className="thumbnail" src={review.thumbnail} />
        <div className="table-view-header">
          <b>{user}</b>
          <div className="table-view-header-date">{rh.monthYear(date)}</div>
        </div>
      </div>
      <div className={"table-view-body " + "clamped".repeat(getHide)}>
        {body};
      </div>
      <span className={"toggle-hide"} onClick={toggle}>
        {getHide ? "read more" : "hide"}
      </span>
    </div>
  );
  // getImg()
};

const ReviewTableStats = ({ reviews, mean }) => {
  // little hack to avoid refactoring
  // treat Overall as a key, since we want to show a bar here
  // as opposed to inside the modal.
  let plH = [['overall', 'Overall']].concat(placeHolders);
  let stats = rh.aggregate(reviews);
  stats.overall = mean;
  // create an array of divs so that we can style these inline, then put them in a flexbox
  return (
    <div className="review-table-stats" >
      {plH.map(([key, pl], i) => (
        <div key={'stsRow-' + i} className='review-table-row'>
          <StatsRow val={stats[key]} placeHolder={pl} places={1} />
        </div>
      ))}
    </div>
  );
};

class ReviewTable extends React.Component {
  constructor(props) {
    super(props);
    let { reviews } = props;
    this.reviews = reviews;
    // calculate it here as opposed to in the stats
    this.mean = rh.mean(reviews.map(r => r.stars));
    this.state = {
      highlights: props.reviews.slice(0, 6),
    };
  }

  render() {
    let { highlights } = this.state;
    return (
      <div className="review-table-container">
        <ReviewTableStats reviews={highlights} mean={this.mean} />
        <div className="review-table-box">
          {highlights.map((review, i) => (
            <TableView key={i} review={review} />
          ))}

        </div>
      </div>
    );
  }
}

ReviewTable.propTypes = {
  reviews: PropTypes.array.isRequired,
};

export default ReviewTable;