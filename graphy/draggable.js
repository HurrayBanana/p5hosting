class Draggable extends Clickable {

    //static filed as a simple dragging lock so only one object
    //can be dragged at a time
    static available = true;
    //c #x;
    //c #y;
    constructor(x, y) {
      super(x,y);
      this.dragging = false; // Is the object being dragged?
      //c this.#x = x;
      //c this.#y = y;
      this.offsetX = 0;
      this.offsetY = 0;
    }
    //c get x() {return this.#x;}
    //c get y() {return this.#y;}
    //c set x(value) {this.#x = value;}
    //c set y(value) {this.#y = value;}
    //need to implement all these in inherited class override completely
    //c onpress(x,y) {}
    //c onrelease(s) {}
    showdrag(s){}
    //c showover(s){}
    //c shownormal(s){}
    //isover(s) {}//return false;}

    update(s) {
      // Adjust location if being dragged
      if (this.dragging) {
        this.x = s.mouseX + this.offsetX;
        this.y = s.mouseY + this.offsetY;
      }
      super.update(s);
    }
  
    show(s) {
      super.show(s);

      // Different fill based on state
      if (this.dragging) {
        this.showdrag(s);
      }
      /*c  else if (this.isover(s)) {
        this.showover(s);
      } else {
        this.shownormal(s);
      }*/
      //pop();
    }
    pressed(s) {
      super.pressed(s);
      if (Draggable.available) {
        if (this.isover(s)) {
          //console.log("isover "+ this.isover);
          Draggable.available = false; // lock dragging for other objects
          this.dragging = true;
          // If so, keep track of relative location of click to corner of rectangle
          this.offsetX = this.x - s.mouseX;
          this.offsetY = this.y - s.mouseY;
          //c this.onpress(s.mouseX, s.mouseY);
          return true;
        }
      }
      return false;
    }
  
    released() {
      // Quit dragging
      this.dragging = false;
      Draggable.available = true; //allow another object to be dragged
      //c this.onrelease(s);
    }
  
    position(x, y){
      this.x = x;
      this.y = y;
      this.released();
    }
  }
  