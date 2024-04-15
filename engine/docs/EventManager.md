> ### class EventManager
> 
> 
> provides central timing update support for both
> 
> stock events (Event) and sprite specific events (Timer)
> 
> 

---

> #### #timers = null
> list of actively managed Events
> 
> 

---

> #### getter activeLite
> gets a concise list of all actively managed timers and events
> 
> 
> returns {**string[]**} an array of timer data
> 
> 

---

> #### getter activeLiteData
> gets a list of all actively managed timers and events including details of elapsed time and intervals set
> 
> 
> returns {**string[]**} an array of timer data
> 
> 

---

> #### constructor()
> initialises the event manager
> 
> 

---

> #### add(timer)
> adds given timer to be managed
> 
> 
> **Parameters**
> 
> {**Timer|Event**} **timer** 
> 
> 

---

> #### remove(timer)
> Removes a specific timer from the eventmanager
> 
> 
> **Parameters**
> 
> {**Timer|Event**} **timer** 
> 
> 

---

> #### removeallBut(timer)
> removes all timers except for the given one, this may need to be active after some mode as ended
> 
> 
> **Parameters**
> 
> {**Timer|Event**} **timer** 
> 
> 

---

> #### update()
> performs the update of all managed timers and events
> 
> 

---

> #### twodp(val)
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

