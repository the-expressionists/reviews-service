import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost:27017/jtwenl', {useNewUrlParser: true, useUnifiedTopology: true});

/**@module Review */

const { Schema } = mongoose;

const ReviewSchema = {
    title: { type: String, required: true, },
    user: { type: String, required: true, },
    date: { type: Date, required: true, },
    likes: { type: Number, required: true, },
    body: { type: String, required: true, },
    stars: { type: Number, required: true, },
    thumbnail: { type: String },
    recommend: { type: Boolean, required: true, },
    product: { type: Schema.Types.ObjectId, ref: 'Product'},
    metrics: {
        difficulty: Number,
        value: Number,
        quality: Number,
        appearance: Number,
        works: Number,
    }
};

/** Review document for our db
 * @class Review
 * @prop {string} title - review title
 * @prop {string} user - username
 * @prop {date} date - review date
 * @prop {number} likes - how many updoots it got
 * @prop {string} body - review text
 * @prop {number} stars - 1-5
 * @prop {boolean} recommend - whether a user would recommend this product
 * @prop {{difficulty: number, value: number, quality: number, appearance: number, works: number}} metrics - these range from 1-5 in each category
 *
 */
const Review = mongoose.model('Review', ReviewSchema);

export default Review;