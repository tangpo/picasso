class VirtualDisplay extends BaseDisplayObject{

  constructor(game,key,x,y,w,h){
    super('virtualDisplay',x,y);
    this.w = w;
    this.h = h;
    this.game = game;
    this.key = key;
  }

  render(){
    //空函数
  }
}