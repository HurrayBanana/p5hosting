> ### class History
> @classdesc provides visual snapshot functionality for sprites
> 
> 

---

> #### #snaps = []
> holds each snap of the sprites data in time @type {Historysnap[]}
> 
> 

---

> #### #start = 0
> start position to render history from defaults to 0 (the newest snap position) this is because history is created as a circular queue @type {int}
> 
> 

---

> #### #length = 0
> number of  current snaps @type {int}
> 
> 

---

> #### #end = 0
> marks current end of history list as this is operas a circular queue @type {int}
> 
> 

---

> #### #renderfrom = 0
> specifies the start position to draw from, defaults to 0, but allows us to skip the ones closest to the sprite so we can leave a grap for disconnected trail effects
> 
> 

---

> #### #elapsed
> specifies the timer elapsed so for working towards the interval for history snapping
> 
> 

---

> #### sampleFreq
> specifies how to sample history in seconds, don't set this directly use show()
> 
> 
> {**float**} maximum would be 0.0167 (every single frame) 2 would be once every 2 seconds (or every 120 frames)
> 
> ```js
> example
>       this.history = new History(this); // create the history object
>       this.history.show(0.05,90); //snap every 50 milliseconds, take 90 samples
>       this.history.renderfrom = 10; //skip the first ten snaps
>       this.history.scale = -0.5; // reduce the size by 50%
>       this.history.clampAlpha = 0.1;//don't allow alpha to be higher than 10%
>     
> ```
> 

---

> #### scale = 0
> scale factor to apply to history rendering
> 
> this value is the factor by which to increase/decrease the scale of history trails.
> 
> default value is 0  no change in size
> 
> 
> {**float**}
> 
> ```js
> example
>       this.history.scale = 1; //increase the size by 100%
>       this.history.scale = -0.5f; //would decrease the size by 50%,
> ```
> 

---

> #### fadeAlpha = true
> if true then history trail will fade over its distance,
> 
> if false no fading will be applied and clampAlpha value will be applied to all snaps
> 
> 
> {**bool**}
> 
> 

---

> #### #clampAlpha = 1
> holds maximum allowed alpha value in history, default 1 @type {float}
> 
> 

---

> #### layer = Engine.layer(0)
> sets the layer to draw history on, by default this is layer 0, the sprite first layer rendered
> 
> ```js
> example
>     
> ```
> 

---

> #### #mysprite 
> reference to th esprite we are snapping
> 
> 

---

> #### getter length
> 
> returns {**int**} current length of the snap history
> 
> 

---

> #### getter renderfrom
> specifies the start position to draw from, defaults to 0, but allows us to skip the ones closest to the sprite so we can leave a grap for disconnected trail effects
> 
> 
> returns {**int**} current value
> 
> 

---

> #### setter renderfrom
> specifies the position to start rendering from.
> 
> this needs to be within the limit of the history length
> 
> 
> **Parameters**
> 
> {**int**} **value** allows us to skip the ones closest to the sprite so we can leave a grap for disconnected trail effects
> 
> ```js
> example
>       this.history = new History(this); // create the history object
>       this.history.show(0.05,90); //snap every 50 milliseconds, take 90 samples
>       this.history.renderfrom = 10; //skip the first ten snaps
>       this.history.scale = -0.5; // reduce the size by 50%
>       this.history.clampAlpha = 0.1;//don't allow alha to be higher than 10%
>     
> ```
> 

---

> #### getter clampAlpha
> Sets the maximum alpha for the history trail, if fadeAlpha is false then this is the alpha for the entire trail
> 
> depending on how often you are snapping this may need to be quite low as history will draw on top of itself
> 
> 
> returns {**float**}
> 
> 

---

> #### setter clampAlpha
> Sets the maximum alpha for the history trail, if fadeAlpha is false then this is the alpha for the entire trail
> 
> 
> **Parameters**
> 
> {**float**} **value** new value between 0 and 1
> 
> ```js
> example
>       this.history = new History(this); // create the history object
>       this.history.show(0.05,90); //snap every 50 milliseconds, take 90 samples
>       this.history.renderfrom = 10; //skip the first ten snaps
>       this.history.scale = -0.5; // reduce the size by 50%
>       this.history.clampAlpha = 0.1;//don't allow alha to be higher than 10%
>     
> ```
> 

---

> #### constructor(mysprite)
> builds the history recording system for a sprite
> 
> 
> **Parameters**
> 
> {**Sprite**} **mysprite** the sprite to record history for
> 
> 

---

> #### show(rate, depth)
> turns on history for this sprite
> 
> 
> **Parameters**
> 
> {**int**} **depth** how many samples to record
> 
> {**float**} **rate** how often (in seconds) to take a positional snapshot
> 
> ```js
> example
>       this.history = new History(this); // create the history object
>       this.history.show(0.05,90); //snap every 50 milliseconds, take 90 samples
>       this.history.renderfrom = 10; //skip the first ten snaps
>       this.history.scale = -0.5; // reduce the size by 50%
>       this.history.clampAlpha = 0.1;//don't allow alha to be higher than 10%
> ```
> 

---

> #### update()
> snaps if timer required current sprite settings
> 
> 

---

> #### draw()
> renders the history recorded here
> 
> 

---

