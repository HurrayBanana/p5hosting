class Heuristic extends Clickable{
    static cNORM = [20,20,20];
    static cOVER = [140,140,20];
    static cLINE_STROKE = [0,0,0];
    parent;
    #value = 10;
    get value(){return this.#value;}
    set value(h){
      this.#value = h;
    }
    node;
    w;
    h;
    constructor(p) {
        super(0,0);
        this.parent = p;
        this.position(p.x,p.y);
        this.w = p.rad * 2;
        this.h = p.rad;
    }

    position(x,y){
      this.x = x;
      this.y = y;
    }
    //this.x - this.w/2, this.y + this.parent.rad + 1, this.w, this.h
    get left(){return this.x - this.w/2;}
    get right(){return this.left + this.w;}
    get top(){return this.y + this.parent.rad + 1;}
    get bot(){return this.top + this.h;}
    isover(s) {
      return    s.mouseX > this.left &&
                s.mouseX < this.right &&
                s.mouseY > this.top &&
                s.mouseY < this.bot;
    }
    shownormal(s) {
      s.fill(Heuristic.cNORM);
    }
    showover(s) {
      s.fill(Heuristic.cOVER);
      this.hoverkeys();
    }
    
    hoverkeys(){
      if (inpM.kPressed(kPlus)){ 
        this.value++;
      }
      if (inpM.kPressed(kMinus)) {
        this.value--;
      }
    }

    show(s) {
      s.push();
      this.update();

      super.show(s);

      s.textAlign(s.CENTER, s.CENTER);
      s.stroke(255); 
      s.rect(this.left, this.top, this.w, this.h);
  
      //value
      s.stroke(255); s.fill(255); 
      s.text(this.value, this.x, 1+this.y + this.parent.rad + this.h/2);
      s.pop();
    }

    update(){
        super.update();
        this.x = this.parent.x;// - this.parent.rad;
        this.y = this.parent.y;// + this.parent.rad;
    }    
}
  