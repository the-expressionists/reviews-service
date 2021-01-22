import * as fc from 'fast-check'; 
import { TestScheduler } from 'jest';
import { iteratee } from 'lodash';
import { isExportDeclaration } from 'typescript';
import 'regenerator-runtime/runtime';
import axios from 'axios';
import process from 'process';
import child_process from 'child_process';

const reviewFile = '../server/db/Review.js';

jest.mock(reviewFile);

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
describe('review middleware', () => {

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
    let resp = await testPromise();
    expect(resp.status).toHaveBeenCalledWith(200);
    expect(resp.json).toHaveBeenCalledTimes(1);
    expect(Array.isArray(resp.json.mock.calls[0])).toBe(true);
    done();
  });

  it('should fail gracefully', async (done) => {

    let boom = new Error('BOOM');
    require(reviewFile).setDBReturn(() => Promise.reject(boom));
    
    console.log = jest.fn(); // hide the error log
    let resp = await testPromise();
    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(boom);
    done();
  });
});

// describe('static file server', () => {
//     let host = process.env.SERVER_URL ?? 'http://127.0.0.1';
//     let port = process.env.PORT || 8081;
//     let serv = axios.create({baseURL: `${host}:${port}/`});

//     const withServer = async (assertions) => {
//       let app = child_process.fork('server/index.js');
//       await assertions();
//       app.kill(0);
//     };

//     it('should serve our site', async (done) => {
//       withServer(async () => {
//         let resp = await serv.get();
//         expect(resp.status).toBe(200);
//         expect(resp.statusText).toBe('OK');
//       });
//       done();
//     });
// });