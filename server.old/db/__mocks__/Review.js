// let mongoose = jest.createMockFromModule('mongoose');

let dummyData = [
  { 'object': 'value' },
  { 'object': 'another value' }
];

let selector = Promise.resolve;

let Review = {
  find: jest.fn().mockImplementation(() => Review),
  // default: Review,
  select: jest.fn().mockImplementation(() => selector(dummyData)),
};

let _Review = Review;

// resolve(reject) = reject
let setDBReturn = (f) => selector = f;

export default Review;

export {setDBReturn};
// module.exports = {
//   // Review, 
//   // _Review,
//   setDBReturn,
//   // selector
// };