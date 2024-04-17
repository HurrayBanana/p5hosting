engine created by Hurray Banana &copy;2023-2024
## class Matrix
>  holds a 4x4 matrix to hold combinatoral transformation in a single matrix
> 
> 

---

## Constructor
> #### constructor(matrixarr)
> to use write **new Matrix(matrixarr)**
> 
> creates a new matrix
> 
> 
> **Parameters**
> 
> {**float[][]**} **matrixarr** if an array with 4 rows and columns is supplied a matrix will be
> 
> ```js
> example
>       //an identity matrix
>       [
>       [1,0,0,0],
>       [0,1,0,0],
>       [0,0,1,0];
>       [0,0,0,1];
>       ]
>      
> ```
> 

---

## properties
## getters and setters
####   identity [getter] [static]
> to use write **Matrix.identity**
> 
> 
> returns {**Matrix**} An identity matrix, start point for building a custom matrix
> 
> 

---

#### toString [getter]
> to use write **this.toString**
> 
> 
> returns {**string**} a string representation of the matrix
> 
> 

---

## Methods
####  rotateX(angle) [static]
> to use write **Matrix.rotateX(angle)**
> 
> 
> returns {**Matrix**} x axis rotation matrix
> 
> 
> **Parameters**
> 
> {**float**} **angle** in degrees to rotate around the x
> 
> 

---

####  rotateY(angle) [static]
> to use write **Matrix.rotateY(angle)**
> 
> 
> returns {**Matrix**} y axis rotation matrix
> 
> 
> **Parameters**
> 
> {**float**} **angle** in degrees to rotate around the y axis
> 
> 

---

####  rotateZ(angle) [static]
> to use write **Matrix.rotateZ(angle)**
> 
> 
> returns {**Matrix**} Z axis rotation matrix
> 
> 
> **Parameters**
> 
> {**float**} **angle** in degrees to rotate around the z axis (into the screen, effectively a 2d rotation)
> 
> 

---

####  translate(x,y,z) [static]
> to use write **Matrix.translate(x,y,z)**
> 
> creates a translation matrix
> 
> 
> returns {**Matrix**} translation matrix requested
> 
> 
> **Parameters**
> 
> {**float**} **x** translation in x axis
> 
> {**float**} **y** translation in y axis
> 
> {**float**} **z** translation in z axis
> 
> 

---

#### applyrotX(angle)
> to use write **this.applyrotX(angle)**
> 
> directly applies a x axis rotation to this matrix
> 
> 
> **Parameters**
> 
> {**float**} **angle** in degrees to apply to x axis
> 
> 

---

#### applyrotY(angle)
> to use write **this.applyrotY(angle)**
> 
> directly applies a y axis rotation to this matrix
> 
> 
> **Parameters**
> 
> {**float**} **angle** in degrees to apply to y axis
> 
> 

---

#### applyrotZ(angle)
> to use write **this.applyrotZ(angle)**
> 
> directly applies a z axis rotation to this matrix
> 
> 
> **Parameters**
> 
> {**float**} **angle** in degrees to apply to z axis
> 
> 

---

#### applytranslate(x,y,z)
> to use write **this.applytranslate(x,y,z)**
> 
> directly applies a translation matrix to this matrix
> 
> 
> **Parameters**
> 
> {**float**} **x** translation in x axis
> 
> {**float**} **y** translation in y axis
> 
> {**float**} **z** translation in z axis
> 
> 

---

#### multiply(m)
> to use write **this.multiply(m)**
> 
> multiply this matrix with matrix m t*m
> 
> 
> **Parameters**
> 
> {**Matrix**} **m** 
> 
> 

---

#### reset()
> to use write **this.reset()**
> 
> sets this matrix to the indentity matrix
> 
> 

---

#### transform(v)
> to use write **this.transform(v)**
> 
> applies the matrix to given vector or array of vectors
> 
> 
> **Parameters**
> 
> {**vector3|vector3[]**} **v** 
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
