engine created by Hurray Banana &copy;2023-2024
## class vector3
>  3d position and methods
> 
> 

---

## Constructor
> #### constructor(x, y, z)
> to use write **new vector3(x, y, z)**
> 
> creates an instance of a new vector3
> 
> 
> **Parameters**
> 
> {**float**} **x** initial x component of vector
> 
> {**float**} **y** initial y component of vector
> 
> {**float**} **z** initial z component of vector if missing z component is set to zero
> 
> 

---

## properties
#### angularDirectionTo(from, directionVector, to, minimumAngle)
> to use write **this.angularDirectionTo(from, directionVector, to, minimumAngle)**
> 
> Determines whether rotating clockwise or anticlockwise is closest for a given position and direction
> 
> Useful for create homing and tracking effects, returns -1 if turned anti-clocwise, 1 if clockwise or 0 if didn't turn
> 
> 

---

## getters and setters
####   backward [getter] [static]
> to use write **vector3.backward**
> 
> 
> returns {**vector3**} a new vector3 object (0,0,-1)
> 
> 

---

####   down [getter] [static]
> to use write **vector3.down**
> 
> 
> returns {**vector3**} a new vector3 object (0,1,0)
> 
> 

---

####   forward [getter] [static]
> to use write **vector3.forward**
> 
> 
> returns {**vector3**} a new vector3 object (0,0,1)
> 
> 

---

####   left [getter] [static]
> to use write **vector3.left**
> 
> 
> returns {**vector3**} a new vector3 object (-1,0,0)
> 
> 

---

####   one [getter] [static]
> to use write **vector3.one**
> 
> 
> returns {**vector3**} a new vector3 object (1,1,1)
> 
> 

---

####   right [getter] [static]
> to use write **vector3.right**
> 
> 
> returns {**vector3**} a new vector3 object (1,0,0)
> 
> 

---

####   up [getter] [static]
> to use write **vector3.up**
> 
> 
> returns {**vector3**} a new vector3 object (0,-1,0)
> 
> 

---

####   zero [getter] [static]
> to use write **vector3.zero**
> 
> 
> returns {**vector3**} a new vector3 object (0,0,0)
> 
> 

---

#### clone [getter]
> to use write **this.clone**
> 
> create a new instance of a vector3 with the values of this one - not a reference
> 
> 

---

#### clone [getter]
> to use write **this.clone**
> 
> returns a new vector3 that is a copy of the values of this one, not a reference a separate object
> 
> be warned clone creates an object so is about 20x slower than setting individual vector coords
> 
> b.x = a.x
> 
> b.y = a.y
> 
> b.z = a.z
> 
> 
> returns {**vector3**} new vector3 instance based on this ones values
> 
> 

---

#### d [getter]
> to use write **this.d**
> 
> gets the depth component of the vector (z component)
> 
> 
> returns {**float**} value
> 
> 

---

#### d [setter]
> to use write **this.d = value**
> 
> sets the depth component (z component of the vector)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

#### distance [getter]
> to use write **this.distance**
> 
> 
> returns {**float**} pre calculated length of vector3, also it's magnitude
> 
> 

---

#### h [getter]
> to use write **this.h**
> 
> gets the height component of the vector (y component)
> 
> 
> returns {**float**} value
> 
> 

---

#### h [setter]
> to use write **this.h = value**
> 
> sets the height component (y component of the vector)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

#### isone [getter]
> to use write **this.isone**
> 
> 
> returns {**bool**} true if all 3 components are 1
> 
> 

---

#### iszero [getter]
> to use write **this.iszero**
> 
> 
> returns {**bool**} true if all 3 components are 0
> 
> 

---

#### length [getter]
> to use write **this.length**
> 
> 
> returns {**float**} pre calculated length of vector3, also it's magnitude
> 
> 

---

#### w [getter]
> to use write **this.w**
> 
> gets the width component of the vector (x component)
> 
> 
> returns {**float**} value
> 
> 

---

#### w [setter]
> to use write **this.w = value**
> 
> sets the width component (x component of the vector)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

#### x [getter]
> to use write **this.x**
> 
> gets the x component of the vector
> 
> 
> returns {**float**} value
> 
> 

---

#### x [setter]
> to use write **this.x = value**
> 
> sets the x component of the vector
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

#### y [getter]
> to use write **this.y**
> 
> gets the y component of the vector
> 
> 
> returns {**float**} value
> 
> 

---

#### y [setter]
> to use write **this.y = value**
> 
> sets the y component of the vector
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

#### z [getter]
> to use write **this.z**
> 
> gets the z component of the vector
> 
> 
> returns {**float**} value
> 
> 

---

