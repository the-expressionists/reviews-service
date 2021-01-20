import React from 'react';
import PropTypes from 'prop-types';
import Aggregator from './Aggregator.jsx';
import {fmtStar} from '../renderHelpers.js';

const fmtRecommend = (b) => b ? (<p>✅ Yes, I recommend this product</p>) : null;

const ReviewListItem = (props) => {
    let {review} = props;
    let {title, user, date, likes, body, stars, recommend, metrics} = review;
    return (
        <div>
           <h5>
               {fmtStar(stars)} {`${user} - ${date}`}
           </h5> 
           <h4>{title}</h4>
           <p>{body}</p>
           {fmtRecommend(recommend)} 
        </div>
    );
};
class ReviewList extends React.Component {
    constructor(props) {
        super(props);
        let {reviews} = props;
        console.log(reviews);
        this.state = {
            reviews,
        };
    }
    
    render() {
        let {reviews} = this.state;
        return (
            <div className='review-list'>
            <Aggregator reviews={reviews} />
            {reviews.map((r, i) => (
                <ReviewListItem key={i} review={r}/>
            ))}       
            </div>
        );
    }
}

ReviewList.propTypes = {
    reviews: PropTypes.array.isRequired,
};

export default ReviewList;