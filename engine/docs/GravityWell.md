engine created by Hurray Banana &copy;2023-2024
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
> {**float**} **gigaTonnes** 
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

#### #pointmass
> to use write **this.#pointmass**
> 
> 
> type {**float**} The mass of this gravity well in GigaTonnes (this diminishes over distance in a linear way
> 
> 

---

#### #precalc
> to use write **this.#precalc**
> 
> 
> type {**float**} pre calculated value of mass and gravity
> 
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

engine created by Hurray Banana &copy;2023-2024
