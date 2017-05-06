'use strict';

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
  if (!new Events().__proto__) prefix = false;
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
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
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

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

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
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

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

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

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

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

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

  if (!this._events[evt]) return this;
  if (!fn) {
    if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
         listeners.fn === fn
      && (!once || listeners.once)
      && (!context || listeners.context === context)
    ) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
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
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
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
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
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

var DefaultSettings = {
  disableTouch: false
};
var now;
var delta;
var deltaX = 0;
var deltaY = 0;

var EventManager = (function (EventEmitter) {
  function EventManager(picasso,options){
    EventEmitter.call(this);

    this.options = Object.assign({},DefaultSettings,options);

    this.interactionDomElement = picasso.viewElement;

    this.hasTouch = 'ontouchstart' in window;

    this.hasPointer = !!(window.PointerEvent || window.MSPointerEvent);

    this.render = picasso;

    this.initEvents();
  }

  if ( EventEmitter ) EventManager.__proto__ = EventEmitter;
  EventManager.prototype = Object.create( EventEmitter && EventEmitter.prototype );
  EventManager.prototype.constructor = EventManager;
  EventManager.prototype.addEvent = function addEvent (el, type, fn) {
    el.addEventListener(type, fn, false);
  };
  EventManager.prototype.removeEvent = function removeEvent (el, type, fn) {
    el.removeEventListener(type, fn, false);
  };
  EventManager.prototype.Event = function Event (eventName,props) {

        var event = document.createEvent('Events')
          , bubbles = true;
        if (props)
            { for (var name in props)
                { (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]); } }
        event.initEvent(eventName, bubbles, true);
    // var ev = document.createEvent('Events'),
    //     isBubbles = true;

    // if(evt){
    //   for(var p in evt){
    //     if(p == 'bubbles')
    //       isBubbles = !!evt[p];
    //     else
    //       ev[p] = evt[p];
    //   }
    // }
    // ev.originEvent = evt;
    // ev.initEvent(eventName, isBubbles, true);

    return ev;
  };
  EventManager.prototype.initEvents = function initEvents (remove) {
    var eventType = remove ? this.removeEvent : this.addEvent,
        target = this.interactionDomElement;

    if ( this.hasTouch && !this.options.disableTouch ) {
      eventType(target, 'touchstart', this);
      eventType(target, 'touchmove', this);
      eventType(target, 'touchcancel', this);
      eventType(target, 'touchend', this);
    }
  };

  EventManager.prototype.handleEvent = function handleEvent (e) {
    switch ( e.type ) {
      case 'touchstart':
      case 'pointerdown':
      case 'MSPointerDown':
      case 'mousedown':
        this._start(e);
        break;
      case 'touchmove':
      case 'pointermove':
      case 'MSPointerMove':
      case 'mousemove':
        this._move(e);
        break;
      case 'touchend':
      case 'pointerup':
      case 'MSPointerUp':
      case 'mouseup':
      case 'touchcancel':
      case 'pointercancel':
      case 'MSPointerCancel':
      case 'mousecancel':
        this._end(e);
        break;
    }
  };

  EventManager.prototype._start = function _start (e) {
    var point = e.touches ? e.touches[0] : e;

    now = Date.now();

    delta = now - (this.last || now);

    this.x1 = point.pageX;
    this.y1 = point.pageY;

    this.last = now;
  };

  EventManager.prototype._move = function _move (e) {
    var point = e.touches ? e.touches[0] : e;

    this.x2 = point.pageX;
    this.y2 = point.pageY;

    deltaX += Math.abs(this.x1 - this.x2);
    deltaY += Math.abs(this.y1 - this.y2);
  };

  EventManager.prototype._end = function _end (e) {
    var point = e.changedTouches ? e.changedTouches[0] : e;
    var hitPoint = new Point(point.pageX / this.render._scaleRes,point.pageY / this.render._scaleRes);
    var hitTarges = [],
        emitParentIds = {};

    this.processInteractive(hitPoint, this.render.gameObjects,hitTarges);

    if (deltaX < 30 && deltaY < 30) {
      var event = this.Event('tap',point);
      hitTarges.forEach(function (hitTarget){
        var par = hitTarget.parentGroup;
        hitTarget.emit('tap',event);
        if(par && !emitParentIds[par._id]){
          par.emit('tap',event);
          emitParentIds[par._id] = true;
        }
      });

    }
    this.cancelAll();
  };

  EventManager.prototype.cancelAll = function cancelAll () {
    deltaX = deltaY = 0;
  };

  EventManager.prototype.processInteractive = function processInteractive (point,gameObj,hitTarges){
    var this$1 = this;

    var hit;

    if(!gameObj.lived || hitTarges.length)
      { return; }

    if(gameObj.hasChild){
      gameObj.children(function (childObj){
        var isHit = this$1.processInteractive(point,childObj,hitTarges);

        return !isHit;
      },true);
    }else if(gameObj.interactive || (gameObj.parentGroup && gameObj.parentGroup.interactive)){
      hit = gameObj.contains(point);

      if(hit){
        hitTarges.push(gameObj);
      }

      return hit;
    }
  };

  return EventManager;
}(index));

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

    if(process.env.NODE_ENV !== 'production'){
      console.log('checking gameObject ',this.key,' ',this.type,point,' world point to obj point ',tempPoint);
    }
    return false;
  };

  BaseDisplayObject.prototype.destroy = function destroy (){
    if(process.env.NODE_ENV !== 'production'){
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

    this.eventManager = new EventManager(this);

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
    if(process.env.NODE_ENV !== 'production'){
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

module.exports = Picasso;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy90b29scy5qcyIsIi4uL25vZGVfbW9kdWxlcy9Ud2Vlbi5qcy9zcmMvVHdlZW4uanMiLCIuLi9zcmMvYW5pbWF0ZS90d2VlbkFjdGlvbi5qcyIsIi4uL3NyYy9SZW5kZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvZXZlbnRlbWl0dGVyMy9pbmRleC5qcyIsIi4uL3NyYy91dGlscy9PYnNlcnZlT2JqZWN0LmpzIiwiLi4vc3JjL3V0aWxzL1BvaW50LmpzIiwiLi4vc3JjL2V2ZW50L2V2ZW50LmpzIiwiLi4vc3JjL3V0aWxzL2xvYWRlci5qcyIsIi4uL3NyYy91dGlscy9UcmFuc2Zvcm1NYXRyaXguanMiLCIuLi9zcmMvZGlzcGxheS9iYXNlRGlzcGxheU9iamVjdC5qcyIsIi4uL3NyYy9kaXNwbGF5L1Nwcml0ZS5qcyIsIi4uL3NyYy9kaXNwbGF5L2dyb3VwLmpzIiwiLi4vc3JjL2Rpc3BsYXkvc3ByaXRlU2hlZXQuanMiLCIuLi9zcmMvZGlzcGxheS92aXJ0dWFsRGlzcGxheS5qcyIsIi4uL3NyYy9waWNhc3NvLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxyXG5sZXQgdG9vbHMgPSB7XHJcblxyXG4gIGdldFRpbWUoKVxyXG4gIHtcclxuICAgIHJldHVybiAoIXBlcmZvcm1hbmNlIHx8ICFwZXJmb3JtYW5jZS5ub3cpID8gK25ldyBEYXRlIDogcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgfVxyXG5cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHRvb2xzOyIsIi8qKlxuICogVHdlZW4uanMgLSBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2VlbmpzL3R3ZWVuLmpzXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS90d2VlbmpzL3R3ZWVuLmpzL2dyYXBocy9jb250cmlidXRvcnMgZm9yIHRoZSBmdWxsIGxpc3Qgb2YgY29udHJpYnV0b3JzLlxuICogVGhhbmsgeW91IGFsbCwgeW91J3JlIGF3ZXNvbWUhXG4gKi9cblxudmFyIFRXRUVOID0gVFdFRU4gfHwgKGZ1bmN0aW9uICgpIHtcblxuXHR2YXIgX3R3ZWVucyA9IFtdO1xuXG5cdHJldHVybiB7XG5cblx0XHRnZXRBbGw6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0cmV0dXJuIF90d2VlbnM7XG5cblx0XHR9LFxuXG5cdFx0cmVtb3ZlQWxsOiBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdF90d2VlbnMgPSBbXTtcblxuXHRcdH0sXG5cblx0XHRhZGQ6IGZ1bmN0aW9uICh0d2Vlbikge1xuXG5cdFx0XHRfdHdlZW5zLnB1c2godHdlZW4pO1xuXG5cdFx0fSxcblxuXHRcdHJlbW92ZTogZnVuY3Rpb24gKHR3ZWVuKSB7XG5cblx0XHRcdHZhciBpID0gX3R3ZWVucy5pbmRleE9mKHR3ZWVuKTtcblxuXHRcdFx0aWYgKGkgIT09IC0xKSB7XG5cdFx0XHRcdF90d2VlbnMuc3BsaWNlKGksIDEpO1xuXHRcdFx0fVxuXG5cdFx0fSxcblxuXHRcdHVwZGF0ZTogZnVuY3Rpb24gKHRpbWUsIHByZXNlcnZlKSB7XG5cblx0XHRcdGlmIChfdHdlZW5zLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBpID0gMDtcblxuXHRcdFx0dGltZSA9IHRpbWUgIT09IHVuZGVmaW5lZCA/IHRpbWUgOiBUV0VFTi5ub3coKTtcblxuXHRcdFx0d2hpbGUgKGkgPCBfdHdlZW5zLmxlbmd0aCkge1xuXG5cdFx0XHRcdGlmIChfdHdlZW5zW2ldLnVwZGF0ZSh0aW1lKSB8fCBwcmVzZXJ2ZSkge1xuXHRcdFx0XHRcdGkrKztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRfdHdlZW5zLnNwbGljZShpLCAxKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0fVxuXHR9O1xuXG59KSgpO1xuXG5cbi8vIEluY2x1ZGUgYSBwZXJmb3JtYW5jZS5ub3cgcG9seWZpbGwuXG4vLyBJbiBub2RlLmpzLCB1c2UgcHJvY2Vzcy5ocnRpbWUuXG5pZiAodHlwZW9mICh3aW5kb3cpID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgKHByb2Nlc3MpICE9PSAndW5kZWZpbmVkJykge1xuXHRUV0VFTi5ub3cgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHRpbWUgPSBwcm9jZXNzLmhydGltZSgpO1xuXG5cdFx0Ly8gQ29udmVydCBbc2Vjb25kcywgbmFub3NlY29uZHNdIHRvIG1pbGxpc2Vjb25kcy5cblx0XHRyZXR1cm4gdGltZVswXSAqIDEwMDAgKyB0aW1lWzFdIC8gMTAwMDAwMDtcblx0fTtcbn1cbi8vIEluIGEgYnJvd3NlciwgdXNlIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgaWYgaXQgaXMgYXZhaWxhYmxlLlxuZWxzZSBpZiAodHlwZW9mICh3aW5kb3cpICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgd2luZG93LnBlcmZvcm1hbmNlICE9PSB1bmRlZmluZWQgJiZcblx0XHQgd2luZG93LnBlcmZvcm1hbmNlLm5vdyAhPT0gdW5kZWZpbmVkKSB7XG5cdC8vIFRoaXMgbXVzdCBiZSBib3VuZCwgYmVjYXVzZSBkaXJlY3RseSBhc3NpZ25pbmcgdGhpcyBmdW5jdGlvblxuXHQvLyBsZWFkcyB0byBhbiBpbnZvY2F0aW9uIGV4Y2VwdGlvbiBpbiBDaHJvbWUuXG5cdFRXRUVOLm5vdyA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cuYmluZCh3aW5kb3cucGVyZm9ybWFuY2UpO1xufVxuLy8gVXNlIERhdGUubm93IGlmIGl0IGlzIGF2YWlsYWJsZS5cbmVsc2UgaWYgKERhdGUubm93ICE9PSB1bmRlZmluZWQpIHtcblx0VFdFRU4ubm93ID0gRGF0ZS5ub3c7XG59XG4vLyBPdGhlcndpc2UsIHVzZSAnbmV3IERhdGUoKS5nZXRUaW1lKCknLlxuZWxzZSB7XG5cdFRXRUVOLm5vdyA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdH07XG59XG5cblxuVFdFRU4uVHdlZW4gPSBmdW5jdGlvbiAob2JqZWN0KSB7XG5cblx0dmFyIF9vYmplY3QgPSBvYmplY3Q7XG5cdHZhciBfdmFsdWVzU3RhcnQgPSB7fTtcblx0dmFyIF92YWx1ZXNFbmQgPSB7fTtcblx0dmFyIF92YWx1ZXNTdGFydFJlcGVhdCA9IHt9O1xuXHR2YXIgX2R1cmF0aW9uID0gMTAwMDtcblx0dmFyIF9yZXBlYXQgPSAwO1xuXHR2YXIgX3JlcGVhdERlbGF5VGltZTtcblx0dmFyIF95b3lvID0gZmFsc2U7XG5cdHZhciBfaXNQbGF5aW5nID0gZmFsc2U7XG5cdHZhciBfcmV2ZXJzZWQgPSBmYWxzZTtcblx0dmFyIF9kZWxheVRpbWUgPSAwO1xuXHR2YXIgX3N0YXJ0VGltZSA9IG51bGw7XG5cdHZhciBfZWFzaW5nRnVuY3Rpb24gPSBUV0VFTi5FYXNpbmcuTGluZWFyLk5vbmU7XG5cdHZhciBfaW50ZXJwb2xhdGlvbkZ1bmN0aW9uID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5MaW5lYXI7XG5cdHZhciBfY2hhaW5lZFR3ZWVucyA9IFtdO1xuXHR2YXIgX29uU3RhcnRDYWxsYmFjayA9IG51bGw7XG5cdHZhciBfb25TdGFydENhbGxiYWNrRmlyZWQgPSBmYWxzZTtcblx0dmFyIF9vblVwZGF0ZUNhbGxiYWNrID0gbnVsbDtcblx0dmFyIF9vbkNvbXBsZXRlQ2FsbGJhY2sgPSBudWxsO1xuXHR2YXIgX29uU3RvcENhbGxiYWNrID0gbnVsbDtcblxuXHR0aGlzLnRvID0gZnVuY3Rpb24gKHByb3BlcnRpZXMsIGR1cmF0aW9uKSB7XG5cblx0XHRfdmFsdWVzRW5kID0gcHJvcGVydGllcztcblxuXHRcdGlmIChkdXJhdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRfZHVyYXRpb24gPSBkdXJhdGlvbjtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuc3RhcnQgPSBmdW5jdGlvbiAodGltZSkge1xuXG5cdFx0VFdFRU4uYWRkKHRoaXMpO1xuXG5cdFx0X2lzUGxheWluZyA9IHRydWU7XG5cblx0XHRfb25TdGFydENhbGxiYWNrRmlyZWQgPSBmYWxzZTtcblxuXHRcdF9zdGFydFRpbWUgPSB0aW1lICE9PSB1bmRlZmluZWQgPyB0aW1lIDogVFdFRU4ubm93KCk7XG5cdFx0X3N0YXJ0VGltZSArPSBfZGVsYXlUaW1lO1xuXG5cdFx0Zm9yICh2YXIgcHJvcGVydHkgaW4gX3ZhbHVlc0VuZCkge1xuXG5cdFx0XHQvLyBDaGVjayBpZiBhbiBBcnJheSB3YXMgcHJvdmlkZWQgYXMgcHJvcGVydHkgdmFsdWVcblx0XHRcdGlmIChfdmFsdWVzRW5kW3Byb3BlcnR5XSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cblx0XHRcdFx0aWYgKF92YWx1ZXNFbmRbcHJvcGVydHldLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQ3JlYXRlIGEgbG9jYWwgY29weSBvZiB0aGUgQXJyYXkgd2l0aCB0aGUgc3RhcnQgdmFsdWUgYXQgdGhlIGZyb250XG5cdFx0XHRcdF92YWx1ZXNFbmRbcHJvcGVydHldID0gW19vYmplY3RbcHJvcGVydHldXS5jb25jYXQoX3ZhbHVlc0VuZFtwcm9wZXJ0eV0pO1xuXG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIGB0bygpYCBzcGVjaWZpZXMgYSBwcm9wZXJ0eSB0aGF0IGRvZXNuJ3QgZXhpc3QgaW4gdGhlIHNvdXJjZSBvYmplY3QsXG5cdFx0XHQvLyB3ZSBzaG91bGQgbm90IHNldCB0aGF0IHByb3BlcnR5IGluIHRoZSBvYmplY3Rcblx0XHRcdGlmIChfb2JqZWN0W3Byb3BlcnR5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTYXZlIHRoZSBzdGFydGluZyB2YWx1ZS5cblx0XHRcdF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gPSBfb2JqZWN0W3Byb3BlcnR5XTtcblxuXHRcdFx0aWYgKChfdmFsdWVzU3RhcnRbcHJvcGVydHldIGluc3RhbmNlb2YgQXJyYXkpID09PSBmYWxzZSkge1xuXHRcdFx0XHRfdmFsdWVzU3RhcnRbcHJvcGVydHldICo9IDEuMDsgLy8gRW5zdXJlcyB3ZSdyZSB1c2luZyBudW1iZXJzLCBub3Qgc3RyaW5nc1xuXHRcdFx0fVxuXG5cdFx0XHRfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldID0gX3ZhbHVlc1N0YXJ0W3Byb3BlcnR5XSB8fCAwO1xuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRpZiAoIV9pc1BsYXlpbmcpIHtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH1cblxuXHRcdFRXRUVOLnJlbW92ZSh0aGlzKTtcblx0XHRfaXNQbGF5aW5nID0gZmFsc2U7XG5cblx0XHRpZiAoX29uU3RvcENhbGxiYWNrICE9PSBudWxsKSB7XG5cdFx0XHRfb25TdG9wQ2FsbGJhY2suY2FsbChfb2JqZWN0LCBfb2JqZWN0KTtcblx0XHR9XG5cblx0XHR0aGlzLnN0b3BDaGFpbmVkVHdlZW5zKCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLmVuZCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHRoaXMudXBkYXRlKF9zdGFydFRpbWUgKyBfZHVyYXRpb24pO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5zdG9wQ2hhaW5lZFR3ZWVucyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdGZvciAodmFyIGkgPSAwLCBudW1DaGFpbmVkVHdlZW5zID0gX2NoYWluZWRUd2VlbnMubGVuZ3RoOyBpIDwgbnVtQ2hhaW5lZFR3ZWVuczsgaSsrKSB7XG5cdFx0XHRfY2hhaW5lZFR3ZWVuc1tpXS5zdG9wKCk7XG5cdFx0fVxuXG5cdH07XG5cblx0dGhpcy5kZWxheSA9IGZ1bmN0aW9uIChhbW91bnQpIHtcblxuXHRcdF9kZWxheVRpbWUgPSBhbW91bnQ7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnJlcGVhdCA9IGZ1bmN0aW9uICh0aW1lcykge1xuXG5cdFx0X3JlcGVhdCA9IHRpbWVzO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5yZXBlYXREZWxheSA9IGZ1bmN0aW9uIChhbW91bnQpIHtcblxuXHRcdF9yZXBlYXREZWxheVRpbWUgPSBhbW91bnQ7XG5cdFx0cmV0dXJuIHRoaXM7XG5cblx0fTtcblxuXHR0aGlzLnlveW8gPSBmdW5jdGlvbiAoeW95bykge1xuXG5cdFx0X3lveW8gPSB5b3lvO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblxuXHR0aGlzLmVhc2luZyA9IGZ1bmN0aW9uIChlYXNpbmcpIHtcblxuXHRcdF9lYXNpbmdGdW5jdGlvbiA9IGVhc2luZztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuaW50ZXJwb2xhdGlvbiA9IGZ1bmN0aW9uIChpbnRlcnBvbGF0aW9uKSB7XG5cblx0XHRfaW50ZXJwb2xhdGlvbkZ1bmN0aW9uID0gaW50ZXJwb2xhdGlvbjtcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMuY2hhaW4gPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRfY2hhaW5lZFR3ZWVucyA9IGFyZ3VtZW50cztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMub25TdGFydCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXG5cdFx0X29uU3RhcnRDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vblVwZGF0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXG5cdFx0X29uVXBkYXRlQ2FsbGJhY2sgPSBjYWxsYmFjaztcblx0XHRyZXR1cm4gdGhpcztcblxuXHR9O1xuXG5cdHRoaXMub25Db21wbGV0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXG5cdFx0X29uQ29tcGxldGVDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy5vblN0b3AgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblxuXHRcdF9vblN0b3BDYWxsYmFjayA9IGNhbGxiYWNrO1xuXHRcdHJldHVybiB0aGlzO1xuXG5cdH07XG5cblx0dGhpcy51cGRhdGUgPSBmdW5jdGlvbiAodGltZSkge1xuXG5cdFx0dmFyIHByb3BlcnR5O1xuXHRcdHZhciBlbGFwc2VkO1xuXHRcdHZhciB2YWx1ZTtcblxuXHRcdGlmICh0aW1lIDwgX3N0YXJ0VGltZSkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKF9vblN0YXJ0Q2FsbGJhY2tGaXJlZCA9PT0gZmFsc2UpIHtcblxuXHRcdFx0aWYgKF9vblN0YXJ0Q2FsbGJhY2sgIT09IG51bGwpIHtcblx0XHRcdFx0X29uU3RhcnRDYWxsYmFjay5jYWxsKF9vYmplY3QsIF9vYmplY3QpO1xuXHRcdFx0fVxuXG5cdFx0XHRfb25TdGFydENhbGxiYWNrRmlyZWQgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGVsYXBzZWQgPSAodGltZSAtIF9zdGFydFRpbWUpIC8gX2R1cmF0aW9uO1xuXHRcdGVsYXBzZWQgPSBlbGFwc2VkID4gMSA/IDEgOiBlbGFwc2VkO1xuXG5cdFx0dmFsdWUgPSBfZWFzaW5nRnVuY3Rpb24oZWxhcHNlZCk7XG5cblx0XHRmb3IgKHByb3BlcnR5IGluIF92YWx1ZXNFbmQpIHtcblxuXHRcdFx0Ly8gRG9uJ3QgdXBkYXRlIHByb3BlcnRpZXMgdGhhdCBkbyBub3QgZXhpc3QgaW4gdGhlIHNvdXJjZSBvYmplY3Rcblx0XHRcdGlmIChfdmFsdWVzU3RhcnRbcHJvcGVydHldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBzdGFydCA9IF92YWx1ZXNTdGFydFtwcm9wZXJ0eV0gfHwgMDtcblx0XHRcdHZhciBlbmQgPSBfdmFsdWVzRW5kW3Byb3BlcnR5XTtcblxuXHRcdFx0aWYgKGVuZCBpbnN0YW5jZW9mIEFycmF5KSB7XG5cblx0XHRcdFx0X29iamVjdFtwcm9wZXJ0eV0gPSBfaW50ZXJwb2xhdGlvbkZ1bmN0aW9uKGVuZCwgdmFsdWUpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIFBhcnNlcyByZWxhdGl2ZSBlbmQgdmFsdWVzIHdpdGggc3RhcnQgYXMgYmFzZSAoZS5nLjogKzEwLCAtMylcblx0XHRcdFx0aWYgKHR5cGVvZiAoZW5kKSA9PT0gJ3N0cmluZycpIHtcblxuXHRcdFx0XHRcdGlmIChlbmQuY2hhckF0KDApID09PSAnKycgfHwgZW5kLmNoYXJBdCgwKSA9PT0gJy0nKSB7XG5cdFx0XHRcdFx0XHRlbmQgPSBzdGFydCArIHBhcnNlRmxvYXQoZW5kKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZW5kID0gcGFyc2VGbG9hdChlbmQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFByb3RlY3QgYWdhaW5zdCBub24gbnVtZXJpYyBwcm9wZXJ0aWVzLlxuXHRcdFx0XHRpZiAodHlwZW9mIChlbmQpID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdF9vYmplY3RbcHJvcGVydHldID0gc3RhcnQgKyAoZW5kIC0gc3RhcnQpICogdmFsdWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0aWYgKF9vblVwZGF0ZUNhbGxiYWNrICE9PSBudWxsKSB7XG5cdFx0XHRfb25VcGRhdGVDYWxsYmFjay5jYWxsKF9vYmplY3QsIHZhbHVlKTtcblx0XHR9XG5cblx0XHRpZiAoZWxhcHNlZCA9PT0gMSkge1xuXG5cdFx0XHRpZiAoX3JlcGVhdCA+IDApIHtcblxuXHRcdFx0XHRpZiAoaXNGaW5pdGUoX3JlcGVhdCkpIHtcblx0XHRcdFx0XHRfcmVwZWF0LS07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBSZWFzc2lnbiBzdGFydGluZyB2YWx1ZXMsIHJlc3RhcnQgYnkgbWFraW5nIHN0YXJ0VGltZSA9IG5vd1xuXHRcdFx0XHRmb3IgKHByb3BlcnR5IGluIF92YWx1ZXNTdGFydFJlcGVhdCkge1xuXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiAoX3ZhbHVlc0VuZFtwcm9wZXJ0eV0pID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0X3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XSA9IF92YWx1ZXNTdGFydFJlcGVhdFtwcm9wZXJ0eV0gKyBwYXJzZUZsb2F0KF92YWx1ZXNFbmRbcHJvcGVydHldKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoX3lveW8pIHtcblx0XHRcdFx0XHRcdHZhciB0bXAgPSBfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldO1xuXG5cdFx0XHRcdFx0XHRfdmFsdWVzU3RhcnRSZXBlYXRbcHJvcGVydHldID0gX3ZhbHVlc0VuZFtwcm9wZXJ0eV07XG5cdFx0XHRcdFx0XHRfdmFsdWVzRW5kW3Byb3BlcnR5XSA9IHRtcDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRfdmFsdWVzU3RhcnRbcHJvcGVydHldID0gX3ZhbHVlc1N0YXJ0UmVwZWF0W3Byb3BlcnR5XTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKF95b3lvKSB7XG5cdFx0XHRcdFx0X3JldmVyc2VkID0gIV9yZXZlcnNlZDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChfcmVwZWF0RGVsYXlUaW1lICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRfc3RhcnRUaW1lID0gdGltZSArIF9yZXBlYXREZWxheVRpbWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0X3N0YXJ0VGltZSA9IHRpbWUgKyBfZGVsYXlUaW1lO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0aWYgKF9vbkNvbXBsZXRlQ2FsbGJhY2sgIT09IG51bGwpIHtcblxuXHRcdFx0XHRcdF9vbkNvbXBsZXRlQ2FsbGJhY2suY2FsbChfb2JqZWN0LCBfb2JqZWN0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBudW1DaGFpbmVkVHdlZW5zID0gX2NoYWluZWRUd2VlbnMubGVuZ3RoOyBpIDwgbnVtQ2hhaW5lZFR3ZWVuczsgaSsrKSB7XG5cdFx0XHRcdFx0Ly8gTWFrZSB0aGUgY2hhaW5lZCB0d2VlbnMgc3RhcnQgZXhhY3RseSBhdCB0aGUgdGltZSB0aGV5IHNob3VsZCxcblx0XHRcdFx0XHQvLyBldmVuIGlmIHRoZSBgdXBkYXRlKClgIG1ldGhvZCB3YXMgY2FsbGVkIHdheSBwYXN0IHRoZSBkdXJhdGlvbiBvZiB0aGUgdHdlZW5cblx0XHRcdFx0XHRfY2hhaW5lZFR3ZWVuc1tpXS5zdGFydChfc3RhcnRUaW1lICsgX2R1cmF0aW9uKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cblx0fTtcblxufTtcblxuXG5UV0VFTi5FYXNpbmcgPSB7XG5cblx0TGluZWFyOiB7XG5cblx0XHROb25lOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gaztcblxuXHRcdH1cblxuXHR9LFxuXG5cdFF1YWRyYXRpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrICogaztcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrICogKDIgLSBrKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gMC41ICogayAqIGs7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAtIDAuNSAqICgtLWsgKiAoayAtIDIpIC0gMSk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRDdWJpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrICogayAqIGs7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gLS1rICogayAqIGsgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiBrICogayAqIGs7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiAoKGsgLT0gMikgKiBrICogayArIDIpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0UXVhcnRpYzoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBrICogayAqIGsgKiBrO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIDEgLSAoLS1rICogayAqIGsgKiBrKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gMC41ICogayAqIGsgKiBrICogaztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIC0gMC41ICogKChrIC09IDIpICogayAqIGsgKiBrIC0gMik7XG5cblx0XHR9XG5cblx0fSxcblxuXHRRdWludGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgKiBrICogayAqIGsgKiBrO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIC0tayAqIGsgKiBrICogayAqIGsgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiBrICogayAqIGsgKiBrICogaztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIDAuNSAqICgoayAtPSAyKSAqIGsgKiBrICogayAqIGsgKyAyKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdFNpbnVzb2lkYWw6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gMSAtIE1hdGguY29zKGsgKiBNYXRoLlBJIC8gMik7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gTWF0aC5zaW4oayAqIE1hdGguUEkgLyAyKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIDAuNSAqICgxIC0gTWF0aC5jb3MoTWF0aC5QSSAqIGspKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdEV4cG9uZW50aWFsOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgPT09IDAgPyAwIDogTWF0aC5wb3coMTAyNCwgayAtIDEpO1xuXG5cdFx0fSxcblxuXHRcdE91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIGsgPT09IDEgPyAxIDogMSAtIE1hdGgucG93KDIsIC0gMTAgKiBrKTtcblxuXHRcdH0sXG5cblx0XHRJbk91dDogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKGsgPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChrID09PSAxKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoKGsgKj0gMikgPCAxKSB7XG5cdFx0XHRcdHJldHVybiAwLjUgKiBNYXRoLnBvdygxMDI0LCBrIC0gMSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiAoLSBNYXRoLnBvdygyLCAtIDEwICogKGsgLSAxKSkgKyAyKTtcblxuXHRcdH1cblxuXHR9LFxuXG5cdENpcmN1bGFyOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0cmV0dXJuIDEgLSBNYXRoLnNxcnQoMSAtIGsgKiBrKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHJldHVybiBNYXRoLnNxcnQoMSAtICgtLWsgKiBrKSk7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmICgoayAqPSAyKSA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIC0gMC41ICogKE1hdGguc3FydCgxIC0gayAqIGspIC0gMSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAwLjUgKiAoTWF0aC5zcXJ0KDEgLSAoayAtPSAyKSAqIGspICsgMSk7XG5cblx0XHR9XG5cblx0fSxcblxuXHRFbGFzdGljOiB7XG5cblx0XHRJbjogZnVuY3Rpb24gKGspIHtcblxuXHRcdFx0aWYgKGsgPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChrID09PSAxKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gLU1hdGgucG93KDIsIDEwICogKGsgLSAxKSkgKiBNYXRoLnNpbigoayAtIDEuMSkgKiA1ICogTWF0aC5QSSk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRpZiAoayA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGsgPT09IDEpIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBNYXRoLnBvdygyLCAtMTAgKiBrKSAqIE1hdGguc2luKChrIC0gMC4xKSAqIDUgKiBNYXRoLlBJKSArIDE7XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmIChrID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoayA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblxuXHRcdFx0ayAqPSAyO1xuXG5cdFx0XHRpZiAoayA8IDEpIHtcblx0XHRcdFx0cmV0dXJuIC0wLjUgKiBNYXRoLnBvdygyLCAxMCAqIChrIC0gMSkpICogTWF0aC5zaW4oKGsgLSAxLjEpICogNSAqIE1hdGguUEkpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gMC41ICogTWF0aC5wb3coMiwgLTEwICogKGsgLSAxKSkgKiBNYXRoLnNpbigoayAtIDEuMSkgKiA1ICogTWF0aC5QSSkgKyAxO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0QmFjazoge1xuXG5cdFx0SW46IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdHZhciBzID0gMS43MDE1ODtcblxuXHRcdFx0cmV0dXJuIGsgKiBrICogKChzICsgMSkgKiBrIC0gcyk7XG5cblx0XHR9LFxuXG5cdFx0T3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHR2YXIgcyA9IDEuNzAxNTg7XG5cblx0XHRcdHJldHVybiAtLWsgKiBrICogKChzICsgMSkgKiBrICsgcykgKyAxO1xuXG5cdFx0fSxcblxuXHRcdEluT3V0OiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHR2YXIgcyA9IDEuNzAxNTggKiAxLjUyNTtcblxuXHRcdFx0aWYgKChrICo9IDIpIDwgMSkge1xuXHRcdFx0XHRyZXR1cm4gMC41ICogKGsgKiBrICogKChzICsgMSkgKiBrIC0gcykpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gMC41ICogKChrIC09IDIpICogayAqICgocyArIDEpICogayArIHMpICsgMik7XG5cblx0XHR9XG5cblx0fSxcblxuXHRCb3VuY2U6IHtcblxuXHRcdEluOiBmdW5jdGlvbiAoaykge1xuXG5cdFx0XHRyZXR1cm4gMSAtIFRXRUVOLkVhc2luZy5Cb3VuY2UuT3V0KDEgLSBrKTtcblxuXHRcdH0sXG5cblx0XHRPdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmIChrIDwgKDEgLyAyLjc1KSkge1xuXHRcdFx0XHRyZXR1cm4gNy41NjI1ICogayAqIGs7XG5cdFx0XHR9IGVsc2UgaWYgKGsgPCAoMiAvIDIuNzUpKSB7XG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiAoayAtPSAoMS41IC8gMi43NSkpICogayArIDAuNzU7XG5cdFx0XHR9IGVsc2UgaWYgKGsgPCAoMi41IC8gMi43NSkpIHtcblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIChrIC09ICgyLjI1IC8gMi43NSkpICogayArIDAuOTM3NTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiA3LjU2MjUgKiAoayAtPSAoMi42MjUgLyAyLjc1KSkgKiBrICsgMC45ODQzNzU7XG5cdFx0XHR9XG5cblx0XHR9LFxuXG5cdFx0SW5PdXQ6IGZ1bmN0aW9uIChrKSB7XG5cblx0XHRcdGlmIChrIDwgMC41KSB7XG5cdFx0XHRcdHJldHVybiBUV0VFTi5FYXNpbmcuQm91bmNlLkluKGsgKiAyKSAqIDAuNTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIFRXRUVOLkVhc2luZy5Cb3VuY2UuT3V0KGsgKiAyIC0gMSkgKiAwLjUgKyAwLjU7XG5cblx0XHR9XG5cblx0fVxuXG59O1xuXG5UV0VFTi5JbnRlcnBvbGF0aW9uID0ge1xuXG5cdExpbmVhcjogZnVuY3Rpb24gKHYsIGspIHtcblxuXHRcdHZhciBtID0gdi5sZW5ndGggLSAxO1xuXHRcdHZhciBmID0gbSAqIGs7XG5cdFx0dmFyIGkgPSBNYXRoLmZsb29yKGYpO1xuXHRcdHZhciBmbiA9IFRXRUVOLkludGVycG9sYXRpb24uVXRpbHMuTGluZWFyO1xuXG5cdFx0aWYgKGsgPCAwKSB7XG5cdFx0XHRyZXR1cm4gZm4odlswXSwgdlsxXSwgZik7XG5cdFx0fVxuXG5cdFx0aWYgKGsgPiAxKSB7XG5cdFx0XHRyZXR1cm4gZm4odlttXSwgdlttIC0gMV0sIG0gLSBmKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZm4odltpXSwgdltpICsgMSA+IG0gPyBtIDogaSArIDFdLCBmIC0gaSk7XG5cblx0fSxcblxuXHRCZXppZXI6IGZ1bmN0aW9uICh2LCBrKSB7XG5cblx0XHR2YXIgYiA9IDA7XG5cdFx0dmFyIG4gPSB2Lmxlbmd0aCAtIDE7XG5cdFx0dmFyIHB3ID0gTWF0aC5wb3c7XG5cdFx0dmFyIGJuID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5CZXJuc3RlaW47XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8PSBuOyBpKyspIHtcblx0XHRcdGIgKz0gcHcoMSAtIGssIG4gLSBpKSAqIHB3KGssIGkpICogdltpXSAqIGJuKG4sIGkpO1xuXHRcdH1cblxuXHRcdHJldHVybiBiO1xuXG5cdH0sXG5cblx0Q2F0bXVsbFJvbTogZnVuY3Rpb24gKHYsIGspIHtcblxuXHRcdHZhciBtID0gdi5sZW5ndGggLSAxO1xuXHRcdHZhciBmID0gbSAqIGs7XG5cdFx0dmFyIGkgPSBNYXRoLmZsb29yKGYpO1xuXHRcdHZhciBmbiA9IFRXRUVOLkludGVycG9sYXRpb24uVXRpbHMuQ2F0bXVsbFJvbTtcblxuXHRcdGlmICh2WzBdID09PSB2W21dKSB7XG5cblx0XHRcdGlmIChrIDwgMCkge1xuXHRcdFx0XHRpID0gTWF0aC5mbG9vcihmID0gbSAqICgxICsgaykpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZm4odlsoaSAtIDEgKyBtKSAlIG1dLCB2W2ldLCB2WyhpICsgMSkgJSBtXSwgdlsoaSArIDIpICUgbV0sIGYgLSBpKTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGlmIChrIDwgMCkge1xuXHRcdFx0XHRyZXR1cm4gdlswXSAtIChmbih2WzBdLCB2WzBdLCB2WzFdLCB2WzFdLCAtZikgLSB2WzBdKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGsgPiAxKSB7XG5cdFx0XHRcdHJldHVybiB2W21dIC0gKGZuKHZbbV0sIHZbbV0sIHZbbSAtIDFdLCB2W20gLSAxXSwgZiAtIG0pIC0gdlttXSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmbih2W2kgPyBpIC0gMSA6IDBdLCB2W2ldLCB2W20gPCBpICsgMSA/IG0gOiBpICsgMV0sIHZbbSA8IGkgKyAyID8gbSA6IGkgKyAyXSwgZiAtIGkpO1xuXG5cdFx0fVxuXG5cdH0sXG5cblx0VXRpbHM6IHtcblxuXHRcdExpbmVhcjogZnVuY3Rpb24gKHAwLCBwMSwgdCkge1xuXG5cdFx0XHRyZXR1cm4gKHAxIC0gcDApICogdCArIHAwO1xuXG5cdFx0fSxcblxuXHRcdEJlcm5zdGVpbjogZnVuY3Rpb24gKG4sIGkpIHtcblxuXHRcdFx0dmFyIGZjID0gVFdFRU4uSW50ZXJwb2xhdGlvbi5VdGlscy5GYWN0b3JpYWw7XG5cblx0XHRcdHJldHVybiBmYyhuKSAvIGZjKGkpIC8gZmMobiAtIGkpO1xuXG5cdFx0fSxcblxuXHRcdEZhY3RvcmlhbDogKGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0dmFyIGEgPSBbMV07XG5cblx0XHRcdHJldHVybiBmdW5jdGlvbiAobikge1xuXG5cdFx0XHRcdHZhciBzID0gMTtcblxuXHRcdFx0XHRpZiAoYVtuXSkge1xuXHRcdFx0XHRcdHJldHVybiBhW25dO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IG47IGkgPiAxOyBpLS0pIHtcblx0XHRcdFx0XHRzICo9IGk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhW25dID0gcztcblx0XHRcdFx0cmV0dXJuIHM7XG5cblx0XHRcdH07XG5cblx0XHR9KSgpLFxuXG5cdFx0Q2F0bXVsbFJvbTogZnVuY3Rpb24gKHAwLCBwMSwgcDIsIHAzLCB0KSB7XG5cblx0XHRcdHZhciB2MCA9IChwMiAtIHAwKSAqIDAuNTtcblx0XHRcdHZhciB2MSA9IChwMyAtIHAxKSAqIDAuNTtcblx0XHRcdHZhciB0MiA9IHQgKiB0O1xuXHRcdFx0dmFyIHQzID0gdCAqIHQyO1xuXG5cdFx0XHRyZXR1cm4gKDIgKiBwMSAtIDIgKiBwMiArIHYwICsgdjEpICogdDMgKyAoLSAzICogcDEgKyAzICogcDIgLSAyICogdjAgLSB2MSkgKiB0MiArIHYwICogdCArIHAxO1xuXG5cdFx0fVxuXG5cdH1cblxufTtcblxuLy8gVU1EIChVbml2ZXJzYWwgTW9kdWxlIERlZmluaXRpb24pXG4oZnVuY3Rpb24gKHJvb3QpIHtcblxuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cblx0XHQvLyBBTURcblx0XHRkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBUV0VFTjtcblx0XHR9KTtcblxuXHR9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuXG5cdFx0Ly8gTm9kZS5qc1xuXHRcdG1vZHVsZS5leHBvcnRzID0gVFdFRU47XG5cblx0fSBlbHNlIGlmIChyb290ICE9PSB1bmRlZmluZWQpIHtcblxuXHRcdC8vIEdsb2JhbCB2YXJpYWJsZVxuXHRcdHJvb3QuVFdFRU4gPSBUV0VFTjtcblxuXHR9XG5cbn0pKHRoaXMpO1xuIiwiY29uc3QgdG9vbHMgPSByZXF1aXJlKCcuLi91dGlscy90b29scy5qcycpO1xyXG5jb25zdCBUV0VFTiA9IHJlcXVpcmUoJ1R3ZWVuLmpzJyk7XHJcblxyXG5jb25zdCBzcGVjUHJvcHMgPSB7J3Bvcyc6J19wb3NpdGlvbicsJ3NjYWxlJzonX3NjYWxlJywnb3BhY2l0eSc6J2FscGhhRmFjdG9yJ307XHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVHdlZW5BY3Rpb257XHJcblxyXG4gIGNvbnN0cnVjdG9yKCl7XHJcbiAgICB0aGlzLnN0YXJ0VHdlZW5UaW1lID0gMDtcclxuICAgIHRoaXMudHdlZW5TdGFydCA9IGZhbHNlO1xyXG4gICAgdGhpcy5fdHdlZW5MaXN0ID0gW107XHJcbiAgfVxyXG5cclxuICBpbml0VHdlZW4oKXtcclxuICAgIHRoaXMuYWRkVXBkYXRlVGFzaygoKT0+e1xyXG4gICAgICBpZih0aGlzLl90d2Vlbkxpc3QubGVuZ3RoKVxyXG4gICAgICAgIFRXRUVOLnVwZGF0ZSgpO1xyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHR3ZWVuKGdhbWVPYmoscHJvcHMsZHVyYXRpb24sZGVsYXkgPSAwKXtcclxuICAgIGxldCBuZXdQcm9wcyA9IHt9O1xyXG5cclxuICAgIE9iamVjdC5rZXlzKHByb3BzKS5mb3JFYWNoKGtleT0+e1xyXG4gICAgICBzZXRQcm9wcyhrZXksIG5ld1Byb3BzLCBnYW1lT2JqLCB0cnVlKTtcclxuICAgIH0pXHJcblxyXG4gICAgaWYoIXRoaXMuc3RhcnRUd2VlblRpbWUpXHJcbiAgICAgIHRoaXMuc3RhcnRUd2VlblRpbWUgPSB0b29scy5nZXRUaW1lKCk7XHJcblxyXG4gICAgbGV0IG5vdyA9IHRvb2xzLmdldFRpbWUoKTtcclxuXHJcbiAgICBsZXQgdHdlZW4gPSBuZXcgVFdFRU4uVHdlZW4obmV3UHJvcHMpLmRlbGF5KGRlbGF5KTtcclxuXHJcbiAgICB0d2Vlbi50byhwcm9wcyxkdXJhdGlvbikub25VcGRhdGUoZnVuY3Rpb24oKXtcclxuICAgICAgaWYodGhpcyA9PT0gZ2FtZU9iailcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBPYmplY3Qua2V5cyh0aGlzKS5mb3JFYWNoKGtleT0+e1xyXG4gICAgICAgIHNldFByb3BzKGtleSwgZ2FtZU9iaiwgdGhpcywgZmFsc2UpO1xyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIHRoaXMuX3R3ZWVuTGlzdC5wdXNoKHR3ZWVuKTtcclxuXHJcbiAgICByZXR1cm4gdHdlZW47XHJcblxyXG4vKipcclxuICogW3NldFByb3BzIGRlc2NyaXB0aW9uXVxyXG4gKiBAcGFyYW0ge1t0eXBlXX0ga2V5ICAgICAgICAg6KaB6I635Y+W5YC855qE5bGe5oCn5ZCNXHJcbiAqIEBwYXJhbSB7W3R5cGVdfSBuZXdQcm9wcyAgICDooqvorr7nva7lgLznmoTlr7nosaFcclxuICogQHBhcmFtIHtbdHlwZV19IG9yaWdpblByb3BzIOWPluWAvOeahOWvueixoVxyXG4gKiBAcGFyYW0ge1t0eXBlXX0gaW52ZXJzZSAgICAg5piv5ZCm5rex5bqm5Y+W5YC877yM5Y2z5LuO5aSa5bGC57uT5p6E5Lit5Y+W5YC8XHJcbiAqL1xyXG4gICAgZnVuY3Rpb24gc2V0UHJvcHMoa2V5LG5ld1Byb3BzLG9yaWdpblByb3BzLGludmVyc2Upe1xyXG4gICAgICBsZXQgc3BsaXRLZXkgPSBrZXkuc3BsaXQoJy4nKTtcclxuICAgICAgbGV0IHRlbXBQcm9wID0gc3BlY1Byb3BzW3NwbGl0S2V5WzBdXTtcclxuICAgICAgaWYodGVtcFByb3Ape1xyXG4gICAgICAgIGlmKCFpbnZlcnNlKXtcclxuICAgICAgICAgIGlmKHNwbGl0S2V5Lmxlbmd0aCA+IDEpXHJcbiAgICAgICAgICAgIG5ld1Byb3BzW3RlbXBQcm9wXVtzcGxpdEtleVsxXV0gPSBvcmlnaW5Qcm9wc1trZXldO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBuZXdQcm9wc1t0ZW1wUHJvcF0gPSBvcmlnaW5Qcm9wc1trZXldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgaWYoc3BsaXRLZXkubGVuZ3RoID4gMSlcclxuICAgICAgICAgICAgbmV3UHJvcHNba2V5XSA9IG9yaWdpblByb3BzW3RlbXBQcm9wXVtzcGxpdEtleVsxXV07XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIG5ld1Byb3BzW2tleV0gPSBvcmlnaW5Qcm9wc1t0ZW1wUHJvcF07XHJcbiAgICAgICAgfVxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICBuZXdQcm9wc1trZXldID0gb3JpZ2luUHJvcHNba2V5XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0IFRXRUVOKCl7XHJcbiAgICByZXR1cm4gVFdFRU47XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlcntcclxuXHJcbiAgc3RhdGljIHJlbmRlclZpZXcocGljYXNzbyl7XHJcbiAgICBsZXQgY3R4ID0gcGljYXNzby5fY3R4O1xyXG5cclxuICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XHJcbiAgICBjdHguZ2xvYmFsQWxwaGEgPSAxO1xyXG4gICAgLy8g5b+F6aG75pS+6L+Z6YeM77yM5LiN54S26aG16Z2i5Lya6Zeq54OBXHJcbiAgICBjdHguY2xlYXJSZWN0KDAsMCxwaWNhc3NvLndpZHRoLHBpY2Fzc28uaGVpZ2h0KTtcclxuXHJcbiAgICAvLyBwaWNhc3NvLmdhbWVPYmplY3RzLmNoaWxkcmVuKGdhbWVPYmo9PntcclxuICAgIC8vICAgaWYoIWdhbWVPYmoudXBkYXRlKVxyXG4gICAgLy8gICAgIHJldHVybjtcclxuXHJcbiAgICAvLyAgIGdhbWVPYmoudXBkYXRlKHBpY2Fzc28udGltZXN0YW1wLCBwaWNhc3NvLnBhc3NlZFRpbWUpO1xyXG5cclxuICAgIC8vICAgaWYoZ2FtZU9iai5oYXNDaGlsZCl7XHJcbiAgICAvLyAgICAgZ2FtZU9iai5jaGlsZHJlbigoY2hpbGRPYmopPT57XHJcbiAgICAvLyAgICAgICBjaGlsZE9iai51cGRhdGUocGljYXNzby50aW1lc3RhbXAsIHBpY2Fzc28ucGFzc2VkVGltZSk7XHJcbiAgICAvLyAgICAgICBfaW5uZXJSZW5kZXIoY2hpbGRPYmopO1xyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gICB9ZWxzZXtcclxuICAgIC8vICAgICBfaW5uZXJSZW5kZXIoZ2FtZU9iaik7XHJcbiAgICAvLyAgIH1cclxuICAgIC8vIH0pO1xyXG5cclxuICAgIHJlbmRlclNwcml0ZShwaWNhc3NvLmdhbWVPYmplY3RzKTtcclxuXHJcbiAgICBmdW5jdGlvbiBfaW5uZXJSZW5kZXIoc3ByaXRlKSB7XHJcbiAgICAgIGxldCB3dCA9IHNwcml0ZS53b3JsZFRyYW5zZm9ybTtcclxuXHJcbiAgICAgIGN0eC5zZXRUcmFuc2Zvcm0od3QuYSx3dC5iLHd0LmMsd3QuZCx3dC50eCx3dC50eSk7XHJcbiAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IHNwcml0ZS53b3JsZEFscGhhO1xyXG5cclxuICAgICAgc3ByaXRlLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlbmRlclNwcml0ZSAoc3ByaXRlKSB7XHJcbiAgICAgIGlmKCFzcHJpdGUubGl2ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBzcHJpdGUudXBkYXRlKHBpY2Fzc28udGltZXN0YW1wLCBwaWNhc3NvLnBhc3NlZFRpbWUpO1xyXG4gICAgICBpZihzcHJpdGUuaGFzQ2hpbGQpe1xyXG4gICAgICAgIHNwcml0ZS5jaGlsZHJlbigoY2hpbGRPYmopPT57XHJcbiAgICAgICAgICByZW5kZXJTcHJpdGUoY2hpbGRPYmopO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICBfaW5uZXJSZW5kZXIoc3ByaXRlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbn0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5XG4gICwgcHJlZml4ID0gJ34nO1xuXG4vKipcbiAqIENvbnN0cnVjdG9yIHRvIGNyZWF0ZSBhIHN0b3JhZ2UgZm9yIG91ciBgRUVgIG9iamVjdHMuXG4gKiBBbiBgRXZlbnRzYCBpbnN0YW5jZSBpcyBhIHBsYWluIG9iamVjdCB3aG9zZSBwcm9wZXJ0aWVzIGFyZSBldmVudCBuYW1lcy5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBFdmVudHMoKSB7fVxuXG4vL1xuLy8gV2UgdHJ5IHRvIG5vdCBpbmhlcml0IGZyb20gYE9iamVjdC5wcm90b3R5cGVgLiBJbiBzb21lIGVuZ2luZXMgY3JlYXRpbmcgYW5cbi8vIGluc3RhbmNlIGluIHRoaXMgd2F5IGlzIGZhc3RlciB0aGFuIGNhbGxpbmcgYE9iamVjdC5jcmVhdGUobnVsbClgIGRpcmVjdGx5LlxuLy8gSWYgYE9iamVjdC5jcmVhdGUobnVsbClgIGlzIG5vdCBzdXBwb3J0ZWQgd2UgcHJlZml4IHRoZSBldmVudCBuYW1lcyB3aXRoIGFcbi8vIGNoYXJhY3RlciB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYnVpbHQtaW4gb2JqZWN0IHByb3BlcnRpZXMgYXJlIG5vdFxuLy8gb3ZlcnJpZGRlbiBvciB1c2VkIGFzIGFuIGF0dGFjayB2ZWN0b3IuXG4vL1xuaWYgKE9iamVjdC5jcmVhdGUpIHtcbiAgRXZlbnRzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgLy9cbiAgLy8gVGhpcyBoYWNrIGlzIG5lZWRlZCBiZWNhdXNlIHRoZSBgX19wcm90b19fYCBwcm9wZXJ0eSBpcyBzdGlsbCBpbmhlcml0ZWQgaW5cbiAgLy8gc29tZSBvbGQgYnJvd3NlcnMgbGlrZSBBbmRyb2lkIDQsIGlQaG9uZSA1LjEsIE9wZXJhIDExIGFuZCBTYWZhcmkgNS5cbiAgLy9cbiAgaWYgKCFuZXcgRXZlbnRzKCkuX19wcm90b19fKSBwcmVmaXggPSBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRhdGlvbiBvZiBhIHNpbmdsZSBldmVudCBsaXN0ZW5lci5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBjb250ZXh0IFRoZSBjb250ZXh0IHRvIGludm9rZSB0aGUgbGlzdGVuZXIgd2l0aC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29uY2U9ZmFsc2VdIFNwZWNpZnkgaWYgdGhlIGxpc3RlbmVyIGlzIGEgb25lLXRpbWUgbGlzdGVuZXIuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBFRShmbiwgY29udGV4dCwgb25jZSkge1xuICB0aGlzLmZuID0gZm47XG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIHRoaXMub25jZSA9IG9uY2UgfHwgZmFsc2U7XG59XG5cbi8qKlxuICogTWluaW1hbCBgRXZlbnRFbWl0dGVyYCBpbnRlcmZhY2UgdGhhdCBpcyBtb2xkZWQgYWdhaW5zdCB0aGUgTm9kZS5qc1xuICogYEV2ZW50RW1pdHRlcmAgaW50ZXJmYWNlLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYW4gYXJyYXkgbGlzdGluZyB0aGUgZXZlbnRzIGZvciB3aGljaCB0aGUgZW1pdHRlciBoYXMgcmVnaXN0ZXJlZFxuICogbGlzdGVuZXJzLlxuICpcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZXZlbnROYW1lcyA9IGZ1bmN0aW9uIGV2ZW50TmFtZXMoKSB7XG4gIHZhciBuYW1lcyA9IFtdXG4gICAgLCBldmVudHNcbiAgICAsIG5hbWU7XG5cbiAgaWYgKHRoaXMuX2V2ZW50c0NvdW50ID09PSAwKSByZXR1cm4gbmFtZXM7XG5cbiAgZm9yIChuYW1lIGluIChldmVudHMgPSB0aGlzLl9ldmVudHMpKSB7XG4gICAgaWYgKGhhcy5jYWxsKGV2ZW50cywgbmFtZSkpIG5hbWVzLnB1c2gocHJlZml4ID8gbmFtZS5zbGljZSgxKSA6IG5hbWUpO1xuICB9XG5cbiAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgICByZXR1cm4gbmFtZXMuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZXZlbnRzKSk7XG4gIH1cblxuICByZXR1cm4gbmFtZXM7XG59O1xuXG4vKipcbiAqIFJldHVybiB0aGUgbGlzdGVuZXJzIHJlZ2lzdGVyZWQgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZXhpc3RzIE9ubHkgY2hlY2sgaWYgdGhlcmUgYXJlIGxpc3RlbmVycy5cbiAqIEByZXR1cm5zIHtBcnJheXxCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbiBsaXN0ZW5lcnMoZXZlbnQsIGV4aXN0cykge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudFxuICAgICwgYXZhaWxhYmxlID0gdGhpcy5fZXZlbnRzW2V2dF07XG5cbiAgaWYgKGV4aXN0cykgcmV0dXJuICEhYXZhaWxhYmxlO1xuICBpZiAoIWF2YWlsYWJsZSkgcmV0dXJuIFtdO1xuICBpZiAoYXZhaWxhYmxlLmZuKSByZXR1cm4gW2F2YWlsYWJsZS5mbl07XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhdmFpbGFibGUubGVuZ3RoLCBlZSA9IG5ldyBBcnJheShsKTsgaSA8IGw7IGkrKykge1xuICAgIGVlW2ldID0gYXZhaWxhYmxlW2ldLmZuO1xuICB9XG5cbiAgcmV0dXJuIGVlO1xufTtcblxuLyoqXG4gKiBDYWxscyBlYWNoIG9mIHRoZSBsaXN0ZW5lcnMgcmVnaXN0ZXJlZCBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xTeW1ib2x9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHJldHVybnMge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgZXZlbnQgaGFkIGxpc3RlbmVycywgZWxzZSBgZmFsc2VgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdChldmVudCwgYTEsIGEyLCBhMywgYTQsIGE1KSB7XG4gIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHJldHVybiBmYWxzZTtcblxuICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW2V2dF1cbiAgICAsIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIGFyZ3NcbiAgICAsIGk7XG5cbiAgaWYgKGxpc3RlbmVycy5mbikge1xuICAgIGlmIChsaXN0ZW5lcnMub25jZSkgdGhpcy5yZW1vdmVMaXN0ZW5lcihldmVudCwgbGlzdGVuZXJzLmZuLCB1bmRlZmluZWQsIHRydWUpO1xuXG4gICAgc3dpdGNoIChsZW4pIHtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0KSwgdHJ1ZTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSksIHRydWU7XG4gICAgICBjYXNlIDM6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyKSwgdHJ1ZTtcbiAgICAgIGNhc2UgNDogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzKSwgdHJ1ZTtcbiAgICAgIGNhc2UgNTogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzLCBhNCksIHRydWU7XG4gICAgICBjYXNlIDY6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMywgYTQsIGE1KSwgdHJ1ZTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAxLCBhcmdzID0gbmV3IEFycmF5KGxlbiAtMSk7IGkgPCBsZW47IGkrKykge1xuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuXG4gICAgbGlzdGVuZXJzLmZuLmFwcGx5KGxpc3RlbmVycy5jb250ZXh0LCBhcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbGVuZ3RoID0gbGlzdGVuZXJzLmxlbmd0aFxuICAgICAgLCBqO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobGlzdGVuZXJzW2ldLm9uY2UpIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyc1tpXS5mbiwgdW5kZWZpbmVkLCB0cnVlKTtcblxuICAgICAgc3dpdGNoIChsZW4pIHtcbiAgICAgICAgY2FzZSAxOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCk7IGJyZWFrO1xuICAgICAgICBjYXNlIDI6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhMSk7IGJyZWFrO1xuICAgICAgICBjYXNlIDM6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhMSwgYTIpOyBicmVhaztcbiAgICAgICAgY2FzZSA0OiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEsIGEyLCBhMyk7IGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGlmICghYXJncykgZm9yIChqID0gMSwgYXJncyA9IG5ldyBBcnJheShsZW4gLTEpOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaiAtIDFdID0gYXJndW1lbnRzW2pdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxpc3RlbmVyc1tpXS5mbi5hcHBseShsaXN0ZW5lcnNbaV0uY29udGV4dCwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIEFkZCBhIGxpc3RlbmVyIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBbY29udGV4dD10aGlzXSBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gb24oZXZlbnQsIGZuLCBjb250ZXh0KSB7XG4gIHZhciBsaXN0ZW5lciA9IG5ldyBFRShmbiwgY29udGV4dCB8fCB0aGlzKVxuICAgICwgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1tldnRdKSB0aGlzLl9ldmVudHNbZXZ0XSA9IGxpc3RlbmVyLCB0aGlzLl9ldmVudHNDb3VudCsrO1xuICBlbHNlIGlmICghdGhpcy5fZXZlbnRzW2V2dF0uZm4pIHRoaXMuX2V2ZW50c1tldnRdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlIHRoaXMuX2V2ZW50c1tldnRdID0gW3RoaXMuX2V2ZW50c1tldnRdLCBsaXN0ZW5lcl07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZCBhIG9uZS10aW1lIGxpc3RlbmVyIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgbGlzdGVuZXIgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBbY29udGV4dD10aGlzXSBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbiBvbmNlKGV2ZW50LCBmbiwgY29udGV4dCkge1xuICB2YXIgbGlzdGVuZXIgPSBuZXcgRUUoZm4sIGNvbnRleHQgfHwgdGhpcywgdHJ1ZSlcbiAgICAsIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgdGhpcy5fZXZlbnRzW2V2dF0gPSBsaXN0ZW5lciwgdGhpcy5fZXZlbnRzQ291bnQrKztcbiAgZWxzZSBpZiAoIXRoaXMuX2V2ZW50c1tldnRdLmZuKSB0aGlzLl9ldmVudHNbZXZ0XS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZSB0aGlzLl9ldmVudHNbZXZ0XSA9IFt0aGlzLl9ldmVudHNbZXZ0XSwgbGlzdGVuZXJdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGxpc3RlbmVycyBvZiBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfFN5bWJvbH0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBPbmx5IHJlbW92ZSB0aGUgbGlzdGVuZXJzIHRoYXQgbWF0Y2ggdGhpcyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7TWl4ZWR9IGNvbnRleHQgT25seSByZW1vdmUgdGhlIGxpc3RlbmVycyB0aGF0IGhhdmUgdGhpcyBjb250ZXh0LlxuICogQHBhcmFtIHtCb29sZWFufSBvbmNlIE9ubHkgcmVtb3ZlIG9uZS10aW1lIGxpc3RlbmVycy5cbiAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9IGB0aGlzYC5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcihldmVudCwgZm4sIGNvbnRleHQsIG9uY2UpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgcmV0dXJuIHRoaXM7XG4gIGlmICghZm4pIHtcbiAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgIGVsc2UgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1tldnRdO1xuXG4gIGlmIChsaXN0ZW5lcnMuZm4pIHtcbiAgICBpZiAoXG4gICAgICAgICBsaXN0ZW5lcnMuZm4gPT09IGZuXG4gICAgICAmJiAoIW9uY2UgfHwgbGlzdGVuZXJzLm9uY2UpXG4gICAgICAmJiAoIWNvbnRleHQgfHwgbGlzdGVuZXJzLmNvbnRleHQgPT09IGNvbnRleHQpXG4gICAgKSB7XG4gICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMCkgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgICAgZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2dF07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGkgPSAwLCBldmVudHMgPSBbXSwgbGVuZ3RoID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoXG4gICAgICAgICAgIGxpc3RlbmVyc1tpXS5mbiAhPT0gZm5cbiAgICAgICAgfHwgKG9uY2UgJiYgIWxpc3RlbmVyc1tpXS5vbmNlKVxuICAgICAgICB8fCAoY29udGV4dCAmJiBsaXN0ZW5lcnNbaV0uY29udGV4dCAhPT0gY29udGV4dClcbiAgICAgICkge1xuICAgICAgICBldmVudHMucHVzaChsaXN0ZW5lcnNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vXG4gICAgLy8gUmVzZXQgdGhlIGFycmF5LCBvciByZW1vdmUgaXQgY29tcGxldGVseSBpZiB3ZSBoYXZlIG5vIG1vcmUgbGlzdGVuZXJzLlxuICAgIC8vXG4gICAgaWYgKGV2ZW50cy5sZW5ndGgpIHRoaXMuX2V2ZW50c1tldnRdID0gZXZlbnRzLmxlbmd0aCA9PT0gMSA/IGV2ZW50c1swXSA6IGV2ZW50cztcbiAgICBlbHNlIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKSB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgZWxzZSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2dF07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFsbCBsaXN0ZW5lcnMsIG9yIHRob3NlIG9mIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8U3ltYm9sfSBbZXZlbnRdIFRoZSBldmVudCBuYW1lLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbiByZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnQpIHtcbiAgdmFyIGV2dDtcblxuICBpZiAoZXZlbnQpIHtcbiAgICBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuICAgIGlmICh0aGlzLl9ldmVudHNbZXZ0XSkge1xuICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHRoaXMuX2V2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICAgIGVsc2UgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vL1xuLy8gQWxpYXMgbWV0aG9kcyBuYW1lcyBiZWNhdXNlIHBlb3BsZSByb2xsIGxpa2UgdGhhdC5cbi8vXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbjtcblxuLy9cbi8vIFRoaXMgZnVuY3Rpb24gZG9lc24ndCBhcHBseSBhbnltb3JlLlxuLy9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24gc2V0TWF4TGlzdGVuZXJzKCkge1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vXG4vLyBFeHBvc2UgdGhlIHByZWZpeC5cbi8vXG5FdmVudEVtaXR0ZXIucHJlZml4ZWQgPSBwcmVmaXg7XG5cbi8vXG4vLyBBbGxvdyBgRXZlbnRFbWl0dGVyYCB0byBiZSBpbXBvcnRlZCBhcyBtb2R1bGUgbmFtZXNwYWNlLlxuLy9cbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbi8vXG4vLyBFeHBvc2UgdGhlIG1vZHVsZS5cbi8vXG5pZiAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBtb2R1bGUpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG59XG4iLCJcclxudmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xyXG5cclxuLyoqXHJcbiAqIFxyXG4gKiBAcGFyYW0geyp9IGNiIGlmIHByb3AncyBmaXJzdCB2YWx1ZSBpcyBmdW5jdGlvbix0aGVuIGNiIG11c3QgcGFzcyBmdW5jdGlvbiBvciBudWxsXHJcbiAqIEBwYXJhbSB7Kn0gc2NvcGUgY2FsbGJhY2sgZXhlY3V0ZSB3aXRoIHNjb3BlXHJcbiAqIEBwYXJhbSB7Kn0gcHJvcExpc3QgcHJvcCBuYW1lXHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVPYnNlcnZlKGNiLHNjb3BlLC4uLnByb3BMaXN0KXtcclxuXHJcbiAgdmFyIG1haW5BcmdzTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcclxuXHJcbi8qKlxyXG4gKiBhcmd1bWVudHMgaXMgc2FtZSBhcyBhYm92ZSBjcmVhdGVPYnNlcnZlICxidXQgaXMgdGhlIHZhbHVlIG9mIHByb3AgbmFtZVxyXG4gKiBpZiBmaXJzdCBhcmcgaXMgZnVuY3Rpb24gLHRoZW4gaXQgbXVzdCBiZSBjYWxsYmFja1xyXG4gKiBpZiBzZWNvbmQgYXJnIGlzIG9iamVjdCAsIHRoZW4gaXQgbXVzdCBiZSBzY29wZVxyXG4gKi9cclxuICBmdW5jdGlvbiBPYnNlcnZlT2JqZWN0KC4uLnByb3BWYWx1ZUxpc3Qpe1xyXG4gICAgbGV0IGFyZ3MgPSBwcm9wVmFsdWVMaXN0LFxyXG4gICAgICAgIG9ialNjb3BlO1xyXG5cclxuICAgIGlmKG1haW5BcmdzTGVuID09IGFyZ3VtZW50cy5sZW5ndGggfHwgdHlwZW9mIGFyZ3NbMF0gPT09ICdmdW5jdGlvbicpe1xyXG4gICAgICB0aGlzLmNiID0gYXJnc1swXTtcclxuICAgICAgaWYodHlwZW9mIGFyZ3NbMV0gPT09ICdvYmplY3QnKXtcclxuICAgICAgICBvYmpTY29wZSA9IGFyZ3NbMV07XHJcbiAgICAgICAgYXJncyA9IGFyZ3Muc2xpY2UoMik7XHJcbiAgICAgIH1lbHNlXHJcbiAgICAgICAgYXJncyA9IGFyZ3Muc2xpY2UoMSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGFyZ3MuZm9yRWFjaCgoYXJnLCBpbmRleCk9PntcclxuICAgICAgdGhpc1tgXyR7cHJvcExpc3RbaW5kZXhdfWBdID0gYXJnO1xyXG4gICAgfSlcclxuXHJcbiAgICB0aGlzLmNiID0gdGhpcy5jYiB8fCBjYiB8fCBmdW5jdGlvbigpe307XHJcbiAgICB0aGlzLnNjb3BlID0gb2JqU2NvcGUgfHwgc2NvcGUgfHwgdGhpcztcclxuICB9XHJcblxyXG4gIHByb3BMaXN0LmZvckVhY2gocHJvcD0+e1xyXG4gICAgX2NyZWF0ZUNsYXNzKE9ic2VydmVPYmplY3QsIFt7XHJcbiAgICAgIGtleTogcHJvcCxcclxuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbYF8ke3Byb3B9YF07XHJcbiAgICAgIH0sXHJcbiAgICAgIHNldCh2YWwpe1xyXG4gICAgICAgIGxldCBfcHJvcCA9ICdfJyArIHByb3A7XHJcblxyXG4gICAgICAgIGlmKHRoaXNbX3Byb3BdID09PSB2YWwpXHJcbiAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXNbX3Byb3BdID0gdmFsO1xyXG5cclxuICAgICAgICB0aGlzLmNiLmNhbGwodGhpcy5zY29wZSk7XHJcbiAgICAgIH1cclxuICAgIH1dKTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIE9ic2VydmVPYmplY3Q7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZU9ic2VydmU7IiwiaW1wb3J0IGNyZWF0ZU9ic2VydmUgZnJvbSAnLi9PYnNlcnZlT2JqZWN0LmpzJztcclxuXHJcbnZhciBQb2ludCA9IGNyZWF0ZU9ic2VydmUobnVsbCxudWxsLCd4JywneScpO1xyXG5cclxuUG9pbnQucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHgsIHkpe1xyXG4gIGNvbnN0IF94ID0geCB8fCAwO1xyXG4gIGNvbnN0IF95ID0geSB8fCAoKHkgIT09IDApID8gX3ggOiAwKTtcclxuXHJcbiAgaWYodGhpcy5feCAhPT0gX3ggfHwgdGhpcy5feSAhPT0gX3kpe1xyXG4gICAgdGhpcy5feCA9IF94O1xyXG4gICAgdGhpcy5feSA9IF95O1xyXG4gICAgdGhpcy5jYigpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUG9pbnQ7XHJcbiIsImltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRlbWl0dGVyMyc7XHJcbmltcG9ydCBQb2ludCBmcm9tICcuLi91dGlscy9Qb2ludCc7XHJcblxyXG5jb25zdCBEZWZhdWx0U2V0dGluZ3MgPSB7XHJcbiAgZGlzYWJsZVRvdWNoOiBmYWxzZVxyXG59XHJcbmxldCBub3csIGRlbHRhLCBkZWx0YVggPSAwLCBkZWx0YVkgPSAwLCB0YXBUaW1lb3V0O1xyXG5cclxuY2xhc3MgRXZlbnRNYW5hZ2VyIGV4dGVuZHMgRXZlbnRFbWl0dGVye1xyXG4gIGNvbnN0cnVjdG9yKHBpY2Fzc28sb3B0aW9ucyl7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sRGVmYXVsdFNldHRpbmdzLG9wdGlvbnMpO1xyXG5cclxuICAgIHRoaXMuaW50ZXJhY3Rpb25Eb21FbGVtZW50ID0gcGljYXNzby52aWV3RWxlbWVudDtcclxuXHJcbiAgICB0aGlzLmhhc1RvdWNoID0gJ29udG91Y2hzdGFydCcgaW4gd2luZG93O1xyXG5cclxuICAgIHRoaXMuaGFzUG9pbnRlciA9ICEhKHdpbmRvdy5Qb2ludGVyRXZlbnQgfHwgd2luZG93Lk1TUG9pbnRlckV2ZW50KTtcclxuXHJcbiAgICB0aGlzLnJlbmRlciA9IHBpY2Fzc287XHJcblxyXG4gICAgdGhpcy5pbml0RXZlbnRzKCk7XHJcbiAgfVxyXG4gIGFkZEV2ZW50IChlbCwgdHlwZSwgZm4pIHtcclxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZm4sIGZhbHNlKTtcclxuICB9XHJcbiAgcmVtb3ZlRXZlbnQgKGVsLCB0eXBlLCBmbikge1xyXG4gICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBmbiwgZmFsc2UpO1xyXG4gIH1cclxuICBFdmVudCAoZXZlbnROYW1lLHByb3BzKSB7XHJcblxyXG4gICAgICAgIHZhciBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudHMnKVxyXG4gICAgICAgICAgLCBidWJibGVzID0gdHJ1ZVxyXG4gICAgICAgIGlmIChwcm9wcylcclxuICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBwcm9wcylcclxuICAgICAgICAgICAgICAgIChuYW1lID09ICdidWJibGVzJykgPyAoYnViYmxlcyA9ICEhcHJvcHNbbmFtZV0pIDogKGV2ZW50W25hbWVdID0gcHJvcHNbbmFtZV0pXHJcbiAgICAgICAgZXZlbnQuaW5pdEV2ZW50KGV2ZW50TmFtZSwgYnViYmxlcywgdHJ1ZSlcclxuICAgIC8vIHZhciBldiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudHMnKSxcclxuICAgIC8vICAgICBpc0J1YmJsZXMgPSB0cnVlO1xyXG5cclxuICAgIC8vIGlmKGV2dCl7XHJcbiAgICAvLyAgIGZvcih2YXIgcCBpbiBldnQpe1xyXG4gICAgLy8gICAgIGlmKHAgPT0gJ2J1YmJsZXMnKVxyXG4gICAgLy8gICAgICAgaXNCdWJibGVzID0gISFldnRbcF07XHJcbiAgICAvLyAgICAgZWxzZVxyXG4gICAgLy8gICAgICAgZXZbcF0gPSBldnRbcF07XHJcbiAgICAvLyAgIH1cclxuICAgIC8vIH1cclxuICAgIC8vIGV2Lm9yaWdpbkV2ZW50ID0gZXZ0O1xyXG4gICAgLy8gZXYuaW5pdEV2ZW50KGV2ZW50TmFtZSwgaXNCdWJibGVzLCB0cnVlKTtcclxuXHJcbiAgICByZXR1cm4gZXY7XHJcbiAgfVxyXG4gIGluaXRFdmVudHMgKHJlbW92ZSkge1xyXG4gICAgdmFyIGV2ZW50VHlwZSA9IHJlbW92ZSA/IHRoaXMucmVtb3ZlRXZlbnQgOiB0aGlzLmFkZEV2ZW50LFxyXG4gICAgICAgIHRhcmdldCA9IHRoaXMuaW50ZXJhY3Rpb25Eb21FbGVtZW50O1xyXG5cclxuICAgIGlmICggdGhpcy5oYXNUb3VjaCAmJiAhdGhpcy5vcHRpb25zLmRpc2FibGVUb3VjaCApIHtcclxuICAgICAgZXZlbnRUeXBlKHRhcmdldCwgJ3RvdWNoc3RhcnQnLCB0aGlzKTtcclxuICAgICAgZXZlbnRUeXBlKHRhcmdldCwgJ3RvdWNobW92ZScsIHRoaXMpO1xyXG4gICAgICBldmVudFR5cGUodGFyZ2V0LCAndG91Y2hjYW5jZWwnLCB0aGlzKTtcclxuICAgICAgZXZlbnRUeXBlKHRhcmdldCwgJ3RvdWNoZW5kJywgdGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoYW5kbGVFdmVudCAoZSkge1xyXG4gICAgc3dpdGNoICggZS50eXBlICkge1xyXG4gICAgICBjYXNlICd0b3VjaHN0YXJ0JzpcclxuICAgICAgY2FzZSAncG9pbnRlcmRvd24nOlxyXG4gICAgICBjYXNlICdNU1BvaW50ZXJEb3duJzpcclxuICAgICAgY2FzZSAnbW91c2Vkb3duJzpcclxuICAgICAgICB0aGlzLl9zdGFydChlKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAndG91Y2htb3ZlJzpcclxuICAgICAgY2FzZSAncG9pbnRlcm1vdmUnOlxyXG4gICAgICBjYXNlICdNU1BvaW50ZXJNb3ZlJzpcclxuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcclxuICAgICAgICB0aGlzLl9tb3ZlKGUpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICd0b3VjaGVuZCc6XHJcbiAgICAgIGNhc2UgJ3BvaW50ZXJ1cCc6XHJcbiAgICAgIGNhc2UgJ01TUG9pbnRlclVwJzpcclxuICAgICAgY2FzZSAnbW91c2V1cCc6XHJcbiAgICAgIGNhc2UgJ3RvdWNoY2FuY2VsJzpcclxuICAgICAgY2FzZSAncG9pbnRlcmNhbmNlbCc6XHJcbiAgICAgIGNhc2UgJ01TUG9pbnRlckNhbmNlbCc6XHJcbiAgICAgIGNhc2UgJ21vdXNlY2FuY2VsJzpcclxuICAgICAgICB0aGlzLl9lbmQoZSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBfc3RhcnQgKGUpIHtcclxuICAgIGNvbnN0IHBvaW50ID0gZS50b3VjaGVzID8gZS50b3VjaGVzWzBdIDogZTtcclxuXHJcbiAgICBub3cgPSBEYXRlLm5vdygpO1xyXG5cclxuICAgIGRlbHRhID0gbm93IC0gKHRoaXMubGFzdCB8fCBub3cpO1xyXG5cclxuICAgIHRoaXMueDEgPSBwb2ludC5wYWdlWDtcclxuICAgIHRoaXMueTEgPSBwb2ludC5wYWdlWTtcclxuXHJcbiAgICB0aGlzLmxhc3QgPSBub3c7XHJcbiAgfVxyXG5cclxuICBfbW92ZSAoZSkge1xyXG4gICAgY29uc3QgcG9pbnQgPSBlLnRvdWNoZXMgPyBlLnRvdWNoZXNbMF0gOiBlO1xyXG5cclxuICAgIHRoaXMueDIgPSBwb2ludC5wYWdlWDtcclxuICAgIHRoaXMueTIgPSBwb2ludC5wYWdlWTtcclxuXHJcbiAgICBkZWx0YVggKz0gTWF0aC5hYnModGhpcy54MSAtIHRoaXMueDIpXHJcbiAgICBkZWx0YVkgKz0gTWF0aC5hYnModGhpcy55MSAtIHRoaXMueTIpXHJcbiAgfVxyXG5cclxuICBfZW5kIChlKSB7XHJcbiAgICBjb25zdCBwb2ludCA9IGUuY2hhbmdlZFRvdWNoZXMgPyBlLmNoYW5nZWRUb3VjaGVzWzBdIDogZTtcclxuICAgIGNvbnN0IGhpdFBvaW50ID0gbmV3IFBvaW50KHBvaW50LnBhZ2VYIC8gdGhpcy5yZW5kZXIuX3NjYWxlUmVzLHBvaW50LnBhZ2VZIC8gdGhpcy5yZW5kZXIuX3NjYWxlUmVzKTtcclxuICAgIGxldCBoaXRUYXJnZXMgPSBbXSxcclxuICAgICAgICBlbWl0UGFyZW50SWRzID0ge307XHJcblxyXG4gICAgdGhpcy5wcm9jZXNzSW50ZXJhY3RpdmUoaGl0UG9pbnQsIHRoaXMucmVuZGVyLmdhbWVPYmplY3RzLGhpdFRhcmdlcyk7XHJcblxyXG4gICAgaWYgKGRlbHRhWCA8IDMwICYmIGRlbHRhWSA8IDMwKSB7XHJcbiAgICAgIGxldCBldmVudCA9IHRoaXMuRXZlbnQoJ3RhcCcscG9pbnQpO1xyXG4gICAgICBoaXRUYXJnZXMuZm9yRWFjaChoaXRUYXJnZXQ9PntcclxuICAgICAgICBsZXQgcGFyID0gaGl0VGFyZ2V0LnBhcmVudEdyb3VwO1xyXG4gICAgICAgIGhpdFRhcmdldC5lbWl0KCd0YXAnLGV2ZW50KTtcclxuICAgICAgICBpZihwYXIgJiYgIWVtaXRQYXJlbnRJZHNbcGFyLl9pZF0pe1xyXG4gICAgICAgICAgcGFyLmVtaXQoJ3RhcCcsZXZlbnQpO1xyXG4gICAgICAgICAgZW1pdFBhcmVudElkc1twYXIuX2lkXSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICB9XHJcbiAgICB0aGlzLmNhbmNlbEFsbCgpO1xyXG4gIH1cclxuXHJcbiAgY2FuY2VsQWxsICgpIHtcclxuICAgIGRlbHRhWCA9IGRlbHRhWSA9IDA7XHJcbiAgfVxyXG5cclxuICBwcm9jZXNzSW50ZXJhY3RpdmUocG9pbnQsZ2FtZU9iaixoaXRUYXJnZXMpe1xyXG4gICAgbGV0IGhpdDtcclxuXHJcbiAgICBpZighZ2FtZU9iai5saXZlZCB8fCBoaXRUYXJnZXMubGVuZ3RoKVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgaWYoZ2FtZU9iai5oYXNDaGlsZCl7XHJcbiAgICAgIGdhbWVPYmouY2hpbGRyZW4oKGNoaWxkT2JqKT0+e1xyXG4gICAgICAgIGxldCBpc0hpdCA9IHRoaXMucHJvY2Vzc0ludGVyYWN0aXZlKHBvaW50LGNoaWxkT2JqLGhpdFRhcmdlcyk7XHJcblxyXG4gICAgICAgIHJldHVybiAhaXNIaXQ7XHJcbiAgICAgIH0sdHJ1ZSk7XHJcbiAgICB9ZWxzZSBpZihnYW1lT2JqLmludGVyYWN0aXZlIHx8IChnYW1lT2JqLnBhcmVudEdyb3VwICYmIGdhbWVPYmoucGFyZW50R3JvdXAuaW50ZXJhY3RpdmUpKXtcclxuICAgICAgaGl0ID0gZ2FtZU9iai5jb250YWlucyhwb2ludCk7XHJcblxyXG4gICAgICBpZihoaXQpe1xyXG4gICAgICAgIGhpdFRhcmdlcy5wdXNoKGdhbWVPYmopXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBoaXQ7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFdmVudE1hbmFnZXIiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBsb2FkZXJ7XHJcbiAgY29uc3RydWN0b3IoY2Ipe1xyXG4gICAgdGhpcy5sb2FkQ291bnQgPSAwO1xyXG4gICAgdGhpcy5fX2xvYWRlZEhhc2ggPSB7fTtcclxuICAgIHRoaXMuY29tcGxldGVDYWxsYmFjayA9IGNiO1xyXG4gIH1cclxuXHJcbiAgbG9hZEltZyhrZXksdXJsLGZvcm1hdCl7XHJcbiAgICBsZXQgbG9hZFJldCA9IHRoaXMuX19sb2FkZWRIYXNoW2tleV07XHJcblxyXG4gICAgaWYoISFsb2FkUmV0KVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgdGhpcy5sb2FkQ291bnQrKztcclxuXHJcbiAgICBsZXQgaW1nID0gbmV3IEltYWdlO1xyXG5cclxuICAgIGltZy5zcmMgPSB1cmw7XHJcblxyXG4gICAgaW1nLm9ubG9hZCA9IGV2dCA9PiB7XHJcbiAgICAgIHRoaXMuX19sb2FkZWRIYXNoW2tleV0uX2xvYWRlZCA9IDE7XHJcbiAgICAgIGFmdGVyTG9hZC5jYWxsKHRoaXMpO1xyXG4gICAgICBpbWcub25sb2FkID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9fbG9hZGVkSGFzaFtrZXldID0gaW1nO1xyXG5cclxuICAgIGlmKGZvcm1hdClcclxuICAgICAgdGhpcy5fX2xvYWRlZEhhc2hba2V5XS5yZXNmb3JtYXQgPSBmb3JtYXQ7XHJcblxyXG4gICAgZnVuY3Rpb24gYWZ0ZXJMb2FkKCl7XHJcbiAgICAgIHRoaXMubG9hZENvdW50LS07XHJcbiAgICAgIGlmKCF0aGlzLmxvYWRDb3VudClcclxuICAgICAgICB0aGlzLmNvbXBsZXRlQ2FsbGJhY2sgJiYgdGhpcy5jb21wbGV0ZUNhbGxiYWNrKHRoaXMuX19sb2FkZWRIYXNoKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJpbXBvcnQgUG9pbnQgZnJvbSAnLi9Qb2ludCc7XHJcbi8qKlxyXG4gKiB8IGEgfCBiIHwgdHh8XHJcbiAqIHwgYyB8IGQgfCB0eXxcclxuICogfCAwIHwgMCB8IDEgfFxyXG4gKi9cclxuY2xhc3MgVHJhbnNmb3JtTWF0cml4e1xyXG4gIGNvbnN0cnVjdG9yKCl7XHJcbiAgICB0aGlzLmEgPSAxO1xyXG4gICAgdGhpcy5iID0gMDtcclxuICAgIHRoaXMuYyA9IDA7XHJcbiAgICB0aGlzLmQgPSAxO1xyXG4gICAgdGhpcy50eCA9IDA7XHJcbiAgICB0aGlzLnR5ID0gMDtcclxuICAgIHRoaXMuYXJyYXkgPSBudWxsO1xyXG5cclxuICB9XHJcblxyXG4gIHNldChhLCBiLCBjLCBkLCB0eCwgdHkpe1xyXG4gICAgdGhpcy5hID0gYTtcclxuICAgIHRoaXMuYiA9IGI7XHJcbiAgICB0aGlzLmMgPSBjO1xyXG4gICAgdGhpcy5kID0gZDtcclxuICAgIHRoaXMudHggPSB0eDtcclxuICAgIHRoaXMudHkgPSB0eTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4vL+WvueixoeWdkOagh+i9rOaNouWIsOS4lueVjOWdkOagh1xyXG4gIGFwcGx5KHBvcywgbmV3UG9zKXtcclxuICAgIG5ld1BvcyA9IG5ld1BvcyB8fCBuZXcgUG9pbnQoKTtcclxuXHJcbiAgICBjb25zdCB4ID0gcG9zLng7XHJcbiAgICBjb25zdCB5ID0gcG9zLnk7XHJcblxyXG4gICAgbmV3UG9zLnggPSAodGhpcy5hICogeCkgKyAodGhpcy5jICogeSkgKyB0aGlzLnR4O1xyXG4gICAgbmV3UG9zLnkgPSAodGhpcy5iICogeCkgKyAodGhpcy5kICogeSkgKyB0aGlzLnR5O1xyXG5cclxuICAgIHJldHVybiBuZXdQb3M7XHJcbiAgfVxyXG5cclxuLy/ku47kuJbnlYzlnZDmoIfovazkuLrlr7nosaHlnZDmoIdcclxuICBhcHBseUludmVyc2UocG9zLCBuZXdQb3Mpe1xyXG4gICAgbmV3UG9zID0gbmV3UG9zIHx8IG5ldyBQb2ludCgpO1xyXG5cclxuICAgIGNvbnN0IGlkID0gMSAvICgodGhpcy5hICogdGhpcy5kKSArICh0aGlzLmMgKiAtdGhpcy5iKSk7XHJcblxyXG4gICAgY29uc3QgeCA9IHBvcy54O1xyXG4gICAgY29uc3QgeSA9IHBvcy55O1xyXG5cclxuICAgIG5ld1Bvcy54ID0gKHRoaXMuZCAqIGlkICogeCkgKyAoLXRoaXMuYyAqIGlkICogeSkgKyAoKCh0aGlzLnR5ICogdGhpcy5jKSAtICh0aGlzLnR4ICogdGhpcy5kKSkgKiBpZCk7XHJcbiAgICBuZXdQb3MueSA9ICh0aGlzLmEgKiBpZCAqIHkpICsgKC10aGlzLmIgKiBpZCAqIHgpICsgKCgoLXRoaXMudHkgKiB0aGlzLmEpICsgKHRoaXMudHggKiB0aGlzLmIpKSAqIGlkKTtcclxuXHJcbiAgICByZXR1cm4gbmV3UG9zO1xyXG4gIH1cclxuICB0cmFuc2xhdGUoeCwgeSl7XHJcbiAgICB0aGlzLnR4ICs9IHg7XHJcbiAgICB0aGlzLnR5ICs9IHk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBzY2FsZSh4LCB5KXtcclxuICAgIHRoaXMuYSAqPSB4O1xyXG4gICAgdGhpcy5kICo9IHk7XHJcbiAgICB0aGlzLmMgKj0geDtcclxuICAgIHRoaXMuYiAqPSB5O1xyXG4gICAgdGhpcy50eCAqPSB4O1xyXG4gICAgdGhpcy50eSAqPSB5O1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcblxyXG4gIHRvQXJyYXkodHJhbnNwb3NlLCBvdXQpe1xyXG4gICAgaWYgKCF0aGlzLmFycmF5KXtcclxuICAgICAgICB0aGlzLmFycmF5ID0gbmV3IEZsb2F0MzJBcnJheSg5KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhcnJheSA9IG91dCB8fCB0aGlzLmFycmF5O1xyXG5cclxuICAgIGFycmF5WzBdID0gdGhpcy5hO1xyXG4gICAgYXJyYXlbMV0gPSB0aGlzLmM7XHJcbiAgICBhcnJheVsyXSA9IHRoaXMudHg7XHJcbiAgICBhcnJheVszXSA9IHRoaXMuYjtcclxuICAgIGFycmF5WzRdID0gdGhpcy5kO1xyXG4gICAgYXJyYXlbNV0gPSB0aGlzLnR5O1xyXG4gICAgYXJyYXlbNl0gPSAwO1xyXG4gICAgYXJyYXlbN10gPSAwO1xyXG4gICAgYXJyYXlbOF0gPSAxO1xyXG5cclxuICAgIHJldHVybiBhcnJheTtcclxuICB9XHJcbn1cclxuXHJcblRyYW5zZm9ybU1hdHJpeC5zdGF0aWNNYXRyaXggPSBuZXcgVHJhbnNmb3JtTWF0cml4KCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUcmFuc2Zvcm1NYXRyaXg7IiwiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudGVtaXR0ZXIzJztcclxuaW1wb3J0IFBvaW50IGZyb20gJy4uL3V0aWxzL1BvaW50JztcclxuaW1wb3J0IFRyYW5zZm9ybU1hdHJpeCBmcm9tICcuLi91dGlscy9UcmFuc2Zvcm1NYXRyaXguanMnO1xyXG5cclxubGV0IGdhbWVJZCA9IDA7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlRGlzcGxheU9iamVjdCBleHRlbmRzIEV2ZW50RW1pdHRlcntcclxuICBjb25zdHJ1Y3Rvcih0eXBlLHgseSx3LGgpe1xyXG4gICAgc3VwZXIoKTtcclxuXHJcbiAgICB0aGlzLl9pZCA9ICsrZ2FtZUlkO1xyXG5cclxuICAgIHRoaXMubG9jYWxUcmFuc2Zvcm0gPSBuZXcgVHJhbnNmb3JtTWF0cml4KCk7XHJcbiAgICB0aGlzLndvcmxkVHJhbnNmb3JtID0gbmV3IFRyYW5zZm9ybU1hdHJpeCgpO1xyXG5cclxuICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICB0aGlzLmxpdmVkID0gdHJ1ZTtcclxuICAgIHRoaXMuX2RpcnR5ID0gdHJ1ZTtcclxuICAgIHRoaXMucGFyZW50R3JvdXAgPSBudWxsO1xyXG4gICAgdGhpcy5fcG9zaXRpb24gPSBuZXcgUG9pbnQodGhpcy5jaGFuZ2VDYWxsYmFjayx0aGlzLHggfHwgMCx5IHx8IDApO1xyXG4gICAgdGhpcy5fYW5jaG9yID0gbmV3IFBvaW50KHRoaXMuY2hhbmdlQ2FsbGJhY2ssdGhpcywwLDApO1xyXG4gICAgdGhpcy5fc2NhbGUgPSBuZXcgUG9pbnQodGhpcy5jaGFuZ2VDYWxsYmFjayx0aGlzLDEsMSk7XHJcbiAgICB0aGlzLl9za2V3ID0gbmV3IFBvaW50KHRoaXMuY2hhbmdlQ2FsbGJhY2ssdGhpcywwLDApO1xyXG4gICAgdGhpcy5waXZvdCA9IG5ldyBQb2ludCh0aGlzLmNoYW5nZUNhbGxiYWNrLHRoaXMsMCwgMCk7XHJcbiAgICB0aGlzLl9hbHBoYUZhY3RvciA9IDE7XHJcbiAgICB0aGlzLndvcmxkQWxwaGEgPSAxO1xyXG4gICAgdGhpcy5fcm90YXRpb24gPSAwO1xyXG4gICAgdGhpcy5fY3ggPSAxOyAvLyBjb3Mgcm90YXRpb24gKyBza2V3WTtcclxuICAgIHRoaXMuX3N4ID0gMDsgLy8gc2luIHJvdGF0aW9uICsgc2tld1k7XHJcbiAgICB0aGlzLl9jeSA9IDA7IC8vIGNvcyByb3RhdGlvbiArIE1hdGguUEkvMiAtIHNrZXdYO1xyXG4gICAgdGhpcy5fc3kgPSAxOyAvLyBzaW4gcm90YXRpb24gKyBNYXRoLlBJLzIgLSBza2V3WDtcclxuICB9XHJcblxyXG4gIGFuY2hvcih4LHkpe1xyXG4gICAgdGhpcy5fYW5jaG9yLnNldCh4LHkpO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuICAvKipcclxuICAgKiDml4vovazmiJblgL7mlpzml7bosIPnlKhcclxuICAgKlxyXG4gICAqL1xyXG4gIHVwZGF0ZVNrZXcoKXtcclxuICAgIGxldCBkZWcgPSBNYXRoLlBJLyAxODAgKiB0aGlzLl9yb3RhdGlvbjtcclxuICAgIHRoaXMuX2N4ID0gTWF0aC5jb3MoZGVnICsgdGhpcy5fc2tldy55KTtcclxuICAgIHRoaXMuX3N4ID0gTWF0aC5zaW4oZGVnICsgdGhpcy5fc2tldy55KTtcclxuICAgIHRoaXMuX2N5ID0gLU1hdGguc2luKGRlZyAtIHRoaXMuX3NrZXcueCk7IC8vIGNvcywgYWRkZWQgUEkvMlxyXG4gICAgdGhpcy5fc3kgPSBNYXRoLmNvcyhkZWcgLSB0aGlzLl9za2V3LngpOyAvLyBzaW4sIGFkZGVkIFBJLzJcclxuICB9XHJcblxyXG4gIHJvdGF0ZShkZWcpe1xyXG4gICAgaWYoIWFyZ3VtZW50cy5sZW5ndGgpXHJcbiAgICAgIHJldHVybiB0aGlzLl9yb3RhdGlvbjtcclxuXHJcbiAgICB0aGlzLl9yb3RhdGlvbiA9IGRlZztcclxuICAgIHRoaXMudXBkYXRlU2tldygpO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgc2NhbGUoeCx5KXtcclxuICAgIGlmKCFhcmd1bWVudHMubGVuZ3RoKVxyXG4gICAgICByZXR1cm4gdGhpcy5fc2NhbGU7XHJcblxyXG4gICAgdGhpcy5fc2NhbGUuc2V0KHgseSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIG9wYWNpdHkoZmFjdG9yKXtcclxuICAgIHRoaXMuYWxwaGFGYWN0b3IgPSBmYWN0b3I7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHBvc2l0aW9uKHgseSl7XHJcbiAgICB0aGlzLl9wb3NpdGlvbi5zZXQoeCx5KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHNldCBhbHBoYUZhY3Rvcih2YWx1ZSl7XHJcbiAgICB0aGlzLl9hbHBoYUZhY3RvciA9IHZhbHVlO1xyXG4gICAgdGhpcy5jaGFuZ2VDYWxsYmFjaygpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGFscGhhRmFjdG9yKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fYWxwaGFGYWN0b3I7XHJcbiAgfVxyXG5cclxuICBzZXQgeCh2YWx1ZSl7XHJcbiAgICB0aGlzLl9wb3NpdGlvbi54ID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgeCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uLng7XHJcbiAgfVxyXG5cclxuICBzZXQgeSh2YWx1ZSl7XHJcbiAgICB0aGlzLl9wb3NpdGlvbi55ID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgeSgpe1xyXG4gICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uLnk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKXtcclxuICAgIGlmKCF0aGlzLl9kaXJ0eSlcclxuICAgICAgcmV0dXJuO1xyXG4gICAgbGV0IHBhcmVudFRyYW5zZm9ybSA9IFRyYW5zZm9ybU1hdHJpeC5zdGF0aWNNYXRyaXg7XHJcbiAgICB0aGlzLndvcmxkQWxwaGEgPSB0aGlzLl9hbHBoYUZhY3RvcjtcclxuICAgIGlmKHRoaXMucGFyZW50R3JvdXApe1xyXG4gICAgICBwYXJlbnRUcmFuc2Zvcm0gPSB0aGlzLnBhcmVudEdyb3VwLndvcmxkVHJhbnNmb3JtO1xyXG4gICAgICB0aGlzLndvcmxkQWxwaGEgKj0gdGhpcy5wYXJlbnRHcm91cC5fYWxwaGFGYWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cGRhdGVUcmFuc2Zvcm0ocGFyZW50VHJhbnNmb3JtKTtcclxuXHJcbiAgICB0aGlzLl9kaXJ0eSA9IGZhbHNlO1xyXG4gIH1cclxuICB1cGRhdGVUcmFuc2Zvcm0ocGFyZW50VHJhbnNmb3JtKXtcclxuICAgIGNvbnN0IGx0ID0gdGhpcy5sb2NhbFRyYW5zZm9ybTtcclxuXHJcbiAgICBsdC5hID0gdGhpcy5fY3ggKiB0aGlzLl9zY2FsZS54O1xyXG4gICAgbHQuYiA9IHRoaXMuX3N4ICogdGhpcy5fc2NhbGUueDtcclxuICAgIGx0LmMgPSB0aGlzLl9jeSAqIHRoaXMuX3NjYWxlLnk7XHJcbiAgICBsdC5kID0gdGhpcy5fc3kgKiB0aGlzLl9zY2FsZS55O1xyXG5cclxuICAgIGx0LnR4ID0gdGhpcy5fcG9zaXRpb24ueCAtICgodGhpcy5waXZvdC54ICogbHQuYSkgKyAodGhpcy5waXZvdC55ICogbHQuYykpO1xyXG4gICAgbHQudHkgPSB0aGlzLl9wb3NpdGlvbi55IC0gKCh0aGlzLnBpdm90LnggKiBsdC5iKSArICh0aGlzLnBpdm90LnkgKiBsdC5kKSk7XHJcblxyXG4gICAgY29uc3QgcHQgPSBwYXJlbnRUcmFuc2Zvcm07XHJcbiAgICBjb25zdCB3dCA9IHRoaXMud29ybGRUcmFuc2Zvcm07XHJcblxyXG4gICAgaWYoIXB0KVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgd3QuYSA9IChsdC5hICogcHQuYSkgKyAobHQuYiAqIHB0LmMpO1xyXG4gICAgd3QuYiA9IChsdC5hICogcHQuYikgKyAobHQuYiAqIHB0LmQpO1xyXG4gICAgd3QuYyA9IChsdC5jICogcHQuYSkgKyAobHQuZCAqIHB0LmMpO1xyXG4gICAgd3QuZCA9IChsdC5jICogcHQuYikgKyAobHQuZCAqIHB0LmQpO1xyXG4gICAgd3QudHggPSAobHQudHggKiBwdC5hKSArIChsdC50eSAqIHB0LmMpICsgcHQudHg7XHJcbiAgICB3dC50eSA9IChsdC50eCAqIHB0LmIpICsgKGx0LnR5ICogcHQuZCkgKyBwdC50eTtcclxuICB9XHJcblxyXG4gIGNvbnRhaW5zKHBvaW50KXtcclxuICAgIGNvbnN0IHRlbXBQb2ludCA9IHRoaXMud29ybGRUcmFuc2Zvcm0uYXBwbHlJbnZlcnNlKHBvaW50KTtcclxuXHJcbiAgICBjb25zdCB7dyxofSA9IHRoaXM7XHJcblxyXG4gICAgY29uc3QgeDEgPSAtdyAqIHRoaXMuX2FuY2hvci54O1xyXG5cclxuICAgIGxldCB5MSA9IDA7XHJcblxyXG4gICAgaWYgKHRlbXBQb2ludC54ID4geDEgJiYgdGVtcFBvaW50LnggPCB4MSArIHcpXHJcbiAgICB7XHJcbiAgICAgICAgeTEgPSAtaCAqIHRoaXMuX2FuY2hvci55O1xyXG5cclxuICAgICAgICBpZiAodGVtcFBvaW50LnkgPiB5MSAmJiB0ZW1wUG9pbnQueSA8IHkxICsgaClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZihwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKXtcclxuICAgICAgY29uc29sZS5sb2coJ2NoZWNraW5nIGdhbWVPYmplY3QgJyx0aGlzLmtleSwnICcsdGhpcy50eXBlLHBvaW50LCcgd29ybGQgcG9pbnQgdG8gb2JqIHBvaW50ICcsdGVtcFBvaW50KTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGRlc3Ryb3kgKCl7XHJcbiAgICBpZihwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKXtcclxuICAgICAgY29uc29sZS5sb2coYCR7dGhpcy50eXBlfToke3RoaXMua2V5fSBpcyBkZXN0cm95ZWRgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNoYW5nZUNhbGxiYWNrICgpe1xyXG4gICAgdGhpcy5kaXJ0eSA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBzZXQgZGlydHkodmFsKXtcclxuICAgIGlmKHRoaXMuX2RpcnR5KVxyXG4gICAgICByZXR1cm47XHJcblxyXG4gICAgdGhpcy5fZGlydHkgPSB0cnVlO1xyXG4gICAgaWYodGhpcy5wYXJlbnRHcm91cCl7XHJcbiAgICAgIHRoaXMucGFyZW50R3JvdXAuZGlydHkgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgaWYodGhpcy5oYXNDaGlsZCl7XHJcbiAgICAgIHRoaXMubG9vcENoaWxkKChjaGlsZCk9PntcclxuICAgICAgICBjaGlsZC5fZGlydHkgPSB0cnVlO1xyXG4gICAgICB9LG51bGwpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIHRvU3RyaW5nKCl7XHJcbiAgICByZXR1cm4gYCR7dGhpcy50eXBlfToke3RoaXMua2V5fSBpbiAoJHt0aGlzLl9wb3NpdGlvbi54fSwgJHt0aGlzLl9wb3NpdGlvbi55fSkgaGFzIHdpZHRoOiR7dGhpcy53fSBhbmQgaGVpZ2h0ICR7dGhpcy5ofWA7XHJcbiAgfVxyXG59IiwiaW1wb3J0IEJhc2VEaXNwbGF5T2JqZWN0IGZyb20gJy4vYmFzZURpc3BsYXlPYmplY3QuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ByaXRlIGV4dGVuZHMgQmFzZURpc3BsYXlPYmplY3R7XHJcbiAgY29uc3RydWN0b3IoZ2FtZSx0eXBlLGtleSx4PTAseT0wLHcsaCl7XHJcbiAgICBzdXBlcih0eXBlLHgseSx3LGgpO1xyXG4gICAgdGhpcy5rZXkgPSBrZXk7XHJcbiAgICBrZXkgPSBrZXkuc3BsaXQoJzonKTtcclxuXHJcbiAgICBsZXQgcmVzb3VyY2UgPSBnYW1lLl9yZXNvdXJjZXNba2V5WzBdXSxcclxuICAgICAgICByZXNGb3JtYXQgPSByZXNvdXJjZS5yZXNmb3JtYXQgfHwge30sXHJcbiAgICAgICAgdGFyZ2V0RnJhbWU7XHJcblxyXG4gICAgaWYoa2V5Lmxlbmd0aCA+IDEgJiYgcmVzRm9ybWF0W2tleVsxXV0pe1xyXG4gICAgICByZXNGb3JtYXQgPSByZXNGb3JtYXRba2V5WzFdXVxyXG4gICAgfVxyXG5cclxuICAgIGxldCB7eDpzeCA9MCx5OnN5PTAsdzpzdyxoOnNofSA9IHJlc0Zvcm1hdDtcclxuXHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG4gICAgdGhpcy5mcmFtZSA9IHJlc291cmNlO1xyXG4gICAgdGhpcy5zdyA9IHN3IHx8IHRoaXMuZnJhbWUud2lkdGgsXHJcbiAgICB0aGlzLnNoID0gc2ggfHwgdGhpcy5mcmFtZS5oZWlnaHQ7XHJcbiAgICB0aGlzLnN4ID0gTWF0aC5hYnMoc3gpO1xyXG4gICAgdGhpcy5zeSA9IE1hdGguYWJzKHN5KTtcclxuICAgIHRoaXMudyA9IHRoaXMuc3c7XHJcbiAgICB0aGlzLmggPSB0aGlzLnNoO1xyXG4gICAgdGhpcy5hbHBoYUZhY3RvciA9IDE7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKXtcclxuICAgIGxldCBjdHggPSB0aGlzLmdhbWUuX2N0eDtcclxuICAgIGxldCB7eCx5fSA9IHRoaXMuX3Bvc2l0aW9uO1xyXG5cclxuXHJcbiAgICBsZXQgZHggPSAoMC41IC0gdGhpcy5fYW5jaG9yLngpICogdGhpcy53O1xyXG4gICAgbGV0IGR5ID0gKDAuNSAtIHRoaXMuX2FuY2hvci55KSAqIHRoaXMuaDtcclxuXHJcbiAgICBkeCAtPSB0aGlzLncgLyAyO1xyXG4gICAgZHkgLT0gdGhpcy5oIC8gMjtcclxuXHJcbiAgICB0aGlzLmdhbWUuX2N0eC5kcmF3SW1hZ2UodGhpcy5mcmFtZSx0aGlzLnN4LHRoaXMuc3ksdGhpcy5zdyx0aGlzLnNoLGR4LGR5LHRoaXMudyx0aGlzLmggKTtcclxuICB9XHJcblxyXG4gIGRlc3Ryb3kgKCkge1xyXG4gICAgdGhpcy5mcmFtZSA9IG51bGw7XHJcbiAgICB0aGlzLmdhbWUgPSBudWxsO1xyXG4gICAgc3VwZXIuZGVzdHJveSgpO1xyXG4gIH1cclxufSIsImltcG9ydCBCYXNlRGlzcGxheU9iamVjdCBmcm9tICcuL2Jhc2VEaXNwbGF5T2JqZWN0LmpzJztcclxuaW1wb3J0IFNwcml0ZSBmcm9tICcuL1Nwcml0ZS5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcm91cCBleHRlbmRzIEJhc2VEaXNwbGF5T2JqZWN0e1xyXG4gIGNvbnN0cnVjdG9yKGdhbWUseD0wLHk9MCl7XHJcbiAgICBzdXBlcignZ3JvdXAnLHgseSk7XHJcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG4gICAgdGhpcy5fcXVldWUgPSBbXTtcclxuICAgIHRoaXMuaGFzQ2hpbGQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgYWRkKGdhbWVPYmosIHgsIHkpe1xyXG4gICAgbGV0IGtleSA9IGdhbWVPYmo7XHJcblxyXG4gICAgaWYodHlwZW9mIGdhbWVPYmogPT0gJ3N0cmluZycpe1xyXG4gICAgICBnYW1lT2JqID0gbmV3IFNwcml0ZSh0aGlzLmdhbWUsJ2ltZycsa2V5LHgseSk7XHJcbiAgICB9XHJcbiAgICBnYW1lT2JqLnBhcmVudEdyb3VwID0gdGhpcztcclxuICAgIHRoaXMuX3F1ZXVlLnB1c2goZ2FtZU9iaik7XHJcblxyXG4gICAgcmV0dXJuIGdhbWVPYmo7XHJcbiAgfVxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gICByZXZlcnNlIFt3aGV0aGVyIHRyYXZlcnNlIGZyb20gcXVldWUgdGFpbCB0byBoZWFkXVxyXG4gICAqL1xyXG4gIGNoaWxkcmVuKGNiLHJldmVyc2Upe1xyXG5cclxuICAgIGlmKHJldmVyc2UpXHJcbiAgICAgIHRoaXMuX3F1ZXVlLnJldmVyc2UoKTtcclxuXHJcbiAgICBpZih0eXBlb2YgY2IgIT0gJ3VuZGVmaW5lZCcpe1xyXG4gICAgICAgIHRoaXMuX3F1ZXVlLmV2ZXJ5KChudW0saWR4KT0+e1xyXG5cclxuICAgICAgICAgIGxldCByZXQgPSBjYihudW0saWR4KTtcclxuXHJcbiAgICAgICAgICBpZihyZXQgPT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZihyZXZlcnNlKVxyXG4gICAgICB0aGlzLl9xdWV1ZS5yZXZlcnNlKCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3F1ZXVlO1xyXG4gIH1cclxuXHJcbiAgbG9vcENoaWxkIChjYixwYXJlbnQpIHtcclxuICAgIGxldCBjb250YWluZXIgPSBwYXJlbnQgfHwgdGhpcztcclxuICAgIGlmIChjb250YWluZXIuaGFzQ2hpbGQpIHtcclxuICAgICAgY29udGFpbmVyLmNoaWxkcmVuKChjaGlsZE9iaik9PntcclxuICAgICAgICB0aGlzLmxvb3BDaGlsZChjYixjaGlsZE9iaik7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGNvbnRhaW5lciAhPT0gdGhpcyl7XHJcbiAgICAgIGNiKGNvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgcmVtb3ZlIChzcHJpdGUpIHtcclxuICAgIHRoaXMuX3F1ZXVlID0gdGhpcy5fcXVldWUuZmlsdGVyKG9iaj0+e1xyXG4gICAgICByZXR1cm4gb2JqICE9PSBzcHJpdGU7XHJcbiAgICB9KTtcclxuICAgIHNwcml0ZS5kZXN0cm95KCk7XHJcbiAgfVxyXG5cclxuICBkZXN0cm95ICgpIHtcclxuICAgIHRoaXMuX3F1ZXVlID0gbnVsbDtcclxuICAgIHRoaXMuZ2FtZSA9IG51bGw7XHJcbiAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgfVxyXG4gIGdldCBjaGlsZENvdW50KCl7XHJcbiAgICByZXR1cm4gdGhpcy5fcXVldWUubGVuZ3RoO1xyXG4gIH1cclxufSIsImltcG9ydCBTcHJpdGUgZnJvbSAnLi9TcHJpdGUuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ByaXRlU2hlZXQgZXh0ZW5kcyBTcHJpdGV7XHJcbiAgY29uc3RydWN0b3IoZ2FtZSxrZXkseD0wLHk9MCx3LGgsb3B0aW9ucz17fSl7XHJcbiAgICBzdXBlcihnYW1lLCdzcHJpdGVzaGVldCcsa2V5LHgseSx3LGgpO1xyXG5cclxuICAgIHRoaXMucHJlZml4ID0gb3B0aW9ucy5wcmVmaXg7XHJcbiAgICB0aGlzLmZpcnN0SW5kZXggPSBvcHRpb25zLmZpcnN0SW5kZXg7XHJcbiAgICB0aGlzLmxhc3RJbmRleCA9IG9wdGlvbnMubGFzdEluZGV4O1xyXG4gICAgdGhpcy5zcGYgPSAxMDAwIC8gb3B0aW9ucy5mcHM7XHJcbiAgICB0aGlzLl9mcmFtZUluZGV4ID0gdGhpcy5maXJzdEluZGV4O1xyXG4gICAgdGhpcy5sb29wID0gdHJ1ZTtcclxuICAgIHRoaXMubGFzdFRpbWUgPSAtSW5maW5pdHk7XHJcbiAgICBsZXQgcmVzb3VyY2UgPSBnYW1lLl9yZXNvdXJjZXNba2V5XTtcclxuXHJcbiAgICBpZighcmVzb3VyY2UgJiYgJ19ERVZfJyAhPT0gJ3Byb2R1Y3Rpb24nKXtcclxuICAgICAgY29uc29sZS5lcnJvcihrZXkgKyAnIOayoeacieWvueW6lOeahOi1hOa6neWbvueJhycpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZXNGb3JtYXQgPSByZXNvdXJjZS5yZXNmb3JtYXQgfHwge307XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKHRpbWVzdGFtcCxwYXNzZWRUaW1lKXtcclxuXHJcbiAgICBsZXQgZnJhbWVJZHggPSB0aGlzLl9mcmFtZUluZGV4O1xyXG5cclxuICAgIGlmKHRpbWVzdGFtcCAtIHRoaXMubGFzdFRpbWUgPj0gdGhpcy5zcGYpe1xyXG4gICAgICB0aGlzLmxhc3RUaW1lID0gdGltZXN0YW1wO1xyXG4gICAgICBpZigrK3RoaXMuX2ZyYW1lSW5kZXggPiB0aGlzLmxhc3RJbmRleCl7XHJcbiAgICAgICAgaWYodGhpcy5vcHRpb25zLmFuaW1hdGVFbmQgJiYgdGhpcy5vcHRpb25zLmFuaW1hdGVFbmQodGhpcykgfHwgIXRoaXMubG9vcCl7XHJcbiAgICAgICAgICB0aGlzLl9mcmFtZUluZGV4IC0tO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9mcmFtZUluZGV4ID0gdGhpcy5maXJzdEluZGV4O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3VwZXIudXBkYXRlKCk7XHJcblxyXG4gICAgbGV0IHt4OnN4ID0wLHk6c3k9MCx3OnN3LGg6c2h9ID0gdGhpcy5yZXNGb3JtYXRbdGhpcy5wcmVmaXggKyBmcmFtZUlkeF07XHJcblxyXG4gICAgdGhpcy53ID0gdGhpcy5zdyA9IHN3LFxyXG4gICAgdGhpcy5oID0gdGhpcy5zaCA9IHNoO1xyXG4gICAgdGhpcy5zeCA9IE1hdGguYWJzKHN4KTtcclxuICAgIHRoaXMuc3kgPSBNYXRoLmFicyhzeSk7XHJcbiAgfVxyXG4vKipcclxuICogW3BsYXkgZGVzY3JpcHRpb25dXHJcbiAqIEBwYXJhbSAge1tzdHJpbmddfSAgICB0eXBlICAgICAgYWRkOuWwhmlk5Yqg6L+b5b2T5Ymd5pKt5pS+5bqd5YiX5LitIHJlcGxhY2U65L2/55So5Lyg6L+b55qESUTmm7/mnaLlvZPliZ3miYDmnInlup3liJdcclxuICogQHBhcmFtICB7Li4uW3R5cGVdfSBmcmFtZUlkeHMgIOiLpeaYr+imneWKoOi/m+W9k+WJneW6neWIl++8jOWImWlk5YC85b+F6aG75Zyo5b2T5Ymd55qE5bqd5YiX5YC85LiK6YCS5aKeXHJcbiAqIEByZXR1cm4ge1t0eXBlXX0gICAg5b2T5Ymd5a+56LGhXHJcbiAqL1xyXG4gIHBsYXkgKHR5cGUsLi4uZnJhbWVJZHhzKSB7XHJcblxyXG4gICAgZnJhbWVJZHhzLnNvcnQoKHByZSxhZnRlcik9PntcclxuICAgICAgcmV0dXJuIHByZSA8IGFmdGVyO1xyXG4gICAgfSlcclxuXHJcbiAgICB0aGlzLmxhc3RJbmRleCA9IGZyYW1lSWR4c1swXTtcclxuXHJcbiAgICBpZiAodHlwZSA9PSAncmVwbGFjZScpIHtcclxuICAgICAgdGhpcy5maXJzdEluZGV4ID0gZnJhbWVJZHhzW2ZyYW1lSWR4cy5sZW5ndGgtMV07XHJcbiAgICAgIHRoaXMuX2ZyYW1lSW5kZXggPSB0aGlzLmZpcnN0SW5kZXg7XHJcbiAgICB9XHJcbiAgICB0aGlzLmxvb3AgPSBmYWxzZTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufSIsImltcG9ydCBCYXNlRGlzcGxheU9iamVjdCBmcm9tICcuL2Jhc2VEaXNwbGF5T2JqZWN0LmpzJztcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlydHVhbERpc3BsYXkgZXh0ZW5kcyBCYXNlRGlzcGxheU9iamVjdHtcclxuXHJcbiAgY29uc3RydWN0b3IoZ2FtZSxrZXkseCx5LHcsaCl7XHJcbiAgICBzdXBlcigndmlydHVhbERpc3BsYXknLHgseSk7XHJcbiAgICB0aGlzLncgPSB3O1xyXG4gICAgdGhpcy5oID0gaDtcclxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICB0aGlzLmtleSA9IGtleTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpe1xyXG4gICAgLy/nqbrlh73mlbBcclxuICB9XHJcbn0iLCJcInVzZSBzdHJpY3RcIjtcclxuaW1wb3J0IHRvb2xzIGZyb20gJy4vdXRpbHMvdG9vbHMuanMnO1xyXG5pbXBvcnQgVHdlZW5BY3Rpb24gZnJvbSAnLi9hbmltYXRlL3R3ZWVuQWN0aW9uLmpzJztcclxuaW1wb3J0IFJlbmRlciBmcm9tICcuL1JlbmRlci5qcyc7XHJcbmltcG9ydCBFdmVudE1hbmFnZXIgIGZyb20gJy4vZXZlbnQvZXZlbnQuanMnO1xyXG5pbXBvcnQgbG9hZGVyIGZyb20gJy4vdXRpbHMvbG9hZGVyLmpzJztcclxuaW1wb3J0IEdyb3VwIGZyb20gJy4vZGlzcGxheS9ncm91cC5qcyc7XHJcbmltcG9ydCBTcHJpdGUgZnJvbSAnLi9kaXNwbGF5L1Nwcml0ZS5qcyc7XHJcbmltcG9ydCBTcHJpdGVTaGVldCBmcm9tICcuL2Rpc3BsYXkvc3ByaXRlU2hlZXQuanMnO1xyXG5pbXBvcnQgVmlydHVhbERpc3BsYXkgZnJvbSAnLi9kaXNwbGF5L3ZpcnR1YWxEaXNwbGF5LmpzJztcclxuXHJcbmxldCBub29wID0gZnVuY3Rpb24oKXt9XHJcblxyXG5jb25zdCBEZWFmdWx0U2V0dGluZ3MgPSB7XHJcbiAgY29udGFpbmVyOiAnLmNhbnZhcy1jb250YWluZXInLFxyXG4gIHByZWxvYWQ6IG5vb3AsXHJcbiAgY3JlYXRlOiBub29wLFxyXG4gIHVwZGF0ZTogbm9vcCxcclxuICBkZXN0cm95OiBub29wXHJcbn1cclxuXHJcbmNsYXNzIFBpY2Fzc28gZXh0ZW5kcyBUd2VlbkFjdGlvbntcclxuXHJcbiAgY29uc3RydWN0b3Iob3B0aW9ucyl7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgbGV0IHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSxEZWFmdWx0U2V0dGluZ3Msb3B0aW9ucyk7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBzZXR0aW5ncztcclxuXHJcbiAgICB0aGlzLndpZHRoID0gb3B0aW9ucy53aWR0aDtcclxuICAgIHRoaXMuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQ7XHJcblxyXG4gICAgdGhpcy5sb2FkZXIgPSBuZXcgbG9hZGVyKHRoaXMuY3JlYXRlLmJpbmQodGhpcykpO1xyXG4gICAgdGhpcy5nYW1lT2JqZWN0cyA9IG5ldyBHcm91cCh0aGlzLDAsMCk7XHJcbiAgICB0aGlzLnVwZGF0ZVRhc2sgPSBbXTtcclxuXHJcbiAgICB0aGlzLmluaXRUd2VlbigpO1xyXG4gICAgdGhpcy5jcmVhdGVDYXZhcyhzZXR0aW5ncyk7XHJcbiAgICB0aGlzLnByZVVwZGF0ZShzZXR0aW5ncyk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVDYXZhcyhvcHRpb25zKXtcclxuICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgbGV0IHdvcmxkV2lkdGggPSB0aGlzLmNsaWVudFdpZHRoO1xyXG5cclxuICAgIGlmKG9wdGlvbnMuaW5pdENsenopXHJcbiAgICAgIGNhbnZhcy5jbGFzc0xpc3QuYWRkKG9wdGlvbnMuaW5pdENsenopO1xyXG5cclxuICAgIGNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XHJcbiAgICBjYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XHJcblxyXG4gICAgY3R4LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IHRydWU7XHJcbiAgICB0aGlzLl9zY2FsZVJlcyA9IHdvcmxkV2lkdGggLyB0aGlzLndpZHRoO1xyXG5cclxuICAgIHRoaXMuX2N0eCA9IGN0eDtcclxuICAgIHRoaXMudmlld0VsZW1lbnQgPSBjYW52YXM7XHJcblxyXG4gICAgY2FudmFzLnN0eWxlLndpZHRoID0gd29ybGRXaWR0aCArICdweCc7XHJcbiAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKiB0aGlzLl9zY2FsZVJlcyArICdweCc7XHJcblxyXG4gICAgdGhpcy5ldmVudE1hbmFnZXIgPSBuZXcgRXZlbnRNYW5hZ2VyKHRoaXMpO1xyXG5cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iob3B0aW9ucy5jb250YWluZXIpLmFwcGVuZENoaWxkKGNhbnZhcyk7XHJcbiAgfVxyXG5cclxuICBwcmVVcGRhdGUob3B0aW9ucyl7XHJcbiAgICBvcHRpb25zLnByZWxvYWQuY2FsbCh0aGlzKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZShkYXRhcyl7XHJcbiAgICB0aGlzLl9yZXNvdXJjZXMgPSB0aGlzLl9yZXNvdXJjZXMgfHwgZGF0YXM7XHJcbiAgICB0aGlzLm9wdGlvbnMuY3JlYXRlLmNhbGwodGhpcyx0aGlzLl9yZXNvdXJjZXMpO1xyXG5cclxuICAgIHRoaXMubWFpbkxvb3AoKTtcclxuICB9XHJcblxyXG4gIGRlc3Ryb3kgKCkge1xyXG4gICAgdGhpcy5nYW1lT2JqZWN0cy5sb29wQ2hpbGQoKGNoaWxkKT0+e1xyXG4gICAgICBjaGlsZC5kZXN0cm95KCk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMuZ2FtZU9iamVjdHMgPSBuZXcgR3JvdXAodGhpcywwLDApO1xyXG5cclxuICAgIHRoaXMub3B0aW9ucy5kZXN0cm95LmNhbGwodGhpcyx0aGlzLl9yZXNvdXJjZXMpO1xyXG4gIH1cclxuXHJcbiAgcmVzdGFydCAoKSB7XHJcbiAgICB0aGlzLmRlc3Ryb3koKTtcclxuICAgIHRoaXMuY3JlYXRlKCk7XHJcbiAgfVxyXG5cclxuICBjbGVhciAoKSB7XHJcbiAgICB0aGlzLmlzRGVzdHJveSA9IHRydWU7XHJcbiAgICB0aGlzLmRlc3Ryb3koKTtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5vcHRpb25zLmNvbnRhaW5lcikucmVtb3ZlQ2hpbGQodGhpcy52aWV3RWxlbWVudCk7XHJcbiAgICB0aGlzLnZpZXdFbGVtZW50ID1udWxsO1xyXG4gIH1cclxuXHJcbiAgZHJhdyh0eXBlLGRhdGEseCx5LHcsaCxvcHRpb25zKXtcclxuICAgIGxldCBkcmF3T2JqO1xyXG4gICAgc3dpdGNoKHR5cGUpe1xyXG4gICAgICBjYXNlICdpbWcnOlxyXG4gICAgICAgIGRyYXdPYmogPSBuZXcgU3ByaXRlKHRoaXMsJ2ltZycsZGF0YSx4LHksdyxoKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnc3ByaXRlc2hlZXQnOlxyXG4gICAgICAgIGRyYXdPYmogPSBuZXcgU3ByaXRlU2hlZXQodGhpcyxkYXRhLHgseSx3LGgsb3B0aW9ucyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2dyYXBoaWNzJzpcclxuICAgICAgICBkcmF3T2JqID0gbmV3IEdyYXBoaWNzKHRoaXMsZGF0YSx4KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAndmlydHVhbCc6XHJcbiAgICAgICAgLy9ub3cgdGhlIGRhdGEgaXMgeFxyXG4gICAgICAgIGRyYXdPYmogPSBuZXcgVmlydHVhbERpc3BsYXkodGhpcyxkYXRhLHgseSx3LGgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgaWYocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyl7XHJcbiAgICAgIGNvbnNvbGUuZGVidWcoJ2NyZWF0ZSBnYW1lT2JqZWN0ICcgKyBkcmF3T2JqKTtcclxuICAgIH1cclxuICAgIHRoaXMuYWRkU3ByaXRlKGRyYXdPYmopO1xyXG4gICAgcmV0dXJuIGRyYXdPYmo7XHJcbiAgfVxyXG5cclxuICBncm91cCh4LHkpe1xyXG4gICAgbGV0IG5ld0dyb3VwcyA9IG5ldyBHcm91cCh0aGlzLHgseSk7XHJcblxyXG4gICAgdGhpcy5hZGRTcHJpdGUobmV3R3JvdXBzKTtcclxuXHJcbiAgICByZXR1cm4gbmV3R3JvdXBzO1xyXG4gIH1cclxuXHJcbiAgYWRkU3ByaXRlKGdhbWVPYmope1xyXG4gICAgdGhpcy5nYW1lT2JqZWN0cy5hZGQoZ2FtZU9iaik7XHJcbiAgfVxyXG5cclxuICByZW1vdmUgKHNwcml0ZSkge1xyXG4gICAgdGhpcy5nYW1lT2JqZWN0cy5yZW1vdmUoc3ByaXRlKTtcclxuICB9XHJcblxyXG4gIGdldCBjbGllbnRXaWR0aCgpe1xyXG4gICAgcmV0dXJuIE1hdGgubWF4KHdpbmRvdy5pbm5lcldpZHRoLCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGNsaWVudEhlaWdodCgpe1xyXG4gICAgcmV0dXJuIE1hdGgubWF4KHdpbmRvdy5pbm5lckhlaWdodCwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCk7XHJcbiAgfVxyXG5cclxuICBhZGRVcGRhdGVUYXNrKHRhc2spe1xyXG4gICAgdGhpcy51cGRhdGVUYXNrLnB1c2godGFzayk7XHJcbiAgfVxyXG5cclxuICBtYWluTG9vcCgpe1xyXG4gICAgbGV0IGNvdW50PTEwO1xyXG5cclxuICAgIGxldCBiZWdpblRpbWUgPSB0b29scy5nZXRUaW1lKCk7XHJcblxyXG4gICAgbGV0IF9pbm5lckxvb2cgPSAoKT0+e1xyXG5cclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0aW1lc3RhbXApPT57XHJcblxyXG4gICAgICAgIGlmKHRoaXMuaXNEZXN0cm95KVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZighdGhpcy5wYXNzZWRUaW1lKVxyXG4gICAgICAgICAgdGhpcy5wYXNzZWRUaW1lID0gdG9vbHMuZ2V0VGltZSgpIC0gYmVnaW5UaW1lO1xyXG5cclxuICAgICAgICB0aGlzLnRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcclxuXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnVwZGF0ZS5jYWxsKHRoaXMsdGltZXN0YW1wLCB0aGlzLnBhc3NlZFRpbWUpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVRhc2suZm9yRWFjaCgodGFzayk9PntcclxuICAgICAgICAgIHRhc2suY2FsbCh0aGlzLHRpbWVzdGFtcCwgdGhpcy5wYXNzZWRUaW1lKTtcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBSZW5kZXIucmVuZGVyVmlldyh0aGlzKTtcclxuXHJcbiAgICAgICAgX2lubmVyTG9vZygpO1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIF9pbm5lckxvb2coKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBpY2Fzc287XHJcbiJdLCJuYW1lcyI6WyJsZXQiLCJkZWZpbmUiLCJ0aGlzIiwiY29uc3QiLCJ0b29scyIsInJlcXVpcmUkJDEiLCJzdXBlciIsIkV2ZW50RW1pdHRlciIsIlR3ZWVuQWN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0FBLElBQUksS0FBSyxHQUFHOztFQUVWLE9BQU8sa0JBQUE7RUFDUDtJQUNFLE9BQU8sQ0FBQyxDQUFDLFdBQVcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7R0FDM0U7O0NBRUYsQ0FBQzs7QUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNEQSxJQUFJLEtBQUssR0FBRyxLQUFLLElBQUksQ0FBQyxZQUFZOztDQUVqQyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7O0NBRWpCLE9BQU87O0VBRU4sTUFBTSxFQUFFLFlBQVk7O0dBRW5CLE9BQU8sT0FBTyxDQUFDOztHQUVmOztFQUVELFNBQVMsRUFBRSxZQUFZOztHQUV0QixPQUFPLEdBQUcsRUFBRSxDQUFDOztHQUViOztFQUVELEdBQUcsRUFBRSxVQUFVLEtBQUssRUFBRTs7R0FFckIsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7R0FFcEI7O0VBRUQsTUFBTSxFQUFFLFVBQVUsS0FBSyxFQUFFOztHQUV4QixJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOztHQUUvQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtJQUNiLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3JCOztHQUVEOztFQUVELE1BQU0sRUFBRSxVQUFVLElBQUksRUFBRSxRQUFRLEVBQUU7O0dBRWpDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7SUFDekIsT0FBTyxLQUFLLENBQUM7SUFDYjs7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O0VBRVQ7O0NBRUQsVUFBVSxFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTs7RUFFM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7RUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUNkLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDdEIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDOztFQUU5QyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7O0dBRWxCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUNWLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEM7O0dBRUQsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0dBRTNFLE1BQU07O0dBRU4sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQ1YsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3REOztHQUVELElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUNWLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakU7O0dBRUQsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0dBRTdGOztFQUVEOztDQUVELEtBQUssRUFBRTs7RUFFTixNQUFNLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTs7R0FFNUIsT0FBTyxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7R0FFMUI7O0VBRUQsU0FBUyxFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTs7R0FFMUIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDOztHQUU3QyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7R0FFakM7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ckMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7TUFDN0IsR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNO01BQ3RCLElBQUk7TUFDSixDQUFDLENBQUM7O0VBRU4sSUFBSSxTQUFTLENBQUMsRUFBRSxFQUFFO0lBQ2hCLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQzs7SUFFOUUsUUFBUSxHQUFHO01BQ1QsS0FBSyxDQUFDLEVBQUUsT0FBTyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDO01BQzFELEtBQUssQ0FBQyxFQUFFLE9BQU8sU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUM7TUFDOUQsS0FBSyxDQUFDLEVBQUUsT0FBTyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUM7TUFDbEUsS0FBSyxDQUFDLEVBQUUsT0FBTyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDO01BQ3RFLEtBQUssQ0FBQyxFQUFFLE9BQU8sU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUM7TUFDMUUsS0FBSyxDQUFDLEVBQUUsT0FBTyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUM7S0FDL0U7O0lBRUQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtNQUNsRCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM1Qjs7SUFFRCxTQUFTLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0dBQzdDLE1BQU07SUFDTCxJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTTtRQUN6QixDQUFDLENBQUM7O0lBRU4sS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7TUFDM0IsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDOztNQUVwRixRQUFRLEdBQUc7UUFDVCxLQUFLLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNO1FBQzFELEtBQUssQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNO1FBQzlELEtBQUssQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFB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QUFHLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRSxDQUFDOztFQUVqQyxJQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQ2xCLElBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0VBRWxCLE1BQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7RUFDbkQsTUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQzs7RUFFbkQsT0FBUyxNQUFNLENBQUM7Q0FDZixDQUFBOzs7QUFHSCwwQkFBRSxZQUFZLDBCQUFDLEdBQUcsRUFBRSxNQUFNLENBQUM7RUFDekIsTUFBUSxHQUFHLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRSxDQUFDOztFQUVqQyxJQUFRLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztFQUUxRCxJQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQ2xCLElBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0VBRWxCLE1BQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJ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R0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUUzRUEsSUFBTSxFQUFFLEdBQUcsZUFBZSxDQUFDO0lBQzNCQSxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDOztJQUUvQixHQUFHLENBQUMsRUFBRTtNQUNKLEVBQUEsT0FBTyxFQUFBOztJQUVULEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQ2hELEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENB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
