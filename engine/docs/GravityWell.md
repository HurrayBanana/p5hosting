engine created by Hurray Banana &copy;2023-2024

this can be found in file **track.js**
## class GravityWell
>  Defines a gravity well that can act upon a sprite if associated
> 
> 

---

## Constructor
> #### constructor(location, gigaTonnes)
> to use write **new GravityWell(location, gigaTonnes)**
> 
> Creates a new GravityWell specifying its location and Mass in Giga Tonnes
> 
> 
> **Parameters**
> 
> {**vector3**} **location** 
> 
> {**float**} **gigaTonnes**  You will need to experiment with the location and Mass of the GravityWells in order to achieve the desired effects
> 
> 

---

## properties
####  GM [static]
> default value **6.673E-11**
> 
> to use write **GravityWell.GM**
> 
> 
> type {**float**} gravitational constant
> 
> 

---

#### Math.PIby180
> default value **Math.PI/180**
> 
> to use write **this.Math.PIby180**
> 
> 
> type {**float**} multiply with a number of degrees to get radians
> 
> 

---

#### Math.PIby2
> default value **Math.PI/2**
> 
> to use write **this.Math.PIby2**
> 
> 
> type {**float**} 180 degress as radians
> 
> 

---

#### Math.PIby4
> default value **Math.PI/4**
> 
> to use write **this.Math.PIby4**
> 
> 
> type {**float**} 90 degrees as radians
> 
> 

---

#### Math.PIx180
> default value **Math.PI*180**
> 
> to use write **this.Math.PIx180**
> 
> 
> type {**float**} multiply with a number of radians to get degrees
> 
> 

---

#### Math.PIx2
> default value **Math.PI * 2**
> 
> to use write **this.Math.PIx2**
> 
> 
> type {**float**} 360 degrees as radians
> 
> 

---

#### Math.hb180byPI
> default value **180/Math.PI**
> 
> to use write **this.Math.hb180byPI**
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

#### location
> to use write **this.location**
> 
> 
> type {**vector3**} The position of this gravity well as a vector3
> 
> 

---

## getters and setters
#### pointmass [getter]
> to use write **this.pointmass**
> 
> 
> returns {**float**} gets the point mass for the well in GigaTonnes
> 
> 

---

#### pointmass [setter]
> to use write **this.pointmass = value**
> 
> sets the point mass for the well in GigaTonnes
> 
> 
> **Parameters**
> 
> {**float**} **value** mass in giga tonnes
> 
> 

---

#### precalc [getter]
> to use write **this.precalc**
> 
> 
> returns {**float**} gets the pre-calculate gravitaional force
> 
> 

---

## Methods
#### cleanup()
> to use write **this.cleanup()**
> 
> removes a reference to a location if it existed.
> 
> If you inherit from GravityWell and need to remove your own resources then implement your own
> 
> version of cleanup  but remember to call super.cleanup()
> 
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
> {**texture|image**} **surface** if specified the drawing will be attempted on the given image/surface or texture, if ommitted tet will appear on the default canvas
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
