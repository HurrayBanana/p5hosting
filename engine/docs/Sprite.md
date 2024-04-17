engine created by Hurray Banana &copy;2023-2024
## class Sprite
> for drawing and manipulating moving graphic objects
> 
> create your own sprites by extending the Sprite class
> 
> it's important to clone object values as you'll generally want a new object (with the values) rather than a reference to the original vector3 object
> 
> 

---

## Constructor
> #### constructor()
> to use write **new Sprite()**
> 
> create a new sprite
> 
> make sure in your constructor after calling super() that you add the sprite to the Engine for processing to occur
> 
> ```js
> example
>       Engine.spM.add(this);
>      
> ```
> 

---

## properties
#### #angle
> to use write **this.#angle**
> 
> 
> type {**float**}
> 
> 

---

#### #callbackFuneral
> default value **null**
> 
> to use write **this.#callbackFuneral**
> 
> method called when a sprite is destroyed using kill()
> 
> 

---

#### #callbackShow
> default value **null**
> 
> to use write **this.#callbackShow**
> 
> method called when the sprite is shown with show() or setting visible to true
> 
> 

---

#### #clip
> default value **false**
> 
> to use write **this.#clip**
> 
> 
> type {**bool**} whether clipping is active
> 
> 

---

#### #cliparea
> default value **null**
> 
> to use write **this.#cliparea**
> 
> holds the clip area for the sprite if manually specified
> 
> 

---

#### #cliplimit
> default value **false**
> 
> to use write **this.#cliplimit**
> 
> 
> type {**bool**}
> 
> 

---

#### #collidable
> default value **false**
> 
> to use write **this.#collidable**
> 
> must be set to true for sprite to be involved in collisions
> 
> 

---

#### #collisionPrimary
> default value **false**
> 
> to use write **this.#collisionPrimary**
> 
> if true then this sprites callbackCollide is called during collisions
> 
> 

---

#### #deltaposition
> default value **vector3.down**
> 
> to use write **this.#deltaposition**
> 
> 
> type {**vector3**}
> 
> 

---

#### #e
> default value **1**
> 
> to use write **this.#e**
> 
> the energy reduction co-efficient @type {float}
> 
> 

---

#### #friction
> to use write **this.#friction**
> 
> friction value @type {float}
> 
> 

---

#### #gravitywell
> default value **null**
> 
> to use write **this.#gravitywell**
> 
> gravity well objects, for this sprite there can be more than one - to be implemented
> 
> 
> type {**[]GravityWell**}
> 
> 

---

#### #lasttrackposition
> default value **vector3.zero**
> 
> to use write **this.#lasttrackposition**
> 
> 
> type {**vector3**}
> 
> 

---

#### #moving
> default value **true**
> 
> to use write **this.#moving**
> 
> 
> type {**bool**}
> 
> 

---

#### #position
> to use write **this.#position**
> 
> 
> type {**vector3**}
> 
> 

---

#### #renderrectangle
> default value **Rectangle.zero**
> 
> to use write **this.#renderrectangle**
> 
> 
> type {**Rectangle**} rectangluar area of sprite
> 
> 

---

#### #scale
> to use write **this.#scale**
> 
> 
> type {**vector2**}
> 
> 

---

#### #velocity
> to use write **this.#velocity**
> 
> 
> type {**vector3**}
> 
> 

---

#### #visH
> to use write **this.#visH**
> 
> 
> type {**float**} on screen height
> 
> 

---

#### #visHdiv2
> to use write **this.#visHdiv2**
> 
> 
> type {**float**} on screen half height
> 
> 

---

#### #visW
> to use write **this.#visW**
> 
> 
> type {**float**} on screen width
> 
> 

---

#### #visWdiv2
> to use write **this.#visWdiv2**
> 
> 
> type {**float**} on screen half width
> 
> 

---

#### //callbackHide
> default value **null**
> 
> to use write **this.//callbackHide**
> 
> method called when the sprite is hidden with
> 
> or settting visible to false, or from flashing
> 
> ```js
> example
> this.hide();
> ```
> 

---

#### align
> default value **Align.centre**
> 
> to use write **this.align**
> 
> specifies how sprite is drawn compared to its x and y positions, default is
> 
> 
> type {**Align**}
> 
> ```js
> example
> this.align = Align.centre;
> ```
> 

---

#### angularDirectionTo(to, minimumAngle)
> to use write **this.angularDirectionTo(to, minimumAngle)**
> 
> Determines if  rotating clockwise or anticlockwise is closest for a sprite to turn towards a  position
> 
> Useful for create homing and tracking effects, returns -1 if turned anti-clocwise, 1 if clockwise or 0 if didn't turn
> 
> 

---

#### clickable
> default value **false**
> 
> to use write **this.clickable**
> 
> set to true to enable clicking
> 
> 
> type {**bool**}
> 
> 

---

