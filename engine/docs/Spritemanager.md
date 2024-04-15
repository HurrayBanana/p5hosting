> ### class Spritemanager
> manages and processes sprites - you should not have to use this directly apart from setting debug output
> 
> 

---

> #### #spritelist
> holds the currently managed sprite references @type {Sprite[]}
> 
> 

---

> #### #renderlist
> holds the list of sprites that are to be drawn, sorted on z before drawing @type {Sprite[]}
> 
> 

---

> #### #collisionlist
> holds a list of just those sprites that are collidable, reducing some of the overheads @type {Sprite[]}
> 
> 

---

> #### #collisionPlist
> holds a list of sprites that are primary colliders, reduces collsion checking overheads @type {Sprite[]}
> 
> 

---

> #### #layer
> not used
> 
> 

---

> #### debug = false
> set the spritemanager to output debug info defaults to false @type {bool}
> 
> 

---

> #### debugposition = new vector2(10, Engine.viewHeight - 30)
> sets the position to display the sprite information, not in use
> 
> 
> {**vector2**}
> 
> ```js
> example
>     
> ```
> 

---

> #### debugcolour = "white"
> specifies the colour to render debug info, not in use
> 
> 

---

> #### #historycount
> holds history draw tally per frame @type {int}
> 
> 

---

> #### #spritedrawn
> holds last number of sprites drawn in the frame @type {int}
> 
> 

---

> #### getter spritelist
> 
> returns {**Sprite[]**} an array os Sprites that you can perform further processing on
> 
> 

---

> #### getter count
> 
> returns {**int**} gets the number of sprites being processed
> 
> 

---

> #### getter debugdisplay
> returns a string of basic debug information about sprites
> 
> 

---

> #### constructor(/*layer*/)
> specifies a refernce layer to render debug info to
> 
> 

---

> #### add(sprite)
> adds a sprite for automatic update and drawing processing
> 
> add a call to this method of the sprite manager in your sprites constructor
> 
> ```js
> example
>       constructor(){
>            super();
>            Engine.spM.add(this);
>            //...further constructor code to setup sprite
>     
> ```
> 

---

> #### collisionJoin(spr)
> adds a sprite marked as a collidable to the collision list
> 
> 
> **Parameters**
> 
> {**Sprite**} **spr** primary collider to add
> 
> 

---

> #### collisionPJoin(spr)
> adds a sprite marked as a primary collider to the plist
> 
> 
> **Parameters**
> 
> {**Sprite**} **spr** primary collider to add
> 
> 

---

> #### collisionPLeave(spr)
> removes given sprite from the primary collision list
> 
> 
> **Parameters**
> 
> {**Sprite**} **spr** sprite to remove
> 
> 

---

> #### collisionLeave(spr)
> removes given sprite from the collision list
> 
> 
> **Parameters**
> 
> {**Sprite**} **spr** sprite to remove
> 
> 

---

> #### collisioncheck()
> performs a collision check for each sprite in the primary collision list
> 
> against any sprites in the sprite collision list that match with targets for the primary
> 
> calls the callbackCollide nominated method if set
> 
> 

---

> #### istargetted(spr, list)
> determines if a sprite from the sprite managers collision list has a type
> 
> logged in the primary sprites collision types list
> 
> 
> returns {**bool**} true if to be checked for collision
> 
> 

---

> #### update()
> process the sprites in the lists
> 
> 

---

> #### draw()
> performs sprite rendering
> 
> 

---

> #### #bringoutthedead()
> removes all sprites marked as dead
> 
> 

---

> #### removeall()
> bins all sprites without calling funerals
> 
> 

---

