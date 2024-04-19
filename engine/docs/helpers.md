engine created by Hurray Banana &copy;2023-2024
global scope
> 

---

## global variables
#### Math.PIx2
> default value **Math.PI * 2**
> 
> use the name **this.Math.PIx2** directly to use this global value
> 
> 
> type {**float**} 360 degrees as radians
> 
> 

---

#### Math.PIby2
> default value **Math.PI/2**
> 
> use the name **this.Math.PIby2** directly to use this global value
> 
> 
> type {**float**} 180 degress as radians
> 
> 

---

#### Math.PIby4
> default value **Math.PI/4**
> 
> use the name **this.Math.PIby4** directly to use this global value
> 
> 
> type {**float**} 90 degrees as radians
> 
> 

---

#### Math.PIby180
> default value **Math.PI/180**
> 
> use the name **this.Math.PIby180** directly to use this global value
> 
> 
> type {**float**} multiply with a number of degrees to get radians
> 
> 

---

#### Math.PIx180
> default value **Math.PI*180**
> 
> use the name **this.Math.PIx180** directly to use this global value
> 
> 
> type {**float**} multiply with a number of radians to get degrees
> 
> 

---

#### Math.hb180byPI
> default value **180/Math.PI**
> 
> use the name **this.Math.hb180byPI** directly to use this global value
> 
> divide an angle in degrees by this to get a radians value
> 
> ```js
> example
>   let radians = this.angle/Math.hb180byPI;
>  
> ```
> 

---

## global functions
#### function lrp(a, b, p)
> just write **lrp(a, b, p)** to use global function
> 
> Produces a linear interpolation between 2 values
> 
> 
> returns {**float**}
> 
> 
> **Parameters**
> 
> {**float**} **a** base value  (0%)
> 
> {**float**} **b** maximum value (100%)
> 
> {**float**} **p** percentage between 2 values a and b, should be a value between 0 and 1
> 
> 

---

#### function roundtoPowerof2(value)
> just write **roundtoPowerof2(value)** to use global function
> 
> takes a value and rounds up to a power of 2
> 
> 
> returns {**int**}
> 
> 
> **Parameters**
> 
> {**int**} **value** value to round up
> 
> 

---

#### function ranInt(maximum)
> just write **ranInt(maximum)** to use global function
> 
> returns a random integer value
> 
> >= 0 and < maximum
> 
> 
> returns {**int**}
> 
> 
> **Parameters**
> 
> {**int**} **maximum** 
> 
> 

---

#### function clamp(value, lower, upper)
> just write **clamp(value, lower, upper)** to use global function
> 
> keeps a value within the lower and upper limit
> 
> 
> returns {**float**}
> 
> 
> **Parameters**
> 
> {**float**} **value**  value to clamp
> 
> {**float**} **lower** lowest value allowed
> 
> {**float**} **upper** largest value allowed
> 
> 

---

#### function ranBetween(lower, upper)
> just write **ranBetween(lower, upper)** to use global function
> 
> prouduces a random integer value between the lower and upper values
> 
> 
> returns {**int**}
> 
> 
> **Parameters**
> 
> {**int**} **lower** lowest value to generate
> 
> {**int**} **upper** largest value (will be 1 less than this)
> 
> 

---

#### function floatBetween(lower, upper)
> just write **floatBetween(lower, upper)** to use global function
> 
> prouduces a random value between the lower and upper values
> 
> 
> returns {**float**}
> 
> 
> **Parameters**
> 
> {**int**} **lower** lowest value to generate
> 
> {**int**} **upper** largest value (will be 1 less than this)
> 
> 

---

#### function radtoDeg(radians)
> just write **radtoDeg(radians)** to use global function
> 
> returns the radians in degrees
> 
> 
> returns {**float**} degrees
> 
> 
> **Parameters**
> 
> {**float**} **radians** 
> 
> 

---

#### function degtoRad(degrees)
> just write **degtoRad(degrees)** to use global function
> 
> returns the degrees in radians
> 
> 
> returns {**float**} radians
> 
> 
> **Parameters**
> 
> {**float**} **degrees** 
> 
> 

---

#### function tickandNull(obj, delta)
> just write **tickandNull(obj, delta)** to use global function
> 
> simple timer manager require an object with:
> 
> an elapsed property
> 
> a lifetime property holding how many seconds timer should live for
> 
> nulls the object when time is up
> 
> ```js
> example
>    mytimer = tickandNull(mytimer, delta);
>   
> ```
> 

---

#### function drawtextArray(textarr, x, y, linedrop, surface)
> just write **drawtextArray(textarr, x, y, linedrop, surface)** to use global function
> 
> Takes an array of strings and display each string on screen on a separate line
> 
> 
> **Parameters**
> 
> {**string[]**} **textarr** array containing strings
> 
> {**int**} **x** left edge of text
> 
> {**int**} **y** starting height of output text
> 
> {**int**} **linedrop** distance to drop down on each string from the array
> 
> {****} **surface** if specified the drawing will be attempted on the given image/surface or texture, if ommitted tet will appear on the default canvas
> 
> ```js
> example
>   //displaying message bus subscribers with current text settings called at end of draw() function in sketch.js
>   drawtextArray(MsgBus.debugdisplayFull(), 10,100,16);
>  
> ```
> 

---

engine created by Hurray Banana &copy;2023-2024
