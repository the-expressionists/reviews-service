"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.mkReview = exports.bundlePhoto = exports.genUUID = exports.seed = void 0;







var _faker = _interopRequireDefault(require("faker"));
var _Review = _interopRequireDefault(require("./Review.js"));
var _promises = _interopRequireDefault(require("fs/promises"));
var _fs = require("fs");
var _axios = _interopRequireDefault(require("axios"));
var _path = _interopRequireDefault(require("path"));
var _crypto = _interopRequireDefault(require("crypto"));
var _aws = _interopRequireDefault(require("../../config/aws.js"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(o);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _iterableToArray(iter) {if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) return _arrayLikeToArray(arr);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}var
lorem = _faker["default"].lorem,name = _faker["default"].name,internet = _faker["default"].internet,random = _faker["default"].random;
/**
 * @return {String} - a valid, random UUID
 */
var genUUID = function genUUID() {
  var buf = _crypto["default"].randomBytes(16);
  buf[6] &= 79; // set high nibble to 4
  buf[8] &= 191; // set high nibble to one of 8, 9, 'A', 'B'
  var s = buf.toString('hex');
  var intervals = [8, 4, 4, 4, 12]; // positions to split s at 
  var offset = 0;
  return intervals.reduce(function (a, i) {return "".concat(a, "-").concat(s.substring(offset, offset += i));}, '').slice(1);
};exports.genUUID = genUUID;

var delay = function delay(f, time) {return new Promise(function (res) {return setTimeout(function () {return res(f());}, time);});};

var log = function log(d) {console.log(d);return d;};

// create an axios instance - we need to specify an arraybuffer to prevent the image data
// from getting corrupted
var photoGetter = _axios["default"].create({
  baseURL: 'https://thispersondoesnotexist.com/image',
  responseType: 'arraybuffer' });


/**
 * 
 * @param {Buffer} buf - Buffer object representing a JPEG image
 * @return {Promise(ManagedUpload)} - AWS object with metadata for the uploaded S3 object 
 */
var bundlePhoto = function bundlePhoto(buf) {return (0, _aws["default"])("".concat(genUUID(), ".jpeg"), Buffer.from(buf, 'binary'));};

/**
 * @param {number} numUrls - how many urls to get
 * @param {number} [delayTime=1000] - delay period between GET requests (necessary to prevent duplicates)
 * @return {Promise(Array(String))} - Array of `n` image URLs.
 */exports.bundlePhoto = bundlePhoto;
var getImgUrls = function getImgUrls(numUrls) {var _ref, _ref2, _context;var delayTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  var ct = 1;
  console.log('Downloading images...');
  return (_ref = (_ref2 = _toConsumableArray(Array(numUrls)),
  _ref2.map(function (_, i) {return delay(photoGetter.get.bind(photoGetter), i * delayTime) // to guarantee unique images
    .then(function (resp) {
      console.log("Saving ".concat(ct++, "/").concat(numUrls, " images..."));
      return bundlePhoto(resp.data);
    }).
    then(function (s3Obj) {var _s3Obj;return _s3Obj = s3Obj, _s3Obj.Location;});} // upload to S3, returning the location
  )),
  Promise.all(_ref))["catch"](
  (_context = console).log.bind(_context));
};

var mkStar = function mkStar() {return 1 + ~~(Math.random() * 5);};

var mkReview = function mkReview(thumbnail) {
  return {
    title: lorem.sentence(10),
    user: internet.userName(),
    date: _faker["default"].date.past(4),
    likes: random.number(1000),
    body: lorem.paragraph(30),
    stars: mkStar(),
    thumbnail: thumbnail,
    recommend: random["boolean"](),
    // product: random.uuid(),
    metrics: {
      difficulty: mkStar(),
      value: mkStar(),
      quality: mkStar(),
      appearance: mkStar(),
      works: mkStar() } };


};

/**
 * @param {Number} n - How many records to create.
 * @return {Promise(Array(Review))} - Array of Review instances.
 */exports.mkReview = mkReview;
var seed = function seed(n) {return getImgUrls(n).then(function (urls) {var _urls$map;return _urls$map = urls.map(function (url) {var _ref3, _mkReview;return _ref3 = (_mkReview =
      mkReview(url), new _Review["default"](_mkReview)), _ref3.save();}),
    Promise.all(_urls$map);});};

// equivalent to `if __name__=='__main__'`
// require.main indicates the entry point for the program, e.g. whether we're
// running this module from the shell directly or if it's being required by
// another module.
exports.seed = seed;if (require.main === module) {
  seed(100).
  then(function (arr) {
    console.log("Wrote ".concat(arr.length, " records!"));
    process.exit(0);
  })["catch"](
  function (err) {
    console.log(err);
    process.exit(1);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9kYi9TZWVkLmpzIl0sIm5hbWVzIjpbImxvcmVtIiwiZmFrZXIiLCJuYW1lIiwiaW50ZXJuZXQiLCJyYW5kb20iLCJnZW5VVUlEIiwiYnVmIiwiY3J5cHRvIiwicmFuZG9tQnl0ZXMiLCJzIiwidG9TdHJpbmciLCJpbnRlcnZhbHMiLCJvZmZzZXQiLCJyZWR1Y2UiLCJhIiwiaSIsInN1YnN0cmluZyIsInNsaWNlIiwiZGVsYXkiLCJmIiwidGltZSIsIlByb21pc2UiLCJyZXMiLCJzZXRUaW1lb3V0IiwibG9nIiwiZCIsImNvbnNvbGUiLCJwaG90b0dldHRlciIsImF4aW9zIiwiY3JlYXRlIiwiYmFzZVVSTCIsInJlc3BvbnNlVHlwZSIsImJ1bmRsZVBob3RvIiwiQnVmZmVyIiwiZnJvbSIsImdldEltZ1VybHMiLCJudW1VcmxzIiwiZGVsYXlUaW1lIiwiY3QiLCJBcnJheSIsIm1hcCIsIl8iLCJnZXQiLCJ0aGVuIiwicmVzcCIsImRhdGEiLCJzM09iaiIsIkxvY2F0aW9uIiwiYWxsIiwibWtTdGFyIiwiTWF0aCIsIm1rUmV2aWV3IiwidGh1bWJuYWlsIiwidGl0bGUiLCJzZW50ZW5jZSIsInVzZXIiLCJ1c2VyTmFtZSIsImRhdGUiLCJwYXN0IiwibGlrZXMiLCJudW1iZXIiLCJib2R5IiwicGFyYWdyYXBoIiwic3RhcnMiLCJyZWNvbW1lbmQiLCJtZXRyaWNzIiwiZGlmZmljdWx0eSIsInZhbHVlIiwicXVhbGl0eSIsImFwcGVhcmFuY2UiLCJ3b3JrcyIsInNlZWQiLCJuIiwidXJscyIsInVybCIsIlJldmlldyIsInNhdmUiLCJyZXF1aXJlIiwibWFpbiIsIm1vZHVsZSIsImFyciIsImxlbmd0aCIsInByb2Nlc3MiLCJleGl0IiwiZXJyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0U7QUFDS0EsSyxHQUFpQ0MsaUIsQ0FBakNELEssQ0FBT0UsSSxHQUEwQkQs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Q0FBRCxDQUFWLENBQWM3QixJQUFkLENBQW1CLFVBQUE4QixJQUFJLG9DQUFJQSxJQUFJLENBQUNqQyxHQUFMLENBQVMsVUFBQWtDLEdBQUc7QUFDckN2QixNQUFBQSxRQUFRLENBQUN1QixHQUFELENBRDZCLEVBQ3BCLElBQUlDLGtCQUFKLFdBRG9CLEdBQ0gsTUFBRUMsSUFBRixFQURHLEVBQVosQ0FBSjtBQUVsQnZELElBQUFBLE9BQU8sQ0FBQzJCLEdBRlUsYUFBdkIsQ0FBUCxFQUFYOztBQUlBO0FBQ0E7QUFDQTtBQUNBO29CQUNBLElBQUk2QixPQUFPLENBQUNDLElBQVIsS0FBaUJDLE1BQXJCLEVBQTZCO0FBQzNCUixFQUFBQSxJQUFJLENBQUMsR0FBRCxDQUFKO0FBQ0c1QixFQUFBQSxJQURILENBQ1EsVUFBQXFDLEdBQUcsRUFBSTtBQUNMdEQsSUFBQUEsT0FBTyxDQUFDRixHQUFSLGlCQUFxQndELEdBQUcsQ0FBQ0MsTUFBekI7QUFDQUMsSUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsQ0FBYjtBQUNILEdBSlA7QUFLYSxZQUFBQyxHQUFHLEVBQUk7QUFDVjFELElBQUFBLE9BQU8sQ0FBQ0YsR0FBUixDQUFZNEQsR0FBWjtBQUNBRixJQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxDQUFiO0FBQ0gsR0FSUDtBQVNEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbW9kdWxlIFNlZWRcbiAqIGNvbnRhaW5zIHNvbWUgZnVuY3Rpb25zIGZvciBnZW5lcmF0aW5nIGZha2UgZGF0YSwgZmV0Y2hpbmcgaW1hZ2VzIGZyb20gXG4gKiAgYHRoaXNwZXJzb25kb2Vzbm90ZXhpc3QuY29tYCBhbmQgdXBsb2FkaW5nIHRoZW0gdG8gQVdTLiBUaGUgc3RvcmVkIFVSTHMgYXJlIHRoZW5cbiAqICBidW5kbGVkIGluIGEgYFJldmlld2Agb2JqZWN0IGFuZCBzYXZlZCBpbiB0aGUgZGF0YWJhc2UuXG4gKiBNb2R1bGUgd2lsbCBzZWVkIDEwMCByZWNvcmRzIHdoZW4gY2FsbGVkIGRpcmVjdGx5LlxuICogXG4gKi9cbmltcG9ydCBmYWtlciBmcm9tICdmYWtlcic7XG5pbXBvcnQgUmV2aWV3IGZyb20gJy4vUmV2aWV3LmpzJztcbmltcG9ydCBmcyBmcm9tICdmcy9wcm9taXNlcyc7XG5pbXBvcnQge2V4aXN0c1N5bmN9IGZyb20gJ2ZzJztcbmltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCB1cGxvYWRUb1MzIGZyb20gJy4uLy4uL2NvbmZpZy9hd3MuanMnO1xubGV0IHtsb3JlbSwgbmFtZSwgaW50ZXJuZXQsIHJhbmRvbX0gPSBmYWtlcjtcbi8qKlxuICogQHJldHVybiB7U3RyaW5nfSAtIGEgdmFsaWQsIHJhbmRvbSBVVUlEXG4gKi9cbmNvbnN0IGdlblVVSUQgPSAoKSA9PiB7XG4gICAgbGV0IGJ1ZiA9IGNyeXB0by5yYW5kb21CeXRlcygxNik7XG4gICAgYnVmWzZdICY9IDBiMDEwMDExMTE7IC8vIHNldCBoaWdoIG5pYmJsZSB0byA0XG4gICAgYnVmWzhdICY9IDBiMTAxMTExMTE7IC8vIHNldCBoaWdoIG5pYmJsZSB0byBvbmUgb2YgOCwgOSwgJ0EnLCAnQidcbiAgICBsZXQgcyA9IGJ1Zi50b1N0cmluZygnaGV4Jyk7XG4gICAgbGV0IGludGVydmFscyA9IFs4LCA0LCA0LCA0LCAxMl07IC8vIHBvc2l0aW9ucyB0byBzcGxpdCBzIGF0IFxuICAgIGxldCBvZmZzZXQgPSAwO1xuICAgIHJldHVybiBpbnRlcnZhbHMucmVkdWNlKChhLCBpKSA9PiBgJHthfS0ke3Muc3Vic3RyaW5nKG9mZnNldCwgb2Zmc2V0ICs9IGkpfWAsICcnKS5zbGljZSgxKTtcbn07XG5cbmxldCBkZWxheSA9IChmLCB0aW1lKSA9PiBuZXcgUHJvbWlzZSgocmVzKSA9PiBzZXRUaW1lb3V0KCgpID0+IHJlcyhmKCkpLCB0aW1lKSk7XG5cbmxldCBsb2cgPSAoZCkgPT4ge2NvbnNvbGUubG9nKGQpOyByZXR1cm4gZDt9O1xuXG4vLyBjcmVhdGUgYW4gYXhpb3MgaW5zdGFuY2UgLSB3ZSBuZWVkIHRvIHNwZWNpZnkgYW4gYXJyYXlidWZmZXIgdG8gcHJldmVudCB0aGUgaW1hZ2UgZGF0YVxuLy8gZnJvbSBnZXR0aW5nIGNvcnJ1cHRlZFxubGV0IHBob3RvR2V0dGVyID0gYXhpb3MuY3JlYXRlKHtcbiAgICBiYXNlVVJMOiAnaHR0cHM6Ly90aGlzcGVyc29uZG9lc25vdGV4aXN0LmNvbS9pbWFnZScsXG4gICAgcmVzcG9uc2VUeXBlOiAnYXJyYXlidWZmZXInXG59KTtcblxuLyoqXG4gKiBcbiAqIEBwYXJhbSB7QnVmZmVyfSBidWYgLSBCdWZmZXIgb2JqZWN0IHJlcHJlc2VudGluZyBhIEpQRUcgaW1hZ2VcbiAqIEByZXR1cm4ge1Byb21pc2UoTWFuYWdlZFVwbG9hZCl9IC0gQVdTIG9iamVjdCB3aXRoIG1ldGFkYXRhIGZvciB0aGUgdXBsb2FkZWQgUzMgb2JqZWN0IFxuICovXG5sZXQgYnVuZGxlUGhvdG8gPSAoYnVmKSA9PiB1cGxvYWRUb1MzKGAke2dlblVVSUQoKX0uanBlZ2AsIEJ1ZmZlci5mcm9tKGJ1ZiwgJ2JpbmFyeScpKTtcblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtVXJscyAtIGhvdyBtYW55IHVybHMgdG8gZ2V0XG4gKiBAcGFyYW0ge251bWJlcn0gW2RlbGF5VGltZT0xMDAwXSAtIGRlbGF5IHBlcmlvZCBiZXR3ZWVuIEdFVCByZXF1ZXN0cyAobmVjZXNzYXJ5IHRvIHByZXZlbnQgZHVwbGljYXRlcylcbiAqIEByZXR1cm4ge1Byb21pc2UoQXJyYXkoU3RyaW5nKSl9IC0gQXJyYXkgb2YgYG5gIGltYWdlIFVSTHMuXG4gKi9cbmxldCBnZXRJbWdVcmxzID0gKG51bVVybHMsIGRlbGF5VGltZSA9IDEwMDApID0+IHtcbiAgICBsZXQgY3QgPSAxO1xuICAgIGNvbnNvbGUubG9nKCdEb3dubG9hZGluZyBpbWFnZXMuLi4nKTtcbiAgICByZXR1cm4gKCBbLi4uQXJyYXkobnVtVXJscyldXG4gICAgICAgIHw+ICMubWFwKChfLCBpKSA9PiBkZWxheSg6OnBob3RvR2V0dGVyLmdldCwgaSAqIGRlbGF5VGltZSkgLy8gdG8gZ3VhcmFudGVlIHVuaXF1ZSBpbWFnZXNcbiAgICAgICAgICAgICAgICAgLnRoZW4ocmVzcCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgU2F2aW5nICR7Y3QrK30vJHtudW1VcmxzfSBpbWFnZXMuLi5gKTtcbiAgICAgICAgICAgICAgICAgICAgIHJldHVybiBidW5kbGVQaG90byhyZXNwLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAudGhlbihzM09iaiA9PiBzM09iaiB8PiAjLkxvY2F0aW9uKSAvLyB1cGxvYWQgdG8gUzMsIHJldHVybmluZyB0aGUgbG9jYXRpb25cbiAgICAgICAgICAgICAgICApIFxuICAgICAgICB8PiBQcm9taXNlLmFsbFxuICAgICAgICApLmNhdGNoKDo6Y29uc29sZS5sb2cpO1xufTtcblxubGV0IG1rU3RhciA9ICgpID0+IDEgKyB+fihNYXRoLnJhbmRvbSgpICogNSk7XG5cbmxldCBta1JldmlldyA9ICh0aHVtYm5haWwpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0aXRsZTogbG9yZW0uc2VudGVuY2UoMTApLFxuICAgICAgICB1c2VyOiBpbnRlcm5ldC51c2VyTmFtZSgpLFxuICAgICAgICBkYXRlOiBmYWtlci5kYXRlLnBhc3QoNCksXG4gICAgICAgIGxpa2VzOiByYW5kb20ubnVtYmVyKDEwMDApLFxuICAgICAgICBib2R5OiBsb3JlbS5wYXJhZ3JhcGgoMzApLFxuICAgICAgICBzdGFyczogbWtTdGFyKCksXG4gICAgICAgIHRodW1ibmFpbDogdGh1bWJuYWlsLFxuICAgICAgICByZWNvbW1lbmQ6IHJhbmRvbS5ib29sZWFuKCksXG4gICAgICAgIC8vIHByb2R1Y3Q6IHJhbmRvbS51dWlkKCksXG4gICAgICAgIG1ldHJpY3M6IHtcbiAgICAgICAgICAgIGRpZmZpY3VsdHk6IG1rU3RhcigpLFxuICAgICAgICAgICAgdmFsdWU6IG1rU3RhcigpLFxuICAgICAgICAgICAgcXVhbGl0eTogbWtTdGFyKCksXG4gICAgICAgICAgICBhcHBlYXJhbmNlOiBta1N0YXIoKSxcbiAgICAgICAgICAgIHdvcmtzOiBta1N0YXIoKVxuICAgICAgICB9IFxuICAgIH07XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7TnVtYmVyfSBuIC0gSG93IG1hbnkgcmVjb3JkcyB0byBjcmVhdGUuXG4gKiBAcmV0dXJuIHtQcm9taXNlKEFycmF5KFJldmlldykpfSAtIEFycmF5IG9mIFJldmlldyBpbnN0YW5jZXMuXG4gKi9cbmxldCBzZWVkID0gKG4pID0+IGdldEltZ1VybHMobikudGhlbih1cmxzID0+IHVybHMubWFwKHVybCA9PlxuICAgICAgICAgICAgICAgICAgICBta1Jldmlldyh1cmwpIHw+IG5ldyBSZXZpZXcoIykgfD4gIy5zYXZlKCkpXG4gICAgICAgICAgICAgICAgICAgIHw+IFByb21pc2UuYWxsKTtcblxuLy8gZXF1aXZhbGVudCB0byBgaWYgX19uYW1lX189PSdfX21haW5fXydgXG4vLyByZXF1aXJlLm1haW4gaW5kaWNhdGVzIHRoZSBlbnRyeSBwb2ludCBmb3IgdGhlIHByb2dyYW0sIGUuZy4gd2hldGhlciB3ZSdyZVxuLy8gcnVubmluZyB0aGlzIG1vZHVsZSBmcm9tIHRoZSBzaGVsbCBkaXJlY3RseSBvciBpZiBpdCdzIGJlaW5nIHJlcXVpcmVkIGJ5XG4vLyBhbm90aGVyIG1vZHVsZS5cbmlmIChyZXF1aXJlLm1haW4gPT09IG1vZHVsZSkge1xuICBzZWVkKDEwMClcbiAgICAudGhlbihhcnIgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFdyb3RlICR7YXJyLmxlbmd0aH0gcmVjb3JkcyFgKTtcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgwKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICB9KTtcbn1cblxuZXhwb3J0IHtcbiAgICBzZWVkLCBnZW5VVUlELCBidW5kbGVQaG90bywgbWtSZXZpZXdcbn07Il19