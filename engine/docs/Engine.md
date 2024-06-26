engine created by Hurray Banana &copy;2023-2024

this can be found in file **track.js**
## class Engine
>  provides global functionality for other engine components
> 
> 

---

## properties
####  cols3bit [static]
> default value **[[255,255,255],[255,0,0],[0,255,0],[0,0,255],[0,255,255],[255,255,0],[255,0,255],[0,0,0],]**
> 
> to use write **Engine.cols3bit**
> 
> 
> type {**color[]**} set of colours primary, secondary, black and white
> 
> 

---

####  cols3bitlen [static]
> default value **Engine.cols3bit.length**
> 
> to use write **Engine.cols3bitlen**
> 
> 
> type {**int**} length of cols3bit for modulus work
> 
> 

---

####  debug [static]
> default value **false**
> 
> to use write **Engine.debug**
> 
> 
> type {**bool**} if true debug output will be shown
> 
> 

---

####  debugcolour [static]
> default value **[255,255,255,255]**
> 
> to use write **Engine.debugcolour**
> 
> 
> type {**color**} colour to display debug information
> 
> 

---

####  delta [static]
> to use write **Engine.delta**
> 
> 
> type {**float**} holds the fraction of a second the current frame has taken use this to get movement in pixels per second
> 
> ```js
> example
>     this.vx = 100 * Engine.delta; //move at 100 pixels over a second
>   
> ```
> 

---

####  glow [static]
> default value **[]**
> 
> to use write **Engine.glow**
> 
> holds each of the sprite glow layers these are drawn from 0 upwards before their corresponding sprite layer number,
> 
> the higher the layer number the later it is in the draw stack.
> 
> glow layers are much lower resolution than the main drawing layers, which can be controlled when setting up the engine
> 
> with Engine.init()
> 
> use Engine.glowlayer() to retrieve a reference to the layer when assigning to sprites, history and particles
> 
> You can use this reference to also modify settings of the texture layer (taking it away from its default settings)
> 
> 
> type {**texture[]**}
> 
> ```js
> example
>     //the glow divisor is how many times smaller the glow layers are created. 
>     //when drawn they are blown up using bilinear filtering which gives us a cheap glow effect
>     Engine.init({glowdivisor:8,viewW:600,viewH:800,worldW:3000,worldH:2000});
> ```
> 

---

####  glowDiv [static]
> default value **8**
> 
> to use write **Engine.glowDiv**
> 
> controls how many times smaller the glow layers are created. don't change this value you need to use Engine.init() to set this
> 
> 
> type {**int**}
> 
> 

---

####  glowbuffer [static]
> to use write **Engine.glowbuffer**
> 
> used for some testing of persistance and fade stuff
> 
> 

---

####  particleM [static]
> to use write **Engine.particleM**
> 
> 
> type {**particleManager**} reference to the particle manager
> 
> 

---

####  showversion [static]
> default value **true**
> 
> to use write **Engine.showversion**
> 
> 
> type {**bool**} if true then engine version will be shown with debug output
> 
> 

---

####  spM [static]
> to use write **Engine.spM**
> 
> 
> type {**Spritemanager**} reference to the sprite manager
> 
> 

---

####  spl [static]
> default value **[]**
> 
> to use write **Engine.spl**
> 
> holds each of the sprite layers these are drawn from 0 upwards,
> 
> the higher the layer number the later it is in the draw stack
> 
> use Engine.layer() to retrieve a reference to the layer when assigning to sprites, history and particles
> 
> You can use this reference to also modify settings of the texture layer (taking it away from its default settings)
> 
> 
> type {**texture[]**}
> 
> 

---

####  tilemapM [static]
> to use write **Engine.tilemapM**
> 
> 
> type {**TilemapManager**} reference to the tilemap manager
> 
> 

---

####  viewHeight [static]
> to use write **Engine.viewHeight**
> 
> 
> type {**int**}
> 
> 

---

####  viewWidth [static]
> to use write **Engine.viewWidth**
> 
> 
> type {**int**}
> 
> 

---

####  viewports [static]
> default value **[]**
> 
> to use write **Engine.viewports**
> 
> 
> type {**View[]**} a list of viewport regions defined
> 
> 

---

####  zHalf [static]
> default value **this.zRange / 2**
> 
> to use write **Engine.zHalf**
> 
> 
> type {**float**} the maximum +ve z value
> 
> 

---

####  zRange [static]
> default value **5000**
> 
> to use write **Engine.zRange**
> 
> 
> type {**float**} range of z values avaialable z, z value of a sprite controls draw order
> 
> 

---

## getters and setters
####   backmap [getter] [static]
> to use write **Engine.backmap**
> 
> the tilemap layer drawn before every other layer
> 
> be wary using with sprites as these are aligned top left
> 
> 
> returns {**texture**}
> 
> 

---

