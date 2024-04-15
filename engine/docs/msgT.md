> ### class msgT
> list of static message types to send or subscribe to
> 
> add your own messages here give it a name and set it to a string with the same name.
> 
> this will help with debugging. These are just examples, create your own with an inherited class (I usually call this mymess)
> 
> Use a JsDoc comment ( ending with an asterisk forward slash) above each static message with details of the data that will be sent by the message bus
> 
> can't directly show in this example because it breaks the JsDoc comment !
> 
> 

---

> #### static playerData = "playerData"
> data {x:float,y:float}
> 
> used for any object wanting to track player positions
> 
> ```js
> example
>       data {x:999,y:999};
>     
> ```
> 

---

> #### static colour = "colour"
> data {col:[r,g,b]}
> 
> ```js
> example
>       //magenta
>       data {col:[255,0,255]};
>     
> ```
> 

---

> #### static scored = "scored"
> data {score:int,player:string}
> 
> ```js
> example
>       //blinky scored 1234 points
>       data {score:1234,player:"blinky"};
>     
> ```
> 

---

> #### static spriteinfo = "spriteinfo"
> data {sp:object}
> 
> use for sending references to a sprite so various info can be examined
> 
> e.g. frame info, or other states for cloning
> 
> ```js
> example
>       //send entire sprite reference
>       data {sp:this};
>     
> ```
> 

---

