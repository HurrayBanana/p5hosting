> ### class Animator
> @classdesc manages frames and display of frames for a sprite
> 
> 

---

> #### #frame
> holds all the defined frames for this sprite @type {{tex:texture,port:portion}[]}
> 
> 

---

> #### boss
> reference to the sprite that owns these frames @type {Sprite}
> 
> 

---

> #### state
> holds the current animation state @type {AnimationState}
> 
> 

---

> #### allowduplicate = false
> controls overwriting of the animation state with the same setting (default is false)
> 
> if set to true and you set the same animation state every frame then the animation will be stuck on the
> 
> first frame of the animation. if false duplicate settings will be rejected allowing the animation to work despite
> 
> being continuosly set
> 
> 
> {**bool**}
> 
> 

---

> #### #changedframe
> 
> {**bool**} keeps track of animation changes during updates
> 
> 

---

> #### first() {this.state.active = this.state.firstthis.#changedframe = true;this.boss.setmetrics();}
> sets the frame to the first one in the currently defined animation state
> 
> 

---

> #### last() {this.state.active = this.state.lastthis.#changedframe = true;this.boss.setmetrics();}
> sets the frame to the last one in the currently defined animation state
> 
> 

---

> #### defineSliding(texture, portion, slide, steps)
> Creates animation frames automatically for an sliding sprite ( a graphic split into
> 
> several sections along its width or height)
> 
> 

---

> #### getter animating
> 
> returns {**bool**} returns true if an animation state is currently active for this sprite
> 
> 

---

