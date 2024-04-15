> ### class Limi
> @classdesc class to provide various types of interactions between sprites and bounding Boxes (depth based rectangles)
> 
> 

---

> #### #mode
> 
> {**Limitmode**} holds the active mode of operation for the limit box
> 
> 

---

> #### #area
> 
> {**Box**} specifies the region for the limit box
> 
> 

---

> #### #ms
> 
> {**Sprite**} holds reference to sprite that owns the limit box
> 
> 

---

> #### #active
> 
> {**bool**} specifies whether the limit box is active (generally sprites need to enter a box before it comes active)
> 
> 

---

> #### #atLimit = false
> 
> {**bool**} states whether limit conditions have been met
> 
> 

---

> #### #callback
> 
> {**{callback:method|function,instance:object**} }
> 
> 

---

> #### show = null
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
>       //show transparent red limit box
>       this.limit.show = [255,0,0,100];
>      
> ```
> 

---

> #### getter area
> 
> returns {**Box**} specifies the Box area (rectangular region with depth) with which to apply limit actions
> 
> 

---

> #### setter area
> specifies the Box area (rectangular region with depth) with which to apply limit actions
> 
> 
> **Parameters**
> 
> {**Box|Rectangle**} **value** the area of the limit box
> 
> 

---

> #### getter active
> 
> returns {**bool**} specifies if the specified limit box is actively being processed default is true, until sprite enter the box this will be false
> 
> 

---

> #### getter atLimit
> 
> returns {**bool**} true if sprite has interacted with the specified limit mode
> 
> 

---

> #### getter callback
> retrieves the current callback which will be triggered if the sprite interacts with the limit box
> 
> (if this has not been set it will be null)
> 
> it will be in the form of object properties
> 
> 
> returns {**{callback:method|function,instance:object**}
> 
> ```js
> example
>       // two propeties callback and instance
>       let callstuff = this.callback;
>       if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
>      
> ```
> 

---

> #### setter callback
> sets (or changes) the callback handler called when sprite interacts with the limit box
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
>       this.callback = {callback:this.limitreached,instance:this};
>       // or use the Engine.makeCallback() method
>       this.callback = Engine.makeCallback(this.limitreached, this);
>      
> ```
> 

---

> #### constructor(boss)
> creates a Limit object for this sprite, which is initially inactive
> 
> use regionaction() to define an interaction mode
> 
> 
> **Parameters**
> 
> {**Sprite**} **boss** 
> 
> 

---

> #### cleanup()
> removes any reference resources
> 
> 

---

> #### off()
> manually turn off limit box
> 
> ```js
> example
>       // for complete removal use
>       this.limit.cleanup();
>       this.limit = null;
>      
> ```
> 

---

> #### reset()
> re-activates a previously set limit mode
> 
> You can also just set another region action if you want to change behaviour or just for simplicity
> 
> 

---

> #### modeoff()
> turns off the limit mode and changes themode to Limitmode.none
> 
> Set a regionaction
> 
> 

---

> #### regionaction(mode, area, callback)
> specifies a limitmode and an active limit area
> 
> if you want a static area provide a clone of a previously defined area/box (if that area will change)
> 
> If you want to track a moving area/box just use the boxes reference
> 
> set a callback (and it's instance) if you want notification of limit activity
> 
> 
> **Parameters**
> 
> {**Limitmode**} **mode** action to take with limit area
> 
> {**Box|Rectangle**} **area** limit area to interact with
> 
> {**{callback:method|function,instance:object}**} **callback** triggered if the sprite interacts with the limit box
> 
> 

---

> #### viewportaction(mode, callback)
> Specifies a limitmode that interacts with the standard (zeroed) viewport (i.e. screen area space)
> 
> 
> **Parameters**
> 
> {**Limitmode**} **mode** action to take with limit area
> 
> {**{callback:method|function,instance:object}**} **callback** triggered if the sprite interacts with the limit box
> 
> 

---

> #### update()
> applies relevant updates to the limit box
> 
> 

---

