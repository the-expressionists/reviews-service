"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.setDBReturn = exports["default"] = void 0; // let mongoose = jest.createMockFromModule('mongoose');

var dummyData = [
{ 'object': 'value' },
{ 'object': 'another value' }];


var selector = Promise.resolve;

var Review = {
  find: jest.fn().mockImplementation(function () {return Review;}),
  // default: Review,
  select: jest.fn().mockImplementation(function () {return selector(dummyData);}) };


var _Review = Review;

// resolve(reject) = reject
var setDBReturn = function setDBReturn(f) {return selector = f;};exports.setDBReturn = setDBReturn;var _default =

Review;


// module.exports = {
//   // Review, 
//   // _Review,
//   setDBReturn,
//   // selector
// };
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NlcnZlci9kYi9fX21vY2tzX18vUmV2aWV3LmpzIl0sIm5hbWVzIjpbImR1bW15RGF0YSIsInNlbGVjdG9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJSZXZpZXciLCJmaW5kIiwiamVzdCIsImZuIiwibW9ja0ltcGxlbWVudGF0aW9uIiwic2VsZWN0IiwiX1JldmlldyIsInNldERCUmV0dXJuIiwiZiJdLCJtYXBwaW5ncyI6IjhIQUFBOztBQUVBLElBQUlBLFNBQVMsR0FBRztBQUNkLEVBQUUsVUFBVSxPQUFaLEVBRGM7QUFFZCxFQUFFLFVBQVUsZUFBWixFQUZjLENBQWhCOzs7QUFLQSxJQUFJQyxRQUFRLEdBQUdDLE9BQU8sQ0FBQ0MsT0FBdkI7O0FBRUEsSUFBSUMsTUFBTSxHQUFHO0FBQ1hDLEVBQUFBLElBQUksRUFBRUMsSUFBSSxDQUFDQyxFQUFMLEdBQVVDLGtCQUFWLENBQTZCLG9CQUFNSixNQUFOLEVBQTdCLENBREs7QUFFWDtBQUNBSyxFQUFBQSxNQUFNLEVBQUVILElBQUksQ0FBQ0MsRUFBTCxHQUFVQyxrQkFBVixDQUE2QixvQkFBTVAsUUFBUSxDQUFDRCxTQUFELENBQWQsRUFBN0IsQ0FIRyxFQUFiOzs7QUFNQSxJQUFJVSxPQUFPLEdBQUdOLE1BQWQ7O0FBRUE7QUFDQSxJQUFJTyxXQUFXLEdBQUcsU0FBZEEsV0FBYyxDQUFDQyxDQUFELFVBQU9YLFFBQVEsR0FBR1csQ0FBbEIsRUFBbEIsQzs7QUFFZVIsTTs7O0FBR2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbGV0IG1vbmdvb3NlID0gamVzdC5jcmVhdGVNb2NrRnJvbU1vZHVsZSgnbW9uZ29vc2UnKTtcblxubGV0IGR1bW15RGF0YSA9IFtcbiAgeyAnb2JqZWN0JzogJ3ZhbHVlJyB9LFxuICB7ICdvYmplY3QnOiAnYW5vdGhlciB2YWx1ZScgfVxuXTtcblxubGV0IHNlbGVjdG9yID0gUHJvbWlzZS5yZXNvbHZlO1xuXG5sZXQgUmV2aWV3ID0ge1xuICBmaW5kOiBqZXN0LmZuKCkubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IFJldmlldyksXG4gIC8vIGRlZmF1bHQ6IFJldmlldyxcbiAgc2VsZWN0OiBqZXN0LmZuKCkubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHNlbGVjdG9yKGR1bW15RGF0YSkpLFxufTtcblxubGV0IF9SZXZpZXcgPSBSZXZpZXc7XG5cbi8vIHJlc29sdmUocmVqZWN0KSA9IHJlamVjdFxubGV0IHNldERCUmV0dXJuID0gKGYpID0+IHNlbGVjdG9yID0gZjtcblxuZXhwb3J0IGRlZmF1bHQgUmV2aWV3O1xuXG5leHBvcnQge3NldERCUmV0dXJufTtcbi8vIG1vZHVsZS5leHBvcnRzID0ge1xuLy8gICAvLyBSZXZpZXcsIFxuLy8gICAvLyBfUmV2aWV3LFxuLy8gICBzZXREQlJldHVybixcbi8vICAgLy8gc2VsZWN0b3Jcbi8vIH07Il19