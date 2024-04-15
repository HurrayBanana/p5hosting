> ### class Limitmo
> actions to be taken once a Sprite meets or passes the limit box edge that is defined
> 
> The limit box can be any given rectangular or 3d box area or
> 
> the current position of the ViewPort. Limit boxes are only active once a sprite fully enters them,
> 
> if you are having trouble with a limit box make sure you make it visible using
> 
> 

---

> #### static none = "none"
> no boundary control
> 
> 

---

> #### static bounce = "bounce"
> make sprite bounce back in opposite direction
> 
> Nice for keeping a sprite within the boundaries of screen or rectangle.
> 
> Such as in breakout/arkanoid type games
> 
> 

---

> #### static bounceZonly = "bounceZonly"
> Performs a bounce but only bothers checking the front and back of the limit box
> 
> Great when used in conjuction with Z gravity and auto sprite scaling
> 
> to create a throbbing sprite
> 
> 

---

> #### static bounceAlign = "bounceAlign"
> make sprite bounce back in opposite direction but align with collided edge
> 
> Only use this if you want the sprite to start its bounce aligned to the
> 
> edge of the limit box, you might get odd effects when doing this
> 
> 

---

> #### static wrap = "wrap"
> make sprite appear on other side of limit box
> 
> Aligns the sprite with the opposite edge of limit box. Which can cause
> 
> odd effects with groups of sprites following each other, use wrapExact instead.
> 
> 

---

> #### //static wrapExact = "wrapExact"
> makes sprite appear on other side of limit box taking
> 
> account of exact position when leaving the limit box
> 
> use this for scrolling text or groups of sprites for an Asteroid wrapping effect
> 
> 

---

> #### static wrapXBounceY = "wrapXBounceY"
> only wrap in X direction, but bounce in Y direction
> 
> Use this if you want the sprite to wrap horizontally but fall under gravity
> 
> 

---

> #### static wrapYBounceX = "wrapYBounceX"
> only wrap in Y direction, but bounce in X direction
> 
> Use this if you want the sprite to wrap vertically but bounce off the sides
> 
> 

---

> #### static stopAt = "stopAt"
> make sprite stop moving in axis of limit box and align with collided edge
> 
> If a sprite hits the vertical edges of limit box then its horizontal
> 
> velocity is stopped, it can still move vertically until it hits the top or
> 
> bottom of the limit box
> 
> 

---

> #### static stopFirstTouch = "stopFirstTouch"
> make the sprite stop moving if any of borders are touched
> 
> Useful for title graphics where you want a sprite to stop in a specific
> 
> horizontal or vertical position but dont want to worry about exact size of limit box required
> 
> 

---

> #### static stopThenKill = "stopThenKill"
> make sprite stop moving in axis of limit box and kill if no velocity set
> 
> Works like stop but if sprite has no velocity it will be killed
> 
> 

---

> #### static killPast = "killPast"
> kill sprite once outside limit box
> 
> Use this to remove sprites once they have gone past the viewport
> 
> (unless you want them to come back on screen). This will remove them without them
> 
> flashing off while still visible
> 
> 

---

> #### static killTouch = "killTouch"
> kill sprite as soon as it touches limit box
> 
> Great for implementing electric fences etc...
> 
> 

---

> #### static killInside = "killInside"
> kill sprite as soon as it enters the limit box
> 
> The sprite has to fit inside the limit box
> 
> Useful for setting defence boundaries around turrets etc..
> 
> 

---

> #### static killPastXBounceY = "killPastXBounceY"
> kills sprite if goes past X limit box, but bounces on Y
> 
> 

---

> #### static killPastXStopY = "killPastXStopY"
> kills a sprite if it goes past the left/right boundaries and
> 
> stops sprites vertical movement if it touches top/bottom
> 
> 

---

> #### static killPastYStopX = "killPastYStopX"
> killPastYStopX, kills a sprite if it goes past top/bottom
> 
> boundaries and stops sprites horizontal movement if it touches left/right
> 
> 

---

> #### static inform = "inform"
> Notify using callback property
> 
> Use this in conjuction with an update routine to determine when sprite
> 
> hits an edge
> 
> 

---

> #### static informAlign = "informAlign"
> Notify by setting AtBoundary to true and align with collided edge
> 
> Use this in conjuction with an UpdateHandler to determine when sprite
> 
> hits an edge, this can be seen in use in the Space Invaders code. As soon as one
> 
> invader hits the limit box all the invaders are then dropped down a line
> 
> 

---

> #### static turnOffGravity = "turnOffGravity"
> Turns gravity off once collided and aligns sprite with limit box
> 
> Use this when you want a sprite to stop falling after you have
> 
> made it move under gravity
> 
> 

---

> #### static turnOffGravityBottomOnly = "turnOffGravityBottomOnly"
> Turns off gravity but only if contact with bottom of limit box occurs
> 
> 

---

> #### static fireEvent = "fireEvent"//fireEvent // rename to callbac = "";
> executes the sprite callback routine specified. You need to handle any other actions
> 
> you want to apply to the sprite yourself, the event will continue to fire if your
> 
> sprite is still at the limit box, so you need to ensure that you set OnLimit = null if you do not want this behaviour
> 
> 

---

