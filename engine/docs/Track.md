engine created by Hurray Banana &copy;2023-2024

this can be found in file **track.js**
## class Track
> describes a track which comprises a trackdefintion and offset information,
> 
> allowing the same track to be used for multiple sprites with different offsets
> 
> 

---

## Constructor
> #### constructor(trackDef, offset)
> to use write **new Track(trackDef, offset)**
> 
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

## properties
####  trackId [static]
> default value **0**
> 
> to use write **Track.trackId**
> 
> unique id created for every track used?
> 
> 

---

#### moving
> default value **false**
> 
> to use write **this.moving**
> 
> 
> type {**bool**} specifies whether the track definition is designated as moving
> 
> 

---

#### trackDef
> to use write **this.trackDef**
> 
> 
> type {**TrackDefinition**} holds a reference to the raw track data being used
> 
> 

---

#### visible
> default value **false**
> 
> to use write **this.visible**
> 
> 
> type {**bool**} specifies whether track should be drawn or not
> 
> 

---

## getters and setters
#### isDirty [getter]
> to use write **this.isDirty**
> 
> 
> returns {**bool**} gets (resetting in the process) the dirty status of a track
> 
> 

---

#### isDirty [setter]
> to use write **this.isDirty = value**
> 
> 
> **Parameters**
> 
> {**bool**} **value**  sets the dirty
> 
> 

---

#### isMeDirty [getter]
> to use write **this.isMeDirty**
> 
> 
> returns {**bool**} get the dirty status of the track, when reading this is reset
> 
> 

---

#### isMeDirty [setter]
> to use write **this.isMeDirty = value**
> 
> 
> **Parameters**
> 
> {**bool**} **value** set the dirty status of the track, when reading this is reset
> 
> 

---

#### offset [getter]
> to use write **this.offset**
> 
> 
> returns {**vector3**} The offset to displace the original track positions by This can be used to make use of the shape of a pre-defined track but starting at a different position to its original definition
> 
> 

---

#### offset [setter]
> to use write **this.offset = value**
> 
> 
> **Parameters**
> 
> {**vector3**} **value** The offset to displace the original track positions by
> 
> 

---

## Methods
#### clean()
> to use write **this.clean()**
> 
> marks the track as not dirty
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
