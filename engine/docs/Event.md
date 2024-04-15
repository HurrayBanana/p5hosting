> ### class Event
> base functionality for general timing events
> 
> 

---

> #### name
> debugging name for displaying timers
> 
> 
> {**string**}
> 
> 

---

> #### #elapsedTime
> holds time elapsed during the current interval @type {float}
> 
> 

---

> #### #startafterinterval
> holds the interval for either the start of a timing process or the activation of a timer or event @type {float}
> 
> 

---

> #### #stopafterinterval
> holds the action stopping interval @type {float}
> 
> 

---

> #### #actionTime
> holds an event interval used mainly in visibility testing @type {float}
> 
> 

---

> #### #action
> holds the current action of the event/timer @type {EventAction}
> 
> 

---

> #### #callback = null
> holds the callback executed when the event/timer meets its interval @type {callback:method|function,instance:object}
> 
> 

---

> #### getter elapsedTime
> gets the timer period that elapsed for this Event/Timer so far
> 
> 
> returns {**float**}
> 
> 

---

> #### setter elapsedTime
> sets the elpasedTime for the Event/Timer you should'nt need to use this unless you to set a specific starting point rather then
> 
> zeroing which reset() does
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

> #### getter elapsedReset
> returns true if the timer interval has elapsed and then resets it to zero
> 
> use elapsedResetAccrued if you want to accurately take account of fractional time span accruel
> 
> returns false if the timer interval has not elapsed
> 
> Use this with timers to control auto fire or key delay, these are particularly useful
> 
> for your own custom timers that you update yourself
> 
> 
> returns {**bool**} has it elapsed or not
> 
> ```js
> example
>       //setup a custom timer in the sprites constructor for auto fire/shoot interval restriction
>       this.shoottimer = new Timer(this)
>       this.shoottimer.interval(0.25);
>       
>       //in an update method add this sort of code to check for keypress and timer elapsed
>       if (keyIsDown(this.kshoot) && this.shoottimer.elapsedReset){
>            this.shoot();
>       }
> ```
> 

---

> #### getter elapsedResetAccrued
> Checks the timer to see if it has elapsed, if it has then the interval time is substracted from the elapsed time
> 
> this factors in time differences between updates and . Use elpasedReset if you just want the elapsed time to zero (key delays)
> 
> 
> returns {**bool**} has it elapsed or not
> 
> 

---

> #### getter startafterinterval
> gets the basic interval of a timer or the start phase interval or a timer
> 
> 
> returns {**float**}
> 
> 

---

> #### setter startafterinterval
> sets the basic interval of a timer or the start phase interval or a timer
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

> #### getter stopafterinterval
> gets the interval for an action stopping
> 
> 
> returns {**float**}
> 
> 

---

> #### setter stopafterinterval
> sets the interval for an action stopping
> 
> 
> **Parameters**
> 
> {**float**} **value** 
> 
> 

---

> #### getter actionTime
> internal timing information for checking visiblility
> 
> 
> returns {**float**}
> 
> 

---

> #### setter actionTime
> internal timing information for checking visiblility, do not modify
> 
> 
> returns {**float**}
> 
> 

---

> #### getter action
> gets the active mode of the event/timer
> 
> 
> returns {**EventAction**}
> 
> 

---

> #### setter action
> sets the event/timers action mode, this is set when you pick how the timer should operate, do not change directly
> 
> 
> **Parameters**
> 
> {**EventAction**} **value** 
> 
> 

---

> #### getter active
> true if a timer is active
> 
> 
> returns {**bool**}
> 
> 

---

