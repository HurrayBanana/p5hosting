engine created by Hurray Banana &copy;2023-2024

this can be found in file **track.js**
## class AnimateMethod
> 
> 
> Specifies how a sprite animation should change, these are set and managed based on the animation methods you choose to use.
> 
> You shouldn't need to manipulate them directly
> 
> 

---

## properties
####  manual [static]
> default value **"manual"**
> 
> to use write **AnimateMethod.manual**
> 
> defines an animation state where no autoamtic animation occurs, controlled by your own code using next(), previous(), first(), last() and show(int) methods
> 
> 

---

####  none [static]
> default value **"none"**
> 
> to use write **AnimateMethod.none**
> 
> not currently animating
> 
> 

---

####  ondistance [static]
> default value **"ondistance"**
> 
> to use write **AnimateMethod.ondistance**
> 
> change frame after a number of pixels have been traversed - this is great for walking and other motion based animations
> 
> as they will automatically speed up/slow down as the sprite changes how fast covers distances, you'll need to experiment with distances
> 
> 

---

####  onrate [static]
> default value **"onrate"**
> 
> to use write **AnimateMethod.onrate**
> 
> change frame after a period of time has elapsed (classic animation)
> 
> 

---

####  onupdate [static]
> default value **"onupdate"**
> 
> to use write **AnimateMethod.onupdate**
> 
> change frame every time a sprite is updated (based on the updatePeriod) this allows a classic space invaders animation
> 
> as you'll animate every time you update a sprites position
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
