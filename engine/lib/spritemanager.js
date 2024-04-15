/******************************
 * spritemanager.js by Hurray Banana 2023-2024
 ******************************/ 
/** 
 * @classdesc manages and processes sprites - you should not have to use this directly apart from setting debug output
 */
class Spritemanager{
    /** holds the currently managed sprite references @type {Sprite[]} */
    #spritelist;
    /** @returns {Sprite[]} an array os Sprites that you can perform further processing on */
    get spritelist(){return this.#spritelist;}
    /** holds the list of sprites that are to be drawn, sorted on z before drawing @type {Sprite[]} */
    #renderlist;
    /** holds a list of just those sprites that are collidable, reducing some of the overheads @type {Sprite[]} */
    #collisionlist;
    /** holds a list of sprites that are primary colliders, reduces collsion checking overheads @type {Sprite[]} */
    #collisionPlist;
    /** not used */
    #layer;
    /** set the spritemanager to output debug info defaults to false @type {bool}*/
    debug = false;
    /**
     * sets the position to display the sprite information, not in use
     * @type {vector2} 
     * @example this.debugposition = new vector2(10,ht - 30);
    */
    debugposition = new vector2(10, Engine.viewHeight - 30);
    /** specifies the colour to render debug info, not in use*/
    debugcolour = "white";
    /** specifies a refernce layer to render debug info to*/
    constructor(/*layer*/){
        // this.#layer = layer;
        this.#spritelist = [];
        this.#collisionlist = [];
        this.#collisionPlist = [];
        this.#renderlist = [];
    }
    /** holds history draw tally per frame @type {int}  */
    #historycount;
    /** holds last number of sprites drawn in the frame @type {int} */
    #spritedrawn;
    /** @returns {int} gets the number of sprites being processed */
    get count(){return this.#spritelist.length;}

    /** adds a sprite for automatic update and drawing processing 
     * add a call to this method of the sprite manager in your sprites constructor
     * @example    
     * constructor(){
     *      super();
     *      Engine.spM.add(this);
     *      //...further constructor code to setup sprite
    */
    add(sprite){
        if (sprite!=undefined){
            this.#spritelist.push(sprite);
        } else {
            let s = new Sprite();
            this.#spritelist.push(s);
        }
        return this.#spritelist[this.#spritelist.len - 1];
    }
    /** adds a sprite marked as a collidable to the collision list 
     * 
     * @param {Sprite} spr primary collider to add
    */
    collisionJoin(spr){
        if (this.#collisionlist.indexOf(spr) == -1){
            this.#collisionlist.push(spr);
        }

    }
    /** adds a sprite marked as a primary collider to the plist 
     * 
     * @param {Sprite} spr primary collider to add
    */
    collisionPJoin(spr){
        if(this.#collisionPlist.indexOf(spr) == -1){
            this.#collisionPlist.push(spr);
        }
    }
    /** removes given sprite from the primary collision list
     * @param {Sprite} spr sprite to remove
     * called by cleanup code, no need to manually call
     */
    collisionPLeave(spr){
        let p = this.#collisionPlist.indexOf(spr);
        if (p != -1){
            this.#collisionPlist.splice(p,1);
        }
    }
    /** removes given sprite from the collision list
     * @param {Sprite} spr sprite to remove
     * called by cleanup code, no need to manually call
     */
    collisionLeave(spr){
        let p = this.#collisionlist.indexOf(spr);
        if (p != -1){
            this.#collisionlist.splice(p,1);
        }
    }

    /** performs a collision check for each sprite in the primary collision list
     * against any sprites in the sprite collision list that match with targets for the primary
     * calls the callbackCollide nominated method if set
     */
    collisioncheck(){
        for (let p = 0; p < this.#collisionPlist.length; p++){
            const prim = this.#collisionPlist[p];
            if (prim.collisionList != null){
                for (let k = 0; k < this.#collisionlist.length; k++){
                    const sec = this.#collisionlist[k];
                    if (k != p && sec.alive && this.istargetted(sec, prim.collisionList)){
                        if (prim.intersectBC(sec)){
                            Engine.processCallback(prim.callbackCollide,sec);
                        }
                    }
                }
            }
        }
    }

    /** 
     * determines if a sprite from the sprite managers collision list has a type
     * logged in the primary sprites collision types list 
     * @returns {bool} true if to be checked for collision */
    istargetted(spr, list){
        for (let p = 0; p < list.length; p++){
            if (spr instanceof list[p]){
                return true;
            }
        }
        return false;
    }

    /** process the sprites in the lists */
    update(){
        if (this.#collisionPlist.length > 0) {this.collisioncheck();}

        this.#renderlist.length = 0;
        for (let p = 0; p < this.#spritelist.length; p++){
            this.#spritelist[p].update();
            if (this.#spritelist[p].visible && !this.#spritelist[p].dead){
                this.#renderlist.push(this.#spritelist[p]);
            }
        }
        // if (this.#collisionPlist.length > 0) {this.collisioncheck();}
        this.#bringoutthedead();
    }
    //need a system similar to the sprite renderlist for history I think
    /** performs sprite rendering */
    draw(){
        this.#historycount = 0;
        //draw any history first - first guess
        //sort history renderlist
        //this.#renderlist.sort(function(a,b){return a.z < b.z ? -1 : 1;})
        for (let p = 0; p < this.#spritelist.length; p++){
            if (this.#spritelist[p].history != null) {
                this.#historycount += this.#spritelist[p].history.draw();
            }
        }
        //sort renderlist
        this.#renderlist.sort(function(a,b){return a.z < b.z ? -1 : 1;})
            
        this.#spritedrawn = this.#renderlist.length;
        for (let p = 0; p < this.#renderlist.length; p++){
            //watch out for any sprites killed since adding to render list
            //if (!this.#renderlist[p].dead){
                this.#renderlist[p].draw();
            //}
        }
        if (this.debug){this.debugdisplay();}
    }
    /** removes all sprites marked as dead */
    #bringoutthedead(){
        let p = this.#spritelist.length - 1;
        while (p >= 0){//} && p < this.#spritelist.length){
            if (this.#spritelist[p].dead){
                this.#spritelist[p].cleanup();
                this.#spritelist.splice(p,1);
            } 
            p--;
        }
    }
    /** returns a string of basic debug information about sprites */
    get debugdisplay(){
        return "sprites [" + this.count + "] drawn [" + this.#spritedrawn + "] " + 
        "history sprites [" + this.#historycount + "]";
    }
    /** bins all sprites without calling funerals */
    removeall(){
        for (let p = 0; p < this.#spritelist.length; p++){
            this.#spritelist[p].cleanup();
        }
        this.#spritelist = [];
    }
}
