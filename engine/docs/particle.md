engine created by Hurray Banana &copy;2023-2024

this can be found in file **track.js**
## class particle
> Holds information about an idividual particle
> 
> 

---

## properties
#### alive
> to use write **this.alive**
> 
> if false then the particle will no longer be drawn
> 
> set an individual particles alive propery to false to stop it being draw (you probably want to stop it being updated in your update method as well)
> 
> defaults to true
> 
> 
> type {**bool**}
> 
> 

---

#### gsize
> to use write **this.gsize**
> 
> a value to determine the scale in the x and y directions for the particles drawn on a glow layer.
> 
> This enables you to draw at different sizes if you are drawing on both the glow and normal layers
> 
> 
> type {**vector2**} or any object with x and y properties e.g {x:2,y:3}
> 
> 

---

#### pos
> to use write **this.pos**
> 
> position of the particle. You can make this a vector3 type (or any type) as long as it has x and y properties that set the position
> 
> to draw the particle on screen
> 
> 
> type {**vector2**}
> 
> 

---

#### rot
> to use write **this.rot**
> 
> the rotation angle of the particle texture, in radians
> 
> Do any work here in radians (if you want to sue degrees you'll have to do the maths to convert between)
> 
> 
> type {**float**} in radians
> 
> 

---

#### size
> to use write **this.size**
> 
> a value to determine the scale in the x and y directions for the particle.
> 
> 
> type {**vector2**} or any object with x and y properties e.g {x:2,y:3}
> 
> 

---

#### vel
> to use write **this.vel**
> 
> velocity of the particle, you can use whatever you wish as your update controls the particles but it must update the postion x and y properties
> 
> 
> type {**vector2**}
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
