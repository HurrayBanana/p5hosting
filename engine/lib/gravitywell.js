//The location of the well, vector3, if this is reference to a sprite.position then the gravity well will move with the sprite
//The mass of the gravity from this location in Giga Tonnes (billions of Kilograms), the higher the Mass the harder the pull
/******************************
 * gravitywell.js by Hurray Banana 2023-2024
 ******************************/ 
/** @classdesc Defines a gravity well that can act upon a sprite if associated*/
class GravityWell{
    /** @type {vector3} The position of this gravity well as a vector3*/
    location;
    /** @type {float} The mass of this gravity well in GigaTonnes (this diminishes over distance in a linear way*/
    #pointmass;
    /** @type {float} gravitational constant */
    static GM = 6.673E-11;
    /** @type {float} pre calculated value of mass and gravity */
    #precalc;
    /** Creates a new GravityWell specifying its location and Mass in Giga Tonnes 
     * 
     * @param {vector3} location 
     * @param {float} gigaTonnes 
     * 
     * You will need to experiment with the location and Mass of the GravityWells in order to achieve the desired effects
    */
    constructor(location, gigaTonnes){
        this.location = location;
        this.pointmass = gigaTonnes;
    }
    /** @returns {float} gets the pre-calculate gravitaional force*/
    get precalc(){return this.#precalc;}
    /** @returns {float} gets the point mass for the well in GigaTonnes*/
    get pointmass(){ return this.#pointmass;}
    /**  sets the point mass for the well in GigaTonnes 
     * @param {float} value mass in giga tonnes
    */
    set pointmass(value){
            this.#pointmass = value;
            this.#precalc = value * 1000000000 * GravityWell.GM;
    }
    /** removes a reference to a location if it existed. 
     * If you inherit from GravityWell and need to remove your own resources then implement your own
     * version of cleanup  but remember to call super.cleanup() */
    cleanup(){
        //in case it's a reference
        this.location = null;
    }
}
