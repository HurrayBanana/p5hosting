/******************************
 * timer.js by Hurray Banana 2023-2024
 ******************************/ 
/**
 * @classdesc
 * provides central timing update support for both
 * stock events (Event) and sprite specific events (Timer)
 */
class EventManager{
    /** list of actively managed Events */
    #timers = null;
    /** initialises the event manager */
    constructor(){
        this.#timers = [];
    }

    /**
     * adds given timer to be managed
     * @param {Timer|Event} timer 
     */
    add(timer){
        this.#timers.push(timer);
    }
    /**
     * Removes a specific timer from the eventmanager
     * @param {Timer|Event} timer 
     */
    remove(timer){
        for (let p = 0; p < this.#timers.length; p++){
            if (this.#timers[p] == timer){
                this.#timers[p].remove();
            }
        }
    }
    /**
     * removes all timers except for the given one, this may need to be active after some mode as ended
     * @param {Timer|Event} timer 
     */
    removeallBut(timer){
        //write this to remove all the timers and just make a new array, not finished yet
        if (Array.isArray(timer)){

        } else {
            for (let p = 0; p < this.#timers.length; p++){
                if (this.#timers[p] != timer){
                    this.#timers[p].remove();
                }
            }            
        }
    }
    /** performs the update of all managed timers and events */
    update(){
        for (let p = 0; p < this.#timers.length; p++){
            const t = this.#timers[p];
            t.update();
        }
        //remove stuff
        let p = this.#timers.length - 1;
        while (p >= 0){
            if (this.#timers[p].action == EventAction.remove){
                this.#timers[p].cleanup();
                this.#timers.splice(p,1);
            } 
            p--;
        }
    }
    /**gets a concise list of all actively managed timers and events
     * @returns {string[]} an array of timer data
     */
    get activeLite(){
        let a = [];
        for (let p = 0; p < this.#timers.length; p++){
            const t = this.#timers[p];
            a.push(t.name + " [" + t.action + "]");
        }
        return a;
    }
    /**gets a list of all actively managed timers and events including details of elapsed time and intervals set
     * @returns {string[]} an array of timer data
     */
    get activeLiteData(){
        let a = [];
        for (let p = 0; p < this.#timers.length; p++){
            const t = this.#timers[p];
            
            a.push(t.name + " [" + t.action + "] " +
            "lapse[" + this.twodp(t.elapsedTime) + "] " +
            "int[" + 
             (t.startafterinterval !== undefined ? this.twodp(t.startafterinterval) : "--") + ":" +
             (t.stopafterinterval !== undefined ? this.twodp(t.stopafterinterval) : "--" ) + "]");
        }
        return a;
    }
    /**
     * Specific version of fixing a float to 2dp with 0 front padding, used by the event debugger
     * @param {float} val 
     * @returns {string} a padded string
     */
    twodp(val){
        val = (val * 100) | 0;
        let x = ("" + val).length;
        val /= 100;
        let t =  val.toString();
        return t.padEnd(x+1,"0");
    }
}

/**
 * @classdesc Basic Event/Timer actions
 */
class EventAction{
    static remove = "remove";
    /**no timing action */
    static none = "none";
    /**acts as a timer, for setting time intervals (like button repeats)
     * 
     * has to be checked using elapsed
     * @example 
     */
    static interval = "timer";
    /** calls a function/method after time period has elapsed */
    static eventonce = "eventonce";
    /** calls a function/method periodically*/
    static event = "event";
    /**and event that fires periodically and stops after a given period of time */
    static eventStopafter = "eventStopafter";
}
/**
 * @classdesc base functionality for general timing events
 */
