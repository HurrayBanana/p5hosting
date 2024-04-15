> ### class View
> describes a rectangle viewport to control display areas, defaults to same size of canvas
> 
> 

---

> #### clamp = true
> determines if viewport is prevented from extended beyond the world defined area
> 
> when moving or positioning the viewport
> 
> 
> {**bool**}
> 
> 

---

> #### #position
> current position of the viewport @type {vector3}
> 
> 

---

> #### #area
> rectangular area of the viewport x and y values are always zero but does state width and height
> 
> 
> {**Rectangle**}
> 
> 

---

> #### #movedarea
> as area but the x and y positions reflect the current position of the viewport
> 
> 

---

> #### getter area
> rectangular area of the viewport x and y values are always zero but does state width and height
> 
> 
> returns {**Rectangle**}
> 
> 

---

> #### getter worldarea
> as area but the x and y positions reflect the current position of the viewport in the world
> 
> 
> returns {**Rectangle**}
> 
> 

---

> #### getter position
> the position of the viewport, it's displacement as a vector3 value
> 
> 
> returns {**vector3**}
> 
> 

---

> #### setter position
> sets the position of the viewport in the world using a vector3 value
> 
> if clamp is set to true then the viewport will be restricted to the world area
> 
> 
> **Parameters**
> 
> {**vector3**} **value** 
> 
> 

---

> #### getter position2d
> the position of the viewport, it's displacement as a vector2 value
> 
> 
> returns {**vector2**}
> 
> 

---

> #### setter position2d
> sets the position of the viewport in the world using a vector2 value
> 
> if clamp is set to true then the viewport will be restricted to the world area
> 
> 
> **Parameters**
> 
> {**vector2**} **value** 
> 
> 

---

> #### getter w
> gets the width of the viewport @returns {float}
> 
> 

---

> #### getter h
> gets the height of the viewport @returns {float}
> 
> 

---

> #### getter x
> gets the horizontal position (offset) of the viewport @returns {float}
> 
> 

---

> #### setter x
> sets the horizontal position (offset) of the viewport @param {float} value
> 
> if clamp is set the horizontal position will be set such that the viewport stays within the world area defined
> 
> 

---

> #### getter y
> gets the vertical position (offset) of the viewport @returns {float}
> 
> 

---

> #### setter y
> sets the vertical position (offset) of the viewport @param {float} value
> 
> if clamp is set the vertical position will be set such that the viewport stays within the world area defined
> 
> 

---

> #### constructor(viewport, startx, starty)
> Creates a new viewport
> 
> 
> **Parameters**
> 
> {**Rectangle**} **viewport** a rectangular region to size the viewport (the width and height are what is taken from the rectangle)
> 
> {**float**} **startx** a start position for the horizontal position of the viewport in the world
> 
> {**float**} **starty** a start position for the vertical position of the viewport in the world
> 
> 

---

> #### AM_I_NEEDED_in(r, world)
> I don't know what this is actually supposed to do, Sprite draw is using the rectangle version, this might be old/not needed in this form
> 
> I'm going to rename to see if it breaks anything
> 
> 
> returns {**bool**}
> 
> 
> **Parameters**
> 
> {**Rectangle**} **r** 
> 
> {**bool**} **world** 
> 
> 

---

