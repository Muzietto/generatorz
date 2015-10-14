/*
	GENERATORZ - ECMAScript 6 generators
	Author: Marco Faustinelli (contacts@faustinelli.net)
	Web: http://faustinelli.net/
	     http://faustinelli.wordpress.com/

	The GNU GPL/2 License - Copyright (c) 2015 Generatorz Project
*/

var expect = chai.expect;
mocha.setup('bdd');

function expect_from_iterator(iter, value, done) {
  var data = iter.next();
  expect(data.value).to.be.eql(value);  
  expect(data.done).to.be.eql(done);  
}

describe('among the existing iterators', function() {
  it('an array iterator consumes the whole array', function() {
    var arr = ['a','b','c'];
    var arr_iterator = arr[Symbol.iterator]();
    expect_from_iterator(arr_iterator, 'a', false);
    expect_from_iterator(arr_iterator, 'b', false);
    expect_from_iterator(arr_iterator, 'c', false);
    expect_from_iterator(arr_iterator, undefined, true);
  });
  describe('a map iterator', function() {
    it('built from Symbol.operator consumes pairs in FIFO order', function() {
      var map = new Map().set('a', 1).set('b', 2);
      var map_iterator = map[Symbol.iterator]();
      expect_from_iterator(map_iterator, ['a', 1], false);
      expect_from_iterator(map_iterator, ['b', 2], false);
      expect_from_iterator(map_iterator, undefined, true);
    });
    it('built from entries() consumes pairs in FIFO order', function() {
      var map = new Map().set('a', 1).set('b', 2);
      var map_iterator = map.entries();
      expect_from_iterator(map_iterator, ['a', 1], false);
      expect_from_iterator(map_iterator, ['b', 2], false);
      expect_from_iterator(map_iterator, undefined, true);
    });
    it('built from keys() consumes keys in FIFO order', function() {
      var map = new Map().set('a', 1).set('b', 2);
      var map_iterator = map.keys();
      expect_from_iterator(map_iterator, 'a', false);
      expect_from_iterator(map_iterator, 'b', false);
      expect_from_iterator(map_iterator, undefined, true);
    });
    it('built from values() consumes values in FIFO order', function() {
      var map = new Map().set('a', 1).set('b', 2);
      var map_iterator = map.values();
      expect_from_iterator(map_iterator, 1, false);
      expect_from_iterator(map_iterator, 2, false);
      expect_from_iterator(map_iterator, undefined, true);
    });
  });
  it('a set iterator consumes elements in FIFO order', function() {
    var set = new Set().add('a').add('b');
    var set_iterator = set[Symbol.iterator]();
    expect_from_iterator(set_iterator, 'a', false);
    expect_from_iterator(set_iterator, 'b', false);
    expect_from_iterator(set_iterator, undefined, true);
  });
  it('an arguments iterator consumes arguments according to the function invocation (not on FF!)', function() {
    var application = function() {
      var app_iterator = arguments[Symbol.iterator]();
      expect_from_iterator(app_iterator, 'a', false);
      expect_from_iterator(app_iterator, 1, false);
      expect_from_iterator(app_iterator, true, false);
      expect_from_iterator(app_iterator, [], false);
      expect_from_iterator(app_iterator, undefined, true);      
    };
    application('a', 1, true, []);
  });
  it('an iterator can be built from scratch without any real iterable', function() {
    var iterable = {
      [Symbol.iterator]() {
        var count = -1;
        var iterator = {
          next() {
            count++;
            if (count < 5) {
              return { value : 'pippo', done : false };
            } else {
              return { value : undefined, done : true };
            }
          }
        }
        return iterator;
      }
    }
    var homemade_iterator = iterable[Symbol.iterator]();
    expect_from_iterator(homemade_iterator, 'pippo', false); // 0
    expect_from_iterator(homemade_iterator, 'pippo', false); // 1
    expect_from_iterator(homemade_iterator, 'pippo', false); // 2
    expect_from_iterator(homemade_iterator, 'pippo', false); // 3
    expect_from_iterator(homemade_iterator, 'pippo', false); // 4
    expect_from_iterator(homemade_iterator, undefined, true); // 5
  });
});

describe('around iterators men can', function() {
  it('build a take function', function() {
    var arr = ['a','b','c','d','e','f'];
    var taker = take(3, arr);
    expect_from_iterator(taker, 'a', false);
    expect_from_iterator(taker, 'b', false);
    expect_from_iterator(taker, 'c', false);
    expect_from_iterator(taker, undefined, true);
  });
  it('build a zip function', function() {
    var arr = ['a'];
    var arr_iterator = arr[Symbol.iterator]();
    expect_from_iterator(arr_iterator, 'a', false);
    expect_from_iterator(arr_iterator, undefined, true);
  });
  it('', function() {
    var arr = ['a'];
    var arr_iterator = arr[Symbol.iterator]();
    expect_from_iterator(arr_iterator, 'a', false);
    expect_from_iterator(arr_iterator, undefined, true);
  });
  it('', function() {
    var arr = ['a'];
    var arr_iterator = arr[Symbol.iterator]();
    expect_from_iterator(arr_iterator, 'a', false);
    expect_from_iterator(arr_iterator, undefined, true);
  });
  it('', function() {
    var arr = ['a'];
    var arr_iterator = arr[Symbol.iterator]();
    expect_from_iterator(arr_iterator, 'a', false);
    expect_from_iterator(arr_iterator, undefined, true);
  });
  it('', function() {
    var arr = ['a'];
    var arr_iterator = arr[Symbol.iterator]();
    expect_from_iterator(arr_iterator, 'a', false);
    expect_from_iterator(arr_iterator, undefined, true);
  });
});
