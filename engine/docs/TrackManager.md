> ### class TrackManager
> Responsible for storing the Tracks and manipulating the movement of a Sprite
> 
> In order to use Tracks with a Sprite you need to make sure you create one normally in your constructor
> 
> 

---

> #### #instantmove = true
> 
> {**bool**} if set to true then manual track position changes instantly afect the position of the sprite defaults to true, if this causes problems then set this to false
> 
> 

---

> #### #tracklist = null
> 
> {**Track[]**} holds the tracks of this sprite
> 
> 

---

> #### #endAction = EndOfTrackAction.stop
> 
> {**EndOfTrackAction**} what to do when you get to the end of the current track
> 
> 

---

> #### stepMode = TrackStepMode.pixelsPerSec
> 
> {**TrackStepMode**} Determines how sprite moves along the track defaults to pixelsPerSec to take account of the game clock
> 
> 

---

> #### #pixelsPerSec = 0
> 
> {**float**} The speed in pixels per seconds to move along the track
> 
> 

---

> #### #pixelsPerSecPreCalc
> 
> {**float**} precalculated value so we just multply game time needs to re-calculated every time speed adjusted or track changes MUST IMPLEMENT THIS
> 
> 

---

> #### trackFractionalPos = 0
> 
> {**float**} holds the step distance fractionally so we can move smoothly then integer round
> 
> 

---

> #### #callbackEOT = null
> 
> {**{callback:method | function,instance:object**} } stores the the delegate routine to call when a sprite meets the end of a track
> 
> 

---

> #### _travellingStops = 1
> 
> {**int**} if trackEndAction is set to kill do so after we have moved through this many tracks
> 
> 

---

> #### _totalTravelled = 0
> 
> {**int**} how many track have I travelled along
> 
> 

---

> #### _trackCurrent
> 
> {**int**} the index of the track in this.#tracklist we are currently using
> 
> 

---

> #### #pointsCurrent
> 
> {**int**} number of points in the active track
> 
> 

---

> #### _trackPosition
> 
> {**int**} the element position of the track we are currently looking at
> 
> 

---

> #### _trackStep
> 
> {**int**} how much to move along the track by each update
> 
> 

---

> #### _saveTrackStep
> 
> {**int**} holds the previous trackstep when paused ready to be restored
> 
> 

---

> #### direction = 1
> 
> {**int**} what direction to move along the track +ve 1 or -ve 1
> 
> 

---

> #### boss
> 
> {**Sprite**} holds a reference to parent sprite
> 
> 

---

> #### _updateTimer
> 
> {**Timer**} holds a timer that determines when the track position should be updated which ensure this is independant of frame rate
> 
> 

---

> #### interpolate = false
> 
> {**bool**} if true then a position between 2 points will be interpolated for fractional movement default is false so place only at existing track points
> 
> 

---

> #### lastTrackWas
> 
> {**int**} holds the track index number of the last track prior to changing it
> 
> 

---

> #### drawing
> 
> {**bool**} specifies if a track us currently being drawn
> 
> 

---

> #### lastLineStyle
> 
> {**LineData**} holds the line style set so when we draw next track automatically we can use the same style
> 
> 

---

> #### lastNumberOfLinesDrawn
> 
> {**int**} holds the number of lines specified when drawing automatically so we can use the same number automatically
> 
> 

---

> #### #autoShowHide = false
> 
> {**bool**} if true the trackmanager will ensure tracks are displayed and hidden automatically as they are used by the sprite
> 
> 

---

> #### getter instantmove
> 
> returns {**bool**} if set to true then manual track position changes instantly afect the position of the sprite defaults to true, if this causes problems then set this to false
> 
> 

---

> #### setter instantmove
> 
> **Parameters**
> 
> {**bool**} **value** if set to true then manual track position changes instantly afect the position of the sprite
> 
> 

---

> #### getter TrackList
> 
> returns {**Track[]**} gets the sprites tracklist (for manual manipulation by your code if you want to)
> 
> 

---

> #### getter PixelsPerSec
> 
> returns {**float**} gets the speed at which a sprite should travel along the track in pixels per second
> 
> 

---

> #### setter PixelsPerSec
> 
> **Parameters**
> 
> {**float**} **value** Sets the speed at which a sprite should travel along the track in pixels per second
> 
> 

---

> #### getter callbackEndOfTrack
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

> #### setter callbackEndOfTrack
> sets (or changes) the callback handler called sprite reaches then end of a track
> 
> 
> **Parameters**
> 
> {**{callback:method | function,instance:object}**} **value** 
> 
> ```js
> example
>        Engine.makeCallback()
> ```
> 

---

> #### getter TrackCurrent
> 
> returns {**int**} current trackindex Allows you to manually change the track index at any time Use with caution, you can often achieve the effect you want using the correct means of working with tracks
> 
> 

---

> #### setter TrackCurrent
> 
> **Parameters**
> 
> {**int**} **value** trackindex you want
> 
> 

---

> #### getter pointsCurrent
> 

---

> #### getter CurrentTrackData
> 
> returns {**Track**} Retrieves the Track data (not a definition of the currently active track) The track definition is available within the Track object
> 
> 

---

