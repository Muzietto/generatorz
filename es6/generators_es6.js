/*
	GENERATORZ - ECMAScript 6 generators
	Author: Marco Faustinelli (contacts@faustinelli.net)
	Web: http://faustinelli.net/
	     http://faustinelli.wordpress.com/
	Version: 0.1

	The GNU GPL/2 License - Copyright (c) 2015 Generatorz Project
*/

var identity = x => x;

function coroutine(generatorFun, args) {
  var generator = generatorFun.apply(null, args);
  generator.next();
  return generator;
}

function* simpleDataProducer(counter) {
  counter.incr();
  yield counter.count();
  counter.incr();
  yield counter.count();
  counter.incr();
  return 'fine'; // done = true
}

function* simpleDataConsumer(writer) {
  // halts immediately in order to evaluate yield
  while (true) writer.write(yield);
}

// receives and collates chunks of any size. spits separator-separated words
function* simpleDataConsumerAndProducer(sink, separator) {
  try {
    while (true) {
      var acc = '';
      var token = '';
      do {
        acc += token;
        token = yield;
      } while (token !== separator);
      console.log('c&p -> ' + acc);
      sink.next(acc);
    }
  } finally {
    sink.next(acc);    
  }
  sink.return();
}

// receives and puts in list chunks of any size to a simpleDC
function* collatingDataConsumerAndProducer(sink) {
  var input;
  var acc = [];
  try {
    while (true) {
      do {
        var input = yield;
        if (typeof input !== 'undefined') acc.push(input);
      } while (typeof input !== 'undefined');
      sink.next(acc.map(identity));
      acc = [];
    }
  } finally {
    sink.return();
  }
}

// receives and spits chunks of any size to a simpleDC&P
function* splittingDataConsumerAndProducer(sink) {
  var input, iterator, data
  ;
  try {
    while (true) {
      input = yield;
      console.log('received -> ' + input);
      for (var charr of input) { // do it with yield*
        console.log('spit -> ' + charr);
        sink.next(charr);
      }
    }
  } finally {
    //sink.next(charr);    
  }
  sink.return();
}