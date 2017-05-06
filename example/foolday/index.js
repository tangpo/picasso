import Picasso from '../../src/picasso.js';
import wordSpriteData from './data/wordsprite.js';
import workRightDatas from './data/wrs.js';
import workUpDatas from './data/wus.js';

let firstLvGame = {
  isStart: false,
  playCount:0,
  start(App){
    let self = this;
    
    this.isStart = true;
    this.game = new Picasso({
      width: 1920,
      height:1080,
      preload(){
        this.loader.loadImg('bg','./imgs/bg.png');
        this.loader.loadImg('luren','./imgs/luren.png');
        this.loader.loadImg('maskMeizu','./imgs/mask.png');
        this.loader.loadImg('arrow','./imgs/arrow.png');
        this.loader.loadImg('wordSprite','./imgs/wordsprite.png',wordSpriteData);
        this.loader.loadImg('xiao7','./imgs/xiao7.png');
        this.loader.loadImg('workRight','./imgs/wrs.png',workRightDatas);
        this.loader.loadImg('workUp','./imgs/wus.png',workUpDatas);
      },
      create(datas){
        this.draw('img','bg',0,0);

    //左边队列
        let lurenGroup = this.group(1100,420);

        for(var i =0;i< 5;i++){
          lurenGroup.add('luren',-i*80,i*40);
        }

    //右边队列
        let lurenGroup2 = this.group(1250,540);

        for(var i =0;i< 4;i++){
          lurenGroup2.add('luren',-i*80,i*40);
        }

        this.lurenGroup = lurenGroup;
        this.lurenGroup2 = lurenGroup2;

    //左中右可点击箭头
        let arrowLeft = this.draw('img','arrow',700,900);
        let arrowRight = this.draw('img','arrow',920,950);

        arrowLeft.lived = false;
        arrowRight.lived = false;

        this.draw('img','maskMeizu',1158,0);

        let xiao7 = this.draw('img','xiao7',412,666);

        let shopSound = this.group(1514,559).scale(0.5).opacity(0);

        shopSound.add('wordSprite:word',0,0).anchor(0.6,1);

        let soundShape = shopSound.add('wordSprite:sound', -250,-250)

        let xiao7Thoughts = this.draw('img','wordSprite:thoughts',450,750).anchor(0.4,1);

        xiao7Thoughts.scale(0.5).opacity(0);

        let brocastDuration = self.playCount ? 2000 : 2500;

        let shopBrocastTween = this.tween(shopSound,{'scale.x':1,'scale.y':1,opacity:1},500).easing(this.TWEEN.Easing.Cubic.InOut).delay(1000)
                          .repeat(1).repeatDelay(brocastDuration).yoyo(true);

        let xiao7ThougtTween = this.tween(xiao7Thoughts,{'scale.x':1,'scale.y':1,opacity:1},500).easing(this.TWEEN.Easing.Cubic.InOut).delay(1000)
                .repeat(1).repeatDelay(brocastDuration).yoyo(true)
                .onComplete(()=>{
                  arrowLeft.lived = true;
                  arrowRight.lived = true;
                  netBar.interactive = true;
                  lurenGroup.interactive = true;
                  lurenGroup2.interactive = true;
                  this.tween(arrowRight,{'pos.x':950,'pos.y':930},500).repeat(Infinity).repeatDelay(100).yoyo(true).start();
                  this.tween(arrowLeft,{'pos.x':730,'pos.y':880},500).repeat(Infinity).repeatDelay(100).yoyo(true).start();
                });

        this.tween(soundShape,{opacity:0},50).delay(1500).repeat(10).repeatDelay(500).yoyo(true).start();

        shopBrocastTween.chain(xiao7ThougtTween).start();

        arrowLeft.interactive = true;

        [lurenGroup,arrowLeft].forEach(item=>{
          item.once('tap',(evt)=>{
            this.remove(arrowRight);
            this.remove(arrowLeft);
            lurenGroup2.interactive = false;
            let walkRightsheet = this.draw('spritesheet','workRight',412,620,null,null,{
                prefix: 'wr_',
                firstIndex: 1,
                lastIndex: 6,
                fps: 8
              });

            this.tween(walkRightsheet,{'pos.x':646,'pos.y': 606},1000).onComplete(()=>{

              walkRightsheet.play('replace',7,8);

              setTimeout(()=>{
                firstLevel.people2Walk(this,this.lurenGroup2,()=>{
                  App.doFail();
                });

              },500);

            }).start();
            this.remove(xiao7);
          });
        });

        arrowRight.interactive = true;

        [lurenGroup2,arrowRight].forEach(item=>{
          item.once('tap',(evt)=>{
            this.remove(arrowRight);
            this.remove(arrowLeft);
            lurenGroup.interactive = false;
            let walkRightsheet = this.draw('spritesheet','workRight',412,620,null,null,{
                prefix: 'wr_',
                firstIndex: 1,
                lastIndex: 6,
                fps: 8
              });

            this.tween(walkRightsheet,{'pos.x':900,'pos.y': 666},2000).onComplete(()=>{
              walkRightsheet.play('replace',7,8);

              setTimeout(()=>{

                firstLevel.peopleWalk(this,this.lurenGroup,()=>{
                  App.doFail();
                });
              },500);

            }).start();

            this.remove(xiao7);
          });
        });

        let netBar = this.draw('virtual','netbar',385,0,316,335);

        netBar.once('tap',(evt)=>{
          this.remove(arrowRight);
          this.remove(arrowLeft);

          let walkUpsheet = this.draw('spritesheet','workUp',412,620,null,null,{
              prefix: 'wu_',
              firstIndex: 1,
              lastIndex: 14,
              fps: 16,
              animateEnd: (sprite)=>{
                sprite.firstIndex = 3;
              }
            });

          this.tween(walkUpsheet,{'pos.x':420,'pos.y': 166},2000).onComplete(()=>{
            walkUpsheet.play('replace',14);
            App.doSuccess(evt);
          }).start();

          this.remove(xiao7);
        });

      },
      update(timestamp, passedtime){

      },
      destroy(){

      }
    });
    if(process.env.NODE_ENV !== 'production'){
      window.gameWorld = this.game;
    }
  },
  restart(){
    this.playCount = 1;
    this.game.restart();
  },
  clear(){
    this.game.clear();
  }
}


