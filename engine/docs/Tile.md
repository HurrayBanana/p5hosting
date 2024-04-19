engine created by Hurray Banana &copy;2023-2024
## class Tile extends Rawtile
>  defines a single tile in a tilemap with all the extra support needed for tiles
> 
> 

---

## Constructor
> #### constructor(texture, portion, hmap, vmap)
> to use write **new Tile(texture, portion, hmap, vmap)**
> 
> creates a new tile
> 
> 
> **Parameters**
> 
> {**texture**} **texture** texture with the image for tile
> 
> {**Rectangle**} **portion** portion of texture to show, if using whole texture then don't suppy a value
> 
> {**int[]**} **hmap** a horizontal height map for the tile, leave undefined if not wanted
> 
> {**int[]**} **vmap** a vertical height map for the tile, leave undefined if not wanted
> 
> 

---

## properties
#### hmap
> default value **null**
> 
> to use write **this.hmap**
> 
> 
> type {**Int32Array[]**} holds height of tile horizontally from left to right full tiles will have a hmap containing all zeros
> 
> 

---

#### vmap
> default value **null**
> 
> to use write **this.vmap**
> 
> 
> type {**Int32Array[]**} holds the width of the tile vertically from left full tiles will have a vmap containing all zeros
> 
> 

---

## Methods
#### distancebottom(x)
> to use write **this.distancebottom(x)**
> 
> 
> returns {**int**} gets the height of the tile from it's bottom edge based on the offset given use when walking/running or falling
> 
> 
> **Parameters**
> 
> {**int**} **x** offset from left hand edge tile
> 
> 

---

#### distanceleft(y)
> to use write **this.distanceleft(y)**
> 
> 
> returns {**int**} gets distance from left edge of tile
> 
> 
> **Parameters**
> 
> {**int**} **y** offset from top edge of tile
> 
> 

---

#### distanceright(y)
> to use write **this.distanceright(y)**
> 
> 
> returns {**int**} gets distance from right edge of tile
> 
> 
> **Parameters**
> 
> {**int**} **y** offset from top edge of tile
> 
> 

---

#### distancetop(x)
> to use write **this.distancetop(x)**
> 
> 
> returns {**int**} gets distance of tile from its top edge
> 
> 
> **Parameters**
> 
> {**int**} **x** offset from left hand edge tile
> 
> 

---

#### setHorizontalmap(l, r)
> to use write **this.setHorizontalmap(l, r)**
> 
> specifies the distance offset of the tile edges from the top of the tile.
> 
> The heights are interpolated between the left and right values.
> 
> defaults to 0,0
> 
> If you want to produce a jagged tile then specifiy the full array of values yourself (array must be same length as tile width)
> 
> 
> **Parameters**
> 
> {**int**} **l** distance from top of tile at left edge
> 
> {**int**} **r** distance from top of tile at right edge
> 
> 

---

#### setVerticalmap(t, b)
> to use write **this.setVerticalmap(t, b)**
> 
> specifies the distance offset of the tile edges from the left of the tile.
> 
> The widths are interpolated between the top and bottom values.
> 
> defaults to 0,0
> 
> If you want to produce a jagged tile then specifiy the full array of values yourself (array must be same length as tile height)
> 
> 
> **Parameters**
> 
> {**int**} **t** distance from left of tile at top edge
> 
> {**int**} **b** distance from left of tile at bottom edge
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
