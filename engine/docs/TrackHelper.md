engine created by Hurray Banana &copy;2023-2024

this can be found in file **track.js**
## class TrackHelper
> provides methods for creating and manipulating tracks
> 
> 

---

## properties
####  Helix(trackName, numberOfpoints, start, end, waveAmplitude, [static]
> to use write **TrackHelper.Helix(trackName, numberOfpoints, start, end, waveAmplitude,**
> 
> creates a sinewave with a rotating z component
> 
> this will allow ever changing circular Z values that can be used for scaling effects
> 
> or just to add nice parallax effects
> 
> ```js
> example
>       let t = TrackHelper.AddHelixTrack("helix", 400, 830, -30, 80, 2, 0, 1, 300, 80, 0, 1);
>     
> ```
> 

---

####  SineWaveComplex( newTrackName,  numberOfpoints,  start,  end,  waveAmplitude,  waveFrequency, [static]
> to use write **TrackHelper.SineWaveComplex( newTrackName,  numberOfpoints,  start,  end,  waveAmplitude,  waveFrequency,**
> 
> Creates a sine Wave shape wpecifying some more complex parameters
> 
> Use AddHelixTrack if you want something that varies the Z position along the track
> 
> ```js
> example
>       let t = TrackHelper.AddSineWaveTrack("sine", 300, 400, 0, 100, 2, Math.PI / 2, 1, 400,100);
>     
> ```
> 

---

####  SineWaveSimple(newTrackName, numberOfpoints, [static]
> to use write **TrackHelper.SineWaveSimple(newTrackName, numberOfpoints,**
> 
> Creates a simple sineWave shape
> 
> Use AddHelixTrack if you want something that varies the Z position along the track
> 
> ```js
> example
>       let t = TrackHelper.AddSineWaveTrack("Sine", 100, 800, 0, 200, 0.25f, 300,100);
>     
> ```
> 

---

## Methods
####   Scale(existingTrack, origin,  x,  y,  z) [static]
> to use write **TrackHelper.Scale(existingTrack, origin,  x,  y,  z)**
> 
> scales a specific track around the origin given
> 
> 
> **Parameters**
> 
> {**TrackDefinition**} **existingTrack** The track definition to rotate
> 
> {**vector3**} **origin** The rotational centre
> 
> {**float**} **x** The scale factor for x axis
> 
> {**float**} **y** The scale factor for y axis
> 
> {**float**} **z** The scale factor for z axis
> 
> 

---

####  CatmullRomClosed( newTrackName, pointsPerStep, basepoints) [static]
> to use write **TrackHelper.CatmullRomClosed( newTrackName, pointsPerStep, basepoints)**
> 
> Creates a smooth track than joins to its start from the points given using Catmull-Rom interpolatio
> 
> 
> returns {**TrackDefinition**}
> 
> 
> **Parameters**
> 
> {**String**} **newTrackName** The name of the track created
> 
> {**int**} **pointsPerStep** How many points to smoothly generate between each point in the original list
> 
> {**[]vector3**} **basepoints** the list of points that the curve will go through
> 
> 

---

####  Circle( trackName,  numberOfpoints,  centre,  radius) [static]
> to use write **TrackHelper.Circle( trackName,  numberOfpoints,  centre,  radius)**
> 
> Create a track which is circular, if you want to lean the circle over use the Rotate helpers
> 
> 
> returns {**TrackDefinition**}
> 
> 
> **Parameters**
> 
> {**string**} **trackName** The debug name to give the track
> 
> {**int**} **numberOfpoints** the number of positions on the track required
> 
> {**vector3**} **centre** The centre position of the circle
> 
> {**float**} **radius** the radius of the track
> 
> 

---

####  Clone(existingTrack, newTrackName) [static]
> to use write **TrackHelper.Clone(existingTrack, newTrackName)**
> 
> Takes an existing track definition and copies it creating a new track
> 
> 
> returns {**TrackDefinition**}
> 
> 
> **Parameters**
> 
> {**TrackDefinition**} **existingTrack** The existing track to clone
> 
> {**string**} **newTrackName** The debug name of the new track
> 
> 

---

####  CloneSmooth(existingTrack, numberOfpoints, newTrackName) [static]
> to use write **TrackHelper.CloneSmooth(existingTrack, numberOfpoints, newTrackName)**
> 
> Generates a new smooth track from the specified track,
> 
> 
> returns {**TrackDefinition**} the newly created track Be sure not to use tracks with too many points, only use those that were added using Rawpoints
> 
> 
> **Parameters**
> 
> {**TrackDefinition**} **existingTrack** The track you want to use for the control points of the smoother
> 
> {**int**} **numberOfpoints** The number of points to use on the track
> 
> {**string**} **newTrackName** The debug name to give the new track
> 
> 

---

####  Ellipse(newTrackName, numberOfpoints, centre,  radiusX,  radiusY) [static]
> to use write **TrackHelper.Ellipse(newTrackName, numberOfpoints, centre,  radiusX,  radiusY)**
> 
> Creates an elliptical track
> 
> 
> returns {**TrackDefinition**}
> 
> 
> **Parameters**
> 
> {**string**} **newTrackName** The debug name of the track
> 
> {**int**} **numberOfpoints** the number of points to create
> 
> {**vector3**} **centre** the centre of the ellipse
> 
> {**float**} **radiusX** the horizontal radius
> 
> {**float**} **radiusY** the vertical radius
> 
> 

---

####  FromTexture(texture, region,newTrackName) [static]
> to use write **TrackHelper.FromTexture(texture, region,newTrackName)**
> 
> NOT IMPLEMENTED YET defines a track from an image supplied in a texture.
> 
> The image MUST NOT use Anti-Aliasing
> 
> 
> returns {**TrackDefinition**} the newly created track
> 
> 
> **Parameters**
> 
> {**image**} **texture** The texture containg a track
> 
> {**Rectangle**} **region** the portion of the texture to find the track in
> 
> {**string**} **newTrackName** the name to give the generated track
> 
> 

---

####  Getlength(newTrack) [static]
> to use write **TrackHelper.Getlength(newTrack)**
> 
> Determines the length of the track in pixels and also pre-calculates
> 
> the ratio points/length for update calculations
> 
> 
> **Parameters**
> 
> {**TrackDefinition**} **newTrack** track definition to approximate the length of
> 
> 

---

####  Join(newTrackName, tracks) [static]
> to use write **TrackHelper.Join(newTrackName, tracks)**
> 
> Creates a new track which is made up of the points from all the tracks specified int the
> 
> array tracks, starting with the first track and adding points from each subsequent one
> 
> 
> returns {**TrackDefinition**} a new track definition containing the points of all the tracks given
> 
> 
> **Parameters**
> 
> {**string**} **newTrackName** The name of the track created
> 
> {**[]TrackDefinition**} **tracks** an array of tracks to join
> 
> 

---

####  Rawpoints(newTrackName, points) [static]
> to use write **TrackHelper.Rawpoints(newTrackName, points)**
> 
> Creates a track with only the points specified
> 
> 
> returns {**TrackDefinition**} the newly created track Use this to move a sprite to fixed positions
> 
> 
> **Parameters**
> 
> {**string**} **newTrackName** The debug name to give to the track
> 
> {**vector3[]**} **points** The List vector3 of the points you want
> 
> 

---

####  Rotate(existingTrack, origin,  angleX,  angleY,  angleZ) [static]
> to use write **TrackHelper.Rotate(existingTrack, origin,  angleX,  angleY,  angleZ)**
> 
> Rotates the supplied track around an arbitrary point, by the angles given
> 
> 
> **Parameters**
> 
> {**TrackDefinition**} **existingTrack** The track definition to rotate
> 
> {**vector3**} **origin** The rotational centre
> 
> {**float**} **angleX** The rotation in degrees around the X axis
> 
> {**float**} **angleY** The rotation in degrees around the Y axis
> 
> {**float**} **angleZ** The rotation in degrees around the Z axis You should ideally rotate around each axis separately
> 
> 

---

####  Rotate(existingTrack, origin, angles) [static]
> to use write **TrackHelper.Rotate(existingTrack, origin, angles)**
> 
> Rotates a track around a central position by the given angles specifed
> 
> 
> **Parameters**
> 
> {**TrackDefinition**} **existingTrack** The name of the track to rotate
> 
> {**vector3**} **origin** the centre of rotation
> 
> {**vector3**} **angles** the x, y and z axis rotation amounts specified as a vector3 You should ideally rotate around each axis separately
> 
> 

---

####  Smooth(newTrackName,  numberOfpoints, points) [static]
> to use write **TrackHelper.Smooth(newTrackName,  numberOfpoints, points)**
> 
> Creates a smoothed off track based on the points given.
> 
> As this is a Beizer curve the points at the ends as control points bounding the curve
> 
> 
> returns {**TrackDefinition**} the newly created track
> 
> 
> **Parameters**
> 
> {**string**} **newTrackName** The debug name to give the track
> 
> {**int**} **numberOfpoints** The number of points to give the track
> 
> {**vector3[]**} **points** The List vector3 of the points you want to create the track from
> 
> 

---

####  SpeedForTime(track, timePeriod) [static]
> to use write **TrackHelper.SpeedForTime(track, timePeriod)**
> 
> Calculates the speed required to traverse a specified track in the timeperiod given
> 
> 
> returns {**float**} The speed required in pixels per second
> 
> 
> **Parameters**
> 
> {**TrackDefinition**} **track** The track to traverse
> 
> {**float**} **timePeriod** The time you want to take moving along the track
> 
> 

---

####  Spiral(newTrackName,numberOfpoints,centre,radiusX,radiusY,smallestRadius,revolutions,startZ,endZ) [static]
> to use write **TrackHelper.Spiral(newTrackName,numberOfpoints,centre,radiusX,radiusY,smallestRadius,revolutions,startZ,endZ)**
> 
> Creates a spiral shape
> 
> 
> returns {**TrackDefinition**}
> 
> 
> **Parameters**
> 
> {**string**} **newTrackName** The debug name of the track
> 
> {**int**} **numberOfpoints** number of points required along the track
> 
> {**vector3**} **centre** The centre of the spiral
> 
> {**float**} **radiusX** the horizontal radius
> 
> {**float**} **radiusY** the vertical radius
> 
> {**float**} **smallestRadius** the smallest value wanted for either radius. the rate at which the radii shrink is determined by this and number of revolutions
> 
> {**float**} **revolutions** number of revolutions you want, this can be a fractional value 1.5f would be a spiral with 1 and half turns
> 
> {**float**} **startZ** The starting Z value (depth into the screen)
> 
> {**float**} **endZ** The ending z value (depth into the screen)
> 
> 

---

####  Translate(existingTrack,  x,  y,  z) [static]
> to use write **TrackHelper.Translate(existingTrack,  x,  y,  z)**
> 
> moves a track in the X, y and z positions specified
> 
> 
> **Parameters**
> 
> {**TrackDefinition**} **existingTrack** The track definition to translate
> 
> {**float**} **x** the amount in the x direction to move the track
> 
> {**float**} **y** the amount in the y direction to move the track
> 
> {**float**} **z** the amount in the z direction to move the track
> 
> 

---

####  Translate(existingTrack, translation) [static]
> to use write **TrackHelper.Translate(existingTrack, translation)**
> 
> moves a track in the x, y and z positions specified in the vector3 value, adjust all positions in the track
> 
> 
> **Parameters**
> 
> {**TrackDefinition**} **existingTrack** The track definition to translate
> 
> {**vector3**} **translation** A vector3 value containing the x, y and z movements for track
> 
> 

---

####  points(newTrackName, numberOfpoints, points) [static]
> to use write **TrackHelper.points(newTrackName, numberOfpoints, points)**
> 
> Creates a track based on a sequence of points, you
> 
> set them the same for a level track
> 
> 
> returns {**TrackDefinition**} the newly created track you can use this to make specific paths for sprites to follow
> 
> 
> **Parameters**
> 
> {**string**} **newTrackName** The debug name of the track to create
> 
> {**int**} **numberOfpoints** How many points you want the entire track to contain (they are distributed along the entire track length, the more points the more flexability you have with speeds travelling along the path
> 
> {**[]vector3]**} **points** a list of points defining the fixed position along the track
> 
> 

---

####  pointsForceZ(newTrackName, numberOfpoints, points, forcedZ) [static]
> to use write **TrackHelper.pointsForceZ(newTrackName, numberOfpoints, points, forcedZ)**
> 
> Generates a track with a number of points overriding the z value
> 
> 
> returns {**TrackDefinition**} the newly created track
> 
> 
> **Parameters**
> 
> {**string**} **newTrackName** The debug name of the track
> 
> {**int**} **numberOfpoints** How many points you want the entire track to contain (they are distributed along the entire track length, the more points the more flexability you have with speeds travelling along the path
> 
> {**[]vector3**} **points** The points which define the track
> 
> {**float**} **forcedZ** The z value to set all the points to
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
