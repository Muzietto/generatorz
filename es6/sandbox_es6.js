/*
	GENERATORZ - ECMAScript 6 generators
	Author: Marco Faustinelli (contacts@faustinelli.net)
	Web: http://faustinelli.net/
	     http://faustinelli.wordpress.com/
	Version: 0.1

	The GNU GPL/2 License - Copyright (c) 2015 Generatorz Project
*/

function *createIteratorWithUserInteraction() {
  let first = yield 1; // no way to influence the value returned by the FIRST next
  let second = yield first + 2; // first is the value passed to the SECOND next
  yield second + 3; // second is the value passed to the THIRD next
}
let iterusinter = createIteratorWithUserInteraction();

function *createIteratorWithoutUserInteraction() {
  yield 1;
  yield 2;
  yield 3;
}
let iternouser = createIteratorWithoutUserInteraction();
let iternouservalues = [...iternouser]; // [1,2,3]

function *createIteratorWithReturn() {
  yield 1;
  return 'cippirimerlo';
  yield 2;
  yield 3;
}
let iteretu = createIteratorWithReturn();
let iteretuvalues = [...iteretu]; // [1]

function *createNumberIterator() {
  yield 1;
  yield 2;
}
function *createColorIterator() {
  yield 'red';
  yield 'green';
}
function *createCombinedIterator() {
  yield* createNumberIterator(); // yield 1; yield 2;
  yield* createColorIterator(); // yield 'red'; yield 'green';
  yield true;
}
var itecombi = createCombinedIterator();
var itecombivalues = [...itecombi] // [1,2,'red','green',true]

