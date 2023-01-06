
class node extends Draggable {

  removeNeighbourNode(n) {
    for (let q = 0; q < this.neighbour.length; q++) {
      if (this.neighbour[q].node == n) {
        this.neighbour.splice(q, 1);
        return;
      }
    }
  }
  g;//reference to my parent graph
  rad;
  remove = false;
  name;
  neighbour;
  heuristic;
  highlight = {};
  constructor(x, y, item, h){
    super(x, y);

    this.remove = false;
    this.name = item;
    this.neighbour = [];
    this.rad = 15;
    this.heuristic = new Heuristic(this);
    if (h !== undefined){
      this.heuristic.value = h;
    }
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
      let ctxt = "START";
      this.textCircle(s, ctxt, this.x, this.y, this.rad * 1.5, ctxt.length * s.PI/16, s.PI / 6);
      this.ang += 0.01;
    } else if (this.g.goalNode != null && this.g.goalNode.name == this.name) {
      s.fill(Graph.cGOAL);
      s.circle(this.x, this.y, this.rad * 4);
      let ctxt = "GOAL";
      this.textCircle(s, ctxt, this.x, this.y, this.rad * 1.5, ctxt.length * s.PI/16, s.PI / 6);
      this.ang += 0.01;
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
    
    if (this.g.astar){
      this.heuristic.show(s);
    }

    super.show(s);

    s.circle(this.x, this.y, this.rad * 2);

    s.fill(0);
    s.text(this.name, this.x, this.y);

    if (!this.g.dijkstra)
    {
      this.heuristic.show(s);
    }
    s.pop();

  }

  
  hoverkeys() {
    //neighbours
    if (inpM.kPressed(kA)) {
      this.neighbour = [];
      co.log("removing all neighbours from:" + this.name);
    }
    if (inpM.kPressed(kT)) {
      this.g.removeNeighboursOfNode(this);
      co.log("removing all neighbours to:" + this.name);
    }    
    if (inpM.kPressed(kF) && this.g.nodeActive) {
      this.removeNeighbourNode(this.g.active);
      co.log("removing neighbour to:" + this.g.active.name);
    }
    if (inpM.kPressed(kP) && this.g.nodeActive) {
      this.g.active.removeNeighbourNode(this);
      co.log("removing neighbour from:" + this.g.active.name);
    }    
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
      this.generateUndirectedNeighbour(this.g.active, this);
    }

    showcontainer("overoptions");
    if (this.g.notActiveNode(this)) { showcontainer("joinnode"); }
      neighbourRemovalVisibility(this, this.g.active);
  }
   
  generateUndirectedNeighbour(z){
    let cost = ranI(10, 30);
    let n1 = new neighbour(z, this, cost);
    let n2 = new neighbour(this, z, cost);

    let a=z.addNeighbour2(n1);
    let b=this.addNeighbour2(n2);
    neighbour.link(a, b);
    if (a === n1)
      co.log("new neighbour " + z.name + "->" + this.name + "[" + cost + "]");
    if (b === n2)
      co.log("new neighbours " + this.name + "->" + z.name + "[" + cost + "]");
  }
  //need to stop duplicate neighbours and make it a toggle
  addNeighbour(n, cost) {
    if (!this.neighbourExists(this, n)) {
      this.neighbour.push(new neighbour(this, n, cost));
      return true;
    }
    else {
      co.log(this.name + " already has " + n.name + " as a neighbour");
      return false;
    }
  }
  addNeighbour2(nb) {
    let found = this.neighbourIfExists(nb.parent, nb.node)
    if (found == null) {
      this.neighbour.push(nb);
      return nb;
    }
    else {
      co.log(this.name + " already has " + nb.name + " as a neighbour");
      return found;
    }
  }
  clearRoute(){
      for (let p = 0; p < this.neighbour.length; p++){
        this.neighbour[p].clearRoute();
      }
      
  }
  //determines if neighbour is here already 
  neighbourExists(nodeS, nodeE) {
    for (let p = 0; p < nodeS.neighbour.length; p++)
      if (nodeS.neighbour[p].node === nodeE) return true;
    return false;
  }
  //returns neighbour if found of null
  neighbourIfExists(nodeS, nodeE){
    for (let p = 0; p < nodeS.neighbour.length; p++)
      if (nodeS.neighbour[p].node === nodeE) 
        return nodeS.neighbour[p];
    return null;
  }

  drawNeighboursPart1(s, cs) {
    s.push();
    s.stroke(neighbour.cLINE_STROKE);
    for (let p = 0; p < this.neighbour.length; p++) {
      this.neighbour[p].update(s, this.g.showArrows);
      cs.push(new costDeferred(this.neighbour[p]));
    }
    s.pop();
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
 ang = 0;
  textCircle(s, txt, x, y, rad, offset, spread) {
    s.push();
    s.fill(0);
    s.noStroke();
    let w = -s.PI / 2 - offset + this.ang;// top
    for (let p = 0; p < txt.length; p++) {
      let xp = x + rad * s.cos(w);
      let yp = y + rad * s.sin(w);
      s.push();
      s.translate(xp,yp);
      s.rotate(w+s.PI/2);
      s.text(txt[p], 0,0);
      s.pop();
      
      w += spread;
    }
    s.pop();
  }
  distanceBetween(n){
    let dx = this.x - n.x;
    let dy = this.y - n.y;
    return Math.sqrt(dx*dx + dy*dy);
  }
}