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

describe('an array iterator', function() {
  it('consumes the whole array', function() {
    var arr = ['a','b','c'];
    var arr_iterator = arr[Symbol.iterator]();
    expect_from_iterator(arr_iterator, 'a', false);
    expect_from_iterator(arr_iterator, 'b', false);
    expect_from_iterator(arr_iterator, 'c', false);
    expect_from_iterator(arr_iterator, undefined, true);
  });
});
