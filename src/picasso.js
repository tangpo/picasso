"use strict";
import tools from './utils/tools.js';
import TweenAction from './animate/tweenAction.js';
import Render from './Render.js';
import EventManager  from './event/event.js';
import loader from './utils/loader.js';
import Group from './display/group.js';
import Sprite from './display/Sprite.js';
import SpriteSheet from './display/spriteSheet.js';
import VirtualDisplay from './display/virtualDisplay.js';

let noop = function(){}

const DeafultSettings = {
  container: '.canvas-container',
  preload: noop,
  create: noop,
  update: noop,
  destroy: noop
}

class Picasso extends TweenAction{

  constructor(options){
    super();
    let settings = Object.assign({},DeafultSettings,options);
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

  createCavas(options){
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext("2d");
    let worldWidth = this.clientWidth;

    if(options.initClzz)
      canvas.classList.add(options.initClzz);

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
  }

  preUpdate(options){
    options.preload.call(this);
  }

  create(datas){
    this._resources = this._resources || datas;
    this.options.create.call(this,this._resources);

    this.mainLoop();
  }

  destroy () {
    super.destroy();
    this.gameObjects.loopChild((child)=>{
      child.destroy();
    });
    this.gameObjects = new Group(this,0,0);

    this.options.destroy.call(this,this._resources);
  }

  restart () {
    this.destroy();
    this.create();
  }

  clear () {
    this.isDestroy = true;
    this.destroy();
    this.loader.destroy();
    document.querySelector(this.options.container).removeChild(this.viewElement);
    this.viewElement =null;
  }

  draw(type,data,x,y,w,h,options){
    let drawObj;
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
  }

  group(x,y){
    let newGroups = new Group(this,x,y);

    this.addSprite(newGroups);

    return newGroups;
  }

  addSprite(gameObj){
    this.gameObjects.add(gameObj);
  }

  remove (sprite) {
    this.gameObjects.remove(sprite);
  }

  get clientWidth(){
    return Math.max(window.innerWidth, document.documentElement.clientWidth);
  }

  get clientHeight(){
    return Math.max(window.innerHeight, document.documentElement.clientHeight);
  }

  addUpdateTask(task){
    this.updateTask.push(task);
  }

  mainLoop(){
    let count=10;

    let beginTime = tools.getTime();

    let _innerLoog = ()=>{

      requestAnimationFrame((timestamp)=>{

        if(this.isDestroy)
          return;

        if(!this.passedTime)
          this.passedTime = tools.getTime() - beginTime;

        this.timestamp = timestamp;

        this.options.update.call(this,timestamp, this.passedTime);

        this.updateTask.forEach((task)=>{
          task.call(this,timestamp, this.passedTime);
        })

        Render.renderView(this);

        _innerLoog();
      })
    }

    _innerLoog();
  }
}

export default Picasso;
