/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = _interopRequireDefault(__webpack_require__(1));

var _graphqlServerExpress = __webpack_require__(2);

var _bodyParser = _interopRequireDefault(__webpack_require__(3));

var _cors = _interopRequireDefault(__webpack_require__(4));

var _schema = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = 4000;
var server = (0, _express.default)();
server.use((0, _cors.default)());
server.use('/graphql', _bodyParser.default.json(), (0, _graphqlServerExpress.graphqlExpress)({
  schema: _schema.schema
}));
server.use('/graphiql', (0, _graphqlServerExpress.graphiqlExpress)({
  endpointURL: '/graphql'
}));
server.listen(PORT, function () {
  return console.log("GraphQL Server is now running on http://localhost:".concat(PORT));
});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("graphql-server-express");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = void 0;

var _graphqlTools = __webpack_require__(6);

var _resolvers = __webpack_require__(7);

var typeDefs = "\ntype Item {\n  id: ID!\n  url: String\n  link: String\n}\n\ntype Query {\n  allItems: [Item]\n}\n";
var schema = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs: typeDefs,
  resolvers: _resolvers.resolvers
});
exports.schema = schema;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("graphql-tools");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = void 0;
var items = [{
  id: 1,
  url: 'http://bbc.com',
  link: 'The BBC'
}, {
  id: 2,
  url: 'https://noway.com',
  link: 'No Way'
}];
var resolvers = {
  Query: {
    allItems: function allItems() {
      return items;
    }
  }
};
exports.resolvers = resolvers;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map