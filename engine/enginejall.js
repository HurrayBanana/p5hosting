/******************************
 *
// engine created by Hurray Banana 2023-2024
 *
******************************/


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
     * @returns {int} number of frames defined for the sprite*/
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
    first(){
        this.state.active = this.state.first;this.#changedframe = true;this.boss.setmetrics();
    }
    /**
     * sets the frame to the last one in the currently defined animation state
     */
    last(){
        this.state.active = this.state.last;this.#changedframe = true;this.boss.setmetrics();
    }
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

 
/******************************
 * engine.js by Hurray Banana 2023-2024
******************************/ 
/**** current version number of the engine */
let engineversion = '1.24.0.1';
/** @classdesc provides global functionality for other engine components */
class Engine{
  /** set of colours primary, secondary, black and white @type {color[]} */
  static cols3bit = [
      [255,255,255],
      [255,0,0],
      [0,255,0],
      [0,0,255],
      [0,255,255],
      [255,255,0],
      [255,0,255],
      [0,0,0],
  ];
  /** length of cols3bit for modulus work @type {int} */
  static cols3bitlen = Engine.cols3bit.length;
  /** @type {bool} if true then engine version will be shown with debug output */
  static showversion = true;
  /** if true debug output will be shown @type {bool}*/
  static debug = false;
  /** colour to display debug information @type {color}*/
  static debugcolour = [255,255,255,255];
  //static debugpos;
  //static debugalign = Align.bottomLeft;
  //graphics layers here
  /** for tilemaps to be rendered before sprite layers @type {texture}*/
  static #backmap;
  /** the tilemap layer drawn before every other layer 
   * be wary using with sprites as these are aligned top left
   * @returns {texture}
  */
  static get backmap(){
      Engine.#backmap.operations = true;
      return Engine.#backmap;
  }
  /** after sprite 0 and 1 @type {texture}*/
  static #midmap;
  /** tilemaps to be rendered after sprite layers 0 and 1 but before layer 2 and 3 
   * be wary using with sprites as these are aligned top left
   * @returns {texture}
  */
  static get midmap(){Engine.#midmap.operations = true;return Engine.#midmap;}
  /** tilemaps to be rendered after all 4 sprite layers but before the hud layer
  * Can use to do fade out/in and swipes
   * be wary using with sprites as these are aligned top left
   * @type {texture}
  */
  static #frontmap;
  /** tilemaps to be rendered after all sprite layers 
   * be wary using with sprites as these are aligned top left
   * @returns {texture}
  */
  static get frontmap(){Engine.#frontmap.operations = true;return Engine.#frontmap;}
  /** tilemaps to be rendered after all other layers including the hud @type {texture}*/
  static #finalmap;
  /** Can use to do fade out/in and swipes which also cover the UI
   * be wary using with sprites as these are aligned top left
   * @returns {texture}
  */
  static get finalmap(){Engine.#finalmap.operations = true;return Engine.#finalmap;}
  /**
   * holds each of the sprite layers these are drawn from 0 upwards,
   * the higher the layer number the later it is in the draw stack
   * use Engine.layer() to retrieve a reference to the layer when assigning to sprites, history and particles
   * You can use this reference to also modify settings of the texture layer (taking it away from its default settings)
   * @type {texture[]}
   */
  static spl = [];
  /**
   * holds each of the sprite glow layers these are drawn from 0 upwards before their corresponding sprite layer number,
   * the higher the layer number the later it is in the draw stack.
   * glow layers are much lower resolution than the main drawing layers, which can be controlled when setting up the engine
   * with Engine.init()
   * 
   * use Engine.glowlayer() to retrieve a reference to the layer when assigning to sprites, history and particles
   * You can use this reference to also modify settings of the texture layer (taking it away from its default settings)
   * @example 
   * //the glow divisor is how many times smaller the glow layers are created. 
   * //when drawn they are blown up using bilinear filtering which gives us a cheap glow effect
   * Engine.init({glowdivisor:8,viewW:600,viewH:800,worldW:3000,worldH:2000});
   * @type {texture[]}
   */
  static glow = [];
  /** used for some testing of persistance and fade stuff */
  static glowbuffer;
  /**
   * controls how many times smaller the glow layers are created. don't change this value you need to use Engine.init() to set this
   * @type {int}
   */
  static glowDiv = 8;
  /**
   * gets the hud layer (the final sprite layer) for drawing items on top of all other sprites
   * There are some tilemap layers that are drawn after this frontmap and finalmap
   */
  static get hud(){Engine.spl[Engine.spl.length-1].operations = true;return Engine.layer(Engine.spl.length-1)};
  /** reference to the sprite manager @type {Spritemanager} */
  static spM;
  /** reference to the particle manager @type {particleManager} */
  static particleM;
  /** reference to the tilemap manager @type {TilemapManager} */
  static tilemapM;
  /** holds an object value describing the width and height of the world render area 
   * object 
  */
  static #worldsize;// = vector2.zero;
  /** @returns {float} the width of the world area*/
  static get worldWidth(){return this.#worldsize.w};
  /** @returns {float} the height of the world area*/
  static get worldHeight(){return this.#worldsize.h;};
  /** @param {float} value sets the width of the world area*/
  static set worldWidth(value){this.#worldsize.w = value};
  /** @param {float} value sets the height of the world area*/
  static set worldHeight(value){this.#worldsize.h = value};
  /** 
   * @returns {Rectangle} gets a rectangle (0,0,width,height) representing the world size
   */
  static get worldarea(){return new Rectangle(0,0,this.#worldsize.w,this.#worldsize.h);}
  /** gets the world size (width and height), just access the w and h properties of the object
   * @returns {{w:int, h:int}}
   */
  static get worldsize(){return this.#worldsize;}
  /** use an object to set the size of the world
   * Engine.worldsize = {w:1000,h:1000};
   * or a vector2 value (something with w and h properties)
   * @param {vector2|{w:int, h:int}} value 
   */
  static set worldsize(value){this.worldWidth = value.w; this.worldHeight = value.h;};
  static viewWidth;
  static viewHeight;
  //static canvasArea;
  static viewports = [];
  static get mainview(){return Engine.viewports[0];}
  static get mainviewArea(){return Engine.viewports[0].area;}
  static zRange = 5000;
  static zHalf = this.zRange / 2;
  
  /**
   * @returns {vector3}
   */
  static get viewCentre(){return Engine.viewports[0].area.centre;}// Engine.viewWidth/2;}
  static get viewCentrex(){return Engine.viewports[0].area.centrex;}// Engine.viewWidth/2;}
  static get viewCentrey(){return Engine.viewports[0].area.centrey;}//Engine.viewHeight/2;}
  static get viewcount(){return Engine.viewports.length;}
  static #framecount;
  static #fps;
  static #elapsed;    
  /** initialises all the sub systems of the engine, call this from the preload function 
   * @param {{viewW:int,viewH:int,worldW:int,worldH:int,layers:int,glowdivisor:int,compositor:string}} settings all settings are optional, if none are set or nothing is passed then defaults (listed below will be used)
   * pass a settings object to change some of the defaults
   * @example     Engine.init({glowdivisor:8});
   * 
   * //settings object can have the following values
   * viewW:int //number of pixels wide the canvas/screen should be, default 600
   * viewH:int //number of pixels high the canvas/screen should be, default 600
   * worldW:int //number of pixels wide the world area should be, default 600
   * worldH:int //number of pixels high the world area should be, default 600
   * layers:int //number of layers including the HUD defaults to 5 (4 sprite layers and final HUD layer) - don't change it will break stuff - I need to generalise the renderer more first
   * glowdivisor:int //how much to shrink the glow layers by (these get scaled back up so we get a cheap blur)
   * compositor:string //the global compsition method on the glow layers, default is "lighter" @link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
   * 
  */
  static init(settings){
      Engine.delta = 1/60;
      let numlayers = 5;//4 sprites and final HUD
      let glowdivisor = 8;
      let compositor = "lighter";//"screen";
      let vw = 600;
      let vh = 600;
      let ww = 600;
      let wh = 600;
      
      if (settings !== undefined){
          if (settings.layers !== undefined) numlayers = settings.layers;
          if (settings.glowdivisor !== undefined) glowdivisor = settings.glowdivisor;
          if (settings.compositor !== undefined) compositor = settings.compositor;
          if (settings.viewW !== undefined) vw = settings.viewW;
          if (settings.viewH !== undefined) vh = settings.viewH;
          ww = vw;
          wh = vh;
          if (settings.worldW !== undefined) ww = settings.worldW;
          if (settings.worldH !== undefined) wh = settings.worldH;
      }
      Engine.viewWidth = vw;
      Engine.viewHeight = vh;
      Engine.#worldsize = new vector2(ww, wh);
      Engine.glowDiv = glowdivisor;
      Engine.#createlayers(numlayers, compositor);
      Engine.#createview();
      Engine.tilemapM = new TilemapManager();
      Engine.particleM = new particleManager();
      Engine.spM = new Spritemanager(Engine.layer(Engine.spl.length-1));//hud
      Engine.eventM = new EventManager();
      Tex.createTextures();
      //this.debugpos.x = 10;
      //this.debugpos.y = vh - 10;
      Engine.#framecount = 0;
      Engine.#fps = 0;;
      Engine.#elapsed = 0;
      //Tex.waitloading();
  }
  /** do not use this it's internal only for now until I implement multiple viewports */
  static #createview(){
      //default viewport
      Engine.viewports.push(new View(new Rectangle(0,0,Engine.viewWidth, Engine.viewHeight),0,0)); //canvas area
  }
  /**retrieves a specific graphic layer for assigning to sprites and particles for drawing on and changing settings of
   * @param {int} number layer number (0-3)
   * @example 
   * //draw order is as follows:
   * backmap, glow(0),layer(0),glow(1),layer(1),midmap,glow(2),layer(2),glow(3),layer(3),frontmap,hud,finalmap
  */
  static layer(number){
      if (number >= 0 && number < Engine.spl.length){
          Engine.spl[number].operations = true;
          return Engine.spl[number];
      } else {
          Engine.spl[0].operations = true;
          return Engine.spl[0];
      }
  }
  /**retrieves a specific graphic layer for drawing on and changing settings of 
   * @param {int} number glow layer number (0-3), glow layers are drawn before their corresponding sprite layer
   * @example 
   * //draw order is as follows:
   * backmap, glow(0),layer(0),glow(1),layer(1),midmap,glow(2),layer(2),glow(3),layer(3),frontmap,hud,finalmap
  */
  static glowlayer(number){
      if (number >= 0 && number < Engine.glow.length){
          Engine.glow[number].operations = true;
          return Engine.glow[number];
      } else {
          Engine.glow[0].operations = true;
          return Engine.glow[0];
      }
  }
  
  /**retrieves the rectangle for a numbered viewport - 0 being the main canvas area 
   * @param {int} number view to retrieve (currently on 0)
   * @returns {View} the requested Viewport
  */
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
  /**
   * 
   * @returns {texture|canvas} a top left aligned canvas for tilemap rendering
   */
  static #getTilemapLayer(){
      let context = createGraphics(Engine.viewWidth, Engine.viewHeight);//, WEBGL);
      context.noStroke();
      context.noSmooth();
      context.operations = false;
      context.pixelDensity(1);
      context.type = "t";
      return context;
  }
  /**
   * creates sprite and glow layers
   * @param {int} layercount number of sprite/particle layers and a hud
   * @param {string} compositor compositor to be used by glow layer
   */
  static #createlayers(layercount, compositor){
      let c = createCanvas(Engine.viewWidth, Engine.viewHeight);//, WEBGL);
      c.drawingContext.alpha = false;
      window.pixelDensity(1);
      //createCanvas(Engine.viewWidth, Engine.viewHeight, WEBGL);
      //let l = createFramebuffer();
      Engine.#backmap = this.#getTilemapLayer();
      //Engine.__backmap.drawingContext.alpha = false;
      Engine.#midmap = this.#getTilemapLayer();
      Engine.#frontmap = this.#getTilemapLayer();
      Engine.#finalmap = this.#getTilemapLayer();
      Engine.spl = new Array(layercount);
      Engine.glow = new Array(layercount);
      for (let p = 0; p < layercount; p++){
          Engine.spl[p] = createGraphics(Engine.viewWidth, Engine.viewHeight);//, WEBGL);
          Engine.spl[p].rectMode(CENTER);
          Engine.spl[p].imageMode(CENTER);
          Engine.spl[p].noStroke();
          Engine.spl[p].noSmooth();
          Engine.spl[p].operations = false;
          Engine.spl[p].wipe = true;
          Engine.spl[p].pixelDensity(1);
          Engine.spl[p].type = "s";

          //create a glow layer for each sprite layer
          Engine.glow[p] = createGraphics(Engine.viewWidth/Engine.glowDiv,Engine.viewHeight/Engine.glowDiv);
          Engine.glow[p].drawingContext.globalCompositeOperation = compositor;//"screen";//compositor;
          Engine.glow[p].noStroke();
          Engine.glow[p].rectMode(CENTER);
          Engine.glow[p].imageMode(CENTER);
          Engine.glow[p].operations = false;
          Engine.glow[p].wipe = true;
          Engine.glow[p].pixelDensity(1);
          Engine.glow[p].scale(1/Engine.glowDiv);//sets scale for layer
          Engine.glow[p].type = "g";
      }
      //testing
      Engine.glowbuffer = createGraphics(Engine.viewWidth/Engine.glowDiv,Engine.viewHeight/Engine.glowDiv);
      Engine.glowbuffer.drawingContext.globalCompositeOperation = "screen";
      Engine.glowbuffer.noStroke();
      Engine.glowbuffer.operations = false;
      Engine.glowbuffer.pixelDensity(1);
      Engine.glowbuffer.scale(1/Engine.glowDiv);
  }
  /** @type {float} holds the fraction of a second the current frame has taken
   * use this to get movement in pixels per second
   * @example
   * this.vx = 100 * Engine.delta; //move at 100 pixels over a second
  */
  static delta;
  static update(delta){
      Engine.delta = delta;
      Engine.#framecount++;
      Engine.#elapsed += delta;
      if (Engine.#elapsed >= 1){
          Engine.#elapsed -= 1;
          Engine.#fps = Engine.#framecount;
          Engine.#framecount = 0;
      }
      Engine.eventM.update();
      Engine.tilemapM.update();
      Engine.spM.update();
      Engine.particleM.update();
  }
  static #activelayers = "";
  static c = false;
  /**draws the various engine rendering sub systems */
  static draw(){
      //let tilelayers = "tilelayers ";
      //let spritelayers = " spritelayers ";
      //let glowlayers = " glowlayers ";
      Engine.tilemapM.draw();//delta);
      Engine.spM.draw();//delta);
      Engine.particleM.draw();//delta);
      //let w = -width/2;
      //let h = -height/2;
      //compositor
      if (this.#backmap.operations) {
          //image(Engine.__backmap, w, h);
          image(Engine.#backmap,0,0);
          this.#backmap.clear();
          //tilelayers += "[back]";
      }
      let p = 0;
      for (; p < 2; p++){
          if (Engine.glow[p].operations){
              image(Engine.glow[p],0, 0, Engine.viewWidth, Engine.viewHeight);
              if (Engine.glow[p].wipe) Engine.glow[p].clear();
              //omage(Engine.glow[p],0, 0, Engine.viewWidth, Engine.viewHeight);
              //Engine.glowbuffer.globalCompositeOperation = "difference";
              //Engine.glowbuffer.globalalpha = 0.5;
              //Engine.glowbuffer.image(Engine.glow[p],-25, -25, Engine.viewWidth+50, Engine.viewHeight+50);
              //Engine.glowbuffer.image(Engine.glow[p],0, 0, Engine.viewWidth+, Engine.viewHeight);
              //Engine.glow[p].clear();
              //write buffer
              //image(Engine.glowbuffer,0, 0, Engine.viewWidth, Engine.viewHeight);
              //if (Engine.c ) Engine.glow[p].clear();
              Engine.c = !Engine.c;
              //trying a self filter effect instead of clearing
              //Engine.glow[p].image(Engine.glow[p],//0,0,
                //  400,400, 810, 810);
                  //Engine.viewWidth*0.49/* -Engine.viewWidth*0.05*/, Engine.viewHeight*0.49/*-Engine.viewHeight*0.05*/, 
                  //Engine.viewWidth*1.1, Engine.viewHeight*1.1);
              //glowlayers += "[" + p + "]" ;
          }
          if (Engine.spl[p].operations){
              //image(Engine.spl[p], w, h);
              image(Engine.spl[p],0,0);
              //clear once drawn
              if (Engine.spl[p].wipe) Engine.spl[p].clear();
              //spritelayers += "[" + p + "]" ;
          }
      }
      if (this.#midmap.operations) {
          //image(Engine.__midmap, w, h);
          image(Engine.#midmap,0,0);
          this.#midmap.clear();
          //tilelayers += "[mid]";
      }
      for (; p < 4; p++){
          if (Engine.glow[p].operations){
              //image(Engine.glow[p], w, h, Engine.viewWidth, Engine.viewHeight);
              image(Engine.glow[p],0, 0, Engine.viewWidth, Engine.viewHeight);
              if (Engine.glow[p].wipe) Engine.glow[p].clear();
              //glowlayers += "[" + p + "]" ;
          }
          if (Engine.spl[p].operations){
              //image(Engine.spl[p], w, h);
              image(Engine.spl[p],0,0);
              //clear once drawn
              if (Engine.spl[p].wipe) Engine.spl[p].clear();
              //spritelayers += "[" + p + "]" ;
          }
      }
      if (this.#frontmap.operations) {
          //image(Engine.__frontmap, w, h);
          image(Engine.#frontmap,0,0);
          this.#frontmap.clear();
          //tilelayers += "[front]";
      }
      if (Engine.showversion) {Engine.version();}
      //draw hud
      if (Engine.spl[p].operations){
          //image(Engine.spl[p], w, h);
          image(Engine.spl[p],0,0);
          //clear once drawn
          if (Engine.spl[p].wipe) Engine.spl[p].clear();
          //spritelayers += "[hud]" ;
      }
      if (this.#finalmap.operations) {
          //image(Engine.__finalmap, w, h);
          image(Engine.#finalmap,0,0);
          this.#finalmap.clear();
          //tilelayers += "[final]";
      }
      if (Engine.debug){Engine.#debugout();}
      //Engine.#activelayers = tilelayers + " " + spritelayers + " " + glowlayers;
  }
  static #debugout(){
      let dm = []
      dm.push(this.particleM.debugdisplay);
      dm.push(this.spM.debugdisplay);
      let m = "view[" + (Engine.mainview.x|0) + "," + (Engine.mainview.y|0) + "]";
      m += " world[" + Engine.worldWidth + "," + Engine.worldHeight + "]";
      m += " viewrect[" + Engine.mainview.worldarea.l + "," + Engine.mainview.worldarea.t + "," + Engine.mainview.worldarea.r + "," + Engine.mainview.worldarea.b + "]";
      dm.push(m);
      dm.push(Engine.#activelayers)
      dm.push("fps[" + Engine.#fps + "]");
      dm.push(engineversion);
      window.push();
      window.textAlign(LEFT, BOTTOM);
      window.fill(Engine.debugcolour);
      window.noStroke();
      let dy = 0;
      dm.forEach(mess => {
          window.text(mess,10, Engine.mainview.area.h + dy );
          dy -= 20;
      });
      window.pop();
  }
  static version(){
      Engine.spl[3].push();
      Engine.spl[3].fill(255);
      Engine.spl[3].noStroke();
      Engine.spl[3].text(engineversion, 10,Engine.spl[3].height - 10);
      
      //Engine.spl[3].text(engineversion, 10,Engine.spl[3].height - 10);
      Engine.spl[3].pop();
  }
  /**internal support for executing callback routines (there are currently 4 differenet ones in Sprite alone) */
  static processCallback(handler, data){
      if (handler !== undefined && handler !== null) {return handler.callback.call(handler.instance, data);}    
  }
  /**
   * Generates a callback handler object to pass to a callback system
   * @param {function} handler 
   * @param {object} instance 
   * @returns {{callback:method|function, instance:object|null}}
   */
  static makeCallback(handler, instance){
      return {callback:handler, instance:instance};
  }
  /** performs a rip of a tilesheet, used by Tilemap.tilesfromTilesheet()
   * grabs a rectangluar sequence rawtiles from a texture, if wanting this for a tilemap use this.tilesfromTilesheet() inside your constructor instead
   * @param {Tile[]} tohere array of Tiles to add these rips to 
   * @param {image|texture} texture  image that contains the tiles we want
   * @param {{w:32,h:32}} tilesize width and height of each tile (have to be the same size)
   * @param {{rowstall:3,colswide:10,left:10,top:5,xpad:2,ypad:2}} data explained in comments below
   * @example 
   * //takes 30 tiles from txtiles and places them into the mytiles array
   * //the tiles consist of 3 rows and 10 columns with a 2 pixel gap between each row and column
   * //each tiles is 32x32 pixels the rectangular sequence starts 10 pixels from left and 5 pixels from top corner of sprite sheet
   * Engine.riptiles(mytiles, txtiles, {w:32,h:32}, {rowstall:3,colswide:10,left:10,top:5,xpad:2,ypad:2});
  */
  static riptiles(tohere, texture, tilesize, data){
      if (data === undefined){data = {};}
      if (data.rowstall === undefined) {data.rowstall = Math.floor(texture.height / tilesize.h);}
      if (data.colswide === undefined) {data.colswide = Math.floor(texture.width / tilesize.w);}
      if (data.left === undefined) {data.left = 0;}
      if (data.top === undefined) {data.top = 0;}
      if (data.xpad === undefined) {data.xpad = 0;}
      if (data.ypad === undefined) {data.ypad = 0;}
      for (let r = 0; r < data.rowstall; r++){
          for (let c = 0; c < data.colswide; c++){
              let t = new Tile(texture, new Rectangle(data.left + c * (tilesize.w + data.xpad), data.top + r * (tilesize.h + data.ypad), tilesize.w, tilesize.h));
              tohere.push(t);
          }
      }
  }
    /** performs a rip of a spritesheet to a format suitable for sprite animation frames, used by Sprite.frame.defineSpritesheet()
   * grabs a rectangluar sequence rawtiles from a texture
   * @param {Rawtile[]} tohere array of frames to add these rips to, use sprite.frame.defineSpritesheet() if you are doing this for a sprite
   * @param {image|texture} texture image that contains the frames we want
   * @param {{w:32,h:32}} tilesize width and height of each frame (have to be the same size)
   * @param {{rowstall:3,colswide:10,left:10,top:5,xpad:2,ypad:2}} data explained in comments below
   * @example 
   * //takes 8 frames txsprite and adds them to the frames already defined for the sprite
   * //the frames consist of 1 row and 8 columns with a 2 pixel gap between each row and column
   * //each tiles is 32x32 pixels the rectangular sequence starts 2 pixels from left and 213 pixels from top corner of sprite sheet
   * this.frame.defineSpritesheet(txsprite, {w:32,h:32}, {rowstall:1,colswide:8,left:2,top:213,xpad:2,ypad:2});
  */
  static ripRawtiles(tohere, texture, tilesize, data){
      if (data === undefined){data = {};}
      if (data.rowstall === undefined) {data.rowstall = Math.floor(texture.height / tilesize.h);}
      if (data.colswide === undefined) {data.colswide = Math.floor(texture.width / tilesize.w);}
      if (data.left === undefined) {data.left = 0;}
      if (data.top === undefined) {data.top = 0;}
      if (data.xpad === undefined) {data.xpad = 0;}
      if (data.ypad === undefined) {data.ypad = 0;}
      for (let r = 0; r < data.rowstall; r++){
          for (let c = 0; c < data.colswide; c++){
              let t = new Rawtile(texture, new Rectangle(data.left + c * (tilesize.w + data.xpad), data.top + r * (tilesize.h + data.ypad), tilesize.w, tilesize.h));
              tohere.push(t);
          }
      }
  }    
}
//The location of the well, vector3, if this is reference to a sprite.position then the gravity well will move with the sprite
//The mass of the gravity from this location in Giga Tonnes (billions of Kilograms), the higher the Mass the harder the pull
/******************************
 * gravitywell.js by Hurray Banana 2023-2024
 ******************************/ 
/** @classdesc Defines a gravity well that can act upon a sprite if associated*/
class GravityWell{
    /** @type {vector3} The position of this gravity well as a vector3*/
    location;
    /** @type {float} The mass of this gravity well in GigaTonnes (this diminishes over distance in a linear way*/
    #pointmass;
    /** @type {float} gravitational constant */
    static GM = 6.673E-11;
    /** @type {float} pre calculated value of mass and gravity */
    #precalc;
    /** Creates a new GravityWell specifying its location and Mass in Giga Tonnes 
     * 
     * @param {vector3} location 
     * @param {float} gigaTonnes 
     * 
     * You will need to experiment with the location and Mass of the GravityWells in order to achieve the desired effects
    */
    constructor(location, gigaTonnes){
        this.location = location;
        this.pointmass = gigaTonnes;
    }
    /** @returns {float} gets the pre-calculate gravitaional force*/
    get precalc(){return this.#precalc;}
    /** @returns {float} gets the point mass for the well in GigaTonnes*/
    get pointmass(){ return this.#pointmass;}
    /**  sets the point mass for the well in GigaTonnes 
     * @param {float} value mass in giga tonnes
    */
    set pointmass(value){
            this.#pointmass = value;
            this.#precalc = value * 1000000000 * GravityWell.GM;
    }
    /** removes a reference to a location if it existed. 
     * If you inherit from GravityWell and need to remove your own resources then implement your own
     * version of cleanup  but remember to call super.cleanup() */
    cleanup(){
        //in case it's a reference
        this.location = null;
    }
}

/******************************
 * general helper functions by Hurray Banana 2023-2024
******************************/ 
/** @type {float} 360 degrees as radians */
Math.PIx2 = Math.PI * 2;
/** @type {float} 180 degress as radians */
Math.PIby2 = Math.PI/2;
/** @type {float} 90 degrees as radians */
Math.PIby4 = Math.PI/4;
/** @type {float} multiply with a number of degrees to get radians */
Math.PIby180 = Math.PI/180;
/** @type {float} multiply with a number of radians to get degrees */
Math.PIx180 = Math.PI*180; 
/** divide an angle in degrees by this to get a radians value
 * @example
 * let radians = this.angle/Math.hb180byPI;
 */
Math.hb180byPI = 180/Math.PI;
/**
 * Produces a linear interpolation between 2 values
 * @param {float} a base value  (0%)
 * @param {float} b maximum value (100%)
 * @param {float} p percentage between 2 values a and b, should be a value between 0 and 1
 * @returns {float}
 */
function lrp(a, b, p){
  return a + (b - a) * p;
}

/** takes a value and rounds up to a power of 2 
 * @param {int} value value to round up
 * @returns {int}
*/
function roundtoPowerof2(value){
  let p2 = 1;
  while (value > p2){
    p2 += p2; //double
  }
  return p2;
}

/**returns a random integer value 
 * >= 0 and < maximum
 * @param {int} maximum 
 * @returns {int}
*/
function ranInt(maximum){
    if (maximum === undefined){
      maximum = 1;
    }
    return (Math.random()*maximum) | 0;
}

/** keeps a value within the lower and upper limit
 * @param {float} value  value to clamp
 * @param {float} lower lowest value allowed
 * @param {float} upper largest value allowed
 * @returns {float}
*/
function clamp(value, lower, upper){
  if (value < lower) return lower;
  else if (value > upper) return upper;
  else return value;
}

/** prouduces a random integer value between the lower and upper values
 * @param {int} lower lowest value to generate
 * @param {int} upper largest value (will be 1 less than this)
 * @returns {int}
 */
function ranBetween(lower, upper){
  return lower + this.ranInt(upper-lower);
}
/** prouduces a random value between the lower and upper values 
 * @param {int} lower lowest value to generate
 * @param {int} upper largest value (will be 1 less than this)
 * @returns {float}
*/
function floatBetween(lower, upper){
  return lower + Math.random() * (upper - lower);
}  

/** returns the radians in degrees 
 * @param {float} radians 
 * @returns {float} degrees
*/
function radtoDeg(radians){ return radians / PIx180;}

/** returns the degrees in radians
 * @param {float} degrees 
 * @returns {float} radians
 */
function degtoRad(degrees){return  degrees * PIby180;}

/** simple timer manager require an object with:
 *  an elapsed property
 *  a lifetime property holding how many seconds timer should live for
 * nulls the object when time is up
 * @example
 *  mytimer = tickandNull(mytimer, delta);
 * */
function tickandNull(obj, delta){
  if (obj != null){
    obj.elapsed += delta;
    return (obj.elapsed >= obj.lifetime) ? null : obj;
  }
}

/**
 * Takes an array of strings and display each string on screen on a separate line
 * @param {string[]} textarr array containing strings
 * @param {int} x left edge of text
 * @param {int} y starting height of output text
 * @param {int} linedrop distance to drop down on each string from the array
 * @param {texture|image} surface if specified the drawing will be attempted on the given image/surface or texture, if ommitted tet will appear on the default canvas
 * @example 
 * //displaying message bus subscribers with current text settings called at end of draw() function in sketch.js
 * drawtextArray(MsgBus.debugdisplayFull(), 10,100,16);
 */
function drawtextArray(textarr, x, y, linedrop, surface){
  //window is the way of accessing the default canvas and p5 instance (all its functions). Generally can be omitted but
  //when working programmatically canbe used to specify the p5 object directly
  surface = (surface === undefined) ? window : surface;
  if (textarr != null){
    for (let p = 0; p < textarr.length; p++){
      surface.text(textarr[p], x, y + linedrop *p);
    }
  }
}


//NEED  SOMETHING TO HAVE HISTORY ENABLED BUT ONLY IF SETUP CORRECTLY
/******************************
 * history.js by Hurray Banana 2023-2024
 ******************************/ 

/** @classdesc holds the definitions for a snapshot of a sprite
 */
class Historysnap{
    /**
     *  texture and rectangle @type {{tex:texture,port:Rectangle}}
     * 
     * */
    frame;
    /** position of this snap @type {vector3} */
    pos;
    /** was the sprite in view or world co-ordinates @type {bool} */
    world;
    /** the scale of the sprite at the time  @type {vector2}  */
    scale;
    /** angle of the sprite in radians  @type {float}  */
    angle;
    /** will hold a colour wash to apply (not in use yet as I need some shader code)  @type {color}  */
    wash;
    /** alpha value of the sprite at snap time (not used yet - overriden by ) */
    alpha;
    // layeroffset;
    // layer;
}

/** @classdesc provides visual snapshot functionality for sprites */
class History{
    /** holds each snap of the sprites data in time @type {Historysnap[]}*/
    #snaps = [];
    /** start position to render history from defaults to 0 (the newest snap position) this is because history is created as a circular queue @type {int}*/
    #start = 0;
    /** number of  current snaps @type {int}*/
    #length = 0;
    /** @returns {int} current length of the snap history */
    get length() { return this.#length;}
    /** marks current end of history list as this is operas a circular queue @type {int}*/
    #end = 0;
    /** specifies the start position to draw from, defaults to 0, but allows us to skip the ones closest to the sprite so we can leave a grap for disconnected trail effects */
    #renderfrom = 0;
    /** specifies the start position to draw from, defaults to 0, but allows us to skip the ones closest to the sprite so we can leave a grap for disconnected trail effects 
     * @returns {int} current value
    */
    get renderfrom(){return this.#renderfrom;}
    /**specifies the position to start rendering from.
     * this needs to be within the limit of the history length
     * @param {int} value allows us to skip the ones closest to the sprite so we can leave a grap for disconnected trail effects
     * @example
     * this.history = new History(this); // create the history object
     * this.history.show(0.05,90); //snap every 50 milliseconds, take 90 samples
     * this.history.renderfrom = 10; //skip the first ten snaps
     * this.history.scale = -0.5; // reduce the size by 50%
     * this.history.clampAlpha = 0.1;//don't allow alha to be higher than 10%
    */
    set renderfrom(value){this.#renderfrom = clamp(value, 0, this.#snaps.length - 2);}
    /** specifies the timer elapsed so for working towards the interval for history snapping */
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
    * @type {float}
    * maximum would be 0.0167 (every single frame)
    *
    * 2 would be once every 2 seconds (or every 120 frames)
     * @example
     * this.history = new History(this); // create the history object
     * this.history.show(0.05,90); //snap every 50 milliseconds, take 90 samples
     * this.history.renderfrom = 10; //skip the first ten snaps
     * this.history.scale = -0.5; // reduce the size by 50%
     * this.history.clampAlpha = 0.1;//don't allow alpha to be higher than 10%
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
     * @type {float}
     * @example
     * this.history.scale = 1; //increase the size by 100%
     * this.history.scale = -0.5f; //would decrease the size by 50%,*/
    scale = 0;
    /** if true then history trail will fade over its distance, 
     * if false no fading will be applied and clampAlpha value will be applied to all snaps
     * @type {bool}*/
    fadeAlpha = true;
    /** holds maximum allowed alpha value in history, default 1 @type {float} */
    #clampAlpha = 1;
    /** 
     * Sets the maximum alpha for the history trail, if fadeAlpha is false then this is the alpha for the entire trail
     * depending on how often you are snapping this may need to be quite low as history will draw on top of itself
     * @returns {float}
    */
    get clampAlpha(){ return this.#clampAlpha; }
    /** Sets the maximum alpha for the history trail, if fadeAlpha is false then this is the alpha for the entire trail 
     * @param {float} value new value between 0 and 1
     * @example
     * this.history = new History(this); // create the history object
     * this.history.show(0.05,90); //snap every 50 milliseconds, take 90 samples
     * this.history.renderfrom = 10; //skip the first ten snaps
     * this.history.scale = -0.5; // reduce the size by 50%
     * this.history.clampAlpha = 0.1;//don't allow alha to be higher than 10%
    */
    set clampAlpha(value){ this.#clampAlpha = clamp(value, 0, 1);}
    /** sets the layer to draw history on, by default this is layer 0, the sprite first layer rendered
     * @example this.history.layer = Engine.layer(2);
    */
    layer = Engine.layer(0);

    /** reference to th esprite we are snapping */
    #mysprite ;
    /** builds the history recording system for a sprite
     * @param {Sprite} mysprite the sprite to record history for
     */
    constructor(mysprite){
        this.#mysprite = mysprite;
    }
    cleanup(){
        this.#mysprite = null;
        this.#snaps = null;
    }
    /** turns on history for this sprite 
     * @example
     * this.history = new History(this); // create the history object
     * this.history.show(0.05,90); //snap every 50 milliseconds, take 90 samples
     * this.history.renderfrom = 10; //skip the first ten snaps
     * this.history.scale = -0.5; // reduce the size by 50%
     * this.history.clampAlpha = 0.1;//don't allow alha to be higher than 10%
     * @param {int} depth how many samples to record
     * @param {float} rate how often (in seconds) to take a positional snapshot
    */
    show(rate, depth){
        //this.depth = depth;
        this.sampleFreq = rate;
        this.#elapsed = 0;
        //implement history circular queue
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
    update(){
        if ((this.#elapsed += Engine.delta) > this.sampleFreq){
            this.#elapsed -= this.sampleFreq;
            let h = this.#snaps[this.#end];
            if (this.#mysprite.visible){
                h.frame = this.#mysprite.frame.clonecurrent;
                h.pos = new vector3(this.#mysprite.centrex, this.#mysprite.centrey,0);//this.#mysprite.position.clone
                h.scale = this.#mysprite.scale.clone;
                //h.layer = this.#mysprite.layer;
                h.angle = this.#mysprite.angleR;//angle/Math.hb180byPI;
                //h.angle = this.#mysprite.angle/180*Math.PI;
                h.alpha = this.alpha;//? is this right?
                h.world = this.#mysprite.world;
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

        let dalpha = this.fadeAlpha ?  this.#clampAlpha / numbertorender : 0;
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
                this/*h*/.layer.push();
                this/*h*/.layer.drawingContext.globalAlpha = alpha;
                this/*h*/.layer.translate(h.pos.x + (h.world ? -Engine.mainview.x : 0), h.pos.y + (h.world ? -Engine.mainview.y : 0));
                this/*h*/.layer.scale(scale*h.scale.x,scale*h.scale.y);
                if (h.angle != 0){
                    this/*h*/.layer.rotate(h.angle);
                }
                //cheating for now with some of the data here
                //offset to centre - need to fix /record the true offset for the history item now
                this/*h*/.layer.image(h.frame.tex,
                    0,0,h.frame.port.w, h.frame.port.h,
                    h.frame.port.x, h.frame.port.y, h.frame.port.w, h.frame.port.h
                );
                //h.layer.image(h.frame.tex,
                //    0,0,h.frame.port.w*h.scale.x*scale, h.frame.port.h*h.scale.y*scale,
                //    h.frame.port.x, h.frame.port.y, h.frame.port.w, h.frame.port.h
                //);
                this/*h*/.layer.pop();
            }
            scale -= dscale;
            alpha -= dalpha;
            end--;
        }
        this.layer.pop();
        return numbertorender;
    }
}
  /******************************
   * Limit.js by Hurray Banana 2023-2024
   ******************************/ 
  /** 
   * @classdesc actions to be taken once a Sprite meets or passes the limit box edge that is defined
   * 
   * The limit box can be any given rectangular or 3d box area or
   * the current position of the ViewPort. Limit boxes are only active once a sprite fully enters them,
   * if you are having trouble with a limit box make sure you make it visible using
   * @example this.limit.Show()
   */
  class Limitmode{
        /** no boundary control */
        static none = "none";
        /** make sprite bounce back in opposite direction
        * Nice for keeping a sprite within the boundaries of screen or rectangle. 
        * Such as in breakout/arkanoid type games */
        static bounce = "bounce";
        /** Performs a bounce but only bothers checking the front and back of the limit box
        * Great when used in conjuction with Z gravity and auto sprite scaling
        * to create a throbbing sprite */
        static bounceZonly = "bounceZonly";
        /** make sprite bounce back in opposite direction but align with collided edge
        * Only use this if you want the sprite to start its bounce aligned to the
        * edge of the limit box, you might get odd effects when doing this */
        static bounceAlign = "bounceAlign";
        /** make sprite appear on other side of limit box
        * Aligns the sprite with the opposite edge of limit box. Which can cause
        * odd effects with groups of sprites following each other, use wrapExact instead. */
        static wrap = "wrap";
        /** makes sprite appear on other side of limit box taking
        * account of exact position when leaving the limit box
        * use this for scrolling text or groups of sprites for an Asteroid wrapping effect */
        //static wrapExact = "wrapExact";
        /** only wrap in X direction, but bounce in Y direction
        * Use this if you want the sprite to wrap horizontally but fall under gravity */
        static wrapXBounceY = "wrapXBounceY";
        /** only wrap in Y direction, but bounce in X direction
        * Use this if you want the sprite to wrap vertically but bounce off the sides */
        static wrapYBounceX = "wrapYBounceX";
        /** make sprite stop moving in axis of limit box and align with collided edge
        * If a sprite hits the vertical edges of limit box then its horizontal
        * velocity is stopped, it can still move vertically until it hits the top or
        *  bottom of the limit box */
        static stopAt = "stopAt";
        /** make the sprite stop moving if any of borders are touched
        * Useful for title graphics where you want a sprite to stop in a specific
        * horizontal or vertical position but dont want to worry about exact size of limit box required */
        static stopFirstTouch = "stopFirstTouch";
        /** make sprite stop moving in axis of limit box and kill if no velocity set
        * Works like stop but if sprite has no velocity it will be killed */
        static stopThenKill = "stopThenKill";
        /** kill sprite once outside limit box
        * Use this to remove sprites once they have gone past the viewport 
        * (unless you want them to come back on screen). This will remove them without them
        * flashing off while still visible */
        static killPast = "killPast";
        /** kill sprite as soon as it touches limit box
        * Great for implementing electric fences etc... */
        static killTouch = "killTouch";
        /** kill sprite as soon as it enters the limit box
        * The sprite has to fit inside the limit box
        * Useful for setting defence boundaries around turrets etc.. */
        static killInside = "killInside";
        /** kills sprite if goes past X limit box, but bounces on Y */
        static killPastXBounceY = "killPastXBounceY";
        /** kills a sprite if it goes past the left/right boundaries and 
        * stops sprites vertical movement if it touches top/bottom */
        static killPastXStopY = "killPastXStopY";
        /** killPastYStopX, kills a sprite if it goes past top/bottom 
        * boundaries and stops sprites horizontal movement if it touches left/right */
        static killPastYStopX = "killPastYStopX";
        /** Notify using callback property
        * Use this in conjuction with an update routine to determine when sprite
        * hits an edge */
        static inform = "inform";
        /** Notify by setting AtBoundary to true and align with collided edge
        * Use this in conjuction with an UpdateHandler to determine when sprite
        * hits an edge, this can be seen in use in the Space Invaders code. As soon as one
        * invader hits the limit box all the invaders are then dropped down a line */
        static informAlign = "informAlign";
        //bounceOutside
        /** Turns gravity off once collided and aligns sprite with limit box
        * Use this when you want a sprite to stop falling after you have
        * made it move under gravity */
        static turnOffGravity = "turnOffGravity";
        /** Turns off gravity but only if contact with bottom of limit box occurs */
        static turnOffGravityBottomOnly = "turnOffGravityBottomOnly";
        /** executes the sprite callback routine specified. You need to handle any other actions
        * you want to apply to the sprite yourself, the event will continue to fire if your
        * sprite is still at the limit box, so you need to ensure that you set OnLimit = null if you do not want this behaviour */
        static fireEvent = "fireEvent";//fireEvent // rename to callbac = "";
  }
  /** @classdesc class to provide various types of interactions between sprites and bounding Boxes (depth based rectangles) 
   * @example
   * //initiate a limit box using
   * this.limit = new Limit(this);
  */
  class Limit {
    //limitactions = new Map();//can I use this instead of a big switch block
    //#delta;
    /**@type {Limitmode} holds the active mode of operation for the limit box */
    #mode;
    /** @type {Box} specifies the region for the limit box */
    #area;
    /** @returns {Box} specifies the Box area (rectangular region with depth) with which to apply limit actions */
    get area(){return this.#area;}
    /** specifies the Box area (rectangular region with depth) with which to apply limit actions 
     * @param {Box|Rectangle} value the area of the limit box
    */
    set area(value){
        if (value instanceof Rectangle){
            this.#area = new Box(value.x, value.y, Engine.zHalf, avaluerea.w, value.h, Engine.zRange);
        } else if (value instanceof Box){
            this.#area = value;
        }
    }
    /** @type {Sprite} holds reference to sprite that owns the limit box */
    #ms;
    /** @type {bool} specifies whether the limit box is active (generally sprites need to enter a box before it comes active) */
    #active;
    /** @returns {bool} specifies if the specified limit box is actively being processed default is true, until sprite enter the box this will be false */
    get active(){return this.#active;}
    /** @type {bool} states whether limit conditions have been met*/
    #atLimit = false;
    /** @returns {bool} true if sprite has interacted with the specified limit mode */
    get atLimit(){return this.#atLimit;}

    /** @type {{callback:method|function,instance:object}} */
    #callback;
    /** retrieves the current callback which will be triggered if the sprite interacts with the limit box
     * (if this has not been set it will be null)
     * it will be in the form of object properties
     * @returns {{callback:method|function,instance:object}}
     * @example 
     * // two propeties callback and instance
     * let callstuff = this.callback;
     * if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
     */
    get callback(){return this.#callback;}
    /**
     * sets (or changes) the callback handler called when sprite interacts with the limit box
     * value must be an object with 2 properties
     * @param {{callback:method|function,instance:object}} value 
     * @example // limitreached is a method of your inherited sprite class
     * this.callback = {callback:this.limitreached,instance:this};
     * // or use the Engine.makeCallback() method
     * this.callback = Engine.makeCallback(this.limitreached, this);
     */
    set callback(value){
      if (value != undefined && value.callback !== undefined && value.inst !== undefined){
        this.#callback = value;
      }
    }
    /** holds a colour to show the limit box of this sprite
     * If null (default) box not shown
     * if a colour is stored then it will be drawn (use alpha values so you can see the sprite)
     * @type {color}
     * @example
     * //show transparent red limit box
     * this.limit.show = [255,0,0,100];
     */
    show = null;


    /** creates a Limit object for this sprite, which is initially inactive
     * use regionaction() to define an interaction mode
     * @param {Sprite} boss 
     */
    constructor(boss){
      this.#ms = boss;
      this.#active = false;
      this.#mode = Limitmode.none;
    }
    /** removes any reference resources */
    cleanup(){
        this.#ms = null;
        this.#area = null;
        this.#callback = null;
    }
    /** manually turn off limit box
     * 
     * @example 
     * // for complete removal use
     * this.limit.cleanup();
     * this.limit = null;
     */
    off(){this.#active = false;}
    /** re-activates a previously set limit mode
     * 
     * You can also just set another region action if you want to change behaviour or just for simplicity
     */
    reset(){
      if (this.#area != null && this.#mode != Limitmode.none){
        this.#active = true;
      }
    }
    /** turns off the limit mode and changes themode to Limitmode.none 
     * Set a regionaction
    */
    modeoff(){this.#active = false;this.#mode = Limitmode.none;}
    /** specifies a limitmode and an active limit area 
     * 
     * if you want a static area provide a clone of a previously defined area/box (if that area will change)
     * 
     * If you want to track a moving area/box just use the boxes reference
     * 
     * set a callback (and it's instance) if you want notification of limit activity
     * @param {Limitmode} mode action to take with limit area
     * @param {Box|Rectangle} area limit area to interact with
     * @param {{callback:method|function,instance:object}} callback triggered if the sprite interacts with the limit box
     */
    regionaction(mode, area, callback){//} instance, callme){
        if(area instanceof Rectangle){
            this.#area = new Box(area.x, area.y, Engine.zHalf, area.w, area.h, Engine.zRange);
        } else if (area instanceof Box){
            this.#area = area;
        }
        this.#mode = this.#getMode(mode);
        this.#active = false;
        this.#callback = callback;
        // if (instance !== undefined && callme !== undefined){
        //     this.#callback = {callback:callme,instance:instance};
        // }
    }
    /**
     * Specifies a limitmode that interacts with the standard (zeroed) viewport (i.e. screen area space)
     * @param {Limitmode} mode action to take with limit area
     * @param {{callback:method|function,instance:object}} callback triggered if the sprite interacts with the limit box
     */
    viewportaction(mode, callback){//instance, callme){
        this.regionaction(mode, Engine.mainviewArea, callback);//instance, callme);
    }
    /* returns the function for that mode*/
    #getMode(mode){
      switch (mode){
        case Limitmode.bounce:return this.#bounce;
        case Limitmode.wrap:return this.#wrap;
        case Limitmode.killTouch:return this.#killtouch;
        case Limitmode.killPast:return this.#killpast;
        case Limitmode.none:return this.modeoff;
        case Limitmode.bounceZonly:return this.#bounceZonly;
        case Limitmode.bounceAlign:return this.#bounceAlign;
        case Limitmode.wrapXBounceY:return this.#wrapXBounceY;
        case Limitmode.wrapYBounceX:return this.#wrapYBounceX;
        case Limitmode.stopAt:return this.#stopAt;
        case Limitmode.stopFirstTouch:return this.#stopFirstTouch;
        case Limitmode.stopThenKill:return this.#stopThenKill;
        case Limitmode.killInside:return this.#killInside;
        case Limitmode.killPastXBounceY:return this.#killPastXBounceY;
        case Limitmode.killPastXStopY:return this.#killPastXStopY;
        case Limitmode.killPastYStopX:return this.#killPastYStopX;
        case Limitmode.inform:return this.#inform;
        case Limitmode.informAlign:return this.#informAlign;
        case Limitmode.turnOffGravity:return this.#turnOffGravity;
        case Limitmode.turnOffGravityBottomOnly:return this.#turnOffGravityBottomOnly;
        case Limitmode.fireEvent:return this.#fireEvent;
        default: return this.modeoff;
      }
    }

    /** applies relevant updates to the limit box */
    update(){
        this.#atLimit = false;
        if (this.#mode != Limitmode.none){
            if (this.#active){
                this.#mode();
            } else {
                //check to see if we are in limit area and so activate
                if (this.#ms.kright <this.#area.right  &&
                    this.#ms.kleft > this.#area.left &&
                    this.#ms.top > this.#area.top &&
                    this.#ms.bottom < this.#area.bottom &&
                    this.#ms.z > this.#area.back &&
                    this.#ms.z < this.#area.front) {
                    this.#active = true;
                    if (this.#mode == Limitmode.killInside)
                    {
                        this.#atLimit = true;
                        this.#ms.kill();
                    }
                }
            }
            if (this.#atLimit) {
                Engine.processCallback(this.#callback);
            }
            // if (this.#atLimit && this.#callback != null){
            //   this.#callback.callback.call(this.#callback.instance);
            // }
        }
    }
    #killpast(){
        if (this.#ms.kleft > this.#area.right || this.#ms.kright < this.#area.left ||
          this.#ms.top > this.#area.bottom || this.#ms.bottom < this.#area.top ||
          this.#ms.z < this.#area.back || this.#ms.z > this.#area.front){
              this.#ms.kill();
              this.#atLimit = true;
        }
    }
    #killtouch(){
        if (this.#ms.kright > this.#area.right || this.#ms.kleft < this.#area.left ||
            this.#ms.bottom > this.#area.bottom || this.#ms.top < this.#area.top ||
            this.#ms.z < this.#area.back || this.#ms.z > this.#area.front){
            this.#ms.kill();
            this.#atLimit = true;
        }
    }
    #bounceZonly(){
      let diff = this.#ms.z - this.#area.back;
      if (diff < 0){
          this.#ms.z -= diff;// *this.#ms.e;
          this.#ms.vz *= -this.#ms.e;
          this.#atLimit = true;
      } else {
          diff = this.#ms.z - this.#area.front;
          if (diff > 0) {
              this.#ms.z -= diff;// * this.#ms.e;
              this.#ms.vz *= -this.#ms.e;
              this.#atLimit = true;
          }
      }
    }
    #bounceAlign(){} //modify already written bounce
    #wrapXBounceY(){
      if (this.#ms.kright < this.#area.left)
      {
          this.#ms.kleft = this.#area.right;
          //SpriteHelper.AlignLeftAt(boss, this.area.right, 0);
          this.#atLimit = true;
      }
      else if (this.#ms.kleft > this.#area.right)
      {
          this.#ms.kleft = this.#area.right;
          //SpriteHelper.AlignRightAt(boss, this.area.left, 0);
          this.#atLimit = true;
      }
      //check Y
      let diff = this.#ms.bottom - this.#area.bottom;
      if (diff >= 0)
      {
          this.#ms.y -= diff;// * this.#ms.e;
          this.#ms.vy *= -this.#ms.e;
          this.#atLimit = true;
      }
      else
      {
          diff = this.#ms.top - this.#area.top;
          if (diff <= 0)
          {
              this.#ms.y -= diff;// * this.#ms.e;
              this.#ms.vy *= -this.#ms.e;
              this.#atLimit = true;
          }
      }
    }
    #wrapYBounceX(){
      if (this.#ms.bottom < this.#area.top)
      {
          this.#ms.top = this.#area.bottom;
          //SpriteHelper.AlignTopAt(boss, this.area.bottom, 0);
          this.#atLimit = true;
      }
      else if (this.#ms.top > this.#area.bottom)
      {
          this.#ms.bottom = this.#area.top;
          //SpriteHelper.AlignBottomAt(boss, this.area.top, 0);
          this.#atLimit = true;
      }
      //check X
      let diff = this.#ms.kright - this.#area.right;
      if (diff > 0)
      {
          this.#ms.x -= diff;// * this.#ms.e;
          this.#ms.vx *= -this.#ms.e;
          this.#atLimit = true;
      }
      else
      {
          diff = this.#ms.kleft - this.#area.left;
          if (diff < 0)
          {
              this.#ms.x -= diff;// * this.#ms.e;
              this.#ms.vx *= -this.#ms.e;
              this.#atLimit = true;
          }
      }
    }
    #stopAt(){
      if (this.#ms.kright > this.#area.right)
      {
          this.#ms.kright = this.#area.right;
          //SpriteHelper.AlignRightAt(boss, this.area.right, 0);
          this.#ms.vx = 0;
          this.#atLimit = true;
          //this.#ms.Velocity = new Vector3(0.0f, this.#ms.vy, this.#ms.vz);
          this.#ms.static = true;
      }
      else if (this.#ms.kleft < this.#area.left)
      {
          this.#ms.kleft = this.#area.left;
          //SpriteHelper.AlignLeftAt(boss, this.area.left, 0);
          this.#ms.vx = 0;
          //this.#ms.Velocity = new Vector3(0.0f, this.#ms.vy, this.#ms.vz);
          this.#atLimit = true;
          this.#ms.static = true;
      }
      if (this.#ms.bottom > this.#area.bottom)
      {
          this.#ms.bottom = this.#area.bottom;
          //SpriteHelper.AlignBottomAt(boss, this.area.bottom, 0);
          this.#ms.vy = 0;
          //this.#ms.Velocity = new Vector3(this.#ms.vx, 0.0f, this.#ms.vz);
          this.#atLimit = true;
          this.#ms.static = true;
      }
      else if (this.#ms.top < this.#area.top)
      {
          this.#ms.top = this.#area.top;
          //SpriteHelper.AlignTopAt(boss, this.area.top, 0);
          this.#ms.vy = 0;
          //this.#ms.Velocity = new Vector3(this.#ms.vx, 0.0f, this.#ms.vz);
          this.#atLimit = true;
          this.#ms.static = true;
      }
      if (this.#ms.z < this.#area.back)
      {
          this.#ms.z = this.#area.back;
          this.#ms.vz = 0;
          this.#ms.static = true;
          this.#atLimit = true;
      }
      else if (this.#ms.z > this.#area.front)
      {
          this.#ms.z = this.#area.front;
          this.#ms.vz = 0;
          this.#ms.static = true;
          this.#atLimit = true;
      }
    }
    #stopFirstTouch(){
      if (this.#ms.kright > this.#area.right)
      {
        this.#ms.kright = this.#area.right;
        //SpriteHelper.AlignRightAt(boss, this.area.right, 0);
          this.#ms.Velocity = Vector3.Zero;
          this.#ms.static = true;
      }
      else if (this.#ms.kleft < this.#area.left)
      {
        this.#ms.kleft = this.#area.left;
        //SpriteHelper.AlignLeftAt(boss, this.area.left, 0);
          this.#ms.Velocity = Vector3.Zero;
          this.#atLimit = true;
          this.#ms.static = true;
      }
      if (this.#ms.bottom > this.#area.bottom)
      {
        this.#ms.bottom = this.#area.bottom;
        //SpriteHelper.AlignBottomAt(boss, this.area.bottom, 0);
          this.#ms.Velocity = Vector3.Zero;
          this.#atLimit = true;
          this.#ms.static = true;
      }
      else if (this.#ms.top < this.#area.top)
      {
        this.#ms.top = this.#area.top;
        //SpriteHelper.AlignTopAt(boss, this.area.top, 0);
          this.#ms.Velocity = Vector3.Zero;
          this.#atLimit = true;
          this.#ms.static = true;
      }
      if (this.#ms.z < this.#area.back)
      {
          this.#ms.z = this.#area.back;
          this.#ms.Velocity = Vector3.Zero;
          this.#ms.static = true;
          this.#atLimit = true;
      }
      else if (this.#ms.z > this.#area.front)
      {
          this.#ms.z = this.#area.front;
          this.#ms.Velocity = Vector3.Zero;
          this.#ms.static = true;
          this.#atLimit = true;
      }
    }
    #stopThenKill(){
      if (this.#ms.kright > this.#area.right)
      {
          this.#ms.kright = this.#area.right;
          //this.#ms.x = this.area.right - this.#ms.Width * 0.5;
          this.#ms.vx = 0;
          this.#atLimit = true;
          this.#ms.static = true;
      }
      else if (this.#ms.kleft < this.#area.left)
      {
          this.#ms.kleft = this.#area.left;
          //this.#ms.x = this.area.left + this.#ms.Width * 0.5;
          this.#ms.vx = 0;
          this.#atLimit = true;
          this.#ms.static = true;
      }
      if (this.#ms.bottom > this.#area.bottom)
      {
          this.#ms.bottom = this.#area.bottom;
          //this.#ms.y = this.area.bottom - this.#ms.Height *0.5;
          this.#ms.vy = 0;
          this.#atLimit = true;
          this.#ms.static = true;
      }
      else if (this.#ms.top < this.#area.top)
      {
          this.#ms.top = this.#area.top;
          //this.#ms.y = this.area.top + this.#ms.Height *0.5;
          this.#ms.vy = 0;
          this.#atLimit = true;
          this.#ms.static = true;
      }
      if (this.#ms.z < this.#area.back)
      {
          this.#ms.z = this.#area.back;
          this.#ms.vz = 0;
          this.#ms.static = true;
          this.#atLimit = true;
      }
      else if (this.#ms.z > this.#area.front)
      {
          this.#ms.z = this.#area.front;
          this.#ms.vz = 0;
          this.#ms.static = true;
          this.#atLimit = true;
      }
      if (this.#ms.Velocity == Vector3.Zero)
          this.#ms.kill();

    }
    #killInside(){}//doesn't need to do anything as this is tested elsewhere
    #killPastXBounceY(){
        //check x boundary
      if (this.#ms.kleft > this.#area.right ||
          this.#ms.kright < this.#area.left)
      {
          this.#ms.kill();
          this.#atLimit = true;
      }
      //check Y
      let diff = this.#ms.bottom - this.#area.bottom;
      if (diff > 0)
      {
          this.#ms.y -= diff;// * this.#ms.e;
          this.#ms.vy *= -this.#ms.e;
          this.#atLimit = true;
      }
      else
      {
          diff = this.#ms.top - this.#area.top;
          if (diff < 0)
          {
              this.#ms.y -= diff;// * this.#ms.e;
              this.#ms.vy *= -this.#ms.e;
              this.#atLimit = true;
          }
      }
    }
    #killPastXStopY(){
        //check x boundary
        if (this.#ms.kleft > this.#area.right || this.#ms.kright < this.#area.left){
            this.#ms.kill();
            this.#atLimit = true;
        }
        //check Y
        if (this.#ms.bottom > this.#area.bottom){
            this.#ms.bottom = this.#area.bottom;
            //SpriteHelper.AlignBottomAt(boss, this.area.bottom, 0);
            this.#ms.vy = 0;
            this.#atLimit = true;
            this.#ms.static = true;
        } else if (this.#ms.top < this.#area.top){
            this.#ms.top = this.#area.top;
            //SpriteHelper.AlignTopAt(boss, this.area.top, 0);
            this.#ms.vy = 0;
            this.#atLimit = true;
            this.#ms.static = true;
        }
    }
    #killPastYStopX(){
      if (this.#ms.bottom > this.#area.bottom || this.#ms.top < this.#area.top){
          this.#ms.kill();
          this.#atLimit = true;
      }
      if (this.#ms.kright > this.#area.right){
          this.#ms.kright = this.#area.right;
          //SpriteHelper.AlignRightAt(boss, this.area.right, 0);
          this.#ms.vx = 0;
          //this.#ms.Velocity = new Vector3(0.0f, this.#ms.vy, this.#ms.vz);
          this.#atLimit = true;
          this.#ms.static = true;
      } else if (this.#ms.kleft < this.#area.left){
          this.#ms.kleft = this.#area.left;
          //SpriteHelper.AlignLeftAt(boss, this.area.left, 0);
          this.#ms.vx = 0;
          //this.#ms.Velocity = new Vector3(0.0f, this.#ms.vy, this.#ms.vz);
          this.#atLimit = true;
          this.#ms.static = true;
      }
    }
    #inform(){
      this.#atLimit = this.#ms.kright >= this.#area.right || this.#ms.kleft <= this.#area.left || 
                      this.#ms.bottom >= this.#area.bottom || this.#ms.top <= this.#area.top ||
                      this.#ms.z <= this.#area.back || this.#ms.z >= this.#area.front;
    }
    #informAlign(){
      if (this.#ms.kright >= this.#area.right){
          this.#ms.kright = this.#area.right;
          //SpriteHelper.AlignRightAt(boss, this.area.right, 0);
          this.#atLimit = true;
      } else if (this.#ms.kleft <= this.#area.left) {
          this.#ms.kleft = this.#area.left;
          //SpriteHelper.AlignLeftAt(boss, this.area.left, 0);
          this.#atLimit = true;
      }
      if (this.#ms.bottom >= this.#area.bottom){
          this.#ms.bottom = this.#area.bottom;
          //SpriteHelper.AlignBottomAt(boss, this.area.bottom, 0);
          this.#atLimit = true;
      } else if (this.#ms.top <= this.#area.top){
          this.#ms.top = this.#area.top;
          //SpriteHelper.AlignTopAt(boss, this.area.top, 0);
          this.#atLimit = true;
      }
      if (this.#ms.z <= this.#area.back){
          this.#ms.z = this.#area.back;
          this.#atLimit = true;
      }else if (this.#ms.z >= this.#area.front){
          this.#ms.z = this.#area.front;
          this.#atLimit = true;
      }
    }
    #turnOffGravity(){
      if (this.#ms.kright >= this.#area.right){
          this.#ms.kright = this.#area.right;
          //SpriteHelper.AlignRightAt(boss, this.area.right, 0);
          this.#atLimit = true;
          this.#ms.Gravity = Vector3.Zero;
          this.#ms.vx = 0;
      }else if (this.#ms.kleft <= this.#area.left){
          this.#ms.kleft = this.#area.left;
          //SpriteHelper.AlignLeftAt(boss, this.area.left, 0);
          this.#atLimit = true;
          this.#ms.Gravity = Vector3.Zero;
          this.#ms.vx = 0;
      }
      if (this.#ms.bottom >= this.#area.bottom){
          this.#ms.bottom = this.#area.bottom;
          //SpriteHelper.AlignBottomAt(boss, this.area.bottom, 0);
          this.#atLimit = true;
          this.#ms.Gravity = Vector3.Zero;
          this.#ms.vy = 0;
      }else if (this.#ms.top <= this.#area.top){
          this.#ms.top = this.#area.top;
          //SpriteHelper.AlignTopAt(boss, this.area.top, 0);
          this.#atLimit = true;
          this.#ms.Gravity = Vector3.Zero;
          this.#ms.vy = 0;
      }
      if (this.#ms.z <= this.#area.back){
          this.#ms.z = this.#area.back;
          this.#atLimit = true;
          this.#ms.Gravity = Vector3.Zero;
          this.#ms.vz = 0;
      }else if (this.#ms.z >= this.#area.front){
          this.#ms.z = this.#area.front;
          this.#atLimit = true;
          this.#ms.Gravity = Vector3.Zero;
          this.#ms.vz = 0;
      }
    }
    #turnOffGravityBottomOnly(){
      if (this.#ms.bottom >= this.#area.bottom){
          this.#ms.bottom = this.#area.bottom;
          //SpriteHelper.AlignBottomAt(boss, this.area.bottom, 0);
          this.#atLimit = true;
          this.#ms.Gravity = Vector3.Zero;
          this.#ms.vy = 0;
      }
    }
    #fireEvent(){
        if (this.#callback != null){
            if (this.#ms.kright > this.#area.right || this.#ms.kleft < this.#area.left ||
              this.#ms.bottom > this.#area.bottom || this.#ms.top < this.#area.top ||
              this.#ms.z < this.#area.back || this.#ms.z > this.#area.front){
                //LimitCallBack();
                this.#atLimit = true;
            }
        }
    }
    #bounce(){
        if (this.#ms.vx < 0){ // left
          if (this.#ms.kleft <= this.#area.l) { 
            this.#ms.vx *= -this.#ms.e;}
        } else if (this.#ms.vx > 0) { //  right
          if (this.#ms.kright >= this.#area.r) { 
            this.#ms.vx *= -this.#ms.e;}
        }
        
        if (this.#ms.vy < 0){ // up
          if (this.#ms.top <= this.#area.t) { 
            this.#ms.vy *= -this.#ms.e;}
        } else if (this.#ms.vy > 0) { // down
          if (this.#ms.bottom >= this.#area.b) { 
            this.#ms.vy *= -this.#ms.e;}
        }
    }

    #wrap(){
        if (this.#ms.vx < 0){ // left
            if (this.#ms.kright < this.#area.l) { 
            this.#ms.kleft = this.#area.r;}
        } else if (this.#ms.vx > 0) { //  right
            if (this.#ms.kleft > this.#area.r) { 
            this.#ms.kright = this.#area.l;}
        } else { //no motion
          if (this.#ms.kright < this.#area.l) { 
            this.#ms.kleft = this.#area.r;}
          else if (this.#ms.kleft > this.#area.r) { 
            this.#ms.kright = this.#area.l;}
        }
        
        if (this.#ms.vy < 0){ // up
            if (this.#ms.bottom < this.#area.t) { 
            this.#ms.top = this.#area.b;}
        } else if (this.#ms.vy > 0) { // down
            if (this.#ms.top > this.#area.b) { 
            this.#ms.bottom = this.#area.t;}
        } else { //no motion
          if (this.#ms.bottom < this.#area.t) { 
            this.#ms.top = this.#area.b;}
          else if (this.#ms.top > this.#area.b) { 
            this.#ms.bottom = this.#area.t;}  
        }
    }
  }

 /******************************
   * mathhelper.js by Hurray Banana 2023-2024
   ******************************/ 
/** @classdesc will contain general maths routines ?? */
class MathHelper{
    
}
/** @classdesc holds a 4x4 matrix to hold combinatoral transformation in a single matrix */
class Matrix{

    //h
    m00;m01;m02;m03;
    m10;m11;m12;m13;
    m20;m21;m22;m23;
    m30;m31;m32;m33;

    /** creates a new matrix
     * @param {float[][]} matrixarr if an array with 4 rows and columns is supplied a matrix will be
     * created with those values. If ommitted then an Identity matrix will be created 
     * @example
     * //an identity matrix
     * [
     * [1,0,0,0],
     * [0,1,0,0],
     * [0,0,1,0];
     * [0,0,0,1];
     * ]
     */
    constructor(matrixarr){
        if (matrixarr === undefined){
            this.reset();
        } else {
            this.m00 = matrixarr[0][0];this.m01 = matrixarr[0][1]; this.m02 = matrixarr[0][2]; this.m03 = matrixarr[0][3];
            this.m10 = matrixarr[1][0];this.m11 = matrixarr[1][1]; this.m12 = matrixarr[1][2]; this.m13 = matrixarr[1][3];
            this.m20 = matrixarr[2][0];this.m21 = matrixarr[2][1]; this.m22 = matrixarr[2][2]; this.m23 = matrixarr[2][3];
            this.m30 = matrixarr[3][0];this.m31 = matrixarr[3][1]; this.m32 = matrixarr[3][2]; this.m33 = matrixarr[3][3];
        }
    }

    /**
     * multiply this matrix with matrix m t*m
     * @param {Matrix} m 
    */
    multiply(m){
        let m00 = this.m00;let m01 = this.m01; let m02 = this.m02; let m03 = this.m03;
        let m10 = this.m10;let m11 = this.m11; let m12 = this.m12; let m13 = this.m13;
        let m20 = this.m20;let m21 = this.m21; let m22 = this.m22; let m23 = this.m23;
        let m30 = this.m30;let m31 = this.m31; let m32 = this.m32; let m33 = this.m33;
        
        this.m00 = m00 * m.m00 + m01 * m.m10 + m02 * m.m20 + m03 * m.m30;
        this.m01 = m00 * m.m01 + m01 * m.m11 + m02 * m.m21 + m03 * m.m31;
        this.m02 = m00 * m.m02 + m01 * m.m12 + m02 * m.m22 + m03 * m.m32;
        this.m03 = m00 * m.m03 + m01 * m.m13 + m02 * m.m23 + m03 * m.m33;

        this.m10 = m10 * m.m00 + m11 * m.m10 + m12 * m.m20 + m13 * m.m30;
        this.m11 = m10 * m.m01 + m11 * m.m11 + m12 * m.m21 + m13 * m.m31;
        this.m12 = m10 * m.m02 + m11 * m.m12 + m12 * m.m22 + m13 * m.m32;
        this.m13 = m10 * m.m03 + m11 * m.m13 + m12 * m.m23 + m13 * m.m33;

        this.m20 = m20 * m.m00 + m21 * m.m10 + m22 * m.m20 + m23 * m.m30;
        this.m21 = m20 * m.m01 + m21 * m.m11 + m22 * m.m21 + m23 * m.m31;
        this.m22 = m20 * m.m02 + m21 * m.m12 + m22 * m.m22 + m23 * m.m32;
        this.m23 = m20 * m.m03 + m21 * m.m13 + m22 * m.m23 + m23 * m.m33;

        this.m30 = m30 * m.m00 + m31 * m.m10 + m32 * m.m20 + m33 * m.m30;
        this.m31 = m30 * m.m01 + m31 * m.m11 + m32 * m.m21 + m33 * m.m31;
        this.m32 = m30 * m.m02 + m31 * m.m12 + m32 * m.m22 + m33 * m.m32;
        this.m33 = m30 * m.m03 + m31 * m.m13 + m32 * m.m23 + m33 * m.m33;
    }
    /** @returns {Matrix} An identity matrix, start point for building a custom matrix*/
    static get identity(){
        return new Matrix();
    }
    /**
     * @param {float} angle in degrees to rotate around the z axis (into the screen, effectively a 2d rotation) 
     * @returns {Matrix} Z axis rotation matrix
     */
    static rotateZ(angle){
        angle *= Math.PIby180;
        let m = new Matrix();
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        m.m00 = c; m.m01 = -s;
        m.m10 = s; m.m11 = c;
        return m;
    }
    /**
     * @param {float} angle in degrees to rotate around the y axis 
     * @returns {Matrix} y axis rotation matrix
     */
    static rotateY(angle){
        angle *= Math.PIby180;
        let m = new Matrix();
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        m.m00 = c; m.m02 = s;
        m.m20 = -s; m.m22 = c;
        return m;
    }
    /**
     * @param {float} angle in degrees to rotate around the x 
     * @returns {Matrix} x axis rotation matrix
     */
    static rotateX(angle){
        angle *= Math.PIby180;

        let m = new Matrix();
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        m.m11 = c; m.m12 = -s;
        m.m21 = s; m.m22 = c;
        return m;
    }
    /**
     * directly applies a z axis rotation to this matrix
     * @param {float} angle in degrees to apply to z axis
     */
    applyrotZ(angle){
        angle *= Math.PIby180;
        let m = new Matrix();
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        m.m00 = c; m.m01 = -s;
        m.m10 = s; m.m11 = c;
        this.multiply(m);
    }
    /**
     * directly applies a y axis rotation to this matrix
     * @param {float} angle in degrees to apply to y axis
     */
    applyrotY(angle){
        angle *= Math.PIby180;
        let m = new Matrix();
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        m.m00 = c; m.m02 = s;
        m.m20 = -s; m.m22 = c;
        this.multiply(m);
    }
    /**
     * directly applies a x axis rotation to this matrix
     * @param {float} angle in degrees to apply to x axis
     */
    applyrotX(angle){
        angle *= Math.PIby180;
        let m = new Matrix();
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        m.m11 = c; m.m12 = -s;
        m.m21 = s; m.m22 = c;
        this.multiply(m);
    }

    /**
     * creates a translation matrix
     * @param {float} x translation in x axis
     * @param {float} y translation in y axis
     * @param {float} z translation in z axis
     * @returns {Matrix} translation matrix requested
     */
    static translate(x,y,z){
        let m = new Matrix();

        m.m03 = x;
        m.m13 = y;
        m.m23 = z;
    }
    /**
     * directly applies a translation matrix to this matrix
     * @param {float} x translation in x axis
     * @param {float} y translation in y axis
     * @param {float} z translation in z axis
     */
    applytranslate(x,y,z){
        let m = new Matrix();

        m.m03 = x;
        m.m13 = y;
        m.m23 = z;
        this.multiply(m);
    }
    /**
     * sets this matrix to the indentity matrix
     */
    reset(){
        this.m00 = 1;this.m01 = 0; this.m02 = 0; this.m03 = 0;
        this.m10 = 0;this.m11 = 1; this.m12 = 0; this.m13 = 0;
        this.m20 = 0;this.m21 = 0; this.m22 = 1; this.m23 = 0;
        this.m30 = 0;this.m31 = 0; this.m32 = 0; this.m33 = 1;
    }
    /**
     * applies the matrix to given vector or array of vectors
     * @param {vector3|vector3[]} v 
     */
    transform(v){
        if (Array.isArray(v)){
            for (let p = 0; p < v.length; p++){
                let x = v[p].x;
                let y = v[p].y;
                let z = v[p].z;
                v[p].x = x * this.m00 + y * this.m01 + z * this.m02 + this.m03;
                v[p].y = x * this.m10 + y * this.m11 + z * this.m12 + this.m13;
                v[p].z = x * this.m20 + y * this.m21 + z * this.m22 + this.m23;
            }
        }else{//apply to single vector3 value
            let x = v.x;
            let y = v.y;
            let z = v.z;
            v.x = x * this.m00 + y * this.m01 + z * this.m02 + this.m03;
            v.y = x * this.m10 + y * this.m11 + z * this.m12 + this.m13;
            v.z = x * this.m20 + y * this.m21 + z * this.m22 + this.m23;
        }
    }
    /** @returns {string} a string representation of the matrix */
    get toString(){
        return "[" + this.m00 + "," + this.m01 + "," + this.m02 + "," + this.m03 + "]\n"+
        "[" + this.m10 + "," + this.m11 + "," + this.m12 + "," + this.m13 + "]\n"+
        "[" + this.m20 + "," + this.m21 + "," + this.m22 + "," + this.m23 + "]\n"+
        "[" + this.m30 + "," + this.m31 + "," + this.m32 + "," + this.m33 + "]";

    }
}

 /******************************
   * messagebus.js by Hurray Banana 2023-2024
   ******************************/ 
/** 
 * @classdesc list of static message types to send or subscribe to 
 * 
 * add your own messages here give it a name and set it to a string with the same name.
 * this will help with debugging. These are just examples, create your own with an inherited class (I usually call this mymess)
 * 
 * Use a JsDoc comment (/** ending with an asterisk forward slash) above each static message with details of the data that will be sent by the message bus
 * can't directly show in this example because it breaks the JsDoc comment !
 * @example
 * class mymess extends msgT{
 *   // data {score:1234,player:"blinky"} 
 *   static scored = "scored";
 *   // data {pos:vector3} 
 *   static clydepos = "clydepos";
 *   // data {loc:{x:int,y:int}} 
 *   static placeinky = "placeinky";
 *   // data {loc:{x:int,y:int}} 
 *   static targettest = "targettest";
 *   // no data required 
 *   static move = "move";
 *   // data {loc:{x:int,y:int},di:Tilemap.Direction} 
 *   static pacman = "pacman";
 *   // data {loc:{x:int,y:int}} 
 *   static blinky = "blinky";
 *}
*/
class msgT{
    /** 
     * data {x:float,y:float}
     * used for any object wanting to track player positions
     * @example
     * data {x:999,y:999};
    */
    static playerData = "playerData";
    /** 
     * data {col:[r,g,b]};
     * @example
     * //magenta
     * data {col:[255,0,255]};
    */
    static colour = "colour";
    /** 
     * data {score:int,player:string} 
     * @example
     * //blinky scored 1234 points
     * data {score:1234,player:"blinky"};
    */
    static scored = "scored";
    /** 
     * data {sp:object} 
     * use for sending references to a sprite so various info can be examined
     * e.g. frame info, or other states for cloning
     * @example
     * //send entire sprite reference
     * data {sp:this};
    */
    static spriteinfo = "spriteinfo"

}
/** 
 * @classdesc class allowing the subscription (receiving) and broadcasting of messages
 * 
 * this allows objects to reduce/remove dependencies on each other and allow sprites and other components to receive information
 * messages without needing to know directly where they have come from
 *  
 * this can allow the UI system to receive data without the sender having knowledge of the UI
 * and vice versa
 * 
 * messages can also be sent from HTML elements using onclick or similar events
 */
class MsgBus{
    static #subs = {};
    
    /** subscribe to a specfic type of message broadcast, you can have as many different subscribers to the same message. the sender does not need to know who's listening
     * @param {msgT} messageType the type of message being subscribed to (this ensure only subscribers of that message type recieve the message)
     * @param {method|function} handler the method or function that handles this message, make sure it accepts a data parameter if the message type sends data, or you are interested in the data
     * @param {object} instance the object instance whose method is accepting this message. If this is a global function put null for this value
     * @example
     * //subscribing from an object instance
     * MsgBus.sub(msgT.arrows, this.toggleArrows, this);
     * 
     * //subscrbing from a sketch in instance mode
     * MsgBus.sub(msgT.playerData, s.acceptPlayerData, s);
     * 
     * MsgBus.sub(msgT.colour, acceptcolour, s);
     * 
     * //subscribe to a message in a standard sketch (no instance required), 
     * //just supply message type and the function to accept the broadcast
     * MsgBus.sub(msgT.scored, acceptscore, null);
     */
    static sub(messageType, handler, instance){
        //attempt to get array of this message type from the map
        let callbacks = this.#subs[messageType];
        //not been seen before so make an array
        if (callbacks === undefined) {
            callbacks = [];
        }
        //add subscriber object to array
        callbacks.push({handler,instance})
        //set message type array to this new array
        this.#subs[messageType] = callbacks;
    }

    /**
     *  removes all message subscriptions for a particular message type
     * @param {msgT} messageType type of message to remove subscribers from
     */
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
     * @example
     * //remove the handler for the arrows message that calls this
     * //objects toggleArrows method
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
     *  @example
     *  //packaging x and y data message type playerData
     *  MsgBus.send(msgT.playerData,{x:pos.x,y:pos.y});
     * 
     *  //packaging 3 values 
     *  MsgBus.send(msgT.droppedNewNode,{name:this.name,x:this.x,y:this.y});
     * 
     *  //sending a message with a just a reference to the html object that sent it, suing the onclick event from HTML
     *  onclick="MsgBus.send(msgT.console,this);"
     * 
     *  //sending a message with no data that indicates something general happened
     *   MsgBus.send(msgT.quit);
     */
    static send(messageType, data){
        //get messageType from map if possible
        let callbacks = this.#subs[messageType];
        //iterate through those that do exist
        if (callbacks !== undefined) {
            for (let p = 0; p < callbacks.length; p++){
                let {handler,instance} = callbacks[p];
                handler.call(instance, data);
            }
        }
    }

    /**
     * returns a debug string array containing an entry for each actively subscribed message types
     * also includes information on each subscriber. 
     * 
     * If no subscribers then null is returned
     * @returns {string[]}
     */
    static debugdisplayFull(){
        let q = Object.keys(this.#subs);
        if (q.length == 0){return null;}
        let keys = [];
        for (let p = 0; p < q.length; p++){
          let r = this.#subs[q[p]];
          let outty = "msgT." + q[p] + "=>";
          if (r !== undefined){
            for (let k = 0; k < r.length; k++){
              if (r[k].instance !== null)
                outty += " (" + r[k].instance.constructor.name + "." + r[k].handler.name + ") ";
              else
                outty += " (window." + r[k].handler.name + ") ";
            }
          } else { outty += " empty";}
          keys.push(outty);
        }
        return keys;
    }
    /**
     * returns a debug string containing all actively subscribed messages
     * @returns {string}
     */
    static debugdisplayLite(){
        let q = Object.keys(this.#subs);
        if (q.length == 0){return null;}
        let keys = [];
        for (let p = 0; p < q.length; p++){
          let r = this.#subs[q[p]];
          if (r !== undefined){
            keys.push(q[p]);
          }
        }
        return outty;
    }
}

//ADD DICTIONARY OUTPUT TO DEBUGG MESSAGE
  /******************************
   * particle.js by Hurray Banana 2023-2024
   ******************************/ 
  /**
   * @classdesc Holds information about an idividual particle
   */
  class particle{
    /**
     * position of the particle. You can make this a vector3 type (or any type) as long as it has x and y properties that set the position
     * to draw the particle on screen
     * @type {vector2}
     */
    pos;
    /** 
     * velocity of the particle, you can use whatever you wish as your update controls the particles but it must update the postion x and y properties
     * @type {vector2}
     *  */
    vel;
    /**
     * the rotation angle of the particle texture, in radians
     * Do any work here in radians (if you want to sue degrees you'll have to do the maths to convert between)
     * @type {float} in radians
     */
    rot;
    /**
     * a value to determine the scale in the x and y directions for the particle.
     * @type {vector2} or any object with x and y properties e.g {x:2,y:3}
     */
    size;
    /**
     * a value to determine the scale in the x and y directions for the particles drawn on a glow layer.
     * This enables you to draw at different sizes if you are drawing on both the glow and normal layers
     * @type {vector2} or any object with x and y properties e.g {x:2,y:3}
     */
    gsize;
    /**
     * if false then the particle will no longer be drawn
     * set an individual particles alive propery to false to stop it being draw (you probably want to stop it being updated in your update method as well)
     * defaults to true
     * @type {bool}
     */
    alive;
}

class particleSet{
    /**
     * if true then the partcile set will be removed from the Particle Manager
     * set this to true in your update method when you want the particle effect to stop
     * @type {bool}
     */
    end = false;
    /**
     * Array of particles in this set
     * @type {particle[]}
     */
    particles;
    /**
     * renderlayer associated with this particle set
     * @type {Image | Texture}
     */
    layer = null;
    /**
     * glow renderlayer associated with this particle set
     * @type {Image | Texture}
     */
    glayer = null;
    /**
     * transparency of the particles (1 opaque -> 0 fully transparent)
     * @type {float}
     */
    alpha;
    /**
     * the colour to tint the texture you have supplied for the particles, 
     * default null, If set then the colour value will be used to tint the texture
     * @type {colour}
     */
    basecol = null;
    /**
     * the colour to tint the texture you have supplied for the particles, 
     * default null, If set then the colour value will be used to tint the texture
     * @type {colour}
     */
    glowcol = null;
    /**
     * the texture to render the partcile, this must be set, it defaults to Tex.singlepixel. The entire texture is rendered so be careful on choice
     * @type {Image|Texture}
     */
    tx;
    /**
     * specifies whether we are rendering in world or main view co-ordinates, default is true, world co-ordinates.
     * It should be set to the same as whatever co-ordinate system the particle is associated with
     */
    world = true;
    /**
     * creates the partcle set with the following number of elements
     * Make sure in you constructor after calling super(number of elements) that you set up the initial properties for each particle
     * @example
     * // a set of simple time based animations for effects 
     *class thrust extends particleSet{
     *
     *  end;
     *  colour;
     *  direction;
     *  start;
     *  constructor(pos, direction, density, col, world)
     *  {
     *      super(density);
     *      Engine.particleM.add(this);
     *      this.layer = Engine.glowlayer(0);
     *      //normailse direction vector (so length 1)
     *      direction.normalise();
     *      //generate initial particles
     *      this.generator(direction, pos, col);
     *      this.world = world;
     *  }
     *
     *  // generates the initial position and texture etc.. for each of the particles
     *  generator(direction, start, col)
     *  {
     *      this.alpha = 0.5;
     *      this.basecol = col;
     *      //loop through each particle creating it
     *      for (let p = 0; p < this.particles.length; p++)
     *      {
     *          //create a moving particle and store
     *          let mp = this.particles[p];
     *          mp.size = new vector2(15,15);
     *
     *          //set initial position and let the engine know this is alive (to be drawn)
     *          mp.pos = start.clone;
     *
     *          //add a little randomness to general direction flying
     *          let x = floatBetween(direction.x - 0.35, direction.x + 0.35);
     *          let y = floatBetween(direction.y - 0.35, direction.y + 0.35);
     *          //set velocity based on requested direction + the little bit of random spread
     *          mp.vel = new vector2((direction.x + x)*150,
     *                               (direction.y + y)*150)  ;
     *          
     *          //set rotation (in radians) to be same as direction it will move
     *          mp.rot = vector2.anglefromdirection(mp.vel);
     *          //set initial colour
     *          mp.col = [col[0],col[1],col[2]];
     *      }
     *  }  
     *  update()
     *  {
     *      this.alpha -= 1 * delta;
     *      //if alpha is too low disable rendering kill the entire particle set
     *      if (this.alpha < 0.15)
     *      {
     *          this.alive = false;
     *          this.end = true;
     *          return;
     *      }
     *      for (let part = 0; part < this.particles.length; part++)
     *      {
     *          let p = this.particles[part];
     *          //only update those alive
     *          if (p.alive)
     *          {
     *              //add particle velocity on
     *              p.pos.x += p.vel.x * delta;
     *              p.pos.y += p.vel.y * delta;
     *              //increase scale 50% per second
     *              p.size.x += p.size.x * 0.5 * delta;
     *              p.size.y += p.size.y * 0.5 * delta;
     *
     *              //rotate by PI radians per second
     *              p.rot += Math.PI * delta;
     *          }
     *      }
     *  }
     *}
     * @param {int} density 
     */
    constructor(density)
    {
        this.end = false;
        this.alpha = 1;
        this.tx = Tex.singlepixel;
        this.particles = new Array(density);
        for (let p = 0; p < density; p++){
            this.particles[p] = new particle();
            this.particles[p].alive = true;
        }
    }
    /**
     * removes any references when the particleset is destroyed, if you add any extra resources to your
     * own partcile sets make sure you override this cleanup method and call super.cleanup() within your method
     */
    cleanup(){
      this.particles = null;
    }
}

/**
 * @classdesc Manager for updating and rendering all particles
 */
class particleManager{
    /** 
     * holds the managed particles
     * @type {particleSet[]}
     */
    sets;
    /**
     * holds number of particles being managed/drawn
     */
    #count;
    /** constructs the manager */
    constructor(){
      this.sets = [];
    }
  
    /**
     * Adds a new particle set to be managed
     * @param {particleSet} ps 
     */
    add(ps){
      this.sets.push(ps);
    }
    /** updates all managed particle sets, your update routine is called to move the particles*/
    update(){
        this.#count = 0;
      for (let set = 0; set < this.sets.length; set++){
        this.sets[set].update();
      }
      this.#bringoutthedead();
    }
    //removes all particles marked as end
    // THIS IS BOGUS, LOOP ENDS IF WE DELETE the last item (the first thing checked)
    // I wonder if I can do a multisplice at the end instead ???
    #bringoutthedead(){
      let p = this.sets.length - 1;
      while (p >= 0){//} && p < this.sets.length){
          if (this.sets[p].end){
            this.sets[p].cleanup();
            this.sets.splice(p,1);
          } else { 
            this.#count += this.sets[p].particles.length;
          }
          p--;
      }
    }
    /** draws the managed particle sets */
    draw(){
        this.#count = 0;
        for (let set = 0; set < this.sets.length; set++){
            let pset = this.sets[set];
            if (pset.glayer != null || pset.layer != null){
              if (pset.layer != null) pset.layer.drawingContext.globalAlpha = pset.alpha;
              if (pset.glayer != null) pset.glayer.drawingContext.globalAlpha = pset.alpha;
              let tx;
              let gtx;
              
              tx = (pset.basecol != null) ? Tex.getTintedCopy(pset.tx, pset.basecol) : pset.tx;
              gtx = (pset.glowcol != null) ? Tex.getTintedCopy(pset.tx, pset.glowcol) : pset.tx;
              
              this.#count += pset.particles.length;
              let ofx = this.world ? -Engine.mainview.x:0;
              let ofy = this.world ? -Engine.mainview.y:0;
              if (pset.layer != null && pset.glayer == null){
                for (let part = 0; part < pset.particles.length; part++){
                    let p = pset.particles[part];
                    if (p.alive){
                        pset.layer.push();
                        pset.layer.translate(p.pos.x + ofx , p.pos.y + ofy);
                        
                        if (p.rot != 0){ pset.layer.rotate(p.rot);}
                        
                        pset.layer.image(tx,0,0,p.size.x, p.size.y);
                        pset.layer.pop();
                    }
                 }
              } else if (pset.layer == null && pset.glayer != null){
                for (let part = 0; part < pset.particles.length; part++){
                    let p = pset.particles[part];
                    if (p.alive){
                        pset.glayer.push();
                        pset.glayer.translate(p.pos.x + ofx , p.pos.y + ofy);
                        
                        if (p.rot != 0){ pset.glayer.rotate(p.rot);}
                        
                        pset.glayer.image(gtx,0,0,p.gsize.x, p.gsize.y);
                        pset.glayer.pop();
                    }
                 }
              } else {
                for (let part = 0; part < pset.particles.length; part++){
                  let p = pset.particles[part];
                  if (p.alive){
                      pset.layer.push();
                      pset.glayer.push();
                      pset.layer.translate(p.pos.x + ofx , p.pos.y + ofy);
                      pset.glayer.translate(p.pos.x + ofx , p.pos.y + ofy);
                      
                      if (p.rot != 0){ pset.layer.rotate(p.rot);pset.glayer.rotate(p.rot);}
                      
                      pset.layer.image(tx,0,0,p.size.x, p.size.y);
                      pset.glayer.image(gtx,0,0,p.gsize.x, p.gsize.y);
                      pset.layer.pop();
                      pset.glayer.pop();
                  }
               }

              }
            }
        }
    }
    /**
     * gets a debug string from the particle manager with number of particle sets and total number of active particles
     */
    get debugdisplay(){return "particle sets [" + this.sets.length + 
    "] particles [" + this.#count + "]";}
}
/******************************
 * rectangle.js by Hurray Banana 2023-2024
 ******************************/ 

/** @classdesc support for box areas (rectangle with depth) */
class Box{
    /** @type {vector3} top front left corner of box */
    #corner;
    /** @type {vector3} width, height and depth of box */
    #dimension;

    /** creates a box shape which defines a 3d cube area (3d rectangle)
     * @param {float} left 
     * @param {float} top 
     * @param {float} front 
     * @param {float} width 
     * @param {float} height 
     * @param {float} depth 
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
      if (front === undefined){
        this.#corner = left.clone;
        this.#dimension = top.clone;
      } else {
        this.#corner = new vector3(left, top, front);
        this.#dimension = new vector3(width, height, depth);
      }
    }
    /** @returns {float} gets the x centre of the box */
    get centrex(){return this.#corner.x + this.#dimension.x/2;}
    /** @returns {float} gets the y centre of the box */
    get centrey(){return this.#corner.y + this.#dimension.y/2;}
    /** @returns {float} gets the z centre of the box */
    get centrez(){return this.#corner.z + this.#dimension.z/2;}
    /** @returns {vector3} gets the centre of the box */
    get centre(){return new vector3(this.#corner.x + this.#dimension.x/2,this.#corner.y + this.#dimension.y/2,this.#corner.z + this.#dimension.z/2);}
    /** @returns {float} gets the left hand side of the box @returns {float} */
    get x() { return this.#corner.x; }
    /** @returns {float} gets the top hand side of the box */
    get y() { return this.#corner.y; }
    /** @returns {float} gets the front hand side of the box */
    get z() { return this.#corner.z; }
    /** @param {float} value sets left side of box */
    set x(value){this.#corner.x = value;}
    /** @param {float} value sets top side of box */
    set y(value){this.#corner.y = value;}
    /** @param {float} value sets front side of box */
    set z(value){this.#corner.z = value;}
    /** @param {float} value sets width of box */
    set w(value){this.#dimension.x = value;}
    /** @param {float} value sets height of box */
    set h(value){this.#dimension.y = value;}
    /** @param {float} value sets depth of box*/
    set d(value){this.#dimension.z = value;}

    /** @returns {float} gets the left hand side of the box */
    get l() { return this.#corner.x; }
    /** @returns {float} gets the right hand side of the box */
    get r() { return this.#corner.x + this.#dimension.x; }
    /** @returns {float} gets the top of the box */
    get t() { return this.#corner.y; }
    /** @returns {float} gets the bottom of the box */
    get b() { return this.#corner.y + this.#dimension.y; }
    /** @returns {float} width of box */
    get w() { return this.#dimension.x; }
    /** @returns {float} height of box */
    get h() { return this.#dimension.y; }   
    /** @returns {float} depth of box */
    get d() { return this.#dimension.z; } 

    /** @returns {float} gets the left hand side of the box */
    get left() { return this.#corner.x; }
    /** @returns {float} gets the right hand side of the box */
    get right() { return this.#corner.x + this.#dimension.x; }
    /** @returns {float} gets the top of the box */
    get top() { return this.#corner.y; }
    /** @returns {float} gets the bottom of the box */
    get bottom() { return this.#corner.y + this.#dimension.y; }
    /** @returns {float} gets the front of the box */
    get front() { return this.#corner.z; }
    /** @returns {float} gets the back of the box */
    get back() { return this.#corner.z - this.#dimension.z; }
    /** @returns {float} width of box */
    get width() { return this.#dimension.x; }
    /** @returns {float} height of box */
    get height() { return this.#dimension.y; }
    /** @returns {float} depth of box */
    get depth() { return this.#dimension.z; } 

    /** @returns {Box} creates a unit box with corner 0,0,0 and dimensions 1,1,1 */
    static get unit(){
      return new box(0,0,0,1,1,1);
    }
    /**
     * increases or decreases (-ve values decrease/+ve value increase) the dimensions of the box
     * @param {vector3} offsets specify the changes in width, height and depth of the box
     */
    flate(offsets){
        this.#corner.x -= offsets.x;
        this.#corner.y -= offsets.y;
        this.#corner.z -= offsets.z;
        this.#dimension.x += (offsets.x + offsets.w);
        this.#dimension.y += (offsets.y + offsets.h);
        this.#dimension.z += (offsets.z + offsets.d);
    }
  }
  /** @classdesc support for rectangular areas and actions upon them */
  class Rectangle{
    /** @type {float} left position */
    #x;
    /** @type {float} top position */
    #y;
    /** @type {float} width  */
    #w;
    /** @type {float} height  */
    #h;
    /**
     * 
     * @param {float} x left hand of rectangle
     * @param {float} y top of rectangle
     * @param {float} w width of rectangle
     * @param {float} h height of rectangle
     */
    constructor(x, y, w, h){
      this.#x = x;
      this.#y = y;
      this.#w = w;
      this.#h = h;
    }
    /** @returns {Rectangle} a new rectangle instance with the values of this one*/
    get clone(){return new Rectangle(this.#x,this.#y,this.#w,this.#h);}
    
    /**
     * copies this rectangles positions to the given rectangle
     * @param {Rectangle} here as clone but copies to this pre-existing rectangle
     */
    cloneto(here){
      here.x = this.#x;
      here.y = this.#y;
      here.w = this.#w;
      here.h = this.#h;
    }
    
    /** @returns {float} gets the horizontal centre of the rectangle */
    get centrex(){return this.#x + this.#w/2;}
    /** @returns {float} gets the vertical centre of the rectangle */
    get centrey(){return this.#y + this.#h/2;}
    /** @returns {vector3} gets the centre as a vector3 object - can be used in place of a vector2 */
    get centre(){return new vector3(this.#x + this.#w/2,this.#y + this.#h/2,0);}

    /** @returns {float} left hand side of rectangle */
    get x(){return this.#x;}
    /** @returns {float} top of rectangle */
    get y(){return this.#y;}
    /** @returns {float} width of rectangle */
    get w(){return this.#w;}
    /** @returns {float} width of rectangle */
    get width(){return this.#w;}
    /** @returns {float} height of rectangle */
    get h(){return this.#h;}
    /** @returns {float} height of rectangle */
    get height(){return this.#h;}
    /** @param {float} value  the left side of the rectangle*/
    set x(value){this.#x = value;}
    /** @param {float} value  the top of the rectangle*/
    set y(value){this.#y = value;}
    /** @param {float} value  the width of the rectangle*/
    set w(value){this.#w = value;}
    /** @param {float} value  the height of the rectangle*/
    set h(value){this.#h = value;}
    //area names
    /** @returns {float} left hand side of rectangle */
    get l(){return this.#x;}
    /** @returns {float} top of rectangle */
    get t(){return this.#y;}
    /** @returns {float} right hand side of rectangle */
    get r(){return this.#x + this.#w;}
    /** @returns {float} bottom of rectangle */
    get b(){return this.#y + this.#h;}
    //area names
    /** @returns {float} left hand side of rectangle */
    get left(){return this.#x;}
    /** @returns {float} top of rectangle */
    get top(){return this.#y;}
    /** @returns {float} right hand side of rectangle */
    get right(){return this.#x + this.#w;}
    /** @returns {float} bottom of rectangle */
    get bottom(){return this.#y + this.#h;}    
  
    /** @returns {Rectangle} a new instance Rectangle(0,0,0,0) */
    static get zero(){return new Rectangle(0,0,0,0);}
    /** @returns {Rectangle} a new instance Rectangle(1,1,1,1) */
    static get one(){return new Rectangle(1,1,1,1);}
    /**
     * determines if a point is inside (or touching) this Rectangle
     * @param {float} x x position of point
     * @param {float} y y position of point
     * @returns {bool} true if it is false if it isn't
     */
    in(x, y){
      return  x >= this.#x &&
              x <= (this.#x + this.#w) &&
              y >= this.#y &&
              y <= (this.#y + this.#h);
    }
    /** determines if this rectanlge intersects with the given rectangle 
     * NOT IMPLEMENTED YET
    */
    intersects(r){
      //return ()
    }
    /**
     * creates a random position outside of this rectangle, 
     * if margin and maxdistance are undefined you'll get a point on the edge of the rectangle
     * @param {float} margin and amount of padding outside the rectangle (essentially a little bit of inflate)
     * @param {float} maxdistance how far outside the rectangle to go, 0 would be on edge of rectangle 100 would be at most 100 pixels away
     * @returns {{x:float,y:float}} an x y object to be used to set a vector2 or vector3
     */
    randomoutside(margin, maxdistance){
      margin = (margin === undefined) ? 0 : margin;
      maxdistance = (maxdistance === undefined) ? 0 : maxdistance;
      let p =ranInt(8);
      let x;let y;
      switch (p){
        case 0:
          x = ranBetween(this.l - margin - maxdistance, this.l - margin);
          y = ranBetween(this.t - margin - maxdistance, this.t - margin);
          return {x:x,y:y};
        case 1:
          x = ranBetween(this.l, this.r);
          y = ranBetween(this.t - margin - maxdistance, this.t - margin);
          return {x:x,y:y};
        case 2:
          x = ranBetween(this.r + margin, this.r + margin + maxdistance);
          y = ranBetween(this.t - margin - maxdistance, this.t - margin);
          return {x:x,y:y};
        case 3:
          x = ranBetween(this.l - margin - maxdistance, this.l - margin);
          y = ranBetween(this.t, this.b);
          return {x:x,y:y};
        case 4:
          x = ranBetween(this.r + margin, this.r + margin + maxdistance);
          y = ranBetween(this.t, this.b);
          return {x:x,y:y};
        case 5:
          x = ranBetween(this.l - margin - maxdistance, this.l - margin);
          y = ranBetween(this.b + margin, this.b + margin + maxdistance);
          return {x:x,y:y};
        case 6:
          x = ranBetween(this.l, this.r);
          y = ranBetween(this.b + margin, this.b + margin + maxdistance);
          return {x:x,y:y};
        case 7:
          x = ranBetween(this.r + margin, this.r + margin + maxdistance);
          y = ranBetween(this.b + margin, this.b + margin + maxdistance);
          return {x:x,y:y};
      }
    }
    /**
     * creates a random position outside of this rectangle, 
     * if margin and maxdistance are undefined you'll get a point on the edge of the rectangle
     * @param {float} margin and amount of padding outside the rectangle (essentially a little bit of inflate)
     * @param {float} maxdistance how far outside the rectangle to go
     * @returns {vector3} random position requested
     */
    randomoutsideVector3(margin, maxdistance){
      margin = (margin === undefined) ? 0 : margin;
      maxdistance = (maxdistance === undefined) ? 0 : maxdistance;
      let p =ranInt(8);
      let x;let y;
      switch (p){
        case 0:
          x = ranBetween(this.l - margin - maxdistance, this.l - margin);
          y = ranBetween(this.t - margin - maxdistance, this.t - margin);
          return new vector3(x,y);
        case 1:
          x = ranBetween(this.l, this.r);
          y = ranBetween(this.t - margin - maxdistance, this.t - margin);
          return new vector3(x,y);
        case 2:
          x = ranBetween(this.r + margin, this.r + margin + maxdistance);
          y = ranBetween(this.t - margin - maxdistance, this.t - margin);
          return new vector3(x,y);
        case 3:
          x = ranBetween(this.l - margin - maxdistance, this.l - margin);
          y = ranBetween(this.t, this.b);
          return new vector3(x,y);
        case 4:
          x = ranBetween(this.r + margin, this.r + margin + maxdistance);
          y = ranBetween(this.t, this.b);
          return new vector3(x,y);
        case 5:
          x = ranBetween(this.l - margin - maxdistance, this.l - margin);
          y = ranBetween(this.b + margin, this.b + margin + maxdistance);
          return new vector3(x,y);
        case 6:
          x = ranBetween(this.l, this.r);
          y = ranBetween(this.b + margin, this.b + margin + maxdistance);
          return new vector3(x,y);
        case 7:
          x = ranBetween(this.r + margin, this.r + margin + maxdistance);
          y = ranBetween(this.b + margin, this.b + margin + maxdistance);
          return new vector3(x,y);
      }
    }
    /**
     * creates a rnadom position inside this rectangle
     * @param {float} margin and amount of padding insode the rectangle (essentially a little bit of deflate)
     * @returns {vector3} random position requested
     */
    randominsideVector3(margin){
      margin = (margin === undefined) ? 0 : margin;
      return new vector3(this.#x + margin + Math.random() * (this.#w - margin*2),this.#y +margin + Math.random() * (this.#h - margin*2));
    }
    /**
     * creates a rnadom position inside this rectangle
     * @param {float} margin and amount of padding insode the rectangle (essentially a little bit of deflate)
     * @returns {{x:float,y:float}} an x y object to be used to set a vector2 or vector3
     */
    randominside(margin){
      if (margin === undefined) {margin = 0;}
      return {x:this.#x + margin + Math.random() * (this.#w - margin*2),y:this.#y +margin + Math.random() * (this.#h - margin*2)};
    }
    /** produces a vector2 offset for this rectangle portion, this can be mapped back to an
     * original texture rectangle portion.
     * 
     * This was for some internal test code that no longer exists
     * @param {vector2|vector3|{x:int,y:int}} offsetportion 
     */
    sub(offsetportion){
      return new vector2(offsetportion.x - this.x, offsetportion.y - this.y);
    }
    /** produces a vector2 offset from a rectangle portion, this can be mapped back to an
     * original texture rectangle portion
     * 
     * This was for some internal test code that no longer exists
     * @param {Rectangle} rect 
     * @param {vector2|vector3|{x:int,y:int}} offsetportion 
     * @returns {vector2}
     */    
    static sub(rect, offsetportion){
      return new vector2(offsetportion.x - rect.x, offsetportion.y - rect.y);
    }
    /** displaces this rectangle by the given vector2 value
     * @param {vector2|vector3|{x:float,y:float}} offset 
     */
    displace(offset){
      this.#x += offset.x;
      this.#y += offset.y;
    }
    /** displaces this rectangle by the given vector2 value 
     * @param {Rectangle} rect rectangle to move
     * @param {vector2|vector3|{x:float,y:float}} offset 
    */
    static displace(rect, offset){
      rect.x += offset.x;
      rect.y += offset.y;
    }
    /** displaces this rectangle by the given vector2 value produces a new rectangle
     * @param {vector2|vector3|{x:float,y:float}} offset 
     * @returns {Rectangle} displaced version of the this rectangle
    */
    displaceNew(offset){
      return new Rectangle(this.x += offset.x, this.y += offset.y, this.w, this.h);
    }
    /** displaces this rectangle by the given vector2 value produces a new rectangle#
     * @param {Rectangle} rect rectangle to move
     * @param {vector2|vector3|{x:float,y:float}} offset 
     * @returns {Rectangle} displaced version of the given rectangle
    */
    static displaceNew(rect, offset){
      return new Rectangle(rect.x += offset.x, rect.y += offset.y, rect.w, rect.h);
    }
    /**
     * increases or decreases (-ve values decrease/+ve value increase) the dimensions of the rectangle
     * @param {vector2|vector3|{x:float,y:float}} offsets specify the changes in width, height of the rectangle
     */
    flate(offsets){
        this.#x -= offsets.x;
        this.#y -= offsets.y;
        this.#w += (offsets.x + offsets.w);
        this.#h += (offsets.y + offsets.h);
    }
    /** alters each side of the rectangle by the given amounts
     * @param {Rectangle} sides a rectangle were the x, y, w, h values added to the x, y, w and h of this rectangle
     */
    adjust(sides){
      this.#x += sides.x;
      this.#y += sides.y;
      this.#w += sides.w;
      this.#h += sides.h;
    }
    /** creates a new rectangle alters each side of the given rectangle by the given amounts
     * @param {Rectangle} rect base rectangel to adjust
     * @param {Rectangle} sides a rectangle were the x, y, w, h values added to the x, y, w and h of this rectangle
     * @returns {Rectangle} a newly adjusted version of the given rectangle
     */
    static adjust(rect, sides){
      return new Rectangle(rect.x + sides.x, rect.y + sides.y, rect.w + sides.w, rect.h + sides.h);
    }
}

/******************************
 * sprite.js by Hurray Banana 2023-2024
 ******************************/ 
/******************************
 * sprite enums
 ******************************/ 
/** @classdesc shape definitions for various sub systems to acknowledge */
class Shape {
    /** treat as circular during collisions */
    static circle = "circle";
    /** treat as rectangular during collisions */
    static rectangle = "rectangle";
}
/** @classdesc determines how sprite updates are performed */
class UpdateMode{
    /** movement is handled by the programmer */
    static manual = "manual";
    /** velocities handled by system */
    static auto = "auto";
    /** trackmanager will control the movement of the sprite */
    static autotrack = "autotrack";
    /** sprite is following a track but this is controlled by programmer */
    static manualtrack = "manualtrack";
}
/** @classdesc how x and y position of the sprite is used in relation to the sprite */
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

/** 
 * @classdesc for drawing and manipulating moving graphic objects
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
    static id = 0;
    //drag and drop stuff
    /** set to true to enable clicking
     * @type {bool}
     */
    clickable = false;
    /** NOT CURRENTLY IN USE @type {bool} */
    dragging = false; // Is the object being dragged?
    static dragAvailable = true;
    /**
     * returns true if given position is over this sprite
     * @param {float} x 
     * @param {float} y 
     * @returns {bool}
     */
    isover(x,y){
        return this.#renderrectangle.in(x, y);
    }
    
    //end of drag and drop stuff
    /** @type {float} on screen width*/
    #visW;
    /** @type {float} on screen height */
    #visH;
    /** @type {float} on screen half width*/
    #visWdiv2;
    /** @type {float} on screen half height */
    #visHdiv2;
    /** @type {Rectangle}rectangluar area of sprite */
    #renderrectangle = Rectangle.zero;
    /** if a colour is set then the render rectangle/circle will be shown for the sprite in the specified colour
     * set to null to not show the renderarea of the sprite
     * @type {colour}
    */
    showRenderArea = null;
    /* pre-calcs for visual size */
    #setvisibleSize(){
        this.#visW = this.frame.currentport.w * this.#scale.x;
        this.#visH = this.frame.currentport.h * this.#scale.y;
        //half sizes
        this.#visWdiv2 = this.#visW * 0.5;
        this.#visHdiv2 = this.#visH * 0.5;
        //set render position
        this.#renderrectangle.x = this.left;//this.centrex;
        this.#renderrectangle.y = this.top;//this.centrey;
        this.#renderrectangle.w = this.#visW;
        this.#renderrectangle.h = this.#visH;
    }
    /** forces metric calculations, use this if you have a reference to a sprite,
     * in normal circumstances you never need to call this*/
    setmetrics(){this.#setvisibleSize();}

    /** holds the animation system for the sprite 
     * 
     * you need to define frames and animations through the frame object
     * @example
     * 
     this.frame.define(txsprite, new Rectangle(138,213,32,32));//blinky 0
     this.frame.define(txsprite, new Rectangle(172,213,32,32));//blinky 1
     @type {Animator}
    */
    frame;
    /** @type {vector3} */
    #position;
    /** @type {float} */
    #angle;
    /** @type {vector2} */
    #scale;
    /** @type {bool} */
    #moving = true;
    /** returns true if the sprite moved since last frame 
     * @type {bool}
    */
    get inmotion(){return this.#position.x != this.lastposition.x || this.#position.y != this.lastposition.y}
    /** true if the sprite is moving for collision response purposes default is true
     * @type {bool}
    */
    get moving(){return this.#moving;}
    /** sets the moving property, if false during collisions no momentum will be transferred during collision response
     * 
     * if sprites are not repsonding to collisions properly ensure this is set to true
     * @param {bool} value 
     */
    set moving(value){ this.#moving = value;}
    /** true if the sprite is not moving for collision response purposes default is false
     * @returns {bool}
    */
    get static(){return !this.#moving;}
    /** sets the moving property, if true during collisions no momentum will be transferred during collision response
     * 
     * if sprites are not repsonding to collisions properly ensure this is set to false
     * @param {float} value 
     */
    set static(value){ this.#moving = !value;}
    #radius;
    #bradius;
    //** specifies the transparency of the sprite 0-1 default is 1 opaque*/
    #alpha = 1;
    /** gets the current alpha value of the sprite between 1 - opaque and 0 transparent.
     * default 1
     * @example this.alpha = 0.4; // 40 % opaque
     * @returns {float} 
    */
    get alpha(){return this.#alpha;}//255 * this.#alpha;}
    /** sets the current alpha value of the sprite between 1 - opaque and 0 transparent.
     * default 1
     * @example this.alpha = 0.4; // 40 % opaque
     * @param {float} value 
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
     * @type {Align}
     */
    align = Align.centre;
    /** holds the last position the sprite was at */
    lastposition = vector3.zero;
    /** the update period (in seconds) for the sprite to force the update to only occur now and then, just like space invaders movement
     * 
     * @type {float} time interval to wait between updates
    */
    updatePeriod = 0;
    /** keeps track of the time elapsed if a sprite is using an updatePeriod.
     * Do not change this value
     * @type {float}
     */
    elapsedTime = 0;
    /** @type {bool} whether clipping is active */
    #clip = false;
    /** @type {bool} */
    #cliplimit = false;
    /** holds the clip area for the sprite if manually specified */
    #cliparea = null;
    /** how sprite is updated - defaults to auto where sprite updates every frame using velocity,gravity and gravity wells to change position
     * @type {UpdateMode}
    */
    updateMode = UpdateMode.auto;
    /** @type {vector3} */
    #deltaposition = vector3.down;
    /** gets the distance (and direction moved by the sprite since last update) as a vector3
     * @returns {vector3}
    */
    get deltaposition(){return this.#deltaposition;}    // motion
    /** gets the distance (and opposite direction moved by the sprite since last update) as a vector3
     * @returns {vector3}
    */
    get deltapositionNegative(){return new vector3(-this.#deltaposition.x,-this.#deltaposition.y,-this.#deltaposition.z);}    
    // motion
    /** rotates the sprite so it is pointing in the direction of it's motion
     * This is independent of the velocity so will work for manual and track based motion
     * @example
     * this.faceMyDirection(); // point in direction moving (forwards)
     * this.faceMyDirection(180); // point opposite to direction (backwards)
     * @param {float} additionalangle amount in degrees
    */
    faceMyMovement(additionalangle){
        //if (this.updateMode == UpdateMode.auto){
            this.faceDirection(this.#deltaposition, additionalangle);
        //} else if (this.updateMode == UpdateMode.autotrack || this.updateMode == UpdateMode.manualtrack){
            this.faceDirection(this.#deltaposition, additionalangle);

            //this.#position.cloneto(this.#lasttrackposition);
            //this.track.positionCurrent.cloneto(this.#position);
        //}
        //this.faceDirection(this.myDirection);
        return;
        if (additionalangle === undefined){
            additionalangle = 0;
        } else {
            additionalangle *= Math.PI / 180;
        }
        this.#angle = vector3.anglefromdirection(this.#deltaposition,additionalangle);
    }
    /**
     * rotates sprite so it is turned in the same direction it is moving
     * @param {float} additionalangle amount in degrees
     */
    faceMyVelocity(additionalangle){
        this.faceDirection(this.velocity, additionalangle);
    }    
    /**
     * rotates a sprite so it is turned in the same direction as the given vector
     * @param {vector3} direction vector to rotate the sprite to point in the direction of
     * @param {float} additionalangle amount in degrees
     */
    faceDirection(direction, additionalAngle){
        if (additionalAngle === undefined){
            additionalAngle = 0;
        } else {
            additionalAngle *= Math.PIby180;// Math.PI / 180;
        }
        this.#angle = vector3.anglefromdirectionR(direction,additionalAngle);        
    }
    /** takes rotation angle of sprite and sets the velocity to move in this direction
     * 
     * 0 degrees is up
     * @param {float} speed the speed in pixels per second 
     * @param {float} additionalangle amount in degrees
     */
    velocityInCurrentDirection(speed, additionalAngle){
        if (additionalAngle === undefined){
            additionalAngle = 0;
        } else {
            additionalAngle *= Math.PIby180;//Math.PI / 180;
        }
        this.vx = Math.cos(additionalAngle + this.#angle - Math.PIby2) * speed;
        this.vy =  Math.sin(additionalAngle + this.#angle - Math.PIby2) * speed;
        this.velocity.z = 0;
    }
    /**
     * 
     * @param {float} additionalAngle a further angle to add on to sprites direction. Use 180 to get your opposite direction or 90/-90 for normals
     * @returns {vector3} a normalised direction vector
     */
    myDirection(additionalAngle){
        if (additionalAngle === undefined){
            additionalAngle = this.#angle;
        } else {
            additionalAngle = this.#angle + additionalAngle * Math.PIby180;//Math.PI / 180;
        }  
        return new vector3(Math.cos(additionalAngle - Math.PIby2),
                            Math.sin(additionalAngle - Math.PIby2), 0);    
    }
    /**  NOT IMPLEMENTED YET
     * takes the sprites movement delta and sets a velocity to continue in this direction 
     * Could be used to take over motion of a player controlled character or if you detatch a sprite
     * from a track
     * 
     * if speed is omitted then the direction is taken as a fraction of the overall delta and a velocity is computed
     * to try and carry on the current movement speed
     * @param {float} speed 
     *
    */
    velocityFromMovement(speed){
        if (speed === undefined){
            speed = Engine.delta;
        }
        //STILL NEEDS IMPLEMENTING
    }
    /** Determines if  rotating clockwise or anticlockwise is closest for a sprite to turn towards a  position
    * Useful for create homing and tracking effects, returns -1 if turned anti-clocwise, 1 if clockwise or 0 if didn't turn
    * @param to position aiming for
    * @param minimumAngle the step size to turn by, if rotation required is less than this then 0 will be returned
    * 
    * @returns {float} -1 if turned anti-clocwise, 1 if clockwise or 0 if didn't turn */
    angularDirectionTo(to, minimumAngle)
    {
            let dv = vector3.directionfromangle(this.#angle, 0);

            //calc direction to target
            let d = vector3.sub(to, this.#position);
            d.normalise();
            let dot = vector3.dot(dv, d);
            let crossz = vector3.crosszonly(dv, d);
    
            if (dot < 0 || Math.abs(dot) < Math.cos(minimumAngle* Math.PIby180/*Math.PI / 180*/))
                return (crossz < 0) ? -1 : 1;
            else
                return 0;                
    }
    //rotateTowards(to, minimumAngle)
    /**
     * @type {vector3}
     */
    #velocity;
    #vr;
    /** friction value @type {float} */
    #friction;
    /**the energy reduction co-efficient @type {float}*/
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
     * @type {float}
     */
    energylevel = 1;
    /** collision co-efficient for energy loss
     * 
        if 1 maintains 100% energy after collision,

        less than 1 reduces energy, 0.75f would be 75%, 

        more than 1 increases energy, 1.25f would be 125% energy 
        @returns {float} */
    get e(){
        this.energylevel *= this.#e;
        return this.#e;
    }
    /** collision co-efficient for energy loss
     * 
     * @example
        if 1 maintains 100% energy after collision,

        less than 1 reduces energy, 0.75f would be 75%, 

        more than 1 increases energy, 1.25f would be 125% energy 
        @param {float} value 
        */
    set e(value){this.#e = value;this.energylevel=1;}
    /** gravity vector in 3d, to apply to the sprite, set to null to turn gravity off (default) */
    gravity = null;
    /** gravity well objects, for this sprite there can be more than one - to be implemented 
     * @type {[]GravityWell}
    */
    #gravitywell = null;
    /** gets the current gravity wells for this sprite - if non then null otherwise will be a list of wells 
     * @returns {[]GravityWell}
    */
    get gravitywell(){return this.#gravitywell;}
    /** adds a gravity well to this sprite 
     * @example
     * this.gravitywell = new GravityWell(new vector3(width/2,height/2,0), 100); //set 100 GigaTon well at centre of screen
     * @param {GravityWell} value 
    */
    set gravitywell(value){
        if (this.#gravitywell == null){
            this.#gravitywell = [];
        }
        this.#gravitywell.push(value);
    }
    /** if true a quick calculation of gravitional force is computed rather than GMMr2
     * 
     * (default true)
     * @type {bool} */
    gravityrough = true;
    /** holds the scale percentage increase per second to apply to the sprite vector2(0,0) is the default, no scaling
     * @example
     * this.vscale = vector2(1,1); //would be 100% per second
     * @type {vector2}
     */
    vscale = vector2.zero;;

    //properties
    /** holds the mass of the sprite in Kg used for gravity calculations (default will be set to number of non alpha pixels)
    * 
    * defaults to 100 (if you don't set it)
    * @type {float}
    */
    mass = 100;
    /** specifies if position is relative to the canvas view or the world co-ordinates which may be large. 
    *
    * default is world (true), 
    *
    * set to false to draw at same position in viewport despite any scrolling or offset of the world
    * @type {bool}
    * */
    world = true;//x y coords tied to world of just viewport region
    /** holds a reference to the track manager for the sprite, this has to be explicitly set in your sprites constructor
     * @example
     * this.track = new TrackManager(this);
     * @type {TrackManager}
    */
    track = null;
    /** @type {vector3} */
    #lasttrackposition = vector3.zero;
    /** gets the last position occupied by a tracking sprite 
     * @returns  {vector3}
    */
    get lasttrackposition(){return this.#lasttrackposition;}
    //** sets the last trackposition of a sprite */
    //set lasttrackposition(value){return this.#lasttrackposition = value;}

    /** do we want to work with z co-ordinates default if true (not implemented fully yet)
     * @type {bool}
    */
    workin3d = true;
    /** which drawing layer to render the sprite on
    *
    * layers are rendered from lowest to highest (0 - 3)
    * @example
    * this.layer = Engine.layer(0); //to set on layer 0 (back layer)
    * @type {texture}
    */
    layer;
    /** determines if the sprite reacts to a specified rectangular boundary, see Limit static member functions for limit modes
    *
    *must be set in the constructor
    * @example
    *this.limit = new Limit(Limit.wrap, Engine.mainview);
    * @type {Limit}
    */
    limit = null;

    #dead;
    #visible = false;
    #timer;
    /** holdsd refence to history object for this sprite, defaults to null. 
     * You must create this in your constructor if you wish to use history effects
     * @example
     * this.history = new History(this);
     * @type {History}
     */
    history = null;
    /**method called when the sprite is hidden with 
     *  or settting visible to false, or from flashing 
     * @example this.hide();*/
    #callbackHide = null;
    /** retrieves the current callback (if this has not been set it will be null)
     * it will be in the form of object properties
     * @returns {{callback:method|function,instance:object}}
     * @example 
     * // two propeties callback and instance
     * let callstuff = this.callbackHide;
     * if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
     */
    get callbackHide(){return this.#callbackHide;}
    /**
     * sets (or changes) the callback handler called when a sprite is hidden
     * value must be an object with 2 properties
     * @param {{callback:method|function,instance:object}} value
     * @example // hidesound is a method of your inherited sprite class
     * this.callbackHide = {callback:this.hidesound,instance:this};
     * // or use the Engine.makeCallback() method
     * this.callbackHide = Engine.makeCallback(this.hidesound, this);
     */
    set callbackHide(value){
      if (value != undefined && value.callback !== undefined && value.instance !== undefined){
        this.#callbackHide = value;
      }
    }    
    /**method called when the sprite is shown with show() or setting visible to true*/
    #callbackShow = null;
    /** retrieves the current callback (if this has not been set it will be null)
     * it will be in the form of object properties
     * @returns {{callback:method|function,instance:object}}
     * @example 
     * // two propeties callback and instance
     * let callstuff = this.callbackShow;
     * if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
     */
    get callbackShow(){return this.#callbackShow;}
    /**
     * sets (or changes) the callback handler called when a sprite is shown
     * value must be an object with 2 properties
     * @param {{callback:method|function,instance:object}} value
     * @example // showsound is a method of your inherited sprite class
     * this.callbackShow = {callback:this.showsound,instance:this};
     * // or use the Engine.makeCallback() method
     * this.callbackShow = Engine.makeCallback(this.showsound, this);
     */
    set callbackShow(value){
      if (value != undefined && value.callback !== undefined && value.instance !== undefined){
        this.#callbackShow = value;
      }
    }    

    #callbackCollide = null;
    /** retrieves the current callback (if this has not been set it will be null)
     * it will be in the form of object properties
     * @returns {{callback:method|function,instance:object}}
     * @example 
     * // two propeties callback and instance
     * let callstuff = this.callbackCollide;
     * if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
     */
    get callbackCollide(){return this.#callbackCollide;}
    /** method called if this sprite is involved in a collision but only if this is a collisionPrimary 
     * @param {{callback:method|function,instance:object}} value
     * 
     * @example 
     * this.callbackCollide = {callback:this.hitsomething,instance:this};
     * // or use the Engine.makeCallback() method
     * this.callbackCollide = Engine.makeCallback(this.hitsomething, this);
     * 
     * //the routine needs to accept a parameter (which will be a reference to the sprite hit)
     * hitsomething(hit){
     *      if (hit instanceof Invader){
     *          hit.kill(); // kill sprite we hit
     *          this.kill(); //kill this bullet
     *          return true; //stop processing anymore collisions for this bullet
     *      } else {
     *          return false; //continue collision processing for this sprite
     *      }
     * }

     * @param {{callback:method|function,instance:object}} value 
     */
    set callbackCollide(value){
      if (value != undefined && value.callback !== undefined && value.instance !== undefined){
        this.#callbackCollide = value;
      }
    }    
    /** method called when a sprite is destroyed using kill() */
    #callbackFuneral = null;
    /** retrieves the current callback (if this has not been set it will be null)
     * it will be in the form of object properties
     * @returns {{callback:method|function,instance:object}}
     * @example 
     * // two propeties callback and instance
     * let callstuff = this.callbackFuneral;
     * if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
     */
    get callbackFuneral(){return this.#callbackFuneral;}
    /**
     * sets (or changes) the callback handler called when animation states reach an end point
     * value must be an object with 2 properties
     * @example // idied is a method of your inherited sprite class
     * this.callbackFuneral = {callback:this.idied,instance:this};
     * // or use the Engine.makeCallback() method
     * this.callbackFuneral = Engine.makeCallback(this.idied, this);
     * idied(){
     *      //make explosion at the dead sprites position
     *      new explosion(this.x, this.y);
     * }
     * @param {{callback:method|function,instance:object}} value 
     */
    set callbackFuneral(value){
      if (value != undefined && value.callback !== undefined && value.instance !== undefined){
        this.#callbackFuneral = value;
      }
    }    
    //collision stuff
    /** must be set to true for sprite to be involved in collisions */
    #collidable = false;
    /** indicates whether this sprite is part of collision checks
     * @returns {bool}
     */
    get collidable(){return this.#collidable;}
    /** indicates if this sprite should be considered during collision detection
     * @param {bool} value 
     */
    set collidable(value) {
        this.#collidable = value;
        if (value){
            Engine.spM.collisionJoin(this);
        } else {
            Engine.spM.collisionLeave(this);
        }
    }
    /** if true then this sprites callbackCollide is called during collisions */
    #collisionPrimary = false;
    /** indicates if this sprite is a primary collider or not
     * @returns {bool}
     */
    get collisionPrimary(){return this.#collidable;}
    /** if true then this sprite will check to see if it has hit other sprites
     * A corresponding collisionCallback should be creared to process these collisions
     * @param {bool} value set to true or false
     */
    set collisionPrimary(value) {
        this.#collisionPrimary = value;
        if (value){
            Engine.spM.collisionPJoin(this);
        } else {
            Engine.spM.collisionPLeave(this);
        }
    }
    /** a list of object types to check in the sprite list for collision, only those in the list will be checked
     * This only applies to sprites that are collisionPrimary
     * @example this.collisionList = [Ghost, Fruit];
     * @type {[]object} an array containing the object types that should be checked for, use a list [Sprite] to include all sprites
     */
    collisionList;

    /** create a new sprite
     * 
     * make sure in your constructor after calling super(); that you add the sprite to the Engine for processing to occur
     * 
     * @example 
     * Engine.spM.add(this);
     */
    constructor(){
        this.myid = Sprite.id++;

        this.frame = new Animator(this);
        this.#dead = false;
        this.#visible = false;
        this.#position = vector3.zero;
        this.#timer = null;
        this.#angle = 0;
        this.#scale = vector2.one;
        this.layer = Engine.layer(0);
        this.limit = null;
        this.align = Align.centre;
        //motion
        this.#velocity = vector3.zero;
        this.#vr = 0;
        this.#friction = 0;
        // framsets
    }
    /** represents a unique id for a sprite
     * This can be used in debugging making a conditional breakpoint when a specific sprite id is being processed
     * You shouldn't change this value
     * @type {int}
     */
    myid;
    /**
     * removes any references when a sprite is killed or romved from the sprite manager
     * if you have added object references in an inherited sprite you should provide a cleanup() method to remove
     * those specific ones. make sure you call super.cleanup() if you create one
     * @example
     *     cleanup(){
                super.cleanup();
                //get rid of custome timer
                this.shoottimer.remove();
                //get rid of child sprites
                this.frontdetector.kill();
                this.reardetector.kill();
            }
     */
    cleanup(){
        if (this.#timer != null){this.#timer.remove();this.#timer = null;}
        if (this.history != null){this.history.cleanup();this.history = null;}
        if (this.frame != null){this.frame.cleanup();this.frame = null};
        if (this.limit != null){this.limit.cleanup();this.limit = null;}
        if (this.#gravitywell != null) {this.#gravitywell.cleanup();this.#gravitywell = null;}
        if (this.track != null){this.track.cleanup();this.track = null;}
        this.#callbackCollide = null;
        this.#callbackFuneral = null;
        this.#callbackHide = null;
        this.#callbackShow = null;
        if (this.collidable) Engine.spM.collisionLeave(this);
        if (this.#collisionPrimary) Engine.spM.collisionPLeave(this);
    }
    /** returns true if the sprite circlular area is ovelapping the given sprites circlular area
     * @param {Sprite}
     * @returns {bool}
    */
    intersectBC(other){
        let rdist2 = vector2.distanceSQ(this.position, other.position);
        let radiiSum2 = (this.radius + other.radius)**2;
        return rdist2 < radiiSum2;
    }
    /** use this in a sprite callBackFuneral to stop a dead sprite being removed*/
    resurrect(){this.#dead = false;}
    /** returns true if sprite is dead, pending removal 
     * 
     * removal can be halted by using resurrect in a funeral callback, if you have defined one or by overloading the kill() method and not calling super.kill()
     * @example  this.resurrect();
     * @returns {bool}
    */
    get dead() {return this.#dead;}
    /** returns true if the sprite is still actively being processed and displayed
     * @returns {bool}
    */
    get alive() { return !this.#dead;}

    /** gets the rotation angle of the sprite in degrees
    * @returns {float} in degrees
    */
    get angle(){return this.#angle / Math.PIby180 /*/Math.PI * 180*/;}
    /** sets the rotation angle of the sprite in degrees
     * @example this.angle = 45;
     * @param {float} value in degrees (0 is north, default orientation)
    */
    set angle(value){return this.#angle = value * Math.PIby180 /* Math.PI / 180*/;}
    /** gets the angle of the sprite in radians (for trig work) 
     * @returns {float} in radians
    */
    get angleR(){return this.#angle;}
    /** sets the angle of the sprite in radians
     * useful when you have done some trig and already have radians
     * @param {float} value in Radians
     */
    set angleR(value){this.#angle = value;}
    /** gets the singular scale of the sprite applied to both width and height
     * @returns {float}
    */
    get scale1d(){return (this.#scale.x + this.#scale.y)/2;}
    /** applies a single scale value to the width and height of the sprite
     * @example this.scale = 2;
     * @param {float} value 
    */
    set scale1d(value){
        this.#scale.x = this.#scale.y = value;
        this.#setvisibleSize();
    }    
    /** gets the x and y scale as a vector2 value 
     * @returns {vector2}
    */
    get scale(){return this.#scale;}
    /** sets the x and y scale as a vector2 value
     * @param {vector2} value 
     */
    set scale(value){
        this.#scale = value;
        this.#setvisibleSize();
    }

    /** gets the scale for the width of the sprite
     * @returns {float}
    */
    get sx() {return this.#scale.x;}
    /** sets the scale for the width of the sprite
     * @example this.sx = 4;
     * @param {float} value 
    */
    set sx(value) {
        this.#scale.x = value;
        this.#setvisibleSize();
    }

    /** gets the scale for the height of the sprite
     * @returns {float}
    */
    get sy() {return this.#scale.y;}
    /** sets the scale for the height of the sprite
     * @example this.sy = 0.5;
     * @param {float} value 
    */
    set sy(value) {  
        this.#scale.y = value;
        this.#setvisibleSize();
    }
    /**
     * Makes the sprite appear this exact size (for the current frame)
     * @param {{w:float,y:float}|vector2|vector3} size 
     */
    set scaleTo(size){
        this.scale = {x:size.w/this.frame.currentport.w,y:size.h/this.frame.currentport.h};
    }
    /**
     * sets the scale of the sprite to this exact width for current frame
     * keeping aspect ratio
     * @param {float} width 
     */
    set scaleWidthTo(width){
        this.scale1d =  width/this.frame.currentport.w;
    }
    /**
     * sets the scale of the sprite to this exact height for current frame
     * keeping aspect ratio
     * @param {float} height 
     */
    set scaleHeightTo(height){
        this.scale1d =  height/this.frame.currentport.h;
    }
    /** get the timer for basic sprite actions
    * 
    * by default this is null, no timer
    * @returns {Timer}
    */
    get timer(){return this.#timer;}
    /** holds the basic sprite timer actions 
     * 
     * create the timer with @example  this.timer = new Timer(this);
     * @param {Timer} value 
    */
    set timer(value){this.#timer = value;}

    /** returns true if sprite is set to be displayed
    *
    * use show() hide() to manipulate this
    * @returns {bool}
    */
    get visible() {return this.#visible && this.frame.currenttex != null;}

    /** sets the visible state of the sprite true, means show, false means hide
    *
    * if hide and show callbacks are set then these will be called appropriately
    * @example 
    * //toggle visibility
    * this.visible = !this.visible;
    * @param {bool} value 
    */
    set visible(value) {
        if (value) this.show(); else this.hide();
    }

    /** makes this sprite visible/renders if on screen calling the show callback if set
     * @example this.show();
     */
    show(){
        //if currently not showing do show callback - why did I comment out??
        if (!this.visible) Engine.processCallback(this.#callbackShow);

        this.#visible = true;

    }
    /** makes this sprite invisible/won't be rendered calling the hide callback if set
     * @example this.hide();
    */
    hide(){
        // why did I comment out??
        if (this.visible) Engine.processCallback(this.#callbackHide);

        this.#visible = false;
    }
    /** specifies the rough shape of the sprite (not currently used but will eventually affect collision detection) 
     * @type {Shape}
    */
    shape = Shape.circle;
 
    /** gets the sprites position (it's centre) as a vector3(x,y,z)
     * @returns {vector3}
     */
    get position() {return this.#position;}
    /** sets the sprites position (it's centre) as a vector3(x,y,z) 
     * @param {vector3} value 
    */
    set position(value) {this.#position = value;}

    /** sets the sprites x position (currently the centre of the sprite) 
     * @returns {float}
    */
    get x() {return this.#position.x;}
    /** sets the sprites x position (currently the centre of the sprite)
     * @param {float} value 
     */
    set x(value) {this.#position.x = value;this.#renderrectangle.x = this.left;}

    /** gets the sprites y position (currently the centre of the sprite)
     * @returns {float}
     */
    get y() {return this.#position.y;}
    /** sets the sprites y position (currently the centre of the sprite)
     * @param {float} value 
    */
    set y(value) {this.#position.y = value;this.#renderrectangle.y = this.top;}

    /** gets the sprites z position (not currently used but will influence draw order) could be used for depth based scaling
     * 
     * smaller is further away
     * @returns {float}
     */
    get z() {return this.#position.z;}
    /** sets the sprites z position (not currently used but will influence draw order) could be used for depth based scaling 
     * 
     * smaller is further away
     * @param {float} value 
    */
    set z(value) {this.#position.z = value;}

    //change to visible width per-calcs
    /** gets the width of the sprite (as affected by the current x scale) 
     * @returns {float}
    */
    get width() {return this.#visW;}//this.frame.current.port.w * this.#scale.x;}// this.#portion.w* this.#scale;}

    /** gets the height of the sprite (as affected by the current y scale) 
     * @returns {float}
    */
    get height() {return this.#visH;}//this.frame.current.port.h * this.#scale.y;} //this.#portion.h* this.#scale;}
    /** gets the centre of the sprite as a vector3 object 
     * @returns {vector3}
    */
    get centre(){return new vector3(this.centrex, this.centrey,this.#position.z);}
    /** sets the centre of the sprite based on it's alignment using a vector3 value
     * @param {vector3} value 
    */
    set centre(value){
        this.centrex = value.x;
        this.centrey = value.y;
        this.z = value.z;
    }
    /** returns the x centre of the sprite (same a y currently) 
     * @returns {float}
    */
    get centrex() {
        switch (this.align){
            case Align.topLeft:case Align.left:case Align.bottomLeft:return this.#position.x + this.#visWdiv2;// this.width/2;
            case Align.top:case Align.centre:case Align.bottom:return this.#position.x;
            case Align.topRight:case Align.right:case Align.bottomRight:return this.#position.x - this.#visWdiv2;//this.width/2;
        }
    }
    /** Sets the horizontal centre of the sprite (taking alignment into account)
     * @param {float} value 
     */
    set centrex(value){
        switch (this.align){
            case Align.topLeft:case Align.left:case Align.bottomLeft:return this.#position.x = value - this.#visWdiv2;//this.width/2;
            case Align.top:case Align.centre:case Align.bottom:return this.#position.x = value;;
            case Align.topRight:case Align.right:case Align.bottomRight:return this.#position.x = value + this.#visWdiv2;//this.width/2;
        }
    }
    /** returns the y centre of the sprite (same a y currently) 
     * @returns {float}
    */
    get centrey() {
        switch (this.align){
            case Align.topLeft:case Align.top:case Align.topRight:return this.#position.y + this.#visHdiv2;// this.height/2;
            case Align.left:case Align.centre:case Align.right:return this.#position.y;
            case Align.bottomLeft:case Align.bottom:case Align.bottomRight:return this.#position.y - this.#visHdiv2;//this.height/2;
        }
    }
    /** Sets the vertical centre of the sprite (taking alignment into account)
     * @param {float} value 
     */
    set centrey(value){
        switch (this.align){
            case Align.topLeft:case Align.top:case Align.topRight:return this.#position.y = value - this.#visHdiv2;//this.height/2;
            case Align.left:case Align.centre:case Align.right:return this.#position.y = value;
            case Align.bottomLeft:case Align.bottom:case Align.bottomRight:return this.#position.y = value + this.#visHdiv2;//this.height/2;
        }
    }
    /** gets the x offset to its centre (half the width) 
     * @returns {float}
    */
    get centreoffx() {return -this.#visWdiv2/*this.width/2*/;}
    /** gets the y offset to its centre (half the height)
     * @returns {float}
     */
    get centreoffy() {return -this.#visHdiv2/*this.height/2*/;}

    // THESE GETTERS and SETTERS NEED TO TAKE ALIGNMENT INTO ACCOUNT ??
    /** gets the x value of the left of the sprite (the x and y values represent the centre of a sprite) 
     * @returns {float}
    */
    get left() {
        return this.centrex - this.#visWdiv2;
        //return this.x - this.width/2;
    }
    /** sets sprites bottom to be this value y value is adjusted accordingly (the x and y values represent the centre of a sprite) 
     * @example this.left = 450;
     * @param {float} value 
    */
    set left(value) {
        switch (this.align){
            case Align.topLeft:case Align.left:case Align.bottomLeft: this.#position.x = value;return;
            case Align.top:case Align.centre:case Align.bottom: this.#position.x = value + this.#visWdiv2;return;
            case Align.topRight:case Align.right:case Align.bottomRight: this.#position.x = value + this.#visW;return;
        }
    }

    /** gets the x value of the right of the sprite (the x and y values represent the centre of a sprite) 
     * @returns {float}
    */
    get kright() {
        return this.centrex + this.#visWdiv2;
    }
    /** sets sprites bottom to be this value y value is adjusted accordingly (the x and y values represent the centre of a sprite) 
     * @example this.right = 200;
     * @param {float} value 
    */
    set kright(value){
        switch (this.align){
            case Align.topLeft:case Align.left:case Align.bottomLeft: this.#position.x = value - this.#visW;return;
            case Align.top:case Align.centre:case Align.bottom: this.#position.x = value - this.#visWdiv2;return;
            case Align.topRight:case Align.right:case Align.bottomRight: this.#position.x = value;return;
        }
    }

    /** gets the y value of the top of the sprite (the x and y values represent the centre of a sprite) 
     * @returns {float}
    */
    get top() {
        return this.centrey - this.#visHdiv2;
    }
    /** sets sprites bottom to be this value y value is adjusted accordingly (the x and y values represent the centre of a sprite)
     * @example this.top = 0; //sprite aligned with top at top of screen
     * @param {float} value 
     */
    set top(value) {
        switch (this.align){
            case Align.topLeft:case Align.top:case Align.topRight:this.#position.y = value;break;
            case Align.left:case Align.centre:case Align.right:this.#position.y = value + this.#visHdiv2;break;
            case Align.bottomLeft:case Align.bottom:case Align.bottomRight:this.#position.y = value + this.#visH;break;
        }
    }

    /** gets the y value of the bottom of the sprite (the x and y values represent the centre of a sprite)
     * @returns {float}
     */
    get bottom() {
        return this.centrey + this.#visHdiv2;
    }
    /** sets sprites bottom to be this value y value is adjusted accordingly (the x and y values represent the centre of a sprite) 
     * @example this.bottom = height; // set sprites bottom to the bottom edge of screen
     * @param {float} value 
    */
    set bottom(value) {
        switch (this.align){
            case Align.topLeft:case Align.top:case Align.topRight:this.#position.y = value - this.#visH;break;
            case Align.left:case Align.centre:case Align.right:this.#position.y = value - this.#visHdiv2;break;
            case Align.bottomLeft:case Align.bottom:case Align.bottomRight:this.#position.y = value;break;
        }
    }//this.height/2;}

    /** a rough circular radius of the sprite, assuming the sprite is roughly square
     * @returns {float}
     */
    get radius() { return this.#visWdiv2;}//this.width/2};
    /** NOT IN USE a rough circular radius of the sprite 
     * @returns {float}
    */
    get bradius() { return this.#visWdiv2;}//this.width/2};

    //motion properties
    /** gets the fake friction value of sprite 
     * 
     * 0 is no friction
     * 
     * +ve values will reduce the sprites velocity (a value of 1 will take roughly 1 second to bring velocity down to zero )
     * 
     * -ve values will increase the sprites velocity
     * @returns {float}
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
     * @param {float} value 
     */
    set friction(value){this.#friction = value;}

    /** gets the velocity of the sprite as a vector3(x,y,z) 
     * @returns {vector3}
     * 
    */
    get velocity(){return this.#velocity;}
    /** sets the velocity of the sprite as a vector3(x,y,z) 
     * @example this.velocity = new vector3(100,0,0); // 100 pixels per second in x direction
     * @param {vector3} value 
     */
    set velocity(value){this.#velocity = value;}
    /** sets the x velocity of the sprite -ve is left +ve right
     * @returns {float}
    */
    get vx() { return this.#velocity.x;}
    /** sets the x velocity of the sprite -ve is left +ve right
     * @example this.vx = 100; //100 pixels per second right
     * @param {float} value 
    */ 
    set vx(value) { this.#velocity.x = value;}
    /** gets the y velocity of the sprite -ve is up +ve down
     * @returns {float}
    */
    get vy() { return this.#velocity.y;}
    /** sets the y velocity of the sprite -ve is up +ve down
     * @example this.vy = -100; // 100 pixels per second upwards
     * @param {float} value 
    */
    set vy(value) { this.#velocity.y = value;}
    /** gets the z velocity of the sprite -ve is into the screen +ve is forward 
     * @returns {float}
    */
    get vz() { return this.#velocity.y;}
    /** sets the z velocity of the sprite -ve is into the screen +ve is forward 
     * @example this.vz = -100; //100 pixels per second into the screen
     * @param {float} value 
    */
    set vz(value) { this.#velocity.y = value;}

    /** gets the rotation velocity in degrees per second */
    get vr() { return this.#vr / Math.PIby180;}
    /** specifies a rotation velocity for the sprite in degrees per second
     * @example this.vr = 180; // spin a full revolution in 2 seconds
    */
    set vr(value) { this.#vr = value * Math.PIby180;}
    /** gets the rotation velocity in radians per second
     * @returns {flloat} degrees per seo
     */
    get vrR() { return this.#vr;}
    /** specifies a rotation velocity for the sprite in radian per second
     * @example this.vrR = Math.PI; // spin a full revolution in 2 seconds
     * @param {float} value the radians per second you wish the sprite to rotate at
    */
    set vrR(value) { this.#vr = value;}

    

    /** if true then sprite will not perform updates (it will still be rendered) 
     * @type {bool}
    */
    paused = false;
    /** performs all the update mechanisms for a sprite */
    update(){
        const delta = Engine.delta;
        if (this.alive && !this.paused){
            this.elapsedTime += delta;
            if (this.clickable) {
                if (mouseIsPressed && this.isover(mouseX, mouseY)){
                    MsgBus.send(msgT.spriteinfo, {sp:this});
                }
            }
            //independant of any update period controls
            if (this.timer != null && this.timer.active){
                this.timer.update();
            }
            //don't update animation here if we are using update method
            if (this.frame.animating && this.frame.state.animationmethod != AnimateMethod.onupdate){
                if (this.frame.update()){
                    this.#setvisibleSize();
                }
            }

            if (this.elapsedTime >= this.updatePeriod){
                //only update animation here if we are using update method
                if (this.frame.animating && this.frame.state.animationmethod == AnimateMethod.onupdate){
                    if (this.frame.update()){
                        this.#setvisibleSize();
                    }
                }
                //reset elapsed time
                this.elapsedTime = (this.updatePeriod == 0) ? 0 : this.elapsedTime - this.updatePeriod - delta;
                //this.#position.cloneto(this.lastposition);
                
                switch (this.updateMode){
                    case UpdateMode.auto:
                        this.#position.cloneto(this.lastposition);
                //calculate distance travelled if update rate not being used
                        //snap position
                        if (this.updatePeriod == 0){
                            this.x += this.#velocity.x * delta;
                            this.y += this.#velocity.y * delta;
                            if (this.workin3d) this.z += this.#velocity.z * delta;
                        } else { //use velocity as position update each update
                            this.x += this.#velocity.x ;
                            this.y += this.#velocity.y ;
                            if (this.workin3d) this.z += this.#velocity.z;
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
                            let bell =  this.#friction * delta;
                            this.#velocity.x -= this.#velocity.x * bell;//this.#friction * delta;
                            this.#velocity.y -= this.#velocity.y * bell;//this.#friction * delta;
                            this.#velocity.z -= this.#velocity.z * bell;//this.#friction * delta;
                        }
                        break;
                    case UpdateMode.autotrack:
                        if (this.track != null && (this.track.update() || this.track.interpolate)){
                            this.#position.cloneto(this.lastposition);
                            this.#position.cloneto(this.#lasttrackposition);
                            //only attempt to do this if detach hasn't altered update mode
                            //which it could have done - just check to be sure
                            if (this.updateMode == UpdateMode.autotrack){
                                this.track.positionCurrent.cloneto(this.#position);
                            }
                        }
                        break;
                    case UpdateMode.manualtrack:
                        if (this.#position.equal(this.track.positionCurrent))
                        {
                            this.#position.cloneto(this.lastposition);
                            
                            this.#position.cloneto(this.#lasttrackposition);
                            this.track.positionCurrent.cloneto(this.#position);
                        }
                        break;
                }

                //this.angle += this.#vr * delta;onupdate
                this.#angle += this.#vr * delta;

                if (!this.vscale.iszero){
                    this.#scale.x += this.#scale.x * this.vscale.x * delta;
                    this.#scale.y += this.#scale.y * this.vscale.y * delta;
                    this.#setvisibleSize();
                }

                if (this.limit != null){
                    this.limit.update();
                }
                
                if (this.history != null){
                    this.history.update();
                } 
                
                //add sprite to bins if part of collisions
                //need to build this also
                //if (this.collidable) collisionBin.Add(s);
                //this.#deltaposition = vector3.sub(this.#position, this.lastposition);
                this.#deltaposition.x = this.#position.x - this.lastposition.x;
                this.#deltaposition.y = this.#position.y - this.lastposition.y;
                this.#deltaposition.z = this.#position.z - this.lastposition.z;
            }
        }
    }

    /** kills the sprite, calling a funeral callback if set 
     * @example this.kill();
    */
    kill(){
        this.#dead = true;
        Engine.processCallback(this.#callbackFuneral);
        //if (this.callbackFuneral != null){this.callbackFuneral();}
    }

    /** holds a colour to show the limit box of this sprite
     * If null (default) box not shown
     * if a colour is stored then it will be drawn (use alpha values so you can see the sprite)
     * @example
     * //show transparent blue clip box
     * this.showclip = [0,0,255,100];
     * @type {color}
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
    /** gets the current clip area
     * @returns {Rectangle}
    */
    get cliparea(){
        if (this.#cliplimit) return this.limit.area;
        return this.#cliparea;
    }
    /** specifies a clip rectangle and turns clipping on
     * 
     * @example 
     * // restrict sprite to rectangle in centre of screen with a 20 pixel border
     * this.cliparea = new Rectangle(20,20,width-40,height-40);
     * @param {Rectangle} value area to clip against
    */
    set cliparea(value){
        this.#clip = true;
        this.#cliparea = value;
    }
    /** Draws the sprite */
    draw(){

        //THIS IS BROKEN - renderrectangle is bogus - this may not still be true - need to write some tests
        if ((this.world && (Engine.mainview.worldarea.in(this.#renderrectangle.left, this.#renderrectangle.top) ||
            Engine.mainview.worldarea.in(this.#renderrectangle.right, this.#renderrectangle.top) ||
            Engine.mainview.worldarea.in(this.#renderrectangle.right, this.#renderrectangle.bottom) ||
            Engine.mainview.worldarea.in(this.#renderrectangle.left, this.#renderrectangle.bottom))) ||
            
            (Engine.mainview.area.in(this.#renderrectangle.left, this.#renderrectangle.top) ||
            Engine.mainview.area.in(this.#renderrectangle.right, this.#renderrectangle.top) ||
            Engine.mainview.area.in(this.#renderrectangle.right, this.#renderrectangle.bottom) ||
            Engine.mainview.area.in(this.#renderrectangle.left, this.#renderrectangle.bottom))
            ){
            let fr = this.frame.current;
            //dont need #visible check in renderlist works
            if (this.#visible && this.frame.count > 0 && fr.port.w != 0 && fr.port.h != 0){
                this.layer.push();
                this.layer.drawingContext.globalAlpha = this.alpha;
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
                let tx = this.centrex;
                let ty = this.centrey;
                let ofx = this.world ? -Engine.mainview.x:0;
                let ofy = this.world ? -Engine.mainview.y:0;
                this.layer.translate(tx + ofx , ty + ofy );
                this.layer.scale(this.scale.x, this.scale.y);
                if (this.#angle != 0){
                    this.layer.rotate(this.#angle);
                }

                this.layer.image(fr.tex,
                    0, 0,  fr.port.w, fr.port.h,
                    fr.port.x, fr.port.y, fr.port.w, fr.port.h
                );
                //this.layer.image(fr.tex,
                //    0, 0, this.width, this.height,
                //    fr.port.x, fr.port.y, fr.port.w, fr.port.h
                //);
                this.layer.pop();
                if (this.showRenderArea != null){
                    this.layer.fill(this.showRenderArea);
                    if (this.shape == Shape.rectangle){
                        this.layer.rect(this.left/* + this.#renderrectangle.x*/,this.top /*+ this.#renderrectangle.y*/,this.#renderrectangle.w,this.#renderrectangle.h);
                    }else{
                        this.layer.rect(this.left /*+ this.#renderrectangle.x*/,this.top /*+ this.#renderrectangle.y*/,this.#renderrectangle.w,this.#renderrectangle.h);
                    }

                }
                if (this.limit != null && this.limit.show != null){
                    this.layer.fill(this.limit.show);
                    this.layer.rect(this.limit.area.centrex,this.limit.area.centrey,this.limit.area.w,this.limit.area.h);
                }
            }
        }
    }
}

/******************************
 * spritemanager.js by Hurray Banana 2023-2024
 ******************************/ 
/** 
 * @classdesc manages and processes sprites - you should not have to use this directly apart from setting debug output
 */
class Spritemanager{
    /** holds the currently managed sprite references @type {Sprite[]} */
    #spritelist;
    /** @returns {Sprite[]} an array os Sprites that you can perform further processing on */
    get spritelist(){return this.#spritelist;}
    /** holds the list of sprites that are to be drawn, sorted on z before drawing @type {Sprite[]} */
    #renderlist;
    /** holds a list of just those sprites that are collidable, reducing some of the overheads @type {Sprite[]} */
    #collisionlist;
    get Clist() {return this.#collisionlist;}
    /** holds a list of sprites that are primary colliders, reduces collsion checking overheads @type {Sprite[]} */
    #collisionPlist;
    get Plist() {return this.#collisionPlist;}
    /** not used */
    #layer;
    /** set the spritemanager to output debug info defaults to false @type {bool}*/
    debug = false;
    /**
     * sets the position to display the sprite information, not in use
     * @type {vector2} 
     * @example this.debugposition = new vector2(10,ht - 30);
    */
    debugposition = new vector2(10, Engine.viewHeight - 30);
    /** specifies the colour to render debug info, not in use*/
    debugcolour = "white";
    /** specifies a refernce layer to render debug info to*/
    constructor(/*layer*/){
        // this.#layer = layer;
        this.#spritelist = [];
        this.#collisionlist = [];
        this.#collisionPlist = [];
        this.#renderlist = [];
    }
    /** holds history draw tally per frame @type {int}  */
    #historycount;
    /** holds last number of sprites drawn in the frame @type {int} */
    #spritedrawn;
    /** @returns {int} gets the number of sprites being processed */
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
        if (sprite!=undefined){
            this.#spritelist.push(sprite);
        } else {
            let s = new Sprite();
            this.#spritelist.push(s);
        }
        return this.#spritelist[this.#spritelist.len - 1];
    }
    /** adds a sprite marked as a collidable to the collision list 
     * 
     * @param {Sprite} spr primary collider to add
    */
    collisionJoin(spr){
        if (this.#collisionlist.indexOf(spr) == -1){
            this.#collisionlist.push(spr);
        }

    }
    /** adds a sprite marked as a primary collider to the plist 
     * 
     * @param {Sprite} spr primary collider to add
    */
    collisionPJoin(spr){
        if(this.#collisionPlist.indexOf(spr) == -1){
            this.#collisionPlist.push(spr);
        }
    }
    /** removes given sprite from the primary collision list
     * @param {Sprite} spr sprite to remove
     * called by cleanup code, no need to manually call
     */
    collisionPLeave(spr){
        let p = this.#collisionPlist.indexOf(spr);
        if (p != -1){
            this.#collisionPlist.splice(p,1);
        }
    }
    /** removes given sprite from the collision list
     * @param {Sprite} spr sprite to remove
     * called by cleanup code, no need to manually call
     */
    collisionLeave(spr){
        let p = this.#collisionlist.indexOf(spr);
        if (p != -1){
            this.#collisionlist.splice(p,1);
        }
    }

    
    /** performs a collision check for each sprite in the primary collision list
     * against any sprites in the sprite collision list that match with targets for the primary
     * calls the callbackCollide nominated method if set
     */
    collisioncheck(){
        for (let p = 0; p < this.#collisionPlist.length; p++){
            const prim = this.#collisionPlist[p];
            if (prim.collisionList != null){
                for (let k = 0; k < this.#collisionlist.length; k++){
                    const sec = this.#collisionlist[k];
                    //this k p comparison is stupid the indexes are referring to different
                    //lists I need another way of exluding checking with self
                    // if (k != p && sec.alive && this.istargetted(sec, prim.collisionList)){
                    if (prim !== sec && sec.alive && this.istargetted(sec, prim.collisionList)){
                        if (prim.intersectBC(sec)){
                            Engine.processCallback(prim.callbackCollide,sec);
                        }
                    }
                }
            }
        }
    }

    /** 
     * determines if a sprite from the sprite managers collision list has a type
     * logged in the primary sprites collision types list 
     * @returns {bool} true if to be checked for collision */
    istargetted(spr, list){
        for (let p = 0; p < list.length; p++){
            if (spr instanceof list[p]){
                return true;
            }
        }
        return false;
    }

    /** process the sprites in the lists */
    update(){
        if (this.#collisionPlist.length > 0) {this.collisioncheck();}

        this.#renderlist.length = 0;
        for (let p = 0; p < this.#spritelist.length; p++){
            this.#spritelist[p].update();
            if (this.#spritelist[p].visible && !this.#spritelist[p].dead){
                this.#renderlist.push(this.#spritelist[p]);
            }
        }
        // if (this.#collisionPlist.length > 0) {this.collisioncheck();}
        this.#bringoutthedead();
    }
    //need a system similar to the sprite renderlist for history I think
    /** performs sprite rendering */
    draw(){
        this.#historycount = 0;
        //draw any history first - first guess
        //sort history renderlist
        //this.#renderlist.sort(function(a,b){return a.z < b.z ? -1 : 1;})
        for (let p = 0; p < this.#spritelist.length; p++){
            if (this.#spritelist[p].history != null) {
                this.#historycount += this.#spritelist[p].history.draw();
            }
        }
        //sort renderlist
        this.#renderlist.sort(function(a,b){return a.z < b.z ? -1 : 1;})
            
        this.#spritedrawn = this.#renderlist.length;
        for (let p = 0; p < this.#renderlist.length; p++){
            //watch out for any sprites killed since adding to render list
            //if (!this.#renderlist[p].dead){
                this.#renderlist[p].draw();
            //}
        }
        if (this.debug){this.debugdisplay();}
    }
    /** removes all sprites marked as dead */
    #bringoutthedead(){
        let p = this.#spritelist.length - 1;
        while (p >= 0){//} && p < this.#spritelist.length){
            if (this.#spritelist[p].dead){
                this.#spritelist[p].cleanup();
                this.#spritelist.splice(p,1);
            } 
            p--;
        }
    }
    /** returns a string of basic debug information about sprites */
    get debugdisplay(){
        return "sprites [" + this.count + "] drawn [" + this.#spritedrawn + "] " + 
        "history sprites [" + this.#historycount + "]";
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
 * textures.js by Hurray Banana 2023-2024
 ******************************/ 
/** @classdesc support to help with textures, loading and manipulating */
class Tex{
    /** font used to pre-render textures ready for sprites (alphabet stuff)
     * change it before calling Engine.init()
     * default monospace
     */
    static prerenderFont = "monospace";
    /** font size to use for pre-render texture characters - default 24 @type {int} */
    static prerenderFontsize = 24;
    /** texture size to use for pre-render texture characters - default 32 @type {int}*/
    static prerenderFontTextureSize = 32;
    /** extra sizing for fonts that don't report ascenders and descenders properly.
     * Use this when pre-rendered character textures get cropped
     * defaults to 0, try making it 4, 6 etc... until rendering is ok
     * @type {int}
     */
    static prerenderFontTextureSizeExtra = 0;
    //texture space
    /** single pixel for scaling for rectangles @type {texture}*/
    static singlepixel;
    /** texture with just white pixels 50x50  @type {texture}*/
    static rect50by50;
    /** 8x8 pixel triangle white outline with black triangle  @type {texture}*/
    static triangle;
    /** white circle   @type {texture}*/
    static circle4by4;
    /** white circle   @type {texture}*/
    static circle8by8;
    /** white circle   @type {texture}*/
    static circle16by16;
    /** white circle   @type {texture}*/
    static circle32by32;
    /** T target can be used for visualisations  @type {texture}*/
    static target;
    /** holds alphaset as textures @type {texture[]}*/
    static txAlpha = [];
    /** holds alphaset as textures with a border @type {texture[]}*/
    static txAlphaBordered = [];
    /** set of textures generated for each of the characters */
    static alphaset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz !\"£$%^&*()[]{}-+=,.:;?><¬";
    /** 
     * generates a stock alphabet as a set of sprite textures
    */
    static genAlphaset(){
        //push();
        //get metrics
        // textFont(Tex.prerenderFont);
        // textSize(Tex.prerenderFontsize);
        // Tex.prerenderFontTextureSize = textAscent() + textDescent();
        // pop();
        Tex.txAlpha = new Array(Tex.alphaset.length);
        Tex.txAlphaBordered = new Array(Tex.alphaset.length);
        for (let p =0; p < Tex.alphaset.length; p++){
            Tex.txAlpha[p] = this.makeLetter(Tex.alphaset[p]);
            Tex.txAlphaBordered[p] = this.makeLetter(Tex.alphaset[p],true);
        }
    }
    /**
     * takes the first character in string and returns appropriate texture, will return a ¬ if doesn't exist
     * @param {string} ch character to obtain texture of
     * @param {bool} border if false or undefined will return normal character texture if true will get a bordered version
     * @returns {texture} requested texture if exists or a not texture
     */
    static getAlphachar(ch, border){
        let p = Tex.alphaset.indexOf(ch[0]);
        if (p == -1) p = Tex.alphaset.length - 1;
        return (border === undefined || !border) ? Tex.txAlpha[p] : Tex.txAlphaBordered[p];
    }
    /**
     * returns the indexed texture from the alphaset, if outside range will return a ¬
     * @param {string} ch character to obtain texture of
     * @param {bool} border if true will get a bordered version
     * @returns {texture} texture requested if possible
     */
    static getAlphaindex(idx, border){
        if (p < 0 || p >= Tex.alphaset.length) p = Tex.alphaset.length - 1;
        return (border === undefined || !border) ? Tex.txAlpha[p] : Tex.txAlphaBordered[p];
    }
    /** slope tiles 16x16 
     * contains the following basic slopes
     * 0,0 0,4 0,8 0,12 0,16
     * 4,0 4,4 4,8 4,12 4,16
     * 8,0 8,4 8,8 8,12 8,16
     * 12,0 12,4 12,8 12,12 12,16
     * 16,0 16,4 16,8 16,12
     * used for testing purposes - for slope interactions when complete
    */
    static slopes;
    /** holds rectangles portions for the slopes */
    static #slopePorts;
    /** holds slope textures from testing */
    static tsSlopes;
    /** returns a Tile object for the given slope*/
    static getslopetile(left, right){
        left >>= 2;
        right >>= 2;
        //finish this
    }
    /**
     * hashes an RGB colour value for texture name in texture cache
     * @param {colour} colour 
     * @returns hashed colour
     */
    static colTonum(colour){
        return colour[0]*1024 + colour[1]*256 + colour[2];
    }
    /** get a coloured pixel for making sprites which when scaled can make any sized rectangle 
     * @param {colour} tintcolour 
     * @returns {texture}
    */
    static getColouredPixel(tintcolour){
        let colHash = Tex.colTonum(tintcolour);
        let tex = Tex.tintcache.get(Tex.singlepixel.__hbname + colHash) ;
        if (tex === undefined){
            tex = createGraphics(1, 1);
            tex.pixelDensity(1);
            tex.fill(tintcolour);
            tex.noStroke();
            tex.rect(0,0,1,1);
            tex.__hbname = Tex.singlepixel.__hbname;
            tex.__hbtint = colHash;
            Tex.tintcache.set(tex.__hbname + tex.__hbtint, tex);
        }
        return tex;
    }    
    //NEED TO TAKE ONBOARD THE ALPHA (as this is part of the tint)
    /** takes a texture and produces a tinted version     
     * tintcolour should be a rgb array 
     * @param {texture} texture texture/image to copy
     * @param {color} tintcolour to apply to the texture
     * @param {float} alpha alpha value to apply to the tint 0 transparent 1 fully opaque
     * @param {string} compositor if supplied overrides the default composite operation "destination-atop" with your own has to be valid operation
     * @returns {texture} the coloured texture requested
     @example [255,0,0] - rgb array full red, no green, no blue
     DO NOT USE IN A GAME LOOP THESE SHOULD BE CREATED BEFORE GAME STARTS, as this may take time
     if texture in that colour has been requested before then the cached version will be selected
    */
     static getTintedCopy(texture, tintcolour, alpha, compositor){
        compositor = (compositor === undefined) ? "destination-atop" : compositor;
        let colHash = Tex.colTonum(tintcolour);
        let tex = Tex.tintcache.get(texture.__hbname + colHash) ;
        if (tex === undefined){
            if (alpha === undefined){alpha = 1;}
            tex = createGraphics(texture.width, texture.height);
            tex.pixelDensity(1);
            tex.drawingContext.globalAlpha = alpha;
            tex.fill(tintcolour);
            tex.noStroke();
            tex.rect(0,0,tex.width,tex.height);
            tex.drawingContext.globalCompositeOperation = compositor;// "destination-atop";
            tex.drawingContext.globalAlpha = 1;
            tex.image(texture,0,0);
            tex.__hbname = texture.__hbname;
            tex.__hbtint = colHash;
            Tex.tintcache.set(tex.__hbname + tex.__hbtint, tex);
        }
        return tex;
    }      
    /** holds all the cached tinted textures used for quick look up rather than keep generating*/
    static tintcache = new Map();
    /** holds all the cached textures */
    static texturecache = new Map();
    /** simple counter so cache can keep track and avoid duplicates */
    static texnum = 0;
    /** holds the image load requests as these happen asynchronously */
    static loadQ = [];
    /**
     * let the engine know how many images you are loading 
     * @param {int} number number of images to be loaded in this session
     * use this if you are loading a lot and need to hold up further processing until they have loaded
     * use Tex.loadcomplete to let you know if this has happend or not
     */
    static beginload(number){
        Tex.loadcount = 0;
        Tex.loadnumbner = number
    }
    /**
     * gets true if loadnumber matches requested number set with beginload
     * @returns {bool}
     */
    static get loadcomplete() { return Tex.loadcount == Tex.loadnumbner;}
    /**
     *  load and log a particular image/texture
     * @param {string} fileNpath 
     * @param {function} texture this is easier to do as an anonymous function see example provided here
     * @example
     * //assuming txtiles has been declared globally somewhere (eg. in sketch)  
     * //anonymous function accepts parameter img, stores reference in txtiles
     * Tex.loadToTexture("./tiles.png", (img)=>{txtiles=img;});
     */
    static loadToTexture(fileNpath, callback){
        let tex = Tex.texturecache.get(fileNpath);
        if (tex === undefined && !this.loadQ.includes(fileNpath)){
            Tex.loadQ.push(fileNpath);
            loadImage(fileNpath, (img)=>{
                let t = img; 
                t.__hbtint = this.colTonum([255,255,255])
                t.__hbname = fileNpath;
                //remove from q
                Tex.texturecache.set(t.__hbname + t.__hbtint, t);
                Tex.loadQ.splice(Tex.loadQ.indexOf(fileNpath),1);
                Tex.loadcount++;
                callback(t);
                }
            );
        } else {console.log("attempt to load texture "+fileNpath+" again");}
    }
    //do not use stupid thing
    // static waitloading(){
    //     while (this.loadQ.length > 0);
    // }
    /** creates all the textures ready for use */
    static createTextures(){
        Tex.singlepixel = Tex.setupTexture(1,1);
        Tex.singlepixel.background(255);

        Tex.rect50by50 = Tex.setupTexture(50,50);
        Tex.rect50by50.background(255);
        
        Tex.target = Tex.makeLetter("T",true);
        Tex.genAlphaset();
        // triangle
        Tex.triangle = Tex.setupTexture(16,16);
        Tex.triangle.triangle(0,15,8,0,15,15);
        //circles
        Tex.circle4by4 = Tex.setupTexture(4,4);
        Tex.circle4by4.ellipse(2,2,2);

        Tex.circle8by8 = Tex.setupTexture(8,8);
        Tex.circle8by8.ellipse(4,4,4);

        Tex.circle16by16 = Tex.setupTexture(16,16);
        Tex.circle16by16.ellipse(8,8,8);

        Tex.circle32by32 = Tex.setupTexture(32,32);
        Tex.circle32by32.ellipse(16,16,16);
        Tex.slopes = Tex.#createSlopes(16);
    }
    /** generates the alphabetic character textures */
    static makeLetter(t, border){
        // test for rendermetrics
        push();
        textFont(Tex.prerenderFont);
        textSize(Tex.prerenderFontsize);
        let b = textAscent();
        let c = textDescent();
        Tex.prerenderFontTextureSize = b + c + Tex.prerenderFontTextureSizeExtra;
        pop();
        let tx = Tex.setupTexture(Tex.prerenderFontTextureSize,Tex.prerenderFontTextureSize);
        // tx.textFont("monospace");
        tx.textFont(Tex.prerenderFont);
        tx.textSize(Tex.prerenderFontsize);

        //
        tx.stroke(255);
        tx.strokeWeight(2);
        tx.noFill();
        if (border !== undefined)
            tx.rect(2,2,Tex.prerenderFontTextureSize-4,Tex.prerenderFontTextureSize-4,4,4,4,4);
        tx.fill(255);
        tx.textAlign(CENTER, CENTER);
        tx.text(t,Tex.prerenderFontTextureSize/2,Tex.prerenderFontTextureSize/2);  
        return tx;
    }
    /** generic routine to create a texture with the width and height requested
     * will add it to the texture cache
     * 
     */

    /**
     * generic routine to create a texture with the width and height requested
     * will add it to the texture cache
     * @param {int} width number of pixels wide
     * @param {int} height number of pixels high
     * @returns {texture} texture to be drawn and written to
     */
    static setupTexture(width, height){
        let t = createGraphics(width, height);
        t.pixelDensity(1);
        t.clear();
        t.fill(255);
        t.noStroke();
        t.noSmooth();      
        t.__hbname = "tx" + Tex.texnum++;
        t.__hbtint = this.colTonum([255,255,255])
        this.texturecache.set(t.__hbname + t.__hbtint, t);
        return t;  
    }
 
    /**
     * generates a transparent texture with pixels set by a binary string array (white pixels equate 1 from the string array)
     * 
     * this can be used to generate tinted textures using getTintedCopy()
     * 
     * @param {string[]} each string in array represents a row of horizontal pixels, from top to bottom in binary (0/1), each string should contain the same number of bits
     * @param {int} scalex number of pixels each bit represents horizontally, if ommitted assumes 1 pixel per bit
     * @param {int} scaley number of pixels vertically each string represents, if ommitted assumes 1 row per string
     * @returns {texture} texture to be drawn and written to
     * @example 
     * let tank = [
     *      "0001000",
     *      "0001000",
     *      "1101011",
     *      "1111111",
     *      "1111111",
     *      "1100011",
     *      "1100011",
     *      ];
     * // use 4 pixels for each bit supplied horizontally and vertically
     * tex28x28 = Tex.bitarrayTotexture(tank, 4, 4);
     */
    static bitarrayTotexture(bits, scalex, scaley){
        scalex = (scalex === undefined)? 1 : scalex;
        scaley = (scaley === undefined)? 1 : scaley;
        let h = bits.length;
        let w = Tex.longestString(bits);
        let t = Tex.setupTexture(w *scalex, h * scaley);
        for (let y = 0; y < h; y++){
            for (let x = 0; x < w; x++){
                if (bits[y][x] == "1"){
                    t.rect(x * scalex, y * scaley, scalex, scaley);
                }
            }
        }        
        return t;
    }

    /** used by bitarray system to work out some metrics around bits, packs out shorter bit patterns
     * @param {string[]} arr 
     * @returns {int} longest string in the array
     */
    static longestString(arr){
        let b = arr[0].length;
        for (let p = 1; p < arr.length; p++){
            b = arr[p].length > b ? arr[p].length : b;
        }
        //auto pad to right with 0
        for (let p = 0; p < arr.length; p++){
            if (arr[p].length < b){
                arr[p] = arr[p].padEnd(b,"0");
            }  
        }
        return b;
    }
    /** slope tiles 16x16 
     * contains the following basic slopes
     * 0,0 0,4 0,8 0,12 0,16
     * 4,0 4,4 4,8 4,12 4,16
     * 8,0 8,4 8,8 8,12 8,16
     * 12,0 12,4 12,8 12,12 12,16
     * 16,0 16,4 16,8 16,12
    */
    /** generates slope quarters for given square tile size */
    static #createSlopes(size){
        //each tile 16x16 going to define 5x5 array of tiles (some space for dumping other tiles in later on)
        const t = Tex.setupTexture(256,256);
        Tex.tsSlopes = [];
        let q = (size/4) | 0;
        
        for (let y = 0; y < 5; y++){
            for (let x = 0; x < 5; x++){
                Tex.#trap(t, x * size, y * size, q * y , q * x, size);
                let n = new Tile(t,  new Rectangle(x * size, y * size, size, size));
                n.setHorizontalmap(q * y, q * x);
                //let data = {};
                //data.port = new Rectangle(x * size, y * size, size, size);
                //data.tex = t;
                //data.l = q * y;
                //data.r = q * x;
                Tex.tsSlopes.push(n);
                //Engine.tsSlopes.push(data);
            }
        }
        return t;
    }
    /** draw a vertical trapezium in a 16x16 area */
    static #trap(t, x, y, l, r, w){
        //draw triangle
        t.fill(120);
        if (l != r){
            let x1 = x;
            let y1 = y + l;

            let x2 = x + w;
            let y2 = y + r;

            let x3 = x + ((l > r) ? w:0);
            let y3 =  y + ((l > r) ? l:r);

            t.triangle(x1,y1, x2,y2, x3, y3);
        }
        let height = (l>r) ? l : r;
        if (height<w){
            t.rect(x,y+height, w, w-height);
        }
    }    
}
/******************************
 * tilemap.js by Hurray Banana 2023-2024
 ******************************/ 
/** @classdesc organises and manages active tilemaps */
class TilemapManager{

    /** @type {Tilemap[]} holds a list of active maps*/
    #tilemaps;

    /** creates tilemap manager */
    constructor(){
        this.#tilemaps = [];
    }

    /**adds a tilemap to the manage, this ensures it's updated and drawn
     * @param {Tilemap} tilemap tilemap reference to manage
     * to remove a tilemap just set it's remove property to false, 
     * make sure no objects are making reference to the tilemap after you have removed it as it's internal components will be destroyed
     */
    add(tilemap){
        this.#tilemaps.push(tilemap);
    }

    /**updates the managed tilemaps */
    update(){
        //TilemapManager.delta = delta;
        for (let p = 0; p < this.#tilemaps.length; p++){
            this.#tilemaps[p].update();
        }
        this.#bringoutthedead();        
    }

    /** draws the managed tilemaps */
    draw(){
        for (let p = 0; p < this.#tilemaps.length; p++){
            this.#tilemaps[p].draw();
            //MsgBus.send(mymess.uimessage, {txt:this.#tilemaps[p].debugdisplay, x:10,y:150});
        }
    }

    /** removes any tilemaps marked as remove */
    #bringoutthedead(){
        let p = this.#tilemaps.length - 1;
        while (p >= 0){//} && p < this.#spritelist.length){
            if (this.#tilemaps[p].remove){
                this.#tilemaps[p].cleanup();
                this.#tilemaps.splice(p,1);
            } 
            p--;
        }
    }

    /** provides some debug information about managed tilemaps */
    get debugdisplay(){
        return null;
    }
}
/** @classdesc base sprite frame definition holds a texture and portion reference */
class Rawtile{
    /**@type {texture}  texture that contains image for the frame/tile */
    tex;
    /** @type {Rectangle} portion of texture to render for this frame/tile*/
    port;
    /**
     * 
     * @param {texture} texture texture that contains image for the frame/tile
     * @param {Rectangle} portion portion of texture to render for this frame/tile
     */
    constructor(texture, portion){
        this.tex = texture;
        if (portion === undefined){
            portion = new Rectangle(0,0,texture.width, texture.height);
        }
        this.port = portion;
    }    
}
/** @classdesc defines a single tile in a tilemap with all the extra support needed for tiles */
class Tile extends Rawtile{
    /** @type {Int32Array[]} holds height of tile horizontally from left to right 
     * full tiles will have a hmap containing all zeros
    */
    hmap = null;
    /** @type {Int32Array[]} holds the width of the tile vertically from left 
     * full tiles will have a vmap containing all zeros
     */
    vmap = null;
    get isflat(){return this.hmap[0] == this.hmap[this.port.w - 1];}
    get isSlope(){return !(this.hmap[0] == this.hmap[this.port.w - 1]);}
    
    /** 
     * @returns {int} gets the height of the tile from it's bottom edge based on the offset given
     * use when walking/running or falling
     * @param {int} x offset from left hand edge tile
    */
    distancebottom(x){
        return this.port.h - this.hmap[x];
    }
    /** 
     * @returns {int} gets distance of tile from its top edge
     * @param {int} x offset from left hand edge tile
     * */
    distancetop(x){
        return this.hmap[x];
    }
    /** 
     * @returns {int} gets distance from left edge of tile 
     * @param {int} y offset from top edge of tile
     * */
    distanceleft(y){
        return this.vmap[y];
    }
    /** 
     * @returns {int} gets distance from right edge of tile 
     * @param {int} y offset from top edge of tile
     * */
    distanceright(y){
        return this.port.w - this.vmap[y];
    }
    /** specifies the distance offset of the tile edges from the top of the tile.
     * The heights are interpolated between the left and right values.
     * 
     * defaults to 0,0
     * 
     * If you want to produce a jagged tile then specifiy the full array of values yourself (array must be same length as tile width)
     * @param {int} l distance from top of tile at left edge
     * @param {int} r distance from top of tile at right edge
     */
    setHorizontalmap(l, r){
        if (r !== undefined){
            this.hmap = new Int32Array(this.port.w);
            let diff = (r - l) / this.port.w;
            for (let p = 0; p < this.hmap.length; p++){
                this.hmap[p] = Math.round(l + diff * p);
            }
        } else {
            this.hmap = new Int32Array(l.length);
            for (let p = 0; p < this.hmap.length; p++){
                this.hmap[p] = l[p];
            }
        }
    }
    /** specifies the distance offset of the tile edges from the left of the tile.
     * The widths are interpolated between the top and bottom values.
     * 
     * defaults to 0,0
     * 
     * If you want to produce a jagged tile then specifiy the full array of values yourself (array must be same length as tile height)
     * @param {int} t distance from left of tile at top edge
     * @param {int} b distance from left of tile at bottom edge
     */
    setVerticalmap(t, b){
        if (b !== undefined){
            this.vmap = new Int32Array(this.port.h);
            let diff = (b - t) / this.port.h;
            for (let p = 0; p < this.hmap.length; p++){
                this.hmap[p] = Math.round(t + diff * p);
            }        
        } else {
            this.vmap = new Int32Array(t.length);
            for (let p = 0; p < this.hmap.length; p++){
                this.vmap[p] = t[p];
            }
        }    
    }
    /**
     * creates a new tile
     * @param {texture} texture texture with the image for tile
     * @param {Rectangle} portion portion of texture to show, if using whole texture then don't suppy a value
     * @param {int[]} hmap a horizontal height map for the tile, leave undefined if not wanted
     * @param {int[]} vmap a vertical height map for the tile, leave undefined if not wanted
     */
    constructor(texture, portion, hmap, vmap){
        super(texture, portion);
        if (hmap === undefined || hmap == null) {
            this.setHorizontalmap(0,0);//full tile
        } else {
            this.setHorizontalmap(hmap);
        }
        if (vmap === undefined || vmap == null) {
            this.setHorizontalmap(0,0);//full tile from left
        } else {
            this.setHorizontalmap(vmap);
        }
    }
    cleanup(){
        this.tex = null;
    }
}
/** @classdesc values to use for stating directions in tilemaps for various tilemap navigation and interrogation methods */
class TileDirection{
    /** direction left @type {int}*/
    static LEFT = 0x1;
    /** direction up  @type {int}*/
    static UP = 0x2;
    /** direction right  @type {int}*/
    static RIGHT = 0x4;
    /** direction down  @type {int}*/
    static DOWN = 0x8;
    /** no direction  @type {int}*/
    static NONE = 0b0;
    /**  @type {int[]} array containing each ordinal direction*/
    static ALL_ORDINALS = [TileDirection.LEFT, TileDirection.RIGHT, TileDirection.UP, TileDirection.DOWN];
    /**  @type {int[]} array containing each vertical direction*/
    static VERTICALS = [TileDirection.UP, TileDirection.DOWN];
    /**  @type {int[]} array containing each horizontal direction*/
    static HORIZONTALS = [TileDirection.LEFT, TileDirection.RIGHT];    
    /** debugging string @type {string} */
    static str = ["none","left","up",,"right",,,,"down"];
    /** mapping of WNES to indexes 0,1,2,3 used by highlightdirections */
    static directionmap = [,0,1,,2,,,,3];
    /** @returns {string} string representation of a given direction
     * @param {TileDirection} direction to get the representation of
    */
    static asStr(direction){
        return TileDirection.str[direction];
    }
    /**
     * produces a string of directions based on the the array
     * @param {TileDirection[]} di array of directions to get visualisations of
     * @returns {string} the visualisation of the directions given
     */
    static strlist(di){
        let out = "";
        for (let p = 0; p < di.length; p++){
            out += TileDirection.asStr(di[p]) + ":";
        }
        return out;
    }
}
/** 
 * @classdesc overaly methods for tile map debugging
 * very expensive, best performant way to use these is to render them to a screen buffer, 
 * rather than generating the overlay every frame
 */
class TilemapOverlay{
    /** @type {string} outputs the graphic tile number at each tilemap location */
    static GRAPHIC = "graphic";
    /** @type {string} outputs the collision tile number (from the collisionmap) at each tile */
    static COLLISION = "collision";
    /** @type {string} outputs the tile pixel-coordinate for each tile */
    static COORDS = "coords";
    /** @type {string} outputs the tile coordinate for each tile */
    static ROW_COL = "row_col";
    /** @type {string} draws outline for tile bounaries*/
    static GRID = "grid";
    /** @type {null} no output */
    static NONE = null;
}
/** @classdesc manages a fixed grid based entity that can be used for scrolling background graphics as well
 * as collision systems
 */
class Tilemap{
    /** @type {int} represents an empty tile (easy to check for)*/
    static EMPTY = -1;
    /** @type {bool} if true requests the tilemap manager removes the tilemap */
    remove = false;
    /** @type {bool} if true, the tilemap will be repeated horizontally until it fills the viewport */
    wrapx = false;
    /** @type {bool} if true, the tilemap will be repeated vertically until it fills the viewport */
    wrapy = false;
    /**
     * sets wrapping in x and y directions (if true), turns both off if false
     * @param {boolean} value that sets or clears both x and y wrapping
     */
    set wrap(value){this.wrapx = value;this.wrapy = value;}
    /** @returns {bool} if wrapping in x and y directions is set */
    get wrap(){return this.wrapx && this.wrapy;}
    /** @type {bool} controls whether tilemap is displayed (true) or not (false) */
    visible = true;
    /** @type {View} holds the viewport this tilemap is rendered into */
    view;
    /** @type {bool} not in use yet (may never be) would clip tilemap to the view window (it already is sort of clipped) */
    clipview = false;
    /** 
     * @type {{x:int,y:int}} specifies how much to move based on viewport movement/displacement
     * defaults to {x:1,y:1} which means 1 pixel of viewport movement means 1 pixel of tilemap movement
     * 
     * if you set it to {x:2,y:2} the tilemap will move twice as fast as the viewport
     * 
     * if you set it to {x:0.5,y:0.5} the tilemap will move half as fast as the viewport
     * 
     * by layering multiple tilemaps with different scrollmultipliers you can create parallax effects
     */
    scrollmultiplier = {x:1,y:1};
    /** 
     * holds an overlay method, default to TilemapOveraly.NONE
     * @type {TilemapOverlay}
     * @default {TilemapOveraly.NONE}
     * //only use for testing and debugging, resource heavy
     * @example
     *  //put row and column info on top of tile map
     *  this.overlay = TilemapOverlay.ROW_COL
     */
    overlay = TilemapOverlay.NONE;
    /** @type {color} specifies a colour to render the tilemap overaly in*/
    overlayCol = [255,255,255];
    /**
     *  @type {int} specifies how to process rows and columns for the overlay, 
     * defaults to 1 show every row and column, if tiles are too small to show the information increase the skip value*/
    overlayskip = 1;
    /**
     * @type {bool} 
     * if true locations outside the tile map are wrapped to opposite side
     * when performing collision checks. This is useful if you can traverse/warp/wrap from
     * one side of a tilemapto another so you get valid options (Pac-Man tunnels are a use case for this )
     * 
     * @default {true}
     */
    wrapTileInterrogation = true;

    /** creates a tilemap using the mainviewport on Engine.backmap layer, 
     * change these if you need to in your constructor */
    constructor(){
        this.#tiles = [];
        this.textures = null;
        //default view, replace with something other than full viewport
        this.view = Engine.mainview;
        //if (tilesize !== undefined){
        //    this.#tilesize = tilesize;
        //} else {this.#tilesize = {w:32,h:32};}
        this.layer = Engine.backmap;
    }
    /** @type {texture[][]} 2d arrayof offscreen textures for this tilemap */
    textures = null;
    //for now make maxtex a multiple of tilewidth and tileheight ??
    /** @type {int} maximum size of offscreen textures - may make this configurable */
    #maxtex = 256;//512;//195;//256;//24 ;//1024;
    /**number of offscreen textures used horizontally */
    
    /** 
     * @type {w:int,h:int} holds width and height of offscreen texture array
     * formally #txwide and #txhigh
    */
    #txdims = {w:0,h:0};
    //#txwide;
    /**nuber of offscreen textures used vertically */
    //#txhigh;
    /**
     * @type {w:int,h:int} holds the width and height of off screen textures
     * 
    */
    #txSize =  {w:0,h:0};
    /** 
     * @type {w:int,h:int} holds the scaled size of a texture used during rendering 
    */
    #txSizeScaled = {w:0,h:0};
    /**
     * @type {w:int,h:int} holds the number of columns and rows per off screen texture
     * 
    */
    #txcolsrows =  {w:0,h:0};

    // #lastwide; not used
    // #lasthigh; not used

    #lastdrawn; //debugging output
    /** @type {string} gives debug info about back texture draws - not implemented currently */
    get debugdisplay(){return "textures draw w:" + this.#lastdrawn.w + " h" + this.#lastdrawn.h;}
    
    // //holds the visible width of the off screen textures
    // #texturesFullWide;
    // //holds the visible height of the off screen textures
    // #texturesFullHigh;

    /**
     * @type {bool} if true will limit generated location values to valid tile locations
     * if false you will need to verify valid location using validLocation
    */
    clamplocation = true;
    /**
     * @type {float} render transparency level for the tilemap 1 - opaque, 0 completely transparent
     * @default {1}
     */
    alpha = 1;
    /** @type {float[][]} holds an alpha map, a transparency setting for individual tiles - not implemented yet needs shader code */
    alphamap = null;
    /** @type {float[][]} holds an colour map, a color setting for individual tiles - not implemented yet needs shader code*/
    colourmap = null;
    /**
     * @type {int[][]} holds a collision map for doing more general or specific collision maps instead of directly interrogating graphic tiles (which can get complex)
     */
    collisionmap = null;
    /** @type {vector2} holds scale to draw tilemap defaults to size tiles defined */
    #scale = vector2.one;
    /** @type {Rectangle} holds the render displacement rectangle of the tilemap */
    #screenarea = Rectangle.zero;
    /**
     * @returns {Rectangle} gets the render position of the tilemap
     * */
    get renderArea(){
        return this.#screenarea;
    }
    /** @returns {vector2} gets the scale for the tilemap */
    get scale(){return this.#scale;}
    /** sets the scale for the tilemap w,h */
    set scale(value){
        this.#scale.w = value.w;
        this.#scale.h = value.h;
        
        this.#visibletilesize.w = this.#tilesize.w * this.#scale.w;
        this.#visibletilesize.h = this.#tilesize.h * this.#scale.h;
        this.#area.w = this.#visibletilesize.w * this.cols;//this.#tilesize.w * this.#scale.w * this.cols;
        this.#area.h = this.#visibletilesize.h * this.rows;//this.#tilesize.h * this.#scale.h * this.rows;
        this.#txSizeScaled.w = this.#txSize.w * value.w;
        this.#txSizeScaled.h = this.#txSize.h * value.h;

        this.#screenarea.w = this.#area.w;
        this.#screenarea.h = this.#area.h;
        this.#screenarea.x = this.#position.x;
        this.#screenarea.y = this.#position.y;

        //this.#area.w = this.#tilesize.w * this.#scale.w * this.cols;
        //this.#area.h = this.#tilesize.h * this.#scale.h * this.rows;
    }
    /**
     * @returns {float} horizontal scale of the tilemap
     */
    get sw(){return this.#scale.w;}
    /**
     * @returns {float} vertical scale of the tilemap
     */
    get sh(){return this.#scale.h;}
    /**
     * @param {float} value sets the horizontal scale of the tilemap
     */
    set sw(value){
        this.#scale.w = value;
        this.#visibletilesize.w = this.#tilesize.w * this.#scale.w;
        this.#area.w = this.#visibletilesize.w * this.cols;//this.#tilesize.w * this.#scale.w * this.cols;
        this.#txSizeScaled.w = this.#txSize.w * value;
        this.#screenarea.w = this.#area.w;
    }
    /**
     * @param {float} value sets the vertical scale of the tilemap
     */
    set sh(value){
        this.#scale.h = value;
        this.#visibletilesize.h = this.#tilesize.h * this.#scale.h;
        this.#area.h = this.#visibletilesize.h * this.rows;//this.#tilesize.h * this.#scale.h * this.rows;
        this.#txSizeScaled.h = this.#txSize.h * value;
        this.#screenarea.h = this.#area.h;
    }
    /**
     * @type {int[][]} holds the graphic tilemap as a 2d arr
     */
    #map = null;
    /** @returns {int[][]} a reference to the graphic tilemap*/
    get map(){return this.#map;}
    /** 
     * set a single (or fill a rectangular region) graphic tile at a specific location in the map, make sure the tile number is valid and also the location
     * @param {{x:int,y:int}} loc the x and y tile location to set
     * @param {int} tile tile number to place here
     * @param {{w:int,h:int}} size of region to set, tiles wide and high from the given location, can be ommited for a single tile
    */
    setMapGraphic(loc,tile, size){
        if (size === undefined){
            this.#map[loc.y][loc.x] = tile;
            this.#setgraphictilenew(loc, tile);
            //this.#setgraphictile(loc, tile);
        } else {
            let tx; let ty;
            for (let r = 0; r < size.h; r++){
                for (let c = 0; c < size.w; c++){
                    this.#map[ty = loc.y + r][tx = loc.x + c] = tile;
                    this.#setgraphictilenew({x:tx,y:ty}, tile);
                    //this.#setgraphictile({x:tx,y:ty}, tile);
                }
            }
        }
    }
    /**
     * applies an xor mask to a tile number in the graphic map (to setup toggles)
     * @param {{x:int,y:int}} loc the x and y tile location to xor
     * @param {int} xormask define the mask to toggle between 2 values (place a 1at the bit position to toggle)
     * @param {{w:int,h:int}} size of region to xor, tiles wide and high from the given location, can be ommited for a single tile
     */
    xorMapGraphic(loc, xormask, size){
        if (size === undefined){
            this.#map[loc.y][loc.x] ^= xormask;
            this.#setgraphictilenew(loc, this.#map[loc.y][loc.x]);
        } else {
            let tx; let ty;
            for (let r = 0; r < size.h; r++){
                for (let c = 0; c < size.w; c++){
                    this.#map[ty = loc.y + r][tx = loc.x + c] ^= xormask;
                    this.#setgraphictilenew({x:tx,y:ty}, this.#map[ty = loc.y + r][tx = loc.x + c]);
                }
            }
        }        
    }
    /** removes tiles from the tile map at the given location (will make tile reference -1 - no tile/transparent)
     * if a size is specified a rectangular region is cleared {w:4,h:5} from that location.
     * 
     * if you want to place a zero tile use setMapGraphic() instead
     * @param {{x:int,y:int}} loc the x and y tile location to clear
     * @param {{w:int,h:int}} size of region to clear, tiles wide and high from the given location, can be ommited for a single tile
     */
    clrMapGraphic(loc, size){
        if (size === undefined){
            this.#map[loc.y][loc.x] = -1;
            this.#clrGtilenew(this.#tiletoTXnew(loc));
            //this.#clrGtile(this.#tiletoTX(loc));
        } else {
            let tx; let ty;
            for (let r = 0; r < size.h; r++){
                for (let c = 0; c < size.w; c++){
                    //tx = loc.x + c; ty = loc.y + r;
                    this.#map[ty = loc.y + r][tx = loc.x + c] = -1;
                    this.#clrGtilenew(this.#tiletoTXnew({x:tx,y:ty}));
                    //this.#clrGtile(this.#tiletoTX({x:tx,y:ty}));
                }
            }
        }
    }
    /** holds raw area of the tilemap */
    //#rawarea = Rectangle.one; old renderer
    /** @type {Rectangle} holds scaled area of the tilemap */
    #area = Rectangle.one;
    /**@returns {Rectangle} area of tilemap */
    get area(){return this.#area;}
    /** @param {Rectangle} value  specifies the area of the tilemap*/
    set area(value){
        this.#area = value;
        this.#releaseTextures();
        this.#setTexturesNew();
    }
    /** @type {vector2} holds the size of the tiles (width and height) in the tilemap
     * all tiles need to be the same size
    */
    #tilesize = vector2.one;
    /** @returns {vector2} gets the width and height of tiles in the tilemap */
    get tilesize(){return this.#tilesize;}
    /** @param {vector2|{x:int,y:int}} value to specify the width and height of all tiles */
    set tilesize(value){
        this.#tilesize.x = value.w;
        this.#tilesize.y = value.h;
        this.#visibletilesize.w = this.#tilesize.w * this.#scale.w;
        this.#visibletilesize.h = this.#tilesize.h * this.#scale.h;
        this.#area.w = this.#tilesize.w * this.#scale.w * this.cols;
        this.#area.h = this.#tilesize.h * this.#scale.h * this.rows;
        this.#screenarea.w = this.#area.w;
        this.#screenarea.h = this.#area.h;
        this.#screenarea.x = this.#position.x;
        this.#screenarea.y = this.#position.y;
    }
    /** @type {vector2} the scaled (on screen) size of the tilemap tiles */
    #visibletilesize = vector2.one;
    /** @returns {vector2} the scaled (on screen) size of the tilemap tiles */
    get visibletilesize(){return this.#visibletilesize; } 
    /** @type {vector2} the render offset of the tilemap, change the x and y values to "scroll" the tilemap */
    #position = vector2.zero;
    /** @returns the render offset of the tilemap, change the x and y values to "scroll" the tilemap  */
    get position(){return this.#position;}
    /** sets the position of the tilemap as a vector 2 value
     * if wrapx is true the x position will be wrapped within the area of the tilemap
     * if wrapy is true the y position will be wrapped within the area of the tilemap
     * @param {vector2} value the x and y position to set
     */
    set position(value){
        this.#position = value;
        if (this.wrapx){
            if (value.x < 0) {this.#position.x = this.area.w - (-value.x) % this.area.w;}
            else if (value.x > this.area.w){ this.#position.x = value.x % this.#area.w;}
        }
        if (this.wrapy){
            if (value.y < 0) {this.#position.y = this.area.h - (-value.y) % this.area.h;}
            else if (value.y > this.area.h){ this.#position.y = value.y % this.#area.h;}
        }
        this.#screenarea.x = this.#position.x;
        this.#screenarea.y = this.#position.y;
    }
    /** 
     * sets the tilemap poisition so its horizontal centre is at this position
     * @param {float} value
     */
    set centrex(value){this.#position.x = value - this.#area.w /2;
        this.#screenarea.x = this.#position.x;}
    /**
     *  sets the tilemap poisition so its vertical centre is at this position
     * @param {float} value
     */
    set centrey(value){this.#position.y = value - this.#area.h /2;
        this.#screenarea.y = this.#position.y;}

    /** @returns {float} the x position of the tilemap */
    get x(){return this.#position.x;}
    /** @returns {float} the y position of the tilemap */
    get y(){return this.#position.y;}
    /**
     *  sets the position of the tilemap as a vector 2 value
     * if wrapx is true the x position will be wrapped within the area of the tilemap
     * @param {float} value 
     */
    set x(value){
        this.#position.x = value;
        if (false){//this.wrapx){
            if (value< 0) {this.#position.x = this.area.w - (-value) % this.area.w;}
            else if (value > this.area.w){ this.#position.x = value % this.#area.w;}
        }
        this.#screenarea.x = this.#position.x;
    }
    /** 
     * sets the x position of the tilemap
     * if wrapy is true the y position will be wrapped within the area of the tilemap
     * @param {float} value 
     */
    set y(value){
        this.#position.y = value;
        if (this.wrapy){
            if (value < 0) {this.#position.y = this.#area.h - (-value) % this.#area.h;}
            else if (value > this.area.h){ this.#position.y = value % this.#area.h;}
        }
        this.#screenarea.y = this.#position.y;
    }
    /** @type {int} number of tile rows in the tilemap */
    rows = 0;
    /** @type {int} number of tile columns in the tilemap */
    cols = 0;
    /** @type {Tile[]} an array of tiles, the position of the tile in the list gives it's index for entering into the tilemap */
    #tiles = null;
    /** gets the tiles for the tilemap, do not add items directly */
    get tiles(){return this.#tiles;}
    /** @type {string} holds the tile list defined in string formatted tilemap files */
    tileindex = null;
    // //specify a colour value to have the tilemap show edges of tiles
    // /** @type {color} if a colour is set (not null) then gridlines will be drawn over the tilemap */
    // gridlines = null; not used probably need a overlay for this

    /** @type {texture|image} holds the layer that this tilemap will be rendered to
     * 
     * by default (on construction) this will be Engine.backmap (the first of all layers drawn)
     */
    layer = null;
    /** if false then tilemap position is in terms of the viewport window, if true then position is world co-ordinates
     * any movement of the viewport will move the tilemap accordingly*/
    world = false;
    /** 
     * holds the current wipe data, assuming you have set the tilemap to wipeusing the wipe() method
     * @type {{ti:Timer,col:int,row:int,di:{c:int,r:int}}} */
    wipesystem = null;

    /**
     * clears tiles from tilemap , row by row or column by column, this sets all tiles to Tilemap.EMPTY (-1)
     * @param {float} time  time is the total time for wipe to occur
     * @param {SlideMethod} wipedirection is a SlideMethod dissapear/appear treated the samed
    */
    wipe(time, wipedirection){
        let gap;
        switch (wipedirection){
            case SlideMethod.upAppear:case SlideMethod.upDissapear:
            case SlideMethod.downAppear:case SlideMethod.downDissapear:
                gap = time / this.rows;
                this.wipesystem = {ti:new Timer(),col:0,row:0,di:{c:0,r:1}};
                this.wipesystem.ti.interval(gap);
                if (wipedirection == SlideMethod.upAppear || wipedirection == SlideMethod.upDissapear){
                    this.wipesystem.row = this.rows - 1;
                    this.wipesystem.di.r = -1;
                }
                break;
            case SlideMethod.leftAppear:case SlideMethod.leftDissapear:
            case SlideMethod.rightAppear:case SlideMethod.rightDissapear:
                gap = time / this.cols;
                this.wipesystem = {ti:new Timer(),col:0,row:0,di:{c:1,r:0}};
                this.wipesystem.ti.interval(gap);
                if (wipedirection == SlideMethod.rightAppear || wipedirection == SlideMethod.rightDissapear){
                    this.wipesystem.col = this.cols - 1;
                    this.wipesystem.di.c = -1;
                }
                break;
                    
        }
    }
    /** performs the internal wipe operation */
    #dowipe(){
        this.wipesystem.ti.update();
        if (this.wipesystem.ti.elapsedReset){
            const w = this.wipesystem;
            //horizontal wipe
            if (w.di.r != 0){
                this.clrMapGraphic({x:w.col,y:w.row},{w:this.cols,h:1});
                w.row += w.di.r;
                if (w.row == this.rows || w.row == -1){
                  w.ti.cleanup();
                  w.ti = null;
                  this.wipesystem = null;
                }
            } else {//vertical wipes
                this.clrMapGraphic({x:w.col,y:w.row},{w:1,h:this.rows});
                w.col += w.di.c;
                if (w.col == this.cols || w.col == -1){
                  w.ti.cleanup();
                  w.ti = null;
                  this.wipesystem = null;
                }
            }
        }
    }
    /** remove any references from the tilemap. make sure you implement cleanup in your own tilemaps 
     * if you need to release any resources (and make sure you call super.cleanup()) */
    cleanup(){
        this.alphamap = null;
        this.colourmap = null;
        this.collisionmap = null;
        this.layer = null;
        this.#map = null;
        this.area = null;
        this.#tilesize = null;
        this.#position = null;
        this.#tiles=null;   
        this.#releaseTextures();
    }
    #releaseTextures() {
        for (let r = 0; r < this.#txdims.h/*this.#txhigh*/; r++){
            for (let c = 0; c < this.#txdims.w/*this.#txwide*/; c++){
                this.textures[r][c].tx.remove();
                this.textures[r][c].tx = null;
                this.textures[r][c] = null;
            }
        }
    }


    /** simple way of working out sensible tiling sizes for offscreen rendering of the tilemap into
     * it's sub textures
     * @param {int} a value to to shrink till a factor of into
     * @param {int} into value we want a factor for
     */
    #biggestfactor(a, into){
        while (into % a != 0){
            a--;
        }
        return a;
    }

    /** builds textures but makes size a multiple of base tilewidth ignoring mip mapping
    * possibilities in the future which is iok for tilemaps in general */
    #setTexturesNew(){
        this.#txcolsrows.w = this.#biggestfactor(((this.#maxtex / this.#tilesize.w) | 0), this.cols);
        this.#txcolsrows.h = this.#biggestfactor(((this.#maxtex / this.#tilesize.h) | 0), this.rows);

        this.#txSize.w = this.#tilesize.w * this.#txcolsrows.w;
        this.#txSize.h = this.#tilesize.h * this.#txcolsrows.h;
        this.#txSizeScaled.w = this.#txSize.w;
        this.#txSizeScaled.h = this.#txSize.h;

        this.#txdims.w = this.cols / this.#txcolsrows.w; 
        this.#txdims.h = this.rows / this.#txcolsrows.h; 

        //this.#txwide = this.cols / this.#txcolsrows.w;//(this.cols * this.#tilesize.w ) / this.#txSize.w;
        //this.#txhigh = this.rows / this.#txcolsrows.h;//(this.rows * this.#tilesize.h ) / this.#txSize.h;
        
        this.textures = new Array(this.#txdims.h);//this.#txhigh);
        for (let p = 0; p < this.textures.length; p++){
            this.textures[p] = new Array(this.#txdims.w);//this.#txwide);
        }

        for (let r = 0; r < this.#txdims.h/*this.#txhigh*/; r++){
            for (let c = 0; c < this.#txdims.w/*this.#txwide*/; c++){
                this.textures[r][c] = {tx:this.#makeTexture(this.#txSize.w, this.#txSize.h),
                    w:this.#txSize.w,
                    h:this.#txSize.h
                };
            }
        }
        this.#drawlocalnew();
        let a = 6;
    }

    //new version
    /** draw thetilemap to the offscreen render textures */
    #drawlocalnew(){
        if (this.#map != null){
            let rd;
            let tilenum;
            const w = this.#tilesize.w;
            const h =  this.#tilesize.h;
            for (let r = 0; r < this.rows; r++){
                for (let c = 0; c < this.cols; c++){
                    //check for no tile
                    if ((tilenum = this.#map[r][c]) != Tilemap.EMPTY){
                        let fr = this.#tiles[tilenum];
                        rd = this.#tiletoTXnew({x:c,y:r});
                        this.#setGtilenew(rd, fr);
                    }
                }
            }
        }        
    }
    /** clears the tile in the correct offscreen render target */
    #clrGtilenew(rd){
        const w = this.#tilesize.w;
        const h = this.#tilesize.h;
        rd.tx.push();
        rd.tx.fill(255,0,0,255);
        rd.tx.noStroke();
        rd.tx.drawingContext.globalCompositeOperation = "destination-out";
        rd.tx.rect(rd.x*w, rd.y*h, w, h);
        rd.tx.pop();
    }
    /** sets a tile in the correct offscreen render target
     * @param {{tx:this.textures[tr][tc].tx,x:rx, y:ry}} rd target offscreen texture information
     * @param {{tex:texture,port:Rectangle}} fr tile render information
     */
    #setGtilenew(rd, fr){
        const w = this.#tilesize.w;
        const h = this.#tilesize.h;
        const x = rd.x * w;
        const y = rd.y * h;
        rd.tx.push();
        rd.tx.fill(255,0,0,255);
        rd.tx.noStroke();
        rd.tx.drawingContext.globalCompositeOperation = "destination-out";
        rd.tx.rect(x, y, w, h);
        rd.tx.pop();
        rd.tx.image(fr.tex, x, y, w, h,
            fr.port.x, fr.port.y, w, h);
    }
    //doesn't need to worry about partial laps, way way simpler
    /** works out offscreen render texture and its position based on the tilemap location given */
    #tiletoTXnew(loc){
        let rx = loc.x % this.#txcolsrows.w;
        let ry = loc.y % this.#txcolsrows.h;
        let tc = (loc.x / this.#txcolsrows.w) | 0;
        let tr = (loc.y / this.#txcolsrows.h) | 0;
        //x, y are top left corner to draw to in the texture
        return {tx:this.textures[tr][tc].tx,x:rx, y:ry};
    }
    /** internal rendering for the graphic tile
     * @param {{x:int,y:int}} loc tilemap location
     * @param {int} tile the tile index to render at the given location
     */
    #setgraphictilenew(loc, tile){
        let rd;
        if (tile == Tilemap.EMPTY){
            //clear region ???
            rd = this.#tiletoTXnew(loc);
            this.#clrGtilenew(rd)
        } else {
            let fr = this.#tiles[tile];
            rd = this.#tiletoTXnew(loc);
            this.#setGtilenew(rd, fr)
        }
    }

    // NO LONGER USED IT WAS FROM THE PREVIOUS RENDER SYSTEM
    // /** returns an object referencing the active texture and offset tile location for the global render,
    //  * this may contain several elements if across multiple textures 
    //  * christ this all got complicated really quickly this might not be a good option*/
    // #tiletoTX(loc){
    //     let rightoverflow = false;
    //     let ref  = [];
    //     let rx = loc.x * this.#tilesize.w;
    //     let ry = loc.y * this.#tilesize.h;
    //     let tc = Math.floor(rx / this.#maxtex);
    //     let tr = Math.floor(ry / this.#maxtex);
    //     let renderw;
    //     let renderh;
    //     rx -= this.#maxtex * tc;
    //     renderw = (rx + this.#tilesize.w > this.#maxtex) ? this.#maxtex - rx : this.#tilesize.w;
    //     ry -= this.#maxtex * tr;
    //     renderh = (ry + this.#tilesize.h > this.#maxtex) ? this.#maxtex - ry : this.#tilesize.h;
    //     //x, y are top left corner to draw to in the texture, rw, wh are width and height to draw
    //     // px, py are start offsets to apply to texture portion
    //     let tldata = {tx:this.textures[tr][tc].tx,x:rx, y:ry, rw:renderw,rh:renderh, px:0, py: 0};
    //     ref.push(tldata);
    //     //flow over to next texture across
    //     if (renderw < this.#tilesize.w) {
    //         ref.push({tx:this.textures[tr][tc+1].tx,x:0, y:ry, rw:this.#tilesize.w - renderw,rh:renderh, px:renderw , py:0});
    //         rightoverflow = true;
    //     }
    //     //check down and right
    //     if (renderh < this.#tilesize.h){
    //         ref.push({tx:this.textures[tr+1][tc].tx,x:rx, y:0, rw:renderw,rh:this.#tilesize.h-renderh, px:0, py:renderh});
    //         if (rightoverflow){
    //             ref.push({tx:this.textures[tr+1][tc+1].tx,x:0, y:0, rw:this.#tilesize.w - renderw,rh:this.#tilesize.h-renderh, px:renderw , py:renderh});
    //         }
    //     }
    //     return ref;
    // }

    /** creates a texture (for the offscreen renderer)
     * @param {int} w pixels wide
     * @param {int} h pixels high
     */
    #makeTexture(w, h){
        let t = createGraphics(w, h);
        t.pixelDensity(1);
        t.clear();
        return t;
    }

    /**
     * Takes a tilemap and returns an image texture with transparency where no tile exists or the the given
     * 
     * @param {{region:Rectangle,transparentTile:int,scalex:int,scaley:int}} settings to control the size and data set for the generated graphic image
     * 
     * {Rectangle} region the start column (x) and start row (y) of the tilemap section to generate an image from
     * number of columns to examine (width) and number of rows to examine (height)
     * 
     * {int} transparentTile the tile number to be considered transparent (if ommitted 0 and -1 is assumed) 
     * note -1 is always considered transparent
     * 
     * {int} scalex number of pixels horizontally each tile should represent
     * 
     * {int} scaley number of pixels vertically each tile should represent
     * 
     */
    #tilemapToMonoImage(settings){//transparentTile, scale, region){
        //to come

    }
    /**
     * Attempts to centre the tilemap within the world area
     */
    centreInworld(){
        this.centrehere(Engine.worldarea);
    }
    /**
     * Attempts to centre the tilemap within the main view area
     */
    centreInmainview(){
        this.centrehere(Engine.mainviewArea);
    }
    /** centre's the tilemap in it's default view (if more than one) */
    centreinmyview(){
        this.centrehere(this.view.area);
    }
    //needs to take account of world coords - does it
    /** 
     * centres the tilemap around the rectangle given 
     * @param {Rectangle} rect the rectanglular area to attempt to centre the tilemap around
     * */
    centrehere(rect){
        this.#position.x = rect.w/2 - this.area.w/2;
        this.#position.y = rect.h/2 - this.area.h/2;
        this.#screenarea.x = this.#position.x;
        this.#screenarea.y = this.#position.y;
    }
    /** @type {bool} if true loaded tilemaps will be verified */
    #verifymap = false;
    /**
     * if set to true then the map will be verified to ensure index match with tiles defined
     * set this before you attempt to either use setmap or before loading a map from a file
     * 
     * if they are incorrect then an error will be thrown
     * @returns {bool}
     */
    get verifymap() {return this.#verifymap;}
    /** 
     * if set to true then the map will be verified to ensure index match with tiles defined
     * set this before you attempt to either use setmap or before loading a map from a file

    * @param {bool} value 
     */
    set verifymap(value){this.#verifymap = value;}
    /**
     * creates a tilemap from the given 2d array of integers.
     * The integers represent tile indexes, make sure you have defined an appropriate number of tiles to match all the indexes supplied
     * 
     * You can set the verifymap property to true before using setmap to check you won't have tile problems
     * 
     * @param {int[][]} map 2d array of tile indexes that represent tiles from the tileset, set tiles before specifiying the map. If an index is in the map you'll get texture and width errors during rendering. Run this.verifymap() to ensure you don't have this problem
     * @param {vector2|{w:float,h:float}} scale sets a scale size if given, ignore the parameter if you do not wish to set the scale on creation
     */
    setmap(map, scale){
        if (map !== undefined){
            this.#map = map;
            this.rows = map.length;
            this.cols = map[0].length;
            if (this.verifymap) {this.#verifymaptiles()}
            this.area = new Rectangle(0, 0, this.cols * this.#tilesize.w * this.#scale.w, this.rows * this.#tilesize.h * this.#scale.h);
            this.sw = (scale === undefined) ? 1 : scale.w;
            this.sh = (scale === undefined) ? 1 : scale.h;
    
            //this.area = new Rectangle(0, 0, this.cols * this.#tilesize.w * this.#scale.w, this.rows * this.#tilesize.h * this.#scale.h);
        } else { console.log("Tilemap.setmap(no map defined");}
    }
    /**
     * will process a sprite/tilesheet looking to define a list of tiles 
     * 
     * you must specify tilesize in object format {w:32,h:32}
     *     
     * If the tiles/sprites do not fill the texture then make sure you say 
     * how many rows and columns exist, if they are not specified as many whole (based on texture and tilesize) 
     * rows and columns found in the texturewill be converted
     * 
     * if the tiles/sprites have a gap/padding between them specify that using xpad and ypad (if not set they will be assumed to be 0 (no gaps between))
     * 
     * specify control data using an anonymous class @example {rowstall:0,colswide:0,xpad:0,ypad:0}
     * @param {image | texture} texture the texture containing your tiles
     * @param {{w:int,h:int}} tilesize an object with w and h properties containing the widht and height of the tiles (they are all the same)
     * @param {{rowstall:int,colswide:int,left:int,top:int,xpad:int,ypad:int}} data an object containing various properties
     * rowstall: how many rows of tiles to rip fro the texture
     * colswide: how many columns to rip
     * left: the left and edge to start reading pixel data from the texture
     * top: the top edge to start reading pixel data from the texture (left and top provide the top left hand corner fo the block of graphics)
     * xpad: how far apart horizontally are each tile columns in the texture
     * ypad: how far apart vertically are each of the tile rows in the texture
    */
    tilesFromTexture(texture, tilesize, data){
        Engine.riptiles(this.#tiles, texture, tilesize, data);
        this.#tilesize.x = tilesize.w;
        this.#tilesize.y = tilesize.h;
    }
    /** will process a sprite/tilesheet looking for define a list of tiles 
     * 
     * you must specify tilesize in object format {w:32,h:32}
     *     
     * If the tiles/sprites do not fill the texture then make sure you say 
     * how many rows and columns exist, if they are not specified as many whole (based on texture and tilesize) 
     * rows and columns found in the texturewill be converted
     * 
     * if the tiles/sprites have a gap/padding between them specify that using xpad and ypad (if not set they will be assumed to be 0 (no gaps between))
     * 
     * specify control data using an anonymous class @example {rowstall:0,colswide:0,xpad:0,ypad:0}
     * @param {image | texture} texture the texture containing your tiles
     * @param {{w:int,h:int}} tilesize an object with w and h properties containing the widht and height of the tiles (they are all the same)
     * @param {{rowstall:int,colswide:int,left:int,top:int,xpad:int,ypad:int}} data an object containing various properties
     * rowstall: how many rows of tiles to rip fro the texture
     * colswide: how many columns to rip
     * left: the left and edge to start reading pixel data from the texture
     * top: the top edge to start reading pixel data from the texture (left and top provide the top left hand corner fo the block of graphics)
     * xpad: how far apart horizontally are each tile columns in the texture
     * ypad: how far apart vertically are each of the tile rows in the texture
    */
    tilesfromTilesheet(texture, tilesize, data){
        Engine.riptiles(this.#tiles, texture, tilesize, data);
        this.#tilesize.x = tilesize.w;
        this.#tilesize.y = tilesize.h;
    }    
    /** 
     * clone an existing tileset (making these tiles unique for this tilemap)
     * @param {Tile[]} tileset tiles defined in an array (can be the tiles of a tilemap  tilmapinstance.tiles or from a manual array of Tile)
     */
    tilesCloneFromTileset(tileset){
        for (let p = 0; p < tileset.length; p++){
            const t = tileset[p];
            let n = new Tile(t.tex, t.port.clone, t.hmap, t.vmap);
            this.#tiles.push(n);
        }
    }
    /** takes a complete texture/image and breaks int tiles building a tilemap 
    * to reference all the rectangluar regions, you must either set an area and tilesize if this is the first texture you are placing
    * @param {image | texture} texture 
    * @param {vector2} position: position to start tiling the texture too (if it goes out of the map then it will error)
    * @param {object{area:{w,h},tilesize:{w:h}}} areadata if specified then the area is based on these dimensions, if not then the texture is tiled at the position given
    * make sure the area can accomodate all the textures you wish to tile
    * @example
    *     this.tileTexture(txback00, {x:0,y:864}, {area:{w:12000,h:1536},tilesize:{w:16,h:16}});
    *     this.tileTexture(txback2000, {x:2000,y:864});
    *     this.tileTexture(txback4000, {x:4000,y:864});
    *     this.tileTexture(txback6000, {x:6000,y:432});
    *     this.tileTexture(txback8000, {x:8000,y:0});
    *     this.tileTexture(txback10000, {x:10000,y:0});
    * */
    tileTexture(texture, position, areadata){
        ///  NEED TO RE-THINK NEED TO GENERATE TEXTURES MANUALLY DON'T LET SETTING THE AREA DO IT
        if (areadata !== undefined){
            this.#createMap(areadata.area, areadata.tilesize);
            this.#area = new Rectangle(0, 0, this.cols * this.#tilesize.w * this.#scale.w, this.rows * this.#tilesize.h * this.#scale.h);
        }
        if (this.map == null) {console.log("no map defined in tileTexture, if this is the first texture set an area and tilesize");return;}
        //build the tile list, get what will be first tilenumber for filling the tilemap in in a minute
        let tilenum = this.#tiles.length;
        let cols = (texture.width / this.#tilesize.w) | 0;
        let rows = (texture.height / this.#tilesize.h) | 0;

        let data = {colswide:cols,rowstall:rows,left:0,top:0,xpad:0,ypad:0};
        Engine.riptiles(this.#tiles, texture, this.#tilesize, data);

        //build texture to tilemap (not worrying about duplicate tiles - if i do this in the future i'll need a custom ripper to fill map at same time)
        let loc = {x:position.x / this.#tilesize.w,y:position.y / this.#tilesize.h};
      
        let x = loc.x;
        for (let r = 0; r < rows; r++){
            for (let c = 0; c < cols; c++){
                this.#map[loc.y][x++] = tilenum++;
            }
            x = loc.x;
            loc.y++;
        }
        this.#releaseTextures();
        this.#setTexturesNew();//this.#setTextures();
    }
    
    /** builds an empty tilemap full of -1 tiles make sure tilesize is a factor of area */
    #createMap(area, tilesize){
        this.rows = (area.h / tilesize.h) | 0;
        this.cols = (area.w / tilesize.w) | 0;
        this.#tilesize.x = tilesize.w;
        this.#tilesize.y = tilesize.h;
        this.#map = new Array(this.rows);
        for (let r = 0; r < this.rows; r++) {
            this.#map[r] = new Array(this.cols);
            for (let c = 0; c < this.cols; c++){
                this.#map[r][c] = -1;
            }
        }
    }


    /** 
     * adds an existing tileset references to this tilemaps tiles 
     * @param {Tile[]} tileset tiles defined in an array (can be the tiles of a tilemap  tilmapinstance.tiles or from a manual array of Tile)
     */
    tilesAddFromTileset(tileset){
        for (let p = 0; p < tileset.length; p++){
            this.#tiles.push(tileset[p]);
        }
    }
    /** adds a single tile to the tile list 
     * @param {Image | texture} tex the texture that contains the image for the tile
     * @param {Rectangle} port the portion of the texture to use for the tile (ensure its the same width/height as other tiles). If ommitted then entire texture used be careful
    */
    tileadd(tex, port){
        if (tex === undefined) {
            console.log("texture undefined in tileadd");
        }
        port = (port === undefined) ? new Rectangle(0,0,tex.width, tex.height):port;
        this.#tiles.push(new Tile(tex, port));
        this.#tilesize.x = port.w;
        this.#tilesize.y = port.h;        
    }
    // NOT IN USE YET
    // /
    // #create(texture, area, scale, autotile){

    // }
    // /** creates a tilemap ready to accomodate tiled textures, make sure the tilesize is a factor of the textures you will tile */
    // defineArea(area, tilesize){
    //     this.#create(null, area, scale, false);
    //     this.area = area;
    //     this.#scale.w = scale.w;
    //     this.#scale.h = scale.h;
    // }
    // /** takes an entire image/texture and splits into tiles, calculating and defining only unquie tiles
    //  * not implmented yet
    //  */
    // #definefromTexture(texture, tilesize, autotile){
    //     this.#create(texture, {w:texture.width,h:texture.height}, tilesize, autotile);
    // }


    update(){
        if (this.wipesystem != null){this.#dowipe();}
    }
    /** draws the tilemap if visible is true */
    draw(){
        if (this.visible){
            /**viewport width */
            let vw = this.view.w;
            /**viewport height */
            let vh = this.view.h;
            /**number of offscreen textures that would fill view area */
            let vtw = 2 + (vw / this.#txSizeScaled.w) | 0; //precalc??
            let vth = 2 + (vh / this.#txSizeScaled.h) | 0; //precalc??
            //let vtw = 2 + (vw / sw) | 0; //precalc
            let sx = (this.world ? this.x - this.view.x * this.scrollmultiplier.x : this.x) | 0;
            let sy = (this.world ? this.y - this.view.y * this.scrollmultiplier.y : this.y) | 0;
            //if wrapping then I need to mod by texture area
            //calculate renderwidth and renderheight
            let diffw = vw - sx;
            let diffh = vh - sy;
            let rw = (0.9 + diffw / this.#txSizeScaled.w)|0;
            let rh = (0.9 + diffh / this.#txSizeScaled.h)|0;
            let extratiles;
            /** off screen texture column to start rendering from */
            let stc = 0;
            if (!this.wrapx) {
                //crop renderwidth
                rw = rw > this.#txdims.w? this.#txdims.w : rw;
                if (sx < 0){
                    let reducetiles = (-sx/this.#txSizeScaled.w)|0;
                    reducetiles = reducetiles > this.#txdims.w ? this.#txdims.w : reducetiles;
                    rw -= reducetiles;
                    stc += reducetiles;
                    sx += reducetiles * this.#txSizeScaled.w;
                }
            } else { //wrapping checks
                if (sx > 0){ //away from left edge
                    extratiles = 1 + (sx/this.#txSizeScaled.w)|0;
                    sx -= extratiles * this.#txSizeScaled.w;
                    rw += extratiles;
                    stc = this.#txdims.w - extratiles % this.#txdims.w;
                } 
                //crop number of off screen textures to limit of view area + 2 either side
                rw = vtw > rw ? vtw : rw;
            }

            /** off screen texture row to start rendering from */
            let str = 0;
            if (!this.wrapy) {
                //crop renderheight
                rh = rh > this.#txdims.h? this.#txdims.h : rh;
                if (sy < 0){
                    let reducetiles = (-sy/this.#txSizeScaled.h)|0;
                    reducetiles = reducetiles > this.#txdims.h ? this.#txdims.h : reducetiles;
                    rh -= reducetiles;
                    str += reducetiles;
                    sy += reducetiles * this.#txSizeScaled.h;
                }
            } else { //wrapping checks
                if (sy > 0){ //away from top edge
                    extratiles = 1 + (sy/this.#txSizeScaled.h)|0;
                    sy -= extratiles * this.#txSizeScaled.h;
                    rh += extratiles;
                    str = this.#txdims.h - extratiles % this.#txdims.h;
                } 
                //crop number of off screen textures to limit of view area + 2 either top or bottom
                rh = vth > rh ? vth : rh;
            }

            //MsgBus.send(mymess.uimessage,{txt:"s:" + sx + "," + sy + "  diff:" + diffw +","+diffh+ " render:" + rw + "," + rh + " textures ",x: 50,y: 50});
            //MsgBus.send(mymess.uimessage,{txt:"sy:" + sy + "  str:" + str + " rh:" + rh + " extra:" + extratiles,x: 50,y: 50});
            //nothing to render check could be done before row calculations
            if (rw <= 0) return;
            if (rh <= 0) return;
            //}
            //let y = sy;//could just use sy
            //let tr = str;//could just use str

            //crop test
            this.layer.clip(() => {
                const r = this.view.area;
                //this.layer.drawingContext.rect(r.x,r.y,r.w,r.h);
                this.layer.rect(r.x,r.y,r.w,r.h);
            });
            //let can = this.layer.getContext("2d");
            this.layer.push();
            this.layer.drawingContext.globalAlpha = this.alpha;
            //preserve start y and start row for overlay renders
            let tr = str;
            let y = sy;
            for (let r = 0; r < rh; r++){
                if (tr == this.#txdims.h) tr = 0;
                let tc = stc;
                let x = sx;
                for (let c = 0; c < rw; c++){
                    if (tc == this.#txdims.w) tc = 0;
                    //this.layer.drawingContext.drawImage(this.textures[str][tc++].tx, x, sy, this.#txSizeScaled.w, this.#txSizeScaled.h);
                    this.layer.image(this.textures[tr][tc++].tx, x, y, this.#txSizeScaled.w, this.#txSizeScaled.h);
                    x +=  this.#txSizeScaled.w;
                }
                y +=  this.#txSizeScaled.h;
                tr++;
            }

            // this is really slow
            if (this.overlay != TilemapOverlay.NONE){this.#drawover();}
            this.layer.pop();
        }
    }

    /** provides overaly support (buggy) not a full or proper solution yet*/
    #drawover(){
        this.layer.fill(this.overlayCol);
        let x = this.x + this.visibletilesize.w/2 - 4 - this.view.x;
        let y = this.y + this.visibletilesize.h/2 + 4 - this.view.y;
        switch (this.overlay){
            case TilemapOverlay.COLLISION:
                if (this.collisionmap != null){
                    for (let r = 0; r < this.rows; r+=this.overlayskip){
                        for (let c = 0; c < this.cols; c+=this.overlayskip){
                        this.layer.text(this.collisionmap[r][c], x + c * this.visibletilesize.w , y + r * this.visibletilesize.h);
                        }
                    }
                } break;
            case TilemapOverlay.GRAPHIC:
                if (this.collisionmap != null){
                    for (let r = 0; r < this.rows; r+=this.overlayskip){
                        for (let c = 0; c < this.cols; c+=this.overlayskip){
                        this.layer.text(this.#map[r][c], x + c * this.visibletilesize.w , y + r * this.visibletilesize.h);
                        }
                    }
                } break;
    
           case TilemapOverlay.ROW_COL:
               if (this.collisionmap != null){
                   for (let r = 0; r < this.rows; r+=this.overlayskip){
                       for (let c = 0; c < this.cols; c+=this.overlayskip){
                       this.layer.text(c + ":" + r, x + c * this.visibletilesize.w , y + r * this.visibletilesize.h);
                       }
                   }
               } break;
           case TilemapOverlay.COORDS:
               if (this.collisionmap != null){
                   for (let r = 0; r < this.rows; r+=this.overlayskip){
                       for (let c = 0; c < this.cols; c+=this.overlayskip){
                       this.layer.text((x + c * this.visibletilesize.w) + ":" + (y + r * this.visibletilesize.h), x + c * this.visibletilesize.w , y + r * this.visibletilesize.h);
                       }
                   }
               } break;
            case TilemapOverlay.GRID:
            if (this.collisionmap != null){
                for (let r = 0; r < this.rows; r+=this.overlayskip){
                    for (let c = 0; c < this.cols; c+=this.overlayskip){
                    this.layer.text((x + c * this.visibletilesize.w) + ":" + (y + r * this.visibletilesize.h), x + c * this.visibletilesize.w , y + r * this.visibletilesize.h);
                    }
                }
            } break;
        } 
    }

    /** uses a string map file that contains the information on map size and tile map values, 
     * this happens asynchronously so we need callback so we know that the tilemap is in place and ready to be processed/interrogated
    * 
    * @param {string} filename full path or relative path to the file to load, this will only work on a live server
    * @param {{callback:method|function,instance:object}} callback code to execute once map is loaded
    * use Engine.makeCallback like this to format your callback this.loadmapFromCSVfile("./combatmaze.csv",Engine.makeCallback(this.loaded, this));
    * @param {bool} debug if true then the file will be echo'd to the console. only use this for testing
    * 
    * size is determined automatically by the width of data and number of lines in map.
    * 
    * first string is a string containing the tile positions for the characters.
    * eg if the first string contained "abcd" this would convert
    * subsequent tile values from a to 0, b to 1, c to 2, and d to tile 3
    * any other character turned into a null tile -1
    * 
    * second string in file contains the width and height of the tiles in tilemap
    * 
    * @example 
    * ;file start - lines starting with ; are ignored
    * ;a - is border
    * ;b - is a breakable wall character
    * ;c - is player start position
    * ;x - ignored so empty tile is placed at this location
    * abcdefg
    * ;tile width 16 and 20 high
    * 16,20
    * aaaaaaa
    * axxbxxa
    * axxcxxa
    * axxbxxa
    * aaaaaaa
    * 
    * would create a tile map 5 rows and 7 columns, tile size 16 pixles wide and 20 pixels high with 7 different tiles
    * a border of tile 0 with tile 1 in a line down the centre, null tiles everywhere else
    *
    * <param name="filename">filename containing the map</param>
    * <returns>true if read correctly</returns>
    * <remarks></remarks>
    * */
    async loadmapFromStringfile(filename, callback, debug)
    {
        let loaded;
        //console.log(filename);
        const myRequest = new Request(filename);
        fetch(myRequest)
          .then((response) => response.text())
          .then((text) => {
            //loaded = text;
            if (debug) console.log(text);
            this.#processStringfile(text,callback);
          });
    }
    /**
    /** uses a string map file that contains the information on map size and tile map values, 
     * this happens asynchronously so we need callback so we know that the tilemap is in place and ready to be processed/interrogated
     * 
     * width and height are implied by the rows and columns, 
     * 
     * ; (semi-colon) at the start of the line acts as a comment line is ignored
     * 
    * @param {string} filename full path or relative path to the file to load, this will only work on a live server
    * @param {{callback:method|function,instance:object}} callback code to execute once map is loaded
    * use Engine.makeCallback like this to format your callback this.loadmapFromCSVfile("./combatmaze.csv",Engine.makeCallback(this.loaded, this));
    * @param {bool} debug if true then the file will be echo'd to the console. only use this for testing
    * @example 
    * ;set the initial renderscale to 1 in both directions
    * scal:1,1
    * ;basic atari vcs combat tank map
    * ;each tile will be 20x20 pixels
    * ;so I'm going for 40 tiles wide and 30 high (minus 2 for score)
    * ;giving a map 800 x 600 pixels in size
    * 
    * 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
    * 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
    * 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
    * 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
    * 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
    * 1,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
    * 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
    * 1,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
    * 1,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
    * 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
    * 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
    * 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1
    * 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
    * 1,0,0,0,1,1,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1
    * 1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1
    * 1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1
    * 1,0,2,0,0,1,0,0,0,0,1,1,1,1,1,0,0,2,0,3,0,0,2,0,0,1,1,1,1,1,0,0,0,0,1,0,0,3,0,1
    * 1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1
    * 1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1
    * 1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1
    * 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
    * 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,1
    * 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
    * 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
    * 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,2,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,1
    * 1,0,0,0,0,0,0,0,0,0,2,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,1
    * 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
    * 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
    * 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
    * 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
    * 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1     */
    async loadmapFromCSVfile(filename, callback, debug)
    {
        let loaded;
        //console.log(filename);
        const myRequest = new Request(filename);
        try{
            fetch(myRequest)
              .then((response) => response.text())
              .then((text) => {
                //loaded = text;
                if (debug) console.log(text);
                this.#processCSVfile(text, callback);
              });
        } catch(e){
            console.log(e);
        }
    }
    /** handles data loaded from map file */
    #processStringfile(line, callback){
        let lines = line.split(/\r?\n|\r|\n/g);
        let scale;
        let mapdata= [];
        //skip all white space before processing
        for (let p = 0; p < lines.length; p++){
            let a = lines[p].trim().length;
            let b = lines[p][0] ;
            //if (mapdata[p].trim().length == 0 || mapdata[p][0] == ';'){
            if (!(a == 0 || b == ';')){
                mapdata.push(lines[p]);
            }
        }
        //grab tilelist and scale info
        this.tileindex = mapdata[0].slice(5);
        let dims =  mapdata[1].slice(5).split(',');
        scale={w:parseFloat(dims[0]),h:parseFloat(dims[1])};
        //process map layout data find widest row
        let width = 0;
        for (let p = 2; p < mapdata.length; p++){
            width = (mapdata[p].length > width) ? mapdata[p].length : width;
        }
        mapdata.splice(0,2);
        let map = new Array(mapdata.length);
        let c = 0;
        for (let r = 0; r < mapdata.length; r++){
            map[r] = new Array(width);
            const row = mapdata[r];
            for (let c = 0; c < width; c++){
                map[r][c] = (c < row.length) ? this.tileindex.indexOf(row[c]) : 0;
            }
        }
        this.setmap(map, scale);
        Engine.processCallback(callback);
    }
    /** handles data loaded from mapfile */
    #processCSVfile(line, callback){
        let lines = line.split(/\r?\n|\r|\n/g);
        let scale;
        let mapdata= [];
        //skip all white space before processing
        for (let p = 0; p < lines.length; p++){
            let a = lines[p].trim().length;
            let b = lines[p][0] ;
            //if (mapdata[p].trim().length == 0 || mapdata[p][0] == ';'){
            if (!(a == 0 || b == ';')){
                mapdata.push(lines[p]);
            }
        }

        let dims =  mapdata[0].slice(5).split(',');
        scale = {w:parseFloat(dims[0]),h:parseFloat(dims[1])};
        mapdata.splice(0,1);//2);        
        let map = new Array(mapdata.length);
        let widest = 0;
        for (let p = 0; p < mapdata.length; p++){
            const row = mapdata[p].split(',');
            widest = (row.length > widest) ? row.length : widest;
        }
        //width = isNaN(width) ? widest : width;

        let c = 0;
        for (let r = 0; r < mapdata.length; r++){
            map[r] = new Array(widest);
            map[r].fill(-1);
            const row = mapdata[r].split(',');
            let usewidth = (row.length < widest) ? row.length : widest;
            let n = 0;
            for (let c = 0; c < usewidth; c++){
                map[r][c] = parseInt(row[c]);
            }
        }
        this.setmap(map, scale);
        Engine.processCallback(callback);
    }
    /**
     * attempts to write the tilemap to a CSV file
     * @param {string} filename requested file name to write, saving must be done by the user
     */
    async writeasCSV(filename){
        try{
        const handle = await window.showSaveFilePicker({suggestedName:filename});
        // create a FileSystemWritableFileStream to write to
        const writableStream = await handle.createWritable();
        let b = this.CSV;
        await writableStream.write(b);
        await writableStream.close();
        } catch(error){
            console.log(error.name, error.message);
        }
    }
    get CSV(){
        let lines = "";
        lines = ";maximum width";
        lines += "\nmaxw:" + this.cols;
        lines += "\n;tile dimensions";
        lines += "\nsize:" + this.#scale.w + "," + this.#scale.h;
        lines += "\n;map tile data";
        for (let r = 0; r < this.rows;r++){
            let s = "";
            for (let c = 0; c < this.cols; c++){
                if (c != 0) s += ",";
                s += this.#map[r][c].toString().padStart(3,"0");
            }
            lines += "\n" + s;
        }
        return lines;
    }
    // /** draws tilemaps tiles in a block format, for debugging purposes. 
    //  * 
    //  * If you want something the user can interact with use showClickabletiles instead 
    //  * 
    //  * */
    // showtiles(x, y, cols, rows, size, index, here){
    //     if (this.#tiles.length > 0){
    //         here = (here === undefined) ? window : here;
    //         //yes
    //         let t = 0;
    //         let r = 0;
    //         let c = 0; 
    //         let active = true;
    //         push();
    //         textAlign(CENTER, CENTER);
    //         fill(255);
    //         stroke(0);
    //         strokeWeight(2);
    //         while (t < this.#tiles.length && active){
    //             let fr = this.#tiles[t];
    //             here.image(fr.tex,
    //                 x + c * (size.w+size.padx), y + r * (size.h+size.pady), size.w, size.h,
    //                 fr.port.x, fr.port.y, fr.port.w, fr.port.h
    //             );
    //             if (index){
    //                 let tout = t + ((this.tileindex != null && t < this.tileindex.length) ? " [" + this.tileindex[t] + "] ":"");
    //                 here.text(tout,x + c * (size.w +size.padx) + size.w/2, y + r * (size.h+size.pady) + size.h/2);
    //             }
    //             t++;
    //             c++;
    //             if (c == cols){
    //                 c = 0; r++;
    //                 if (r == rows) { active = false;}
    //             }
    //         }
    //         pop();
    //     }
    // }

    /** 
     * creates a set of sprites to show tiles from the tilemap
     * 
     * You can call this several times with different startindex and endindex values to produce a layout to your choosing
     * 
     * @param {float} x left position of display
     * @param {float} y top position of display
     * @param {int} cols number of columns to layout tiles
     * @param {int} rows number of rows to layout tiles
     * @param {{w:int,h:int,padx:int,pady:int}} size how wide and tall to make each tile and what padding x and y between each tile when shown
     * @param {texture} layer layer to render the tiles on
     * @param {int} startindex which tile to start drawing from
     * @param {int} endindex which tile to start drawing from
     * @param {{fillcol:color,strokecol:color,textsize:int,strokeweight:int,xoff:int,yoff:int}} indexinfo if omitted then the tile index will not ne displayed, 
     * use this to specify how the tileindex should be overlayed on the tile sprite, see example for details of these values
     * @example
     * // set a variable to old the indexinfo object to format the tile index number
     * // fill colour of text to white
     * // stroke colour to red
     * // strokeweigth to 1 pixel
     * // textsize 22pt
     * // don't offset horizontally from centre of tile
     * // offset down 24 pixels from vertical centre of tile
     * let indexinfo = {fillcol:[255,255,255],strokecol:[255,0,0],strokeweight:1,textsize:22,xoff:0,yoff:24};
     * 
     * // ask the tilemap to show clickable tiles 5 to 34
     * // starting at position 700,50
     * // in 8 columns over 10 rows
     * // make them 48 pixcels wide and 48 pixels high 
     * // pad them with a gap of 8 pixels horizontally and vertically
     * // place on sprite layer 1
     * // start from tileindex 5 and end at tileindex 34
     * this.showtiles(700,50,8,10,{w:48,h:48,padx:8,pady:8}, Engine.layer(1), 10, 13, indexinfo);
     * // add another block of tiles from tile index 26 to 45
     * this.showtiles(700,150,8,10,{w:48,h:48,padx:8,pady:8}, Engine.layer(1), 26, 45, indexinfo);
     * 
     */
    showtiles(x, y, cols, rows, size, layer, startindex, endindex, indexinfo){
        if (this.#tiles.length > 0){
            layer = (layer === undefined) ? window : layer;
            //yes
            let t = startindex;
            let r = 0;
            let c = 0; 
            let active = true;
            let scale = size.w / this.#tilesize.w;
            while (t < this.#tiles.length && active && t <= endindex){
                let fr = this.#tiles[t];
                new spriteTile(x + c * (size.w+size.padx), y + r * (size.h+size.pady), fr, t, layer, scale, indexinfo, false);
                t++;
                c++;
                if (c == cols){
                    c = 0; r++;
                    if (r == rows) { active = false;}
                }
            }
        }
    }


    /** creates a set of sprites that can be clicked by user
     * 
     * if a click over one of the sprites is detected then a message of type msgT.spriteinfo is sent along with a reference to the sprite
     * 
     * the sprite has as an extra property called tile which holds the tile index this sprite represents
     * 
     * You can call this several times with different startindex and endindex values to produce a layout to your choosing
     * 
     * @param {float} x left position of display
     * @param {float} y top position of display
     * @param {int} cols number of columns to layout tiles
     * @param {int} rows number of rows to layout tiles
     * @param {{w:int,h:int,padx:int,pady:int}} size how wide and tall to make each tile and what padding x and y between each tile when shown
     * @param {texture} layer layer to render the tiles on
     * @param {int} startindex which tile to start drawing from
     * @param {int} endindex which tile to start drawing from
     * @param {{fillcol:color,strokecol:color,textsize:int,strokeweight:int,xoff:int,yoff:int}} indexinfo if omitted then the tile index will not ne displayed, 
     * use this to specify how the tileindex should be overlayed on the tile sprite, see example for details of these values
     * @example
     * // set a variable to old the indexinfo object to format the tile index number
     * // fill colour of text to white
     * // stroke colour to red
     * // strokeweigth to 1 pixel
     * // textsize 22pt
     * // don't offset horizontally from centre of tile
     * // offset down 24 pixels from vertical centre of tile
     * let indexinfo = {fillcol:[255,255,255],strokecol:[255,0,0],strokeweight:1,textsize:22,xoff:0,yoff:24};
     * 
     * // ask the tilemap to show clickable tiles 5 to 34
     * // starting at position 700,50
     * // in 8 columns over 10 rows
     * // make them 48 pixcels wide and 48 pixels high 
     * // pad them with a gap of 8 pixels horizontally and vertically
     * // place on sprite layer 1
     * // start from tileindex 5 and end at tileindex 34
     * this.showClickabletiles(700,50,8,10,{w:48,h:48,padx:8,pady:8}, Engine.layer(1), 10, 13, indexinfo);
     * // add another block of tiles from tile index 26 to 45
     * this.showClickabletiles(700,150,8,10,{w:48,h:48,padx:8,pady:8}, Engine.layer(1), 26, 45, indexinfo);
     * 
     * //register a subscriber for the spriteinfo message to respond to user clicks
     * MsgBus.sub(mymess.spriteinfo, this.tileclicked, this);
     * 
     * //an example of a spriteinfo message handler as a method of the tilemap
     * tileclicked(data){
     *      //save the currently actively clicked tile number for later, echo to console while testing
     *      this.activetile = data.sp.tile;
     *      console.log(this.activetile);
     * }
     * 
     * 
     */
    showClickabletiles(x, y, cols, rows, size, layer, startindex, endindex, indexinfo){
        if (this.#tiles.length > 0){
            layer = (layer === undefined) ? window : layer;
            //yes
            let t = startindex;
            let r = 0;
            let c = 0; 
            let active = true;
            let scale = size.w / this.#tilesize.w;
            while (t < this.#tiles.length && active && t <= endindex){
                let fr = this.#tiles[t];
                new spriteTile(x + c * (size.w+size.padx), y + r * (size.h+size.pady), fr, t, layer, scale, indexinfo, true);
                t++;
                c++;
                if (c == cols){
                    c = 0; r++;
                    if (r == rows) { active = false;}
                }
            }
        }
    }
    //positional methods
    /** 
     * takes a sprite and tile position setting the sprite at the centre of the tile location
     * @example this.mymap.setActorcentre(this, {x:10,y:11});
     * @param {Sprite} actor 
     * @param {{x:int,y:int}} loc 
     * @returns {vector3} passes the position of the centre of the tile back if you want it
    */
    setActorcentre(actor, loc){
        return actor.centre = this.pixelcentre(loc);
    }
    /** takes a sprite and tile position setting the sprite horizontally at the centre of the tile location
     * @example this.mymap.setActorcentre(this, {x:10,y:11});
     * @param {Sprite} actor sprite to centre
     * @param {{x:int,y:int}} loc tile location to centre within
     * @returns {float} x position set
    */
    setActorcentreX(actor, loc){
        return actor.centrex = this.pixelcentre(loc).x;
    }
    /** takes a sprite and tile position setting the sprite vertically at the centre of the tile location
     * @example this.mymap.setActorcentre(this, {x:10,y:11});
     * @param {Sprite} actor sprite to centre
     * @param {{x:int,y:int}} loc tile location to centre within
     * @returns {float} y position set
    */
    setActorcentreY(actor, loc){
        return actor.centrey = this.pixelcentre(loc).y;
    }
    /** 
     * This is WIP, not quite there yet
     * takes a pixel position and a tile location returns the distance from the top of the tile surface
     * used by surface sensor techniques (for slopes and irregular tiles)
     * @param {{x:int,y:int}} loc is a tile location to interrogate
     * @param {int} x x position to check for distance to tile location
     * @param {int} y y position to check for distance to tile location
     * @returns {int} distance from top of tile
    */
    distanceFromtop(loc, x, y){
        let t = this.tilefromMap(loc);
        //this might need translating to tilesize stuff first
        let xoff = (x - (this.#position.x + this.#visibletilesize.w * loc.x)) | 0;//left edge offset
        let yoff = (y - (this.#position.y + this.#visibletilesize.h * loc.y)) | 0;//top edge offset
        //attempt refactoring for inverse scale
        xoff /= this.#scale.w;
        yoff /= this.#scale.h;
        //let xoff = (x - (this.position.x + this.#tilesize.w * loc.x)) | 0;//left edge offset
        //let yoff = (y - (this.position.y + this.#tilesize.h * loc.y)) | 0;//top edge offset
        let dd = t.distancetop(xoff);
        return dd - yoff;
    }
    /** returns the graphic tile from the main map at the given location 
     * @param {{x:int,y:int}} loc is a tile location to interrogate
     * @returns {Tile} Tile object found or if not valid location -1 is returned
    */
    tilefromMap(loc){
        if (this.wrapTileInterrogation){
            if (loc.x < 0) loc.x += this.cols;
            else if (loc.x >= this.cols) loc.x -= this.cols;
            if (loc.y < 0) loc.y += this.rows;
            else if (loc.y >= this.rows) loc.y -= this.rows
        }        
        if (this.validLocation(loc)){
            return this.#tiles[this.#map[loc.y][loc.x]];
        } else {return -1;}
    }
    /** returns the tile from the graphic map a tile distance away from given location
     * @param {{x:int,y:int}} loc is a tile location to interrogate
     * @param {TileDirection} direction direction to look from tile given in loc
     * @param {int} distance number of tiles to move in given direction from loc
     * @returns {Tile} Tile object found or if not valid location -1 is returned
    */
    tilefromMapOffset(loc, direction, distance){
        return this.tilefromMap(this.locationOffset(loc, direction, distance));
    }
    /** 
     * returns a tile number from the graphic tilemap 
     * @param {{x:int,y:int}} loc is a tile location to interrogate
     * @returns {int} Tile index found or if not valid location -1 is returned
    */
    tileNumfromMap(loc){
        if (this.wrapTileInterrogation){
            if (loc.x < 0) loc.x += this.cols;
            else if (loc.x >= this.cols) loc.x -= this.cols;
            if (loc.y < 0) loc.y += this.rows;
            else if (loc.y >= this.rows) loc.y -= this.rows
        }        
        if (this.validLocation(loc)){
            return this.#map[loc.y][loc.x];
        } else {return -1;}
    }
    /** 
     * gets the tile number from the graphic map a tile distance away from given location 
     * @param {{x:int,y:int}} loc is a tile location to interrogate
     * @param {TileDirection} direction direction to look from tile given in loc
     * @param {int} distance number of tiles to move in given direction from loc
     * @returns {int} Tile index found or if not valid location -1 is returned
     * */
    tileNumfromMapoffset(loc, direction, distance){
        return this.tileNumfromMap(this.locationOffset(loc, direction, distance));
    }
    /** 
     * returns a collision tile number from the collisionmap 
     * @param {{x:int,y:int}} loc is a tile location to interrogate
     * @returns {int} collision tile index found or if not valid location -1 is returned
    */
    tileNumfromCollisionMap(loc){
        if (this.wrapTileInterrogation){
            if (loc.x < 0) loc.x += this.cols;
            else if (loc.x >= this.cols) loc.x -= this.cols;
            if (loc.y < 0) loc.y += this.rows;
            else if (loc.y >= this.rows) loc.y -= this.rows
        }
        if (this.validLocation(loc)){
            return this.collisionmap[loc.y][loc.x];
        } else {return -1;}
    }
    /** 
     * returns a collision tile number from the collisionmap a tile distance away from given location 
     * @param {{x:int,y:int}} loc is a tile location to interrogate
     * @param {TileDirection} direction direction to look from tile given in loc
     * @param {int} distance number of tiles to move in given direction from loc
     * @returns {int} collision tile index found or if not valid location -1 is returned
    */
    tileNumfromCollisionMapoffset(loc, direction, distance){
        return this.tileNumfromCollisionMap(this.locationOffset(loc, direction, distance));
    }
    /**
     *  returns true if sprite is withing the tolerance distance of the center of given tile 
     * @param {Sprite} actor the sprite to investigate
     * @param {{x:int,y:int}} loc is a tile location to interrogate
     * @param {float} tolerance distance good enough to say it's at the centre. 
     * the value you pick for this will depend on how fast the sprite is moving/how far it can move in a particular frame
     * @returns {float} SQUARED distance of sprite from centre of tile
     * */
    actorAtcentre(actor, loc, tolerance){
        if (tolerance === undefined) {tolerance = 0;} else {tolerance = tolerance * tolerance;}
        return vector2.distanceSQ(actor.position, this.pixelcentre(loc)) < tolerance;
    }
    /** 
     * takes an array of tile locations and outputs an array of vector3 world locations based on tile centres
     * @param {{x:int,y:int}} points array must be in x y object form and consist of integer values (as they are tile locations), 
     * these all need to be valid locations, process them first to make sure they are before calling them
     * 
     * @returns {vector3[]} the vector3 version of the tile centres, null if no points exist
     * @example
     * let tilepositions = [{x:4,y:4},{x:5,y:4},{x:6,y:4}];
     * let vlist = this.routeTovector3(tilepositions);
    */
    routeTovector3(points){
        if (points.length > 0){
            route = new Array(points.length);
            for (let p = 0; p < points.length; p++){
                route.push(this.pixelcentre(points[p]));
            }
            return route;
        }
        return null;
    }
    /**
     * gets the y position of the top of requested tile
     * @param {{x:int,y:int}} loc is a tile location to interrogate
     * @returns {float} top of tile requested
     */
    pixeltop(loc){
        return loc.y * this.#visibletilesize.h + this.#position.y
    }
    /**
     * gets the y position of the bottom of requested tile
     * @param {{x:int,y:int}} loc is a tile location to interrogate
     * @returns {float} bottom of tile requested
     */
    pixelbottom(loc){
        return loc.y * this.#visibletilesize.h + this.#visibletilesize.h + this.#position.y
    }
    /**
     * gets the x position of the left of requested tile
     * @param {{x:int,y:int}} loc is a tile location to interrogate
     * @returns {float} left of tile requested
     */
    pixelleft(loc){
        return loc.x * this.#visibletilesize.w + this.#position.x
    }
    /**
     * gets the x position of the right of requested tile
     * @param {{x:int,y:int}} loc is a tile location to interrogate
     * @returns {float} right of tile requested
     */
    pixelright(loc){
        return loc.x * this.#visibletilesize.w + this.#visibletilesize.w + this.#position.x
    }
    /** 
     * takes a tile location and returns the centre location as a vector3(1,4,0)
     * @param {{x:int,y:int}} loc is a tile location to interrogate
     * @returns {vector3} centre of requested tile
    */
    pixelcentre(loc){
        return new vector3(loc.x * this.#visibletilesize.w +  this.#visibletilesize.w/2 + this.#position.x,
                loc.y * this.#visibletilesize.h +  this.#visibletilesize.h/2 + this.#position.y, 0);
        // return {x:location.x * this.#visibletilesize.w +  this.#visibletilesize.w/2 + this.#position.x,
        //     y:location.y * this.#visibletilesize.h +  this.#visibletilesize.h/2 + this.#position.y, z:0};
    }
    /** 
     * takes a tile location and returns horizontal position of the tiles centre
     * @param {{x:int,y:int}} loc is a tile location to interrogate
     * @returns {vector3} horizontal (x) centre of requested tile
    */
    pixelcentrex(loc){
        return loc.x * this.#visibletilesize.w +  this.#visibletilesize.w/2 + this.#position.x;
    }
    /** 
     * takes a tile location and returns vertical position of the tiles centre
     * @param {{x:int,y:int}} loc is a tile location to interrogate
     * @returns {vector3} vertical (y) centre of requested tile
    */
    pixelcentrey(loc){
        return loc.y * this.#visibletilesize.h +  this.#visibletilesize.h/2 + this.#position.y;
    }
    /** 
     * takes a bitwise tile direction and converts to a vector3 direction vector
     * create directions using bitwise or |
     * @param {TileDirection} tiledirection a direction or a bitwise OR'd set of directions
     * @returns {vector3} direction vector determined from tile directions
     * @example 
     * //up and left
     * let upleft = TileDirection.UP | TileDirection.LEFT;
     * let direction = this.tileDirectiontoVector(TileDirection.UP);
     * let di = this.tileDirectiontoVector(upleft);
     */
    static tileDirectiontoVector(tiledirection){
        let v = vector3.zero;
        if (tiledirection & TileDirection.UP){v.y = -1;}
        if (tiledirection & TileDirection.DOWN){v.y = 1;}
        if (tiledirection & TileDirection.LEFT){v.x = -1;}
        if (tiledirection & TileDirection.RIGHT){v.x = 1;}
        return v;
    }
    /** 
     * takes a sprite and examines it's delta (movement vector between updates)
     *  and determines (if possible) an ordinal tile direction 
     * @param {Sprite} sprite the sprite whose tile direction we want
     * @returns {TileDirection} tile direction sprite is generally moving in
     * */
    static spriteTileDirection(sprite){
        return this.vectorToTiledirection(sprite.deltaposition);
    }
    /**
     * takes a direction vector and determines the general ordinal direction it is pointing
     * @param {vector3|vector2} vec direction vector to convert to a tile direction
     * @returns {TileDirection} tile direction sprite is generally moving in
     */
    static vectorToTiledirection(vec){
        let v = vector3.ordinalise(vec);
        if (v.x > 0) {return TileDirection.RIGHT;}
        if (v.x < 0) {return TileDirection.LEFT;}
        if (v.y > 0) { return TileDirection.DOWN;}
        if (v.y < 0) {return TileDirection.UP;}
        return TileDirection.NONE;
    }
    /**
     * determines if two locations are the same
     * @param {{x:int,y:int}} locA 
     * @param {{x:int,y:int}} locB 
     * @returns {bool} true if same locations and false otherwise
     */
    static samelocation(locA, locB){
        return locA.x == locB.x && locA.y === locB.y;
    }
    /** returns the tile location of a given sprite 
     * @param {Sprite} actor the sprite to find the tile it's centre is over
     * @returns {{x:int,y:int}} tile location
    */
    locationactor(actor){
        return this.location(actor.centrex, actor.centrey);
    }
    /** 
     * returns a tile location a tile distance from the given location
     * in the direction specified
     * @param {{x:int,y:int}} loc tile location to offset from
     * @param {TileDirection} direction a direction or a bitwise OR'd set of directions (for diagonals)
     * @param {int|int[]} distance number of tiles to offset by, if you want to offset differently in horizontal and vertical directions suppy an array with 2 integers
     * first index is x distance, 2nd index is y distance
     * @returns {{x:int,y:int}} location offsetted from given location
     * @example 
     * let p = {x:4,y:5};
     * let v = map.locationto(p, TileDirection.LEFT, 4);
     * //v would be {x:0,y:5}
     * let v = map.locationto(p, TileDirection.LEFT | TileDirection.UP, 2);
     * //v would be {x:2,y:3}    
    */
    locationOffset(loc, direction, distance){
        let xdistance;
        let ydistance;
        if (Array.isArray(distance)){
            xdistance = distance[0]; ydistance = distance[1];
        } else {
            xdistance = distance; ydistance = distance;
        }
        let v = {x:loc.x,y:loc.y};
        if (direction & TileDirection.UP){v.y -= ydistance;}
        if (direction & TileDirection.DOWN){v.y += ydistance;}
        if (direction & TileDirection.LEFT){v.x -= xdistance;}
        if (direction & TileDirection.RIGHT){v.x += xdistance;}  
        return v;
    }
    /** 
     * works out a displacement from a sprites centre tile in the direction it is moving
     * if you make the distance -ve this will give you a direction backwards
     * @param {Sprite} actor the sprite to find the tile it's centre is over
     * @param {int|int[]} distance number of tiles to offset by, if you want to offset differently in horizontal and vertical directions suppy an array with 2 integers
     * first index is x distance, 2nd index is y distance
     * @returns {{x:int,y:int}} location offsetted from given location
     */
    locationForward(sprite, distance){
        return this.locationOffset(this.locationactor(sprite),Tilemap.spriteTileDirection(sprite),distance);
    }
    
    /**
     *  given a list of directions available from a given tile, determines which one if moved to from a current location
     * will be nearer to the target tile. returning that direction
     * @param {TileDirection[]} directions an array of legal directions to take from the currentLoc tile that we want to test the distance from
     * @param {{x:int,y:int}} currentLoc location we are currently at, that we want to know which direction would make us nearest the target location
     * @param {{x:int,y:int}} targetLoc the tile location we want to move to eventually
     * @returns {TileDirection} direction to move from currentLoc which is nearest to the targetLoc
     */
    shortestDistanceCrow(directions, currentLoc, targetLoc){
        //just return one direction if that was all available
        if (directions.length == 1)
            return directions[0];

        let workingTile = {x:0,y:0};
        let workingDistance = 0;
        let shortestDistance = 999999999;
        let chosenDirection = TileDirection.NONE;

        for (let p = 0; p < directions.length; p++){
            const ordinal = directions[p]
            workingTile = this.locationOffset(currentLoc, ordinal, 1);
            workingDistance = vector2.distanceSQ(targetLoc, workingTile);
            //distance = Vector2.DistanceSquared(targetPos, new Vector2(newTile.X, newTile.Y));
            if (workingDistance < shortestDistance){
                shortestDistance = workingDistance;
                chosenDirection = ordinal;
            }//end switch
        }//end foreach
        return chosenDirection;
    }
    /**
     * Checks the collision map at given location to see if it contains a legal tiles (those we can occupy)
     * returning true if it does and false if not
     * @param {{x:int,y:int}} loc to check if it's collision content is in the legal list provided
     * @param {[int]} legalist - an array of legal collision tile values to enable the move to be made in a direction
     * @returns {bool} true if ot contains a legal collision tile, false if not
     */
    validLocationLegal(loc, legalist){
        return legalist.includes(this.tileNumfromCollisionMap(loc));
    }
    /**
     * Checks the collision map for availble positions from given tile, given a set of legal tiles (those we can occupy)
     * returning a list of valid moves
     * @param {{x:int,y:int}} loc current tile location to attempt to move from
     * @param {[int]} legalist - an array of legal collision tile values to enable the move to be made in a direction
     * @param {int} distance from current tile location (loc) if ommited 1 tile space is used
     * @returns {TileDirection[]} an array of valid TileDirections
     */ // could simplify using validLocationLegal
    validDirectionsLegal(loc, legalist, distance){
        let dir = [];
        let ct;
        if (distance === undefined){distance = 1;}
        
        ct = this.tileNumfromCollisionMapoffset(loc, TileDirection.LEFT, distance);
        if (legalist.includes(ct)){dir.push(TileDirection.LEFT);}
        
        ct = this.tileNumfromCollisionMapoffset(loc, TileDirection.RIGHT, distance);
        if (legalist.includes(ct)){dir.push(TileDirection.RIGHT);}
        
        ct = this.tileNumfromCollisionMapoffset(loc, TileDirection.UP, distance);
        if (legalist.includes(ct)){dir.push(TileDirection.UP);}
        
        ct = this.tileNumfromCollisionMapoffset(loc, TileDirection.DOWN, distance);
        if (legalist.includes(ct)){dir.push(TileDirection.DOWN);}
        
        return dir;
    }
    /**Checks the tile map for availble positions from given tile, given a set of illegal tiles (those we can't occupy)
     * returning a list of valid moves
     */
    validDirectionsIllegal(loc, illegalist){
        //NEEDS WRITING
    }
    /** 
     * given a list of directions, remove the one specified (if it exists)
     * @param {TileDirection[]} possibleDirections an array of potential directions
     * @param {TileDirection} direction a direction to remove from the possibleDirections
     */
    static removeDirection(possibleDirections, direction){
        for (let p = 0; p < possibleDirections.length; p++){
            if (possibleDirections[p] == direction){
                possibleDirections.splice(p,1);
            }
        }
    }
    /** 
     * given a list of directions, remove a direction if it is in the opposite direction to the one specified
     * @param {TileDirection[]} possibleDirections an array of potential directions
     * @param {TileDirection} direction a direction that we want to remove the opposite directino from (if it exist)
     * Pac-Man uses this system to stop ghost going backwards when given a choice (keeps them moving forwards)
     */
    static removeOppositeDirection(possibleDirections, direction){
        Tilemap.removeDirection(possibleDirections, Tilemap.oppositeDirection(direction));
    }
    /** 
     * given a direction (left, right up or down returns the oppositie direction, 
     * @param {TileDirection} tiledirection a direction or a bitwise OR'd set of directions to obtain the opposite of 
     * stick to ordinals NSEW or minor ordinals NE SE SW NW
     * @returns {TileDirection} the opposite direction to that supplied
     * @example 
     * //will compute minor ordinals if bitwise or'd together
     * let direction = TileDirection.LEFT | TileDirection.UP; */
    static oppositeDirection(direction){
        let newdirection = 0;
        if ((direction & TileDirection.LEFT) == TileDirection.LEFT) {newdirection |= TileDirection.RIGHT;}
        else if ((direction & TileDirection.RIGHT) == TileDirection.RIGHT) {newdirection |= TileDirection.LEFT;}
        if ((direction & TileDirection.UP) == TileDirection.UP) {newdirection |= TileDirection.DOWN;} 
        else if ((direction & TileDirection.DOWN) == TileDirection.DOWN) {newdirection |= TileDirection.UP;}
        return newdirection;
    }

    /** 
     * takes a pixel location and returns a tile location (if possible) in the tilemap
     * @param {float} x x position to find tile location of
     * @param {float} y y position to find tile location of
     * @returns {{x:int,y:int}} a tile location
     *  */
    location(x, y){
        x -= this.#position.x;
        y -= this.#position.y;
        if (this.clamplocation){
            if (x < 0) {x = 0;} else if (x >= this.#area.w){ x = this.#area.w - 1;}
            if (y < 0) {y = 0;} else if (y >= this.#area.h){ y = this.#area.h - 1;}
        }
        return {x: (x/this.#visibletilesize.w)|0, y:(y/this.#visibletilesize.h)|0}
        //return {x: (x/this.#tilesize.w)|0, y:(y/this.#tilesize.w)|0}
    }

    /** 
     * determines if a tile location exists within the tilemap 
     * @param {{x:int,y:int}} loc current tile location to check is within the tilemap
     * @returns {bool} true if valid, false if not
     * */
    validLocation(loc){
        return loc.x >=0 && loc.x < this.cols && loc.y >= 0 && loc.y < this.rows;
      }

    /** 
     * gets the left hand side of given tile location
     * supply a valid tile location
     * @param {{x:int,y:int}} loc tile location to get left edge of
     * @returns {float} edge requested
     */
    pixelLeft(loc){
        let x = (loc.x === undefined) ? loc : loc.x;
        return this.#position.x + this.#visibletilesize.w * x;
        //return this.position.x + this.#tilesize.w * x;
    }
    /** 
     * gets the pixel location of the top of tile location
     * supply a valid tile location
     * @param {{x:int,y:int}} loc tile location to get top edge of
     * @returns {float} edge requested
    */
    pixelTop(loc){
        let y = (loc.y === undefined) ? loc : loc.y;
        return this.#position.y + this.#visibletilesize.h * y;
        //return this.position.y + this.#tilesize.h * y;
    }
    /** 
     * gets the right hand side of given tile location
     * supply a valid tile location
     * @param {{x:int,y:int}} loc tile location to get right edge of
     * @returns {float} edge requested
     */
    pixelRight(loc){
        let x = (loc.x === undefined) ? loc : loc.x;
        return this.#position.x + this.#visibletilesize.w * x + this.#visibletilesize.w;
        //return this.position.x + this.#tilesize.w * x + this.#tilesize.w;
    }
    /** 
     * gets the bottom hand side of given tile location
     * supply a valid tile location
     * @param {{x:int,y:int}} loc tile location to get bottom edge of
     * @returns {float} edge requested
     */
    pixelBottom(loc){
        let y = (loc.y === undefined) ? loc : loc.y;
        return this.#position.y + this.#visibletilesize.h * y + this.#visibletilesize.h;
        //return this.position.y + this.#tilesize.h * y + this.#tilesize.h;
    }
    //NEED TO BUILD THESE
    /** determines if there is direction line of site from the start location and the goal location*/
    #lineofSite(startloc, goalloc,){

    }
    /** produces a list of tiles between the start location and goal location */
    #listBetween(startloc, goalloc){
    }
    /**
     * builds a collision map from a tilemap 
     * An array of collision tiles which map the display tiles to specific collision ones, 
     * make sure this has enough entries to cover all the display tiles
     * 
     * the collisionmap is available using this.collisionmap it's row a ordered 2d array like the graphic map
     * 
     * if loading a tilemap, generate collision map once it has loaded using the load callback
     * @param {[int]} collisionBlocks - an array of graphic to collision mappings (must be same length as tiles array)
     * @param {int} empty - collision tile to place for undefined tilemap areas (-1 - nothing drawn)
     * 
     * @example 
     * //example 1 simple collision map
     * //collision tiles
     * static gNOTILE = -1;
     * static cEMPTY = 0; static gEMPTY = 0;
     * static cWALL = 1; static gWALL = 1;
     * static gP1_START = 2;
     * static gP2_START = 3;
     * static gTEST_START = 4;
     * static legalmove = [Maze.cEMPTY];
     * generateCollisions(){
     *   //collision blocks must be same length as tile list
     *   let collisionblocks = new Array(this.tiles.length);
     *   for (let p = 0; p < collisionblocks.length; p++){
     *     collisionblocks[p] = Maze.cWALL;
     *   }
     *   //set specific collsion mappers for graphic tiles
     *   collisionblocks[Maze.gEMPTY] = Maze.cEMPTY;
     *   this.createCollisionMap(collisionblocks,  Maze.cEMPTY);//Maze.cWALL);
     * }
     * 
     * //example 2 more complex map 
     * //collision tiles
     * static cEMPTY = 0;
     * static cWALL = 1;
     * static cPELLET = 2;
     * static legalmove = [pacmaze.cEMPTY, pacmaze.cPELLET];
     * generateCollisions(){
     *   //collision blocks must be same length as tile list
     *   let collisionblocks = new Array(this.tiles.length);
     *   for (let p = 0; p < collisionblocks.length; p++){
     *     collisionblocks[p] = pacmaze.cWALL;
     *   }
     *   //set specific collsion mappers for graphic tiles
     *   collisionblocks[48] = pacmaze.cPELLET;
     *   collisionblocks[49] = pacmaze.cPELLET;
     *   collisionblocks[44] = pacmaze.cEMPTY;
     *   collisionblocks[45] = pacmaze.cEMPTY;
     *   collisionblocks[46] = pacmaze.cEMPTY;
     *   collisionblocks[47] = pacmaze.cEMPTY;
     *   collisionblocks[52] = pacmaze.cEMPTY;
     *   collisionblocks[53] = pacmaze.cEMPTY;
     *   collisionblocks[56] = pacmaze.cEMPTY;
     *   this.createCollisionMap(collisionblocks, pacmaze.cWALL);
     * }
     * 
     */
    createCollisionMap(collisionBlocks, empty){
        let row = 0;
        let col = 0;
        try{
            this.collisionmap = new Array(this.rows);
            for (let p = 0; p < this.rows; p++){this.collisionmap[p] = new Array(this.cols)}

            for (let r = 0; r < this.rows; r++){
                for (let c = 0; c < this.cols; c++) {
                    //skip no tile and leave as user defaulted for empty
                    let q = this.#map[r][c];
                    this.collisionmap[r][c] = (this.#map[r][c] == -1) ? empty : collisionBlocks[this.#map[r][c]];
                }
            }
        } catch(e){
            let p = {r:row, c:col};
            throw new ArgumentException(
                    "collision block does not contain an element for\n" +
                    "display tile number " + this.#map[row][col]  + "\n" +
                    "at position [" + row + "," + col + "]");
        }
    }
    /** 
     * works through all tile locations in the tilemap and passes tile information to the callback
     * 
     * this will allow you to remove/replace special marker tiles with other tiles and sprite if required
     * 
     * using a switch to examine the tile recepients is a good technique
     * 
     * your handler should return the tile to replace the specific tile with for instance if the tile is a sprite marker then you may
     * want to replace the tile with a floor or empty tile (return the tile given if no change is wanted)
     * 
     * @param {{callback:method|function,instance:object}} callback - a callback use Engine.makeCallback to prepare your callback object. 

     * The callback should accept a data parameter which is an object of the form {tile:int,loc:{x:int,y:int}} where:
     * 
     * tile is the tile number to examine
     * 
     * loc is the x and y tile location where the tile was found
     * 
     * @example
     * loaded(){
     *   this.centreinmyview();
     *   this.processmap(Engine.makeCallback(this.examinetile, this));
     *   //generate collisions after processing map
     *   this.generateCollisions();
         *   *   //indicate to any other subsystems waiting on maze being loaded and processed
     *   MsgBus.send(mymess.mazeready);
     * }
     * examinetile(data){
     *     switch (data.tile){
     *       case Maze.gP1_START: new Player1(data.loc); return Maze.gEMPTY;
     *       case Maze.gP2_START: new Player2(data.loc); return Maze.gEMPTY;
     *       case Maze.gTEST_START: new Test(data.loc); return Maze.gEMPTY;
     *       default: return data.tile;
     *     }
     * }
     */
    processmap(callback){
        for (let r = 0; r < this.rows; r++){
            for (let c = 0; c < this.cols; c++) {
                let data = {loc:{x:c,y:r},tile:this.#map[r][c]};
                let newtile = Engine.processCallback(callback, data);
                if (newtile != data.tile){
                    this.setMapGraphic(data.loc, newtile);
                }
            }
        }
    }
    /**
     * will check to make sure all indexes specified in the tilemap have a corresponding tile in the tileset.
     * This is expensive so do it during debugging phase of your project to help you out.
     
    * if we have a mismatch between indexes used and tiles then an error will be thrown
     */
    #verifymaptiles(){
        for (let r = 0; r < this.rows; r++){
            for (let c = 0; c < this.cols; c++) {
                let data = {loc:{x:c,y:r},tile:this.#map[r][c]};
                if (data.tile >= this.#tiles.length){
                    throw new Error("UNKNOWN TILE:" + data.tile + " at loc{x, y}:{" + data.loc.x + "," + data.loc.y + "}");
                }
            }
        }
    }
    ///**
    // * highlights the list of directions from the given location
    // * @param {{x:float,y:float}} loc 
    // * @param {[TileDirection]} directions 
    // * @param {{time:float,tx:texture,colour:colour, alpha:float}} renderinfo 
    // */
    //highlightdirections(loc, directions, renderinfo){
    //    for (let p = 0; p < directions.length; p++){
    //        //let q = this.locationOffset(loc, directions[p],1);
    //        renderinfo.p = p;
    //        new highlightTile(this.locationOffset(loc, directions[p],1), this, renderinfo);
    //    }
    //}
    ///**
    // * highlight a tile location in the map
    // * @param {{x:float,y:float}} loc 
    // * @param {{time:float,tx:texture,port:Rectangle,colour:colour, alpha:float}} renderinfo 
    // */
    //highlight(loc, renderinfo){
    //    new highlightTile(loc, this, renderinfo);
    //}
    /**
     * highlights the list of directions from the given location
     * @param {{x:int,y:int}} loc tile location to place highlight
     * @param {[TileDirection]} directions direction from loc to highlight
     * @param {{time:float,alpha:float,layer:texture}} renderinfo visual settings to apply, assumed that sprite frames already set (we essntially scale and alpha only
     * @param {Sprite[]} sprlist an array of sprites at least as long as the directions
     */
    highlightdirections(loc, directions, renderinfo, sprlist){
        for (let p = 0; p < directions.length; p++){
            this.highlight(this.locationOffset(loc, directions[p],1),renderinfo, 
                                    sprlist[TileDirection.directionmap[directions[p]]]);
        }
    }    
    /**
     * re-uses the given sprite to highlight a specific tile location 
     * @param {{x:int,y:int}} loc tile location to place highlight
     * @param {{time:float,alpha:float,layer:texture}} renderinfo visual settings to apply, assumed that sprite frames already set (we essntially scale and alpha only)
     * @param {Sprite} spr Sprite to use, must have a frame defined, if you do not want to create a specific sprite use new Tilehigh(color) to create a basic coloured sprite (see examples)
     */
    highlight(loc, renderinfo, spr){
        if (spr.timer == null){
            spr.timer = new Timer(spr);
            spr.timer.overwriteEnable();
        }
        spr.timer.hideafter(renderinfo.time);
        spr.scaleTo = {w:this.visibletilesize.w,h:this.visibletilesize.h};
        spr.layer = renderinfo.layer;
        if (renderinfo.layer.type == "t") {
            spr.x = this.pixelLeft(loc);
            spr.y = this.pixelTop(loc);
        } else {
            this.setActorcentre(spr, loc);
        }
        spr.alpha = renderinfo.alpha;
    }

    /**
     * gets 4 basic sprites in an array to be used with Tilemap.highlightdirections if you don't want to create your own custom list of sprites
     * @param {color[]} colors an array of 4 colours to apply to the sprites
     * @returns {Sprite[]} a set of basic sprites to use when highlighting directions
     */
    highlightTileset(colours){
        let set = [];
        for (let p = 0; p < 4; p++){
            set.push(new Tilehigh(colours[p]));
        }
        return set;
    }
}
/**
 * @classdesc a simple sprite for highlighting tiles in a tilemap
 * 
 * use this if you just want a simple block to highlight a tile rather than some custom graphic effect
 */
class Tilehigh extends Sprite{

    /**
     * 
     * @param {color} col colour to paint the tilemap square
     */
    constructor(col){
      super();
      Engine.spM.add(this);
      this.frame.define(Tex.getColouredPixel(col));
      this.hide();
    }
}

class highlightTile extends Sprite{
    mytx;
    /**
     * 
     * @param {{x:int,y:int}} loc 
     * @param {Tilemap} tmap 
     * @param {{time:float,tx:texture,port:Rectangle,colour:colour, alpha:float}} ri 
     */
    constructor(loc, tmap, ri){
        super();
        Engine.spM.add(this);

        if (ri.colour !== undefined){
            this.mytx = Tex.getColouredPixel(Array.isArray(ri.colour[0]) ? ri.colour[ri.p] : ri.colour);
            this.frame.define(this.mytx);
        } else if (ri.tx !== null){
            if (ri.portion === undefined){this.frame.define(ri.tx);}
            else { this.frame.define(ri.tx, ri.port);}
        }
        this.frame.define(Tex.singlepixel);
        this.scaleTo = {w:tmap.visibletilesize.w,h:tmap.visibletilesize.h};
        //this.sx = tmap.visibletilesize.w;
        //this.sy = tmap.visibletilesize.h;
        //this.align = Align.topLeft;
        this.alpha = ri.alpha;
        this.timer = new Timer(this);
        this.timer.killafter(ri.time);
        this.layer = tmap.layer;
        this.x = tmap.position.x + tmap.visibletilesize.w * loc.x;
        this.y = tmap.position.y + tmap.visibletilesize.h * loc.y;
    }
    cleanup(){
        super.cleanup();
        this.mytx.remove();
        this.mytx = null;
    }
}

class spriteTile extends Sprite{
    tile;
    indexinfo;
    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} frameinfo 
     * @param {*} number 
     * @param {*} layer 
     * @param {*} scale 
     * @param {{fillcol:color,strokecol:color,textsize:int,strokeweight:int,xoff:int,yoff:int}} indexinfo
     * @param {bool} click make clickable or not
     */
    constructor(x, y, frameinfo, number, layer, scale, indexinfo, click){
        super();
        Engine.spM.add(this);
        this.frame.define(frameinfo.tex, frameinfo.port);
        //this.align = Align.topLeft;
        this.x = x;
        this.y = y;
        this.scale1d = scale;
        this.clickable = click;
        this.tile = number;
        this.layer = layer;
        this.indexinfo = indexinfo;
        // this.showRenderArea = [255,0,0,100];
    }
    draw(){
        super.draw();
        if (this.indexinfo !== undefined){
            this.layer.push();
            this.layer.textAlign(CENTER, CENTER);
            this.layer.fill(this.indexinfo.fillcol);
            this.layer.stroke(this.indexinfo.strokecol);
            this.layer.textSize(this.indexinfo.textsize);
            this.layer.strokeWeight(this.indexinfo.strokeweight);
            this.layer.text(this.tile,this.centrex + this.indexinfo.xoff, this.centrey + this.indexinfo.yoff);
            this.layer.pop();
        }
    }
}
/******************************
 * timer.js by Hurray Banana 2023-2024
 ******************************/ 
/**
 * @classdesc
 * provides central timing update support for both
 * stock events (Event) and sprite specific events (Timer)
 */
class EventManager{
    /** list of actively managed Events */
    #timers = null;
    /** initialises the event manager */
    constructor(){
        this.#timers = [];
    }

    /**
     * adds given timer to be managed
     * @param {Timer|Event} timer 
     */
    add(timer){
        this.#timers.push(timer);
    }
    /**
     * Removes a specific timer from the eventmanager
     * @param {Timer|Event} timer 
     */
    remove(timer){
        for (let p = 0; p < this.#timers.length; p++){
            if (this.#timers[p] == timer){
                this.#timers[p].remove();
            }
        }
    }
    /**
     * removes all timers except for the given one, this may need to be active after some mode as ended
     * @param {Timer|Event} timer 
     */
    removeallBut(timer){
        //write this to remove all the timers and just make a new array, not finished yet
        if (Array.isArray(timer)){

        } else {
            for (let p = 0; p < this.#timers.length; p++){
                if (this.#timers[p] != timer){
                    this.#timers[p].remove();
                }
            }            
        }
    }
    /** performs the update of all managed timers and events */
    update(){
        for (let p = 0; p < this.#timers.length; p++){
            const t = this.#timers[p];
            t.update();
        }
        //remove stuff
        let p = this.#timers.length - 1;
        while (p >= 0){
            if (this.#timers[p].action == EventAction.remove){
                this.#timers[p].cleanup();
                this.#timers.splice(p,1);
            } 
            p--;
        }
    }
    /**gets a concise list of all actively managed timers and events
     * @returns {string[]} an array of timer data
     */
    get activeLite(){
        let a = [];
        for (let p = 0; p < this.#timers.length; p++){
            const t = this.#timers[p];
            a.push(t.name + " [" + t.action + "]");
        }
        return a;
    }
    /**gets a list of all actively managed timers and events including details of elapsed time and intervals set
     * @returns {string[]} an array of timer data
     */
    get activeLiteData(){
        let a = [];
        for (let p = 0; p < this.#timers.length; p++){
            const t = this.#timers[p];
            
            a.push(t.name + " [" + t.action + "] " +
            "lapse[" + this.twodp(t.elapsedTime) + "] " +
            "int[" + 
             (t.startafterinterval !== undefined ? this.twodp(t.startafterinterval) : "--") + ":" +
             (t.stopafterinterval !== undefined ? this.twodp(t.stopafterinterval) : "--" ) + "]");
        }
        return a;
    }
    /**
     * Specific version of fixing a float to 2dp with 0 front padding, used by the event debugger
     * @param {float} val 
     * @returns {string} a padded string
     */
    twodp(val){
        val = (val * 100) | 0;
        let x = ("" + val).length;
        val /= 100;
        let t =  val.toString();
        return t.padEnd(x+1,"0");
    }
}

/**
 * @classdesc Basic Event/Timer actions
 */
class EventAction{
    static remove = "remove";
    /**no timing action */
    static none = "none";
    /**acts as a timer, for setting time intervals (like button repeats)
     * 
     * has to be checked using elapsed
     * @example 
     */
    static interval = "timer";
    /** calls a function/method after time period has elapsed */
    static eventonce = "eventonce";
    /** calls a function/method periodically*/
    static event = "event";
    /**and event that fires periodically and stops after a given period of time */
    static eventStopafter = "eventStopafter";
}
/**
 * @classdesc base functionality for general timing events
 */
class Event{
    /**
     * 
     * @param {string} name debug display for event
     */
    constructor(name){
        if (name instanceof Sprite)  name = "spr:" + name.myid;
        this.name = (name !== undefined) ? name: "-";
        this.#action = Action.none;

        Engine.eventM.add(this);
        //NEED TO ADD TO EVENTMANAGER FOR AUTO UPDATING
    }
    /** performs any cleanup for the time, you might need this if you create a custom event or timer that 
     * consumes resources that it needs to de-reference. Create an overloaded method in your inherited class
     * It will be called automatically when the Event/Timer is removed
     */
    cleanup(){
        //shouldn't need (there in case future change)
    }
    /** requests removeall of this event */
    remove(){
        this.cleanup();
        this.action = EventAction.remove;
    }
    /**
     * debugging name for displaying timers
     * @type {string}
     */
    name;
    /** holds time elapsed during the current interval @type {float} */
    #elapsedTime;
    /**
     * gets the timer period that elapsed for this Event/Timer so far
     * @returns {float}
     */
    get elapsedTime(){return this.#elapsedTime;}
    /**
     * sets the elpasedTime for the Event/Timer you should'nt need to use this unless you to set a specific starting point rather then
     * zeroing which reset() does
     * @param {float} value 
     */
    set elapsedTime(value){this.#elapsedTime = value;}
    //** true if the elapsed time is greater than the set interval */
    get elapsed(){return this.#elapsedTime >= this.#startafterinterval;}
    /** returns true if the timer interval has elapsed and then resets it to zero
     * use elapsedResetAccrued if you want to accurately take account of fractional time span accruel
     * returns false if the timer interval has not elapsed
     * 
     * Use this with timers to control auto fire or key delay, these are particularly useful
     * for your own custom timers that you update yourself
     * @example
     * //setup a custom timer in the sprites constructor for auto fire/shoot interval restriction
     * this.shoottimer = new Timer(this)
     * this.shoottimer.interval(0.25);
     * 
     * //in an update method add this sort of code to check for keypress and timer elapsed
     * if (keyIsDown(this.kshoot) && this.shoottimer.elapsedReset){
     *      this.shoot();
     * }
     * @returns {bool} has it elapsed or not
     */
    get elapsedReset(){
        if (this.#elapsedTime >= this.#startafterinterval){
            this.#elapsedTime = 0;
            return true;
        } else {return false;}
    }
    /**
     * Checks the timer to see if it has elapsed, if it has then the interval time is substracted from the elapsed time
     * this factors in time differences between updates and . Use elpasedReset if you just want the elapsed time to zero (key delays)
     * @returns {bool} has it elapsed or not
     */
    get elapsedResetAccrued(){
        if (this.#elapsedTime >= this.#startafterinterval){
            this.#elapsedTime -= this.#startafterinterval;
        return true;
        } else {return false;}
    }
    /** resets thecurrent timer (if active) */
    reset(){this.#elapsedTime = 0;}

    /** holds the interval for either the start of a timing process or the activation of a timer or event @type {float}*/
    #startafterinterval;
    /**
     * gets the basic interval of a timer or the start phase interval or a timer
     * @returns {float}
     */
    get startafterinterval(){return this.#startafterinterval;}
    /**
     * sets the basic interval of a timer or the start phase interval or a timer
     * @param {float} value
     */
    set startafterinterval(value){this.#startafterinterval = value;}
    /** holds the action stopping interval @type {float} */
    #stopafterinterval;
    /**
     * gets the interval for an action stopping
     * @returns {float}
     */
    get stopafterinterval(){return this.#stopafterinterval;}
    /**
     * sets the interval for an action stopping
     * @param {float} value
     */
    set stopafterinterval(value){return this.#stopafterinterval = value;}

    /** holds an event interval used mainly in visibility testing @type {float}*/
    #actionTime;
    /**
     * internal timing information for checking visiblility
     * @returns {float}
     */
    get actionTime(){return this.#actionTime;}
    /**
     * internal timing information for checking visiblility, do not modify
     * @returns {float}
     */
    set actionTime(value){this.#actionTime = value;}
    /** holds the current action of the event/timer @type {EventAction}*/
    #action;
    /**
     * gets the active mode of the event/timer
     * @returns {EventAction}
     */
    get action(){return this.#action;}
    /**
     * sets the event/timers action mode, this is set when you pick how the timer should operate, do not change directly
     * @param {EventAction} value 
     */
    set action(value){this.#action = value;}
    /**
     * true if a timer is active 
     * @returns {bool} 
     * */
    get active(){return this.#action != EventAction.none;}
    /** holds the callback executed when the event/timer meets its interval @type {callback:method|function,instance:object}*/
    #callback = null;
    /** retrieves the current callback (if this has not been set it will be null)
     * it will be in the form of object properties
     * @example 
     * // two propeties callback and instance
     * let callstuff = this.timer.callback;
     * if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
     * @returns {{callback:method|function,instance:object}}
     */
    get callback(){return this.#callback;}
    /** sets (or changes) the callback handler called when animation states reach an end point
     * value must be an object with 2 properties
     * @example 
     * // animationchanged is a method of your inherited sprite class
     * this.callback = {callback:this.myactions,instance:this};
     * // or use the Engine.makeCallback() method
     * this.callback = Engine.makeCallback(this.myactions, this);
     */
    set callback(value){
      if (value != undefined && value.callback !== undefined && value.instance !== undefined){
        this.#callback = value;
      }
    }
    /** 
     * If a event/timer is set repeatidly it will continually reset. In my cases this would be undeserable
     * but in certain circumstances such as mouse over effects that use a timer to revert an animation frame, you might want to keep 
     * restarting the timer while the mouse is over the sprite. it removes the need for more complex logic to deal with this case
     * gets the status of timer overwrites, default is false, rejecting multiple setting of timers
     * @returns {bool}*/
    get allowOverwrite(){return this.#allowoverwrite;}
    /**
     * sets the response to identical timer settings for active timers, true means allow it to be overwritten (effectively reset), flase means
     * reject
     * @param {bool} value 
     */
    set allowOverwrite(value){this.#allowoverwrite = value;}
    #allowoverwrite = false;
    /** 
     * allows the resetting of a timer (time starts again)
     * 
     * this might be desirable if you are doing a mouse over effect, where a rendering resets to not over
     * view after 0.2 seconds, but you keep restarting the timer while you are over the sprite
     * default behaviour is false (ignore duplicates)
     */
    overwriteEnable(){this.#allowoverwrite=true;}
    /** 
     * turns off overwrite of duplicate timers  
     * default behaviour is false (ignore duplicates)
    */
    overwriteDisable(){this.#allowoverwrite=false;}
    /**
     * Sets the time interval for the Event, you only need to do this if you are creating a timer for your own purposes such a key delay timer
     * which you used ElapsedReset to check for the interval elapsing.
     * 
     * If you want to call a method or function after a time interval then use timer.eventonce()
     * @param {float} time 
     */
    interval(time){
        this.#action = Action.interval;
        this.actionTime = 0; this.elapsedTime = 0;
        this.startafterinterval = time;
    }
    /**
     * Delays calling a method or function until after a period of time
     * @param {float} callAfter time to wait before calling method/function
     * @param {{callback:method|function,instance:object}} callback the code to call when the event occurs use 
     * Engine.makeCallback() to create your callback
     * @example
     * //call the startgame method after 3 seconds
     * Engine.eventM.eventonce(3, Engine.makeCallback(this.startgame, this));
     */
    eventonce(callAfter, callback){//} instance, callme){
        if (this.#allowoverwrite || this.#action != Action.callback){
            this.#action = Action.eventonce;
            this.startafterinterval = callAfter;
            this.actionTime = 0; this.elapsedTime = 0;
            //this.#phase = Phase.startafter;
            this.#callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.#callback = {callback:callme,instance:instance};
            // }
        }
    }
    /**
     * creates a periodic timer which continually calls a given method/function
     * @param {float} interval time to wait before calling method/function
     * @param {{callback:method|function,instance:object}} callback the code to call when the event occurs use 
     * Engine.makeCallback() to create your callback
     * @example
     * //call the increaseDifficulty method every 20 seconds
     * Engine.eventM.event(203, Engine.makeCallback(this.increaseDifficulty, this));
     * to stop calling the method/function use the events remove() method
     */
    event(interval, callback){//instance, callme){
        if (this.#allowoverwrite || this.#action != Action.event){
            this.#action = Action.event;
            this.startafterinterval = interval;
            this.actionTime = 0; this.elapsedTime = 0;
            //this.#phase = Phase.startafter;
            
            this.#callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.#callback = {callback:callme,instance:instance};
            // }
        }
    }
    /**
     * creates a periodic timer which continually calls a given method/function until a specified time is reached
     * @param {float} interval time to wait before calling method/function
     * @param {float} stopAfter period of time to wait before stopping the event
     * @param {{callback:method|function,instance:object}} callback the code to call when the event occurs use 
     * Engine.makeCallback() to create your callback
     * @example
     * //call the spawnEnemy method every 1second for 20 seconds
     * Engine.eventM.eventStopafter(1,20, Engine.makeCallback(this.spawnEnemy, this));
     * to stop calling the method/function use the events remove() method
     * to stop calling the method/function use the events remove() method
     */
    eventStopafter(interval, stopAfter, callback){//instance, callme){
        if (this.#allowoverwrite || this.#action != Action.eventStopafter){
            this.#action = Action.eventStopafter;
            this.startafterinterval = interval;
            this.#stopafterinterval = stopAfter;
            this.actionTime = 0; this.elapsedTime = 0;
            //this.#phase = Phase.startafter;
            this.#callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.#callback = {callback:callme,instance:instance};
            // }
        }
    }    
    /** updates timer checking for action responses */
    update(){
        if (this.action != Action.none){
            //new timing system
            this.#elapsedTime += Engine.delta;
            this.actionTime += Engine.delta;
            switch (this.action){
                case Action.interval: break;
                case Action.eventonce:
                    if (this.#elapsedTime >= this.startafterinterval){
                        //this.action = Action.none;
                        //this.action = Action.remove;
                        Engine.processCallback(this.callback);
                        this.remove();
                    } break;
                case Action.event:
                    if (this.#elapsedTime >= this.startafterinterval){
                        this.#elapsedTime -= this.startafterinterval;
                        Engine.processCallback(this.callback);
                    } break;
                case Action.eventStopafter:
                    if (this.actionTime > this.#stopafterinterval){
                        //this.action = Action.none;
                        //this.action = Action.remove;
                        this.remove();
                    } else {
                        if (this.#elapsedTime >= this.startafterinterval){
                            this.#elapsedTime -= this.startafterinterval;
                            Engine.processCallback(this.callback);
                            } 
                    } break;
            }//switch (_method)
        }//if (_method != Style.none)
    }//update(delta)
}
/** 
 * @classdesc Determines what phase timer sub system is in (used internally) */
class Phase{
    /** waiting for flashing to start*/
    static startafter = "startafter";
    /** waiting for flashing to stop*/
    static stopafter = "stopafter";
    /** waiting to kill sprite*/
    //static killafter = "killafter";
}
/** 
 * @classdesc specifies sprite actions for timer operations */
class Action extends EventAction{
    /**kills the sprite after time elapsed */
    static killafter = "killafter";
    /**flashes continuously */
    static flash = "flash";
    ///**no timing action */
    //static none = "none";
    ///**acts as a timer, for setting time intervals (like button repeats)
    // * 
    // * has to be checked using elapsed
    // * @example 
    // */
    //static interval = "timer";
    ///** calls a function/method after time period has elapsed */
    //static eventonce = "eventonce";
    ///** calls a function/method periodically*/
    //static event = "event";
    ///**and event that fires periodically and stops after a given period of time */
    //static eventStopafter = "eventStopafter";
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
    /**makes a sprite visible and then hides it after the time period elapses */
    static hideafter = "hideafter";
    /**apply a velocity for a period of time */
    static impulse = "impulsestopafter";
}
/** 
 * @classdesc implements sprite specific timers (you can only have one)
 * If you need more sprite specific ones, create another timer, 
 * but make sure you create and update method that calls the timers update method
 * 
 * I may refactor this to be part of a eventmanager class so all timer subsystems will use a common structure
 */
class Timer extends Event{
    /** holds reference to the sprite being manipulated by the timer @type {Sprite} */
    #mysprite
    /** holds time interval for on time during flashing @type {float}*/
    #oninterval;
    /** holds time interval for off time during flashing  @type {float}*/
    #offinterval;
    /** holds visibility state of the sprite @type {bool}*/
    #hidden;
    /** holds phase of timing for multi step actions @type {Phase} */
    #phase;
    /** holds force to apply during impulse timers @type {vector3} */
    #impulse;
    /**
     * get the current phase of timer action, you can use this during callbacks
     * @returns {Phase}
     */
    get phase(){return this.#phase;}

    /**
     * Constructs and new sprite timer
     * @param {Sprite} sprite the sprite associated with the sprite timers
     */
    constructor(sprite){
        super("spr:" + sprite.myid);
        this.#mysprite = sprite;
        //this.action = Action.none;
    }
    /** 
     * removes sprite reference when timer removed, override this if you create an inherited timer that adds more resources */
    cleanup(){
        super.cleanup();
        this.#mysprite = null;
    }
    /**
     * disable the timer, choose whether to display or hide the sprite 
     * @param {bool} display if true sprite will be shown, false if not (important if you have been flashing a sprite)
    */
    off(display){
        this.action = Action.none;
        if (display === undefined || display)
            this.#mysprite.show();
        else
            this.#mysprite.hide();
    }
    /**
     * flashes the sprite on and off, duration in seconds (or fraction of)
     * @param {float} onduration number of seconds or fraction of
     * @param {float} offduration number of seconds or fraction of
     * slightly longer on than off looks best
     */
    flash(onduration, offduration){
        if (this.allowoverwrite || this.action != Action.flash){
            this.action = Action.flash;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = false;
        }
    }
    /**
     * flashes and sprite and then stops flashing after a period of time
     * @param {float} stopAfter time to stop flashing in seconds
     * @param {float} onduration number of seconds or fraction of
     * @param {float} offduration number of seconds or fraction of
     * @param {{callback:method|function,instance:object}} callback the code to call when the sprite stops flashing
     * Engine.makeCallback() to create your callback
     */
    flashStopafter(stopAfter, onduration, offduration, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.flashStopafter){
            this.action = Action.flashStopafter;
            this.stopafterinterval = stopAfter;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = false;
            this.#phase = Phase.stopafter;
            
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.#callback = {callback:callme,instance:instance};
            // }
        }
    }
    /**
     * flashes a sprite and then kills it after a period of time
     * @param {float} killAfter seconds after which sprite should be killed off
     * @param {float} onduration number of seconds or fraction of
     * @param {float} offduration number of seconds or fraction of
     */
    flashKillafter(killAfter, onduration, offduration){//}, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.flashKillafter){
            this.action = Action.flashKillafter;
            this.stopafterinterval = killAfter;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = false;
            this.#phase = Phase.stopafter;
            this.#mysprite.show();
            
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.callback = {callback:callme,instance:instance};
            // }
        }        
    }
    /**
     * a sprite to start flashing after a certain period of time
     * @param {float} startAfter how long before flashing starts
     * @param {float} onduration number of seconds or fraction of
     * @param {float} offduration number of seconds or fraction of
     * @param {{callback:method|function,instance:object}} callback the code to call when the sprite starts flashing
     * Engine.makeCallback() to create your callback
     */
    flashStartafter(startAfter, onduration, offduration, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.flashStartafter){
            this.action = Action.flashStartafter;
            this.startafterinterval = startAfter;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = false;
            this.#mysprite.show();
            this.#phase = Phase.startafter;
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.callback = {callback:callme,instance:instance};
            // }
        }
    }
    /**
     * Flashes a sprite after a certain period of time and then kills it after another time period has ended
     * @param {float} killAfter seconds after which sprite should be killed off
     * @param {float} startAfter how long before flashing starts
     * @param {float} onduration number of seconds or fraction of
     * @param {float} offduration number of seconds or fraction of
     * @param {{callback:method|function,instance:object}} callback the code to call when the sprite starts flashing
     * Engine.makeCallback() to create your callback
     */
    flashStartafterKillafter(startAfter, killAfter, onduration, offduration, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.flashStartafterKillafter){
            this.action = Action.flashStartafterKillafter;
            this.startafterinterval = startAfter; this.stopafterinterval = killAfter;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = false;
            this.#mysprite.show();
            this.#phase = Phase.startafter;
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.callback = {callback:callme,instance:instance};
            // }
        }
    }
    /**
     * a visible sprite starts to flash after a period of time, it then stops flashing after a further period of time
     * @param {float} startAfter period of time to start flasher
     * @param {float} stopAfter period of time for flashing to continue before it stops
     * @param {float} onduration number of seconds or fraction of
     * @param {float} offduration number of seconds or fraction of
     * @param {{callback:method|function,instance:object}} callback the code to call when the sprite starts flashing and again when it stops
     * Engine.makeCallback() to create your callback
     */
    flashStartafterStopafter(startAfter, stopAfter, onduration, offduration, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.flashStartafterStopafter){
            this.action = Action.flashStartafterStopafter;
            this.startafterinterval = startAfter; this.stopafterinterval = stopAfter;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = false;
            this.#mysprite.show();
            this.#phase = Phase.startafter;
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.callback = {callback:callme,instance:instance};
            // }
        }
    }
    /**
     * shows the sprite after a period of time has passed
     * @param {float} showAfter number of seconds to wait before showing
     * @param {{callback:method|function,instance:object}} callback the code to call when the sprite is shown
     * Engine.makeCallback() to create your callback
     */
    showafter(showAfter, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.showafter){
            this.action = Action.showafter;
            this.startafterinterval = showAfter;
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = true;
            this.#mysprite.hide();
            this.#phase = Phase.startafter;
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.callback = {callback:callme,instance:instance};
            // }
        }
    }
    /**
     * Hides the sprite after a period of time has passed
     * @param {float} hideAfter number of seconds to wait before hiding
     * @param {{callback:method|function,instance:object}} callback the code to call when sprite is hidden
     * Engine.makeCallback() to create your callback
     */
    hideafter(hideAfter, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.hideafter){
            this.action = Action.hideafter;
            this.startafterinterval = hideAfter;
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = false;
            this.#mysprite.show();
            this.#phase = Phase.startafter;
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.callback = {callback:callme,instance:instance};
            // }
        }
    }    
    /**
     * Shows a sprite after a period of time then kills it after another period of time
     * @param {float} showAfter time to wait until sprite displayed
     * @param {float} killAfter time to kill sprite after displaying
     * @param {{callback:method|function,instance:object}} callback the code to call when the sprite is shown
     * Engine.makeCallback() to create your callback
     */
    showafterKillafter(showAfter, killAfter, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.showafterKillafter){
            this.action = Action.showafterKillafter;
            this.startafterinterval = showAfter;
            this.stopafterinterval = killAfter;
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = true;
            this.#mysprite.hide();
            this.#phase = Phase.startafter;
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.callback = {callback:callme,instance:instance};
            // }
        }
    }
    /**
     * shows a sprite after a period of time, flashing as it becomes visible
     * @param {float} showAfter timer period to wait before showing the flashing sprite
     * @param {float} onduration number of seconds or fraction of
     * @param {float} offduration number of seconds or fraction of
     * @param {{callback:method|function,instance:object}} callback the code to call when the sprite starts flashing
     * Engine.makeCallback() to create your callback
     * @example
     */
    showafterFlash(showAfter, onduration, offduration, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.showafterFlash){
            this.action = Action.showafterFlash;
            this.startafterinterval = showAfter;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = true;
            this.#mysprite.hide();
            this.#phase = Phase.startafter;
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.callback = {callback:callme,instance:instance};
            // }
        }
    }


    /**
     * kills a sprite after a period of time
     * @param {float} killtime timer period 
     * set a callbackFuneral or override the Kill() method of your sprite if you want to know when it's killed
     */
    killafter(killtime){//}, callback){//instance, callme){
        this.action = Action.killafter;
        this.actionTime = 0; this.elapsedTime = 0;
        this.stopafterinterval = killtime;
        // this.callback = callback;
        // if (instance !== undefined && callme !== undefined){
        //     this.callback = {callback:callme,instance:instance};
        // }
    }

    /**
     * applies a force to a sprite for a period of time
     * @param {float} stopAfter timer period to apply the force
     * @param {vector3} force 
     * @param {{callback:method|function,instance:object}} callback the code to call when the event occurs use 
     * Engine.makeCallback() to create your callback
     * @example
     * //call the increaseDifficulty method every 20 seconds
     * Engine.eventM.event(203, Engine.makeCallback(this.increaseDifficulty, this));
     * to stop calling the method/function use the events remove() method
     */
    impulse(stopAfter, force, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.impulse){
            this.action = Action.impulse;
            this.stopafterinterval = stopAfter;
            this.actionTime = 0; this.elapsedTime = 0;
            this.#impulse = force;
            this.#phase = Phase.startafter;
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.callback = {callback:callme,instance:instance};
            // }
        }
    }
    /**
     * performs updates for this sprite timer
     */
    update(){
        super.update();
        if (this.action != Action.none){
            //new timing system
            //this.#elapsedTime += Engine.delta;
            //this.actionTime += Engine.delta;
            switch (this.action){
                case Action.killafter:
                    if (this.elapsedTime >= this.stopafterinterval){
                        //this.action = Action.none;
                        //this.action = Action.remove;
                        this.#mysprite.kill();
                        this.remove();
                    } break; 
                case Action.showafter:
                    if (this.elapsedTime >= this.startafterinterval){
                        this.#mysprite.show();
                        //this.action = Action.none;
                        //this.action = Action.remove;
                        Engine.processCallback(this.callback);
                        this.remove();
                    } break;
                case Action.hideafter:
                    if (this.elapsedTime >= this.startafterinterval){
                        this.#mysprite.hide();
                        //this.action = Action.remove;
                        Engine.processCallback(this.callback);
                        this.action = Action.none;
                    } break;                    
                case Action.showafterFlash:
                    if (this.elapsedTime >= this.startafterinterval){
                        this.action = Action.flash;
                        this.#mysprite.show();
                        this.#hidden = false;
                        this.elapsedTime -= this.startafterinterval;
                        this.actionTime = this.elapsedTime;
                        this.#sortvisibility();
                        Engine.processCallback(this.callback);
                    } break;
                case Action.showafterKillafter:
                    switch (this.#phase){
                        case Phase.startafter:
                            if (this.elapsedTime >= this.startafterinterval){
                                //turn on kill phase
                                this.#phase = Phase.stopafter;
                                this.elapsedTime -= this.startafterinterval;
                                this.#mysprite.show();
                                Engine.processCallback(this.callback);
                            } break;
                        case Phase.stopafter:
                            if (this.elapsedTime >= this.stopafterinterval){
                                //this.action = Action.none;
                                //this.action = Action.remove;
                                this.#mysprite.kill();
                                this.remove();
                            } break;
                    } break;
                case Action.impulse:
                    this.#mysprite.Velocity.add(this.#impulse);
                    if (this.elapsedTime >= this.stopafterinterval){
                        //this.action = Action.none;
                        //this.action = Action.remove;
                        this.remove();
                        Engine.processCallback(this.callback);
                    } break;
                case Action.flashStartafter:
                    if (this.elapsedTime >= this.startafterinterval){
                        this.elapsedTime -= this.startafterinterval;
                        this.actionTime = this.elapsedTime;//added
                        this.action = Action.flash;
                        this.#sortvisibility();
                        Engine.processCallback(this.callback);
                    }
                    break;
                case Action.flashStartafterStopafter:
                    switch (this.#phase){
                        case Phase.startafter:
                            if (this.elapsedTime >= this.startafterinterval){
                                //turn on continuous flashing
                                this.elapsedTime -= this.startafterinterval;
                                this.actionTime = this.elapsedTime;//added
                                this.#sortvisibility();
                                Engine.processCallback(this.callback);
                                this.#phase = Phase.stopafter;
                            } break;
                        case Phase.stopafter:
                            this.#sortvisibility();
                            if (this.elapsedTime >= this.stopafterinterval){
                                //this.action = Action.none;
                                //this.action = Action.remove;
                                this.#mysprite.show();
                                this.remove();
                                Engine.processCallback(this.callback);
                            } break;
                    } break;
                case Action.flashStartafterKillafter:
                    switch (this.#phase){
                        case Phase.startafter:
                            if (this.elapsedTime >= this.startafterinterval){
                                //turn on continuous flashing
                                this.#phase = Phase.stopafter;
                                this.elapsedTime -= this.startafterinterval;
                                this.actionTime = this.elapsedTime;//added
                                this.#sortvisibility();
                                Engine.processCallback(this.callback);
                            }
                            break;
                        case Phase.stopafter:
                            this.#sortvisibility();
                            if (this.elapsedTime >= this.stopafterinterval){
                                //this.action = Action.none;
                                //this.action = Action.remove;
                                this.#mysprite.kill();
                                this.remove();
                            }
                            break;
                    }
                    break;
                case Action.flash:
                    this.#sortvisibility();
                    break;
                case Action.flashStopafter:
                    this.#sortvisibility();
                    if (this.elapsedTime >= this.stopafterinterval){
                        //this.action = Action.none;
                        //this.action = Action.remove;
                        this.#mysprite.show();
                        this.remove();
                        Engine.processCallback(this.callback);
                    } break;
                case Action.flashKillafter:
                    this.#sortvisibility();
                    if (this.elapsedTime >= this.stopafterinterval){
                        //this.action = Action.none;
                        //this.action = Action.remove;
                        this.#mysprite.kill();
                        this.remove();
                    } break;
            }//switch (_method)
        }//if (_method != Style.none)
    }//update()

    /**
     * determines whether sprite should be shown or no during flashing actions
     */
    #sortvisibility(){
        if (this.#hidden){
            if (this.actionTime >= this.#offinterval){
                this.actionTime -= this.#offinterval;
                this.#mysprite.show();
                this.#hidden = !this.#hidden;
            }
        }  else {
            if (this.actionTime >= this.#oninterval){
                this.actionTime -= this.#oninterval;
                this.#mysprite.hide();
                this.#hidden = !this.#hidden;
            }
        }
    }//sortvisibility
}  

/******************************
 * timer.js by Hurray Banana 2023-2024
 ******************************/ 
// NEED TO IMPLEMENT CATMULL-ROM for smooth function
       

/**
* @classdesc  States what should happen when a sprite reaches the end of its current track
*/
class EndOfTrackAction{
    /**
     at end of track pick another track from those associated with the Sprite
    Great for random boss movement patterns
    */
    static random = "random";
    /**
     forces the sprite to leave the track and continue in the direction it was last moving
    Nice to use if you turn gravity on for a sprite once its detached if you use 
    an OnTrackEnd handler to alter the sprites properties
    */
    static detach = "detach";
    /**
     start again on the current track
    Useful for fancy menu like sega 3d ones for name entry
    */
    static  wrap = "wrap";
    /**
     go backwards along the current track
    Nice to use for display or target type tracks
    */
    static reverse = "reverse";
    /**
     kill the sprite at the end of the track
    Can use for explosion effects in conjuction with a Sprite funeral
    */
    static  kill = "kill";
    /**
     move on to the start of the next track
    Use if you want a sprite to follow a specific sequence of tracks.
    The order is governed by the order you used the Sprite.AddTrack() methods
    */
    static next = "next";
    /**
     Halt sprite at the end of the track
    Use if you want a sprite to travel to the end and the stop and do something
    like launch a bullet at the player (see the yellow circular star force enemies)
    use in conjuction with OnTrackEnd handler. After firing you can ask the Sprite to
    follow a second track to move off screen again.
    */
    static stop = "stop";
}

/**
* @classdesc  States how the sprite should move along the track
Discrete step is for manual control of a track
*/
class TrackStepMode{
    /**
     operate using a fixed step 
    move along a certain number of points during each update
    */
    static discreteStep = "discreteStep";
    /**
     approximate a time to travel along so many pixels of the track
    in the same way as sprite velocity works
    */
    static pixelsPerSec = "pixelsPerSec";
}


/**
 * @classdesc Responsible for storing the Tracks and manipulating the movement of a Sprite
 * In order to use Tracks with a Sprite you need to make sure you create one normally in your constructor
 * @example this.track = new TrackManager(this);
 */
class TrackManager{
    
    /** Creates a new TrackManager for the Sprite.
    *
    * @param {Sprite} s The sprite to associate the trackmanager with
    * This is created by the Sprite itself if you passed a TrackBank when you create it
    * @returns {TrackManager}
    */
    constructor(s){
        this.boss = s;
        this.#tracklist = [];
        //setup the default timer to be every possible frame
        this._updateTimer = new Event("TRACKMAN FOR SP" + s.myid.toString().padEnd(5, '0'));
        this._updateTimer.interval(0);
        //then need to add to the event manager somehow
    }
    /** not used */
    cleanup(){}
    /**
     * Drawing sort of works but I need to implement duplicate and dirty track changes properly so it doesn't overdraw anything
     * @param {int} trknum the track index of this sprites track to draw
     * @param {bool} closed if true then the first and last points will be drawn (as if it was a polygon)
     * @param {{step:int,layer:texture,col:color,weight:int,shape:shape}} style specifies how to draw the track, see examples for details
     * @example
     * // skip every other 5 points
     * // put on glow layer
     * // make 3 pixels wide
     * // color full green
     * let glowstyle = {step:5,layer:Engine.glowlayer(),weight:3,col:[0,255,0]};
     * // skip every other 5 points
     * // put on same layer as this sprite
     * // make 3 pixels wide
     * // color white
     * let trackstyle = {step:5,layer:this.layer,weight:3,col:[255,255,255]};
     * 
     * //draw current track twice, once on glowlayer, once on sprite layer
     * this.track.draw(b,this.track.CurrentTrackData.trackDef.closed, tstyle);
     * this.track.draw(b,this.track.CurrentTrackData.trackDef.closed, trackstyle);
     */
    draw(trknum, closed, style){
        trknum = (trknum === undefined || trknum < 0 || trknum >= this.#tracklist.length) ? 0 : trknum;
        let tr = this.#tracklist[trknum];
        if (!tr.isDirty && this.#tracklist.length > 0){
            //tr.isDirty = true;
            let step = (style === undefined || style.step === undefined) ? 1 : style.step;

            let layer = (style === undefined || style.layer === undefined) ? Engine.layer(0) : style.layer;
            layer.push();
            layer.stroke((style === undefined || style.col === undefined) ? 1 : style.col);
            layer.strokeWeight((style === undefined || style.weight === undefined) ? 1 : style.weight);
            layer.noFill();
            if (style === undefined || style.shape === undefined){
                layer.beginShape();
            } else {
                layer.beginShape(style.shape);
            }

            let v = this.#tracklist[trknum].trackDef.points
            let p = 0;
            while (p < v.length){
                layer.vertex(v[p].x + tr.offset.x, v[p].y + tr.offset.y);
                p += step;
            }
            if (closed){ layer.endShape(layer.CLOSE);
            } else {layer.endShape();}
            layer.pop();  
        } else {console.log("not drawn " + trknum)};
    }
    /** @returns {bool} if set to true then manual track position changes instantly afect the position of the sprite
    * defaults to true, if this causes problems then set this to false
    */
    get instantmove() { return this.#instantmove; }
    /** 
     * @param {bool} value if set to true then manual track position changes instantly afect the position of the sprite
     * defaults to true, if this causes problems then set this to false */
    set instantmove(value) {this.#instantmove = value; }
    
    /**  @type {bool} if set to true then manual track position changes instantly afect the position of the sprite
    * defaults to true, if this causes problems then set this to false */
    #instantmove = true;
    
    
    /** @type {Track[]} holds the tracks of this sprite */
    #tracklist = null;

    
    /**
     * @returns {Track[]} gets the sprites tracklist (for manual manipulation by your code if you want to)
     */
    get TrackList() { return this.#tracklist; }
    
    /**
     * @type {EndOfTrackAction} what to do when you get to the end of the current track
    */
    #endAction = EndOfTrackAction.stop;
    
    /**
     * @type {TrackStepMode} Determines how sprite moves along the track 
     * defaults to pixelsPerSec to take account of the game clock
    */
    stepMode = TrackStepMode.pixelsPerSec;
    
    /**
     * @type {float} The speed in pixels per seconds to move along the track
    */
    #pixelsPerSec = 0;
    
    /**
     * @type {float}
     precalculated value so we just multply game time
        needs to re-calculated every time speed adjusted
        or track changes MUST IMPLEMENT THIS
    */
    #pixelsPerSecPreCalc;
    
    /**
     * @returns {float} gets the speed at which a sprite should travel along the track in pixels per second
    */
    get PixelsPerSec() { return this.#pixelsPerSec; }
    /**
     * @param {float} value Sets the speed at which a sprite should travel along the track in pixels per second
    */
    set PixelsPerSec(value){
        if (value <= 0)
            value = 0;
        this.#pixelsPerSec = value;
        this.#SetPreCalc();
    }

    /**
     needs to be called when pixelsPerSec changes or track being used changes
    */
    #SetPreCalc(){
        this.#pixelsPerSecPreCalc = this.direction * this.#pixelsPerSec * this.#tracklist[this._trackCurrent].trackDef.pointsOverlength;
        this.#pointsCurrent = this.#tracklist[this._trackCurrent].trackDef.points.length;
    }
    
    /**
     @type {float} holds the step distance fractionally so we can move smoothly then integer round
    */
    trackFractionalPos = 0;
    /**
     @type {{callback:method | function,instance:object}} stores the the delegate routine to call when a sprite meets the end of a track
    */
    #callbackEOT = null;
    /** retrieves the current the callback handler called sprite reaches then end of a track
     * it will be in the form of object properties
     * @returns {{callback:method | function,instance:object}}
     * @example 
     * // two propeties callback and instance
     * let callstuff = this.callbackEndOfTrack;
     * if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
     */
    get callbackEndOfTrack(){return this.#callbackEOT;}
    /**
     * sets (or changes) the callback handler called sprite reaches then end of a track
     * @example //value must be an object with 2 properties or use:
     *  Engine.makeCallback()
     * @param {{callback:method | function,instance:object}} value 
     */
    set callbackEndOfTrack(value){
        if (value != undefined && value.callback !== undefined && value.instance !== undefined){
        this.#callbackEOT = value;
        }
    }    
    /**
    * @type {int} if trackEndAction is set to kill do so after we have moved through this many tracks
    */
    _travellingStops = 1;
    
    /**
    @type {int} how many track have I travelled along
    */
    _totalTravelled = 0;
    
    /**
     @type {int} the index of the track in this.#tracklist we are currently using
    */
    _trackCurrent;

    
    /**
     * @returns {int} current trackindex
     Allows you to manually change the track index at any time
        Use with caution, you can often achieve the effect you want using
        the correct means of working with tracks
    */
    get TrackCurrent(){ return this._trackCurrent; }
    /**
     * @param {int} value trackindex you want
     *  Allows you to manually change the track index at any time
        Use with caution, you can often achieve the effect you want using
        the correct means of working with tracks
     */
    set TrackCurrent(value){ this._trackCurrent = value; }
    
    /**
    * @type {int} number of points in the active track
    */
    #pointsCurrent;
    /**
     * @type {int} number of points in the active track
     */
    get pointsCurrent(){return this.#pointsCurrent;}
    /**
     * @returns {Track} Retrieves the Track data (not a definition of the currently active track)
        The track definition is available within the Track object
    */
    get CurrentTrackData() { return this.#tracklist[this._trackCurrent]; }
    
    /**
     * @type {int} the element position of the track we are currently looking at
    */
    _trackPosition;
    
    /**
     @type {int} how much to move along the track by each update
    */
    _trackStep;
    
    /**
     @type {int} holds the previous trackstep when paused
        ready to be restored
    */
    _saveTrackStep;
    
    /**
     @type {int} what direction to move along the track +ve 1 or -ve 1
    */
        direction = 1;
    
    /**
     @type {Sprite} holds a reference to parent sprite
    */
    boss;
    
    /**
     @type {Timer} holds a timer that determines when the track position should
        be updated which ensure this is independant of frame rate
    */
    _updateTimer; 
    

    /**
     * @returns {EndOfTrackAction} gets or sets the action that should be performed when a sprite reaches the end of 
        a track
    */
    get EndAction(){ return this.#endAction; }
    /**
     * @returns {EndOfTrackAction} sets the action that should be performed when a sprite reaches the end of 
        a track
    */
    set EndAction(value) { this.#endAction = value; }
    
    /**
     * @returns {int}
     Gets the number of tracks this sprite has travelled along
    */
    get TracksTravelled() {return this._totalTravelled; }
    
    /**
     Set the value for number of tracks travelled
    this can be used for counting 
    @param {int} newCount The new setting value you require
    */
    TravelledCountSet(newCount){
        this._totalTravelled = newCount;
    }
    //NEEDS RE_WORKING AS THIS NOW ONLY WORKS FOR STEP MOVEMENT
    
    /**
     Stop sprite moving along track
        Restart track movement using Resume()
    */
    Pause(){
        this._saveTrackStep = this._trackStep;
        this._trackStep = 0;
    }

    /**
     Restart a previously Paused() sprite
        Don't use this without previously Pausing
    */
    Resume(){
        this._trackStep = this._saveTrackStep;
    }

    
    /**
    Disconnects Sprite from given tracks and sets velocity in last known direction
    Can go back to track mode by setting MovementMode to autotrack or manualTrack.

    If you don't want velocity just set it to zero after calling Detach()
    */
    Detach(){
        let v = vector3.sub(this.boss.position - this.boss.lasttrackposition);
        v.normalise();
        v.mul(this.#pixelsPerSec);
        this.boss.velocity = v;
        //this.boss.velocity = vector3.normalised((boss.Position - this.boss.LastTrackPosition)) * this.pixelsPerSec;
        this.boss.updateMode = UpdateMode.automatic;
    }

    
    /** This is a bit broken need a solution based on vertex settings
     attempts to take value in lastTrackWas and performs the undraw operation
        @param {int} drawNextTrack if true we will attempt to draw the current track after removing previous
    */
    AttemptToAutoUndraw(drawNextTrack){
        if (this.drawing && this.#autoShowHide)
        {
            this.DrawTrackNoMore(this.lastTrackWas);
            
            //bodge for now need to record current settings when draw specified
            if (drawNextTrack) this.DrawTrack(this.lastLineStyle, this.lastNumberOfLinesDrawn, this.#autoShowHide);
        }
    }

    
    /**
     @returns {float} gets the updated interval for the track update timer
    */
    get UpdateInterval() { return this._updateTimer.Interval; }

    
    /**
    Removes a track at the given position.
    The position is the order in which the tracks were added
    The first track added is at position 0.
    If the last track removed is being followed by the sprite then it is
    detached from this track and the end track handler is called if enabled
    @param {} position The track index for this sprite to remove
    */
    Remove(position){
        if (position > -1 && position < this.#tracklist.length){

            this.#tracklist.splice(position, 1);
            //attempt to adjust current track if affected by removal
            if (this._trackCurrent >= position){
                this._trackCurrent--;
                if (this._trackCurrent < 0)
                    this._trackCurrent = 0;
                //if no track data turn of track update methods
                if (this.#tracklist.length == 0)
                    this.boss.updateMode = UpdateMode.automatic;
            }

        }
    }

    
    /**
    Adds a track from the TrackBank to be used by this Sprite
    @param {} trackDef The previously generated track definition
    Make sure you have added Tracks to your TrackBank first
    */
    AddTrack(trackDef){
        if (!(trackDef === null || trackDef === undefined))
            this.#tracklist.push(new Track(trackDef));
    }

    
    /**
    Adds a track to be used by this Sprite and modifies its starting position 
    by the amount given
    @param {TrackDefinition} trackDef the trackdefinition to add
    @param {vector3} offset A 3d offset to apply to the original tracks positions
    */
    AddTrackWithOffset(trackDef, offset){   
        if (!(trackDef === null || trackDef === undefined)){
            this.#tracklist.push(new Track(trackDef, offset));
        }
    }

    
    /**
    Adds a track to a sprite and translates the track to a specified position, 
    so a single track can be placed with it's start at the position of a sprite if you wish
    @param {TrackDefinition} trackDef Track definition
    @param {vector3} startPos The position to start the track
    Use this for a track shape that will be used for a sprite
    generated at a specific position (e.g bullet hell tracks)
    */
    AddTrackStartAt(trackDef, startPos){
        if (!(trackDef === null || trackDef === undefined)){
            this.#tracklist.push(new Track(trackDef, vector3.sub(startPos, trackDef.points[0])));
        }
    }
    
    /**
    Specifies how Sprite is to use the tracks allocated to it, This should be used after adding all tracks to a sprite
    @param {EndOfTrackAction} endaction What to do when sprite reaches the end of the track
    @param {int} startTrack The index of the tracks given to the Sprite using Add that you wish to start the Sprite on
    @param {int} step The number of positions along the track you wish to move the Sprite during each update
    @param {int} direction 1 travel from start to end, -1 travel from end to start
    @param {int} startposition Track index position to start at, you must check it's in range
    */
    TravelWithStep( endaction,  startTrack,  step,  direction,  startposition){
        this.#endAction = endaction;
        this._trackCurrent = startTrack;
        this._trackStep = step;
        this.direction = direction;
        this._trackPosition = (startposition == 0 || startposition === undefined) ? this.GetStartPosition : startposition;
        this.trackFractionalPos = this._trackPosition;
        this.stepMode = TrackStepMode.discreteStep;
        this.boss.updateMode = UpdateMode.autotrack;
        this.boss.position = this.boss.track.positionCurrent;
    }
    
    /**
     Sets sprite to move along the track at constant speed irrespective of the frame rate
    @param {EndOfTrackAction} endaction What to do when you reach end of track
    @param {int} startTrack The track to start at
    @param {float} speed The speed in pixels per second to move at
    @param {int} direction 1 for forward, -1 for backward
    @param {int} startPosition Track index position to start at, you must check it's in range
    */
    TravelWithSpeed( endaction,  startTrack,  speed,  direction,  startPosition){
        this.#pixelsPerSec  = Math.abs(speed);//make sure positive
        this.stepMode = TrackStepMode.pixelsPerSec;
        this.#endAction = endaction;
        this._trackCurrent = startTrack;
        this.direction = direction;
        if (startPosition == 0 || startPosition === undefined){
            this.trackFractionalPos = this._trackPosition = this.GetStartPosition;
        } else {
            this.trackFractionalPos = this._trackPosition = startPosition;
        }
        this.boss.updateMode = UpdateMode.autotrack;
        this.boss.position = this.boss.track.positionCurrent;
        this.#SetPreCalc();
    }
    
    /**
    @returns {vector3} Gets the current x, y and z position (game co-ordinates) along the current track
    You shouldn't really need this
    */
    get positionCurrent(){
        if (!this.interpolate){
            return  vector3.add(this.#tracklist[this._trackCurrent].trackDef.points[this._trackPosition],
                this.#tracklist[this._trackCurrent].offset);
        } else {
            let a = this.trackFractionalPos | 0;
            if (this.#endAction != EndOfTrackAction.wrap && this.#tracklist.length > 1 && a == this.#pointsCurrent - 1 ){
                return  vector3.add(this.#tracklist[this._trackCurrent].trackDef.points[a],
                    this.#tracklist[this._trackCurrent].offset);
            } else {
            let b = (a == this.#tracklist[this._trackCurrent].trackDef.points.length - 1) ? 0 : a + 1;
            let p = this.trackFractionalPos - a;
            //console.log(a + ":" + b + ":" + p);
            return vector3.add(vector3.lerp(this.#tracklist[this._trackCurrent].trackDef.points[a],
                this.#tracklist[this._trackCurrent].trackDef.points[b],
                p), this.#tracklist[this._trackCurrent].offset);
            }
        }
    }
    /**
     * @type {bool} if true then a position between 2 points will be interpolated for fractional movement
     * default is false so place only at existing track points
     */
    interpolate = false;
    /**
     Tries to locate a suitable position on the current track which is
    close to the position specified. If you want to jump from one track to another
    then you need to move to that track first then try this
    @param {vector3} position The 2d position to locate a point near
    @returns {{pos:vector3,trackpos:int}} 
    */
    TrackPositionNear(position){
        let pos = GetAPositionNear(position, this._trackCurrent);
        //set track position
        this.trackFractionalPos = pos.trackpos;
        this._trackPosition = pos.trackpos | 0;

        if (this.#instantmove)
            this.boss.position = this.boss.track.positionCurrent;

        return pos;
    }

    
    /**
     Tries to locate a suitable position on the current track which is
    close to the position specified. If you want to jump from one track to another
    then you need to move to that track first then try this
    @param {vector3} position The 2d position to locate a point near
    @param {int} trackNum The track number (its position in the sprites list) that you wish to attach to
    @returns {{pos:vector3,trackpos:int}}The Physical position along the track and the track position, 
    the W value holds the track position
    */
    GetAPositionNear(position, trackNum){
        let pos = {pos:vector3.zero,trackpos:0};
        let tempDistance = 0;
        //set start value
        let current = this.#tracklist[trackNum].trackDef.points[0];
        let shortestDistance = Math.abs(vector3.Distance(current, position));
        pos.trackpos = 0;

        for (let i = 1; i < this.#tracklist[trackNum].trackDef.points.length; i++)
        {
            tempDistance = Math.abs(vector3.distance(this.#tracklist[trackNum].trackDef.points[i], position));

            if (tempDistance < shortestDistance)
            {
                shortestDistance = tempDistance;
                current = this.#tracklist[trackNum].trackDef.points[i];
                pos.trackpos = i;
            }
        }
        pos.pos.x = current.x;
        pos.pos.y = current.y;
        pos.pos.z = current.z;
        return pos;
    }
    
    
    /**
     Tells you if you are at the start of the current track
    the start depends on direction travelling
    @return {bool} True means the sprite is at the start</value>
    */
    get AtStart() { return (this._trackPosition == this.GetStartPosition); }
    
    /**
     gets a value stating whether you are at the first position
    along a track
    @return {bool} True means at first point, false means not</value>
    */
    get AtPhysicalStart(){ return (this._trackPosition == 0); }
    
    /**
     gets a value stating whether you are at the last position
    along a track
    @return {bool} True means at last point, false means not</value>
    */
    get AtPhysicalEnd() { return (this._trackPosition == this.#tracklist[this._trackCurrent].trackDef.points.length - 1); }
    
    /**
     Tells you if you are at the end of the current track
    @return {bool} True means the sprite is at the end</value>
    */
    get AtEnd() { return (this._trackPosition == this.GetEndPosition); }
    
    /**
    Gets the position along the current track
    You shouldn't really need this
    @returns {int}
    */
    get TrackPosition() { return this._trackPosition; }
    /**
     sets the position along the current track
     * @param {int} value 
    */
    set TrackPosition(value) {
            this.trackFractionalPos = this._trackPosition = value;
            //CorrectTrack();
            this.#SetPreCalc();
        }
    /**
    Gets the step rate for the current track, how many positions to skip along
    The larger the step value the quicker the Sprite will appear to move.
    Try to create your tracks with lots of positions, this will then give you flexability
    when trying to decide on the step size
    @return {float} the higher the track step the faster the sprite will appear to move along the track</value>
    */
    get TrackStep() { return this._trackStep; }
    /**
    Sets the step rate for the current track, how many positions to skip along
    The larger the step value the quicker the Sprite will appear to move.
    Try to create your tracks with lots of positions, this will then give you flexability
    when trying to decide on the step size
    @param {float} value the higher the track step the faster the sprite will appear to move along the track</value>
    */
    set TrackStep(value) { this._trackStep = value; }

    
    /**
     gets the track name of the currently used track
    @returns {string}
    */
    get TrackName() { return this.#tracklist[this._trackCurrent].trackDef.Name; }
    
    /**
    @returns {int} Gets the start index position on the current track based on the direction travelling
    */
    get GetStartPosition(){
        if (this.direction > 0)
            return 0;
        else
            return this.#tracklist[this._trackCurrent].trackDef.points.length - 1;
    }

    /**
    @returns {int} gets the end index position on the current track based on the direction travelling
    */
    get GetEndPosition(){
        if (this.direction > 0)
            return this.#tracklist[this._trackCurrent].trackDef.points.length - 1;
        else
            return 0;
    }

    
    /** Move forward along the current track */
    PositionForward(){
        this.trackFractionalPos += this._trackStep * this.direction;
        this._trackPosition = this.trackFractionalPos | 0;
        this.CorrectTrack();
        if (this.instantmove)
            this.boss.position = this.boss.track.positionCurrent;
    }

    
    /** Move backward along the current track */
    PositionBackward(){
        this.trackFractionalPos -= this._trackStep * this.direction;
        this._trackPosition = this.trackFractionalPos | 0;
        this.CorrectTrack();
        if (this.instantmove)
            this.boss.position = this.boss.track.positionCurrent;
    }

    
    /** Moves to the first position on the track */
    PositionFirst(){
        this.trackFractionalPos = 0;
        this._trackPosition = this.trackFractionalPos | 0;
        if (instantmove)
            this.boss.position = this.boss.track.positionCurrent;
    }

    
    /** moves to the last position on the track*/
    PositionLast(){
        this.trackFractionalPos = this.#tracklist[this._trackCurrent].trackDef.points.length - 1;
        this._trackPosition = this.trackFractionalPos | 0;
        if (instantmove)
            this.boss.position = this.boss.track.positionCurrent;

    }

    
    /** moves to the next track associated with this sprite */
    TrackNext(){
        if (this.#tracklist.length != 0)
        {
            this._totalTravelled++;
            this.lastTrackWas = this._trackCurrent;

            this._trackCurrent = (++this._trackCurrent % this.#tracklist.length);
            //in case we have moved track
            this.#SetPreCalc();
            this.AttemptToAutoUndraw(true);
        }
        else
            throw new ArgumentOutOfRangeException("No tracks defined for this sprite");
    }

    
    
    /** @type {int} holds the track index number of the last track prior to changing it */
    lastTrackWas;
    
    /** @type {bool} specifies if a track us currently being drawn */
    drawing;
    
    /** @type {LineData} holds the line style set so when we draw next track automatically we can use the same style */
    lastLineStyle;
    
    /** @type {int} holds the number of lines specified when drawing automatically so we can use the same number automatically */
    lastNumberOfLinesDrawn;
    /** @type {bool} if true the trackmanager will ensure tracks are displayed and hidden automatically as they are used by the sprite*/
    #autoShowHide = false;
    /** @returns {bool} if true the trackmanager for the sprite will automatically draw and remove tracks as the sprite uses them*/
    get AutoShowHide(){ return this.#autoShowHide; }
    /** @param {bool} if true the trackmanager for the sprite will automatically draw and remove tracks as the sprite uses them */
    set AutoShowHide(value){
        this.#autoShowHide = value;
        //force pre-calc to ensure track is being shown properly ???
        //if (value)
        //    this.#SetPreCalc();
    }

    /**
     attempts to replace a track at the position given with a new track definition
    @param {TrackDefinition} td track to use
    @param {int} position position of track to remove
    */
    ReplaceTrack(td, position){
        position = (position === undefined) ? position : 0;

        if (td != null && td.points.length > 0)
        {
            if (position >= 0 && position < this.#tracklist.length)
            {
                DrawTrackNoMore(position);
                this.#tracklist[position] = new Track(td);
            }
            else
                this.#tracklist.push(new Track(td));
        }
        else
            throw new ArgumentException("Track definition is either Null or has no points");
    }
    
    /**
    stops the engine drawing the given track
    @param {int} trackNumber the track number of this track manager to remove, if not defined current track selected
    */
    DrawTrackNoMore( trackNumber){
        trackNumber = (trackNumber === undefined) ? trackNumber : this._trackCurrent;
        this.boss.engM.LineRemoveOwners(new OwnerInfo(boss.ID, trackNumber));
        drawing = false;
    }
    
    /**
    moves to the previous track associated with this sprite
    */
    TrackPrevious(){
        if (this.#tracklist.length != 0)
        {
            this._totalTravelled++;
            this.lastTrackWas = this._trackCurrent;

            this._trackCurrent--;
            if (_trackCurrent < 0)
                this._trackCurrent = this.#tracklist.length - 1;
            this.#SetPreCalc();
            this.AttemptToAutoUndraw(true);
        }
        else
            throw new ArgumentOutOfRangeException("No tracks defined for this sprite");
    }

    
    /**
    sets the update interval for track re-positioning
    @param {float} interval time in seconds before moving to next position on the track
    */
    UpdateIntervalSet(interval){
        this._updateTimer.Interval(interval);
    }

    
    /**
     Corrects any over steps and performs requested action
    @returns {bool} true if at end of track
    */
    CorrectTrack(){
        let retVal = false;
        
        //capture current track number before changing it
        this.lastTrackWas = this._trackCurrent;

        //int diff = 
        if (this._trackPosition >= this.#tracklist[this._trackCurrent].trackDef.points.length ||
            this._trackPosition < 0)
        {
            let frac;
            switch (this.#endAction)
            {
                case EndOfTrackAction.detach:
                    this.Detach();
                    this.AttemptToAutoUndraw(false);
                    break;
                case EndOfTrackAction.kill:
                    this.trackFractionalPos = this._trackPosition = 0;
                    this.boss.UpdateAs = UpdateMode.none;
                    this.boss.Kill();
                    this.AttemptToAutoUndraw(false);
                    break;
                case EndOfTrackAction.next:
                    this._totalTravelled++;

                    //capture current track number before changing it
                    //this.lastTrackWas = this._trackCurrent;

                    this._trackCurrent = (++this._trackCurrent % this.#tracklist.length);
                    //attempt tp get fraction
                    frac = this.trackFractionalPos - (this.trackFractionalPos |0);
                    frac = (frac < 0) ? 1 + frac : frac;

                    this.trackFractionalPos = (this.direction < 0 ) ? 1- frac : frac;

                    this.trackFractionalPos += this._trackPosition = this.GetStartPosition;
                    this._trackPosition = this.trackFractionalPos | 0;
                    //correction to stop interpolation between distant tracks
                    //if (this.interpolate) this.trackFractionalPos = this._trackPosition;
                    //end of new code
                    this.#SetPreCalc();
                    retVal = true;
                    this.AttemptToAutoUndraw(true);
                    break;
                case EndOfTrackAction.random:
                    this._totalTravelled++;

                    this._trackCurrent = ranBetween(0, this.#tracklist.length);
                    //attempt tp get fraction
                    frac = this.trackFractionalPos - (this.trackFractionalPos |0);
                    frac = (frac < 0) ? 1 + frac : frac;

                    this.trackFractionalPos = (this.direction < 0 ) ? 1- frac : frac;

                    this.trackFractionalPos += this._trackPosition = this.GetStartPosition;
                    
                    this._trackPosition = this.trackFractionalPos | 0;
                    //correction to stop interpolation between distant tracks
                    //if (this.interpolate) this.trackFractionalPos = this._trackPosition;
                    //end of new code
                    this.#SetPreCalc();
                    retVal = true;
                    this.AttemptToAutoUndraw(true);
                    break;
                case EndOfTrackAction.reverse:
                    this._totalTravelled++;

                    //attempt tp get fraction
                    frac = this.trackFractionalPos - (this.trackFractionalPos |0);
                    frac = (frac < 0) ? 1 + frac : frac;

                    this.trackFractionalPos = (this.direction < 0 ) ?  frac : frac - 1;
                    this.direction *= -1;

                    this.trackFractionalPos += this._trackPosition = this.GetStartPosition;
                    this._trackPosition = this.trackFractionalPos | 0;
                    //correction to stop interpolation between distant tracks
                    //if (this.interpolate) this.trackFractionalPos = this._trackPosition;
                    //end of new code
                    this.#SetPreCalc();
                    retVal = true;
                    break;
                case EndOfTrackAction.wrap:
                    this._totalTravelled++;

                    //this._trackCurrent = (++this._trackCurrent % this.#tracklist.length);
                    //attempt tp get fraction
                    frac = this.trackFractionalPos - (this.trackFractionalPos |0);
                    frac = (frac < 0) ? 1 + frac : frac;
                    this.trackFractionalPos = (this.direction < 0 ) ? 1- frac : frac;
                    this.trackFractionalPos += this._trackPosition = this.GetStartPosition;

                    this._trackPosition = this.trackFractionalPos | 0;
                    this.#SetPreCalc();
                    retVal = true;
                    break;
                case EndOfTrackAction.stop:
                    this._totalTravelled++;
                    this.trackFractionalPos = this._trackPosition = GetEndPosition;
                    TrackStep = 0;
                    pixelsPerSec = 0;
                    this.#SetPreCalc();
                    retVal = true;
                    break;
            }
            //if (OnEndOfTrack != null)
            //    OnEndOfTrack(boss);
            Engine.processCallback(this.#callbackEOT);//EndOfTrackCallBack);
            //if (this.EndOfTrackCallBack != null) EndOfTrackCallBack();
        }//end of if to check for end

        //check for dirtyness of track when drawing
        //if it is then we need to remove a track and re-draw it!
        if (this.#tracklist[this._trackCurrent].isDirty && drawing)
        {
            this.AttemptToAutoUndraw(true);
        }
        return retVal;
    }

    
    /**
    Perform the update of the Sprite's position using the current track settings
    This is called by the Sprites Update method there is no need to call this yourself
    */
    update(){
        for(let p = 0 ; p < this.#tracklist.length; p++){
            this.#tracklist[p].clean();
        }
        //for updating purposes
        let currentPosition = this._trackPosition;
        //needs timer interval expiration
        if ((this.stepMode == TrackStepMode.discreteStep) && this._updateTimer.elapsedResetAccrued)
        {
            this.trackFractionalPos += this._trackStep * this.direction;
        }
        else
        {
            //keep track of total point distance
            this.trackFractionalPos += this.#pixelsPerSecPreCalc * Engine.delta;//EngineManager.enginePeriod;
        }
        this._trackPosition = this.trackFractionalPos | 0;
        //Have we moved position (or changed track)
        return this.CorrectTrack() || (currentPosition != this._trackPosition);
    }//Update

    
    //THIS CAN@T POSSIBLY WORK
    // /**
    // works out the number of trackposition between the two track positions given
    // @param {} start the start position of the track
    // @param {} end the position to move towards
    // @param {} numberOfPoints number of points in the track
    // @param {} direction direction of travel +ve is forwards -ve is backwards
    // @returns {int} the number of trackpositions between these points
    // */
    // static int TrackDistance(int start, int end, int numberOfPoints, float direction){
    //    if (start != end)
    //    {
    //        int distance = 0;
    //        int step = 1;
    //        if (direction < 0) step = -1;
    //        while (start != end)
    //        {
    //            start = start + step;
    //            //check for wrap round track
    //            if (start < 0) start = numberOfPoints - 1;
    //            else if (start == numberOfPoints) start = 0;
//
    //            distance++;
    //        }
    //        return distance;
    //    }
    //    else return 0;
    //}
}
/**
 * @classdesc describes a track which comprises a trackdefintion and offset information,
 * allowing the same track to be used for multiple sprites with different offsets
 */
class Track{
    /** 
     * unique id created for every track used?
    */
    static trackId = 0;
    /**
     * @returns {vector3} The offset to displace the original track positions by
     * This can be used to make use of the shape of a pre-defined track
     * but starting at a different position to its original definition
    */
    get offset(){ return this.#offset; }
    /**
     * @param {vector3} value The offset to displace the original track positions by
     * This can be used to make use of the shape of a pre-defined track
     * but starting at a different position to its original definition
    */
    set offset(value){
        //set dirty if value has changed
        if (value != this.#offset)
            this.dirtyMe = true;
        this.#offset = value;
    }

    /** @type {vector3} holds the offset for this track */
    #offset = vector3.zero;
    /** @type {TrackDefinition} holds a reference to the raw track data being used */
    trackDef;
    /** @type {bool} specifies whether track should be drawn or not*/
    visible = false;
    /** @type {bool} specifies whether the track definition is designated as moving*/
    moving = false;
    /** 
     * Constructs a new track manager track from given track definition with an offset
     * @param {TrackDefinition} trackDef The track definition to add to the track manager
     * @param {vector3} offset The 3d displacement to apply to this track, zero if omitted
    */
    constructor(trackDef, offset){
        offset = (offset === undefined) ? vector3.zero : offset;
        this.trackDef = trackDef;
        this.#offset = offset;
    }
    /** @type {bool} specifed true if the offset has been changed*/
    #dirtyMe = false;

    /** @returns {bool} gets (resetting in the process) the dirty status of a track */
    get isDirty() { return this.#dirtyMe;}//return this.trackDef.isdirty || this.isMeDirty; }
    /** @param {bool} value  sets the dirty */
    set isDirty(value) { this.#dirtyMe = value;}//return this.trackDef.isdirty || this.isMeDirty; }
    /** marks the track as not dirty */
    clean(){this.#dirtyMe = false;}
    /** @returns {bool} get the dirty status of the track, when reading this is reset*/
    get isMeDirty(){
        if (this.#dirtyMe){
            this.#dirtyMe = false;
            return true;
        }
        return this.#dirtyMe;
    }
    /** @param {bool} value set the dirty status of the track, when reading this is reset*/
    set isMeDirty(value){
        this.#dirtyMe = value;
    }
}
/**
 * @classdesc holds a collection of points that are used by the track manager
 * to direct sprites along pre-described paths
 */
class TrackDefinition{
    /** @type {vector3[]} a collection of points */
    points = [];
    /** @type {string} An internal name only used for debugging purposes*/
    name;
    /** @type {int}  the length of the track in pixels */
    length;
    /** @type {int} pre calculate value giving us the ratio of points to length for velocity calculations during the TrackManager update*/
    pointsOverlength;
}
/** 
* @classdesc holds information about portions of point based tracks
*/
class WayPoint{
    /** @type {float} the x step in unit terms as proportion of distance*/
    xstep;
    /** @type {float} the y step in unit terms as proportion of distance*/
    ystep;
    /** @type {float} the z step in unit terms as proportion of distance*/
    zstep;
    /** @type {float} the distance (by pythagorus of this WayPoint*/
    distance;
    /** @type {vector3} start point*/
    start;
    /** @type {vector3} end point*/
    end;
    
    /** 
    * quick constructor
    * @param {vector3} start start of waypoint
    * @param {vector3} end end of wapoint
    * @param {float} xs stepping for waypoint
    * @param {float} ys stepping for waypoint
    * @param {float} zs stepping for waypoint
    * @param {float} dist distance for this waypoint
    */
    constructor( start,  end,  xs,  ys,  zs,  dist)
    {
        this.xstep = xs;
        this.ystep = ys;
        this.zstep = zs;
        this.distance = dist;
        this.start = start;
        this.end = end;
    }
}
/**
 * @classdesc provides methods for creating and manipulating tracks
 */
class TrackHelper{

    /** 
     * Calculates the speed required to traverse a specified track in the timeperiod given
     * @param {TrackDefinition} track The track to traverse
     * @param {float} timePeriod The time you want to take moving along the track
     * 
     * @returns {float} The speed required in pixels per second
    */
    static SpeedForTime(track, timePeriod){
        return track.length / timePeriod;
    }

    /** 
     * Takes an existing track definition and copies it creating a new track
     * @param {TrackDefinition} existingTrack The existing track to clone
     * @param {string} newTrackName The debug name of the new track
     * @returns {TrackDefinition}The newly cloned track definition
    */
    static Clone(existingTrack, newTrackName){
        let newTrack = new TrackDefinition();
        newTrack.closed = existingTrack.closed;
        let p = 0;
        while (p < existingTrack.points.length)
            newTrack.points.push(existingTrack.points[p++].clone);
        TrackHelper.Getlength(newTrack);

        return newTrack;
    }

    /** 
     * Determines the length of the track in pixels and also pre-calculates
     * the ratio points/length for update calculations
     * @param {TrackDefinition} newTrack track definition to approximate the length of
    */
    static Getlength(newTrack){
        let vec;
        newTrack.length = 0;
        for (let j = 0; j < newTrack.points.length - 1; j++){
            vec = vector3.sub(newTrack.points[j + 1], newTrack.points[j]);
            newTrack.length += vec.length;
        }
        newTrack.pointsOverlength = newTrack.points.length / newTrack.length;
    }

    /** 
     * NOT IMPLEMENTED YET defines a track from an image supplied in a texture.
     * The image MUST NOT use Anti-Aliasing
     * @param {image} texture The texture containg a track
     * @param {Rectangle} region the portion of the texture to find the track in
     * @param {string} newTrackName the name to give the generated track
     * @returns {TrackDefinition} the newly created track
    */
    static FromTexture(texture, region,newTrackName){
        return null;
    }

    /** 
     * Creates a track with only the points specified
     * @param {string} newTrackName The debug name to give to the track
     * @param {vector3[]} points The List vector3 of the points you want
     * @returns {TrackDefinition} the newly created track
     * Use this to move a sprite to fixed positions
    */
    static Rawpoints(newTrackName, points){
        let newTrack = new TrackDefinition();
        newTrack.points = points;
        newTrack.name = newTrackName;
        TrackHelper.Getlength(newTrack);
        return newTrack;
    }

    /** 
     * Creates a smoothed off track based on the points given.
     * As this is a Beizer curve the points at the ends as control points bounding the curve
     * @param {string} newTrackName The debug name to give the track
     * @param {int} numberOfpoints The number of points to give the track
     * @param {vector3[]} points The List vector3 of the points you want to create the track from
     * @returns {TrackDefinition} the newly created track
    */
    static Smooth(newTrackName,  numberOfpoints, points){
        let newTrack = new TrackDefinition();
        newTrack.name = newTrackName;
        let i = 0;
        let step = 1 / numberOfpoints;
        let mu = 0;
        for (i = 0; i < numberOfpoints; i++){
            newTrack.points.push(Bezier(points, points.length - 1, mu));
            mu += step;
        }
        TrackHelper.Getlength(newTrack);
        return newTrack;
    }

    /** 
     * Generates a new smooth track from the specified track, 
     * @param {TrackDefinition} existingTrack The track you want to use
     *  for the control points of the smoother
     * @param {int} numberOfpoints The number of points to use on the track
     * @param {string} newTrackName The debug name to give the new track
     * @returns {TrackDefinition}  the newly created track
     * Be sure not to use tracks with too many points, only use those that were added using Rawpoints
    */
    static CloneSmooth(existingTrack, numberOfpoints, newTrackName){
        let newTrack = new TrackDefinition();
        newTrack.name = newTrackName;
        let i = 0;
        let step = 1 / numberOfpoints;
        let mu = 0;
        for (let i = 0; i < numberOfpoints; i++){
            newTrack.points.push(Bezier(existingTrack.points, existingTrack.points.length - 1, mu));
            mu += step;
        }
        TrackHelper.Getlength(newTrack);
        return newTrack;
    }

    /** 
     * Creates a smooth track than joins to its start from the points given using Catmull-Rom interpolatio
     * @param {String} newTrackName The name of the track created
     * @param {int} pointsPerStep How many points to smoothly generate between each point in the original list
     * @param {[]vector3} basepoints the list of points that the curve will go through
     * @returns {TrackDefinition}  
    */
    static CatmullRomClosed( newTrackName, pointsPerStep, basepoints){

        //TODO GOT TO GET START POSITION CORRECT (STARTS AT 2ND POINT)
        let newTrack = new TrackDefinition();
        newTrack.name = newTrackName;
        //append first 3 points so we can close the loop with control points
        basepoints.Insert(0, basepoints[basepoints.length - 1]);
        basepoints.push(basepoints[1]);
        basepoints.push(basepoints[2]);
        //basepoints.push(basepoints[2]);

        for (let i = 1; i < basepoints.length - 2; i++){
                part = InterpolateCR(pointsPerStep,
                                    basepoints[i - 1],
                                    basepoints[i],
                                    basepoints[i + 1],
                                    basepoints[i + 2]);
            newTrack.points.push(part);
        }
        newTrack.points = newTrack.points.flat();

        //add the first point in at the end
        //newTrack.points.push(newTrack.points[0]);

        //add the first point in at the end
        //remove the 3 extra points added
        basepoints.RemoveRange(basepoints.length - 2, 2);
        basepoints.RemoveAt(0);
        TrackHelper.Getlength(newTrack);
        return newTrack;
    }
        // WAITING FOR CATMULL ROM
        //** 
        //* creates a position along a CatmullRom interpolation
        //* @param {*} v1 
        //* @param {*} v2 
        //* @param {*} v3 
        //* @param {*} v4 
        //* @param {*} amount what position along spline
        //* @returns {vector3}
        //*/
        //static vector3 CR3D(ref vector3 v1, ref vector3 v2, ref vector3 v3, ref vector3 v4, float amount)
        //{
        //    vector3 result =  vector3.zero;
        //    result.x = MathHelper.CatmullRom(v1.x, v2.x, v3.x, v4.x, amount);
        //    result.y = MathHelper.CatmullRom(v1.y, v2.y, v3.y, v4.y, amount);
        //    result.z = MathHelper.CatmullRom(v1.z, v2.z, v3.z, v4.z, amount);
        //    return result;
        //}
//
        //** 
        //* creates a smooth Catmull-Rom line along the points given
        //* @param {string} newTrackName The name to give to the new track
        //* @param {[]vector3} pointsPerStep How many points to smoothly generate between each point in the original list
        //* @param {*} basepoints The list of control points we want to go through
        //* @returns {TrackDefinition}  A new track with nice smooth paths
        //*/
        // static TrackDefinition CatmullRomOpen(String newTrackName, int pointsPerStep, List<vector3> basepoints)
        //{
        //    let newTrack = new TrackDefinition();
        //    newTrack.name = newTrackName;
        //    //needs work to get the correct steps to even out across all points
        //    //this will not be correct to start with unless factors work out
        //    //int steps = numberOfpoints / basepoints.length;
//
        //    //create extra start and end as control points
        //    vector3 startPoint = new vector3();
        //    vector3 endPoint = new vector3();
        //    startPoint = basepoints[0] - (basepoints[0] - basepoints[1]);
        //    endPoint = basepoints[basepoints.length - 1] + (basepoints[basepoints.length - 1] - basepoints[basepoints.length - 2]);
        //    //add new start and end but remember to remove afterwork
        //    basepoints.Insert(0, startPoint);
        //    basepoints.push(endPoint);
//
        //    for (let i = 1; i < basepoints.length - 2; i++)
        //    {
        //        List<vector3> part = InterpolateCR(pointsPerStep,
        //                                basepoints[i - 1],
        //                                basepoints[i],
        //                                basepoints[i + 1],
        //                                basepoints[i + 2]);
        //        newTrack.points.AddRange(part);
        //    }
//
//
        //    //remove last and first points - the ones we added
        //    basepoints.RemoveAt(basepoints.length - 1);
        //    basepoints.RemoveAt(0);
        //    TrackHelper.Getlength(newTrack);
        //    return newTrack;
        //}

        //** 
        //* generates points between four outlying control points
        //* @param {*} detail 
        //* @param {*} v1 
        //* @param {*} v2 
        //* @param {*} v3 
        //* @param {*} v4 
        //* @returns {vector3[]}
        //*/
        //static List<vector3> InterpolateCR(int detail, vector3 v1, vector3 v2, vector3 v3, vector3 v4)
        //{
        //    List<vector3> list = new List<vector3>();
        //    for (let i = 0; i < detail; i++)
        //    {
        //        list.push(CR3D(ref v1,ref v2,ref v3,ref v4, (float)i/(float)detail));
        //    }
        //    list.push(v3);
        //    return list;
        //}

        //** 
        //* Produces a generalised beizer curve using the points given as control points
        //* @param {*} p control points
        //* @param {*} n number of points
        //* @param {*} mu mu is position along the curve 0 is start, 1 is end
        //* @returns {vector3} Returns point on curve
        //*/
        //static vector3 Bezier(List<vector3> p, int n, float mu)
        //{
        //    int k, kn, nn, nkn;
        //    float blend, muk, munk;
        //    vector3 b =  vector3.zero;
//
        //    muk = 1;
        //    munk = (float)Math.Pow((double)(1 - mu), (double)n);
//
        //    for (k = 0; k <= n; k++)
        //    {
        //        nn = n;
        //        kn = k;
        //        nkn = n - k;
        //        blend = muk * munk;
        //        muk *= mu;
        //        munk /= (1 - mu);
        //        while (nn >= 1)
        //        {
        //            blend *= nn;
        //            nn--;
        //            if (kn > 1)
        //            {
        //                blend /= kn;
        //                kn--;
        //            }
        //            if (nkn > 1)
        //            {
        //                blend /= nkn;
        //                nkn--;
        //            }
        //        }
        //        b.x += p[k].x * blend;
        //        b.y += p[k].y * blend;
        //        b.z += p[k].z * blend;
        //    }
//
        //    return (b);
        //}



    /** 
     * Creates a track based on a sequence of points, you 
     * set them the same for a level track
     * @param {string} newTrackName The debug name of the track to create
     * @param {int} numberOfpoints How many points you want the entire track to contain
     * (they are distributed along the entire track length, the more points the more flexability you have with 
     * speeds travelling along the path
     * @param {[]vector3]} points a list of points defining the fixed position along the track
     * @returns {TrackDefinition}  the newly created track you can use this to make specific paths for sprites to follow
    */
    static points(newTrackName, numberOfpoints, points){
        let newTrack = new TrackDefinition();
        newTrack.name = newTrackName;
        // a new point for holding the points as they are created
        let newPoint = vector3.zero;

        let totalDistance = 0;
        let distThisSpan = 0;//holds distance for current space
        span = [];//holds distance for each span
        for (let j = 0; j < points.length - 1; j++){
            //work out the length of each line using pythagorus
            let xd = points[j + 1].x - points[j].x;
            let yd = points[j + 1].y - points[j].y;
            let zd = points[j + 1].z - points[j].z;
            distThisSpan = Math.sqrt(xd * xd + yd * yd + zd * zd);
            span.push(new WayPoint(points[j], points[j + 1],
                xd, yd, zd, distThisSpan));
            totalDistance += distThisSpan;
        }

        let sectionDistance = 0;
        let step = (totalDistance / numberOfpoints);
        let percent = 0;
        let section = 0;
        for (let pos = 0; pos < numberOfpoints - 1; pos++){
            //calculate co-ordinates from this section
            percent = sectionDistance / span[section].distance;
            newPoint = vector3.zero;
            newPoint.x = span[section].start.x + span[section].xstep * percent;
            newPoint.y = span[section].start.y + span[section].ystep * percent;
            newPoint.z = span[section].start.z + span[section].zstep * percent;
            newTrack.points.push(newPoint);
            //travelDistance += step;
            sectionDistance += step;
            //skip to next section if we have out run this one
            while (sectionDistance > span[section].distance)
            {
                sectionDistance -= span[section].distance;
                section++;
            }

        }
        //generate last point
        percent = sectionDistance / span[section].distance;
        newPoint = new vector3();
        newPoint.x = span[section].start.x + span[section].xstep * percent;
        newPoint.y = span[section].start.y + span[section].ystep * percent;
        newPoint.z = span[section].start.z + span[section].zstep * percent;
        newTrack.points.push(newPoint);
        TrackHelper.Getlength(newTrack);
        return newTrack;
    }//AddTrackFrompoints(int numberOfpoints, List<vector3> points)


    /** 
     * Generates a track with a number of points overriding the z value
     * @param {string} newTrackName The debug name of the track
     * @param {int} numberOfpoints How many points you want the entire track to contain
     * (they are distributed along the entire track length, the more points the more flexability you have with 
     * speeds travelling along the path
     * @param {[]vector3} points The points which define the track
     * @param {float} forcedZ The z value to set all the points to
     * @returns {TrackDefinition}  the newly created track
    */
    static pointsForceZ(newTrackName, numberOfpoints, points, forcedZ){

        let newTrack = new TrackDefinition();
        newTrack.name = newTrackName;
        // a new point for holding the points as they are created
        newPoint = vector3.zero;

        //let zStep = (frontZ - backZ) / numberOfpoints;
        let totalDistance = 0;
        let distThisSpan = 0;//holds distance for current space
        let span = [];//holds distance for each span
        for (let j = 0; j < points.length - 1; j++){
            //work out the length of each line using pythagorus
            let xd = points[j + 1].x - points[j].x;
            let yd = points[j + 1].y - points[j].y;
            distThisSpan = Math.sqrt(xd * xd + yd * yd);
            span.push(new WayPoint(points[j], points[j + 1],
                xd, yd, 0, distThisSpan));
            totalDistance += distThisSpan;
        }

        //let travelDistance = 0;
        let sectionDistance = 0;
        let step = (totalDistance / numberOfpoints);
        let percent = 0;
        let section = 0;
        for (let pos = 0; pos < numberOfpoints - 1; pos++){
            //calculate co-ordinates from this section
            percent = sectionDistance / span[section].distance;
            newPoint = new vector3();
            newPoint.x = span[section].start.x + span[section].xstep * percent;
            newPoint.y = span[section].start.y + span[section].ystep * percent;
            newPoint.z = forcedZ;
            newTrack.points.push(newPoint);
            //travelDistance += step;
            sectionDistance += step;
            //skip to next section if we have out run this one
            while (sectionDistance > span[section].distance)
            {
                sectionDistance -= span[section].distance;
                section++;
            }

        }
        //generate last point
        percent = sectionDistance / span[section].distance;
        newPoint = new vector3();
        newPoint.x = span[section].start.x + span[section].xstep * percent;
        newPoint.y = span[section].start.y + span[section].ystep * percent;
        newPoint.z = forcedZ;
        newTrack.points.push(newPoint);

        TrackHelper.Getlength(newTrack);
        return newTrack;
    }

    /** 
     * creates a sinewave with a rotating z component 
     * this will allow ever changing circular Z values that can be used for scaling effects
     * or just to add nice parallax effects
     * @param {string} trackName The debug name to give the track
     * @param {int} numberOfpoints How many points to place in the final track
     * @param {float} start The right hand X position of the sine wave
     * @param {float} end The left hand X position of the sine wave
     * @param {float} waveAmplitude The amplitude (the vertical size) of the wave
     * @param {float} waveFrequency The number of cycles of the sine wave you want
     * @param {float} waveStartAngle The phase (angle) to start sine wave at in radians - 
     * use MathHelper.ToRadians(45) to specify value in degrees
     * @param {float} waveDirection specify either 1 or -1
     * @param {float} centreHeight The central height of the wave form
     * @param {float} helixAmplitude The amplitude of the Z value (depth movement front to back)
     * @param {float} helixPhaseOffset altering this effects where the track is furthest away. Leave as 0 unless you want to experiment
     * @param {float} helixRadialDirection specify either 1 or -1
     * @returns {TrackDefinition}  the newly created track
     * @example
     * let t = TrackHelper.AddHelixTrack("helix", 400, 830, -30, 80, 2, 0, 1, 300, 80, 0, 1);
    */
        static Helix(trackName, numberOfpoints, start, end, waveAmplitude,
                                waveFrequency, waveStartAngle, waveDirection, centreHeight,
                                helixAmplitude, helixPhaseOffset, helixRadialDirection){
        //will hold the track we are creating
        let newTrack = new TrackDefinition();
        newTrack.name = trackName;
        // a new point for holding the points as they are created
        let newPoint = vector3.zero;

        if (numberOfpoints > 65535) numberOfpoints = 65535;

        let radStep = (Math.PI * 2 * waveFrequency / (numberOfpoints - 1) * waveDirection);
        let helixStep = (Math.PI * 2 * waveFrequency / (numberOfpoints - 1) * helixRadialDirection);
        let helixrad = waveStartAngle + helixPhaseOffset;

        let rad = waveStartAngle;

        let x = start;
        let xStep = (end - start) / (numberOfpoints - 1);

        for (let j = 0; j < numberOfpoints - 1; j++){
            newPoint = new vector3();
            newPoint.x = x;
            newPoint.y = (waveAmplitude * Math.sin(rad) + centreHeight);
            newPoint.z = (helixAmplitude * Math.cos(helixrad));
            x += xStep;
            rad += radStep;
            helixrad += helixStep;
            newTrack.points.push(newPoint);
        }
        //add last point
        newPoint = new vector3();
        newPoint.x = x;
        newPoint.y = (waveAmplitude * Math.sin(rad) + centreHeight);
        newPoint.z = (helixAmplitude * Math.cos(helixrad));
        newTrack.points.push(newPoint);

        TrackHelper.Getlength(newTrack);
        return newTrack;
    }

    /** 
     * Creates a simple sineWave shape
     * Use AddHelixTrack if you want something that varies the Z position along the track
     * @param {string} newTrackName The name to give the track
     * @param {int} numberOfpoints How many points to place in the final track
     * @param {float} start The right hand X position of the sine wave
     * @param {float} end The left hand X position of the sine wave
     * @param {float} waveAmplitude The amplitude (the vertical size) of the wave
     * @param {float} waveFrequency The number of cycles of the sine wave you want, 
     * you can use 0.5f to generate half a sine wave
     * @param {float} centreHeight The central height of the wave form
     * @param {float} depth the Z position of the sine wave track
     * @returns {TrackDefinition}  the newly created track
     * @example
     * let t = TrackHelper.AddSineWaveTrack("Sine", 100, 800, 0, 200, 0.25f, 300,100);
    */
    static SineWaveSimple(newTrackName, numberOfpoints,
        start,
        end,
        waveAmplitude,
        waveFrequency,
        centreHeight,
        depth){
        //will hold the track we are creating
        let newTrack = new TrackDefinition();
        newTrack.name = newTrackName;
        // a new point for holding the points as they are created
        let newPoint = vector3.zero;

        if (numberOfpoints > 65535) numberOfpoints = 65535;

        let radStep = (Math.PI * 2 * waveFrequency / (numberOfpoints - 1));
        let rad = 0;

        let x = start;
        let xStep = (end - start) / (numberOfpoints - 1);

        //            ReDim myTrack(numpoints)
        for (let j = 0; j < numberOfpoints - 1; j++){
            newPoint = new vector3();
            newPoint.x = x;
            newPoint.y = (waveAmplitude * Math.sin(rad) + centreHeight);
            newPoint.z = depth;
            x += xStep;
            rad += radStep;
            newTrack.points.push(newPoint);
        }
        //add last point
        newPoint = new vector3();
        newPoint.x = x;
        newPoint.y = (waveAmplitude * Math.sin(rad) + centreHeight);
        newPoint.z = depth;
        newTrack.points.push(newPoint);

        TrackHelper.Getlength(newTrack);
        return newTrack;

    }//AddSineWaveTrack(int numberOfpoints, start, end, waveAmplitude, waveFrequency, centreHeight, depth)


    /** 
     * moves a track in the X, y and z positions specified
     * @param {TrackDefinition} existingTrack The track definition to translate
     * @param {float} x the amount in the x direction to move the track
     * @param {float} y the amount in the y direction to move the track
     * @param {float} z the amount in the z direction to move the track
    */
    static Translate(existingTrack,  x,  y,  z){
        TrackHelper.Translate(existingTrack, new vector3(x, y, z));
    }
    /** 
     * moves a track in the x, y and z positions specified in the vector3 value, adjust all positions in the track
     * @param {TrackDefinition} existingTrack The track definition to translate
     * @param {vector3} translation A vector3 value containing the x, y and z movements for track
    */
    static Translate(existingTrack, translation){
        let p = 0;

        while (p < existingTrack.points.length){
            existingTrack.points[p] += translation;
            p++;
        }
    }
    /** 
     * scales a specific track around the origin given
     * @param {TrackDefinition} existingTrack The track definition to rotate
     * @param {vector3} origin The rotational centre
     * @param {float} x The scale factor for x axis
     * @param {float} y The scale factor for y axis
     * @param {float} z The scale factor for z axis
    */
    static  Scale(existingTrack, origin,  x,  y,  z){
        let p = 0;
        let rotMatrix = Matrix.CreateTranslation(-origin) *
                            Matrix.CreateScale(new vector3(x, y, z)) *
                            Matrix.CreateTranslation(origin);

        while (p < existingTrack.points.length){
            existingTrack.points[p] = vector3.Transform(existingTrack.points[p], rotMatrix);
            p++;
        }
    }
    /** 
     * Rotates the supplied track around an arbitrary point, by the angles given
     * @param {TrackDefinition} existingTrack The track definition to rotate
     * @param {vector3} origin The rotational centre
     * @param {float} angleX The rotation in degrees around the X axis
     * @param {float} angleY The rotation in degrees around the Y axis
     * @param {float} angleZ The rotation in degrees around the Z axis
     * You should ideally rotate around each axis separately
    */
    static Rotate(existingTrack, origin,  angleX,  angleY,  angleZ){
        let p = 0;
        let rotMatrix = Matrix.CreateTranslation(-origin) *
                            Matrix.CreateRotationX(MathHelper.ToRadians(angleZ)) *
                            Matrix.CreateRotationY(MathHelper.ToRadians(angleY)) *
                            Matrix.CreateRotationZ(MathHelper.ToRadians(angleX)) *
                            Matrix.CreateTranslation(origin);

        while (p < existingTrack.points.length){
            existingTrack.points[p] = vector3.Transform(existingTrack.points[p], rotMatrix);
            p++;
        }
        existingTrack.Dirty();
    }//TrackRotate

    /** 
     * Rotates a track around a central position by the given angles specifed
     * @param {TrackDefinition} existingTrack The name of the track to rotate
     * @param {vector3} origin the centre of rotation
     * @param {vector3} angles the x, y and z axis rotation amounts specified as a vector3
     * You should ideally rotate around each axis separately
    */
    static Rotate(existingTrack, origin, angles){
        let p = 0;
        let rotMatrix = Matrix.CreateTranslation(-origin) *
                            Matrix.CreateRotationX(MathHelper.ToRadians(angles.z)) *
                            Matrix.CreateRotationZ(MathHelper.ToRadians(angles.y)) *
                            Matrix.CreateRotationY(MathHelper.ToRadians(angles.x)) *
                            Matrix.CreateTranslation(origin);

        while (p < existingTrack.points.length){
            existingTrack.points[p] = vector3.Transform(existingTrack.points[p], rotMatrix);
            p++;
        }
    }//TrackRotate

    /** 
     * Creates a sine Wave shape wpecifying some more complex parameters
     * Use AddHelixTrack if you want something that varies the Z position along the track
     * @param {string} newTrackName The debug name of the track
     * @param {int} numberOfpoints How many points to place in the final track
     * @param {float} start The right hand X position of the sine wave
     * @param {float} end The left hand X position of the sine wave
     * @param {float} waveAmplitude The amplitude (the vertical size) of the wave
     * @param {float} waveFrequency The number of cycles of the sine wave you want, 
     * you can use 0.5f to generate half a sine wave
     * @param {float} waveStartAngle The phase (angle) to start sine wave at in radians - 
     * use MathHelper.ToRadians(45) to specify value in degrees
     * @param {float} waveDirection specify either 1 or -1
     * @param {float} centreHeight The central height of the wave form
     * @param {float} depth the Z position of the sine wave track
     * @returns {TrackDefinition}  the newly created track
     * @example
     * let t = TrackHelper.AddSineWaveTrack("sine", 300, 400, 0, 100, 2, Math.PI / 2, 1, 400,100);
    */
    static SineWaveComplex( newTrackName,  numberOfpoints,  start,  end,  waveAmplitude,  waveFrequency,
                                    waveStartAngle,  waveDirection,  centreHeight,  depth){
        let newTrack = new TrackDefinition();
        newTrack.name = newTrackName;
        let newPoint = vector3.zero;

        if (numberOfpoints > 65535) numberOfpoints = 65535;

        let radStep = (Math.PI * 2 * waveFrequency / (numberOfpoints - 1) * waveDirection);
        let rad = waveStartAngle;

        let x = start;
        let xStep = (end - start) / (numberOfpoints - 1);

        //            ReDim myTrack(numpoints)
        for (let j = 0; j < numberOfpoints - 1; j++){
            newPoint = new vector3();
            newPoint.x = x;
            newPoint.y = (waveAmplitude * Math.sin(rad) + centreHeight);
            newPoint.z = depth;
            x += xStep;
            rad += radStep;
            newTrack.points.push(newPoint);
        }
        //add last point
        newPoint = new vector3();
        newPoint.x = x;
        newPoint.y = (waveAmplitude * Math.sin(rad) + centreHeight);
        newPoint.z = depth;
        newTrack.points.push(newPoint);

        TrackHelper.Getlength(newTrack);
        return newTrack;

    }

    /** 
     * Create a track which is circular, if you want to lean the circle over use the Rotate helpers
     * @param {string} trackName The debug name to give the track
     * @param {int} numberOfpoints the number of positions on the track required
     * @param {vector3} centre The centre position of the circle
     * @param {float} radius the radius of the track
     * @returns {TrackDefinition}
    */
    static Circle( trackName,  numberOfpoints,  centre,  radius){ return TrackHelper.Ellipse(trackName, numberOfpoints, centre, radius, radius); }

    /** 
     * Creates an elliptical track
     * @param {string} newTrackName The debug name of the track
     * @param {int} numberOfpoints the number of points to create
     * @param {vector3} centre the centre of the ellipse
     * @param {float} radiusX the horizontal radius
     * @param {float} radiusY the vertical radius
     * @returns {TrackDefinition}
    */
    static Ellipse(newTrackName, numberOfpoints, centre,  radiusX,  radiusY){
        //will hold the track we are creating
        let newTrack = new TrackDefinition();
        newTrack.name = newTrackName;
        // a new point for holding the points as they are created
        let newPoint = vector3.zero;

        if (numberOfpoints > 65535) numberOfpoints = 65535;

        let arcStep = 2 * Math.PI / numberOfpoints;
        let rad = 0;
        for (let j = 0; j < numberOfpoints - 1; j++){
            newPoint = new vector3();
            newPoint.x = (radiusX * Math.cos(rad) + centre.x);
            newPoint.y = (radiusY * Math.sin(rad) + centre.y);
            newPoint.z = centre.z;
            rad += arcStep;
            newTrack.points.push(newPoint);
        }
        //add last point
        newPoint = new vector3();
        newPoint.x = (radiusX * Math.cos(rad) + centre.x);
        newPoint.y = (radiusY * Math.sin(rad) + centre.y);
        newPoint.z = centre.z;
        newTrack.points.push(newPoint);

        TrackHelper.Getlength(newTrack);
        return newTrack;
    }

    /** 
     * Creates a spiral shape
     * @param {string} newTrackName The debug name of the track
     * @param {int} numberOfpoints number of points required along the track
     * @param {vector3} centre The centre of the spiral
     * @param {float} radiusX the horizontal radius
     * @param {float} radiusY the vertical radius
     * @param {float} smallestRadius the smallest value wanted for either radius. 
     * the rate at which the radii shrink is determined by this and number of revolutions
     * @param {float} revolutions number of revolutions you want, 
     * this can be a fractional value 1.5f would be a spiral with 1 and half turns
     * @param {float} startZ The starting Z value (depth into the screen)
     * @param {float} endZ The ending z value (depth into the screen)
     * @returns {TrackDefinition}
    */
    static Spiral(newTrackName,numberOfpoints,centre,radiusX,radiusY,smallestRadius,revolutions,startZ,endZ){
        //will hold the track we are creating
        let newTrack = new TrackDefinition();
        newTrack.name = newTrackName;
        // a new point for holding the points as they are created
        let newPoint = vector3.zero;

        if (numberOfpoints > 65535) numberOfpoints = 65535;

        let arcStep = revolutions * 2 * Math.PI / numberOfpoints;
        let rad = 0;
        let shrinkX = (radiusX - smallestRadius) / numberOfpoints;
        let shrinkY = (radiusY - smallestRadius) / numberOfpoints;
        let dz = (endZ - startZ) / numberOfpoints;
        let sz = startZ;
        for (let j = 0; j < numberOfpoints - 1; j++){
            newPoint = new vector3();
            newPoint.x = (radiusX * Math.cos(rad) + centre.x);
            newPoint.y = (radiusY * Math.sin(rad) + centre.y);
            newPoint.z = sz;
            rad += arcStep;
            newTrack.points.push(newPoint);
            radiusX -= shrinkX;
            radiusY -= shrinkY;
            sz += dz;
        }
        //add last point
        newPoint = new vector3();
        newPoint.x = (radiusX * Math.cos(rad) + centre.x);
        newPoint.y = (radiusY * Math.sin(rad) + centre.y);
        newPoint.z = centre.z;
        newTrack.points.push(newPoint);

        TrackHelper.Getlength(newTrack);
        return newTrack;
    }

    /** 
     * Creates a new track which is made up of the points from all the tracks specified int the 
     * array tracks, starting with the first track and adding points from each subsequent one
     * @param {string} newTrackName The name of the track created
     * @param {[]TrackDefinition} tracks an array of tracks to join
     * @returns {TrackDefinition}  a new track definition containing the points of all the tracks given
    */
    static Join(newTrackName, tracks){
        if (tracks.length > 0){
            let newTrack = new TrackDefinition();
            for (let i = 0; i < tracks.length; i++)
                newTrack.points.push(tracks[i].points);

            newTrack.points = newTrack.points.flat();
            TrackHelper.Getlength(newTrack);
            return newTrack;
        }
        else
            return null;
    }    
}

//NEED ADDRANGE helper for point lists - push then x = x.flat();
/******************************
 * vector2.js by Hurray Banana 2023-2024
 ******************************/ 

/**
 * @classdesc used in some methods to lock directions to ordinal or leave in a free direction
 */
class DirectionAccuracy {

    /** x propery */
    x= 45;
    /** y property */
    y;
    /** clamp value for rotation or direction to ordinal values NSEW */
    static ordinals = "ordinals";
    /** calculate the direction or rotation as it occurs */
    static free = "free";
}

/**
 * @classdesc 
 * provides support for 2d values and associated helper functions and arithmetic
 */
class vector2{
    /** base storage if 1st component @type {float} */
    #x=0;
    /** base storage if 2nd component @type {float} */
    #y=0;
    /** dirty storage of length pre-calculated when components change @type {float}*/
    #length;
    /**
     * gets the pre-calculated magnitude of the vector
     * @returns {float}
     * */
    get length(){return this.#length;}
    /**
     * gets the pre-calculated magnitude of the vector, alternative name
     * @returns {float}
     * */
    get distance() {return this.#length;}
    //#mag = 0; - TBR
    /**
     * Creates a vector2 value with the two initial values
     * @param {float} x 
     * @param {float} y 
     */
    constructor(x, y){
        this.set(x,y);
    }
    /**
     * @returns {bool} true if this vector is (0,0)}
     */
    get iszero(){return this.#x == 0 && this.#y == 0;}
    /**
     * @returns {bool} true if this vector is (1,1)}
     */
    get isone(){return this.#x == 1 && this.#y == 1;}    //creates a new object instance with the values from this
    // /**
    //  * @returns {vector2} creates a new vector2 object instance taking the x and y values as copies from this vector2,
    //  */
    // get clone(){return new vector2(this.#x, this.#y);}
    /**
     * sets the x and y components of the vector2
     * @param {float} x x value to set
     * @param {float} y y value to set
     */
    set(x,y){
        this.#x = x;
        this.#y = y;
        this.#calcdist();
    }
    /**
     * @returns {float} gets the x component (1st component) of the vector
     */
    get x(){return this.#x;}
    /**
     * @returns {float} gets the y component (2nd component) of the vector
     */
    get y(){return this.#y;}
    /**
     * @returns {float} gets the w component (1st component) of the vector, alternative name (of x) for different contexts
     */
    get w(){return this.#x;}
    /**
     * @returns {float} gets the h component (2nd component) of the vector, alternative name (of y) for different contexts
     */
    get h(){return this.#y;}
    /**
     * @param {float} value sets the x component (1st component) of the vector
     */
    set x(value){
        if (this.#x != value){
        this.#x = value;
        this.#calcdist();
        } 
    }
    /**
     * @param {float} value sets the y component (1st component) of the vector
     */
    set y(value){
        if (this.#y != value){
        this.#y = value;
        this.#calcdist();
        } 
    }
    /**
     * @param {float} value sets the w component (1st component) of the vector
     */
    set w(value){
        if (this.#x != value){
        this.#x = value;
        this.#calcdist();
        } 
    }
    /**
     * @param {float} value sets the h component (2nd component) of the vector
     */
    set h(value){
        if (this.#y != value){
        this.#y = value;
        this.#calcdist();
        } 
    }
    /** calculates the length of the vector */
    #calcdist(){
        this.#length = Math.sqrt(this.#x*this.#x + this.#y*this.#y);
    }
    /**
     * produces a vector2 value interpolated between vectors a and b
     * @param {vector2} a first vector2
     * @param {vector2} b second vector2
     * @param {float} p value between 0 and 1 controlling interpolation between a and b
     * @returns {vector2} interpolated 
     */
    static lerp(a, b, p){
        let v = vector2.zero;
        v.x = a.x + (b.x - a.x) * p;
        v.y = a.y + (b.y - a.y) * p;
        return v;
    }

    /**
     * normalises this vector (unit length 1) this destorys the orginal vector, this destroys the previous values.
     * If you want a normalised version of this vector withouth destroying its value then use @see {@link normalised}
     */
    normalise(){
        this.#x = this.#x/this.#length;
        this.#y = this.#y/this.#length;
        this.#length = 1;
    }
    /**
     * @returns {vector2}  a new vector that is the normalised form of this vector
     */
    normalised(){
        return new vector2(this.#x/this.#length, this.#y/this.#length);
    }

    /**
     * returns a new vector2 that is the normalised version of component values
     * @param {float} x the x component of a vector
     * @param {float} y the y component of a vector
     * @returns {vector2} a new vector2 instance which is a normalised version of the given component values
     */
    static normalised(x,y){
        let mag = Math.sqrt(x*x + y*y);
        //let ux = x/mag;
        //let uy = y/mag;
        return new vector2(x/mag, y/mag);
    }
    /**
     * The results and additional angles are in degrees use @see {@link anglefromdirectionR} for a version in radians
     * @param {vector2} direction a 2d vector which you want the angle of
     * @param {float} additionalAngle additional angle in radians to add on to the 
     * @returns {float} an angle in degrees which is the direction vector given plus the additional angle specified
     */
    static anglefromdirection(direction, additionalAngle){
        additionalAngle = (additionalAngle === undefined) ? 0 : additionalAngle * Math.PIby180;
        return vector2.anglefromdirectionR(direction, additionalAngle) * Math.hb180byPI;
    }
    /**
     * The results and additional angles are in radians use @see {@link anglefromdirection} for a version in degrees
     * @param {vector2} direction a 2d vector which you want the angle of
     * @param {float} additionalAngle additional angle in radians to add on to the 
     * @returns {float} an angle in radians which is the direction vector given plus the additional angle specified
     */
    static anglefromdirectionR(direction, additionalAngle){
        additionalAngle = (additionalAngle === undefined) ? 0 : additionalAngle;
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
        bearing += additionalAngle;
        return (bearing < Math.PIx2) ? bearing : bearing - Math.PIx2;
    }

    /**
     * takes an angle and turns it into a direction vector that can be used for velocities or other movement
     * @param {float} angle in degrees to convert to direction
     * @param {float} additionalAngle a further angle to add on in degrees
     * @returns {vector2} a direction vector in the direction of the 2 angles requested
     */
    static directionfromangle(angle, additionalAngle){
        angle += (additionalAngle === undefined) ? 0 : additionalAngle;
        angle = angle * Math.PIby180;

        return new vector2(Math.cos(angle - Math.PIby2),
                                Math.sin(angle - Math.PIby2));
    }
    /**
     * takes an angle and turns it into a direction vector that can be used for velocities or other movement
     * @param {float} angle in radians to convert to direction
     * @param {float} additionalAngle a further angle to add on in radians
     * @returns {vector2} a direction vector in the direction of the 2 angles requested
     */
    static directionfromangleR(angle, additionalAngle){
        angle += (additionalAngle === undefined) ? 0 : additionalAngle;

        return new vector2(Math.cos(angle - Math.PIby2),
                                Math.sin(angle - Math.PIby2));
    }
    /** Returns a normalised direction vector looking from the starting sprite to the other sprite
    * @param {vector2} from start position
    * @param {vector2} to the direction to look towards
    * @param {DirectionAccuracy} accuracy choose either free direction or lock to ordinals NSEW
    * @returns {vector2} normalised Vector2 direction vector
    */
    static lookAt(from, to, accuracy){
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
    /**
     * attempts to give a direction vector as close to the ordinal directions (NSEW)
     * @param {vector2} direction vector to ordinalise
     * @returns {vector2} containing NSEW directions only
     */
    static ordinalise(direction){
        if (!direction.iszero){
            if (Math.abs(direction.y) > Math.abs(direction.x)){
                if (direction.y > 0)
                    return vector2.down;
                else
                    return vector2.up;
            }else{
                if (direction.x > 0)
                    return vector2.right;
                else
                    return vector2.left;
            }
        }
        return vector2.zero;
    }       
    /** calculates the dot product between 2 vector2 values 
     * @param {vector2} a first vector
     * @param {vector2} b second vector
     * @returns {float} the dot product
    */
    static dot(a, b){
        return a.x*b.x + a.y*b.y;
    }
    /**
     * Produces a new vector2 that is this vector multiplied the scalar value
     * @param {float} scalar value to multiply the components of this vector by
     * @returns {vector2} a new vector2 that is this vector multiplied by the scalar value
     */
    mulNew(scalar){
        return new vector2(this.#x * scalar, this.#y * scalar);
    }
    /**
     * Produces a new vector2 that is this vector divided the scalar value
     * @param {float} scalar value to multiply the components of this vector by
     * @returns {vector2} a new vector2 that is this vector divided by the scalar value
     */
    divNew(scalar){
        return new vector2(this.#x / scalar, this.#y / scalar);
    }
    /**
     * multiplies this vector by the scalar value
     * @param {float} scalar value to multiply the components of this vector by
     */
    mul(scalar){
        this.x = this.#x * scalar;
        this.y = this.#y * scalar;
    }
    /**
     * divides this vector by the scalar value
     * @param {float} scalar value to divide the components of this vector by
     */
    div(scalar){
        this.x = this.#x / scalar;
        this.y = this.#y / scalar;
    }
    /**
     * Adds either a vector2 to this vector or two component values to this vector
     * @param {float|vector2} vec if you supply a vector2 value then it is added to this vector2 value
     * @param {float|undefined} y if defined then the 2 parameters are assumed to be an x and y value to add to this vector2 components
     */
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
    /**
     * subtracts either a vector2 from this vector or two component values from this vector
     * @param {float|vector2} vec if you supply a vector2 value then it is subtract from this vector2 value
     * @param {float|undefined} y if defined then the 2 parameters are assumed to be an x and y value to subtract from this vector2 components
     */
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
    /**
     * creates a new vector2 by adding either a vector2 to this vector or two component values to this vector
     * @param {float|vector2} vec if you supply a vector2 value then it is added to this vector2 value
     * @param {float|undefined} y if defined then the 2 parameters are assumed to be an x and y value to add to this vector2 components
     * @returns {vector2} a new vector2 adding the vectors or components together without affecting this vector2
     */
    addNew(vec, y){
        if (y === undefined){// if just a vector
            return new vector2(this.#x + vec.x, this.#y + vec.y);
        } else {
            return new vector2(this.#x + vec, this.#y + y);
        }
    }
    /**
     * creates a new vector2 by subtracting either a vector2 from this vector or two component values from this vector
     * @param {float|vector2} vec if you supply a vector2 value then it is subtracted from this vector2 value
     * @param {float|undefined} y if defined then the 2 parameters are assumed to be an x and y value to subtract from this vector2 components
     * @returns {vector2} a new vector2 subtracting the vectors or components together without affecting this vector2
     */
    subNew(vec, y){
        if (y === undefined){// if just a vector
            return new vector2(this.#x - vec.x, this.#y - vec.y);
        } else {
            return new vector2(this.#x - vec, this.#y - y);
        }
    }
    /**
     * adds 2 vectors together v1 + v2
     * @param {vector2} v1 first vector to add
     * @param {vector2} v2 second vector to add
     * @returns {vector2} a new vector2 adding two supplied vectors
     */
    static add(v1, v2){
        return new vector2(v1.x + v2.x, v1.y + v2.y);
    }
    /**
     * subtracts 2 vectors v1 - v2
     * @param {vector2} v1 first vector
     * @param {vector2} v2 second vector to subtract from the first one
     * @returns {vector2} a new vector2 subtracting two supplied vectors
     */
    static sub(v1, v2){
        return new vector2(v1.x - v2.x, v1.y - v2.y);
    }
    /**
     * calculates the distance between 2 point vectors
     * @param {vector2} v1 start point
     * @param {vector2} v2 end point
     * @returns {float} distance between 2 point vectors
     */
    static distance(v1, v2){
        return Math.sqrt((v2.x-v1.x)**2 + (v2.y-v1.y)**2);
    }
    /**
     * calculates the distance between 2 point vectors without performing square root
     * @param {vector2} v1 start point
     * @param {vector2} v2 end point
     * @returns {float} squared distance between 2 point vectors
     */
    static distanceSQ(v1, v2){
        return (v2.x-v1.x)**2 + (v2.y-v1.y)**2;
    } 
     /**returns a new vector2 that is a copy of the values of this one, not a reference a separate object
     * 
     * be warned clone creates an object so is about 20x slower than setting individual vector coords
     * @example
     * b.x = a.x;
     * b.y = a.y;
     * 
     * //or using a.cloneto(b);
     * @returns {vector2} a new vector2 with the same values as this vector2
     */
    get clone(){
        return new vector2(this.#x, this.#y);
    }
    /**
     * clones this vector2 to the existing vector passed as a parameter, avoiding the need to instantiate another object
     * @param {vector2} here a vector2 instance to overwrite the values of
    */
    cloneto(here){
        here.x = this.#x;
        here.y = this.#y;
        here.#calcdist();
    }
    /** @returns {vector2} new vector (0,0) */
    static get zero(){return new vector2(0,0);}
    /** @returns {vector2} new vector (1,1) */
    static get one(){return new vector2(1,1);}
    /** @returns {vector2} new vector (-1,0) */
    static get left(){return new vector2(-1,0);}
    /** @returns {vector2} new vector (1,0) */
    static get right(){return new vector2(1,0);}
    /** @returns {vector2} new vector (0,-1) */
    static get up(){return new vector2(0,-1);}
    /** @returns {vector2} new vector (0,1) */
    static get down(){return new vector2(0,1);}

}
/******************************
 * vector3.js by Hurray Banana 2023-2024
 ******************************/ 

/** @classdesc 3d position and methods */
class vector3{
    /** @type {float} holds x component */
    #x=0;
    /** @type {float} holds y component */
    #y=0;
    /** @type {float} holds z component */
    #z=0;
    /** @type {float} holds length of component */
    #length;
    //gets the pre-calculated magnitude of the vector
    /** @returns {float} pre calculated length of vector3, also it's magnitude */
    get length(){return this.#length;}
    /** @returns {float} pre calculated length of vector3, also it's magnitude */
    get distance() {return this.#length;}
    #mag = 0;
    /** creates an instance of a new vector3
     * @param {float} x initial x component of vector
     * @param {float} y initial y component of vector
     * @param {float} z initial z component of vector if missing z component is set to zero
     */
    constructor(x, y, z){
        if (z === undefined) z = 0;
        this.set(x, y, z);
    }
    /**@returns {bool} true if all 3 components are 0*/
    get iszero(){return this.#x == 0 && this.#y == 0 && this.#z == 0;}
    /**@returns {bool} true if all 3 components are 1*/
    get isone(){return this.#x == 1 && this.#y == 1 && this.#z == 1;}
    /**returns true if given vector is the same value as this one 
     * @param {vector3} a vector to compare
     * @returns {bool} true if 3 components are the same, false if any one component isn;t
    */
    equal(a){
        return this.#x == a.#x && this.#y == a.#y && this.#z == a.#z;
    }
    /**create a new instance of a vector3 with the values of this one - not a reference */
    get clone(){return new vector3(this.#x, this.#y, this.#z);}
    /**
     * sets the vector and calculates its length
     * @param {float} x 
     * @param {float} y 
     * @param {float} z 
     */
    set(x, y, z){
        this.#x = x;
        this.#y = y;
        this.#z = z;
        this.#calcdist();
    }
    /** gets the x component of the vector
     * @returns {float} value 
     */
    get x(){return this.#x;}
    /** gets the y component of the vector
     * @returns {float} value 
     */
    get y(){return this.#y;}
    /** gets the z component of the vector
     * @returns {float} value 
     */
    get z(){return this.#z;}
    /** gets the width component of the vector (x component)
     * @returns {float} value 
     */
    get w(){return this.#x;}
    /** gets the height component of the vector (y component)
     * @returns {float} value 
     */
    get h(){return this.#y;}
    /** gets the depth component of the vector (z component)
     * @returns {float} value 
     */
    get d(){return this.#z;}
    /** sets the x component of the vector
     * @param {float} value 
     */
    set x(value){
        if (this.#x != value){
            this.#x = value;
            this.#calcdist();
        } 
    }
    /** sets the y component of the vector
     * @param {float} value 
     */
    set y(value){
        if (this.#y != value){
            this.#y = value;
            this.#calcdist();
        } 
    }
    /** sets the z component of the vector
     * @param {float} value 
     */
    set z(value){
        if (this.#z != value){
            this.#z = value;
            this.#calcdist();
        } 
    }
    /** sets the width component (x component of the vector)
     * @param {float} value 
     */
    set w(value){
        if (this.#x != value){
            this.#x = value;
            this.#calcdist();
        } 
    }
    /** sets the height component (y component of the vector)
     * @param {float} value 
     */
    set h(value){
        if (this.#y != value){
            this.#y = value;
            this.#calcdist();
        } 
    }
    /** sets the depth component (z component of the vector)
     * @param {float} value 
     */
    set d(value){
        if (this.#z != value){
            this.#z = value;
            this.#calcdist();
        } 
    }    
    /** pre-calculates the length of the vector */
    #calcdist(){
        this.#length = Math.sqrt(this.#x**2 + this.#y**2 + this.#z**2);
    }

    /**
     * produces a vector3 value interpolated between vectors a and b
     * @param {vector3} a first vector3
     * @param {vector3} b second vector3
     * @param {float} p value between 0 and 1 controlling interpolation between a and b
     * @returns {vector3} interpolated 
     */
    static lerp(a, b, p){
        let v = vector3.zero;
        v.x = a.x + (b.x - a.x) * p;
        v.y = a.y + (b.y - a.y) * p;
        v.z = a.z + (b.z - a.z) * p;
        return v;
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
    /**returns a new vector3 that is the normalised form of this vector3
     * @returns {vector3} a new vector3 instance which is the normalised version of this vector3
    */
    normalisedclone(){
        return new vector3(this.#x/this.#length, this.#y/this.#length, this.#z/this.#length );
    }
    /**
     * creates a normalised vector based on the x and y and z values
     * @param {float} x 
     * @param {float} y 
     * @param {float} z 
     * @returns {vector3} unit vector3
    */
    static normalised(x,y,z){
        let mag = Math.sqrt(x**2 + y**2 + z**2);
        return new vector3(x/mag, y/mag, z/mag);
    }

    /**returns the angle of the given  direction vector
     * 
     * This only examines 2d values as it is a bearing (which is 2d)
     * @param {vector3} direction direction to convert
     * @param {float} additionalAngle to add on to the direction in degrees
     * @returns {float} angle in degrees
    */
    static anglefromdirection(direction, additionalAngle){
        additionalAngle = (additionalAngle === undefined) ? 0 : additionalAngle * Math.PIby180;
        return vector3.anglefromdirectionR(direction, additionalAngle) * Math.hb180byPI;
    }
    /**returns the angle of the given  direction vector
     * 
     * This only examines 2d values as it is a bearing (which is 2d)
     * @param {vector3} direction direction to convert
     * @param {*} additionalAngle to add on to the direction in radians
     * @returns {float} angle in radians
    */
    static anglefromdirectionR(direction, additionalAngle){
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
     * @param {float} angle in degrees
     * @param {float} additionalAngle an angle to add on in degrees
     * @returns {vector3} a new vector3 unit direction vector
    */
    static directionfromangle(angle, additionalAngle){
        if (additionalAngle === undefined){
            additionalAngle = 0;
        }

        angle  = (angle + additionalAngle) * Math.PIby180 - Math.PIby2;
        return new vector3(Math.cos(angle), Math.sin(angle),0);
        // return new vector3(Math.cos(angle - Math.PI/2),
        //     Math.sin(angle - Math.PI/2),0);
    }
    /**returns the 3d vector based on the angle
     * 
     * The z value is set to zero
     * @param {float} angle in radians
     * @param {float} additionalAngle an angle to add on in radians
     * @returns {vector3} a new vector3 unit direction vector
    */
    static directionfromangle(angle, additionalAngle){
        if (additionalAngle === undefined){
            additionalAngle = 0;
        }
        angle  = (angle + additionalAngle) - Math.PIby2;
        return new vector3(Math.cos(angle), Math.sin(angle),0);
        // return new vector3(Math.cos(additionalAngle + angle - Math.PI/2),
        //                         Math.sin(additionalAngle + angle - Math.PI/2),0);
    }
    /** Returns a normalised direction vector looking from the starting position to the other position
    * @param {vector3} from start position
    * @param {vector3} to the direction to look towards
    * @param {DirectionAccuracy} accuracy gives exact direction if DirectionAccuracy.free or ordinalised if DirectionAccuracy.ordinals
    * @param {bool} includeZ Specify true if you want to take the Z value into account
    * 
    * @returns {vector3} A normalised Vector3 direction vector in chosen direction
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
    /**
     * finds the ordinalised (cardinals NSEW) direction closest to the given direction vector
     * @param {vector3} direction direction vector to 
     * @returns {vector3} in one of NSEW directions
     */
    static ordinalise(direction){
        if (!direction.iszero){
            if (Math.abs(direction.y) > Math.abs(direction.x)){
                if (direction.y > 0)
                    return vector3.down;
                else
                    return vector3.up;
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
    * @param {vector3} from Position to look from
    * @param {vector3} directionVector Direction looking
    * @param {vector3} to position aiming for
    * @param {float} minimumAngle the step size to turn by, if rotation required is less than this then 0 will be returned
    * 
    * @returns {int}-1 if turned anti-clocwise, 1 if clockwise or 0 if didn't turn */
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
    /** calculates just the z component on the normal to 2 given vectors (the angle between 2 vectors)
     * @param {vector3} a 
     * @param {vector3} b 
     * @returns {float}
    */
    static crosszonly(a, b){
        return a.x*b.y - a.y*b.x;
    }
    /** calculates just the normal to the 2 given vectors
     * @param {vector3} a 
     * @param {vector3} b 
    */
    static cross(a, b){
        return new vector3(a.y*b.z - a.z*b.y,a.z*b.x - a.x*b.z, a.x*b.y - a.y*b.x);
    }
    /** calculates the dot product between 2 vector3 values 
     * @param {vector3} a 
     * @param {vector3} b 
    */
    static dot(a, b){
        return a.x*b.x + a.y*b.y + a.z*b.z;
    }

    /**multiplies this vector3 by the scaler and returns a new vector3 
     * @param {float} scalar 
     * @returns {vector3} new instance
    */
    mulNew(scalar){
        return new vector3(this.#x * scalar, this.#y * scalar, this.#z * scalar);
    }
    /**divides this vector3 by the scaler and returns a new vector3 
     * @param {float} scalar 
     * @returns {vector3} new instance
    */
    divNew(scalar){
        return new vector3(this.#x / scalar, this.#y / scalar,this.#z/scalar);
    }
    /**multiplies this vector by the scaler value 
     * @param {float} scalar 
     * 
    */
    mul(scalar){
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
    }
    /**divides this vector by the scaler value 
     * 
     * vector3 / scaler
     * 
     * @param {float} scalar 
    */
    div(scalar){
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
    }
    /**if the first parameter is a vector3 object then it is added to this vector 
     * 
     * if all 3 parameters are suppied then they are taken as individual
     * x y and z value
     * @param {float|vector3} x either the x component of a vector (supply y and z parameters) or a vector3 value (don't supply y or z parameters)
     * @param {float} y y component of a vector
     * @param {float} z z component of a vector
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
    /**add the 2 given vector3's returning a new instance v1 + v2
     * @param {vector3} a first vector
     * @param {vector3} b second vector
     * @returns {vector3}
    */
    static add(a, b){
        return  new vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }
    /**if the first parameter is a vector3 object then it is subtracted from this vector 
     * 
     * this - vector3 or this - vector3(x,y,z)
     * 
     * if all 3 parameters are suppied then they are taken as individual
     * x y and z value
     * @param {float|vector3} x either the x component of a vector (supply y and z parameters) or a vector3 value (don't supply y or z parameters)
     * @param {float} y y component of a vector
     * @param {float} z z component of a vector
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
    /**subtract the 2 given vector3's returning a new one a - b
     * @param {vector3} a first vector
     * @param {vector3} b second vector
     * @returns {vector3}
    */
    static sub(a, b){
        return  new vector3(a.x - b.x, a.y - b.y, a.z - b.z);
    }
    /**returns the distance between the 2 vector3 objects 
     * @param {vector3} a first vector
     * @param {vector3} b second vector
     * @returns {float} 
    */
    static distance(a, b){
        return Math.sqrt((b.x-a.x)**2 + (b.y-a.y)**2+ (b.z-a.z)**2);
    }
    /**
     * returns the square distance between 2 vector3's
     * 
     * faster to compare squares if only relative difference is required
     * @param {vector3} a first vector
     * @param {vector3} b second vector
     * @returns {float} 
     */
    static distanceSQ(a, b){
        return (b.x-a.x)**2 + (b.y-a.y)**2 + (b.z-a.z)**2;
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
     * @returns {vector3} new vector3 instance based on this ones values
     */
    get clone(){
        return new vector3(this.#x, this.#y, this.#z);
    }
    /**clones this vector3 to the existing vector passed as a parameter 
     * @param {vector3} here 
    */
    cloneto(here){
        here.x = this.#x;
        here.y = this.#y;
        here.z = this.#z;
    }

    /**@returns {vector3}  a new vector3 object (0,0,0) */
    static get zero(){return new vector3(0,0);}
    /**@returns {vector3}  a new vector3 object (1,1,1) */
    static get one(){return new vector3(1,1,1);}
    /**@returns {vector3}  a new vector3 object (-1,0,0) */
    static get left(){return new vector3(-1,0,0);}
    /**@returns {vector3}  a new vector3 object (1,0,0) */
    static get right(){return new vector3(1,0,0);}
    /**@returns {vector3}  a new vector3 object (0,-1,0) */
    static get up(){return new vector3(0,-1,0);}
    /**@returns {vector3}  a new vector3 object (0,1,0) */
    static get down(){return new vector3(0,1,0);}
    /**@returns {vector3} a new vector3 object (0,0,-1) */
    static get backward(){return new vector3(0,0,-1);}
    /**@returns {vector3}  a new vector3 object (0,0,1) */
    static get forward(){return new vector3(0,0,1);}

}
"use strict";
/******************************
 * view.js by Hurray Banana 2023-2024
 ******************************/
/**
 * @classdesc describes a rectangle viewport to control display areas, defaults to same size of canvas
 */
class View{
    /** determines if viewport is prevented from extended beyond the world defined area
     * when moving or positioning the viewport
     * @type {bool}
     */
    clamp = true;
    /** current position of the viewport @type {vector3} */
    #position;
    /**
     * rectangular area of the viewport x and y values are always zero but does state width and height
     * @type {Rectangle}
     */
    #area;
    /**
     * as area but the x and y positions reflect the current position of the viewport
     * @returns {Rectangle}
     */
    #movedarea;
    /**  rectangular area of the viewport x and y values are always zero but does state width and height
     * @returns {Rectangle}
     */
    get area(){return this.#area;}
    /**
     * as area but the x and y positions reflect the current position of the viewport in the world
     * @returns {Rectangle}
     */
    get worldarea(){return this.#movedarea;}
    /** the position of the viewport, it's displacement as a vector3 value
     * @returns {vector3}
     */
    get position(){return this.#position;}
    /** sets the position of the viewport in the world using a vector3 value
     * if clamp is set to true then the viewport will be restricted to the world area
     * @param {vector3} value 
     */
    set position(value){
        if (this.clamp){
            this.#position.x = clamp(value.x, 0, Engine.worldWidth - this.#area.w);
            this.#position.y = clamp(value.y, 0, Engine.worldHeight - this.#area.h);
            this.#position.z = value.z;
            this.#movedarea.x = this.#position.x | 0;
            this.#movedarea.y = this.#position.y | 0;
        }else{
            this.#position = value;
        }
    }
    /** the position of the viewport, it's displacement as a vector2 value
     * @returns {vector2}
     */
    get position2d(){return new vector2(this.#position.x, this.#position.y);}
    /** sets the position of the viewport in the world using a vector2 value
     * if clamp is set to true then the viewport will be restricted to the world area
     * @param {vector2} value 
     */
    set position2d(value){
        if (this.clamp){
            this.#position.x = clamp(value.x, 0, Engine.worldWidth - this.#area.w);
            this.#position.y = clamp(value.y, 0, Engine.worldHeight - this.#area.h);
            this.#movedarea.x = this.#position.x | 0;
            this.#movedarea.y = this.#position.y | 0;
        }else{
            this.#position.x = value.x;
            this.#position.y = value.y;
        }
    }
    /**
     * gets the width of the viewport @returns {float}
     */
    get w(){return this.#area.w;}
    /**
     * gets the height of the viewport @returns {float}
     */
    get h(){return this.#area.h;}
    
    /**
     * gets the horizontal position (offset) of the viewport @returns {float}
     */
    get x(){return this.#position.x;};
    /**
     * sets the horizontal position (offset) of the viewport @param {float} value
     * if clamp is set the horizontal position will be set such that the viewport stays within the world area defined
     */
    set x(value){this.#position.x = this.clamp ? clamp(value, 0, Engine.worldWidth - this.#area.w) : value;this.#movedarea.x = this.#position.x | 0;};
    /**
     * gets the vertical position (offset) of the viewport @returns {float}
     */
    get y(){return this.#position.y;};
    /**
     * sets the vertical position (offset) of the viewport @param {float} value
     * if clamp is set the vertical position will be set such that the viewport stays within the world area defined
     */
    set y(value){this.#position.y = this.clamp ? clamp(value, 0, Engine.worldHeight - this.#area.h) : value;this.#movedarea.y = this.#position.y | 0;};
    /**
     * Creates a new viewport
     * @param {Rectangle} viewport a rectangular region to size the viewport (the width and height are what is taken from the rectangle)
     * @param {float} startx a start position for the horizontal position of the viewport in the world
     * @param {float} starty a start position for the vertical position of the viewport in the world
     */
    constructor(viewport, startx, starty){
        this.#area = viewport;
        this.#movedarea = new Rectangle(startx, starty, viewport.w, viewport.h);
        startx= (startx === undefined) ? 0 : startx;
        starty = (starty === undefined) ? 0 : starty;
        this.#position = new vector3(startx, starty, 0);
    }
    /**
     * I don't know what this is actually supposed to do, Sprite draw is using the rectangle version, this might be old/not needed in this form
     * I'm going to rename to see if it breaks anything
     * @param {Rectangle} r 
     * @param {bool} world 
     * @returns {bool}
     */
    AM_I_NEEDED_in(r, world){//
        if (world)
                return !(r.left >= this.#movedarea.right ||
                        r.right <= this.#movedarea.left ||
                        r.top >= this.#movedarea.bottom ||
                        r.bottom <= this.#movedarea.top
                );
            else
                return !(r.left >= this.#area.width ||
                        r.right <= 0 ||
                        r.top >= this.#area.height ||
                        r.bottom <= 0
                );
    }
}
