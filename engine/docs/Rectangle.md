> ### class Rectang
> @classdesc support for rectangular areas and actions upon them
> 
> 

---

> #### #x
> left position @type {float}
> 
> 

---

> #### #y
> top position  @type {float}
> 
> 

---

> #### #w
> width  @type {float}
> 
> 

---

> #### #h
> height  @type {float}
> 
> 

---

> #### getter clone
> 
> returns {**Rectangle**} a new rectangle instance with the values of this one
> 
> 

---

> #### getter centrex
> gets the horizontal centre of the rectangle @returns {float}
> 
> 

---

> #### getter centrey
> gets the vertical centre of the rectangle
> 
> 

---

> #### getter centre
> gets the centre as a vector3 object - can be used in place of a vector2
> 
> 

---

> #### getter x
> 
> returns {**float**} left hand side of rectangle
> 
> 

---

> #### getter y
> 
> returns {**float**} top of rectangle
> 
> 

---

> #### getter w
> 
> returns {**float**} width of rectangle
> 
> 

---

> #### getter width
> 
> returns {**float**} width of rectangle
> 
> 

---

> #### getter h
> 
> returns {**float**} height of rectangle
> 
> 

---

> #### getter height
> 
> returns {**float**} height of rectangle
> 
> 

---

> #### setter x
> 
> **Parameters**
> 
> {***  {float**} **value**  the left side of the rectangle
> 
> 

---

> #### setter y
> 
> **Parameters**
> 
> {***  {float**} **value**  the top of the rectangle
> 
> 

---

> #### setter w
> 
> **Parameters**
> 
> {***  {float**} **value**  the width of the rectangle
> 
> 

---

> #### setter h
> 
> **Parameters**
> 
> {***  {float**} **value**  the height of the rectangle
> 
> 

---

> #### getter l
> 
> returns {**float**} left hand side of rectangle
> 
> 

---

> #### getter t
> 
> returns {**float**} top of rectangle
> 
> 

---

> #### getter r
> 
> returns {**float**} right hand side of rectangle
> 
> 

---

> #### getter b
> 
> returns {**float**} bottom of rectangle
> 
> 

---

> #### getter left
> 
> returns {**float**} left hand side of rectangle
> 
> 

---

> #### getter top
> 
> returns {**float**} top of rectangle
> 
> 

---

> #### getter right
> 
> returns {**float**} right hand side of rectangle
> 
> 

---

> #### getter bottom
> 
> returns {**float**} bottom of rectangle
> 
> 

---

> #### static getter zero
> 
> returns {**Rectangle**} a new instance Rectangle(0,0,0,0)
> 
> 

---

> #### static getter one
> 
> returns {**Rectangle**} a new instance Rectangle(1,1,1,1)
> 
> 

---

> #### constructor(x, y, w, h)
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

> #### cloneto(here)
> copies this rectangles positions to the given rectangle
> 
> 
> **Parameters**
> 
> {**Rectangle**} **here** as clone but copies to this pre-existing rectangle
> 
> 

---

> #### in(x, y)
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

> #### intersects(r)
> determines if this rectanlge intersects with the given rectangle
> 
> NOT IMPLEMENTED YET
> 
> 

---

> #### randomoutside(margin, maxdistance)
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

> #### randomoutsideVector3(margin, maxdistance)
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

> #### randominsideVector3(margin)
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

> #### randominside(margin)
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

> #### sub(offsetportion)
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

> #### static sub(rect, offsetportion)
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

> #### displace(offset)
> displaces this rectangle by the given vector2 value
> 
> 
> **Parameters**
> 
> {**vector2|vector3|{x:float,y:float}**} **offset** 
> 
> 

---

> #### static displace(rect, offset)
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

> #### displaceNew(offset)
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

> #### static displaceNew(rect, offset)
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

> #### flate(offsets)
> increases or decreases (-ve values decrease/+ve value increase) the dimensions of the rectangle
> 
> 
> **Parameters**
> 
> {**vector2|vector3|{x:float,y:float}**} **offsets** specify the changes in width, height of the rectangle
> 
> 

---

> #### adjust(sides)
> alters each side of the rectangle by the given amounts
> 
> 
> **Parameters**
> 
> {**Rectangle**} **sides** a rectangle were the x, y, w, h values added to the x, y, w and h of this rectangle
> 
> 

---

> #### static adjust(rect, sides)
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

