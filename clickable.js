//features for object that are clickable
//use draggable for additional feature related to moving objects
//need to refactor draggable later, to use this as a base class
class Clickable{
    //static filed as a simple dragging lock so only one object
    //can be dragged at a time
    #x;
    #y;
    #rollover;
    constructor(x, y) {
      this.#x = x;
      this.#y = y;
      this.#rollover = false;
    }
    get x() {return this.#x;}
    get y() {return this.#y;}
    set x(value) {this.#x = value;}
    set y(value) {this.#y = value;}
    //need to implement all these in inherited class override completely
    onpress() {}
    onrelease() {}
    showover(){}
    shownormal(){}
    get isover() {return false;}
  
    process(){
      this.rollover = this.isover;
      this.show();
    }
  
    over() {
      
    }
  
    show() {
      //push();
      // Different fill based on state
      if (this.rollover) {
        this.showover();
      } else {
        this.shownormal();
      }
      //pop();
    }
    pressed() {
        if (this.isover) {
          this.onpress(this.s.mouseX, this.s.mouseY);
          return true;
        }
      return false;
    }
  
    released() {
      this.onrelease()
    }
}//class clickable