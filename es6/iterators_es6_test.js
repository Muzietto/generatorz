/*
	GENERATORZ - ECMAScript 6 generators
	Author: Marco Faustinelli (contacts@faustinelli.net)
	Web: http://faustinelli.net/
	     http://faustinelli.wordpress.com/

	The GNU GPL/2 License - Copyright (c) 2015 Generatorz Project
*/

var expect = chai.expect;
mocha.setup('bdd');

function expect_from_iterator(iter, value, done, times) {
  times = times || 1;
  for (var i = 0; i < times; i++) {
    var data = iter.next();
    expect(data.value).to.be.eql(value);  
    expect(data.done).to.be.eql(done);
  }  
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
  describe('an iterator over arguments', function() {
    it('handles arguments according to the function invocation', function() {
      function application() {
        return arguments[Symbol.iterator]();
      };
      var app_iterator = application('a', 1, true, []);
      expect_from_iterator(app_iterator, 'a', false);
      expect_from_iterator(app_iterator, 1, false);
      expect_from_iterator(app_iterator, true, false);
      expect_from_iterator(app_iterator, [], false);
      expect_from_iterator(app_iterator, undefined, true);      
    });
    it('may be based upon the spread operator', function() {
      function application(...args) {
        return [...args][Symbol.iterator]();
      };
      var app_iterator = application('a', 1, true, []);
      expect_from_iterator(app_iterator, 'a', false);
      expect_from_iterator(app_iterator, 1, false);
      expect_from_iterator(app_iterator, true, false);
      expect_from_iterator(app_iterator, [], false);
      expect_from_iterator(app_iterator, undefined, true);      
    });
  });
  it('an iterator can be built from scratch without any real iterable', function() {
    var iterable = {
      [Symbol.iterator]() {
        var count = -1;
        var iterator = {
          next() {
            count++;
            if (count < 5) {
              return { value: 'pippo', done: false };
            } else {
              //iterator.return(); // not implemented (yet?)
              return { value: undefined, done: true };
            }
          }
        }
        return iterator;
      }
    }
    var homemade_iterator = iterable[Symbol.iterator]();
    expect_from_iterator(homemade_iterator, 'pippo', false, 5); // 0...4
    expect_from_iterator(homemade_iterator, undefined, true); // 5
  });
  describe('an infinite iterator', function() {
    it('will never get exhausted', function() {
      var infinite = naturalNumbers();
      for (var i = 0; i <= 10000000; i++) infinite.next();
      expect(infinite.next().value).to.be.equal(10000001);
    });
//    it.skip('can be used to instantiate variables (not on Chrome!!)', function() {
    it('can be used to instantiate variables (not on Chrome!!)', function() {
      // var [a,b,c] unsupported on Chrome!!!
      //var [a,b,c] = naturalNumbers(); // extracting next.value
      expect(a).to.be.eql(0);
      expect(b).to.be.eql(1);
      expect(c).to.be.eql(2);
      expect(naturalNumbers().next().value).to.be.equal(0);
      //var [d,e] = naturalNumbers();
      expect(d).to.be.eql(0);
      expect(e).to.be.eql(1);
    });
    it('can be tempered by take', function() {
      var taker = take(2, naturalNumbers());
      expect_from_iterator(taker, 0, false);
      expect_from_iterator(taker, 1, false);
      expect_from_iterator(taker, undefined, true);
    });
  });
});

describe('around iterators one can', function() {
  describe('build a take function', function() {
    it('that extracts a subset', function() {
      var arr = ['a','b','c','d','e','f'];
      var taker = take(3, arr);
      expect_from_iterator(taker, 'a', false);
      expect_from_iterator(taker, 'b', false);
      expect_from_iterator(taker, 'c', false);
      expect_from_iterator(taker, undefined, true);
      expect_from_iterator(taker, undefined, true);
    });
    it('that doesn\'t crash when it overflows', function() {
      var arr = ['a','b','c'];
      var taker = take(5, arr);
      expect_from_iterator(taker, 'a', false);
      expect_from_iterator(taker, 'b', false);
      expect_from_iterator(taker, 'c', false);
      expect_from_iterator(taker, undefined, true);
      expect_from_iterator(taker, undefined, true);
      expect_from_iterator(taker, undefined, true);
    });
  });
  describe('build a zip function', function() {
    it('that zips together n iterables', function() {
      var arrs = [['a','b','c'],[1,2,3],[null,true,false]];
      var zipper = zip(arrs);
      expect_from_iterator(zipper, ['a',1,null], false);
      expect_from_iterator(zipper, ['b',2,true], false);
      expect_from_iterator(zipper, ['c',3,false], false);
      expect_from_iterator(zipper, undefined, true);
      expect_from_iterator(zipper, undefined, true);
    });
    it('that respects the shortest iterator', function() {
      var arrs = [['a','b','c'],[1,2],[null]];
      var zipper = zip(arrs);
      expect_from_iterator(zipper, ['a',1,null], false);
      expect_from_iterator(zipper, undefined, true);
      expect_from_iterator(zipper, undefined, true);
    });
    it('that allows mixing different sorts of iterables', function() {
      var iterable = {
        [Symbol.iterator]() {
          var c = -1;
          return { next() { c++; return ( c < 25) ? { value: c } : { done: true } } }
        }
      }
      var iterables = [['a','b','c'],iterable,'pippo'];
      var zipper = zip(iterables);
      expect_from_iterator(zipper, ['a',0,'p'], false);
      expect_from_iterator(zipper, ['b',1,'i'], false);
      expect_from_iterator(zipper, ['c',2,'p'], false);
      expect_from_iterator(zipper, undefined, true);
      expect_from_iterator(zipper, undefined, true);
    });
  });
});
