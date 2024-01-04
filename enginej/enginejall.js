/******************************
 * created by hurray banana dec 2023-
 engine version information
 *
******************************/
let engineversion = '1.6.0.1';

/******************************
 * 
 * 
 * Animation.js
 * 
 * 
 ******************************/ 
class LastAction{
    static stop = "stop";
    static repeat = "repeat";
    static kill = "kill";
    static stopthenfirst = "stopthenfirst";
    static reverse = "reverse";
}
class AnimateMethod{
    static onrate = "onrate";
    static ondistance = "ondistance";
    static onupdate = "onupdate";
}
/** Specifies how a sprite should be sliced up when using defineSliding() */
class SlideMethod
{
    /**  Start with a sprite not visible then slide into view moving left. Use right alignment for best effect*/
    static leftAppear = "leftAppear";
    /**  Start with a sprite visible then slide out of  view moving right. Use right alignment for best effect*/
    static rightDissapear = "rightDissapear";
    /**  Start with a sprite not visible then slide into view moving right. Use left alignment for best effect*/
    static rightAppear = "rightAppear";
    /**  Start with a sprite visible then slide out of view moving left. Use left alignment for best effect*/
    static leftDissapear = "leftDissapear";
    /**  Start with a sprite not visible then slide into view moving up. Use bottom alignment for best effect*/
    static upAppear = "upAppear";
    /**  Start with a sprite visible then slide out of view moving down. Use bottom alignment for best effect*/
    static downDissapear = "downDissapear";
    /**  Start with a sprite not visible then slide into view moving down. Use top alignment for best effect*/
    static downAppear = "downAppear";
    /**  Start with a sprite visible then slide out of view moving up. Use top alignment for best effect*/
    static upDissapear = "upDissapear";
}
//add an EASING function instead of linear time (so scales elapsed depending on frame in sequence??)
class Animator{
    #frame;
    boss;
    state;
    allowduplicate = true;
    restartduplicate = false;

