(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
  return returnValue;
}

var tools = {

  getTime: function getTime()
  {
    return (!performance || !performance.now) ? +new Date : performance.now();
  }

};



var tools$2 = Object.freeze({
	default: tools
});

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var Tween = createCommonjsModule(function (module, exports) {
/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

var TWEEN = TWEEN || (function () {

	var _tweens = [];

	return {

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		add: function (tween) {

			_tweens.push(tween);

		},

		remove: function (tween) {

			var i = _tweens.indexOf(tween);

			if (i !== -1) {
				_tweens.splice(i, 1);
			}

		},

		update: function (time, preserve) {

			if (_tweens.length === 0) {
				return false;
			}

			var i = 0;

			time = time !== undefined ? time : TWEEN.now();

			while (i < _tweens.length) {

				if (_tweens[i].update(time) || preserve) {
					i++;
				} else {
					_tweens.splice(i, 1);
				}

			}

			return true;

		}
	};

})();


// Include a performance.now polyfill.
// In node.js, use process.hrtime.
if (typeof (window) === 'undefined' && typeof (process) !== 'undefined') {
	TWEEN.now = function () {
		var time = process.hrtime();

		// Convert [seconds, nanoseconds] to milliseconds.
		return time[0] * 1000 + time[1] / 1000000;
	};
}
// In a browser, use window.performance.now if it is available.
else if (typeof (window) !== 'undefined' &&
         window.performance !== undefined &&
		 window.performance.now !== undefined) {
	// This must be bound, because directly assigning this function
	// leads to an invocation exception in Chrome.
	TWEEN.now = window.performance.now.bind(window.performance);
}
// Use Date.now if it is available.
else if (Date.now !== undefined) {
	TWEEN.now = Date.now;
}
// Otherwise, use 'new Date().getTime()'.
else {
	TWEEN.now = function () {
		return new Date().getTime();
	};
}


TWEEN.Tween = function (object) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _repeatDelayTime;
	var _yoyo = false;
	var _isPlaying = false;
	var _reversed = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;
	var _onStopCallback = null;

	this.to = function (properties, duration) {

		_valuesEnd = properties;

		if (duration !== undefined) {
			_duration = duration;
		}

		return this;

	};

	this.start = function (time) {

		TWEEN.add(this);

		_isPlaying = true;

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : TWEEN.now();
		_startTime += _delayTime;

		for (var property in _valuesEnd) {

			// Check if an Array was provided as property value
			if (_valuesEnd[property] instanceof Array) {

				if (_valuesEnd[property].length === 0) {
					continue;
				}

				// Create a local copy of the Array with the start value at the front
				_valuesEnd[property] = [_object[property]].concat(_valuesEnd[property]);

			}

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (_object[property] === undefined) {
				continue;
			}

			// Save the starting value.
			_valuesStart[property] = _object[property];

			if ((_valuesStart[property] instanceof Array) === false) {
				_valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[property] = _valuesStart[property] || 0;

		}

		return this;

	};

	this.stop = function () {

		if (!_isPlaying) {
			return this;
		}

		TWEEN.remove(this);
		_isPlaying = false;

		if (_onStopCallback !== null) {
			_onStopCallback.call(_object, _object);
		}

		this.stopChainedTweens();
		return this;

	};

	this.end = function () {

		this.update(_startTime + _duration);
		return this;

	};

	this.stopChainedTweens = function () {

		for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
			_chainedTweens[i].stop();
		}

	};

	this.delay = function (amount) {

		_delayTime = amount;
		return this;

	};

	this.repeat = function (times) {

		_repeat = times;
		return this;

	};

	this.repeatDelay = function (amount) {

		_repeatDelayTime = amount;
		return this;

	};

	this.yoyo = function (yoyo) {

		_yoyo = yoyo;
		return this;

	};


	this.easing = function (easing) {

		_easingFunction = easing;
		return this;

	};

	this.interpolation = function (interpolation) {

		_interpolationFunction = interpolation;
		return this;

	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;

	};

	this.onStart = function (callback) {

		_onStartCallback = callback;
		return this;

	};

	this.onUpdate = function (callback) {

		_onUpdateCallback = callback;
		return this;

	};

	this.onComplete = function (callback) {

		_onCompleteCallback = callback;
		return this;

	};

	this.onStop = function (callback) {

		_onStopCallback = callback;
		return this;

	};

	this.update = function (time) {

		var property;
		var elapsed;
		var value;

		if (time < _startTime) {
			return true;
		}

		if (_onStartCallbackFired === false) {

			if (_onStartCallback !== null) {
				_onStartCallback.call(_object, _object);
			}

			_onStartCallbackFired = true;
		}

		elapsed = (time - _startTime) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		value = _easingFunction(elapsed);

		for (property in _valuesEnd) {

			// Don't update properties that do not exist in the source object
			if (_valuesStart[property] === undefined) {
				continue;
			}

			var start = _valuesStart[property] || 0;
			var end = _valuesEnd[property];

			if (end instanceof Array) {

				_object[property] = _interpolationFunction(end, value);

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if (typeof (end) === 'string') {

					if (end.charAt(0) === '+' || end.charAt(0) === '-') {
						end = start + parseFloat(end);
					} else {
						end = parseFloat(end);
					}
				}

				// Protect against non numeric properties.
				if (typeof (end) === 'number') {
					_object[property] = start + (end - start) * value;
				}

			}

		}

		if (_onUpdateCallback !== null) {
			_onUpdateCallback.call(_object, value);
		}

		if (elapsed === 1) {

			if (_repeat > 0) {

				if (isFinite(_repeat)) {
					_repeat--;
				}

				// Reassign starting values, restart by making startTime = now
				for (property in _valuesStartRepeat) {

					if (typeof (_valuesEnd[property]) === 'string') {
						_valuesStartRepeat[property] = _valuesStartRepeat[property] + parseFloat(_valuesEnd[property]);
					}

					if (_yoyo) {
						var tmp = _valuesStartRepeat[property];

						_valuesStartRepeat[property] = _valuesEnd[property];
						_valuesEnd[property] = tmp;
					}

					_valuesStart[property] = _valuesStartRepeat[property];

				}

				if (_yoyo) {
					_reversed = !_reversed;
				}

				if (_repeatDelayTime !== undefined) {
					_startTime = time + _repeatDelayTime;
				} else {
					_startTime = time + _delayTime;
				}

				return true;

			} else {

				if (_onCompleteCallback !== null) {

					_onCompleteCallback.call(_object, _object);
				}

				for (var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
					// Make the chained tweens start exactly at the time they should,
					// even if the `update()` method was called way past the duration of the tween
					_chainedTweens[i].start(_startTime + _duration);
				}

				return false;

			}

		}

		return true;

	};

};


TWEEN.Easing = {

	Linear: {

		None: function (k) {

			return k;

		}

	},

	Quadratic: {

		In: function (k) {

			return k * k;

		},

		Out: function (k) {

			return k * (2 - k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k;
			}

			return - 0.5 * (--k * (k - 2) - 1);

		}

	},

	Cubic: {

		In: function (k) {

			return k * k * k;

		},

		Out: function (k) {

			return --k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k + 2);

		}

	},

	Quartic: {

		In: function (k) {

			return k * k * k * k;

		},

		Out: function (k) {

			return 1 - (--k * k * k * k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k;
			}

			return - 0.5 * ((k -= 2) * k * k * k - 2);

		}

	},

	Quintic: {

		In: function (k) {

			return k * k * k * k * k;

		},

		Out: function (k) {

			return --k * k * k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k * k * k + 2);

		}

	},

	Sinusoidal: {

		In: function (k) {

			return 1 - Math.cos(k * Math.PI / 2);

		},

		Out: function (k) {

			return Math.sin(k * Math.PI / 2);

		},

		InOut: function (k) {

			return 0.5 * (1 - Math.cos(Math.PI * k));

		}

	},

	Exponential: {

		In: function (k) {

			return k === 0 ? 0 : Math.pow(1024, k - 1);

		},

		Out: function (k) {

			return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1);
			}

			return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

		}

	},

	Circular: {

		In: function (k) {

			return 1 - Math.sqrt(1 - k * k);

		},

		Out: function (k) {

			return Math.sqrt(1 - (--k * k));

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return - 0.5 * (Math.sqrt(1 - k * k) - 1);
			}

			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);

		},

		Out: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			k *= 2;

			if (k < 1) {
				return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
			}

			return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;

		}

	},

	Back: {

		In: function (k) {

			var s = 1.70158;

			return k * k * ((s + 1) * k - s);

		},

		Out: function (k) {

			var s = 1.70158;

			return --k * k * ((s + 1) * k + s) + 1;

		},

		InOut: function (k) {

			var s = 1.70158 * 1.525;

			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}

			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

		}

	},

	Bounce: {

		In: function (k) {

			return 1 - TWEEN.Easing.Bounce.Out(1 - k);

		},

		Out: function (k) {

			if (k < (1 / 2.75)) {
				return 7.5625 * k * k;
			} else if (k < (2 / 2.75)) {
				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
			} else if (k < (2.5 / 2.75)) {
				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
			} else {
				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
			}

		},

		InOut: function (k) {

			if (k < 0.5) {
				return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
			}

			return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.Linear;

		if (k < 0) {
			return fn(v[0], v[1], f);
		}

		if (k > 1) {
			return fn(v[m], v[m - 1], m - f);
		}

		return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);

	},

	Bezier: function (v, k) {

		var b = 0;
		var n = v.length - 1;
		var pw = Math.pow;
		var bn = TWEEN.Interpolation.Utils.Bernstein;

		for (var i = 0; i <= n; i++) {
			b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
		}

		return b;

	},

	CatmullRom: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.CatmullRom;

		if (v[0] === v[m]) {

			if (k < 0) {
				i = Math.floor(f = m * (1 + k));
			}

			return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

		} else {

			if (k < 0) {
				return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
			}

			if (k > 1) {
				return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
			}

			return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);

		}

	},

	Utils: {

		Linear: function (p0, p1, t) {

			return (p1 - p0) * t + p0;

		},

		Bernstein: function (n, i) {

			var fc = TWEEN.Interpolation.Utils.Factorial;

			return fc(n) / fc(i) / fc(n - i);

		},

		Factorial: (function () {

			var a = [1];

			return function (n) {

				var s = 1;

				if (a[n]) {
					return a[n];
				}

				for (var i = n; i > 1; i--) {
					s *= i;
				}

				a[n] = s;
				return s;

			};

		})(),

		CatmullRom: function (p0, p1, p2, p3, t) {

			var v0 = (p2 - p0) * 0.5;
			var v1 = (p3 - p1) * 0.5;
			var t2 = t * t;
			var t3 = t * t2;

			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

		}

	}

};

// UMD (Universal Module Definition)
(function (root) {

	if (typeof undefined === 'function' && undefined.amd) {

		// AMD
		undefined([], function () {
			return TWEEN;
		});

	} else if (typeof module !== 'undefined' && typeof exports === 'object') {

		// Node.js
		module.exports = TWEEN;

	} else if (root !== undefined) {

		// Global variable
		root.TWEEN = TWEEN;

	}

})(commonjsGlobal);
});

var require$$0 = ( tools$2 && tools$2['default'] ) || tools$2;

var tools$3 = require$$0;
var TWEEN = Tween;

var specProps = {'pos':'_position','scale':'_scale','opacity':'alphaFactor'};
var tweenAction = (function () {
  function TweenAction(){
    this.startTweenTime = 0;
    this.tweenStart = false;
    this._tweenList = [];
  }

  var prototypeAccessors = { TWEEN: {} };

  TweenAction.prototype.initTween = function initTween (){
    var this$1 = this;

    this.addUpdateTask(function (){
      if(this$1._tweenList.length)
        { TWEEN.update(); }
    });
  };

  TweenAction.prototype.tween = function tween (gameObj,props,duration,delay){
    if ( delay === void 0 ) delay = 0;

    var newProps = {};

    Object.keys(props).forEach(function (key){
      setProps(key, newProps, gameObj, true);
    });

    if(!this.startTweenTime)
      { this.startTweenTime = tools$3.getTime(); }

    var now = tools$3.getTime();

    var tween = new TWEEN.Tween(newProps).delay(delay);

    tween.to(props,duration).onUpdate(function(){
      var this$1 = this;

      if(this === gameObj)
        { return; }

      Object.keys(this).forEach(function (key){
        setProps(key, gameObj, this$1, false);
      });
    });


    this._tweenList.push(tween);

    return tween;

/**
 * [setProps description]
 * @param {[type]} key         要获取值的属性名
 * @param {[type]} newProps    被设置值的对象
 * @param {[type]} originProps 取值的对象
 * @param {[type]} inverse     是否深度取值，即从多层结构中取值
 */
    function setProps(key,newProps,originProps,inverse){
      var splitKey = key.split('.');
      var tempProp = specProps[splitKey[0]];
      if(tempProp){
        if(!inverse){
          if(splitKey.length > 1)
            { newProps[tempProp][splitKey[1]] = originProps[key]; }
          else
            { newProps[tempProp] = originProps[key]; }
        }
        else{
          if(splitKey.length > 1)
            { newProps[key] = originProps[tempProp][splitKey[1]]; }
          else
            { newProps[key] = originProps[tempProp]; }
        }
      }else{
        newProps[key] = originProps[key];
      }
    }
  };

  prototypeAccessors.TWEEN.get = function (){
    return TWEEN;
  };

  Object.defineProperties( TweenAction.prototype, prototypeAccessors );

  return TweenAction;
}());

var Render = function Render () {};

Render.renderView = function renderView (picasso){
  var ctx = picasso._ctx;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  // 必须放这里，不然页面会闪烁
  ctx.clearRect(0,0,picasso.width,picasso.height);

  // picasso.gameObjects.children(gameObj=>{
  // if(!gameObj.update)
  //   return;

  // gameObj.update(picasso.timestamp, picasso.passedTime);

  // if(gameObj.hasChild){
  //   gameObj.children((childObj)=>{
  //     childObj.update(picasso.timestamp, picasso.passedTime);
  //     _innerRender(childObj);
  //   });
  // }else{
  //   _innerRender(gameObj);
  // }
  // });

  renderSprite(picasso.gameObjects);

  function _innerRender(sprite) {
    var wt = sprite.worldTransform;

    ctx.setTransform(wt.a,wt.b,wt.c,wt.d,wt.tx,wt.ty);
    ctx.globalAlpha = sprite.worldAlpha;

    sprite.render();
  }

  function renderSprite (sprite) {
    if(!sprite.lived)
      { return; }
    sprite.update(picasso.timestamp, picasso.passedTime);
    if(sprite.hasChild){
      sprite.children(function (childObj){
        renderSprite(childObj);
      });
    }else{
      _innerRender(sprite);
    }
  }
};

var index = createCommonjsModule(function (module) {
'use strict';

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @api private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) { prefix = false; }
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {Mixed} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var this$1 = this;

  var names = []
    , events
    , name;

  if (this._eventsCount === 0) { return names; }

  for (name in (events = this$1._events)) {
    if (has.call(events, name)) { names.push(prefix ? name.slice(1) : name); }
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Boolean} exists Only check if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events[evt];

  if (exists) { return !!available; }
  if (!available) { return []; }
  if (available.fn) { return [available.fn]; }

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var arguments$1 = arguments;
  var this$1 = this;

  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) { return false; }

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) { this.removeListener(event, listeners.fn, undefined, true); }

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments$1[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) { this$1.removeListener(event, listeners[i].fn, undefined, true); }

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) { for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments$1[j];
          } }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) { this._events[evt] = listener, this._eventsCount++; }
  else if (!this._events[evt].fn) { this._events[evt].push(listener); }
  else { this._events[evt] = [this._events[evt], listener]; }

  return this;
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) { this._events[evt] = listener, this._eventsCount++; }
  else if (!this._events[evt].fn) { this._events[evt].push(listener); }
  else { this._events[evt] = [this._events[evt], listener]; }

  return this;
};

/**
 * Remove the listeners of a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {Mixed} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) { return this; }
  if (!fn) {
    if (--this._eventsCount === 0) { this._events = new Events(); }
    else { delete this._events[evt]; }
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
         listeners.fn === fn
      && (!once || listeners.once)
      && (!context || listeners.context === context)
    ) {
      if (--this._eventsCount === 0) { this._events = new Events(); }
      else { delete this._events[evt]; }
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
           listeners[i].fn !== fn
        || (once && !listeners[i].once)
        || (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) { this._events[evt] = events.length === 1 ? events[0] : events; }
    else if (--this._eventsCount === 0) { this._events = new Events(); }
    else { delete this._events[evt]; }
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {String|Symbol} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) {
      if (--this._eventsCount === 0) { this._events = new Events(); }
      else { delete this._events[evt]; }
    }
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) { descriptor.writable = true; } Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) { defineProperties(Constructor.prototype, protoProps); } if (staticProps) { defineProperties(Constructor, staticProps); } return Constructor; }; })();

/**
 * 
 * @param {*} cb if prop's first value is function,then cb must pass function or null
 * @param {*} scope callback execute with scope
 * @param {*} propList prop name
 */
function createObserve(cb,scope){
  var propList = [], len = arguments.length - 2;
  while ( len-- > 0 ) propList[ len ] = arguments[ len + 2 ];


  var mainArgsLen = arguments.length;

/**
 * arguments is same as above createObserve ,but is the value of prop name
 * if first arg is function ,then it must be callback
 * if second arg is object , then it must be scope
 */
  function ObserveObject(){
    var this$1 = this;
    var propValueList = [], len = arguments.length;
    while ( len-- ) propValueList[ len ] = arguments[ len ];

    var args = propValueList,
        objScope;

    if(mainArgsLen == arguments.length || typeof args[0] === 'function'){
      this.cb = args[0];
      if(typeof args[1] === 'object'){
        objScope = args[1];
        args = args.slice(2);
      }else
        { args = args.slice(1); }
    }
    
    args.forEach(function (arg, index){
      this$1[("_" + (propList[index]))] = arg;
    });

    this.cb = this.cb || cb || function(){};
    this.scope = objScope || scope || this;
  }

  propList.forEach(function (prop){
    _createClass(ObserveObject, [{
      key: prop,
      get: function get() {
        return this[("_" + prop)];
      },
      set: function set(val){
        var _prop = '_' + prop;

        if(this[_prop] === val)
          { return; }

        this[_prop] = val;

        this.cb.call(this.scope);
      }
    }]);
  });

  return ObserveObject;
}

var Point = createObserve(null,null,'x','y');

Point.prototype.set = function(x, y){
  var _x = x || 0;
  var _y = y || ((y !== 0) ? _x : 0);

  if(this._x !== _x || this._y !== _y){
    this._x = _x;
    this._y = _y;
    this.cb();
  }
};

var loader = function loader(cb){
  this.loadCount = 0;
  this.__loadedHash = {};
  this.completeCallback = cb;
};

loader.prototype.loadImg = function loadImg (key,url,format){
    var this$1 = this;

  var loadRet = this.__loadedHash[key];

  if(!!loadRet)
    { return; }

  this.loadCount++;

  var img = new Image;

  img.src = url;

  img.onload = function (evt) {
    this$1.__loadedHash[key]._loaded = 1;
    afterLoad.call(this$1);
    img.onload = null;
  };

  this.__loadedHash[key] = img;

  if(format)
    { this.__loadedHash[key].resformat = format; }

  function afterLoad(){
    this.loadCount--;
    if(!this.loadCount)
      { this.completeCallback && this.completeCallback(this.__loadedHash); }
  }
};

var TransformMatrix = function TransformMatrix(){
  this.a = 1;
  this.b = 0;
  this.c = 0;
  this.d = 1;
  this.tx = 0;
  this.ty = 0;
  this.array = null;

};

TransformMatrix.prototype.set = function set (a, b, c, d, tx, ty){
  this.a = a;
  this.b = b;
  this.c = c;
  this.d = d;
  this.tx = tx;
  this.ty = ty;

  return this;
};

//对象坐标转换到世界坐标
TransformMatrix.prototype.apply = function apply (pos, newPos){
  newPos = newPos || new Point();

  var x = pos.x;
  var y = pos.y;

  newPos.x = (this.a * x) + (this.c * y) + this.tx;
  newPos.y = (this.b * x) + (this.d * y) + this.ty;

  return newPos;
};

//从世界坐标转为对象坐标
TransformMatrix.prototype.applyInverse = function applyInverse (pos, newPos){
  newPos = newPos || new Point();

  var id = 1 / ((this.a * this.d) + (this.c * -this.b));

  var x = pos.x;
  var y = pos.y;

  newPos.x = (this.d * id * x) + (-this.c * id * y) + (((this.ty * this.c) - (this.tx * this.d)) * id);
  newPos.y = (this.a * id * y) + (-this.b * id * x) + (((-this.ty * this.a) + (this.tx * this.b)) * id);

  return newPos;
};
TransformMatrix.prototype.translate = function translate (x, y){
  this.tx += x;
  this.ty += y;

  return this;
};

TransformMatrix.prototype.scale = function scale (x, y){
  this.a *= x;
  this.d *= y;
  this.c *= x;
  this.b *= y;
  this.tx *= x;
  this.ty *= y;

  return this;
};


TransformMatrix.prototype.toArray = function toArray (transpose, out){
  if (!this.array){
      this.array = new Float32Array(9);
  }

  var array = out || this.array;

  array[0] = this.a;
  array[1] = this.c;
  array[2] = this.tx;
  array[3] = this.b;
  array[4] = this.d;
  array[5] = this.ty;
  array[6] = 0;
  array[7] = 0;
  array[8] = 1;

  return array;
};

TransformMatrix.staticMatrix = new TransformMatrix();

var gameId = 0;

var BaseDisplayObject = (function (EventEmitter) {
  function BaseDisplayObject(type,x,y,w,h){
    EventEmitter.call(this);

    this._id = ++gameId;

    this.localTransform = new TransformMatrix();
    this.worldTransform = new TransformMatrix();

    this.type = type;
    this.lived = true;
    this._dirty = true;
    this.parentGroup = null;
    this._position = new Point(this.changeCallback,this,x || 0,y || 0);
    this._anchor = new Point(this.changeCallback,this,0,0);
    this._scale = new Point(this.changeCallback,this,1,1);
    this._skew = new Point(this.changeCallback,this,0,0);
    this.pivot = new Point(this.changeCallback,this,0, 0);
    this._alphaFactor = 1;
    this.worldAlpha = 1;
    this._rotation = 0;
    this._cx = 1; // cos rotation + skewY;
    this._sx = 0; // sin rotation + skewY;
    this._cy = 0; // cos rotation + Math.PI/2 - skewX;
    this._sy = 1; // sin rotation + Math.PI/2 - skewX;
  }

  if ( EventEmitter ) BaseDisplayObject.__proto__ = EventEmitter;
  BaseDisplayObject.prototype = Object.create( EventEmitter && EventEmitter.prototype );
  BaseDisplayObject.prototype.constructor = BaseDisplayObject;

  var prototypeAccessors = { alphaFactor: {},x: {},y: {},dirty: {} };

  BaseDisplayObject.prototype.anchor = function anchor (x,y){
    this._anchor.set(x,y);

    return this;
  };
  /**
   * 旋转或倾斜时调用
   *
   */
  BaseDisplayObject.prototype.updateSkew = function updateSkew (){
    var deg = Math.PI/ 180 * this._rotation;
    this._cx = Math.cos(deg + this._skew.y);
    this._sx = Math.sin(deg + this._skew.y);
    this._cy = -Math.sin(deg - this._skew.x); // cos, added PI/2
    this._sy = Math.cos(deg - this._skew.x); // sin, added PI/2
  };

  BaseDisplayObject.prototype.rotate = function rotate (deg){
    if(!arguments.length)
      { return this._rotation; }

    this._rotation = deg;
    this.updateSkew();

    return this;
  };

  BaseDisplayObject.prototype.scale = function scale (x,y){
    if(!arguments.length)
      { return this._scale; }

    this._scale.set(x,y);
    return this;
  };

  BaseDisplayObject.prototype.opacity = function opacity (factor){
    this.alphaFactor = factor;
    return this;
  };

  BaseDisplayObject.prototype.position = function position (x,y){
    this._position.set(x,y);

    return this;
  };

  prototypeAccessors.alphaFactor.set = function (value){
    this._alphaFactor = value;
    this.changeCallback();
  };

  prototypeAccessors.alphaFactor.get = function (){
    return this._alphaFactor;
  };

  prototypeAccessors.x.set = function (value){
    this._position.x = value;
  };

  prototypeAccessors.x.get = function (){
    return this._position.x;
  };

  prototypeAccessors.y.set = function (value){
    this._position.y = value;
  };

  prototypeAccessors.y.get = function (){
    return this._position.y;
  };

  BaseDisplayObject.prototype.update = function update (){
    if(!this._dirty)
      { return; }
    var parentTransform = TransformMatrix.staticMatrix;
    this.worldAlpha = this._alphaFactor;
    if(this.parentGroup){
      parentTransform = this.parentGroup.worldTransform;
      this.worldAlpha *= this.parentGroup._alphaFactor;
    }

    this.updateTransform(parentTransform);

    this._dirty = false;
  };
  BaseDisplayObject.prototype.updateTransform = function updateTransform (parentTransform){
    var lt = this.localTransform;

    lt.a = this._cx * this._scale.x;
    lt.b = this._sx * this._scale.x;
    lt.c = this._cy * this._scale.y;
    lt.d = this._sy * this._scale.y;

    lt.tx = this._position.x - ((this.pivot.x * lt.a) + (this.pivot.y * lt.c));
    lt.ty = this._position.y - ((this.pivot.x * lt.b) + (this.pivot.y * lt.d));

    var pt = parentTransform;
    var wt = this.worldTransform;

    if(!pt)
      { return; }

    wt.a = (lt.a * pt.a) + (lt.b * pt.c);
    wt.b = (lt.a * pt.b) + (lt.b * pt.d);
    wt.c = (lt.c * pt.a) + (lt.d * pt.c);
    wt.d = (lt.c * pt.b) + (lt.d * pt.d);
    wt.tx = (lt.tx * pt.a) + (lt.ty * pt.c) + pt.tx;
    wt.ty = (lt.tx * pt.b) + (lt.ty * pt.d) + pt.ty;
  };

  BaseDisplayObject.prototype.contains = function contains (point){
    var tempPoint = this.worldTransform.applyInverse(point);

    var ref = this;
    var w = ref.w;
    var h = ref.h;

    var x1 = -w * this._anchor.x;

    var y1 = 0;

    if (tempPoint.x > x1 && tempPoint.x < x1 + w)
    {
        y1 = -h * this._anchor.y;

        if (tempPoint.y > y1 && tempPoint.y < y1 + h)
        {
            return true;
        }
    }

    {
      console.log('checking gameObject ',this.key,' ',this.type,point,' world point to obj point ',tempPoint);
    }
    return false;
  };

  BaseDisplayObject.prototype.destroy = function destroy (){
    {
      console.log(((this.type) + ":" + (this.key) + " is destroyed"));
    }
  };

  BaseDisplayObject.prototype.changeCallback = function changeCallback (){
    this.dirty = true;
  };

  prototypeAccessors.dirty.set = function (val){
    if(this._dirty)
      { return; }

    this._dirty = true;
    if(this.parentGroup){
      this.parentGroup.dirty = true;
    }
    if(this.hasChild){
      this.loopChild(function (child){
        child._dirty = true;
      },null);
    }

  };

  BaseDisplayObject.prototype.toString = function toString (){
    return ((this.type) + ":" + (this.key) + " in (" + (this._position.x) + ", " + (this._position.y) + ") has width:" + (this.w) + " and height " + (this.h));
  };

  Object.defineProperties( BaseDisplayObject.prototype, prototypeAccessors );

  return BaseDisplayObject;
}(index));

