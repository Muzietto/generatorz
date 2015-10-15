/*
	GENERATORZ - ECMAScript 6 generators
	Author: Marco Faustinelli (contacts@faustinelli.net)
	Web: http://faustinelli.net/
	     http://faustinelli.wordpress.com/
	Version: 0.1

	The GNU GPL/2 License - Copyright (c) 2015 Generatorz Project
*/

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