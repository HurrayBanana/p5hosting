> ### class Track
> describes a track which comprises a trackdefintion and offset information,
> 
> allowing the same track to be used for multiple sprites with different offsets
> 
> 

---

> #### static trackId = 0
> unique id created for every track used?
> 
> 

---

> #### #offset = vector3.zero
> 
> {**vector3**} holds the offset for this track
> 
> 

---

> #### trackDef
> 
> {**TrackDefinition**} holds a reference to the raw track data being used
> 
> 

---

> #### visible = false
> 
> {**bool**} specifies whether track should be drawn or not
> 
> 

---

> #### moving = false
> 
> {**bool**} specifies whether the track definition is designated as moving
> 
> 

---

> #### #dirtyMe = false
> 
> {**bool**} specifed true if the offset has been changed
> 
> 

---

> #### getter offset
> 
> returns {**vector3**} The offset to displace the original track positions by This can be used to make use of the shape of a pre-defined track but starting at a different position to its original definition
> 
> 

---

> #### setter offset
> 
> **Parameters**
> 
> {**vector3**} **value** The offset to displace the original track positions by
> 
> 

---

> #### getter isDirty
> 
> returns {**bool**} gets (resetting in the process) the dirty status of a track
> 
> 

---

> #### setter isDirty
> 
> **Parameters**
> 
> {***  {bool**} **value**  sets the dirty
> 
> 

---

> #### getter isMeDirty
> 
> returns {**bool**} get the dirty status of the track, when reading this is reset
> 
> 

---

> #### setter isMeDirty
> 
> **Parameters**
> 
> {***  {bool**} **value** set the dirty status of the track, when reading this is reset
> 
> 

---

> #### constructor(trackDef, offset)
> Constructs a new track manager track from given track definition with an offset
> 
> 
> **Parameters**
> 
> {**TrackDefinition**} **trackDef** The track definition to add to the track manager
> 
> {**vector3**} **offset** The 3d displacement to apply to this track, zero if omitted
> 
> 

---

> #### clean()
> marks the track as not dirty
> 
> 

---

