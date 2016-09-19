# is-pure-function #

[![NPM version][npm-image]][npm-url] ![dependencies][dependencies-image] [![License MIT][license-image]](LICENSE)

[![NPM](https://nodei.co/npm/is-pure-function.png)](https://nodei.co/npm/is-pure-function/)

Simple and fast ES3-check that function is pure.
```js
/** 
 * @param {function} fn
 * @param {*} thisArg
 * @param {Array} args
 * @return {boolean}
 */
function isPureFunction(fn, thisArg, args) {/**...*/};
```
*fn* is pure, if not throw when called with *thisArg* as this and *args* as arguments in global scope.

Pure function cannot use closures, but can use exists global vars (Array, Object, setTimeout, etc.).
Pure function should not have side effects, and cannot throw exceptions.
Arrow function may be pure, but then it should not contain 'this' and 'arguments' words.
Generators could not be pure (always product new iterator).
Result of Function.prototype.bind() could not be pure (because we can not substitute the required value of this).

It is supposed to use in reactive libraries.

## Examples ##
```js
var isPureFunction = require('is-pure-function');

function f(a, b) {
  return a + b;
}
// true
isPureFunction(f, null, [1, 2]);


var g = function(a) {
  return function(b) {
    return a + b;
  }
}(1);
// false (use closure var)
isPureFunction(g, {}, [1, 2]);


function getIndex(str, char) {
  return str.indexOf(char);
}
// false (wrong type of arguments)
isPureFunction(getIndex, null, [1, 2]);
// true
isPureFunction(getIndex, null, ['str', 'c']);


var f1 = function(a) {return a;}
// false (extra arguments)
isPureFunction(f1, undefined, [1, 2]);
// false (not enough arguments)
isPureFunction(f1, undefined, []);
// true
isPureFunction(f1, undefined, [1]);
// throw ReferenceError, missing argument
isPureFunction(f1, undefined);
// false (not a function at all)
isPureFunction({}, undefined, []);


var getThisA = function() {
  return this.a;
}
// false (ReferenceError)
isPureFunction(getThisA, null, []);
// true (this -- context-argument of function)
isPureFunction(getThisA, {}, []);


function* generator() {
  return yield null;
}
// false
isPureFunction(generator, 0, []);


var arrow = (a, b) => a + b;
// true
isPureFunction(arrow, '', [1, 2]);


var arrowThis = () => this;
// false (this bound in arrow functions)
isPureFunction(arrowThis, 0, []);

// but
var arrowStr = () => 'this';
//true
isPureFunction(arrowStr, 0, []);


var arrowArgs = () => arguments;
// false (this bound in arrow functions)
isPureFunction(arrowArgs, null, []);

// but
var arrowComment = () => {
  // arguments
  return 3;
}
// true
isPureFunction(arrowComment, null, []);


var boundFn = function() {}.bind();
// false (can not substitute the required value of this)
isPureFunction(boundFn, 0, []);

// it is unlikely you will need
isPureFunction.clearCache();
```
Use pure functions for FRP (the best way is arrow functions, without this and arguments object, with a fixed number of arguments).

## Tests ##
Standalone pages test/es3.html && test/es6.html (via Mocha). Install webpack and opener, build scripts, than run tests:
```bash
$ npm install
$ npm run build
$ npm test
```

## License ##
[MIT](LICENSE)

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg "license-image"
[dependencies-image]: https://img.shields.io/gemnasium/mathiasbynens/he.svg?maxAge=2592000 "dependencies-image"
[npm-image]: https://img.shields.io/npm/v/is-pure-function.svg "npm-image"
[npm-url]: https://www.npmjs.com/package/is-pure-function "is-pure-function"