var Sprite = (function (BaseDisplayObject$$1) {
  function Sprite(game,type,key,x,y,w,h){
    if ( x === void 0 ) x=0;
    if ( y === void 0 ) y=0;

    BaseDisplayObject$$1.call(this, type,x,y,w,h);
    this.key = key;
    key = key.split(':');

    var resource = game._resources[key[0]],
        resFormat = resource.resformat || {},
        targetFrame;

    if(key.length > 1 && resFormat[key[1]]){
      resFormat = resFormat[key[1]];
    }

    var sx = resFormat.x; if ( sx === void 0 ) sx = 0;
    var sy = resFormat.y; if ( sy === void 0 ) sy = 0;
    var sw = resFormat.w;
    var sh = resFormat.h;

    this.game = game;
    this.frame = resource;
    this.sw = sw || this.frame.width,
    this.sh = sh || this.frame.height;
    this.sx = Math.abs(sx);
    this.sy = Math.abs(sy);
    this.w = this.sw;
    this.h = this.sh;
    this.alphaFactor = 1;
  }

  if ( BaseDisplayObject$$1 ) Sprite.__proto__ = BaseDisplayObject$$1;
  Sprite.prototype = Object.create( BaseDisplayObject$$1 && BaseDisplayObject$$1.prototype );
  Sprite.prototype.constructor = Sprite;

  Sprite.prototype.render = function render (){
    var ctx = this.game._ctx;
    var ref = this._position;
    var x = ref.x;
    var y = ref.y;


    var dx = (0.5 - this._anchor.x) * this.w;
    var dy = (0.5 - this._anchor.y) * this.h;

    dx -= this.w / 2;
    dy -= this.h / 2;

    this.game._ctx.drawImage(this.frame,this.sx,this.sy,this.sw,this.sh,dx,dy,this.w,this.h );
  };

  Sprite.prototype.destroy = function destroy () {
    this.frame = null;
    this.game = null;
    BaseDisplayObject$$1.prototype.destroy.call(this);
  };

  return Sprite;
}(BaseDisplayObject));

var Group = (function (BaseDisplayObject$$1) {
  function Group(game,x,y){
    if ( x === void 0 ) x=0;
    if ( y === void 0 ) y=0;

    BaseDisplayObject$$1.call(this, 'group',x,y);
    this.game = game;
    this._queue = [];
    this.hasChild = true;
  }

  if ( BaseDisplayObject$$1 ) Group.__proto__ = BaseDisplayObject$$1;
  Group.prototype = Object.create( BaseDisplayObject$$1 && BaseDisplayObject$$1.prototype );
  Group.prototype.constructor = Group;

  var prototypeAccessors = { childCount: {} };

  Group.prototype.add = function add (gameObj, x, y){
    var key = gameObj;

    if(typeof gameObj == 'string'){
      gameObj = new Sprite(this.game,'img',key,x,y);
    }
    gameObj.parentGroup = this;
    this._queue.push(gameObj);

    return gameObj;
  };
  /**
   * @param  {[type]}   reverse [whether traverse from queue tail to head]
   */
  Group.prototype.children = function children (cb,reverse){

    if(reverse)
      { this._queue.reverse(); }

    if(typeof cb != 'undefined'){
        this._queue.every(function (num,idx){

          var ret = cb(num,idx);

          if(ret == null)
            { return true; }

          return ret;
        });
    }

    if(reverse)
      { this._queue.reverse(); }

    return this._queue;
  };

  Group.prototype.loopChild = function loopChild (cb,parent) {
    var this$1 = this;

    var container = parent || this;
    if (container.hasChild) {
      container.children(function (childObj){
        this$1.loopChild(cb,childObj);
      });
    }

    if(container !== this){
      cb(container);
    }

  };

  Group.prototype.remove = function remove (sprite) {
    this._queue = this._queue.filter(function (obj){
      return obj !== sprite;
    });
    sprite.destroy();
  };

  Group.prototype.destroy = function destroy () {
    this._queue = null;
    this.game = null;
    BaseDisplayObject$$1.prototype.destroy.call(this);
  };
  prototypeAccessors.childCount.get = function (){
    return this._queue.length;
  };

  Object.defineProperties( Group.prototype, prototypeAccessors );

  return Group;
}(BaseDisplayObject));

var SpriteSheet = (function (Sprite$$1) {
  function SpriteSheet(game,key,x,y,w,h,options){
    if ( x === void 0 ) x=0;
    if ( y === void 0 ) y=0;
    if ( options === void 0 ) options={};

    Sprite$$1.call(this, game,'spritesheet',key,x,y,w,h);

    this.prefix = options.prefix;
    this.firstIndex = options.firstIndex;
    this.lastIndex = options.lastIndex;
    this.spf = 1000 / options.fps;
    this._frameIndex = this.firstIndex;
    this.loop = true;
    this.lastTime = -Infinity;
    var resource = game._resources[key];

    if(!resource && '_DEV_' !== 'production'){
      console.error(key + ' 没有对应的资溝图片');
      return;
    }

    this.resFormat = resource.resformat || {};
    this.options = options;
  }

  if ( Sprite$$1 ) SpriteSheet.__proto__ = Sprite$$1;
  SpriteSheet.prototype = Object.create( Sprite$$1 && Sprite$$1.prototype );
  SpriteSheet.prototype.constructor = SpriteSheet;

  SpriteSheet.prototype.update = function update (timestamp,passedTime){

    var frameIdx = this._frameIndex;

    if(timestamp - this.lastTime >= this.spf){
      this.lastTime = timestamp;
      if(++this._frameIndex > this.lastIndex){
        if(this.options.animateEnd && this.options.animateEnd(this) || !this.loop){
          this._frameIndex --;
          return;
        }
        this._frameIndex = this.firstIndex;
      }
    }

    Sprite$$1.prototype.update.call(this);

    var ref = this.resFormat[this.prefix + frameIdx];
    var sx = ref.x; if ( sx === void 0 ) sx = 0;
    var sy = ref.y; if ( sy === void 0 ) sy = 0;
    var sw = ref.w;
    var sh = ref.h;

    this.w = this.sw = sw,
    this.h = this.sh = sh;
    this.sx = Math.abs(sx);
    this.sy = Math.abs(sy);
  };
/**
 * [play description]
 * @param  {[string]}    type      add:将id加进当剝播放庝列中 replace:使用传进的ID替杢当剝所有庝列
 * @param  {...[type]} frameIdxs  若是覝加进当剝庝列，则id值必须在当剝的庝列值上递增
 * @return {[type]}    当剝对象
 */
  SpriteSheet.prototype.play = function play (type) {
    var frameIdxs = [], len = arguments.length - 1;
    while ( len-- > 0 ) frameIdxs[ len ] = arguments[ len + 1 ];


    frameIdxs.sort(function (pre,after){
      return pre < after;
    });

    this.lastIndex = frameIdxs[0];

    if (type == 'replace') {
      this.firstIndex = frameIdxs[frameIdxs.length-1];
      this._frameIndex = this.firstIndex;
    }
    this.loop = false;
    return this;
  };

  return SpriteSheet;
}(Sprite));

var VirtualDisplay = (function (BaseDisplayObject$$1) {
  function VirtualDisplay(game,key,x,y,w,h){
    BaseDisplayObject$$1.call(this, 'virtualDisplay',x,y);
    this.w = w;
    this.h = h;
    this.game = game;
    this.key = key;
  }

  if ( BaseDisplayObject$$1 ) VirtualDisplay.__proto__ = BaseDisplayObject$$1;
  VirtualDisplay.prototype = Object.create( BaseDisplayObject$$1 && BaseDisplayObject$$1.prototype );
  VirtualDisplay.prototype.constructor = VirtualDisplay;

  VirtualDisplay.prototype.render = function render (){
    //空函数
  };

  return VirtualDisplay;
}(BaseDisplayObject));

var noop = function(){};

var DeafultSettings = {
  container: '.canvas-container',
  preload: noop,
  create: noop,
  update: noop,
  destroy: noop
};

var Picasso = (function (TweenAction) {
  function Picasso(options){
    TweenAction.call(this);
    var settings = Object.assign({},DeafultSettings,options);
    this.options = settings;

    this.width = options.width;
    this.height = options.height;

    this.loader = new loader(this.create.bind(this));
    this.gameObjects = new Group(this,0,0);
    this.updateTask = [];

    this.initTween();
    this.createCavas(settings);
    this.preUpdate(settings);
  }

  if ( TweenAction ) Picasso.__proto__ = TweenAction;
  Picasso.prototype = Object.create( TweenAction && TweenAction.prototype );
  Picasso.prototype.constructor = Picasso;

  var prototypeAccessors = { clientWidth: {},clientHeight: {} };

  Picasso.prototype.createCavas = function createCavas (options){
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    var worldWidth = this.clientWidth;

    if(options.initClzz)
      { canvas.classList.add(options.initClzz); }

    canvas.width = this.width;
    canvas.height = this.height;

    ctx.imageSmoothingEnabled = true;
    this._scaleRes = worldWidth / this.width;

    this._ctx = ctx;
    this.viewElement = canvas;

    canvas.style.width = worldWidth + 'px';
    canvas.style.height = this.height * this._scaleRes + 'px';

    // this.eventManager = new EventManager(this); TODO:test

    document.querySelector(options.container).appendChild(canvas);
  };

  Picasso.prototype.preUpdate = function preUpdate (options){
    options.preload.call(this);
  };

  Picasso.prototype.create = function create (datas){
    this._resources = this._resources || datas;
    this.options.create.call(this,this._resources);

    this.mainLoop();
  };

  Picasso.prototype.destroy = function destroy () {
    this.gameObjects.loopChild(function (child){
      child.destroy();
    });
    this.gameObjects = new Group(this,0,0);

    this.options.destroy.call(this,this._resources);
  };

  Picasso.prototype.restart = function restart () {
    this.destroy();
    this.create();
  };

  Picasso.prototype.clear = function clear () {
    this.isDestroy = true;
    this.destroy();
    document.querySelector(this.options.container).removeChild(this.viewElement);
    this.viewElement =null;
  };

  Picasso.prototype.draw = function draw (type,data,x,y,w,h,options){
    var drawObj;
    switch(type){
      case 'img':
        drawObj = new Sprite(this,'img',data,x,y,w,h);
        break;
      case 'spritesheet':
        drawObj = new SpriteSheet(this,data,x,y,w,h,options);
        break;
      case 'graphics':
        drawObj = new Graphics(this,data,x);
        break;
      case 'virtual':
        //now the data is x
        drawObj = new VirtualDisplay(this,data,x,y,w,h);
        break;
    }
    {
      console.debug('create gameObject ' + drawObj);
    }
    this.addSprite(drawObj);
    return drawObj;
  };

  Picasso.prototype.group = function group (x,y){
    var newGroups = new Group(this,x,y);

    this.addSprite(newGroups);

    return newGroups;
  };

  Picasso.prototype.addSprite = function addSprite (gameObj){
    this.gameObjects.add(gameObj);
  };

  Picasso.prototype.remove = function remove (sprite) {
    this.gameObjects.remove(sprite);
  };

  prototypeAccessors.clientWidth.get = function (){
    return Math.max(window.innerWidth, document.documentElement.clientWidth);
  };

  prototypeAccessors.clientHeight.get = function (){
    return Math.max(window.innerHeight, document.documentElement.clientHeight);
  };

  Picasso.prototype.addUpdateTask = function addUpdateTask (task){
    this.updateTask.push(task);
  };

  Picasso.prototype.mainLoop = function mainLoop (){
    var this$1 = this;

    var count=10;

    var beginTime = tools.getTime();

    var _innerLoog = function (){

      requestAnimationFrame(function (timestamp){

        if(this$1.isDestroy)
          { return; }

        if(!this$1.passedTime)
          { this$1.passedTime = tools.getTime() - beginTime; }

        this$1.timestamp = timestamp;

        this$1.options.update.call(this$1,timestamp, this$1.passedTime);

        this$1.updateTask.forEach(function (task){
          task.call(this$1,timestamp, this$1.passedTime);
        });

        Render.renderView(this$1);

        _innerLoog();
      });
    };

    _innerLoog();
  };

  Object.defineProperties( Picasso.prototype, prototypeAccessors );

  return Picasso;
}(tweenAction));

var wordsprite={sound:{x:-706,y:-507,w:64,h:78},thoughts:{x:0,y:0,w:996,h:504},word:{x:0,y:-507,w:703,h:411}};

var wrs={wr_1:{x:0,y:0,w:240,h:330},wr_2:{x:-243,y:0,w:240,h:330},wr_3:{x:-486,y:0,w:240,h:330},wr_4:{x:0,y:-333,w:240,h:330},wr_5:{x:-243,y:-333,w:240,h:330},wr_6:{x:-486,y:-333,w:240,h:330},wr_7:{x:-729,y:0,w:240,h:330},wr_8:{x:-729,y:-333,w:240,h:330}};

var wus={wu_1:{x:-243,y:0,w:240,h:330},wu_10:{x:-729,y:-333,w:240,h:330},wu_11:{x:-486,y:0,w:240,h:330},wu_12:{x:0,y:-333,w:240,h:330},wu_13:{x:-243,y:-333,w:240,h:330},wu_14:{x:-486,y:-333,w:240,h:330},wu_15:{x:-729,y:0,w:240,h:330},wu_2:{x:0,y:0,w:240,h:330},wu_3:{x:-972,y:0,w:240,h:330},wu_4:{x:-972,y:-333,w:240,h:330},wu_5:{x:0,y:-666,w:240,h:330},wu_6:{x:-243,y:-666,w:240,h:330},wu_7:{x:-486,y:-666,w:240,h:330},wu_8:{x:-729,y:-666,w:240,h:330},wu_9:{x:-972,y:-666,w:240,h:330}};

var firstLvGame = {
  isStart: false,
  playCount:0,
  start: function start(App){
    var self = this;
    
    this.isStart = true;
    this.game = new Picasso({
      width: 1920,
      height:1080,
      preload: function preload(){
        this.loader.loadImg('bg','./imgs/bg.png');
        this.loader.loadImg('luren','./imgs/luren.png');
        this.loader.loadImg('maskMeizu','./imgs/mask.png');
        this.loader.loadImg('arrow','./imgs/arrow.png');
        this.loader.loadImg('wordSprite','./imgs/wordsprite.png',wordsprite);
        this.loader.loadImg('xiao7','./imgs/xiao7.png');
        this.loader.loadImg('workRight','./imgs/wrs.png',wrs);
        this.loader.loadImg('workUp','./imgs/wus.png',wus);
      },
      create: function create(datas){
        var this$1 = this;

        this.draw('img','bg',0,0);

    //左边队列
        var lurenGroup = this.group(1100,420);

        for(var i =0;i< 5;i++){
          lurenGroup.add('luren',-i*80,i*40);
        }

    //右边队列
        var lurenGroup2 = this.group(1250,540);

        for(var i =0;i< 4;i++){
          lurenGroup2.add('luren',-i*80,i*40);
        }

        this.lurenGroup = lurenGroup;
        this.lurenGroup2 = lurenGroup2;

    //左中右可点击箭头
        var arrowLeft = this.draw('img','arrow',700,900);
        var arrowRight = this.draw('img','arrow',920,950);

        arrowLeft.lived = false;
        arrowRight.lived = false;

        this.draw('img','maskMeizu',1158,0);

        var xiao7 = this.draw('img','xiao7',412,666);

        var shopSound = this.group(1514,559).scale(0.5).opacity(0);

        shopSound.add('wordSprite:word',0,0).anchor(0.6,1);

        var soundShape = shopSound.add('wordSprite:sound', -250,-250);

        var xiao7Thoughts = this.draw('img','wordSprite:thoughts',450,750).anchor(0.4,1);

        xiao7Thoughts.scale(0.5).opacity(0);

        var brocastDuration = self.playCount ? 2000 : 2500;

        var shopBrocastTween = this.tween(shopSound,{'scale.x':1,'scale.y':1,opacity:1},500).easing(this.TWEEN.Easing.Cubic.InOut).delay(1000)
                          .repeat(1).repeatDelay(brocastDuration).yoyo(true);

        var xiao7ThougtTween = this.tween(xiao7Thoughts,{'scale.x':1,'scale.y':1,opacity:1},500).easing(this.TWEEN.Easing.Cubic.InOut).delay(1000)
                .repeat(1).repeatDelay(brocastDuration).yoyo(true)
                .onComplete(function (){
                  arrowLeft.lived = true;
                  arrowRight.lived = true;
                  netBar.interactive = true;
                  lurenGroup.interactive = true;
                  lurenGroup2.interactive = true;
                  this$1.tween(arrowRight,{'pos.x':950,'pos.y':930},500).repeat(Infinity).repeatDelay(100).yoyo(true).start();
                  this$1.tween(arrowLeft,{'pos.x':730,'pos.y':880},500).repeat(Infinity).repeatDelay(100).yoyo(true).start();
                });

        this.tween(soundShape,{opacity:0},50).delay(1500).repeat(10).repeatDelay(500).yoyo(true).start();

        shopBrocastTween.chain(xiao7ThougtTween).start();

        arrowLeft.interactive = true;

        [lurenGroup,arrowLeft].forEach(function (item){
          item.once('tap',function (evt){
            this$1.remove(arrowRight);
            this$1.remove(arrowLeft);
            lurenGroup2.interactive = false;
            var walkRightsheet = this$1.draw('spritesheet','workRight',412,620,null,null,{
                prefix: 'wr_',
                firstIndex: 1,
                lastIndex: 6,
                fps: 8
              });

            this$1.tween(walkRightsheet,{'pos.x':646,'pos.y': 606},1000).onComplete(function (){

              walkRightsheet.play('replace',7,8);

              setTimeout(function (){
                firstLevel.people2Walk(this$1,this$1.lurenGroup2,function (){
                  App.doFail();
                });

              },500);

            }).start();
            this$1.remove(xiao7);
          });
        });

        arrowRight.interactive = true;

        [lurenGroup2,arrowRight].forEach(function (item){
          item.once('tap',function (evt){
            this$1.remove(arrowRight);
            this$1.remove(arrowLeft);
            lurenGroup.interactive = false;
            var walkRightsheet = this$1.draw('spritesheet','workRight',412,620,null,null,{
                prefix: 'wr_',
                firstIndex: 1,
                lastIndex: 6,
                fps: 8
              });

            this$1.tween(walkRightsheet,{'pos.x':900,'pos.y': 666},2000).onComplete(function (){
              walkRightsheet.play('replace',7,8);

              setTimeout(function (){

                firstLevel.peopleWalk(this$1,this$1.lurenGroup,function (){
                  App.doFail();
                });
              },500);

            }).start();

            this$1.remove(xiao7);
          });
        });

        var netBar = this.draw('virtual','netbar',385,0,316,335);

        netBar.once('tap',function (evt){
          this$1.remove(arrowRight);
          this$1.remove(arrowLeft);

          var walkUpsheet = this$1.draw('spritesheet','workUp',412,620,null,null,{
              prefix: 'wu_',
              firstIndex: 1,
              lastIndex: 14,
              fps: 16,
              animateEnd: function (sprite){
                sprite.firstIndex = 3;
              }
            });

          this$1.tween(walkUpsheet,{'pos.x':420,'pos.y': 166},2000).onComplete(function (){
            walkUpsheet.play('replace',14);
            App.doSuccess(evt);
          }).start();

          this$1.remove(xiao7);
        });

      },
      update: function update(timestamp, passedtime){

      },
      destroy: function destroy(){

      }
    });
    {
      window.gameWorld = this.game;
    }
  },
  restart: function restart(){
    this.playCount = 1;
    this.game.restart();
  },
  clear: function clear(){
    this.game.clear();
  }
};


var firstLevel = {
  peopleWalk: function peopleWalk(picasso,group, cb){
    var baseX = 2000,
        baseY = -750,
        passPeopleCount = 12,
        perPeoTime = 1000 / passPeopleCount,
        hasCompleteCount = group.childCount;

    group.children(function (sprite,num){

      picasso.tween(sprite,{
          'pos.x': (num + passPeopleCount) * 30,
          'pos.y': -(num + passPeopleCount) * 30
        },1000 + num*perPeoTime,100 * num).onComplete(function (){
          if(--hasCompleteCount <= 0)
            { cb && cb(); }
        }).start();
    });
  },
  people2Walk: function people2Walk(picasso,group, cb){
    var passPeopleCount = 8,
        perPeoTime = 1000 / passPeopleCount,
        hasCompleteCount = group.childCount;

    group.children(function (sprite,num){

      picasso.tween(sprite,{
            'pos.x': (num + passPeopleCount) * 110,
            'pos.y': -(num + passPeopleCount) * 40
          },2000 + num*perPeoTime,100 * num).onComplete(function (){
              if(--hasCompleteCount <= 0)
                { cb && cb(); }
            }).start();
    });
  },
  xiao7Wolk: function xiao7Wolk(picasso,sprite){
    picasso.tween(sprite,{'pos.x': 900,rotate:45},1000).start();
  }
};

