  /******************************
   * Limit.js
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
    #area;
    /** specifies the Box area (rectangular region with depth) with which to apply limit actions */
    get area(){return this.#area;}
    /** specifies the Box area (rectangular region with depth) with which to apply limit actions */
    set area(value){
        if (value instanceof Rectangle){
            this.#area = new Box(value.x, value.y, Engine.zHalf, avaluerea.w, value.h, Engine.zRange);
        } else if (value instanceof Box){
            this.#area = value;
        }
    }
    #ms;
    #active;
    #atLimit = false;
    get atLimit(){return this.#atLimit;}
    #callback;
    /** retrieves the current callback which will be triggered if the sprite interacts with the limit box
     * (if this has not been set it will be null)
     * it will be in the form of object properties
     * @example 
     * // two propeties callback and instance
     * let callstuff = this.callback;
     * if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
     */
    get callback(){return this.#callback;}
    /**
     * sets (or changes) the callback handler called when sprite interacts with the limit box
     * value must be an object with 2 properties
     * @example // limitreached is a method of your inherited sprite class
     * this.callback = {callback:this.limitreached,instance:this};
     */
    set callback(value){
      if (value.callbk !== undefined && value.inst !== undefined){
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

    /** specifies if the specified limit box is actively being processed default is true */
    get active(){return this.#active;}
    /** creates a Limit object for this sprite, which is initially inactive
     * use regionaction() to define an interaction mode
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
            this.#area = new Box(area.x, area.y, Engine.zHalf, area.w, area.h, Engine.zRange);
        } else if (area instanceof Box){
            this.#area = area;
        }
        this.#mode = this.#getMode(mode);
        this.#active = false;
        if (instance !== undefined && callme !== undefined){
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

    update(/*delta*/){
        //this.#delta = delta;//for those that need it
        this.#atLimit = false;
        if (this.#mode != Limitmode.none){
            if (this.#active){
                this.#mode();
            } else {
                //check to see if we are in limit area and so activate
                if (this.#ms.right <this.#area.right  &&
                    this.#ms.left > this.#area.left &&
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
            if (this.#atLimit && this.#callback != null){
              this.#callback.callback.call(this.#callback.instance);
            }
        }
    }
    killpast(){
        if (this.#ms.left > this.#area.right || this.#ms.right < this.#area.left ||
          this.#ms.top > this.#area.bottom || this.#ms.bottom < this.#area.top ||
          this.#ms.z < this.#area.back || this.#ms.z > this.#area.front){
              this.#ms.kill();
              this.#atLimit = true;
        }
    }
    killtouch(){
        if (this.#ms.right > this.#area.right || this.#ms.left < this.#area.left ||
            this.#ms.bottom > this.#area.bottom || this.#ms.top < this.#area.top ||
            this.#ms.z < this.#area.back || this.#ms.z > this.#area.front){
            this.#ms.kill();
            this.#atLimit = true;
        }
    }
    bounceZonly(){
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
    bounceAlign(){} //modify already written bounce
    wrapXBounceY(){
      if (this.#ms.right < this.#area.left)
      {
          this.#ms.left = this.#area.right;
          //SpriteHelper.AlignLeftAt(boss, this.area.right, 0);
          this.#atLimit = true;
      }
      else if (this.#ms.left > this.#area.right)
      {
          this.#ms.left = this.#area.right;
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
    wrapYBounceX(){
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
      let diff = this.#ms.right - this.#area.right;
      if (diff > 0)
      {
          this.#ms.x -= diff;// * this.#ms.e;
          this.#ms.vx *= -this.#ms.e;
          this.#atLimit = true;
      }
      else
      {
          diff = this.#ms.left - this.#area.left;
          if (diff < 0)
          {
              this.#ms.x -= diff;// * this.#ms.e;
              this.#ms.vx *= -this.#ms.e;
              this.#atLimit = true;
          }
      }
    }
    stopAt(){
      if (this.#ms.right > this.#area.right)
      {
          this.#ms.right = this.#area.right;
          //SpriteHelper.AlignRightAt(boss, this.area.right, 0);
          this.#ms.vx = 0;
          this.#atLimit = true;
          //this.#ms.Velocity = new Vector3(0.0f, this.#ms.vy, this.#ms.vz);
          this.#ms.static = true;
      }
      else if (this.#ms.left < this.#area.left)
      {
          this.#ms.left = this.#area.left;
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
    stopFirstTouch(){
      if (this.#ms.right > this.#area.right)
      {
        this.#ms.right = this.#area.right;
        //SpriteHelper.AlignRightAt(boss, this.area.right, 0);
          this.#ms.Velocity = Vector3.Zero;
          this.#ms.static = true;
      }
      else if (this.#ms.left < this.#area.left)
      {
        this.#ms.left = this.#area.left;
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
    stopThenKill(){
      if (this.#ms.right > this.#area.right)
      {
          this.#ms.right = this.#area.right;
          //this.#ms.x = this.area.right - this.#ms.Width * 0.5;
          this.#ms.vx = 0;
          this.#atLimit = true;
          this.#ms.static = true;
      }
      else if (this.#ms.left < this.#area.left)
      {
          this.#ms.left = this.#area.left;
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
    killInside(){}//doesn't need to do anything as this is tested elsewhere
    killPastXBounceY(){
        //check x boundary
      if (this.#ms.left > this.#area.right ||
          this.#ms.right < this.#area.left)
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
    killPastXStopY(){
        //check x boundary
        if (this.#ms.left > this.#area.right || this.#ms.right < this.#area.left){
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
    killPastYStopX(){
      if (this.#ms.bottom > this.#area.bottom || this.#ms.top < this.#area.top){
          this.#ms.kill();
          this.#atLimit = true;
      }
      if (this.#ms.right > this.#area.right){
          this.#ms.right = this.#area.right;
          //SpriteHelper.AlignRightAt(boss, this.area.right, 0);
          this.#ms.vx = 0;
          //this.#ms.Velocity = new Vector3(0.0f, this.#ms.vy, this.#ms.vz);
          this.#atLimit = true;
          this.#ms.static = true;
      } else if (this.#ms.left < this.#area.left){
          this.#ms.left = this.#area.left;
          //SpriteHelper.AlignLeftAt(boss, this.area.left, 0);
          this.#ms.vx = 0;
          //this.#ms.Velocity = new Vector3(0.0f, this.#ms.vy, this.#ms.vz);
          this.#atLimit = true;
          this.#ms.static = true;
      }
    }
    inform(){
      this.#atLimit = this.#ms.right >= this.#area.right || this.#ms.left <= this.#area.left || 
                      this.#ms.bottom >= this.#area.bottom || this.#ms.top <= this.#area.top ||
                      this.#ms.z <= this.#area.back || this.#ms.z >= this.#area.front;
    }
    informAlign(){
      if (this.#ms.right >= this.#area.right){
          this.#ms.right = this.#area.right;
          //SpriteHelper.AlignRightAt(boss, this.area.right, 0);
          this.#atLimit = true;
      } else if (this.#ms.left <= this.#area.left) {
          this.#ms.left = this.#area.left;
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
    turnOffGravity(){
      if (this.#ms.right >= this.#area.right){
          this.#ms.right = this.#area.right;
          //SpriteHelper.AlignRightAt(boss, this.area.right, 0);
          this.#atLimit = true;
          this.#ms.Gravity = Vector3.Zero;
          this.#ms.vx = 0;
      }else if (this.#ms.left <= this.#area.left){
          this.#ms.left = this.#area.left;
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
    turnOffGravityBottomOnly(){
      if (this.#ms.bottom >= this.#area.bottom){
          this.#ms.bottom = this.#area.bottom;
          //SpriteHelper.AlignBottomAt(boss, this.area.bottom, 0);
          this.#atLimit = true;
          this.#ms.Gravity = Vector3.Zero;
          this.#ms.vy = 0;
      }
    }
    fireEvent(){
        if (this.#callback != null){
            if (this.#ms.right > this.#area.right || this.#ms.left < this.#area.left ||
              this.#ms.bottom > this.#area.bottom || this.#ms.top < this.#area.top ||
              this.#ms.z < this.#area.back || this.#ms.z > this.#area.front){
                //LimitCallBack();
                this.#atLimit = true;
            }
        }
    }
    bounce(){
        if (this.#ms.vx < 0){ // left
          if (this.#ms.left <= this.#area.l) { 
            this.#ms.vx *= -this.#ms.e;}
        } else if (this.#ms.vx > 0) { //  right
          if (this.#ms.right >= this.#area.r) { 
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

    wrap(){
        if (this.#ms.vx < 0){ // left
            if (this.#ms.right < this.#area.l) { 
            this.#ms.left = this.#area.r;}
        } else if (this.#ms.vx > 0) { //  right
            if (this.#ms.left > this.#area.r) { 
            this.#ms.right = this.#area.l;}
        } else { //no motion
          if (this.#ms.right < this.#area.l) { 
            this.#ms.left = this.#area.r;}
          else if (this.#ms.left > this.#area.r) { 
            this.#ms.right = this.#area.l;}
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
