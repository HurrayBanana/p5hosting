engine created by Hurray Banana &copy;2023-2024
## class Rectang
>  support for rectangular areas and actions upon them
> 
> 

---

## Constructor
> #### constructor(x, y, w, h)
> to use write **new Rectangle(x, y, w, h)**
> 
> 
> **Parameters**
> 
> {**float**} **x** left hand of rectangle
> 
> {**float**} **y** top of rectangle
> 
> {**float**} **w** width of rectangle
> 
> {**float**} **h** height of rectangle
> 
> 

---

## properties
#### #h
> to use write **this.#h**
> 
> height  @type {float}
> 
> 

---

#### #w
> to use write **this.#w**
> 
> width  @type {float}
> 
> 

---

#### #x
> to use write **this.#x**
> 
> left position @type {float}
> 
> 

---

#### #y
> to use write **this.#y**
> 
> top position  @type {float}
> 
> 

---

## getters and setters
####   one [getter] [static]
> to use write **Rectangle.one**
> 
> 
> returns {**Rectangle**} a new instance Rectangle(1,1,1,1)
> 
> 

---

####   zero [getter] [static]
> to use write **Rectangle.zero**
> 
> 
> returns {**Rectangle**} a new instance Rectangle(0,0,0,0)
> 
> 

---

#### b [getter]
> to use write **this.b**
> 
> 
> returns {**float**} bottom of rectangle
> 
> 

---

#### bottom [getter]
> to use write **this.bottom**
> 
> 
> returns {**float**} bottom of rectangle
> 
> 

---

#### centre [getter]
> to use write **this.centre**
> 
> gets the centre as a vector3 object - can be used in place of a vector2
> 
> 

---

#### centrex [getter]
> to use write **this.centrex**
> 
> gets the horizontal centre of the rectangle @returns {float}
> 
> 

---

#### centrey [getter]
> to use write **this.centrey**
> 
> gets the vertical centre of the rectangle
> 
> 

---

#### clone [getter]
> to use write **this.clone**
> 
> 
> returns {**Rectangle**} a new rectangle instance with the values of this one
> 
> 

---

#### h [getter]
> to use write **this.h**
> 
> 
> returns {**float**} height of rectangle
> 
> 

---

