engine created by Hurray Banana &copy;2023-2024

this can be found in file **track.js**
## class Timer extends Event
> implements sprite specific timers (you can only have one)
> 
> If you need more sprite specific ones, create another timer,
> 
> but make sure you create and update method that calls the timers update method
> 
> I may refactor this to be part of a eventmanager class so all timer subsystems will use a common structure
> 
> 

---

## Constructor
> #### constructor(sprite)
> to use write **new Timer(sprite)**
> 
> Constructs and new sprite timer
> 
> 
> **Parameters**
> 
> {**Sprite**} **sprite** the sprite associated with the sprite timers
> 
> 

---

## properties
## getters and setters
#### phase [getter]
> to use write **this.phase**
> 
> get the current phase of timer action, you can use this during callbacks
> 
> 
> returns {**Phase**}
> 
> 

---

## Methods
#### cleanup()
> to use write **this.cleanup()**
> 
> removes sprite reference when timer removed, override this if you create an inherited timer that adds more resources
> 
> 

---

#### flash(onduration, offduration)
> to use write **this.flash(onduration, offduration)**
> 
> flashes the sprite on and off, duration in seconds (or fraction of)
> 
> 
> **Parameters**
> 
> {**float**} **onduration** number of seconds or fraction of
> 
> {**float**} **offduration** number of seconds or fraction of slightly longer on than off looks best
> 
> 

---

#### flashKillafter(killAfter, onduration, offduration)
> to use write **this.flashKillafter(killAfter, onduration, offduration)**
> 
> flashes a sprite and then kills it after a period of time
> 
> 
> **Parameters**
> 
> {**float**} **killAfter** seconds after which sprite should be killed off
> 
> {**float**} **onduration** number of seconds or fraction of
> 
> {**float**} **offduration** number of seconds or fraction of
> 
> 

---

#### flashStartafter(startAfter, onduration, offduration, callback)
> to use write **this.flashStartafter(startAfter, onduration, offduration, callback)**
> 
> a sprite to start flashing after a certain period of time
> 
> 
> **Parameters**
> 
> {**float**} **startAfter** how long before flashing starts
> 
> {**float**} **onduration** number of seconds or fraction of
> 
> {**float**} **offduration** number of seconds or fraction of
> 
> {**{callback:method|function,instance:object}**} **callback** the code to call when the sprite starts flashing Engine.makeCallback() to create your callback
> 
> 

---

#### flashStartafterKillafter(startAfter, killAfter, onduration, offduration, callback)
> to use write **this.flashStartafterKillafter(startAfter, killAfter, onduration, offduration, callback)**
> 
> Flashes a sprite after a certain period of time and then kills it after another time period has ended
> 
> 
> **Parameters**
> 
> {**float**} **killAfter** seconds after which sprite should be killed off
> 
> {**float**} **startAfter** how long before flashing starts
> 
> {**float**} **onduration** number of seconds or fraction of
> 
> {**float**} **offduration** number of seconds or fraction of
> 
> {**{callback:method|function,instance:object}**} **callback** the code to call when the sprite starts flashing Engine.makeCallback() to create your callback
> 
> 

---

#### flashStartafterStopafter(startAfter, stopAfter, onduration, offduration, callback)
> to use write **this.flashStartafterStopafter(startAfter, stopAfter, onduration, offduration, callback)**
> 
> a visible sprite starts to flash after a period of time, it then stops flashing after a further period of time
> 
> 
> **Parameters**
> 
> {**float**} **startAfter** period of time to start flasher
> 
> {**float**} **stopAfter** period of time for flashing to continue before it stops
> 
> {**float**} **onduration** number of seconds or fraction of
> 
> {**float**} **offduration** number of seconds or fraction of
> 
> {**{callback:method|function,instance:object}**} **callback** the code to call when the sprite starts flashing and again when it stops Engine.makeCallback() to create your callback
> 
> 

---

