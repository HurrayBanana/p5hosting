engine created by Hurray Banana &copy;2023-2024
## class EndOfTrackAction
> States what should happen when a sprite reaches the end of its current track
> 
> 

---

## properties
####   kill [static]
> default value **"kill"**
> 
> to use write **EndOfTrackAction.kill**
> 
> kill the sprite at the end of the track
> 
> Can use for explosion effects in conjuction with a Sprite funeral
> 
> 

---

####   wrap [static]
> default value **"wrap"**
> 
> to use write **EndOfTrackAction.wrap**
> 
> start again on the current track
> 
> Useful for fancy menu like sega 3d ones for name entry
> 
> 

---

####  detach [static]
> default value **"detach"**
> 
> to use write **EndOfTrackAction.detach**
> 
> forces the sprite to leave the track and continue in the direction it was last moving
> 
> Nice to use if you turn gravity on for a sprite once its detached if you use
> 
> an OnTrackEnd handler to alter the sprites properties
> 
> 

---

####  next [static]
> default value **"next"**
> 
> to use write **EndOfTrackAction.next**
> 
> move on to the start of the next track
> 
> Use if you want a sprite to follow a specific sequence of tracks.
> 
> The order is governed by the order you used the Sprite.AddTrack() methods
> 
> 

---

####  random [static]
> default value **"random"**
> 
> to use write **EndOfTrackAction.random**
> 
> at end of track pick another track from those associated with the Sprite
> 
> Great for random boss movement patterns
> 
> 

---

####  reverse [static]
> default value **"reverse"**
> 
> to use write **EndOfTrackAction.reverse**
> 
> go backwards along the current track
> 
> Nice to use for display or target type tracks
> 
> 

---

####  stop [static]
> default value **"stop"**
> 
> to use write **EndOfTrackAction.stop**
> 
> Halt sprite at the end of the track
> 
> Use if you want a sprite to travel to the end and the stop and do something
> 
> like launch a bullet at the player (see the yellow circular star force enemies)
> 
> use in conjuction with OnTrackEnd handler. After firing you can ask the Sprite to
> 
> follow a second track to move off screen again.
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
