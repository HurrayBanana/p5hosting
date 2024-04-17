engine created by Hurray Banana &copy;2023-2024
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
#### #timers
> default value **null**
> 
> to use write **this.#timers**
> 
> list of actively managed Events
> 
> 

---

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
