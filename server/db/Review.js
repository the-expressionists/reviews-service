import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');

const { Schema } = mongoose;

/**
 * @constructor Review
 */
const ReviewSchema = {
    title: { type: String, required: true, },

    user: { type: String, required: true, },
    date: { type: Date, required: true, },
    likes: { type: Number, required: true, },
    body: { type: String, required: true, },
    stars: { type: Number, required: true, },
    recommend: { type: Boolean, required: true, },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    metrics: {
        difficulty: Number,
        value: Number,
        quality: Number,
        appearance: Number,
        works: Number,
    }
};

const Review = mongoose.model('Review', ReviewSchema);

export default Review;