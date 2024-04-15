> ### class AnimateMethod
> 
> 
> Specifies how a sprite animation should change, these are set and managed based on the animation methods you choose to use.
> 
> You shouldn't need to manipulate them directly
> 
> 

---

> #### static onrate = "onrate"
> change frame after a period of time has elapsed (classic animation)
> 
> 

---

> #### static ondistance = "ondistance"
> change frame after a number of pixels have been traversed - this is great for walking and other motion based animations
> 
> as they will automatically speed up/slow down as the sprite changes how fast covers distances, you'll need to experiment with distances
> 
> 

---

> #### static onupdate = "onupdate"
> change frame every time a sprite is updated (based on the updatePeriod) this allows a classic space invaders animation
> 
> as you'll animate every time you update a sprites position
> 
> 

---

> #### static none = "none"
> not currently animating
> 
> 

---

> #### static manual = "manual"
> defines an animation state where no autoamtic animation occurs, controlled by your own code using next(), previous(), first(), last() and show(int) methods
> 
> 

---

