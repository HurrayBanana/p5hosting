engine created by Hurray Banana &copy;2023-2024

this can be found in file **track.js**
## class EventManager
> 
> 
> provides central timing update support for both
> 
> stock events (Event) and sprite specific events (Timer)
> 
> 

---

## Constructor
> #### constructor()
> to use write **new EventManager()**
> 
> initialises the event manager
> 
> 

---

## properties
## getters and setters
#### activeLite [getter]
> to use write **this.activeLite**
> 
> gets a concise list of all actively managed timers and events
> 
> 
> returns {**string[]**} an array of timer data
> 
> 

---

#### activeLiteData [getter]
> to use write **this.activeLiteData**
> 
> gets a list of all actively managed timers and events including details of elapsed time and intervals set
> 
> 
> returns {**string[]**} an array of timer data
> 
> 

---

## Methods
#### add(timer)
> to use write **this.add(timer)**
> 
> adds given timer to be managed
> 
> 
> **Parameters**
> 
> {**Timer|Event**} **timer** 
> 
> 

---

#### delaycall(callAfter, callback)
> to use write **this.delaycall(callAfter, callback)**
> 
> Delays calling a method or function until after a period of time
> 
> 
> **Parameters**
> 
> {**float**} **callAfter** time to wait before calling method/function
> 
> {**{callback:method|function,instance:object}**} **callback** the code to call when the event occurs use Engine.makeCallback() to create your callback
> 
> ```js
> example
>       //call the startgame method after 3 seconds
>       Engine.eventM.delaycall(3, Engine.makeCallback(this.startgame, this));
>       
>       // this is the equivalent of creating an event and calling the eventOnce method, but doen't require you
>       // to create an Event object
>      
> ```
> 

---

#### remove(timer)
> to use write **this.remove(timer)**
> 
> Removes a specific timer from the eventmanager
> 
> 
> **Parameters**
> 
> {**Timer|Event**} **timer** 
> 
> 

---

#### removeallBut(timer)
> to use write **this.removeallBut(timer)**
> 
> removes all timers except for the given one, this may need to be active after some mode as ended
> 
> 
> **Parameters**
> 
> {**Timer|Event**} **timer** 
> 
> 

---

#### twodp(val)
> to use write **this.twodp(val)**
> 
> Specific version of fixing a float to 2dp with 0 front padding, used by the event debugger
> 
> 
> returns {**string**} a padded string
> 
> 
> **Parameters**
> 
> {**float**} **val** 
> 
> 

---

#### update()
> to use write **this.update()**
> 
> performs the update of all managed timers and events
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
