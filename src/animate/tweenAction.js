const tools = require('./tools.js');
const TWEEN = require('Tween.js');

const specProps = {'pos':'_position','scale':'_scale','opacity':'alphaFactor'};
module.exports = class TweenAction{

  constructor(){
    this.startTweenTime = 0;
    this.tweenStart = false;
    this._tweenList = [];
  }

  initTween(){
    this.addUpdateTask(()=>{
      if(this._tweenList.length)
        TWEEN.update();
    })
  }

  tween(gameObj,props,duration,delay = 0){
    let newProps = {};

    Object.keys(props).forEach(key=>{
      setProps(key, newProps, gameObj, true);
    })

    if(!this.startTweenTime)
      this.startTweenTime = tools.getTime();

    let now = tools.getTime();

    let tween = new TWEEN.Tween(newProps).delay(delay);

    tween.to(props,duration).onUpdate(function(){
      if(this === gameObj)
        return;

      Object.keys(this).forEach(key=>{
        setProps(key, gameObj, this, false);
      })
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
      let splitKey = key.split('.');
      let tempProp = specProps[splitKey[0]];
      if(tempProp){
        if(!inverse){
          if(splitKey.length > 1)
            newProps[tempProp][splitKey[1]] = originProps[key];
          else
            newProps[tempProp] = originProps[key];
        }
        else{
          if(splitKey.length > 1)
            newProps[key] = originProps[tempProp][splitKey[1]];
          else
            newProps[key] = originProps[tempProp];
        }
      }else{
        newProps[key] = originProps[key];
      }
    }
  }

  get TWEEN(){
    return TWEEN;
  }
}