#### z [setter]
> to use write **this.z = value**
> 
> sets the z component of the vector
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

## Methods
####  add(a, b) [static]
> to use write **vector3.add(a, b)**
> 
> add the 2 given vector3's returning a new instance v1 + v2
> 
> 
> returns {**vector3**}
> 
> 
> **Parameters**
> 
> {**vector3**} **a** first vector
> 
> {**vector3**} **b** second vector
> 
> 

---

####  anglefromdirection(direction, additionalAngle) [static]
> to use write **vector3.anglefromdirection(direction, additionalAngle)**
> 
> returns the angle of the given  direction vector
> 
> This only examines 2d values as it is a bearing (which is 2d)
> 
> 
> returns {**float**} angle in degrees
> 
> 
> **Parameters**
> 
> {**vector3**} **direction** direction to convert
> 
> {**float**} **additionalAngle** to add on to the direction in degrees
> 
> 

---

####  anglefromdirectionR(direction, additionalAngle) [static]
> to use write **vector3.anglefromdirectionR(direction, additionalAngle)**
> 
> returns the angle of the given  direction vector
> 
> This only examines 2d values as it is a bearing (which is 2d)
> 
> 
> returns {**float**} angle in radians
> 
> 
> **Parameters**
> 
> {**vector3**} **direction** direction to convert
> 
> {*****} **additionalAngle** to add on to the direction in radians
> 
> 

---

####  cross(a, b) [static]
> to use write **vector3.cross(a, b)**
> 
> calculates just the normal to the 2 given vectors
> 
> 
> **Parameters**
> 
> {**vector3**} **a** 
> 
> {**vector3**} **b** 
> 
> 

---

####  crosszonly(a, b) [static]
> to use write **vector3.crosszonly(a, b)**
> 
> calculates just the z component on the normal to 2 given vectors (the angle between 2 vectors)
> 
> 
> returns {**float**}
> 
> 
> **Parameters**
> 
> {**vector3**} **a** 
> 
> {**vector3**} **b** 
> 
> 

---

####  directionfromangle(angle, additionalAngle) [static]
> to use write **vector3.directionfromangle(angle, additionalAngle)**
> 
> returns the 3d vector based on the angle
> 
> The z value is set to zero
> 
> 
> returns {**vector3**} a new vector3 unit direction vector
> 
> 
> **Parameters**
> 
> {**float**} **angle** in degrees
> 
> {**float**} **additionalAngle** an angle to add on in degrees
> 
> 

---

####  directionfromangle(angle, additionalAngle) [static]
> to use write **vector3.directionfromangle(angle, additionalAngle)**
> 
> returns the 3d vector based on the angle
> 
> The z value is set to zero
> 
> 
> returns {**vector3**} a new vector3 unit direction vector
> 
> 
> **Parameters**
> 
> {**float**} **angle** in radians
> 
> {**float**} **additionalAngle** an angle to add on in radians
> 
> 

---

####  distance(a, b) [static]
> to use write **vector3.distance(a, b)**
> 
> returns the distance between the 2 vector3 objects
> 
> 
> returns {**float**}
> 
> 
> **Parameters**
> 
> {**vector3**} **a** first vector
> 
> {**vector3**} **b** second vector
> 
> 

---

####  distanceSQ(a, b) [static]
> to use write **vector3.distanceSQ(a, b)**
> 
> returns the square distance between 2 vector3's
> 
> faster to compare squares if only relative difference is required
> 
> 
> returns {**float**}
> 
> 
> **Parameters**
> 
> {**vector3**} **a** first vector
> 
> {**vector3**} **b** second vector
> 
> 

---

####  dot(a, b) [static]
> to use write **vector3.dot(a, b)**
> 
> calculates the dot product between 2 vector3 values
> 
> 
> **Parameters**
> 
> {**vector3**} **a** 
> 
> {**vector3**} **b** 
> 
> 

---

####  lerp(a, b, p) [static]
> to use write **vector3.lerp(a, b, p)**
> 
> produces a vector3 value interpolated between vectors a and b
> 
> 
> returns {**vector3**} interpolated
> 
> 
> **Parameters**
> 
> {**vector3**} **a** first vector3
> 
> {**vector3**} **b** second vector3
> 
> {**float**} **p** value between 0 and 1 controlling interpolation between a and b
> 
> 

---

####  normalised(x,y,z) [static]
> to use write **vector3.normalised(x,y,z)**
> 
> creates a normalised vector based on the x and y and z values
> 
> 
> returns {**vector3**} unit vector3
> 
> 
> **Parameters**
> 
> {**float**} **x** 
> 
> {**float**} **y** 
> 
> {**float**} **z** 
> 
> 

---