firstLvGame.start({
  doFail: function doFail(){
    console.log('fail');
    //3秒后重来
    setTimeout(function (){
      firstLvGame.restart();
    },3000);
  },
  doSuccess: function doSuccess(){
    console.log('success');
  }
});

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy90b29scy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9Ud2Vlbi5qcy9zcmMvVHdlZW4uanMiLCIuLi8uLi8uLi9zcmMvYW5pbWF0ZS90d2VlbkFjdGlvbi5qcyIsIi4uLy4uLy4uL3NyYy9SZW5kZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZXZlbnRlbWl0dGVyMy9pbmRleC5qcyIsIi4uLy4uLy4uL3NyYy91dGlscy9PYnNlcnZlT2JqZWN0LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWxzL1BvaW50LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWxzL2xvYWRlci5qcyIsIi4uLy4uLy4uL3NyYy91dGlscy9UcmFuc2Zvcm1NYXRyaXguanMiLCIuLi8uLi8uLi9zcmMvZGlzcGxheS9iYXNlRGlzcGxheU9iamVjdC5qcyIsIi4uLy4uLy4uL3NyYy9kaXNwbGF5L1Nwcml0ZS5qcyIsIi4uLy4uLy4uL3NyYy9kaXNwbGF5L2dyb3VwLmpzIiwiLi4vLi4vLi4vc3JjL2Rpc3BsYXkvc3ByaXRlU2hlZXQuanMiLCIuLi8uLi8uLi9zcmMvZGlzcGxheS92aXJ0dWFsRGlzcGxheS5qcyIsIi4uLy4uLy4uL3NyYy9waWNhc3NvLmpzIiwiLi4vZGF0YS93b3Jkc3ByaXRlLmpzIiwiLi4vZGF0YS93cnMuanMiLCIuLi9kYXRhL3d1cy5qcyIsIi4uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxyXG5sZXQgdG9vbHMgPSB7XHJcblxyXG4gIGdldFRpbWUoKVxyXG4gIHtcclxuICAgIHJldHVybiAoIXBlcmZvcm1hbmNlIHx8ICFwZXJmb3JtYW5jZS5ub3cpID8gK25ldyBEYXRlIDogcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgfVxyXG5cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHRvb2xzOyIsIi8qKlxuICogVHdlZW4uanMgLSBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2VlbmpzL3R3ZWVuLmpzXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90d2VlbmpzL3R3ZWVuLmpzL2dyYXBocy9jb250cmlidXRvcnMgZm9yIHRoZSBmdWxsIGxpc3Qgb2YgY29udHJpYnV0b3JzLlxuICogVGhhbmsgeW91IGFsbCwgeW91J3JlIGF3ZXNvbWUhXG4gKi9cblxudmFyIFRXRUVOID0gVFdFRU4gfHwgKGZ1bmN0aW9uICgpIHtcblxuXHR2YXIgX3R3ZWVucyA9IFtdO1xuXG5cdHJldHVybiB7XG5cblx0XHRnZXRBbGw6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0cmV0dXJuIF90d2VlbnM7XG5cblx0XHR9LFxuXG5cdFx0cmVtb3ZlQWxsOiBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdF90d2VlbnMgPSBbXTtcblxuXHRcdH0sXG5cblx0XHRhZGQ6IGZ1bmN0aW9uICh0d2Vlbikge1xuXG5cdFx0XHRfdHdlZW5zLnB1c2godHdlZW4pO1xuXG5cdFx0fSxcblxuXHRcdHJlbW92ZTogZnVuY3Rpb24gKHR3ZWVuKSB7XG5cblx0XHRcdHZhciBpID0gX3R3ZWVucy5pbmRleE9mKHR3ZWVuKTtcblxuXHRcdFx0aWYgKGkgIT09IC0xKSB7XG5cdFx0XHRcdF90d2VlbnMuc3BsaWNlKGksIDEpO1xuXHRcdFx0fVxuXG5cdFx0fSxcblxuXHRcdHVwZGF0ZTogZnVuY3Rpb24gKHRpbWUsIHByZXNlcnZlKSB7XG5cblx0XHRcdGlmIChfdHdlZW5zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBpID0gMDtcblxuXHRcdFx0dGltZSA9IHRpbWUgIT09IHVuZGVmaW5lZCA/IHRpbWUgOiBUV0VFTi5ub3coKTtcblxuXHRcdFx0d2hpbGUgKGkgPCBfdHdlZW5zLmxlbmd0aCkge1xuXG5cdFx0XHRcdGlmIChfdHdlZW5zW2ldLnVwZGF0ZSh0aW1lKSB8fCBwcmVzZXJ2ZSkge1xuXHRcdFx0XHRcdGkrKztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRfdHdlZW5zLnNwbGljZShpLCAxKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0fVxuXHR9O1xuXG59KSgpO1xuXG5cbi8vIEluY2x1ZGUgYSBwZXJmb3JtYW5jZS5ub3cgcG9seWZpbGwuXG4vLyBJbiBub2RlLmpzLCB1c2UgcHJvY2Vzcy5ocnRpbWUuXG5pZiAodHlwZW9mICh3aW5kb3cpID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgKHByb2Nlc3MpICE9PSAndW5kZWZpbmVkJykge1xuXHRUV0VFTi5ub3cgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHRpbWUgPSBwcm9jZXNzLmhydGltZSgpO1xuXG5cdFx0Ly8gQ29udmVydCBbc2Vjb25kcywgbmFub3NlY29uZHNdIHRvIG1pbGxpc2Vjb25kcy5cblx0XHRyZXR1cm4gdGltZVswXSAqIDEwMDAgKyB0aW1lWzFdIC8gMTAwMDAwMDtcblx0fTtcbn1cbi8vIEluIGEgYnJvd3NlciwgdXNlIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgaWYgaXQgaXMgYXZhaWxhYmxlLlxuZWxzZSBpZiAodHlwZW9mICh3aW5kb3cpICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgd2luZG93LnBlcmZvcm1hbmNlICE9PSB1bmRlZmluZWQgJiZcblx0XHQgd2luZG93LnBlcmZvcm1hbmNlLm5vdyAhPT0gdW5kZWZpbmVkKSB7XG5cdC8vIFRoaXMgbXVzdCBiZSBib3VuZCwgYmVjYXVzZSBkaXJlY3RseSBhc3NpZ25pbmcgdGhpcyBmdW5jdGlvblxuXHQvLyBsZWFkcyB0byBhbiBpbnZvY2F0aW9uIGV4Y2VwdGlvbiBpbiBDaHJvbWUuXG5cdFRXRUVOLm5vdyA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cuYmluZCh3aW5kb3cucGVyZm9ybWFuY2UpO1xufVxuLy8gVXNlIERhdGUubm93IGlmIGl0IGlzIGF2YWlsYWJsZS5cbmVsc2UgaWYgKERhdGUubm93ICE9PSB1bmRlZmluZWQpIHtcblx0VFdFRU4ubm93ID0gRGF0ZS5ub3c7XG59XG4vLyBPdGhlcndpc2UsIHVzZSAnbmV3IERhdGUoKS5nZXRUaW1lKCknLlxuZWxzZSB7XG5cdFRXRUVOLm5vdyA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdH07XG59XG5cblxuVFdFRU4uVHdlZW4gPSBmdW5jdGlvbiAob2JqZWN0KSB7XG5cblx0dmFyIF9vYmplY3QgPSBvYmplY3Q7XG5cdHZhciBfdmFsdWVzU3RhcnQgPSB7fTtcblx0dmFyIF92YWx1ZXNFbmQgPSB7fTtcblx0dmFyIF92YWx1ZXNTdGFydFJlcGVhdCA9IHt9O1xuXHR2YXIgX2R1cmF0aW9uID0gMTAwMDtcblx0dmFyIF9yZXBlYXQgPSAwO1xuXHR2YXIgX3JlcGVhdERlbGF5VGltZTtcblx0dmFyIF95b3lvID0gZmFsc2U7XG5cdHZhciBfaXNQbGF5aW5nID0gZmFsc2U7XG5cdHZhciBfcmV2ZXJzZWQgPSBmYWxzZTtcblx0dmFyIF9kZWxheVRpbWUgPSAwO1xuXHR2YXIgX3N0YXJ0VGltZSA9IG51bGw7XG5cdHZhciBfZWFzaW5nRnVuY3Rpb24gPSBUV0VFTi5FYXNpbmcuTGluZWFyLk5vbmU7XG5cdHZhciBfaW50ZXJwb2xhdGlvbkZ1bmN0aW9uID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5MaW5lYXI7XG5cdHZhciBfY2hhaW5lZFR3ZWVucyA9IFtdO1xuXHR2YXIgX29uU3RhcnRDYWxsYmFjayA9IG51bGw7XG5cdHZhciBfb25TdGFydENhbGxiYWNrRmlyZWQgPSBmYWxzZTtcblx0dmFyIF9vblVwZGF0ZUNhbGxiYWNrID0gbnVsbDtcblx0dmFyIF9vbkNvbXBsZXRlQ2FsbGJhY2sgPSBudWxsO1xuXHR2YXIgX29uU3RvcENhbGxiYWNrID0gbnVsbDtcblxuXHR0aGlzLnRvID0gZnVuY3Rpb24gKHByb3BlcnRpZXMsIGR1cmF0aW9uKSB7XG5cblx0XHRfdmFsdWVzRW5kID0gcHJvcGVydGllcztcblxuXHRcdGlmIChkdXJhdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRfZHVyYXRpb24gPSBkdXJhdGlvbjtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuc3RhcnQgPSBmdW5jdGlvbiAodGltZSkge1xuXG5cdFx0VFdFRU4uYWRkKHRoaXMpO1xuXG5cdFx0X2lzUGxheWluZyA9IHRydWU7XG5cblx0XHRfb25TdGFydENhbGxiYWNrRmlyZWQgPSBmYWxzZTtcblxuXHRcdF9zdGFydFRpbWUgPSB0aW1lICE9PSB1bmRlZmluZWQgPyB0aW1lIDogVFdFRU4ubm93KCk7XG5cdFx0X3N0YXJ0VGltZSArPSBfZGVsYXlUaW1lO1xuXG5cdFx0Zm9yICh2YXIgcHJvcGVydHkgaW4gX3ZhbHVlc0VuZCkge1xuXG5cdFx0XHQvLyBDaGVjayBpZiBhbiBBcnJheSB3YXMgcHJvdmlkZWQgYXMgcHJvcGVydHkgdmFsdWVcblx0XHRcdGlmIChfdmFsdWVzRW5kW3Byb3BlcnR5XSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cblx0XHRcdFx0aWYgKF92YWx1ZXNFbmRbcHJvcGVydHldLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQ3JlYXRlIGEgbG9jYWwgY29weSBvZiB0aGUgQXJyYXkgd2l0aCB0aGUgc3RhcnQgdmFsdWUgYXQgdGhlIGZyb250XG5cdFx0XHRcdF92YWx1ZXNFbmRbcHJvcGVydHldID0gW19vYmplY3RbcHJvcGVydHldXS5jb25jYXQoX3ZhbHVlc0VuZFtwcm9wZXJ0eV0pO1xuXG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIGB0bygpYCBzcGVjaWZpZXMgYSBwcm9wZXJ0eSB0aGF0IGRvZXNuJ3QgZXhpc3QgaW4gdGhlIHNvdXJjZSBvYmplY3QsXG5cdFx0XHQvLyB3ZSBzaG91bGQgbm90IHNldCB0aGF0IHByb3BlcnR5IGluIHRoZSBvYmplY3Rcblx0XHRcdGlmIChfb2JqZWN0W3Byb3BlcnR5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTYXZlIHRoZSBzdGFydGluZyB2YWx1ZS5cblx0XHRcdF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gPSBfb2JqZWN0W3Byb3BlcnR5XTtcblxuXHRcdFx0aWYgKChfdmFsdWVzU3RhcnRbcHJvcGVydHldIGluc3RhbmNlb2YgQXJyYXkpID09PSBmYWxzZSkge1xuXHRcdFx0XHRfdmFsdWVzU3RhcnRbcHJvcGVydHldICo9IDEuMDsgLy8gRW5zdXJlcyB3ZSdyZSB1c2luZyBudW1iZXJzLCBub3Qgc3RyaW5nc1xuXHRcdFx0fVxuXG5cdFx0XHRfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldID0gX3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSB8fCAwO1xuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRpZiAoIV9pc1BsYXlpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdFRXRUVOLnJlbW92ZSh0aGlzKTtcblx0XHRfaXNQbGF5aW5nID0gZmFsc2U7XG5cblx0XHRpZiAoX29uU3RvcENhbGxiYWNrICE9PSBudWxsKSB7XG5cdFx0XHRfb25TdG9wQ2FsbGJhY2suY2FsbChfb2JqZWN0LCBfb2JqZWN0KTtcblx0XHR9XG5cblx0XHR0aGlzLnN0b3BDaGFpbmVkVHdlZW5zKCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLmVuZCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHRoaXMudXBkYXRlKF9zdGFydFRpbWUgKyBfZHVyYXRpb24pO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5zdG9wQ2hhaW5lZFR3ZWVucyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGZvciAodmFyIGkgPSAwLCBudW1DaGFpbmVkVHdlZW5zID0gX2NoYWluZWRUd2VlbnMubGVuZ3RoOyBpIDwgbnVtQ2hhaW5lZFR3ZWVuczsgaSsrKSB7XG5cdFx0XHRfY2hhaW5lZFR3ZWVuc1tpXS5zdG9wKCk7XG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5kZWxheSA9IGZ1bmN0aW9uIChhbW91bnQpIHtcblxuXHRcdF9kZWxheVRpbWUgPSBhbW91bnQ7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnJlcGVhdCA9IGZ1bmN0aW9uICh0aW1lcykge1xuXG5cdFx0X3JlcGVhdCA9IHRpbWVzO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5yZXBlYXREZWxheSA9IGZ1bmN0aW9uIChhbW91bnQpIHtcblxuXHRcdF9yZXBlYXREZWxheVRpbWUgPSBhbW91bnQ7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnlveW8gPSBmdW5jdGlvbiAoeW95bykge1xuXG5cdFx0X3lveW8gPSB5b3lvO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblxuXHR0aGlzLmVhc2luZyA9IGZ1bmN0aW9uIChlYXNpbmcpIHtcblxuXHRcdF9lYXNpbmdGdW5jdGlvbiA9IGVhc2luZztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuaW50ZXJwb2xhdGlvbiA9IGZ1bmN0aW9uIChpbnRlcnBvbGF0aW9uKSB7XG5cblx0XHRfaW50ZXJwb2xhdGlvbkZ1bmN0aW9uID0gaW50ZXJwb2xhdGlvbjtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuY2hhaW4gPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRfY2hhaW5lZFR3ZWVucyA9IGFyZ3VtZW50cztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMub25TdGFydCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXG5cdFx0X29uU3RhcnRDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vblVwZGF0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXG5cdFx0X29uVXBkYXRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMub25Db21wbGV0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXG5cdFx0X29uQ29tcGxldGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vblN0b3AgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblxuXHRcdF9vblN0b3BDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbiAodGltZSkge1xuXG5cdFx0dmFyIHByb3BlcnR5O1xuXHRcdHZhciBlbGFwc2VkO1xuXHRcdHZhciB2YWx1ZTtcblxuXHRcdGlmICh0aW1lIDwgX3N0YXJ0VGltZSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKF9vblN0YXJ0Q2FsbGJhY2tGaXJlZCA9PT0gZmFsc2UpIHtcblxuXHRcdFx0aWYgKF9vblN0YXJ0Q2FsbGJhY2sgIT09IG51bGwpIHtcblx0XHRcdFx0X29uU3RhcnRDYWxsYmFjay5jYWxsKF9vYmplY3QsIF9vYmplY3QpO1xuXHRcdFx0fVxuXG5cdFx0XHRfb25TdGFydENhbGxiYWNrRmlyZWQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGVsYXBzZWQgPSAodGltZSAtIF9zdGFydFRpbWUpIC8gX2R1cmF0aW9uO1xuXHRcdGVsYXBzZWQgPSBlbGFwc2VkID4gMSA/IDEgOiBlbGFwc2VkO1xuXG5cdFx0dmFsdWUgPSBfZWFzaW5nRnVuY3Rpb24oZWxhcHNlZCk7XG5cblx0XHRmb3IgKHByb3BlcnR5IGluIF92YWx1ZXNFbmQpIHtcblxuXHRcdFx0Ly8gRG9uJ3QgdXBkYXRlIHByb3BlcnRpZXMgdGhhdCBkbyBub3QgZXhpc3QgaW4gdGhlIHNvdXJjZSBvYmplY3Rcblx0XHRcdGlmIChfdmFsdWVzU3RhcnRbcHJvcGVydHldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBzdGFydCA9IF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gfHwgMDtcblx0XHRcdHZhciBlbmQgPSBfdmFsdWVzRW5kW3Byb3BlcnR5XTtcblxuXHRcdFx0aWYgKGVuZCBpbnN0YW5jZW9mIEFycmF5KSB7XG5cblx0XHRcdFx0X29iamVjdFtwcm9wZXJ0eV0gPSBfaW50ZXJwb2xhdGlvbkZ1bmN0aW9uKGVuZCwgdmFsdWUpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIFBhcnNlcyByZWxhdGl2ZSBlbmQgdmFsdWVzIHdpdGggc3RhcnQgYXMgYmFzZSAoZS5nLjogKzEwLCAtMylcblx0XHRcdFx0aWYgKHR5cGVvZiAoZW5kKSA9PT0gJ3N0cmluZycpIHtcblxuXHRcdFx0XHRcdGlmIChlbmQuY2hhckF0KDApID09PSAnKycgfHwgZW5kLmNoYXJBdCgwKSA9PT0gJy0nKSB7XG5cdFx0XHRcdFx0XHRlbmQgPSBzdGFydCArIHBhcnNlRmxvYXQoZW5kKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZW5kID0gcGFyc2VGbG9hdChlbmQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFByb3RlY3QgYWdhaW5zdCBub24gbnVtZXJpYyBwcm9wZXJ0aWVzLlxuXHRcdFx0XHRpZiAodHlwZW9mIChlbmQpID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdF9vYmplY3RbcHJvcGVydHldID0gc3RhcnQgKyAoZW5kIC0gc3RhcnQpICogdmFsdWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0aWYgKF9vblVwZGF0ZUNhbGxiYWNrICE9PSBudWxsKSB7XG5cdFx0XHRfb25VcGRhdGVDYWxsYmFjay5jYWxsKF9vYmplY3QsIHZhbHVlKTtcblx0XHR9XG5cblx0XHRpZiAoZWxhcHNlZCA9PT0gMSkge1xuXG5cdFx0XHRpZiAoX3JlcGVhdCA+IDApIHtcblxuXHRcdFx0XHRpZiAoaXNGaW5pdGUoX3JlcGVhdCkpIHtcblx0XHRcdFx0XHRfcmVwZWF0LS07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBSZWFzc2lnbiBzdGFydGluZyB2YWx1ZXMsIHJlc3RhcnQgYnkgbWFraW5nIHN0YXJ0VGltZSA9IG5vd1xuXHRcdFx0XHRmb3IgKHByb3BlcnR5IGluIF92YWx1ZXNTdGFydFJlcGVhdCkge1xuXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiAoX3ZhbHVlc0VuZFtwcm9wZXJ0eV0pID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0X3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XSA9IF92YWx1ZXNTdGFydFJlcGVhdFtwcm9wZXJ0eV0gKyBwYXJzZUZsb2F0KF92YWx1ZXNFbmRbcHJvcGVydHldKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoX3lveW8pIHtcblx0XHRcdFx0XHRcdHZhciB0bXAgPSBfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldO1xuXG5cdFx0XHRcdFx0XHRfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldID0gX3ZhbHVlc0VuZFtwcm9wZXJ0eV07XG5cdFx0XHRcdFx0XHRfdmFsdWVzRW5kW3Byb3BlcnR5XSA9IHRtcDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRfdmFsdWVzU3RhcnRbcHJvcGVydHldID0gX3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKF95b3lvKSB7XG5cdFx0XHRcdFx0X3JldmVyc2VkID0gIV9yZXZlcnNlZDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChfcmVwZWF0RGVsYXlUaW1lICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRfc3RhcnRUaW1lID0gdGltZSArIF9yZXBlYXREZWxheVRpbWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0X3N0YXJ0VGltZSA9IHRpbWUgKyBfZGVsYXlUaW1lO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0aWYgKF9vbkNvbXBsZXRlQ2FsbGJhY2sgIT09IG51bGwpIHtcblxuXHRcdFx0XHRcdF9vbkNvbXBsZXRlQ2FsbGJhY2suY2FsbChfb2JqZWN0LCBfb2JqZWN0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBudW1DaGFpbmVkVHdlZW5zID0gX2NoYWluZWRUd2VlbnMubGVuZ3RoOyBpIDwgbnVtQ2hhaW5lZFR3ZWVuczsgaSsrKSB7XG5cdFx0XHRcdFx0Ly8gTWFrZSB0aGUgY2hhaW5lZCB0d2VlbnMgc3RhcnQgZXhhY3RseSBhdCB0aGUgdGltZSB0aGV5IHNob3VsZCxcblx0XHRcdFx0XHQvLyBldmVuIGlmIHRoZSBgdXBkYXRlKClgIG1ldGhvZCB3YXMgY2FsbGVkIHdheSBwYXN0IHRoZSBkdXJhdGlvbiBvZiB0aGUgdHdlZW5cblx0XHRcdFx0XHRfY2hhaW5lZFR3ZWVuc1tpXS5zdGFydChfc3RhcnRUaW1lICsgX2R1cmF0aW9uKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cblx0fTtcblxufTtcblxuXG5UV0VFTi5FYXNpbmcgPSB7XG5cblx0TGluZWFyOiB7XG5cblx0XHROb25lOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gaztcblxuXHRcdH1cblxuXHR9LFxuXG5cdFF1YWRyYXRpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrICogaztcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrICogKDIgLSBrKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gMC41ICogayAqIGs7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAtIDAuNSAqICgtLWsgKiAoayAtIDIpIC0gMSk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRDdWJpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrICogayAqIGs7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gLS1rICogayAqIGsgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiBrICogayAqIGs7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiAoKGsgLT0gMikgKiBrICogayArIDIpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0UXVhcnRpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrICogayAqIGsgKiBrO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIDEgLSAoLS1rICogayAqIGsgKiBrKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gMC41ICogayAqIGsgKiBrICogaztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIC0gMC41ICogKChrIC09IDIpICogayAqIGsgKiBrIC0gMik7XG5cblx0XHR9XG5cblx0fSxcblxuXHRRdWludGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgKiBrICogayAqIGsgKiBrO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIC0tayAqIGsgKiBrICogayAqIGsgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiBrICogayAqIGsgKiBrICogaztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIDAuNSAqICgoayAtPSAyKSAqIGsgKiBrICogayAqIGsgKyAyKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdFNpbnVzb2lkYWw6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gMSAtIE1hdGguY29zKGsgKiBNYXRoLlBJIC8gMik7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gTWF0aC5zaW4oayAqIE1hdGguUEkgLyAyKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIDAuNSAqICgxIC0gTWF0aC5jb3MoTWF0aC5QSSAqIGspKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEV4cG9uZW50aWFsOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgPT09IDAgPyAwIDogTWF0aC5wb3coMTAyNCwgayAtIDEpO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgPT09IDEgPyAxIDogMSAtIE1hdGgucG93KDIsIC0gMTAgKiBrKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKGsgPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChrID09PSAxKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiBNYXRoLnBvdygxMDI0LCBrIC0gMSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiAoLSBNYXRoLnBvdygyLCAtIDEwICogKGsgLSAxKSkgKyAyKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdENpcmN1bGFyOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIDEgLSBNYXRoLnNxcnQoMSAtIGsgKiBrKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBNYXRoLnNxcnQoMSAtICgtLWsgKiBrKSk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIC0gMC41ICogKE1hdGguc3FydCgxIC0gayAqIGspIC0gMSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiAoTWF0aC5zcXJ0KDEgLSAoayAtPSAyKSAqIGspICsgMSk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRFbGFzdGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKGsgPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChrID09PSAxKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gLU1hdGgucG93KDIsIDEwICogKGsgLSAxKSkgKiBNYXRoLnNpbigoayAtIDEuMSkgKiA1ICogTWF0aC5QSSk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoayA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGsgPT09IDEpIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBNYXRoLnBvdygyLCAtMTAgKiBrKSAqIE1hdGguc2luKChrIC0gMC4xKSAqIDUgKiBNYXRoLlBJKSArIDE7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmIChrID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoayA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblxuXHRcdFx0ayAqPSAyO1xuXG5cdFx0XHRpZiAoayA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIC0wLjUgKiBNYXRoLnBvdygyLCAxMCAqIChrIC0gMSkpICogTWF0aC5zaW4oKGsgLSAxLjEpICogNSAqIE1hdGguUEkpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gMC41ICogTWF0aC5wb3coMiwgLTEwICogKGsgLSAxKSkgKiBNYXRoLnNpbigoayAtIDEuMSkgKiA1ICogTWF0aC5QSSkgKyAxO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0QmFjazoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHZhciBzID0gMS43MDE1ODtcblxuXHRcdFx0cmV0dXJuIGsgKiBrICogKChzICsgMSkgKiBrIC0gcyk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHR2YXIgcyA9IDEuNzAxNTg7XG5cblx0XHRcdHJldHVybiAtLWsgKiBrICogKChzICsgMSkgKiBrICsgcykgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHR2YXIgcyA9IDEuNzAxNTggKiAxLjUyNTtcblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gMC41ICogKGsgKiBrICogKChzICsgMSkgKiBrIC0gcykpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gMC41ICogKChrIC09IDIpICogayAqICgocyArIDEpICogayArIHMpICsgMik7XG5cblx0XHR9XG5cblx0fSxcblxuXHRCb3VuY2U6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gMSAtIFRXRUVOLkVhc2luZy5Cb3VuY2UuT3V0KDEgLSBrKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmIChrIDwgKDEgLyAyLjc1KSkge1xuXHRcdFx0XHRyZXR1cm4gNy41NjI1ICogayAqIGs7XG5cdFx0XHR9IGVsc2UgaWYgKGsgPCAoMiAvIDIuNzUpKSB7XG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiAoayAtPSAoMS41IC8gMi43NSkpICogayArIDAuNzU7XG5cdFx0XHR9IGVsc2UgaWYgKGsgPCAoMi41IC8gMi43NSkpIHtcblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIChrIC09ICgyLjI1IC8gMi43NSkpICogayArIDAuOTM3NTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiAoayAtPSAoMi42MjUgLyAyLjc1KSkgKiBrICsgMC45ODQzNzU7XG5cdFx0XHR9XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmIChrIDwgMC41KSB7XG5cdFx0XHRcdHJldHVybiBUV0VFTi5FYXNpbmcuQm91bmNlLkluKGsgKiAyKSAqIDAuNTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIFRXRUVOLkVhc2luZy5Cb3VuY2UuT3V0KGsgKiAyIC0gMSkgKiAwLjUgKyAwLjU7XG5cblx0XHR9XG5cblx0fVxuXG59O1xuXG5UV0VFTi5JbnRlcnBvbGF0aW9uID0ge1xuXG5cdExpbmVhcjogZnVuY3Rpb24gKHYsIGspIHtcblxuXHRcdHZhciBtID0gdi5sZW5ndGggLSAxO1xuXHRcdHZhciBmID0gbSAqIGs7XG5cdFx0dmFyIGkgPSBNYXRoLmZsb29yKGYpO1xuXHRcdHZhciBmbiA9IFRXRUVOLkludGVycG9sYXRpb24uVXRpbHMuTGluZWFyO1xuXG5cdFx0aWYgKGsgPCAwKSB7XG5cdFx0XHRyZXR1cm4gZm4odlswXSwgdlsxXSwgZik7XG5cdFx0fVxuXG5cdFx0aWYgKGsgPiAxKSB7XG5cdFx0XHRyZXR1cm4gZm4odlttXSwgdlttIC0gMV0sIG0gLSBmKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZm4odltpXSwgdltpICsgMSA+IG0gPyBtIDogaSArIDFdLCBmIC0gaSk7XG5cblx0fSxcblxuXHRCZXppZXI6IGZ1bmN0aW9uICh2LCBrKSB7XG5cblx0XHR2YXIgYiA9IDA7XG5cdFx0dmFyIG4gPSB2Lmxlbmd0aCAtIDE7XG5cdFx0dmFyIHB3ID0gTWF0aC5wb3c7XG5cdFx0dmFyIGJuID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5CZXJuc3RlaW47XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBuOyBpKyspIHtcblx0XHRcdGIgKz0gcHcoMSAtIGssIG4gLSBpKSAqIHB3KGssIGkpICogdltpXSAqIGJuKG4sIGkpO1xuXHRcdH1cblxuXHRcdHJldHVybiBiO1xuXG5cdH0sXG5cblx0Q2F0bXVsbFJvbTogZnVuY3Rpb24gKHYsIGspIHtcblxuXHRcdHZhciBtID0gdi5sZW5ndGggLSAxO1xuXHRcdHZhciBmID0gbSAqIGs7XG5cdFx0dmFyIGkgPSBNYXRoLmZsb29yKGYpO1xuXHRcdHZhciBmbiA9IFRXRUVOLkludGVycG9sYXRpb24uVXRpbHMuQ2F0bXVsbFJvbTtcblxuXHRcdGlmICh2WzBdID09PSB2W21dKSB7XG5cblx0XHRcdGlmIChrIDwgMCkge1xuXHRcdFx0XHRpID0gTWF0aC5mbG9vcihmID0gbSAqICgxICsgaykpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZm4odlsoaSAtIDEgKyBtKSAlIG1dLCB2W2ldLCB2WyhpICsgMSkgJSBtXSwgdlsoaSArIDIpICUgbV0sIGYgLSBpKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGlmIChrIDwgMCkge1xuXHRcdFx0XHRyZXR1cm4gdlswXSAtIChmbih2WzBdLCB2WzBdLCB2WzFdLCB2WzFdLCAtZikgLSB2WzBdKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGsgPiAxKSB7XG5cdFx0XHRcdHJldHVybiB2W21dIC0gKGZuKHZbbV0sIHZbbV0sIHZbbSAtIDFdLCB2W20gLSAxXSwgZiAtIG0pIC0gdlttXSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmbih2W2kgPyBpIC0gMSA6IDBdLCB2W2ldLCB2W20gPCBpICsgMSA/IG0gOiBpICsgMV0sIHZbbSA8IGkgKyAyID8gbSA6IGkgKyAyXSwgZiAtIGkpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0VXRpbHM6IHtcblxuXHRcdExpbmVhcjogZnVuY3Rpb24gKHAwLCBwMSwgdCkge1xuXG5cdFx0XHRyZXR1cm4gKHAxIC0gcDApICogdCArIHAwO1xuXG5cdFx0fSxcblxuXHRcdEJlcm5zdGVpbjogZnVuY3Rpb24gKG4sIGkpIHtcblxuXHRcdFx0dmFyIGZjID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5GYWN0b3JpYWw7XG5cblx0XHRcdHJldHVybiBmYyhuKSAvIGZjKGkpIC8gZmMobiAtIGkpO1xuXG5cdFx0fSxcblxuXHRcdEZhY3RvcmlhbDogKGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0dmFyIGEgPSBbMV07XG5cblx0XHRcdHJldHVybiBmdW5jdGlvbiAobikge1xuXG5cdFx0XHRcdHZhciBzID0gMTtcblxuXHRcdFx0XHRpZiAoYVtuXSkge1xuXHRcdFx0XHRcdHJldHVybiBhW25dO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IG47IGkgPiAxOyBpLS0pIHtcblx0XHRcdFx0XHRzICo9IGk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhW25dID0gcztcblx0XHRcdFx0cmV0dXJuIHM7XG5cblx0XHRcdH07XG5cblx0XHR9KSgpLFxuXG5cdFx0Q2F0bXVsbFJvbTogZnVuY3Rpb24gKHAwLCBwMSwgcDIsIHAzLCB0KSB7XG5cblx0XHRcdHZhciB2MCA9IChwMiAtIHAwKSAqIDAuNTtcblx0XHRcdHZhciB2MSA9IChwMyAtIHAxKSAqIDAuNTtcblx0XHRcdHZhciB0MiA9IHQgKiB0O1xuXHRcdFx0dmFyIHQzID0gdCAqIHQyO1xuXG5cdFx0XHRyZXR1cm4gKDIgKiBwMSAtIDIgKiBwMiArIHYwICsgdjEpICogdDMgKyAoLSAzICogcDEgKyAzICogcDIgLSAyICogdjAgLSB2MSkgKiB0MiArIHYwICogdCArIHAxO1xuXG5cdFx0fVxuXG5cdH1cblxufTtcblxuLy8gVU1EIChVbml2ZXJzYWwgTW9kdWxlIERlZmluaXRpb24pXG4oZnVuY3Rpb24gKHJvb3QpIHtcblxuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cblx0XHQvLyBBTURcblx0XHRkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBUV0VFTjtcblx0XHR9KTtcblxuXHR9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuXG5cdFx0Ly8gTm9kZS5qc1xuXHRcdG1vZHVsZS5leHBvcnRzID0gVFdFRU47XG5cblx0fSBlbHNlIGlmIChyb290ICE9PSB1bmRlZmluZWQpIHtcblxuXHRcdC8vIEdsb2JhbCB2YXJpYWJsZVxuXHRcdHJvb3QuVFdFRU4gPSBUV0VFTjtcblxuXHR9XG5cbn0pKHRoaXMpO1xuIiwiY29uc3QgdG9vbHMgPSByZXF1aXJlKCcuLi91dGlscy90b29scy5qcycpO1xyXG5jb25zdCBUV0VFTiA9IHJlcXVpcmUoJ1R3ZWVuLmpzJyk7XHJcblxyXG5jb25zdCBzcGVjUHJvcHMgPSB7J3Bvcyc6J19wb3NpdGlvbicsJ3NjYWxlJzonX3NjYWxlJywnb3BhY2l0eSc6J2FscGhhRmFjdG9yJ307XHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVHdlZW5BY3Rpb257XHJcblxyXG4gIGNvbnN0cnVjdG9yKCl7XHJcbiAgICB0aGlzLnN0YXJ0VHdlZW5UaW1lID0gMDtcclxuICAgIHRoaXMudHdlZW5TdGFydCA9IGZhbHNlO1xyXG4gICAgdGhpcy5fdHdlZW5MaXN0ID0gW107XHJcbiAgfVxyXG5cclxuICBpbml0VHdlZW4oKXtcclxuICAgIHRoaXMuYWRkVXBkYXRlVGFzaygoKT0+e1xyXG4gICAgICBpZih0aGlzLl90d2Vlbkxpc3QubGVuZ3RoKVxyXG4gICAgICAgIFRXRUVOLnVwZGF0ZSgpO1xyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHR3ZWVuKGdhbWVPYmoscHJvcHMsZHVyYXRpb24sZGVsYXkgPSAwKXtcclxuICAgIGxldCBuZXdQcm9wcyA9IHt9O1xyXG5cclxuICAgIE9iamVjdC5rZXlzKHByb3BzKS5mb3JFYWNoKGtleT0+e1xyXG4gICAgICBzZXRQcm9wcyhrZXksIG5ld1Byb3BzLCBnYW1lT2JqLCB0cnVlKTtcclxuICAgIH0pXHJcblxyXG4gICAgaWYoIXRoaXMuc3RhcnRUd2VlblRpbWUpXHJcbiAgICAgIHRoaXMuc3RhcnRUd2VlblRpbWUgPSB0b29scy5nZXRUaW1lKCk7XHJcblxyXG4gICAgbGV0IG5vdyA9IHRvb2xzLmdldFRpbWUoKTtcclxuXHJcbiAgICBsZXQgdHdlZW4gPSBuZXcgVFdFRU4uVHdlZW4obmV3UHJvcHMpLmRlbGF5KGRlbGF5KTtcclxuXHJcbiAgICB0d2Vlbi50byhwcm9wcyxkdXJhdGlvbikub25VcGRhdGUoZnVuY3Rpb24oKXtcclxuICAgICAgaWYodGhpcyA9PT0gZ2FtZU9iailcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBPYmplY3Qua2V5cyh0aGlzKS5mb3JFYWNoKGtleT0+e1xyXG4gICAgICAgIHNldFByb3BzKGtleSwgZ2FtZU9iaiwgdGhpcywgZmFsc2UpO1xyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIHRoaXMuX3R3ZWVuTGlzdC5wdXNoKHR3ZWVuKTtcclxuXHJcbiAgICByZXR1cm4gdHdlZW47XHJcblxyXG4vKipcclxuICogW3NldFByb3BzIGRlc2NyaXB0aW9uXVxyXG4gKiBAcGFyYW0ge1t0eXBlXX0ga2V5ICAgICAgICAg6KaB6I635Y+W5YC855qE5bGe5oCn5ZCNXHJcbiAqIEBwYXJhbSB7W3R5cGVdfSBuZXdQcm9wcyAgICDooqvorr7nva7lgLznmoTlr7nosaFcclxuICogQHBhcmFtIHtbdHlwZV19IG9yaWdpblByb3BzIOWPluWAvOeahOWvueixoVxyXG4gKiBAcGFyYW0ge1t0eXBlXX0gaW52ZXJzZSAgICAg5piv5ZCm5rex5bqm5Y+W5YC877yM5Y2z5LuO5aSa5bGC57uT5p6E5Lit5Y+W5YC8XHJcbiAqL1xyXG4gICAgZnVuY3Rpb24gc2V0UHJvcHMoa2V5LG5ld1Byb3BzLG9yaWdpblByb3BzLGludmVyc2Upe1xyXG4gICAgICBsZXQgc3BsaXRLZXkgPSBrZXkuc3BsaXQoJy4nKTtcclxuICAgICAgbGV0IHRlbXBQcm9wID0gc3BlY1Byb3BzW3NwbGl0S2V5WzBdXTtcclxuICAgICAgaWYodGVtcFByb3Ape1xyXG4gICAgICAgIGlmKCFpbnZlcnNlKXtcclxuICAgICAgICAgIGlmKHNwbGl0S2V5Lmxlbmd0aCA+IDEpXHJcbiAgICAgICAgICAgIG5ld1Byb3BzW3RlbXBQcm9wXVtzcGxpdEtleVsxXV0gPSBvcmlnaW5Qcm9wc1trZXldO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBuZXdQcm9wc1t0ZW1wUHJvcF0gPSBvcmlnaW5Qcm9wc1trZXldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgaWYoc3BsaXRLZXkubGVuZ3RoID4gMSlcclxuICAgICAgICAgICAgbmV3UHJvcHNba2V5XSA9IG9yaWdpblByb3BzW3RlbXBQcm9wXVtzcGxpdEtleVsxXV07XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG5ld1Byb3BzW2tleV0gPSBvcmlnaW5Qcm9wc1t0ZW1wUHJvcF07XHJcbiAgICAgICAgfVxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICBuZXdQcm9wc1trZXldID0gb3JpZ2luUHJvcHNba2V5XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0IFRXRUVOKCl7XHJcbiAgICByZXR1cm4gVFdFRU47XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlcntcclxuXHJcbiAgc3RhdGljIHJlbmRlclZpZXcocGljYXNzbyl7XHJcbiAgICBsZXQgY3R4ID0gcGljYXNzby5fY3R4O1xyXG5cclxuICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XHJcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSAxO1xyXG4gICAgLy8g5b+F6aG75pS+6L+Z6YeM77yM5LiN54S26aG16Z2i5Lya6Zeq54OBXHJcbiAgICBjdHguY2xlYXJSZWN0KDAsMCxwaWNhc3NvLndpZHRoLHBpY2Fzc28uaGVpZ2h0KTtcclxuXHJcbiAgICAvLyBwaWNhc3NvLmdhbWVPYmplY3RzLmNoaWxkcmVuKGdhbWVPYmo9PntcclxuICAgIC8vICAgaWYoIWdhbWVPYmoudXBkYXRlKVxyXG4gICAgLy8gICAgIHJldHVybjtcclxuXHJcbiAgICAvLyAgIGdhbWVPYmoudXBkYXRlKHBpY2Fzc28udGltZXN0YW1wLCBwaWNhc3NvLnBhc3NlZFRpbWUpO1xyXG5cclxuICAgIC8vICAgaWYoZ2FtZU9iai5oYXNDaGlsZCl7XHJcbiAgICAvLyAgICAgZ2FtZU9iai5jaGlsZHJlbigoY2hpbGRPYmopPT57XHJcbiAgICAvLyAgICAgICBjaGlsZE9iai51cGRhdGUocGljYXNzby50aW1lc3RhbXAsIHBpY2Fzc28ucGFzc2VkVGltZSk7XHJcbiAgICAvLyAgICAgICBfaW5uZXJSZW5kZXIoY2hpbGRPYmopO1xyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gICB9ZWxzZXtcclxuICAgIC8vICAgICBfaW5uZXJSZW5kZXIoZ2FtZU9iaik7XHJcbiAgICAvLyAgIH1cclxuICAgIC8vIH0pO1xyXG5cclxuICAgIHJlbmRlclNwcml0ZShwaWNhc3NvLmdhbWVPYmplY3RzKTtcclxuXHJcbiAgICBmdW5jdGlvbiBfaW5uZXJSZW5kZXIoc3ByaXRlKSB7XHJcbiAgICAgIGxldCB3dCA9IHNwcml0ZS53b3JsZFRyYW5zZm9ybTtcclxuXHJcbiAgICAgIGN0eC5zZXRUcmFuc2Zvcm0od3QuYSx3dC5iLHd0LmMsd3QuZCx3dC50eCx3dC50eSk7XHJcbiAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IHNwcml0ZS53b3JsZEFscGhhO1xyXG5cclxuICAgICAgc3ByaXRlLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlbmRlclNwcml0ZSAoc3ByaXRlKSB7XHJcbiAgICAgIGlmKCFzcHJpdGUubGl2ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBzcHJpdGUudXBkYXRlKHBpY2Fzc28udGltZXN0YW1wLCBwaWNhc3NvLnBhc3NlZFRpbWUpO1xyXG4gICAgICBpZihzcHJpdGUuaGFzQ2hpbGQpe1xyXG4gICAgICAgIHNwcml0ZS5jaGlsZHJlbigoY2hpbGRPYmopPT57XHJcbiAgICAgICAgICByZW5kZXJTcHJpdGUoY2hpbGRPYmopO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICBfaW5uZXJSZW5kZXIoc3ByaXRlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbn0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5XG4gICwgcHJlZml4ID0gJ34nO1xuXG4vKipcbiAqIENvbnN0cnVjdG9yIHRvIGNyZWF0ZSBhIHN0b3JhZ2UgZm9yIG91ciBgRUVgIG9iamVjdHMuXG4gKiBBbiBgRXZlbnRzYCBpbnN0YW5jZSBpcyBhIHBsYWluIG9iamVjdCB3aG9zZSBwcm9wZXJ0aWVzIGFyZSBldmVudCBuYW1lcy5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBFdmVudHMoKSB7fVxuXG4vL1xuLy8gV2UgdHJ5IHRvIG5vdCBpbmhlcml0IGZyb20gYE9iamVjdC5wcm90b3R5cGVgLiBJbiBzb21lIGVuZ2luZXMgY3JlYXRpbmcgYW5cbi8vIGluc3RhbmNlIGluIHRoaXMgd2F5IGlzIGZhc3RlciB0aGFuIGNhbGxpbmcgYE9iamVjdC5jcmVhdGUobnVsbClgIGRpcmVjdGx5LlxuLy8gSWYgYE9iamVjdC5jcmVhdGUobnVsbClgIGlzIG5vdCBzdXBwb3J0ZWQgd2UgcHJlZml4IHRoZSBldmVudCBuYW1lcyB3aXRoIGFcbi8vIGNoYXJhY3RlciB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYnVpbHQtaW4gb2JqZWN0IHByb3BlcnRpZXMgYXJlIG5vdFxuLy8gb3ZlcnJpZGRlbiBvciB1c2VkIGFzIGFuIGF0dGFjayB2ZWN0b3IuXG4vL1xuaWYgKE9iamVjdC5jcmVhdGUpIHtcbiAgRXZlbnRzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgLy9cbiAgLy8gVGhpcyBoYWNrIGlzIG5lZWRlZCBiZWNhdXNlIHRoZSBgX19wcm90b19fYCBwcm9wZXJ0eSBpcyBzdGlsbCBpbmhlcml0ZWQgaW5cbiAgLy8gc29tZSBvbGQgYnJvd3NlcnMgbGlrZSBBbmRyb2lkIDQsIGlQaG9uZSA1LjEsIE9wZXJhIDExIGFuZCBTYWZhcmkgNS5cbiAgLy9cbiAgaWYgKCFuZXcgRXZlbnRzKCkuX19wcm90b19fKSBwcmVmaXggPSBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRhdGlvbiBvZiBhIHNpbmdsZSBldmVudCBsaXN0ZW5lci5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBjb250ZXh0IFRoZSBjb250ZXh0IHRvIGludm9rZSB0aGUgbGlzdGVuZXIgd2l0aC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29uY2U9ZmFsc2VdIFNwZWNpZnkgaWYgdGhlIGxpc3RlbmVyIGlzIGEgb25lLXRpbWUgbGlzdGVuZXIuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBFRShmbiwgY29udGV4dCwgb25jZSkge1xuICB0aGlzLmZuID0gZm47XG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIHRoaXMub25jZSA9IG9uY2UgfHwgZmFsc2U7XG59XG5cbi8qKlxuICogTWluaW1hbCBgRXZlbnRFbWl0dGVyYCBpbnRlcmZhY2UgdGhhdCBpcyBtb2xkZWQgYWdhaW5zdCB0aGUgTm9kZS5qc1xuICogYEV2ZW50RW1pdHRlcmAgaW50ZXJmYWNlLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYW4gYXJyYXkgbGlzdGluZyB0aGUgZXZlbnRzIGZvciB3aGljaCB0aGUgZW1pdHRlciBoYXMgcmVnaXN0ZXJlZFxuICogbGlzdGVuZXJzLlxuICpcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZXZlbnROYW1lcyA9IGZ1bmN0aW9uIGV2ZW50TmFtZXMoKSB7XG4gIHZhciBuYW1lcyA9IFtdXG4gICAgLCBldmVudHNcbiAgICAsIG5hbWU7XG5cbiAgaWYgKHRoaXMuX2V2ZW50c0NvdW50ID09PSAwKSByZXR1cm4gbmFtZXM7XG5cbiAgZm9yIChuYW1lIGluIChldmVudHMgPSB0aGlzLl9ldmVudHMpKSB7XG4gICAgaWYgKGhhcy5jYWxsKGV2ZW50cywgbmFtZSkpIG5hbWVzLnB1c2gocHJlZml4ID8gbmFtZS5zbGljZSgxKSA6IG5hbWUpO1xuICB9XG5cbiAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgICByZXR1cm4gbmFtZXMuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZXZlbnRzKSk7XG4gIH1cblxuICByZXR1cm4gbmFtZXM7XG59O1xuXG4vKipcbiAqIFJldHVybiB0aGUgbGlzdGVuZXJzIHJlZ2lzdGVyZWQgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZXhpc3RzIE9ubHkgY2hlY2sgaWYgdGhlcmUgYXJlIGxpc3RlbmVycy5cbiAqIEByZXR1cm5zIHtBcnJheXxCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbiBsaXN0ZW5lcnMoZXZlbnQsIGV4aXN0cykge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudFxuICAgICwgYXZhaWxhYmxlID0gdGhpcy5fZXZlbnRzW2V2dF07XG5cbiAgaWYgKGV4aXN0cykgcmV0dXJuICEhYXZhaWxhYmxlO1xuICBpZiAoIWF2YWlsYWJsZSkgcmV0dXJuIFtdO1xuICBpZiAoYXZhaWxhYmxlLmZuKSByZXR1cm4gW2F2YWlsYWJsZS5mbl07XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhdmFpbGFibGUubGVuZ3RoLCBlZSA9IG5ldyBBcnJheShsKTsgaSA8IGw7IGkrKykge1xuICAgIGVlW2ldID0gYXZhaWxhYmxlW2ldLmZuO1xuICB9XG5cbiAgcmV0dXJuIGVlO1xufTtcblxuLyoqXG4gKiBDYWxscyBlYWNoIG9mIHRoZSBsaXN0ZW5lcnMgcmVnaXN0ZXJlZCBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHJldHVybnMge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgZXZlbnQgaGFkIGxpc3RlbmVycywgZWxzZSBgZmFsc2VgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdChldmVudCwgYTEsIGEyLCBhMywgYTQsIGE1KSB7XG4gIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHJldHVybiBmYWxzZTtcblxuICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW2V2dF1cbiAgICAsIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIGFyZ3NcbiAgICAsIGk7XG5cbiAgaWYgKGxpc3RlbmVycy5mbikge1xuICAgIGlmIChsaXN0ZW5lcnMub25jZSkgdGhpcy5yZW1vdmVMaXN0ZW5lcihldmVudCwgbGlzdGVuZXJzLmZuLCB1bmRlZmluZWQsIHRydWUpO1xuXG4gICAgc3dpdGNoIChsZW4pIHtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0KSwgdHJ1ZTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSksIHRydWU7XG4gICAgICBjYXNlIDM6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyKSwgdHJ1ZTtcbiAgICAgIGNhc2UgNDogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzKSwgdHJ1ZTtcbiAgICAgIGNhc2UgNTogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzLCBhNCksIHRydWU7XG4gICAgICBjYXNlIDY6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMywgYTQsIGE1KSwgdHJ1ZTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAxLCBhcmdzID0gbmV3IEFycmF5KGxlbiAtMSk7IGkgPCBsZW47IGkrKykge1xuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuXG4gICAgbGlzdGVuZXJzLmZuLmFwcGx5KGxpc3RlbmVycy5jb250ZXh0LCBhcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbGVuZ3RoID0gbGlzdGVuZXJzLmxlbmd0aFxuICAgICAgLCBqO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobGlzdGVuZXJzW2ldLm9uY2UpIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyc1tpXS5mbiwgdW5kZWZpbmVkLCB0cnVlKTtcblxuICAgICAgc3dpdGNoIChsZW4pIHtcbiAgICAgICAgY2FzZSAxOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCk7IGJyZWFrO1xuICAgICAgICBjYXNlIDI6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhMSk7IGJyZWFrO1xuICAgICAgICBjYXNlIDM6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhMSwgYTIpOyBicmVhaztcbiAgICAgICAgY2FzZSA0OiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEsIGEyLCBhMyk7IGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGlmICghYXJncykgZm9yIChqID0gMSwgYXJncyA9IG5ldyBBcnJheShsZW4gLTEpOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaiAtIDFdID0gYXJndW1lbnRzW2pdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxpc3RlbmVyc1tpXS5mbi5hcHBseShsaXN0ZW5lcnNbaV0uY29udGV4dCwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIEFkZCBhIGxpc3RlbmVyIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBbY29udGV4dD10aGlzXSBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gb24oZXZlbnQsIGZuLCBjb250ZXh0KSB7XG4gIHZhciBsaXN0ZW5lciA9IG5ldyBFRShmbiwgY29udGV4dCB8fCB0aGlzKVxuICAgICwgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSB0aGlzLl9ldmVudHNbZXZ0XSA9IGxpc3RlbmVyLCB0aGlzLl9ldmVudHNDb3VudCsrO1xuICBlbHNlIGlmICghdGhpcy5fZXZlbnRzW2V2dF0uZm4pIHRoaXMuX2V2ZW50c1tldnRdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlIHRoaXMuX2V2ZW50c1tldnRdID0gW3RoaXMuX2V2ZW50c1tldnRdLCBsaXN0ZW5lcl07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZCBhIG9uZS10aW1lIGxpc3RlbmVyIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBbY29udGV4dD10aGlzXSBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbiBvbmNlKGV2ZW50LCBmbiwgY29udGV4dCkge1xuICB2YXIgbGlzdGVuZXIgPSBuZXcgRUUoZm4sIGNvbnRleHQgfHwgdGhpcywgdHJ1ZSlcbiAgICAsIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgdGhpcy5fZXZlbnRzW2V2dF0gPSBsaXN0ZW5lciwgdGhpcy5fZXZlbnRzQ291bnQrKztcbiAgZWxzZSBpZiAoIXRoaXMuX2V2ZW50c1tldnRdLmZuKSB0aGlzLl9ldmVudHNbZXZ0XS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZSB0aGlzLl9ldmVudHNbZXZ0XSA9IFt0aGlzLl9ldmVudHNbZXZ0XSwgbGlzdGVuZXJdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGxpc3RlbmVycyBvZiBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBPbmx5IHJlbW92ZSB0aGUgbGlzdGVuZXJzIHRoYXQgbWF0Y2ggdGhpcyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7TWl4ZWR9IGNvbnRleHQgT25seSByZW1vdmUgdGhlIGxpc3RlbmVycyB0aGF0IGhhdmUgdGhpcyBjb250ZXh0LlxuICogQHBhcmFtIHtCb29sZWFufSBvbmNlIE9ubHkgcmVtb3ZlIG9uZS10aW1lIGxpc3RlbmVycy5cbiAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcihldmVudCwgZm4sIGNvbnRleHQsIG9uY2UpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgcmV0dXJuIHRoaXM7XG4gIGlmICghZm4pIHtcbiAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgIGVsc2UgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1tldnRdO1xuXG4gIGlmIChsaXN0ZW5lcnMuZm4pIHtcbiAgICBpZiAoXG4gICAgICAgICBsaXN0ZW5lcnMuZm4gPT09IGZuXG4gICAgICAmJiAoIW9uY2UgfHwgbGlzdGVuZXJzLm9uY2UpXG4gICAgICAmJiAoIWNvbnRleHQgfHwgbGlzdGVuZXJzLmNvbnRleHQgPT09IGNvbnRleHQpXG4gICAgKSB7XG4gICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgICAgZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2dF07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGkgPSAwLCBldmVudHMgPSBbXSwgbGVuZ3RoID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoXG4gICAgICAgICAgIGxpc3RlbmVyc1tpXS5mbiAhPT0gZm5cbiAgICAgICAgfHwgKG9uY2UgJiYgIWxpc3RlbmVyc1tpXS5vbmNlKVxuICAgICAgICB8fCAoY29udGV4dCAmJiBsaXN0ZW5lcnNbaV0uY29udGV4dCAhPT0gY29udGV4dClcbiAgICAgICkge1xuICAgICAgICBldmVudHMucHVzaChsaXN0ZW5lcnNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vXG4gICAgLy8gUmVzZXQgdGhlIGFycmF5LCBvciByZW1vdmUgaXQgY29tcGxldGVseSBpZiB3ZSBoYXZlIG5vIG1vcmUgbGlzdGVuZXJzLlxuICAgIC8vXG4gICAgaWYgKGV2ZW50cy5sZW5ndGgpIHRoaXMuX2V2ZW50c1tldnRdID0gZXZlbnRzLmxlbmd0aCA9PT0gMSA/IGV2ZW50c1swXSA6IGV2ZW50cztcbiAgICBlbHNlIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKSB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2dF07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFsbCBsaXN0ZW5lcnMsIG9yIHRob3NlIG9mIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBbZXZlbnRdIFRoZSBldmVudCBuYW1lLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbiByZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnQpIHtcbiAgdmFyIGV2dDtcblxuICBpZiAoZXZlbnQpIHtcbiAgICBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuICAgIGlmICh0aGlzLl9ldmVudHNbZXZ0XSkge1xuICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICAgIGVsc2UgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vL1xuLy8gQWxpYXMgbWV0aG9kcyBuYW1lcyBiZWNhdXNlIHBlb3BsZSByb2xsIGxpa2UgdGhhdC5cbi8vXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbjtcblxuLy9cbi8vIFRoaXMgZnVuY3Rpb24gZG9lc24ndCBhcHBseSBhbnltb3JlLlxuLy9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24gc2V0TWF4TGlzdGVuZXJzKCkge1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vXG4vLyBFeHBvc2UgdGhlIHByZWZpeC5cbi8vXG5FdmVudEVtaXR0ZXIucHJlZml4ZWQgPSBwcmVmaXg7XG5cbi8vXG4vLyBBbGxvdyBgRXZlbnRFbWl0dGVyYCB0byBiZSBpbXBvcnRlZCBhcyBtb2R1bGUgbmFtZXNwYWNlLlxuLy9cbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbi8vXG4vLyBFeHBvc2UgdGhlIG1vZHVsZS5cbi8vXG5pZiAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBtb2R1bGUpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG59XG4iLCJcclxudmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xyXG5cclxuLyoqXHJcbiAqIFxyXG4gKiBAcGFyYW0geyp9IGNiIGlmIHByb3AncyBmaXJzdCB2YWx1ZSBpcyBmdW5jdGlvbix0aGVuIGNiIG11c3QgcGFzcyBmdW5jdGlvbiBvciBudWxsXHJcbiAqIEBwYXJhbSB7Kn0gc2NvcGUgY2FsbGJhY2sgZXhlY3V0ZSB3aXRoIHNjb3BlXHJcbiAqIEBwYXJhbSB7Kn0gcHJvcExpc3QgcHJvcCBuYW1lXHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVPYnNlcnZlKGNiLHNjb3BlLC4uLnByb3BMaXN0KXtcclxuXHJcbiAgdmFyIG1haW5BcmdzTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcclxuXHJcbi8qKlxyXG4gKiBhcmd1bWVudHMgaXMgc2FtZSBhcyBhYm92ZSBjcmVhdGVPYnNlcnZlICxidXQgaXMgdGhlIHZhbHVlIG9mIHByb3AgbmFtZVxyXG4gKiBpZiBmaXJzdCBhcmcgaXMgZnVuY3Rpb24gLHRoZW4gaXQgbXVzdCBiZSBjYWxsYmFja1xyXG4gKiBpZiBzZWNvbmQgYXJnIGlzIG9iamVjdCAsIHRoZW4gaXQgbXVzdCBiZSBzY29wZVxyXG4gKi9cclxuICBmdW5jdGlvbiBPYnNlcnZlT2JqZWN0KC4uLnByb3BWYWx1ZUxpc3Qpe1xyXG4gICAgbGV0IGFyZ3MgPSBwcm9wVmFsdWVMaXN0LFxyXG4gICAgICAgIG9ialNjb3BlO1xyXG5cclxuICAgIGlmKG1haW5BcmdzTGVuID09IGFyZ3VtZW50cy5sZW5ndGggfHwgdHlwZW9mIGFyZ3NbMF0gPT09ICdmdW5jdGlvbicpe1xyXG4gICAgICB0aGlzLmNiID0gYXJnc1swXTtcclxuICAgICAgaWYodHlwZW9mIGFyZ3NbMV0gPT09ICdvYmplY3QnKXtcclxuICAgICAgICBvYmpTY29wZSA9IGFyZ3NbMV07XHJcbiAgICAgICAgYXJncyA9IGFyZ3Muc2xpY2UoMik7XHJcbiAgICAgIH1lbHNlXHJcbiAgICAgICAgYXJncyA9IGFyZ3Muc2xpY2UoMSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFyZ3MuZm9yRWFjaCgoYXJnLCBpbmRleCk9PntcclxuICAgICAgdGhpc1tgXyR7cHJvcExpc3RbaW5kZXhdfWBdID0gYXJnO1xyXG4gICAgfSlcclxuXHJcbiAgICB0aGlzLmNiID0gdGhpcy5jYiB8fCBjYiB8fCBmdW5jdGlvbigpe307XHJcbiAgICB0aGlzLnNjb3BlID0gb2JqU2NvcGUgfHwgc2NvcGUgfHwgdGhpcztcclxuICB9XHJcblxyXG4gIHByb3BMaXN0LmZvckVhY2gocHJvcD0+e1xyXG4gICAgX2NyZWF0ZUNsYXNzKE9ic2VydmVPYmplY3QsIFt7XHJcbiAgICAgIGtleTogcHJvcCxcclxuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbYF8ke3Byb3B9YF07XHJcbiAgICAgIH0sXHJcbiAgICAgIHNldCh2YWwpe1xyXG4gICAgICAgIGxldCBfcHJvcCA9ICdfJyArIHByb3A7XHJcblxyXG4gICAgICAgIGlmKHRoaXNbX3Byb3BdID09PSB2YWwpXHJcbiAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXNbX3Byb3BdID0gdmFsO1xyXG5cclxuICAgICAgICB0aGlzLmNiLmNhbGwodGhpcy5zY29wZSk7XHJcbiAgICAgIH1cclxuICAgIH1dKTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIE9ic2VydmVPYmplY3Q7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZU9ic2VydmU7IiwiaW1wb3J0IGNyZWF0ZU9ic2VydmUgZnJvbSAnLi9PYnNlcnZlT2JqZWN0LmpzJztcclxuXHJcbnZhciBQb2ludCA9IGNyZWF0ZU9ic2VydmUobnVsbCxudWxsLCd4JywneScpO1xyXG5cclxuUG9pbnQucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHgsIHkpe1xyXG4gIGNvbnN0IF94ID0geCB8fCAwO1xyXG4gIGNvbnN0IF95ID0geSB8fCAoKHkgIT09IDApID8gX3ggOiAwKTtcclxuXHJcbiAgaWYodGhpcy5feCAhPT0gX3ggfHwgdGhpcy5feSAhPT0gX3kpe1xyXG4gICAgdGhpcy5feCA9IF94O1xyXG4gICAgdGhpcy5feSA9IF95O1xyXG4gICAgdGhpcy5jYigpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUG9pbnQ7XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIGxvYWRlcntcclxuICBjb25zdHJ1Y3RvcihjYil7XHJcbiAgICB0aGlzLmxvYWRDb3VudCA9IDA7XHJcbiAgICB0aGlzLl9fbG9hZGVkSGFzaCA9IHt9O1xyXG4gICAgdGhpcy5jb21wbGV0ZUNhbGxiYWNrID0gY2I7XHJcbiAgfVxyXG5cclxuICBsb2FkSW1nKGtleSx1cmwsZm9ybWF0KXtcclxuICAgIGxldCBsb2FkUmV0ID0gdGhpcy5fX2xvYWRlZEhhc2hba2V5XTtcclxuXHJcbiAgICBpZighIWxvYWRSZXQpXHJcbiAgICAgIHJldHVybjtcclxuXHJcbiAgICB0aGlzLmxvYWRDb3VudCsrO1xyXG5cclxuICAgIGxldCBpbWcgPSBuZXcgSW1hZ2U7XHJcblxyXG4gICAgaW1nLnNyYyA9IHVybDtcclxuXHJcbiAgICBpbWcub25sb2FkID0gZXZ0ID0+IHtcclxuICAgICAgdGhpcy5fX2xvYWRlZEhhc2hba2V5XS5fbG9hZGVkID0gMTtcclxuICAgICAgYWZ0ZXJMb2FkLmNhbGwodGhpcyk7XHJcbiAgICAgIGltZy5vbmxvYWQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX19sb2FkZWRIYXNoW2tleV0gPSBpbWc7XHJcblxyXG4gICAgaWYoZm9ybWF0KVxyXG4gICAgICB0aGlzLl9fbG9hZGVkSGFzaFtrZXldLnJlc2Zvcm1hdCA9IGZvcm1hdDtcclxuXHJcbiAgICBmdW5jdGlvbiBhZnRlckxvYWQoKXtcclxuICAgICAgdGhpcy5sb2FkQ291bnQtLTtcclxuICAgICAgaWYoIXRoaXMubG9hZENvdW50KVxyXG4gICAgICAgIHRoaXMuY29tcGxldGVDYWxsYmFjayAmJiB0aGlzLmNvbXBsZXRlQ2FsbGJhY2sodGhpcy5fX2xvYWRlZEhhc2gpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsImltcG9ydCBQb2ludCBmcm9tICcuL1BvaW50JztcclxuLyoqXHJcbiAqIHwgYSB8IGIgfCB0eHxcclxuICogfCBjIHwgZCB8IHR5fFxyXG4gKiB8IDAgfCAwIHwgMSB8XHJcbiAqL1xyXG5jbGFzcyBUcmFuc2Zvcm1NYXRyaXh7XHJcbiAgY29uc3RydWN0b3IoKXtcclxuICAgIHRoaXMuYSA9IDE7XHJcbiAgICB0aGlzLmIgPSAwO1xyXG4gICAgdGhpcy5jID0gMDtcclxuICAgIHRoaXMuZCA9IDE7XHJcbiAgICB0aGlzLnR4ID0gMDtcclxuICAgIHRoaXMudHkgPSAwO1xyXG4gICAgdGhpcy5hcnJheSA9IG51bGw7XHJcblxyXG4gIH1cclxuXHJcbiAgc2V0KGEsIGIsIGMsIGQsIHR4LCB0eSl7XHJcbiAgICB0aGlzLmEgPSBhO1xyXG4gICAgdGhpcy5iID0gYjtcclxuICAgIHRoaXMuYyA9IGM7XHJcbiAgICB0aGlzLmQgPSBkO1xyXG4gICAgdGhpcy50eCA9IHR4O1xyXG4gICAgdGhpcy50eSA9IHR5O1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbi8v5a+56LGh5Z2Q5qCH6L2s5o2i5Yiw5LiW55WM5Z2Q5qCHXHJcbiAgYXBwbHkocG9zLCBuZXdQb3Mpe1xyXG4gICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQb2ludCgpO1xyXG5cclxuICAgIGNvbnN0IHggPSBwb3MueDtcclxuICAgIGNvbnN0IHkgPSBwb3MueTtcclxuXHJcbiAgICBuZXdQb3MueCA9ICh0aGlzLmEgKiB4KSArICh0aGlzLmMgKiB5KSArIHRoaXMudHg7XHJcbiAgICBuZXdQb3MueSA9ICh0aGlzLmIgKiB4KSArICh0aGlzLmQgKiB5KSArIHRoaXMudHk7XHJcblxyXG4gICAgcmV0dXJuIG5ld1BvcztcclxuICB9XHJcblxyXG4vL+S7juS4lueVjOWdkOagh+i9rOS4uuWvueixoeWdkOagh1xyXG4gIGFwcGx5SW52ZXJzZShwb3MsIG5ld1Bvcyl7XHJcbiAgICBuZXdQb3MgPSBuZXdQb3MgfHwgbmV3IFBvaW50KCk7XHJcblxyXG4gICAgY29uc3QgaWQgPSAxIC8gKCh0aGlzLmEgKiB0aGlzLmQpICsgKHRoaXMuYyAqIC10aGlzLmIpKTtcclxuXHJcbiAgICBjb25zdCB4ID0gcG9zLng7XHJcbiAgICBjb25zdCB5ID0gcG9zLnk7XHJcblxyXG4gICAgbmV3UG9zLnggPSAodGhpcy5kICogaWQgKiB4KSArICgtdGhpcy5jICogaWQgKiB5KSArICgoKHRoaXMudHkgKiB0aGlzLmMpIC0gKHRoaXMudHggKiB0aGlzLmQpKSAqIGlkKTtcclxuICAgIG5ld1Bvcy55ID0gKHRoaXMuYSAqIGlkICogeSkgKyAoLXRoaXMuYiAqIGlkICogeCkgKyAoKCgtdGhpcy50eSAqIHRoaXMuYSkgKyAodGhpcy50eCAqIHRoaXMuYikpICogaWQpO1xyXG5cclxuICAgIHJldHVybiBuZXdQb3M7XHJcbiAgfVxyXG4gIHRyYW5zbGF0ZSh4LCB5KXtcclxuICAgIHRoaXMudHggKz0geDtcclxuICAgIHRoaXMudHkgKz0geTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHNjYWxlKHgsIHkpe1xyXG4gICAgdGhpcy5hICo9IHg7XHJcbiAgICB0aGlzLmQgKj0geTtcclxuICAgIHRoaXMuYyAqPSB4O1xyXG4gICAgdGhpcy5iICo9IHk7XHJcbiAgICB0aGlzLnR4ICo9IHg7XHJcbiAgICB0aGlzLnR5ICo9IHk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuXHJcbiAgdG9BcnJheSh0cmFuc3Bvc2UsIG91dCl7XHJcbiAgICBpZiAoIXRoaXMuYXJyYXkpe1xyXG4gICAgICAgIHRoaXMuYXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KDkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFycmF5ID0gb3V0IHx8IHRoaXMuYXJyYXk7XHJcblxyXG4gICAgYXJyYXlbMF0gPSB0aGlzLmE7XHJcbiAgICBhcnJheVsxXSA9IHRoaXMuYztcclxuICAgIGFycmF5WzJdID0gdGhpcy50eDtcclxuICAgIGFycmF5WzNdID0gdGhpcy5iO1xyXG4gICAgYXJyYXlbNF0gPSB0aGlzLmQ7XHJcbiAgICBhcnJheVs1XSA9IHRoaXMudHk7XHJcbiAgICBhcnJheVs2XSA9IDA7XHJcbiAgICBhcnJheVs3XSA9IDA7XHJcbiAgICBhcnJheVs4XSA9IDE7XHJcblxyXG4gICAgcmV0dXJuIGFycmF5O1xyXG4gIH1cclxufVxyXG5cclxuVHJhbnNmb3JtTWF0cml4LnN0YXRpY01hdHJpeCA9IG5ldyBUcmFuc2Zvcm1NYXRyaXgoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRyYW5zZm9ybU1hdHJpeDsiLCJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50ZW1pdHRlcjMnO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSAnLi4vdXRpbHMvUG9pbnQnO1xyXG5pbXBvcnQgVHJhbnNmb3JtTWF0cml4IGZyb20gJy4uL3V0aWxzL1RyYW5zZm9ybU1hdHJpeC5qcyc7XHJcblxyXG5sZXQgZ2FtZUlkID0gMDtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VEaXNwbGF5T2JqZWN0IGV4dGVuZHMgRXZlbnRFbWl0dGVye1xyXG4gIGNvbnN0cnVjdG9yKHR5cGUseCx5LHcsaCl7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMuX2lkID0gKytnYW1lSWQ7XHJcblxyXG4gICAgdGhpcy5sb2NhbFRyYW5zZm9ybSA9IG5ldyBUcmFuc2Zvcm1NYXRyaXgoKTtcclxuICAgIHRoaXMud29ybGRUcmFuc2Zvcm0gPSBuZXcgVHJhbnNmb3JtTWF0cml4KCk7XHJcblxyXG4gICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgIHRoaXMubGl2ZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5fZGlydHkgPSB0cnVlO1xyXG4gICAgdGhpcy5wYXJlbnRHcm91cCA9IG51bGw7XHJcbiAgICB0aGlzLl9wb3NpdGlvbiA9IG5ldyBQb2ludCh0aGlzLmNoYW5nZUNhbGxiYWNrLHRoaXMseCB8fCAwLHkgfHwgMCk7XHJcbiAgICB0aGlzLl9hbmNob3IgPSBuZXcgUG9pbnQodGhpcy5jaGFuZ2VDYWxsYmFjayx0aGlzLDAsMCk7XHJcbiAgICB0aGlzLl9zY2FsZSA9IG5ldyBQb2ludCh0aGlzLmNoYW5nZUNhbGxiYWNrLHRoaXMsMSwxKTtcclxuICAgIHRoaXMuX3NrZXcgPSBuZXcgUG9pbnQodGhpcy5jaGFuZ2VDYWxsYmFjayx0aGlzLDAsMCk7XHJcbiAgICB0aGlzLnBpdm90ID0gbmV3IFBvaW50KHRoaXMuY2hhbmdlQ2FsbGJhY2ssdGhpcywwLCAwKTtcclxuICAgIHRoaXMuX2FscGhhRmFjdG9yID0gMTtcclxuICAgIHRoaXMud29ybGRBbHBoYSA9IDE7XHJcbiAgICB0aGlzLl9yb3RhdGlvbiA9IDA7XHJcbiAgICB0aGlzLl9jeCA9IDE7IC8vIGNvcyByb3RhdGlvbiArIHNrZXdZO1xyXG4gICAgdGhpcy5fc3ggPSAwOyAvLyBzaW4gcm90YXRpb24gKyBza2V3WTtcclxuICAgIHRoaXMuX2N5ID0gMDsgLy8gY29zIHJvdGF0aW9uICsgTWF0aC5QSS8yIC0gc2tld1g7XHJcbiAgICB0aGlzLl9zeSA9IDE7IC8vIHNpbiByb3RhdGlvbiArIE1hdGguUEkvMiAtIHNrZXdYO1xyXG4gIH1cclxuXHJcbiAgYW5jaG9yKHgseSl7XHJcbiAgICB0aGlzLl9hbmNob3Iuc2V0KHgseSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG4gIC8qKlxyXG4gICAqIOaXi+i9rOaIluWAvuaWnOaXtuiwg+eUqFxyXG4gICAqXHJcbiAgICovXHJcbiAgdXBkYXRlU2tldygpe1xyXG4gICAgbGV0IGRlZyA9IE1hdGguUEkvIDE4MCAqIHRoaXMuX3JvdGF0aW9uO1xyXG4gICAgdGhpcy5fY3ggPSBNYXRoLmNvcyhkZWcgKyB0aGlzLl9za2V3LnkpO1xyXG4gICAgdGhpcy5fc3ggPSBNYXRoLnNpbihkZWcgKyB0aGlzLl9za2V3LnkpO1xyXG4gICAgdGhpcy5fY3kgPSAtTWF0aC5zaW4oZGVnIC0gdGhpcy5fc2tldy54KTsgLy8gY29zLCBhZGRlZCBQSS8yXHJcbiAgICB0aGlzLl9zeSA9IE1hdGguY29zKGRlZyAtIHRoaXMuX3NrZXcueCk7IC8vIHNpbiwgYWRkZWQgUEkvMlxyXG4gIH1cclxuXHJcbiAgcm90YXRlKGRlZyl7XHJcbiAgICBpZighYXJndW1lbnRzLmxlbmd0aClcclxuICAgICAgcmV0dXJuIHRoaXMuX3JvdGF0aW9uO1xyXG5cclxuICAgIHRoaXMuX3JvdGF0aW9uID0gZGVnO1xyXG4gICAgdGhpcy51cGRhdGVTa2V3KCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBzY2FsZSh4LHkpe1xyXG4gICAgaWYoIWFyZ3VtZW50cy5sZW5ndGgpXHJcbiAgICAgIHJldHVybiB0aGlzLl9zY2FsZTtcclxuXHJcbiAgICB0aGlzLl9zY2FsZS5zZXQoeCx5KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgb3BhY2l0eShmYWN0b3Ipe1xyXG4gICAgdGhpcy5hbHBoYUZhY3RvciA9IGZhY3RvcjtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgcG9zaXRpb24oeCx5KXtcclxuICAgIHRoaXMuX3Bvc2l0aW9uLnNldCh4LHkpO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgc2V0IGFscGhhRmFjdG9yKHZhbHVlKXtcclxuICAgIHRoaXMuX2FscGhhRmFjdG9yID0gdmFsdWU7XHJcbiAgICB0aGlzLmNoYW5nZUNhbGxiYWNrKCk7XHJcbiAgfVxyXG5cclxuICBnZXQgYWxwaGFGYWN0b3IoKXtcclxuICAgIHJldHVybiB0aGlzLl9hbHBoYUZhY3RvcjtcclxuICB9XHJcblxyXG4gIHNldCB4KHZhbHVlKXtcclxuICAgIHRoaXMuX3Bvc2l0aW9uLnggPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGdldCB4KCl7XHJcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb24ueDtcclxuICB9XHJcblxyXG4gIHNldCB5KHZhbHVlKXtcclxuICAgIHRoaXMuX3Bvc2l0aW9uLnkgPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGdldCB5KCl7XHJcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb24ueTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZSgpe1xyXG4gICAgaWYoIXRoaXMuX2RpcnR5KVxyXG4gICAgICByZXR1cm47XHJcbiAgICBsZXQgcGFyZW50VHJhbnNmb3JtID0gVHJhbnNmb3JtTWF0cml4LnN0YXRpY01hdHJpeDtcclxuICAgIHRoaXMud29ybGRBbHBoYSA9IHRoaXMuX2FscGhhRmFjdG9yO1xyXG4gICAgaWYodGhpcy5wYXJlbnRHcm91cCl7XHJcbiAgICAgIHBhcmVudFRyYW5zZm9ybSA9IHRoaXMucGFyZW50R3JvdXAud29ybGRUcmFuc2Zvcm07XHJcbiAgICAgIHRoaXMud29ybGRBbHBoYSAqPSB0aGlzLnBhcmVudEdyb3VwLl9hbHBoYUZhY3RvcjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybShwYXJlbnRUcmFuc2Zvcm0pO1xyXG5cclxuICAgIHRoaXMuX2RpcnR5ID0gZmFsc2U7XHJcbiAgfVxyXG4gIHVwZGF0ZVRyYW5zZm9ybShwYXJlbnRUcmFuc2Zvcm0pe1xyXG4gICAgY29uc3QgbHQgPSB0aGlzLmxvY2FsVHJhbnNmb3JtO1xyXG5cclxuICAgIGx0LmEgPSB0aGlzLl9jeCAqIHRoaXMuX3NjYWxlLng7XHJcbiAgICBsdC5iID0gdGhpcy5fc3ggKiB0aGlzLl9zY2FsZS54O1xyXG4gICAgbHQuYyA9IHRoaXMuX2N5ICogdGhpcy5fc2NhbGUueTtcclxuICAgIGx0LmQgPSB0aGlzLl9zeSAqIHRoaXMuX3NjYWxlLnk7XHJcblxyXG4gICAgbHQudHggPSB0aGlzLl9wb3NpdGlvbi54IC0gKCh0aGlzLnBpdm90LnggKiBsdC5hKSArICh0aGlzLnBpdm90LnkgKiBsdC5jKSk7XHJcbiAgICBsdC50eSA9IHRoaXMuX3Bvc2l0aW9uLnkgLSAoKHRoaXMucGl2b3QueCAqIGx0LmIpICsgKHRoaXMucGl2b3QueSAqIGx0LmQpKTtcclxuXHJcbiAgICBjb25zdCBwdCA9IHBhcmVudFRyYW5zZm9ybTtcclxuICAgIGNvbnN0IHd0ID0gdGhpcy53b3JsZFRyYW5zZm9ybTtcclxuXHJcbiAgICBpZighcHQpXHJcbiAgICAgIHJldHVybjtcclxuXHJcbiAgICB3dC5hID0gKGx0LmEgKiBwdC5hKSArIChsdC5iICogcHQuYyk7XHJcbiAgICB3dC5iID0gKGx0LmEgKiBwdC5iKSArIChsdC5iICogcHQuZCk7XHJcbiAgICB3dC5jID0gKGx0LmMgKiBwdC5hKSArIChsdC5kICogcHQuYyk7XHJcbiAgICB3dC5kID0gKGx0LmMgKiBwdC5iKSArIChsdC5kICogcHQuZCk7XHJcbiAgICB3dC50eCA9IChsdC50eCAqIHB0LmEpICsgKGx0LnR5ICogcHQuYykgKyBwdC50eDtcclxuICAgIHd0LnR5ID0gKGx0LnR4ICogcHQuYikgKyAobHQudHkgKiBwdC5kKSArIHB0LnR5O1xyXG4gIH1cclxuXHJcbiAgY29udGFpbnMocG9pbnQpe1xyXG4gICAgY29uc3QgdGVtcFBvaW50ID0gdGhpcy53b3JsZFRyYW5zZm9ybS5hcHBseUludmVyc2UocG9pbnQpO1xyXG5cclxuICAgIGNvbnN0IHt3LGh9ID0gdGhpcztcclxuXHJcbiAgICBjb25zdCB4MSA9IC13ICogdGhpcy5fYW5jaG9yLng7XHJcblxyXG4gICAgbGV0IHkxID0gMDtcclxuXHJcbiAgICBpZiAodGVtcFBvaW50LnggPiB4MSAmJiB0ZW1wUG9pbnQueCA8IHgxICsgdylcclxuICAgIHtcclxuICAgICAgICB5MSA9IC1oICogdGhpcy5fYW5jaG9yLnk7XHJcblxyXG4gICAgICAgIGlmICh0ZW1wUG9pbnQueSA+IHkxICYmIHRlbXBQb2ludC55IDwgeTEgKyBoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpe1xyXG4gICAgICBjb25zb2xlLmxvZygnY2hlY2tpbmcgZ2FtZU9iamVjdCAnLHRoaXMua2V5LCcgJyx0aGlzLnR5cGUscG9pbnQsJyB3b3JsZCBwb2ludCB0byBvYmogcG9pbnQgJyx0ZW1wUG9pbnQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZGVzdHJveSAoKXtcclxuICAgIGlmKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpe1xyXG4gICAgICBjb25zb2xlLmxvZyhgJHt0aGlzLnR5cGV9OiR7dGhpcy5rZXl9IGlzIGRlc3Ryb3llZGApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2hhbmdlQ2FsbGJhY2sgKCl7XHJcbiAgICB0aGlzLmRpcnR5ID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHNldCBkaXJ0eSh2YWwpe1xyXG4gICAgaWYodGhpcy5fZGlydHkpXHJcbiAgICAgIHJldHVybjtcclxuXHJcbiAgICB0aGlzLl9kaXJ0eSA9IHRydWU7XHJcbiAgICBpZih0aGlzLnBhcmVudEdyb3VwKXtcclxuICAgICAgdGhpcy5wYXJlbnRHcm91cC5kaXJ0eSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBpZih0aGlzLmhhc0NoaWxkKXtcclxuICAgICAgdGhpcy5sb29wQ2hpbGQoKGNoaWxkKT0+e1xyXG4gICAgICAgIGNoaWxkLl9kaXJ0eSA9IHRydWU7XHJcbiAgICAgIH0sbnVsbCk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgdG9TdHJpbmcoKXtcclxuICAgIHJldHVybiBgJHt0aGlzLnR5cGV9OiR7dGhpcy5rZXl9IGluICgke3RoaXMuX3Bvc2l0aW9uLnh9LCAke3RoaXMuX3Bvc2l0aW9uLnl9KSBoYXMgd2lkdGg6JHt0aGlzLnd9IGFuZCBoZWlnaHQgJHt0aGlzLmh9YDtcclxuICB9XHJcbn0iLCJpbXBvcnQgQmFzZURpc3BsYXlPYmplY3QgZnJvbSAnLi9iYXNlRGlzcGxheU9iamVjdC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcHJpdGUgZXh0ZW5kcyBCYXNlRGlzcGxheU9iamVjdHtcclxuICBjb25zdHJ1Y3RvcihnYW1lLHR5cGUsa2V5LHg9MCx5PTAsdyxoKXtcclxuICAgIHN1cGVyKHR5cGUseCx5LHcsaCk7XHJcbiAgICB0aGlzLmtleSA9IGtleTtcclxuICAgIGtleSA9IGtleS5zcGxpdCgnOicpO1xyXG5cclxuICAgIGxldCByZXNvdXJjZSA9IGdhbWUuX3Jlc291cmNlc1trZXlbMF1dLFxyXG4gICAgICAgIHJlc0Zvcm1hdCA9IHJlc291cmNlLnJlc2Zvcm1hdCB8fCB7fSxcclxuICAgICAgICB0YXJnZXRGcmFtZTtcclxuXHJcbiAgICBpZihrZXkubGVuZ3RoID4gMSAmJiByZXNGb3JtYXRba2V5WzFdXSl7XHJcbiAgICAgIHJlc0Zvcm1hdCA9IHJlc0Zvcm1hdFtrZXlbMV1dXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHt4OnN4ID0wLHk6c3k9MCx3OnN3LGg6c2h9ID0gcmVzRm9ybWF0O1xyXG5cclxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICB0aGlzLmZyYW1lID0gcmVzb3VyY2U7XHJcbiAgICB0aGlzLnN3ID0gc3cgfHwgdGhpcy5mcmFtZS53aWR0aCxcclxuICAgIHRoaXMuc2ggPSBzaCB8fCB0aGlzLmZyYW1lLmhlaWdodDtcclxuICAgIHRoaXMuc3ggPSBNYXRoLmFicyhzeCk7XHJcbiAgICB0aGlzLnN5ID0gTWF0aC5hYnMoc3kpO1xyXG4gICAgdGhpcy53ID0gdGhpcy5zdztcclxuICAgIHRoaXMuaCA9IHRoaXMuc2g7XHJcbiAgICB0aGlzLmFscGhhRmFjdG9yID0gMTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpe1xyXG4gICAgbGV0IGN0eCA9IHRoaXMuZ2FtZS5fY3R4O1xyXG4gICAgbGV0IHt4LHl9ID0gdGhpcy5fcG9zaXRpb247XHJcblxyXG5cclxuICAgIGxldCBkeCA9ICgwLjUgLSB0aGlzLl9hbmNob3IueCkgKiB0aGlzLnc7XHJcbiAgICBsZXQgZHkgPSAoMC41IC0gdGhpcy5fYW5jaG9yLnkpICogdGhpcy5oO1xyXG5cclxuICAgIGR4IC09IHRoaXMudyAvIDI7XHJcbiAgICBkeSAtPSB0aGlzLmggLyAyO1xyXG5cclxuICAgIHRoaXMuZ2FtZS5fY3R4LmRyYXdJbWFnZSh0aGlzLmZyYW1lLHRoaXMuc3gsdGhpcy5zeSx0aGlzLnN3LHRoaXMuc2gsZHgsZHksdGhpcy53LHRoaXMuaCApO1xyXG4gIH1cclxuXHJcbiAgZGVzdHJveSAoKSB7XHJcbiAgICB0aGlzLmZyYW1lID0gbnVsbDtcclxuICAgIHRoaXMuZ2FtZSA9IG51bGw7XHJcbiAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgfVxyXG59IiwiaW1wb3J0IEJhc2VEaXNwbGF5T2JqZWN0IGZyb20gJy4vYmFzZURpc3BsYXlPYmplY3QuanMnO1xyXG5pbXBvcnQgU3ByaXRlIGZyb20gJy4vU3ByaXRlLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyb3VwIGV4dGVuZHMgQmFzZURpc3BsYXlPYmplY3R7XHJcbiAgY29uc3RydWN0b3IoZ2FtZSx4PTAseT0wKXtcclxuICAgIHN1cGVyKCdncm91cCcseCx5KTtcclxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICB0aGlzLl9xdWV1ZSA9IFtdO1xyXG4gICAgdGhpcy5oYXNDaGlsZCA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBhZGQoZ2FtZU9iaiwgeCwgeSl7XHJcbiAgICBsZXQga2V5ID0gZ2FtZU9iajtcclxuXHJcbiAgICBpZih0eXBlb2YgZ2FtZU9iaiA9PSAnc3RyaW5nJyl7XHJcbiAgICAgIGdhbWVPYmogPSBuZXcgU3ByaXRlKHRoaXMuZ2FtZSwnaW1nJyxrZXkseCx5KTtcclxuICAgIH1cclxuICAgIGdhbWVPYmoucGFyZW50R3JvdXAgPSB0aGlzO1xyXG4gICAgdGhpcy5fcXVldWUucHVzaChnYW1lT2JqKTtcclxuXHJcbiAgICByZXR1cm4gZ2FtZU9iajtcclxuICB9XHJcbiAgLyoqXHJcbiAgICogQHBhcmFtICB7W3R5cGVdfSAgIHJldmVyc2UgW3doZXRoZXIgdHJhdmVyc2UgZnJvbSBxdWV1ZSB0YWlsIHRvIGhlYWRdXHJcbiAgICovXHJcbiAgY2hpbGRyZW4oY2IscmV2ZXJzZSl7XHJcblxyXG4gICAgaWYocmV2ZXJzZSlcclxuICAgICAgdGhpcy5fcXVldWUucmV2ZXJzZSgpO1xyXG5cclxuICAgIGlmKHR5cGVvZiBjYiAhPSAndW5kZWZpbmVkJyl7XHJcbiAgICAgICAgdGhpcy5fcXVldWUuZXZlcnkoKG51bSxpZHgpPT57XHJcblxyXG4gICAgICAgICAgbGV0IHJldCA9IGNiKG51bSxpZHgpO1xyXG5cclxuICAgICAgICAgIGlmKHJldCA9PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKHJldmVyc2UpXHJcbiAgICAgIHRoaXMuX3F1ZXVlLnJldmVyc2UoKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5fcXVldWU7XHJcbiAgfVxyXG5cclxuICBsb29wQ2hpbGQgKGNiLHBhcmVudCkge1xyXG4gICAgbGV0IGNvbnRhaW5lciA9IHBhcmVudCB8fCB0aGlzO1xyXG4gICAgaWYgKGNvbnRhaW5lci5oYXNDaGlsZCkge1xyXG4gICAgICBjb250YWluZXIuY2hpbGRyZW4oKGNoaWxkT2JqKT0+e1xyXG4gICAgICAgIHRoaXMubG9vcENoaWxkKGNiLGNoaWxkT2JqKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoY29udGFpbmVyICE9PSB0aGlzKXtcclxuICAgICAgY2IoY29udGFpbmVyKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICByZW1vdmUgKHNwcml0ZSkge1xyXG4gICAgdGhpcy5fcXVldWUgPSB0aGlzLl9xdWV1ZS5maWx0ZXIob2JqPT57XHJcbiAgICAgIHJldHVybiBvYmogIT09IHNwcml0ZTtcclxuICAgIH0pO1xyXG4gICAgc3ByaXRlLmRlc3Ryb3koKTtcclxuICB9XHJcblxyXG4gIGRlc3Ryb3kgKCkge1xyXG4gICAgdGhpcy5fcXVldWUgPSBudWxsO1xyXG4gICAgdGhpcy5nYW1lID0gbnVsbDtcclxuICAgIHN1cGVyLmRlc3Ryb3koKTtcclxuICB9XHJcbiAgZ2V0IGNoaWxkQ291bnQoKXtcclxuICAgIHJldHVybiB0aGlzLl9xdWV1ZS5sZW5ndGg7XHJcbiAgfVxyXG59IiwiaW1wb3J0IFNwcml0ZSBmcm9tICcuL1Nwcml0ZS5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcHJpdGVTaGVldCBleHRlbmRzIFNwcml0ZXtcclxuICBjb25zdHJ1Y3RvcihnYW1lLGtleSx4PTAseT0wLHcsaCxvcHRpb25zPXt9KXtcclxuICAgIHN1cGVyKGdhbWUsJ3Nwcml0ZXNoZWV0JyxrZXkseCx5LHcsaCk7XHJcblxyXG4gICAgdGhpcy5wcmVmaXggPSBvcHRpb25zLnByZWZpeDtcclxuICAgIHRoaXMuZmlyc3RJbmRleCA9IG9wdGlvbnMuZmlyc3RJbmRleDtcclxuICAgIHRoaXMubGFzdEluZGV4ID0gb3B0aW9ucy5sYXN0SW5kZXg7XHJcbiAgICB0aGlzLnNwZiA9IDEwMDAgLyBvcHRpb25zLmZwcztcclxuICAgIHRoaXMuX2ZyYW1lSW5kZXggPSB0aGlzLmZpcnN0SW5kZXg7XHJcbiAgICB0aGlzLmxvb3AgPSB0cnVlO1xyXG4gICAgdGhpcy5sYXN0VGltZSA9IC1JbmZpbml0eTtcclxuICAgIGxldCByZXNvdXJjZSA9IGdhbWUuX3Jlc291cmNlc1trZXldO1xyXG5cclxuICAgIGlmKCFyZXNvdXJjZSAmJiAnX0RFVl8nICE9PSAncHJvZHVjdGlvbicpe1xyXG4gICAgICBjb25zb2xlLmVycm9yKGtleSArICcg5rKh5pyJ5a+55bqU55qE6LWE5rqd5Zu+54mHJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlc0Zvcm1hdCA9IHJlc291cmNlLnJlc2Zvcm1hdCB8fCB7fTtcclxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUodGltZXN0YW1wLHBhc3NlZFRpbWUpe1xyXG5cclxuICAgIGxldCBmcmFtZUlkeCA9IHRoaXMuX2ZyYW1lSW5kZXg7XHJcblxyXG4gICAgaWYodGltZXN0YW1wIC0gdGhpcy5sYXN0VGltZSA+PSB0aGlzLnNwZil7XHJcbiAgICAgIHRoaXMubGFzdFRpbWUgPSB0aW1lc3RhbXA7XHJcbiAgICAgIGlmKCsrdGhpcy5fZnJhbWVJbmRleCA+IHRoaXMubGFzdEluZGV4KXtcclxuICAgICAgICBpZih0aGlzLm9wdGlvbnMuYW5pbWF0ZUVuZCAmJiB0aGlzLm9wdGlvbnMuYW5pbWF0ZUVuZCh0aGlzKSB8fCAhdGhpcy5sb29wKXtcclxuICAgICAgICAgIHRoaXMuX2ZyYW1lSW5kZXggLS07XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2ZyYW1lSW5kZXggPSB0aGlzLmZpcnN0SW5kZXg7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdXBlci51cGRhdGUoKTtcclxuXHJcbiAgICBsZXQge3g6c3ggPTAseTpzeT0wLHc6c3csaDpzaH0gPSB0aGlzLnJlc0Zvcm1hdFt0aGlzLnByZWZpeCArIGZyYW1lSWR4XTtcclxuXHJcbiAgICB0aGlzLncgPSB0aGlzLnN3ID0gc3csXHJcbiAgICB0aGlzLmggPSB0aGlzLnNoID0gc2g7XHJcbiAgICB0aGlzLnN4ID0gTWF0aC5hYnMoc3gpO1xyXG4gICAgdGhpcy5zeSA9IE1hdGguYWJzKHN5KTtcclxuICB9XHJcbi8qKlxyXG4gKiBbcGxheSBkZXNjcmlwdGlvbl1cclxuICogQHBhcmFtICB7W3N0cmluZ119ICAgIHR5cGUgICAgICBhZGQ65bCGaWTliqDov5vlvZPliZ3mkq3mlL7lup3liJfkuK0gcmVwbGFjZTrkvb/nlKjkvKDov5vnmoRJROabv+adouW9k+WJneaJgOacieW6neWIl1xyXG4gKiBAcGFyYW0gIHsuLi5bdHlwZV19IGZyYW1lSWR4cyAg6Iul5piv6Kad5Yqg6L+b5b2T5Ymd5bqd5YiX77yM5YiZaWTlgLzlv4XpobvlnKjlvZPliZ3nmoTlup3liJflgLzkuIrpgJLlop5cclxuICogQHJldHVybiB7W3R5cGVdfSAgICDlvZPliZ3lr7nosaFcclxuICovXHJcbiAgcGxheSAodHlwZSwuLi5mcmFtZUlkeHMpIHtcclxuXHJcbiAgICBmcmFtZUlkeHMuc29ydCgocHJlLGFmdGVyKT0+e1xyXG4gICAgICByZXR1cm4gcHJlIDwgYWZ0ZXI7XHJcbiAgICB9KVxyXG5cclxuICAgIHRoaXMubGFzdEluZGV4ID0gZnJhbWVJZHhzWzBdO1xyXG5cclxuICAgIGlmICh0eXBlID09ICdyZXBsYWNlJykge1xyXG4gICAgICB0aGlzLmZpcnN0SW5kZXggPSBmcmFtZUlkeHNbZnJhbWVJZHhzLmxlbmd0aC0xXTtcclxuICAgICAgdGhpcy5fZnJhbWVJbmRleCA9IHRoaXMuZmlyc3RJbmRleDtcclxuICAgIH1cclxuICAgIHRoaXMubG9vcCA9IGZhbHNlO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59IiwiaW1wb3J0IEJhc2VEaXNwbGF5T2JqZWN0IGZyb20gJy4vYmFzZURpc3BsYXlPYmplY3QuanMnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaXJ0dWFsRGlzcGxheSBleHRlbmRzIEJhc2VEaXNwbGF5T2JqZWN0e1xyXG5cclxuICBjb25zdHJ1Y3RvcihnYW1lLGtleSx4LHksdyxoKXtcclxuICAgIHN1cGVyKCd2aXJ0dWFsRGlzcGxheScseCx5KTtcclxuICAgIHRoaXMudyA9IHc7XHJcbiAgICB0aGlzLmggPSBoO1xyXG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcclxuICAgIHRoaXMua2V5ID0ga2V5O1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCl7XHJcbiAgICAvL+epuuWHveaVsFxyXG4gIH1cclxufSIsIlwidXNlIHN0cmljdFwiO1xyXG5pbXBvcnQgdG9vbHMgZnJvbSAnLi91dGlscy90b29scy5qcyc7XHJcbmltcG9ydCBUd2VlbkFjdGlvbiBmcm9tICcuL2FuaW1hdGUvdHdlZW5BY3Rpb24uanMnO1xyXG5pbXBvcnQgUmVuZGVyIGZyb20gJy4vUmVuZGVyLmpzJztcclxuaW1wb3J0IEV2ZW50TWFuYWdlciAgZnJvbSAnLi9ldmVudC9ldmVudC5qcyc7XHJcbmltcG9ydCBsb2FkZXIgZnJvbSAnLi91dGlscy9sb2FkZXIuanMnO1xyXG5pbXBvcnQgR3JvdXAgZnJvbSAnLi9kaXNwbGF5L2dyb3VwLmpzJztcclxuaW1wb3J0IFNwcml0ZSBmcm9tICcuL2Rpc3BsYXkvU3ByaXRlLmpzJztcclxuaW1wb3J0IFNwcml0ZVNoZWV0IGZyb20gJy4vZGlzcGxheS9zcHJpdGVTaGVldC5qcyc7XHJcbmltcG9ydCBWaXJ0dWFsRGlzcGxheSBmcm9tICcuL2Rpc3BsYXkvdmlydHVhbERpc3BsYXkuanMnO1xyXG5cclxubGV0IG5vb3AgPSBmdW5jdGlvbigpe31cclxuXHJcbmNvbnN0IERlYWZ1bHRTZXR0aW5ncyA9IHtcclxuICBjb250YWluZXI6ICcuY2FudmFzLWNvbnRhaW5lcicsXHJcbiAgcHJlbG9hZDogbm9vcCxcclxuICBjcmVhdGU6IG5vb3AsXHJcbiAgdXBkYXRlOiBub29wLFxyXG4gIGRlc3Ryb3k6IG5vb3BcclxufVxyXG5cclxuY2xhc3MgUGljYXNzbyBleHRlbmRzIFR3ZWVuQWN0aW9ue1xyXG5cclxuICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcclxuICAgIHN1cGVyKCk7XHJcbiAgICBsZXQgc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LERlYWZ1bHRTZXR0aW5ncyxvcHRpb25zKTtcclxuICAgIHRoaXMub3B0aW9ucyA9IHNldHRpbmdzO1xyXG5cclxuICAgIHRoaXMud2lkdGggPSBvcHRpb25zLndpZHRoO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcclxuXHJcbiAgICB0aGlzLmxvYWRlciA9IG5ldyBsb2FkZXIodGhpcy5jcmVhdGUuYmluZCh0aGlzKSk7XHJcbiAgICB0aGlzLmdhbWVPYmplY3RzID0gbmV3IEdyb3VwKHRoaXMsMCwwKTtcclxuICAgIHRoaXMudXBkYXRlVGFzayA9IFtdO1xyXG5cclxuICAgIHRoaXMuaW5pdFR3ZWVuKCk7XHJcbiAgICB0aGlzLmNyZWF0ZUNhdmFzKHNldHRpbmdzKTtcclxuICAgIHRoaXMucHJlVXBkYXRlKHNldHRpbmdzKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZUNhdmFzKG9wdGlvbnMpe1xyXG4gICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICBsZXQgd29ybGRXaWR0aCA9IHRoaXMuY2xpZW50V2lkdGg7XHJcblxyXG4gICAgaWYob3B0aW9ucy5pbml0Q2x6eilcclxuICAgICAgY2FudmFzLmNsYXNzTGlzdC5hZGQob3B0aW9ucy5pbml0Q2x6eik7XHJcblxyXG4gICAgY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcclxuICAgIGNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcclxuXHJcbiAgICBjdHguaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gdHJ1ZTtcclxuICAgIHRoaXMuX3NjYWxlUmVzID0gd29ybGRXaWR0aCAvIHRoaXMud2lkdGg7XHJcblxyXG4gICAgdGhpcy5fY3R4ID0gY3R4O1xyXG4gICAgdGhpcy52aWV3RWxlbWVudCA9IGNhbnZhcztcclxuXHJcbiAgICBjYW52YXMuc3R5bGUud2lkdGggPSB3b3JsZFdpZHRoICsgJ3B4JztcclxuICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCAqIHRoaXMuX3NjYWxlUmVzICsgJ3B4JztcclxuXHJcbiAgICAvLyB0aGlzLmV2ZW50TWFuYWdlciA9IG5ldyBFdmVudE1hbmFnZXIodGhpcyk7IFRPRE86dGVzdFxyXG5cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iob3B0aW9ucy5jb250YWluZXIpLmFwcGVuZENoaWxkKGNhbnZhcyk7XHJcbiAgfVxyXG5cclxuICBwcmVVcGRhdGUob3B0aW9ucyl7XHJcbiAgICBvcHRpb25zLnByZWxvYWQuY2FsbCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZShkYXRhcyl7XHJcbiAgICB0aGlzLl9yZXNvdXJjZXMgPSB0aGlzLl9yZXNvdXJjZXMgfHwgZGF0YXM7XHJcbiAgICB0aGlzLm9wdGlvbnMuY3JlYXRlLmNhbGwodGhpcyx0aGlzLl9yZXNvdXJjZXMpO1xyXG5cclxuICAgIHRoaXMubWFpbkxvb3AoKTtcclxuICB9XHJcblxyXG4gIGRlc3Ryb3kgKCkge1xyXG4gICAgdGhpcy5nYW1lT2JqZWN0cy5sb29wQ2hpbGQoKGNoaWxkKT0+e1xyXG4gICAgICBjaGlsZC5kZXN0cm95KCk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMuZ2FtZU9iamVjdHMgPSBuZXcgR3JvdXAodGhpcywwLDApO1xyXG5cclxuICAgIHRoaXMub3B0aW9ucy5kZXN0cm95LmNhbGwodGhpcyx0aGlzLl9yZXNvdXJjZXMpO1xyXG4gIH1cclxuXHJcbiAgcmVzdGFydCAoKSB7XHJcbiAgICB0aGlzLmRlc3Ryb3koKTtcclxuICAgIHRoaXMuY3JlYXRlKCk7XHJcbiAgfVxyXG5cclxuICBjbGVhciAoKSB7XHJcbiAgICB0aGlzLmlzRGVzdHJveSA9IHRydWU7XHJcbiAgICB0aGlzLmRlc3Ryb3koKTtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5vcHRpb25zLmNvbnRhaW5lcikucmVtb3ZlQ2hpbGQodGhpcy52aWV3RWxlbWVudCk7XHJcbiAgICB0aGlzLnZpZXdFbGVtZW50ID1udWxsO1xyXG4gIH1cclxuXHJcbiAgZHJhdyh0eXBlLGRhdGEseCx5LHcsaCxvcHRpb25zKXtcclxuICAgIGxldCBkcmF3T2JqO1xyXG4gICAgc3dpdGNoKHR5cGUpe1xyXG4gICAgICBjYXNlICdpbWcnOlxyXG4gICAgICAgIGRyYXdPYmogPSBuZXcgU3ByaXRlKHRoaXMsJ2ltZycsZGF0YSx4LHksdyxoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnc3ByaXRlc2hlZXQnOlxyXG4gICAgICAgIGRyYXdPYmogPSBuZXcgU3ByaXRlU2hlZXQodGhpcyxkYXRhLHgseSx3LGgsb3B0aW9ucyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2dyYXBoaWNzJzpcclxuICAgICAgICBkcmF3T2JqID0gbmV3IEdyYXBoaWNzKHRoaXMsZGF0YSx4KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAndmlydHVhbCc6XHJcbiAgICAgICAgLy9ub3cgdGhlIGRhdGEgaXMgeFxyXG4gICAgICAgIGRyYXdPYmogPSBuZXcgVmlydHVhbERpc3BsYXkodGhpcyxkYXRhLHgseSx3LGgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgaWYocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyl7XHJcbiAgICAgIGNvbnNvbGUuZGVidWcoJ2NyZWF0ZSBnYW1lT2JqZWN0ICcgKyBkcmF3T2JqKTtcclxuICAgIH1cclxuICAgIHRoaXMuYWRkU3ByaXRlKGRyYXdPYmopO1xyXG4gICAgcmV0dXJuIGRyYXdPYmo7XHJcbiAgfVxyXG5cclxuICBncm91cCh4LHkpe1xyXG4gICAgbGV0IG5ld0dyb3VwcyA9IG5ldyBHcm91cCh0aGlzLHgseSk7XHJcblxyXG4gICAgdGhpcy5hZGRTcHJpdGUobmV3R3JvdXBzKTtcclxuXHJcbiAgICByZXR1cm4gbmV3R3JvdXBzO1xyXG4gIH1cclxuXHJcbiAgYWRkU3ByaXRlKGdhbWVPYmope1xyXG4gICAgdGhpcy5nYW1lT2JqZWN0cy5hZGQoZ2FtZU9iaik7XHJcbiAgfVxyXG5cclxuICByZW1vdmUgKHNwcml0ZSkge1xyXG4gICAgdGhpcy5nYW1lT2JqZWN0cy5yZW1vdmUoc3ByaXRlKTtcclxuICB9XHJcblxyXG4gIGdldCBjbGllbnRXaWR0aCgpe1xyXG4gICAgcmV0dXJuIE1hdGgubWF4KHdpbmRvdy5pbm5lcldpZHRoLCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGNsaWVudEhlaWdodCgpe1xyXG4gICAgcmV0dXJuIE1hdGgubWF4KHdpbmRvdy5pbm5lckhlaWdodCwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCk7XHJcbiAgfVxyXG5cclxuICBhZGRVcGRhdGVUYXNrKHRhc2spe1xyXG4gICAgdGhpcy51cGRhdGVUYXNrLnB1c2godGFzayk7XHJcbiAgfVxyXG5cclxuICBtYWluTG9vcCgpe1xyXG4gICAgbGV0IGNvdW50PTEwO1xyXG5cclxuICAgIGxldCBiZWdpblRpbWUgPSB0b29scy5nZXRUaW1lKCk7XHJcblxyXG4gICAgbGV0IF9pbm5lckxvb2cgPSAoKT0+e1xyXG5cclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0aW1lc3RhbXApPT57XHJcblxyXG4gICAgICAgIGlmKHRoaXMuaXNEZXN0cm95KVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZighdGhpcy5wYXNzZWRUaW1lKVxyXG4gICAgICAgICAgdGhpcy5wYXNzZWRUaW1lID0gdG9vbHMuZ2V0VGltZSgpIC0gYmVnaW5UaW1lO1xyXG5cclxuICAgICAgICB0aGlzLnRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcclxuXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnVwZGF0ZS5jYWxsKHRoaXMsdGltZXN0YW1wLCB0aGlzLnBhc3NlZFRpbWUpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVRhc2suZm9yRWFjaCgodGFzayk9PntcclxuICAgICAgICAgIHRhc2suY2FsbCh0aGlzLHRpbWVzdGFtcCwgdGhpcy5wYXNzZWRUaW1lKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBSZW5kZXIucmVuZGVyVmlldyh0aGlzKTtcclxuXHJcbiAgICAgICAgX2lubmVyTG9vZygpO1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIF9pbm5lckxvb2coKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBpY2Fzc287XHJcbiIsIm1vZHVsZS5leHBvcnRzPXtzb3VuZDp7eDotNzA2LHk6LTUwNyx3OjY0LGg6Nzh9LHRob3VnaHRzOnt4OjAseTowLHc6OTk2LGg6NTA0fSx3b3JkOnt4OjAseTotNTA3LHc6NzAzLGg6NDExfX0iLCJtb2R1bGUuZXhwb3J0cz17d3JfMTp7eDowLHk6MCx3OjI0MCxoOjMzMH0sd3JfMjp7eDotMjQzLHk6MCx3OjI0MCxoOjMzMH0sd3JfMzp7eDotNDg2LHk6MCx3OjI0MCxoOjMzMH0sd3JfNDp7eDowLHk6LTMzMyx3OjI0MCxoOjMzMH0sd3JfNTp7eDotMjQzLHk6LTMzMyx3OjI0MCxoOjMzMH0sd3JfNjp7eDotNDg2LHk6LTMzMyx3OjI0MCxoOjMzMH0sd3JfNzp7eDotNzI5LHk6MCx3OjI0MCxoOjMzMH0sd3JfODp7eDotNzI5LHk6LTMzMyx3OjI0MCxoOjMzMH19IiwibW9kdWxlLmV4cG9ydHM9e3d1XzE6e3g6LTI0Myx5OjAsdzoyNDAsaDozMzB9LHd1XzEwOnt4Oi03MjkseTotMzMzLHc6MjQwLGg6MzMwfSx3dV8xMTp7eDotNDg2LHk6MCx3OjI0MCxoOjMzMH0sd3VfMTI6e3g6MCx5Oi0zMzMsdzoyNDAsaDozMzB9LHd1XzEzOnt4Oi0yNDMseTotMzMzLHc6MjQwLGg6MzMwfSx3dV8xNDp7eDotNDg2LHk6LTMzMyx3OjI0MCxoOjMzMH0sd3VfMTU6e3g6LTcyOSx5OjAsdzoyNDAsaDozMzB9LHd1XzI6e3g6MCx5OjAsdzoyNDAsaDozMzB9LHd1XzM6e3g6LTk3Mix5OjAsdzoyNDAsaDozMzB9LHd1XzQ6e3g6LTk3Mix5Oi0zMzMsdzoyNDAsaDozMzB9LHd1XzU6e3g6MCx5Oi02NjYsdzoyNDAsaDozMzB9LHd1XzY6e3g6LTI0Myx5Oi02NjYsdzoyNDAsaDozMzB9LHd1Xzc6e3g6LTQ4Nix5Oi02NjYsdzoyNDAsaDozMzB9LHd1Xzg6e3g6LTcyOSx5Oi02NjYsdzoyNDAsaDozMzB9LHd1Xzk6e3g6LTk3Mix5Oi02NjYsdzoyNDAsaDozMzB9fSIsImltcG9ydCBQaWNhc3NvIGZyb20gJy4uLy4uL3NyYy9waWNhc3NvLmpzJztcclxuaW1wb3J0IHdvcmRTcHJpdGVEYXRhIGZyb20gJy4vZGF0YS93b3Jkc3ByaXRlLmpzJztcclxuaW1wb3J0IHdvcmtSaWdodERhdGFzIGZyb20gJy4vZGF0YS93cnMuanMnO1xyXG5pbXBvcnQgd29ya1VwRGF0YXMgZnJvbSAnLi9kYXRhL3d1cy5qcyc7XHJcblxyXG5sZXQgZmlyc3RMdkdhbWUgPSB7XHJcbiAgaXNTdGFydDogZmFsc2UsXHJcbiAgcGxheUNvdW50OjAsXHJcbiAgc3RhcnQoQXBwKXtcclxuICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgIFxyXG4gICAgdGhpcy5pc1N0YXJ0ID0gdHJ1ZTtcclxuICAgIHRoaXMuZ2FtZSA9IG5ldyBQaWNhc3NvKHtcclxuICAgICAgd2lkdGg6IDE5MjAsXHJcbiAgICAgIGhlaWdodDoxMDgwLFxyXG4gICAgICBwcmVsb2FkKCl7XHJcbiAgICAgICAgdGhpcy5sb2FkZXIubG9hZEltZygnYmcnLCcuL2ltZ3MvYmcucG5nJyk7XHJcbiAgICAgICAgdGhpcy5sb2FkZXIubG9hZEltZygnbHVyZW4nLCcuL2ltZ3MvbHVyZW4ucG5nJyk7XHJcbiAgICAgICAgdGhpcy5sb2FkZXIubG9hZEltZygnbWFza01laXp1JywnLi9pbWdzL21hc2sucG5nJyk7XHJcbiAgICAgICAgdGhpcy5sb2FkZXIubG9hZEltZygnYXJyb3cnLCcuL2ltZ3MvYXJyb3cucG5nJyk7XHJcbiAgICAgICAgdGhpcy5sb2FkZXIubG9hZEltZygnd29yZFNwcml0ZScsJy4vaW1ncy93b3Jkc3ByaXRlLnBuZycsd29yZFNwcml0ZURhdGEpO1xyXG4gICAgICAgIHRoaXMubG9hZGVyLmxvYWRJbWcoJ3hpYW83JywnLi9pbWdzL3hpYW83LnBuZycpO1xyXG4gICAgICAgIHRoaXMubG9hZGVyLmxvYWRJbWcoJ3dvcmtSaWdodCcsJy4vaW1ncy93cnMucG5nJyx3b3JrUmlnaHREYXRhcyk7XHJcbiAgICAgICAgdGhpcy5sb2FkZXIubG9hZEltZygnd29ya1VwJywnLi9pbWdzL3d1cy5wbmcnLHdvcmtVcERhdGFzKTtcclxuICAgICAgfSxcclxuICAgICAgY3JlYXRlKGRhdGFzKXtcclxuICAgICAgICB0aGlzLmRyYXcoJ2ltZycsJ2JnJywwLDApO1xyXG5cclxuICAgIC8v5bem6L656Zif5YiXXHJcbiAgICAgICAgbGV0IGx1cmVuR3JvdXAgPSB0aGlzLmdyb3VwKDExMDAsNDIwKTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBpID0wO2k8IDU7aSsrKXtcclxuICAgICAgICAgIGx1cmVuR3JvdXAuYWRkKCdsdXJlbicsLWkqODAsaSo0MCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIC8v5Y+z6L656Zif5YiXXHJcbiAgICAgICAgbGV0IGx1cmVuR3JvdXAyID0gdGhpcy5ncm91cCgxMjUwLDU0MCk7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaSA9MDtpPCA0O2krKyl7XHJcbiAgICAgICAgICBsdXJlbkdyb3VwMi5hZGQoJ2x1cmVuJywtaSo4MCxpKjQwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubHVyZW5Hcm91cCA9IGx1cmVuR3JvdXA7XHJcbiAgICAgICAgdGhpcy5sdXJlbkdyb3VwMiA9IGx1cmVuR3JvdXAyO1xyXG5cclxuICAgIC8v5bem5Lit5Y+z5Y+v54K55Ye7566t5aS0XHJcbiAgICAgICAgbGV0IGFycm93TGVmdCA9IHRoaXMuZHJhdygnaW1nJywnYXJyb3cnLDcwMCw5MDApO1xyXG4gICAgICAgIGxldCBhcnJvd1JpZ2h0ID0gdGhpcy5kcmF3KCdpbWcnLCdhcnJvdycsOTIwLDk1MCk7XHJcblxyXG4gICAgICAgIGFycm93TGVmdC5saXZlZCA9IGZhbHNlO1xyXG4gICAgICAgIGFycm93UmlnaHQubGl2ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5kcmF3KCdpbWcnLCdtYXNrTWVpenUnLDExNTgsMCk7XHJcblxyXG4gICAgICAgIGxldCB4aWFvNyA9IHRoaXMuZHJhdygnaW1nJywneGlhbzcnLDQxMiw2NjYpO1xyXG5cclxuICAgICAgICBsZXQgc2hvcFNvdW5kID0gdGhpcy5ncm91cCgxNTE0LDU1OSkuc2NhbGUoMC41KS5vcGFjaXR5KDApO1xyXG5cclxuICAgICAgICBzaG9wU291bmQuYWRkKCd3b3JkU3ByaXRlOndvcmQnLDAsMCkuYW5jaG9yKDAuNiwxKTtcclxuXHJcbiAgICAgICAgbGV0IHNvdW5kU2hhcGUgPSBzaG9wU291bmQuYWRkKCd3b3JkU3ByaXRlOnNvdW5kJywgLTI1MCwtMjUwKVxyXG5cclxuICAgICAgICBsZXQgeGlhbzdUaG91Z2h0cyA9IHRoaXMuZHJhdygnaW1nJywnd29yZFNwcml0ZTp0aG91Z2h0cycsNDUwLDc1MCkuYW5jaG9yKDAuNCwxKTtcclxuXHJcbiAgICAgICAgeGlhbzdUaG91Z2h0cy5zY2FsZSgwLjUpLm9wYWNpdHkoMCk7XHJcblxyXG4gICAgICAgIGxldCBicm9jYXN0RHVyYXRpb24gPSBzZWxmLnBsYXlDb3VudCA/IDIwMDAgOiAyNTAwO1xyXG5cclxuICAgICAgICBsZXQgc2hvcEJyb2Nhc3RUd2VlbiA9IHRoaXMudHdlZW4oc2hvcFNvdW5kLHsnc2NhbGUueCc6MSwnc2NhbGUueSc6MSxvcGFjaXR5OjF9LDUwMCkuZWFzaW5nKHRoaXMuVFdFRU4uRWFzaW5nLkN1YmljLkluT3V0KS5kZWxheSgxMDAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBlYXQoMSkucmVwZWF0RGVsYXkoYnJvY2FzdER1cmF0aW9uKS55b3lvKHRydWUpO1xyXG5cclxuICAgICAgICBsZXQgeGlhbzdUaG91Z3RUd2VlbiA9IHRoaXMudHdlZW4oeGlhbzdUaG91Z2h0cyx7J3NjYWxlLngnOjEsJ3NjYWxlLnknOjEsb3BhY2l0eToxfSw1MDApLmVhc2luZyh0aGlzLlRXRUVOLkVhc2luZy5DdWJpYy5Jbk91dCkuZGVsYXkoMTAwMClcclxuICAgICAgICAgICAgICAgIC5yZXBlYXQoMSkucmVwZWF0RGVsYXkoYnJvY2FzdER1cmF0aW9uKS55b3lvKHRydWUpXHJcbiAgICAgICAgICAgICAgICAub25Db21wbGV0ZSgoKT0+e1xyXG4gICAgICAgICAgICAgICAgICBhcnJvd0xlZnQubGl2ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICBhcnJvd1JpZ2h0LmxpdmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgbmV0QmFyLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgbHVyZW5Hcm91cC5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgIGx1cmVuR3JvdXAyLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgdGhpcy50d2VlbihhcnJvd1JpZ2h0LHsncG9zLngnOjk1MCwncG9zLnknOjkzMH0sNTAwKS5yZXBlYXQoSW5maW5pdHkpLnJlcGVhdERlbGF5KDEwMCkueW95byh0cnVlKS5zdGFydCgpO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnR3ZWVuKGFycm93TGVmdCx7J3Bvcy54Jzo3MzAsJ3Bvcy55Jzo4ODB9LDUwMCkucmVwZWF0KEluZmluaXR5KS5yZXBlYXREZWxheSgxMDApLnlveW8odHJ1ZSkuc3RhcnQoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnR3ZWVuKHNvdW5kU2hhcGUse29wYWNpdHk6MH0sNTApLmRlbGF5KDE1MDApLnJlcGVhdCgxMCkucmVwZWF0RGVsYXkoNTAwKS55b3lvKHRydWUpLnN0YXJ0KCk7XHJcblxyXG4gICAgICAgIHNob3BCcm9jYXN0VHdlZW4uY2hhaW4oeGlhbzdUaG91Z3RUd2Vlbikuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgYXJyb3dMZWZ0LmludGVyYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgW2x1cmVuR3JvdXAsYXJyb3dMZWZ0XS5mb3JFYWNoKGl0ZW09PntcclxuICAgICAgICAgIGl0ZW0ub25jZSgndGFwJywoZXZ0KT0+e1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZShhcnJvd1JpZ2h0KTtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUoYXJyb3dMZWZ0KTtcclxuICAgICAgICAgICAgbHVyZW5Hcm91cDIuaW50ZXJhY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgbGV0IHdhbGtSaWdodHNoZWV0ID0gdGhpcy5kcmF3KCdzcHJpdGVzaGVldCcsJ3dvcmtSaWdodCcsNDEyLDYyMCxudWxsLG51bGwse1xyXG4gICAgICAgICAgICAgICAgcHJlZml4OiAnd3JfJyxcclxuICAgICAgICAgICAgICAgIGZpcnN0SW5kZXg6IDEsXHJcbiAgICAgICAgICAgICAgICBsYXN0SW5kZXg6IDYsXHJcbiAgICAgICAgICAgICAgICBmcHM6IDhcclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHdlZW4od2Fsa1JpZ2h0c2hlZXQseydwb3MueCc6NjQ2LCdwb3MueSc6IDYwNn0sMTAwMCkub25Db21wbGV0ZSgoKT0+e1xyXG5cclxuICAgICAgICAgICAgICB3YWxrUmlnaHRzaGVldC5wbGF5KCdyZXBsYWNlJyw3LDgpO1xyXG5cclxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgICAgICAgICAgICBmaXJzdExldmVsLnBlb3BsZTJXYWxrKHRoaXMsdGhpcy5sdXJlbkdyb3VwMiwoKT0+e1xyXG4gICAgICAgICAgICAgICAgICBBcHAuZG9GYWlsKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgfSw1MDApO1xyXG5cclxuICAgICAgICAgICAgfSkuc3RhcnQoKTtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUoeGlhbzcpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFycm93UmlnaHQuaW50ZXJhY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgICAgICBbbHVyZW5Hcm91cDIsYXJyb3dSaWdodF0uZm9yRWFjaChpdGVtPT57XHJcbiAgICAgICAgICBpdGVtLm9uY2UoJ3RhcCcsKGV2dCk9PntcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUoYXJyb3dSaWdodCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKGFycm93TGVmdCk7XHJcbiAgICAgICAgICAgIGx1cmVuR3JvdXAuaW50ZXJhY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgbGV0IHdhbGtSaWdodHNoZWV0ID0gdGhpcy5kcmF3KCdzcHJpdGVzaGVldCcsJ3dvcmtSaWdodCcsNDEyLDYyMCxudWxsLG51bGwse1xyXG4gICAgICAgICAgICAgICAgcHJlZml4OiAnd3JfJyxcclxuICAgICAgICAgICAgICAgIGZpcnN0SW5kZXg6IDEsXHJcbiAgICAgICAgICAgICAgICBsYXN0SW5kZXg6IDYsXHJcbiAgICAgICAgICAgICAgICBmcHM6IDhcclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHdlZW4od2Fsa1JpZ2h0c2hlZXQseydwb3MueCc6OTAwLCdwb3MueSc6IDY2Nn0sMjAwMCkub25Db21wbGV0ZSgoKT0+e1xyXG4gICAgICAgICAgICAgIHdhbGtSaWdodHNoZWV0LnBsYXkoJ3JlcGxhY2UnLDcsOCk7XHJcblxyXG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuXHJcbiAgICAgICAgICAgICAgICBmaXJzdExldmVsLnBlb3BsZVdhbGsodGhpcyx0aGlzLmx1cmVuR3JvdXAsKCk9PntcclxuICAgICAgICAgICAgICAgICAgQXBwLmRvRmFpbCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSw1MDApO1xyXG5cclxuICAgICAgICAgICAgfSkuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKHhpYW83KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsZXQgbmV0QmFyID0gdGhpcy5kcmF3KCd2aXJ0dWFsJywnbmV0YmFyJywzODUsMCwzMTYsMzM1KTtcclxuXHJcbiAgICAgICAgbmV0QmFyLm9uY2UoJ3RhcCcsKGV2dCk9PntcclxuICAgICAgICAgIHRoaXMucmVtb3ZlKGFycm93UmlnaHQpO1xyXG4gICAgICAgICAgdGhpcy5yZW1vdmUoYXJyb3dMZWZ0KTtcclxuXHJcbiAgICAgICAgICBsZXQgd2Fsa1Vwc2hlZXQgPSB0aGlzLmRyYXcoJ3Nwcml0ZXNoZWV0Jywnd29ya1VwJyw0MTIsNjIwLG51bGwsbnVsbCx7XHJcbiAgICAgICAgICAgICAgcHJlZml4OiAnd3VfJyxcclxuICAgICAgICAgICAgICBmaXJzdEluZGV4OiAxLFxyXG4gICAgICAgICAgICAgIGxhc3RJbmRleDogMTQsXHJcbiAgICAgICAgICAgICAgZnBzOiAxNixcclxuICAgICAgICAgICAgICBhbmltYXRlRW5kOiAoc3ByaXRlKT0+e1xyXG4gICAgICAgICAgICAgICAgc3ByaXRlLmZpcnN0SW5kZXggPSAzO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgdGhpcy50d2Vlbih3YWxrVXBzaGVldCx7J3Bvcy54Jzo0MjAsJ3Bvcy55JzogMTY2fSwyMDAwKS5vbkNvbXBsZXRlKCgpPT57XHJcbiAgICAgICAgICAgIHdhbGtVcHNoZWV0LnBsYXkoJ3JlcGxhY2UnLDE0KTtcclxuICAgICAgICAgICAgQXBwLmRvU3VjY2VzcyhldnQpO1xyXG4gICAgICAgICAgfSkuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgICB0aGlzLnJlbW92ZSh4aWFvNyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9LFxyXG4gICAgICB1cGRhdGUodGltZXN0YW1wLCBwYXNzZWR0aW1lKXtcclxuXHJcbiAgICAgIH0sXHJcbiAgICAgIGRlc3Ryb3koKXtcclxuXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgaWYocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyl7XHJcbiAgICAgIHdpbmRvdy5nYW1lV29ybGQgPSB0aGlzLmdhbWU7XHJcbiAgICB9XHJcbiAgfSxcclxuICByZXN0YXJ0KCl7XHJcbiAgICB0aGlzLnBsYXlDb3VudCA9IDE7XHJcbiAgICB0aGlzLmdhbWUucmVzdGFydCgpO1xyXG4gIH0sXHJcbiAgY2xlYXIoKXtcclxuICAgIHRoaXMuZ2FtZS5jbGVhcigpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmxldCBmaXJzdExldmVsID0ge1xyXG4gIHBlb3BsZVdhbGsocGljYXNzbyxncm91cCwgY2Ipe1xyXG4gICAgbGV0IGJhc2VYID0gMjAwMCxcclxuICAgICAgICBiYXNlWSA9IC03NTAsXHJcbiAgICAgICAgcGFzc1Blb3BsZUNvdW50ID0gMTIsXHJcbiAgICAgICAgcGVyUGVvVGltZSA9IDEwMDAgLyBwYXNzUGVvcGxlQ291bnQsXHJcbiAgICAgICAgaGFzQ29tcGxldGVDb3VudCA9IGdyb3VwLmNoaWxkQ291bnQ7XHJcblxyXG4gICAgZ3JvdXAuY2hpbGRyZW4oKHNwcml0ZSxudW0pPT57XHJcblxyXG4gICAgICBwaWNhc3NvLnR3ZWVuKHNwcml0ZSx7XHJcbiAgICAgICAgICAncG9zLngnOiAobnVtICsgcGFzc1Blb3BsZUNvdW50KSAqIDMwLFxyXG4gICAgICAgICAgJ3Bvcy55JzogLShudW0gKyBwYXNzUGVvcGxlQ291bnQpICogMzBcclxuICAgICAgICB9LDEwMDAgKyBudW0qcGVyUGVvVGltZSwxMDAgKiBudW0pLm9uQ29tcGxldGUoKCk9PntcclxuICAgICAgICAgIGlmKC0taGFzQ29tcGxldGVDb3VudCA8PSAwKVxyXG4gICAgICAgICAgICBjYiAmJiBjYigpO1xyXG4gICAgICAgIH0pLnN0YXJ0KCk7XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIHBlb3BsZTJXYWxrKHBpY2Fzc28sZ3JvdXAsIGNiKXtcclxuICAgIGxldCBwYXNzUGVvcGxlQ291bnQgPSA4LFxyXG4gICAgICAgIHBlclBlb1RpbWUgPSAxMDAwIC8gcGFzc1Blb3BsZUNvdW50LFxyXG4gICAgICAgIGhhc0NvbXBsZXRlQ291bnQgPSBncm91cC5jaGlsZENvdW50O1xyXG5cclxuICAgIGdyb3VwLmNoaWxkcmVuKChzcHJpdGUsbnVtKT0+e1xyXG5cclxuICAgICAgcGljYXNzby50d2VlbihzcHJpdGUse1xyXG4gICAgICAgICAgICAncG9zLngnOiAobnVtICsgcGFzc1Blb3BsZUNvdW50KSAqIDExMCxcclxuICAgICAgICAgICAgJ3Bvcy55JzogLShudW0gKyBwYXNzUGVvcGxlQ291bnQpICogNDBcclxuICAgICAgICAgIH0sMjAwMCArIG51bSpwZXJQZW9UaW1lLDEwMCAqIG51bSkub25Db21wbGV0ZSgoKT0+e1xyXG4gICAgICAgICAgICAgIGlmKC0taGFzQ29tcGxldGVDb3VudCA8PSAwKVxyXG4gICAgICAgICAgICAgICAgY2IgJiYgY2IoKTtcclxuICAgICAgICAgICAgfSkuc3RhcnQoKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgeGlhbzdXb2xrKHBpY2Fzc28sc3ByaXRlKXtcclxuICAgIHBpY2Fzc28udHdlZW4oc3ByaXRlLHsncG9zLngnOiA5MDAscm90YXRlOjQ1fSwxMDAwKS5zdGFydCgpO1xyXG4gIH1cclxufVxyXG5cclxuZmlyc3RMdkdhbWUuc3RhcnQoe1xyXG4gIGRvRmFpbCgpe1xyXG4gICAgY29uc29sZS5sb2coJ2ZhaWwnKTtcclxuICAgIC8vM+enkuWQjumHjeadpVxyXG4gICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICBmaXJzdEx2R2FtZS5yZXN0YXJ0KCk7XHJcbiAgICB9LDMwMDApO1xyXG4gIH0sXHJcbiAgZG9TdWNjZXNzKCl7XHJcbiAgICBjb25zb2xlLmxvZygnc3VjY2VzcycpXHJcbiAgfVxyXG59KTtcclxuIl0sIm5hbWVzIjpbImxldCIsImRlZmluZSIsInRoaXMiLCJjb25zdCIsInRvb2xzIiwicmVxdWlyZSQkMSIsImFyZ3VtZW50cyIsInN1cGVyIiwiRXZlbnRFbWl0dGVyIiwiVHdlZW5BY3Rpb24iLCJ3b3JkU3ByaXRlRGF0YSIsIndvcmtSaWdodERhdGFzIiwid29ya1VwRGF0YXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0FBLElBQUksS0FBSyxHQUFHOztFQUVWLE9BQU8sa0JBQUE7RUFDUDtJQUNFLE9BQU8sQ0FBQyxDQUFDLFdBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7R0FDM0U7O0NBRUYsQ0FBQzs7QUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNEQSxJQUFJLEtBQUssR0FBRyxLQUFLLElBQUksQ0FBQyxZQUFZOztDQUVqQyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7O0NBRWpCLE9BQU87O0VBRU4sTUFBTSxFQUFFLFlBQVk7O0dBRW5CLE9BQU8sT0FBTyxDQUFDOztHQUVmOztFQUVELFNBQVMsRUFBRSxZQUFZOztHQUV0QixPQUFPLEdBQUcsRUFBRSxDQUFDOztHQUViOztFQUVELEdBQUcsRUFBRSxVQUFVLEtBQUssRUFBRTs7R0FFckIsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7R0FFcEI7O0VBRUQsTUFBTSxFQUFFLFVBQVUsS0FBSyxFQUFFOztHQUV4QixJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOztHQUUvQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtJQUNiLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3JCOztHQUVEOztFQUVELE1BQU0sRUFBRSxVQUFVLElBQUksRUFBRSxRQUFRLEVBQUU7O0dBRWpDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7SUFDekIsT0FBTyxLQUFLLENBQUM7SUFDYjs7R0FFRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O0dBRVYsSUFBSSxHQUFHLElBQUksS0FBSyxTQUFTLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7R0FFL0MsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRTs7SUFFMUIsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLFFBQVEsRUFBRTtLQUN4QyxDQUFDLEVBQUUsQ0FBQztLQUNKLE1BQU07S0FDTixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNyQjs7SUFFRDs7R0FFRCxPQUFPLElBQUksQ0FBQzs7R0FFWjtFQUNELENBQUM7O0NBRUYsR0FBRyxDQUFDOzs7OztBQUtMLElBQUksUUFBUSxNQUFNLENBQUMsS0FBSyxXQUFXLElBQUksUUFBUSxPQUFPLENBQUMsS0FBSyxXQUFXLEVBQUU7Q0FDeEUsS0FBSyxDQUFDLEdBQUcsR0FBRyxZQUFZO0VBQ3ZCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7O0VBRzVCLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO0VBQzFDLENBQUM7Q0FDRjs7S0FFSSxJQUFJLFFBQVEsTUFBTSxDQUFDLEtBQUssV0FBVztTQUMvQixNQUFNLENBQUMsV0FBVyxLQUFLLFNBQVM7R0FDdEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEtBQUssU0FBUyxFQUFFOzs7Q0FHeEMsS0FBSyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0NBQzVEOztLQUVJLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxTQUFTLEVBQUU7Q0FDaEMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0NBQ3JCOztLQUVJO0NBQ0osS0FBSyxDQUFDLEdBQUcsR0FBRyxZQUFZO0VBQ3ZCLE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztFQUM1QixDQUFDO0NBQ0Y7OztBQUdELEtBQUssQ0FBQyxLQUFLLEdBQUcsVUFBVSxNQUFNLEVBQUU7O0NBRS9CLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQztDQUNyQixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7Q0FDdEIsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO0NBQ3BCLElBQUksa0JBQWtCLEdBQUcsRUFBRSxDQUFDO0NBQzVCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztDQUNyQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7Q0FDaEIsSUFBSSxnQkFBZ0IsQ0FBQztDQUNyQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7Q0FDbEIsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO0NBQ3ZCLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztDQUN0QixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7Q0FDbkIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO0NBQ3RCLElBQUksZUFBZSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztDQUMvQyxJQUFJLHNCQUFzQixHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO0NBQ3hELElBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQztDQUN4QixJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQztDQUM1QixJQUFJLHFCQUFxQixHQUFHLEtBQUssQ0FBQztDQUNsQyxJQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQztDQUM3QixJQUFJLG1CQUFtQixHQUFHLElBQUksQ0FBQztDQUMvQixJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUM7O0NBRTNCLElBQUksQ0FBQyxFQUFFLEdBQUcsVUFBVSxVQUFVLEVBQUUsUUFBUSxFQUFFOztFQUV6QyxVQUFVLEdBQUcsVUFBVSxDQUFDOztFQUV4QixJQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7R0FDM0IsU0FBUyxHQUFHLFFBQVEsQ0FBQztHQUNyQjs7RUFFRCxPQUFPLElBQUksQ0FBQzs7RUFFWixDQUFDOztDQUVGLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxJQUFJLEVBQUU7O0VBRTVCLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7O0VBRWhCLFVBQVUsR0FBRyxJQUFJLENBQUM7O0VBRWxCLHFCQUFxQixHQUFHLEtBQUssQ0FBQzs7RUFFOUIsVUFBVSxHQUFHLElBQUksS0FBSyxTQUFTLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztFQUNyRCxVQUFVLElBQUksVUFBVSxDQUFDOztFQUV6QixLQUFLLElBQUksUUFBUSxJQUFJLFVBQVUsRUFBRTs7O0dBR2hDLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEtBQUssRUFBRTs7SUFFMUMsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtLQUN0QyxTQUFTO0tBQ1Q7OztJQUdELFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7SUFFeEU7Ozs7R0FJRCxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxTQUFTLEVBQUU7SUFDcEMsU0FBUztJQUNUOzs7R0FHRCxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztHQUUzQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEtBQUssTUFBTSxLQUFLLEVBQUU7SUFDeEQsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQztJQUM5Qjs7R0FFRCxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDOztHQUUzRDs7RUFFRCxPQUFPLElBQUksQ0FBQzs7RUFFWixDQUFDOztDQUVGLElBQUksQ0FBQyxJQUFJLEdBQUcsWUFBWTs7RUFFdkIsSUFBSSxDQUFDLFVBQVUsRUFBRTtHQUNoQixPQUFPLElBQUksQ0FBQztHQUNaOztFQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDbkIsVUFBVSxHQUFHLEtBQUssQ0FBQzs7RUFFbkIsSUFBSSxlQUFlLEtBQUssSUFBSSxFQUFFO0dBQzdCLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0dBQ3ZDOztFQUVELElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0VBQ3pCLE9BQU8sSUFBSSxDQUFDOztFQUVaLENBQUM7O0NBRUYsSUFBSSxDQUFDLEdBQUcsR0FBRyxZQUFZOztFQUV0QixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUMsQ0FBQztFQUNwQyxPQUFPLElBQUksQ0FBQzs7RUFFWixDQUFDOztDQUVGLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxZQUFZOztFQUVwQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxnQkFBZ0IsR0FBRyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsRUFBRTtHQUNwRixjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDekI7O0VBRUQsQ0FBQzs7Q0FFRixJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsTUFBTSxFQUFFOztFQUU5QixVQUFVLEdBQUcsTUFBTSxDQUFDO0VBQ3BCLE9BQU8sSUFBSSxDQUFDOztFQUVaLENBQUM7O0NBRUYsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLEtBQUssRUFBRTs7RUFFOUIsT0FBTyxHQUFHLEtBQUssQ0FBQztFQUNoQixPQUFPLElBQUksQ0FBQzs7RUFFWixDQUFDOztDQUVGLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxNQUFNLEVBQUU7O0VBRXBDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztFQUMxQixPQUFPLElBQUksQ0FBQzs7RUFFWixDQUFDOztDQUVGLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxJQUFJLEVBQUU7O0VBRTNCLEtBQUssR0FBRyxJQUFJLENBQUM7RUFDYixPQUFPLElBQUksQ0FBQzs7RUFFWixDQUFDOzs7Q0FHRixJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsTUFBTSxFQUFFOztFQUUvQixlQUFlLEdBQUcsTUFBTSxDQUFDO0VBQ3pCLE9BQU8sSUFBSSxDQUFDOztFQUVaLENBQUM7O0NBRUYsSUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFVLGFBQWEsRUFBRTs7RUFFN0Msc0JBQXNCLEdBQUcsYUFBYSxDQUFDO0VBQ3ZDLE9BQU8sSUFBSSxDQUFDOztFQUVaLENBQUM7O0NBRUYsSUFBSSxDQUFDLEtBQUssR0FBRyxZQUFZOztFQUV4QixjQUFjLEdBQUcsU0FBUyxDQUFDO0VBQzNCLE9BQU8sSUFBSSxDQUFDOztFQUVaLENBQUM7O0NBRUYsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLFFBQVEsRUFBRTs7RUFFbEMsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDO0VBQzVCLE9BQU8sSUFBSSxDQUFDOztFQUVaLENBQUM7O0NBRUYsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLFFBQVEsRUFBRTs7RUFFbkMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDO0VBQzdCLE9BQU8sSUFBSSxDQUFDOztFQUVaLENBQUM7O0NBRUYsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLFFBQVEsRUFBRTs7RUFFckMsbUJBQW1CLEdBQUcsUUFBUSxDQUFDO0VBQy9CLE9BQU8sSUFBSSxDQUFDOztFQUVaLENBQUM7O0NBRUYsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLFFBQVEsRUFBRTs7RUFFakMsZUFBZSxHQUFHLFFBQVEsQ0FBQztFQUMzQixPQUFPLElBQUksQ0FBQzs7RUFFWixDQUFDOztDQUVGLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxJQUFJLEVBQUU7O0VBRTdCLElBQUksUUFBUSxDQUFDO0VBQ2IsSUFBSSxPQUFPLENBQUM7RUFDWixJQUFJLEtBQUssQ0FBQzs7RUFFVixJQUFJLElBQUksR0FBRyxVQUFVLEVBQUU7R0FDdEIsT0FBTyxJQUFJLENBQUM7R0FDWjs7RUFFRCxJQUFJLHFCQUFxQixLQUFLLEtBQUssRUFBRTs7R0FFcEMsSUFBSSxnQkFBZ0IsS0FBSyxJQUFJLEVBQUU7SUFDOUIsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN4Qzs7R0FFRCxxQkFBcUIsR0FBRyxJQUFJLENBQUM7R0FDN0I7O0VBRUQsT0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLFVBQVUsSUFBSSxTQUFTLENBQUM7RUFDMUMsT0FBTyxHQUFHLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQzs7RUFFcEMsS0FBSyxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7RUFFakMsS0FBSyxRQUFRLElBQUksVUFBVSxFQUFFOzs7R0FHNUIsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssU0FBUyxFQUFFO0lBQ3pDLFNBQVM7SUFDVDs7R0FFRCxJQUFJLEtBQUssR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3hDLElBQUksR0FBRyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7R0FFL0IsSUFBSSxHQUFHLFlBQVksS0FBSyxFQUFFOztJQUV6QixPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsc0JBQXNCLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDOztJQUV2RCxNQUFNOzs7SUFHTixJQUFJLFFBQVEsR0FBRyxDQUFDLEtBQUssUUFBUSxFQUFFOztLQUU5QixJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO01BQ25ELEdBQUcsR0FBRyxLQUFLLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQzlCLE1BQU07TUFDTixHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ3RCO0tBQ0Q7OztJQUdELElBQUksUUFBUSxHQUFHLENBQUMsS0FBSyxRQUFRLEVBQUU7S0FDOUIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDO0tBQ2xEOztJQUVEOztHQUVEOztFQUVELElBQUksaUJBQWlCLEtBQUssSUFBSSxFQUFFO0dBQy9CLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDdkM7O0VBRUQsSUFBSSxPQUFPLEtBQUssQ0FBQyxFQUFFOztHQUVsQixJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUU7O0lBRWhCLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0tBQ3RCLE9BQU8sRUFBRSxDQUFDO0tBQ1Y7OztJQUdELEtBQUssUUFBUSxJQUFJLGtCQUFrQixFQUFFOztLQUVwQyxJQUFJLFFBQVEsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFO01BQy9DLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztNQUMvRjs7S0FFRCxJQUFJLEtBQUssRUFBRTtNQUNWLElBQUksR0FBRyxHQUFHLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDOztNQUV2QyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7TUFDcEQsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQztNQUMzQjs7S0FFRCxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7O0tBRXREOztJQUVELElBQUksS0FBSyxFQUFFO0tBQ1YsU0FBUyxHQUFHLENBQUMsU0FBUyxDQUFDO0tBQ3ZCOztJQUVELElBQUksZ0JBQWdCLEtBQUssU0FBUyxFQUFFO0tBQ25DLFVBQVUsR0FBRyxJQUFJLEdBQUcsZ0JBQWdCLENBQUM7S0FDckMsTUFBTTtLQUNOLFVBQVUsR0FBRyxJQUFJLEdBQUcsVUFBVSxDQUFDO0tBQy9COztJQUVELE9BQU8sSUFBSSxDQUFDOztJQUVaLE1BQU07O0lBRU4sSUFBSSxtQkFBbUIsS0FBSyxJQUFJLEVBQUU7O0tBRWpDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDM0M7O0lBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsZ0JBQWdCLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsZ0JBQWdCLEVBQUUsQ0FBQyxFQUFFLEVBQUU7OztLQUdwRixjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUMsQ0FBQztLQUNoRDs7SUFFRCxPQUFPLEtBQUssQ0FBQzs7SUFFYjs7R0FFRDs7RUFFRCxPQUFPLElBQUksQ0FBQzs7RUFFWixDQUFDOztDQUVGLENBQUM7OztBQUdGLEtBQUssQ0FBQyxNQUFNLEdBQUc7O0NBRWQsTUFBTSxFQUFFOztFQUVQLElBQUksRUFBRSxVQUFVLENBQUMsRUFBRTs7R0FFbEIsT0FBTyxDQUFDLENBQUM7O0dBRVQ7O0VBRUQ7O0NBRUQsU0FBUyxFQUFFOztFQUVWLEVBQUUsRUFBRSxVQUFVLENBQUMsRUFBRTs7R0FFaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztHQUViOztFQUVELEdBQUcsRUFBRSxVQUFVLENBQUMsRUFBRTs7R0FFakIsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztHQUVuQjs7RUFFRCxLQUFLLEVBQUUsVUFBVSxDQUFDLEVBQUU7O0dBRW5CLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUNqQixPQUFPLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25COztHQUVELE9BQU8sRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztHQUVuQzs7RUFFRDs7Q0FFRCxLQUFLLEVBQUU7O0VBRU4sRUFBRSxFQUFFLFVBQVUsQ0FBQyxFQUFFOztHQUVoQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztHQUVqQjs7RUFFRCxHQUFHLEVBQUUsVUFBVSxDQUFDLEVBQUU7O0dBRWpCLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7O0dBRXZCOztFQUVELEtBQUssRUFBRSxVQUFVLENBQUMsRUFBRTs7R0FFbkIsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO0lBQ2pCLE9BQU8sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCOztHQUVELE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztHQUVwQzs7RUFFRDs7Q0FFRCxPQUFPLEVBQUU7O0VBRVIsRUFBRSxFQUFFLFVBQVUsQ0FBQyxFQUFFOztHQUVoQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7R0FFckI7O0VBRUQsR0FBRyxFQUFFLFVBQVUsQ0FBQyxFQUFFOztHQUVqQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztHQUU3Qjs7RUFFRCxLQUFLLEVBQUUsVUFBVSxDQUFDLEVBQUU7O0dBRW5CLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUNqQixPQUFPLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0I7O0dBRUQsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0dBRTFDOztFQUVEOztDQUVELE9BQU8sRUFBRTs7RUFFUixFQUFFLEVBQUUsVUFBVSxDQUFDLEVBQUU7O0dBRWhCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7R0FFekI7O0VBRUQsR0FBRyxFQUFFLFVBQVUsQ0FBQyxFQUFFOztHQUVqQixPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7O0dBRS9COztFQUVELEtBQUssRUFBRSxVQUFVLENBQUMsRUFBRTs7R0FFbkIsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO0lBQ2pCLE9BQU8sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0I7O0dBRUQsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7R0FFNUM7O0VBRUQ7O0NBRUQsVUFBVSxFQUFFOztFQUVYLEVBQUUsRUFBRSxVQUFVLENBQUMsRUFBRTs7R0FFaEIsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzs7R0FFckM7O0VBRUQsR0FBRyxFQUFFLFVBQVUsQ0FBQyxFQUFFOztHQUVqQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0dBRWpDOztFQUVELEtBQUssRUFBRSxVQUFVLENBQUMsRUFBRTs7R0FFbkIsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztHQUV6Qzs7RUFFRDs7Q0FFRCxXQUFXLEVBQUU7O0VBRVosRUFBRSxFQUFFLFVBQVUsQ0FBQyxFQUFFOztHQUVoQixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7R0FFM0M7O0VBRUQsR0FBRyxFQUFFLFVBQVUsQ0FBQyxFQUFFOztHQUVqQixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzs7R0FFL0M7O0VBRUQsS0FBSyxFQUFFLFVBQVUsQ0FBQyxFQUFFOztHQUVuQixJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7SUFDWixPQUFPLENBQUMsQ0FBQztJQUNUOztHQUVELElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtJQUNaLE9BQU8sQ0FBQyxDQUFDO0lBQ1Q7O0dBRUQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO0lBQ2pCLE9BQU8sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNuQzs7R0FFRCxPQUFPLEdBQUcsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztHQUVqRDs7RUFFRDs7Q0FFRCxRQUFRLEVBQUU7O0VBRVQsRUFBRSxFQUFFLFVBQVUsQ0FBQyxFQUFFOztHQUVoQixPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0dBRWhDOztFQUVELEdBQUcsRUFBRSxVQUFVLENBQUMsRUFBRTs7R0FFakIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztHQUVoQzs7RUFFRCxLQUFLLEVBQUUsVUFBVSxDQUFDLEVBQUU7O0dBRW5CLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUNqQixPQUFPLEVBQUUsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMxQzs7R0FFRCxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0dBRS9DOztFQUVEOztDQUVELE9BQU8sRUFBRTs7RUFFUixFQUFFLEVBQUUsVUFBVSxDQUFDLEVBQUU7O0dBRWhCLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtJQUNaLE9BQU8sQ0FBQyxDQUFDO0lBQ1Q7O0dBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO0lBQ1osT0FBTyxDQUFDLENBQUM7SUFDVDs7R0FFRCxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7O0dBRXRFOztFQUVELEdBQUcsRUFBRSxVQUFVLENBQUMsRUFBRTs7R0FFakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO0lBQ1osT0FBTyxDQUFDLENBQUM7SUFDVDs7R0FFRCxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7SUFDWixPQUFPLENBQUMsQ0FBQztJQUNUOztHQUVELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7O0dBRXBFOztFQUVELEtBQUssRUFBRSxVQUFVLENBQUMsRUFBRTs7R0FFbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO0lBQ1osT0FBTyxDQUFDLENBQUM7SUFDVDs7R0FFRCxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7SUFDWixPQUFPLENBQUMsQ0FBQztJQUNUOztHQUVELENBQUMsSUFBSSxDQUFDLENBQUM7O0dBRVAsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQ1YsT0FBTyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1RTs7R0FFRCxPQUFPLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7R0FFaEY7O0VBRUQ7O0NBRUQsSUFBSSxFQUFFOztFQUVMLEVBQUUsRUFBRSxVQUFVLENBQUMsRUFBRTs7R0FFaEIsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDOztHQUVoQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7R0FFakM7O0VBRUQsR0FBRyxFQUFFLFVBQVUsQ0FBQyxFQUFFOztHQUVqQixJQUFJLENBQUMsR0FBRyxPQUFPLENBQUM7O0dBRWhCLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztHQUV2Qzs7RUFFRCxLQUFLLEVBQUUsVUFBVSxDQUFDLEVBQUU7O0dBRW5CLElBQUksQ0FBQyxHQUFHLE9BQU8sR0FBRyxLQUFLLENBQUM7O0dBRXhCLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUNqQixPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6Qzs7R0FFRCxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0dBRXBEOztFQUVEOztDQUVELE1BQU0sRUFBRTs7RUFFUCxFQUFFLEVBQUUsVUFBVSxDQUFDLEVBQUU7O0dBRWhCLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0dBRTFDOztFQUVELEdBQUcsRUFBRSxVQUFVLENBQUMsRUFBRTs7R0FFakIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFO0lBQ25CLE9BQU8sTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEIsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUU7SUFDMUIsT0FBTyxNQUFNLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDL0MsTUFBTSxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUU7SUFDNUIsT0FBTyxNQUFNLElBQUksQ0FBQyxLQUFLLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDbEQsTUFBTTtJQUNOLE9BQU8sTUFBTSxJQUFJLENBQUMsS0FBSyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDO0lBQ3JEOztHQUVEOztFQUVELEtBQUssRUFBRSxVQUFVLENBQUMsRUFBRTs7R0FFbkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFO0lBQ1osT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUMzQzs7R0FFRCxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7O0dBRXREOztFQUVEOztDQUVELENBQUM7O0FBRUYsS0FBSyxDQUFDLGFBQWEsR0FBRzs7Q0FFckIsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTs7RUFFdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7RUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNkLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDdEIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDOztFQUUxQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7R0FDVixPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0dBQ3pCOztFQUVELElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtHQUNWLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztHQUNqQzs7RUFFRCxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztFQUVqRDs7Q0FFRCxNQUFNLEVBQUUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFOztFQUV2QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDVixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztFQUNyQixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0VBQ2xCLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQzs7RUFFN0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtHQUM1QixDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7R0FDbkQ7O0VBRUQsT0FBTyxDQUFDLENBQUM7O0VBRVQ7O0NBRUQsVUFBVSxFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTs7RUFFM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7RUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNkLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDdEIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDOztFQUU5QyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7O0dBRWxCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUNWLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEM7O0dBRUQsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0dBRTNFLE1BQU07O0dBRU4sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQ1YsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3REOztHQUVELElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUNWLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakU7O0dBRUQsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0dBRTdGOztFQUVEOztDQUVELEtBQUssRUFBRTs7RUFFTixNQUFNLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTs7R0FFNUIsT0FBTyxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7R0FFMUI7O0VBRUQsU0FBUyxFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTs7R0FFMUIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDOztHQUU3QyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFD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QUcsTUFBTSxHQUFHLE1BQU0sR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDOztFQUUxQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFBLE9BQU8sS0FBSyxDQUFDLEVBQUE7O0VBRXJDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO01BQzdCLEdBQUcsR0FBRyxTQUFTLENBQUMsTUFBTTtNQUN0QixJQUFJO01BQ0osQ0FBQyxDQUFDOztFQUVOLElBQUksU0FBUyxDQUFDLEVBQUUsRUFBRTtJQUNoQixJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBQSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFBOztJQUU5RSxRQUFRLEdBQUc7TUFDVCxLQUFLLENBQUMsRUFBRSxPQUFPLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUM7TUFDMUQsS0FBSyxDQUFDLEVBQUUsT0FBTyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQztNQUM5RCxLQUFLLENBQUMsRUFBRSxPQUFPLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQztNQUNsRSxLQUFLLENBQUMsRUFBRSxPQUFPLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUM7TUFDdEUsS0FBSyxDQUFDLEVBQUUsT0FBTyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFB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dEMsR0FBRyxHQUFHLE1BQU0sR0FBRyxNQUFNLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQzs7RUFFMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsRUFBQTtPQUNyRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFBO09BQzVELEVBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBQTs7RUFFdkQsT0FBTyxJQUFJLENBQUM7Q0FDYixDQUFDOzs7Ozs7Ozs7OztBQVdGLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFNBQVMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFO0VBQzlELElBQUksUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksSUFBSSxFQUFFLElBQUksQ0FBQztNQUM1QyxHQUFHLEdBQUcsTUFBTSxHQUFHLE1BQU0sR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDOztFQUUxQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxFQUFBO09BQ3JFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxD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RTFELElBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7RUFDbEIsSUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQzs7RUFFbEIsTUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7RUFDdkcsTUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQzs7RUFFeEcsT0FBUyxNQUFNLENBQUM7Q0FDZixDQUFBO0FBQ0gsMEJBQUUsU0FBUyx1QkFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ2YsSUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7RUFDZixJQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQzs7RUFFZixPQUFTLElBQUksQ0FBQztDQUNiLENBQUE7O0FBRUgsMEJBQUUsS0FBSyxtQkFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ1gsSUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDZCxJQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNkLElBQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ2QsSUFBTSxDQUFDLENBQUMsSUFBSSxDQUFD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R0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7SUFFaEMsRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0UsRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRTNFQSxJQUFNLEVBQUUsR0FBRyxlQUFlLENBQUM7SUFDM0JBLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7O0lBRS9CLEdBQUcsQ0FBQyxFQUFFO01BQ0osRUFBQSxPQUFPLEVBQUE7O0lBRVQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxD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QUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDOztBQ0FyUSxPQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQzs7QUNLNWVULElBQUksV0FBVyxHQUFHO0VBQ2hCLE9BQU8sRUFBRSxLQUFLO0VBQ2QsU0FBUyxDQUFDLENBQUM7RUFDWCxLQUFLLGdCQUFBLENBQUMsR0FBRyxDQUFDO0lBQ1JBLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQzs7SUFFaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLE9BQU8sQ0FBQztNQUN0QixLQUFLLEVBQUUsSUFBSTtNQUNYLE1BQU0sQ0FBQyxJQUFJO01BQ1gsT0FBTyxrQkFBQSxFQUFFO1FBQ1AsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyx1QkFBdUIsQ0FBQ1UsVUFBYyxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDQyxHQUFjLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUNDLEdBQVcsQ0FBQyxDQUFDO09BQzVEO01BQ0QsTUFBTSxpQkFBQSxDQUFDLEtBQUssQ0FBQzs7O1FBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O1FBRzFCWixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7UUFFdEMsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztVQUNwQixVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3BDOzs7UUFHREEsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O1FBRXZDLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7VUFDcEIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNyQzs7UUFFRCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQzs7O1FBRy9CQSxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pEQSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztRQUVsRCxTQUFTLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUN4QixVQUFVLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7UUFFekIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7UUFFcENBLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7O1FBRTdDQSxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOztRQUUzRCxTQUFTLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztRQUVuREEsSUFBSSxVQUFVLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBOztRQUU3REEsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7O1FBRWpGLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOztRQUVwQ0EsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDOztRQUVuREEsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDOzJCQUNuSCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7UUFFckVBLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztpQkFDakksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2lCQUNqRCxVQUFVLENBQUMsV0FBRTtrQkFDWixTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztrQkFDdkIsVUFBVSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7a0JBQ3hCLE1BQU0sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO2tCQUMxQixVQUFVLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztrQkFDOUIsV0FBVyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7a0JBQy9CRSxNQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2tCQUMxR0EsTUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztpQkFDMUcsQ0FBQyxDQUFDOztRQUVYLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7UUFFakcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7O1FBRWpELFNBQVMsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDOztRQUU3QixDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLENBQUE7VUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBQyxHQUFHLENBQUM7WUFDbkJBLE1BQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEJBLE1BQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkIsV0FBVyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDaENGLElBQUksY0FBYyxHQUFHRSxNQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUN2RSxNQUFNLEVBQUUsS0FBSztnQkFDYixVQUFVLEVBQUUsQ0FBQztnQkFDYixTQUFTLEVBQUUsQ0FBQztnQkFDWixHQUFHLEVBQUUsQ0FBQztlQUNQLENBQUMsQ0FBQzs7WUFFTEEsTUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsV0FBRTs7Y0FFdEUsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztjQUVuQyxVQUFVLENBQUMsV0FBRTtnQkFDWCxVQUFVLENBQUMsV0FBVyxDQUFDQSxNQUFJLENBQUNBLE1BQUksQ0FBQyxXQUFXLENBQUMsV0FBRTtrQkFDN0MsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO2lCQUNkLENBQUMsQ0FBQzs7ZUFFSixDQUFDLEdBQUcsQ0FBQyxDQUFDOzthQUVSLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNYQSxNQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1dBQ3BCLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQzs7UUFFSCxVQUFVLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs7UUFFOUIsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxDQUFBO1VBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRyxDQUFDO1lBQ25CQSxNQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hCQSxNQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZCLFVBQVUsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQy9CRixJQUFJLGNBQWMsR0FBR0UsTUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDdkUsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsVUFBVSxFQUFFLENBQUM7Z0JBQ2IsU0FBUyxFQUFFLENBQUM7Z0JBQ1osR0FBRyxFQUFFLENBQUM7ZUFDUCxDQUFDLENBQUM7O1lBRUxBLE1BQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFdBQUU7Y0FDdEUsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztjQUVuQyxVQUFVLENBQUMsV0FBRTs7Z0JBRVgsVUFBVSxDQUFDLFVBQVUsQ0FBQ0EsTUFBSSxDQUFDQSxNQUFJLENBQUMsVUFBVSxDQUFDLFdBQUU7a0JBQzNDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDZCxDQUFDLENBQUM7ZUFDSixDQUFDLEdBQUcsQ0FBQyxDQUFDOzthQUVSLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7WUFFWEEsTUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztXQUNwQixDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7O1FBRUhGLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7UUFFekQsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBQyxHQUFHLENBQUM7VUFDckJFLE1BQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7VUFDeEJBLE1BQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7O1VBRXZCRixJQUFJLFdBQVcsR0FBR0UsTUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztjQUNqRSxNQUFNLEVBQUUsS0FBSztjQUNiLFVBQVUsRUFBRSxDQUFDO2NBQ2IsU0FBUyxFQUFFLEVBQUU7Y0FDYixHQUFHLEVBQUUsRUFBRTtjQUNQLFVBQVUsRUFBRSxVQUFDLE1BQU0sQ0FBQztnQkFDbEIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7ZUFDdkI7YUFDRixDQUFDLENBQUM7O1VBRUxBLE1BQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFdBQUU7WUFDbkUsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDL0IsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztXQUNwQixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7O1VBRVhBLE1BQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEIsQ0FBQyxDQUFDOztPQUVKO01BQ0QsTUFBTSxpQkFBQSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUM7O09BRTVCO01BQ0QsT0FBTyxrQkFBQSxFQUFFOztPQUVSO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsQUFBRyxBQUFxQyxBQUFDO01BQ3ZDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztLQUM5QjtHQUNGO0VBQ0QsT0FBTyxrQkFBQSxFQUFFO0lBQ1AsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUNyQjtFQUNELEtBQUssZ0JBQUEsRUFBRTtJQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDbkI7Q0FDRixDQUFBOzs7QUFHREYsSUFBSSxVQUFVLEdBQUc7RUFDZixVQUFVLHFCQUFBLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7SUFDM0JBLElBQUksS0FBSyxHQUFHLElBQUk7UUFDWixLQUFLLEdBQUcsQ0FBQyxHQUFHO1FBQ1osZUFBZSxHQUFHLEVBQUU7UUFDcEIsVUFBVSxHQUFHLElBQUksR0FBRyxlQUFlO1FBQ25DLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7O0lBRXhDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBQyxNQUFNLENBQUMsR0FBRyxDQUFDOztNQUV6QixPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztVQUNqQixPQUFPLEVBQUUsQ0FBQyxHQUFHLEdBQUcsZUFBZSxJQUFJLEVBQUU7VUFDckMsT0FBTyxFQUFFLEVBQUUsR0FBRyxHQUFHLGVBQWUsQ0FBQyxHQUFHLEVBQUU7U0FDdkMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLFdBQUU7VUFDOUMsR0FBRyxFQUFFLGdCQUFnQixJQUFJLENBQUM7WUFDeEIsRUFBQSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsRUFBQTtTQUNkLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNkLENBQUMsQ0FBQztHQUNKO0VBQ0QsV0FBVyxzQkFBQSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDO0lBQzVCQSxJQUFJLGVBQWUsR0FBRyxDQUFDO1FBQ25CLFVBQVUsR0FBRyxJQUFJLEdBQUcsZUFBZTtRQUNuQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDOztJQUV4QyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQzs7TUFFekIsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDZixPQUFPLEVBQUUsQ0FBQyxHQUFHLEdBQUcsZUFBZSxJQUFJLEdBQUc7WUFDdEMsT0FBTyxFQUFFLEVBQUUsR0FBRyxHQUFHLGVBQWUsQ0FBQyxHQUFHLEVBQUU7V0FDdkMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLFdBQUU7Y0FDNUMsR0FBRyxFQUFFLGdCQUFnQixJQUFJLENBQUM7Z0JBQ3hCLEVBQUEsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUE7YUFDZCxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDbEIsQ0FBQyxDQUFDO0dBQ0o7RUFDRCxTQUFTLG9CQUFBLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUN2QixPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0dBQzdEO0NBQ0YsQ0FBQTs7QUFFRCxXQUFXLENBQUMsS0FBSyxDQUFDO0VBQ2hCLE1BQU0saUJBQUEsRUFBRTtJQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7O0lBRXBCLFVBQVUsQ0FBQyxXQUFFO01BQ1gsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3ZCLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDVDtFQUNELFNBQVMsb0JBQUEsRUFBRTtJQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUE7R0FDdkI7Q0FDRixDQUFDLENBQUM7OyJ9
