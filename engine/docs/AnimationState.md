engine created by Hurray Banana &copy;2023-2024

this can be found in file **track.js**
## class AnimationState
> 
> 
> holds an animation state (ready for when animation stack is implemented)
> 
> 

---

## properties
#### active
> default value **-1**
> 
> to use write **this.active**
> 
> specifies the active animation frame for this state
> 
> 
> type {**int**}
> 
> 

---

#### animateroutine
> default value **null**
> 
> to use write **this.animateroutine**
> 
> my experiement in removing the need for a switch/if block to call the correct animation routine by directly storing the method in a property
> 
> 
> type {**method**}
> 
> 

---

#### direction
> default value **1**
> 
> to use write **this.direction**
> 
> +1 moving forward (first to last) through frames, -1 going backwards (last to first)
> 
> 
> type {**int**}
> 
> 

---

#### distance
> default value **0**
> 
> to use write **this.distance**
> 
> distance required to move before animation can change (stored as a Squared value (eliminating need for expensive Square Root))
> 
> 
> type {**float**}
> 
> 

---

#### elapsed
> default value **0**
> 
> to use write **this.elapsed**
> 
> time period recorded so far, for this rate based animation
> 
> 
> type {**float**}
> 
> 

---

#### first
> default value **-1**
> 
> to use write **this.first**
> 
> first frame of the animation state
> 
> 
> type {**int**}
> 
> 

---

#### last
> default value **-1**
> 
> to use write **this.last**
> 
> last frame of the animation state
> 
> 
> type {**int**}
> 
> 

---

#### lastframeaction
> default value **null**
> 
> to use write **this.lastframeaction**
> 
> what happens when animation reaches the last frame
> 
> 
> type {**LastAction**}
> 
> 

---

#### lastposition
> default value **0**
> 
> to use write **this.lastposition**
> 
> used by distance animation system to determine how far the sprite has moved
> 
> 
> type {**vector3**}
> 
> 

---

#### loop
> default value **0**
> 
> to use write **this.loop**
> 
> an integer value that is incremented every time the animation reaches an end you can use this as a counter to eventually kill an animation, in conjunction with an callbackEnd
> 
> 
> type {**int**}
> 
> 

---

#### loopend
> default value **-1**
> 
> to use write **this.loopend**
> 
> NOT IMPLEMENTED YET - would be an automatic way for stopping a continual repeat or reverse style animation, you can implement this yourself easily @see {@link elapsed}
> 
> 
> type {**int**}
> 
> 

---

#### period
> default value **0**
> 
> to use write **this.period**
> 
> number of seconds (fraction thereof) before animation can change in rate based animations
> 
> 
> type {**float**}
> 
> 

---

## getters and setters
#### animationmethod [getter]
> to use write **this.animationmethod**
> 
> gets AnimationMethod for this state
> 
> 
> returns {**AnimateMethod**}
> 
> 

---

#### animationmethod [setter]
> to use write **this.animationmethod = value**
> 
> sets AnimationMethod for this state, setting to AnimationMethod.none will effectively disable animation updates
> 
> you will need to set a new animation method using animationonrate, animateonupdate or animateondistance to start it again
> 
> 
> **Parameters**
> 
> {**AnimateMethod**} **value** 
> 
> 

---

#### callbackAnimate [getter]
> to use write **this.callbackAnimate**
> 
> retrieves the current callback that fires if the animation frame changes (if this has not been set it will be null)
> 
> it will be in the form of object properties
> 
> 
> returns {**{callback:method|function,instance:object**}
> 
> ```js
> example
>       // two propeties callback and instance
>       let callstuff = this.callbackAnimate;
>       if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
>      
> ```
> 

---

#### callbackAnimate [setter]
> to use write **this.callbackAnimate = value**
> 
> sets (or changes) the callback handler called when animation states makes a frame change
> 
> 
> **Parameters**
> 
> {**{callback:method|function,instance:object}**} **value** 
> 
> ```js
> example
> // animationchanged is a method of your inherited sprite class
>       this.callbackAnimate = {callback:this.animationchanged,instance:this};
>       // or use the Engine.makeCallback() method
>       this.callbackAnimate = Engine.makeCallback(this.animationchanged, this);
>      
> ```
> 

---

#### callbackEnd [getter]
> to use write **this.callbackEnd**
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
>       let callstuff = this.callbackEnd;
>       if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
>       
>      
> ```
> 

---

#### callbackEnd [setter]
> to use write **this.callbackEnd = value**
> 
> sets (or changes) the callback handler called when animation states reach an end point
> 
> 
> **Parameters**
> 
> {**{callback:method|function,instance:object}**} **value** 
> 
> ```js
> example
> // animationchanged is a method of your inherited sprite class
>       this.callbackHide = {callback:this.animationchanged,instance:this};
>      
> ```
> 

---

#### callbackManual [getter]
> to use write **this.callbackManual**
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
>       let callstuff = this.callbackManual;
>       if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
>       
>      
> ```
> 

---

#### callbackManual [setter]
> to use write **this.callbackManual = value**
> 
> sets (or changes) the callback handler called when manual animation has been selected
> 
> 
> **Parameters**
> 
> {**{callback:method|function,instance:object}**} **value** 
> 
> ```js
> example
> // checkanimation is a method of your inherited sprite class
>       this.callbackManual = {callback:this.checkanimation,instance:this};
>      
> ```
> 

---

engine created by Hurray Banana &copy;2023-2024
