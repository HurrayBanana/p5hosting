engine created by Hurray Banana &copy;2023-2024
## class Tilemap
>  manages a fixed grid based entity that can be used for scrolling background graphics as well
> 
> as collision systems
> 
> 

---

## Constructor
> #### constructor()
> to use write **new Tilemap()**
> 
> creates a tilemap using the mainviewport on Engine.backmap layer,
> 
> change these if you need to in your constructor
> 
> 

---

## properties
#### 
> to use write **this.**
> 
> number of offscreen textures used horizontally
> 
> 

---

####  EMPTY [static]
> default value **-1**
> 
> to use write **Tilemap.EMPTY**
> 
> 
> type {**int**} represents an empty tile (easy to check for)
> 
> 

---

#### #area
> default value **Rectangle.one**
> 
> to use write **this.#area**
> 
> 
> type {**Rectangle**} holds scaled area of the tilemap
> 
> 

---

#### #map
> default value **null**
> 
> to use write **this.#map**
> 
> 
> type {**int[][]**} holds the graphic tilemap as a 2d arr
> 
> 

---

#### #maxtex
> default value **256//512;//195;//256;//24 ;//1024;**
> 
> to use write **this.#maxtex**
> 
> 
> type {**int**} maximum size of offscreen textures - may make this configurable
> 
> 

---

#### #position
> default value **vector2.zero**
> 
> to use write **this.#position**
> 
> 
> type {**vector2**} the render offset of the tilemap, change the x and y values to "scroll" the tilemap
> 
> 

---

#### #scale
> default value **vector2.one**
> 
> to use write **this.#scale**
> 
> 
> type {**vector2**} holds scale to draw tilemap defaults to size tiles defined
> 
> 

---

#### #screenarea
> default value **Rectangle.zero**
> 
> to use write **this.#screenarea**
> 
> 
> type {**Rectangle**} holds the render displacement rectangle of the tilemap
> 
> 

---

#### #tiles
> default value **null**
> 
> to use write **this.#tiles**
> 
> 
> type {**Tile[]**} an array of tiles, the position of the tile in the list gives it's index for entering into the tilemap
> 
> 

---

#### #tilesize
> default value **vector2.one**
> 
> to use write **this.#tilesize**
> 
> 
> type {**vector2**} holds the size of the tiles (width and height) in the tilemap all tiles need to be the same size
> 
> 

---

#### #txSize
> default value **{w:0,h:0}**
> 
> to use write **this.#txSize**
> 
> 
> type {**w:int,h:int**} holds the width and height of off screen textures
> 
> 

---

#### #txSizeScaled
> default value **{w:0,h:0}**
> 
> to use write **this.#txSizeScaled**
> 
> 
> type {**w:int,h:int**} holds the scaled size of a texture used during rendering
> 
> 

---

#### #txcolsrows
> default value **{w:0,h:0}**
> 
> to use write **this.#txcolsrows**
> 
> 
> type {**w:int,h:int**} holds the number of columns and rows per off screen texture
> 
> 

---

#### #txdims
> default value **{w:0,h:0}**
> 
> to use write **this.#txdims**
> 
> 
> type {**w:int,h:int**} holds width and height of offscreen texture array formally #txwide and #txhigh
> 
> 

---

#### #verifymap
> default value **false**
> 
> to use write **this.#verifymap**
> 
> 
> type {**bool**} if true loaded tilemaps will be verified
> 
> 

---

#### #visibletilesize
> default value **vector2.one**
> 
> to use write **this.#visibletilesize**
> 
> 
> type {**vector2**} the scaled (on screen) size of the tilemap tiles
> 
> 

---

#### //#rawarea
> default value **Rectangle.one old renderer**
> 
> to use write **this.//#rawarea**
> 
> holds raw area of the tilemap
> 
> 

---

#### //#txhigh
> to use write **this.//#txhigh**
> 
> nuber of offscreen textures used vertically
> 
> 

---

#### alpha
> default value **1**
> 
> to use write **this.alpha**
> 
> 
> type {**float**} render transparency level for the tilemap 1 - opaque, 0 completely transparent @default {1}
> 
> 

---

#### alphamap
> default value **null**
> 
> to use write **this.alphamap**
> 
> 
> type {**float[][]**} holds an alpha map, a transparency setting for individual tiles - not implemented yet needs shader code
> 
> 

---

#### async loadmapFromCSVfile(filename, callback, debug)
> to use write **this.async loadmapFromCSVfile(filename, callback, debug)**
> 
> uses a string map file that contains the information on map size and tile map values,
> 
> this happens asynchronously so we need callback so we know that the tilemap is in place and ready to be processed/interrogated
> 
> width and height are implied by the rows and columns,
> 
>  (semi-colon) at the start of the line acts as a comment line is ignored
> 
> ```js
> example
>      ;set the initial renderscale to 1 in both directions
>      scal:1,1
>      ;basic atari vcs combat tank map
>      ;each tile will be 20x20 pixels
>      ;so I'm going for 40 tiles wide and 30 high (minus 2 for score)
>      ;giving a map 800 x 600 pixels in size
>      
>      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
>      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
>      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
>      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
>      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
>      1,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
>      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
>      1,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
>      1,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
>      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
>      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
>      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1
>      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
>      1,0,0,0,1,1,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1
>      1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1
>      1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1
>      1,0,2,0,0,1,0,0,0,0,1,1,1,1,1,0,0,2,0,3,0,0,2,0,0,1,1,1,1,1,0,0,0,0,1,0,0,3,0,1
>      1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1
>      1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1
>      1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1
>      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
>      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,1
>      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
>      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
>      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,2,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,1
>      1,0,0,0,0,0,0,0,0,0,2,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,1
>      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
>      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
>      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
>      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
>      1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1     
> ```
> 

---

#### async loadmapFromStringfile(filename, callback, debug)
> to use write **this.async loadmapFromStringfile(filename, callback, debug)**
> 
> uses a string map file that contains the information on map size and tile map values,
> 
> this happens asynchronously so we need callback so we know that the tilemap is in place and ready to be processed/interrogated
> 
> ```js
> example
>      ;file start - lines starting with ; are ignored
>      ;a - is border
>      ;b - is a breakable wall character
>      ;c - is player start position
>      ;x - ignored so empty tile is placed at this location
>      abcdefg
>      ;tile width 16 and 20 high
>      16,20
>      aaaaaaa
>      axxbxxa
>      axxcxxa
>      axxbxxa
>      aaaaaaa
>      
>      would create a tile map 5 rows and 7 columns, tile size 16 pixles wide and 20 pixels high with 7 different tiles
>      a border of tile 0 with tile 1 in a line down the centre, null tiles everywhere else
>     
>      <param name="filename">filename containing the map</param>
>      <returns>true if read correctly</returns>
>      <remarks></remarks>
>      
> ```
> 

---

#### clamplocation
> default value **true**
> 
> to use write **this.clamplocation**
> 
> 
> type {**bool**} if true will limit generated location values to valid tile locations if false you will need to verify valid location using validLocation
> 
> 

---