#### flashStopafter(stopAfter, onduration, offduration, callback)
> to use write **this.flashStopafter(stopAfter, onduration, offduration, callback)**
> 
> flashes and sprite and then stops flashing after a period of time
> 
> 
> **Parameters**
> 
> {**float**} **stopAfter** time to stop flashing in seconds
> 
> {**float**} **onduration** number of seconds or fraction of
> 
> {**float**} **offduration** number of seconds or fraction of
> 
> {**{callback:method|function,instance:object}**} **callback** the code to call when the sprite stops flashing Engine.makeCallback() to create your callback
> 
> 

---

#### hideafter(hideAfter, callback)
> to use write **this.hideafter(hideAfter, callback)**
> 
> Hides the sprite after a period of time has passed
> 
> 
> **Parameters**
> 
> {**float**} **hideAfter** number of seconds to wait before hiding
> 
> {**{callback:method|function,instance:object}**} **callback** the code to call when sprite is hidden Engine.makeCallback() to create your callback
> 
> 

---

#### impulse(stopAfter, force, callback)
> to use write **this.impulse(stopAfter, force, callback)**
> 
> applies a force to a sprite for a period of time
> 
> 
> **Parameters**
> 
> {**float**} **stopAfter** timer period to apply the force
> 
> {**vector3**} **force** 
> 
> {**{callback:method|function,instance:object}**} **callback** the code to call when the event occurs use Engine.makeCallback() to create your callback
> 
> ```js
> example
>       //call the increaseDifficulty method every 20 seconds
>       Engine.eventM.event(203, Engine.makeCallback(this.increaseDifficulty, this));
>       to stop calling the method/function use the events remove() method
>      
> ```
> 

---

#### killafter(killtime)
> to use write **this.killafter(killtime)**
> 
> kills a sprite after a period of time
> 
> 
> **Parameters**
> 
> {**float**} **killtime** timer period set a callbackFuneral or override the Kill() method of your sprite if you want to know when it's killed
> 
> 

---

#### off(display)
> to use write **this.off(display)**
> 
> disable the timer, choose whether to display or hide the sprite
> 
> 
> **Parameters**
> 
> {**bool**} **display** if true sprite will be shown, false if not (important if you have been flashing a sprite)
> 
> 

---

#### showafter(showAfter, callback)
> to use write **this.showafter(showAfter, callback)**
> 
> shows the sprite after a period of time has passed
> 
> 
> **Parameters**
> 
> {**float**} **showAfter** number of seconds to wait before showing
> 
> {**{callback:method|function,instance:object}**} **callback** the code to call when the sprite is shown Engine.makeCallback() to create your callback
> 
> 

---

#### showafterFlash(showAfter, onduration, offduration, callback)
> to use write **this.showafterFlash(showAfter, onduration, offduration, callback)**
> 
> shows a sprite after a period of time, flashing as it becomes visible
> 
> 
> **Parameters**
> 
> {**float**} **showAfter** timer period to wait before showing the flashing sprite
> 
> {**float**} **onduration** number of seconds or fraction of
> 
> {**float**} **offduration** number of seconds or fraction of
> 
> {**{callback:method|function,instance:object}**} **callback** the code to call when the sprite starts flashing Engine.makeCallback() to create your callback
> 
> ```js
> example
>      
> ```
> 

---

#### showafterKillafter(showAfter, killAfter, callback)
> to use write **this.showafterKillafter(showAfter, killAfter, callback)**
> 
> Shows a sprite after a period of time then kills it after another period of time
> 
> 
> **Parameters**
> 
> {**float**} **showAfter** time to wait until sprite displayed
> 
> {**float**} **killAfter** time to kill sprite after displaying
> 
> {**{callback:method|function,instance:object}**} **callback** the code to call when the sprite is shown Engine.makeCallback() to create your callback
> 
> 

---

#### update()
> to use write **this.update()**
> 
> performs updates for this sprite timer
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
