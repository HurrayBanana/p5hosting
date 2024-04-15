> ### class Engine
> @classdesc provides global functionality for other engine components
> 
> 

---

> #### let engineversion = '1.23.0.1'
> current version number of the engine
> 
> 

---

> #### static cols3bit = [
> set of colours primary, secondary, black and white @type {color[]}
> 
> 

---

> #### static cols3bitlen = Engine.cols3bit.length
> length of cols3bit for modulus work @type {int}
> 
> 

---

> #### static showversion = true
> 
> {**bool**} if true then engine version will be shown with debug output
> 
> 

---

> #### static debug = false
> if true debug output will be shown @type {bool}
> 
> 

---

> #### static debugcolour = [255,255,255,255]
> colour to display debug information @type {color}
> 
> 

---

> #### static #backmap
> for tilemaps to be rendered before sprite layers @type {texture}
> 
> 

---

> #### static #midmap
> after sprite 0 and 1 @type {texture}
> 
> 

---

> #### static #frontmap
> tilemaps to be rendered after all 4 sprite layers but before the hud layer
> 
> Can use to do fade out/in and swipes
> 
> be wary using with sprites as these are aligned top left
> 
> 
> {**texture**}
> 
> 

---

> #### static #finalmap
> tilemaps to be rendered after all other layers including the hud @type {texture}
> 
> 

---

> #### static spl = []
> holds each of the sprite layers these are drawn from 0 upwards,
> 
> the higher the layer number the later it is in the draw stack
> 
> use Engine.layer() to retrieve a reference to the layer when assigning to sprites, history and particles
> 
> You can use this reference to also modify settings of the texture layer (taking it away from its default settings)
> 
> 
> {**texture[]**}
> 
> 

---

> #### static glow = []
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
> {**texture[]**}
> 
> ```js
> example
>     //the glow divisor is how many times smaller the glow layers are created. 
>     //when drawn they are blown up using bilinear filtering which gives us a cheap glow effect
>     Engine.init({glowdivisor:8,viewW:600,viewH:800,worldW:3000,worldH:2000});
> ```
> 

---

> #### static glowbuffer //testing of persistance and fade
> used for some testing stuff
> 
> 

---

> #### static glowDiv = 8
> controls how many times smaller the glow layers are created. don't change this value you need to use Engine.init() to set this
> 
> 
> {**int**}
> 
> 

---

> #### static spM
> reference to the sprite manager @type {Spritemanager}
> 
> 

---

> #### static particleM
> reference to the particle manager @type {particleManager}
> 
> 

---

> #### static tilemapM
> reference to the tilemap manager @type {TilemapManager}
> 
> 

---

> #### static #worldsize// = vector2.zero;
> holds an object value describing the width and height of the world render area
> 
> object
> 
> 

---

> #### static delta
> 
> {**float**} holds the fraction of a second the current frame has taken use this to get movement in pixels per second
> 
> ```js
> example
>     this.vx = 100 * Engine.delta; //move at 100 pixels over a second
>   
> ```
> 

---

> #### static getter backmap
> the tilemap layer drawn before every other layer
> 
> be wary using with sprites as these are aligned top left
> 
> 
> returns {**texture**}
> 
> 

---

> #### static getter midmap
> tilemaps to be rendered after sprite layers 0 and 1 but before layer 2 and 3
> 
> be wary using with sprites as these are aligned top left
> 
> 
> returns {**texture**}
> 
> 

---

> #### static getter frontmap
> tilemaps to be rendered after all sprite layers
> 
> be wary using with sprites as these are aligned top left
> 
> 
> returns {**texture**}
> 
> 

---

> #### static getter finalmap
> Can use to do fade out/in and swipes which also cover the UI
> 
> be wary using with sprites as these are aligned top left
> 
> 
> returns {**texture**}
> 
> 

---

> #### static getter hud
> gets the hud layer (the final sprite layer) for drawing items on top of all other sprites
> 
> There are some tilemap layers that are drawn after this frontmap and finalmap
> 
> 

---

> #### static getter worldWidth
> 
> returns {**float**} the width of the world area
> 
> 

---

> #### static getter worldHeight
> 
> returns {**float**} the height of the world area
> 
> 

---

> #### static setter worldWidth
> 
> **Parameters**
> 
> {***  {float**} **value** sets the width of the world area
> 
> 

---

> #### static setter worldHeight
> 
> **Parameters**
> 
> {***  {float**} **value** sets the height of the world area
> 
> 

---

> #### static getter worldarea
> 
> returns {**Rectangle**} gets a rectangle (0,0,width,height) representing the world size
> 
> 

---

> #### static getter worldsize
> gets the world size (width and height), just access the w and h properties of the object
> 
> 
> returns {**{w:int, h:int**}
> 
> 

---

> #### static setter worldsize
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

> #### static getter viewCentre
> 
> returns {**vector3**}
> 
> 

---

> #### static init(settings)
> initialises all the sub systems of the engine, call this from the preload function
> 
> 
> **Parameters**
> 
> {**{viewW:int,viewH:int,worldW:int,worldH:int,layers:int,glowdivisor:int,compositor:string}**} **settings** all settings are optional, if none are set or nothing is passed then defaults (listed below will be used)
> 
> ```js
> example
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

> #### static #createview()
> do not use this it's internal only for now until I implement multiple viewports
> 
> 

---

> #### static layer(number)
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

> #### static glowlayer(number)
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

> #### static view(number)
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

> #### static #getTilemapLayer()
> 
> returns {**texture|canvas**} a top left aligned canvas for tilemap rendering
> 
> 

---

> #### static #createlayers(layercount, compositor)
> creates sprite and glow layers
> 
> 
> **Parameters**
> 
> {**int**} **layercount** number of sprite/particle layers and a hud
> 
> {**string**} **compositor** compositor to be used by glow layer
> 
> 

---

> #### static draw()
> draws the various engine rendering sub systems
> 
> 

---

> #### static processCallback(handler, data)
> internal support for executing callback routines (there are currently 4 differenet ones in Sprite alone)
> 
> 

---

> #### static makeCallback(handler, instance)
> Generates a callback handler object to pass to a callback system
> 
> 
> returns {**{callback:method|function, instance:object|null**}
> 
> 
> **Parameters**
> 
> {**function**} **handler** 
> 
> {**object**} **instance** 
> 
> 

---

> #### static riptiles(tohere, texture, tilesize, data)
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

> #### static ripRawtiles(tohere, texture, tilesize, data)
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

