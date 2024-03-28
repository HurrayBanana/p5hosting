/******************************
 * vector3.js by Hurray Banana 2023-2024
 ******************************/ 

/** @classdesc 3d position and methods */
class vector3{
    #x=0;
    #y=0;
    #z=0;
    //dirty;
    #length;
    //gets the pre-calculated magnitude of the vector
    /**pre calculated length of vector3, also it's magnitude */
    get length(){return this.#length;}
    /**pre calculated length of vector3, also it's magnitude */
    get distance() {return this.#length;}
    #mag = 0;
    constructor(x, y, z){
        if (z === undefined) z = 0;
        this.set(x, y, z);
    }
    get iszero(){return this.#x == 0 && this.#y == 0 && this.#z == 0;}
    get isone(){return this.#x == 1 && this.#y == 1 && this.#z == 1;}
    /**returns true if given vector is the same value as this one */
    equal(v){
        return this.#x == v.#x && this.#y == v.#y && this.#z == v.#z;
    }
    /**create a new instance of a vector3 with the values of this one - not a reference */
    get clone(){return new vector3(this.#x, this.#y, this.#z);}
    set(x, y, z){
        this.#x = x;
        this.#y = y;
        this.#z = z;
        this.#calcdist();
    }
    get x(){return this.#x;}
    get y(){return this.#y;}
    get z(){return this.#z;}
    get w(){return this.#x;}
    get h(){return this.#y;}
    get d(){return this.#z;}
    set x(value){
        if (this.#x != value){
            this.#x = value;
            this.#calcdist();
        } 
    }
    set y(value){
        if (this.#y != value){
            this.#y = value;
            this.#calcdist();
        } 
    }
    set z(value){
        if (this.#z != value){
            this.#z = value;
            this.#calcdist();
        } 
    }
    set w(value){
        if (this.#x != value){
            this.#x = value;
            this.#calcdist();
        } 
    }
    set h(value){
        if (this.#y != value){
            this.#y = value;
            this.#calcdist();
        } 
    }
    set d(value){
        if (this.#z != value){
            this.#z = value;
            this.#calcdist();
        } 
    }    
    #calcdist(){
        this.#length = Math.sqrt(this.#x**2 + this.#y**2 + this.#z**2);
    }

    /**
     * produces a vector3 value interpolated between vectors a and b
     * @param {*} a first vector3
     * @param {*} b second vector3
     * @param {*} p value between 0 and 1 controlling interpolation between a and b
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
    /**returns a new vector3 that is the normalised form of this vector3*/
    normalisedclone(){
        return new vector3(this.#x/this.#length, this.#y/this.#length, this.#z/this.#length );
    }
    /**creates a normalised vector based on the x and y and z values*/
    static normalised(x,y,z){
        let mag = Math.sqrt(x**2 + y**2 + z**2);
        return new vector3(x/mag, y/mag, z/mag);
    }
    /**returns the angle if this vector was a direction vector
     * 
     * This only examines 2d values as it is a bearing (which is 2d)
    */
    static anglefromdirection(direction, additionalAngle){
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
    */
    static directionfromangle(angle, additionalAngle){
        if (additionalAngle === undefined){
            additionalAngle = 0;
        }
        return new vector3(Math.cos(additionalAngle + angle - Math.PI/2),
                                Math.sin(additionalAngle + angle - Math.PI/2),0);
    }

    /** Returns a normalised direction vector looking from the starting position to the other position
    * @param from start position
    * @param to the direction to look towards
    * @param accuracy Not yet used specify free
    * @param includeZ Specify true if you want to take the Z value into account
    * 
    * returns A normalised Vector3 direction vector
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
    * @param from Position to look from
    * @param directionVector Direction looking
    * @param to position aiming for
    * @param minimumAngle the step size to turn by, if rotation required is less than this then 0 will be returned
    * 
    * returns-1 if turned anti-clocwise, 1 if clockwise or 0 if didn't turn */
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
    /** calculates just the z component on the normal to 2 given vectors*/
    static crosszonly(a, b){
        return a.x*b.y - a.y*b.x;
    }
    /** calculates just the normal to the 2 given vectors*/
    static cross(a, b){
        return new vector3(a.y*b.z - a.z*b.y,a.z*b.x - a.x*b.z, a.x*b.y - a.y*b.x);
    }
    /** calculates the dot product between 2 vector3 values */
    static dot(a, b){
        return a.x*b.x + a.y*b.y + a.z*b.z;
    }

    /**multiplies this vector3 by the scaler and returns a new vector3 */
    mulNew(scalar){
        return new vector3(this.#x * scalar, this.#y * scalar, this.#z * scalar);
    }
    /**divides this vector3 by the scaler and returns a new vector3 */
    divNew(scalar){
        return new vector3(this.#x / scalar, this.#y / scalar,this.#z/scalar);
    }
    /**multiplies this vector by the scaler value */
    mul(scalar){
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
    }
    /**divides this vector by the scaler value */
    div(scalar){
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
    }
    /**if the first parameter is a vector3 object then it is added to this vector 
     * 
     * if all 3 parameters are suppied then they are taken as individual
     * x y and z value
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
    /**add the 2 given vector3's returning a new one */
    static add(v1, v2){
        return  new vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
    /**if the first parameter is a vector3 object then it is subtracted to this vector 
     * 
     * if all 3 parameters are suppied then they are taken as individual
     * x y and z value
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
    /**subtract the 2 given vector3's returning a new one */
    static sub(v1, v2){
        return  new vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }
    /**returns the distance between the 2 vector3 objects */
    static distance(v1, v2){
        return Math.sqrt((v2.x-v1.x)**2 + (v2.y-v1.y)**2+ (v2.z-v1.z)**2);
    }
    /**returns the square distance between 2 vector3's
     * 
     * faster to compare squares if only relative difference is required
     */
    static distanceSQ(v1, v2){
        return (v2.x-v1.x)**2 + (v2.y-v1.y)**2 + (v2.z-v1.z)**2;
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
     */
    get clone(){
        return new vector3(this.#x, this.#y, this.#z);
    }
    /**clones this vector3 to the existing vector passed as a parameter */
    cloneto(here){
        here.x = this.#x;
        here.y = this.#y;
        here.z = this.#z;
    }

    /**returns a new vector3 object (0,0,0) */
    static get zero(){return new vector3(0,0);}
    /**returns a new vector3 object (1,1,1) */
    static get one(){return new vector3(1,1,1);}
    /**returns a new vector3 object (-1,0,0) */
    static get left(){return new vector3(-1,0,0);}
    /**returns a new vector3 object (1,0,0) */
    static get right(){return new vector3(1,0,0);}
    /**returns a new vector3 object (0,-1,0) */
    static get up(){return new vector3(0,-1,0);}
    /**returns a new vector3 object (0,1,0) */
    static get down(){return new vector3(0,1,0);}
    /**returns a new vector3 object (0,0,-1) */
    static get backward(){return new vector3(0,0,-1);}
    /**returns a new vector3 object (0,0,1) */
    static get forward(){return new vector3(0,0,1);}

}