#### h [setter]
> to use write **this.h = value**
> 
> 
> **Parameters**
> 
> {***  {float**} **value**  the height of the rectangle
> 
> 

---

#### height [getter]
> to use write **this.height**
> 
> 
> returns {**float**} height of rectangle
> 
> 

---

#### l [getter]
> to use write **this.l**
> 
> 
> returns {**float**} left hand side of rectangle
> 
> 

---

#### left [getter]
> to use write **this.left**
> 
> 
> returns {**float**} left hand side of rectangle
> 
> 

---

#### r [getter]
> to use write **this.r**
> 
> 
> returns {**float**} right hand side of rectangle
> 
> 

---

#### right [getter]
> to use write **this.right**
> 
> 
> returns {**float**} right hand side of rectangle
> 
> 

---

#### t [getter]
> to use write **this.t**
> 
> 
> returns {**float**} top of rectangle
> 
> 

---

#### top [getter]
> to use write **this.top**
> 
> 
> returns {**float**} top of rectangle
> 
> 

---

#### w [getter]
> to use write **this.w**
> 
> 
> returns {**float**} width of rectangle
> 
> 

---

#### w [setter]
> to use write **this.w = value**
> 
> 
> **Parameters**
> 
> {***  {float**} **value**  the width of the rectangle
> 
> 

---

#### width [getter]
> to use write **this.width**
> 
> 
> returns {**float**} width of rectangle
> 
> 

---

#### x [getter]
> to use write **this.x**
> 
> 
> returns {**float**} left hand side of rectangle
> 
> 

---

#### x [setter]
> to use write **this.x = value**
> 
> 
> **Parameters**
> 
> {***  {float**} **value**  the left side of the rectangle
> 
> 

---

#### y [getter]
> to use write **this.y**
> 
> 
> returns {**float**} top of rectangle
> 
> 

---

#### y [setter]
> to use write **this.y = value**
> 
> 
> **Parameters**
> 
> {***  {float**} **value**  the top of the rectangle
> 
> 

---

## Methods
####  adjust(rect, sides) [static]
> to use write **Rectangle.adjust(rect, sides)**
> 
> creates a new rectangle alters each side of the given rectangle by the given amounts
> 
> 
> returns {**Rectangle**} a newly adjusted version of the given rectangle
> 
> 
> **Parameters**
> 
> {**Rectangle**} **rect** base rectangel to adjust
> 
> {**Rectangle**} **sides** a rectangle were the x, y, w, h values added to the x, y, w and h of this rectangle
> 
> 

---

####  displace(rect, offset) [static]
> to use write **Rectangle.displace(rect, offset)**
> 
> displaces this rectangle by the given vector2 value
> 
> 
> **Parameters**
> 
> {**Rectangle**} **rect** rectangle to move
> 
> {**vector2|vector3|{x:float,y:float}**} **offset** 
> 
> 

---

####  displaceNew(rect, offset) [static]
> to use write **Rectangle.displaceNew(rect, offset)**
> 
> displaces this rectangle by the given vector2 value produces a new rectangle#
> 
> 
> returns {**Rectangle**} displaced version of the given rectangle
> 
> 
> **Parameters**
> 
> {**Rectangle**} **rect** rectangle to move
> 
> {**vector2|vector3|{x:float,y:float}**} **offset** 
> 
> 

---

####  sub(rect, offsetportion) [static]
> to use write **Rectangle.sub(rect, offsetportion)**
> 
> produces a vector2 offset from a rectangle portion, this can be mapped back to an
> 
> original texture rectangle portion
> 
> This was for some internal test code that no longer exists
> 
> 
> **Parameters**
> 
> {**Rectangle**} **rect** 
> 
> {**vector2|vector3|{x:int,y:int}**} **offsetportion** 
> 
> 

---

#### adjust(sides)
> to use write **this.adjust(sides)**
> 
> alters each side of the rectangle by the given amounts
> 
> 
> **Parameters**
> 
> {**Rectangle**} **sides** a rectangle were the x, y, w, h values added to the x, y, w and h of this rectangle
> 
> 

---

#### cloneto(here)
> to use write **this.cloneto(here)**
> 
> copies this rectangles positions to the given rectangle
> 
> 
> **Parameters**
> 
> {**Rectangle**} **here** as clone but copies to this pre-existing rectangle
> 
> 

---

#### displace(offset)
> to use write **this.displace(offset)**
> 
> displaces this rectangle by the given vector2 value
> 
> 
> **Parameters**
> 
> {**vector2|vector3|{x:float,y:float}**} **offset** 
> 
> 

---

#### displaceNew(offset)
> to use write **this.displaceNew(offset)**
> 
> displaces this rectangle by the given vector2 value produces a new rectangle
> 
> 
> returns {**Rectangle**} displaced version of the this rectangle
> 
> 
> **Parameters**
> 
> {**vector2|vector3|{x:float,y:float}**} **offset** 
> 
> 

---

#### flate(offsets)
> to use write **this.flate(offsets)**
> 
> increases or decreases (-ve values decrease/+ve value increase) the dimensions of the rectangle
> 
> 
> **Parameters**
> 
> {**vector2|vector3|{x:float,y:float}**} **offsets** specify the changes in width, height of the rectangle
> 
> 

---

#### in(x, y)
> to use write **this.in(x, y)**
> 
> determines if a point is inside (or touching) this Rectangle
> 
> 
> returns {**bool**} true if it is false if it isn't
> 
> 
> **Parameters**
> 
> {**float**} **x** x position of point
> 
> {**float**} **y** y position of point
> 
> 

---

#### intersects(r)
> to use write **this.intersects(r)**
> 
> determines if this rectanlge intersects with the given rectangle
> 
> NOT IMPLEMENTED YET
> 
> 

---

#### randominside(margin)
> to use write **this.randominside(margin)**
> 
> creates a rnadom position inside this rectangle
> 
> 
> returns {**{x:float,y:float**} an x y object to be used to set a vector2 or vector3
> 
> 
> **Parameters**
> 
> {**float**} **margin** and amount of padding insode the rectangle (essentially a little bit of deflate)
> 
> 

---

#### randominsideVector3(margin)
> to use write **this.randominsideVector3(margin)**
> 
> creates a rnadom position inside this rectangle
> 
> 
> returns {**{vector3**}
> 
> 
> **Parameters**
> 
> {**float**} **margin** and amount of padding insode the rectangle (essentially a little bit of deflate)
> 
> 

---

#### randomoutside(margin, maxdistance)
> to use write **this.randomoutside(margin, maxdistance)**
> 
> creates a random position outside of this rectangle,
> 
> if margin and maxdistance are undefined you'll get a point on the edge of the rectangle
> 
> 
> returns {**{x:float,y:float**} an x y object to be used to set a vector2 or vector3
> 
> 
> **Parameters**
> 
> {**float**} **margin** and amount of padding outside the rectangle (essentially a little bit of inflate)
> 
> {**float**} **maxdistance** how far outside the rectangle to go, 0 would be on edge of rectangle 100 would be at most 100 pixels away
> 
> 

---

#### randomoutsideVector3(margin, maxdistance)
> to use write **this.randomoutsideVector3(margin, maxdistance)**
> 
> creates a random position outside of this rectangle,
> 
> if margin and maxdistance are undefined you'll get a point on the edge of the rectangle
> 
> 
> returns {**vector3**} random position requested
> 
> 
> **Parameters**
> 
> {**float**} **margin** and amount of padding outside the rectangle (essentially a little bit of inflate)
> 
> {**float**} **maxdistance** how far outside the rectangle to go
> 
> 

---

#### sub(offsetportion)
> to use write **this.sub(offsetportion)**
> 
> produces a vector2 offset for this rectangle portion, this can be mapped back to an
> 
> original texture rectangle portion.
> 
> This was for some internal test code that no longer exists
> 
> 
> **Parameters**
> 
> {**vector2|vector3|{x:int,y:int}**} **offsetportion** 
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
