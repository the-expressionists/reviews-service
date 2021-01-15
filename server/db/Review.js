import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');

const {Schema} = mongoose;

const req = (type) => {return { type, required: true } };

/** @class Review */
const ReviewSchema = new Schema({
    title: req(String),
    user: req(String),
    date: req(Date),
    likes: req(Number),
    body: req(String),
    stars: req(Number),
    recommend: req(Boolean),
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true},
    metrics: {
        difficulty: Number,    
        value: Number,    
        quality: Number,    
        appearance: Number,
        works: Number,    
    }
});

const Review = mongoose.model('Review', ReviewSchema);