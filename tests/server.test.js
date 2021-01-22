import * as fc from 'fast-check'; 
import { TestScheduler } from 'jest';
import { iteratee } from 'lodash';
import { isExportDeclaration } from 'typescript';
import 'regenerator-runtime/runtime';

const reviewFile = '../server/db/Review.js';
jest.mock(reviewFile);

const axios = require('axios');
const {reviewsHandler} = require('../server/endpoints');

const genericTests = (f, desiredLen) => {
  test(`${f.name} is a function`, () => {
    expect(f).toBeDefined();
    expect(f).toBeInstanceOf(Function);
  });
  
  if (desiredLen !== undefined) {
    test(`${f.name} takes ${desiredLen} arguments`, () => {
      expect(f.length).toEqual(desiredLen);
    });
  }
};

const dummyData = [
  { 'object': 'value' },
  { 'object': 'another value' }
];
describe('review component server', () => {

  genericTests(reviewsHandler, 3);
  let req, resp, next = (() => undefined);
  let testPromise;
  beforeEach(() => {
    req = {body: ''};
    testPromise = () => new Promise(resv => {
      let resp = {
        status: jest.fn().mockImplementation(() => resp),
        json: jest.fn().mockImplementation(() => resp),
        end: () => resv(resp)
      };
      reviewsHandler(req, resp);
    });

  });
  it('should serve a set of reviews', async (done) => {
    require(reviewFile).setDBReturn(d => Promise.resolve(d));
    return testPromise().then(resp => {
      expect(resp.status).toHaveBeenCalledWith(200);
      expect(resp.json).toHaveBeenCalledTimes(1);
      expect(Array.isArray(resp.json.mock.calls[0])).toBe(true);
    }).then(done);
  });

  it('should fail gracefully', async (done) => {
    require(reviewFile).setDBReturn(() => Promise.reject(new Error('BOOM')));
    return testPromise().then(resp => {
      expect(resp.status).toHaveBeenCalledWith(400);
      expect(resp.json).not.toHaveBeenCalled();
    }).finally(done);
  });
});