describe('isPureFunction in ES3', function() {


var iPF = isPureFunction;

function noop() {}

function f1 (a) {}

function f2 (a, b) {}

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

it('should be falsy when fn throw error', function() {
  function f(a) {b};
  assert(!iPF(f, 1, [1]));
});

it('should use this value', function() {
  function f() {return this.a.b};
  assert(!iPF(f, 1, []) && iPF(f, {a: {b: 1}}, []));
});

it('should use args for throw or normal return', function() {
  function f(p, q) {return p.b.c + q.a.c};
  assert(!iPF(f, 1, [{b: 1}, 1]) && !iPF(f, 1, [1, {a: 1}]) &&
    iPF(f, 1, [{b: 1}, {a: 1}]));
});

it('should be false for non-strict code', function() {
  function f(a, b) {with({}){};};
  assert(!iPF(f, 1, [2, 3]));
});

it('should be ok with helpers from global scope', function() {
  function f(a, b) {return Number(a + b)};
  assert(iPF(f, 1, [2, 3]));
});

it('should be ok when toString() method redefined', function() {
  function f(a, b) {return a + b};
  f.toString = null;
  assert(iPF(f, 1, [2, 3]));
});

it('should be clearCache() util', function() {
  assert(!iPF.clearCache() && iPF(noop, 1, []));
});

it('should be false when function use closure', function() {
  var f = function () {
    var fromClosure = 1;
    return function f(a, b) {
      return fromClosure;
    }
  }();
  f();
  assert(!iPF(f, 1, [2, 3]));
});


});