"use strict";
/**
 * @classdesc describes a rectangle viewport to control display areas, defaults to same size of canvas
 */
class View{
    /** determines if viewport is prevented from extended beyond the world defined area
     * when moving or positioning the viewport
     * @type {bool}
     */
    clamp = true;
    /** current position of the viewport @type {vector3} */
    #position;
    /**
     * rectangular area of the viewport x and y values are always zero but does state width and height
     * @type {Rectangle}
     */
    #area;
    /**
     * as area but the x and y positions reflect the current position of the viewport
     * @returns {Rectangle}
     */
    #movedarea;
    /**  rectangular area of the viewport x and y values are always zero but does state width and height
     * @returns {Rectangle}
     */
    get area(){return this.#area;}
    /**
     * as area but the x and y positions reflect the current position of the viewport in the world
     * @returns {Rectangle}
     */
    get worldarea(){return this.#movedarea;}
    /** the position of the viewport, it's displacement as a vector3 value
     * @returns {vector3}
     */
    get position(){return this.#position;}
    /** sets the position of the viewport in the world using a vector3 value
     * if clamp is set to true then the viewport will be restricted to the world area
     * @param {vector3} value 
     */
    set position(value){
        if (this.clamp){
            this.#position.x = clamp(value.x, 0, Engine.worldWidth - this.#area.w);
            this.#position.y = clamp(value.y, 0, Engine.worldHeight - this.#area.h);
            this.#position.z = value.z;
            this.#movedarea.x = this.#position.x | 0;
            this.#movedarea.y = this.#position.y | 0;
        }else{
            this.#position = value;
        }
    }
    /** the position of the viewport, it's displacement as a vector2 value
     * @returns {vector2}
     */
    get position2d(){return new vector2(this.#position.x, this.#position.y);}
    /** sets the position of the viewport in the world using a vector2 value
     * if clamp is set to true then the viewport will be restricted to the world area
     * @param {vector2} value 
     */
    set position2d(value){
        if (this.clamp){
            this.#position.x = clamp(value.x, 0, Engine.worldWidth - this.#area.w);
            this.#position.y = clamp(value.y, 0, Engine.worldHeight - this.#area.h);
            this.#movedarea.x = this.#position.x | 0;
            this.#movedarea.y = this.#position.y | 0;
        }else{
            this.#position.x = value.x;
            this.#position.y = value.y;
        }
    }
    /**
     * gets the width of the viewport @returns {float}
     */
    get w(){return this.#area.w;}
    /**
     * gets the height of the viewport @returns {float}
     */
    get h(){return this.#area.h;}
    
    /**
     * gets the horizontal position (offset) of the viewport @returns {float}
     */
    get x(){return this.#position.x;};
    /**
     * sets the horizontal position (offset) of the viewport @param {float} value
     * if clamp is set the horizontal position will be set such that the viewport stays within the world area defined
     */
    set x(value){this.#position.x = this.clamp ? clamp(value, 0, Engine.worldWidth - this.#area.w) : value;this.#movedarea.x = this.#position.x | 0;};
    /**
     * gets the vertical position (offset) of the viewport @returns {float}
     */
    get y(){return this.#position.y;};
    /**
     * sets the vertical position (offset) of the viewport @param {float} value
     * if clamp is set the vertical position will be set such that the viewport stays within the world area defined
     */
    set y(value){this.#position.y = this.clamp ? clamp(value, 0, Engine.worldHeight - this.#area.h) : value;this.#movedarea.y = this.#position.y | 0;};
    /**
     * Creates a new viewport
     * @param {Rectangle} viewport a rectangular region to size the viewport (the width and height are what is taken from the rectangle)
     * @param {float} startx a start position for the horizontal position of the viewport in the world
     * @param {float} starty a start position for the vertical position of the viewport in the world
     */
    constructor(viewport, startx, starty){
        this.#area = viewport;
        this.#movedarea = new Rectangle(startx, starty, viewport.w, viewport.h);
        startx= (startx === undefined) ? 0 : startx;
        starty = (starty === undefined) ? 0 : starty;
        this.#position = new vector3(startx, starty, 0);
    }
    /**
     * I don't know what this is actually supposed to do, Sprite draw is using the rectangle version, this might be old/not needed in this form
     * I'm going to rename to see if it breaks anything
     * @param {Rectangle} r 
     * @param {bool} world 
     * @returns {bool}
     */
    AM_I_NEEDED_in(r, world){//
        if (world)
                return !(r.left >= this.#movedarea.right ||
                        r.right <= this.#movedarea.left ||
                        r.top >= this.#movedarea.bottom ||
                        r.bottom <= this.#movedarea.top
                );
            else
                return !(r.left >= this.#area.width ||
                        r.right <= 0 ||
                        r.top >= this.#area.height ||
                        r.bottom <= 0
                );
    }
}