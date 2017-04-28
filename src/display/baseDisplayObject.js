import EventEmitter from 'eventemitter3';
import Point from './Point';
import TransformMatrix from '../utils/TransformMatrix.js';

class BaseDisplayObject extends EventEmitter{
  constructor(type,x,y,w,h){
    super();

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

  anchor(x,y){
    this._anchor.set(x,y);

    return this;
  }
  /**
   * 旋转或倾斜时调用
   *
   */
  updateSkew(){
    let deg = Math.PI/ 180 * this._rotation;
    this._cx = Math.cos(deg + this._skew.y);
    this._sx = Math.sin(deg + this._skew.y);
    this._cy = -Math.sin(deg - this._skew.x); // cos, added PI/2
    this._sy = Math.cos(deg - this._skew.x); // sin, added PI/2
  }

  rotate(deg){
    if(!arguments.length)
      return this._rotation;

    this._rotation = deg;
    this.updateSkew();

    return this;
  }

  scale(x,y){
    if(!arguments.length)
      return this._scale;

    this._scale.set(x,y);
    return this;
  }

  opacity(factor){
    this.alphaFactor = factor;
    return this;
  }

  position(x,y){
    this._position.set(x,y);

    return this;
  }

  set alphaFactor(value){
    this._alphaFactor = value;
    this.changeCallback();
  }

  get alphaFactor(){
    return this._alphaFactor;
  }

  set x(value){
    this._position.x = value;
  }

  get x(){
    return this._position.x;
  }

  set y(value){
    this._position.y = value;
  }

  get y(){
    return this._position.y;
  }

  update(){
    if(!this._dirty)
      return;
    let parentTransform = TransformMatrix.staticMatrix;
    this.worldAlpha = this._alphaFactor;
    if(this.parentGroup){
      parentTransform = this.parentGroup.worldTransform;
      this.worldAlpha *= this.parentGroup._alphaFactor;
    }

    this.updateTransform(parentTransform);

    this._dirty = false;
  }
  updateTransform(parentTransform){
    const lt = this.localTransform;

    lt.a = this._cx * this._scale.x;
    lt.b = this._sx * this._scale.x;
    lt.c = this._cy * this._scale.y;
    lt.d = this._sy * this._scale.y;

    lt.tx = this._position.x - ((this.pivot.x * lt.a) + (this.pivot.y * lt.c));
    lt.ty = this._position.y - ((this.pivot.x * lt.b) + (this.pivot.y * lt.d));

    const pt = parentTransform;
    const wt = this.worldTransform;

    if(!pt)
      return;

    wt.a = (lt.a * pt.a) + (lt.b * pt.c);
    wt.b = (lt.a * pt.b) + (lt.b * pt.d);
    wt.c = (lt.c * pt.a) + (lt.d * pt.c);
    wt.d = (lt.c * pt.b) + (lt.d * pt.d);
    wt.tx = (lt.tx * pt.a) + (lt.ty * pt.c) + pt.tx;
    wt.ty = (lt.tx * pt.b) + (lt.ty * pt.d) + pt.ty;
  }

  contains(point){
    const tempPoint = this.worldTransform.applyInverse(point);

    const {w,h} = this;

    const x1 = -w * this._anchor.x;

    let y1 = 0;

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
  }

  destroy (){
    if(process.env.NODE_ENV !== 'production'){
      console.log(`${this.type}:${this.key} is destroyed`);
    }
  }

  changeCallback (){
    this.dirty = true;
  }

  set dirty(val){
    if(this._dirty)
      return;

    this._dirty = true;
    if(this.parentGroup){
      this.parentGroup.dirty = true;
    }
    if(this.hasChild){
      this.loopChild((child)=>{
        child._dirty = true;
      },null);
    }

  }

  toString(){
    return `${this.type}:${this.key} in (${this._position.x}, ${this._position.y}) has width:${this.w} and height ${this.h}`;
  }
}