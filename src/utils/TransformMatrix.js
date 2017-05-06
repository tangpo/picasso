import Point from './Point';
/**
 * | a | b | tx|
 * | c | d | ty|
 * | 0 | 0 | 1 |
 */
class TransformMatrix{
  constructor(){
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.tx = 0;
    this.ty = 0;
    this.array = null;

  }

  set(a, b, c, d, tx, ty){
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;

    return this;
  }

//对象坐标转换到世界坐标
  apply(pos, newPos){
    newPos = newPos || new Point();

    const x = pos.x;
    const y = pos.y;

    newPos.x = (this.a * x) + (this.c * y) + this.tx;
    newPos.y = (this.b * x) + (this.d * y) + this.ty;

    return newPos;
  }

//从世界坐标转为对象坐标
  applyInverse(pos, newPos){
    newPos = newPos || new Point();

    const id = 1 / ((this.a * this.d) + (this.c * -this.b));

    const x = pos.x;
    const y = pos.y;

    newPos.x = (this.d * id * x) + (-this.c * id * y) + (((this.ty * this.c) - (this.tx * this.d)) * id);
    newPos.y = (this.a * id * y) + (-this.b * id * x) + (((-this.ty * this.a) + (this.tx * this.b)) * id);

    return newPos;
  }
  translate(x, y){
    this.tx += x;
    this.ty += y;

    return this;
  }

  scale(x, y){
    this.a *= x;
    this.d *= y;
    this.c *= x;
    this.b *= y;
    this.tx *= x;
    this.ty *= y;

    return this;
  }


  toArray(transpose, out){
    if (!this.array){
        this.array = new Float32Array(9);
    }

    const array = out || this.array;

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
  }
}

TransformMatrix.staticMatrix = new TransformMatrix();

export default TransformMatrix;