engine created by Hurray Banana &copy;2023-2024

this can be found in file **track.js**
## class TilemapManager
>  organises and manages active tilemaps
> 
> 

---

## Constructor
> #### constructor()
> to use write **new TilemapManager()**
> 
> creates tilemap manager
> 
> 

---

## properties
## getters and setters
#### debugdisplay [getter]
> to use write **this.debugdisplay**
> 
> provides some debug information about managed tilemaps
> 
> 

---

## Methods
#### add(tilemap)
> to use write **this.add(tilemap)**
> 
> adds a tilemap to the manage, this ensures it's updated and drawn
> 
> 
> **Parameters**
> 
> {**Tilemap**} **tilemap** tilemap reference to manage to remove a tilemap just set it's remove property to false, make sure no objects are making reference to the tilemap after you have removed it as it's internal components will be destroyed
> 
> 

---

#### draw()
> to use write **this.draw()**
> 
> draws the managed tilemaps
> 
> 

---

#### update()
> to use write **this.update()**
> 
> updates the managed tilemaps
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
