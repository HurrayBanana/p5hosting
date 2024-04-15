> ### class EndOfTrackAction
> States what should happen when a sprite reaches the end of its current track
> 
> 

---

> #### static random = "random"
> at end of track pick another track from those associated with the Sprite
> 
> Great for random boss movement patterns
> 
> 

---

> #### static detach = "detach"
> forces the sprite to leave the track and continue in the direction it was last moving
> 
> Nice to use if you turn gravity on for a sprite once its detached if you use
> 
> an OnTrackEnd handler to alter the sprites properties
> 
> 

---

> #### static  wrap = "wrap"
> start again on the current track
> 
> Useful for fancy menu like sega 3d ones for name entry
> 
> 

---

> #### static reverse = "reverse"
> go backwards along the current track
> 
> Nice to use for display or target type tracks
> 
> 

---

> #### static  kill = "kill"
> kill the sprite at the end of the track
> 
> Can use for explosion effects in conjuction with a Sprite funeral
> 
> 

---

> #### static next = "next"
> move on to the start of the next track
> 
> Use if you want a sprite to follow a specific sequence of tracks.
> 
> The order is governed by the order you used the Sprite.AddTrack() methods
> 
> 

---

> #### static stop = "stop"
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

