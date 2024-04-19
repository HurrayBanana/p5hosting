engine created by Hurray Banana &copy;2023-2024

this can be found in file **track.js**
## class TrackManager
> Responsible for storing the Tracks and manipulating the movement of a Sprite
> 
> In order to use Tracks with a Sprite you need to make sure you create one normally in your constructor
> 
> 

---

## Constructor
> #### constructor(s)
> to use write **new TrackManager(s)**
> 
> Creates a new TrackManager for the Sprite.
> 
> 
> returns {**TrackManager**}
> 
> 
> **Parameters**
> 
> {**Sprite**} **s** The sprite to associate the trackmanager with
> 
> 

---

## properties
#### _saveTrackStep
> to use write **this._saveTrackStep**
> 
> 
> type {**int**} holds the previous trackstep when paused ready to be restored
> 
> 

---

#### _totalTravelled
> default value **0**
> 
> to use write **this._totalTravelled**
> 
> 
> type {**int**} how many track have I travelled along
> 
> 

---

#### _trackCurrent
> to use write **this._trackCurrent**
> 
> 
> type {**int**} the index of the track in this.#tracklist we are currently using
> 
> 

---

#### _trackPosition
> to use write **this._trackPosition**
> 
> 
> type {**int**} the element position of the track we are currently looking at
> 
> 

---

#### _trackStep
> to use write **this._trackStep**
> 
> 
> type {**int**} how much to move along the track by each update
> 
> 

---

#### _travellingStops
> default value **1**
> 
> to use write **this._travellingStops**
> 
> 
> type {**int**} if trackEndAction is set to kill do so after we have moved through this many tracks
> 
> 

---

#### _updateTimer
> to use write **this._updateTimer**
> 
> 
> type {**Timer**} holds a timer that determines when the track position should be updated which ensure this is independant of frame rate
> 
> 

---

#### boss
> to use write **this.boss**
> 
> 
> type {**Sprite**} holds a reference to parent sprite
> 
> 

---

#### direction
> default value **1**
> 
> to use write **this.direction**
> 
> 
> type {**int**} what direction to move along the track +ve 1 or -ve 1
> 
> 

---

#### drawing
> to use write **this.drawing**
> 
> 
> type {**bool**} specifies if a track us currently being drawn
> 
> 

---

#### interpolate
> default value **false**
> 
> to use write **this.interpolate**
> 
> 
> type {**bool**} if true then a position between 2 points will be interpolated for fractional movement default is false so place only at existing track points
> 
> 

---

#### lastLineStyle
> to use write **this.lastLineStyle**
> 
> 
> type {**LineData**} holds the line style set so when we draw next track automatically we can use the same style
> 
> 

---

#### lastNumberOfLinesDrawn
> to use write **this.lastNumberOfLinesDrawn**
> 
> 
> type {**int**} holds the number of lines specified when drawing automatically so we can use the same number automatically
> 
> 

---

#### lastTrackWas
> to use write **this.lastTrackWas**
> 
> 
> type {**int**} holds the track index number of the last track prior to changing it
> 
> 

---

#### stepMode
> default value **TrackStepMode.pixelsPerSec**
> 
> to use write **this.stepMode**
> 
> 
> type {**TrackStepMode**} Determines how sprite moves along the track defaults to pixelsPerSec to take account of the game clock
> 
> 

---

#### trackFractionalPos
> default value **0**
> 
> to use write **this.trackFractionalPos**
> 
> 
> type {**float**} holds the step distance fractionally so we can move smoothly then integer round
> 
> 

---

## getters and setters
#### AtEnd [getter]
> to use write **this.AtEnd**
> 
> Tells you if you are at the end of the current track
> 
> 
> returns {**bool**} True means the sprite is at the end</value>
> 
> 

---

#### AtPhysicalEnd [getter]
> to use write **this.AtPhysicalEnd**
> 
> gets a value stating whether you are at the last position
> 
> along a track
> 
> 
> returns {**bool**} True means at last point, false means not</value>
> 
> 

---

#### AtPhysicalStart [getter]
> to use write **this.AtPhysicalStart**
> 
> gets a value stating whether you are at the first position
> 
> along a track
> 
> 
> returns {**bool**} True means at first point, false means not</value>
> 
> 

---

#### AtStart [getter]
> to use write **this.AtStart**
> 
> Tells you if you are at the start of the current track
> 
> the start depends on direction travelling
> 
> 
> returns {**bool**} True means the sprite is at the start</value>
> 
> 

---

#### AutoShowHide [getter]
> to use write **this.AutoShowHide**
> 
> 
> returns {**bool**} if true the trackmanager for the sprite will automatically draw and remove tracks as the sprite uses them
> 
> 

---

