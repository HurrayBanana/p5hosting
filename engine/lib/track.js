/******************************
 * timer.js by Hurray Banana 2023-2024
 ******************************/ 
// NEED TO IMPLEMENT CATMULL-ROM for smooth function
       

     /**
     States what should happen when a sprite reaches the end of its current track
     */
    class EndOfTrackAction
    {
         /**
         at end of track pick another track from those associated with the Sprite
         Great for random boss movement patterns
         */
        static random = "random";
         /**
         forces the sprite to leave the track and continue in the direction it was last moving
         Nice to use if you turn gravity on for a sprite once its detached if you use 
         an OnTrackEnd handler to alter the sprites properties
         */
        static detach = "detach";
         /**
         start again on the current track
         Useful for fancy menu like sega 3d ones for name entry
         */
        static  wrap = "wrap";
         /**
         go backwards along the current track
         Nice to use for display or target type tracks
         */
        static reverse = "reverse";
         /**
         kill the sprite at the end of the track
         Can use for explosion effects in conjuction with a Sprite funeral
         */
        static  kill = "kill";
         /**
         move on to the start of the next track
         Use if you want a sprite to follow a specific sequence of tracks.
         The order is governed by the order you used the Sprite.AddTrack() methods
         */
        static next = "next";
         /**
         Halt sprite at the end of the track
         Use if you want a sprite to travel to the end and the stop and do something
         like launch a bullet at the player (see the yellow circular star force enemies)
          use in conjuction with OnTrackEnd handler. After firing you can ask the Sprite to
          follow a second track to move off screen again.
         */
        static stop = "stop";
    }

     /**
     States how the sprite should move along the track
     Discrete step is for manual control of a track
     */
    class TrackStepMode{
        /**
         operate using a fixed step 
         move along a certain number of points during each update
         */
        static discreteStep = "discreteStep";
        /**
         approximate a time to travel along so many pixels of the track
         in the same way as sprite velocity works
         */
        static pixelsPerSec = "pixelsPerSec";
    }


/**
 * Responsible for storing the Tracks (taken from the TrackBank) and manipulating the movement of a Sprite
 * In order to use Tracks with a Sprite you need to make sure you create one
 * @example this.track new TrackManager(this);
 */
class TrackManager{
        cleanup(){}
        
