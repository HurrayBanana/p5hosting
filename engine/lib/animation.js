/******************************
 * animation.js created by Hurray Banana 2023-2024
 ******************************/ 
/**
 * @classdesc controls what happens when an animation reaches its last frame
 */
class LastAction{
    /** remain on the final frame */
    static stop = "stop";
    /** go back to the start and animate again (continuous loop - use callbacks to stop animation) */
    static repeat = "repeat";
    /** sprite should be killed */
    static kill = "kill";
    /** go back to the first frame of animation then stop animating */
    static stopthenfirst = "stopthenfirst";
    /** animate in the reverese order (continous loop - use callbacks to stop animation) */
    static reverse = "reverse";
}
/**
 * @classdesc
 * Specifies how a sprite animation should change, these are set and managed based on the animation methods you choose to use.
 * You shouldn't need to manipulate them directly
 */
class AnimateMethod{
    /** change frame after a period of time has elapsed (classic animation) */
    static onrate = "onrate";
    /** change frame after a number of pixels have been traversed - this is great for walking and other motion based animations
     * as they will automatically speed up/slow down as the sprite changes how fast covers distances, you'll need to experiment with distances
     */
    static ondistance = "ondistance";
    /** change frame every time a sprite is updated (based on the updatePeriod) this allows a classic space invaders animation
     *  as you'll animate every time you update a sprites position*/
    static onupdate = "onupdate";
    /** not currently animating */
    static none = "none";
    /** defines an animation state where no autoamtic animation occurs, controlled by your own code using next(), previous(), first(), last() and show(int) methods */
    static manual = "manual";
}
/** 
 * @classdesc
 * Specifies how a sprite should be sliced up when using defineSliding() */