####   finalmap [getter] [static]
> to use write **Engine.finalmap**
> 
> Can use to do fade out/in and swipes which also cover the UI
> 
> be wary using with sprites as these are aligned top left
> 
> 
> returns {**texture**}
> 
> 

---

####   frontmap [getter] [static]
> to use write **Engine.frontmap**
> 
> tilemaps to be rendered after all sprite layers
> 
> be wary using with sprites as these are aligned top left
> 
> 
> returns {**texture**}
> 
> 

---

####   hud [getter] [static]
> to use write **Engine.hud**
> 
> gets the hud layer (the final sprite layer) for drawing items on top of all other sprites
> 
> There are some tilemap layers that are drawn after this frontmap and finalmap
> 
> 

---

####   mainview [getter] [static]
> to use write **Engine.mainview**
> 
> 
> returns {**View**} gets the first viewport defined
> 
> 

---

####   mainviewArea [getter] [static]
> to use write **Engine.mainviewArea**
> 
> 
> returns {**Rectangle**} get the rectangle area of the viewport (0, 0, width, height)
> 
> 

---

####   midmap [getter] [static]
> to use write **Engine.midmap**
> 
> tilemaps to be rendered after sprite layers 0 and 1 but before layer 2 and 3
> 
> be wary using with sprites as these are aligned top left
> 
> 
> returns {**texture**}
> 
> 

---

####   viewCentre [getter] [static]
> to use write **Engine.viewCentre**
> 
> 
> returns {**vector3**}
> 
> 

---

####   viewCentrex [getter] [static]
> to use write **Engine.viewCentrex**
> 
> 
> returns {**float**}
> 
> 

---

####   viewCentrey [getter] [static]
> to use write **Engine.viewCentrey**
> 
> 
> returns {**float**}
> 
> 

---

####   viewcount [getter] [static]
> to use write **Engine.viewcount**
> 
> 
> returns {**int**} number of viewports defined
> 
> 

---

####   worldHeight [getter] [static]
> to use write **Engine.worldHeight**
> 
> 
> returns {**float**} the height of the world area
> 
> 

---

####   worldHeight [setter] [static]
> to use write **Engine.worldHeight**
> 
> 
> **Parameters**
> 
> {**float**} **value** sets the height of the world area
> 
> 

---

####   worldWidth [getter] [static]
> to use write **Engine.worldWidth**
> 
> 
> returns {**float**} the width of the world area
> 
> 

---

####   worldWidth [setter] [static]
> to use write **Engine.worldWidth**
> 
> 
> **Parameters**
> 
> {**float**} **value** sets the width of the world area
> 
> 

---

####   worldarea [getter] [static]
> to use write **Engine.worldarea**
> 
> 
> returns {**Rectangle**} gets a rectangle (0,0,width,height) representing the world size
> 
> 

---

