engine created by Hurray Banana &copy;2023-2024

this can be found in file **tilemap.js**
## class TileDirection
>  values to use for stating directions in tilemaps for various tilemap navigation and interrogation methods
> 
> 

---

## properties
####  ALL_ORDINALS [static]
> default value **[TileDirection.LEFT, TileDirection.RIGHT, TileDirection.UP, TileDirection.DOWN]**
> 
> to use write **TileDirection.ALL_ORDINALS**
> 
> 
> type {**int[]**} array containing each ordinal direction
> 
> 

---

####  DOWN [static]
> default value **0x8**
> 
> to use write **TileDirection.DOWN**
> 
> direction down  @type {int}
> 
> 

---

####  HORIZONTALS [static]
> default value **[TileDirection.LEFT, TileDirection.RIGHT]**
> 
> to use write **TileDirection.HORIZONTALS**
> 
> 
> type {**int[]**} array containing each horizontal direction
> 
> 

---

####  LEFT [static]
> default value **0x1**
> 
> to use write **TileDirection.LEFT**
> 
> direction left @type {int}
> 
> 

---

####  NONE [static]
> default value **0b0**
> 
> to use write **TileDirection.NONE**
> 
> no direction  @type {int}
> 
> 

---

####  RIGHT [static]
> default value **0x4**
> 
> to use write **TileDirection.RIGHT**
> 
> direction right  @type {int}
> 
> 

---

####  UP [static]
> default value **0x2**
> 
> to use write **TileDirection.UP**
> 
> direction up  @type {int}
> 
> 

---

####  VERTICALS [static]
> default value **[TileDirection.UP, TileDirection.DOWN]**
> 
> to use write **TileDirection.VERTICALS**
> 
> 
> type {**int[]**} array containing each vertical direction
> 
> 

---

####  directionmap [static]
> default value **[,0,1,,2,,,,3]**
> 
> to use write **TileDirection.directionmap**
> 
> mapping of WNES to indexes 0,1,2,3 used by highlightdirections
> 
> 

---

####  str [static]
> default value **["none","left","up",,"right",,,,"down"]**
> 
> to use write **TileDirection.str**
> 
> debugging string @type {string}
> 
> 

---

## Methods
####  asStr(direction) [static]
> to use write **TileDirection.asStr(direction)**
> 
> 
> returns {**string**} string representation of a given direction
> 
> 
> **Parameters**
> 
> {**TileDirection**} **direction** to get the representation of
> 
> 

---

####  strlist(di) [static]
> to use write **TileDirection.strlist(di)**
> 
> produces a string of directions based on the the array
> 
> 
> returns {**string**} the visualisation of the directions given
> 
> 
> **Parameters**
> 
> {**TileDirection[]**} **di** array of directions to get visualisations of
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
