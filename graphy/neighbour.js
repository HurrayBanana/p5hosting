class neighbour extends Clickable{
    static cNORM = [255,40,40,200];
    static cOVER = [255,200,100, 200];
    static cLINK = [40,40,255, 200];
    static cLINKOVER = [100,200,255, 200];
    static cLINE_STROKE = [0,0,0];
    static cLINE_THICK = 1;
    static cLINE_THICK_ROUTE = 4;
    static cLINE_STROKE_ROUTE = [30,50,200];//[255,255,40, 200];
    static CONTEXT_CONTROLS = "<p class='contextline'><span class='actionkey'>+</span> to increment cost</p><p class='contextline'><span class='actionkey'>-</span> to decrement cost</p>"
    rad=25;
    parent;
    #cost = 10;
    get cost(){
      if (!this.parent.g.isDynamicCost){
        return this.#cost;
      } else {
        return Math.floor(this.parent.distanceBetween(this.node)/this.parent.g.dynamicDivisor);
      }
    }
    set cost(value){
      this.#cost = value;
      if (this.linked != null){
        this.linked.#cost = value;//set direct tyo avoid ping pong getter/setter
      }

    }
    #onRoute = false;
    clearRoute(){this.#onRoute = false;}
    onRoute() {this.#onRoute = true;}
    node;
    dirVector;
    arrowVector;
    costVector;
    linked = null; // partner neighbour sharing cost
    constructor(p, n, c) {
        super(0,0);
        this.parent = p;
        this.node = n;
        this.#cost = c;
        this.rad=25;
        this.dirVector = new vector2(1,0);
    }
    static link(a,b){
      a.linked = b;
      b.linked = a;
      b.#cost = a.#cost;
    }
    static unlink(a,b){
      a.linked = null;
      b.linked = null;
    }
    position(x,y){
      this.x = x;
      this.y = y;
    }
    isover(s) {
      return Math.abs(this.x - s.mouseX) < this.rad &&
        Math.abs(this.y - s.mouseY) < this.rad;
    }
    shownormal(s) {
      if (this.linked) {
        s.fill(neighbour.cLINK);
      } else {
        s.fill(neighbour.cNORM);
      }
    }
    showover(s) {
      if (!this.parent.g.isDynamicCost){
        if (this.linked) {
          s.fill(neighbour.cLINKOVER);
          MsgBus.send(msgT.over_helper, {m:this.getContextControls(false),t:0});
        } else {
          s.fill(neighbour.cOVER);
          MsgBus.send(msgT.over_helper, {m:this.getContextControls(true),t:0});
        }
        this.hoverkeys();
      } else {
        this.shownormal(s);
      }
    }
    
    getContextControls(showcost){
      if (showcost){
        return "<p class='contextline'><span class='actionkey'>L</span> to link with cost [" + this.cost + "] (undirected link costs)</p>" + neighbour.CONTEXT_CONTROLS;
      } else {
        return "<p class='contextline'><span class='actionkey'>L</span> to unlink (directed link costs)</p>" + neighbour.CONTEXT_CONTROLS;

      }
    }

    hoverkeys(){
      if (inpM.kPressed(kPlus)){ 
        this.cost++;
      }
      if (inpM.kPressed(kMinus)) {
        this.cost--;
      }
      //link or unlink
      if (inpM.kPressed(kL)){ 
        if (this.linked != null){
          neighbour.unlink(this, this.linked);
        } else {
          let nb = this.node.neighbourIfExists(this.node, this.parent);
          if (nb == null){
            nb = new neighbour(this.node, this.parent, this.cost);
            nb = this.node.addNeighbour2(nb);
          }
          co.log("orig ["+this.parent.name+">" + this.node.name+"]");
          co.log("orig ["+nb.parent.name+">" + nb.node.name+"]");
          neighbour.link(this, nb);
          this.cost = this.cost;
        }
      }
    }
    show(s) {
      s.push();
      super.show(s);
      
      s.textAlign(s.CENTER, s.CENTER);
      s.stroke(255); 
      s.circle(this.x, this.y, 25);
  
      //value
      s.stroke(255); s.fill(255); 
      s.text(this.cost, this.x, this.y);
      s.pop();
    }
    update(s, arrow){
        let px = this.parent.x;
        let py = this.parent.y;

        let dirVec = new vector2(this.node.x - px, this.node.y - py);
        let aVec = dirVec.mulNew(0.35);
        let cVec = dirVec.mulNew((!this.parent.g.duplicates && this.linked) ? 0.5 : 0.28);        this.position(cVec.x+ px, cVec.y + py);
        this.drawLine(s);
        if (arrow && !this.linked) 
            this.arrow(s,aVec.x + px, aVec.y + py, aVec.normalise);
    }    
    drawLine(s){
      if (this.#onRoute){
        s.push();
        s.stroke(neighbour.cLINE_STROKE_ROUTE);
        s.strokeWeight(neighbour.cLINE_THICK_ROUTE);
        s.line(this.parent.x, this.parent.y, this.node.x, this.node.y);
        s.pop();
      }
      
      s.line(this.parent.x, this.parent.y, this.node.x, this.node.y);
    }
    arrow(s, x, y, grad) {
      if (this.#onRoute){
        s.push();
        s.stroke(neighbour.cLINE_STROKE_ROUTE);
        s.strokeWeight(neighbour.cLINE_THICK_ROUTE);
        s.line(x + grad.x * 10, y + grad.y * 10, x - grad.y * 10, y + grad.x * 10);
        s.line(x + grad.x * 10, y + grad.y * 10, x + grad.y * 10, y - grad.x * 10);
        s.pop();
      }
        s.line(x + grad.x * 10, y + grad.y * 10, x - grad.y * 10, y + grad.x * 10);
        s.line(x + grad.x * 10, y + grad.y * 10, x + grad.y * 10, y - grad.x * 10);
    }
    //when loading need to apply neigbours one by one
    get asString(){
      let line = "neig,";
      line += this.parent.name + ",";
      line += this.node.name + ",";
      line += Math.floor(this.cost) + ",";
      line += "0" + ",";
      line += (this.linked != null).toString();
      return line;
    }
}
  