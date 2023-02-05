class HeuristicMethod{

  static euler = {
    distance:function(a, b){return a.distanceBetween(b);},
    show:function(s,x,y){s.push(); x -= 5; y += 5;
      s.strokeWeight(3);s.stroke(0);
      s.point(x,y),s.point(x+10,y+10);
      s.strokeWeight(1);s.line(x,y,x+10,y+10);
      s.pop();},
    name:function(){return "euler";}
  };
  static manhattan = {
    distance:function(a, b){return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);},
    show:function(s,x,y){s.push();x -= 5; y += 5;
      s.strokeWeight(3);s.stroke(0);
      s.point(x,y),s.point(x+10,y+10);s.strokeWeight(1);
      s.line(x,y,x,y+10);s.line(x,y+10,x+10,y+10);
      s.pop();},
    name:function(){return "man- hattan";}
    };
    static available = [HeuristicMethod.euler, HeuristicMethod.manhattan];
    static positionFromName(name){
      let p = 0;
      while (p < HeuristicMethod.available.length){
        if (HeuristicMethod.available[p].name() == name){
          return p;
        }
        p++;
      }
      return null;
    }    
    static methodFromName(name){
      let method = null;
      let p = 0;
      while (p < HeuristicMethod.available.length && method == null){
        if (HeuristicMethod.available[p].name() == name){
          method = HeuristicMethod.available[p];
        }
        p++;
      }
      return method;
    }
}

class Heuristic extends Clickable{
    static cNORM = [20,20,20, 200];
    static cOVER = [140,140,20, 200];
    static cLINE_STROKE = [0,0,0];
    parent;
    #value = 10;
    get value(){
      if (!this.parent.g.isDynamicCost){
        return this.#value;
      } else {
        return Math.floor(this.parent.g.Hmethod.distance(this.parent, this.parent.g.goalNode)/this.parent.g.dynamicDivisor);
      }
    }

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
      if (!this.parent.g.isDynamicCost){
        s.fill(Heuristic.cOVER);
        this.hoverkeys();
        MsgBus.send(msgT.over_helper, "<p class='contextline'>+ to increment heuristic cost</p><p class='contextline'>- to decrement heuristic cost</p>");

      } else {
        this.shownormal(s);
      }
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
      if (this.parent.g.isDynamicCost){
        this.parent.g.Hmethod.show(s,this.left + this.w/2, this.bot);
      }
      //value
      s.stroke(0); s.fill(255); 
      s.text(this.value, this.x, 1+this.y + this.parent.rad + this.h/2);
      s.pop();
    }

    update(){
        super.update();
        this.x = this.parent.x;
        this.y = this.parent.y;
    }    
}
  