/******************************
 * sprite.js
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
     * currently not implemented
     * @type {float}
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
        this.#angle = vector3.anglefromdirection(direction,additionalAngle);        
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
    /**internal support for executing callback routines (there are currently 4 differenet ones in Sprite) */
    #processCallback(handler, data){
        if (handler != null) handler.callback.call(handler.instance, data);
    }
    //all callbacks
    /**method called when the sprite is hidden with 
     *  or settting visible to false, or from flashing 
     * @example this.hide();*/
    //callbackHide = null;
    #callbackHide = null;
    /** retrieves the current callback (if this has not been set it will be null)
     * it will be in the form of object properties
     * @example 
     * // two propeties callback and instance
     * let callstuff = this.callbackHide;
     * if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
     */
    get callbackHide(){return this.#callbackHide;}
    /**
     * sets (or changes) the callback handler called when a sprite is hidden
     * value must be an object with 2 properties
     * @example // hidesound is a method of your inherited sprite class
     * this.callbackHide = {callback:this.hidesound,instance:this};
     * // or use the Engine.makeCallback() method
     * this.callbackHide = Engine.makeCallback(this.hidesound, this);
     */
    set callbackHide(value){
      if (value.callback !== undefined && value.instance !== undefined){
        this.#callbackHide = value;
      }
    }    
    /**method called when the sprite is shown with show() or setting visible to true*/
    #callbackShow = null;
    /** retrieves the current callback (if this has not been set it will be null)
     * it will be in the form of object properties
     * @example 
     * // two propeties callback and instance
     * let callstuff = this.callbackShow;
     * if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
     */
    get callbackShow(){return this.#callbackShow;}
    /**
     * sets (or changes) the callback handler called when a sprite is shown
     * value must be an object with 2 properties
     * @example // showsound is a method of your inherited sprite class
     * this.callbackShow = {callback:this.showsound,instance:this};
     * // or use the Engine.makeCallback() method
     * this.callbackShow = Engine.makeCallback(this.showsound, this);
     */
    set callbackShow(value){
      if (value.callback !== undefined && value.instance !== undefined){
        this.#callbackShow = value;
      }
    }    

    #callbackCollide = null;
    /** retrieves the current callback (if this has not been set it will be null)
     * it will be in the form of object properties
     * @example 
     * // two propeties callback and instance
     * let callstuff = this.callbackCollide;
     * if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
     */
    get callbackCollide(){return this.#callbackCollide;}
    /** method called if this sprite is involved in a collision but only if this is a collisionPrimary 
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
      if (value.callback !== undefined && value.instance !== undefined){
        this.#callbackCollide = value;
      }
    }    
    /** method called when a sprite is destroyed using kill() */
    #callbackFuneral = null;
    /** retrieves the current callback (if this has not been set it will be null)
     * it will be in the form of object properties
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
      if (value.callback !== undefined && value.instance !== undefined){
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
     * @example Engine.spM.add(this);
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
        //if currently not showing do show callback
        //if (!this.visible) Engine.processCallback(this.#callbackShow);

        this.#visible = true;

    }
    /** makes this sprite invisible/won't be rendered calling the hide callback if set
     * @example this.hide();
    */
    hide(){
        //if (this.visible) Engine.processCallback(this.#callbackHide);

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
    get right() {
        return this.centrex + this.#visWdiv2;
    }
    /** sets sprites bottom to be this value y value is adjusted accordingly (the x and y values represent the centre of a sprite) 
     * @example this.right = 200;
     * @param {float} value 
    */
    set right(value){
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
                    this.limit.update(/*HBRESTOREdelta*/);
                }
                
                if (this.history != null){
                    this.history.update(/*HBRESTOREdelta*/);
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
