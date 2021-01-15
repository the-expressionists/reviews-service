const fc = require('fast-check');

// const { describe, it, test } = jest;

const {
  integer, assert, string, property,
} = fc;

const add = (a, b) => a + b;

describe('add', () => {
  it('should be associative', () => {
    assert(
      property(integer(), integer(), integer(), (a, b, c) => (add(a, b) + c === a + add(b, c))),
    );
  });

  it('it should be commutative', () => {
    assert(
      property(integer(), integer(), (a, b) => (add(a, b) === add(b, a))),
    );
  });
});
