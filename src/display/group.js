import BaseDisplayObject from './baseDisplayObject.js';

class Group extends BaseDisplayObject{
  constructor(game,x=0,y=0){
    super('group',x,y);
    this.game = game;
    this._queue = [];
    this.hasChild = true;
  }

  add(gameObj, x, y){
    let key = gameObj;

    if(typeof gameObj == 'string'){
      gameObj = new Sprite(this.game,'img',key,x,y);
    }
    gameObj.parentGroup = this;
    this._queue.push(gameObj);

    return gameObj;
  }
  /**
   * @param  {[type]}   reverse [whether traverse from queue tail to head]
   */
  children(cb,reverse){

    if(reverse)
      this._queue.reverse();

    if(typeof cb != 'undefined'){
        this._queue.every((num,idx)=>{

          let ret = cb(num,idx);

          if(ret == null)
            return true;

          return ret;
        });
    }

    if(reverse)
      this._queue.reverse();

    return this._queue;
  }

  loopChild (cb,parent) {
    let container = parent || this;
    if (container.hasChild) {
      container.children((childObj)=>{
        this.loopChild(cb,childObj);
      });
    }

    if(container !== this){
      cb(container);
    }

  }

  remove (sprite) {
    this._queue = this._queue.filter(obj=>{
      return obj !== sprite;
    });
    sprite.destroy();
  }

  destroy () {
    this._queue = null;
    this.game = null;
    super.destroy();
  }
  get childCount(){
    return this._queue.length;
  }
}