#### AutoShowHide [setter]
> to use write **this.AutoShowHide = value**
> 
> 
> **Parameters**
> 
> {**bool**} **if** true the trackmanager for the sprite will automatically draw and remove tracks as the sprite uses them
> 
> 

---

#### CurrentTrackData [getter]
> to use write **this.CurrentTrackData**
> 
> 
> returns {**Track**} Retrieves the Track data (not a definition of the currently active track) The track definition is available within the Track object
> 
> 

---

#### EndAction [getter]
> to use write **this.EndAction**
> 
> 
> returns {**EndOfTrackAction**} gets or sets the action that should be performed when a sprite reaches the end of a track
> 
> 

---

#### EndAction [setter]
> to use write **this.EndAction = value**
> 
> 
> returns {**EndOfTrackAction**} sets the action that should be performed when a sprite reaches the end of a track
> 
> 

---

#### GetEndPosition [getter]
> to use write **this.GetEndPosition**
> 
> 
> returns {**int**} gets the end index position on the current track based on the direction travelling
> 
> 

---

#### GetStartPosition [getter]
> to use write **this.GetStartPosition**
> 
> 
> returns {**int**} Gets the start index position on the current track based on the direction travelling
> 
> 

---

#### PixelsPerSec [getter]
> to use write **this.PixelsPerSec**
> 
> 
> returns {**float**} gets the speed at which a sprite should travel along the track in pixels per second
> 
> 

---

#### PixelsPerSec [setter]
> to use write **this.PixelsPerSec = value**
> 
> 
> **Parameters**
> 
> {**float**} **value** Sets the speed at which a sprite should travel along the track in pixels per second
> 
> 

---

#### TrackCurrent [getter]
> to use write **this.TrackCurrent**
> 
> 
> returns {**int**} current trackindex Allows you to manually change the track index at any time Use with caution, you can often achieve the effect you want using the correct means of working with tracks
> 
> 

---

#### TrackCurrent [setter]
> to use write **this.TrackCurrent = value**
> 
> 
> **Parameters**
> 
> {**int**} **value** trackindex you want
> 
> 

---

#### TrackList [getter]
> to use write **this.TrackList**
> 
> 
> returns {**Track[]**} gets the sprites tracklist (for manual manipulation by your code if you want to)
> 
> 

---

#### TrackName [getter]
> to use write **this.TrackName**
> 
> gets the track name of the currently used track
> 
> 
> returns {**string**}
> 
> 

---

#### TrackPosition [getter]
> to use write **this.TrackPosition**
> 
> Gets the position along the current track
> 
> You shouldn't really need this
> 
> 
> returns {**int**}
> 
> 

---

#### TrackPosition [setter]
> to use write **this.TrackPosition = value**
> 
> sets the position along the current track
> 
> 
> **Parameters**
> 
> {**int**} **value** 
> 
> 

---

#### TrackStep [getter]
> to use write **this.TrackStep**
> 
> Gets the step rate for the current track, how many positions to skip along
> 
> The larger the step value the quicker the Sprite will appear to move.
> 
> Try to create your tracks with lots of positions, this will then give you flexability
> 
> when trying to decide on the step size
> 
> 
> returns {**float**} the higher the track step the faster the sprite will appear to move along the track</value>
> 
> 

---

#### TrackStep [setter]
> to use write **this.TrackStep = value**
> 
> Sets the step rate for the current track, how many positions to skip along
> 
> The larger the step value the quicker the Sprite will appear to move.
> 
> Try to create your tracks with lots of positions, this will then give you flexability
> 
> when trying to decide on the step size
> 
> 
> **Parameters**
> 
> {**float**} **value** the higher the track step the faster the sprite will appear to move along the track</value>
> 
> 

---

#### TracksTravelled [getter]
> to use write **this.TracksTravelled**
> 
> 
> returns {**int**} Gets the number of tracks this sprite has travelled along
> 
> 

---

#### UpdateInterval [getter]
> to use write **this.UpdateInterval**
> 
> 
> returns {**float**} gets the updated interval for the track update timer
> 
> 

---

