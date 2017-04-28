import createObserve from './ObserveObject.js';

var Point = createObserve(null,null,'x','y');

Point.prototype.set = function(x, y){
  const _x = x || 0;
  const _y = y || ((y !== 0) ? _x : 0);

  if(this._x !== _x || this._y !== _y){
    this._x = _x;
    this._y = _y;
    this.cb();
  }
}

module.exports = Point;
