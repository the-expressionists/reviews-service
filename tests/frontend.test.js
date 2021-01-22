import * as rh from '../client/renderHelpers';
import * as fc from 'fast-check';
import _ from 'lodash/fp';

const { assert, property: prop } = fc;

let genericTests = (f, length) => {
  test(`${f.name} should be a defined function`, () => {

    expect(f).toBeDefined();
    expect(f).toBeInstanceOf(Function);
  });
  if (length !== undefined) {
    test(`${f.name} should have a length of ${length}`, () => {
      expect(f).toHaveLength(length);
    });
  }
};
describe('map', () => {
  let objGen;
  beforeEach(() => {
    objGen = fc.object({
      maxDepth: 0,
      maxKeys: 1000,
      values: [fc.integer()]
    });
  });

  genericTests(rh.map);

  it('should shallowly treat objects as functors :: `(v -> w) -> Obj k v -> Obj k w`', () => {
    let f = (n) => n * 2;
    assert(
      prop(objGen, (obj) => {
        let mapped = rh.map(f, obj);
        let mappedVals = [...Object.values(mapped)].sort();
        let expVals = [...Object.values(obj)].map(f).sort();
        expect(mappedVals).toEqual(expVals);
      })
    );
  });

  it('should\'t modify the input object', () => {
    let f = (n) => n * 4;
    assert(
      prop(objGen, (obj) => {
        let copy = _.cloneDeep(obj);
        let mapped = rh.map(f, obj);
        expect(obj).toEqual(copy);
      })
    );
  });
});

describe('mean', () => {
  genericTests(rh.mean, 1);

  it('should return the arithmetic mean of its inputs', () => {
    assert(
      prop(fc.array(fc.integer(), 5000), (arr) => {
        let sum = 0;
        arr.forEach(x => sum += x);
        expect(rh.mean(arr)).toEqual(sum / arr.length);
      }));
  });
});

describe('collect', () => {
  genericTests(rh.collect);

  let objGen;
  let strGen; 
  beforeEach(() => {
    objGen = fc.array(fc.array(fc.integer()), {
      minLength: 10, maxLength: 300
    });
    strGen = fc.set(fc.hexaString({ minLength: 1 }), {
      minLength: 300
    });
  });

  it('should take in a variable number of arguments', () => {
    expect(rh.collect.length).toEqual(0); // var arg stuff
    assert(prop(fc.array(fc.object()), (arr) => {
      let collected = (arr.length === 1)
        ? rh.collect(arr) // collect assumes that a single argument is an array of objs
        : rh.collect(...arr);

      expect(collected).toBeDefined();
      expect(collected).toBeInstanceOf(Object);
      expect(Array.isArray(collected)).not.toBe(true);
    }));
  });

  it('should condense object properties into an object of arrays', () => {
    assert(
      prop(objGen, strGen, (matrix, names) => {
        // since lodash zip doesn't limit you to the min length
        names = names.slice(0, matrix.length);
        let pairs = _.zip(names)(matrix);
        let objArr = [];

        pairs.forEach(([key, valArr]) => {
          valArr.forEach((v, i) => {
            if (objArr[i] === undefined) {
              objArr[i] = {};
            }
            objArr[i][key] = v;
          });
        });
        let coll = rh.collect(...objArr);
        let coll1 = rh.collect(objArr);
        let expMap = new Map(pairs);

        // single argument vs spread operator shouldn't make a difference
        expect(coll).toEqual(coll1);
        names.forEach(name => {
          let z = expMap.get(name);
          if (z.length) {
            expect(coll[name]).toEqual(z); // should collate values
          } else {
            expect(coll[name]).not.toBeDefined(); // or ignore their keys
          }
        });
        // expect(new Set(Object.keys(coll))).toMatchObject(new Set(names));
      }));
  });
});

describe('aggregate', () => {
  genericTests(rh.aggregate);
  // honestly an arbitrary restriction, this could be made more generic
  let fst = ([a, _]) => a;
  let snd = ([_, b]) => b;

  let targs = [ "heat"
              , "flavour"
              , "lead content"
              , "mass"
              , "nationality"
              ];
  let tlen = targs.length;
  let genMetrics = () => fc.array(fc.nat(), { 
    minLength: tlen, 
    maxLength: tlen
  }).map(x => _.zip(targs)(x) 
           |> Object.fromEntries
        );// .map(arr => arr);
  
  let mkReview = () => fc.tuple(fc.object(), genMetrics())
                         .map(([obj, metrics]) => ({metrics, ...obj}));

  it('should accept an array of reviews', () => {
    assert(
      prop(fc.array(mkReview()), reviews => {          
        let ag = rh.aggregate(reviews);
        expect(ag).toBeDefined();
      }
    )
    );
  });

  it('shouldn\'t drop any included keys', () => {
    assert(
      prop(fc.array(mkReview()), reviews => {
        let means;
        if (reviews.length) {
          let sums = targs.map(k => [k, 0]) |> Object.fromEntries;

          for (let rev of reviews) {
            for (let key in rev.metrics) {
              sums[key] += rev.metrics[key];
            }
          }
        means = rh.map(x => x / (reviews.length), sums);
        } else {
          means = {};
        }
    let ag = rh.aggregate(reviews);
        expect(ag).toEqual(means);
      })
    );
  });
});

// describe('cast', () => {
//   let constructors = [
//     Date, Number
//   ];

//   // breaks at 0 lol
//   // let date = fc.date({min: -8639999999999999, max: 8639999999999999});
//   genericTests(rh.cast);
//   it('should be able to coerce a type when valid', () => {
//     assert(prop(fc.date(), fc.integer(), (d, i) => {
//       let ds = d.toString();
//       let is = i.toString();

//       // small imprecisions in date casting
//       expect(rh.cast(Date, ds) - d).toBeLessThan(5);
//       expect(rh.cast(Number, is) == i).toBe(true); // Number.toEqual(number) is false lol
//     }));
//   });

//   it('should be idempotent', () => {
//     assert(prop(fc.date(), fc.integer(), (d, i) => {
//       d = rh.cast(Date, d);
//       i = rh.cast(Number, i);
//       for (let x = 0; x < 10; x++) {
//         let d1 = rh.cast(Date, d);
//         // 5 ms in 50 years is pretty good ok
//         expect(d1 - d).toBeLessThan(5);
//         d = d1;

//         let i1 = rh.cast(Number, i);
//         expect(i1).toEqual(i);
//         i = i1;
//       }
//     }));
//   });
// });