engine created by Hurray Banana &copy;2023-2024
## class View
> describes a rectangle viewport to control display areas, defaults to same size of canvas
> 
> 

---

## Constructor
> #### constructor(viewport, startx, starty)
> to use write **new View(viewport, startx, starty)**
> 
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

## properties
#### #area
> to use write **this.#area**
> 
> rectangular area of the viewport x and y values are always zero but does state width and height
> 
> 
> type {**Rectangle**}
> 
> 

---

#### #movedarea
> to use write **this.#movedarea**
> 
> as area but the x and y positions reflect the current position of the viewport
> 
> 

---

#### #position
> to use write **this.#position**
> 
> current position of the viewport @type {vector3}
> 
> 

---

#### clamp
> default value **true**
> 
> to use write **this.clamp**
> 
> determines if viewport is prevented from extended beyond the world defined area
> 
> when moving or positioning the viewport
> 
> 
> type {**bool**}
> 
> 

---

## getters and setters
#### area [getter]
> to use write **this.area**
> 
> rectangular area of the viewport x and y values are always zero but does state width and height
> 
> 
> returns {**Rectangle**}
> 
> 

---

#### h [getter]
> to use write **this.h**
> 
> gets the height of the viewport @returns {float}
> 
> 

---

#### position [getter]
> to use write **this.position**
> 
> the position of the viewport, it's displacement as a vector3 value
> 
> 
> returns {**vector3**}
> 
> 

---

#### position [setter]
> to use write **this.position = value**
> 
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

#### position2d [getter]
> to use write **this.position2d**
> 
> the position of the viewport, it's displacement as a vector2 value
> 
> 
> returns {**vector2**}
> 
> 

---

#### position2d [setter]
> to use write **this.position2d = value**
> 
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

#### w [getter]
> to use write **this.w**
> 
> gets the width of the viewport @returns {float}
> 
> 

---

#### worldarea [getter]
> to use write **this.worldarea**
> 
> as area but the x and y positions reflect the current position of the viewport in the world
> 
> 
> returns {**Rectangle**}
> 
> 

---

#### x [getter]
> to use write **this.x**
> 
> gets the horizontal position (offset) of the viewport @returns {float}
> 
> 

---

#### x [setter]
> to use write **this.x = value**
> 
> sets the horizontal position (offset) of the viewport @param {float} value
> 
> if clamp is set the horizontal position will be set such that the viewport stays within the world area defined
> 
> 

---

#### y [getter]
> to use write **this.y**
> 
> gets the vertical position (offset) of the viewport @returns {float}
> 
> 

---

#### y [setter]
> to use write **this.y = value**
> 
> sets the vertical position (offset) of the viewport @param {float} value
> 
> if clamp is set the vertical position will be set such that the viewport stays within the world area defined
> 
> 

---

## Methods
#### AM_I_NEEDED_in(r, world)
> to use write **this.AM_I_NEEDED_in(r, world)**
> 
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

engine created by Hurray Banana &copy;2023-2024
