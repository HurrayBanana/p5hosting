engine created by Hurray Banana &copy;2023-2024

this can be found in file **track.js**
## class vector2
> 
> 
> provides support for 2d values and associated helper functions and arithmetic
> 
> 

---

## Constructor
> #### constructor(x, y)
> to use write **new vector2(x, y)**
> 
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

## properties
## getters and setters
####   down [getter] [static]
> to use write **vector2.down**
> 
> 
> returns {**vector2**} new vector (0,1)
> 
> 

---

####   left [getter] [static]
> to use write **vector2.left**
> 
> 
> returns {**vector2**} new vector (-1,0)
> 
> 

---

####   one [getter] [static]
> to use write **vector2.one**
> 
> 
> returns {**vector2**} new vector (1,1)
> 
> 

---

####   right [getter] [static]
> to use write **vector2.right**
> 
> 
> returns {**vector2**} new vector (1,0)
> 
> 

---

####   up [getter] [static]
> to use write **vector2.up**
> 
> 
> returns {**vector2**} new vector (0,-1)
> 
> 

---

####   zero [getter] [static]
> to use write **vector2.zero**
> 
> 
> returns {**vector2**} new vector (0,0)
> 
> 

---

#### clone [getter]
> to use write **this.clone**
> 
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

#### distance [getter]
> to use write **this.distance**
> 
> gets the pre-calculated magnitude of the vector, alternative name
> 
> 
> returns {**float**}
> 
> 

---

#### h [getter]
> to use write **this.h**
> 
> 
> returns {**float**} gets the h component (2nd component) of the vector, alternative name (of y) for different contexts
> 
> 

---

#### h [setter]
> to use write **this.h = value**
> 
> 
> **Parameters**
> 
> {**float**} **value** sets the h component (2nd component) of the vector
> 
> 

---

#### isone [getter]
> to use write **this.isone**
> 
> 
> returns {**bool**} true if this vector is (1,1)}
> 
> 

---

#### iszero [getter]
> to use write **this.iszero**
> 
> 
> returns {**bool**} true if this vector is (0,0)}
> 
> 

---

#### length [getter]
> to use write **this.length**
> 
> gets the pre-calculated magnitude of the vector
> 
> 
> returns {**float**}
> 
> 

---

#### w [getter]
> to use write **this.w**
> 
> 
> returns {**float**} gets the w component (1st component) of the vector, alternative name (of x) for different contexts
> 
> 

---

#### w [setter]
> to use write **this.w = value**
> 
> 
> **Parameters**
> 
> {**float**} **value** sets the w component (1st component) of the vector
> 
> 

---

#### x [getter]
> to use write **this.x**
> 
> 
> returns {**float**} gets the x component (1st component) of the vector
> 
> 

---

#### x [setter]
> to use write **this.x = value**
> 
> 
> **Parameters**
> 
> {**float**} **value** sets the x component (1st component) of the vector
> 
> 

---

#### y [getter]
> to use write **this.y**
> 
> 
> returns {**float**} gets the y component (2nd component) of the vector
> 
> 

---

#### y [setter]
> to use write **this.y = value**
> 
> 
> **Parameters**
> 
> {**float**} **value** sets the y component (1st component) of the vector
> 
> 

---

## Methods
####  add(v1, v2) [static]
> to use write **vector2.add(v1, v2)**
> 
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

####  anglefromdirection(direction, additionalAngle) [static]
> to use write **vector2.anglefromdirection(direction, additionalAngle)**
> 
> The results and additional angles are in degrees use @see {@link anglefromdirectionR} for a version in radians
> 
> 
> returns {**float**} an angle in degrees which is the direction vector given plus the additional angle specified
> 
> 
> **Parameters**
> 
> {**vector2**} **direction** a 2d vector which you want the angle of
> 
> {**float**} **additionalAngle** additional angle in radians to add on to the
> 
> 

---

####  anglefromdirectionR(direction, additionalAngle) [static]
> to use write **vector2.anglefromdirectionR(direction, additionalAngle)**
> 
> The results and additional angles are in radians use @see {@link anglefromdirection} for a version in degrees
> 
> 
> returns {**float**} an angle in radians which is the direction vector given plus the additional angle specified
> 
> 
> **Parameters**
> 
> {**vector2**} **direction** a 2d vector which you want the angle of
> 
> {**float**} **additionalAngle** additional angle in radians to add on to the
> 
> 

---

####  directionfromangle(angle, additionalAngle) [static]
> to use write **vector2.directionfromangle(angle, additionalAngle)**
> 
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

####  directionfromangleR(angle, additionalAngle) [static]
> to use write **vector2.directionfromangleR(angle, additionalAngle)**
> 
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

####  distance(v1, v2) [static]
> to use write **vector2.distance(v1, v2)**
> 
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

####  distanceSQ(v1, v2) [static]
> to use write **vector2.distanceSQ(v1, v2)**
> 
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

####  dot(a, b) [static]
> to use write **vector2.dot(a, b)**
> 
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

####  lerp(a, b, p) [static]
> to use write **vector2.lerp(a, b, p)**
> 
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

####  lookAt(from, to, accuracy) [static]
> to use write **vector2.lookAt(from, to, accuracy)**
> 
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

####  normalised(x,y) [static]
> to use write **vector2.normalised(x,y)**
> 
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

####  ordinalise(direction) [static]
> to use write **vector2.ordinalise(direction)**
> 
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

####  sub(v1, v2) [static]
> to use write **vector2.sub(v1, v2)**
> 
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

#### add(vec, y)
> to use write **this.add(vec, y)**
> 
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

#### addNew(vec, y)
> to use write **this.addNew(vec, y)**
> 
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

#### cloneto(here)
> to use write **this.cloneto(here)**
> 
> clones this vector2 to the existing vector passed as a parameter, avoiding the need to instantiate another object
> 
> 
> **Parameters**
> 
> {**vector2**} **here** a vector2 instance to overwrite the values of
> 
> 

---

#### div(scalar)
> to use write **this.div(scalar)**
> 
> divides this vector by the scalar value
> 
> 
> **Parameters**
> 
> {**float**} **scalar** value to divide the components of this vector by
> 
> 

---

#### divNew(scalar)
> to use write **this.divNew(scalar)**
> 
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

#### mul(scalar)
> to use write **this.mul(scalar)**
> 
> multiplies this vector by the scalar value
> 
> 
> **Parameters**
> 
> {**float**} **scalar** value to multiply the components of this vector by
> 
> 

---

#### mulNew(scalar)
> to use write **this.mulNew(scalar)**
> 
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

#### normalise()
> to use write **this.normalise()**
> 
> normalises this vector (unit length 1) this destorys the orginal vector, this destroys the previous values.
> 
> If you want a normalised version of this vector withouth destroying its value then use @see {@link normalised}
> 
> 

---

#### normalised()
> to use write **this.normalised()**
> 
> 
> returns {**vector2**} a new vector that is the normalised form of this vector
> 
> 

---

#### set(x,y)
> to use write **this.set(x,y)**
> 
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

#### sub(vec, y)
> to use write **this.sub(vec, y)**
> 
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

#### subNew(vec, y)
> to use write **this.subNew(vec, y)**
> 
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

engine created by Hurray Banana &copy;2023-2024
