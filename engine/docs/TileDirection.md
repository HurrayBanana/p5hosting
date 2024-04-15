> ### class TileDirection
> @classdesc values to use for stating directions in tilemaps for various tilemap navigation and interrogation methods
> 
> 

---

> #### static LEFT = 0x1
> direction left @type {int}
> 
> 

---

> #### static UP = 0x2
> direction up  @type {int}
> 
> 

---

> #### static RIGHT = 0x4
> direction right  @type {int}
> 
> 

---

> #### static DOWN = 0x8
> direction down  @type {int}
> 
> 

---

> #### static NONE = 0b0
> no direction  @type {int}
> 
> 

---

> #### static ALL_ORDINALS = [TileDirection.LEFT, TileDirection.RIGHT, TileDirection.UP, TileDirection.DOWN]
> 
> {**int[]**} array containing each ordinal direction
> 
> 

---

> #### static VERTICALS = [TileDirection.UP, TileDirection.DOWN]
> 
> {**int[]**} array containing each vertical direction
> 
> 

---

> #### static HORIZONTALS = [TileDirection.LEFT, TileDirection.RIGHT]
> 
> {**int[]**} array containing each horizontal direction
> 
> 

---

> #### static str = ["none","left","up",,"right",,,,"down"]
> debugging string @type {string}
> 
> 

---

> #### static directionmap = [,0,1,,2,,,,3]
> mapping of WNES to indexes 0,1,2,3 used by highlightdirections
> 
> 

---

> #### static asStr(direction)
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

> #### static strlist(di)
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

