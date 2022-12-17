/* placed here so we don't have to do a separate script link
in the html documennt - and it's logical
does complicate things as we need to pass reference to sketch around
*/
class neighbour {
  constructor(n, c) {
    this.node = n;
    this.cost = c;
  }
}

class node extends Draggable {
  //technically should only be one occurance so could bin out of loop on splice
  removeNeighbour(name) {
    for (let q = 0; q < this.neighbour.length; q++) {
      if (this.neighbour[q].node.name == name) {
        this.neighbour.splice(q, 1);
        return;
      }
    }
  }

  #prevx;
  #prevy;
  g;//reference to my parent graph
  vx;
  vy;
  rad;
  remove = false;

  constructor(x, y, item, vx, vy) {
    super(x, y);

    this.remove = false;
    this.name = item;
    this.neighbour = [];
    this.rad = 15;
    this.vx = (vx !== undefined) ? vx : 0;
    this.vy = (vy !== undefined) ? vy : 0;
  }
  setParentGraph(g) { this.g = g; }
  isover(s) {
    return Math.abs(this.x - s.mouseX) < this.rad &&
      Math.abs(this.y - s.mouseY) < this.rad;
  }
  reset() {
    this.position(this.homex, this.homey);
  }
  checkterminators(s) {
    s.push();
    s.noStroke();
    if (this.g.startNode != null && this.g.startNode.name == this.name) {
      s.fill(Graph.cSTART);
      s.circle(this.x, this.y, this.rad * 4);
      this.textCircle(s, "START", this.x, this.y, this.rad * 1.5, 3 * s.PI / 9, s.PI / 6);
    } else if (this.g.goalNode != null && this.g.goalNode.name == this.name) {
      s.fill(Graph.cGOAL);
      s.circle(this.x, this.y, this.rad * 4);
      this.textCircle(s, "GOAL", this.x, this.y, this.rad * 1.5, 2*s.PI / 8, s.PI / 6);
    }
    s.pop();
  }
  showdrag(s) {
    s.fill(Graph.cDRAG);
  }
  shownormal(s) {
    if (this.g.activeNode(this))
      s.fill(Graph.cACTV);
    else
      s.fill(Graph.cNORM);

  }
  showover(s) {
    this.g.Over(this);
    s.fill(Graph.cOVER);
    this.hoverkeys();
  }

  show(s) {
    s.push();
    s.textAlign(s.CENTER, s.CENTER);
    this.checkterminators(s);

    super.show(s);
    s.circle(this.x, this.y, this.rad * 2);

    s.fill(0);
    s.text(this.name, this.x, this.y);
    s.pop();
  }

  
  hoverkeys() {
    if (inpM.kPressed(kS) && this.g.setStart(this)) 
      this.g.showStartGoal();
      
    if (inpM.kPressed(kG) && this.g.setGoal(this)) 
      this.g.showStartGoal();

    if (inpM.kPressed(kX)) {
      this.remove = true;
      co.log("trying to remove:" + this.name);
    }
    if (inpM.kPressed(kD) && this.g.nodeActive) {
      let cost = ranI(10, 30);
      if (this.g.active.addNeighbour(this, cost))
        co.log("new neighbour " + this.g.active.name + "->" + this.name + "[" + cost + "]");
    }
    //need to make this pick up current cost if a neighbour exists in one of the directions
    if (inpM.kPressed(kU) && this.g.nodeActive) {
      let cost = ranI(10, 30);
      if (this.g.active.addNeighbour(this, cost))
        co.log("new neighbour " + this.g.active.name + "->" + this.name + "[" + cost + "]");
      if (this.addNeighbour(this.g.active, cost))
        co.log("new neighbours " + this.name + "->" + this.g.active.name + "[" + cost + "]");
    }

    showcontainer("overoptions");
    if (this.g.notActiveNode(this)) { showcontainer("joinnode"); }
    neighbourRemovalVisibility(this, this.g.active);
  }

  //need to stop duplicate neighbours and make it a toggle
  addNeighbour(n, cost) {
    if (!this.neighbourExists(this, n)) {
      this.neighbour.push(new neighbour(n, cost));
      return true;
    }
    else {
      co.log(this.name + " already has " + n.name + " as a neighbour");
      return false;
    }

  }
  //determines if neighbour is here already
  neighbourExists(nodeS, nodeE) {
    for (let p = 0; p < nodeS.neighbour.length; p++)
      if (nodeS.neighbour[p].node.name == nodeE.name) return true;
    return false;
  }
  position(x, y) {
    this.#prevx = this.x;
    this.#prevy = this.y;
    super.position(x, y);
  }
  //===== visualisation code =======              
  move() {
    this.#prevx = this.x;
    this.#prevy = this.y;
    this.x += this.vx;
    this.y += this.vy;

    //check bounds testing needs environment info
    if (this.x < 0 || this.x > sW) {
      this.x = this.#prevx;
      this.vx = - this.vx;
    }
    if (this.y < 0 || this.y > sH) {
      this.y = this.#prevy;
      this.vy *= -1;
    }
  }

  drawNeighbours(s, cs) {
    let dist = 0.35;
    s.push();
    for (let p = 0; p < this.neighbour.length; p++) {
      s.stroke(0, 0, 0);

      s.line(this.x, this.y,
        this.neighbour[p].node.x, this.neighbour[p].node.y);

      let newlen = new vector2(
        this.neighbour[p].node.x - this.x, 
        this.neighbour[p].node.y - this.y);


      if (this.g.showArrows){
        let arrowlen = newlen.mulNew(0.35);
        this.arrow(s, this.x + arrowlen.x, this.y + arrowlen.y, arrowlen.normalise)
      }
      let costlen = newlen.mulNew(0.28);
      //let benny = this.showcost(this.x + costlen.x, this.y + costlen.y, this.neighbour[p].cost);
      //cs.push(benny);
      cs.push(new costDeferred(this,this.neighbour[p].node,this.neighbour[p].cost,
         this.x + costlen.x, this.y + costlen.y));
    }
    s.pop();
  }

  arrow(s, x, y, grad) {

    s.line(x + grad.x * 10, y + grad.y * 10, x - grad.y * 10, y + grad.x * 10);
    s.line(x + grad.x * 10, y + grad.y * 10, x + grad.y * 10, y - grad.x * 10);
  }
  outNeighbours() {
    let outty = "=> " + this.neighbour.length +
      " neighbour" + (this.neighbour.length == 1 ? "" : "s") + //use ternary operator for plural
      " of " + this.name + " { ";
    for (let p = 0; p < this.neighbour.length; p++) {
      outty += this.neighbour[p].node.name + "[" + this.neighbour[p].cost + "] ";
    }
    outty += " }";
    co.log(outty);
  }
  /*
  displays text in a circular fashion at an arc
  from the centre at the given radius
  could do this clever and calculate offset and spread
  */
  textCircle(s, txt, x, y, rad, offset, spread) {
    s.push();
    s.fill(0);
    s.noStroke();
    let w = -s.PI / 2 - offset;// top
    for (let p = 0; p < txt.length; p++) {
      let xp = x + rad * s.cos(w);
      let yp = y + rad * s.sin(w);
      s.push();
      s.translate(xp,yp);
      s.rotate(w+s.PI/2);
      s.text(txt[p], 0,0);
      s.pop();
      //s.text(txt[p], x + rad * s.cos(w), y + rad * s.sin(w));
      w += spread;
    }
    s.pop();
  }
}