####   worldsize [getter] [static]
> to use write **Engine.worldsize**
> 
> gets the world size (width and height), just access the w and h properties of the object
> 
> 
> returns {**{w:int, h:int**}
> 
> 

---

####   worldsize [setter] [static]
> to use write **Engine.worldsize**
> 
> use an object to set the size of the world
> 
> Engine.worldsize = {w:1000,h:1000}
> 
> or a vector2 value (something with w and h properties)
> 
> 
> **Parameters**
> 
> {**vector2|{w:int, h:int}**} **value** 
> 
> 

---

## Methods
####  draw() [static]
> to use write **Engine.draw()**
> 
> draws the various engine rendering sub systems
> 
> 

---

####  glowlayer(number) [static]
> to use write **Engine.glowlayer(number)**
> 
> retrieves a specific graphic layer for drawing on and changing settings of
> 
> 
> **Parameters**
> 
> {**int**} **number** glow layer number (0-3), glow layers are drawn before their corresponding sprite layer
> 
> ```js
> example
>     //draw order is as follows:
>     backmap, glow(0),layer(0),glow(1),layer(1),midmap,glow(2),layer(2),glow(3),layer(3),frontmap,hud,finalmap
>   
> ```
> 

---

####  init(settings) [static]
> to use write **Engine.init(settings)**
> 
> initialises all the sub systems of the engine, call this from the preload function
> 
> 
> **Parameters**
> 
> {**{viewW:int,viewH:int,worldW:int,worldH:int,layers:int,glowdivisor:int,compositor:string}**} **settings** all settings are optional, if none are set or nothing is passed then defaults (listed below will be used) pass a settings object to change some of the defaults
> 
> ```js
> example
> Engine.init({glowdivisor:8});
>     
>     //settings object can have the following values
>     viewW:int //number of pixels wide the canvas/screen should be, default 600
>     viewH:int //number of pixels high the canvas/screen should be, default 600
>     worldW:int //number of pixels wide the world area should be, default 600
>     worldH:int //number of pixels high the world area should be, default 600
>     layers:int //number of layers including the HUD defaults to 5 (4 sprite layers and final HUD layer) - don't change it will break stuff - I need to generalise the renderer more first
>     glowdivisor:int //how much to shrink the glow layers by (these get scaled back up so we get a cheap blur)
>     compositor:string //the global compsition method on the glow layers, default is "lighter" @link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
>     
>   
> ```
> 

---

####  layer(number) [static]
> to use write **Engine.layer(number)**
> 
> retrieves a specific graphic layer for assigning to sprites and particles for drawing on and changing settings of
> 
> 
> **Parameters**
> 
> {**int**} **number** layer number (0-3)
> 
> ```js
> example
>     //draw order is as follows:
>     backmap, glow(0),layer(0),glow(1),layer(1),midmap,glow(2),layer(2),glow(3),layer(3),frontmap,hud,finalmap
>   
> ```
> 

---

####  makeCallback(handler, instance) [static]
> to use write **Engine.makeCallback(handler, instance)**
> 
> Generates a callback handler object to pass to a callback system
> 
> 
> returns {**{callback:method|function, instance:object|null**}
> 
> 
> **Parameters**
> 
> {**function|method**} **handler** the method of a class or a global function to execute
> 
> {**object**} **instance** the object instance (or null if a global function being called)
> 
> ```js
> example
>     //execute the starttitle() method of an object (this is the reference to the object)
>     //after 5 seconds 
>     Engine.eventM.delaycall(5, Engine.makeCallback(this.starttitle, this));
>    
> ```
> 

---

####  processCallback(handler, data) [static]
> to use write **Engine.processCallback(handler, data)**
> 
> internal support for executing callback routines (there are currently 4 differenet ones in Sprite alone)
> 
> 

---

####  ripRawtiles(tohere, texture, tilesize, data) [static]
> to use write **Engine.ripRawtiles(tohere, texture, tilesize, data)**
> 
> performs a rip of a spritesheet to a format suitable for sprite animation frames, used by Sprite.frame.defineSpritesheet()
> 
> grabs a rectangluar sequence rawtiles from a texture
> 
> 
> **Parameters**
> 
> {**Rawtile[]**} **tohere** array of frames to add these rips to, use sprite.frame.defineSpritesheet() if you are doing this for a sprite
> 
> {**image|texture**} **texture** image that contains the frames we want
> 
> {**{w:32,h:32}**} **tilesize** width and height of each frame (have to be the same size)
> 
> {**{rowstall:3,colswide:10,left:10,top:5,xpad:2,ypad:2}**} **data** explained in comments below
> 
> ```js
> example
>     //takes 8 frames txsprite and adds them to the frames already defined for the sprite
>     //the frames consist of 1 row and 8 columns with a 2 pixel gap between each row and column
>     //each tiles is 32x32 pixels the rectangular sequence starts 2 pixels from left and 213 pixels from top corner of sprite sheet
>     this.frame.defineSpritesheet(txsprite, {w:32,h:32}, {rowstall:1,colswide:8,left:2,top:213,xpad:2,ypad:2});
>   
> ```
> 

---

####  riptiles(tohere, texture, tilesize, data) [static]
> to use write **Engine.riptiles(tohere, texture, tilesize, data)**
> 
> performs a rip of a tilesheet, used by Tilemap.tilesfromTilesheet()
> 
> grabs a rectangluar sequence rawtiles from a texture, if wanting this for a tilemap use this.tilesfromTilesheet() inside your constructor instead
> 
> 
> **Parameters**
> 
> {**Tile[]**} **tohere** array of Tiles to add these rips to
> 
> {**image|texture**} **texture**  image that contains the tiles we want
> 
> {**{w:32,h:32}**} **tilesize** width and height of each tile (have to be the same size)
> 
> {**{rowstall:3,colswide:10,left:10,top:5,xpad:2,ypad:2}**} **data** explained in comments below
> 
> ```js
> example
>     //takes 30 tiles from txtiles and places them into the mytiles array
>     //the tiles consist of 3 rows and 10 columns with a 2 pixel gap between each row and column
>     //each tiles is 32x32 pixels the rectangular sequence starts 10 pixels from left and 5 pixels from top corner of sprite sheet
>     Engine.riptiles(mytiles, txtiles, {w:32,h:32}, {rowstall:3,colswide:10,left:10,top:5,xpad:2,ypad:2});
>   
> ```
> 

---

####  update(delta) [static]
> to use write **Engine.update(delta)**
> 
> updates all the engine components
> 
> 
> **Parameters**
> 
> {**float**} **delta** fraction of a second for this update period
> 
> 

---

####  view(number) [static]
> to use write **Engine.view(number)**
> 
> retrieves the rectangle for a numbered viewport - 0 being the main canvas area
> 
> 
> returns {**View**} the requested Viewport
> 
> 
> **Parameters**
> 
> {**int**} **number** view to retrieve (currently on 0)
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
