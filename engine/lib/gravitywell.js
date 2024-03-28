/******************************
 * gravitywell.js by Hurray Banana 2023-2024
 ******************************/ 
/** @classdesc Defines a gravity well that can act upon a sprite if associated*/
class GravityWell{
    /** The position of this gravity well as a vector3 @type {vector3}*/
    location;
    /** The mass of this gravity well in GigaTonnes (this diminishes over distance in a linear way @type {float}*/
    #pointmass;
    /** gravitational constant @type {float}*/
    static GM = 6.673E-11;
    /**pre calculated value of mass and gravity @type {float}*/
    #precalc;
    /** Creates a new GravityWell specifying its location and Mass in Giga Tonnes 
     * 
     * @param location The location of the well, vector3, if this is reference to a sprite.position then the gravity well will move with the sprite
     * @param gigaTonnes The mass of the gravity from this location in Giga Tonnes (billions of Kilograms), the higher the Mass the harder the pull
     * 
     * You will need to experiment with the location and Mass of the GravityWells in order to achieve the desired effects
    */
    constructor(location, gigaTonnes){
        this.location = location;
        this.pointmass = gigaTonnes;
    }
    /**gets the pre-calculate gravitaional force @returns {float} */
    get precalc(){return this.#precalc;}
    /**  gets the point mass for the well in GigaTonnes @returns {float} */
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
