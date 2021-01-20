
/**
 * 
 * @param {Function} f: a mapping from `(a -> b)`.
 * @param {Object} obj: An object containing values of type `a`.
 * @return {Object} a new object with every value replaced with the result of the function.
 * Lifts a function of type `(a -> b)` to a function of type `Object(k: a) -> Object(k: b)`.
 * Will keep returning a trampolined function until an object is provided.
 */
// pass in an object with identical key types.
// god I wish this were typescript.
const map = (f, obj) => {
  if (obj === undefined) { // optionally curried
    return (obj2) => map(f, obj2);
  }
  let res = {};
  [...Object.entries(obj)].forEach(([k, v]) => res[k] = f(v));
  return res;
};

/**
 * 
 * @param {Array} nums - Array of numbers.
 * @return {Number} The arithmetic mean of the input array.
 */
const mean = (nums) => nums.reduce((a, x) => a + x, 0) / nums.length;

/**
 * 
 * @param  {...Object} objs - An array of similar objects
 * @return {Object <Array>} - A new object with arrays of aggregated values for each key of the inputs.
 */
const collect = (...args) => {
  // in case an array is passed directly
  let objs = (args.length === 1 ? args[0] : args);
  return objs.reduce((acc, obj) => {
    for (let k in obj) {
      let a = acc[k] ?? [];
      a.push(obj[k]);
      acc[k] = a;
    }
    return acc;
  }, {});
};

const aggregate = (reviews) => {
  return reviews.map(r => r.metrics)
    |> collect
    |> map(mean, #)
    ;
};



const fmtStar = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

export { fmtStar
       , aggregate
       , collect
       , mean
       , map
       };