class Event{
    /**
     * 
     * @param {string} name debug display for event
     */
    constructor(name){
        if (name instanceof Sprite)  name = "spr:" + name.myid;
        this.name = (name !== undefined) ? name: "-";
        this.#action = Action.none;

        Engine.eventM.add(this);
        //NEED TO ADD TO EVENTMANAGER FOR AUTO UPDATING
    }
    /** performs any cleanup for the time, you might need this if you create a custom event or timer that 
     * consumes resources that it needs to de-reference. Create an overloaded method in your inherited class
     * It will be called automatically when the Event/Timer is removed
     */
    cleanup(){
        //shouldn't need (there in case future change)
    }
    /** requests removeall of this event */
    remove(){
        this.cleanup();
        this.action = EventAction.remove;
    }
    /**
     * debugging name for displaying timers
     * @type {string}
     */
    name;
    /** holds time elapsed during the current interval @type {float} */
    #elapsedTime;
    /**
     * gets the timer period that elapsed for this Event/Timer so far
     * @returns {float}
     */
    get elapsedTime(){return this.#elapsedTime;}
    /**
     * sets the elpasedTime for the Event/Timer you should'nt need to use this unless you to set a specific starting point rather then
     * zeroing which reset() does
     * @param {float} value 
     */
    set elapsedTime(value){this.#elapsedTime = value;}
    //** true if the elapsed time is greater than the set interval */
    get elapsed(){return this.#elapsedTime >= this.#startafterinterval;}
    /** returns true if the timer interval has elapsed and then resets it to zero
     * use elapsedResetAccrued if you want to accurately take account of fractional time span accruel
     * returns false if the timer interval has not elapsed
     * 
     * Use this with timers to control auto fire or key delay, these are particularly useful
     * for your own custom timers that you update yourself
     * @example
     * //setup a custom timer in the sprites constructor for auto fire/shoot interval restriction
     * this.shoottimer = new Timer(this)
     * this.shoottimer.interval(0.25);
     * 
     * //in an update method add this sort of code to check for keypress and timer elapsed
     * if (keyIsDown(this.kshoot) && this.shoottimer.elapsedReset){
     *      this.shoot();
     * }
     * @returns {bool} has it elapsed or not
     */
    get elapsedReset(){
        if (this.#elapsedTime >= this.#startafterinterval){
            this.#elapsedTime = 0;
            return true;
        } else {return false;}
    }
    /**
     * Checks the timer to see if it has elapsed, if it has then the interval time is substracted from the elapsed time
     * this factors in time differences between updates and . Use elpasedReset if you just want the elapsed time to zero (key delays)
     * @returns {bool} has it elapsed or not
     */
    get elapsedResetAccrued(){
        if (this.#elapsedTime >= this.#startafterinterval){
            this.#elapsedTime -= this.#startafterinterval;
        return true;
        } else {return false;}
    }
    /** resets thecurrent timer (if active) */
    reset(){this.#elapsedTime = 0;}

    /** holds the interval for either the start of a timing process or the activation of a timer or event @type {float}*/
    #startafterinterval;
    /**
     * gets the basic interval of a timer or the start phase interval or a timer
     * @returns {float}
     */
    get startafterinterval(){return this.#startafterinterval;}
    /**
     * sets the basic interval of a timer or the start phase interval or a timer
     * @param {float} value
     */
    set startafterinterval(value){this.#startafterinterval = value;}
    /** holds the action stopping interval @type {float} */
    #stopafterinterval;
    /**
     * gets the interval for an action stopping
     * @returns {float}
     */
    get stopafterinterval(){return this.#stopafterinterval;}
    /**
     * sets the interval for an action stopping
     * @param {float} value
     */
    set stopafterinterval(value){return this.#stopafterinterval = value;}

    /** holds an event interval used mainly in visibility testing @type {float}*/
    #actionTime;
    /**
     * internal timing information for checking visiblility
     * @returns {float}
     */
    get actionTime(){return this.#actionTime;}
    /**
     * internal timing information for checking visiblility, do not modify
     * @returns {float}
     */
    set actionTime(value){this.#actionTime = value;}
    /** holds the current action of the event/timer @type {EventAction}*/
    #action;
    /**
     * gets the active mode of the event/timer
     * @returns {EventAction}
     */
    get action(){return this.#action;}
    /**
     * sets the event/timers action mode, this is set when you pick how the timer should operate, do not change directly
     * @param {EventAction} value 
     */
    set action(value){this.#action = value;}
    /**
     * true if a timer is active 
     * @returns {bool} 
     * */
    get active(){return this.#action != EventAction.none;}
    /** holds the callback executed when the event/timer meets its interval @type {callback:method|function,instance:object}*/
    #callback = null;
    /** retrieves the current callback (if this has not been set it will be null)
     * it will be in the form of object properties
     * @example 
     * // two propeties callback and instance
     * let callstuff = this.timer.callback;
     * if (callstuff != null) console.log(callstuff.callback, callstuff.instance);
     * @returns {{callback:method|function,instance:object}}
     */
    get callback(){return this.#callback;}
    /** sets (or changes) the callback handler called when animation states reach an end point
     * value must be an object with 2 properties
     * @example 
     * // animationchanged is a method of your inherited sprite class
     * this.callback = {callback:this.myactions,instance:this};
     * // or use the Engine.makeCallback() method
     * this.callback = Engine.makeCallback(this.myactions, this);
     */
    set callback(value){
      if (value != undefined && value.callback !== undefined && value.instance !== undefined){
        this.#callback = value;
      }
    }
    /** 
     * If a event/timer is set repeatidly it will continually reset. In my cases this would be undeserable
     * but in certain circumstances such as mouse over effects that use a timer to revert an animation frame, you might want to keep 
     * restarting the timer while the mouse is over the sprite. it removes the need for more complex logic to deal with this case
     * gets the status of timer overwrites, default is false, rejecting multiple setting of timers
     * @returns {bool}*/
    get allowOverwrite(){return this.#allowoverwrite;}
    /**
     * sets the response to identical timer settings for active timers, true means allow it to be overwritten (effectively reset), flase means
     * reject
     * @param {bool} value 
     */
    set allowOverwrite(value){this.#allowoverwrite = value;}
    #allowoverwrite = false;
    /** 
     * allows the resetting of a timer (time starts again)
     * 
     * this might be desirable if you are doing a mouse over effect, where a rendering resets to not over
     * view after 0.2 seconds, but you keep restarting the timer while you are over the sprite
     * default behaviour is false (ignore duplicates)
     */
    overwriteEnable(){this.#allowoverwrite=true;}
    /** 
     * turns off overwrite of duplicate timers  
     * default behaviour is false (ignore duplicates)
    */
    overwriteDisable(){this.#allowoverwrite=false;}
    /**
     * Sets the time interval for the Event, you only need to do this if you are creating a timer for your own purposes such a key delay timer
     * which you used ElapsedReset to check for the interval elapsing.
     * 
     * If you want to call a method or function after a time interval then use timer.eventonce()
     * @param {float} time 
     */
    interval(time){
        this.#action = Action.interval;
        this.actionTime = 0; this.elapsedTime = 0;
        this.startafterinterval = time;
    }
    /**
     * Delays calling a method or function until after a period of time
     * @param {float} callAfter time to wait before calling method/function
     * @param {{callback:method|function,instance:object}} callback the code to call when the event occurs use 
     * Engine.makeCallback() to create your callback
     * @example
     * //call the startgame method after 3 seconds
     * Engine.eventM.eventonce(3, Engine.makeCallback(this.startgame, this));
     */
    eventonce(callAfter, callback){//} instance, callme){
        if (this.#allowoverwrite || this.#action != Action.callback){
            this.#action = Action.eventonce;
            this.startafterinterval = callAfter;
            this.actionTime = 0; this.elapsedTime = 0;
            //this.#phase = Phase.startafter;
            this.#callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.#callback = {callback:callme,instance:instance};
            // }
        }
    }
    /**
     * creates a periodic timer which continually calls a given method/function
     * @param {float} interval time to wait before calling method/function
     * @param {{callback:method|function,instance:object}} callback the code to call when the event occurs use 
     * Engine.makeCallback() to create your callback
     * @example
     * //call the increaseDifficulty method every 20 seconds
     * Engine.eventM.event(203, Engine.makeCallback(this.increaseDifficulty, this));
     * to stop calling the method/function use the events remove() method
     */
    event(interval, callback){//instance, callme){
        if (this.#allowoverwrite || this.#action != Action.event){
            this.#action = Action.event;
            this.startafterinterval = interval;
            this.actionTime = 0; this.elapsedTime = 0;
            //this.#phase = Phase.startafter;
            
            this.#callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.#callback = {callback:callme,instance:instance};
            // }
        }
    }
    /**
     * creates a periodic timer which continually calls a given method/function until a specified time is reached
     * @param {float} interval time to wait before calling method/function
     * @param {float} stopAfter period of time to wait before stopping the event
     * @param {{callback:method|function,instance:object}} callback the code to call when the event occurs use 
     * Engine.makeCallback() to create your callback
     * @example
     * //call the spawnEnemy method every 1second for 20 seconds
     * Engine.eventM.eventStopafter(1,20, Engine.makeCallback(this.spawnEnemy, this));
     * to stop calling the method/function use the events remove() method
     * to stop calling the method/function use the events remove() method
     */
    eventStopafter(interval, stopAfter, callback){//instance, callme){
        if (this.#allowoverwrite || this.#action != Action.eventStopafter){
            this.#action = Action.eventStopafter;
            this.startafterinterval = interval;
            this.#stopafterinterval = stopAfter;
            this.actionTime = 0; this.elapsedTime = 0;
            //this.#phase = Phase.startafter;
            this.#callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.#callback = {callback:callme,instance:instance};
            // }
        }
    }    
    /** updates timer checking for action responses */
    update(){
        if (this.action != Action.none){
            //new timing system
            this.#elapsedTime += Engine.delta;
            this.actionTime += Engine.delta;
            switch (this.action){
                case Action.interval: break;
                case Action.eventonce:
                    if (this.#elapsedTime >= this.startafterinterval){
                        //this.action = Action.none;
                        //this.action = Action.remove;
                        Engine.processCallback(this.callback);
                        this.remove();
                    } break;
                case Action.event:
                    if (this.#elapsedTime >= this.startafterinterval){
                        this.#elapsedTime -= this.startafterinterval;
                        Engine.processCallback(this.callback);
                    } break;
                case Action.eventStopafter:
                    if (this.actionTime > this.#stopafterinterval){
                        //this.action = Action.none;
                        //this.action = Action.remove;
                        this.remove();
                    } else {
                        if (this.#elapsedTime >= this.startafterinterval){
                            this.#elapsedTime -= this.startafterinterval;
                            Engine.processCallback(this.callback);
                            } 
                    } break;
            }//switch (_method)
        }//if (_method != Style.none)
    }//update(delta)
}
/** 
 * @classdesc Determines what phase timer sub system is in (used internally) */
class Phase{
    /** waiting for flashing to start*/
    static startafter = "startafter";
    /** waiting for flashing to stop*/
    static stopafter = "stopafter";
    /** waiting to kill sprite*/
    //static killafter = "killafter";
}
/** 
 * @classdesc specifies sprite actions for timer operations */
class Action extends EventAction{
    /**kills the sprite after time elapsed */
    static killafter = "killafter";
    /**flashes continuously */
    static flash = "flash";
    ///**no timing action */
    //static none = "none";
    ///**acts as a timer, for setting time intervals (like button repeats)
    // * 
    // * has to be checked using elapsed
    // * @example 
    // */
    //static interval = "timer";
    ///** calls a function/method after time period has elapsed */
    //static eventonce = "eventonce";
    ///** calls a function/method periodically*/
    //static event = "event";
    ///**and event that fires periodically and stops after a given period of time */
    //static eventStopafter = "eventStopafter";
    /** flashes until the stopAfter period has elapsed then stays on screen*/
    static flashStopafter = "flashStopafter";
    /**starts flashing after a period of time then continues flasing */
    static flashStartafter = "flashStartafter";
    /**flashes until the stop period then is killed */
    static flashKillafter = "flashKillafter";
    /**starts flashing after a period of time then stops staying on screen */
    static flashStartafterStopafter = "flashStartafterStopafter";
    /** starts flashing after a period of time then is killed after the kill time
     * 
     * this is useful for time limited pickups (or bombs) where the flashing can be used to indicate time is nearly up
     */
    static flashStartafterKillafter = "flashStartafterKillafter";
    /**makes a sprite invisible and then shows it after the time period elapses */
    static showafter = "showafter";
    /**makes a sprite visible and then hides it after the time period elapses */
    static hideafter = "hideafter";
    /**apply a velocity for a period of time */
    static impulse = "impulsestopafter";
}
/** 
 * @classdesc implements sprite specific timers (you can only have one)
 * If you need more sprite specific ones, create another timer, 
 * but make sure you create and update method that calls the timers update method
 * 
 * I may refactor this to be part of a eventmanager class so all timer subsystems will use a common structure
 */
class Timer extends Event{
    /** holds reference to the sprite being manipulated by the timer @type {Sprite} */
    #mysprite
    /** holds time interval for on time during flashing @type {float}*/
    #oninterval;
    /** holds time interval for off time during flashing  @type {float}*/
    #offinterval;
    /** holds visibility state of the sprite @type {bool}*/
    #hidden;
    /** holds phase of timing for multi step actions @type {Phase} */
    #phase;
    /** holds force to apply during impulse timers @type {vector3} */
    #impulse;
    /**
     * get the current phase of timer action, you can use this during callbacks
     * @returns {Phase}
     */
    get phase(){return this.#phase;}

    /**
     * Constructs and new sprite timer
     * @param {Sprite} sprite the sprite associated with the sprite timers
     */
    constructor(sprite){
        super("spr:" + sprite.myid);
        this.#mysprite = sprite;
        //this.action = Action.none;
    }
    /** 
     * removes sprite reference when timer removed, override this if you create an inherited timer that adds more resources */
    cleanup(){
        super.cleanup();
        this.#mysprite = null;
    }
    /**
     * disable the timer, choose whether to display or hide the sprite 
     * @param {bool} display if true sprite will be shown, false if not (important if you have been flashing a sprite)
    */
    off(display){
        this.action = Action.none;
        if (display === undefined || display)
            this.#mysprite.show();
        else
            this.#mysprite.hide();
    }
    /**
     * flashes the sprite on and off, duration in seconds (or fraction of)
     * @param {float} onduration number of seconds or fraction of
     * @param {float} offduration number of seconds or fraction of
     * slightly longer on than off looks best
     */
    flash(onduration, offduration){
        if (this.allowoverwrite || this.action != Action.flash){
            this.action = Action.flash;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = false;
        }
    }
    /**
     * flashes and sprite and then stops flashing after a period of time
     * @param {float} stopAfter time to stop flashing in seconds
     * @param {float} onduration number of seconds or fraction of
     * @param {float} offduration number of seconds or fraction of
     * @param {{callback:method|function,instance:object}} callback the code to call when the sprite stops flashing
     * Engine.makeCallback() to create your callback
     */
    flashStopafter(stopAfter, onduration, offduration, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.flashStopafter){
            this.action = Action.flashStopafter;
            this.stopafterinterval = stopAfter;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = false;
            this.#phase = Phase.stopafter;
            
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.#callback = {callback:callme,instance:instance};
            // }
        }
    }
    /**
     * flashes a sprite and then kills it after a period of time
     * @param {float} killAfter seconds after which sprite should be killed off
     * @param {float} onduration number of seconds or fraction of
     * @param {float} offduration number of seconds or fraction of
     */
    flashKillafter(killAfter, onduration, offduration){//}, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.flashKillafter){
            this.action = Action.flashKillafter;
            this.stopafterinterval = killAfter;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = false;
            this.#phase = Phase.stopafter;
            this.#mysprite.show();
            
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.callback = {callback:callme,instance:instance};
            // }
        }        
    }
    /**
     * a sprite to start flashing after a certain period of time
     * @param {float} startAfter how long before flashing starts
     * @param {float} onduration number of seconds or fraction of
     * @param {float} offduration number of seconds or fraction of
     * @param {{callback:method|function,instance:object}} callback the code to call when the sprite starts flashing
     * Engine.makeCallback() to create your callback
     */
    flashStartafter(startAfter, onduration, offduration, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.flashStartafter){
            this.action = Action.flashStartafter;
            this.startafterinterval = startAfter;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = false;
            this.#mysprite.show();
            this.#phase = Phase.startafter;
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.callback = {callback:callme,instance:instance};
            // }
        }
    }
    /**
     * Flashes a sprite after a certain period of time and then kills it after another time period has ended
     * @param {float} killAfter seconds after which sprite should be killed off
     * @param {float} startAfter how long before flashing starts
     * @param {float} onduration number of seconds or fraction of
     * @param {float} offduration number of seconds or fraction of
     * @param {{callback:method|function,instance:object}} callback the code to call when the sprite starts flashing
     * Engine.makeCallback() to create your callback
     */
    flashStartafterKillafter(startAfter, killAfter, onduration, offduration, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.flashStartafterKillafter){
            this.action = Action.flashStartafterKillafter;
            this.startafterinterval = startAfter; this.stopafterinterval = killAfter;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = false;
            this.#mysprite.show();
            this.#phase = Phase.startafter;
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.callback = {callback:callme,instance:instance};
            // }
        }
    }
    /**
     * a visible sprite starts to flash after a period of time, it then stops flashing after a further period of time
     * @param {float} startAfter period of time to start flasher
     * @param {float} stopAfter period of time for flashing to continue before it stops
     * @param {float} onduration number of seconds or fraction of
     * @param {float} offduration number of seconds or fraction of
     * @param {{callback:method|function,instance:object}} callback the code to call when the sprite starts flashing and again when it stops
     * Engine.makeCallback() to create your callback
     */
    flashStartafterStopafter(startAfter, stopAfter, onduration, offduration, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.flashStartafterStopafter){
            this.action = Action.flashStartafterStopafter;
            this.startafterinterval = startAfter; this.stopafterinterval = stopAfter;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = false;
            this.#mysprite.show();
            this.#phase = Phase.startafter;
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.callback = {callback:callme,instance:instance};
            // }
        }
    }
    /**
     * shows the sprite after a period of time has passed
     * @param {float} showAfter number of seconds to wait before showing
     * @param {{callback:method|function,instance:object}} callback the code to call when the sprite is shown
     * Engine.makeCallback() to create your callback
     */
    showafter(showAfter, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.showafter){
            this.action = Action.showafter;
            this.startafterinterval = showAfter;
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = true;
            this.#mysprite.hide();
            this.#phase = Phase.startafter;
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.callback = {callback:callme,instance:instance};
            // }
        }
    }
    /**
     * Hides the sprite after a period of time has passed
     * @param {float} hideAfter number of seconds to wait before hiding
     * @param {{callback:method|function,instance:object}} callback the code to call when sprite is hidden
     * Engine.makeCallback() to create your callback
     */
    hideafter(hideAfter, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.hideafter){
            this.action = Action.hideafter;
            this.startafterinterval = hideAfter;
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = false;
            this.#mysprite.show();
            this.#phase = Phase.startafter;
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.callback = {callback:callme,instance:instance};
            // }
        }
    }    
    /**
     * Shows a sprite after a period of time then kills it after another period of time
     * @param {float} showAfter time to wait until sprite displayed
     * @param {float} killAfter time to kill sprite after displaying
     * @param {{callback:method|function,instance:object}} callback the code to call when the sprite is shown
     * Engine.makeCallback() to create your callback
     */
    showafterKillafter(showAfter, killAfter, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.showafterKillafter){
            this.action = Action.showafterKillafter;
            this.startafterinterval = showAfter;
            this.stopafterinterval = killAfter;
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = true;
            this.#mysprite.hide();
            this.#phase = Phase.startafter;
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.callback = {callback:callme,instance:instance};
            // }
        }
    }
    /**
     * shows a sprite after a period of time, flashing as it becomes visible
     * @param {float} showAfter timer period to wait before showing the flashing sprite
     * @param {float} onduration number of seconds or fraction of
     * @param {float} offduration number of seconds or fraction of
     * @param {{callback:method|function,instance:object}} callback the code to call when the sprite starts flashing
     * Engine.makeCallback() to create your callback
     * @example
     */
    showafterFlash(showAfter, onduration, offduration, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.showafterFlash){
            this.action = Action.showafterFlash;
            this.startafterinterval = showAfter;
            this.#oninterval = onduration; this.#offinterval = offduration
            this.actionTime = 0; this.elapsedTime = 0;
            this.#hidden = true;
            this.#mysprite.hide();
            this.#phase = Phase.startafter;
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.callback = {callback:callme,instance:instance};
            // }
        }
    }


    /**
     * kills a sprite after a period of time
     * @param {float} killtime timer period 
     * set a callbackFuneral or override the Kill() method of your sprite if you want to know when it's killed
     */
    killafter(killtime){//}, callback){//instance, callme){
        this.action = Action.killafter;
        this.actionTime = 0; this.elapsedTime = 0;
        this.stopafterinterval = killtime;
        // this.callback = callback;
        // if (instance !== undefined && callme !== undefined){
        //     this.callback = {callback:callme,instance:instance};
        // }
    }

    /**
     * applies a force to a sprite for a period of time
     * @param {float} stopAfter timer period to apply the force
     * @param {vector3} force 
     * @param {{callback:method|function,instance:object}} callback the code to call when the event occurs use 
     * Engine.makeCallback() to create your callback
     * @example
     * //call the increaseDifficulty method every 20 seconds
     * Engine.eventM.event(203, Engine.makeCallback(this.increaseDifficulty, this));
     * to stop calling the method/function use the events remove() method
     */
    impulse(stopAfter, force, callback){//instance, callme){
        if (this.allowoverwrite || this.action != Action.impulse){
            this.action = Action.impulse;
            this.stopafterinterval = stopAfter;
            this.actionTime = 0; this.elapsedTime = 0;
            this.#impulse = force;
            this.#phase = Phase.startafter;
            this.callback = callback;
            // if (instance !== undefined && callme !== undefined){
            //     this.callback = {callback:callme,instance:instance};
            // }
        }
    }
    /**
     * performs updates for this sprite timer
     */
    update(){
        super.update();
        if (this.action != Action.none){
            //new timing system
            //this.#elapsedTime += Engine.delta;
            //this.actionTime += Engine.delta;
            switch (this.action){
                case Action.killafter:
                    if (this.elapsedTime >= this.stopafterinterval){
                        //this.action = Action.none;
                        //this.action = Action.remove;
                        this.#mysprite.kill();
                        this.remove();
                    } break; 
                case Action.showafter:
                    if (this.elapsedTime >= this.startafterinterval){
                        this.#mysprite.show();
                        //this.action = Action.none;
                        //this.action = Action.remove;
                        Engine.processCallback(this.callback);
                        this.remove();
                    } break;
                case Action.hideafter:
                    if (this.elapsedTime >= this.startafterinterval){
                        this.#mysprite.hide();
                        //this.action = Action.remove;
                        Engine.processCallback(this.callback);
                        this.action = Action.none;
                    } break;                    
                case Action.showafterFlash:
                    if (this.elapsedTime >= this.startafterinterval){
                        this.action = Action.flash;
                        this.#mysprite.show();
                        this.#hidden = false;
                        this.elapsedTime -= this.startafterinterval;
                        this.actionTime = this.elapsedTime;
                        this.#sortvisibility();
                        Engine.processCallback(this.callback);
                    } break;
                case Action.showafterKillafter:
                    switch (this.#phase){
                        case Phase.startafter:
                            if (this.elapsedTime >= this.startafterinterval){
                                //turn on kill phase
                                this.#phase = Phase.stopafter;
                                this.elapsedTime -= this.startafterinterval;
                                this.#mysprite.show();
                                Engine.processCallback(this.callback);
                            } break;
                        case Phase.stopafter:
                            if (this.elapsedTime >= this.stopafterinterval){
                                //this.action = Action.none;
                                //this.action = Action.remove;
                                this.#mysprite.kill();
                                this.remove();
                            } break;
                    } break;
                case Action.impulse:
                    this.#mysprite.Velocity.add(this.#impulse);
                    if (this.elapsedTime >= this.stopafterinterval){
                        //this.action = Action.none;
                        //this.action = Action.remove;
                        this.remove();
                        Engine.processCallback(this.callback);
                    } break;
                case Action.flashStartafter:
                    if (this.elapsedTime >= this.startafterinterval){
                        this.elapsedTime -= this.startafterinterval;
                        this.actionTime = this.elapsedTime;//added
                        this.action = Action.flash;
                        this.#sortvisibility();
                        Engine.processCallback(this.callback);
                    }
                    break;
                case Action.flashStartafterStopafter:
                    switch (this.#phase){
                        case Phase.startafter:
                            if (this.elapsedTime >= this.startafterinterval){
                                //turn on continuous flashing
                                this.elapsedTime -= this.startafterinterval;
                                this.actionTime = this.elapsedTime;//added
                                this.#sortvisibility();
                                Engine.processCallback(this.callback);
                                this.#phase = Phase.stopafter;
                            } break;
                        case Phase.stopafter:
                            this.#sortvisibility();
                            if (this.elapsedTime >= this.stopafterinterval){
                                //this.action = Action.none;
                                //this.action = Action.remove;
                                this.#mysprite.show();
                                this.remove();
                                Engine.processCallback(this.callback);
                            } break;
                    } break;
                case Action.flashStartafterKillafter:
                    switch (this.#phase){
                        case Phase.startafter:
                            if (this.elapsedTime >= this.startafterinterval){
                                //turn on continuous flashing
                                this.#phase = Phase.stopafter;
                                this.elapsedTime -= this.startafterinterval;
                                this.actionTime = this.elapsedTime;//added
                                this.#sortvisibility();
                                Engine.processCallback(this.callback);
                            }
                            break;
                        case Phase.stopafter:
                            this.#sortvisibility();
                            if (this.elapsedTime >= this.stopafterinterval){
                                //this.action = Action.none;
                                //this.action = Action.remove;
                                this.#mysprite.kill();
                                this.remove();
                            }
                            break;
                    }
                    break;
                case Action.flash:
                    this.#sortvisibility();
                    break;
                case Action.flashStopafter:
                    this.#sortvisibility();
                    if (this.elapsedTime >= this.stopafterinterval){
                        //this.action = Action.none;
                        //this.action = Action.remove;
                        this.#mysprite.show();
                        this.remove();
                        Engine.processCallback(this.callback);
                    } break;
                case Action.flashKillafter:
                    this.#sortvisibility();
                    if (this.elapsedTime >= this.stopafterinterval){
                        //this.action = Action.none;
                        //this.action = Action.remove;
                        this.#mysprite.kill();
                        this.remove();
                    } break;
            }//switch (_method)
        }//if (_method != Style.none)
    }//update()

    /**
     * determines whether sprite should be shown or no during flashing actions
     */
    #sortvisibility(){
        if (this.#hidden){
            if (this.actionTime >= this.#offinterval){
                this.actionTime -= this.#offinterval;
                this.#mysprite.show();
                this.#hidden = !this.#hidden;
            }
        }  else {
            if (this.actionTime >= this.#oninterval){
                this.actionTime -= this.#oninterval;
                this.#mysprite.hide();
                this.#hidden = !this.#hidden;
            }
        }
    }//sortvisibility
}  
