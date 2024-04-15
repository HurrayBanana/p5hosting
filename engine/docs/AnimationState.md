> ### class AnimationState
> 
> 
> holds an animation state (ready for when animation stack is implemented)
> 
> 

---

> #### active=-1
> specifies the active animation frame for this state
> 
> 
> {**int**}
> 
> 

---

> #### #animationmethod=AnimateMethod.none
> Specifies the current animation method
> 
> 
> {**AnimateMethod**}
> 
> 

---

> #### animateroutine=null
> my experiement in removing the need for a switch/if block to call the correct animation routine by directly storing the method in a property
> 
> 
> {**method**}
> 
> 

---

> #### lastframeaction=null
> what happens when animation reaches the last frame
> 
> 
> {**LastAction**}
> 
> 

---

> #### first=-1
> first frame of the animation state
> 
> 
> {**int**}
> 
> 

---

> #### last=-1
> last frame of the animation state
> 
> 
> {**int**}
> 
> 

---

> #### direction=1
> +1 moving forward (first to last) through frames, -1 going backwards (last to first)
> 
> 
> {**int**}
> 
> 

---

> #### lastposition=0
> used by distance animation system to determine how far the sprite has moved
> 
> 
> {**vector3**}
> 
> 

---

> #### distance=0
> distance required to move before animation can change (stored as a Squared value (eliminating need for expensive Square Root))
> 
> 
> {**float**}
> 
> 

---

> #### period=0
> number of seconds (fraction thereof) before animation can change in rate based animations
> 
> 
> {**float**}
> 
> 

---

> #### elapsed=0
> time period recorded so far, for this rate based animation
> 
> 
> {**float**}
> 
> 

---

> #### loop=0
> an integer value that is incremented every time the animation reaches an end you can use this as a counter to eventually kill an animation, in conjunction with an callbackEnd
> 
> 
> {**int**}
> 
> 

---

> #### loopend=-1
> NOT IMPLEMENTED YET - would be an automatic way for stopping a continual repeat or reverse style animation, you can implement this yourself easily @see {@link elapsed}
> 
> 
> {**int**}
> 
> 

---

> #### #callbackAnimate = null
> method called when the animation frame is changed
> 
> 
> {**{callback:method|function,instance:object**} }
> 
> 

---

> #### #callbackEnd = null
> method called when the sprite is hidden with
> 
> or settting visible to false, or from flashing
> 
> ```js
> example
> ```
> 

---

> #### #callbackManual
> 
> {**{callback:method|function,instance:object**} } holds manual animation callback
> 
> 

---

> #### getter animationmethod
> gets AnimationMethod for this state
> 
> 
> returns {**AnimateMethod**}
> 
> 

---

> #### setter animationmethod
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

> #### getter callbackAnimate
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

> #### setter callbackAnimate
> sets (or changes) the callback handler called when animation states makes a frame change
> 
> 
> **Parameters**
> 
> {**{callback:method|function,instance:object}**} **value** 
> 
> ```js
> example
>       this.callbackAnimate = {callback:this.animationchanged,instance:this};
>       // or use the Engine.makeCallback() method
>       this.callbackAnimate = Engine.makeCallback(this.animationchanged, this);
>      
> ```
> 

---

> #### getter callbackEnd
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

> #### setter callbackEnd
> sets (or changes) the callback handler called when animation states reach an end point
> 
> 
> **Parameters**
> 
> {**{callback:method|function,instance:object}**} **value** 
> 
> ```js
> example
>       this.callbackHide = {callback:this.animationchanged,instance:this};
>      
> ```
> 

---

> #### getter callbackManual
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

> #### setter callbackManual
> sets (or changes) the callback handler called when manual animation has been selected
> 
> 
> **Parameters**
> 
> {**{callback:method|function,instance:object}**} **value** 
> 
> ```js
> example
>       this.callbackManual = {callback:this.checkanimation,instance:this};
>      
> ```
> 

---

