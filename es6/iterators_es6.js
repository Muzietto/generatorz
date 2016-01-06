/*
	GENERATORZ - ECMAScript 6 generators
	Author: Marco Faustinelli (contacts@faustinelli.net)
	Web: http://faustinelli.net/
	     http://faustinelli.wordpress.com/
	Version: 0.1

	The GNU GPL/2 License - Copyright (c) 2015 Generatorz Project
*/

function take(n, iterable) {
  var count = n;
  var iterator = iterable[Symbol.iterator]();
  return {
    [Symbol.iterator]() { return this; }, // redundant
    next() {
      if (count > 0) {
        count--;
        return iterator.next();
      } else {
        //iterator.return(); // not implemented (yet?)
        return { value: undefined, done: true };
      }
    }
  }
}

function zip(iterables) {
  var iterators = iterables.map(function(it) { return it[Symbol.iterator](); });
  var running = true;  
  return {
    [Symbol.iterator]() { return this; },
    next() {
      var result = (running) 
        ? { value: [], done: false }
        : { value: undefined, done: true };

      /* if (running) {
       *   var items = iterators.map(iter => iter.next());
       *   running = items.some(item => item.done);
       *   if (running) return {value : items.map(item => item.value)}
       * }
       * return {done : true}
       */
      if (running) {
        iterators.forEach(function(it) {
          var next = it.next();
          if (running && !next.done) {
            result.value.push(next.value);
          } else {
            running = false;
            result.value = undefined;
            result.done = true;
          }
        });
      }
      return result;
    }
  };
}

function naturalNumbers() {
  var i = 0;
  return {
    [Symbol.iterator]() { return this; },
    next() { return { value: i++, done: false }; }
  };
}