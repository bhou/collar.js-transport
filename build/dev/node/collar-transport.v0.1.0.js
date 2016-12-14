/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Transport = __webpack_require__(1);
	var LocalTransport = __webpack_require__(2);

	module.exports = {
	  Transport: Transport,
	  LocalTransport: LocalTransport
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Transport delegator used for 3rd party provider to provide different transport
	 */
	var Transport = function () {
	  function Transport() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    _classCallCheck(this, Transport);

	    this.options = options;
	    this._cache = new Map();
	    this._cacheSize = options.cacheSize || 20;
	    this._cacheTimeout = options.cacheTimeout || 5000; // default timeout 5 s
	  }

	  //-----------------------------------
	  // To be inherited from subclass
	  //-----------------------------------
	  /**
	   * Used to check if two transports is identical
	   * Note: it is possible two transport instance returns the same id, 
	   * the idea here is to link such transport together
	   * @return the unique identifier for this transport
	   */


	  _createClass(Transport, [{
	    key: "getId",
	    value: function getId() {
	      return null;
	    }

	    /**
	     * for sending outgoing message (request)
	     * @signal  Signal, the signal to be sent
	     * @done    Function, fn(error, result), the result of the request
	     */

	  }, {
	    key: "handleOutgoingSignal",
	    value: function handleOutgoingSignal(signal, done) {}

	    /**
	     * for handlingincoming message, convert the transport message to signal
	     * @send  Function, fn(ctx, signal), send the signal to downstream
	     *
	     * the ctx object in send function is an object, you can put any data in it,
	     * and it will be retrieved and passed to response handler
	     * see @handleResponseSignal
	     */

	  }, {
	    key: "listen",
	    value: function listen(send) {}

	    /**
	     * for sending response message
	     * @ctx  Object, the context object, it contains at least two properties:
	     *  - timestamp: when the request is received
	     *  - signal: the request signal
	     * @signal  Signal, the response signal
	     * @done    Function: fn(error, result), call this when response is done/has error
	     */

	  }, {
	    key: "handleResponseSignal",
	    value: function handleResponseSignal(ctx, signal, done) {}

	    //------------------------------------
	    // getter / setter
	    //------------------------------------

	  }, {
	    key: "getContext",
	    value: function getContext(signal) {
	      if (!signal || !signal.id) return null;
	      return this._cache.get(signal.id);
	    }

	    //------------------------------------
	    // private methods
	    //------------------------------------

	  }, {
	    key: "saveContext",
	    value: function saveContext(context, signal) {
	      this.cleanupSignalCache();

	      var ctx = context;
	      if (!ctx) ctx = {};
	      ctx.signal = signal;
	      ctx.timestamp = new Date().getTime();

	      this._cache.set(signal.id, ctx);
	    }
	  }, {
	    key: "cleanupSignalCache",
	    value: function cleanupSignalCache() {
	      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	      if (this._cache.size > this._cacheSize || force) {
	        var now = new Date().getTime();
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	          for (var _iterator = this._cache.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var id = _step.value;

	            if (this._cache.get(id).timestamp + this._cacheTimeout < now) {
	              this._cache.delete(id);
	            }
	          }
	        } catch (err) {
	          _didIteratorError = true;
	          _iteratorError = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }
	          } finally {
	            if (_didIteratorError) {
	              throw _iteratorError;
	            }
	          }
	        }
	      }
	    }
	  }, {
	    key: "cacheSize",
	    get: function get() {
	      return this._cacheSize;
	    },
	    set: function set(size) {
	      this._cacheSize = size;
	    }
	  }, {
	    key: "cacheTimeout",
	    get: function get() {
	      return this._cacheTimeout;
	    },
	    set: function set(timeout) {
	      this._cacheTimeout = timeout;
	    }
	  }]);

	  return Transport;
	}();

	module.exports = Transport;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Transport = __webpack_require__(1);
	var EventEmitter = __webpack_require__(3);

	var LocalTransport = function (_Transport) {
	  _inherits(LocalTransport, _Transport);

	  function LocalTransport(name, options) {
	    _classCallCheck(this, LocalTransport);

	    var _this = _possibleConstructorReturn(this, (LocalTransport.__proto__ || Object.getPrototypeOf(LocalTransport)).call(this, options));

	    _this.name = name;
	    return _this;
	  }

	  _createClass(LocalTransport, [{
	    key: 'getId',
	    value: function getId() {
	      return this.name;
	    }
	  }, {
	    key: 'handleOutgoingSignal',
	    value: function handleOutgoingSignal(signal, done) {
	      LocalTransport.ee.emit('signal-' + this.name, signal, done);
	    }
	  }, {
	    key: 'listen',
	    value: function listen(send) {
	      LocalTransport.ee.on('signal-' + this.name, function (signal, done) {
	        var ctx = {
	          respond: done
	        };
	        send(ctx, signal);
	      });
	    }
	  }, {
	    key: 'handleResponseSignal',
	    value: function handleResponseSignal(ctx, signal, done) {
	      if (!ctx) {
	        return; // do nothing
	      }
	      var respond = ctx.respond;
	      if (!respond) {
	        return done(new Error('Can not find the request object for signal: ' + signal.id));
	      }

	      try {
	        if (signal.error) {
	          respond(signal.error);
	        } else {
	          respond(null, signal.payload);
	        }
	      } catch (e) {
	        return done(e);
	      }

	      done();
	    }
	  }]);

	  return LocalTransport;
	}(Transport);

	LocalTransport.ee = new EventEmitter();

	module.exports = LocalTransport;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("eventemitter3");

/***/ }
/******/ ]);