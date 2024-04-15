/******************************
 * vector3.js by Hurray Banana 2023-2024
 ******************************/ 

/** @classdesc 3d position and methods */
class vector3{
    /** @type {float} holds x component */
    #x=0;
    /** @type {float} holds y component */
    #y=0;
    /** @type {float} holds z component */
    #z=0;
    /** @type {float} holds length of component */
    #length;
    //gets the pre-calculated magnitude of the vector
    /** @returns {float} pre calculated length of vector3, also it's magnitude */
    get length(){return this.#length;}
    /** @returns {float} pre calculated length of vector3, also it's magnitude */
    get distance() {return this.#length;}
    #mag = 0;
    /** creates an instance of a new vector3
     * @param {float} x initial x component of vector
     * @param {float} y initial y component of vector
     * @param {float} z initial z component of vector if missing z component is set to zero
     */
    constructor(x, y, z){
        if (z === undefined) z = 0;
        this.set(x, y, z);
    }
    /**@returns {bool} true if all 3 components are 0*/
    get iszero(){return this.#x == 0 && this.#y == 0 && this.#z == 0;}
    /**@returns {bool} true if all 3 components are 1*/
    get isone(){return this.#x == 1 && this.#y == 1 && this.#z == 1;}
    /**returns true if given vector is the same value as this one 
     * @param {vector3} a vector to compare
     * @returns {bool} true if 3 components are the same, false if any one component isn;t
    */
    equal(a){
        return this.#x == a.#x && this.#y == a.#y && this.#z == a.#z;
    }
    /**create a new instance of a vector3 with the values of this one - not a reference */
    get clone(){return new vector3(this.#x, this.#y, this.#z);}
    /**
     * sets the vector and calculates its length
     * @param {float} x 
     * @param {float} y 
     * @param {float} z 
     */
    set(x, y, z){
        this.#x = x;
        this.#y = y;
        this.#z = z;
        this.#calcdist();
    }
    /** gets the x component of the vector
     * @returns {float} value 
     */
    get x(){return this.#x;}
    /** gets the y component of the vector
     * @returns {float} value 
     */
    get y(){return this.#y;}
    /** gets the z component of the vector
     * @returns {float} value 
     */
    get z(){return this.#z;}
    /** gets the width component of the vector (x component)
     * @returns {float} value 
     */
    get w(){return this.#x;}
    /** gets the height component of the vector (y component)
     * @returns {float} value 
     */
    get h(){return this.#y;}
    /** gets the depth component of the vector (z component)
     * @returns {float} value 
     */
    get d(){return this.#z;}
    /** sets the x component of the vector
     * @param {float} value 
     */
    set x(value){
        if (this.#x != value){
            this.#x = value;
            this.#calcdist();
        } 
    }
    /** sets the y component of the vector
     * @param {float} value 
     */
    set y(value){
        if (this.#y != value){
            this.#y = value;
            this.#calcdist();
        } 
    }
    /** sets the z component of the vector
     * @param {float} value 
     */
    set z(value){
        if (this.#z != value){
            this.#z = value;
            this.#calcdist();
        } 
    }
    /** sets the width component (x component of the vector)
     * @param {float} value 
     */
    set w(value){
        if (this.#x != value){
            this.#x = value;
            this.#calcdist();
        } 
    }
    /** sets the height component (y component of the vector)
     * @param {float} value 
     */
    set h(value){
        if (this.#y != value){
            this.#y = value;
            this.#calcdist();
        } 
    }
    /** sets the depth component (z component of the vector)
     * @param {float} value 
     */
    set d(value){
        if (this.#z != value){
            this.#z = value;
            this.#calcdist();
        } 
    }    
    /** pre-calculates the length of the vector */
    #calcdist(){
        this.#length = Math.sqrt(this.#x**2 + this.#y**2 + this.#z**2);
    }

    /**
     * produces a vector3 value interpolated between vectors a and b
     * @param {vector3} a first vector3
     * @param {vector3} b second vector3
     * @param {float} p value between 0 and 1 controlling interpolation between a and b
     * @returns {vector3} interpolated 
     */
    static lerp(a, b, p){
        let v = vector3.zero;
        v.x = a.x + (b.x - a.x) * p;
        v.y = a.y + (b.y - a.y) * p;
        v.z = a.z + (b.z - a.z) * p;
        return v;
    }
    /**normalises this vector (unit length 1) this destroys the orginal vector
     * 
     * use normalisedclone if you want a new vector that is the normalised version of this vector
    */
    normalise(){
        this.#x = this.#x/this.#length;
        this.#y = this.#y/this.#length;
        this.#z = this.#z/this.#length;
        this.#length = 1;
    }
    /**returns a new vector3 that is the normalised form of this vector3
     * @returns {vector3} a new vector3 instance which is the normalised version of this vector3
    */
    normalisedclone(){
        return new vector3(this.#x/this.#length, this.#y/this.#length, this.#z/this.#length );
    }
    /**
     * creates a normalised vector based on the x and y and z values
     * @param {float} x 
     * @param {float} y 
     * @param {float} z 
     * @returns {vector3} unit vector3
    */
    static normalised(x,y,z){
        let mag = Math.sqrt(x**2 + y**2 + z**2);
        return new vector3(x/mag, y/mag, z/mag);
    }

    /**returns the angle of the given  direction vector
     * 
     * This only examines 2d values as it is a bearing (which is 2d)
     * @param {vector3} direction direction to convert
     * @param {float} additionalAngle to add on to the direction in degrees
     * @returns {float} angle in degrees
    */
    static anglefromdirection(direction, additionalAngle){
        additionalAngle = (additionalAngle === undefined) ? 0 : additionalAngle * Math.PIby180;
        return vector3.anglefromdirectionR(direction, additionalAngle) * Math.hb180byPI;
    }
    /**returns the angle of the given  direction vector
     * 
     * This only examines 2d values as it is a bearing (which is 2d)
     * @param {vector3} direction direction to convert
     * @param {*} additionalAngle to add on to the direction in radians
     * @returns {float} angle in radians
    */
    static anglefromdirectionR(direction, additionalAngle){
        if (additionalAngle === undefined){
            additionalAngle = 0;
        }
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
        return bearing + additionalAngle;
    }
    /**returns the 3d vector based on the angle
     * 
     * The z value is set to zero
     * @param {float} angle in degrees
     * @param {float} additionalAngle an angle to add on in degrees
     * @returns {vector3} a new vector3 unit direction vector
    */
    static directionfromangle(angle, additionalAngle){
        if (additionalAngle === undefined){
            additionalAngle = 0;
        }

        angle  = (angle + additionalAngle) * Math.PIby180 - Math.PIby2;
        return new vector3(Math.cos(angle), Math.sin(angle),0);
        // return new vector3(Math.cos(angle - Math.PI/2),
        //     Math.sin(angle - Math.PI/2),0);
    }
    /**returns the 3d vector based on the angle
     * 
     * The z value is set to zero
     * @param {float} angle in radians
     * @param {float} additionalAngle an angle to add on in radians
     * @returns {vector3} a new vector3 unit direction vector
    */
    static directionfromangle(angle, additionalAngle){
        if (additionalAngle === undefined){
            additionalAngle = 0;
        }
        angle  = (angle + additionalAngle) - Math.PIby2;
        return new vector3(Math.cos(angle), Math.sin(angle),0);
        // return new vector3(Math.cos(additionalAngle + angle - Math.PI/2),
        //                         Math.sin(additionalAngle + angle - Math.PI/2),0);
    }
    /** Returns a normalised direction vector looking from the starting position to the other position
    * @param {vector3} from start position
    * @param {vector3} to the direction to look towards
    * @param {DirectionAccuracy} accuracy gives exact direction if DirectionAccuracy.free or ordinalised if DirectionAccuracy.ordinals
    * @param {bool} includeZ Specify true if you want to take the Z value into account
    * 
    * @returns {vector3} A normalised Vector3 direction vector in chosen direction
    */
    lookAt(from, to, accuracy, includeZ){
        let d = new vector3();
        if (includeZ){
                d = vector3.sub(to, from);
            }else{
                d.x = to.x - from.y;
                d.y = to.y - from.y;
            }
            if (d.x == 0 && d.y == 0 && d.z == 0){
                d = vector3.zero;
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
     * finds the ordinalised (cardinals NSEW) direction closest to the given direction vector
     * @param {vector3} direction direction vector to 
     * @returns {vector3} in one of NSEW directions
     */
    static ordinalise(direction){
        if (!direction.iszero){
            if (Math.abs(direction.y) > Math.abs(direction.x)){
                if (direction.y > 0)
                    return vector3.down;
                else
                    return vector3.up;
            }else{
                if (direction.x > 0)
                    return vector3.right;
                else
                    return vector3.left;
            }
        }
        return vector3.zero;
    }    
    /** Determines whether rotating clockwise or anticlockwise is closest for a given position and direction
    * Useful for create homing and tracking effects, returns -1 if turned anti-clocwise, 1 if clockwise or 0 if didn't turn
    * @param {vector3} from Position to look from
    * @param {vector3} directionVector Direction looking
    * @param {vector3} to position aiming for
    * @param {float} minimumAngle the step size to turn by, if rotation required is less than this then 0 will be returned
    * 
    * @returns {int}-1 if turned anti-clocwise, 1 if clockwise or 0 if didn't turn */
    angularDirectionTo(from, directionVector, to, minimumAngle)
    {
        let dv = directionVector.normalisedclone;

        //calc direction to target
        let d = vector3.sub(to,from);
        d.normalise();
        let dot = vector3.dot(dv, d);
        let crossz = vector3.crosszonly(dv, d);

        if (dot < 0 || Math.abs(dot) < Math.cos(minimumAngle* Math.PI / 180))
            return (crossz < 0) ? -1 : 1;
        else
            return 0;
    }
    /** calculates just the z component on the normal to 2 given vectors (the angle between 2 vectors)
     * @param {vector3} a 
     * @param {vector3} b 
     * @returns {float}
    */
    static crosszonly(a, b){
        return a.x*b.y - a.y*b.x;
    }
    /** calculates just the normal to the 2 given vectors
     * @param {vector3} a 
     * @param {vector3} b 
    */
    static cross(a, b){
        return new vector3(a.y*b.z - a.z*b.y,a.z*b.x - a.x*b.z, a.x*b.y - a.y*b.x);
    }
    /** calculates the dot product between 2 vector3 values 
     * @param {vector3} a 
     * @param {vector3} b 
    */
    static dot(a, b){
        return a.x*b.x + a.y*b.y + a.z*b.z;
    }

    /**multiplies this vector3 by the scaler and returns a new vector3 
     * @param {float} scalar 
     * @returns {vector3} new instance
    */
    mulNew(scalar){
        return new vector3(this.#x * scalar, this.#y * scalar, this.#z * scalar);
    }
    /**divides this vector3 by the scaler and returns a new vector3 
     * @param {float} scalar 
     * @returns {vector3} new instance
    */
    divNew(scalar){
        return new vector3(this.#x / scalar, this.#y / scalar,this.#z/scalar);
    }
    /**multiplies this vector by the scaler value 
     * @param {float} scalar 
     * 
    */
    mul(scalar){
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
    }
    /**divides this vector by the scaler value 
     * 
     * vector3 / scaler
     * 
     * @param {float} scalar 
    */
    div(scalar){
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
    }
    /**if the first parameter is a vector3 object then it is added to this vector 
     * 
     * if all 3 parameters are suppied then they are taken as individual
     * x y and z value
     * @param {float|vector3} x either the x component of a vector (supply y and z parameters) or a vector3 value (don't supply y or z parameters)
     * @param {float} y y component of a vector
     * @param {float} z z component of a vector
    */
    add(x, y, z){
        if (y === undefined){// if just a vector
        this.#x += x.x;
        this.#y += x.y;
        this.#z += x.z;

        } else {
        this.#x += x;
        this.#y += y;
        this.#z += z;
        }
        this.#calcdist();
    }
    /**add the 2 given vector3's returning a new instance v1 + v2
     * @param {vector3} a first vector
     * @param {vector3} b second vector
     * @returns {vector3}
    */
    static add(a, b){
        return  new vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }
    /**if the first parameter is a vector3 object then it is subtracted from this vector 
     * 
     * this - vector3 or this - vector3(x,y,z)
     * 
     * if all 3 parameters are suppied then they are taken as individual
     * x y and z value
     * @param {float|vector3} x either the x component of a vector (supply y and z parameters) or a vector3 value (don't supply y or z parameters)
     * @param {float} y y component of a vector
     * @param {float} z z component of a vector
    */
    sub(x, y, z){
        if (y === undefined){// if just a vector
        this.#x -= x.x;
        this.#y -= x.y;
        this.#z -= x.z;
        } else {
        this.#x -= x;
        this.#y -= y;
        this.#z -= z;
        }
        this.#calcdist();
    }
    /**subtract the 2 given vector3's returning a new one a - b
     * @param {vector3} a first vector
     * @param {vector3} b second vector
     * @returns {vector3}
    */
    static sub(a, b){
        return  new vector3(a.x - b.x, a.y - b.y, a.z - b.z);
    }
    /**returns the distance between the 2 vector3 objects 
     * @param {vector3} a first vector
     * @param {vector3} b second vector
     * @returns {float} 
    */
    static distance(a, b){
        return Math.sqrt((b.x-a.x)**2 + (b.y-a.y)**2+ (b.z-a.z)**2);
    }
    /**
     * returns the square distance between 2 vector3's
     * 
     * faster to compare squares if only relative difference is required
     * @param {vector3} a first vector
     * @param {vector3} b second vector
     * @returns {float} 
     */
    static distanceSQ(a, b){
        return (b.x-a.x)**2 + (b.y-a.y)**2 + (b.z-a.z)**2;
    }
    /**returns a new vector3 that is a copy of the values of this one, not a reference a separate object
     * 
     * be warned clone creates an object so is about 20x slower than setting individual vector coords
     * 
     * b.x = a.x;
     * 
     * b.y = a.y;
     * 
     * b.z = a.z;
     * @returns {vector3} new vector3 instance based on this ones values
     */
    get clone(){
        return new vector3(this.#x, this.#y, this.#z);
    }
    /**clones this vector3 to the existing vector passed as a parameter 
     * @param {vector3} here 
    */
    cloneto(here){
        here.x = this.#x;
        here.y = this.#y;
        here.z = this.#z;
    }

    /**@returns {vector3}  a new vector3 object (0,0,0) */
    static get zero(){return new vector3(0,0);}
    /**@returns {vector3}  a new vector3 object (1,1,1) */
    static get one(){return new vector3(1,1,1);}
    /**@returns {vector3}  a new vector3 object (-1,0,0) */
    static get left(){return new vector3(-1,0,0);}
    /**@returns {vector3}  a new vector3 object (1,0,0) */
    static get right(){return new vector3(1,0,0);}
    /**@returns {vector3}  a new vector3 object (0,-1,0) */
    static get up(){return new vector3(0,-1,0);}
    /**@returns {vector3}  a new vector3 object (0,1,0) */
    static get down(){return new vector3(0,1,0);}
    /**@returns {vector3} a new vector3 object (0,0,-1) */
    static get backward(){return new vector3(0,0,-1);}
    /**@returns {vector3}  a new vector3 object (0,0,1) */
    static get forward(){return new vector3(0,0,1);}

}