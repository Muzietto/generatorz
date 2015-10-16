/*
	GENERATORZ - ECMAScript 6 generators
	Author: Marco Faustinelli (contacts@faustinelli.net)
	Web: http://faustinelli.net/
	     http://faustinelli.wordpress.com/

	The GNU GPL/2 License - Copyright (c) 2015 Generatorz Project
*/

var expect = chai.expect;
mocha.setup('bdd');

describe('a generator', function() {
  it('can be a data producer', function() {
    var counter = counterFactory();
    var producer = simpleDataProducer(counter);
    expect(producer.next()).to.be.eql({value:1,done:false});
    expect(producer.next()).to.be.eql({value:2,done:false});
    expect(producer.next()).to.be.eql({value:'fine',done:true});
    expect(counter.count()).to.be.equal(3);
  });
  it('can be a data consumer needing to be started', function() {
    var writer = writerFactory();
    var consumer = simpleDataConsumer(writer);
    consumer.next(); // start generator
    consumer.next(1);
    consumer.next(2);
    consumer.next(3);
    expect(writer.written()).to.be.eql([1,2,3])
  });
  it('can be a data consumer ready to collect', function() {
    var writer = writerFactory();
    var consumer = coroutine(simpleDataConsumer, [writer]);
    consumer.next(1);
    consumer.next(2);
    expect(writer.written()).to.be.eql([1,2])
  });
  it('can be a splitter/spitter for other generators', function(done) {
    var writer = writerFactory();
    var writerGenerator = coroutine(simpleDataConsumer, [writer]);
    var spitter = coroutine(splittingDataConsumerAndProducer, [writerGenerator]);
    spitter.next('abcde');
    spitter.return();
    setTimeout(function() {
      expect(writer.written()).to.be.eql(['a','b','c','d','e']);
      done();
    }, 50);
  });
  it('can be a data consumer and producer for other generators', function(done) {
    this.timeout(50000);
    var writer = writerFactory();
    var wordWriter = coroutine(simpleDataConsumer, [writer]);
    var charReader = coroutine(simpleDataConsumerAndProducer,[wordWriter,' ']);
    var iterator = 'nel mezzo del cammin di nostra vita mi ritrovai per una selva oscura che la diritta via era smarrita'[Symbol.iterator]();
    
    spitChar(continuation);
    
    function spitChar(callback) {
      setTimeout(function() {
        var data = iterator.next();
        console.log('source -> ' + data.value + '-' + data.done);
        if (!data.done) charReader.next(data.value);
        if (!data.done) spitChar(callback);
        else callback();
      }, Math.floor(Math.random() * 10));
    }

    function continuation() {
      charReader.return();
      expect(writer.written()).to.be.eql(['nel','mezzo','del','cammin','di','nostra','vita','mi','ritrovai','per','una','selva','oscura','che','la','diritta','via','era','smarrita']);
      done();
    }
  });
  // TODO - solve this by refactoring the previous one  
  it.skip('can be a whole chain of language interpreters', function(done) {
    this.timeout(50000);
    var writer = writerFactory();
    var wordWriter = coroutine(simpleDataConsumer, [writer]);
    var phraseReader = coroutine(simpleDataConsumerAndProducer,[wordWriter,' ']);
    var charReader = coroutine(simpleDataConsumerAndProducer,[phraseReader,'.']);
    var iterator = 'nel mezzo del cammin di nostra vita.mi ritrovai per una selva oscura.che la diritta via era smarrita'[Symbol.iterator]();

    spitChar(continuation);
    
    function spitChar(callback) {
      setTimeout(function() {
        var data = iterator.next();
        console.log('source -> ' + data.value + '-' + data.done);
        if (!data.done) charReader.next(data.value);
        if (!data.done) spitChar(callback);
        else callback();
      }, Math.floor(Math.random() * 10));
    }

    function continuation() {
      charReader.return();
      expect(writer.written()).to.be.eql([['nel','mezzo','del','cammin','di','nostra','vita'],['mi','ritrovai','per','una','selva','oscura'],['che','la','diritta','via','era','smarrita']]);
      done();
    }
  });
});

function counterFactory() {
  var _c = 0; 
  return { 
    incr() { _c++; }, 
    count() { c = _c; return c; }
  };
};

function writerFactory() {
  var _w = [];
  return { 
    write(msg) { _w.push(msg); },
    written() { return _w.map(x => x); }
  }
}
