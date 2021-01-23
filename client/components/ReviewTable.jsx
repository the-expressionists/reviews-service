import React, { useState } from 'react';
import PropTypes from 'prop-types';

import RatingsBar from './RatingsBar.jsx';
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
          <div>{user}</div>
          <div>{rh.monthYear(date)}</div>
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

class ReviewTable extends React.Component {
  constructor(props) {
    super(props);
    this.stats = rh.aggregate(props.reviews);
    this.state = {
      highlights: props.reviews.slice(0, 6),
    };
  }

  render() {
    let { highlights } = this.state;
    console.log(highlights);
    return (
      <div className="review-table-box">
        {highlights.map((review, i) => (
          <TableView key={i} review={review} />
        ))}

      </div>
    );
  }
}

ReviewTable.propTypes = {
  reviews: PropTypes.array.isRequired,
};

export default ReviewTable;