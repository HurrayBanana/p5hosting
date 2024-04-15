> ### class GravityWell
> @classdesc Defines a gravity well that can act upon a sprite if associated
> 
> 

---

> #### location
> 
> {**vector3**} The position of this gravity well as a vector3
> 
> 

---

> #### #pointmass
> 
> {**float**} The mass of this gravity well in GigaTonnes (this diminishes over distance in a linear way
> 
> 

---

> #### static GM = 6.673E-11
> 
> {**float**} gravitational constant
> 
> 

---

> #### #precalc
> 
> {**float**} pre calculated value of mass and gravity
> 
> 

---

> #### getter precalc
> 
> returns {**float**} gets the pre-calculate gravitaional force
> 
> 

---

> #### getter pointmass
> 
> returns {**float**} gets the point mass for the well in GigaTonnes
> 
> 

---

> #### setter pointmass
> sets the point mass for the well in GigaTonnes
> 
> 
> **Parameters**
> 
> {**float**} **value** mass in giga tonnes
> 
> 

---

> #### constructor(location, gigaTonnes)
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

> #### cleanup()
> removes a reference to a location if it existed.
> 
> If you inherit from GravityWell and need to remove your own resources then implement your own
> 
> version of cleanup  but remember to call super.cleanup()
> 
> 

---