####  ordinalise(direction) [static]
> to use write **vector3.ordinalise(direction)**
> 
> finds the ordinalised (cardinals NSEW) direction closest to the given direction vector
> 
> 
> returns {**vector3**} in one of NSEW directions
> 
> 
> **Parameters**
> 
> {**vector3**} **direction** direction vector to
> 
> 

---

####  sub(a, b) [static]
> to use write **vector3.sub(a, b)**
> 
> subtract the 2 given vector3's returning a new one a - b
> 
> 
> returns {**vector3**}
> 
> 
> **Parameters**
> 
> {**vector3**} **a** first vector
> 
> {**vector3**} **b** second vector
> 
> 

---

#### add(x, y, z)
> to use write **this.add(x, y, z)**
> 
> if the first parameter is a vector3 object then it is added to this vector
> 
> if all 3 parameters are suppied then they are taken as individual
> 
> x y and z value
> 
> 
> **Parameters**
> 
> {**float|vector3**} **x** either the x component of a vector (supply y and z parameters) or a vector3 value (don't supply y or z parameters)
> 
> {**float**} **y** y component of a vector
> 
> {**float**} **z** z component of a vector
> 
> 

---

#### cloneto(here)
> to use write **this.cloneto(here)**
> 
> clones this vector3 to the existing vector passed as a parameter
> 
> 
> **Parameters**
> 
> {**vector3**} **here** 
> 
> 

---

#### div(scalar)
> to use write **this.div(scalar)**
> 
> divides this vector by the scaler value
> 
> vector3 / scaler
> 
> 
> **Parameters**
> 
> {**float**} **scalar** 
> 
> 

---

#### divNew(scalar)
> to use write **this.divNew(scalar)**
> 
> divides this vector3 by the scaler and returns a new vector3
> 
> 
> returns {**vector3**} new instance
> 
> 
> **Parameters**
> 
> {**float**} **scalar** 
> 
> 

---

#### equal(a)
> to use write **this.equal(a)**
> 
> returns true if given vector is the same value as this one
> 
> 
> returns {**bool**} true if 3 components are the same, false if any one component isn;t
> 
> 
> **Parameters**
> 
> {**vector3**} **a** vector to compare
> 
> 

---

#### lookAt(from, to, accuracy, includeZ)
> to use write **this.lookAt(from, to, accuracy, includeZ)**
> 
> Returns a normalised direction vector looking from the starting position to the other position
> 
> 
> returns {**vector3**} A normalised Vector3 direction vector in chosen direction
> 
> 
> **Parameters**
> 
> {**vector3**} **from** start position
> 
> {**vector3**} **to** the direction to look towards
> 
> {**DirectionAccuracy**} **accuracy** gives exact direction if DirectionAccuracy.free or ordinalised if DirectionAccuracy.ordinals
> 
> {**bool**} **includeZ** Specify true if you want to take the Z value into account
> 
> 

---

#### mul(scalar)
> to use write **this.mul(scalar)**
> 
> multiplies this vector by the scaler value
> 
> 
> **Parameters**
> 
> {**float**} **scalar** 
> 
> 

---

#### mulNew(scalar)
> to use write **this.mulNew(scalar)**
> 
> multiplies this vector3 by the scaler and returns a new vector3
> 
> 
> returns {**vector3**} new instance
> 
> 
> **Parameters**
> 
> {**float**} **scalar** 
> 
> 

---

#### normalise()
> to use write **this.normalise()**
> 
> normalises this vector (unit length 1) this destroys the orginal vector
> 
> use normalisedclone if you want a new vector that is the normalised version of this vector
> 
> 

---

#### normalisedclone()
> to use write **this.normalisedclone()**
> 
> returns a new vector3 that is the normalised form of this vector3
> 
> 
> returns {**vector3**} a new vector3 instance which is the normalised version of this vector3
> 
> 

---

#### set(x, y, z)
> to use write **this.set(x, y, z)**
> 
> sets the vector and calculates its length
> 
> 
> **Parameters**
> 
> {**float**} **x** 
> 
> {**float**} **y** 
> 
> {**float**} **z** 
> 
> 

---

#### sub(x, y, z)
> to use write **this.sub(x, y, z)**
> 
> if the first parameter is a vector3 object then it is subtracted from this vector
> 
> this - vector3 or this - vector3(x,y,z)
> 
> if all 3 parameters are suppied then they are taken as individual
> 
> x y and z value
> 
> 
> **Parameters**
> 
> {**float|vector3**} **x** either the x component of a vector (supply y and z parameters) or a vector3 value (don't supply y or z parameters)
> 
> {**float**} **y** y component of a vector
> 
> {**float**} **z** z component of a vector
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
