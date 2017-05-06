import EventEmitter from 'eventemitter3';
import Point from './utils/Point';

const DefaultSettings = {
  disableTouch: false
}
let now, delta, deltaX = 0, deltaY = 0, tapTimeout;

class EventManager extends EventEmitter{
  constructor(picasso,options){
    super();

    this.options = Object.assign({},DefaultSettings,options);

    this.interactionDomElement = picasso.viewElement;

    this.hasTouch = 'ontouchstart' in window;

    this.hasPointer = !!(window.PointerEvent || window.MSPointerEvent);

    this.render = picasso;

    this.initEvents();
  }
  addEvent (el, type, fn) {
    el.addEventListener(type, fn, false);
  }
  removeEvent (el, type, fn) {
    el.removeEventListener(type, fn, false);
  }
  Event (eventName,props) {

        var event = document.createEvent('Events')
          , bubbles = true
        if (props)
            for (var name in props)
                (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
        event.initEvent(eventName, bubbles, true)
    // var ev = document.createEvent('Events'),
    //     isBubbles = true;

    // if(evt){
    //   for(var p in evt){
    //     if(p == 'bubbles')
    //       isBubbles = !!evt[p];
    //     else
    //       ev[p] = evt[p];
    //   }
    // }
    // ev.originEvent = evt;
    // ev.initEvent(eventName, isBubbles, true);

    return ev;
  }
  initEvents (remove) {
    var eventType = remove ? this.removeEvent : this.addEvent,
        target = this.interactionDomElement;

    if ( this.hasTouch && !this.options.disableTouch ) {
      eventType(target, 'touchstart', this);
      eventType(target, 'touchmove', this);
      eventType(target, 'touchcancel', this);
      eventType(target, 'touchend', this);
    }
  }

  handleEvent (e) {
    switch ( e.type ) {
      case 'touchstart':
      case 'pointerdown':
      case 'MSPointerDown':
      case 'mousedown':
        this._start(e);
        break;
      case 'touchmove':
      case 'pointermove':
      case 'MSPointerMove':
      case 'mousemove':
        this._move(e);
        break;
      case 'touchend':
      case 'pointerup':
      case 'MSPointerUp':
      case 'mouseup':
      case 'touchcancel':
      case 'pointercancel':
      case 'MSPointerCancel':
      case 'mousecancel':
        this._end(e);
        break;
    }
  }

  _start (e) {
    const point = e.touches ? e.touches[0] : e;

    now = Date.now();

    delta = now - (this.last || now);

    this.x1 = point.pageX;
    this.y1 = point.pageY;

    this.last = now;
  }

  _move (e) {
    const point = e.touches ? e.touches[0] : e;

    this.x2 = point.pageX;
    this.y2 = point.pageY;

    deltaX += Math.abs(this.x1 - this.x2)
    deltaY += Math.abs(this.y1 - this.y2)
  }

  _end (e) {
    const point = e.changedTouches ? e.changedTouches[0] : e;
    const hitPoint = new Point(point.pageX / this.render._scaleRes,point.pageY / this.render._scaleRes);
    let hitTarges = [],
        emitParentIds = {};

    this.processInteractive(hitPoint, this.render.gameObjects,hitTarges);

    if (deltaX < 30 && deltaY < 30) {
      let event = $.Event('tap',point);
      hitTarges.forEach(hitTarget=>{
        let par = hitTarget.parentGroup;
        hitTarget.emit('tap',event);
        if(par && !emitParentIds[par._id]){
          par.emit('tap',event);
          emitParentIds[par._id] = true;
        }
      });

    }
    this.cancelAll();
  }

  cancelAll () {
    deltaX = deltaY = 0;
  }

  processInteractive(point,gameObj,hitTarges){
    let hit;

    if(!gameObj.lived || hitTarges.length)
      return;

    if(gameObj.hasChild){
      gameObj.children((childObj)=>{
        let isHit = this.processInteractive(point,childObj,hitTarges);

        return !isHit;
      },true);
    }else if(gameObj.interactive || (gameObj.parentGroup && gameObj.parentGroup.interactive)){
      hit = gameObj.contains(point);

      if(hit){
        hitTarges.push(gameObj)
      }

      return hit;
    }
  }
}
export default EventManager;