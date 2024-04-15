> ### class Sprite
> for drawing and manipulating moving graphic objects
> 
> create your own sprites by extending the Sprite class
> 
> it's important to clone object values as you'll generally want a new object (with the values) rather than a reference to the original vector3 object
> 
> 

---

> #### clickable = false
> set to true to enable clicking
> 
> 
> {**bool**}
> 
> 

---

> #### dragging = false // Is the object being dragged?
> NOT CURRENTLY IN USE @type {bool}
> 
> 

---

> #### #visW
> 
> {**float**} on screen width
> 
> 

---

> #### #visH
> 
> {**float**} on screen height
> 
> 

---

> #### #visWdiv2
> 
> {**float**} on screen half width
> 
> 

---

> #### #visHdiv2
> 
> {**float**} on screen half height
> 
> 

---

> #### #renderrectangle = Rectangle.zero
> 
> {**Rectangle**} rectangluar area of sprite
> 
> 

---

> #### showRenderArea = null
> if a colour is set then the render rectangle/circle will be shown for the sprite in the specified colour
> 
> set to null to not show the renderarea of the sprite
> 
> 
> {**colour**}
> 
> 

---

> #### frame
> holds the animation system for the sprite
> 
> you need to define frames and animations through the frame object
> 
> 
> {**Animator**}
> 
> ```js
> example
>       
>      this.frame.define(txsprite, new Rectangle(138,213,32,32));//blinky 0
>      this.frame.define(txsprite, new Rectangle(172,213,32,32));//blinky 1
> ```
> 

---

> #### #position
> 
> {**vector3**}
> 
> 

---

> #### #angle
> 
> {**float**}
> 
> 

---

> #### #scale
> 
> {**vector2**}
> 
> 

---

> #### #moving = true
> 
> {**bool**}
> 
> 

---

> #### align = Align.centre
> specifies how sprite is drawn compared to its x and y positions, default is
> 
> 
> {**Align**}
> 
> ```js
> example
> ```
> 

---

> #### lastposition = vector3.zero
> holds the last position the sprite was at
> 
> 

---

> #### updatePeriod = 0
> the update period (in seconds) for the sprite to force the update to only occur now and then, just like space invaders movement
> 
> 
> {**float**} time interval to wait between updates
> 
> 

---

> #### elapsedTime = 0
> keeps track of the time elapsed if a sprite is using an updatePeriod.
> 
> Do not change this value
> 
> 
> {**float**}
> 
> 

---

> #### #clip = false
> 
> {**bool**} whether clipping is active
> 
> 

---

> #### #cliplimit = false
> 
> {**bool**}
> 
> 

---

> #### #cliparea = null
> holds the clip area for the sprite if manually specified
> 
> 

---

> #### updateMode = UpdateMode.auto
> how sprite is updated - defaults to auto where sprite updates every frame using velocity,gravity and gravity wells to change position
> 
> 
> {**UpdateMode**}
> 
> 

---

> #### #deltaposition = vector3.down
> 
> {**vector3**}
> 
> 

---

> #### angularDirectionTo(to, minimumAngle)
> Determines if  rotating clockwise or anticlockwise is closest for a sprite to turn towards a  position
> 
> Useful for create homing and tracking effects, returns -1 if turned anti-clocwise, 1 if clockwise or 0 if didn't turn
> 
> 

---

> #### #velocity
> 
> {**vector3**}
> 
> 

---

> #### #friction
> friction value @type {float}
> 
> 

---

> #### #e = 1
> the energy reduction co-efficient @type {float}
> 
> 

---

> #### energylevel = 1
> a value that is multiplied by the collision co-efficient each time it is sampled
> 
> this happens whenever the value of e is samples/used in a collision
> 
> this value can be used to trigger other actions like removing velocity if the energy value
> 
> falls below as certain number
> 
> 
> {**float**}
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

> #### gravity = null
> gravity vector in 3d, to apply to the sprite, set to null to turn gravity off (default)
> 
> 

---

> #### #gravitywell = null
> gravity well objects, for this sprite there can be more than one - to be implemented
> 
> 
> {**[]GravityWell**}
> 
> 

---

