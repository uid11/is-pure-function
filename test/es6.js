'use strict'; describe('isPureFunction in ES6', function() {


var iPF = isPureFunction;

var noop = () => {};

var f1 = (a) => {};

var f2 = (a, b) => {};

var arrThis = () => this;
var arrArguments = () => arguments;

var arrThisProp = () => this[0];
var arrArgumentsProp = () => arguments[0];

var arrThisProp1 = () => {var this1};
var arrArgumentsProp2 = () => {var arguments2};

it('should throws without arguments', function() {
  var thr = 0;

  try { iPF(); } catch (e) { ++thr; }
  try { iPF(noop); } catch (e) { ++thr; }
  try { iPF(noop, 0); } catch (e) { ++thr; }
  try { iPF(noop, 0, null); } catch (e) { ++thr; }

  assert(thr === 4);
});

it('should be falsy with extra arguments', function() {
  assert(!iPF(noop, 1, [2]) && !iPF(f1, 1, [2, 3]));
});

it('should be true with noop', function() {
  assert(iPF(noop, 1, []) && iPF(f1, 1, [2]) && iPF(f2, 1, [2, 3]));
});

it('should return only boolean', function() {
  assert(iPF(noop, 1, []) === true && iPF(f1, 1, [2, 3]) === false);
});

it('should be ok with falsy thisArg', function() {
  assert(iPF(noop, null, []) && iPF(f1, void null, [2]));
});

it('should be false for bound functions', function() {
  assert(iPF(noop, 0, []) && !iPF(noop.bind(0), 0, []));
});

it('should be falsy when arrow include "this" or "arguments"', function() {
  assert((!iPF(arrThis, 1, []) && !iPF(arrArguments, 1, [])));
});

it('should be falsy when arrow include "this[]" or "arguments[]"', function() {
  assert((!iPF(arrThisProp, 1, []) && !iPF(arrArgumentsProp, 1, [])));
});

it('should be ok when arrow include "this1" or "arguments2"', function() {
  assert((iPF(arrThisProp1, 1, []) && iPF(arrArgumentsProp2, 1, [])));
});

it('should use args for throw or normal return', function() {
  var f = (p, q) => {p.b.c + q.a.c};
  assert(!iPF(f, 1, [{b: 1}, 1]) && !iPF(f, 1, [1, {a: 1}]) &&
    iPF(f, 1, [{b: 1}, {a: 1}]));
});

it('should be ok with helpers from global scope', function() {
  var f = (a, b) => {Number(a + b)};
  assert(iPF(f, 1, [2, 3]));
});

it('should be ok when toString() method redefined', function() {
  var f = (a, b) => {a + b};
  f.toString = null;
  assert(iPF(f, 1, [2, 3]));
});

it('should be false when function use closure', function() {
  var f = function () {
    var fromClosure = 1;
    return (a, b) => fromClosure;
  }();
  f();
  assert(!iPF(f, 1, [2, 3]));
});

it('should allow arrow function with this/arguments in strings/comments',
  function() {
    var f = () => { 'this', "arguments", `this` // arguments
          /* this */};
    assert(iPF(f, 0, []));
  }
);

it('marks generators us impure', function() {
  function* f1(){}
  function * f2 () {}
  function*f3 (){}
  function*f4(){}
  var ob = {
      *f5 (){},
      * f6 () {}
    },
    fns = [f1, f2, f3, f4, ob.f5, ob.f6];

  assert(fns.reduce(
      (res, fn) => res && !iPF(fn, 0, []),
    true));
});

it('should use cache', function() {
  function f(){}
  var toString = Function.prototype.toString;
  Function.prototype.toString = function toString() {
    if (String.called) throw Error('Second call');
    String.called = true;
    return 'function f(){}';
  };
  try {
    assert(iPF(f, 0, []) && iPF(f, 0, []));
  } finally {
    Function.prototype.toString = toString;
    delete String.called;
  }
});

});