> #### getter EndAction
> 
> returns {**EndOfTrackAction**} gets or sets the action that should be performed when a sprite reaches the end of a track
> 
> 

---

> #### setter EndAction
> 
> returns {**EndOfTrackAction**} sets the action that should be performed when a sprite reaches the end of a track
> 
> 

---

> #### getter TracksTravelled
> 
> returns {**int**} Gets the number of tracks this sprite has travelled along
> 
> 

---

> #### getter UpdateInterval
> 
> returns {**float**} gets the updated interval for the track update timer
> 
> 

---

> #### getter positionCurrent
> 
> returns {**vector3**} Gets the current x, y and z position (game co-ordinates) along the current track You shouldn't really need this
> 
> 

---

> #### getter AtStart
> Tells you if you are at the start of the current track
> 
> the start depends on direction travelling
> 
> 
> returns {**bool**} True means the sprite is at the start</value>
> 
> 

---

> #### getter AtPhysicalStart
> gets a value stating whether you are at the first position
> 
> along a track
> 
> 
> returns {**bool**} True means at first point, false means not</value>
> 
> 

---

> #### getter AtPhysicalEnd
> gets a value stating whether you are at the last position
> 
> along a track
> 
> 
> returns {**bool**} True means at last point, false means not</value>
> 
> 

---

> #### getter AtEnd
> Tells you if you are at the end of the current track
> 
> 
> returns {**bool**} True means the sprite is at the end</value>
> 
> 

---

> #### getter TrackPosition
> Gets the position along the current track
> 
> You shouldn't really need this
> 
> 
> returns {**int**}
> 
> 

---

> #### setter TrackPosition
> sets the position along the current track
> 
> 
> **Parameters**
> 
> {**int**} **value** 
> 
> 

---

> #### getter TrackStep
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

> #### setter TrackStep
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

> #### getter TrackName
> gets the track name of the currently used track
> 
> 
> returns {**string**}
> 
> 

---

> #### getter GetStartPosition
> 
> returns {**int**} Gets the start index position on the current track based on the direction travelling
> 
> 

---

> #### getter GetEndPosition
> 
> returns {**int**} gets the end index position on the current track based on the direction travelling
> 
> 

---

> #### getter AutoShowHide
> 
> returns {**bool**} if true the trackmanager for the sprite will automatically draw and remove tracks as the sprite uses them
> 
> 

---

> #### setter AutoShowHide
> 
> **Parameters**
> 
> {***  {bool**} **if** true the trackmanager for the sprite will automatically draw and remove tracks as the sprite uses them
> 
> 

---

> #### constructor(s)
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

> #### cleanup()
> not used
> 
> 

---

> #### draw(trknum, closed, style)
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

> #### #SetPreCalc()
> needs to be called when pixelsPerSec changes or track being used changes
> 
> 

---

> #### TravelledCountSet(newCount)
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

> #### Pause()
> Stop sprite moving along track
> 
> Restart track movement using Resume()
> 
> 

---

> #### Resume()
> Restart a previously Paused() sprite
> 
> Don't use this without previously Pausing
> 
> 

---

> #### Detach()
> Disconnects Sprite from given tracks and sets velocity in last known direction
> 
> Can go back to track mode by setting MovementMode to autotrack or manualTrack.
> 
> If you don't want velocity just set it to zero after calling Detach()
> 
> 

---

> #### AttemptToAutoUndraw(drawNextTrack)
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

> #### Remove(position)
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

> #### AddTrack(trackDef)
> Adds a track from the TrackBank to be used by this Sprite
> 
> 
> **Parameters**
> 
> {****} **trackDef** The previously generated track definition
> 
> 

---

> #### AddTrackWithOffset(trackDef, offset)
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

> #### AddTrackStartAt(trackDef, startPos)
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

> #### TravelWithStep( endaction,  startTrack,  step,  direction,  startposition)
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

> #### TravelWithSpeed( endaction,  startTrack,  speed,  direction,  startPosition)
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

> #### TrackPositionNear(position)
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

> #### GetAPositionNear(position, trackNum)
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

> #### PositionForward()
> Move forward along the current track
> 
> 

---

> #### PositionBackward()
> Move backward along the current track
> 
> 

---

> #### PositionFirst()
> Moves to the first position on the track
> 
> 

---

> #### PositionLast()
> moves to the last position on the track
> 
> 

---

> #### TrackNext()
> moves to the next track associated with this sprite
> 
> 

---

> #### ReplaceTrack(td, position)
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

> #### DrawTrackNoMore( trackNumber)
> stops the engine drawing the given track
> 
> 
> **Parameters**
> 
> {**int**} **trackNumber** the track number of this track manager to remove, if not defined current track selected
> 
> 

---

> #### TrackPrevious()
> moves to the previous track associated with this sprite
> 
> 

---

> #### UpdateIntervalSet(interval)
> sets the update interval for track re-positioning
> 
> 
> **Parameters**
> 
> {**float**} **interval** time in seconds before moving to next position on the track
> 
> 

---

> #### CorrectTrack()
> Corrects any over steps and performs requested action
> 
> 
> returns {**bool**} true if at end of track
> 
> 

---

> #### update()
> Perform the update of the Sprite's position using the current track settings
> 
> This is called by the Sprites Update method there is no need to call this yourself
> 
> 

---