#### clipview
> default value **false**
> 
> to use write **this.clipview**
> 
> 
> type {**bool**} not in use yet (may never be) would clip tilemap to the view window (it already is sort of clipped)
> 
> 

---

#### collisionmap
> default value **null**
> 
> to use write **this.collisionmap**
> 
> 
> type {**int[][]**} holds a collision map for doing more general or specific collision maps instead of directly interrogating graphic tiles (which can get complex)
> 
> 

---

#### colourmap
> default value **null**
> 
> to use write **this.colourmap**
> 
> 
> type {**float[][]**} holds an colour map, a color setting for individual tiles - not implemented yet needs shader code
> 
> 

---

#### cols
> default value **0**
> 
> to use write **this.cols**
> 
> 
> type {**int**} number of tile columns in the tilemap
> 
> 

---

#### layer
> default value **null**
> 
> to use write **this.layer**
> 
> 
> type {**texture|image**} holds the layer that this tilemap will be rendered to by default (on construction) this will be Engine.backmap (the first of all layers drawn)
> 
> 

---

#### let stc
> default value **0**
> 
> to use write **this.let stc**
> 
> off screen texture column to start rendering from
> 
> 

---

#### let str
> default value **0**
> 
> to use write **this.let str**
> 
> off screen texture row to start rendering from
> 
> 

---

#### let vh
> default value **this.view.h**
> 
> to use write **this.let vh**
> 
> viewport height
> 
> 

---

