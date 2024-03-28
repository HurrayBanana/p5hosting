/******************************
 * vector2.js by Hurray Banana 2023-2024
 ******************************/ 

/**
 * @classdesc used in some methods to lock directions to ordinal or leave in a free direction
 */
class DirectionAccuracy {
    /** clamp value for rotation or direction to ordinal values NSEW */
    static ordinals = "ordinals";
    /** calculate the direction or rotation as it occurs */
    static free = "free";
}

/**
 * @classdesc 
 * provides support for 2d values and associated helper functions and arithmetic
 */
class vector2{
    /** base storage if 1st component @type {float} */
    #x=0;
    /** base storage if 2nd component @type {float} */
    #y=0;
    /** dirty storage of length pre-calculated when components change @type {float}*/
    #length;
    /**
     * gets the pre-calculated magnitude of the vector
     * @returns {float)}
     * */
    get length(){return this.#length;}
    /**
     * gets the pre-calculated magnitude of the vector, alternative name
     * @returns {float)}
     * */
    get distance() {return this.#length;}
    //#mag = 0; - TBR
    /**
     * Creates a vector2 value with the two initial values
     * @param {float} x 
     * @param {float} y 
     */
    constructor(x, y){
        this.set(x,y);
    }
    /**
     * @returns {bool} true if this vector is (0,0)}
     */
    get iszero(){return this.#x == 0 && this.#y == 0;}
    /**
     * @returns {bool} true if this vector is (1,1)}
     */
    get isone(){return this.#x == 1 && this.#y == 1;}    //creates a new object instance with the values from this
    /**
     * @returns {vector2} creates a new vector2 object instance taking the x and y values as copies from this vector2,
     */
    get clone(){return new vector2(this.#x, this.#y);}
    /**
     * sets the x and y components of the vector2
     * @param {float} x x value to set
     * @param {float} y y value to set
     */
    set(x,y){
        this.#x = x;
        this.#y = y;
        this.#calcdist();
    }
    /**
     * @returns {float} gets the x component (1st component) of the vector
     */
    get x(){return this.#x;}
    /**
     * @returns {float} gets the y component (2nd component) of the vector
     */
    get y(){return this.#y;}
    /**
     * @returns {float} gets the w component (1st component) of the vector, alternative name (of x) for different contexts
     */
    get w(){return this.#x;}
    /**
     * @returns {float} gets the h component (2nd component) of the vector, alternative name (of y) for different contexts
     */
    get h(){return this.#y;}
    /**
     * @param {float} value sets the x component (1st component) of the vector
     */
    set x(value){
        if (this.#x != value){
        this.#x = value;
        this.#calcdist();
        } 
    }
    /**
     * @param {float} value sets the y component (1st component) of the vector
     */
    set y(value){
        if (this.#y != value){
        this.#y = value;
        this.#calcdist();
        } 
    }
    /**
     * @param {float} value sets the w component (1st component) of the vector
     */
    set w(value){
        if (this.#x != value){
        this.#x = value;
        this.#calcdist();
        } 
    }
    /**
     * @param {float} value sets the h component (2nd component) of the vector
     */
    set h(value){
        if (this.#y != value){
        this.#y = value;
        this.#calcdist();
        } 
    }
    /** calculates the length of the vector */
    #calcdist(){
        this.#length = Math.sqrt(this.#x*this.#x + this.#y*this.#y);
    }
    /**
     * produces a vector2 value interpolated between vectors a and b
     * @param {vector2} a first vector2
     * @param {vector2} b second vector2
     * @param {float} p value between 0 and 1 controlling interpolation between a and b
     * @returns {vector2} interpolated 
     */
    static lerp(a, b, p){
        let v = vector2.zero;
        v.x = a.x + (b.x - a.x) * p;
        v.y = a.y + (b.y - a.y) * p;
        return v;
    }

    /**
     * normalises this vector (unit length 1) this destorys the orginal vector, this destroys the previous values.
     * If you want a normalised version of this vector withouth destroying its value then use @see {@link normalised}
     */
    normalise(){
        this.#x = this.#x/this.#length;
        this.#y = this.#y/this.#length;
        this.#length = 1;
    }
    /**
     * @returns {vector2}  a new vector that is the normalised form of this vector
     */
    normalised(){
        return new vector2(this.#x/this.#length, this.#y/this.#length);
    }

    /**
     * returns a new vector2 that is the normalised version of component values
     * @param {float} x the x component of a vector
     * @param {float} y the y component of a vector
     * @returns {vector2} a new vector2 instance which is a normalised version of the given component values
     */
    static normalised(x,y){
        let mag = Math.sqrt(x*x + y*y);
        //let ux = x/mag;
        //let uy = y/mag;
        return new vector2(x/mag, y/mag);
    }
    /**
     * The results and additional angles are in degrees use @see {@link anglefromdirectionR} for a version in radians
     * @param {*} direction a 2 vector which you want the angle of
     * @param {*} additionalAngle additional angle in radians to add on to the 
     * @returns {float} an angle in degrees which is the direction vector given plus the additional angle specified
     */
    static anglefromdirection(direction, additionalAngle){
        additionalAngle = (additionalAngle === undefined) ? 0 : additionalAngle * Math.PIby180;
        return vector2.anglefromdirectionR(direction, additionalAngle) * Math.hb180byPI;
    }
    /**
     * The results and additional angles are in radians use @see {@link anglefromdirection} for a version in degrees
     * @param {*} direction a 2 vector which you want the angle of
     * @param {*} additionalAngle additional angle in radians to add on to the 
     * @returns {float} an angle in radians which is the direction vector given plus the additional angle specified
     */
    static anglefromdirectionR(direction, additionalAngle){
        additionalAngle = (additionalAngle === undefined) ? 0 : additionalAngle;
        let bearing = 0;
        if (direction.y == 0)
        {
            if (direction.x < 0)
                bearing = Math.PI * 1.5;
            else
                bearing = Math.PI * 0.5;
        }
        else
        {
            let r = Math.atan(-direction.x / direction.y);
            if (direction.y > 0)
                //rotationAngle = (float)(r + Math.PI);
                if (direction.x < 0)
                    bearing = r - Math.PI;
                else
                    bearing = r + Math.PI;
            else
                bearing = r;
        }
        bearing += additionalAngle;
        return (bearing < Math.PIx2) ? bearing : bearing - Math.PIx2;
    }

    /**
     * takes an angle and turns it into a direction vector that can be used for velocities or other movement
     * @param {float} angle in degrees to convert to direction
     * @param {float} additionalAngle a further angle to add on in degrees
     * @returns {vector2} a direction vector in the direction of the 2 angles requested
     */
    static directionfromangle(angle, additionalAngle){
        angle += (additionalAngle === undefined) ? 0 : additionalAngle;
        angle = angle * Math.PIby180;

        return new vector2(Math.cos(angle - Math.PIby2),
                                Math.sin(angle - Math.PIby2));
    }
    /**
     * takes an angle and turns it into a direction vector that can be used for velocities or other movement
     * @param {float} angle in radians to convert to direction
     * @param {float} additionalAngle a further angle to add on in radians
     * @returns {vector2} a direction vector in the direction of the 2 angles requested
     */
    static directionfromangleR(angle, additionalAngle){
        angle += (additionalAngle === undefined) ? 0 : additionalAngle;

        return new vector2(Math.cos(angle - Math.PIby2),
                                Math.sin(angle - Math.PIby2));
    }
    /** Returns a normalised direction vector looking from the starting sprite to the other sprite
    / @param {vector2} from start position
    / @param {vector2} to the direction to look towards
    / @param {DirectionAccuracy} accuracy choose either free direction or lock to ordinals NSEW
    / @returns {vector2} normalised Vector2 direction vector
    */
    static lookAt(from, to, accuracy)
    {
        let d = new vector2();
        d.x = to.x - from.y;
        d.y = to.y - from.y;
        if (d.x == 0 && d.y == 0){
            d = vector2.zero;
        }else{
            switch (accuracy)
            {
                case DirectionAccuracy.ordinals:
                    d = ordinalise(d);
                    break;
                case DirectionAccuracy.free:
                    d.normalise();
                    break;
            }
        }
        return d;
    }    
    /**
     * attempts to give a direction vector as close to the ordinal directions (NSEW)
     * @param {vector2} direction vector to ordinalise
     * @returns {vector2} containing NSEW directions only
     */
    static ordinalise(direction){
        if (!direction.iszero){
            if (Math.abs(direction.y) > Math.abs(direction.x)){
                if (direction.y > 0)
                    return vector2.down;
                else
                    return vector2.up;
            }else{
                if (direction.x > 0)
                    return vector2.right;
                else
                    return vector2.left;
            }
        }
        return vector2.zero;
    }       
    /** calculates the dot product between 2 vector2 values 
     * @param {vector2} a first vector
     * @param {vector2} b second vector
     * @returns {float} the dot product
    */
    static dot(a, b){
        return a.x*b.x + a.y*b.y;
    }
    /**
     * Produces a new vector2 that is this vector multiplied the scalar value
     * @param {float} scalar value to multiply the components of this vector by
     * @returns {vector2} a new vector2 that is this vector multiplied by the scalar value
     */
    mulNew(scalar){
        return new vector2(this.#x * scalar, this.#y * scalar);
    }
    /**
     * Produces a new vector2 that is this vector divided the scalar value
     * @param {float} scalar value to multiply the components of this vector by
     * @returns {vector2} a new vector2 that is this vector divided by the scalar value
     */
    divNew(scalar){
        return new vector2(this.#x / scalar, this.#y / scalar);
    }
    /**
     * multiplies this vector by the scalar value
     * @param {float} scalar value to multiply the components of this vector by
     */
    mul(scalar){
        this.x = this.#x * scalar;
        this.y = this.#y * scalar;
    }
    /**
     * divides this vector by the scalar value
     * @param {float} scalar value to divide the components of this vector by
     */
    div(scalar){
        this.x = this.#x / scalar;
        this.y = this.#y / scalar;
    }
    /**
     * Adds either a vector2 to this vector or two component values to this vector
     * @param {float|vector2} vec if you supply a vector2 value then it is added to this vector2 value
     * @param {float|undefined} y if defined then the 2 parameters are assumed to be an x and y value to add to this vector2 components
     */
    add(vec, y){
        if (y === undefined){// if just a vector
        this.#x = this.#x + vec.x;
        this.#y = this.#y + vec.y;

        } else {
        this.#x += vec;
        this.#y += y;
        }
        this.#calcdist();
    }
    /**
     * subtracts either a vector2 from this vector or two component values from this vector
     * @param {float|vector2} vec if you supply a vector2 value then it is subtract from this vector2 value
     * @param {float|undefined} y if defined then the 2 parameters are assumed to be an x and y value to subtract from this vector2 components
     */
    sub(vec, y){
        if (y === undefined){// if just a vector
        this.#x -= vec.x;
        this.#y -= vec.y;
        } else {
        this.#x -= vec;
        this.#y -= y;
        }
        this.#calcdist();
    }
    /**
     * creates a new vector2 by adding either a vector2 to this vector or two component values to this vector
     * @param {float|vector2} vec if you supply a vector2 value then it is added to this vector2 value
     * @param {float|undefined} y if defined then the 2 parameters are assumed to be an x and y value to add to this vector2 components
     * @returns {vector2} a new vector2 adding the vectors or components together without affecting this vector2
     */
    addNew(vec, y){
        if (y === undefined){// if just a vector
            return new vector2(this.#x + vec.x, this.#y + vec.y);
        } else {
            return new vector2(this.#x + vec, this.#y + y);
        }
    }
    /**
     * creates a new vector2 by subtracting either a vector2 from this vector or two component values from this vector
     * @param {float|vector2} vec if you supply a vector2 value then it is subtracted from this vector2 value
     * @param {float|undefined} y if defined then the 2 parameters are assumed to be an x and y value to subtract from this vector2 components
     * @returns {vector2} a new vector2 subtracting the vectors or components together without affecting this vector2
     */
    subNew(vec, y){
        if (y === undefined){// if just a vector
            return new vector2(this.#x - vec.x, this.#y - vec.y);
        } else {
            return new vector2(this.#x - vec, this.#y - y);
        }
    }
    /**
     * adds 2 vectors together v1 + v2
     * @param {vector2} v1 first vector to add
     * @param {vector2} v2 second vector to add
     * @returns {vector2} a new vector2 adding two supplied vectors
     */
    static add(v1, v2){
        return new vector2(v1.x + v2.x, v1.y + v2.y);
    }
    /**
     * subtracts 2 vectors v1 - v2
     * @param {vector2} v1 first vector
     * @param {vector2} v2 second vector to subtract from the first one
     * @returns {vector2} a new vector2 subtracting two supplied vectors
     */
    static sub(v1, v2){
        return new vector2(v1.x - v2.x, v1.y - v2.y);
    }
    /**
     * calculates the distance between 2 point vectors
     * @param {vector2} v1 start point
     * @param {vector2} v2 end point
     * @returns {float} distance between 2 point vectors
     */
    static distance(v1, v2){
        return Math.sqrt((v2.x-v1.x)**2 + (v2.y-v1.y)**2);
    }
    /**
     * calculates the distance between 2 point vectors without performing square root
     * @param {vector2} v1 start point
     * @param {vector2} v2 end point
     * @returns {float} squared distance between 2 point vectors
     */
    static distanceSQ(v1, v2){
        return (v2.x-v1.x)**2 + (v2.y-v1.y)**2;
    } 
     /**returns a new vector2 that is a copy of the values of this one, not a reference a separate object
     * 
     * be warned clone creates an object so is about 20x slower than setting individual vector coords
     * 
     * b.x = a.x;
     * 
     * b.y = a.y;
     * 
     * or using a.cloneto(b);
     * @returns {vector2} a new vector2 with the same values as this vector2
     */
    get clone(){
        return new vector2(this.#x, this.#y);
    }
    /**
     * clones this vector2 to the existing vector passed as a parameter, avoiding the need to instantiate another object
     * @param {vector2} here a vector2 instance to overwrite the values of
    */
    cloneto(here){
        here.x = this.#x;
        here.y = this.#y;
        here.#calcdist();
    }
    /** @returns {vector2} new vector (0,0) */
    static get zero(){return new vector2(0,0);}
    /** @returns {vector2} new vector (1,1) */
    static get one(){return new vector2(1,1);}
    /** @returns {vector2} new vector (-1,0) */
    static get left(){return new vector2(-1,0);}
    /** @returns {vector2} new vector (1,0) */
    static get right(){return new vector2(1,0);}
    /** @returns {vector2} new vector (0,-1) */
    static get up(){return new vector2(0,-1);}
    /** @returns {vector2} new vector (0,1) */
    static get down(){return new vector2(0,1);}

}
