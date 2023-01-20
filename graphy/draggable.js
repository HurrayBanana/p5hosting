class Draggable extends Clickable {

    //static field as a simple dragging lock so only one object
    //can be dragged at a time
    static available = true;
    constructor(x, y) {
      super(x,y);
      this.dragging = false; // Is the object being dragged?
      this.offsetX = 0;
      this.offsetY = 0;
    }
    showdrag(s){}

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

      if (this.dragging) {
        this.showdrag(s);
      }
    }
    pressed(s) {
      super.pressed(s);
      if (Draggable.available) {
        if (this.isover(s)) {
          
          Draggable.available = false; // lock dragging for other objects
          this.dragging = true;
          // If so, keep track of relative location of click to corner of rectangle
          this.offsetX = this.x - s.mouseX;
          this.offsetY = this.y - s.mouseY;
          
          return true;
        }
      }
      return false;
    }
  
    released() {
      // Quit dragging
      this.dragging = false;
      Draggable.available = true; //allow another object to be dragged
    }
  
    position(x, y){
      this.x = x;
      this.y = y;
      this.released();
    }
  }
  