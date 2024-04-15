> ### class Box
> @classdesc support for box areas (rectangle with depth)
> 
> 

---

> #### #corner
> top front left corner of box @type {vector3}
> 
> 

---

> #### #dimension
> width, height and depth of box @type {vector3}
> 
> 

---

> #### getter centrex
> gets the x centre of the box @returns {float}
> 
> 

---

> #### getter centrey
> gets the y centre of the box @returns {float}
> 
> 

---

> #### getter centrez
> gets the z centre of the box @returns {float}
> 
> 

---

> #### getter centre
> gets the centre of the box @returns {vector3}
> 
> 

---

> #### getter x
> gets the left hand side of the box @returns {float}
> 
> 

---

> #### getter y
> gets the top hand side of the box @returns {float}
> 
> 

---

> #### getter z
> gets the front hand side of the box @returns {float}
> 
> 

---

> #### setter x
> 
> **Parameters**
> 
> {***  {float**} **value** sets left side of box
> 
> 

---

> #### setter y
> 
> **Parameters**
> 
> {***  {float**} **value** sets top side of box
> 
> 

---

> #### setter z
> 
> **Parameters**
> 
> {***  {float**} **value** sets front side of box
> 
> 

---

> #### setter w
> 
> **Parameters**
> 
> {***  {float**} **value** sets width of box
> 
> 

---

> #### setter h
> 
> **Parameters**
> 
> {***  {float**} **value** sets height of box
> 
> 

---

> #### setter d
> 
> **Parameters**
> 
> {***  {float**} **value** sets depth of box
> 
> 

---

> #### getter l
> gets the left hand side of the box @returns {float}
> 
> 

---

> #### getter r
> gets the right hand side of the box @returns {float}
> 
> 

---

> #### getter t
> gets the top of the box @returns {float}
> 
> 

---

> #### getter b
> gets the bottom of the box @returns {float}
> 
> 

---

> #### getter w
> width of box @returns {float}
> 
> 

---

> #### getter h
> height of box @returns {float}
> 
> 

---

> #### getter d
> depth of box @returns {float}
> 
> 

---

> #### getter left
> gets the left hand side of the box @returns {float}
> 
> 

---

> #### getter right
> gets the right hand side of the box @returns {float}
> 
> 

---

> #### getter top
> gets the top of the box @returns {float}
> 
> 

---

> #### getter bottom
> gets the bottom of the box @returns {float}
> 
> 

---

> #### getter front
> gets the front of the box @returns {float}
> 
> 

---

> #### getter back
> gets the back of the box @returns {float}
> 
> 

---

> #### getter width
> width of box @returns {float}
> 
> 

---

> #### getter height
> height of box @returns {float}
> 
> 

---

> #### getter depth
> depth of box @returns {float}
> 
> 

---

> #### static getter unit
> creates a unit box with corner 0,0,0 and dimensions 1,1,1 @returns {Box}
> 
> 

---

> #### constructor(left, top, front, width, height, depth)
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

> #### flate(offsets)
> increases or decreases (-ve values decrease/+ve value increase) the dimensions of the box
> 
> 
> **Parameters**
> 
> {**vector3**} **offsets** specify the changes in width, height and depth of the box
> 
> 

---

