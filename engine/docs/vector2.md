> ### class vector2
> 
> 
> provides support for 2d values and associated helper functions and arithmetic
> 
> 

---

> #### #x=0
> base storage if 1st component @type {float}
> 
> 

---

> #### #y=0
> base storage if 2nd component @type {float}
> 
> 

---

> #### #length
> dirty storage of length pre-calculated when components change @type {float}
> 
> 

---

> #### getter length
> gets the pre-calculated magnitude of the vector
> 
> 
> returns {**float**}
> 
> 

---

> #### getter distance
> gets the pre-calculated magnitude of the vector, alternative name
> 
> 
> returns {**float**}
> 
> 

---

> #### getter iszero
> 
> returns {**bool**} true if this vector is (0,0)}
> 
> 

---

> #### getter isone
> 
> returns {**bool**} true if this vector is (1,1)}
> 
> 

---

> #### getter x
> 
> returns {**float**} gets the x component (1st component) of the vector
> 
> 

---

> #### getter y
> 
> returns {**float**} gets the y component (2nd component) of the vector
> 
> 

---

> #### getter w
> 
> returns {**float**} gets the w component (1st component) of the vector, alternative name (of x) for different contexts
> 
> 

---

> #### getter h
> 
> returns {**float**} gets the h component (2nd component) of the vector, alternative name (of y) for different contexts
> 
> 

---

> #### setter x
> 
> **Parameters**
> 
> {**float**} **value** sets the x component (1st component) of the vector
> 
> 

---

> #### setter y
> 
> **Parameters**
> 
> {**float**} **value** sets the y component (1st component) of the vector
> 
> 

---

> #### setter w
> 
> **Parameters**
> 
> {**float**} **value** sets the w component (1st component) of the vector
> 
> 

---

> #### setter h
> 
> **Parameters**
> 
> {**float**} **value** sets the h component (2nd component) of the vector
> 
> 

---

> #### getter clone
> returns a new vector2 that is a copy of the values of this one, not a reference a separate object
> 
> be warned clone creates an object so is about 20x slower than setting individual vector coords
> 
> 
> returns {**vector2**} a new vector2 with the same values as this vector2
> 
> ```js
> example
>       b.x = a.x;
>       b.y = a.y;
>       
>       //or using a.cloneto(b);
> ```
> 

---

> #### static getter zero
> 
> returns {**vector2**} new vector (0,0)
> 
> 

---

> #### static getter one
> 
> returns {**vector2**} new vector (1,1)
> 
> 

---

> #### static getter left
> 
> returns {**vector2**} new vector (-1,0)
> 
> 

---

> #### static getter right
> 
> returns {**vector2**} new vector (1,0)
> 
> 

---

> #### static getter up
> 
> returns {**vector2**} new vector (0,-1)
> 
> 

---

> #### static getter down
> 
> returns {**vector2**} new vector (0,1)
> 
> 

---

> #### constructor(x, y)
> Creates a vector2 value with the two initial values
> 
> 
> **Parameters**
> 
> {**float**} **x** 
> 
> {**float**} **y** 
> 
> 

---

> #### set(x,y)
> sets the x and y components of the vector2
> 
> 
> **Parameters**
> 
> {**float**} **x** x value to set
> 
> {**float**} **y** y value to set
> 
> 

---

> #### #calcdist()
> calculates the length of the vector
> 
> 

---

> #### static lerp(a, b, p)
> produces a vector2 value interpolated between vectors a and b
> 
> 
> returns {**vector2**} interpolated
> 
> 
> **Parameters**
> 
> {**vector2**} **a** first vector2
> 
> {**vector2**} **b** second vector2
> 
> {**float**} **p** value between 0 and 1 controlling interpolation between a and b
> 
> 

---

> #### normalise()
> normalises this vector (unit length 1) this destorys the orginal vector, this destroys the previous values.
> 
> If you want a normalised version of this vector withouth destroying its value then use @see {@link normalised}
> 
> 

---

> #### normalised()
> 
> returns {**vector2**} a new vector that is the normalised form of this vector
> 
> 

---

> #### static normalised(x,y)
> returns a new vector2 that is the normalised version of component values
> 
> 
> returns {**vector2**} a new vector2 instance which is a normalised version of the given component values
> 
> 
> **Parameters**
> 
> {**float**} **x** the x component of a vector
> 
> {**float**} **y** the y component of a vector
> 
> 

---

> #### static anglefromdirection(direction, additionalAngle)
> The results and additional angles are in degrees use @see {@link anglefromdirectionR} for a version in radians
> 
> 
> returns {**float**} an angle in degrees which is the direction vector given plus the additional angle specified
> 
> 
> **Parameters**
> 
> {*****} **direction** a 2 vector which you want the angle of
> 
> {*****} **additionalAngle** additional angle in radians to add on to the
> 
> 

---

> #### static anglefromdirectionR(direction, additionalAngle)
> The results and additional angles are in radians use @see {@link anglefromdirection} for a version in degrees
> 
> 
> returns {**float**} an angle in radians which is the direction vector given plus the additional angle specified
> 
> 
> **Parameters**
> 
> {*****} **direction** a 2 vector which you want the angle of
> 
> {*****} **additionalAngle** additional angle in radians to add on to the
> 
> 

---

> #### static directionfromangle(angle, additionalAngle)
> takes an angle and turns it into a direction vector that can be used for velocities or other movement
> 
> 
> returns {**vector2**} a direction vector in the direction of the 2 angles requested
> 
> 
> **Parameters**
> 
> {**float**} **angle** in degrees to convert to direction
> 
> {**float**} **additionalAngle** a further angle to add on in degrees
> 
> 

