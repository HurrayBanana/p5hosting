
 /******************************
   * messagebus.js by Hurray Banana 2023-2024
   ******************************/ 
/** 
 * @classdesc list of static message types to send or subscribe to 
 * 
 * add your own messages here give it a name and set it to a string with the same name.
 * this will help with debugging. These are just examples, create your own with an inherited class (I usually call this mymess)
 * 
 * Use a JsDoc comment (/** ending with an asterisk forward slash) above each static message with details of the data that will be sent by the message bus
 * can't directly show in this example because it breaks the JsDoc comment !
 * @example
 * class mymess extends msgT{
 *   // data {score:1234,player:"blinky"} 
 *   static scored = "scored";
 *   // data {pos:vector3} 
 *   static clydepos = "clydepos";
 *   // data {loc:{x:int,y:int}} 
 *   static placeinky = "placeinky";
 *   // data {loc:{x:int,y:int}} 
 *   static targettest = "targettest";
 *   // no data required 
 *   static move = "move";
 *   // data {loc:{x:int,y:int},di:Tilemap.Direction} 
 *   static pacman = "pacman";
 *   // data {loc:{x:int,y:int}} 
 *   static blinky = "blinky";
 *}
*/
class msgT{
    /** 
     * data {x:float,y:float}
     * used for any object wanting to track player positions
     * @example
     * data {x:999,y:999};
    */
    static playerData = "playerData";
    /** 
     * data {col:[r,g,b]};
     * @example
     * //magenta
     * data {col:[255,0,255]};
    */
    static colour = "colour";
    /** 
     * data {score:int,player:string} 
     * @example
     * //blinky scored 1234 points
     * data {score:1234,player:"blinky"};
    */
    static scored = "scored";
    /** 
     * data {sp:object} 
     * use for sending references to a sprite so various info can be examined
     * e.g. frame info, or other states for cloning
     * @example
     * //send entire sprite reference
     * data {sp:this};
    */
    static spriteinfo = "spriteinfo"

}
/** 
 * @classdesc class allowing the subscription (receiving) and broadcasting of messages
 * 
 * this allows objects to reduce/remove dependencies on each other and allow sprites and other components to receive information
 * messages without needing to know directly where they have come from
 *  
 * this can allow the UI system to receive data without the sender having knowledge of the UI
 * and vice versa
 * 
 * messages can also be sent from HTML elements using onclick or similar events
 */
class MsgBus{
    static #subs = {};
    
    /** subscribe to a specfic type of message broadcast, you can have as many different subscribers to the same message. the sender does not need to know who's listening
     * @param {msgT} messageType the type of message being subscribed to (this ensure only subscribers of that message type recieve the message)
     * @param {method|function} handler the method or function that handles this message, make sure it accepts a data parameter if the message type sends data, or you are interested in the data
     * @param {object} instance the object instance whose method is accepting this message. If this is a global function put null for this value
     * @example
     * //subscribing from an object instance
     * MsgBus.sub(msgT.arrows, this.toggleArrows, this);
     * 
     * //subscrbing from a sketch in instance mode
     * MsgBus.sub(msgT.playerData, s.acceptPlayerData, s);
     * 
     * MsgBus.sub(msgT.colour, acceptcolour, s);
     * 
     * //subscribe to a message in a standard sketch (no instance required), 
     * //just supply message type and the function to accept the broadcast
     * MsgBus.sub(msgT.scored, acceptscore, null);
     */
    static sub(messageType, handler, instance){
        //attempt to get array of this message type from the map
        let callbacks = this.#subs[messageType];
        //not been seen before so make an array
        if (callbacks === undefined) {
            callbacks = [];
        }
        //add subscriber object to array
        callbacks.push({handler,instance})
        //set message type array to this new array
        this.#subs[messageType] = callbacks;
    }

    /**
     *  removes all message subscriptions for a particular message type
     * @param {msgT} messageType type of message to remove subscribers from
     */
    static dropall(messageType){
        if (messageType !== undefined){
            this.#subs[messageType] = undefined;
        } else {
            this.#subs = {};
        }
    }

    /** drops a specific subscription
     * 
     * this is important if you are destroying an object as the subscription will still receive
     * broadcasts even if you have "removed" the object as the Garbage Collector (GC) will keep objects
     * alive if there are ANY references to them
     * @example
     * //remove the handler for the arrows message that calls this
     * //objects toggleArrows method
     * MsgBus.drop(msgT.arrows, this.toggleArrows, this);
     */
    static drop(messageType, handler, instance){
        let callbacks = this.#subs[messageType];
        if (callbacks != null) {
            let p = 0;
            while (p < callbacks.length && callbacks[p].handler !== handler && callbacks[p].instance !== instance ){
                p++;
            }
            if (p < callbacks.length) {   
                callbacks.splice(p,1);
                this.#subs[messageType] = callbacks;
            } 
        }
    }
    /** broadcasts a message to any (or no) subscribers
     * 
     * package the messages data using an object literal if you require more than a single value(or no value) name value pairs separated by commnas and enclosed in braces
     *  @example
     *  //packaging x and y data message type playerData
     *  MsgBus.send(msgT.playerData,{x:pos.x,y:pos.y});
     * 
     *  //packaging 3 values 
     *  MsgBus.send(msgT.droppedNewNode,{name:this.name,x:this.x,y:this.y});
     * 
     *  //sending a message with a just a reference to the html object that sent it, suing the onclick event from HTML
     *  onclick="MsgBus.send(msgT.console,this);"
     * 
     *  //sending a message with no data that indicates something general happened
     *   MsgBus.send(msgT.quit);
     */
    static send(messageType, data){
        //get messageType from map if possible
        let callbacks = this.#subs[messageType];
        //iterate through those that do exist
        if (callbacks !== undefined) {
            for (let p = 0; p < callbacks.length; p++){
                let {handler,instance} = callbacks[p];
                handler.call(instance, data);
            }
        }
    }

    /**
     * returns a debug string array containing an entry for each actively subscribed message types
     * also includes information on each subscriber. 
     * 
     * If no subscribers then null is returned
     * @returns {string[]}
     */
    static debugdisplayFull(){
        let q = Object.keys(this.#subs);
        if (q.length == 0){return null;}
        let keys = [];
        for (let p = 0; p < q.length; p++){
          let r = this.#subs[q[p]];
          let outty = "msgT." + q[p] + "=>";
          if (r !== undefined){
            for (let k = 0; k < r.length; k++){
              if (r[k].instance !== null)
                outty += " (" + r[k].instance.constructor.name + "." + r[k].handler.name + ") ";
              else
                outty += " (window." + r[k].handler.name + ") ";
            }
          } else { outty += " empty";}
          keys.push(outty);
        }
        return keys;
    }
    /**
     * returns a debug string containing all actively subscribed messages
     * @returns {string}
     */
    static debugdisplayLite(){
        let q = Object.keys(this.#subs);
        if (q.length == 0){return null;}
        let keys = [];
        for (let p = 0; p < q.length; p++){
          let r = this.#subs[q[p]];
          if (r !== undefined){
            keys.push(q[p]);
          }
        }
        return outty;
    }
}

//ADD DICTIONARY OUTPUT TO DEBUGG MESSAGE