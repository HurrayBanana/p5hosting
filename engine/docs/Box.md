engine created by Hurray Banana &copy;2023-2024

this can be found in file **track.js**
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
## getters and setters
####   unit [getter] [static]
> to use write **Box.unit**
> 
> 
> returns {**Box**} creates a unit box with corner 0,0,0 and dimensions 1,1,1
> 
> 

---

#### b [getter]
> to use write **this.b**
> 
> 
> returns {**float**} gets the bottom of the box
> 
> 

---

#### back [getter]
> to use write **this.back**
> 
> 
> returns {**float**} gets the back of the box
> 
> 

---

#### bottom [getter]
> to use write **this.bottom**
> 
> 
> returns {**float**} gets the bottom of the box
> 
> 

---

#### centre [getter]
> to use write **this.centre**
> 
> 
> returns {**vector3**} gets the centre of the box
> 
> 

---

#### centrex [getter]
> to use write **this.centrex**
> 
> 
> returns {**float**} gets the x centre of the box
> 
> 

---

#### centrey [getter]
> to use write **this.centrey**
> 
> 
> returns {**float**} gets the y centre of the box
> 
> 

---

#### centrez [getter]
> to use write **this.centrez**
> 
> 
> returns {**float**} gets the z centre of the box
> 
> 

---

#### d [getter]
> to use write **this.d**
> 
> 
> returns {**float**} depth of box
> 
> 

---

#### d [setter]
> to use write **this.d = value**
> 
> 
> **Parameters**
> 
> {**float**} **value** sets depth of box
> 
> 

---

#### depth [getter]
> to use write **this.depth**
> 
> 
> returns {**float**} depth of box
> 
> 

---

#### front [getter]
> to use write **this.front**
> 
> 
> returns {**float**} gets the front of the box
> 
> 

---

#### h [getter]
> to use write **this.h**
> 
> 
> returns {**float**} height of box
> 
> 

---

#### h [setter]
> to use write **this.h = value**
> 
> 
> **Parameters**
> 
> {**float**} **value** sets height of box
> 
> 

---

#### height [getter]
> to use write **this.height**
> 
> 
> returns {**float**} height of box
> 
> 

---

#### l [getter]
> to use write **this.l**
> 
> 
> returns {**float**} gets the left hand side of the box
> 
> 

---

#### left [getter]
> to use write **this.left**
> 
> 
> returns {**float**} gets the left hand side of the box
> 
> 

---

#### r [getter]
> to use write **this.r**
> 
> 
> returns {**float**} gets the right hand side of the box
> 
> 

---

#### right [getter]
> to use write **this.right**
> 
> 
> returns {**float**} gets the right hand side of the box
> 
> 

---

#### t [getter]
> to use write **this.t**
> 
> 
> returns {**float**} gets the top of the box
> 
> 

---

#### top [getter]
> to use write **this.top**
> 
> 
> returns {**float**} gets the top of the box
> 
> 

---

#### w [getter]
> to use write **this.w**
> 
> 
> returns {**float**} width of box
> 
> 

---

#### w [setter]
> to use write **this.w = value**
> 
> 
> **Parameters**
> 
> {**float**} **value** sets width of box
> 
> 

---

#### width [getter]
> to use write **this.width**
> 
> 
> returns {**float**} width of box
> 
> 

---

#### x [getter]
> to use write **this.x**
> 
> 
> returns {**float**} gets the left hand side of the box @returns {float}
> 
> 

---

#### x [setter]
> to use write **this.x = value**
> 
> 
> **Parameters**
> 
> {**float**} **value** sets left side of box
> 
> 

---

#### y [getter]
> to use write **this.y**
> 
> 
> returns {**float**} gets the top hand side of the box
> 
> 

---

#### y [setter]
> to use write **this.y = value**
> 
> 
> **Parameters**
> 
> {**float**} **value** sets top side of box
> 
> 

---

#### z [getter]
> to use write **this.z**
> 
> 
> returns {**float**} gets the front hand side of the box
> 
> 

---

#### z [setter]
> to use write **this.z = value**
> 
> 
> **Parameters**
> 
> {**float**} **value** sets front side of box
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
