engine created by Hurray Banana &copy;2023-2024

this can be found in file **track.js**
## class Limit
>  class to provide various types of interactions between sprites and bounding Boxes (depth based rectangles)
> 
> ```js
> example
>     //initiate a limit box using
>     this.limit = new Limit(this);
>   
> ```
> 

---

## Constructor
> #### constructor(boss)
> to use write **new Limit(boss)**
> 
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

## properties
#### show
> default value **null**
> 
> to use write **this.show**
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
>       //show transparent red limit box
>       this.limit.show = [255,0,0,100];
>      
> ```
> 

---

## getters and setters
#### active [getter]
> to use write **this.active**
> 
> 
> returns {**bool**} specifies if the specified limit box is actively being processed default is true, until sprite enter the box this will be false
> 
> 

---

#### area [getter]
> to use write **this.area**
> 
> 
> returns {**Box**} specifies the Box area (rectangular region with depth) with which to apply limit actions
> 
> 

---

#### area [setter]
> to use write **this.area = value**
> 
> specifies the Box area (rectangular region with depth) with which to apply limit actions
> 
> 
> **Parameters**
> 
> {**Box|Rectangle**} **value** the area of the limit box
> 
> 

---

#### atLimit [getter]
> to use write **this.atLimit**
> 
> 
> returns {**bool**} true if sprite has interacted with the specified limit mode
> 
> 

---

#### callback [getter]
> to use write **this.callback**
> 
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

#### callback [setter]
> to use write **this.callback = value**
> 
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
> // limitreached is a method of your inherited sprite class
>       this.callback = {callback:this.limitreached,instance:this};
>       // or use the Engine.makeCallback() method
>       this.callback = Engine.makeCallback(this.limitreached, this);
>      
> ```
> 

---

## Methods
#### cleanup()
> to use write **this.cleanup()**
> 
> removes any reference resources
> 
> 

---

#### modeoff()
> to use write **this.modeoff()**
> 
> turns off the limit mode and changes themode to Limitmode.none
> 
> Set a regionaction
> 
> 

---

#### off()
> to use write **this.off()**
> 
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

#### regionaction(mode, area, callback)
> to use write **this.regionaction(mode, area, callback)**
> 
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

#### reset()
> to use write **this.reset()**
> 
> re-activates a previously set limit mode
> 
> You can also just set another region action if you want to change behaviour or just for simplicity
> 
> 

---

#### update()
> to use write **this.update()**
> 
> applies relevant updates to the limit box
> 
> 

---

#### viewportaction(mode, callback)
> to use write **this.viewportaction(mode, callback)**
> 
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

engine created by Hurray Banana &copy;2023-2024