> #### getter active
> 
> returns {**int**} active display frame number (-1 would indicate no frames available for this sprite
> 
> 

---

> #### setter active
> 
> **Parameters**
> 
> {***  {int**} **value** sets the active frame for display, allowing the ability to make your own custom animator
> 
> 

---

> #### getter firstframe
> 
> returns {**int**} gets the first frame defined for the sprite will be -1 if no frames defined or 0 if they are
> 
> 

---

> #### getter lastframe
> 
> returns {**int**} gets the last frame defgined for the sprite -1 if no frames defined
> 
> 

---

> #### getter firstAnmiationFrame
> 
> returns {**int**} gets the first frame for the current animation state if no animation range set then -1 is returned
> 
> 

---

> #### getter lastAnimationFrame
> 
> returns {**int**} gets the last frame for the current animation state if no animation range set the -1 is returned
> 
> 

---

> #### getter currenttex
> 
> returns {**texture**} gets a reference to the texture being used by the current active frame
> 
> 

---

> #### getter currentport
> 
> returns {**rectangle**} gets a reference to the rectangluar potion used for the current active frame
> 
> 

---

> #### getter count
> 
> returns {**in**} number of frames defined for the sprite
> 
> 

---

> #### getter clonecurrent
> 
> returns {**{tex:texture,port:rectangle**} gets a duplicate frame for thecurrent frame texture and rectangular portion in the form of an object {tex:texture,port:rectangle};
> 
> 

---

> #### getter current
> 
> returns {**{tex:texture,port:rectangle**} gets a reference to the current frame information in the form of an object {tex:texture,port:rectangle};
> 
> 

---

> #### constructor(me)
> defines an instance of the animation and frame system
> 
> 
> **Parameters**
> 
> {**Sprite**} **me** the sprite controlling this animator
> 
> 

---

> #### cleanup()
> releases references from the animator
> 
> 

---

> #### #setlastaction(action)
> disabled, sets lastAction but shouldn't meddle directly
> 
> 
> **Parameters**
> 
> {**LastAction**} **action** action to set
> 
> 

---

> #### animateonupdate(lastAction,  startFrame, endFrame)
> creates an animation where they frame will change every time the sprite updates.
> 
> This is only useful if you change the updatePeriod of the sprite and will give an animation style similar to space invaders
> 
> 
> **Parameters**
> 
> {**LastAction**} **lastAction** action to perform when animation reaches endFrame
> 
> {**int**} **startFrame** first frame of the animation
> 
> {**int**} **endFrame** final frame of the animation
> 
> 

---

> #### animateondistance(distance, lastAction,  startFrame, endFrame)
> creates an animation where they frame will change every time the sprite has moved a particular distance
> 
> This is only useful if you change the frame for walking/tank tracks where the graphic shows contact with a surface.
> 
> playing with the distance is crucial so you don't get a scooby doo sliding walk (unless that's what you want)
> 
> if you speed up or down the movement of the sprite the animation will speed up or slow down accordingly
> 
> 
> **Parameters**
> 
> {**float**} **distance** the number of pixels moved that will cause the next animation frame to appear. Internally this is tracked as a square distance to eliminate the need for square root calculations
> 
> {**LastAction**} **lastAction** action to perform when animation reaches endFrame
> 
> {**int**} **startFrame** first frame of the animation
> 
> {**int**} **endFrame** final frame of the animation
> 
> 

---

> #### animateonrate(period,  lastAction,  startFrame, endFrame)
> creates an animation where they frame will change every time a time period has elapsed
> 
> This is the classic mode of animation, frame rate animation, great for explosion sprites and sliding effects
> 
> if you want to think in terms of frames divide the number of frames you want an animation to appear by 60. e.g. if you want an image to appear 5 seconds set the period to 5/60
> 
> 
> **Parameters**
> 
> {**float**} **period** the time in seconds ext animation frame to appear. Internally this is tracked as a square distance to eliminate the need for square root calculations
> 
> {**LastAction**} **lastAction** action to perform when animation reaches endFrame
> 
> {**int**} **startFrame** first frame of the animation
> 
> {**int**} **endFrame** final frame of the animation
> 
> 

---

> #### animateonmanual(lastAction, startFrame, endFrame, callback)
> sets up manual animation, this lets you build any type of animation system you wish (could be based on user input if required)
> 
> use next(), previous(), first(), last() and show(int) methods to manipulate the animation
> 
> 
> **Parameters**
> 
> {**LastAction**} **lastAction** action to perform when animation reaches endFrame
> 
> {**int**} **startFrame** first frame of the animation
> 
> {**int**} **endFrame** final frame of the animation
> 
> {**{callback:method|function,instance:object}**} **callback** 
> 
> 

---

> #### nomethod()
> empty method thatjust returns, called during update of animation
> 
> 

---

> #### onrate()
> don't call drectly, handles th update logic for onrate animations
> 
> 

---

> #### ondistance()
> don't call drectly, handles th update logic for ondistance animations
> 
> 

---

> #### onupdate()
> don't call drectly, handles th update logic for onupdate animations
> 
> 

---

> #### onmanual()
> this will be called during manual animation operations, inherit from this to have your own code called if you use a manual animation
> 
> 

---

> #### update()
> perfors the update for particular mdoes
> 
> 
> returns {**bool**} true if animation frame did change
> 
> 

---

> #### show(thisFrame)
> shows a specific frame (for manual animations)
> 
> 
> **Parameters**
> 
> {**int**} **thisFrame** if the frame is outside the ones defined it will be cropped to that range
> 
> 

---

> #### next()
> moves the animation to the next frame in the defined sequence in manual animations
> 
> 

---

> #### previous()
> moves the animation to the previous frame in the defined sequence in manual animations
> 
> 

---

> #### define(texture, portion)
> defines a frame for this sprite it is added in sequence to the list of frames
> 
> 
> **Parameters**
> 
> {**texture**} **texture** where is the image for this frame coming from
> 
> {**Rectangle**} **portion** portion of the texture to use for this frame of animation, if you are using the whole texture don not provide a portion argument
> 
> 

---

> #### defineFramelist(flist)
> defines a number of frames for a sprite using a framelist
> 
> 
> **Parameters**
> 
> {**{t:texture,p:Rectangle}[]**} **flist** 
> 
> ```js
> example
>       //if you manually define some frames useful for defining blocks of animation frames
>       this.frame.defineFramelist([
>         {t:txsprite,p:{x:138,y:213,w:32,h:32}},//blinky
>         {t:txsprite,p:{x:172,y:213,w:32,h:32}},
>         {t:txsprite,p:{x:138,y:352,w:32,h:32}},//pinky
>         {t:txsprite,p:{x:172,y:352,w:32,h:32}},
>         {t:txsprite,p:{x:138,y:492,w:32,h:32}},//inky
>         {t:txsprite,p:{x:172,y:492,w:32,h:32}},
>         {t:txsprite,p:{x:138,y:631,w:32,h:32}},//clyde
>         {t:txsprite,p:{x:172,y:631,w:32,h:32}},
>       ]);      
>       
>      
> ```
> 

---

> #### defineSpritesheet(texture, tilesize, data)
> performs a rip of a spritesheet
> 
> adds to frame list a rectangluar sequence of frames from a texture
> 
> 
> **Parameters**
> 
> {**image|texture**} **texture** image that contains the frames we want
> 
> {**{w:32,h:32}**} **tilesize** width and height of each frame (have to be the same size)
> 
> {**{rowstall:3,colswide:10,left:10,top:5,xpad:2,ypad:2}**} **data** explained in comments below
> 
> ```js
> example
>       //takes 8 frames txsprite and adds them to the frames already defined for the sprite
>       //the frames consist of 1 row and 8 columns with a 2 pixel gap between each row and column
>       //each tiles is 32x32 pixels the rectangular sequence starts 2 pixels from left and 213 pixels from top corner of sprite sheet
>       this.frame.defineSpritesheet(txsprite, {w:32,h:32}, {rowstall:1,colswide:8,left:2,top:213,xpad:2,ypad:2});
>     
> ```
> 

---

> #### remove(frame, count)
> removes either a single frame or a number of frames including the first one
> 
> if you do this you will need to make sure you reset any animation states with updated values
> 
> 
> **Parameters**
> 
> {**int**} **frame** start frame index to remove
> 
> {**int**} **count** number of frames to remove, don't provide an argument if you only need to remove a single frame
> 
> 

---

> #### #stop()
> if animation has gone past start or end of available animation frames
> 
> remain at that position
> 
> 

---

> #### #stopthenfirst()
> if animation has gone past start or end of available animation frames
> 
> revert to first frame in sequence and stop animation
> 
> 

---

> #### #repeat()
> if animation has gone past start or end of available animation frames
> 
> go back to first frame and continue
> 
> 

---

> #### #reverse()
> if animation has gone past start or end then reverse direction
> 
> 

---

> #### #kill()
> if animation has gone past start or end of available animation frames
> 
> kill the sprite ha ha!!
> 
> @ Very useful for running an animation then making a sprite dissapear
> 
> 

---