#### collisionList
> to use write **this.collisionList**
> 
> a list of object types to check in the sprite list for collision, only those in the list will be checked
> 
> This only applies to sprites that are collisionPrimary
> 
> 
> type {**[]object**} an array containing the object types that should be checked for, use a list [Sprite] to include all sprites
> 
> ```js
> example
> this.collisionList = [Ghost, Fruit];
> ```
> 

---

#### dragging
> default value **false // Is the object being dragged?**
> 
> to use write **this.dragging**
> 
> NOT CURRENTLY IN USE @type {bool}
> 
> 

---

#### elapsedTime
> default value **0**
> 
> to use write **this.elapsedTime**
> 
> keeps track of the time elapsed if a sprite is using an updatePeriod.
> 
> Do not change this value
> 
> 
> type {**float**}
> 
> 

---

#### energylevel
> default value **1**
> 
> to use write **this.energylevel**
> 
> a value that is multiplied by the collision co-efficient each time it is sampled
> 
> this happens whenever the value of e is samples/used in a collision
> 
> this value can be used to trigger other actions like removing velocity if the energy value
> 
> falls below as certain number
> 
> 
> type {**float**}
> 
> ```js
> example
>        update(delta){
>            super.update(delta);
>            //stop vertical motion once sprite has bounced enough
>            if (this.vy != 0 && this.energylevel < 0.01){
>                this.gravity.y = 0;      
>                this.vy = 0; 
>                this.energylevel = 1;//reset energy
>            }
>        } 
> ```
> 

---

#### frame
> to use write **this.frame**
> 
> holds the animation system for the sprite
> 
> you need to define frames and animations through the frame object
> 
> 
> type {**Animator**}
> 
> ```js
> example
>       
>      this.frame.define(txsprite, new Rectangle(138,213,32,32));//blinky 0
>      this.frame.define(txsprite, new Rectangle(172,213,32,32));//blinky 1
> ```
> 

---

#### gravity
> default value **null**
> 
> to use write **this.gravity**
> 
> gravity vector in 3d, to apply to the sprite, set to null to turn gravity off (default)
> 
> 

---

#### gravityrough
> default value **true**
> 
> to use write **this.gravityrough**
> 
> if true a quick calculation of gravitional force is computed rather than GMMr2
> 
> (default true)
> 
> 
> type {**bool**}
> 
> 

---

#### history
> default value **null**
> 
> to use write **this.history**
> 
> holdsd refence to history object for this sprite, defaults to null.
> 
> You must create this in your constructor if you wish to use history effects
> 
> 
> type {**History**}
> 
> ```js
> example
>       this.history = new History(this);
> ```
> 

---

#### lastposition
> default value **vector3.zero**
> 
> to use write **this.lastposition**
> 
> holds the last position the sprite was at
> 
> 

---

#### layer
> to use write **this.layer**
> 
> which drawing layer to render the sprite on
> 
> layers are rendered from lowest to highest (0 - 3)
> 
> 
> type {**texture**}
> 
> ```js
> example
>      this.layer = Engine.layer(0); //to set on layer 0 (back layer)
> ```
> 

---

#### limit
> default value **null**
> 
> to use write **this.limit**
> 
> determines if the sprite reacts to a specified rectangular boundary, see Limit static member functions for limit modes
> 
> must be set in the constructor
> 
> 
> type {**Limit**}
> 
> ```js
> example
>     this.limit = new Limit(Limit.wrap, Engine.mainview);
> ```
> 

---