class SlideMethod{
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
/**
 * @classdesc 
 * holds an animation state (ready for when animation stack is implemented) */
class AnimationState{
    /**
     * specifies the active animation frame for this state
     * @type {int}
     */
    active=-1;
    /**
     * Specifies the current animation method
     * @type {AnimateMethod}
     */
    #animationmethod=AnimateMethod.none;
    /** gets AnimationMethod for this state
     * @returns {AnimateMethod}
    */
    get animationmethod(){return this.#animationmethod;}
    /**
     *  sets AnimationMethod for this state, setting to AnimationMethod.none will effectively disable animation updates
     * you will need to set a new animation method using animationonrate, animateonupdate or animateondistance to start it again
     * @param {AnimateMethod} value 
     */
    set animationmethod(value){
        this.#animationmethod = value;
        if (value == AnimateMethod.none) this.animateroutine = null;
    }
    /**
     * my experiement in removing the need for a switch/if block to call the correct animation routine by directly storing the method in a property
     * @type {method}
     */
    animateroutine=null;
    /**
     * what happens when animation reaches the last frame
     * @type {LastAction}
     */
    lastframeaction=null;
    /**
     * first frame of the animation state
     * @type {int}
     */
    first=-1;
    /**
     * last frame of the animation state
     * @type {int}
     */
    last=-1;
    /**
     * +1 moving forward (first to last) through frames, -1 going backwards (last to first)
     * @type {int}
     */
    direction=1;
    /**
     * used by distance animation system to determine how far the sprite has moved
     * @type {vector3}
     */
    lastposition=0;
    /**
     * distance required to move before animation can change (stored as a Squared value (eliminating need for expensive Square Root))
     * @type {float}
     */
    distance=0;
    /**
     * number of seconds (fraction thereof) before animation can change in rate based animations
     * @type {float}
     */
    period=0;
    /**
     * time period recorded so far, for this rate based animation
     * @type {float}
     */
    elapsed=0;
    /**
     * an integer value that is incremented every time the animation reaches an end you can use this as a counter to eventually kill an animation, in conjunction with an callbackEnd
     * @type {int}
     */
    loop=0;
    /**
     * NOT IMPLEMENTED YET - would be an automatic way for stopping a continual repeat or reverse style animation, you can implement this yourself easily @see {@link elapsed}
     * @type {int}
     */
    loopend=-1;
    /**
     * method called when the animation frame is changed
     * @type {{callback:method|function,instance:object}}
     * */
    #callbackAnimate = null;
    /** retrieves the current callback that fires if the animation frame changes (if this has not been set it will be null)
     * it will be in the form of object properties
     * @returns {{callback:method|function,instance:object}} 
     * @example 
     * // two propeties callback and instance
     * let callstuff = this.callbackAnimate;
     * if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
     */
    get callbackAnimate(){return this.#callbackAnimate;}
    /**
     * sets (or changes) the callback handler called when animation states makes a frame change
     * @param {{callback:method|function,instance:object}} value
     * @example // animationchanged is a method of your inherited sprite class
     * this.callbackAnimate = {callback:this.animationchanged,instance:this};
     * // or use the Engine.makeCallback() method
     * this.callbackAnimate = Engine.makeCallback(this.animationchanged, this);
     */
    set callbackAnimate(value){
      if (value != undefined && value.callback !== undefined && value.instance !== undefined){
        this.#callbackAnimate = value;
      }
    }    
    /**method called when the sprite is hidden with 
     *  or settting visible to false, or from flashing 
     * @example this.hide();*/
    #callbackEnd = null;
    /** retrieves the current callback (if this has not been set it will be null)
     * it will be in the form of object properties
     * @returns {{callback:method|function,instance:object}} 
     * @example 
     * // two propeties callback and instance
     * let callstuff = this.callbackEnd;
     * if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
     * 
     */
    get callbackEnd(){return this.#callbackEnd;}
    /**
     * sets (or changes) the callback handler called when animation states reach an end point
     * @param {{callback:method|function,instance:object}} value
     * @example // animationchanged is a method of your inherited sprite class
     * this.callbackHide = {callback:this.animationchanged,instance:this};
     */
    set callbackEnd(value){
      if (value != undefined && value.callback !== undefined && value.instance !== undefined){
        this.#callbackEnd = value;
      }
    }  
    /**
     * @type {{callback:method|function,instance:object}} holds manual animation callback
     *  */      
    #callbackManual;
    /** retrieves the current callback (if this has not been set it will be null)
     * it will be in the form of object properties
     * @returns {{callback:method|function,instance:object}} 
     * @example 
     * // two propeties callback and instance
     * let callstuff = this.callbackManual;
     * if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
     * 
     */
    get callbackManual(){return this.#callbackManual;}
    /**
     * sets (or changes) the callback handler called when manual animation has been selected
     * @param {{callback:method|function,instance:object}} value
     * @example // checkanimation is a method of your inherited sprite class
     * this.callbackManual = {callback:this.checkanimation,instance:this};
     */
    set callbackManual(value){
      if (value != undefined && value.callback !== undefined && value.instance !== undefined){
        this.#callbackManual = value;
      }
    }
}
//add an EASING function instead of linear time (so scales elapsed depending on frame in sequence??)
/** @classdesc manages frames and display of frames for a sprite */
class Animator{
    /** holds all the defined frames for this sprite @type {{tex:texture,port:portion}[]}*/
    #frame;
    /** reference to the sprite that owns these frames @type {Sprite} */
    boss;
    /** holds the current animation state @type {AnimationState} */
    state;
    /** controls overwriting of the animation state with the same setting (default is false)
     * if set to true and you set the same animation state every frame then the animation will be stuck on the 
     * first frame of the animation. if false duplicate settings will be rejected allowing the animation to work despite 
     * being continuosly set
     * @type {bool}
     */
    allowduplicate = false;
    #restartduplicate = false;

    /** @returns {bool} returns true if an animation state is currently active for this sprite */
    get animating(){return this.state.animationmethod != AnimateMethod.none;}
    /** @returns {int} active display frame number (-1 would indicate no frames available for this sprite*/
    get active(){return this.state.active;}
    /** @param {int} value sets the active frame for display, allowing the ability to make your own custom animator */
    set active(value){
        if (value >= 0 && value < this.#frame.length){
        this.state.active = value;}
    }
    /** 
     * @returns {int} gets the first frame defined for the sprite
     * will be -1 if no frames defined or 0 if they are */
     get firstframe(){return (this.#frame.length == 0) ? -1:0;}
    /** 
     * @returns {int} gets the last frame defgined for the sprite
     * -1 if no frames defined
     */
    get lastframe(){return this.#frame.length - 1;}
    /** 
     * @returns {int} gets the first frame for the current animation state
     * if no animation range set then -1 is returned   */
    get firstAnmiationFrame(){return this.state.first;}
    /**
     * @returns {int} gets the last frame for the current animation state
     * if no animation range set the -1 is returned
     */
    get lastAnimationFrame(){return this.state.last;}
    /** 
     * @returns {texture} gets a reference to the texture being used by the current active frame */
    get currenttex(){return this.#frame[this.state.active].tex; }
    /**
     * @return {rectangle} gets a reference to the rectangluar potion used for the current active frame */
    get currentport(){return this.#frame[this.state.active].port; }
    /** 
     * @returns {in} number of frames defined for the sprite*/
    get count() {return this.#frame.length;}
    /** 
     * @return {{tex:texture,port:rectangle}} gets a duplicate frame for thecurrent frame texture and rectangular portion 
     * in the form of an object {tex:texture,port:rectangle};
    */
    get clonecurrent(){
        return {tex:this.#frame[this.state.active].tex,port:this.#frame[this.state.active].port.clone};
    }
    /** 
     * @returns {{tex:texture,port:rectangle}} gets a reference to the current frame information
     * in the form of an object {tex:texture,port:rectangle};
    */
    get current(){return this.#frame[this.state.active]; }

    /** defines an instance of the animation and frame system 
     * @param {Sprite} me the sprite controlling this animator
    */
    constructor(me){
        this.boss = me;
        //this.#active = -1;
        this.#frame = [];
        //default state information
        this.state = new AnimationState();
        //this.state = {active:-1,animatemethod:null,lastframeaction:null,first:-1,last:-1,direction:1,
            //lastposition:0,distance:0,period:0,elapsed:0,loop:0,loopend:-1,callbackAnimate:null,callbackEnd:null};
    }
    /** releases references from the animator */
    cleanup(){
        this.boss = null;
        this.#frame = null;
        this.state = null;
    }

    /** disabled, sets lastAction but shouldn't meddle directly
     * @param {LastAction} action action to set
     */
    #setlastaction(action){
        let act = null;
        switch (action){
            case LastAction.stop:act = this.#stop;break;
            case LastAction.repeat:act = this.#repeat;break;
            case LastAction.kill:act = this.#kill;break;
        }
        this.state.lastframeaction = act;
    }
    /**
     * creates an animation where they frame will change every time the sprite updates. 
     * 
     * This is only useful if you change the updatePeriod of the sprite and will give an animation style similar to space invaders
     * @param {LastAction} lastAction action to perform when animation reaches endFrame
     * @param {int} startFrame first frame of the animation
     * @param {int} endFrame final frame of the animation
     */
    animateonupdate(lastAction,  startFrame, endFrame){
        if (startFrame === undefined){startFrame = this.firstframe;}
        if (endFrame === undefined){endFrame = this.lastframe;}
        //only accept animation parameters if we allow the same or they are different
        if (this.allowduplicate || !(this.state.first == startFrame &&
            this.state.last == endFrame &&
            this.state.animateroutine == this.onupdate))//AnimateMethod.onupdate))
        {
            startFrame = clamp(startFrame,0,this.lastframe);
            endFrame = clamp(endFrame,0,this.lastframe);

            this.state.animationmethod = AnimateMethod.onupdate;
            this.state.animateroutine = this.onupdate;//AnimateMethod.onupdate;
            this.state.lastframeaction = lastAction;
            this.state.first = startFrame;
            this.state.last = endFrame;
            this.state.direction = (startFrame > endFrame) ? -1 : 1;
            this.state.loop = 0;
            this.state.active = (this.state.direction) ? startFrame : endFrame;
            this.boss.setmetrics();
        }
    }    
    /**
     * creates an animation where they frame will change every time the sprite has moved a particular distance
     * 
     * This is only useful if you change the frame for walking/tank tracks where the graphic shows contact with a surface.
     * playing with the distance is crucial so you don't get a scooby doo sliding walk (unless that's what you want)
     * if you speed up or down the movement of the sprite the animation will speed up or slow down accordingly
     * @param {float} distance the number of pixels moved that will cause the next animation frame to appear. Internally this is tracked as a square distance to eliminate the need for square root calculations
     * @param {LastAction} lastAction action to perform when animation reaches endFrame
     * @param {int} startFrame first frame of the animation
     * @param {int} endFrame final frame of the animation
     */
    animateondistance(distance, lastAction,  startFrame, endFrame){
        if (startFrame === undefined){startFrame = this.firstframe;}
        if (endFrame === undefined){endFrame = this.lastframe;}
        //only accept animation parameters if we allow the same or they are different
        if (this.allowduplicate || !(this.state.distance == distance**2 &&
            this.state.first == startFrame &&
            this.state.last == endFrame &&
            this.state.animateroutine == this.ondistance))//AnimateMethod.ondistance))
        {
            startFrame = clamp(startFrame,0,this.lastframe);
            endFrame = clamp(endFrame,0,this.lastframe);

            this.state.animationmethod = AnimateMethod.ondistance;
            this.state.animateroutine = this.ondistance;//AnimateMethod.ondistance;
            this.state.lastframeaction = lastAction;
            this.state.first = startFrame;
            this.state.last = endFrame;
            this.state.lastposition = this.boss.position.clone;
            this.state.distance = distance**2; //squared checks
            this.state.direction = (startFrame > endFrame) ? -1 : 1;
            this.state.loop = 0;
            this.state.active = (this.state.direction) ? startFrame : endFrame;
            this.boss.setmetrics();
        }
    }
    /**
     * creates an animation where they frame will change every time a time period has elapsed
     * 
     * This is the classic mode of animation, frame rate animation, great for explosion sprites and sliding effects
     * if you want to think in terms of frames divide the number of frames you want an animation to appear by 60. e.g. if you want an image to appear 5 seconds set the period to 5/60
     * @param {float} period the time in seconds ext animation frame to appear. Internally this is tracked as a square distance to eliminate the need for square root calculations
     * @param {LastAction} lastAction action to perform when animation reaches endFrame
     * @param {int} startFrame first frame of the animation
     * @param {int} endFrame final frame of the animation
     */
    animateonrate(period,  lastAction,  startFrame, endFrame){
        if (startFrame === undefined){startFrame = this.firstframe;}
        if (endFrame === undefined){endFrame = this.lastframe;}
        if (this.allowduplicate || !(this.state.period == period &&
            this.state.first == startFrame &&
            this.state.last == endFrame &&
            this.state.animateroutine == this.onrate))//AnimateMethod.onrate))
        {
            startFrame = clamp(startFrame,0,this.lastframe);
            endFrame = clamp(endFrame,0,this.lastframe);
            this.state.animationmethod = AnimateMethod.onrate;
            this.state.animateroutine = this.onrate;//AnimateMethod.onrate;
            this.state.lastframeaction = lastAction;
            this.state.first = startFrame;
            this.state.last = endFrame;
            this.state.period = period;
            this.state.elapsed = 0;
            this.state.direction = (startFrame > endFrame) ? -1 : 1;
            this.state.active = (this.state.direction) ? startFrame : endFrame;
            this.state.loop = 0;
            this.boss.setmetrics();
        }
    }
    /**
     * sets up manual animation, this lets you build any type of animation system you wish (could be based on user input if required)
     * 
     * use next(), previous(), first(), last() and show(int) methods to manipulate the animation
     * @param {LastAction} lastAction action to perform when animation reaches endFrame
     * @param {int} startFrame first frame of the animation
     * @param {int} endFrame final frame of the animation
     * @param {{callback:method|function,instance:object}} callback 
     */
    animateonmanual(lastAction, startFrame, endFrame, callback){
        if (startFrame === undefined){startFrame = this.firstframe;}
        if (endFrame === undefined){endFrame = this.lastframe;}
        if (this.allowduplicate || !(this.state.period == period &&
            this.state.first == startFrame &&
            this.state.last == endFrame &&
            this.state.animateroutine == callback))//AnimateMethod.onrate))
        {
            startFrame = clamp(startFrame,0,this.lastframe);
            endFrame = clamp(endFrame,0,this.lastframe);
            this.state.animationmethod = AnimateMethod.onmanual;
            this.state.animateroutine = this.onmanual;
            this.state.callbackManual = callback;
            this.state.lastframeaction = lastAction;
            this.state.first = startFrame;
            this.state.last = endFrame;
            this.state.period = period;
            this.state.elapsed = 0;
            this.state.direction = (startFrame > endFrame) ? -1 : 1;
            this.state.active = (this.state.direction) ? startFrame : endFrame;
            this.state.loop = 0;
            this.boss.setmetrics();
        }
    }
    
    /** empty method thatjust returns, called during update of animation */
    nomethod(){return;}
    /** don't call drectly, handles th update logic for onrate animations */
    onrate(){
        this.state.elapsed += Engine.delta;//delta;
        if (this.state.elapsed > this.state.period){
            this.state.elapsed = this.state.period - this.state.elapsed;
            Engine.processCallback(this.state.callbackAnimate);
            this.next();
        }
    }
    /** don't call drectly, handles th update logic for ondistance animations */
    ondistance(){
        if (vector2.distanceSQ(this.state.lastposition, this.boss.position) > this.state.distance)
        {
            this.state.lastposition = this.boss.position.clone;
            Engine.processCallback(this.state.callbackAnimate);
            this.next();
        }
    }
    /** don't call drectly, handles th update logic for onupdate animations */
    onupdate(){
        Engine.processCallback(this.state.callbackAnimate);
        this.next();
    }
    /** this will be called during manual animation operations, inherit from this to have your own code called if you use a manual animation */
    onmanual(){
        Engine.processCallback(this.state.callbackManual);
    }

    /** @type {bool} keeps track of animation changes during updates */
    #changedframe;
    /** perfors the update for particular mdoes
     * @returns {bool} true if animation frame did change
     */
    update(){
        this.#changedframe = false;
        if (this.state.animateroutine != null) this.state.animateroutine.call(this);
        return this.#changedframe;
    }    
    #checklastframe(){
        switch (this.state.lastframeaction){
            case LastAction.repeat:this.#repeat();break;
            case LastAction.reverse:this.#reverse();break;
            case LastAction.stop:this.#stop();break;
            case LastAction.stopthenfirst:this.#stopthenfirst();break;
            case LastAction.kill:this.#kill();break;
        }
    }
    /**
     * shows a specific frame (for manual animations)
     * @param {int} thisFrame if the frame is outside the ones defined it will be cropped to that range
     */
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
        this.boss.setmetrics();
    }

    /**
     * sets the frame to the first one in the currently defined animation state
     */
    first() {this.state.active = this.state.first;this.#changedframe = true;this.boss.setmetrics();}
    /**
     * sets the frame to the last one in the currently defined animation state
     */
    last() {this.state.active = this.state.last;this.#changedframe = true;this.boss.setmetrics();}
    /**
     * moves the animation to the next frame in the defined sequence in manual animations
     */
    next(){
        this.state.active += this.state.direction;
        this.#checklastframe();
        this.#changedframe = true;
    }
    /**
     * moves the animation to the previous frame in the defined sequence in manual animations
     */
    previous(){
        this.state.active -= this.state.direction;
        this.#checklastframe();
        this.#changedframe = true;
    }
    /**
     * defines a frame for this sprite it is added in sequence to the list of frames
     * @param {texture} texture where is the image for this frame coming from
     * @param {Rectangle} portion portion of the texture to use for this frame of animation, if you are using the whole texture don not provide a portion argument
     */
    define(texture, portion){
        if (portion === undefined){
            portion = new Rectangle(0,0,texture.width, texture.height);
        }
        if (portion.w != 0 && portion.h != 0){
            this.#frame.push({tex:texture,port:portion});
            //this.state.last++;
        } else {
            this.#frame.push({tex:null,port:portion});
        }
        if (this.state.active == -1){
            this.state.active = 0;
            this.boss.setmetrics();
        }
        this.boss.visible = this.#frame.length > 0;
    }
    /** defines a number of frames for a sprite using a framelist
     * @param {{t:texture,p:Rectangle}[]} flist 
     * @example
     * //if you manually define some frames useful for defining blocks of animation frames
     * this.frame.defineFramelist([
     *   {t:txsprite,p:{x:138,y:213,w:32,h:32}},//blinky
     *   {t:txsprite,p:{x:172,y:213,w:32,h:32}},
     *   {t:txsprite,p:{x:138,y:352,w:32,h:32}},//pinky
     *   {t:txsprite,p:{x:172,y:352,w:32,h:32}},
     *   {t:txsprite,p:{x:138,y:492,w:32,h:32}},//inky
     *   {t:txsprite,p:{x:172,y:492,w:32,h:32}},
     *   {t:txsprite,p:{x:138,y:631,w:32,h:32}},//clyde
     *   {t:txsprite,p:{x:172,y:631,w:32,h:32}},
     * ]);      
     * 
     */
    defineFramelist(flist){
        for (let p = 0; p < flist.length; p++){
            const f = flist[p];
            this.define(f.t,new Rectangle(f.p.x, f.p.y, f.p.w, f.p.h));
        }
        this.boss.visible = this.#frame.length > 0;
    }
    /** performs a rip of a spritesheet 
     * adds to frame list a rectangluar sequence of frames from a texture
     * @param {image|texture} texture image that contains the frames we want
     * @param {{w:32,h:32}} tilesize width and height of each frame (have to be the same size)
     * @param {{rowstall:3,colswide:10,left:10,top:5,xpad:2,ypad:2}} data explained in comments below
     * @example 
     * //takes 8 frames txsprite and adds them to the frames already defined for the sprite
     * //the frames consist of 1 row and 8 columns with a 2 pixel gap between each row and column
     * //each tiles is 32x32 pixels the rectangular sequence starts 2 pixels from left and 213 pixels from top corner of sprite sheet
     * this.frame.defineSpritesheet(txsprite, {w:32,h:32}, {rowstall:1,colswide:8,left:2,top:213,xpad:2,ypad:2});
    */
    defineSpritesheet(texture, tilesize, data){
        Engine.ripRawtiles(this.#frame, texture, tilesize, data);
        if (this.state.active == -1){
            this.state.active = 0;
            this.boss.setmetrics();
        }
        this.boss.visible = this.#frame.length > 0;
    }
    /** removes either a single frame or a number of frames including the first one 
     * if you do this you will need to make sure you reset any animation states with updated values
     * @param {int} frame start frame index to remove
     * @param {int} count number of frames to remove, don't provide an argument if you only need to remove a single frame
    */
    remove(frame, count){
        if (count === undefined) count = 1;
        this.#frame.splice(frame, count);
    }
    /** Creates animation frames automatically for an sliding sprite ( a graphic split into 
    * several sections along its width or height)
    * @param {*} texture The texture where this sprites graphic can be found
    * @param {*} portion The rectangle that defines the sprite when full (the whole image)
    * @param {*} slide specify the how you want the sprite to appear or dissapear
    * @param {*} steps How many steps are required for the image to appear or dissapear  (number of frames of animation)
    * The number of steps needs to go into the width or height of your sprite an even number of times for the best effect 
    * for example if you full sprite is 100 pixels wide then it could be split into 20 steps (5 pixels each)
    * 
    * This can be used for nice title image effects as well as raising lowering effects (where you progressively hide or show a portion of a sprite image),
    *  spikes, sliding doors, enemies appearing/hiding from behind cover
    * */
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
                if (steps === undefined) {steps = portion.h + 1;}
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
                if (steps === undefined) {steps = portion.w + 1;}
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
                if (steps === undefined) {steps = portion.h + 1;}
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
                if (steps === undefined) {steps = portion.w + 1;}
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
                if (steps === undefined) {steps = portion.w + 1;}
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
                if (steps === undefined) {steps = portion.w + 1;}
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
                if (steps === undefined) {steps = portion.h + 1;}
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
                if (steps === undefined) {steps = portion.h + 1;}
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

    /** if animation has gone past start or end of available animation frames
    * remain at that position
    */
    #stop(){
        if (this.state.direction == 1){
            if (this.state.active > this.state.last){
                this.state.loop++;
                this.state.active = this.state.last;
                //sequence ended run callback
                Engine.processCallback(this.state.callbackEnd);
                this.state.animatemethod = null;
    //          RevertAndContinue(_check_Animation._lastFrame);
            }
        } else {
            if (this.state.active < this.state.first){
                this.state.loop++;
                this.state.active = this.state.first;
                //sequence ended crun callback before repeating
                Engine.processCallback(this.state.callbackEnd);
    //          RevertAndContinue(_check_Animation._lastFrame);
            }
        }
    }
    /**if animation has gone past start or end of available animation frames 
    * revert to first frame in sequence and stop animation */
    #stopthenfirst(){
        if (this.state.direction == 1){
            if (this.state.active > this.state.last){
                this.state.loop++;
                this.state.active = this.state.last;
                //sequence ended run callback
                Engine.processCallback(this.state.callbackEnd);
                this.state.animatemethod = null;
                this.state.active = this.state.first;
    //          RevertAndContinue(_check_Animation._lastFrame);
            }
        } else {
            if (this.state.active < this.state.first){
                this.state.loop++;
                this.state.active = this.state.first;
                //sequence ended crun callback before repeating
                Engine.processCallback(this.state.callbackEnd);
                this.state.active = this.state.last;
                this.state.animatemethod = null;
    //          RevertAndContinue(_check_Animation._lastFrame);
            }
        }
    }
    /** if animation has gone past start or end of available animation frames
    * go back to first frame and continue */
    #repeat(){
        if (this.state.direction == 1){
            if (this.state.active > this.state.last){
                this.state.loop++;
                this.state.active = this.state.last;
                //sequence ended crun callback before repeating
                Engine.processCallback(this.state.callbackEnd);
                this.state.active = this.state.first;
            } else if (this.state.active < this.state.first){
                this.state.loop++;
                this.state.active = this.state.first;
                //sequence ended crun callback before repeating
                Engine.processCallback(this.state.callbackEnd);
                this.state.active = this.state.last;
            }
        } else {
            if (this.state.active < this.state.first){
                this.state.loop++;
                this.state.active = this.state.first;
                //sequence ended crun callback before repeating
                Engine.processCallback(this.state.callbackEnd);
                this.state.active = this.state.last;
            } else if (this.state.active > this.state.last){
                this.state.loop++;
                this.state.active = this.state.last;
                //sequence ended crun callback before repeating
                Engine.processCallback(this.state.callbackEnd);
                this.state.active = this.state.first;
            } 
        }
    }
    /** if animation has gone past start or end then reverse direction */
    #reverse(){
        if (this.state.direction == 1){
            if (this.state.active > this.state.last){
                this.state.loop++;
                this.state.active = this.state.last;
                //sequence ended crun callback before repeating
                Engine.processCallback(this.state.callbackEnd);
                this.state.direction = -1;
                this.state.active = this.state.last - 1;
            }
        } else {
            if (this.state.active < this.state.first){
                this.state.loop++;
                this.state.active = this.state.first;
                //sequence ended crun callback before repeating
                Engine.processCallback(this.state.callbackEnd);
                this.state.direction = 1;
                this.state.active = this.state.first + 1;
            }
        }
    }
    /**
    * if animation has gone past start or end of available animation frames
    * kill the sprite ha ha!!
    
    * @ Very useful for running an animation then making a sprite dissapear
    */
    #kill(){
        if (this.state.direction == 1){
            if (this.state.active > this.state.last){
                this.state.active = this.state.last;
                //sequence ended crun callback before repeating
                Engine.processCallback(this.state.callbackEnd);
                this.boss.kill();
            }
        } else {
            if (this.state.active < this.state.first){
                this.state.active = this.state.first;
                //sequence ended crun callback before repeating
                Engine.processCallback(this.state.callbackEnd);
                this.boss.kill();
            }
        }
    }
}//class Animator
