engine created by Hurray Banana &copy;2023-2024
## class MsgBus
> class allowing the subscription (receiving) and broadcasting of messages
> 
> this allows objects to reduce/remove dependencies on each other and allow sprites and other components to receive information
> 
> messages without needing to know directly where they have come from
> 
> this can allow the UI system to receive data without the sender having knowledge of the UI
> 
> and vice versa
> 
> messages can also be sent from HTML elements using onclick or similar events
> 
> 

---

## Methods
####  debugdisplayFull() [static]
> to use write **MsgBus.debugdisplayFull()**
> 
> returns a debug string array containing an entry for each actively subscribed message types
> 
> also includes information on each subscriber.
> 
> If no subscribers then null is returned
> 
> 
> returns {**string[]**}
> 
> 

---

####  debugdisplayLite() [static]
> to use write **MsgBus.debugdisplayLite()**
> 
> returns a debug string containing all actively subscribed messages
> 
> 
> returns {**string**}
> 
> 

---

####  drop(messageType, handler, instance) [static]
> to use write **MsgBus.drop(messageType, handler, instance)**
> 
> drops a specific subscription
> 
> this is important if you are destroying an object as the subscription will still receive
> 
> broadcasts even if you have "removed" the object as the Garbage Collector (GC) will keep objects
> 
> alive if there are ANY references to them
> 
> ```js
> example
>       //remove the handler for the arrows message that calls this
>       //objects toggleArrows method
>       MsgBus.drop(msgT.arrows, this.toggleArrows, this);
>      
> ```
> 

---

####  dropall(messageType) [static]
> to use write **MsgBus.dropall(messageType)**
> 
> removes all message subscriptions for a particular message type
> 
> 
> **Parameters**
> 
> {**msgT**} **messageType** type of message to remove subscribers from
> 
> 

---

####  send(messageType, data) [static]
> to use write **MsgBus.send(messageType, data)**
> 
> broadcasts a message to any (or no) subscribers
> 
> package the messages data using an object literal if you require more than a single value(or no value) name value pairs separated by commnas and enclosed in braces
> 
> ```js
> example
>        //packaging x and y data message type playerData
>        MsgBus.send(msgT.playerData,{x:pos.x,y:pos.y});
>       
>        //packaging 3 values 
>        MsgBus.send(msgT.droppedNewNode,{name:this.name,x:this.x,y:this.y});
>       
>        //sending a message with a just a reference to the html object that sent it, suing the onclick event from HTML
>        onclick="MsgBus.send(msgT.console,this);"
>       
>        //sending a message with no data that indicates something general happened
>         MsgBus.send(msgT.quit);
>      
> ```
> 

---

####  sub(messageType, handler, instance) [static]
> to use write **MsgBus.sub(messageType, handler, instance)**
> 
> subscribe to a specfic type of message broadcast, you can have as many different subscribers to the same message. the sender does not need to know who's listening
> 
> 
> **Parameters**
> 
> {**msgT**} **messageType** the type of message being subscribed to (this ensure only subscribers of that message type recieve the message)
> 
> {**method|function**} **handler** the method or function that handles this message, make sure it accepts a data parameter if the message type sends data, or you are interested in the data
> 
> {**object**} **instance** the object instance whose method is accepting this message. If this is a global function put null for this value
> 
> ```js
> example
>       //subscribing from an object instance
>       MsgBus.sub(msgT.arrows, this.toggleArrows, this);
>       
>       //subscrbing from a sketch in instance mode
>       MsgBus.sub(msgT.playerData, s.acceptPlayerData, s);
>       
>       MsgBus.sub(msgT.colour, acceptcolour, s);
>       
>       //subscribe to a message in a standard sketch (no instance required), 
>       //just supply message type and the function to accept the broadcast
>       MsgBus.sub(msgT.scored, acceptscore, null);
>      
> ```
> 

---

engine created by Hurray Banana &copy;2023-2024
