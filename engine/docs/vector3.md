> ### class vector3
> @classdesc 3d position and methods
> 
> 

---

> #### #x=0
> 
> {**float**} holds x component
> 
> 

---

> #### #y=0
> 
> {**float**} holds y component
> 
> 

---

> #### #z=0
> 
> {**float**} holds z component
> 
> 

---

> #### #length
> 
> {**float**} holds length of component
> 
> 

---

> #### angularDirectionTo(from, directionVector, to, minimumAngle)
> Determines whether rotating clockwise or anticlockwise is closest for a given position and direction
> 
> Useful for create homing and tracking effects, returns -1 if turned anti-clocwise, 1 if clockwise or 0 if didn't turn
> 
> 

---

> #### getter length
> 
> returns {**float**} pre calculated length of vector3, also it's magnitude
> 
> 

---

> #### getter distance
> 
> returns {**float**} pre calculated length of vector3, also it's magnitude
> 
> 

---

> #### getter iszero
> 
> returns {**bool**} true if all 3 components are 0
> 
> 

---

> #### getter isone
> 
> returns {**bool**} true if all 3 components are 1
> 
> 

---

> #### getter clone
> create a new instance of a vector3 with the values of this one - not a reference
> 
> 

---

> #### getter x
> gets the x component of the vector
> 
> 
> returns {**float**} value
> 
> 

---

> #### getter y
> gets the y component of the vector
> 
> 
> returns {**float**} value
> 
> 

---

> #### getter z
> gets the z component of the vector
> 
> 
> returns {**float**} value
> 
> 

---

> #### getter w
> gets the width component of the vector (x component)
> 
> 
> returns {**float**} value
> 
> 

---

> #### getter h
> gets the height component of the vector (y component)
> 
> 
> returns {**float**} value
> 
> 

---

> #### getter d
> gets the depth component of the vector (z component)
> 
> 
> returns {**float**} value
> 
> 

---

> #### setter x
> sets the x component of the vector
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

> #### setter y
> sets the y component of the vector
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

> #### setter z
> sets the z component of the vector
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

> #### setter w
> sets the width component (x component of the vector)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

> #### setter h
> sets the height component (y component of the vector)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

> #### setter d
> sets the depth component (z component of the vector)
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

> #### getter clone
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

> #### static getter zero
> 
> returns {**vector3**} a new vector3 object (0,0,0)
> 
> 

---

> #### static getter one
> 
> returns {**vector3**} a new vector3 object (1,1,1)
> 
> 

---

> #### static getter left
> 
> returns {**vector3**} a new vector3 object (-1,0,0)
> 
> 

---

> #### static getter right
> 
> returns {**vector3**} a new vector3 object (1,0,0)
> 
> 

---

> #### static getter up
> 
> returns {**vector3**} a new vector3 object (0,-1,0)
> 
> 

---

> #### static getter down
> 
> returns {**vector3**} a new vector3 object (0,1,0)
> 
> 

---

> #### static getter backward
> 
> returns {**vector3**} a new vector3 object (0,0,-1)
> 
> 

---

> #### static getter forward
> 
> returns {**vector3**} a new vector3 object (0,0,1)
> 
> 

---

> #### constructor(x, y, z)
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

> #### equal(a)
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

> #### set(x, y, z)
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

> #### #calcdist()
> pre-calculates the length of the vector
> 
> 

---

> #### static lerp(a, b, p)
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

> #### normalise()
> normalises this vector (unit length 1) this destroys the orginal vector
> 
> use normalisedclone if you want a new vector that is the normalised version of this vector
> 
> 

---

> #### normalisedclone()
> returns a new vector3 that is the normalised form of this vector3
> 
> 
> returns {**vector3**} a new vector3 instance which is the normalised version of this vector3
> 
> 

---

> #### static normalised(x,y,z)
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

> #### static anglefromdirection(direction, additionalAngle)
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

> #### static anglefromdirectionR(direction, additionalAngle)
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

> #### static directionfromangle(angle, additionalAngle)
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

> #### static directionfromangle(angle, additionalAngle)
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

> #### lookAt(from, to, accuracy, includeZ)
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

> #### static ordinalise(direction)
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

> #### static crosszonly(a, b)
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

> #### static cross(a, b)
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

> #### static dot(a, b)
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

> #### mulNew(scalar)
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

> #### divNew(scalar)
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

> #### mul(scalar)
> multiplies this vector by the scaler value
> 
> 
> **Parameters**
> 
> {**float**} **scalar** 
> 
> 

---

> #### div(scalar)
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

> #### add(x, y, z)
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

> #### static add(a, b)
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

> #### sub(x, y, z)
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

> #### static sub(a, b)
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

> #### static distance(a, b)
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

> #### static distanceSQ(a, b)
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

> #### cloneto(here)
> clones this vector3 to the existing vector passed as a parameter
> 
> 
> **Parameters**
> 
> {**vector3**} **here** 
> 
> 

---

