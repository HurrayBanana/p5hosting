// javascript keycodes we are interested in giving names too
// look up using https://www.toptal.com/developers/keycode
const kA = 65;const kD = 68;const kG = 71;const kS = 83;
const kX = 88;const kC = 67;const kU = 85;const kP = 80;
const kR = 82;const kH = 72;const kF = 70;const kT = 84;
const kE = 69;const kL = 76;const kJ = 74
const kPlus = 187;
const kMinus = 189;


//simple input manager using dictionaries (no searching required)
class inpM{
  static #oldDict = {};
  static #keyDict = {};
  //static consumeOnce = true;
  //static #consumed = false;
  static reset(){
    inpM.#keyDict = {};
  }

  static getKeyState(){
    let t = "Keys ";
    for (let key in inpM.#keyDict)
         t += key + "[" + inpM.#keyDict[key].toString()[0] + "] ";
    return t;
  }
  //records pressed state of given keyCode
  static SetPressedState(code){
    inpM.#keyDict[code] = true;
  }
  //records release state of given keyCode
  static SetReleasedState(code){
    inpM.#keyDict[code] = false;
  }
  //key currently held
  static kHeld(key){
    return inpM.#keyDict[key];
  }
  //key previously up
  static kPressed(key){
    let state = inpM.#keyDict[key] && !inpM.#oldDict[key];// && !inpM.#consumed;
    //inpM.#consumed = true;
    return state;
  }
  //key previously down
  static kReleased(key){
    return !inpM.#keyDict[key] && inpM.#oldDict[key];
  }  
  //call once logic completed from draw function of sketch
  static update() {
      inpM.#oldDict={};
      for (let key in inpM.#keyDict) {
        inpM.#oldDict[key] = inpM.#keyDict[key];
      }
      //inpM.#consumed = false;
  }
}//inpM
