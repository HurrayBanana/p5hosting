> ### class Matrix
> @classdesc holds a 4x4 matrix to hold combinatoral transformation in a single matrix
> 
> 

---

> #### static getter identity
> 
> returns {**Matrix**} An identity matrix, start point for building a custom matrix
> 
> 

---

> #### getter toString
> 
> returns {**string**} a string representation of the matrix
> 
> 

---

> #### constructor(matrixarr)
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

> #### multiply(m)
> multiply this matrix with matrix m t*m
> 
> 
> **Parameters**
> 
> {**Matrix**} **m** 
> 
> 

---

> #### static rotateZ(angle)
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

> #### static rotateY(angle)
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

> #### static rotateX(angle)
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

> #### applyrotZ(angle)
> directly applies a z axis rotation to this matrix
> 
> 
> **Parameters**
> 
> {**float**} **angle** in degrees to apply to z axis
> 
> 

---

> #### applyrotY(angle)
> directly applies a y axis rotation to this matrix
> 
> 
> **Parameters**
> 
> {**float**} **angle** in degrees to apply to y axis
> 
> 

---

> #### applyrotX(angle)
> directly applies a x axis rotation to this matrix
> 
> 
> **Parameters**
> 
> {**float**} **angle** in degrees to apply to x axis
> 
> 

---

> #### static translate(x,y,z)
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

> #### applytranslate(x,y,z)
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

> #### reset()
> sets this matrix to the indentity matrix
> 
> 

---

> #### transform(v)
> applies the matrix to given vector or array of vectors
> 
> 
> **Parameters**
> 
> {**vector3|vector3[]**} **v** 
> 
> 

---

