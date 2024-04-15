/******************************
 * rectangle.js by Hurray Banana 2023-2024
 ******************************/ 

/** @classdesc support for box areas (rectangle with depth) */
class Box{
    /** top front left corner of box @type {vector3} */
    #corner;
    /** width, height and depth of box @type {vector3} */
    #dimension;

    /** creates a box shape which defines a 3d cube area (3d rectangle)
     * @param {float} left 
     * @param {float} top 
     * @param {float} front 
     * @param {float} width 
     * @param {float} height 
     * @param {float} depth 
     * @example 
     * //create a box left at 50, top at 100 and front at 200, width, height of 200 and depth 400
     * //right is at 250, bottom is at 300 and back is at -200
     * new box(50,100,200, 200, 200, 400);
     * 
     * //create a box using 2 vector3 values one for corner and one for dimension
     * new box(new vector3(50,100,200), new vector3(200,200,400));
     *
     */
    constructor(left, top, front, width, height, depth){
      if (front === undefined){
        this.#corner = left.clone;
        this.#dimension = top.clone;
      } else {
        this.#corner = new vector3(left, top, front);
        this.#dimension = new vector3(width, height, depth);
      }
    }
    /** gets the x centre of the box @returns {float}*/
    get centrex(){return this.#corner.x + this.#dimension.x/2;}
    /** gets the y centre of the box @returns {float} */
    get centrey(){return this.#corner.y + this.#dimension.y/2;}
    /** gets the z centre of the box @returns {float} */
    get centrez(){return this.#corner.z + this.#dimension.z/2;}
    /** gets the centre of the box @returns {vector3}*/
    get centre(){return new vector3(this.#corner.x + this.#dimension.x/2,this.#corner.y + this.#dimension.y/2,this.#corner.z + this.#dimension.z/2);}
    /** gets the left hand side of the box @returns {float} */
    get x() { return this.#corner.x; }
    /** gets the top hand side of the box @returns {float} */
    get y() { return this.#corner.y; }
    /** gets the front hand side of the box @returns {float} */
    get z() { return this.#corner.z; }
    /** @param {float} value sets left side of box */
    set x(value){this.#corner.x = value;}
    /** @param {float} value sets top side of box */
    set y(value){this.#corner.y = value;}
    /** @param {float} value sets front side of box */
    set z(value){this.#corner.z = value;}
    /** @param {float} value sets width of box */
    set w(value){this.#dimension.x = value;}
    /** @param {float} value sets height of box */
    set h(value){this.#dimension.y = value;}
    /** @param {float} value sets depth of box */
    set d(value){this.#dimension.z = value;}

    /** gets the left hand side of the box @returns {float} */
    get l() { return this.#corner.x; }
    /** gets the right hand side of the box @returns {float} */
    get r() { return this.#corner.x + this.#dimension.x; }
    /** gets the top of the box @returns {float} */
    get t() { return this.#corner.y; }
    /** gets the bottom of the box @returns {float} */
    get b() { return this.#corner.y + this.#dimension.y; }
    /** width of box @returns {float} */
    get w() { return this.#dimension.x; }
    /** height of box @returns {float} */
    get h() { return this.#dimension.y; }   
    /** depth of box @returns {float} */
    get d() { return this.#dimension.z; } 

    /** gets the left hand side of the box @returns {float} */
    get left() { return this.#corner.x; }
    /** gets the right hand side of the box @returns {float} */
    get right() { return this.#corner.x + this.#dimension.x; }
    /** gets the top of the box @returns {float} */
    get top() { return this.#corner.y; }
    /** gets the bottom of the box @returns {float} */
    get bottom() { return this.#corner.y + this.#dimension.y; }
    /** gets the front of the box @returns {float} */
    get front() { return this.#corner.z; }
    /** gets the back of the box @returns {float} */
    get back() { return this.#corner.z - this.#dimension.z; }
    /** width of box @returns {float} */
    get width() { return this.#dimension.x; }
    /** height of box @returns {float} */
    get height() { return this.#dimension.y; }
    /** depth of box @returns {float} */
    get depth() { return this.#dimension.z; } 

    /** creates a unit box with corner 0,0,0 and dimensions 1,1,1 @returns {Box}*/
    static get unit(){
      return new box(0,0,0,1,1,1);
    }
    /**
     * increases or decreases (-ve values decrease/+ve value increase) the dimensions of the box
     * @param {vector3} offsets specify the changes in width, height and depth of the box
     */
    flate(offsets){
        this.#corner.x -= offsets.x;
        this.#corner.y -= offsets.y;
        this.#corner.z -= offsets.z;
        this.#dimension.x += (offsets.x + offsets.w);
        this.#dimension.y += (offsets.y + offsets.h);
        this.#dimension.z += (offsets.z + offsets.d);
    }
  }
  /** @classdesc support for rectangular areas and actions upon them */
  class Rectangle{
    /** left position @type {float}*/
    #x;
    /** top position  @type {float}*/
    #y;
    /** width  @type {float}*/
    #w;
    /** height  @type {float}*/
    #h;
    /**
     * 
     * @param {float} x left hand of rectangle
     * @param {float} y top of rectangle
     * @param {float} w width of rectangle
     * @param {float} h height of rectangle
     */
    constructor(x, y, w, h){
      this.#x = x;
      this.#y = y;
      this.#w = w;
      this.#h = h;
    }
    /** @returns {Rectangle} a new rectangle instance with the values of this one*/
    get clone(){return new Rectangle(this.#x,this.#y,this.#w,this.#h);}
    
    /**
     * copies this rectangles positions to the given rectangle
     * @param {Rectangle} here as clone but copies to this pre-existing rectangle
     */
    cloneto(here){
      here.x = this.#x;
      here.y = this.#y;
      here.w = this.#w;
      here.h = this.#h;
    }
    
    /** gets the horizontal centre of the rectangle @returns {float}*/
    get centrex(){return this.#x + this.#w/2;}
    /** gets the vertical centre of the rectangle */
    get centrey(){return this.#y + this.#h/2;}
    /** gets the centre as a vector3 object - can be used in place of a vector2 */
    get centre(){return new vector3(this.#x + this.#w/2,this.#y + this.#h/2,0);}

    /** @returns {float} left hand side of rectangle */
    get x(){return this.#x;}
    /** @returns {float} top of rectangle */
    get y(){return this.#y;}
    /** @returns {float} width of rectangle */
    get w(){return this.#w;}
    /** @returns {float} width of rectangle */
    get width(){return this.#w;}
    /** @returns {float} height of rectangle */
    get h(){return this.#h;}
    /** @returns {float} height of rectangle */
    get height(){return this.#h;}
    /** @param {float} value  the left side of the rectangle*/
    set x(value){this.#x = value;}
    /** @param {float} value  the top of the rectangle*/
    set y(value){this.#y = value;}
    /** @param {float} value  the width of the rectangle*/
    set w(value){this.#w = value;}
    /** @param {float} value  the height of the rectangle*/
    set h(value){this.#h = value;}
    //area names
    /** @returns {float} left hand side of rectangle */
    get l(){return this.#x;}
    /** @returns {float} top of rectangle */
    get t(){return this.#y;}
    /** @returns {float} right hand side of rectangle */
    get r(){return this.#x + this.#w;}
    /** @returns {float} bottom of rectangle */
    get b(){return this.#y + this.#h;}
    //area names
    /** @returns {float} left hand side of rectangle */
    get left(){return this.#x;}
    /** @returns {float} top of rectangle */
    get top(){return this.#y;}
    /** @returns {float} right hand side of rectangle */
    get right(){return this.#x + this.#w;}
    /** @returns {float} bottom of rectangle */
    get bottom(){return this.#y + this.#h;}    
  
    /** @returns {Rectangle} a new instance Rectangle(0,0,0,0) */
    static get zero(){return new Rectangle(0,0,0,0);}
    /** @returns {Rectangle} a new instance Rectangle(1,1,1,1) */
    static get one(){return new Rectangle(1,1,1,1);}
    /**
     * determines if a point is inside (or touching) this Rectangle
     * @param {float} x x position of point
     * @param {float} y y position of point
     * @returns {bool} true if it is false if it isn't
     */
    in(x, y){
      return  x >= this.#x &&
              x <= (this.#x + this.#w) &&
              y >= this.#y &&
              y <= (this.#y + this.#h);
    }
    /** determines if this rectanlge intersects with the given rectangle 
     * NOT IMPLEMENTED YET
    */
    intersects(r){
      //return ()
    }
    /**
     * creates a random position outside of this rectangle, 
     * if margin and maxdistance are undefined you'll get a point on the edge of the rectangle
     * @param {float} margin and amount of padding outside the rectangle (essentially a little bit of inflate)
     * @param {float} maxdistance how far outside the rectangle to go, 0 would be on edge of rectangle 100 would be at most 100 pixels away
     * @returns {{x:float,y:float}} an x y object to be used to set a vector2 or vector3
     */
    randomoutside(margin, maxdistance){
      margin = (margin === undefined) ? 0 : margin;
      maxdistance = (maxdistance === undefined) ? 0 : maxdistance;
      let p =ranInt(8);
      let x;let y;
      switch (p){
        case 0:
          x = ranBetween(this.l - margin - maxdistance, this.l - margin);
          y = ranBetween(this.t - margin - maxdistance, this.t - margin);
          return {x:x,y:y};
        case 1:
          x = ranBetween(this.l, this.r);
          y = ranBetween(this.t - margin - maxdistance, this.t - margin);
          return {x:x,y:y};
        case 2:
          x = ranBetween(this.r + margin, this.r + margin + maxdistance);
          y = ranBetween(this.t - margin - maxdistance, this.t - margin);
          return {x:x,y:y};
        case 3:
          x = ranBetween(this.l - margin - maxdistance, this.l - margin);
          y = ranBetween(this.t, this.b);
          return {x:x,y:y};
        case 4:
          x = ranBetween(this.r + margin, this.r + margin + maxdistance);
          y = ranBetween(this.t, this.b);
          return {x:x,y:y};
        case 5:
          x = ranBetween(this.l - margin - maxdistance, this.l - margin);
          y = ranBetween(this.b + margin, this.b + margin + maxdistance);
          return {x:x,y:y};
        case 6:
          x = ranBetween(this.l, this.r);
          y = ranBetween(this.b + margin, this.b + margin + maxdistance);
          return {x:x,y:y};
        case 7:
          x = ranBetween(this.r + margin, this.r + margin + maxdistance);
          y = ranBetween(this.b + margin, this.b + margin + maxdistance);
          return {x:x,y:y};
      }
    }
    /**
     * creates a random position outside of this rectangle, 
     * if margin and maxdistance are undefined you'll get a point on the edge of the rectangle
     * @param {float} margin and amount of padding outside the rectangle (essentially a little bit of inflate)
     * @param {float} maxdistance how far outside the rectangle to go
     * @returns {vector3} random position requested
     */
    randomoutsideVector3(margin, maxdistance){
      margin = (margin === undefined) ? 0 : margin;
      maxdistance = (maxdistance === undefined) ? 0 : maxdistance;
      let p =ranInt(8);
      let x;let y;
      switch (p){
        case 0:
          x = ranBetween(this.l - margin - maxdistance, this.l - margin);
          y = ranBetween(this.t - margin - maxdistance, this.t - margin);
          return new vector3(x,y);
        case 1:
          x = ranBetween(this.l, this.r);
          y = ranBetween(this.t - margin - maxdistance, this.t - margin);
          return new vector3(x,y);
        case 2:
          x = ranBetween(this.r + margin, this.r + margin + maxdistance);
          y = ranBetween(this.t - margin - maxdistance, this.t - margin);
          return new vector3(x,y);
        case 3:
          x = ranBetween(this.l - margin - maxdistance, this.l - margin);
          y = ranBetween(this.t, this.b);
          return new vector3(x,y);
        case 4:
          x = ranBetween(this.r + margin, this.r + margin + maxdistance);
          y = ranBetween(this.t, this.b);
          return new vector3(x,y);
        case 5:
          x = ranBetween(this.l - margin - maxdistance, this.l - margin);
          y = ranBetween(this.b + margin, this.b + margin + maxdistance);
          return new vector3(x,y);
        case 6:
          x = ranBetween(this.l, this.r);
          y = ranBetween(this.b + margin, this.b + margin + maxdistance);
          return new vector3(x,y);
        case 7:
          x = ranBetween(this.r + margin, this.r + margin + maxdistance);
          y = ranBetween(this.b + margin, this.b + margin + maxdistance);
          return new vector3(x,y);
      }
    }
    /**
     * creates a rnadom position inside this rectangle
     * @param {float} margin and amount of padding insode the rectangle (essentially a little bit of deflate)
     * @returns {{vector3}}random position requested
     */
    randominsideVector3(margin){
      margin = (margin === undefined) ? 0 : margin;
      return new vector3(this.#x + margin + Math.random() * (this.#w - margin*2),this.#y +margin + Math.random() * (this.#h - margin*2));
    }
    /**
     * creates a rnadom position inside this rectangle
     * @param {float} margin and amount of padding insode the rectangle (essentially a little bit of deflate)
     * @returns {{x:float,y:float}} an x y object to be used to set a vector2 or vector3
     */
    randominside(margin){
      if (margin === undefined) {margin = 0;}
      return {x:this.#x + margin + Math.random() * (this.#w - margin*2),y:this.#y +margin + Math.random() * (this.#h - margin*2)};
    }
    /** produces a vector2 offset for this rectangle portion, this can be mapped back to an
     * original texture rectangle portion.
     * 
     * This was for some internal test code that no longer exists
     * @param {vector2|vector3|{x:int,y:int}} offsetportion 
     */
    sub(offsetportion){
      return new vector2(offsetportion.x - this.x, offsetportion.y - this.y);
    }
    /** produces a vector2 offset from a rectangle portion, this can be mapped back to an
     * original texture rectangle portion
     * 
     * This was for some internal test code that no longer exists
     * @param {Rectangle} rect 
     * @param {vector2|vector3|{x:int,y:int}} offsetportion 
     */    
    static sub(rect, offsetportion){
      return new vector2(offsetportion.x - rect.x, offsetportion.y - rect.y);
    }
    /** displaces this rectangle by the given vector2 value
     * @param {vector2|vector3|{x:float,y:float}} offset 
     */
    displace(offset){
      this.#x += offset.x;
      this.#y += offset.y;
    }
    /** displaces this rectangle by the given vector2 value 
     * @param {Rectangle} rect rectangle to move
     * @param {vector2|vector3|{x:float,y:float}} offset 
    */
    static displace(rect, offset){
      rect.x += offset.x;
      rect.y += offset.y;
    }
    /** displaces this rectangle by the given vector2 value produces a new rectangle
     * @param {vector2|vector3|{x:float,y:float}} offset 
     * @returns {Rectangle} displaced version of the this rectangle
    */
    displaceNew(offset){
      return new Rectangle(this.x += offset.x, this.y += offset.y, this.w, this.h);
    }
    /** displaces this rectangle by the given vector2 value produces a new rectangle#
     * @param {Rectangle} rect rectangle to move
     * @param {vector2|vector3|{x:float,y:float}} offset 
     * @returns {Rectangle} displaced version of the given rectangle
    */
    static displaceNew(rect, offset){
      return new Rectangle(rect.x += offset.x, rect.y += offset.y, rect.w, rect.h);
    }
    /**
     * increases or decreases (-ve values decrease/+ve value increase) the dimensions of the rectangle
     * @param {vector2|vector3|{x:float,y:float}} offsets specify the changes in width, height of the rectangle
     */
    flate(offsets){
        this.#x -= offsets.x;
        this.#y -= offsets.y;
        this.#w += (offsets.x + offsets.w);
        this.#h += (offsets.y + offsets.h);
    }
    /** alters each side of the rectangle by the given amounts
     * @param {Rectangle} sides a rectangle were the x, y, w, h values added to the x, y, w and h of this rectangle
     */
    adjust(sides){
      this.#x += sides.x;
      this.#y += sides.y;
      this.#w += sides.w;
      this.#h += sides.h;
    }
    /** creates a new rectangle alters each side of the given rectangle by the given amounts
     * @param {Rectangle} rect base rectangel to adjust
     * @param {Rectangle} sides a rectangle were the x, y, w, h values added to the x, y, w and h of this rectangle
     * @returns {Rectangle} a newly adjusted version of the given rectangle
     */
    static adjust(rect, sides){
      return new Rectangle(rect.x + sides.x, rect.y + sides.y, rect.w + sides.w, rect.h + sides.h);
    }
}
