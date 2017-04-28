import BaseDisplayObject from './baseDisplayObject.js';

class Sprite extends BaseDisplayObject{
  constructor(game,type,key,x=0,y=0,w,h){
    super(type,x,y,w,h);
    this.key = key;
    key = key.split(':');

    let resource = game._resources[key[0]],
        resFormat = resource.resformat || {},
        targetFrame;

    if(key.length > 1 && resFormat[key[1]]){
      resFormat = resFormat[key[1]]
    }

    let {x:sx =0,y:sy=0,w:sw,h:sh} = resFormat;

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

  render(){
    let ctx = this.game._ctx;
    let {x,y} = this._position;


    let dx = (0.5 - this._anchor.x) * this.w;
    let dy = (0.5 - this._anchor.y) * this.h;

    dx -= this.w / 2;
    dy -= this.h / 2;

    this.game._ctx.drawImage(this.frame,this.sx,this.sy,this.sw,this.sh,dx,dy,this.w,this.h );
  }

  destroy () {
    this.frame = null;
    this.game = null;
    super.destroy();
  }
}