#### let vtw
> default value **2 + (vw / this.#txSizeScaled.w) | 0 //precalc??**
> 
> to use write **this.let vtw**
> 
> number of offscreen textures that would fill view area
> 
> 

---

#### let vw
> default value **this.view.w**
> 
> to use write **this.let vw**
> 
> viewport width
> 
> 

---

#### overlay
> default value **TilemapOverlay.NONE**
> 
> to use write **this.overlay**
> 
> holds an overlay method, default to TilemapOveraly.NONE
> 
> 
> type {**TilemapOverlay**} @default {TilemapOveraly.NONE} //only use for testing and debugging, resource heavy
> 
> ```js
> example
>        //put row and column info on top of tile map
>        this.overlay = TilemapOverlay.ROW_COL
>      
> ```
> 

---

#### overlayCol
> default value **[255,255,255]**
> 
> to use write **this.overlayCol**
> 
> 
> type {**color**} specifies a colour to render the tilemap overaly in
> 
> 

---

#### overlayskip
> default value **1**
> 
> to use write **this.overlayskip**
> 
> 
> type {**int**} specifies how to process rows and columns for the overlay, defaults to 1 show every row and column, if tiles are too small to show the information increase the skip value
> 
> 

---

#### remove
> default value **false**
> 
> to use write **this.remove**
> 
> 
> type {**bool**} if true requests the tilemap manager removes the tilemap
> 
> 

---

#### rows
> default value **0**
> 
> to use write **this.rows**
> 
> 
> type {**int**} number of tile rows in the tilemap
> 
> 

---

#### scrollmultiplier
> default value **{x:1,y:1}**
> 
> to use write **this.scrollmultiplier**
> 
> 
> type {**{x:int,y:int**} } specifies how much to move based on viewport movement/displacement defaults to {x:1,y:1} which means 1 pixel of viewport movement means 1 pixel of tilemap movement if you set it to {x:2,y:2} the tilemap will move twice as fast as the viewport if you set it to {x:0.5,y:0.5} the tilemap will move half as fast as the viewport by layering multiple tilemaps with different scrollmultipliers you can create parallax effects
> 
> 

---

#### textures
> default value **null**
> 
> to use write **this.textures**
> 
> 
> type {**texture[][]**} 2d arrayof offscreen textures for this tilemap
> 
> 

---

#### tileindex
> default value **null**
> 
> to use write **this.tileindex**
> 
> 
> type {**string**} holds the tile list defined in string formatted tilemap files
> 
> 

---

#### view
> to use write **this.view**
> 
> 
> type {**View**} holds the viewport this tilemap is rendered into
> 
> 

---

#### visible
> default value **true**
> 
> to use write **this.visible**
> 
> 
> type {**bool**} controls whether tilemap is displayed (true) or not (false)
> 
> 

---

#### wipesystem
> default value **null**
> 
> to use write **this.wipesystem**
> 
> holds the current wipe data, assuming you have set the tilemap to wipeusing the wipe() method
> 
> 
> type {**{ti:Timer,col:int,row:int,di:{c:int,r:int**} }}
> 
> 

---

#### world
> default value **false**
> 
> to use write **this.world**
> 
> if false then tilemap position is in terms of the viewport window, if true then position is world co-ordinates
> 
> any movement of the viewport will move the tilemap accordingly
> 
> 

---

#### wrapTileInterrogation
> default value **true**
> 
> to use write **this.wrapTileInterrogation**
> 
> 
> type {**bool**} if true locations outside the tile map are wrapped to opposite side when performing collision checks. This is useful if you can traverse/warp/wrap from one side of a tilemapto another so you get valid options (Pac-Man tunnels are a use case for this ) @default {true}
> 
> 

---

#### wrapx
> default value **false**
> 
> to use write **this.wrapx**
> 
> 
> type {**bool**} if true, the tilemap will be repeated horizontally until it fills the viewport
> 
> 

---

#### wrapy
> default value **false**
> 
> to use write **this.wrapy**
> 
> 
> type {**bool**} if true, the tilemap will be repeated vertically until it fills the viewport
> 
> 

---

## getters and setters
#### area [getter]
> to use write **this.area**
> 
> 
> returns {**Rectangle**} area of tilemap
> 
> 

---

#### area [setter]
> to use write **this.area = value**
> 
> 
> **Parameters**
> 
> {***  {Rectangle**} **value**  specifies the area of the tilemap
> 
> 

---

#### centrex [setter]
> to use write **this.centrex = value**
> 
> sets the tilemap poisition so its horizontal centre is at this position
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

#### centrey [setter]
> to use write **this.centrey = value**
> 
> sets the tilemap poisition so its vertical centre is at this position
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

#### debugdisplay [getter]
> to use write **this.debugdisplay**
> 
> 

---

#### map [getter]
> to use write **this.map**
> 
> 
> returns {**int[][]**} a reference to the graphic tilemap
> 
> 

---

#### position [getter]
> to use write **this.position**
> 
> 
> returns {**    /** @returns the render offset of the tilemap, change the x and y values to "scroll" the tilemap  ***}
> 
> 

---

#### position [setter]
> to use write **this.position = value**
> 
> sets the position of the tilemap as a vector 2 value
> 
> if wrapx is true the x position will be wrapped within the area of the tilemap
> 
> if wrapy is true the y position will be wrapped within the area of the tilemap
> 
> 
> **Parameters**
> 
> {**vector2**} **value** the x and y position to set
> 
> 

---

#### renderArea [getter]
> to use write **this.renderArea**
> 
> 
> returns {**Rectangle**} gets the render position of the tilemap
> 
> 

---

#### scale [getter]
> to use write **this.scale**
> 
> 
> returns {**vector2**} gets the scale for the tilemap
> 
> 

---

#### scale [setter]
> to use write **this.scale = value**
> 
> sets the scale for the tilemap w,h
> 
> 

---

#### sh [getter]
> to use write **this.sh**
> 
> 
> returns {**float**} vertical scale of the tilemap
> 
> 

---

#### sh [setter]
> to use write **this.sh = value**
> 
> 
> **Parameters**
> 
> {**float**} **value** sets the vertical scale of the tilemap
> 
> 

---

#### sw [getter]
> to use write **this.sw**
> 
> 
> returns {**float**} horizontal scale of the tilemap
> 
> 

---

#### sw [setter]
> to use write **this.sw = value**
> 
> 
> **Parameters**
> 
> {**float**} **value** sets the horizontal scale of the tilemap
> 
> 

---

#### tiles [getter]
> to use write **this.tiles**
> 
> gets the tiles for the tilemap, do not add items directly
> 
> 

---

#### tilesize [getter]
> to use write **this.tilesize**
> 
> 
> returns {**vector2**} gets the width and height of tiles in the tilemap
> 
> 

---

#### tilesize [setter]
> to use write **this.tilesize = value**
> 
> 
> **Parameters**
> 
> {***  {vector2|{x:int,y:int}**} **value** to specify the width and height of all tiles
> 
> 

---

#### verifymap [getter]
> to use write **this.verifymap**
> 
> if set to true then the map will be verified to ensure index match with tiles defined
> 
> set this before you attempt to either use setmap or before loading a map from a file
> 
> if they are incorrect then an error will be thrown
> 
> 
> returns {**bool**}
> 
> 

---

#### verifymap [setter]
> to use write **this.verifymap = value**
> 
> if set to true then the map will be verified to ensure index match with tiles defined
> 
> set this before you attempt to either use setmap or before loading a map from a file
> 
> 
> **Parameters**
> 
> {**bool**} **value** 
> 
> 

---

#### visibletilesize [getter]
> to use write **this.visibletilesize**
> 
> 
> returns {**vector2**} the scaled (on screen) size of the tilemap tiles
> 
> 

---

#### wrap [getter]
> to use write **this.wrap**
> 
> 
> returns {**bool**} if wrapping in x and y directions is set
> 
> 

---

#### wrap [setter]
> to use write **this.wrap = value**
> 
> sets wrapping in x and y directions (if true), turns both off if false
> 
> 
> **Parameters**
> 
> {**boolean**} **value** that sets or clears both x and y wrapping
> 
> 

---

#### x [getter]
> to use write **this.x**
> 
> 
> returns {**float**} the x position of the tilemap
> 
> 

---

#### x [setter]
> to use write **this.x = value**
> 
> sets the position of the tilemap as a vector 2 value
> 
> if wrapx is true the x position will be wrapped within the area of the tilemap
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

#### y [getter]
> to use write **this.y**
> 
> 
> returns {**float**} the y position of the tilemap
> 
> 

---

#### y [setter]
> to use write **this.y = value**
> 
> sets the x position of the tilemap
> 
> if wrapy is true the y position will be wrapped within the area of the tilemap
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

## Methods
####  oppositeDirection(direction) [static]
> to use write **Tilemap.oppositeDirection(direction)**
> 
> given a direction (left, right up or down returns the oppositie direction,
> 
> 
> returns {**TileDirection**} the opposite direction to that supplied
> 
> 
> **Parameters**
> 
> {**TileDirection**} **tiledirection** a direction or a bitwise OR'd set of directions to obtain the opposite of
> 
> ```js
> example
>       //will compute minor ordinals if bitwise or'd together
>       let direction = TileDirection.LEFT | TileDirection.UP; 
> ```
> 

---

####  removeDirection(possibleDirections, direction) [static]
> to use write **Tilemap.removeDirection(possibleDirections, direction)**
> 
> given a list of directions, remove the one specified (if it exists)
> 
> 
> **Parameters**
> 
> {**TileDirection[]**} **possibleDirections** an array of potential directions
> 
> {**TileDirection**} **direction** a direction to remove from the possibleDirections
> 
> 

---

####  removeOppositeDirection(possibleDirections, direction) [static]
> to use write **Tilemap.removeOppositeDirection(possibleDirections, direction)**
> 
> given a list of directions, remove a direction if it is in the opposite direction to the one specified
> 
> 
> **Parameters**
> 
> {**TileDirection[]**} **possibleDirections** an array of potential directions
> 
> {**TileDirection**} **direction** a direction that we want to remove the opposite directino from (if it exist)
> 
> 

---

####  samelocation(locA, locB) [static]
> to use write **Tilemap.samelocation(locA, locB)**
> 
> determines if two locations are the same
> 
> 
> returns {**bool**} true if same locations and false otherwise
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **locA** 
> 
> {**{x:int,y:int}**} **locB** 
> 
> 

---

####  spriteTileDirection(sprite) [static]
> to use write **Tilemap.spriteTileDirection(sprite)**
> 
> takes a sprite and examines it's delta (movement vector between updates)
> 
> and determines (if possible) an ordinal tile direction
> 
> 
> returns {**TileDirection**} tile direction sprite is generally moving in
> 
> 
> **Parameters**
> 
> {**Sprite**} **sprite** the sprite whose tile direction we want
> 
> 

---

####  tileDirectiontoVector(tiledirection) [static]
> to use write **Tilemap.tileDirectiontoVector(tiledirection)**
> 
> takes a bitwise tile direction and converts to a vector3 direction vector
> 
> create directions using bitwise or |
> 
> 
> returns {**vector3**} direction vector determined from tile directions
> 
> 
> **Parameters**
> 
> {**TileDirection**} **tiledirection** a direction or a bitwise OR'd set of directions
> 
> ```js
> example
>       //up and left
>       let upleft = TileDirection.UP | TileDirection.LEFT;
>       let direction = this.tileDirectiontoVector(TileDirection.UP);
>       let di = this.tileDirectiontoVector(upleft);
>      
> ```
> 

---

####  vectorToTiledirection(vec) [static]
> to use write **Tilemap.vectorToTiledirection(vec)**
> 
> takes a direction vector and determines the general ordinal direction it is pointing
> 
> 
> returns {**TileDirection**} tile direction sprite is generally moving in
> 
> 
> **Parameters**
> 
> {**vector3|vector2**} **vec** direction vector to convert to a tile direction
> 
> 

---

#### #biggestfactor(a, into)
> to use write **this.#biggestfactor(a, into)**
> 
> simple way of working out sensible tiling sizes for offscreen rendering of the tilemap into
> 
> it's sub textures
> 
> 
> **Parameters**
> 
> {**int**} **a** value to to shrink till a factor of into
> 
> {**int**} **into** value we want a factor for
> 
> 

---

#### #clrGtilenew(rd)
> to use write **this.#clrGtilenew(rd)**
> 
> clears the tile in the correct offscreen render target
> 
> 

---

#### #createMap(area, tilesize)
> to use write **this.#createMap(area, tilesize)**
> 
> builds an empty tilemap full of -1 tiles make sure tilesize is a factor of area
> 
> 

---

#### #dowipe()
> to use write **this.#dowipe()**
> 
> performs the internal wipe operation
> 
> 

---

#### #drawlocalnew()
> to use write **this.#drawlocalnew()**
> 
> draw thetilemap to the offscreen render textures
> 
> 

---

#### #drawover()
> to use write **this.#drawover()**
> 
> provides overaly support (buggy) not a full or proper solution yet
> 
> 

---

#### #lineofSite(startloc, goalloc,)
> to use write **this.#lineofSite(startloc, goalloc,)**
> 
> determines if there is direction line of site from the start location and the goal location
> 
> 

---

#### #listBetween(startloc, goalloc)
> to use write **this.#listBetween(startloc, goalloc)**
> 
> produces a list of tiles between the start location and goal location
> 
> 

---

#### #makeTexture(w, h)
> to use write **this.#makeTexture(w, h)**
> 
> creates a texture (for the offscreen renderer)
> 
> 
> **Parameters**
> 
> {**int**} **w** pixels wide
> 
> {**int**} **h** pixels high
> 
> 

---

#### #processCSVfile(line, callback)
> to use write **this.#processCSVfile(line, callback)**
> 
> handles data loaded from mapfile
> 
> 

---

#### #processStringfile(line, callback)
> to use write **this.#processStringfile(line, callback)**
> 
> handles data loaded from map file
> 
> 

---

#### #setGtilenew(rd, fr)
> to use write **this.#setGtilenew(rd, fr)**
> 
> sets a tile in the correct offscreen render target
> 
> 
> **Parameters**
> 
> {**{tx:this.textures[tr][tc].tx,x:rx, y:ry}**} **rd** target offscreen texture information
> 
> {**{tex:texture,port:Rectangle}**} **fr** tile render information
> 
> 

---

#### #setTexturesNew()
> to use write **this.#setTexturesNew()**
> 
> builds textures but makes size a multiple of base tilewidth ignoring mip mapping
> 
> possibilities in the future which is iok for tilemaps in general
> 
> 

---

#### #setgraphictilenew(loc, tile)
> to use write **this.#setgraphictilenew(loc, tile)**
> 
> internal rendering for the graphic tile
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** tilemap location
> 
> {**int**} **tile** the tile index to render at the given location
> 
> 

---

#### #tilemapToMonoImage(settings)
> to use write **this.#tilemapToMonoImage(settings)**
> 
> Takes a tilemap and returns an image texture with transparency where no tile exists or the the given
> 
> 
> **Parameters**
> 
> {**{region:Rectangle,transparentTile:int,scalex:int,scaley:int}**} **settings** to control the size and data set for the generated graphic image
> 
> 

---

#### #tiletoTXnew(loc)
> to use write **this.#tiletoTXnew(loc)**
> 
> works out offscreen render texture and its position based on the tilemap location given
> 
> 

---

#### #verifymaptiles()
> to use write **this.#verifymaptiles()**
> 
> will check to make sure all indexes specified in the tilemap have a corresponding tile in the tileset.
> 
> This is expensive so do it during debugging phase of your project to help you out.
> 
> if we have a mismatch between indexes used and tiles then an error will be thrown
> 
> 

---

#### actorAtcentre(actor, loc, tolerance)
> to use write **this.actorAtcentre(actor, loc, tolerance)**
> 
> returns true if sprite is withing the tolerance distance of the center of given tile
> 
> 
> returns {**float**} SQUARED distance of sprite from centre of tile
> 
> 
> **Parameters**
> 
> {**Sprite**} **actor** the sprite to investigate
> 
> {**{x:int,y:int}**} **loc** is a tile location to interrogate
> 
> {**float**} **tolerance** distance good enough to say it's at the centre.
> 
> 

---

#### async writeasCSV(filename)
> to use write **this.async writeasCSV(filename)**
> 
> attempts to write the tilemap to a CSV file
> 
> 
> **Parameters**
> 
> {**string**} **filename** requested file name to write, saving must be done by the user
> 
> 

---

#### centreInmainview()
> to use write **this.centreInmainview()**
> 
> Attempts to centre the tilemap within the main view area
> 
> 

---

#### centreInworld()
> to use write **this.centreInworld()**
> 
> Attempts to centre the tilemap within the world area
> 
> 

---

#### centrehere(rect)
> to use write **this.centrehere(rect)**
> 
> centres the tilemap around the rectangle given
> 
> 
> **Parameters**
> 
> {**Rectangle**} **rect** the rectanglular area to attempt to centre the tilemap around
> 
> 

---

#### centreinmyview()
> to use write **this.centreinmyview()**
> 
> centre's the tilemap in it's default view (if more than one)
> 
> 

---

#### cleanup()
> to use write **this.cleanup()**
> 
> remove any references from the tilemap. make sure you implement cleanup in your own tilemaps
> 
> if you need to release any resources (and make sure you call super.cleanup())
> 
> 

---

#### clrMapGraphic(loc, size)
> to use write **this.clrMapGraphic(loc, size)**
> 
> removes tiles from the tile map at the given location (will make tile reference -1 - no tile/transparent)
> 
> if a size is specified a rectangular region is cleared {w:4,h:5} from that location.
> 
> if you want to place a zero tile use setMapGraphic() instead
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** the x and y tile location to clear
> 
> {**{w:int,h:int}**} **size** of region to clear, tiles wide and high from the given location, can be ommited for a single tile
> 
> 

---

#### createCollisionMap(collisionBlocks, empty)
> to use write **this.createCollisionMap(collisionBlocks, empty)**
> 
> builds a collision map from a tilemap
> 
> An array of collision tiles which map the display tiles to specific collision ones,
> 
> make sure this has enough entries to cover all the display tiles
> 
> the collisionmap is available using this.collisionmap it's row a ordered 2d array like the graphic map
> 
> if loading a tilemap, generate collision map once it has loaded using the load callback
> 
> 
> **Parameters**
> 
> {**[int]**} **collisionBlocks** - an array of graphic to collision mappings (must be same length as tiles array)
> 
> {**int**} **empty** - collision tile to place for undefined tilemap areas (-1 - nothing drawn)
> 
> ```js
> example
>       //example 1 simple collision map
>       //collision tiles
>       static gNOTILE = -1;
>       static cEMPTY = 0; static gEMPTY = 0;
>       static cWALL = 1; static gWALL = 1;
>       static gP1_START = 2;
>       static gP2_START = 3;
>       static gTEST_START = 4;
>       static legalmove = [Maze.cEMPTY];
>       generateCollisions(){
>         //collision blocks must be same length as tile list
>         let collisionblocks = new Array(this.tiles.length);
>         for (let p = 0; p < collisionblocks.length; p++){
>           collisionblocks[p] = Maze.cWALL;
>         }
>         //set specific collsion mappers for graphic tiles
>         collisionblocks[Maze.gEMPTY] = Maze.cEMPTY;
>         this.createCollisionMap(collisionblocks,  Maze.cEMPTY);//Maze.cWALL);
>       }
>       
>       //example 2 more complex map 
>       //collision tiles
>       static cEMPTY = 0;
>       static cWALL = 1;
>       static cPELLET = 2;
>       static legalmove = [pacmaze.cEMPTY, pacmaze.cPELLET];
>       generateCollisions(){
>         //collision blocks must be same length as tile list
>         let collisionblocks = new Array(this.tiles.length);
>         for (let p = 0; p < collisionblocks.length; p++){
>           collisionblocks[p] = pacmaze.cWALL;
>         }
>         //set specific collsion mappers for graphic tiles
>         collisionblocks[48] = pacmaze.cPELLET;
>         collisionblocks[49] = pacmaze.cPELLET;
>         collisionblocks[44] = pacmaze.cEMPTY;
>         collisionblocks[45] = pacmaze.cEMPTY;
>         collisionblocks[46] = pacmaze.cEMPTY;
>         collisionblocks[47] = pacmaze.cEMPTY;
>         collisionblocks[52] = pacmaze.cEMPTY;
>         collisionblocks[53] = pacmaze.cEMPTY;
>         collisionblocks[56] = pacmaze.cEMPTY;
>         this.createCollisionMap(collisionblocks, pacmaze.cWALL);
>       }
>       
>      
> ```
> 

---

#### distanceFromtop(loc, x, y)
> to use write **this.distanceFromtop(loc, x, y)**
> 
> This is WIP, not quite there yet
> 
> takes a pixel position and a tile location returns the distance from the top of the tile surface
> 
> used by surface sensor techniques (for slopes and irregular tiles)
> 
> 
> returns {**int**} distance from top of tile
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** is a tile location to interrogate
> 
> {**int**} **x** x position to check for distance to tile location
> 
> {**int**} **y** y position to check for distance to tile location
> 
> 

---

#### draw()
> to use write **this.draw()**
> 
> draws the tilemap if visible is true
> 
> 

---

#### highlight(loc, renderinfo, spr)
> to use write **this.highlight(loc, renderinfo, spr)**
> 
> re-uses the given sprite to highlight a specific tile location
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** tile location to place highlight
> 
> {**{time:float,alpha:float,layer:texture}**} **renderinfo** visual settings to apply, assumed that sprite frames already set (we essntially scale and alpha only)
> 
> {**Sprite**} **spr** Sprite to use, must have a frame defined, if you do not want to create a specific sprite use new Tilehigh(color) to create a basic coloured sprite (see examples)
> 
> 

---

#### highlightTileset(colours)
> to use write **this.highlightTileset(colours)**
> 
> gets 4 basic sprites in an array to be used with Tilemap.highlightdirections if you don't want to create your own custom list of sprites
> 
> 
> returns {**Sprite[]**} a set of basic sprites to use when highlighting directions
> 
> 
> **Parameters**
> 
> {**color[]**} **colors** an array of 4 colours to apply to the sprites
> 
> 

---

#### highlightdirections(loc, directions, renderinfo, sprlist)
> to use write **this.highlightdirections(loc, directions, renderinfo, sprlist)**
> 
> highlights the list of directions from the given location
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** tile location to place highlight
> 
> {**[TileDirection]**} **directions** direction from loc to highlight
> 
> {**{time:float,alpha:float,layer:texture}**} **renderinfo** visual settings to apply, assumed that sprite frames already set (we essntially scale and alpha only
> 
> {**Sprite[]**} **sprlist** an array of sprites at least as long as the directions
> 
> 

---

#### location(x, y)
> to use write **this.location(x, y)**
> 
> takes a pixel location and returns a tile location (if possible) in the tilemap
> 
> 
> returns {**{x:int,y:int**} a tile location
> 
> 
> **Parameters**
> 
> {**float**} **x** x position to find tile location of
> 
> {**float**} **y** y position to find tile location of
> 
> 

---

#### locationForward(sprite, distance)
> to use write **this.locationForward(sprite, distance)**
> 
> works out a displacement from a sprites centre tile in the direction it is moving
> 
> if you make the distance -ve this will give you a direction backwards
> 
> 
> returns {**{x:int,y:int**} location offsetted from given location
> 
> 
> **Parameters**
> 
> {**Sprite**} **actor** the sprite to find the tile it's centre is over
> 
> {**int|int[]**} **distance** number of tiles to offset by, if you want to offset differently in horizontal and vertical directions suppy an array with 2 integers
> 
> 

---

#### locationOffset(loc, direction, distance)
> to use write **this.locationOffset(loc, direction, distance)**
> 
> returns a tile location a tile distance from the given location
> 
> in the direction specified
> 
> 
> returns {**{x:int,y:int**} location offsetted from given location
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** tile location to offset from
> 
> {**TileDirection**} **direction** a direction or a bitwise OR'd set of directions (for diagonals)
> 
> {**int|int[]**} **distance** number of tiles to offset by, if you want to offset differently in horizontal and vertical directions suppy an array with 2 integers
> 
> ```js
> example
>       let p = {x:4,y:5};
>       let v = map.locationto(p, TileDirection.LEFT, 4);
>       //v would be {x:0,y:5}
>       let v = map.locationto(p, TileDirection.LEFT | TileDirection.UP, 2);
>       //v would be {x:2,y:3}    
>     
> ```
> 

---

#### locationactor(actor)
> to use write **this.locationactor(actor)**
> 
> returns the tile location of a given sprite
> 
> 
> returns {**{x:int,y:int**} tile location
> 
> 
> **Parameters**
> 
> {**Sprite**} **actor** the sprite to find the tile it's centre is over
> 
> 

---

#### pixelBottom(loc)
> to use write **this.pixelBottom(loc)**
> 
> gets the bottom hand side of given tile location
> 
> supply a valid tile location
> 
> 
> returns {**float**} edge requested
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** tile location to get bottom edge of
> 
> 

---

#### pixelLeft(loc)
> to use write **this.pixelLeft(loc)**
> 
> gets the left hand side of given tile location
> 
> supply a valid tile location
> 
> 
> returns {**float**} edge requested
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** tile location to get left edge of
> 
> 

---

#### pixelRight(loc)
> to use write **this.pixelRight(loc)**
> 
> gets the right hand side of given tile location
> 
> supply a valid tile location
> 
> 
> returns {**float**} edge requested
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** tile location to get right edge of
> 
> 

---

#### pixelTop(loc)
> to use write **this.pixelTop(loc)**
> 
> gets the pixel location of the top of tile location
> 
> supply a valid tile location
> 
> 
> returns {**float**} edge requested
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** tile location to get top edge of
> 
> 

---

#### pixelbottom(loc)
> to use write **this.pixelbottom(loc)**
> 
> gets the y position of the bottom of requested tile
> 
> 
> returns {**float**} bottom of tile requested
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** is a tile location to interrogate
> 
> 

---

#### pixelcentre(loc)
> to use write **this.pixelcentre(loc)**
> 
> takes a tile location and returns the centre location as a vector3(1,4,0)
> 
> 
> returns {**vector3**} centre of requested tile
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** is a tile location to interrogate
> 
> 

---

#### pixelcentrex(loc)
> to use write **this.pixelcentrex(loc)**
> 
> takes a tile location and returns horizontal position of the tiles centre
> 
> 
> returns {**vector3**} horizontal (x) centre of requested tile
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** is a tile location to interrogate
> 
> 

---

#### pixelcentrey(loc)
> to use write **this.pixelcentrey(loc)**
> 
> takes a tile location and returns vertical position of the tiles centre
> 
> 
> returns {**vector3**} vertical (y) centre of requested tile
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** is a tile location to interrogate
> 
> 

---

#### pixelleft(loc)
> to use write **this.pixelleft(loc)**
> 
> gets the x position of the left of requested tile
> 
> 
> returns {**float**} left of tile requested
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** is a tile location to interrogate
> 
> 

---

#### pixelright(loc)
> to use write **this.pixelright(loc)**
> 
> gets the x position of the right of requested tile
> 
> 
> returns {**float**} right of tile requested
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** is a tile location to interrogate
> 
> 

---

#### pixeltop(loc)
> to use write **this.pixeltop(loc)**
> 
> gets the y position of the top of requested tile
> 
> 
> returns {**float**} top of tile requested
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** is a tile location to interrogate
> 
> 

---

#### processmap(callback)
> to use write **this.processmap(callback)**
> 
> works through all tile locations in the tilemap and passes tile information to the callback
> 
> this will allow you to remove/replace special marker tiles with other tiles and sprite if required
> 
> using a switch to examine the tile recepients is a good technique
> 
> your handler should return the tile to replace the specific tile with for instance if the tile is a sprite marker then you may
> 
> want to replace the tile with a floor or empty tile (return the tile given if no change is wanted)
> 
> 
> **Parameters**
> 
> {**{callback:method|function,instance:object}**} **callback** - a callback use Engine.makeCallback to prepare your callback object.
> 
> ```js
> example
>       loaded(){
>         this.centreinmyview();
>         this.processmap(Engine.makeCallback(this.examinetile, this));
>         //generate collisions after processing map
>         this.generateCollisions();
>             *   //indicate to any other subsystems waiting on maze being loaded and processed
>         MsgBus.send(mymess.mazeready);
>       }
>       examinetile(data){
>           switch (data.tile){
>             case Maze.gP1_START: new Player1(data.loc); return Maze.gEMPTY;
>             case Maze.gP2_START: new Player2(data.loc); return Maze.gEMPTY;
>             case Maze.gTEST_START: new Test(data.loc); return Maze.gEMPTY;
>             default: return data.tile;
>           }
>       }
>      
> ```
> 

---

#### routeTovector3(points)
> to use write **this.routeTovector3(points)**
> 
> takes an array of tile locations and outputs an array of vector3 world locations based on tile centres
> 
> 
> returns {**vector3[]**} the vector3 version of the tile centres, null if no points exist
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **points** array must be in x y object form and consist of integer values (as they are tile locations),
> 
> ```js
> example
>       let tilepositions = [{x:4,y:4},{x:5,y:4},{x:6,y:4}];
>       let vlist = this.routeTovector3(tilepositions);
>     
> ```
> 

---

#### setActorcentre(actor, loc)
> to use write **this.setActorcentre(actor, loc)**
> 
> takes a sprite and tile position setting the sprite at the centre of the tile location
> 
> 
> returns {**vector3**} passes the position of the centre of the tile back if you want it
> 
> 
> **Parameters**
> 
> {**Sprite**} **actor** 
> 
> {**{x:int,y:int}**} **loc** 
> 
> ```js
> example
> this.mymap.setActorcentre(this, {x:10,y:11});
> ```
> 

---

#### setActorcentreX(actor, loc)
> to use write **this.setActorcentreX(actor, loc)**
> 
> takes a sprite and tile position setting the sprite horizontally at the centre of the tile location
> 
> 
> returns {**float**} x position set
> 
> 
> **Parameters**
> 
> {**Sprite**} **actor** sprite to centre
> 
> {**{x:int,y:int}**} **loc** tile location to centre within
> 
> ```js
> example
> this.mymap.setActorcentre(this, {x:10,y:11});
> ```
> 

---

#### setActorcentreY(actor, loc)
> to use write **this.setActorcentreY(actor, loc)**
> 
> takes a sprite and tile position setting the sprite vertically at the centre of the tile location
> 
> 
> returns {**float**} y position set
> 
> 
> **Parameters**
> 
> {**Sprite**} **actor** sprite to centre
> 
> {**{x:int,y:int}**} **loc** tile location to centre within
> 
> ```js
> example
> this.mymap.setActorcentre(this, {x:10,y:11});
> ```
> 

---

#### setMapGraphic(loc,tile, size)
> to use write **this.setMapGraphic(loc,tile, size)**
> 
> set a single (or fill a rectangular region) graphic tile at a specific location in the map, make sure the tile number is valid and also the location
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** the x and y tile location to set
> 
> {**int**} **tile** tile number to place here
> 
> {**{w:int,h:int}**} **size** of region to set, tiles wide and high from the given location, can be ommited for a single tile
> 
> 

---

#### setmap(map, scale)
> to use write **this.setmap(map, scale)**
> 
> creates a tilemap from the given 2d array of integers.
> 
> The integers represent tile indexes, make sure you have defined an appropriate number of tiles to match all the indexes supplied
> 
> You can set the verifymap property to true before using setmap to check you won't have tile problems
> 
> 
> **Parameters**
> 
> {**int[][]**} **map** 2d array of tile indexes that represent tiles from the tileset, set tiles before specifiying the map. If an index is in the map you'll get texture and width errors during rendering. Run this.verifymap() to ensure you don't have this problem
> 
> {**vector2|{w:float,h:float}**} **scale** sets a scale size if given, ignore the parameter if you do not wish to set the scale on creation
> 
> 

---

#### shortestDistanceCrow(directions, currentLoc, targetLoc)
> to use write **this.shortestDistanceCrow(directions, currentLoc, targetLoc)**
> 
> given a list of directions available from a given tile, determines which one if moved to from a current location
> 
> will be nearer to the target tile. returning that direction
> 
> 
> returns {**TileDirection**} direction to move from currentLoc which is nearest to the targetLoc
> 
> 
> **Parameters**
> 
> {**TileDirection[]**} **directions** an array of legal directions to take from the currentLoc tile that we want to test the distance from
> 
> {**{x:int,y:int}**} **currentLoc** location we are currently at, that we want to know which direction would make us nearest the target location
> 
> {**{x:int,y:int}**} **targetLoc** the tile location we want to move to eventually
> 
> 

---

#### showClickabletiles(x, y, cols, rows, size, layer, startindex, endindex, indexinfo)
> to use write **this.showClickabletiles(x, y, cols, rows, size, layer, startindex, endindex, indexinfo)**
> 
> creates a set of sprites that can be clicked by user
> 
> if a click over one of the sprites is detected then a message of type msgT.spriteinfo is sent along with a reference to the sprite
> 
> the sprite has as an extra property called tile which holds the tile index this sprite represents
> 
> You can call this several times with different startindex and endindex values to produce a layout to your choosing
> 
> 
> **Parameters**
> 
> {**float**} **x** left position of display
> 
> {**float**} **y** top position of display
> 
> {**int**} **cols** number of columns to layout tiles
> 
> {**int**} **rows** number of rows to layout tiles
> 
> {**{w:int,h:int,padx:int,pady:int}**} **size** how wide and tall to make each tile and what padding x and y between each tile when shown
> 
> {**texture**} **layer** layer to render the tiles on
> 
> {**int**} **startindex** which tile to start drawing from
> 
> {**int**} **endindex** which tile to start drawing from
> 
> {**{fillcol:color,strokecol:color,textsize:int,strokeweight:int,xoff:int,yoff:int}**} **indexinfo** if omitted then the tile index will not ne displayed,
> 
> ```js
> example
>       // set a variable to old the indexinfo object to format the tile index number
>       // fill colour of text to white
>       // stroke colour to red
>       // strokeweigth to 1 pixel
>       // textsize 22pt
>       // don't offset horizontally from centre of tile
>       // offset down 24 pixels from vertical centre of tile
>       let indexinfo = {fillcol:[255,255,255],strokecol:[255,0,0],strokeweight:1,textsize:22,xoff:0,yoff:24};
>       
>       // ask the tilemap to show clickable tiles 5 to 34
>       // starting at position 700,50
>       // in 8 columns over 10 rows
>       // make them 48 pixcels wide and 48 pixels high 
>       // pad them with a gap of 8 pixels horizontally and vertically
>       // place on sprite layer 1
>       // start from tileindex 5 and end at tileindex 34
>       this.showClickabletiles(700,50,8,10,{w:48,h:48,padx:8,pady:8}, Engine.layer(1), 10, 13, indexinfo);
>       // add another block of tiles from tile index 26 to 45
>       this.showClickabletiles(700,150,8,10,{w:48,h:48,padx:8,pady:8}, Engine.layer(1), 26, 45, indexinfo);
>       
>       //register a subscriber for the spriteinfo message to respond to user clicks
>       MsgBus.sub(mymess.spriteinfo, this.tileclicked, this);
>       
>       //an example of a spriteinfo message handler as a method of the tilemap
>       tileclicked(data){
>            //save the currently actively clicked tile number for later, echo to console while testing
>            this.activetile = data.sp.tile;
>            console.log(this.activetile);
>       }
>       
>       
>      
> ```
> 

---

#### showtiles(x, y, cols, rows, size, layer, startindex, endindex, indexinfo)
> to use write **this.showtiles(x, y, cols, rows, size, layer, startindex, endindex, indexinfo)**
> 
> creates a set of sprites to show tiles from the tilemap
> 
> You can call this several times with different startindex and endindex values to produce a layout to your choosing
> 
> 
> **Parameters**
> 
> {**float**} **x** left position of display
> 
> {**float**} **y** top position of display
> 
> {**int**} **cols** number of columns to layout tiles
> 
> {**int**} **rows** number of rows to layout tiles
> 
> {**{w:int,h:int,padx:int,pady:int}**} **size** how wide and tall to make each tile and what padding x and y between each tile when shown
> 
> {**texture**} **layer** layer to render the tiles on
> 
> {**int**} **startindex** which tile to start drawing from
> 
> {**int**} **endindex** which tile to start drawing from
> 
> {**{fillcol:color,strokecol:color,textsize:int,strokeweight:int,xoff:int,yoff:int}**} **indexinfo** if omitted then the tile index will not ne displayed,
> 
> ```js
> example
>       // set a variable to old the indexinfo object to format the tile index number
>       // fill colour of text to white
>       // stroke colour to red
>       // strokeweigth to 1 pixel
>       // textsize 22pt
>       // don't offset horizontally from centre of tile
>       // offset down 24 pixels from vertical centre of tile
>       let indexinfo = {fillcol:[255,255,255],strokecol:[255,0,0],strokeweight:1,textsize:22,xoff:0,yoff:24};
>       
>       // ask the tilemap to show clickable tiles 5 to 34
>       // starting at position 700,50
>       // in 8 columns over 10 rows
>       // make them 48 pixcels wide and 48 pixels high 
>       // pad them with a gap of 8 pixels horizontally and vertically
>       // place on sprite layer 1
>       // start from tileindex 5 and end at tileindex 34
>       this.showtiles(700,50,8,10,{w:48,h:48,padx:8,pady:8}, Engine.layer(1), 10, 13, indexinfo);
>       // add another block of tiles from tile index 26 to 45
>       this.showtiles(700,150,8,10,{w:48,h:48,padx:8,pady:8}, Engine.layer(1), 26, 45, indexinfo);
>       
>      
> ```
> 

---

#### tileNumfromCollisionMap(loc)
> to use write **this.tileNumfromCollisionMap(loc)**
> 
> returns a collision tile number from the collisionmap
> 
> 
> returns {**int**} collision tile index found or if not valid location -1 is returned
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** is a tile location to interrogate
> 
> 

---

#### tileNumfromCollisionMapoffset(loc, direction, distance)
> to use write **this.tileNumfromCollisionMapoffset(loc, direction, distance)**
> 
> returns a collision tile number from the collisionmap a tile distance away from given location
> 
> 
> returns {**int**} collision tile index found or if not valid location -1 is returned
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** is a tile location to interrogate
> 
> {**TileDirection**} **direction** direction to look from tile given in loc
> 
> {**int**} **distance** number of tiles to move in given direction from loc
> 
> 

---

#### tileNumfromMap(loc)
> to use write **this.tileNumfromMap(loc)**
> 
> returns a tile number from the graphic tilemap
> 
> 
> returns {**int**} Tile index found or if not valid location -1 is returned
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** is a tile location to interrogate
> 
> 

---

#### tileNumfromMapoffset(loc, direction, distance)
> to use write **this.tileNumfromMapoffset(loc, direction, distance)**
> 
> gets the tile number from the graphic map a tile distance away from given location
> 
> 
> returns {**int**} Tile index found or if not valid location -1 is returned
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** is a tile location to interrogate
> 
> {**TileDirection**} **direction** direction to look from tile given in loc
> 
> {**int**} **distance** number of tiles to move in given direction from loc
> 
> 

---

#### tileTexture(texture, position, areadata)
> to use write **this.tileTexture(texture, position, areadata)**
> 
> takes a complete texture/image and breaks int tiles building a tilemap
> 
> to reference all the rectangluar regions, you must either set an area and tilesize if this is the first texture you are placing
> 
> 
> **Parameters**
> 
> {**image | texture**} **texture** 
> 
> {**vector2**} **position:** position to start tiling the texture too (if it goes out of the map then it will error)
> 
> {**object{area:{w,h},tilesize:{w:h}}**} **areadata** if specified then the area is based on these dimensions, if not then the texture is tiled at the position given
> 
> ```js
> example
>          this.tileTexture(txback00, {x:0,y:864}, {area:{w:12000,h:1536},tilesize:{w:16,h:16}});
>          this.tileTexture(txback2000, {x:2000,y:864});
>          this.tileTexture(txback4000, {x:4000,y:864});
>          this.tileTexture(txback6000, {x:6000,y:432});
>          this.tileTexture(txback8000, {x:8000,y:0});
>          this.tileTexture(txback10000, {x:10000,y:0});
>      
> ```
> 

---

#### tileadd(tex, port)
> to use write **this.tileadd(tex, port)**
> 
> adds a single tile to the tile list
> 
> 
> **Parameters**
> 
> {**Image | texture**} **tex** the texture that contains the image for the tile
> 
> {**Rectangle**} **port** the portion of the texture to use for the tile (ensure its the same width/height as other tiles). If ommitted then entire texture used be careful
> 
> 

---

#### tilefromMap(loc)
> to use write **this.tilefromMap(loc)**
> 
> returns the graphic tile from the main map at the given location
> 
> 
> returns {**Tile**} Tile object found or if not valid location -1 is returned
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** is a tile location to interrogate
> 
> 

---

#### tilefromMapOffset(loc, direction, distance)
> to use write **this.tilefromMapOffset(loc, direction, distance)**
> 
> returns the tile from the graphic map a tile distance away from given location
> 
> 
> returns {**Tile**} Tile object found or if not valid location -1 is returned
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** is a tile location to interrogate
> 
> {**TileDirection**} **direction** direction to look from tile given in loc
> 
> {**int**} **distance** number of tiles to move in given direction from loc
> 
> 

---

#### tilesAddFromTileset(tileset)
> to use write **this.tilesAddFromTileset(tileset)**
> 
> adds an existing tileset references to this tilemaps tiles
> 
> 
> **Parameters**
> 
> {**Tile[]**} **tileset** tiles defined in an array (can be the tiles of a tilemap  tilmapinstance.tiles or from a manual array of Tile)
> 
> 

---

#### tilesCloneFromTileset(tileset)
> to use write **this.tilesCloneFromTileset(tileset)**
> 
> clone an existing tileset (making these tiles unique for this tilemap)
> 
> 
> **Parameters**
> 
> {**Tile[]**} **tileset** tiles defined in an array (can be the tiles of a tilemap  tilmapinstance.tiles or from a manual array of Tile)
> 
> 

---

#### tilesFromTexture(texture, tilesize, data)
> to use write **this.tilesFromTexture(texture, tilesize, data)**
> 
> will process a sprite/tilesheet looking to define a list of tiles
> 
> you must specify tilesize in object format {w:32,h:32}
> 
> If the tiles/sprites do not fill the texture then make sure you say
> 
> how many rows and columns exist, if they are not specified as many whole (based on texture and tilesize)
> 
> rows and columns found in the texturewill be converted
> 
> if the tiles/sprites have a gap/padding between them specify that using xpad and ypad (if not set they will be assumed to be 0 (no gaps between))
> 
> specify control data using an anonymous class @example {rowstall:0,colswide:0,xpad:0,ypad:0}
> 
> 
> **Parameters**
> 
> {**image | texture**} **texture** the texture containing your tiles
> 
> {**{w:int,h:int}**} **tilesize** an object with w and h properties containing the widht and height of the tiles (they are all the same)
> 
> {**{rowstall:int,colswide:int,left:int,top:int,xpad:int,ypad:int}**} **data** an object containing various properties
> 
> 

---

#### tilesfromTilesheet(texture, tilesize, data)
> to use write **this.tilesfromTilesheet(texture, tilesize, data)**
> 
> will process a sprite/tilesheet looking for define a list of tiles
> 
> you must specify tilesize in object format {w:32,h:32}
> 
> If the tiles/sprites do not fill the texture then make sure you say
> 
> how many rows and columns exist, if they are not specified as many whole (based on texture and tilesize)
> 
> rows and columns found in the texturewill be converted
> 
> if the tiles/sprites have a gap/padding between them specify that using xpad and ypad (if not set they will be assumed to be 0 (no gaps between))
> 
> specify control data using an anonymous class @example {rowstall:0,colswide:0,xpad:0,ypad:0}
> 
> 
> **Parameters**
> 
> {**image | texture**} **texture** the texture containing your tiles
> 
> {**{w:int,h:int}**} **tilesize** an object with w and h properties containing the widht and height of the tiles (they are all the same)
> 
> {**{rowstall:int,colswide:int,left:int,top:int,xpad:int,ypad:int}**} **data** an object containing various properties
> 
> 

---

#### validDirectionsIllegal(loc, illegalist)
> to use write **this.validDirectionsIllegal(loc, illegalist)**
> 
> Checks the collision map for availble positions from given tile, given a set of legal tiles (those we can occupy)
> 
> returning a list of valid moves
> 
> 
> returns {**TileDirection[]**} an array of valid TileDirections // could simplify using validLocationLegal validDirectionsLegal(loc, legalist, distance){ let dir = []; let ct; if (distance === undefined){distance = 1;} ct = this.tileNumfromCollisionMapoffset(loc, TileDirection.LEFT, distance); if (legalist.includes(ct)){dir.push(TileDirection.LEFT);} ct = this.tileNumfromCollisionMapoffset(loc, TileDirection.RIGHT, distance); if (legalist.includes(ct)){dir.push(TileDirection.RIGHT);} ct = this.tileNumfromCollisionMapoffset(loc, TileDirection.UP, distance); if (legalist.includes(ct)){dir.push(TileDirection.UP);} ct = this.tileNumfromCollisionMapoffset(loc, TileDirection.DOWN, distance); if (legalist.includes(ct)){dir.push(TileDirection.DOWN);} return dir; } Checks the tile map for availble positions from given tile, given a set of illegal tiles (those we can't occupy) returning a list of valid moves
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** current tile location to attempt to move from
> 
> {**[int]**} **legalist** - an array of legal collision tile values to enable the move to be made in a direction
> 
> {**int**} **distance** from current tile location (loc) if ommited 1 tile space is used
> 
> 

---

#### validLocation(loc)
> to use write **this.validLocation(loc)**
> 
> determines if a tile location exists within the tilemap
> 
> 
> returns {**bool**} true if valid, false if not
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** current tile location to check is within the tilemap
> 
> 

---

#### validLocationLegal(loc, legalist)
> to use write **this.validLocationLegal(loc, legalist)**
> 
> Checks the collision map at given location to see if it contains a legal tiles (those we can occupy)
> 
> returning true if it does and false if not
> 
> 
> returns {**bool**} true if ot contains a legal collision tile, false if not
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** to check if it's collision content is in the legal list provided
> 
> {**[int]**} **legalist** - an array of legal collision tile values to enable the move to be made in a direction
> 
> 

---

#### wipe(time, wipedirection)
> to use write **this.wipe(time, wipedirection)**
> 
> clears tiles from tilemap , row by row or column by column, this sets all tiles to Tilemap.EMPTY (-1)
> 
> 
> **Parameters**
> 
> {**float**} **time**  time is the total time for wipe to occur
> 
> {**SlideMethod**} **wipedirection** is a SlideMethod dissapear/appear treated the samed
> 
> 

---

#### xorMapGraphic(loc, xormask, size)
> to use write **this.xorMapGraphic(loc, xormask, size)**
> 
> applies an xor mask to a tile number in the graphic map (to setup toggles)
> 
> 
> **Parameters**
> 
> {**{x:int,y:int}**} **loc** the x and y tile location to xor
> 
> {**int**} **xormask** define the mask to toggle between 2 values (place a 1at the bit position to toggle)
> 
> {**{w:int,h:int}**} **size** of region to xor, tiles wide and high from the given location, can be ommited for a single tile
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
