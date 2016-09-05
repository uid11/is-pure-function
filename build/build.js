var isPureFunction =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = isPureFunction;
	
	var cache = {},
	  toString = isPureFunction.toString,
	  Function = isPureFunction.constructor,
	  reFunction = /^\s*function\b/,
	  reGenerator = /^\s*(function)?\s*\*/,
	  reBoundWords = /\bthis\b|\barguments\b/,
	  reStringsOrComments =
	    /"[^"]*"|'[^']*'|`[^`]*`|\/\/.*\s|\/\*.*\*\//g;
	
	/**
	 * Return true, if call fn.apply(thisArg, args)
	 * in global scope does not throw exception.
	 * 
	 * @param {function} fn
	 * @param {*} thisArg
	 * @param {Array} args
	 * @return {boolean}
	 */
	function isPureFunction(fn, thisArg, args) {
	  var code, pureFn;
	
	  if (args.length !==  fn.length) return false;
	  if (typeof fn   !== 'function') return false;
	
	  try { code = toString.call(fn); }
	  catch (e) { return false; }
	
	  pureFn = cache[code];
	  if (!pureFn) {
	    /* Maybe fn already cached as not a pure. */
	    if (pureFn === null) return false;
	    try {
	
	      if (reFunction.test(code)) {
	        /* Generators could not be pure. */
	        if (reGenerator.test(code)) return false;
	      } else {
	        /* Arrow function could not contain bound words. */
	        if (reBoundWords.test(
	              code.replace(reStringsOrComments, '')
	          )) return false;
	      }
	
	      pureFn = Function (
	        '"use strict";return(' + code + ')'
	      )();
	
	    } catch (e) { return false; }
	    finally {
	      cache[code] = pureFn || null;
	    }
	  }
	
	  try { pureFn.apply(thisArg, args); }
	  catch (e) { return false; }
	
	  return true;
	}
	
	/**
	 * Сlear cache and delete links to all functions.
	 * @memberof isPureFunction
	 */
	isPureFunction.clearCache = function clearCache() {
	  for (var key in cache) cache[key] = undefined;
	};

/***/ }
/******/ ]);
//# sourceMappingURL=build.js.map