    get animating(){return this.state.animatemethod != null;}
    get active(){return this.state.active;}
    set active(value){
    if (value >= 0 && value < this.#frame.length){
    this.state.active = value;}
    }
    /** gets the first frame defined for the sprite
     * will be -1 if no frames defined or 0 if they are */
    get firstframe(){return (this.#frame.length == 0) ? -1:0;}
    /** gets the last frame defgined for the sprite
     * -1 if no frames defined
     */
    get lastframe(){return this.#frame.length - 1;}
    /** gets the first frame for the current animation set
     * if no animation range set then -1 is returned   */
    get firstAnmiationFrame(){return this.state.first;}
    /** gets the last frame for the current animation set
     * if no animation range set the -1 is returned
     */
    get lastAnimationFrame(){return this.state.last;}
    get currenttex(){return this.#frame[this.state.active].tex; }
    get currentport(){return this.#frame[this.state.active].port; }
    get count() {return this.#frame.length;}
    get clonecurrent(){
        return {tex:this.#frame[this.state.active].tex,port:this.#frame[this.state.active].port.clone};
    }

    get current(){return this.#frame[this.state.active]; }

    constructor(me){
        this.boss = me;
        //this.#active = -1;
        this.#frame = [];
        //default state information
        this.state = {active:-1,animatemethod:null,lastframeaction:null,first:-1,last:-1,direction:1,
            lastposition:0,distance:0,period:0,elapsed:0,loop:0,loopend:-1,animatecallback:null,endcalllback:null};
    }
    setlastaction(action){
        let act = null;
        switch (action){
            case LastAction.stop:act = this.stop;break;
            case LastAction.repeat:act = this.repeat;break;
            case LastAction.kill:act = this.kill;break;
        }
        this.state.lastframeaction = act;
    }
    animateondistance(distance, lastAction,  startFrame, endFrame){
        //only accept animation parameters if we allow the same or they are different
        if (!(this.state.period == distance &&
            this.state.first == startFrame &&
            this.state.last == endFrame &&
            this.state.animatemethod == AnimateMethod.ondistance))
        {
            this.state.animatemethod = AnimateMethod.ondistance;
            this.state.lastframeaction = lastAction;
            //this.setlastaction(lastAction);
            this.state.first = startFrame;
            this.state.last = endFrame;
            this.state.lastposition = this.boss.position.clone;
            this.state.distance = distance**2; //squared checks
            this.state.direction = (startFrame > endFrame) ? -1 : 1;
            this.state.loop = 0;
            this.state.active = (this.state.direction) ? startFrame : endFrame;
        }
    }
    animateonrate(period,  lastAction,  startFrame, endFrame){
        if (!(this.state.period == period &&
            this.state.first == startFrame &&
            this.state.last == endFrame &&
            this.state.animatemethod == AnimateMethod.onrate))
        {
            this.state.animatemethod = AnimateMethod.onrate;
            this.state.lastframeaction = lastAction;
            this.state.first = startFrame;
            this.state.last = endFrame;
            this.state.period = period;
            this.state.elapsed = 0;
            this.state.direction = (startFrame > endFrame) ? -1 : 1;
            this.state.active = (this.state.direction) ? startFrame : endFrame;
            this.state.loop = 0;
        }
    }
    onrate(delta){
        this.state.elapsed += delta;
        if (this.state.elapsed > this.state.period){
            this.state.elapsed = this.state.period - this.state.elapsed;
            this.next();
            
            //need to determine if this works with an instance call
            if (this.state.animatecallback != null){
                this.state.animatecallback();
            }
        }
    }
    ondistance(delta){
        if (vector2.distanceSQ(this.state.lastposition, this.boss.position) > this.state.distance)
        {
            this.state.lastposition = this.boss.position.clone;
            //need to determine if this works with an instance call
            if (this.state.animatecallback != null){
                this.state.animatecallback();
            }
            this.next();
        }
    }
    onupdate(delta){
        if (this.state.animatecallback != null){
            this.state.animatecallback();
        }
        this.next();
    }
    #changedframe;
    update(delta){
        this.#changedframe = false;
        switch (this.state.animatemethod){
            case AnimateMethod.onrate:this.onrate(delta);break;
            case AnimateMethod.ondistance:this.ondistance(delta);break;
        }
        return this.#changedframe;
    }    
    checklastframe(){
        switch (this.state.lastframeaction){
            case LastAction.repeat:this.repeat();break;
            case LastAction.reverse:this.reverse();break;
            case LastAction.stop:this.stop();break;
            case LastAction.stopthenfirst:this.stopthenfirst();break;
            case LastAction.kill:this.kill();break;
        }
    }

    first() {this.state.active = this.state.first;this.#changedframe = true;}
    last() {this.state.active = this.state.last;this.#changedframe = true;}
    next(){
        this.state.active += this.state.direction;
        this.checklastframe();
        this.#changedframe = true;
    }
    previous(){
        this.state.active -= this.state.direction;
        this.checklastframe();
        this.#changedframe = true;
    }
    show(thisFrame){
        if (thisFrame < 0){
            thisFrame = 0;
        } else {
            if (thisFrame > this.#frame.length - 1){
                thisFrame = this.#frame.length - 1;
            }
        }
        //correct any issues with last frame for current range
        this.state.active = thisFrame;
        this.checklastframe();
    }
    define(texture, portion){
        if (portion == undefined){
            portion = new Rectangle(0,0,texture.width, texture.height);
        }
        if (portion.w != 0 && portion.h != 0){
            this.#frame.push({tex:texture,port:portion});
            this.state.last++;
        } else {
            this.#frame.push({tex:null,port:portion});
        }
        if (this.state.active == -1){
            this.state.active = 0;
        }
        this.boss.visible = this.#frame.length > 0;
    }
    define(texture, portion){
        if (portion == undefined){
            portion = new Rectangle(0,0,texture.width, texture.height);
        }
        if (portion.w != 0 && portion.h != 0){
            this.#frame.push({tex:texture,port:portion});
            this.state.last++;
        } else {
            this.#frame.push({tex:null,port:portion});
        }
        if (this.state.active == -1){
            this.state.active = 0;
        }
        this.boss.visible = this.#frame.length > 0;
    }
    defineFramelist(framelist){

    }

    /** Creates animation frames automatically for an sliding sprite ( a graphic split into 
    * several sections along its width or height)
    * @param {*} texture The texture where this sprites graphic can be found
    * @param {*} portion The rectangle that defines the sprite when full (the whole image)
    * @param {*} slide specify the how you want the sprite to appear or dissapear
    * @param {*} steps How many steps are required for the image to appear or dissapear  (number of frames of animation)
    * The number of steps needs to go into the width or height of your sprite an even number of times for the best effect 
    * for example if you full sprite is 100 pixels wide then it could be split into 20 steps (5 pixels each)*/
    defineSliding(texture, portion, slide, steps)
    {
        //in general you would not want half pixel rendering so turn it off
        //this.boss.SmoothPosition = false;//will have to look at this maybe smooth/nosmooth
        let newFrame;
        let fi;
        let stepSizeF;
        switch (slide)
        {
            case SlideMethod.upDissapear:
                stepSizeF = portion.h / (steps - 1);
                for (fi = portion.h; fi > 0; fi -= stepSizeF){
                    newFrame = new Rectangle(portion.x, portion.b - Math.floor(Math.round(fi)), portion.w, Math.floor(Math.round(fi)));
                    this.define(texture, newFrame);
                }
                if (Math.round(fi + stepSizeF) > 0){
                    newFrame = new Rectangle(portion.x, portion.y, portion.w, 0);
                    this.define(texture, newFrame);
                } break;
            case SlideMethod.leftDissapear:
                stepSizeF = portion.w / (steps - 1);
                for (fi = portion.w; fi > 0; fi -= stepSizeF){
                    newFrame = new Rectangle(portion.r - Math.floor(Math.round(fi)), portion.y, Math.floor(Math.round(fi)), portion.h);
                    this.define(texture, newFrame);
                }
                if (Math.round(fi + stepSizeF) > 0){
                    newFrame = new Rectangle(portion.x, portion.y, 0, portion.h);
                    this.define(texture, newFrame);
                }break;
            case SlideMethod.downAppear:
                stepSizeF = portion.h / (steps - 1);
                for (fi = 0; fi < portion.h; fi += stepSizeF){
                    newFrame = new Rectangle(portion.x, portion.b - Math.floor(Math.round(fi)), portion.w, Math.floor(Math.round(fi)));
                    this.define(texture, newFrame);
                }
                if (Math.round(fi - stepSizeF) < portion.h){
                    newFrame = new Rectangle(portion.x, portion.y, portion.w, portion.h);
                    this.define(texture, newFrame);
                }break;
            case SlideMethod.rightAppear:
                stepSizeF = portion.w / (steps - 1);
                for (fi = 0; fi < portion.w; fi += stepSizeF){
                    newFrame = new Rectangle(portion.r - Math.floor(Math.round(fi)), portion.y, Math.floor(Math.round(fi)), portion.h);
                    this.define(texture, newFrame);
                }
                if (Math.round(fi - stepSizeF) < portion.w){
                    newFrame = new Rectangle(portion.x, portion.y, portion.w, portion.h);
                    this.define(texture, newFrame);
                }break;
            case SlideMethod.leftAppear:
                stepSizeF = portion.w / (steps - 1);
                for (fi = 0; fi < portion.w; fi += stepSizeF){
                    newFrame = new Rectangle(portion.x, portion.y, Math.floor(Math.round(fi)), portion.h);
                    this.define(texture, newFrame);
                }
                if (Math.round(fi - stepSizeF) < portion.w){
                    newFrame = new Rectangle(portion.x, portion.y, portion.w, portion.h);
                    this.define(texture, newFrame);
                }break;
            case SlideMethod.rightDissapear:
                stepSizeF = portion.w / (steps - 1);
                for (fi = portion.w; fi > 0; fi -= stepSizeF){
                    newFrame = new Rectangle(portion.x, portion.y, Math.floor(Math.round(fi)), portion.h);
                    this.define(texture, newFrame);
                }
                if (Math.round(fi + stepSizeF) > 0){
                    newFrame = new Rectangle(portion.x, portion.y, 0, portion.h);
                    this.define(texture, newFrame);
                }break;
            case SlideMethod.upAppear:
                stepSizeF = portion.h / (steps - 1);
                for (fi = 0; fi < portion.h; fi += stepSizeF){
                    newFrame = new Rectangle(portion.x, portion.y, portion.w, Math.floor(Math.round(fi)));
                    this.define(texture, newFrame);
                }
                if (Math.round(fi - stepSizeF) < portion.h){
                    newFrame = new Rectangle(portion.x, portion.y, portion.w, portion.h);
                    this.define(texture, newFrame);
                }break;
            case SlideMethod.downDissapear:
                stepSizeF = portion.h / (steps - 1);
                for (fi = portion.h; fi > 0; fi -= stepSizeF){
                    newFrame = new Rectangle(portion.x, portion.y, portion.w, Math.floor(Math.round(fi)));
                    this.define(texture, newFrame);
                }
                if (Math.round(fi + stepSizeF) > 0){
                    newFrame = new Rectangle(portion.x, portion.y, portion.w, 0);
                    this.define(texture, newFrame);
                }break;
        }
        this.boss.visible = this.#frame.length > 0;
    }

    /// if animation has gone past start or end of available animation frames
    /// remain at that position
    stop(){
        if (this.state.direction == 1){
            if (this.state.active > this.state.last){
                this.state.loop++;
                this.state.active = this.state.last;
                //sequence ended run callback
                if (this.state.endcalllback != null) this.state.endcalllback();
                this.state.animatemethod = null;
    //          RevertAndContinue(_check_Animation._lastFrame);
            }
        } else {
            if (this.state.active < this.state.first){
                this.state.loop++;
                this.state.active = this.state.first;
                //sequence ended crun callback before repeating
                if (this.state.endcalllback != null) this.state.endcalllback();
                this.state.animatemethod = null;
    //          RevertAndContinue(_check_Animation._lastFrame);
            }
        }
    }
    /// if animation has gone past start or end of available animation frames 
    /// revert to first frame in sequence and stop animation
    stopthenfirst(){
        if (this.state.direction == 1){
            if (this.state.active > this.state.last){
                this.state.loop++;
                this.state.active = this.state.last;
                //sequence ended run callback
                if (this.state.endcalllback != null) this.state.endcalllback();
                this.state.animatemethod = null;
                this.state.active = this.state.first;
    //          RevertAndContinue(_check_Animation._lastFrame);
            }
        } else {
            if (this.state.active < this.state.first){
                this.state.loop++;
                this.state.active = this.state.first;
                //sequence ended crun callback before repeating
                if (this.state.endcalllback != null) this.state.endcalllback();
                this.state.active = this.state.last;
                this.state.animatemethod = null;
    //          RevertAndContinue(_check_Animation._lastFrame);
            }
        }
    }
    /// if animation has gone past start or end of available animation frames
    /// go back to first frame and continue
    repeat(){
        if (this.state.direction == 1){
            if (this.state.active > this.state.last){
                this.state.loop++;
                this.state.active = this.state.last;
                //sequence ended crun callback before repeating
                if (this.state.endcalllback != null) this.state.endcalllback();
                this.state.active = this.state.first;
            } else if (this.state.active < this.state.first){
                this.state.loop++;
                this.state.active = this.state.first;
                //sequence ended crun callback before repeating
                if (this.state.endcalllback != null) this.state.endcalllback();
                this.state.active = this.state.last;
            }
        } else {
            if (this.state.active < this.state.first){
                this.state.loop++;
                this.state.active = this.state.first;
                //sequence ended crun callback before repeating
                if (this.state.endcalllback != null) this.state.endcalllback();
                this.state.active = this.state.last;
            } else if (this.state.active > this.state.last){
                this.state.loop++;
                this.state.active = this.state.last;
                //sequence ended crun callback before repeating
                if (this.state.endcalllback != null) this.state.endcalllback();
                this.state.active = this.state.first;
            } 
        }
    }
    /// if animation has gone past start or end then reverse direction
    reverse(){
        if (this.state.direction == 1){
            if (this.state.active > this.state.last){
                this.state.loop++;
                this.state.active = this.state.last;
                //sequence ended crun callback before repeating
                if (this.state.endcalllback != null) this.state.endcalllback();
                this.state.direction = -1;
                this.state.active = this.state.last - 1;
            }
        } else {
            if (this.state.active < this.state.first){
                this.state.loop++;
                this.state.active = this.state.first;
                //sequence ended crun callback before repeating
                if (this.state.endcalllback != null) this.state.endcalllback();
                this.state.direction = 1;
                this.state.active = this.state.first + 1;
            }
        }
    }
    /// <summary>
    /// if animation has gone past start or end of available animation frames
    /// kill the sprite ha ha!!
    /// </summary>
    /// <remarks>Very useful for running an animation then making a sprite dissapear</remarks>
    kill(){
        if (this.state.direction == 1){
            if (this.state.active > this.state.last){
                this.state.active = this.state.last;
                //sequence ended crun callback before repeating
                if (this.state.endcalllback != null) this.state.endcalllback();
                this.boss.kill();
            }
        } else {
            if (this.state.active < this.state.first){
                this.state.active = this.state.first;
                //sequence ended crun callback before repeating
                if (this.state.endcalllback != null) this.state.endcalllback();
                this.boss.kill();
            }
        }
    }
}//class Animator
  /******************************
   * 
   * 
   * engine.js
   * 
   * 
   ******************************/ 
  
  class Engine{
    static showversion = true;
    //graphics layers here
    static spl = [];
    static glow = [];
    static glowDiv = 8;
    static get hud(){return Engine.layer(Engine.spl.length-1)};
    
    static spM;
    static particleM;

    static worldWidth;
    static worldHeight;
    static viewWidth;
    static viewHeight;

    static canvasArea;
    static viewports = [];

    static zRange = 5000;
    static zHalf = this.zRange / 2;
    
    static get viewCentrex(){return Engine.viewWidth/2;}
    static get viewCentrey(){return Engine.viewHeight/2;}
    static get viewcount(){return Engine.viewports.length;}

    //texture space
    /** single pixel for scaling for rectangles */
    static txSinglepixel;
    /** texture with just white pixels 50x50 */
    static txRect50by50;
    /** 8x8 pixel triangle white outline with black triangle */
    static txTriangle;
    /** white circle  */
    static txCircle4by4;
    static txCircle8by8;
    static txCircle16by16;
    static txCircle32by32;

    static createTextures(){
        this.txSinglepixel = createGraphics(1, 1);
        this.txSinglepixel.background(255);
        // triangle
        this.txTriangle = createGraphics(16, 16);
        this.txTriangle.clear();
        this.txTriangle.fill(255);
        this.txTriangle.noStroke();
        this.txTriangle.noSmooth();
        this.txTriangle.triangle(0,15,8,0,15,15);
        //circles
        this.txCircle4by4 = createGraphics(4, 4);
        this.txCircle4by4.clear();
        this.txCircle4by4.fill(255);
        this.txCircle4by4.noStroke();
        this.txCircle4by4.noSmooth();
        this.txCircle4by4.ellipse(2,2,1,1);

        this.txCircle8by8 = createGraphics(8, 8);
        this.txCircle8by8.clear();
        this.txCircle8by8.fill(255);
        this.txCircle8by8.noStroke();
        this.txCircle8by8.noSmooth();
        this.txCircle8by8.ellipse(4,4,3,3);

        this.txCircle16by16 = createGraphics(16, 16);
        this.txCircle16by16.clear();
        this.txCircle16by16.fill(255);
        this.txCircle16by16.noStroke();
        this.txCircle16by16.noSmooth();
        this.txCircle16by16.ellipse(8,8,7,7);

        this.txCircle32by32 = createGraphics(32, 32);
        this.txCircle32by32.clear();
        this.txCircle32by32.fill(255);
        this.txCircle32by32.noStroke();
        this.txCircle32by32.noSmooth();
        this.txCircle32by32.ellipse(16,16,15,15);

    }
    /** initialises all the sub systems of the engine, call this from the preload function 
     * 
     * pass a settings object to change some of the defaults
     * @example     Engine.init({layers:4,glowdivisor:8});
     * 
    */
    static init(settings){
        let numlayers = 4;
        let glowdivisor = 8;
        let compositor = "lighter";
        let vw = 600;
        let vh = 600;

        if (settings != undefined){
            if (settings.layers != undefined) numlayers = settings.layers;
            if (settings.glowdivisor != undefined) glowdivisor = settings.glowdivisor;
            if (settings.compositor != undefined) compositor = settings.compositor;
            if (settings.viewW != undefined) vw = settings.viewW;
            if (settings.viewH != undefined) vh = settings.viewH;
        }
        Engine.viewWidth = vw;
        Engine.viewHeight = vh;
        Engine.glowDiv = glowdivisor;
        Engine.createlayers(numlayers, compositor);
        Engine.createview();
        Engine.particleM = new particleManager();
        Engine.spM = new Spritemanager(Engine.layer(Engine.spl.length-1));//hud
        Engine.createTextures();
    }


    /** takes a texture and produces a tinted version     */
    static getTintedCopy(tintcolor, texture){
    //this is demo code needs modiyfing and testing
        // create offscreen buffer, 
        buffer = document.createElement('canvas');
        buffer.width = fg.width;
        buffer.height = fg.height;
        bx = buffer.getContext('2d');

        // fill offscreen buffer with the tint color
        bx.fillStyle = '#FF0000'
        bx.fillRect(0,0,buffer.width,buffer.height);

        // destination atop makes a result with an alpha channel identical to fg, but with all pixels retaining their original color *as far as I can tell*
        bx.globalCompositeOperation = "destination-atop";
        bx.drawImage(fg,0,0);


        // to tint the image, draw it first
        x.drawImage(fg,0,0);

        //then set the global alpha to the amound that you want to tint it, and draw the buffer directly on top of it.
        x.globalAlpha = 0.5;
        x.drawImage(buffer,0,0);
    }

    static createview(){
        Engine.viewports.push(new Rectangle(0,0,Engine.viewWidth, Engine.viewHeight)); //canvas area
    }
    /**retrieves a specific graphic layer for drawing on and changing settings of */
    static layer(number){
        if (number >= 0 && number < Engine.spl.length){
            Engine.spl[number].operations = true;
            return Engine.spl[number];
        } else {
            Engine.spl[0].operations = true;
            return Engine.spl[0];
        }
    }
    /**retrieves a specific graphic layer for drawing on and changing settings of */
    static glowlayer(number){
        if (number >= 0 && number < Engine.glow.length){
            Engine.glow[number].operations = true;
            return Engine.glow[number];
        } else {
            Engine.glow[0].operations = true;
            return Engine.glow[0];
        }
    }
    static get mainview(){return Engine.viewports[0];}
    /**retrieves the rectangle for a numbered viewport - 0 being the main canvas area */
    static view(number){
      if (number === undefined) {
        return Engine.viewports[0];
      }
      else{
        if (number >= 0 && number < Engine.viewports.length){
            return Engine.viewports[number];
        } else 
        return Engine.viewports[0];
      }
    }
    static createlayers(layercount, compositor){
        createCanvas(Engine.viewWidth, Engine.viewHeight);//, WEBGL);

        Engine.spl = new Array(layercount);
        Engine.glow = new Array(layercount);
        for (let p = 0; p < layercount; p++){
            Engine.spl[p] = createGraphics(Engine.viewWidth, Engine.viewHeight);
            Engine.spl[p].rectMode(CENTER);
            Engine.spl[p].imageMode(CENTER);
            Engine.spl[p].noStroke();
            Engine.spl[p].noSmooth();
            Engine.spl[p].operations = false;
            //create a glow layer for each sprite layer
            Engine.glow[p] = createGraphics(Engine.viewWidth/Engine.glowDiv,Engine.viewHeight/Engine.glowDiv);
            Engine.glow[p].drawingContext.globalCompositeOperation = compositor;
            Engine.glow[p].noStroke();
            Engine.glow[p].rectMode(CENTER);
            Engine.glow[p].imageMode(CENTER);
            Engine.glow[p].operations = false;
            Engine.glow[p].scale(1/Engine.glowDiv);
            //Engine.glow[p].filter(BLUR,0);
            //Engine.glow[p].drawingContext.filter = "blur(1px)";

        }
    }

    /* updates the various engine sub systems call this once a frame */
    static update(delta){
        Engine.spM.update(delta);
        Engine.particleM.update(delta);

    }

    /**draws the various engine rendering sub systems */
    //HAS TO BE A PUSH AND POP PROBLEM
    static draw(delta){
        Engine.spM.draw(delta);
        Engine.particleM.draw(delta);
        for (let p = 0; p < Engine.spl.length; p++){
            if (Engine.glow[p].operations){
                //too expensive without rendering all particles through GPU
                //Engine.glow[p].drawingContext.filter = "blur(1px)";
                image(Engine.glow[p],0, 0, Engine.viewWidth, Engine.viewHeight);
                Engine.glow[p].clear();
            }
            if (Engine.spl[p].operations){
                image(Engine.spl[p],0,0);
                //clear once drawn
                Engine.spl[p].clear();
            }
        }
        if (Engine.showversion) {Engine.version();}

    }

    static version(){
        Engine.spl[3].push();
        Engine.spl[3].fill(255);
        Engine.spl[3].noStroke();
        Engine.spl[3].text(engineversion, 10,Engine.spl[3].height - 10);
        
        //Engine.spl[3].text(engineversion, 10,Engine.spl[3].height - 10);
        Engine.spl[3].pop();
    }
}
/******************************
 * 
 * gravitywell.js
 * 
 ******************************/ 
/**Defines a gravity well that can act upon a sprite if associated*/
class GravityWell
{
    /**  The position of this gravity well as a vector3*/
    location;
    /** The mass of this gravity well in GigaTonnes (this diminishes over distance in a linear way */
    #pointmass;
    /** gravitational constant*/
    static GM = 6.673E-11;
    /**pre calculated value*/
    #precalc;
    /** Creates a new GravityWell specifying its location and Mass in Giga Tonnes 
     * 
     * @param location The location of the well, vector3
     * @param gigaTonnes The mass of the gravity from this location in Giga Tonnes (billions of Kilograms), the higher the Mass the harder the pull
     * 
     * You will need to experiment with the location and Mass of the GravityWells in order to achieve the desired effects
    */
    constructor(location, gigaTonnes){
        this.location = location;
        this.pointmass = gigaTonnes;
    }
    /**gets the pre-calculate gravitaional force */
    get precalc(){return this.#precalc;}
    /**  gets the point mass for the well in GigaTonnes */
    get pointmass(){ return this.#pointmass;}
    /**  sets the point mass for the well in GigaTonnes */
    set pointmass(value){
            this.#pointmass = value;
            this.#precalc = value * 1000000000 * GravityWell.GM;
    }
}
/******************************
 * 
 * 
 * general helper functions
 * 
 *
******************************/ 
/**returns a random integer value */
function randomint(maximum){
    if (maximum === undefined){
      maximum = 1;
    }
    return Math.floor(Math.random()*maximum);
}

/** keeps a value within the lower and upper limit*/
function clamp(value, lower, upper){
  if (value < lower) return lower;
  else if (value > upper) return upper;
  else return value;
}

/** prouduces a random integer value between the lower and upper values */
function ranBetween(lower, upper){
  return lower + this.ranInt(upper-lower);
}
/** prouduces a random value between the lower and upper values */
function floatBetween(lower, upper){
  return lower + Math.random() * (upper - lower);
}  

/** returns the radians in degrees */
function radtoDeg(radians){ return radians / PIx180;}
/** returns the degrees in radians */
function degtoRad(degrees){return  degrees * PIby180;}

// pre-calculations
Math.PIby2 = Math.PI/2;
Math.PIby180 = Math.PI/180;
Math.PIx180 = Math.PI*180; //NEED  SOMETHING TO HAVE HISTORY ENABLED BUT ONLY IF SETUP CORRECTLY
/******************************
 * 
 * 
 * history.js
 * 
 * 
 ******************************/ 

/** holds the definitions for a snapshot of a sprite
 */
class Historysnap{
    //texture and rectangle 
    frame;
    pos;
    world
    scale;
    angle;
    wash;
    alpha;
    layeroffset;
    layer;
}

/** provides visual snapshot functionality for sprites */
class History{
    #snaps = [];
    #start = 0;
    #length = 0;
    #end = 0;
    #renderfrom = 0;
    get renderfrom(){return this.#renderfrom;}
    /**specifies the position to start rendering from.
     * this needs to be within the limit of the history length
     * @example
     * this.history = new History(this); // create the history object
     * this.history.show(0.05,90); //snap every 50 milliseconds, take 90 samples
     * this.history.renderfrom = 10; //skip the first ten snaps
     * this.history.scale = -0.5; // reduce the size by 50%
     * this.history.clampAlpha = 0.1;//don't allow alha to be higher than 10%
    */
    set renderfrom(value){this.#renderfrom = clamp(value, 0, this.#snaps.length - 2);}
    #elapsed;
    //#samplerate;
    /*/* specifies how often to sample history in 1 second 
    *
    * maximum would be 60 (every single frame)
    *
    * 0.5 would be once every 2 seconds
    *
    *use historySampleFreq if it makes more sense to specify this in terms of seconds rather frames
    */
    //sampleRate;
    /** specifies how to sample history in seconds, don't set this directly use show()
    *
    * maximum would be 0.0167 (every single frame)
    *
    * 2 would be once every 2 seconds (or every 120 frames)
     * @example
     * this.history = new History(this); // create the history object
     * this.history.show(0.05,90); //snap every 50 milliseconds, take 90 samples
     * this.history.renderfrom = 10; //skip the first ten snaps
     * this.history.scale = -0.5; // reduce the size by 50%
     * this.history.clampAlpha = 0.1;//don't allow alha to be higher than 10%
    */
    sampleFreq;
    //timer for history sampling
    //#depth = 2;
    /*/* gets the number of history position we want to record */
    //get depth(){ return this.#depth ;}
    /*/* sets the number of history positions to record (minimum is 2) */
    //set depth(value){
    //    this.#depth = value < 2 ? 2 : value;
    //}
    /** scale factor to apply to history rendering
     * this value is the factor by which to increase/decrease the scale of history trails.
     * default value is 0 ; no change in size
     * @example
     * this.history.scale = 1; //increase the size by 100%
     * this.history.scale = -0.5f; //would decrease the size by 50%,*/
    scale = 1;

    #clampAlpha;
    /** Sets the maximum alpha for the history trail, if HistoryFadeAlpha is false then this is the alpha for the entire trail
    */
    get clampAlpha(){ return this.#clampAlpha; }
    /** Sets the maximum alpha for the history trail, if HistoryFadeAlpha is false then this is the alpha for the entire trail 
     * @example
     * this.history = new History(this); // create the history object
     * this.history.show(0.05,90); //snap every 50 milliseconds, take 90 samples
     * this.history.renderfrom = 10; //skip the first ten snaps
     * this.history.scale = -0.5; // reduce the size by 50%
     * this.history.clampAlpha = 0.1;//don't allow alha to be higher than 10%
    */
    set clampAlpha(value){ this.#clampAlpha = clamp(value, 0, 1);}
    /** sets the layer to draw history on, by default this is layer 0 
     * @example this.history.layer = Engine.layer(2);
    */
    layer = Engine.layer(0);

    #mysprite ;
    /** builds the history recording system for a sprite */
    constructor(mysprite){
        this.#mysprite = mysprite;
    }
    /** turns on history for this sprite 
     * @example
     * this.history = new History(this); // create the history object
     * this.history.show(0.05,90); //snap every 50 milliseconds, take 90 samples
     * this.history.renderfrom = 10; //skip the first ten snaps
     * this.history.scale = -0.5; // reduce the size by 50%
     * this.history.clampAlpha = 0.1;//don't allow alha to be higher than 10%
    */
    show(rate, depth){
        //this.depth = depth;
        this.sampleFreq = rate;
        this.#elapsed = 0;
        //implement history cicular queue
        //and fully initialise 
        this.#snaps = new Array(depth);
        for (let p = 0; p < depth; p++){
            this.#snaps[p] = new Historysnap();
        }
        this.#start = 0;
        this.#length = 0;
        this.#end = 0;
    }

    /** snaps if timer required current sprite settings */
    update(delta){
        if ((this.#elapsed += delta) > this.sampleFreq){
            this.#elapsed -= this.sampleFreq;
            let h = this.#snaps[this.#end];
            if (this.#mysprite.visible){
                h.frame = this.#mysprite.frame.clonecurrent;
                h.pos = new vector3(this.#mysprite.centrex, this.#mysprite.centrey,0);//this.#mysprite.position.clone
                h.scale = this.#mysprite.scale.clone;
                h.layer = this.#mysprite.layer;
                h.angle = this.#mysprite.angle/Math.PI * 180;
                h.alpha = this.alpha;
            } else {
                h.frame = {tex:null};
            }

            //remove first if we are at max depth
            if (this.#length == this.#snaps.length){
                this.#start = (this.#start + 1) % this.#length;
            } else {this.#length++;}
            //move to next recording position
            this.#end++;
            if (this.#end == this.#snaps.length) {this.#end = 0;}
            //this.#end = (this.#end + 1) % this.#snaps.length;
        }
    }
    /** renders the history recorded here */
    draw(){

        //draw from end to start (newest to oldest)
        let end = this.#end - 1 - this.#renderfrom;
        let numbertorender = this.#length - this.#renderfrom;

        let dalpha = this.#clampAlpha / numbertorender;
        let alpha = this.#clampAlpha;
        let dscale = (this.scale == 0)? 0:-this.scale / numbertorender;
        let scale = 1;

        this.layer.push();

        if (this.#mysprite.clip){
            this.layer.clip(() => {
            const r = this.#mysprite.cliparea;
            this.layer.rect(r.x,r.y,r.w,r.h);
            });
        }            

        for (let p = 0; p < numbertorender ; p++){
            if (end < 0) end += this.#length;
            const h = this.#snaps[end];
            if (h.frame.tex != null){
                h.layer.push();
                h.layer.drawingContext.globalAlpha = alpha;
                h.layer.translate(h.pos.x , h.pos.y);
                if (h.angle != 0){
                    h.layer.rotate(h.angle);
                }
                //cheating for now with some of the data here
                //offset to centre - need to fix /record the true offset for the history item now
                h.layer.image(h.frame.tex,
                    0,0,h.frame.port.w*h.scale.x*scale, h.frame.port.h*h.scale.y*scale,
                    h.frame.port.x, h.frame.port.y, h.frame.port.w, h.frame.port.h
                );
                h.layer.pop();
            }
            scale -= dscale;
            alpha -= dalpha;
            end--;
        }
        this.layer.pop();
    }
}  /******************************
   * 
   * 
   * Limit.js
   * 
   * 
   ******************************/ 
  /** actions to be taken once a Sprite meets or passes the limit box edge that is defined
   * 
   * The limit box can be any given rectangular or 3d box area or
   * the current position of the ViewPort. Limit boxes are only active once a sprite fully enters them,
   * if you are having trouble with a limit box make sure you make it visible using
   * @example Limit.Show()
   */
  class Limitmode{
        /// no boundary control
        static none = "none";
        /// make sprite bounce back in opposite direction
        /// <remarks>Nice for keeping a sprite within the boundaries of screen or rectangle. 
        /// Such as in breakout/arkanoid type games</remarks>
        static bounce = "bounce";
        /// Performs a bounce but only bothers checking the front and back of the limit box
        /// <remarks>Great when used in conjuction with Z gravity and auto sprite scaling
        /// to create a throbbing sprite</remarks>
        static bounceZonly = "bounceZonly";
        /// make sprite bounce back in opposite direction but align with collided edge
        /// <remarks>Only use this if you want the sprite to start its bounce aligned to the
        /// edge of the limit box, you might get odd effects when doing this</remarks>
        static bounceAlign = "bounceAlign";
        /// make sprite appear on other side of limit box
        /// <remarks>Aligns the sprite with the opposite edge of limit box. Which can cause
        /// odd effects with groups of sprites following each other, use wrapExact instead.</remarks>
        static wrap = "wrap";
        /// makes sprite appear on other side of limit box taking
        /// account of exact position when leaving the limit box
        /// use this for scrolling text or groups of sprites for an Asteroid wrapping effect
        //static wrapExact = "wrapExact";
        /// only wrap in X direction, but bounce in Y direction
        /// <remarks>Use this if you want the sprite to wrap horizontally but fall under gravity</remarks>
        static wrapXBounceY = "wrapXBounceY";
        /// only wrap in Y direction, but bounce in X direction
        /// <remarks>Use this if you want the sprite to wrap vertically but bounce off the sides</remarks>
        static wrapYBounceX = "wrapYBounceX";
        /// make sprite stop moving in axis of limit box and align with collided edge
        /// <remarks>If a sprite hits the vertical edges of limit box then its horizontal
        /// velocity is stopped, it can still move vertically until it hits the top or
        ///  bottom of the limit box</remarks>
        static stopAt = "stopAt";
        /// make the sprite stop moving if any of borders are touched
        /// <remarks>Useful for title graphics where you want a sprite to stop in a specific
        /// horizontal or vertical position but dont want to worry about exact size of limit box required</remarks>
        static stopFirstTouch = "stopFirstTouch";
        /// make sprite stop moving in axis of limit box and kill if no velocity set
        /// <remarks>Works like stop but if sprite has no velocity it will be killed</remarks>
        static stopThenKill = "stopThenKill";
        /// kill sprite once outside limit box
        /// <remarks>Use this to remove sprites once they have gone past the viewport 
        /// (unless you want them to come back on screen). This will remove them without them
        /// flashing off while still visible</remarks>
        static killPast = "killPast";
        /// kill sprite as soon as it touches limit box
        /// <remarks>Greate for implementing electric fences etc...</remarks>
        static killTouch = "killTouch";
        /// kill sprite as soon as it enters the limit box
        /// <remarks>The sprite has to fit inside the limit box
        /// Useful for setting defence boundaries around turrets etc..
        static killInside = "killInside";
        /// kills sprite if goes past X limit box, but bounces on Y
        static killPastXBounceY = "killPastXBounceY";
        /// kills a sprite if it goes past the left/right boundaries and 
        /// stops sprites vertical movement if it touches top/bottom
        static killPastXStopY = "killPastXStopY";
        /// killPastYStopX, kills a sprite if it goes past top/bottom 
        /// boundaries and stops sprites horizontal movement if it touches left/right
        static killPastYStopX = "killPastYStopX";
        /// Notify using callback property
        /// <remarks>Use this in conjuction with an update routine to determine when sprite
        /// hits an edge</remarks>
        static inform = "inform";
        /// Notify by setting AtBoundary to true and align with collided edge
        /// <remarks>Use this in conjuction with an UpdateHandler to determine when sprite
        /// hits an edge, this can be seen in use in the Space Invaders code. As soon as one
        /// invader hits the limit box all the invaders are then dropped down a line</remarks>
        static informAlign = "informAlign";
        //bounceOutside
        /// Turns gravity off once collided and aligns sprite with limit box
        /// <remarks>Use this when you want a sprite to stop falling after you have
        /// made it move under gravity</remarks>
        static turnOffGravity = "turnOffGravity";
        /// Turns off gravity but only if contact with bottom of limit box occurs
        static turnOffGravityBottomOnly = "turnOffGravityBottomOnly";
        /// executes the sprite callback routine specified. You need to handle any other actions
        /// you want to apply to the sprite yourself, the event will continue to fire if your
        /// sprite is still at the limit box, so you need to ensure that you set OnLimit = null if you do not want this behaviour
        static fireEvent = "fireEvent";//fireEvent // rename to callbac = "";
  }
  /** class to provide various types of interactions between sprites and bounding rectangles (limit boxes) */
  class Limit {
    //limitactions = new Map();//can I use this instead of a big switch block
    #delta;

    #mode;
    area;
    #ms;
    #active;
    #callback;
    #atLimit = false;
    get atLimit(){return this.#atLimit;}
    get callback(){return this.#callback;}
    set callback(value){
      if (value.callbk != undefined && value.inst != undefined){
        this.#callback = value;
      }
    }
    /** holds a colour to show the limit box of this sprite
     * If null (default) box not shown
     * if a colour is stored then it will be drawn (use alpha values so you can see the sprite)
     * @example
     * //show transparent red limit box
     * this.limit.show = [255,0,0,100];
     */
    show = null;
    //if (this.#callback != null) this.#callback.callbk.call(this.#callback.inst);

    /** specifies if the specified limit box is actively being processed default is true */
    get active(){return this.#active;}
    constructor(boss){
      this.#ms = boss;
      this.#active = false;
      this.#mode = Limitmode.none;
    }
    /** manually turn off limit box
     * 
     * @example 
     * // for complete removal use
     * this.limit = null;
     */
    off(){this.#active = false;}
    /** re-activates a previously set limit mode
     * 
     * You can also just set another region action if you want to change behaviour or just for simplicity
     */
    reset(){
      if (this.area != null && this.#mode != Limitmode.none){
        this.#active = true;
      }
    }
    modeoff(){this.#active = false;this.#mode = Limitmode.none;}
    /** specifies a limitmode and an active limit area 
     * 
     * if you want a static area provide a clone of a previously defined area/box (if that area will change)
     * 
     * If you want to track a moving area/box just use the boxes reference
     * 
     * set a callback (and it's instance) if you want notification of limit activity
     */
    regionaction(mode, area, instance, callme){
      if(area instanceof Rectangle){
        this.area = new Box(area.x, area.y, Engine.zHalf, area.w, area.h, Engine.zRange);
      } else if (area instanceof Box){
        this.area = area;
      }
      this.#mode = this.#getMode(mode);
      this.#active = false;
      if (instance != undefined && callme != undefined){
        this.#callback = {callback:callme,instance:instance};
    }
    }
    /* returns the function for that mode*/
    #getMode(mode){
      switch (mode){
        case Limitmode.bounce:return this.bounce;
        case Limitmode.wrap:return this.wrap;
        case Limitmode.killTouch:return this.killtouch;
        case Limitmode.killPast:return this.killpast;
        case Limitmode.none:return this.modeoff;
        case Limitmode.bounceZonly:return this.bounceZonly;
        case Limitmode.bounceAlign:return this.bounceAlign;
        case Limitmode.wrapXBounceY:return this.wrapXBounceY;
        case Limitmode.wrapYBounceX:return this.wrapYBounceX;
        case Limitmode.stopAt:return this.stopAt;
        case Limitmode.stopFirstTouch:return this.stopFirstTouch;
        case Limitmode.stopThenKill:return this.stopThenKill;
        case Limitmode.killInside:return this.killInside;
        case Limitmode.killPastXBounceY:return this.killPastXBounceY;
        case Limitmode.killPastXStopY:return this.killPastXStopY;
        case Limitmode.killPastYStopX:return this.killPastYStopX;
        case Limitmode.inform:return this.inform;
        case Limitmode.informAlign:return this.informAlign;
        case Limitmode.turnOffGravity:return this.turnOffGravity;
        case Limitmode.turnOffGravityBottomOnly:return this.turnOffGravityBottomOnly;
        case Limitmode.fireEvent:return this.fireEvent;
        default: return this.modeoff;
      }
    }

    update(delta){
        this.#delta = delta;//for those that need it
        this.#atLimit = false;
        if (this.#mode != Limitmode.none){
            if (this.#active){
                this.#mode();
            } else {
                //check to see if we are in limit area and so activate
                if (this.#ms.right < this.area.right &&
                    this.#ms.left > this.area.left &&
                    this.#ms.top > this.area.top &&
                    this.#ms.bottom < this.area.bottom &&
                    this.#ms.z > this.area.back &&
                    this.#ms.z < this.area.front) {
                    this.#active = true;
                    if (this.#mode == Limitmode.killInside)
                    {
                        this.#atLimit = true;
                        this.#ms.kill();
                    }
                }
            }
            if (this.#atLimit && this.#callback != null){
              this.#callback.callback.call(this.#callback.instance);
            }
        }
    }
    killpast(){
        if (this.#ms.left > this.area.right || this.#ms.right < this.area.left ||
          this.#ms.top > this.area.bottom || this.#ms.bottom < this.area.top ||
          this.#ms.z < this.area.back || this.#ms.z > this.area.front){
              this.#ms.kill();
              this.#atLimit = true;
        }
    }
    killtouch(){
        if (this.#ms.right > this.area.right || this.#ms.left < this.area.left ||
            this.#ms.bottom > this.area.bottom || this.#ms.top < this.area.top ||
            this.#ms.z < this.area.back || this.#ms.z > this.area.front){
            this.#ms.kill();
            this.#atLimit = true;
        }
    }
    bounceZonly(){
      let diff = this.#ms.z - this.area.back;
      if (diff < 0){
          this.#ms.z -= diff;// *this.#ms.e;
          this.#ms.vz *= -this.#ms.e;
          this.#atLimit = true;
      } else {
          diff = this.#ms.z - this.area.front;
          if (diff > 0) {
              this.#ms.z -= diff;// * this.#ms.e;
              this.#ms.vz *= -this.#ms.e;
              this.#atLimit = true;
          }
      }
    }
    bounceAlign(){} //modify already written bounce
    wrapXBounceY(){
      if (this.#ms.right < this.area.left)
      {
          this.#ms.left = this.area.right;
          //SpriteHelper.AlignLeftAt(boss, this.area.right, 0);
          this.#atLimit = true;
      }
      else if (this.#ms.left > this.area.right)
      {
          this.#ms.left = this.area.right;
          //SpriteHelper.AlignRightAt(boss, this.area.left, 0);
          this.#atLimit = true;
      }
      //check Y
      let diff = this.#ms.bottom - this.area.bottom;
      if (diff >= 0)
      {
          this.#ms.y -= diff;// * this.#ms.e;
          this.#ms.vy *= -this.#ms.e;
          this.#atLimit = true;
      }
      else
      {
          diff = this.#ms.top - this.area.top;
          if (diff <= 0)
          {
              this.#ms.y -= diff;// * this.#ms.e;
              this.#ms.vy *= -this.#ms.e;
              this.#atLimit = true;
          }
      }
    }
    wrapYBounceX(){
      if (this.#ms.bottom < this.area.top)
      {
          this.#ms.top = this.area.bottom;
          //SpriteHelper.AlignTopAt(boss, this.area.bottom, 0);
          this.#atLimit = true;
      }
      else if (this.#ms.top > this.area.bottom)
      {
          this.#ms.bottom = this.area.top;
          //SpriteHelper.AlignBottomAt(boss, this.area.top, 0);
          this.#atLimit = true;
      }
      //check X
      let diff = this.#ms.right - this.area.right;
      if (diff > 0)
      {
          this.#ms.x -= diff;// * this.#ms.e;
          this.#ms.vx *= -this.#ms.e;
          this.#atLimit = true;
      }
      else
      {
          diff = this.#ms.left - this.area.left;
          if (diff < 0)
          {
              this.#ms.x -= diff;// * this.#ms.e;
              this.#ms.vx *= -this.#ms.e;
              this.#atLimit = true;
          }
      }
    }
    stopAt(){
      if (this.#ms.right > this.area.right)
      {
          this.#ms.right = this.area.right;
          //SpriteHelper.AlignRightAt(boss, this.area.right, 0);
          this.#ms.vx = 0;
          this.#atLimit = true;
          //this.#ms.Velocity = new Vector3(0.0f, this.#ms.vy, this.#ms.vz);
          this.#ms.static = true;
      }
      else if (this.#ms.left < this.area.left)
      {
          this.#ms.left = this.area.left;
          //SpriteHelper.AlignLeftAt(boss, this.area.left, 0);
          this.#ms.vx = 0;
          //this.#ms.Velocity = new Vector3(0.0f, this.#ms.vy, this.#ms.vz);
          this.#atLimit = true;
          this.#ms.static = true;
      }
      if (this.#ms.bottom > this.area.bottom)
      {
          this.#ms.bottom = this.area.bottom;
          //SpriteHelper.AlignBottomAt(boss, this.area.bottom, 0);
          this.#ms.vy = 0;
          //this.#ms.Velocity = new Vector3(this.#ms.vx, 0.0f, this.#ms.vz);
          this.#atLimit = true;
          this.#ms.static = true;
      }
      else if (this.#ms.top < this.area.top)
      {
          this.#ms.top = this.area.top;
          //SpriteHelper.AlignTopAt(boss, this.area.top, 0);
          this.#ms.vy = 0;
          //this.#ms.Velocity = new Vector3(this.#ms.vx, 0.0f, this.#ms.vz);
          this.#atLimit = true;
          this.#ms.static = true;
      }
      if (this.#ms.z < this.area.back)
      {
          this.#ms.z = this.area.back;
          this.#ms.vz = 0;
          this.#ms.static = true;
          this.#atLimit = true;
      }
      else if (this.#ms.z > this.area.front)
      {
          this.#ms.z = this.area.front;
          this.#ms.vz = 0;
          this.#ms.static = true;
          this.#atLimit = true;
      }
    }
    stopFirstTouch(){
      if (this.#ms.right > this.area.right)
      {
        this.#ms.right = this.area.right;
        //SpriteHelper.AlignRightAt(boss, this.area.right, 0);
          this.#ms.Velocity = Vector3.Zero;
          this.#ms.static = true;
      }
      else if (this.#ms.left < this.area.left)
      {
        this.#ms.left = this.area.left;
        //SpriteHelper.AlignLeftAt(boss, this.area.left, 0);
          this.#ms.Velocity = Vector3.Zero;
          this.#atLimit = true;
          this.#ms.static = true;
      }
      if (this.#ms.bottom > this.area.bottom)
      {
        this.#ms.bottom = this.area.bottom;
        //SpriteHelper.AlignBottomAt(boss, this.area.bottom, 0);
          this.#ms.Velocity = Vector3.Zero;
          this.#atLimit = true;
          this.#ms.static = true;
      }
      else if (this.#ms.top < this.area.top)
      {
        this.#ms.top = this.area.top;
        //SpriteHelper.AlignTopAt(boss, this.area.top, 0);
          this.#ms.Velocity = Vector3.Zero;
          this.#atLimit = true;
          this.#ms.static = true;
      }
      if (this.#ms.z < this.area.back)
      {
          this.#ms.z = this.area.back;
          this.#ms.Velocity = Vector3.Zero;
          this.#ms.static = true;
          this.#atLimit = true;
      }
      else if (this.#ms.z > this.area.front)
      {
          this.#ms.z = this.area.front;
          this.#ms.Velocity = Vector3.Zero;
          this.#ms.static = true;
          this.#atLimit = true;
      }
    }
    stopThenKill(){
      if (this.#ms.right > this.area.right)
      {
          this.#ms.right = this.area.right;
          //this.#ms.x = this.area.right - this.#ms.Width * 0.5;
          this.#ms.vx = 0;
          this.#atLimit = true;
          this.#ms.static = true;
      }
      else if (this.#ms.left < this.area.left)
      {
          this.#ms.left = this.area.left;
          //this.#ms.x = this.area.left + this.#ms.Width * 0.5;
          this.#ms.vx = 0;
          this.#atLimit = true;
          this.#ms.static = true;
      }
      if (this.#ms.bottom > this.area.bottom)
      {
          this.#ms.bottom = this.area.bottom;
          //this.#ms.y = this.area.bottom - this.#ms.Height *0.5;
          this.#ms.vy = 0;
          this.#atLimit = true;
          this.#ms.static = true;
      }
      else if (this.#ms.top < this.area.top)
      {
          this.#ms.top = this.area.top;
          //this.#ms.y = this.area.top + this.#ms.Height *0.5;
          this.#ms.vy = 0;
          this.#atLimit = true;
          this.#ms.static = true;
      }
      if (this.#ms.z < this.area.back)
      {
          this.#ms.z = this.area.back;
          this.#ms.vz = 0;
          this.#ms.static = true;
          this.#atLimit = true;
      }
      else if (this.#ms.z > this.area.front)
      {
          this.#ms.z = this.area.front;
          this.#ms.vz = 0;
          this.#ms.static = true;
          this.#atLimit = true;
      }
      if (this.#ms.Velocity == Vector3.Zero)
          this.#ms.kill();

    }
    killInside(){}//doesn't need to do anything as this is tested elsewhere
    killPastXBounceY(){
        //check x boundary
      if (this.#ms.left > this.area.right ||
          this.#ms.right < this.area.left)
      {
          this.#ms.kill();
          this.#atLimit = true;
      }
      //check Y
      let diff = this.#ms.bottom - this.area.bottom;
      if (diff > 0)
      {
          this.#ms.y -= diff;// * this.#ms.e;
          this.#ms.vy *= -this.#ms.e;
          this.#atLimit = true;
      }
      else
      {
          diff = this.#ms.top - this.area.top;
          if (diff < 0)
          {
              this.#ms.y -= diff;// * this.#ms.e;
              this.#ms.vy *= -this.#ms.e;
              this.#atLimit = true;
          }
      }
    }
    killPastXStopY(){
        //check x boundary
        if (this.#ms.left > this.area.right || this.#ms.right < this.area.left){
            this.#ms.kill();
            this.#atLimit = true;
        }
        //check Y
        if (this.#ms.bottom > this.area.bottom){
            this.#ms.bottom = this.area.bottom;
            //SpriteHelper.AlignBottomAt(boss, this.area.bottom, 0);
            this.#ms.vy = 0;
            this.#atLimit = true;
            this.#ms.static = true;
        } else if (this.#ms.top < this.area.top){
            this.#ms.top = this.area.top;
            //SpriteHelper.AlignTopAt(boss, this.area.top, 0);
            this.#ms.vy = 0;
            this.#atLimit = true;
            this.#ms.static = true;
        }
    }
    killPastYStopX(){
      if (this.#ms.bottom > this.area.bottom || this.#ms.top < this.area.top){
          this.#ms.kill();
          this.#atLimit = true;
      }
      if (this.#ms.right > this.area.right){
          this.#ms.right = this.area.right;
          //SpriteHelper.AlignRightAt(boss, this.area.right, 0);
          this.#ms.vx = 0;
          //this.#ms.Velocity = new Vector3(0.0f, this.#ms.vy, this.#ms.vz);
          this.#atLimit = true;
          this.#ms.static = true;
      } else if (this.#ms.left < this.area.left){
          this.#ms.left = this.area.left;
          //SpriteHelper.AlignLeftAt(boss, this.area.left, 0);
          this.#ms.vx = 0;
          //this.#ms.Velocity = new Vector3(0.0f, this.#ms.vy, this.#ms.vz);
          this.#atLimit = true;
          this.#ms.static = true;
      }
    }
    inform(){
      this.#atLimit = this.#ms.right >= this.area.right || this.#ms.left <= this.area.left || 
                      this.#ms.bottom >= this.area.bottom || this.#ms.top <= this.area.top ||
                      this.#ms.z <= this.area.back || this.#ms.z >= this.area.front;
    }
    informAlign(){
      if (this.#ms.right >= this.area.right){
          this.#ms.right = this.area.right;
          //SpriteHelper.AlignRightAt(boss, this.area.right, 0);
          this.#atLimit = true;
      } else if (this.#ms.left <= this.area.left) {
          this.#ms.left = this.area.left;
          //SpriteHelper.AlignLeftAt(boss, this.area.left, 0);
          this.#atLimit = true;
      }
      if (this.#ms.bottom >= this.area.bottom){
          this.#ms.bottom = this.area.bottom;
          //SpriteHelper.AlignBottomAt(boss, this.area.bottom, 0);
          this.#atLimit = true;
      } else if (this.#ms.top <= this.area.top){
          this.#ms.top = this.area.top;
          //SpriteHelper.AlignTopAt(boss, this.area.top, 0);
          this.#atLimit = true;
      }
      if (this.#ms.z <= this.area.back){
          this.#ms.z = this.area.back;
          this.#atLimit = true;
      }else if (this.#ms.z >= this.area.front){
          this.#ms.z = this.area.front;
          this.#atLimit = true;
      }
    }
    turnOffGravity(){
      if (this.#ms.right >= this.area.right){
          this.#ms.right = this.area.right;
          //SpriteHelper.AlignRightAt(boss, this.area.right, 0);
          this.#atLimit = true;
          this.#ms.Gravity = Vector3.Zero;
          this.#ms.vx = 0;
      }else if (this.#ms.left <= this.area.left){
          this.#ms.left = this.area.left;
          //SpriteHelper.AlignLeftAt(boss, this.area.left, 0);
          this.#atLimit = true;
          this.#ms.Gravity = Vector3.Zero;
          this.#ms.vx = 0;
      }
      if (this.#ms.bottom >= this.area.bottom){
          this.#ms.bottom = this.area.bottom;
          //SpriteHelper.AlignBottomAt(boss, this.area.bottom, 0);
          this.#atLimit = true;
          this.#ms.Gravity = Vector3.Zero;
          this.#ms.vy = 0;
      }else if (this.#ms.top <= this.area.top){
          this.#ms.top = this.area.top;
          //SpriteHelper.AlignTopAt(boss, this.area.top, 0);
          this.#atLimit = true;
          this.#ms.Gravity = Vector3.Zero;
          this.#ms.vy = 0;
      }
      if (this.#ms.z <= this.area.back){
          this.#ms.z = this.area.back;
          this.#atLimit = true;
          this.#ms.Gravity = Vector3.Zero;
          this.#ms.vz = 0;
      }else if (this.#ms.z >= this.area.front){
          this.#ms.z = this.area.front;
          this.#atLimit = true;
          this.#ms.Gravity = Vector3.Zero;
          this.#ms.vz = 0;
      }
    }
    turnOffGravityBottomOnly(){
      if (this.#ms.bottom >= this.area.bottom){
          this.#ms.bottom = this.area.bottom;
          //SpriteHelper.AlignBottomAt(boss, this.area.bottom, 0);
          this.#atLimit = true;
          this.#ms.Gravity = Vector3.Zero;
          this.#ms.vy = 0;
      }
    }
    fireEvent(){
        if (this.#callback != null){
            if (this.#ms.right > this.area.right || this.#ms.left < this.area.left ||
              this.#ms.bottom > this.area.bottom || this.#ms.top < this.area.top ||
              this.#ms.z < this.area.back || this.#ms.z > this.area.front){
                //LimitCallBack();
                this.#atLimit = true;
            }
        }
    }
    bounce(){
        if (this.#ms.vx < 0){ // left
          if (this.#ms.left <= this.area.l) { 
            this.#ms.vx *= -this.#ms.e;}
        } else if (this.#ms.vx > 0) { //  right
          if (this.#ms.right >= this.area.r) { 
            this.#ms.vx *= -this.#ms.e;}
        }
        
        if (this.#ms.vy < 0){ // up
          if (this.#ms.top <= this.area.t) { 
            this.#ms.vy *= -this.#ms.e;}
        } else if (this.#ms.vy > 0) { // down
          if (this.#ms.bottom >= this.area.b) { 
            this.#ms.vy *= -this.#ms.e;}
        }
    }

    wrap(){
        if (this.#ms.vx < 0){ // left
            if (this.#ms.right < this.area.l) { 
            this.#ms.left = this.area.r;}
        } else if (this.#ms.vx > 0) { //  right
            if (this.#ms.left > this.area.r) { 
            this.#ms.right = this.area.l;}
        } else { //no motion
          if (this.#ms.right < this.area.l) { 
            this.#ms.left = this.area.r;}
          else if (this.#ms.left > this.area.r) { 
            this.#ms.right = this.area.l;}
        }
        
        if (this.#ms.vy < 0){ // up
            if (this.#ms.bottom < this.area.t) { 
            this.#ms.top = this.area.b;}
        } else if (this.#ms.vy > 0) { // down
            if (this.#ms.top > this.area.b) { 
            this.#ms.bottom = this.area.t;}
        } else { //no motion
          if (this.#ms.bottom < this.area.t) { 
            this.#ms.top = this.area.b;}
          else if (this.#ms.top > this.area.b) { 
            this.#ms.bottom = this.area.t;}  
        }
    }
  }

/** list of static message types to send or subscribe to 
 * 
 * add your own messages here give it a name and set it to a string with the same name.
 * this will helpwith debugging
*/
class msgT{
    /** data {x:999,y:999}
     * 
     * used for any object wanting to track player positions
    */
    static playerData = "playerData";
    /** data {col:[r,g,b]};*/
    static colour = "colour";
    /** data {score:1234,player:"blinky"} */
    static scored = "scored";

}
/** class allowing the subscription (receiving) and boradcasting of messages
 * 
 * this allows objects to reduce/remove dependencies on each
 * 
 * this can allow the UI system to receive data without the sender having knowledge of the UI
 * and vice versa
 * 
 * messages can be sent from HTML elements using onclick or similar events
 */
class MsgBus{
    static #subs = {};
    /** subscribe to a specfic type of message broadcast, you can have as many different subscribers to the same message. the sender does not need to know who's listening
     * 
     * subscribing from an object instance
     *   MsgBus.sub(msgT.arrows, this.toggleArrows, this);
     * 
     * subscrbing from a sketch in instance mode
     *   MsgBus.sub(msgT.playerData, s.acceptPlayerData, s);
     * 
     * MsgBus.sub(msgT.colour, acceptcolour, s);
     * 
     * subscribe to a message in a standard sketch (no instance required), just supply message type and the function to accept the broadcast
     *   MsgBus.sub(msgT.scored, acceptscore, null);
     */
    static sub(messageType, handler, instance){
        let callbacks = this.#subs[messageType];
        if (callbacks === undefined) {
            callbacks = [];
        }
        callbacks.push({handler,instance})
        this.#subs[messageType] = callbacks;
    }

    /** removes all message subscriptions */
    static dropall(messageType){
        if (messageType !== undefined){
            this.#subs[messageType] = undefined;
        } else {
            this.#subs = {};
        }
    }

    /** drops a specific subscription
     * 
     * this is important if you are destroying an object as the subscription will still receive
     * broadcasts even if you have "removed" the object as the Garbage Collector (GC) will keep objects
     * alive if there are ANY references to them
     * 
     * remove the handler for the arrows message that calls this objects toggleArrows method
     * MsgBus.drop(msgT.arrows, this.toggleArrows, this);
     */
    static drop(messageType, handler, instance){
        let callbacks = this.#subs[messageType];
        if (callbacks != null) {
            let p = 0;
            while (p < callbacks.length && callbacks[p].handler !== handler && callbacks[p].instance !== instance ){
                p++;
            }
            if (p < callbacks.length) {   
                callbacks.splice(p,1);
                this.#subs[messageType] = callbacks;
            } 
        }
    }
    /** broadcasts a message to any (or no) subscribers
     * 
     * package the messages data using an object literal if you require more than a single value(or no value) name value pairs separated by commnas and enclosed in braces
     *  
     * packaging x and y data message type playerData
     *  MsgBus.send(msgT.playerData,{x:pos.x,y:pos.y});
     * 
     * packaging 3 values 
     *  MsgBus.send(msgT.droppedNewNode,{name:this.name,x:this.x,y:this.y});
     * 
     * sending a message with a just a reference to the html object that sent it, suing the onclick event from HTML
     *   onclick="MsgBus.send(msgT.console,this);"
     * 
     * sending a message with no data that indicates something general happened
     *   MsgBus.send(msgT.quit);
     */
    static send(messageType, data){
        let callbacks = this.#subs[messageType];
        if (callbacks !== undefined) {
            for (let p = 0; p < callbacks.length; p++){
                let {handler,instance} = callbacks[p];
                handler.call(instance, data);
            }
        }
    }
}  /******************************
   * 
   * 
   * particle.js
   * 
   * 
   ******************************/ 
  class particle{
    pos;
    vel;
    rot;
    lifetime;
    killtime;
    size;
    col;
    alive;
}

class particleSet{

    particles;
    layer;
    alpha;
    constructor(density)
    {
        this.end = false;
        this.alpha = 1;
        this.particles = new Array(density);
        for (let p = 0; p < density; p++){
            this.particles[p] = new particle();
            this.particles[p].alive = true;
        }
    }
}


class particleManager{
    sets;
    #count;
    constructor(){
      this.sets = [];
    }
  
    add(ps){
      this.sets.push(ps);
    }
  
    update(delta){
        this.#count = 0;
      for (let set = 0; set < this.sets.length; set++){
        this.sets[set].update(delta);
      }
      this.bringoutthedead();
    }
    //removes all particles marked as end
    bringoutthedead(){
      let p = this.sets.length - 1;
      while (p >= 0 && p < this.sets.length){
            if (this.sets[p].end){
                this.sets.splice(p,1);
            } else { 
                this.#count += this.sets[p].particles.length;
                p--;
            }
        }
    }
    draw(delta){
        for (let set = 0; set < this.sets.length; set++){
            let pset = this.sets[set];
            pset.layer.drawingContext.globalAlpha = pset.alpha;
            for (let part = 0; part < pset.particles.length; part++){
                let p = pset.particles[part];
                if (p.alive){
                    pset.layer.push();

                    pset.layer.translate(p.pos.x, p.pos.y);
                    if (p.rot != 0){ pset.layer.rotate(p.rot);}

                    pset.layer.fill(p.col);
                    pset.layer.rect(0,0, p.size.x, p.size.y);
                    pset.layer.pop();
                }
            }
        }
    }
    get debugdata(){return "particles:" + this.#count;}
}  /******************************
   * 
   * 
   * rectangle.js
   * 
   * 
   ******************************/ 
  /** support for box areas (rectangle with depth) */
  class Box{
    #corner;
    #dimension;

    /** creates a box shape which defines a 3d cube area (3d rectangle)
     * 
     * @example 
     * //create a box left at 50, top at 100 and front at 200, width, height of 200 and depth 400
     * //right is at 250, bottom is at 300 and back is at -200
     * new box(50,100,200, 200, 200, 400);
     * 
     * //create a box using 2 vector3 values one for corner and one for dimension
     * new box(new vector3(50,100,200), new vector3(200,200,400));
     *
     */
    constructor(left, top, front, width, height, depth){
      if (front == undefined){
        this.#corner = left.clone;
        this.#dimension = top.clone;
      } else {
        this.#corner = new vector3(left, top, front);
        this.#dimension = new vector3(width, height, depth);
      }
    }
    /** gets the x centre of the box */
    get centrex(){return this.#corner.x + this.#dimension.x/2;}
    /** gets the y centre of the box */
    get centrey(){return this.#corner.y + this.#dimension.y/2;}
    /** gets the z centre of the box */
    get centrez(){return this.#corner.z + this.#dimension.z/2;}
    /** gets the centre of the box as a vector3*/
    get centre(){return new vector3(this.#corner.x + this.#dimension.x/2,this.#corner.y + this.#dimension.y/2,this.#corner.z + this.#dimension.z/2);}
    /** gets the left hand side of the box */
    get x() { return this.#corner.x; }
    /** gets the top hand side of the box */
    get y() { return this.#corner.y; }
    /** gets the front hand side of the box */
    get z() { return this.#corner.z; }
    /** gets the left hand side of the box */
    get l() { return this.#corner.x; }
    /** gets the right hand side of the box */
    get r() { return this.#corner.x + this.#dimension.x; }
    /** gets the top of the box */
    get t() { return this.#corner.y; }
    /** gets the bottom of the box */
    get b() { return this.#corner.y + this.#dimension.y; }
    /** width of box */
    get w() { return this.#dimension.x; }
    /** height of box */
    get h() { return this.#dimension.y; }    
    /** gets the left hand side of the box */
    get left() { return this.#corner.x; }
    /** gets the right hand side of the box */
    get right() { return this.#corner.x + this.#dimension.x; }
    /** gets the top of the box */
    get top() { return this.#corner.y; }
    /** gets the bottom of the box */
    get bottom() { return this.#corner.y + this.#dimension.y; }
    /** gets the front of the box */
    get front() { return this.#corner.z; }
    /** gets the back of the box */
    get back() { return this.#corner.z - this.#dimension.z; }
    /** width of box */
    get width() { return this.#dimension.x; }
    /** height of box */
    get height() { return this.#dimension.y; }
    /** depth of box */
    get depth() { return this.#dimension.z; } 

    /** creates a unit box with corner 0,0,0 and dimensions 1,1,1 */
    static get unit(){
      return new box(0,0,0,1,1,1);
    }

  }
  /** support for rectangular areas and actions upon them */
  class Rectangle{
    #x;
    #y;
    #w;
    #h;
    
    constructor(x, y, w, h){
      this.#x = x;
      this.#y = y;
      this.#w = w;
      this.#h = h;
    }
    get clone(){return new Rectangle(this.#x,this.#y,this.#w,this.#h);}
    
    cloneto(here){
      here.x = this.#x;
      here.y = this.#y;
      here.w = this.#w;
      here.h = this.#h;
    }
    portion(){}
  
    /** gets the horizontal centre of the rectangle */
    get centrex(){return this.#x + this.#w/2;}
    /** gets the vertical centre of the rectangle */
    get centrex(){return this.#y + this.#h/2;}
    /** gets the centre as a vector3 object - can be used in place of a vector2 */
    get centre(){return new vector3(this.#x + this.#w/2,this.#y + this.#h/2,0);}

    get x(){return this.#x;}
    get y(){return this.#y;}
    get w(){return this.#w;}
    get h(){return this.#h;}
    //area names
    get l(){return this.#x;}
    get t(){return this.#y;}
    get r(){return this.#x + this.#w;}
    get b(){return this.#y + this.#h;}
    //area names
    get left(){return this.#x;}
    get top(){return this.#y;}
    get right(){return this.#x + this.#w;}
    get bottom(){return this.#y + this.#h;}    
  
    in(x, y){
      return  x >= this.#x &&
              x <= this.#x + this.#w &&
              y >= this.#y &&
              y <= this.#y + this.#h;
    }
  
    //not implemented yet
    randomoutside(margin){
      if (margin === undefined) {margin = 0;}
      return {x:this.#x + margin + Math.random() * (this.#w - margin*2),y:this.#y +margin + Math.random() * (this.#h - margin*2)};
    }
  
    randominside(margin){
      if (margin === undefined) {margin = 0;}
      return {x:this.#x + margin + Math.random() * (this.#w - margin*2),y:this.#y +margin + Math.random() * (this.#h - margin*2)};
    }
  }
/******************************
 * 
 * 
 * sprite enums
 * 
 * 
 ******************************/ 
/** shape definitions for various sub systems to acknowledge */
class Shape {
    /** treat as circular during collisions */
    static circle = "circle";
    /** treat as rectangular during collisions */
    static rectangle = "rectanlge";
}
class UpdateMode{
    static manual = "manual";
    static auto = "auto";
    static autotrack = "autotrack";
    static manualtrack = "manualtrack";
}
class Align{
    /** X position is centred, Y position is top,*/
    static top = "top";
    /** X position is left, Y position is top, */
    static topLeft = "topLeft";
    /** X position is left, Y position is centred, */
    static left = "left";
    /** X position is left, Y position is bottom, */
    static bottomLeft = "bottomLeft";
    /** X position is centred, Y position is bottom, */
    static bottom = "bottom";
    /** X position is right, Y position is bottom, */
    static bottomRight = "bottomRight";
    /** X position is right, Y position is centred, */
    static right = "right";
    /** X position is right, Y position is top, */
    static topRight = "topRight";
    /** X position is centred, Y position is centred, */
    static centre = "centre";
}

/******************************
 * 
 * 
 * sprite.js
 * 
 * 
 ******************************/ 
/** for drawing and manipulating moving graphic objects
 * 
 * create your own sprites by extending the Sprite class
 * 
 * it's important to clone object values as you'll generally want a new object (with the values) rather than a reference to the original vector3 object
 * @example
 *class Bullet extends Sprite{
 *    myboss;
 *    constructor(start, velocity, owner){
 *      super();
 *      this.myboss = owner;
 *      Engine.spM.add(this);
 *      this.frame.define(txtiles, new Rectangle(162,8,4,4));
 *      this.position = start.clone; //make a new vector3 from these values
 *      this.velocity = velocity.clone; //make a new vector3 from these values
 *      this.timer = new Timer(this);
 *      this.timer.killafter(2.5);
 *      this.limit = new Limit(Limit.wrap, Engine.mainview);
 *
 *      this.callbackCollide = this.hitsomething;
 *      this.collisionPrimary = true;
 *      this.collisionList = [Invader];
 *    }
 *
 *     if (hit instanceof Invader){
 *          hit.kill();     // kill sprite we hit
 *          this.kill();    // kill this bullet
 *          return true;    //stop processing anymore collisions for this bullet
 *     } else {
 *          return false;   //continue collision processing for this sprite
 *     }
 *  }
 *}

*/
class Sprite{
    #visW;
    #visH;
    #visWdiv2;
    #visHdiv2;
    /* pre-calcs for visual size */
    #setvisibleSize(){
        this.#visW = this.frame.currentport.w * this.#scale.x;
        this.#visH = this.frame.currentport.h * this.#scale.y;
        //half sizes
        this.#visWdiv2 = this.#visW * 0.5;
        this.#visHdiv2 = this.#visH * 0.5;
    }
    /** removes references before a sprite is destroyed
     * timer, history, frame, limit etc...
     * if you added some extra resources yourself then create a cleanup method for your sprite
     * and call super.cleanup() before you null your own references
     * @example
     * cleanup(){
     *      super.cleanup();
     *      this.myresource = null;
     * }
     */
    cleanup(){
        this.#timer = null;
        this.history = null;
        this.frame = null;
        this.limit = null;
        this.#gravitywell = null;
        this.track = null;
        this.callbackCollide = null;
        this.callbackFuneral = null;
        this.callbackHide = null;
        this.callbackShow = null;
    }
    /** holds the animation system for the sprite 
     * 
     * you need to define frames and animations through the frame object
     * @example
     * 
     this.frame.define(txsprite, new Rectangle(138,213,32,32));//blinky 0
     this.frame.define(txsprite, new Rectangle(172,213,32,32));//blinky 1
    */
    frame;
    #position;
    #angle;
    #scale;
    #moving = true;
    /** true if the sprite is moving for collision response purposes default is true*/
    get moving(){return this.#moving;}
    /** sets the moving property, if false during collisions no momentum will be transferred during collision response
     * 
     * if sprites are not repsonding to collisions properly ensure this is set to true
     */
    set moving(value){ this.#moving = value;}
    /** true if the sprite is not moving for collision response purposes default is false*/
    get static(){return !this.#moving;}
    /** sets the moving property, if true during collisions no momentum will be transferred during collision response
     * 
     * if sprites are not repsonding to collisions properly ensure this is set to false
     */
    set static(value){ this.#moving = !value;}
    #radius;
    #bradius;
    //** specifies the transparency of the sprite 0-1 default is 1 opaque*/
    #alpha = 1;
    /** gets the current alpha value of the sprite between 1 - opaque and 0 transparent.
     * default 1
     * @example this.alpha = 0.4; // 40 % opaque
    */
    get alpha(){return this.#alpha;}//255 * this.#alpha;}
    /** sets the current alpha value of the sprite between 1 - opaque and 0 transparent.
     * default 1
     * @example this.alpha = 0.4; // 40 % opaque
    */
    set alpha(value){
        if (value >= 0 && value <= 1){
            this.#alpha = value;
        } /*else if (value >= 0 && value <= 255){
            this.#alpha = value/255;
        }*/
    }
    /** specifies how sprite is drawn compared to its x and y positions, default is
     * @example this.align = Align.centre;
     */
    align = Align.centre;
    /** holds the last position the sprite was at */
    lastposition = vector3.zero;
    /** the update period (in seconds) for the sprite to force the update to only occur now and then, just like space invaders movement
     * 
     * currently not implemented
    */
    updatePeriod = 0;
    elapsedTime = 0;
    #clip = false;
    #cliplimit = false;
    #cliparea = null;
    /** how sprite is updated - defaults to auto where sprite updates every frame using velocity,gravity and gravity wells to change position*/
    updateMode = UpdateMode.auto;
    #deltaposition;
    /** gets the distance (and direction moved by the sprite since last update) as a vector3*/
    get deltaposition(){return this.#deltaposition;}    // motion
    /** gets the distance (and opposite direction moved by the sprite since last update) as a vector3*/
    get deltapositionNegative(){return new vector3(-this.#deltaposition.x,-this.#deltaposition.y,-this.#deltaposition.z);}    
    // motion
    /** rotates the sprite so it is pointing in the direction of it's motion
     * This is independent of the velocity so will work for manual and track based motion
     * @example
     * this.faceMyDirection(); // point in direction moving (forwards)
     * this.faceMyDirection(180); // point opposite to directio (backwards)
    */
    faceMyMovement(additionalangle){
        this.faceDirection(this.#deltaposition, additionalangle);
        return;
        if (additionalangle == undefined){
            additionalangle = 0;
        } else {
            additionalangle *= Math.PI / 180;
        }
        this.#angle = vector3.anglefromdirection(this.#deltaposition,additionalangle);
    }
    faceMyVelocity(additionalangle){
        this.faceDirection(this.velocity, additionalangle);
    }    
    faceDirection(direction, additionalAngle){
        if (additionalAngle == undefined){
            additionalAngle = 0;
        } else {
            additionalAngle *= Math.PI / 180;
        }
        this.#angle = vector3.anglefromdirection(direction,additionalAngle);        
    }
    /** takes rotation angle of sprite and sets the velocity to move in this direction
     * 
     * 0 degrees is up
     */
    velocityInCurrentDirection(speed, additionalAngle){
        if (additionalAngle == undefined){
            additionalAngle = 0;
        } else {
            additionalAngle *= Math.PI / 180;
        }
        this.vx = Math.cos(additionalAngle + this.#angle - Math.PIby2) * speed;
        this.vy =  Math.sin(additionalAngle + this.#angle - Math.PIby2) * speed;
        this.velocity.z = 0;
    }
    /** takes the sprites movement delta and sets a velocity to continue in this direction 
     * Could be used to take over motion of a player controlled character or if you detatch a sprite
     * from a track
     * 
     * if speed is omitted then the direction is taken as a fraction of the overall delta and a velocity is computed
     * to try and carry on the current movement speed
    */
    velocityFromMovement(speed){
        if (speed == undefined){
            speed = delta
        }
    }
    /** Determines if  rotating clockwise or anticlockwise is closest for a sprite to turn towards a  position
    * Useful for create homing and tracking effects, returns -1 if turned anti-clocwise, 1 if clockwise or 0 if didn't turn
    * @param to position aiming for
    * @param minimumAngle the step size to turn by, if rotation required is less than this then 0 will be returned
    * 
    * returns-1 if turned anti-clocwise, 1 if clockwise or 0 if didn't turn */
    angularDirectionTo(to, minimumAngle)
    {
            let dv = vector3.directionfromangle(this.#angle, 0);

            //calc direction to target
            let d = vector3.sub(to, this.#position);
            d.normalise();
            let dot = vector3.dot(dv, d);
            let crossz = vector3.crosszonly(dv, d);
    
            if (dot < 0 || Math.abs(dot) < Math.cos(minimumAngle* Math.PI / 180))
                return (crossz < 0) ? -1 : 1;
            else
                return 0;                
    }

    #velocity;
    #vr;
    #friction;
    //the energy reduction co-efficient
    #e = 1;
    /** a value that is multiplied by the collision co-efficient each time it is sampled
     * 
     * this happens whenever the value of e is samples/used in a collision
     * 
     * this value can be used to trigger other actions like removing velocity if the energy value 
     * falls below as certain number
     * @example
     *  update(delta){
     *      super.update(delta);
     *      //stop vertical motion once sprite has bounced enough
     *      if (this.vy != 0 && this.energylevel < 0.01){
     *          this.gravity.y = 0;      
     *          this.vy = 0; 
     *          this.energylevel = 1;//reset energy
     *      }
     *  } 
     */
    energylevel = 1;
    /** collision co-efficient for energy loss
     * 
        if 1 maintains 100% energy after collision,

        less than 1 reduces energy, 0.75f would be 75%, 

        more than 1 increases energy, 1.25f would be 125% energy */
    get e(){
        this.energylevel *= this.#e;
        return this.#e;
    }
    /** collision co-efficient for energy loss
     * 
        if 1 maintains 100% energy after collision,

        less than 1 reduces energy, 0.75f would be 75%, 

        more than 1 increases energy, 1.25f would be 125% energy */
    set e(value){this.#e = value;this.energylevel=1;}
    /** gravity vector in 3d, to apply to the sprite, set to null to turn gravity off (default) */
    gravity = null;
    /** gravity well objects, for this sprite there can be more than one - to be implemented */
    #gravitywell = null;
    /** gets the current gravity wells for this sprite - if non then null otherwise will be a list of wells */
    get gravitywell(){return this.#gravitywell;}
    /** adds a gravity well to this sprite 
     * @example
     * this.gravitywell = new GravityWell(new vector3(width/2,height/2,0), 100); //set 100 GigaTon well at centre of screen
    */
    set gravitywell(value){
        if (this.#gravitywell == null){
            this.#gravitywell = [];
        }
        this.#gravitywell.push(value);
    }
    /** if true a quick calculation of gravitional force is computed rather than GMMr2
     * 
     * (default true) */
    gravityrough = true;
    /** holds the scale percentage increase per second to apply to the sprite vector2(0,0) is the default, no scaling
     * @example
     * this.vscale = vector2(1,1); //would be 100% per second
     */
    vscale = vector2.zero;;

    //properties
    /** holds the mass of the sprite in Kg used for gravity calculations (default will be set to number of non alpha pixels)
    * 
    * defaults to 100 (if you don't set it)
    */
    mass = 100;
    /** specifies if position is relative to the canvas view or the world co-ordinates which may be large. 
    *
    * default is world (true), 
    *
    * set to false to draw at same position in viewport despite any scrolling or offset of the world*/
    world = true;//x y coords tied to world of just viewport region
    /** holds a reference to the track manager for the sprite, this has to be explicitly set in your sprites constructor
     * @example
     * this.track = new TrackM(this);
    */
    track;
    #lasttrackposition;
    /** gets the last position occupied by a tracking sprite (not implemented yet)*/
    get lasttrackposition(){return this.#lasttrackposition;}
    //** sets the last trackposition of a sprite */
    //set lasttrackposition(value){return this.#lasttrackposition = value;}

    /** do we want to work with z co-ordinates default if true (not implemented fully yet)*/
    workin3d = true;
    /** which drawing layer to render the sprite on
    *
    * layers are rendered from lowest to highest (0 - 3)
    * @example
    * this.layer = Engine.layer(0); //to set on layer 0 (back layer)
    */
    layer;
    /** determines if the sprite reacts to a specified rectangular boundary, see Limit static member functions for limit modes
    *
    *must be set in the constructor
    * @example
    *this.limit = new Limit(Limit.wrap, Engine.mainview);
    */
    limit = null;

    #dead;
    #visible;
    #timer;
    /** holdsd refence to history object for this sprite, defaults to null. 
     * You must create this in your constructor if you wish to use history effects
     * @example
     * this.history = new History(this);
     */
    history = null;

    //all callbacks
    /**method called when the sprite is hidden with 
     *  or settting visible to false, or from flashing 
     * @example this.hide();*/
    callbackHide = null;
    /**method called when the sprite is shown with show() or setting visible to true*/
    callbackShow = null;
    /** method called if this sprite is involved in a collision but only if this is a collisionPrimary 
     * 
     * @example 
     * this.callbackCollide = this.hitsomething;
     * 
     * hitsomething(hitthis){
     *      if (hit instanceof Invader){
     *          hit.kill(); // kill sprite we hit
     *          this.kill(); //kill this bullet
     *          return true; //stop processing anymore collisions for this bullet
     *      } else {
     *          return false; //continue collision processing for this sprite
     *      }
     * }
    */
    callbackCollide = null;
    /** method called when a sprite is destroyed using kill() */
    callbackFuneral = null;
    //ALL 4 CALLBACKS NEED TO ADOPT THE TIMER SYSTEM
    //collision stuff
    /** must be set to true for sprite to be involved in collisions */
    collidable;
    /** if true then this sprites callbackCollide is called during collisions */
    collisionPrimary;
    /** a list of object types to check in the sprite list for collision, only those in the list will be checked
     * 
     * @example this.collisionList = [Ghost, Fruit];
     * 
     */
    collisionList;

    /** create a new sprite
     * 
     * make sure in your constructor after calling super(); that you add the sprite to the Engine for processing to occur
     * 
     * @example Engine.spM.add(this);
     */
    constructor(){
        this.frame = new Animator(this);
        this.#dead = false;
        this.#visible = false;
        this.#position = vector3.zero;
        this.#timer = null;
        this.callbackFuneral = null;
        this.#angle = 0;
        this.#scale = vector2.one;
        this.layer = null;
        this.align = Align.centre;
        //motion
        this.#velocity = vector3.zero;
        this.#vr = 0;
        this.#friction = 0;
        // framsets
    }
    /** returns true if the sprite circlular area is ovelapping the given sprites circlular area*/
    intersectBC(other){
        let rdist2 = vector2.distanceSQ(this.position, other.position);
        let radiiSum2 = (this.radius + other.radius)**2;
        return rdist2 < radiiSum2;
    }
    /** use this in a sprite callBackFuneral to stop a dead sprite being removed*/
    resurrect(){this.#dead = false;}
    /** returns true if sprite is dead, pending removal 
     * 
     * removal can be halted by using resurrect in a funeral callback, if you have defined one
     * @example  this.resurrect();
    */
    get dead() {return this.#dead;}
    /** returns true if the sprite is still actively being processed and displayed*/
    get alive() { return !this.#dead;}

    /** gets the rotation angle of the sprite in degrees

    */
    get angle(){return this.#angle/Math.PI * 180;}
    /** sets the rotation angle of the sprite in degrees
     * @example this.angle = 45;
    */
    set angle(value){return this.#angle = value * Math.PI / 180;}

    /** gets the singular scale of the sprite applied to both width and height*/
    get scale1d(){return (this.#scale.x + this.#scale.y)/2;}
    /** applies a single scale value to the width and height of the sprite
     * @example this.scale = 2;
    */
    set scale1d(value){
        this.#scale.x = this.#scale.y = value;
        this.#setvisibleSize();
    }    
    /** gets the x and y scale as a vector2 value */
    get scale(){return this.#scale;}
    /** sets the x and y scale as a vector2 value */
    set scale(value){
        this.#scale = value;
        this.#setvisibleSize();
    }

    /** gets the scale for the width of the sprite*/
    get sx() {return this.#scale.x;}
    /** sets the scale for the width of the sprite
     * @example this.sx = 4;
    */
    set sx(value) {
        this.#scale.x = value;
        this.#setvisibleSize();
    }

    /** gets the scale for the height of the sprite*/
    get sy() {return this.#scale.y;}
    /** sets the scale for the height of the sprite
     * @example this.sy = 0.5;
    */
    set sy(value) {  
        this.#scale.y = value;
        this.#setvisibleSize();
    }

    /** get the timer for basic sprite actions
    * 
    * by default this is null, no timer
    */
    get timer(){return this.#timer;}
    /** holds the basic sprite timer actions 
     * 
     * create the timer with @example  this.timer = new Timer(this);
    */
    set timer(value){this.#timer = value;}

    /** returns true if sprite is set to be displayed
    *
    *use show() hide() to manipulate this
    */
    get visible() {return this.#visible && this.frame.currenttex != null;}

    /** sets the visible state of the sprite true, means show, false means hide
    *
    * if hide and show callbacks are set then these will be called appropriately
    * @example 
    * //toggle visibility
    * this.visible = !this.visible;
    */
    set visible(value) {
        if (value) this.show(); else this.hide();
    }

    /** makes this sprite visible/renders if on screen calling the show callback if set
     * @example this.show();
     */
    show(){
        if (!this.#visible && this.callbackShow != null){
            this.callbackShow();
        }
        this.#visible = true;
    }
    /** makes this sprite invisible/won't be rendered calling the hide callback if set
     * @example this.hide();
    */
    hide(){
        if (this.#visible && this.callbackHide != null){
            this.callbackHide();
        }
        this.#visible = false;
    }
    /** specifies the rough shape of the sprite (not currently used but will eventually affect collision detection) */
    shape = Shape.circle;
 
    /** gets the sprites position (it's centre) as a vector3(x,y,z) */
    get position() {return this.#position;}
    /** sets the sprites position (it's centre) as a vector3(x,y,z) */
    set position(value) {this.#position = value;}

    /** sets the sprites x position (currently the centre of the sprite) */
    get x() {return this.#position.x;}
    /** sets the sprites x position (currently the centre of the sprite) */
    set x(value) {this.#position.x = value;}

    /** gets the sprites y position (currently the centre of the sprite) */
    get y() {return this.#position.y;}
    /** sets the sprites y position (currently the centre of the sprite) */
    set y(value) {this.#position.y = value;}

    /** gets the sprites z position (not currently used but may influence draw order) could be used for depth based scaling
     * 
     * smaller is further away
     */
    get z() {return this.#position.z;}
    /** sets the sprites z position (not currently used but may influence draw order) could be used for depth based scaling 
     * 
     * smaller is further away
    */
    set z(value) {this.#position.z = value;}

    //change to visible width per-calcs
    /** gets the width of the sprite (as affected by the current x scale) */
    get width() {return this.#visW;}//this.frame.current.port.w * this.#scale.x;}// this.#portion.w* this.#scale;}

    /** gets the height of the sprite (as affected by the current y scale) */
    get height() {return this.#visH;}//this.frame.current.port.h * this.#scale.y;} //this.#portion.h* this.#scale;}
    /** gets the centre of the sprite as a vector3 object */
    get centre(){return new vector3(this.centrex, this.centrey,this.#position.z);}
    /** returns the x centre of the sprite (same a y currently) */
    get centrex() {
        switch (this.align){
            case Align.topLeft:case Align.left:case Align.bottomLeft:return this.#position.x + this.#visWdiv2;// this.width/2;
            case Align.top:case Align.centre:case Align.bottom:return this.#position.x;
            case Align.topRight:case Align.right:case Align.bottomRight:return this.#position.x - this.#visWdiv2;//this.width/2;
        }
    }
    set centrex(value){
        switch (this.align){
            case Align.topLeft:case Align.left:case Align.bottomLeft:return this.#position.x = value - this.#visWdiv2;//this.width/2;
            case Align.top:case Align.centre:case Align.bottom:return this.#position.x = value;;
            case Align.topRight:case Align.right:case Align.bottomRight:return this.#position.x = value + this.#visWdiv2;//this.width/2;
        }
    }
    /** returns the y centre of the sprite (same a y currently) */
    get centrey() {
        switch (this.align){
            case Align.topLeft:case Align.top:case Align.topRight:return this.#position.y + this.#visHdiv2;// this.height/2;
            case Align.left:case Align.centre:case Align.right:return this.#position.y;
            case Align.bottomLeft:case Align.bottom:case Align.bottomRight:return this.#position.y - this.#visHdiv2;//this.height/2;
        }
    }
    set centrey(value){
        switch (this.align){
            case Align.topLeft:case Align.top:case Align.topRight:return this.#position.y = value - this.#visHdiv2;//this.height/2;
            case Align.left:case Align.centre:case Align.right:return this.#position.y = value;
            case Align.bottomLeft:case Align.bottom:case Align.bottomRight:return this.#position.y = value + this.#visHdiv2;//this.height/2;
        }
    }
    /** gets the x offset to its centre (half the width) */
    get centreoffx() {return - this.#visWdiv2/*this.width/2*/;}
    /** gets the y offset to its centre (half the height) */
    get centreoffy() {return - this.#visHdiv2/*this.height/2*/;}

    // THESE GETTERS and SETTERS NEED TO TAKE ALIGNMENT INTO ACCOUNT ??
    /** gets the x value of the left of the sprite (the x and y values represent the centre of a sprite) */
    get left() {
        return this.centrex - this.#visWdiv2;
        //return this.x - this.width/2;
    }
    /** sets sprites bottom to be this value y value is adjusted accordingly (the x and y values represent the centre of a sprite) 
     * @example this.left = 450;
    */
    set left(value) {
        switch (this.align){
            case Align.topLeft:case Align.left:case Align.bottomLeft: this.#position.x = value;return;
            case Align.top:case Align.centre:case Align.bottom: this.#position.x = value + this.#visWdiv2;return;
            case Align.topRight:case Align.right:case Align.bottomRight: this.#position.x = value + this.#visW;return;
        }
    }

    /** gets the x value of the right of the sprite (the x and y values represent the centre of a sprite) */
    get right() {
        return this.centrex + this.#visWdiv2;
    }
    /** sets sprites bottom to be this value y value is adjusted accordingly (the x and y values represent the centre of a sprite) 
     * @example this.right = 200;
    */
    set right(value){
        switch (this.align){
            case Align.topLeft:case Align.left:case Align.bottomLeft: this.#position.x = value - this.#visW;return;
            case Align.top:case Align.centre:case Align.bottom: this.#position.x = value - this.#visWdiv2;return;
            case Align.topRight:case Align.right:case Align.bottomRight: this.#position.x = value;return;
        }
    }

    /** gets the y value of the top of the sprite (the x and y values represent the centre of a sprite) */
    get top() {
        return this.centrey - this.#visHdiv2;
    }
    /** sets sprites bottom to be this value y value is adjusted accordingly (the x and y values represent the centre of a sprite)
     * @example this.top = 0; //sprite aligned with top at top of screen
     */
    set top(value) {
        switch (this.align){
            case Align.topLeft:case Align.top:case Align.topRight:this.#position.y = value;break;
            case Align.left:case Align.centre:case Align.right:this.#position.y = value + this.#visHdiv2;break;
            case Align.bottomLeft:case Align.bottom:case Align.bottomRight:this.#position.y = value + this.#visH;break;
        }
    }

    /** gets the y value of the bottom of the sprite (the x and y values represent the centre of a sprite) */
    get bottom() {
        return this.centrey + this.#visHdiv2;
    }
    /** sets sprites bottom to be this value y value is adjusted accordingly (the x and y values represent the centre of a sprite) 
     * @example this.bottom = height; // set sprites bottom to the bottom edge of screen
    */
    set bottom(value) {
        switch (this.align){
            case Align.topLeft:case Align.top:case Align.topRight:this.#position.y = value - this.#visH;break;
            case Align.left:case Align.centre:case Align.right:this.#position.y = value - this.#visHdiv2;break;
            case Align.bottomLeft:case Align.bottom:case Align.bottomRight:this.#position.y = value;break;
        }
    }//this.height/2;}

    /** a rough circular radius of the sprite */
    get radius() { return this.#visWdiv2;}//this.width/2};
    /** a rough circular radius of the sprite */
    get bradius() { return this.#visWdiv2;}//this.width/2};

    //motion properties
    /** gets the fake friction value of sprite 
     * 
     * 0 is no friction
     * 
     * +ve values will reduce the sprites velocity (a value of 1 will take roughly 1 second to bring velocity down to zero )
     * 
     * -ve values will increase the sprites velocity
     */
    get friction(){return this.#friction;}
    /** applies a fake friction value to a sprite 
     * 
     * 0 is no friction
     * 
     * +ve values will reduce the sprites velocity (a value of 1 will take roughly 1 second to bring velocity down to zero )
     * 
     * -ve values will increase the sprites velocity
     * @example this.friction = 0.5;
     */
    set friction(value){this.#friction = value;}

    /** gets the velocity of the sprite as a vector3(x,y,z) */
    get velocity(){return this.#velocity;}
    /** sets the velocity of the sprite as a vector3(x,y,z) 
     * @example this.velocity = new vector3(100,0,0); // 100 pixels per second in x direction
     */
    set velocity(value){this.#velocity = value;}
    /** sets the x velocity of the sprite -ve is left +ve right*/
    get vx() { return this.#velocity.x;}
    /** sets the x velocity of the sprite -ve is left +ve right
     * @example this.vx = 100; //100 pixels per second right
    */ 
    set vx(value) { this.#velocity.x = value;}
    /** gets the y velocity of the sprite -ve is up +ve down*/
    get vy() { return this.#velocity.y;}
    /** sets the y velocity of the sprite -ve is up +ve down
     * @example this.vy = -100; // 100 pixels per second upwards
    */
    set vy(value) { this.#velocity.y = value;}
    /** gets the z velocity of the sprite -ve is into the screen +ve is forward */
    get vz() { return this.#velocity.y;}
    /** sets the z velocity of the sprite -ve is into the screen +ve is forward 
     * @example this.vz = -100; //100 pixels per second into the screen
    */
    set vz(value) { this.#velocity.y = value;}

    /** gets the rotation velocity in degrees per second */
    get vr() { return this.#vr;}
    /** specifies a rotation velocity for the sprite in degrees per second
     * @example this.vr = 180; // spin a full revolution in 2 seconds
    */
    set vr(value) { this.#vr = value;}
    /** performs all the update mechanisms for a sprite */
    update(delta){
        this.elapsedTime += delta;
        if (this.elapsedTime >= this.updatePeriod){
            //reset elapsed time
            this.elapsedTime = (this.updatePeriod == 0) ? 0 : this.elapsedTime - this.updatePeriod - delta;
            if (this.timer != null && this.timer.active){
                this.timer.update(delta);
            }
            //snap position
            this.#position.cloneto(this.lastposition);

            if (this.frame.animating){
                if (this.frame.update(delta)){
                    this.#setvisibleSize();
                }
            }

            switch (this.updateMode){
                case UpdateMode.auto:
                    //calculate distance travelled if update rate not being used
                    if (this.updatePeriod == 0){
                        this.x += this.#velocity.x * delta;
                        this.y += this.#velocity.y * delta;
                        if (this.workin3d) this.z += this.#velocity.z * delta;
                    } else { //use velocity as position update
                        this.x += this.#velocity.x * delta;
                        this.y += this.#velocity.y * delta;
                        if (this.workin3d) this.z += this.#velocity.z * delta;
                    }
                    //attempt to apply gravity
                    if (this.gravity != null){
                        this.#velocity.x += this.gravity.x * delta;
                        this.#velocity.y += this.gravity.y * delta;
                        if (this.workin3d) this.#velocity.z += this.gravity.z * delta;
                    }
                    //apply gravity wells (if exist)
                    if (this.#gravitywell != null)
                    {
                        let gvdist;
                        let gforce = vector3.zero;
                        for (let j = 0; j < this.#gravitywell.length; j++)
                        {
                            let gv = this.#gravitywell[j];

                            //get direction to gravity well
                            let v3 = vector3.sub(gv.location, this.position);
                            if (this.workin3d) v3.z = 0;

                            v3.normalise();
                            if (this.gravityrough){
                                gvdist = vector3.distance(gv.location, this.position);
                                gvdist = gvdist * 0.01 + 1;
                            } else {
                                gvdist = vector3.distanceSQ(gv.location, this.position);
                            }
                            //quick pre-calc (onyl one division instead of 3)
                            gvdist = gv.precalc * this.mass / gvdist;
                            gforce.x += v3.x * gvdist;
                            gforce.y += v3.y * gvdist;
                            gforce.z += v3.z * gvdist;
                        }
                        //apply resultant force
                        this.#velocity.x += gforce.x * delta;
                        this.#velocity.y += gforce.y * delta;
                        this.#velocity.z += gforce.z * delta;
                    }
                    //apply friction
                    if (this.#friction != 0){
                        this.#velocity.x -= this.#velocity.x * this.#friction * delta;
                        this.#velocity.y -= this.#velocity.y * this.#friction * delta;
                        this.#velocity.z -= this.#velocity.z * this.#friction * delta;
                    }
                    break;
                case UpdateMode.autotrack:
                    if (this.track != null && this.track.update()){
                        this.#position.cloneto(this.#lasttrackposition);
                        //only attempt to do this if detach hasn't altered update mode
                        //which it could have done - just check to be sure
                        if (this.updateMode == UpdateMode.autotrack){
                            this.#position.cloneto(this.#lasttrackposition);                        
                        }
                    }
                    break;
                case UpdateMode.manualtrack:
                    if (this.#position.equal(this.track.positioncurrent))
                    {
                        this.#position.cloneto(this.#lasttrackposition);
                        this.track.positioncurrent.cloneto(this.#position);
                    }
                    break;
            }

            this.angle += this.#vr * delta;

            if (!this.vscale.iszero){
                this.#scale.x += this.#scale.x * this.vscale.x * delta;
                this.#scale.y += this.#scale.y * this.vscale.y * delta;
                //update presets - need to build these presets
                //s.SetVisibleSize();
                //s.Frame.SetCollisionSize();
                //s.Frame.SetOffsetPosition();
            }

            if (this.limit != null){
                this.limit.update(delta);
            }
            
            if (this.history != null){
                this.history.update(delta);
            } 
            
            //add sprite to bins if part of collisions
            //need to build this also
            //if (this.collidable) collisionBin.Add(s);
            this.#deltaposition = vector3.sub(this.#position, this.lastposition);
        }
    }

    /** kills the sprite, calling a funeral callback if set 
     * @example this.kill();
    */
    kill(){
        this.#dead = true;
        if (this.callbackFuneral != null){this.callbackFuneral();}
    }

    /** holds a colour to show the limit box of this sprite
     * If null (default) box not shown
     * if a colour is stored then it will be drawn (use alpha values so you can see the sprite)
     * @example
     * //show transparent blue clip box
     * this.showclip = [0,0,255,100];
     */
    showclip = null;
    /** use the limit area as the clip region for the sprite
    * if the limit is not specified then clipping remains off 
    * @example this.cliplimit();`
    */
    cliplimit(){
        this.#cliplimit = true;
        if (this.limit != null){this.#clip = true;}
    }
    /** stops clipping (the default)*/
    clipoff(){this.#clip = false;}
    /** turns clipping on if we have a limit defined or a cliparea defined
    //if not then you should set this*/
    clipon(){if ((this.#cliplimit && this.limit != null) || this.#cliparea != null) {this.#clip = true;}}
    /** gets the current clip area*/
    get cliparea(){
        if (this.#cliplimit) return this.limit.area;
        return this.#cliparea;
    }
    /** specifies a clip rectangle and turns clipping on
     * 
     * @example 
     * // restrict sprite to rectangle in centre of screen with a 20 pixel border
     * this.cliparea = new Rectangle(20,20,width-40,height-40);
    */
    set cliparea(value){
        this.#clip = true;
        this.#cliparea = value;
    }
    /** Draws the sprite */
    draw(delta){

        let fr = this.frame.current;
        if (this.#visible && this.frame.count > 0 && fr.port.w != 0 && fr.port.h != 0){
            this.layer.push();
            //this.layer.drawingContext.globalAlpha = this.alpha;
            if (this.#clip){
                this.layer.clip(() => {
                const r = this.cliparea;
                this.layer.rect(r.centrex,r.centrey,r.w,r.h);
                });
                if (this.showclip != null){
                    this.layer.fill(this.showclip);
                    this.layer.rect(this.cliparea.centrex,this.cliparea.centrey,this.cliparea.w,this.cliparea.h);
                }
            }      

            this.layer.translate(this.centrex, this.centrey);

            if (this.#angle != 0){
                this.layer.rotate(this.#angle);
            }

            //offset to centre
            this.layer.image(fr.tex,
                0, 0, this.width, this.height,
                fr.port.x, fr.port.y, fr.port.w, fr.port.h
            );
            this.layer.pop();
            if (this.limit.show != null){
                this.layer.fill(this.limit.show);
                this.layer.rect(this.limit.area.centrex,this.limit.area.centrey,this.limit.area.w,this.limit.area.h);
            }
        }
    }
}
/******************************
 * 
 * 
 * spritemanager.js
 * 
 * 
 ******************************/ 
/**manages and processes sprites - you should not have to use this directly apart from setting debug output*/
class Spritemanager{
    #spritelist;
    #layer;
    /** set the spritemanager to output debug info defaults to false*/
    debug = false;
    /** sets the position to display the sprite information 
     * @example this.debugposition = new vector2(10,ht - 30);
    */
    debugposition = new vector2(10,ht - 30);
    /** specifies the colour to render debug info */
    debugcolour = "white";
    /** specifies a refernce layer to render debug info to*/
    constructor(layer){
        this.#layer = layer;
        this.#spritelist = [];
    }
    /** gets the number of sprites being processed */
    get count(){return this.#spritelist.length;}

    /** adds a sprite for automatic update and drawing processing 
     * add a call to this method of the sprite manager in your sprites constructor
     * @example    
     * constructor(){
     *      super();
     *      Engine.spM.add(this);
     *      //...further constructor code to setup sprite
    */
    add(sprite){
        this.#spritelist.push(sprite);
    }

    /** process the sprites in the lists */
    update(delta){
        for (let p = 0; p < this.#spritelist.length; p++){
        this.#spritelist[p].update(delta);
        }
        //collision engine for now
        for (let p = 0; p < this.#spritelist.length; p++){
        if (this.#spritelist[p].collisionPrimary && this.#spritelist[p].collisionList != null)
        {
            const prim = this.#spritelist[p];
            //dumb for testing - need to write this properly so all items in collisionList count rather than just the first one
            for (let k = 0; k < this.#spritelist.length; k++){
            if (k != p && this.#spritelist[k].alive && this.#spritelist[k].collidable && this.#spritelist[k] instanceof this.#spritelist[p].collisionList[0]){
                if (prim.intersectBC(this.#spritelist[k])){
                    if (prim.callbackCollide(this.#spritelist[k])) break;
                }
            }
            }
        }
        }
        

        this.#bringoutthedead();
    }

    /** perform sprite rendering */
    draw(delta){
        //draw any history first - first guess
        for (let p = 0; p < this.#spritelist.length; p++){
            if (this.#spritelist[p].history != null) {this.#spritelist[p].history.draw();}
        }
            
        for (let p = 0; p < this.#spritelist.length; p++){
        //this.#spritelist[p].draw(this.#s, delta);
        this.#spritelist[p].draw(delta);
        }
        if (this.debug){this.debugdisplay();}
    }

    //removes all sprites marked as dead
    #bringoutthedead(){
        let p = this.#spritelist.length - 1;
        while (p >= 0 && p < this.#spritelist.length){
            try {
                if (this.#spritelist[p].dead){
                    this.#spritelist[p].cleanup();
                    this.#spritelist.splice(p,1);
                } else { p--;}
            } catch (error) {
                console.log("woops:" + p);
            }
        }
    }
    /** outputs the debug infomation if requested
     * @example
     * Engine.spM.debug = true;
     * Engine.spM.debugcolour = "yellow";
     * Engine.spM.debugposition = new vector2(10,height - 30);//place bottom left
     */
    debugdisplay(){
        this.#layer.push();
        this.#layer.noStroke();
        this.#layer.fill(this.debugcolour);
        this.#layer.text("sprites[" + this.count + "]", this.debugposition.x, this.debugposition.y) ;
        this.#layer.pop();
    }
    /** bins all sprites without calling funerals */
    removeall(){
        for (let p = 0; p < this.#spritelist.length; p++){
            this.#spritelist[p].cleanup();
        }
        this.#spritelist = [];
    }
}
/******************************
 * 
 * 
 * timer.js
 * 
 * 
 ******************************/ 

class Phase
{
    /** waiting for flashing to start*/
    static startafter = "startafter";
    /** waiting for flashing to stop*/
    static stopafter = "stopafter";
    /** waiting to kill sprite*/
    //static killafter = "killafter";
}
class Action{
    /**kills the sprite after time elapsed */
    static killafter = "killafter";
    /**flashes continuously */
    static flash = "flash";
    /**no timing action */
    static none = "none";
    /**acts as a timer, for setting time intervals (like button repeats)
     * 
     * has to be checked using elapsed
     */
    static interval = "timer";
    /** calls a function/method after time period has elapsed */
    static eventonce = "eventonce";
    /** calls a function/method periodically*/
    static event = "event";
    /**and event that fires periodically and stops after a given period of time */
    static eventStopafter = "eventStopafter";
    /** flashes until the stopAfter period has elapsed then stays on screen*/
    static flashStopafter = "flashStopafter";
    /**starts flashing after a period of time then continues flasing */
    static flashStartafter = "flashStartafter";
    /**flashes until the stop period then is killed */
    static flashKillafter = "flashKillafter";
    /**starts flashing after a period of time then stops staying on screen */
    static flashStartafterStopafter = "flashStartafterStopafter";
    /** starts flashing after a period of time then is killed after the kill time
     * 
     * this is useful for time limited pickups (or bombs) where the flashing can be used to indicate time is nearly up
     */
    static flashStartafterKillafter = "flashStartafterKillafter";
    /**makes a sprite invisible and then shows it after the time period elapses */
    static showafter = "showafter";
    /**apply a velocity for a period of time */
    static impulse = "impulsestopafter";
}

class Timer {
    #elapsedTime;
    #actionTime;
    #action;
    #mysprite
    #callback = null;
    get callback(){return this.#callback;}
    set callback(value){
      if (value.callback != undefined && value.instance != undefined){
        this.#callback = value;
      }
    }
    #callbackhandler = null;
    #callbackinstance;
    #allowoverwrite;
    overwriteEnable(){this.#allowoverwrite=true;}
    overwriteDisable(){this.#allowoverwrite=false;}
    #oninterval;
    #offinterval;
    #stopafterinterval;
    #startafterinterval;
    get allowOverwrite(){return this.#allowoverwrite;}
    set allowOverwrite(value){this.#allowoverwrite = value;}
    #hidden;
    #phase;
    #impulse;
    get phase(){return this.#phase;}

    get active(){return this.#action != Action.none;}
    get action(){return this.#action;}
    constructor(sprite){
        this.#mysprite = sprite;
        this.#action = Action.none;
    }
    /**disable the timer, choose whether to display or hide the sprite */
    off(display)
    {
        this.#action = Action.none;
        if (display == undefined || display)
            this.#mysprite.show();
        else
            this.#mysprite.hide();
    }
    /**flashes the sprite on and off, duration in seconds (or fraction of)
     * 
     * slightly longer on than off looks best
     */
    flash(onduration, offduration){
        if (this.#allowoverwrite || this.#action != Action.flash){
            this.#action = Action.flash;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.#actionTime = 0; this.#elapsedTime = 0;
            this.#hidden = false;
        }
    }
    flashStopafter(stopAfter, onduration, offduration, instance, callme){
        if (this.#allowoverwrite || this.#action != Action.flashStopafter){
            this.#action = Action.flashStopafter;
            this.#stopafterinterval = stopAfter;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.#actionTime = 0; this.#elapsedTime = 0;
            this.#hidden = false;
            this.#phase = Phase.stopafter;
            
            if (instance != undefined && callme != undefined){
                this.#callback = {callback:callme,instance:instance};
                this.#callbackhandler = callme;
                this.#callbackinstance = instance;
            }
        }
    }
    flashKillafter(stopAfter, onduration, offduration, instance, callme){
        if (this.#allowoverwrite || this.#action != Action.flashKillafter){
            this.#action = Action.flashKillafter;
            this.#stopafterinterval = stopAfter;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.#actionTime = 0; this.#elapsedTime = 0;
            this.#hidden = false;
            this.#phase = Phase.stopafter;
            this.#mysprite.show();
            
            if (instance != undefined && callme != undefined){
                this.#callback = {callback:callme,instance:instance};
                this.#callbackhandler = callme;
                this.#callbackinstance = instance;
            }
        }        
    }
    flashStartafter(startAfter, onduration, offduration, instance, callme){
        if (this.#allowoverwrite || this.#action != Action.flashStartafter){
            this.#action = Action.flashStartafter;
            this.#startafterinterval = startAfter;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.#actionTime = 0; this.#elapsedTime = 0;
            this.#hidden = false;
            this.#mysprite.show();
            this.#phase = Phase.startafter;
            if (instance != undefined && callme != undefined){
                this.#callback = {callback:callme,instance:instance};
                this.#callbackhandler = callme;
                this.#callbackinstance = instance;
            }
        }
    }
    flashStartafterKillafter(startAfter, killAfter, onduration, offduration, instance, callme){
        if (this.#allowoverwrite || this.#action != Action.flashStartafterKillafter){
            this.#action = Action.flashStartafterKillafter;
            this.#startafterinterval = startAfter; this.#stopafterinterval = killAfter;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.#actionTime = 0; this.#elapsedTime = 0;
            this.#hidden = false;
            this.#mysprite.show();
            this.#phase = Phase.startafter;
            if (instance != undefined && callme != undefined){
                this.#callback = {callback:callme,instance:instance};
                this.#callbackhandler = callme;
                this.#callbackinstance = instance;
            }
        }
    }
    flashStartafterStopafter(startAfter, stopAfter, onduration, offduration, instance, callme){
        if (this.#allowoverwrite || this.#action != Action.flashStartafterStopafter){
            this.#action = Action.flashStartafterStopafter;
            this.#startafterinterval = startAfter; this.#stopafterinterval = stopAfter;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.#actionTime = 0; this.#elapsedTime = 0;
            this.#hidden = false;
            this.#mysprite.show();
            this.#phase = Phase.startafter;
            if (instance != undefined && callme != undefined){
                this.#callback = {callback:callme,instance:instance};
                this.#callbackhandler = callme;
                this.#callbackinstance = instance;
            }
        }
    }
    showafter(showAfter, instance, callme){
        if (this.#allowoverwrite || this.#action != Action.showafter){
            this.#action = Action.showafter;
            this.#startafterinterval = showAfter;
            this.#actionTime = 0; this.#elapsedTime = 0;
            this.#hidden = true;
            this.#mysprite.hide();
            this.#phase = Phase.startafter;
            if (instance != undefined && callme != undefined){
                this.#callback = {callback:callme,instance:instance};
                this.#callbackhandler = callme;
                this.#callbackinstance = instance;
            }
        }
    }
    showafterKillafter(showAfter, killAfter, instance, callme){
        if (this.#allowoverwrite || this.#action != Action.showafterKillafter){
            this.#action = Action.showafterKillafter;
            this.#startafterinterval = showAfter;
            this.#stopafterinterval = killAfter;
            this.#actionTime = 0; this.#elapsedTime = 0;
            this.#hidden = true;
            this.#mysprite.hide();
            this.#phase = Phase.startafter;
            if (instance != undefined && callme != undefined){
                this.#callback = {callback:callme,instance:instance};
                this.#callbackhandler = callme;
                this.#callbackinstance = instance;
            }
        }
    }
    showafterFlash(showAfter, onduration, offduration, instance, callme){
        if (this.#allowoverwrite || this.#action != Action.showafterFlash){
            this.#action = Action.showafterFlash;
            this.#startafterinterval = showAfter;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.#actionTime = 0; this.#elapsedTime = 0;
            this.#hidden = true;
            this.#mysprite.hide();
            this.#phase = Phase.startafter;
            if (instance != undefined && callme != undefined){
                this.#callback = {callback:callme,instance:instance};
                this.#callbackhandler = callme;
                this.#callbackinstance = instance;
            }
        }
    }


    interval(time){
        this.#action = Action.interval;
        this.#actionTime = 0; this.#elapsedTime = 0;
        this.#startafterinterval = time;
    }
    killafter(killtime, instance, callme){
        this.#action = Action.killafter;
        this.#actionTime = 0; this.#elapsedTime = 0;
        this.#stopafterinterval = killtime;
        if (instance != undefined && callme != undefined){
            this.#callback = {callback:callme,instance:instance};
            this.#callbackhandler = callme;
            this.#callbackinstance = instance;
        }
    }

    eventonce(callAfter, instance, callme){
        if (this.#allowoverwrite || this.#action != Action.callback){
            this.#action = Action.eventonce;
            this.#startafterinterval = callAfter;
            this.#actionTime = 0; this.#elapsedTime = 0;
            this.#phase = Phase.startafter;
            if (instance != undefined && callme != undefined){
                this.#callback = {callback:callme,instance:instance};
                this.#callbackhandler = callme;
                this.#callbackinstance = instance;
            }
        }
    }
    event(interval, instance, callme){
        if (this.#allowoverwrite || this.#action != Action.event){
            this.#action = Action.event;
            this.#startafterinterval = interval;
            this.#actionTime = 0; this.#elapsedTime = 0;
            this.#phase = Phase.startafter;
            if (instance != undefined && callme != undefined){
                this.#callbackhandler = callme;
                this.#callbackinstance = instance;
            }
        }
    }
    eventStopafter(interval, stopAfter, instance, callme){
        if (this.#allowoverwrite || this.#action != Action.eventStopafter){
            this.#action = Action.eventStopafter;
            this.#startafterinterval = interval;
            this.#stopafterinterval = stopAfter;
            this.#actionTime = 0; this.#elapsedTime = 0;
            this.#phase = Phase.startafter;
            if (instance != undefined && callme != undefined){
                this.#callback = {callback:callme,instance:instance};
                this.#callbackhandler = callme;
                this.#callbackinstance = instance;
            }
        }
    }
    impulse(stopAfter, force, instance, callme){
        if (this.#allowoverwrite || this.#action != Action.impulse){
            this.#action = Action.impulse;
            this.#stopafterinterval = stopAfter;
            this.#actionTime = 0; this.#elapsedTime = 0;
            this.#impulse = force;
            this.#phase = Phase.startafter;
            if (instance != undefined && callme != undefined){
                this.#callback = {callback:callme,instance:instance};
                this.#callbackhandler = callme;
                this.#callbackinstance = instance;
            }
        }
    }

    get elapsedTime(){return this.#elapsedTime;}
    get elapsed(){return this.#elapsedTime >= this.#startafterinterval;}
    get elapsedReset(){
        if (this.#elapsedTime >= this.#startafterinterval){
            this.#elapsedTime = 0;
        return true;
        } else {return false;}
    }

    update(delta){
        if (this.#action != Action.none){
            //new timing system
            this.#elapsedTime += delta;
            this.#actionTime += delta;
            switch (this.#action){
                case Action.interval: break;
                case Action.eventonce:
                    if (this.#elapsedTime >= this.#startafterinterval){
                        this.#action = Action.none;
                        //if (this.#callbackhandler != null) this.#callbackhandler.call(this.#callbackinstance);
                        if (this.#callback != null) this.#callback.callback.call(this.#callback.instance);
                    } break;
                case Action.event:
                    if (this.#elapsedTime >= this.#startafterinterval){
                        this.#elapsedTime -= this.#startafterinterval;
                        if (this.#callback != null) this.#callback.callback.call(this.#callback.instance);
                    } break;
                case Action.eventStopafter:
                    if (this.#actionTime > this.#stopafterinterval){
                        this.#action = Action.none;
                    } else {
                        if (this.#elapsedTime >= this.#startafterinterval){
                            this.#elapsedTime -= this.#startafterinterval;
                            if (this.#callback != null) this.#callback.callback.call(this.#callback.instance);
                        } 
                    } break;
                    case Action.killafter:
                    if (this.#elapsedTime >= this.#stopafterinterval){
                        this.#mysprite.kill();
                    } break; 
                case Action.showafter:
                    if (this.#elapsedTime >= this.#startafterinterval){
                        this.#mysprite.show();
                        if (this.#callback != null) this.#callback.callback.call(this.#callback.instance);
                    } break;
                case Action.showafterFlash:
                    if (this.#elapsedTime >= this.#startafterinterval){
                        this.#action = Action.flash;
                        this.#mysprite.show();
                        this.#hidden = false;
                        this.#elapsedTime -= this.#startafterinterval;
                        this.#actionTime = _elapsedTime;
                        this.#sortvisibility();
                        if (this.#callback != null) this.#callback.callback.call(this.#callback.instance);
                    } break;
                case Action.showafterKillafter:
                    switch (this.#phase){
                        case Phase.startafter:
                            if (this.#elapsedTime >= this.#startafterinterval){
                                //turn on kill phase
                                this.#phase = Phase.stopafter;
                                this.#elapsedTime -= this.#startafterinterval;
                                this.#mysprite.show();
                                if (this.#callback != null) this.#callback.callback.call(this.#callback.instance);
                            } break;
                        case Phase.stopafter:
                            if (this.#elapsedTime >= this.#stopafterinterval){
                                this.#mysprite.kill();
                            } break;
                    } break;
                case Action.impulse:
                    this.#mysprite.Velocity.add(this.#impulse);
                    if (this.#elapsedTime >= this.#stopafterinterval){
                        this.#action = Action.none;
                        if (this.#callback != null) this.#callback.callback.call(this.#callback.instance);
                    } break;
                case Action.flashStartafter:
                    if (this.#elapsedTime >= this.#startafterinterval){
                        this.#elapsedTime -= this.#startafterinterval;
                        this.#actionTime = this.#elapsedTime;//added
                        this.#action = Action.flash;
                        this.#sortvisibility();
                        if (this.#callback != null) this.#callback.callback.call(this.#callback.instance);
                    }
                    break;
                case Action.flashStartafterStopafter:
                    switch (this.#phase){
                        case Phase.startafter:
                            if (this.#elapsedTime >= this.#startafterinterval){
                                //turn on continuous flashing
                                this.#elapsedTime -= this.#startafterinterval;
                                this.#actionTime = this.#elapsedTime;//added
                                this.#sortvisibility();
                                if (this.#callback != null) this.#callback.callback.call(this.#callback.instance);
                                this.#phase = Phase.stopafter;
                            } break;
                        case Phase.stopafter:
                            this.#sortvisibility();
                            if (this.#elapsedTime >= this.#stopafterinterval){
                                this.#action = Action.none;
                                this.#mysprite.show();
                                if (this.#callback != null) this.#callback.callback.call(this.#callback.instance);
                            } break;
                    } break;
                case Action.flashStartafterKillafter:
                    switch (this.#phase)
                    {
                        case Phase.startafter:
                            if (this.#elapsedTime >= this.#startafterinterval){
                                //turn on continuous flashing
                                this.#phase = Phase.stopafter;
                                this.#elapsedTime -= this.#startafterinterval;
                                this.#actionTime = this.#elapsedTime;//added
                                this.#sortvisibility();
                                if (this.#callback != null) this.#callback.callback.call(this.#callback.instance);
                            }
                            break;
                        case Phase.stopafter:
                            this.#sortvisibility();
                            if (this.#elapsedTime >= this.#stopafterinterval){
                                this.#mysprite.kill();
                            }
                            break;
                    }
                    break;
                case Action.flash:
                    this.#sortvisibility();
                    break;
                case Action.flashStopafter:
                    this.#sortvisibility();
                    if (this.#elapsedTime >= this.#stopafterinterval){
                        this.#action = Action.none;
                        this.#mysprite.show();
                        if (this.#callback != null) this.#callback.callback.call(this.#callback.instance);
                    } break;
                case Action.flashKillafter:
                    this.#sortvisibility();
                    if (this.#elapsedTime >= this.#stopafterinterval){
                        this.#mysprite.kill();
                    } break;
            }//switch (_method)
        }//if (_method != Style.none)
    }//update(delta)

    #sortvisibility(){
        if (this.#hidden){
            if (this.#actionTime >= this.#offinterval){
                this.#actionTime -= this.#offinterval;
                this.#mysprite.show();
                this.#hidden = !this.#hidden;
            }
        }  else {
            if (this.#actionTime >= this.#oninterval){
                this.#actionTime -= this.#oninterval;
                this.#mysprite.hide();
                this.#hidden = !this.#hidden;
            }
        }
    }//sortvisibility
}  
/******************************
 * 
 * 
 * vector2.js
 * 
 * 
 ******************************/ 
class vector2{
    #x=0;
    #y=0;
    //dirty;
    #length;
    //gets the pre-calculated magnitude of the vector
    get length(){return this.#length;}
    get distance() {return this.#length;}
    #mag = 0;
    constructor(x, y){
        this.set(x,y);
    }
    get iszero(){return this.#x == 0 && this.#y == 0;}
    get isone(){return this.#x == 1 && this.#y == 1;}    //creates a new object instance with the values from this
    get clone(){return new vector2(this.#x, this.#y);}
    set(x,y){
        this.#x = x;
        this.#y = y;
        this.#calcdist();
    }
    get x(){return this.#x;}
    get y(){return this.#y;}
    set x(value){
        if (this.#x != value){
        this.#x = value;
        this.#calcdist();
        } 
    }
    set y(value){
        if (this.#y != value){
        this.#y = value;
        this.#calcdist();
        } 
    }
    #calcdist(){
        this.#length = Math.sqrt(this.#x*this.#x + this.#y*this.#y);
    }

    //normalises this vector (unit length 1) this destorys the orginal vector
    normalise(){
        this.#x = this.#x/this.#length;
        this.#y = this.#y/this.#length;
        this.#length = 1;
        //return this;
    }
    //returns a new vector that is the normalised form of this vector
    normalised(){
        return new vector2(this.#x/this.#length, this.#y/this.#length);
    }
    //creates a normalised vector based on the x and y values
    static normalised(x,y){
        let mag = Math.sqrt(x*x + y*y);
        //let ux = x/mag;
        //let uy = y/mag;
        return new vector2(x/mag, y/mag);
    }
    //returns the angle if this vector was a direction vector
    static anglefromdirection(direction, additionalAngle){
        if (additionalAngle === undefined){
        additionalAngle = 0;
        }
        let bearing = 0;
        if (direction.y == 0)
        {
            if (direction.x < 0)
                bearing = Math.PI * 1.5;
            else
                bearing = Math.PI * 0.5;
        }
        else
        {
            let r = Math.atan(-direction.x / direction.y);
            if (direction.y > 0)
                //rotationAngle = (float)(r + Math.PI);
                if (direction.x < 0)
                    bearing = r - Math.PI;
                else
                    bearing = r + Math.PI;
            else
                bearing = r;
        }
        return bearing + additionalAngle;
    }
    //returns a unit vector based on the angle
    static directionfromangle(angle, additionalAngle){
        if (additionalAngle === undefined){
        additionalAngle = 0;
        }
        return new vector2(Math.cos(additionalAngle + angle - Math.PI/2),
                                Math.sin(additionalAngle + angle - Math.PI/2));
    }
    /** Returns a normalised direction vector looking from the starting sprite to the other sprite
    / @param from start position
    / @param to the direction to look towards
    / @param accuracy Not yet used specify free
    / returns A normalised Vector3 direction vector
    */
    static lookAt(from, to, accuracy)
    {
        let d = new vector2();
        d.x = to.x - from.y;
        d.y = to.y - from.y;
        if (d.x == 0 && d.y == 0){
            d = vector2.zero;
        }else{
            switch (accuracy)
            {
                case DirectionAccuracy.ordinals:
                    d = ordinalise(d);
                    break;
                case DirectionAccuracy.free:
                    d.normalise();
                    break;
            }
        }
        return d;
    }    
    ordinalise(direction){
        if (!direction.iszero){
            if (Math.abs(direction.y) > Math.abs(direction.x)){
                if (direction.y > 0)
                    return vector2.up;
                else
                    return vector2.down;
            }else{
                if (direction.x > 0)
                    return vector2.right;
                else
                    return vector2.left;
            }
        }
        return vector3.zero;
    }       
    /** calculates the dot product between 2 vector3 values */
    static dot(a, b){
        return a.x*b.x + a.y*b.y;
    }
    mulNew(scalar){
        return new vector2(this.#x * scalar, this.#y * scalar);
    }
    divNew(scalar){
        return new vector2(this.#x / scalar, this.#y / scalar);
    }
    mul(scalar){
        this.x = this.#x * scalar;
        this.y = this.#y * scalar;
    }
    div(scalar){
        this.x = this.#x / scalar;
        this.y = this.#y / scalar;
    }
    add(vec, y){
        if (y === undefined){// if just a vector
        this.#x = this.#x + vec.x;
        this.#y = this.#y + vec.y;

        } else {
        this.#x += vec;
        this.#y += y;
        }
        this.#calcdist();
    }
    sub(vec, y){
        if (y === undefined){// if just a vector
        this.#x -= vec.x;
        this.#y -= vec.y;
        } else {
        this.#x -= vec;
        this.#y -= y;
        }
        this.#calcdist();
    }
    static sub(v1, v2){
        return  new vector2(v1.#x - v2.#x, v1.#y - v2.#y);
    }
    static distance(v1, v2){
        return Math.sqrt((v2.x-v1.x)**2 + (v2.y-v1.y)**2);
    }
    static distanceSQ(v1, v2){
        return (v2.x-v1.x)**2 + (v2.y-v1.y)**2;
    }
     /**returns a new vector2 that is a copy of the values of this one, not a reference a separate object
     * 
     * be warned clone creates an object so is about 20x slower than setting individual vector coords
     * 
     * b.x = a.x;
     * 
     * b.y = a.y;
     * 
     * or using a.cloneto(b);
     */
    get clone(){
        return new vector2(this.#x, this.#y);
    }
    /**clones this vector2 to the existing vector passed as a parameter */
    cloneto(here){
        here.x = this.#x;
        here.y = this.#y;
    }
    static get zero(){return new vector2(0,0);}
    static get one(){return new vector2(1,1);}
    static get left(){return new vector2(-1,0);}
    static get right(){return new vector2(1,0);}
    static get up(){return new vector2(0,-1);}
    static get down(){return new vector2(0,1);}

}/******************************
 * 
 * 
 * vector3.js
 * to be implemented then used for pos and velocity
 * 
 ******************************/ 

/**3d position and methods */
class vector3{
    #x=0;
    #y=0;
    #z=0;
    //dirty;
    #length;
    //gets the pre-calculated magnitude of the vector
    /**pre calculated length of vector3, also it's magnitude */
    get length(){return this.#length;}
    /**pre calculated length of vector3, also it's magnitude */
    get distance() {return this.#length;}
    #mag = 0;
    constructor(x, y, z){
        if (z == undefined) z = 0;
        this.set(x, y, z);
    }
    get iszero(){return this.#x == 0 && this.#y == 0 && this.#z == 0;}
    get isone(){return this.#x == 1 && this.#y == 1 && this.#z == 1;}
    /**returns true if given vector is the same value as this one */
    equal(v){
        return this.#x == v.#x && this.#y == v.#y && this.#z == v.#z;
    }
    /**create a new instance of a vector3 with the values of this one - not a reference */
    get clone(){return new vector3(this.#x, this.#y, this.#z);}
    set(x, y, z){
        this.#x = x;
        this.#y = y;
        this.#z = z;
        this.#calcdist();
    }
    get x(){return this.#x;}
    get y(){return this.#y;}
    get z(){return this.#z;}
    set x(value){
        if (this.#x != value){
            this.#x = value;
            this.#calcdist();
        } 
    }
    set y(value){
        if (this.#y != value){
            this.#y = value;
            this.#calcdist();
        } 
    }
    set z(value){
        if (this.#z != value){
            this.#z = value;
            this.#calcdist();
        } 
    }
    #calcdist(){
        this.#length = Math.sqrt(this.#x**2 + this.#y**2 + this.#z**2);
    }

    /**normalises this vector (unit length 1) this destroys the orginal vector
     * 
     * use normalisedclone if you want a new vector that is the normalised version of this vector
    */
    normalise(){
        this.#x = this.#x/this.#length;
        this.#y = this.#y/this.#length;
        this.#z = this.#z/this.#length;
        this.#length = 1;
    }
    /**returns a new vector3 that is the normalised form of this vector3*/
    normalisedclone(){
        return new vector3(this.#x/this.#length, this.#y/this.#length, this.#z/this.#length );
    }
    /**creates a normalised vector based on the x and y and z values*/
    static normalised(x,y,z){
        let mag = Math.sqrt(x**2 + y**2 + z**2);
        return new vector3(x/mag, y/mag, z/mag);
    }
    /**returns the angle if this vector was a direction vector
     * 
     * This only examines 2d values as it is a bearing (which is 2d)
    */
    static anglefromdirection(direction, additionalAngle){
        if (additionalAngle === undefined){
            additionalAngle = 0;
        }
        let bearing = 0;
        if (direction.y == 0)
        {
            if (direction.x < 0)
                bearing = Math.PI * 1.5;
            else
                bearing = Math.PI * 0.5;
        }
        else
        {
            let r = Math.atan(-direction.x / direction.y);
            if (direction.y > 0)
                //rotationAngle = (float)(r + Math.PI);
                if (direction.x < 0)
                    bearing = r - Math.PI;
                else
                    bearing = r + Math.PI;
            else
                bearing = r;
        }
        return bearing + additionalAngle;
    }
    /**returns the 3d vector based on the angle
     * 
     * The z value is set to zero
    */
    static directionfromangle(angle, additionalAngle){
        if (additionalAngle === undefined){
            additionalAngle = 0;
        }
        return new vector3(Math.cos(additionalAngle + angle - Math.PI/2),
                                Math.sin(additionalAngle + angle - Math.PI/2),0);
    }

    /** Returns a normalised direction vector looking from the starting position to the other position
    * @param from start position
    * @param to the direction to look towards
    * @param accuracy Not yet used specify free
    * @param includeZ Specify true if you want to take the Z value into account
    * 
    * returns A normalised Vector3 direction vector
    */
    lookAt(from, to, accuracy, includeZ){
        let d = new vector3();
        if (includeZ){
                d = vector3.sub(to, from);
            }else{
                d.x = to.x - from.y;
                d.y = to.y - from.y;
            }
            if (d.x == 0 && d.y == 0 && d.z == 0){
                d = vector3.zero;
        }else{
            switch (accuracy)
            {
                case DirectionAccuracy.ordinals:
                    d = ordinalise(d);
                    break;
                case DirectionAccuracy.free:
                    d.normalise();
                    break;
            }
        }
        return d;
    }
    ordinalise(direction){
        if (!direction.iszero){
            if (Math.abs(direction.y) > Math.abs(direction.x)){
                if (direction.y > 0)
                    return vector3.up;
                else
                    return vector3.down;
            }else{
                if (direction.x > 0)
                    return vector3.right;
                else
                    return vector3.left;
            }
        }
        return vector3.zero;
    }    
    /** Determines whether rotating clockwise or anticlockwise is closest for a given position and direction
    * Useful for create homing and tracking effects, returns -1 if turned anti-clocwise, 1 if clockwise or 0 if didn't turn
    * @param from Position to look from
    * @param directionVector Direction looking
    * @param to position aiming for
    * @param minimumAngle the step size to turn by, if rotation required is less than this then 0 will be returned
    * 
    * returns-1 if turned anti-clocwise, 1 if clockwise or 0 if didn't turn */
    angularDirectionTo(from, directionVector, to, minimumAngle)
    {
        let dv = directionVector.normalisedclone;

        //calc direction to target
        let d = vector3.sub(to,from);
        d.normalise();
        let dot = vector3.dot(dv, d);
        let crossz = vector3.crosszonly(dv, d);

        if (dot < 0 || Math.abs(dot) < Math.cos(minimumAngle* Math.PI / 180))
            return (crossz < 0) ? -1 : 1;
        else
            return 0;
    }
    /** calculates just the z component on the normal to 2 given vectors*/
    static crosszonly(a, b){
        return a.x*b.y - a.y*b.x;
    }
    /** calculates just the normal to the 2 given vectors*/
    static cross(a, b){
        return new vector3(a.y*b.z - a.z*b.y,a.z*b.x - a.x*b.z, a.x*b.y - a.y*b.x);
    }
    /** calculates the dot product between 2 vector3 values */
    static dot(a, b){
        return a.x*b.x + a.y*b.y + a.z*b.z;
    }

    /**multiplies this vector3 by the scaler and returns a new vector3 */
    mulNew(scalar){
        return new vector3(this.#x * scalar, this.#y * scalar, this.#z * scalar);
    }
    /**divides this vector3 by the scaler and returns a new vector3 */
    divNew(scalar){
        return new vector3(this.#x / scalar, this.#y / scalar,this.#z/scalar);
    }
    /**multiplies this vector by the scaler value */
    mul(scalar){
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
    }
    /**divides this vector by the scaler value */
    div(scalar){
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
    }
    /**if the first parameter is a vector3 object then it is added to this vector 
     * 
     * if all 3 parameters are suppied then they are taken as individual
     * x y and z value
    */
    add(x, y, z){
        if (y === undefined){// if just a vector
        this.#x += x.x;
        this.#y += x.y;
        this.#z += x.z;

        } else {
        this.#x += x;
        this.#y += y;
        this.#z += z;
        }
        this.#calcdist();
    }
    /**if the first parameter is a vector3 object then it is subtracted to this vector 
     * 
     * if all 3 parameters are suppied then they are taken as individual
     * x y and z value
    */
    sub(x, y, z){
        if (y === undefined){// if just a vector
        this.#x -= x.x;
        this.#y -= x.y;
        this.#z -= x.z;
        } else {
        this.#x -= x;
        this.#y -= y;
        this.#z -= z;
        }
        this.#calcdist();
    }
    /**subtract the 2 given vector3's returning a new one */
    static sub(v1, v2){
        return  new vector3(v1.#x - v2.#x, v1.#y - v2.#y, v1.#z - v2.#z);
    }
    /**returns the distance between the 2 vector3 objects */
    static distance(v1, v2){
        return Math.sqrt((v2.#x-v1.#x)**2 + (v2.#y-v1.#y)**2+ (v2.#z-v1.#z)**2);
    }
    /**returns the square distance between 2 vector3's
     * 
     * faster to compare squares if only relative difference is required
     */
    static distanceSQ(v1, v2){
        return (v2.#x-v1.#x)**2 + (v2.#y-v1.#y)**2 + (v2.#z-v1.#z)**2;
    }
    /**returns a new vector3 that is a copy of the values of this one, not a reference a separate object
     * 
     * be warned clone creates an object so is about 20x slower than setting individual vector coords
     * 
     * b.x = a.x;
     * 
     * b.y = a.y;
     * 
     * b.z = a.z;
     */
    get clone(){
        return new vector3(this.#x, this.#y, this.#z);
    }
    /**clones this vector3 to the existing vector passed as a parameter */
    cloneto(here){
        here.x = this.#x;
        here.y = this.#y;
        here.z = this.#z;
    }

    /**returns a new vector3 object (0,0,0) */
    static get zero(){return new vector3(0,0);}
    /**returns a new vector3 object (1,1,1) */
    static get one(){return new vector3(1,1,1);}
    /**returns a new vector3 object (-1,0,0) */
    static get left(){return new vector3(-1,0,0);}
    /**returns a new vector3 object (1,0,0) */
    static get right(){return new vector3(1,0,0);}
    /**returns a new vector3 object (0,-1,0) */
    static get up(){return new vector3(0,-1,0);}
    /**returns a new vector3 object (0,1,0) */
    static get down(){return new vector3(0,1,0);}
    /**returns a new vector3 object (0,0,-1) */
    static get backward(){return new vector3(0,0,-1);}
    /**returns a new vector3 object (0,0,1) */
    static get forward(){return new vector3(0,0,1);}

}