        draw(trknum, closed, style){
            trknum = (trknum === undefined || trknum < 0 || trknum >= this.#tracklist.length) ? 0 : trknum;
            let tr = this.#tracklist[trknum];
            if (!tr.isDirty && this.#tracklist.length > 0){
                tr.isDirty = true;
                let step = (style === undefined || style.step === undefined) ? 1 : style.step;

                let layer = (style === undefined || style.layer === undefined) ? Engine.layer(0) : style.layer;
                layer.push();
                layer.stroke((style === undefined || style.col === undefined) ? 1 : style.col);
                layer.strokeWeight((style === undefined || style.weight === undefined) ? 1 : style.weight);
                layer.noFill();
                layer.beginShape(layer.POINTS);

                let v = this.#tracklist[trknum].trackDef.points
                let p = 0;
                while (p < v.length){
                    layer.vertex(v[p].x + tr.offset.x, v[p].y + tr.offset.y);
                    p += step;
                }
                if (closed){ layer.endShape(layer.CLOSE);
                } else {layer.endShape();}
                layer.pop();  
            } else {console.log("not drawn " + trknum)};
        }
        /**
         if set to true then manual track position changes instantly afect the position of the sprite
         defaults to true, if this causes problems then set this to False
         */
        get instantmove() { return this.#instantmove; }
        set instantmove(value) {this.#instantmove = value; }
        
        /**
         if true 
         */
        #instantmove = true;
        
        /**
        //NOT NEEDED - will leave while refactoring
         random number generator for the class
         */
        //rnd = new Random(DateTime.Now.Millisecond);
        
        /**
         A list of the tracks defined for this sprite
         */
        #tracklist = null;

        
        /**
         gets a list of all the tracks for the sprite
         */
        get TrackList() { return this.#tracklist; }
        
        /**
         what to do when you get to the end of the current track
         */
        #endAction = EndOfTrackAction.stop;
        
        /**
         Determines how sprite moves along the track
         defaults to pixelsPerSec to take account of the game clock
         */
        stepMode = TrackStepMode.pixelsPerSec;
        
        /**
         The speed in pixels per seconds to move along the track
         */
        #pixelsPerSec = 0;
        
        /**
         precalculated value so we just multply game time
         needs to re-calculated every time speed adjusted
         or track changes MUST IMPLEMENT THIS
         */
        #pixelsPerSecPreCalc;
        
        /**
         Sets the speed at which a sprite should travel along the track in pixels per second
         */
        get PixelsPerSec() { return this.#pixelsPerSec; }
        set PixelsPerSec(value){
            if (value <= 0)
                value = 0;
            this.#pixelsPerSec = value;
            this.#SetPreCalc();
        }

         /**
         needs to be called when pixelsPerSec changes or track being used changes
         */
        #SetPreCalc(){
            this.#pixelsPerSecPreCalc = this.direction * this.#pixelsPerSec * this.#tracklist[this._trackCurrent].trackDef.pointsOverlength;
            this.#pointsCurrent = this.#tracklist[this._trackCurrent].trackDef.points.length;
        }

        
         /**
         holds the step distance fractionally so we can integer round
         */
        trackFractionalPos = 0;
         /**
         stores the the delegate routine to call when a sprite meets the end of a track
         */
        //EndOfTrackCallBack; //NEED TO SORT THIS
        #callbackEOT = null;
        /** retrieves the current the callback handler called sprite reaches then end of a track
         * it will be in the form of object properties
         * @example 
         * // two propeties callback and instance
         * let callstuff = this.callbackEndOfTrack;
         * if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
         */
        get callbackEndOfTrack(){return this.#callbackEOT;}
        /**
         * sets (or changes) the callback handler called sprite reaches then end of a track
         * @example //value must be an object with 2 properties or use:
         *  Engine.makeCallback()
         * @param {{callback:method | function,instance:object}} value 
         */
        set callbackEndOfTrack(value){
          if (value.callback !== undefined && value.instance !== undefined){
            this.#callbackEOT = value;
          }
        }    
        //
         /**
        // if trackEndAction is set to kill do so after we have moved through this many tracks
        // */
        _travellingStops = 1;
        
         /**
         how many track have I travelled along
         */
        _totalTravelled = 0;
        
         /**
         the index of the track in this.#tracklist we are currently using
         */
        _trackCurrent;

        
         /**
         Allows you to manually change the track index at any time
         Use with caution, you can often achieve the effect you want using
         the correct means of working with tracks
         */
        get TrackCurrent(){ return this._trackCurrent; }
        set TrackCurrent(value){ this._trackCurrent = value; }
        
        //number of points in the active track
        #pointsCurrent;
        /**
         * @returns {int} number of points in the active track
         */
        get pointsCurrent(){return this.#pointsCurrent;}
         /**
         Retrieves the Track data (not a definition of the currently active track)
         The track definition is available within the Track object
         */
        get CurrentTrackData() { return this.#tracklist[this._trackCurrent]; }
        
         /**
         the element position of the track we are currently looking at
         */
        _trackPosition;
        
         /**
         how much to move along the track by each update
         */
        _trackStep;
        
         /**
         holds the previous trackstep when paused
         ready to be restored
         */
        _saveTrackStep;
        
         /**
         what direction to move along the track
         */
         direction = 1;
        
         /**
         holds a reference to parent sprite
         */
        boss;
        
         /**
         holds a timer that determines when the track position should
         be updated which ensure this is independant of frame rate
         */
        _updateTimer; //DO I NEED AN EVENT MANAGER - OR CAN THIS BE HANDLED WITH A CUSTOM TIMER TRIGGERED BY THE UPDATE OF THE SPRITE
        
         /**
         Creates a new TrackManager for the Sprite.
         *
         @param {Sprite} s The sprite to associate the trackmanager with
         This is created by the Sprite itself if you passed a TrackBank when you create it
         @returns {TrackManager}
         */
        constructor(s){
            this.boss = s;
            this.#tracklist = [];
            //setup the default timer to be every possible frame
            this._updateTimer = new Event("TRACKMAN FOR SP" + s.myid.toString().padEnd(5, '0'));
            this._updateTimer.interval(0);
            //then need to add to the event manager somehow
        }

         /**
         gets or sets the action that should be performed when a sprite reaches the end of 
         a track
         */
        get EndAction(){ return this.#endAction; }
        set EndAction(value) { this.#endAction = value; }
        
         /**
         Gets the number of tracks this sprite has travelled along
         
         I don't know if I implemented this yet
         */
        get TracksTravelled() {return this._totalTravelled; }
        
         /**
         Set the value for number of tracks travelled
         this can be used for counting 
         
         @param {int} newCount The new setting value you require
         */
        TravelledCountSet(newCount){
            this._totalTravelled = newCount;
        }
        //NEEDS RE_WORKING AS THIS NOW ONLY WORKS FOR STEP MOVEMENT
        
         /**
         Stop sprite moving along track
         Restart track movement using Resume()
         */
        Pause(){
            this._saveTrackStep = this._trackStep;
            this._trackStep = 0;
        }

        //NEEDS RE_WORKING AS THIS NOW ONLY WORKS FOR STEP MOVEMENT
        
         /**
         Restart a previously Paused() sprite
         Don't use this without previously Pausing
         */
        Resume(){
            this._trackStep = this._saveTrackStep;
        }

        
         /**
         Disconnects Sprite from given tracks and sets velocity in last known direction
         Can go back to track mode by setting MovementMode to autotrack or manualTrack
         */
        Detach(){
            let v = vector3.sub(this.boss.position - this.boss.lasttrackposition);
            v.normalise();
            v.mul(this.#pixelsPerSec);
            this.boss.velocity = v;
            //this.boss.velocity = vector3.normalised((boss.Position - this.boss.LastTrackPosition)) * this.pixelsPerSec;
            this.boss.updateMode = UpdateMode.automatic;
        }

        
         /**
         attempts to take value in lastTrackWas and performs the undraw operation
         @param {int} drawNextTrack if true we will attempt to draw the current track after removing previous
         */
        AttemptToAutoUndraw(drawNextTrack){
            if (this.drawing && this.#autoShowHide)
            {
                this.DrawTrackNoMore(this.lastTrackWas);
                
                //bodge for now need to record current settings when draw specified
                if (drawNextTrack) this.DrawTrack(this.lastLineStyle, this.lastNumberOfLinesDrawn, this.#autoShowHide);
            }
        }

        
         /**
         gets the updated interval for the track update timer
         */
         get UpdateInterval() { return this._updateTimer.Interval; }

        
         /**
         Removes a track at the given position.
         The position is the order in which the tracks were added
         The first track added is at position 0.
         If the last track removed is being followed by the sprite then it is
         detached from this track and the end track handler is called if enabled
         @param {} position The track index for this sprite to remove
         */
         Remove(position){
            if (position > -1 && position < this.#tracklist.length){

                this.#tracklist.splice(position, 1);
                //attempt to adjust current track if affected by removal
                if (this._trackCurrent >= position){
                    this._trackCurrent--;
                    if (this._trackCurrent < 0)
                        this._trackCurrent = 0;
                    //if no track data turn of track update methods
                    if (this.#tracklist.length == 0)
                        this.boss.updateMode = UpdateMode.automatic;
                }

            }
        }

        
         /**
         Adds a track from the TrackBank to be used by this Sprite
         @param {} trackDef The previously generated track definition
         Make sure you have added Tracks to your TrackBank first
         */
        AddTrack(trackDef){
            if (!(trackDef === null || trackDef === undefined))
                this.#tracklist.push(new Track(trackDef));
        }

        
         /**
         Adds a track to be used by this Sprite and modifies its starting position 
         by the amount given
         @param {} trackDef the trackdefinition to add
         @param {} offset A 3d offset to apply to the original tracks positions
         */
        AddTrackWithOffset(trackDef, offset){   
            if (!(trackDef === null || trackDef === undefined)){
                this.#tracklist.push(new Track(trackDef, offset));
            }

        }

        
         /**
         Adds a track to a sprite and translates the track to a specified position
         @param {} trackDef Track definition
         @param {} startPos The position to start the track
         Use this for a track shape that will be used for a sprite
         generated at a specific position (e.g bullet hell tracks)
         */
        AddTrackStartAt(trackDef, startPos){
            if (!(trackDef === null || trackDef === undefined)){
                this.#tracklist.push(new Track(trackDef, vector3.sub(startPos, trackDef.points[0])));
            }
        }
        
         /**
         Specifies how Sprite is to use the tracks allocated to it
         @param {EndOfTrackAction} et What to do when sprite reaches the end of the track
         @param {int} startTrack The index of the tracks given to the Sprite using Add
         that you wish to start the Sprite on
         @param {int} step The number of positions along the track you wish to move the Sprite
         during each update
         @param {int} direction 1 travel from start to end, -1 travel from end to start
         @param {int} startposition Track position to start at, you must check it's in range
         This should be used after adding all tracks to a sprite
         */
        TravelWithStep( et,  startTrack,  step,  direction,  startposition){
            this.#endAction = et;
            this._trackCurrent = startTrack;
            this._trackStep = step;
            this.direction = direction;
            this._trackPosition = (startposition == 0 || startposition === undefined) ? this.GetStartPosition : startposition;
            this.trackFractionalPos = this._trackPosition;
            this.stepMode = TrackStepMode.discreteStep;
            this.boss.updateMode = UpdateMode.autotrack;
            this.boss.position = this.boss.track.positionCurrent;
        }
        
        // /**
        // Specifies how Sprite is to use the tracks allocated to it
        // @param {EndOfTrackAction} et What to do when sprite reaches the end of the track
        // @param {int} startTrack The index of the tracks given to the Sprite using Add
        // that you wish to start the Sprite on
        // @param {int} step The number of positions along the track you wish to move the Sprite
        // during each update
        // @param {int} direction 1 travel from start to end, -1 travel from end to start
        // This should be used after adding all tracks to a sprite
        // */
        //TravelWithStep( et,  startTrack,  step,  direction){ TravelWithStep(et, startTrack, step, direction, 0); }

        
         /**
         Sets sprite to move along the track at constant speed irrespective of the frame rate
         @param {EndOfTrackAction} et What to do when you reach end of track
         @param {int} startTrack The track to start at
         @param {float} speed The speed in pixels per second to move at
         @param {int} direction 1 for forward, -1 for backward
         @param {int} startPosition Track position to start at, you must check it's in range
         */
         TravelWithSpeed( et,  startTrack,  speed,  direction,  startPosition){
            this.#pixelsPerSec  = Math.abs(speed);//make sure positive
            this.stepMode = TrackStepMode.pixelsPerSec;
            this.#endAction = et;
            this._trackCurrent = startTrack;
            this.direction = direction;
            if (startPosition == 0 || startPosition === undefined){
                this.trackFractionalPos = this._trackPosition = this.GetStartPosition;
            } else {
                this.trackFractionalPos = this._trackPosition = startPosition;
            }
            this.boss.updateMode = UpdateMode.autotrack;
            this.boss.position = this.boss.track.positionCurrent;
            this.#SetPreCalc();
        }
        
        // /**
        // Sets sprite to move along the track at constant speed irrespective of the frame rate
        // @param {EndOfTrackAction} et What to do when you reach end of track
        // @param {int} startTrack The track to start at
        // @param {float} speed The speed in pixels per second to move at
        // @param {int} direction 1 for forward, -1 for backward
        // */
        //TravelWithSpeed(et, startTrack, speed, direction){
        //     this.TravelWithSpeed(et,  startTrack,  speed,  direction, 0);
        //}
        
         /**
         Gets the current x, y and z position (game co-ordinates) along the current track
         You shouldn't really need this
         @returns {int}
         */
        get positionCurrent(){
            if (!this.interpolate){
                return  vector3.add(this.#tracklist[this._trackCurrent].trackDef.points[this._trackPosition],
                    this.#tracklist[this._trackCurrent].offset);
            } else {
                let a = this.trackFractionalPos | 0;
                if (this.#endAction != EndOfTrackAction.wrap && this.#tracklist.length > 1 && a == this.#pointsCurrent - 1 ){
                    return  vector3.add(this.#tracklist[this._trackCurrent].trackDef.points[a],
                        this.#tracklist[this._trackCurrent].offset);
                } else {
                let b = (a == this.#tracklist[this._trackCurrent].trackDef.points.length - 1) ? 0 : a + 1;
                let p = this.trackFractionalPos - a;
                //console.log(a + ":" + b + ":" + p);
                return vector3.add(vector3.lerp(this.#tracklist[this._trackCurrent].trackDef.points[a],
                    this.#tracklist[this._trackCurrent].trackDef.points[b],
                    p), this.#tracklist[this._trackCurrent].offset);
                }
            }
        }
        /**
         * if true then a position between 2 points will be interpolated for fractional movement
         * default is false so place only at existing track points
         */
        interpolate = false;
         /**
         Tries to locate a suitable position on the current track which is
         close to the position specified. If you want to jump from one track to another
         then you need to move to that track first then try this
         @param {vector3} position The 2d position to locate a point near
         @returns {{pos:vector3,trackpos:int}} 
         */
        TrackPositionNear(position){
            let pos = GetAPositionNear(position, this._trackCurrent);
            //set track position
            this.trackFractionalPos = pos.trackpos;
            this._trackPosition = pos.trackpos | 0;

            if (this.#instantmove)
                this.boss.position = this.boss.track.positionCurrent;

            return pos;
        }

        
         /**
         Tries to locate a suitable position on the current track which is
         close to the position specified. If you want to jump from one track to another
         then you need to move to that track first then try this
         @param {vector3} position The 2d position to locate a point near
         @param {int} trackNum The track number (its position in the sprites list) that you wish to attach to
         @returns {{pos:vector3,trackpos:int}}The Physical position along the track and the track position, 
         the W value holds the track position
         */
        GetAPositionNear(position, trackNum){
            let pos = {pos:vector3.zero,trackpos:0};
            let tempDistance = 0;
            //set start value
            let current = this.#tracklist[trackNum].trackDef.points[0];
            let shortestDistance = Math.abs(vector3.Distance(current, position));
            pos.trackpos = 0;

            for (let i = 1; i < this.#tracklist[trackNum].trackDef.points.length; i++)
            {
                tempDistance = Math.abs(vector3.distance(this.#tracklist[trackNum].trackDef.points[i], position));

                if (tempDistance < shortestDistance)
                {
                    shortestDistance = tempDistance;
                    current = this.#tracklist[trackNum].trackDef.points[i];
                    pos.trackpos = i;
                }
            }
            pos.pos.x = current.x;
            pos.pos.y = current.y;
            pos.pos.z = current.z;
            return pos;
        }
        
       
         /**
         Tells you if you are at the start of the current track
         the start depends on direction travelling
         @return {bool} True means the sprite is at the start</value>
         */
        get AtStart() { return (this._trackPosition == this.GetStartPosition); }
        
         /**
         gets a value stating whether you are at the first position
         along a track
         @return {bool} True means at first point, false means not</value>
         */
        get AtPhysicalStart(){ return (this._trackPosition == 0); }
        
         /**
         gets a value stating whether you are at the last position
         along a track
         @return {bool} True means at last point, false means not</value>
         */
        get AtPhysicalEnd() { return (this._trackPosition == this.#tracklist[this._trackCurrent].trackDef.points.length - 1); }
        
         /**
         Tells you if you are at the end of the current track
         @return {bool} True means the sprite is at the end</value>
         */
        get AtEnd() { return (this._trackPosition == this.GetEndPosition); }
        
        /**
        Gets the position along the current track
        You shouldn't really need this
        @returns {int}
        */
        get TrackPosition() { return this._trackPosition; }
        /**
         sets the position along the current track
         * @param {int} value 
         */
        set TrackPosition(value) {
                this.trackFractionalPos = this._trackPosition = value;
                //CorrectTrack();
                this.#SetPreCalc();
            }
         /**
         Gets or Sets the step rate for the current track, how many positions to skip along
         The larger the step value the quicker the Sprite will appear to move.
         Try to create your tracks with lots of positions, this will then give you flexability
         when trying to decide on the step size
         @return {float} the higher the track step the faster the sprite will appear to move along the track</value>
         */
        get TrackStep() { return this._trackStep; }
         /**
         Gets or Sets the step rate for the current track, how many positions to skip along
         The larger the step value the quicker the Sprite will appear to move.
         Try to create your tracks with lots of positions, this will then give you flexability
         when trying to decide on the step size
         @param {float} value the higher the track step the faster the sprite will appear to move along the track</value>
         */
         set TrackStep(value) { this._trackStep = value; }

        
         /**
         gets the track name of the currently used track
         @returns {}string{}
         */
        get TrackName() { return this.#tracklist[this._trackCurrent].trackDef.Name; }
        
         /**
         Gets the start position on the current track based on the direction travelling
         */
            get GetStartPosition(){
                if (this.direction > 0)
                    return 0;
                else
                    return this.#tracklist[this._trackCurrent].trackDef.points.length - 1;
            }

        
         /**
         gets the end position on the current track based on the direction travelling
         @returns {int}
         */
        get GetEndPosition(){
            if (this.direction > 0)
                return this.#tracklist[this._trackCurrent].trackDef.points.length - 1;
            else
                return 0;
        }

        
         /**
         Move forward along the current track
         */
         PositionForward(){
            this.trackFractionalPos += this._trackStep * this.direction;
            this._trackPosition = this.trackFractionalPos | 0;
            this.CorrectTrack();
            if (this.instantmove)
            this.boss.position = this.boss.track.positionCurrent;

        }

        
         /**
         Move backward along the current track
         */
         PositionBackward(){
            this.trackFractionalPos -= this._trackStep * this.direction;
            this._trackPosition = this.trackFractionalPos | 0;
            this.CorrectTrack();
            if (this.instantmove)
            this.boss.position = this.boss.track.positionCurrent;
        }

        
         /**
         Moves to the first position on the track
         */
         PositionFirst(){
            this.trackFractionalPos = 0;
            this._trackPosition = this.trackFractionalPos | 0;
            if (instantmove)
                this.boss.position = this.boss.track.positionCurrent;

        }

        
         /**
         moves to the last position on the track
         */
         PositionLast(){
            this.trackFractionalPos = this.#tracklist[this._trackCurrent].trackDef.points.length - 1;
            this._trackPosition = this.trackFractionalPos | 0;
            if (instantmove)
                this.boss.position = this.boss.track.positionCurrent;

        }

        
         /**
         moves to the next track associated with this sprite
         */
         TrackNext(){
            if (this.#tracklist.length != 0)
            {
                this._totalTravelled++;
                this.lastTrackWas = this._trackCurrent;

                this._trackCurrent = (++this._trackCurrent % this.#tracklist.length);
                //in case we have moved track
                this.#SetPreCalc();
                this.AttemptToAutoUndraw(true);
            }
            else
                throw new ArgumentOutOfRangeException("No tracks defined for this sprite");
        }

        
        
         /**
         holds the track number of the last track prior to changing it
         */
        lastTrackWas;
        
         /**
         specifies if a track us currently being drawn
         */
        drawing;
        
         /**
         holds the line style set so when we draw next track automatically we can use the same style
         {LineData}
         */
        lastLineStyle;
        
         /**
         holds the number of lines specified when drawing automatically so we can use the same number automatically
         */
        lastNumberOfLinesDrawn;
       

        
        /**
        if true the trackmanager will ensure tracks are displayed and hidden automatically
        as they are used by the sprite
        */
        #autoShowHide = false;
        /**
        if true the trackmanager for the sprite will automatically draw and remove tracks as the sprite uses them
        @param {bool}
        */
        get AutoShowHide(){ return this.#autoShowHide; }
        /**
        if true the trackmanager for the sprite will automatically draw and remove tracks as the sprite uses them
        @param {bool}
        */
        set AutoShowHide(value){
            this.#autoShowHide = value;
            //force pre-calc to ensure track is being shown properly ???
            //if (value)
            //    this.#SetPreCalc();
        }

        // NEED A LINE SYSTEM
        // /**
        // tells the engine to draw a specific track being managed using the line style given
        // @param {{trackNumber:int,lineStyle:LineData,lines:int,autoDraw:bool}} spec
        // @param {} trackNumber track number from manager to draw
        // @param {} lineStyle LineData settings to use
        // @param {} lines number of lines to draw
        // @param {} autoDraw If true the track manager will automatically hide and show tracks for the sprite
        // @returns {Line} The lists of lines required to draw the track, these can then be dynamically manipulated for various effects
        // */
        // DrawTrack(spec){//int trackNumber, LineData lineStyle, int lines, bool autoDraw){
        //    spec.trackNumber = (spec.trackNumber !== undefined) ? spec.trackNumber : this._trackCurrent;
        //    spec.lineStyle = (spec.lineStyle !== undefined) ? spec.lineStyle : LineData.basic;
        //    spec.trackNumber = (spec.lines !== undefined) ? spec.lines : this._trackCurrent.length -1;
        //    spec.autoDraw = (spec.autoDraw !== undefined) ? spec.autoDraw : false;
        //    this.drawing = true;
        //    this.#autoShowHide = autoDraw;
//      //     this.lastLineStyle = lineStyle;
        //    this.lastNumberOfLinesDrawn = lines;
//      //     List<Line> linesNeeded = new List<Line>();
        //    if (spec.trackNumber >= 0 && spec.trackNumber < this.#tracklist.length)
        //    {   
        //        let vts = [];
        //        
        //        
        //        Line l;
        //        vector3 offset = this.#tracklist[trackNumber].Offset;
        //        //rough for now might not completely join
        //        let step = this.#tracklist[trackNumber].trackDef.points.length / lines;
        //        int i = 0;
        //        while (i <#tracklist[trackNumber].trackDef.points.length - step)
        //        {
        //            l = new Line(offset + this.#tracklist[trackNumber].trackDef.points[i], offset + this.#tracklist[trackNumber].trackDef.points[i+step]);
        //            l.settings = lineStyle.Clone();
        //            i += step;
        //            l.Owner = new OwnerInfo(boss.ID, trackNumber, linesNeeded.length);
        //            //add line to manager and line list
        //            linesNeeded.push(l);
        //            this.boss.engM.AddLine(l);
        //        }
        //        //final line
        //        l = new Line(offset + this.#tracklist[trackNumber].trackDef.points[i], offset + this.#tracklist[trackNumber].trackDef.points[#tracklist[trackNumber].trackDef.points.length - 1]);
        //        l.settings = lineStyle.Clone();
        //        l.Owner = new OwnerInfo(boss.ID, trackNumber, linesNeeded.length);
        //        //add line to manager and line list
        //        linesNeeded.push(l);
        //        this.boss.engM.AddLine(l);
        //    }
        //    return linesNeeded;
        //}
        
         /**
         attempts to replace a track at the position given with a new track definition
         @param {TrackDefinition} td track to use
         @param {int} position position of track to remove
         */
        ReplaceTrack(td, position){
            position = (position === undefined) ? position : 0;

            if (td != null && td.points.length > 0)
            {
                if (position >= 0 && position < this.#tracklist.length)
                {
                    DrawTrackNoMore(position);
                    this.#tracklist[position] = new Track(td);
                }
                else
                    this.#tracklist.push(new Track(td));
            }
            else
                throw new ArgumentException("Track definition is either Null or has no points");
        }
        
        ///**
        //replaces the track at position 0. If not track exists then adds the new track
        //@param {TrackDefinition} td Track definition to use instead af first one
        //*/
        //ReplaceTrack(td){
        //    ReplaceTrack(td, 0);
        //}
        
        ///**
        //stops the engine drawing the current track
        //*/
        //DrawTrackNoMore(){
        //    DrawTrackNoMore(_trackCurrent);
        //}

        
        /**
        stops the engine drawing the given track
        @param {int} trackNumber the track number of this track manager to remove, if not defined current track selected
        */
        DrawTrackNoMore( trackNumber){
            trackNumber = (trackNumber === undefined) ? trackNumber : this._trackCurrent;
            this.boss.engM.LineRemoveOwners(new OwnerInfo(boss.ID, trackNumber));
            drawing = false;
        }
        
        /**
        moves to the previous track associated with this sprite
        */
        TrackPrevious(){
            if (this.#tracklist.length != 0)
            {
                this._totalTravelled++;
                this.lastTrackWas = this._trackCurrent;

                this._trackCurrent--;
                if (_trackCurrent < 0)
                    this._trackCurrent = this.#tracklist.length - 1;
                this.#SetPreCalc();
                this.AttemptToAutoUndraw(true);
            }
            else
                throw new ArgumentOutOfRangeException("No tracks defined for this sprite");
        }

        
        /**
        sets the update interval for track re-positioning
        @param {float} interval time in seconds before moving to next position on the track
        */
        UpdateIntervalSet(interval){
            this._updateTimer.Interval(interval);
        }

        
         /**
         Corrects any over steps and performs requested action
         @returns {}
         */
        CorrectTrack(){
            let retVal = false;
            
            //capture current track number before changing it
            this.lastTrackWas = this._trackCurrent;

            //int diff = 
            if (this._trackPosition >= this.#tracklist[this._trackCurrent].trackDef.points.length ||
                this._trackPosition < 0)
            {
                this.trackFractionalPos %= this.#tracklist[this._trackCurrent].trackDef.points.length;

                //if (this.trackFractionalPos < 0) this.trackFractionalPos *= -1;
                if (this.trackFractionalPos < 0) this.trackFractionalPos += this.#tracklist[this._trackCurrent].trackDef.points.length;

                let propTravel = this.trackFractionalPos / this.#tracklist[this._trackCurrent].trackDef.points.length;
                switch (this.#endAction)
                {
                    case EndOfTrackAction.detach:
                        //should not need to do this with UpdateSprite fix
                        //this.trackFractionalPos = this._trackPosition = GetEndPosition;
                        this.Detach();
                        this.AttemptToAutoUndraw(false);
                        break;
                    case EndOfTrackAction.kill:
                        this.trackFractionalPos = this._trackPosition = 0;
                        this.boss.UpdateAs = UpdateMode.none;
                        this.boss.Kill();
                        this.AttemptToAutoUndraw(false);
                        break;
                    case EndOfTrackAction.next:
                        this._totalTravelled++;

                        //capture current track number before changing it
                        //this.lastTrackWas = this._trackCurrent;

                        this._trackCurrent = (++this._trackCurrent % this.#tracklist.length);
                        this.trackFractionalPos = this._trackPosition = this.GetStartPosition;
                        // - new code to make item move along next track in correct 
                        //start position
                        this.trackFractionalPos += this.#tracklist[this._trackCurrent].trackDef.points.length
                                                * propTravel * this.direction;
                        this._trackPosition = this.trackFractionalPos | 0;
                        //correction to stop interpolation between distant tracks
                        //if (this.interpolate) this.trackFractionalPos = this._trackPosition;
                        //end of new code
                        this.#SetPreCalc();
                        retVal = true;
                        this.AttemptToAutoUndraw(true);
                        break;
                    case EndOfTrackAction.random:
                        this._totalTravelled++;

                        this._trackCurrent = ranBetween(0, this.#tracklist.length);
                        this.trackFractionalPos = this._trackPosition = this.GetStartPosition;
                        //start position
                        this.trackFractionalPos += this.#tracklist[this._trackCurrent].trackDef.points.length
                                                * propTravel * this.direction;
                        this._trackPosition = this.trackFractionalPos | 0;
                        //correction to stop interpolation between distant tracks
                        //if (this.interpolate) this.trackFractionalPos = this._trackPosition;
                        //end of new code
                        this.#SetPreCalc();
                        retVal = true;
                        this.AttemptToAutoUndraw(true);
                        break;
                    case EndOfTrackAction.reverse:
                        this._totalTravelled++;
                        this.direction *= -1;
                        this.trackFractionalPos = this._trackPosition = this.GetStartPosition;
                        //start position
                        //this.trackFractionalPos += this.#tracklist[this._trackCurrent].trackDef.points.length
                        //                * propTravel * this.direction;
                        this._trackPosition = this.trackFractionalPos | 0;
                        //correction to stop interpolation between distant tracks
                        //if (this.interpolate) this.trackFractionalPos = this._trackPosition;
                        //end of new code
                        this.#SetPreCalc();
                        retVal = true;
                        break;
                    case EndOfTrackAction.wrap:
                        this._totalTravelled++;
                        this.trackFractionalPos %= this.#tracklist[this._trackCurrent].trackDef.points.length;
                        if (this.trackFractionalPos < 0)
                            this.trackFractionalPos += this.#tracklist[this._trackCurrent].trackDef.points.length;
                        this._trackPosition = this.trackFractionalPos | 0;
                        this.#SetPreCalc();
                        retVal = true;
                        break;
                    case EndOfTrackAction.stop:
                        this._totalTravelled++;
                        this.trackFractionalPos = this._trackPosition = GetEndPosition;
                        TrackStep = 0;
                        pixelsPerSec = 0;
                        this.#SetPreCalc();
                        retVal = true;
                        break;
                }
                //if (OnEndOfTrack != null)
                //    OnEndOfTrack(boss);
                Engine.processCallback(this.#callbackEOT);//EndOfTrackCallBack);
                //if (this.EndOfTrackCallBack != null) EndOfTrackCallBack();
            }//end of if to check for end

            //check for dirtyness of track when drawing
            //if it is then we need to remove a track and re-draw it!
            if (this.#tracklist[this._trackCurrent].IsDirty && drawing)
            {
                this.AttemptToAutoUndraw(true);
            }
            return retVal;
        }

        
         /**
         Perform the update of the Sprite's position using the current track settings
         This is called by the Sprites Update method there is no need to call this yourself
         */
         update(){
            for(let p = 0 ; p < this.#tracklist.length; p++){
                this.#tracklist[p].clean();
            }
            //for updating purposes
            let currentPosition = this._trackPosition;
            //needs timer interval expiration
            if ((this.stepMode == TrackStepMode.discreteStep) && this._updateTimer.elapsedResetAccrued)
            {
                this.trackFractionalPos += this._trackStep * this.direction;
            }
            else
            {
                //keep track of total point distance
                this.trackFractionalPos += this.#pixelsPerSecPreCalc * Engine.delta;//EngineManager.enginePeriod;
            }
            this._trackPosition = this.trackFractionalPos | 0;
            //Have we moved position (or changed track)
            return this.CorrectTrack() || (currentPosition != this._trackPosition);
        }//Update

        
        //THIS CAN@T POSSIBLY WORK
        // /**
        // works out the number of trackposition between the two track positions given
        // @param {} start the start position of the track
        // @param {} end the position to move towards
        // @param {} numberOfPoints number of points in the track
        // @param {} direction direction of travel +ve is forwards -ve is backwards
        // @returns {int} the number of trackpositions between these points
        // */
        // static int TrackDistance(int start, int end, int numberOfPoints, float direction){
        //    if (start != end)
        //    {
        //        int distance = 0;
        //        int step = 1;
        //        if (direction < 0) step = -1;
        //        while (start != end)
        //        {
        //            start = start + step;
        //            //check for wrap round track
        //            if (start < 0) start = numberOfPoints - 1;
        //            else if (start == numberOfPoints) start = 0;
//
        //            distance++;
        //        }
        //        return distance;
        //    }
        //    else return 0;
        //}
}

class Track{
        /** 
        * unique id created for every track used?
        */
        static trackId = 0;
        /** 
        * The offset to displace the original track positions by
        * This can be used to make use of the shape of a pre-defined track
        * but starting at a different position to its original definition
        */
        get offset(){ return this.#offset; }
        set offset(value){
            //set dirty if value has changed
            if (value != this.#offset)
                this.dirtyMe = true;
            this.#offset = value;
        }

        /** 
        * holds the offset for this track
        */
        #offset = vector3.zero;
        /** 
        * holds a reference to the raw track data being used
        */
        trackDef;
        /** 
        * specifies whether track should be drawn or not
        */
        visible = false;
        /** 
        * specifies whether the track definition is designated as moving
        */
        moving = false;
        /** 
        * Constructs a new track manager track from given track definition with an offset
        * @param {TrackDefinition} trackDef The track definition to add to the track manager
        * @param {vector3} offset The 3d displacement to apply to this track, zero if omitted
        */
        constructor(trackDef, offset){
            offset = (offset === undefined) ? vector3.zero : offset;
            this.trackDef = trackDef;
            this.#offset = offset;
        }
        /** 
        * specifed true if the offset has been changed
        */
        #dirtyMe = false;

        /** 
        * gets (resetting in the process) the dirty status of a track
        */
        get isDirty() { return this.#dirtyMe;}//return this.trackDef.isdirty || this.isMeDirty; }
        set isDirty(value) { this.#dirtyMe = value;}//return this.trackDef.isdirty || this.isMeDirty; }
        clean(){this.#dirtyMe = false;}
        /** 
        * gets or set the dirty status of the track, when reading this is reset
        */
        get isMeDirty(){
            if (this.#dirtyMe){
                this.#dirtyMe = false;
                return true;
            }
            return this.#dirtyMe;
        }
        set isMeDirty(value){
            this.#dirtyMe = value;
        }

}
/**
 * holds a collection of points that are used by the track manager
 * to direct sprites along pre-described paths
 */
class TrackDefinition{
    /**
    *  a collection of points
    */
    points = [];
    /**
    *  An internal name only used for debugging purposes
    */
    name;
    /**
    *  the length of the track in pixels
    */
    length;
    /**
    *  Number of points to display on the track
    */
    displayNumber = -1;
    /**
    *  wash for the track
    */
    colorWash = [255,255,255];
    /**
    *  A sprite with just a single frame definition
    */
    marker = null;
    /**
    *  pre calculate value giving us the ratio of points to length
    *  for velocity calculations during the TrackManager update
    */
    pointsOverlength;
    /**
    *  specifies if a track has been transformed
    */
    #dirty;
    /**
    *  Gets the dirty (transformed) status of a track, resetting it in the process 
    *  or sets the dirty status
    */
    get isdirty(){
        if (this.#dirty){
            this.#dirty = false;
            return true;
        }
        return this.#dirty;
    }
    set isdirty(value){
        this.#dirty = value;
    }
    
    /**
    *  forces a track to marked as transformed
    *  this is important for when lines have been drawn
    */
    dirty(){
        this.#dirty = true;
    }

}
/** 
* holds information about portions of point based tracks
*/
class WayPoint{
    /** 
    * the x step in unit terms as proportion of distance
    */
    xstep;
    /** 
    * the x step in unit terms as proportion of distance
    */
    ystep;
    /** 
    * the x step in unit terms as proportion of distance
    */
    zstep;
    /** 
    * the distance (by pythagorus of this WayPoint
    */
    distance;
    /** 
    * start point
    */
    start;
    /** 
    * end point
    */
    end;
    
    /** 
    * quick constructor
    * @param {vector3} start start of waypoint
    * @param {vector3} end end of wapoint
    * @param {float} xs stepping for waypoint
    * @param {float} ys stepping for waypoint
    * @param {float} zs stepping for waypoint
    * @param {float} dist distance for this waypoint
    */
    constructor( start,  end,  xs,  ys,  zs,  dist)
    {
        this.xstep = xs;
        this.ystep = ys;
        this.zstep = zs;
        this.distance = dist;
        this.start = start;
        this.end = end;
    }
}
/**
 * provides methods for creating and manipulating tracks
 */
class TrackHelper{

        /** 
        * Calculates the speed required to traverse a specified track in the timeperiod given
        * @param {TrackDefinition} track The track to traverse
        * @param {float} timePeriod The time you want to take moving along the track
        * 
        * @returns {float} The speed required in pixels per second
        */
        static SpeedForTime(track, timePeriod){
            return track.length / timePeriod;
        }

        /** 
        * Takes an existing track definition and copies it creating a new track
        * @param {TrackDefinition} existingTrack The existing track to clone
        * @param {string} newTrackName The debug name of the new track
        * @returns {TrackDefinition}The newly cloned track definition
        */
        static Clone( existingTrack, newTrackName){
            let newTrack = new TrackDefinition();

            let p = 0;
            while (p < existingTrack.points.length)
                newTrack.points.push(existingTrack.points[p++]);
            TrackHelper.Getlength(newTrack);

            return newTrack;
        }

        /** 
        * Determines the length of the track in pixels and also pre-calculates
        * the ratio points/length for update calculations
        * @param {TrackDefinition} newTrack track definition to approximate the length of
        */
        static Getlength(newTrack){
            let vec;
            newTrack.length = 0;
            for (let j = 0; j < newTrack.points.length - 1; j++){
                vec = vector3.sub(newTrack.points[j + 1], newTrack.points[j]);
                newTrack.length += vec.length;
            }
            newTrack.pointsOverlength = newTrack.points.length / newTrack.length;
        }

        /** 
        * NOT IMPLEMENTED YET defines a track from an image supplied in a texture.
        * The image MUST NOT use Anti-Aliasing
        * @param {image} texture The texture containg a track
        * @param {Rectangle} region the portion of the texture to find the track in
        * @param {string} newTrackName the name to give the generated track
        * @returns {TrackDefinition} the newly created track
        */
        static FromTexture(texture, region,newTrackName){
            return null;
        }

        /** 
        * Creates a track with only the points specified
        * @param {string} newTrackName The debug name to give to the track
        * @param {vector3[]} points The List vector3 of the points you want
        * @returns {TrackDefinition} the newly created track
        * Use this to move a sprite to fixed positions
        */
        static  Rawpoints( newTrackName, points){
            let newTrack = new TrackDefinition();
            newTrack.points = points;
            newTrack.name = newTrackName;
            TrackHelper.Getlength(newTrack);
            return newTrack;
        }

        /** 
        * Creates a smoothed off track based on the points given.
        * As this is a Beizer curve the points at the ends as control points bounding the curve
        * @param {string} newTrackName The debug name to give the track
        * @param {int} numberOfpoints The number of points to give the track
        * @param {vector3[]} points The List vector3 of the points you want to create the track from
        * @returns {TrackDefinition} the newly created track
        */
        static  Smooth(newTrackName,  numberOfpoints, points){
            let newTrack = new TrackDefinition();
            newTrack.name = newTrackName;
            let i = 0;
            let step = 1 / numberOfpoints;
            let mu = 0;
            for (i = 0; i < numberOfpoints; i++){
                newTrack.points.push(Bezier(points, points.length - 1, mu));
                mu += step;
            }
            TrackHelper.Getlength(newTrack);
            return newTrack;
        }

        /** 
        * Generates a new smooth track from the specified track, 
        * @param {TrackDefinition} existingTrack The track you want to use
        *  for the control points of the smoother
        * @param {int} numberOfpoints The number of points to use on the track
        * @param {string} newTrackName The debug name to give the new track
        * @returns {TrackDefinition}  the newly created track
        * Be sure not to use tracks with too many points, only use those that were added using Rawpoints
        */
        static CloneSmooth(existingTrack, numberOfpoints, newTrackName){
            let newTrack = new TrackDefinition();
            newTrack.name = newTrackName;
            let i = 0;
            let step = 1 / numberOfpoints;
            let mu = 0;
            for (let i = 0; i < numberOfpoints; i++){
                newTrack.points.push(Bezier(existingTrack.points, existingTrack.points.length - 1, mu));
                mu += step;
            }
            TrackHelper.Getlength(newTrack);
            return newTrack;
        }

        /** 
        * Creates a smooth track than joins to its start from the points given using Catmull-Rom interpolatio
        * @param {String} newTrackName The name of the track created
        * @param {int} pointsPerStep How many points to smoothly generate between each point in the original list
        * @param {[]vector3} basepoints the list of points that the curve will go through
        * @returns {TrackDefinition}  
        */
        static CatmullRomClosed( newTrackName, pointsPerStep, basepoints){

            //TODO GOT TO GET START POSITION CORRECT (STARTS AT 2ND POINT)
            let newTrack = new TrackDefinition();
            newTrack.name = newTrackName;
            //append first 3 points so we can close the loop with control points
            basepoints.Insert(0, basepoints[basepoints.length - 1]);
            basepoints.push(basepoints[1]);
            basepoints.push(basepoints[2]);
            //basepoints.push(basepoints[2]);

            for (let i = 1; i < basepoints.length - 2; i++){
                 part = InterpolateCR(pointsPerStep,
                                        basepoints[i - 1],
                                        basepoints[i],
                                        basepoints[i + 1],
                                        basepoints[i + 2]);
                newTrack.points.push(part);
            }
            newTrack.points = newTrack.points.flat();

            //add the first point in at the end
            //newTrack.points.push(newTrack.points[0]);

            //add the first point in at the end
            //remove the 3 extra points added
            basepoints.RemoveRange(basepoints.length - 2, 2);
            basepoints.RemoveAt(0);
            TrackHelper.Getlength(newTrack);
            return newTrack;
        }
        // WAITING FOR CATMULL ROM
        //** 
        //* creates a position along a CatmullRom interpolation
        //* @param {*} v1 
        //* @param {*} v2 
        //* @param {*} v3 
        //* @param {*} v4 
        //* @param {*} amount what position along spline
        //* @returns {vector3}
        //*/
        //static vector3 CR3D(ref vector3 v1, ref vector3 v2, ref vector3 v3, ref vector3 v4, float amount)
        //{
        //    vector3 result =  vector3.zero;
        //    result.x = MathHelper.CatmullRom(v1.x, v2.x, v3.x, v4.x, amount);
        //    result.y = MathHelper.CatmullRom(v1.y, v2.y, v3.y, v4.y, amount);
        //    result.z = MathHelper.CatmullRom(v1.z, v2.z, v3.z, v4.z, amount);
        //    return result;
        //}
//
        //** 
        //* creates a smooth Catmull-Rom line along the points given
        //* @param {string} newTrackName The name to give to the new track
        //* @param {[]vector3} pointsPerStep How many points to smoothly generate between each point in the original list
        //* @param {*} basepoints The list of control points we want to go through
        //* @returns {TrackDefinition}  A new track with nice smooth paths
        //*/
        // static TrackDefinition CatmullRomOpen(String newTrackName, int pointsPerStep, List<vector3> basepoints)
        //{
        //    let newTrack = new TrackDefinition();
        //    newTrack.name = newTrackName;
        //    //needs work to get the correct steps to even out across all points
        //    //this will not be correct to start with unless factors work out
        //    //int steps = numberOfpoints / basepoints.length;
//
        //    //create extra start and end as control points
        //    vector3 startPoint = new vector3();
        //    vector3 endPoint = new vector3();
        //    startPoint = basepoints[0] - (basepoints[0] - basepoints[1]);
        //    endPoint = basepoints[basepoints.length - 1] + (basepoints[basepoints.length - 1] - basepoints[basepoints.length - 2]);
        //    //add new start and end but remember to remove afterwork
        //    basepoints.Insert(0, startPoint);
        //    basepoints.push(endPoint);
//
        //    for (let i = 1; i < basepoints.length - 2; i++)
        //    {
        //        List<vector3> part = InterpolateCR(pointsPerStep,
        //                                basepoints[i - 1],
        //                                basepoints[i],
        //                                basepoints[i + 1],
        //                                basepoints[i + 2]);
        //        newTrack.points.AddRange(part);
        //    }
//
//
        //    //remove last and first points - the ones we added
        //    basepoints.RemoveAt(basepoints.length - 1);
        //    basepoints.RemoveAt(0);
        //    TrackHelper.Getlength(newTrack);
        //    return newTrack;
        //}

        //** 
        //* generates points between four outlying control points
        //* @param {*} detail 
        //* @param {*} v1 
        //* @param {*} v2 
        //* @param {*} v3 
        //* @param {*} v4 
        //* @returns {vector3[]}
        //*/
        //static List<vector3> InterpolateCR(int detail, vector3 v1, vector3 v2, vector3 v3, vector3 v4)
        //{
        //    List<vector3> list = new List<vector3>();
        //    for (let i = 0; i < detail; i++)
        //    {
        //        list.push(CR3D(ref v1,ref v2,ref v3,ref v4, (float)i/(float)detail));
        //    }
        //    list.push(v3);
        //    return list;
        //}

        //** 
        //* Produces a generalised beizer curve using the points given as control points
        //* @param {*} p control points
        //* @param {*} n number of points
        //* @param {*} mu mu is position along the curve 0 is start, 1 is end
        //* @returns {vector3} Returns point on curve
        //*/
        //static vector3 Bezier(List<vector3> p, int n, float mu)
        //{
        //    int k, kn, nn, nkn;
        //    float blend, muk, munk;
        //    vector3 b =  vector3.zero;
//
        //    muk = 1;
        //    munk = (float)Math.Pow((double)(1 - mu), (double)n);
//
        //    for (k = 0; k <= n; k++)
        //    {
        //        nn = n;
        //        kn = k;
        //        nkn = n - k;
        //        blend = muk * munk;
        //        muk *= mu;
        //        munk /= (1 - mu);
        //        while (nn >= 1)
        //        {
        //            blend *= nn;
        //            nn--;
        //            if (kn > 1)
        //            {
        //                blend /= kn;
        //                kn--;
        //            }
        //            if (nkn > 1)
        //            {
        //                blend /= nkn;
        //                nkn--;
        //            }
        //        }
        //        b.x += p[k].x * blend;
        //        b.y += p[k].y * blend;
        //        b.z += p[k].z * blend;
        //    }
//
        //    return (b);
        //}



        /** 
        * Creates a track based on a sequence of points, you 
        * set them the same for a level track
        * @param {string} newTrackName The debug name of the track to create
        * @param {int} numberOfpoints How many points you want the entire track to contain
        * (they are distributed along the entire track length, the more points the more flexability you have with 
        * speeds travelling along the path
        * @param {[]vector3]} points a list of points defining the fixed position along the track
        * @returns {TrackDefinition}  the newly created track
        * You can use this to make specific paths for sprites to follow
        */
        static points(newTrackName, numberOfpoints, points){
            let newTrack = new TrackDefinition();
            newTrack.name = newTrackName;
            // a new point for holding the points as they are created
            let newPoint = vector3.zero;

            let totalDistance = 0;
            let distThisSpan = 0;//holds distance for current space
            span = [];//holds distance for each span
            for (let j = 0; j < points.length - 1; j++){
                //work out the length of each line using pythagorus
                let xd = points[j + 1].x - points[j].x;
                let yd = points[j + 1].y - points[j].y;
                let zd = points[j + 1].z - points[j].z;
                distThisSpan = Math.sqrt(xd * xd + yd * yd + zd * zd);
                span.push(new WayPoint(points[j], points[j + 1],
                    xd, yd, zd, distThisSpan));
                totalDistance += distThisSpan;
            }

            let sectionDistance = 0;
            let step = (totalDistance / numberOfpoints);
            let percent = 0;
            let section = 0;
            for (let pos = 0; pos < numberOfpoints - 1; pos++){
                //calculate co-ordinates from this section
                percent = sectionDistance / span[section].distance;
                newPoint = vector3.zero;
                newPoint.x = span[section].start.x + span[section].xstep * percent;
                newPoint.y = span[section].start.y + span[section].ystep * percent;
                newPoint.z = span[section].start.z + span[section].zstep * percent;
                newTrack.points.push(newPoint);
                //travelDistance += step;
                sectionDistance += step;
                //skip to next section if we have out run this one
                while (sectionDistance > span[section].distance)
                {
                    sectionDistance -= span[section].distance;
                    section++;
                }

            }
            //generate last point
            percent = sectionDistance / span[section].distance;
            newPoint = new vector3();
            newPoint.x = span[section].start.x + span[section].xstep * percent;
            newPoint.y = span[section].start.y + span[section].ystep * percent;
            newPoint.z = span[section].start.z + span[section].zstep * percent;
            newTrack.points.push(newPoint);
            TrackHelper.Getlength(newTrack);
            return newTrack;
        }//AddTrackFrompoints(int numberOfpoints, List<vector3> points)


        /** 
        * Generates a track with a number of points overriding the z value
        * @param {string} newTrackName The debug name of the track
        * @param {int} numberOfpoints How many points you want the entire track to contain
        * (they are distributed along the entire track length, the more points the more flexability you have with 
        * speeds travelling along the path
        * @param {[]vector3} points The points which define the track
        * @param {float} forcedZ The z value to set all the points to
        * @returns {TrackDefinition}  the newly created track
        */
        static pointsForceZ(newTrackName, numberOfpoints, points, forcedZ){

            let newTrack = new TrackDefinition();
            newTrack.name = newTrackName;
            // a new point for holding the points as they are created
            newPoint = vector3.zero;

            //let zStep = (frontZ - backZ) / numberOfpoints;
            let totalDistance = 0;
            let distThisSpan = 0;//holds distance for current space
            let span = [];//holds distance for each span
            for (let j = 0; j < points.length - 1; j++){
                //work out the length of each line using pythagorus
                let xd = points[j + 1].x - points[j].x;
                let yd = points[j + 1].y - points[j].y;
                distThisSpan = Math.sqrt(xd * xd + yd * yd);
                span.push(new WayPoint(points[j], points[j + 1],
                    xd, yd, 0, distThisSpan));
                totalDistance += distThisSpan;
            }

            //let travelDistance = 0;
            let sectionDistance = 0;
            let step = (totalDistance / numberOfpoints);
            let percent = 0;
            let section = 0;
            for (let pos = 0; pos < numberOfpoints - 1; pos++){
                //calculate co-ordinates from this section
                percent = sectionDistance / span[section].distance;
                newPoint = new vector3();
                newPoint.x = span[section].start.x + span[section].xstep * percent;
                newPoint.y = span[section].start.y + span[section].ystep * percent;
                newPoint.z = forcedZ;
                newTrack.points.push(newPoint);
                //travelDistance += step;
                sectionDistance += step;
                //skip to next section if we have out run this one
                while (sectionDistance > span[section].distance)
                {
                    sectionDistance -= span[section].distance;
                    section++;
                }

            }
            //generate last point
            percent = sectionDistance / span[section].distance;
            newPoint = new vector3();
            newPoint.x = span[section].start.x + span[section].xstep * percent;
            newPoint.y = span[section].start.y + span[section].ystep * percent;
            newPoint.z = forcedZ;
            newTrack.points.push(newPoint);

            TrackHelper.Getlength(newTrack);
            return newTrack;
        }//AddTrackFrompoints(int numberOfpoints, List<vector3> points, float overRideZ)

        /** 
        * creates a sinewave with a rotating z component 
        * this will allow ever changing circular Z values that can be used for scaling effects
        * or just to add nice parallax effects
        * @param {string} trackName The debug name to give the track
        * @param {int} numberOfpoints How many points to place in the final track
        * @param {float} start The right hand X position of the sine wave
        * @param {float} end The left hand X position of the sine wave
        * @param {float} waveAmplitude The amplitude (the vertical size) of the wave
        * @param {float} waveFrequency The number of cycles of the sine wave you want
        * @param {float} waveStartAngle The phase (angle) to start sine wave at in radians - 
        * use MathHelper.ToRadians(45) to specify value in degrees
        * @param {float} waveDirection specify either 1 or -1
        * @param {float} centreHeight The central height of the wave form
        * @param {float} helixAmplitude The amplitude of the Z value (depth movement front to back)
        * @param {float} helixPhaseOffset altering this effects where the track is furthest away. Leave as 0 unless you want to experiment
        * @param {float} helixRadialDirection specify either 1 or -1
        * @returns {TrackDefinition}  the newly created track
        * <example>
        * <code>
        * gameTracks.AddHelixTrack("helix", 400, 830, -30, 80, 2, 0, 1, 300, 80, 0, 1);
        * </code>
        * </example>
        */
         static Helix(trackName, numberOfpoints, start, end, waveAmplitude,
                                  waveFrequency, waveStartAngle, waveDirection, centreHeight,
                                  helixAmplitude, helixPhaseOffset, helixRadialDirection){
            //will hold the track we are creating
            let newTrack = new TrackDefinition();
            newTrack.name = trackName;
            // a new point for holding the points as they are created
            let newPoint = vector3.zero;

            if (numberOfpoints > 65535) numberOfpoints = 65535;

            let radStep = (Math.PI * 2 * waveFrequency / (numberOfpoints - 1) * waveDirection);
            let helixStep = (Math.PI * 2 * waveFrequency / (numberOfpoints - 1) * helixRadialDirection);
            let helixrad = waveStartAngle + helixPhaseOffset;

            let rad = waveStartAngle;

            let x = start;
            let xStep = (end - start) / (numberOfpoints - 1);

            for (let j = 0; j < numberOfpoints - 1; j++){
                newPoint = new vector3();
                newPoint.x = x;
                newPoint.y = (waveAmplitude * Math.sin(rad) + centreHeight);
                newPoint.z = (helixAmplitude * Math.cos(helixrad));
                x += xStep;
                rad += radStep;
                helixrad += helixStep;
                newTrack.points.push(newPoint);
            }
            //add last point
            newPoint = new vector3();
            newPoint.x = x;
            newPoint.y = (waveAmplitude * Math.sin(rad) + centreHeight);
            newPoint.z = (helixAmplitude * Math.cos(helixrad));
            newTrack.points.push(newPoint);

            TrackHelper.Getlength(newTrack);
            return newTrack;
        }

        /** 
        * Creates a simple sineWave shape
        * Use AddHelixTrack if you want something that varies the Z position along the track
        * @param {string} newTrackName The name to give the track
        * @param {int} numberOfpoints How many points to place in the final track
        * @param {float} start The right hand X position of the sine wave
        * @param {float} end The left hand X position of the sine wave
        * @param {float} waveAmplitude The amplitude (the vertical size) of the wave
        * @param {float} waveFrequency The number of cycles of the sine wave you want, 
        * you can use 0.5f to generate half a sine wave
        * @param {float} centreHeight The central height of the wave form
        * @param {float} depth the Z position of the sine wave track
        * @returns {TrackDefinition}  the newly created track
        * <example>
        * <code>
        * gameTracks.AddSineWaveTrack("Sine", 100, 800, 0, 200, 0.25f, 300,100);
        * </code>
        * </example>
        */
         static SineWaveSimple(newTrackName, numberOfpoints,
             start,
             end,
             waveAmplitude,
             waveFrequency,
             centreHeight,
             depth){
            //will hold the track we are creating
            let newTrack = new TrackDefinition();
            newTrack.name = newTrackName;
            // a new point for holding the points as they are created
            let newPoint = vector3.zero;

            if (numberOfpoints > 65535) numberOfpoints = 65535;

            let radStep = (Math.PI * 2 * waveFrequency / (numberOfpoints - 1));
            let rad = 0;

            let x = start;
            let xStep = (end - start) / (numberOfpoints - 1);

            //            ReDim myTrack(numpoints)
            for (let j = 0; j < numberOfpoints - 1; j++){
                newPoint = new vector3();
                newPoint.x = x;
                newPoint.y = (waveAmplitude * Math.sin(rad) + centreHeight);
                newPoint.z = depth;
                x += xStep;
                rad += radStep;
                newTrack.points.push(newPoint);
            }
            //add last point
            newPoint = new vector3();
            newPoint.x = x;
            newPoint.y = (waveAmplitude * Math.sin(rad) + centreHeight);
            newPoint.z = depth;
            newTrack.points.push(newPoint);

            TrackHelper.Getlength(newTrack);
            return newTrack;

        }//AddSineWaveTrack(int numberOfpoints, start, end, waveAmplitude, waveFrequency, centreHeight, depth)


        /** 
        * moves a track in the X, y and z positions specified
        * @param {TrackDefinition} existingTrack The track definition to translate
        * @param {float} x the amount in the x direction to move the track
        * @param {float} y the amount in the y direction to move the track
        * @param {float} z the amount in the z direction to move the track
        */
        static  Translate(existingTrack,  x,  y,  z){
            TrackHelper.Translate(existingTrack, new vector3(x, y, z));
        }
        /** 
        * moves a track in the X, y and z positions specified in the vector3 value
        * @param {TrackDefinition} existingTrack The track definition to translate
        * @param {*vector3 translation A vector3 value containing the X, Y and Z movements for track
        */
        static  Translate(existingTrack, translation){
            let p = 0;

            while (p < existingTrack.points.length){
                existingTrack.points[p] += translation;
                p++;
            }
        }
        /** 
        * scales a specific track around the origin given
        * @param {TrackDefinition} existingTrack The track definition to rotate
        * @param {vector3} origin The rotational centre
        * @param {float} x The scale factor for X axis
        * @param {float} y The scale factor for Y axis
        * @param {float} z The scale factor for Z axis
        */
         static  Scale(existingTrack, origin,  x,  y,  z){
            let p = 0;
            let rotMatrix = Matrix.CreateTranslation(-origin) *
                                Matrix.CreateScale(new vector3(x, y, z)) *
                                Matrix.CreateTranslation(origin);

            while (p < existingTrack.points.length){
                existingTrack.points[p] = vector3.Transform(existingTrack.points[p], rotMatrix);
                p++;
            }
        }
        /** 
        * Rotates the supplied track around an arbitrary point, by the angles given
        * @param {TrackDefinition} existingTrack The track definition to rotate
        * @param {vector3} origin The rotational centre
        * @param {float} angleX The rotation in degrees around the X axis
        * @param {float} angleY The rotation in degrees around the Y axis
        * @param {float} angleZ The rotation in degrees around the Z axis
        * You should ideally rotate around each axis separately
        */
         static  Rotate(existingTrack, origin,  angleX,  angleY,  angleZ){
            let p = 0;
            let rotMatrix = Matrix.CreateTranslation(-origin) *
                                Matrix.CreateRotationX(MathHelper.ToRadians(angleX)) *
                                Matrix.CreateRotationY(MathHelper.ToRadians(angleY)) *
                                Matrix.CreateRotationZ(MathHelper.ToRadians(angleZ)) *
                                Matrix.CreateTranslation(origin);

            while (p < existingTrack.points.length){
                existingTrack.points[p] = vector3.Transform(existingTrack.points[p], rotMatrix);
                p++;
            }
            existingTrack.Dirty();
        }//TrackRotate

        /** 
        * Rotates a track around a central position by the given angles specifed
        * @param {TrackDefinition} existingTrack The name of the track to rotate
        * @param {vector3} origin the centre of rotation
        * @param {vector3} angles the x, y and z axis rotation amounts specified as a vector3
        * You should ideally rotate around each axis separately
        */
         static  Rotate(existingTrack, origin, angles){
            let p = 0;
            let rotMatrix = Matrix.CreateTranslation(-origin) *
                                Matrix.CreateRotationX(MathHelper.ToRadians(angles.x)) *
                                Matrix.CreateRotationY(MathHelper.ToRadians(angles.y)) *
                                Matrix.CreateRotationZ(MathHelper.ToRadians(angles.z)) *
                                Matrix.CreateTranslation(origin);

            while (p < existingTrack.points.length){
                existingTrack.points[p] = vector3.Transform(existingTrack.points[p], rotMatrix);
                p++;
            }
        }//TrackRotate

        /** 
        * Creates a sine Wave shape wpecifying some more complex parameters
        * Use AddHelixTrack if you want something that varies the Z position along the track
        * @param {string} newTrackName The debug name of the track
        * @param {int} numberOfpoints How many points to place in the final track
        * @param {float} start The right hand X position of the sine wave
        * @param {float} end The left hand X position of the sine wave
        * @param {float} waveAmplitude The amplitude (the vertical size) of the wave
        * @param {float} waveFrequency The number of cycles of the sine wave you want, 
        * you can use 0.5f to generate half a sine wave
        * @param {float} waveStartAngle The phase (angle) to start sine wave at in radians - 
        * use MathHelper.ToRadians(45) to specify value in degrees
        * @param {float} waveDirection specify either 1 or -1
        * @param {float} centreHeight The central height of the wave form
        * @param {float} depth the Z position of the sine wave track
        * @returns {TrackDefinition}  the newly created track
        * <example>
        * <code>
        * gameTracks.AddSineWaveTrack("sine", 300, 400, 0, 100, 2, (float)(Math.PI / 2), 1, 400,100);
        * </code>
        * </example>
        */
         static SineWaveComplex( newTrackName,  numberOfpoints,  start,  end,  waveAmplitude,  waveFrequency,
                                      waveStartAngle,  waveDirection,  centreHeight,  depth){
            let newTrack = new TrackDefinition();
            newTrack.name = newTrackName;
            let newPoint = vector3.zero;

            if (numberOfpoints > 65535) numberOfpoints = 65535;

            let radStep = (Math.PI * 2 * waveFrequency / (numberOfpoints - 1) * waveDirection);
            let rad = waveStartAngle;

            let x = start;
            let xStep = (end - start) / (numberOfpoints - 1);

            //            ReDim myTrack(numpoints)
            for (let j = 0; j < numberOfpoints - 1; j++){
                newPoint = new vector3();
                newPoint.x = x;
                newPoint.y = (waveAmplitude * Math.sin(rad) + centreHeight);
                newPoint.z = depth;
                x += xStep;
                rad += radStep;
                newTrack.points.push(newPoint);
            }
            //add last point
            newPoint = new vector3();
            newPoint.x = x;
            newPoint.y = (waveAmplitude * Math.sin(rad) + centreHeight);
            newPoint.z = depth;
            newTrack.points.push(newPoint);

            TrackHelper.Getlength(newTrack);
            return newTrack;

        }//AddSineWaveTrack(int numberOfpoints, let start,  end,  waveAmplitude,  waveFrequency,
        //                       float waveStartAngle,  waveDirection,  centreHeight,  depth)


        /** 
        * Create a track which is circular, if you want to lean the circle over use the Rotate helpers
        * @param {string} trackName The debug name to give the track
        * @param {int} numberOfpoints the number of positions on the track required
        * @param {vector3} centre The centre position of the circle
        * @param {float} radius the radius of the track
        * @returns {TrackDefinition}
        */
        static Circle( trackName,  numberOfpoints,  centre,  radius){ return TrackHelper.Ellipse(trackName, numberOfpoints, centre, radius, radius); }

        /** 
        * Creates an elliptical track
        * @param {string} newTrackName The debug name of the track
        * @param {int} numberOfpoints the number of points to create
        * @param {vector3} centre the centre of the ellipse
        * @param {float} radiusX the horizontal radius
        * @param {float} radiusY the vertical radius
        * @returns {TrackDefinition}
        */
         static Ellipse(newTrackName, numberOfpoints, centre,  radiusX,  radiusY){
            //will hold the track we are creating
            let newTrack = new TrackDefinition();
            newTrack.name = newTrackName;
            // a new point for holding the points as they are created
            let newPoint = vector3.zero;

            if (numberOfpoints > 65535) numberOfpoints = 65535;

            let arcStep = 2 * Math.PI / numberOfpoints;
            let rad = 0;
            for (let j = 0; j < numberOfpoints - 1; j++){
                newPoint = new vector3();
                newPoint.x = (radiusX * Math.cos(rad) + centre.x);
                newPoint.y = (radiusY * Math.sin(rad) + centre.y);
                newPoint.z = centre.z;
                rad += arcStep;
                newTrack.points.push(newPoint);
            }
            //add last point
            newPoint = new vector3();
            newPoint.x = (radiusX * Math.cos(rad) + centre.x);
            newPoint.y = (radiusY * Math.sin(rad) + centre.y);
            newPoint.z = centre.z;
            newTrack.points.push(newPoint);

            TrackHelper.Getlength(newTrack);
            return newTrack;
        }

        /** 
        * Creates a spiral shape
        * @param {string} newTrackName The debug name of the track
        * @param {int} numberOfpoints number of points required along the track
        * @param {vector3} centre The centre of the spiral
        * @param {float} radiusX the horizontal radius
        * @param {float} radiusY the vertical radius
        * @param {float} smallestRadius the smallest value wanted for either radius. 
        * the rate at which the radii shrink is determined by this and number of revolutions
        * @param {float} revolutions number of revolutions you want, 
        * this can be a fractional value 1.5f would be a spiral with 1 and half turns
        * @param {float} startZ The starting Z value (depth into the screen)
        * @param {float} endZ The ending z value (depth into the screen)
        * @returns {TrackDefinition}
        */
        static Spiral(newTrackName,numberOfpoints,centre,radiusX,radiusY,smallestRadius,revolutions,startZ,endZ){
            //will hold the track we are creating
            let newTrack = new TrackDefinition();
            newTrack.name = newTrackName;
            // a new point for holding the points as they are created
            let newPoint = vector3.zero;

            if (numberOfpoints > 65535) numberOfpoints = 65535;

            let arcStep = revolutions * 2 * Math.PI / numberOfpoints;
            let rad = 0;
            let shrinkX = (radiusX - smallestRadius) / numberOfpoints;
            let shrinkY = (radiusY - smallestRadius) / numberOfpoints;
            let dz = (endZ - startZ) / numberOfpoints;
            let sz = startZ;
            for (let j = 0; j < numberOfpoints - 1; j++){
                newPoint = new vector3();
                newPoint.x = (radiusX * Math.cos(rad) + centre.x);
                newPoint.y = (radiusY * Math.sin(rad) + centre.y);
                newPoint.z = sz;
                rad += arcStep;
                newTrack.points.push(newPoint);
                radiusX -= shrinkX;
                radiusY -= shrinkY;
                sz += dz;
            }
            //add last point
            newPoint = new vector3();
            newPoint.x = (radiusX * Math.cos(rad) + centre.x);
            newPoint.y = (radiusY * Math.sin(rad) + centre.y);
            newPoint.z = centre.z;
            newTrack.points.push(newPoint);

            TrackHelper.Getlength(newTrack);
            return newTrack;
        }

        /** 
        * Creates a new track which is made up of the points from all the tracks specified int the 
        * array tracks, starting with the first track and adding points from each subsequent one
        * @param {string} newTrackName The name of the track created
        * @param {[]TrackDefinition} tracks an array of tracks to join
        * @returns {TrackDefinition}  a new track definition containing the points of all the tracks given
        */
         static Join(newTrackName, tracks){
            if (tracks.length > 0){
                let newTrack = new TrackDefinition();
                for (let i = 0; i < tracks.length; i++)
                    newTrack.points.push(tracks[i].points);

                newTrack.points = newTrack.points.flat();
                TrackHelper.Getlength(newTrack);
                return newTrack;
            }
            else
                return null;
        }    
}

//NEED ADDRANGE helper for point lists - push then x = x.flat();
