
var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/**
 * 
 * @param {*} cb if prop's first value is function,then cb must pass function or null
 * @param {*} scope callback execute with scope
 * @param {*} propList prop name
 */
function createObserve(cb,scope,...propList){

  var mainArgsLen = arguments.length;

/**
 * arguments is same as above createObserve ,but is the value of prop name
 * if first arg is function ,then it must be callback
 * if second arg is object , then it must be scope
 */
  function ObserveObject(...propValueList){
    let args = propValueList,
        objScope;

    if(mainArgsLen == arguments.length || typeof args[0] === 'function'){
      this.cb = args[0];
      if(typeof args[1] === 'object'){
        objScope = args[1];
        args = args.slice(2);
      }else
        args = args.slice(1);
    }
    
    args.forEach((arg, index)=>{
      this[`_${propList[index]}`] = arg;
    })

    this.cb = this.cb || cb || function(){};
    this.scope = objScope || scope || this;
  }

  propList.forEach(prop=>{
    _createClass(ObserveObject, [{
      key: prop,
      get: function get() {
        return this[`_${prop}`];
      },
      set(val){
        let _prop = '_' + prop;

        if(this[_prop] === val)
          return;

        this[_prop] = val;

        this.cb.call(this.scope);
      }
    }]);
  });

  return ObserveObject;
}

module.exports = createObserve;