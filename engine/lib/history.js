//NEED  SOMETHING TO HAVE HISTORY ENABLED BUT ONLY IF SETUP CORRECTLY
/******************************
 * history.js by Hurray Banana 2023-2024
 ******************************/ 

/** @classdesc holds the definitions for a snapshot of a sprite
 */
class Historysnap{
    /**
     *  texture and rectangle @type {{tex:texture,port:Rectangle}}
     * 
     * */
    frame;
    /** position of this snap @type {vector3} */
    pos;
    /** was the sprite in view or world co-ordinates @type {bool} */
    world;
    /** the scale of the sprite at the time  @type {vector2}  */
    scale;
    /** angle of the sprite in radians  @type {float}  */
    angle;
    /** will hold a colour wash to apply (not in use yet as I need some shader code)  @type {color}  */
    wash;
    /** alpha value of the sprite at snap time (not used yet - overriden by ) */
    alpha;
    // layeroffset;
    // layer;
}

/** @classdesc provides visual snapshot functionality for sprites */
class History{
    /** holds each snap of the sprites data in time @type {Historysnap[]}*/
    #snaps = [];
    /** start position to render history from defaults to 0 (the newest snap position) this is because history is created as a circular queue @type {int}*/
    #start = 0;
    /** number of  current snaps @type {int}*/
    #length = 0;
    /** @returns {int} current length of the snap history */
    get length() { return this.#length;}
    /** marks current end of history list as this is operas a circular queue @type {int}*/
    #end = 0;
    /** specifies the start position to draw from, defaults to 0, but allows us to skip the ones closest to the sprite so we can leave a grap for disconnected trail effects */
    #renderfrom = 0;
    /** specifies the start position to draw from, defaults to 0, but allows us to skip the ones closest to the sprite so we can leave a grap for disconnected trail effects 
     * @returns {int} current value
    */
    get renderfrom(){return this.#renderfrom;}
    /**specifies the position to start rendering from.
     * this needs to be within the limit of the history length
     * @param {int} value allows us to skip the ones closest to the sprite so we can leave a grap for disconnected trail effects
     * @example
     * this.history = new History(this); // create the history object
     * this.history.show(0.05,90); //snap every 50 milliseconds, take 90 samples
     * this.history.renderfrom = 10; //skip the first ten snaps
     * this.history.scale = -0.5; // reduce the size by 50%
     * this.history.clampAlpha = 0.1;//don't allow alha to be higher than 10%
    */
    set renderfrom(value){this.#renderfrom = clamp(value, 0, this.#snaps.length - 2);}
    /** specifies the timer elapsed so for working towards the interval for history snapping */
    #elapsed;
    //#samplerate;
    /*/* specifies how often to sample history in 1 second 
    *
    * maximum would be 60 (every single frame)
    *
    * 0.5 would be once every 2 seconds
    *
    *use historySampleFreq if it makes more sense to specify this in terms of seconds rather frames
    */
    //sampleRate;
    /** specifies how to sample history in seconds, don't set this directly use show()
    * @type {float}
    * maximum would be 0.0167 (every single frame)
    *
    * 2 would be once every 2 seconds (or every 120 frames)
     * @example
     * this.history = new History(this); // create the history object
     * this.history.show(0.05,90); //snap every 50 milliseconds, take 90 samples
     * this.history.renderfrom = 10; //skip the first ten snaps
     * this.history.scale = -0.5; // reduce the size by 50%
     * this.history.clampAlpha = 0.1;//don't allow alpha to be higher than 10%
    */
    sampleFreq;
    //timer for history sampling
    //#depth = 2;
    /*/* gets the number of history position we want to record */
    //get depth(){ return this.#depth ;}
    /*/* sets the number of history positions to record (minimum is 2) */
    //set depth(value){
    //    this.#depth = value < 2 ? 2 : value;
    //}
    /** scale factor to apply to history rendering
     * this value is the factor by which to increase/decrease the scale of history trails.
     * default value is 0 ; no change in size
     * @type {float}
     * @example
     * this.history.scale = 1; //increase the size by 100%
     * this.history.scale = -0.5f; //would decrease the size by 50%,*/
    scale = 0;
    /** if true then history trail will fade over its distance, 
     * if false no fading will be applied and clampAlpha value will be applied to all snaps
     * @type {bool}*/
    fadeAlpha = true;
    /** holds maximum allowed alpha value in history, default 1 @type {float} */
    #clampAlpha = 1;
    /** 
     * Sets the maximum alpha for the history trail, if fadeAlpha is false then this is the alpha for the entire trail
     * depending on how often you are snapping this may need to be quite low as history will draw on top of itself
     * @returns {float}
    */
    get clampAlpha(){ return this.#clampAlpha; }
    /** Sets the maximum alpha for the history trail, if fadeAlpha is false then this is the alpha for the entire trail 
     * @param {float} value new value between 0 and 1
     * @example
     * this.history = new History(this); // create the history object
     * this.history.show(0.05,90); //snap every 50 milliseconds, take 90 samples
     * this.history.renderfrom = 10; //skip the first ten snaps
     * this.history.scale = -0.5; // reduce the size by 50%
     * this.history.clampAlpha = 0.1;//don't allow alha to be higher than 10%
    */
    set clampAlpha(value){ this.#clampAlpha = clamp(value, 0, 1);}
    /** sets the layer to draw history on, by default this is layer 0, the sprite first layer rendered
     * @example this.history.layer = Engine.layer(2);
    */
    layer = Engine.layer(0);

    /** reference to th esprite we are snapping */
    #mysprite ;
    /** builds the history recording system for a sprite
     * @param {Sprite} mysprite the sprite to record history for
     */
    constructor(mysprite){
        this.#mysprite = mysprite;
    }
    cleanup(){
        this.#mysprite = null;
        this.#snaps = null;
    }
    /** turns on history for this sprite 
     * @example
     * this.history = new History(this); // create the history object
     * this.history.show(0.05,90); //snap every 50 milliseconds, take 90 samples
     * this.history.renderfrom = 10; //skip the first ten snaps
     * this.history.scale = -0.5; // reduce the size by 50%
     * this.history.clampAlpha = 0.1;//don't allow alha to be higher than 10%
     * @param {int} depth how many samples to record
     * @param {float} rate how often (in seconds) to take a positional snapshot
    */
    show(rate, depth){
        //this.depth = depth;
        this.sampleFreq = rate;
        this.#elapsed = 0;
        //implement history circular queue
        //and fully initialise 
        this.#snaps = new Array(depth);
        for (let p = 0; p < depth; p++){
            this.#snaps[p] = new Historysnap();
        }
        this.#start = 0;
        this.#length = 0;
        this.#end = 0;
    }

    /** snaps if timer required current sprite settings */
    update(){
        if ((this.#elapsed += Engine.delta) > this.sampleFreq){
            this.#elapsed -= this.sampleFreq;
            let h = this.#snaps[this.#end];
            if (this.#mysprite.visible){
                h.frame = this.#mysprite.frame.clonecurrent;
                h.pos = new vector3(this.#mysprite.centrex, this.#mysprite.centrey,0);//this.#mysprite.position.clone
                h.scale = this.#mysprite.scale.clone;
                //h.layer = this.#mysprite.layer;
                h.angle = this.#mysprite.angleR;//angle/Math.hb180byPI;
                //h.angle = this.#mysprite.angle/180*Math.PI;
                h.alpha = this.alpha;//? is this right?
                h.world = this.#mysprite.world;
            } else {
                h.frame = {tex:null};
            }

            //remove first if we are at max depth
            if (this.#length == this.#snaps.length){
                this.#start = (this.#start + 1) % this.#length;
            } else {this.#length++;}
            //move to next recording position
            this.#end++;
            if (this.#end == this.#snaps.length) {this.#end = 0;}
            //this.#end = (this.#end + 1) % this.#snaps.length;
        }
    }
    /** renders the history recorded here */
    draw(){

        //draw from end to start (newest to oldest)
        let end = this.#end - 1 - this.#renderfrom;
        let numbertorender = this.#length - this.#renderfrom;

        let dalpha = this.fadeAlpha ?  this.#clampAlpha / numbertorender : 0;
        let alpha = this.#clampAlpha;
        let dscale = (this.scale == 0)? 0:-this.scale / numbertorender;
        let scale = 1;

        this.layer.push();

        if (this.#mysprite.clip){
            this.layer.clip(() => {
            const r = this.#mysprite.cliparea;
            this.layer.rect(r.x,r.y,r.w,r.h);
            });
        }            

        for (let p = 0; p < numbertorender ; p++){
            if (end < 0) end += this.#length;
            const h = this.#snaps[end];
            if (h.frame.tex != null){
                this/*h*/.layer.push();
                this/*h*/.layer.drawingContext.globalAlpha = alpha;
                this/*h*/.layer.translate(h.pos.x + (h.world ? -Engine.mainview.x : 0), h.pos.y + (h.world ? -Engine.mainview.y : 0));
                this/*h*/.layer.scale(scale*h.scale.x,scale*h.scale.y);
                if (h.angle != 0){
                    this/*h*/.layer.rotate(h.angle);
                }
                //cheating for now with some of the data here
                //offset to centre - need to fix /record the true offset for the history item now
                this/*h*/.layer.image(h.frame.tex,
                    0,0,h.frame.port.w, h.frame.port.h,
                    h.frame.port.x, h.frame.port.y, h.frame.port.w, h.frame.port.h
                );
                //h.layer.image(h.frame.tex,
                //    0,0,h.frame.port.w*h.scale.x*scale, h.frame.port.h*h.scale.y*scale,
                //    h.frame.port.x, h.frame.port.y, h.frame.port.w, h.frame.port.h
                //);
                this/*h*/.layer.pop();
            }
            scale -= dscale;
            alpha -= dalpha;
            end--;
        }
        this.layer.pop();
        return numbertorender;
    }
}