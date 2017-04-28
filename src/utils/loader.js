module.exports = class loader{
  constructor(cb){
    this.loadCount = 0;
    this.__loadedHash = {};
    this.completeCallback = cb;
  }

  loadImg(key,url,format){
    let loadRet = this.__loadedHash[key];

    if(!!loadRet)
      return;

    this.loadCount++;

    let img = new Image;

    img.src = url;

    img.onload = evt => {
      this.__loadedHash[key]._loaded = 1;
      afterLoad.call(this);
      img.onload = null;
    }

    this.__loadedHash[key] = img;

    if(format)
      this.__loadedHash[key].resformat = format;

    function afterLoad(){
      this.loadCount--;
      if(!this.loadCount)
        this.completeCallback && this.completeCallback(this.__loadedHash);
    }
  }
}