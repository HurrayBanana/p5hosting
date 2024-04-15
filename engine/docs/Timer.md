> ### class Timer extends Event
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

> #### #mysprite
> holds reference to the sprite being manipulated by the timer @type {Sprite}
> 
> 

---

> #### #oninterval
> holds time interval for on time during flashing @type {float}
> 
> 

---

> #### #offinterval
> holds time interval for off time during flashing  @type {float}
> 
> 

---

> #### #hidden
> holds visibility state of the sprite @type {bool}
> 
> 

---

> #### #phase
> holds phase of timing for multi step actions @type {Phase}
> 
> 

---

> #### #impulse
> holds force to apply during impulse timers @type {vector3}
> 
> 

---

> #### getter phase
> get the current phase of timer action, you can use this during callbacks
> 
> 
> returns {**Phase**}
> 
> 

---

> #### constructor(sprite)
> Constructs and new sprite timer
> 
> 
> **Parameters**
> 
> {**Sprite**} **sprite** the sprite associated with the sprite timers
> 
> 

---

> #### cleanup()
> removes sprite reference when timer removed, override this if you create an inherited timer that adds more resources
> 
> 

---

> #### off(display)
> disable the timer, choose whether to display or hide the sprite
> 
> 
> **Parameters**
> 
> {**bool**} **display** if true sprite will be shown, false if not (important if you have been flashing a sprite)
> 
> 

---

> #### flash(onduration, offduration)
> flashes the sprite on and off, duration in seconds (or fraction of)
> 
> 
> **Parameters**
> 
> {**float**} **onduration** number of seconds or fraction of
> 
> {**float**} **offduration** number of seconds or fraction of
> 
> 

---

> #### flashStopafter(stopAfter, onduration, offduration, callback)
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
> {**{callback:method|function,instance:object}**} **callback** the code to call when the sprite stops flashing
> 
> 

---

> #### flashKillafter(killAfter, onduration, offduration)
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

> #### flashStartafter(startAfter, onduration, offduration, callback)
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
> {**{callback:method|function,instance:object}**} **callback** the code to call when the sprite starts flashing
> 
> 

---

> #### flashStartafterKillafter(startAfter, killAfter, onduration, offduration, callback)
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
> {**{callback:method|function,instance:object}**} **callback** the code to call when the sprite starts flashing
> 
> 

---

> #### flashStartafterStopafter(startAfter, stopAfter, onduration, offduration, callback)
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
> {**{callback:method|function,instance:object}**} **callback** the code to call when the sprite starts flashing and again when it stops
> 
> 

---

> #### showafter(showAfter, callback)
> shows the sprite after a period of time has passed
> 
> 
> **Parameters**
> 
> {**float**} **showAfter** number of seconds to wait before showing
> 
> {**{callback:method|function,instance:object}**} **callback** the code to call when the sprite is shown
> 
> 

---

> #### hideafter(hideAfter, callback)
> Hides the sprite after a period of time has passed
> 
> 
> **Parameters**
> 
> {**float**} **hideAfter** number of seconds to wait before hiding
> 
> {**{callback:method|function,instance:object}**} **callback** the code to call when sprite is hidden
> 
> 

---

> #### showafterKillafter(showAfter, killAfter, callback)
> Shows a sprite after a period of time then kills it after another period of time
> 
> 
> **Parameters**
> 
> {**float**} **showAfter** time to wait until sprite displayed
> 
> {**float**} **killAfter** time to kill sprite after displaying
> 
> {**{callback:method|function,instance:object}**} **callback** the code to call when the sprite is shown
> 
> 

---

> #### showafterFlash(showAfter, onduration, offduration, callback)
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
> {**{callback:method|function,instance:object}**} **callback** the code to call when the sprite starts flashing
> 
> ```js
> example
>      
> ```
> 

---

> #### killafter(killtime)
> kills a sprite after a period of time
> 
> 
> **Parameters**
> 
> {**float**} **killtime** timer period
> 
> 

---

> #### impulse(stopAfter, force, callback)
> applies a force to a sprite for a period of time
> 
> 
> **Parameters**
> 
> {**float**} **stopAfter** timer period to apply the force
> 
> {**vector3**} **force** 
> 
> {**{callback:method|function,instance:object}**} **callback** the code to call when the event occurs use
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

> #### update()
> performs updates for this sprite timer
> 
> 

---

> #### #sortvisibility()
> determines whether sprite should be shown or no during flashing actions
> 
> 

---

