engine created by Hurray Banana &copy;2023-2024
## class Box
>  support for box areas (rectangle with depth)
> 
> 

---

## Constructor
> #### constructor(left, top, front, width, height, depth)
> to use write **new Box(left, top, front, width, height, depth)**
> 
> creates a box shape which defines a 3d cube area (3d rectangle)
> 
> 
> **Parameters**
> 
> {**float**} **left** 
> 
> {**float**} **top** 
> 
> {**float**} **front** 
> 
> {**float**} **width** 
> 
> {**float**} **height** 
> 
> {**float**} **depth** 
> 
> ```js
> example
>       //create a box left at 50, top at 100 and front at 200, width, height of 200 and depth 400
>       //right is at 250, bottom is at 300 and back is at -200
>       new box(50,100,200, 200, 200, 400);
>       
>       //create a box using 2 vector3 values one for corner and one for dimension
>       new box(new vector3(50,100,200), new vector3(200,200,400));
>      
>      
> ```
> 

---

## properties
#### #corner
> to use write **this.#corner**
> 
> top front left corner of box @type {vector3}
> 
> 

---

#### #dimension
> to use write **this.#dimension**
> 
> width, height and depth of box @type {vector3}
> 
> 

---

## getters and setters
####   unit [getter] [static]
> to use write **Box.unit**
> 
> creates a unit box with corner 0,0,0 and dimensions 1,1,1 @returns {Box}
> 
> 

---

#### b [getter]
> to use write **this.b**
> 
> gets the bottom of the box @returns {float}
> 
> 

---

#### back [getter]
> to use write **this.back**
> 
> gets the back of the box @returns {float}
> 
> 

---

#### bottom [getter]
> to use write **this.bottom**
> 
> gets the bottom of the box @returns {float}
> 
> 

---

#### centre [getter]
> to use write **this.centre**
> 
> gets the centre of the box @returns {vector3}
> 
> 

---

#### centrex [getter]
> to use write **this.centrex**
> 
> gets the x centre of the box @returns {float}
> 
> 

---

#### centrey [getter]
> to use write **this.centrey**
> 
> gets the y centre of the box @returns {float}
> 
> 

---

#### centrez [getter]
> to use write **this.centrez**
> 
> gets the z centre of the box @returns {float}
> 
> 

---

#### d [getter]
> to use write **this.d**
> 
> depth of box @returns {float}
> 
> 

---

#### d [setter]
> to use write **this.d = value**
> 
> 
> **Parameters**
> 
> {***  {float**} **value** sets depth of box
> 
> 

---

#### depth [getter]
> to use write **this.depth**
> 
> depth of box @returns {float}
> 
> 

---

#### front [getter]
> to use write **this.front**
> 
> gets the front of the box @returns {float}
> 
> 

---

#### h [getter]
> to use write **this.h**
> 
> height of box @returns {float}
> 
> 

---

#### h [setter]
> to use write **this.h = value**
> 
> 
> **Parameters**
> 
> {***  {float**} **value** sets height of box
> 
> 

---

#### height [getter]
> to use write **this.height**
> 
> height of box @returns {float}
> 
> 

---

#### l [getter]
> to use write **this.l**
> 
> gets the left hand side of the box @returns {float}
> 
> 

---

#### left [getter]
> to use write **this.left**
> 
> gets the left hand side of the box @returns {float}
> 
> 

---

#### r [getter]
> to use write **this.r**
> 
> gets the right hand side of the box @returns {float}
> 
> 

---

#### right [getter]
> to use write **this.right**
> 
> gets the right hand side of the box @returns {float}
> 
> 

---

#### t [getter]
> to use write **this.t**
> 
> gets the top of the box @returns {float}
> 
> 

---

#### top [getter]
> to use write **this.top**
> 
> gets the top of the box @returns {float}
> 
> 

---

#### w [getter]
> to use write **this.w**
> 
> width of box @returns {float}
> 
> 

---

#### w [setter]
> to use write **this.w = value**
> 
> 
> **Parameters**
> 
> {***  {float**} **value** sets width of box
> 
> 

---

#### width [getter]
> to use write **this.width**
> 
> width of box @returns {float}
> 
> 

---

#### x [getter]
> to use write **this.x**
> 
> gets the left hand side of the box @returns {float}
> 
> 

---

#### x [setter]
> to use write **this.x = value**
> 
> 
> **Parameters**
> 
> {***  {float**} **value** sets left side of box
> 
> 

---

#### y [getter]
> to use write **this.y**
> 
> gets the top hand side of the box @returns {float}
> 
> 

---

#### y [setter]
> to use write **this.y = value**
> 
> 
> **Parameters**
> 
> {***  {float**} **value** sets top side of box
> 
> 

---

#### z [getter]
> to use write **this.z**
> 
> gets the front hand side of the box @returns {float}
> 
> 

---

#### z [setter]
> to use write **this.z = value**
> 
> 
> **Parameters**
> 
> {***  {float**} **value** sets front side of box
> 
> 

---

## Methods
#### flate(offsets)
> to use write **this.flate(offsets)**
> 
> increases or decreases (-ve values decrease/+ve value increase) the dimensions of the box
> 
> 
> **Parameters**
> 
> {**vector3**} **offsets** specify the changes in width, height and depth of the box
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