> #### gravityrough = true
> if true a quick calculation of gravitional force is computed rather than GMMr2
> 
> (default true)
> 
> 
> {**bool**}
> 
> 

---

> #### vscale = vector2.zero;
> holds the scale percentage increase per second to apply to the sprite vector2(0,0) is the default, no scaling
> 
> 
> {**vector2**}
> 
> ```js
> example
>       this.vscale = vector2(1,1); //would be 100% per second
> ```
> 

---

> #### mass = 100
> holds the mass of the sprite in Kg used for gravity calculations (default will be set to number of non alpha pixels)
> 
> defaults to 100 (if you don't set it)
> 
> 
> {**float**}
> 
> 

---

> #### world = true//x y coords tied to world of just viewport region
> specifies if position is relative to the canvas view or the world co-ordinates which may be large.
> 
> default is world (true),
> 
> set to false to draw at same position in viewport despite any scrolling or offset of the world
> 
> 
> {**bool**}
> 
> 

---

> #### track = null
> holds a reference to the track manager for the sprite, this has to be explicitly set in your sprites constructor
> 
> 
> {**TrackManager**}
> 
> ```js
> example
>       this.track = new TrackManager(this);
> ```
> 

---

> #### #lasttrackposition = vector3.zero
> 
> {**vector3**}
> 
> 

---

> #### workin3d = true
> do we want to work with z co-ordinates default if true (not implemented fully yet)
> 
> 
> {**bool**}
> 
> 

---

> #### layer
> which drawing layer to render the sprite on
> 
> layers are rendered from lowest to highest (0 - 3)
> 
> 
> {**texture**}
> 
> ```js
> example
>      this.layer = Engine.layer(0); //to set on layer 0 (back layer)
> ```
> 

---

> #### limit = null
> determines if the sprite reacts to a specified rectangular boundary, see Limit static member functions for limit modes
> 
> must be set in the constructor
> 
> 
> {**Limit**}
> 
> ```js
> example
>     this.limit = new Limit(Limit.wrap, Engine.mainview);
> ```
> 

---

> #### history = null
> holdsd refence to history object for this sprite, defaults to null.
> 
> You must create this in your constructor if you wish to use history effects
> 
> 
> {**History**}
> 
> ```js
> example
>       this.history = new History(this);
> ```
> 

---

> #### //callbackHide = null
> method called when the sprite is hidden with
> 
> or settting visible to false, or from flashing
> 
> ```js
> example
> ```
> 

---

> #### #callbackShow = null
> method called when the sprite is shown with show() or setting visible to true
> 
> 

---

> #### #callbackFuneral = null
> method called when a sprite is destroyed using kill()
> 
> 

---

> #### #collidable = false
> must be set to true for sprite to be involved in collisions
> 
> 

---

> #### #collisionPrimary = false
> if true then this sprites callbackCollide is called during collisions
> 
> 

---

> #### collisionList
> a list of object types to check in the sprite list for collision, only those in the list will be checked
> 
> This only applies to sprites that are collisionPrimary
> 
> 
> {**[]object**} an array containing the object types that should be checked for, use a list [Sprite] to include all sprites
> 
> ```js
> example
> ```
> 

---

> #### myid
> represents a unique id for a sprite
> 
> This can be used in debugging making a conditional breakpoint when a specific sprite id is being processed
> 
> You shouldn't change this value
> 
> 
> {**int**}
> 
> 

---

> #### shape = Shape.circle
> specifies the rough shape of the sprite (not currently used but will eventually affect collision detection)
> 
> 
> {**Shape**}
> 
> 

---

> #### paused = false
> if true then sprite will not perform updates (it will still be rendered)
> 
> 
> {**bool**}
> 
> 

---

> #### showclip = null
> holds a colour to show the limit box of this sprite
> 
> If null (default) box not shown
> 
> if a colour is stored then it will be drawn (use alpha values so you can see the sprite)
> 
> 
> {**color**}
> 
> ```js
> example
>       //show transparent blue clip box
>       this.showclip = [0,0,255,100];
> ```
> 

---

> #### getter inmotion
> returns true if the sprite moved since last frame
> 
> 

---

> #### getter moving
> true if the sprite is moving for collision response purposes default is true
> 
> 

---

> #### setter moving
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

> #### getter static
> true if the sprite is not moving for collision response purposes default is false
> 
> 
> returns {**bool**}
> 
> 

---

> #### setter static
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

> #### getter alpha
> gets the current alpha value of the sprite between 1 - opaque and 0 transparent.
> 
> default 1
> 
> 
> returns {**float**}
> 
> ```js
> example
> ```
> 

---

> #### setter alpha
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
> ```
> 

---

> #### getter deltaposition
> gets the distance (and direction moved by the sprite since last update) as a vector3
> 
> 
> returns {**vector3**}
> 
> 

---

> #### getter deltapositionNegative
> gets the distance (and opposite direction moved by the sprite since last update) as a vector3
> 
> 
> returns {**vector3**}
> 
> 

---

> #### getter e
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

> #### setter e
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

> #### getter gravitywell
> gets the current gravity wells for this sprite - if non then null otherwise will be a list of wells
> 
> 
> returns {**[]GravityWell**}
> 
> 

---

> #### setter gravitywell
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

> #### getter lasttrackposition
> gets the last position occupied by a tracking sprite
> 
> 
> returns {**vector3**}
> 
> 

---

> #### getter callbackHide
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

> #### setter callbackHide
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
>       this.callbackHide = {callback:this.hidesound,instance:this};
>       // or use the Engine.makeCallback() method
>       this.callbackHide = Engine.makeCallback(this.hidesound, this);
>      
> ```
> 

---

> #### getter callbackShow
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

> #### setter callbackShow
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
>       this.callbackShow = {callback:this.showsound,instance:this};
>       // or use the Engine.makeCallback() method
>       this.callbackShow = Engine.makeCallback(this.showsound, this);
>      
> ```
> 

---

> #### getter callbackCollide
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

> #### setter callbackCollide
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

> #### getter callbackFuneral
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

> #### setter callbackFuneral
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

> #### getter collidable
> indicates whether this sprite is part of collision checks
> 
> 
> returns {**bool**}
> 
> 

---

> #### setter collidable
> indicates if this sprite should be considered during collision detection
> 
> 
> **Parameters**
> 
> {**bool**} **value** 
> 
> 

---

> #### getter collisionPrimary
> indicates if this sprite is a primary collider or not
> 
> 
> returns {**bool**}
> 
> 

---

> #### setter collisionPrimary
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

> #### getter dead
> returns true if sprite is dead, pending removal
> 
> removal can be halted by using resurrect in a funeral callback, if you have defined one or by overloading the kill() method and not calling super.kill()
> 
> 
> returns {**bool**}
> 
> ```js
> example
> ```
> 

---

> #### getter alive
> returns true if the sprite is still actively being processed and displayed
> 
> 
> returns {**bool**}
> 
> 

---

> #### getter angle
> gets the rotation angle of the sprite in degrees
> 
> 
> returns {**float**} in degrees
> 
> 

---

> #### setter angle
> sets the rotation angle of the sprite in degrees
> 
> 
> **Parameters**
> 
> {**float**} **value** in degrees (0 is north, default orientation)
> 
> ```js
> example
> ```
> 

---

> #### getter angleR
> gets the angle of the sprite in radians (for trig work)
> 
> 
> returns {**float**} in radians
> 
> 

---

> #### setter angleR
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

> #### getter scale1d
> gets the singular scale of the sprite applied to both width and height
> 
> 
> returns {**float**}
> 
> 

---

> #### setter scale1d
> applies a single scale value to the width and height of the sprite
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> ```
> 

---

> #### getter scale
> gets the x and y scale as a vector2 value
> 
> 
> returns {**vector2**}
> 
> 

---

> #### setter scale
> sets the x and y scale as a vector2 value
> 
> 
> **Parameters**
> 
> {**vector2**} **value** 
> 
> 

---

> #### getter sx
> gets the scale for the width of the sprite
> 
> 
> returns {**float**}
> 
> 

---

> #### setter sx
> sets the scale for the width of the sprite
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> ```
> 

---

> #### getter sy
> gets the scale for the height of the sprite
> 
> 
> returns {**float**}
> 
> 

---

> #### setter sy
> sets the scale for the height of the sprite
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> ```
> 

---

> #### setter scaleTo
> Makes the sprite appear this exact size (for the current frame)
> 
> 
> **Parameters**
> 
> {**{w:float,y:float}|vector2|vector3**} **size** 
> 
> 

---

> #### setter scaleWidthTo
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

> #### setter scaleHeightTo
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

> #### getter timer
> get the timer for basic sprite actions
> 
> by default this is null, no timer
> 
> 
> returns {**Timer**}
> 
> 

---

> #### setter timer
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

> #### getter visible
> returns true if sprite is set to be displayed
> 
> use show() hide() to manipulate this
> 
> 
> returns {**bool**}
> 
> 

---

> #### setter visible
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

> #### getter position
> gets the sprites position (it's centre) as a vector3(x,y,z)
> 
> 
> returns {**vector3**}
> 
> 

---

> #### setter position
> sets the sprites position (it's centre) as a vector3(x,y,z)
> 
> 
> **Parameters**
> 
> {**vector3**} **value** 
> 
> 

---

> #### getter x
> sets the sprites x position (currently the centre of the sprite)
> 
> 
> returns {**float**}
> 
> 

---

> #### setter x
> sets the sprites x position (currently the centre of the sprite)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

> #### getter y
> gets the sprites y position (currently the centre of the sprite)
> 
> 
> returns {**float**}
> 
> 

---

> #### setter y
> sets the sprites y position (currently the centre of the sprite)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

> #### getter z
> gets the sprites z position (not currently used but will influence draw order) could be used for depth based scaling
> 
> smaller is further away
> 
> 
> returns {**float**}
> 
> 

---

> #### setter z
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

> #### getter width
> gets the width of the sprite (as affected by the current x scale)
> 
> 
> returns {**float**}
> 
> 

---

> #### getter height
> gets the height of the sprite (as affected by the current y scale)
> 
> 
> returns {**float**}
> 
> 

---

> #### getter centre
> gets the centre of the sprite as a vector3 object
> 
> 
> returns {**vector3**}
> 
> 

---

> #### setter centre
> sets the centre of the sprite based on it's alignment using a vector3 value
> 
> 
> **Parameters**
> 
> {**vector3**} **value** 
> 
> 

---

> #### getter centrex
> returns the x centre of the sprite (same a y currently)
> 
> 
> returns {**float**}
> 
> 

---

> #### setter centrex
> Sets the horizontal centre of the sprite (taking alignment into account)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

> #### getter centrey
> returns the y centre of the sprite (same a y currently)
> 
> 
> returns {**float**}
> 
> 

---

> #### setter centrey
> Sets the vertical centre of the sprite (taking alignment into account)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

> #### getter centreoffx
> gets the x offset to its centre (half the width)
> 
> 
> returns {**float**}
> 
> 

---

> #### getter centreoffy
> gets the y offset to its centre (half the height)
> 
> 
> returns {**float**}
> 
> 

---

> #### getter left
> gets the x value of the left of the sprite (the x and y values represent the centre of a sprite)
> 
> 
> returns {**float**}
> 
> 

---

> #### setter left
> sets sprites bottom to be this value y value is adjusted accordingly (the x and y values represent the centre of a sprite)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> ```
> 

---

> #### getter right
> gets the x value of the right of the sprite (the x and y values represent the centre of a sprite)
> 
> 
> returns {**float**}
> 
> 

---

> #### setter right
> sets sprites bottom to be this value y value is adjusted accordingly (the x and y values represent the centre of a sprite)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> ```
> 

---

> #### getter top
> gets the y value of the top of the sprite (the x and y values represent the centre of a sprite)
> 
> 
> returns {**float**}
> 
> 

---

> #### setter top
> sets sprites bottom to be this value y value is adjusted accordingly (the x and y values represent the centre of a sprite)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> ```
> 

---

> #### getter bottom
> gets the y value of the bottom of the sprite (the x and y values represent the centre of a sprite)
> 
> 
> returns {**float**}
> 
> 

---

> #### setter bottom
> sets sprites bottom to be this value y value is adjusted accordingly (the x and y values represent the centre of a sprite)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> ```
> 

---

> #### getter radius
> a rough circular radius of the sprite, assuming the sprite is roughly square
> 
> 
> returns {**float**}
> 
> 

---

> #### getter bradius
> NOT IN USE a rough circular radius of the sprite
> 
> 
> returns {**float**}
> 
> 

---

> #### getter friction
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

> #### setter friction
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
> ```
> 

---

> #### getter velocity
> gets the velocity of the sprite as a vector3(x,y,z)
> 
> 
> returns {**vector3**}
> 
> 

---

> #### setter velocity
> sets the velocity of the sprite as a vector3(x,y,z)
> 
> 
> **Parameters**
> 
> {**vector3**} **value** 
> 
> ```js
> example
> ```
> 

---

> #### getter vx
> sets the x velocity of the sprite -ve is left +ve right
> 
> 
> returns {**float**}
> 
> 

---

> #### setter vx
> sets the x velocity of the sprite -ve is left +ve right
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> ```
> 

---

> #### getter vy
> gets the y velocity of the sprite -ve is up +ve down
> 
> 
> returns {**float**}
> 
> 

---

> #### setter vy
> sets the y velocity of the sprite -ve is up +ve down
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> ```
> 

---

> #### getter vz
> gets the z velocity of the sprite -ve is into the screen +ve is forward
> 
> 
> returns {**float**}
> 
> 

---

> #### setter vz
> sets the z velocity of the sprite -ve is into the screen +ve is forward
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> ```js
> example
> ```
> 

---

> #### getter vr
> gets the rotation velocity in degrees per second
> 
> 

---

> #### setter vr
> specifies a rotation velocity for the sprite in degrees per second
> 
> ```js
> example
>     
> ```
> 

---

> #### getter vrR
> gets the rotation velocity in radians per second
> 
> 
> returns {**flloat**} degrees per seo
> 
> 

---

> #### setter vrR
> specifies a rotation velocity for the sprite in radian per second
> 
> 
> **Parameters**
> 
> {**float**} **value** the radians per second you wish the sprite to rotate at
> 
> ```js
> example
> ```
> 

---

> #### getter cliparea
> gets the current clip area
> 
> 
> returns {**Rectangle**}
> 
> 

---

> #### setter cliparea
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

> #### isover(x,y)
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

> #### setmetrics()
> forces metric calculations, use this if you have a reference to a sprite,
> 
> in normal circumstances you never need to call this
> 
> 

---

> #### faceMyMovement(additionalangle)
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

> #### faceMyVelocity(additionalangle)
> rotates sprite so it is turned in the same direction it is moving
> 
> 
> **Parameters**
> 
> {**float**} **additionalangle** amount in degrees
> 
> 

---

> #### faceDirection(direction, additionalAngle)
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

> #### velocityInCurrentDirection(speed, additionalAngle)
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

> #### myDirection(additionalAngle)
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

> #### velocityFromMovement(speed)
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

> #### constructor()
> create a new sprite
> 
> make sure in your constructor after calling super() that you add the sprite to the Engine for processing to occur
> 
> ```js
> example
>      
> ```
> 

---

> #### cleanup()
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

> #### intersectBC(other)
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

> #### resurrect()
> use this in a sprite callBackFuneral to stop a dead sprite being removed
> 
> 

---

> #### show()
> makes this sprite visible/renders if on screen calling the show callback if set
> 
> ```js
> example
>      
> ```
> 

---

> #### hide()
> makes this sprite invisible/won't be rendered calling the hide callback if set
> 
> ```js
> example
>     
> ```
> 

---

> #### update()
> performs all the update mechanisms for a sprite
> 
> 

---

> #### kill()
> kills the sprite, calling a funeral callback if set
> 
> ```js
> example
>     
> ```
> 

---

> #### cliplimit()
> use the limit area as the clip region for the sprite
> 
> if the limit is not specified then clipping remains off
> 
> ```js
> example
>     
> ```
> 

---

> #### clipoff()
> stops clipping (the default)
> 
> 

---

> #### clipon()
> turns clipping on if we have a limit defined or a cliparea defined
> 
> //if not then you should set this
> 
> 

---

> #### draw()
> Draws the sprite
> 
> 

---

