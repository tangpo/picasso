class SpriteSheet extends Sprite{
  constructor(game,key,x=0,y=0,w,h,options={}){
    super(game,'spritesheet',key,x,y,w,h);

    this.prefix = options.prefix;
    this.firstIndex = options.firstIndex;
    this.lastIndex = options.lastIndex;
    this.spf = 1000 / options.fps;
    this._frameIndex = this.firstIndex;
    this.loop = true;
    this.lastTime = -Infinity;
    let resource = game._resources[key];

    if(!resource && '_DEV_' !== 'production'){
      console.error(key + ' 没有对应的资源图片');
      return;
    }

    this.resFormat = resource.resformat || {};
    this.options = options;
  }

  update(timestamp,passedTime){

    let frameIdx = this._frameIndex;

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

    super.update();

    let {x:sx =0,y:sy=0,w:sw,h:sh} = this.resFormat[this.prefix + frameIdx];

    this.w = this.sw = sw,
    this.h = this.sh = sh;
    this.sx = Math.abs(sx);
    this.sy = Math.abs(sy);
  }
/**
 * [play description]
 * @param  {[string]}    type      add:将id加进当前播放序列中 replace:使用传进的ID替换当前所有序列
 * @param  {...[type]} frameIdxs  若是要加进当前序列，则id值必须在当前的序列值上递增
 * @return {[type]}    当前对象
 */
  play (type,...frameIdxs) {

    frameIdxs.sort((pre,after)=>{
      return pre < after;
    })

    this.lastIndex = frameIdxs[0];

    if (type == 'replace') {
      this.firstIndex = frameIdxs[frameIdxs.length-1];
      this._frameIndex = this.firstIndex;
    }
    this.loop = false;
    return this;
  }
}

Picasso.SpriteSheet = SpriteSheet;