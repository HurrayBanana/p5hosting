engine created by Hurray Banana &copy;2023-2024

this can be found in file **track.js**
## class History
>  provides visual snapshot functionality for sprites
> 
> 

---

## Constructor
> #### constructor(mysprite)
> to use write **new History(mysprite)**
> 
> builds the history recording system for a sprite
> 
> 
> **Parameters**
> 
> {**Sprite**} **mysprite** the sprite to record history for
> 
> 

---

## properties
#### fadeAlpha
> default value **true**
> 
> to use write **this.fadeAlpha**
> 
> if true then history trail will fade over its distance,
> 
> if false no fading will be applied and clampAlpha value will be applied to all snaps
> 
> 
> type {**bool**}
> 
> 

---

#### layer
> default value **Engine.layer(0)**
> 
> to use write **this.layer**
> 
> sets the layer to draw history on, by default this is layer 0, the sprite first layer rendered
> 
> ```js
> example
> this.history.layer = Engine.layer(2);
>     
> ```
> 

---

#### sampleFreq
> to use write **this.sampleFreq**
> 
> specifies how to sample history in seconds, don't set this directly use show()
> 
> 
> type {**float**} maximum would be 0.0167 (every single frame) 2 would be once every 2 seconds (or every 120 frames)
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

#### scale
> default value **0**
> 
> to use write **this.scale**
> 
> scale factor to apply to history rendering
> 
> this value is the factor by which to increase/decrease the scale of history trails.
> 
> default value is 0  no change in size
> 
> 
> type {**float**}
> 
> ```js
> example
>       this.history.scale = 1; //increase the size by 100%
>       this.history.scale = -0.5f; //would decrease the size by 50%,
> ```
> 

---

## getters and setters
#### clampAlpha [getter]
> to use write **this.clampAlpha**
> 
> Sets the maximum alpha for the history trail, if fadeAlpha is false then this is the alpha for the entire trail
> 
> depending on how often you are snapping this may need to be quite low as history will draw on top of itself
> 
> 
> returns {**float**}
> 
> 

---

#### clampAlpha [setter]
> to use write **this.clampAlpha = value**
> 
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

#### length [getter]
> to use write **this.length**
> 
> 
> returns {**int**} current length of the snap history
> 
> 

---

#### renderfrom [getter]
> to use write **this.renderfrom**
> 
> specifies the start position to draw from, defaults to 0, but allows us to skip the ones closest to the sprite so we can leave a grap for disconnected trail effects
> 
> 
> returns {**int**} current value
> 
> 

---

#### renderfrom [setter]
> to use write **this.renderfrom = value**
> 
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

## Methods
#### draw()
> to use write **this.draw()**
> 
> renders the history recorded here
> 
> 

---

#### show(rate, depth)
> to use write **this.show(rate, depth)**
> 
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

#### update()
> to use write **this.update()**
> 
> snaps if timer required current sprite settings
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
