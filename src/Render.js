export default class Render{

  static renderView(picasso){
    let ctx = picasso._ctx;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    // 必须放这里，不然页面会闪烁
    ctx.clearRect(0,0,picasso.width,picasso.height);

    // picasso.gameObjects.children(gameObj=>{
    //   if(!gameObj.update)
    //     return;

    //   gameObj.update(picasso.timestamp, picasso.passedTime);

    //   if(gameObj.hasChild){
    //     gameObj.children((childObj)=>{
    //       childObj.update(picasso.timestamp, picasso.passedTime);
    //       _innerRender(childObj);
    //     });
    //   }else{
    //     _innerRender(gameObj);
    //   }
    // });

    renderSprite(picasso.gameObjects);

    function _innerRender(sprite) {
      let wt = sprite.worldTransform;

      ctx.setTransform(wt.a,wt.b,wt.c,wt.d,wt.tx,wt.ty);
      ctx.globalAlpha = sprite.worldAlpha;

      sprite.render();
    }

    function renderSprite (sprite) {
      if(!sprite.lived)
        return;
      sprite.update(picasso.timestamp, picasso.passedTime);
      if(sprite.hasChild){
        sprite.children((childObj)=>{
          renderSprite(childObj);
        });
      }else{
        _innerRender(sprite);
      }
    }
  }

}