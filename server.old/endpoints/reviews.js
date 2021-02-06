import Review from '../db/Review';

/** 
 * @memberof module:Endpoints
 * @name Fetch reviews  
 * @path {GET} /reviews
  * @query {String} :itemId is the unique identifier for a specific product.
  * @response {Array} Reviews A JSON-encoded array of Review objects corresponding to the itemID.
 *  get:
 *    summary: 
 */
const reviewsHandler = (req, res, next) => {
  let {itemId} = req.body; // currently not integrated
  let query = itemId !== undefined ? { product : itemId } : {}; 
  Review.find().select('-__v -_id')
    .then(data => res.status(200).json(data).end())
    .catch(err => {
      console.log(err);
      res.status(400).end();
    });
};

export default reviewsHandler;