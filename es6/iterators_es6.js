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
    next() {
      if (count > 0) {
        count--;
        return iterator.next();
      } else {
        return { value : undefined, done : true };
        // close iterator
      }
    }
  }
}