#### mass
> default value **100**
> 
> to use write **this.mass**
> 
> holds the mass of the sprite in Kg used for gravity calculations (default will be set to number of non alpha pixels)
> 
> defaults to 100 (if you don't set it)
> 
> 
> type {**float**}
> 
> 

---

#### myid
> to use write **this.myid**
> 
> represents a unique id for a sprite
> 
> This can be used in debugging making a conditional breakpoint when a specific sprite id is being processed
> 
> You shouldn't change this value
> 
> 
> type {**int**}
> 
> 

---

#### paused
> default value **false**
> 
> to use write **this.paused**
> 
> if true then sprite will not perform updates (it will still be rendered)
> 
> 
> type {**bool**}
> 
> 

---

#### shape
> default value **Shape.circle**
> 
> to use write **this.shape**
> 
> specifies the rough shape of the sprite (not currently used but will eventually affect collision detection)
> 
> 
> type {**Shape**}
> 
> 

---

#### showRenderArea
> default value **null**
> 
> to use write **this.showRenderArea**
> 
> if a colour is set then the render rectangle/circle will be shown for the sprite in the specified colour
> 
> set to null to not show the renderarea of the sprite
> 
> 
> type {**colour**}
> 
> 

---

#### showclip
> default value **null**
> 
> to use write **this.showclip**
> 
> holds a colour to show the limit box of this sprite
> 
> If null (default) box not shown
> 
> if a colour is stored then it will be drawn (use alpha values so you can see the sprite)
> 
> 
> type {**color**}
> 
> ```js
> example
>       //show transparent blue clip box
>       this.showclip = [0,0,255,100];
> ```
> 

---

#### track
> default value **null**
> 
> to use write **this.track**
> 
> holds a reference to the track manager for the sprite, this has to be explicitly set in your sprites constructor
> 
> 
> type {**TrackManager**}
> 
> ```js
> example
>       this.track = new TrackManager(this);
> ```
> 

---

#### updateMode
> default value **UpdateMode.auto**
> 
> to use write **this.updateMode**
> 
> how sprite is updated - defaults to auto where sprite updates every frame using velocity,gravity and gravity wells to change position
> 
> 
> type {**UpdateMode**}
> 
> 

---

#### updatePeriod
> default value **0**
> 
> to use write **this.updatePeriod**
> 
> the update period (in seconds) for the sprite to force the update to only occur now and then, just like space invaders movement
> 
> 
> type {**float**} time interval to wait between updates
> 
> 

---

#### vscale
> default value **vector2.zero;**
> 
> to use write **this.vscale**
> 
> holds the scale percentage increase per second to apply to the sprite vector2(0,0) is the default, no scaling
> 
> 
> type {**vector2**}
> 
> ```js
> example
>       this.vscale = vector2(1,1); //would be 100% per second
> ```
> 

---

#### workin3d
> default value **true**
> 
> to use write **this.workin3d**
> 
> do we want to work with z co-ordinates default if true (not implemented fully yet)
> 
> 
> type {**bool**}
> 
> 

---

#### world
> default value **true//x y coords tied to world of just viewport region**
> 
> to use write **this.world**
> 
> specifies if position is relative to the canvas view or the world co-ordinates which may be large.
> 
> default is world (true),
> 
> set to false to draw at same position in viewport despite any scrolling or offset of the world
> 
> 
> type {**bool**}
> 
> 

---

## getters and setters
####  [getter] [static]
> to use write **Sprite.**
> 
> true if the sprite is not moving for collision response purposes default is false
> 
> 
> returns {**bool**}
> 
> 

---

####  [setter] [static]
> to use write **Sprite.**
> 
> sets the moving property, if true during collisions no momentum will be transferred during collision response
> 
> if sprites are not repsonding to collisions properly ensure this is set to false
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

#### alive [getter]
> to use write **this.alive**
> 
> returns true if the sprite is still actively being processed and displayed
> 
> 
> returns {**bool**}
> 
> 

---

#### alpha [getter]
> to use write **this.alpha**
> 
> gets the current alpha value of the sprite between 1 - opaque and 0 transparent.
> 
> default 1
> 
> 
> returns {**float**}
> 
> ```js
> example
> this.alpha = 0.4; // 40 % opaque
> ```
> 

---

#### alpha [setter]
> to use write **this.alpha = value**
> 
> sets the current alpha value of the sprite between 1 - opaque and 0 transparent.
> 
> default 1
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> this.alpha = 0.4; // 40 % opaque
> ```
> 

---

#### angle [getter]
> to use write **this.angle**
> 
> gets the rotation angle of the sprite in degrees
> 
> 
> returns {**float**} in degrees
> 
> 

---

#### angle [setter]
> to use write **this.angle = value**
> 
> sets the rotation angle of the sprite in degrees
> 
> 
> **Parameters**
> 
> {**float**} **value** in degrees (0 is north, default orientation)
> 
> ```js
> example
> this.angle = 45;
> ```
> 

---

#### angleR [getter]
> to use write **this.angleR**
> 
> gets the angle of the sprite in radians (for trig work)
> 
> 
> returns {**float**} in radians
> 
> 

---

#### angleR [setter]
> to use write **this.angleR = value**
> 
> sets the angle of the sprite in radians
> 
> useful when you have done some trig and already have radians
> 
> 
> **Parameters**
> 
> {**float**} **value** in Radians
> 
> 

---

#### bottom [getter]
> to use write **this.bottom**
> 
> gets the y value of the bottom of the sprite (the x and y values represent the centre of a sprite)
> 
> 
> returns {**float**}
> 
> 

---

#### bottom [setter]
> to use write **this.bottom = value**
> 
> sets sprites bottom to be this value y value is adjusted accordingly (the x and y values represent the centre of a sprite)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> this.bottom = height; // set sprites bottom to the bottom edge of screen
> ```
> 

---

#### bradius [getter]
> to use write **this.bradius**
> 
> NOT IN USE a rough circular radius of the sprite
> 
> 
> returns {**float**}
> 
> 

---

#### callbackCollide [getter]
> to use write **this.callbackCollide**
> 
> retrieves the current callback (if this has not been set it will be null)
> 
> it will be in the form of object properties
> 
> 
> returns {**{callback:method|function,instance:object**}
> 
> ```js
> example
>       // two propeties callback and instance
>       let callstuff = this.callbackCollide;
>       if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
>      
> ```
> 

---

#### callbackCollide [setter]
> to use write **this.callbackCollide = value**
> 
> method called if this sprite is involved in a collision but only if this is a collisionPrimary
> 
> 
> **Parameters**
> 
> {**{callback:method|function,instance:object}**} **value** 
> 
> {**{callback:method|function,instance:object}**} **value** 
> 
> ```js
> example
>       this.callbackCollide = {callback:this.hitsomething,instance:this};
>       // or use the Engine.makeCallback() method
>       this.callbackCollide = Engine.makeCallback(this.hitsomething, this);
>       
>       //the routine needs to accept a parameter (which will be a reference to the sprite hit)
>       hitsomething(hit){
>            if (hit instanceof Invader){
>                hit.kill(); // kill sprite we hit
>                this.kill(); //kill this bullet
>                return true; //stop processing anymore collisions for this bullet
>            } else {
>                return false; //continue collision processing for this sprite
>            }
>       }
> 
> ```
> 

---

#### callbackFuneral [getter]
> to use write **this.callbackFuneral**
> 
> retrieves the current callback (if this has not been set it will be null)
> 
> it will be in the form of object properties
> 
> 
> returns {**{callback:method|function,instance:object**}
> 
> ```js
> example
>       // two propeties callback and instance
>       let callstuff = this.callbackFuneral;
>       if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
>      
> ```
> 

---

#### callbackFuneral [setter]
> to use write **this.callbackFuneral = value**
> 
> sets (or changes) the callback handler called when animation states reach an end point
> 
> value must be an object with 2 properties
> 
> 
> **Parameters**
> 
> {**{callback:method|function,instance:object}**} **value** 
> 
> ```js
> example
> // idied is a method of your inherited sprite class
>       this.callbackFuneral = {callback:this.idied,instance:this};
>       // or use the Engine.makeCallback() method
>       this.callbackFuneral = Engine.makeCallback(this.idied, this);
>       idied(){
>            //make explosion at the dead sprites position
>            new explosion(this.x, this.y);
>       }
> ```
> 

---

#### callbackHide [getter]
> to use write **this.callbackHide**
> 
> retrieves the current callback (if this has not been set it will be null)
> 
> it will be in the form of object properties
> 
> 
> returns {**{callback:method|function,instance:object**}
> 
> ```js
> example
>       // two propeties callback and instance
>       let callstuff = this.callbackHide;
>       if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
>      
> ```
> 

---

#### callbackHide [setter]
> to use write **this.callbackHide = value**
> 
> sets (or changes) the callback handler called when a sprite is hidden
> 
> value must be an object with 2 properties
> 
> 
> **Parameters**
> 
> {**{callback:method|function,instance:object}**} **value** 
> 
> ```js
> example
> // hidesound is a method of your inherited sprite class
>       this.callbackHide = {callback:this.hidesound,instance:this};
>       // or use the Engine.makeCallback() method
>       this.callbackHide = Engine.makeCallback(this.hidesound, this);
>      
> ```
> 

---

#### callbackShow [getter]
> to use write **this.callbackShow**
> 
> retrieves the current callback (if this has not been set it will be null)
> 
> it will be in the form of object properties
> 
> 
> returns {**{callback:method|function,instance:object**}
> 
> ```js
> example
>       // two propeties callback and instance
>       let callstuff = this.callbackShow;
>       if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
>      
> ```
> 

---

#### callbackShow [setter]
> to use write **this.callbackShow = value**
> 
> sets (or changes) the callback handler called when a sprite is shown
> 
> value must be an object with 2 properties
> 
> 
> **Parameters**
> 
> {**{callback:method|function,instance:object}**} **value** 
> 
> ```js
> example
> // showsound is a method of your inherited sprite class
>       this.callbackShow = {callback:this.showsound,instance:this};
>       // or use the Engine.makeCallback() method
>       this.callbackShow = Engine.makeCallback(this.showsound, this);
>      
> ```
> 

---

#### centre [getter]
> to use write **this.centre**
> 
> gets the centre of the sprite as a vector3 object
> 
> 
> returns {**vector3**}
> 
> 

---

#### centre [setter]
> to use write **this.centre = value**
> 
> sets the centre of the sprite based on it's alignment using a vector3 value
> 
> 
> **Parameters**
> 
> {**vector3**} **value** 
> 
> 

---

#### centreoffx [getter]
> to use write **this.centreoffx**
> 
> gets the x offset to its centre (half the width)
> 
> 
> returns {**float**}
> 
> 

---

#### centreoffy [getter]
> to use write **this.centreoffy**
> 
> gets the y offset to its centre (half the height)
> 
> 
> returns {**float**}
> 
> 

---

#### centrex [getter]
> to use write **this.centrex**
> 
> returns the x centre of the sprite (same a y currently)
> 
> 
> returns {**float**}
> 
> 

---

#### centrex [setter]
> to use write **this.centrex = value**
> 
> Sets the horizontal centre of the sprite (taking alignment into account)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

#### centrey [getter]
> to use write **this.centrey**
> 
> returns the y centre of the sprite (same a y currently)
> 
> 
> returns {**float**}
> 
> 

---

#### centrey [setter]
> to use write **this.centrey = value**
> 
> Sets the vertical centre of the sprite (taking alignment into account)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

#### cliparea [getter]
> to use write **this.cliparea**
> 
> gets the current clip area
> 
> 
> returns {**Rectangle**}
> 
> 

---

#### cliparea [setter]
> to use write **this.cliparea = value**
> 
> specifies a clip rectangle and turns clipping on
> 
> 
> **Parameters**
> 
> {**Rectangle**} **value** area to clip against
> 
> ```js
> example
>       // restrict sprite to rectangle in centre of screen with a 20 pixel border
>       this.cliparea = new Rectangle(20,20,width-40,height-40);
> ```
> 

---

#### collidable [getter]
> to use write **this.collidable**
> 
> indicates whether this sprite is part of collision checks
> 
> 
> returns {**bool**}
> 
> 

---

#### collidable [setter]
> to use write **this.collidable = value**
> 
> indicates if this sprite should be considered during collision detection
> 
> 
> **Parameters**
> 
> {**bool**} **value** 
> 
> 

---

#### collisionPrimary [getter]
> to use write **this.collisionPrimary**
> 
> indicates if this sprite is a primary collider or not
> 
> 
> returns {**bool**}
> 
> 

---

#### collisionPrimary [setter]
> to use write **this.collisionPrimary = value**
> 
> if true then this sprite will check to see if it has hit other sprites
> 
> A corresponding collisionCallback should be creared to process these collisions
> 
> 
> **Parameters**
> 
> {**bool**} **value** set to true or false
> 
> 

---

#### dead [getter]
> to use write **this.dead**
> 
> returns true if sprite is dead, pending removal
> 
> removal can be halted by using resurrect in a funeral callback, if you have defined one or by overloading the kill() method and not calling super.kill()
> 
> 
> returns {**bool**}
> 
> ```js
> example
> this.resurrect();
> ```
> 

---

#### deltaposition [getter]
> to use write **this.deltaposition**
> 
> gets the distance (and direction moved by the sprite since last update) as a vector3
> 
> 
> returns {**vector3**}
> 
> 

---

#### deltapositionNegative [getter]
> to use write **this.deltapositionNegative**
> 
> gets the distance (and opposite direction moved by the sprite since last update) as a vector3
> 
> 
> returns {**vector3**}
> 
> 

---

#### e [getter]
> to use write **this.e**
> 
> collision co-efficient for energy loss
> 
> if 1 maintains 100% energy after collision,
> 
> less than 1 reduces energy, 0.75f would be 75%,
> 
> more than 1 increases energy, 1.25f would be 125% energy
> 
> 
> returns {**float**}
> 
> 

---

#### e [setter]
> to use write **this.e = value**
> 
> collision co-efficient for energy loss
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
>         if 1 maintains 100% energy after collision,
> 
>         less than 1 reduces energy, 0.75f would be 75%, 
> 
>         more than 1 increases energy, 1.25f would be 125% energy 
> ```
> 

---

#### friction [getter]
> to use write **this.friction**
> 
> gets the fake friction value of sprite
> 
> 0 is no friction
> 
> +ve values will reduce the sprites velocity (a value of 1 will take roughly 1 second to bring velocity down to zero )
> 
> -ve values will increase the sprites velocity
> 
> 
> returns {**float**}
> 
> 

---

#### friction [setter]
> to use write **this.friction = value**
> 
> applies a fake friction value to a sprite
> 
> 0 is no friction
> 
> +ve values will reduce the sprites velocity (a value of 1 will take roughly 1 second to bring velocity down to zero )
> 
> -ve values will increase the sprites velocity
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> this.friction = 0.5;
> ```
> 

---

#### gravitywell [getter]
> to use write **this.gravitywell**
> 
> gets the current gravity wells for this sprite - if non then null otherwise will be a list of wells
> 
> 
> returns {**[]GravityWell**}
> 
> 

---

#### gravitywell [setter]
> to use write **this.gravitywell = value**
> 
> adds a gravity well to this sprite
> 
> 
> **Parameters**
> 
> {**GravityWell**} **value** 
> 
> ```js
> example
>       this.gravitywell = new GravityWell(new vector3(width/2,height/2,0), 100); //set 100 GigaTon well at centre of screen
> ```
> 

---

#### height [getter]
> to use write **this.height**
> 
> gets the height of the sprite (as affected by the current y scale)
> 
> 
> returns {**float**}
> 
> 

---

#### inmotion [getter]
> to use write **this.inmotion**
> 
> returns true if the sprite moved since last frame
> 
> 

---

#### lasttrackposition [getter]
> to use write **this.lasttrackposition**
> 
> gets the last position occupied by a tracking sprite
> 
> 
> returns {**vector3**}
> 
> 

---

#### left [getter]
> to use write **this.left**
> 
> gets the x value of the left of the sprite (the x and y values represent the centre of a sprite)
> 
> 
> returns {**float**}
> 
> 

---

#### left [setter]
> to use write **this.left = value**
> 
> sets sprites bottom to be this value y value is adjusted accordingly (the x and y values represent the centre of a sprite)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> this.left = 450;
> ```
> 

---

#### moving [getter]
> to use write **this.moving**
> 
> true if the sprite is moving for collision response purposes default is true
> 
> 

---

#### moving [setter]
> to use write **this.moving = value**
> 
> sets the moving property, if false during collisions no momentum will be transferred during collision response
> 
> if sprites are not repsonding to collisions properly ensure this is set to true
> 
> 
> **Parameters**
> 
> {**bool**} **value** 
> 
> 

---

#### position [getter]
> to use write **this.position**
> 
> gets the sprites position (it's centre) as a vector3(x,y,z)
> 
> 
> returns {**vector3**}
> 
> 

---

#### position [setter]
> to use write **this.position = value**
> 
> sets the sprites position (it's centre) as a vector3(x,y,z)
> 
> 
> **Parameters**
> 
> {**vector3**} **value** 
> 
> 

---

#### radius [getter]
> to use write **this.radius**
> 
> a rough circular radius of the sprite, assuming the sprite is roughly square
> 
> 
> returns {**float**}
> 
> 

---

#### right [getter]
> to use write **this.right**
> 
> gets the x value of the right of the sprite (the x and y values represent the centre of a sprite)
> 
> 
> returns {**float**}
> 
> 

---

#### right [setter]
> to use write **this.right = value**
> 
> sets sprites bottom to be this value y value is adjusted accordingly (the x and y values represent the centre of a sprite)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> this.right = 200;
> ```
> 

---

#### scale [getter]
> to use write **this.scale**
> 
> gets the x and y scale as a vector2 value
> 
> 
> returns {**vector2**}
> 
> 

---

#### scale [setter]
> to use write **this.scale = value**
> 
> sets the x and y scale as a vector2 value
> 
> 
> **Parameters**
> 
> {**vector2**} **value** 
> 
> 

---

#### scale1d [getter]
> to use write **this.scale1d**
> 
> gets the singular scale of the sprite applied to both width and height
> 
> 
> returns {**float**}
> 
> 

---

#### scale1d [setter]
> to use write **this.scale1d = value**
> 
> applies a single scale value to the width and height of the sprite
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> this.scale = 2;
> ```
> 

---

#### scaleHeightTo [setter]
> to use write **this.scaleHeightTo = value**
> 
> sets the scale of the sprite to this exact height for current frame
> 
> keeping aspect ratio
> 
> 
> **Parameters**
> 
> {**float**} **height** 
> 
> 

---

#### scaleTo [setter]
> to use write **this.scaleTo = value**
> 
> Makes the sprite appear this exact size (for the current frame)
> 
> 
> **Parameters**
> 
> {**{w:float,y:float}|vector2|vector3**} **size** 
> 
> 

---

#### scaleWidthTo [setter]
> to use write **this.scaleWidthTo = value**
> 
> sets the scale of the sprite to this exact width for current frame
> 
> keeping aspect ratio
> 
> 
> **Parameters**
> 
> {**float**} **width** 
> 
> 

---

#### sx [getter]
> to use write **this.sx**
> 
> gets the scale for the width of the sprite
> 
> 
> returns {**float**}
> 
> 

---

#### sx [setter]
> to use write **this.sx = value**
> 
> sets the scale for the width of the sprite
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> this.sx = 4;
> ```
> 

---

#### sy [getter]
> to use write **this.sy**
> 
> gets the scale for the height of the sprite
> 
> 
> returns {**float**}
> 
> 

---

#### sy [setter]
> to use write **this.sy = value**
> 
> sets the scale for the height of the sprite
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> this.sy = 0.5;
> ```
> 

---

#### timer [getter]
> to use write **this.timer**
> 
> get the timer for basic sprite actions
> 
> by default this is null, no timer
> 
> 
> returns {**Timer**}
> 
> 

---

#### timer [setter]
> to use write **this.timer = value**
> 
> holds the basic sprite timer actions
> 
> create the timer with @example  this.timer = new Timer(this)
> 
> 
> **Parameters**
> 
> {**Timer**} **value** 
> 
> 

---

#### top [getter]
> to use write **this.top**
> 
> gets the y value of the top of the sprite (the x and y values represent the centre of a sprite)
> 
> 
> returns {**float**}
> 
> 

---

#### top [setter]
> to use write **this.top = value**
> 
> sets sprites bottom to be this value y value is adjusted accordingly (the x and y values represent the centre of a sprite)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> this.top = 0; //sprite aligned with top at top of screen
> ```
> 

---

#### velocity [getter]
> to use write **this.velocity**
> 
> gets the velocity of the sprite as a vector3(x,y,z)
> 
> 
> returns {**vector3**}
> 
> 

---

#### velocity [setter]
> to use write **this.velocity = value**
> 
> sets the velocity of the sprite as a vector3(x,y,z)
> 
> 
> **Parameters**
> 
> {**vector3**} **value** 
> 
> ```js
> example
> this.velocity = new vector3(100,0,0); // 100 pixels per second in x direction
> ```
> 

---

#### visible [getter]
> to use write **this.visible**
> 
> returns true if sprite is set to be displayed
> 
> use show() hide() to manipulate this
> 
> 
> returns {**bool**}
> 
> 

---

#### visible [setter]
> to use write **this.visible = value**
> 
> sets the visible state of the sprite true, means show, false means hide
> 
> if hide and show callbacks are set then these will be called appropriately
> 
> 
> **Parameters**
> 
> {**bool**} **value** 
> 
> ```js
> example
>      //toggle visibility
>      this.visible = !this.visible;
> ```
> 

---

#### vr [getter]
> to use write **this.vr**
> 
> gets the rotation velocity in degrees per second
> 
> 

---

#### vr [setter]
> to use write **this.vr = value**
> 
> specifies a rotation velocity for the sprite in degrees per second
> 
> ```js
> example
> this.vr = 180; // spin a full revolution in 2 seconds
>     
> ```
> 

---

#### vrR [getter]
> to use write **this.vrR**
> 
> gets the rotation velocity in radians per second
> 
> 
> returns {**flloat**} degrees per seo
> 
> 

---

#### vrR [setter]
> to use write **this.vrR = value**
> 
> specifies a rotation velocity for the sprite in radian per second
> 
> 
> **Parameters**
> 
> {**float**} **value** the radians per second you wish the sprite to rotate at
> 
> ```js
> example
> this.vrR = Math.PI; // spin a full revolution in 2 seconds
> ```
> 

---

#### vx [getter]
> to use write **this.vx**
> 
> sets the x velocity of the sprite -ve is left +ve right
> 
> 
> returns {**float**}
> 
> 

---

#### vx [setter]
> to use write **this.vx = value**
> 
> sets the x velocity of the sprite -ve is left +ve right
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> this.vx = 100; //100 pixels per second right
> ```
> 

---

#### vy [getter]
> to use write **this.vy**
> 
> gets the y velocity of the sprite -ve is up +ve down
> 
> 
> returns {**float**}
> 
> 

---

#### vy [setter]
> to use write **this.vy = value**
> 
> sets the y velocity of the sprite -ve is up +ve down
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> this.vy = -100; // 100 pixels per second upwards
> ```
> 

---

#### vz [getter]
> to use write **this.vz**
> 
> gets the z velocity of the sprite -ve is into the screen +ve is forward
> 
> 
> returns {**float**}
> 
> 

---

#### vz [setter]
> to use write **this.vz = value**
> 
> sets the z velocity of the sprite -ve is into the screen +ve is forward
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> this.vz = -100; //100 pixels per second into the screen
> ```
> 

---

#### width [getter]
> to use write **this.width**
> 
> gets the width of the sprite (as affected by the current x scale)
> 
> 
> returns {**float**}
> 
> 

---

#### x [getter]
> to use write **this.x**
> 
> sets the sprites x position (currently the centre of the sprite)
> 
> 
> returns {**float**}
> 
> 

---

#### x [setter]
> to use write **this.x = value**
> 
> sets the sprites x position (currently the centre of the sprite)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

#### y [getter]
> to use write **this.y**
> 
> gets the sprites y position (currently the centre of the sprite)
> 
> 
> returns {**float**}
> 
> 

---

#### y [setter]
> to use write **this.y = value**
> 
> sets the sprites y position (currently the centre of the sprite)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

#### z [getter]
> to use write **this.z**
> 
> gets the sprites z position (not currently used but will influence draw order) could be used for depth based scaling
> 
> smaller is further away
> 
> 
> returns {**float**}
> 
> 

---

#### z [setter]
> to use write **this.z = value**
> 
> sets the sprites z position (not currently used but will influence draw order) could be used for depth based scaling
> 
> smaller is further away
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

## Methods
#### cleanup()
> to use write **this.cleanup()**
> 
> removes any references when a sprite is killed or romved from the sprite manager
> 
> if you have added object references in an inherited sprite you should provide a cleanup() method to remove
> 
> those specific ones. make sure you call super.cleanup() if you create one
> 
> ```js
> example
>           cleanup(){
>                 super.cleanup();
>                 //get rid of custome timer
>                 this.shoottimer.remove();
>                 //get rid of child sprites
>                 this.frontdetector.kill();
>                 this.reardetector.kill();
>             }
>      
> ```
> 

---

#### cliplimit()
> to use write **this.cliplimit()**
> 
> use the limit area as the clip region for the sprite
> 
> if the limit is not specified then clipping remains off
> 
> ```js
> example
> this.cliplimit();`
>     
> ```
> 

---

#### clipoff()
> to use write **this.clipoff()**
> 
> stops clipping (the default)
> 
> 

---

#### clipon()
> to use write **this.clipon()**
> 
> turns clipping on if we have a limit defined or a cliparea defined
> 
> //if not then you should set this
> 
> 

---

#### draw()
> to use write **this.draw()**
> 
> Draws the sprite
> 
> 

---

#### faceDirection(direction, additionalAngle)
> to use write **this.faceDirection(direction, additionalAngle)**
> 
> rotates a sprite so it is turned in the same direction as the given vector
> 
> 
> **Parameters**
> 
> {**vector3**} **direction** vector to rotate the sprite to point in the direction of
> 
> {**float**} **additionalangle** amount in degrees
> 
> 

---

#### faceMyMovement(additionalangle)
> to use write **this.faceMyMovement(additionalangle)**
> 
> rotates the sprite so it is pointing in the direction of it's motion
> 
> This is independent of the velocity so will work for manual and track based motion
> 
> 
> **Parameters**
> 
> {**float**} **additionalangle** amount in degrees
> 
> ```js
> example
>       this.faceMyDirection(); // point in direction moving (forwards)
>       this.faceMyDirection(180); // point opposite to direction (backwards)
> ```
> 

---

#### faceMyVelocity(additionalangle)
> to use write **this.faceMyVelocity(additionalangle)**
> 
> rotates sprite so it is turned in the same direction it is moving
> 
> 
> **Parameters**
> 
> {**float**} **additionalangle** amount in degrees
> 
> 

---

#### hide()
> to use write **this.hide()**
> 
> makes this sprite invisible/won't be rendered calling the hide callback if set
> 
> ```js
> example
> this.hide();
>     
> ```
> 

---

#### intersectBC(other)
> to use write **this.intersectBC(other)**
> 
> returns true if the sprite circlular area is ovelapping the given sprites circlular area
> 
> 
> returns {**bool**}
> 
> 
> **Parameters**
> 
> {**Sprite**} **Sprite}** 
> 
> 

---

#### isover(x,y)
> to use write **this.isover(x,y)**
> 
> returns true if given position is over this sprite
> 
> 
> returns {**bool**}
> 
> 
> **Parameters**
> 
> {**float**} **x** 
> 
> {**float**} **y** 
> 
> 

---

#### kill()
> to use write **this.kill()**
> 
> kills the sprite, calling a funeral callback if set
> 
> ```js
> example
> this.kill();
>     
> ```
> 

---

#### myDirection(additionalAngle)
> to use write **this.myDirection(additionalAngle)**
> 
> 
> returns {**vector3**} a normalised direction vector
> 
> 
> **Parameters**
> 
> {**float**} **additionalAngle** a further angle to add on to sprites direction. Use 180 to get your opposite direction or 90/-90 for normals
> 
> 

---

#### resurrect()
> to use write **this.resurrect()**
> 
> use this in a sprite callBackFuneral to stop a dead sprite being removed
> 
> 

---

#### setmetrics()
> to use write **this.setmetrics()**
> 
> forces metric calculations, use this if you have a reference to a sprite,
> 
> in normal circumstances you never need to call this
> 
> 

---

#### show()
> to use write **this.show()**
> 
> makes this sprite visible/renders if on screen calling the show callback if set
> 
> ```js
> example
> this.show();
>      
> ```
> 

---

#### update()
> to use write **this.update()**
> 
> performs all the update mechanisms for a sprite
> 
> 

---

#### velocityFromMovement(speed)
> to use write **this.velocityFromMovement(speed)**
> 
> NOT IMPLEMENTED YET
> 
> takes the sprites movement delta and sets a velocity to continue in this direction
> 
> Could be used to take over motion of a player controlled character or if you detatch a sprite
> 
> from a track
> 
> if speed is omitted then the direction is taken as a fraction of the overall delta and a velocity is computed
> 
> to try and carry on the current movement speed
> 
> 
> **Parameters**
> 
> {**float**} **speed** 
> 
> 

---

#### velocityInCurrentDirection(speed, additionalAngle)
> to use write **this.velocityInCurrentDirection(speed, additionalAngle)**
> 
> takes rotation angle of sprite and sets the velocity to move in this direction
> 
> 0 degrees is up
> 
> 
> **Parameters**
> 
> {**float**} **speed** the speed in pixels per second
> 
> {**float**} **additionalangle** amount in degrees
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
