"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _Review = _interopRequireDefault(require("../db/Review"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}

/** 
 * @memberof module:Endpoints
 * @name Fetch reviews  
 * @path {GET} /reviews
  * @query {String} :itemId is the unique identifier for a specific product.
  * @response {Array} Reviews A JSON-encoded array of Review objects corresponding to the itemID.
 *  get:
 *    summary: 
 */
var reviewsHandler = function reviewsHandler(req, res, next) {var
  itemId = req.body.itemId; // currently not integrated
  var query = itemId !== undefined ? { product: itemId } : {};
  _Review["default"].find().select('-__v -_id').
  then(function (data) {return res.status(200).json(data).end();})["catch"](
  function (err) {
    console.log(err);
    res.status(400).end();
  });
};var _default =

reviewsHandler;exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9lbmRwb2ludHMvcmV2aWV3cy5qcyJdLCJuYW1lcyI6WyJyZXZpZXdzSGFuZGxlciIsInJlcSIsInJlcyIsIm5leHQiLCJpdGVtSWQiLCJib2R5IiwicXVlcnkiLCJ1bmRlZmluZWQiLCJwcm9kdWN0IiwiUmV2aWV3IiwiZmluZCIsInNlbGVjdCIsInRoZW4iLCJkYXRhIiwic3RhdHVzIiwianNvbiIsImVuZCIsImVyciIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiJ1R0FBQSw4RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNQSxjQUFjLEdBQUcsU0FBakJBLGNBQWlCLENBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYLEVBQW9CO0FBQ3BDQyxFQUFBQSxNQURvQyxHQUMxQkgsR0FBRyxDQUFDSSxJQURzQixDQUNwQ0QsTUFEb0MsRUFDaEI7QUFDekIsTUFBSUUsS0FBSyxHQUFHRixNQUFNLEtBQUtHLFNBQVgsR0FBdUIsRUFBRUMsT0FBTyxFQUFHSixNQUFaLEVBQXZCLEdBQThDLEVBQTFEO0FBQ0FLLHFCQUFPQyxJQUFQLEdBQWNDLE1BQWQsQ0FBcUIsV0FBckI7QUFDR0MsRUFBQUEsSUFESCxDQUNRLFVBQUFDLElBQUksVUFBSVgsR0FBRyxDQUFDWSxNQUFKLENBQVcsR0FBWCxFQUFnQkMsSUFBaEIsQ0FBcUJGLElBQXJCLEVBQTJCRyxHQUEzQixFQUFKLEVBRFo7QUFFUyxZQUFBQyxHQUFHLEVBQUk7QUFDWkMsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlGLEdBQVo7QUFDQWYsSUFBQUEsR0FBRyxDQUFDWSxNQUFKLENBQVcsR0FBWCxFQUFnQkUsR0FBaEI7QUFDRCxHQUxIO0FBTUQsQ0FURCxDOztBQVdlaEIsYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZXZpZXcgZnJvbSAnLi4vZGIvUmV2aWV3JztcblxuLyoqIFxuICogQG1lbWJlcm9mIG1vZHVsZTpFbmRwb2ludHNcbiAqIEBuYW1lIEZldGNoIHJldmlld3MgIFxuICogQHBhdGgge0dFVH0gL3Jldmlld3NcbiAgKiBAcXVlcnkge1N0cmluZ30gOml0ZW1JZCBpcyB0aGUgdW5pcXVlIGlkZW50aWZpZXIgZm9yIGEgc3BlY2lmaWMgcHJvZHVjdC5cbiAgKiBAcmVzcG9uc2Uge0FycmF5fSBSZXZpZXdzIEEgSlNPTi1lbmNvZGVkIGFycmF5IG9mIFJldmlldyBvYmplY3RzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGl0ZW1JRC5cbiAqICBnZXQ6XG4gKiAgICBzdW1tYXJ5OiBcbiAqL1xuY29uc3QgcmV2aWV3c0hhbmRsZXIgPSAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgbGV0IHtpdGVtSWR9ID0gcmVxLmJvZHk7IC8vIGN1cnJlbnRseSBub3QgaW50ZWdyYXRlZFxuICBsZXQgcXVlcnkgPSBpdGVtSWQgIT09IHVuZGVmaW5lZCA/IHsgcHJvZHVjdCA6IGl0ZW1JZCB9IDoge307IFxuICBSZXZpZXcuZmluZCgpLnNlbGVjdCgnLV9fdiAtX2lkJylcbiAgICAudGhlbihkYXRhID0+IHJlcy5zdGF0dXMoMjAwKS5qc29uKGRhdGEpLmVuZCgpKVxuICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIHJlcy5zdGF0dXMoNDAwKS5lbmQoKTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHJldmlld3NIYW5kbGVyOyJdfQ==