> #### getter callback
> retrieves the current callback (if this has not been set it will be null)
> 
> it will be in the form of object properties
> 
> 
> returns {**{callback:method|function,instance:object**}
> 
> ```js
> example
>       // two propeties callback and instance
>       let callstuff = this.timer.callback;
>       if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
> ```
> 

---

> #### setter callback
> sets (or changes) the callback handler called when animation states reach an end point
> 
> value must be an object with 2 properties
> 
> ```js
> example
>       // animationchanged is a method of your inherited sprite class
>       this.callback = {callback:this.myactions,instance:this};
>       // or use the Engine.makeCallback() method
>       this.callback = Engine.makeCallback(this.myactions, this);
>      
> ```
> 

---

> #### getter allowOverwrite
> If a event/timer is set repeatidly it will continually reset. In my cases this would be undeserable
> 
> but in certain circumstances such as mouse over effects that use a timer to revert an animation frame, you might want to keep
> 
> restarting the timer while the mouse is over the sprite. it removes the need for more complex logic to deal with this case
> 
> gets the status of timer overwrites, default is false, rejecting multiple setting of timers
> 
> 
> returns {**bool**}
> 
> 

---

> #### setter allowOverwrite
> sets the response to identical timer settings for active timers, true means allow it to be overwritten (effectively reset), flase means
> 
> reject
> 
> 
> **Parameters**
> 
> {**bool**} **value** 
> 
> 

---

> #### constructor(name)
> 
> **Parameters**
> 
> {**string**} **name** debug display for event
> 
> 

---

> #### cleanup()
> performs any cleanup for the time, you might need this if you create a custom event or timer that
> 
> consumes resources that it needs to de-reference. Create an overloaded method in your inherited class
> 
> It will be called automatically when the Event/Timer is removed
> 
> 

---

> #### remove()
> requests removeall of this event
> 
> 

---

> #### reset()
> resets thecurrent timer (if active)
> 
> 

---

> #### overwriteEnable()
> allows the resetting of a timer (time starts again)
> 
> this might be desirable if you are doing a mouse over effect, where a rendering resets to not over
> 
> view after 0.2 seconds, but you keep restarting the timer while you are over the sprite
> 
> default behaviour is false (ignore duplicates)
> 
> 

---

> #### overwriteDisable()
> turns off overwrite of duplicate timers
> 
> default behaviour is false (ignore duplicates)
> 
> 

---

> #### interval(time)
> Sets the time interval for the Event, you only need to do this if you are creating a timer for your own purposes such a key delay timer
> 
> which you used ElapsedReset to check for the interval elapsing.
> 
> If you want to call a method or function after a time interval then use timer.eventonce()
> 
> 
> **Parameters**
> 
> {**float**} **time** 
> 
> 

---

> #### eventonce(callAfter, callback)
> Delays calling a method or function until after a period of time
> 
> 
> **Parameters**
> 
> {**float**} **callAfter** time to wait before calling method/function
> 
> {**{callback:method|function,instance:object}**} **callback** the code to call when the event occurs use
> 
> ```js
> example
>       //call the startgame method after 3 seconds
>       Engine.eventM.eventonce(3, Engine.makeCallback(this.startgame, this));
>      
> ```
> 

---

> #### event(interval, callback)
> creates a periodic timer which continually calls a given method/function
> 
> 
> **Parameters**
> 
> {**float**} **interval** time to wait before calling method/function
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

> #### eventStopafter(interval, stopAfter, callback)
> creates a periodic timer which continually calls a given method/function until a specified time is reached
> 
> 
> **Parameters**
> 
> {**float**} **interval** time to wait before calling method/function
> 
> {**float**} **stopAfter** period of time to wait before stopping the event
> 
> {**{callback:method|function,instance:object}**} **callback** the code to call when the event occurs use
> 
> ```js
> example
>       //call the spawnEnemy method every 1second for 20 seconds
>       Engine.eventM.eventStopafter(1,20, Engine.makeCallback(this.spawnEnemy, this));
>       to stop calling the method/function use the events remove() method
>       to stop calling the method/function use the events remove() method
>      
> ```
> 

---

> #### update()
> updates timer checking for action responses
> 
> 

---

