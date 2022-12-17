class Draggable {

    //static filed as a simple dragging lock so only one object
    //can be dragged at a time
    static available = true;
    #x;
    #y;
    constructor(x, y) {
      this.dragging = false; // Is the object being dragged?
      //this.rollover = false; // Is the mouse over?
      this.#x = x;
      this.#y = y;
      this.offsetX = 0;
      this.offsetY = 0;
    }
    get x() {return this.#x;}
    get y() {return this.#y;}
    set x(value) {this.#x = value;}
    set y(value) {this.#y = value;}
    //need to implement all these in inherited class override completely
    onpress(x,y) {}
    onrelease(s) {}
    showdrag(s){}
    showover(s){}
    shownormal(s){}
    isover(s) {}//return false;}

    update(s) {
      // Adjust location if being dragged
      if (this.dragging) {
        this.x = s.mouseX + this.offsetX;
        this.y = s.mouseY + this.offsetY;
      }
    }
  
    show(s) {
      // Different fill based on state
      if (this.dragging) {
        this.showdrag(s);
      } else if (this.isover(s)) {
        this.showover(s);
      } else {
        this.shownormal(s);
      }
      //pop();
    }
    pressed(s) {
      if (Draggable.available) {
        if (this.isover(s)) {
          //console.log("isover "+ this.isover);
          Draggable.available = false; // lock dragging for other objects
          this.dragging = true;
          // If so, keep track of relative location of click to corner of rectangle
          this.offsetX = this.x - s.mouseX;
          this.offsetY = this.y - s.mouseY;
          this.onpress(s.mouseX, s.mouseY);
          return true;
        }
      }
      return false;
    }
  
    released(s) {
      // Quit dragging
      this.dragging = false;
      Draggable.available = true; //allow another object to be dragged
      this.onrelease(s);
    }
  
    position(x, y){
      this.x = x;
      this.y = y;
      this.released();
    }
  }
  