---

> #### static directionfromangleR(angle, additionalAngle)
> takes an angle and turns it into a direction vector that can be used for velocities or other movement
> 
> 
> returns {**vector2**} a direction vector in the direction of the 2 angles requested
> 
> 
> **Parameters**
> 
> {**float**} **angle** in radians to convert to direction
> 
> {**float**} **additionalAngle** a further angle to add on in radians
> 
> 

---

> #### static lookAt(from, to, accuracy)
> Returns a normalised direction vector looking from the starting sprite to the other sprite
> 
> 
> returns {**vector2**} normalised Vector2 direction vector
> 
> 
> **Parameters**
> 
> {**vector2**} **from** start position
> 
> {**vector2**} **to** the direction to look towards
> 
> {**DirectionAccuracy**} **accuracy** choose either free direction or lock to ordinals NSEW
> 
> 

---

> #### static ordinalise(direction)
> attempts to give a direction vector as close to the ordinal directions (NSEW)
> 
> 
> returns {**vector2**} containing NSEW directions only
> 
> 
> **Parameters**
> 
> {**vector2**} **direction** vector to ordinalise
> 
> 

---

> #### static dot(a, b)
> calculates the dot product between 2 vector2 values
> 
> 
> returns {**float**} the dot product
> 
> 
> **Parameters**
> 
> {**vector2**} **a** first vector
> 
> {**vector2**} **b** second vector
> 
> 

---

> #### mulNew(scalar)
> Produces a new vector2 that is this vector multiplied the scalar value
> 
> 
> returns {**vector2**} a new vector2 that is this vector multiplied by the scalar value
> 
> 
> **Parameters**
> 
> {**float**} **scalar** value to multiply the components of this vector by
> 
> 

---

> #### divNew(scalar)
> Produces a new vector2 that is this vector divided the scalar value
> 
> 
> returns {**vector2**} a new vector2 that is this vector divided by the scalar value
> 
> 
> **Parameters**
> 
> {**float**} **scalar** value to multiply the components of this vector by
> 
> 

---

> #### mul(scalar)
> multiplies this vector by the scalar value
> 
> 
> **Parameters**
> 
> {**float**} **scalar** value to multiply the components of this vector by
> 
> 

---

> #### div(scalar)
> divides this vector by the scalar value
> 
> 
> **Parameters**
> 
> {**float**} **scalar** value to divide the components of this vector by
> 
> 

---

> #### add(vec, y)
> Adds either a vector2 to this vector or two component values to this vector
> 
> 
> **Parameters**
> 
> {**float|vector2**} **vec** if you supply a vector2 value then it is added to this vector2 value
> 
> {**float|undefined**} **y** if defined then the 2 parameters are assumed to be an x and y value to add to this vector2 components
> 
> 

---

> #### sub(vec, y)
> subtracts either a vector2 from this vector or two component values from this vector
> 
> 
> **Parameters**
> 
> {**float|vector2**} **vec** if you supply a vector2 value then it is subtract from this vector2 value
> 
> {**float|undefined**} **y** if defined then the 2 parameters are assumed to be an x and y value to subtract from this vector2 components
> 
> 

---

> #### addNew(vec, y)
> creates a new vector2 by adding either a vector2 to this vector or two component values to this vector
> 
> 
> returns {**vector2**} a new vector2 adding the vectors or components together without affecting this vector2
> 
> 
> **Parameters**
> 
> {**float|vector2**} **vec** if you supply a vector2 value then it is added to this vector2 value
> 
> {**float|undefined**} **y** if defined then the 2 parameters are assumed to be an x and y value to add to this vector2 components
> 
> 

---

> #### subNew(vec, y)
> creates a new vector2 by subtracting either a vector2 from this vector or two component values from this vector
> 
> 
> returns {**vector2**} a new vector2 subtracting the vectors or components together without affecting this vector2
> 
> 
> **Parameters**
> 
> {**float|vector2**} **vec** if you supply a vector2 value then it is subtracted from this vector2 value
> 
> {**float|undefined**} **y** if defined then the 2 parameters are assumed to be an x and y value to subtract from this vector2 components
> 
> 

---

> #### static add(v1, v2)
> adds 2 vectors together v1 + v2
> 
> 
> returns {**vector2**} a new vector2 adding two supplied vectors
> 
> 
> **Parameters**
> 
> {**vector2**} **v1** first vector to add
> 
> {**vector2**} **v2** second vector to add
> 
> 

---

> #### static sub(v1, v2)
> subtracts 2 vectors v1 - v2
> 
> 
> returns {**vector2**} a new vector2 subtracting two supplied vectors
> 
> 
> **Parameters**
> 
> {**vector2**} **v1** first vector
> 
> {**vector2**} **v2** second vector to subtract from the first one
> 
> 

---

> #### static distance(v1, v2)
> calculates the distance between 2 point vectors
> 
> 
> returns {**float**} distance between 2 point vectors
> 
> 
> **Parameters**
> 
> {**vector2**} **v1** start point
> 
> {**vector2**} **v2** end point
> 
> 

---

> #### static distanceSQ(v1, v2)
> calculates the distance between 2 point vectors without performing square root
> 
> 
> returns {**float**} squared distance between 2 point vectors
> 
> 
> **Parameters**
> 
> {**vector2**} **v1** start point
> 
> {**vector2**} **v2** end point
> 
> 

---

> #### cloneto(here)
> clones this vector2 to the existing vector passed as a parameter, avoiding the need to instantiate another object
> 
> 
> **Parameters**
> 
> {**vector2**} **here** a vector2 instance to overwrite the values of
> 
> 

---

