//features for object that are clickable
//use draggable for additional feature related to moving objects
class Clickable{
    #x;
    #y;
    constructor(x, y) {
      this.#x = x;
      this.#y = y;
    }
    get x() {return this.#x;}
    get y() {return this.#y;}
    set x(value) {this.#x = value;}
    set y(value) {this.#y = value;}
    //need to implement all these in inherited class override completely
    onpress(x,y) {}
    onrelease(s) {}
    showover(s){}
    shownormal(s){}
    isover(s) {}
    update(s){}
 
    show(s) {
      if (this.isover(s)) {
        this.showover(s);
      } else {
        this.shownormal(s);
      }
    }
    pressed(s) {
        if (this.isover(s)) {
          this.onpress(s.mouseX, s.mouseY);
          return true;
        }
      return false;
    }
  
    released(s) {this.onrelease(s);}
}//class clickable