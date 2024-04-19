engine created by Hurray Banana &copy;2023-2024

this can be found in file **spritemanager.js**
## class Spritemanager
> manages and processes sprites - you should not have to use this directly apart from setting debug output
> 
> 

---

## Constructor
> #### constructor(/*layer*/)
> to use write **new Spritemanager(/*layer*/)**
> 
> specifies a refernce layer to render debug info to
> 
> 

---

## properties
#### debug
> default value **false**
> 
> to use write **this.debug**
> 
> set the spritemanager to output debug info defaults to false @type {bool}
> 
> 

---

#### debugcolour
> default value **"white"**
> 
> to use write **this.debugcolour**
> 
> specifies the colour to render debug info, not in use
> 
> 

---

#### debugposition
> default value **new vector2(10, Engine.viewHeight - 30)**
> 
> to use write **this.debugposition**
> 
> sets the position to display the sprite information, not in use
> 
> 
> type {**vector2**}
> 
> ```js
> example
> this.debugposition = new vector2(10,ht - 30);
>     
> ```
> 

---

## getters and setters
#### count [getter]
> to use write **this.count**
> 
> 
> returns {**int**} gets the number of sprites being processed
> 
> 

---

#### debugdisplay [getter]
> to use write **this.debugdisplay**
> 
> returns a string of basic debug information about sprites
> 
> 

---

#### spritelist [getter]
> to use write **this.spritelist**
> 
> 
> returns {**Sprite[]**} an array os Sprites that you can perform further processing on
> 
> 

---

## Methods
#### add(sprite)
> to use write **this.add(sprite)**
> 
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

#### collisionJoin(spr)
> to use write **this.collisionJoin(spr)**
> 
> adds a sprite marked as a collidable to the collision list
> 
> 
> **Parameters**
> 
> {**Sprite**} **spr** primary collider to add
> 
> 

---

#### collisionLeave(spr)
> to use write **this.collisionLeave(spr)**
> 
> removes given sprite from the collision list
> 
> 
> **Parameters**
> 
> {**Sprite**} **spr** sprite to remove
> 
> 

---

#### collisionPJoin(spr)
> to use write **this.collisionPJoin(spr)**
> 
> adds a sprite marked as a primary collider to the plist
> 
> 
> **Parameters**
> 
> {**Sprite**} **spr** primary collider to add
> 
> 

---

#### collisionPLeave(spr)
> to use write **this.collisionPLeave(spr)**
> 
> removes given sprite from the primary collision list
> 
> 
> **Parameters**
> 
> {**Sprite**} **spr** sprite to remove
> 
> 

---

#### collisioncheck()
> to use write **this.collisioncheck()**
> 
> performs a collision check for each sprite in the primary collision list
> 
> against any sprites in the sprite collision list that match with targets for the primary
> 
> calls the callbackCollide nominated method if set
> 
> 

---

#### draw()
> to use write **this.draw()**
> 
> performs sprite rendering
> 
> 

---

#### istargetted(spr, list)
> to use write **this.istargetted(spr, list)**
> 
> determines if a sprite from the sprite managers collision list has a type
> 
> logged in the primary sprites collision types list
> 
> 
> returns {**bool**} true if to be checked for collision
> 
> 

---

#### removeall()
> to use write **this.removeall()**
> 
> bins all sprites without calling funerals
> 
> 

---

#### update()
> to use write **this.update()**
> 
> process the sprites in the lists
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
