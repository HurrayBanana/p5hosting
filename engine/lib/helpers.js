/******************************
 * general helper functions by Hurray Banana 2023-2024
******************************/ 
/**
 * Produces a linear interpolation between 2 values
 * @param {float} a base value  (0%)
 * @param {float} b maximum value (100%)
 * @param {float} p percentage between 2 values a and b, should be a value between 0 and 1
 * @returns {float}
 */
function lrp(a, b, p){
  return a + (b - a) * p;
}

/** takes a value and rounds up to a power of 2 
 * @param {int} value value to round up
 * @returns {int}
*/
function roundtoPowerof2(value){
  let p2 = 1;
  while (value > p2){
    p2 += p2; //double
  }
  return p2;
}

/**returns a random integer value 
 * >= 0 and < maximum
 * @param {int} maximum 
 * @returns {int}
*/
function ranInt(maximum){
    if (maximum === undefined){
      maximum = 1;
    }
    return (Math.random()*maximum) | 0;
}

/** keeps a value within the lower and upper limit
 * @param {float} value  value to clamp
 * @param {float} lower lowest value allowed
 * @param {float} upper largest value allowed
 * @returns {float}
*/
function clamp(value, lower, upper){
  if (value < lower) return lower;
  else if (value > upper) return upper;
  else return value;
}

/** prouduces a random integer value between the lower and upper values
 * @param {int} lower lowest value to generate
 * @param {int} upper largest value (will be 1 less than this)
 * @returns {int}
 */
function ranBetween(lower, upper){
  return lower + this.ranInt(upper-lower);
}
/** prouduces a random value between the lower and upper values 
 * @param {int} lower lowest value to generate
 * @param {int} upper largest value (will be 1 less than this)
 * @returns {float}
*/
function floatBetween(lower, upper){
  return lower + Math.random() * (upper - lower);
}  

/** returns the radians in degrees 
 * @param {float} radians 
 * @returns {float} degrees
*/
function radtoDeg(radians){ return radians / PIx180;}

/** returns the degrees in radians
 * @param {float} degrees 
 * @returns {float} radians
 */
function degtoRad(degrees){return  degrees * PIby180;}

/** simple timer manager require an object with:
 *  an elapsed property
 *  a lifetime property holding how many seconds timer should live for
 * nulls the object when time is up
 * @example
 *  mytimer = tickandNull(mytimer, delta);
 * */
function tickandNull(obj, delta){
  if (obj != null){
    obj.elapsed += delta;
    return (obj.elapsed >= obj.lifetime) ? null : obj;
  }
}

/**
 * Takes an array of strings and display each string on screen on a separate line
 * @param {string[]} textarr array containing strings
 * @param {int} x left edge of text
 * @param {int} y starting height of output text
 * @param {int} linedrop distance to drop down on each string from the array
 * @param {} surface if specified the drawing will be attempted on the given image/surface or texture, if ommitted tet will appear on the default canvas
 * @example 
 * //displaying message bus subscribers with current text settings called at end of draw() function in sketch.js
 * drawtextArray(MsgBus.debugdisplayFull(), 10,100,16);
 */
function drawtextArray(textarr, x, y, linedrop, surface){
  //window is the way of accessing the default canvas and p5 instance (all its functions). Generally can be omitted but
  //when working programmatically canbe used to specify the p5 object directly
  surface = (surface === undefined) ? window : surface;
  if (textarr != null){
    for (let p = 0; p < textarr.length; p++){
      surface.text(textarr[p], x, y + linedrop *p);
    }
  }
}

// pre-calculations
Math.PIx2 = Math.PI * 2;
Math.PIby2 = Math.PI/2;
Math.PIby4 = Math.PI/4;
Math.PIby180 = Math.PI/180;
Math.PIx180 = Math.PI*180; 
/** divide an angle in degrees by this to get a radians value
 * @example
 * let radians = this.angle/Math.hb180byPI;
 */
Math.hb180byPI = 180/Math.PI;