#### callbackEndOfTrack [getter]
> to use write **this.callbackEndOfTrack**
> 
> retrieves the current the callback handler called sprite reaches then end of a track
> 
> it will be in the form of object properties
> 
> 
> returns {**{callback:method | function,instance:object**}
> 
> ```js
> example
>       // two propeties callback and instance
>       let callstuff = this.callbackEndOfTrack;
>       if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
>      
> ```
> 

---

#### callbackEndOfTrack [setter]
> to use write **this.callbackEndOfTrack = value**
> 
> sets (or changes) the callback handler called sprite reaches then end of a track
> 
> 
> **Parameters**
> 
> {**{callback:method | function,instance:object}**} **value** 
> 
> ```js
> example
> //value must be an object with 2 properties or use:
>        Engine.makeCallback()
> ```
> 

---

#### instantmove [getter]
> to use write **this.instantmove**
> 
> 
> returns {**bool**} if set to true then manual track position changes instantly afect the position of the sprite defaults to true, if this causes problems then set this to false
> 
> 

---

#### instantmove [setter]
> to use write **this.instantmove = value**
> 
> 
> **Parameters**
> 
> {**bool**} **value** if set to true then manual track position changes instantly afect the position of the sprite
> 
> 

---

#### pointsCurrent [getter]
> to use write **this.pointsCurrent**
> 
> 

---

#### positionCurrent [getter]
> to use write **this.positionCurrent**
> 
> 
> returns {**vector3**} Gets the current x, y and z position (game co-ordinates) along the current track You shouldn't really need this
> 
> 

---

## Methods
#### AddTrack(trackDef)
> to use write **this.AddTrack(trackDef)**
> 
> Adds a track from the TrackBank to be used by this Sprite
> 
> 
> **Parameters**
> 
> {****} **trackDef** The previously generated track definition
> 
> 

---

#### AddTrackStartAt(trackDef, startPos)
> to use write **this.AddTrackStartAt(trackDef, startPos)**
> 
> Adds a track to a sprite and translates the track to a specified position,
> 
> so a single track can be placed with it's start at the position of a sprite if you wish
> 
> 
> **Parameters**
> 
> {**TrackDefinition**} **trackDef** Track definition
> 
> {**vector3**} **startPos** The position to start the track
> 
> 

---

#### AddTrackWithOffset(trackDef, offset)
> to use write **this.AddTrackWithOffset(trackDef, offset)**
> 
> Adds a track to be used by this Sprite and modifies its starting position
> 
> by the amount given
> 
> 
> **Parameters**
> 
> {**TrackDefinition**} **trackDef** the trackdefinition to add
> 
> {**vector3**} **offset** A 3d offset to apply to the original tracks positions
> 
> 

---

#### AttemptToAutoUndraw(drawNextTrack)
> to use write **this.AttemptToAutoUndraw(drawNextTrack)**
> 
> This is a bit broken need a solution based on vertex settings
> 
> attempts to take value in lastTrackWas and performs the undraw operation
> 
> 
> **Parameters**
> 
> {**int**} **drawNextTrack** if true we will attempt to draw the current track after removing previous
> 
> 

---

#### CorrectTrack()
> to use write **this.CorrectTrack()**
> 
> Corrects any over steps and performs requested action
> 
> 
> returns {**bool**} true if at end of track
> 
> 

---

#### Detach()
> to use write **this.Detach()**
> 
> Disconnects Sprite from given tracks and sets velocity in last known direction
> 
> Can go back to track mode by setting MovementMode to autotrack or manualTrack.
> 
> If you don't want velocity just set it to zero after calling Detach()
> 
> 

---

#### DrawTrackNoMore( trackNumber)
> to use write **this.DrawTrackNoMore( trackNumber)**
> 
> stops the engine drawing the given track
> 
> 
> **Parameters**
> 
> {**int**} **trackNumber** the track number of this track manager to remove, if not defined current track selected
> 
> 

---

#### GetAPositionNear(position, trackNum)
> to use write **this.GetAPositionNear(position, trackNum)**
> 
> Tries to locate a suitable position on the current track which is
> 
> close to the position specified. If you want to jump from one track to another
> 
> then you need to move to that track first then try this
> 
> 
> returns {**{pos:vector3,trackpos:int**} the W value holds the track position
> 
> 
> **Parameters**
> 
> {**vector3**} **position** The 2d position to locate a point near
> 
> {**int**} **trackNum** The track number (its position in the sprites list) that you wish to attach to
> 
> 

---

#### Pause()
> to use write **this.Pause()**
> 
> Stop sprite moving along track
> 
> Restart track movement using Resume()
> 
> 

---

#### PositionBackward()
> to use write **this.PositionBackward()**
> 
> Move backward along the current track
> 
> 

---

#### PositionFirst()
> to use write **this.PositionFirst()**
> 
> Moves to the first position on the track
> 
> 

---

#### PositionForward()
> to use write **this.PositionForward()**
> 
> Move forward along the current track
> 
> 

---

#### PositionLast()
> to use write **this.PositionLast()**
> 
> moves to the last position on the track
> 
> 

---

#### Remove(position)
> to use write **this.Remove(position)**
> 
> Removes a track at the given position.
> 
> The position is the order in which the tracks were added
> 
> The first track added is at position 0.
> 
> If the last track removed is being followed by the sprite then it is
> 
> detached from this track and the end track handler is called if enabled
> 
> 
> **Parameters**
> 
> {****} **position** The track index for this sprite to remove
> 
> 

---

#### ReplaceTrack(td, position)
> to use write **this.ReplaceTrack(td, position)**
> 
> attempts to replace a track at the position given with a new track definition
> 
> 
> **Parameters**
> 
> {**TrackDefinition**} **td** track to use
> 
> {**int**} **position** position of track to remove
> 
> 

---

#### Resume()
> to use write **this.Resume()**
> 
> Restart a previously Paused() sprite
> 
> Don't use this without previously Pausing
> 
> 

---

#### TrackNext()
> to use write **this.TrackNext()**
> 
> moves to the next track associated with this sprite
> 
> 

---

#### TrackPositionNear(position)
> to use write **this.TrackPositionNear(position)**
> 
> Tries to locate a suitable position on the current track which is
> 
> close to the position specified. If you want to jump from one track to another
> 
> then you need to move to that track first then try this
> 
> 
> returns {**{pos:vector3,trackpos:int**}
> 
> 
> **Parameters**
> 
> {**vector3**} **position** The 2d position to locate a point near
> 
> 

---

#### TrackPrevious()
> to use write **this.TrackPrevious()**
> 
> moves to the previous track associated with this sprite
> 
> 

---

#### TravelWithSpeed( endaction,  startTrack,  speed,  direction,  startPosition)
> to use write **this.TravelWithSpeed( endaction,  startTrack,  speed,  direction,  startPosition)**
> 
> Sets sprite to move along the track at constant speed irrespective of the frame rate
> 
> 
> **Parameters**
> 
> {**EndOfTrackAction**} **endaction** What to do when you reach end of track
> 
> {**int**} **startTrack** The track to start at
> 
> {**float**} **speed** The speed in pixels per second to move at
> 
> {**int**} **direction** 1 for forward, -1 for backward
> 
> {**int**} **startPosition** Track index position to start at, you must check it's in range
> 
> 

---

#### TravelWithStep( endaction,  startTrack,  step,  direction,  startposition)
> to use write **this.TravelWithStep( endaction,  startTrack,  step,  direction,  startposition)**
> 
> Specifies how Sprite is to use the tracks allocated to it, This should be used after adding all tracks to a sprite
> 
> 
> **Parameters**
> 
> {**EndOfTrackAction**} **endaction** What to do when sprite reaches the end of the track
> 
> {**int**} **startTrack** The index of the tracks given to the Sprite using Add that you wish to start the Sprite on
> 
> {**int**} **step** The number of positions along the track you wish to move the Sprite during each update
> 
> {**int**} **direction** 1 travel from start to end, -1 travel from end to start
> 
> {**int**} **startposition** Track index position to start at, you must check it's in range
> 
> 

---

#### TravelledCountSet(newCount)
> to use write **this.TravelledCountSet(newCount)**
> 
> Set the value for number of tracks travelled
> 
> this can be used for counting
> 
> 
> **Parameters**
> 
> {**int**} **newCount** The new setting value you require
> 
> 

---

#### UpdateIntervalSet(interval)
> to use write **this.UpdateIntervalSet(interval)**
> 
> sets the update interval for track re-positioning
> 
> 
> **Parameters**
> 
> {**float**} **interval** time in seconds before moving to next position on the track
> 
> 

---

#### cleanup()
> to use write **this.cleanup()**
> 
> not used
> 
> 

---

#### draw(trknum, closed, style)
> to use write **this.draw(trknum, closed, style)**
> 
> Drawing sort of works but I need to implement duplicate and dirty track changes properly so it doesn't overdraw anything
> 
> 
> **Parameters**
> 
> {**int**} **trknum** the track index of this sprites track to draw
> 
> {**bool**} **closed** if true then the first and last points will be drawn (as if it was a polygon)
> 
> {**{step:int,layer:texture,col:color,weight:int,shape:shape}**} **style** specifies how to draw the track, see examples for details
> 
> ```js
> example
>       // skip every other 5 points
>       // put on glow layer
>       // make 3 pixels wide
>       // color full green
>       let glowstyle = {step:5,layer:Engine.glowlayer(),weight:3,col:[0,255,0]};
>       // skip every other 5 points
>       // put on same layer as this sprite
>       // make 3 pixels wide
>       // color white
>       let trackstyle = {step:5,layer:this.layer,weight:3,col:[255,255,255]};
>       
>       //draw current track twice, once on glowlayer, once on sprite layer
>       this.track.draw(b,this.track.CurrentTrackData.trackDef.closed, tstyle);
>       this.track.draw(b,this.track.CurrentTrackData.trackDef.closed, trackstyle);
>      
> ```
> 

---

#### update()
> to use write **this.update()**
> 
> Perform the update of the Sprite's position using the current track settings
> 
> This is called by the Sprites Update method there is no need to call this yourself
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