let firstLevel = {
  peopleWalk(picasso,group, cb){
    let baseX = 2000,
        baseY = -750,
        passPeopleCount = 12,
        perPeoTime = 1000 / passPeopleCount,
        hasCompleteCount = group.childCount;

    group.children((sprite,num)=>{

      picasso.tween(sprite,{
          'pos.x': (num + passPeopleCount) * 30,
          'pos.y': -(num + passPeopleCount) * 30
        },1000 + num*perPeoTime,100 * num).onComplete(()=>{
          if(--hasCompleteCount <= 0)
            cb && cb();
        }).start();
    });
  },
  people2Walk(picasso,group, cb){
    let passPeopleCount = 8,
        perPeoTime = 1000 / passPeopleCount,
        hasCompleteCount = group.childCount;

    group.children((sprite,num)=>{

      picasso.tween(sprite,{
            'pos.x': (num + passPeopleCount) * 110,
            'pos.y': -(num + passPeopleCount) * 40
          },2000 + num*perPeoTime,100 * num).onComplete(()=>{
              if(--hasCompleteCount <= 0)
                cb && cb();
            }).start();
    });
  },
  xiao7Wolk(picasso,sprite){
    picasso.tween(sprite,{'pos.x': 900,rotate:45},1000).start();
  }
}

firstLvGame.start({
  doFail(){
    console.log('fail');
    //3秒后重来
    setTimeout(()=>{
      firstLvGame.restart();
    },3000);
  },
  doSuccess(){
    console.log('success')
  }
});
