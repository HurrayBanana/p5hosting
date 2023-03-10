class pickerNode extends Draggable{
  static cNORM = [128, 128, 128, 220];
  static cOVER = [230, 230, 230, 220];
  static cDRAG = [210, 210, 210, 220];
  static cCIRC = [128, 210, 238, 220];
  
  name;
  rad;
  #hoopOver = null;
  #hoopDrag = null;
  constructor(x,y,name){
    super(x,y);
    this.name = name;
    this.rad = 15;
  }
  isover(s) {
    return Math.abs(this.x - s.mouseX) < this.rad &&
      Math.abs(this.y - s.mouseY) < this.rad;
  }
  showdrag(s) {
    this.#hoopDrag = pickerNode.cDRAG;
    s.fill(pickerNode.cDRAG);
    MsgBus.send(msgT.over_helper, {m:setpara("release to drop here"),t:0,mx:s.mouseX,my:s.mouseY});
    //MsgBus.send(msgT.over_helper, {m:"<p class='contextline'>release to drop here</p>",t:0});
  }
  shownormal(s) {
    s.fill(pickerNode.cNORM);
  }
  showover(s) {
    this.#hoopOver = pickerNode.cOVER;
    s.fill(pickerNode.cOVER);
    MsgBus.send(msgT.over_helper, {m:setpara("drag to add to graph"),t:0,mx:s.mouseX,my:s.mouseY});
    //MsgBus.send(msgT.over_helper, {m:"<p class='contextline'>drag to add to graph</p>",t:0});
  }
  hoop(s, ctxt){
    s.fill(pickerNode.cCIRC);
    s.circle(this.x, this.y, this.rad * 4);
    this.textCircle(s, ctxt, this.x, this.y, this.rad * 1.5, ctxt.length * s.PI/16, s.PI / 6);
    this.ang += 0.01;
  }
  show(s) {
    this.#hoopOver = null;
    this.#hoopDrag = null;
    s.push();
    s.textAlign(s.CENTER, s.CENTER);
    super.show(s);
    this.drawhoop(s);
    s.circle(this.x, this.y, this.rad * 2);
    s.fill(0);
    s.text(this.name, this.x, this.y);
    s.pop();
  }
  drawhoop(s){
    s.push();
    if (this.#hoopDrag != null) {
      s.fill(this.#hoopDrag);
      this.hoop(s,"DROP   ME");
    } else if (this.#hoopOver != null){
      s.fill(this.#hoopOver);
      this.hoop(s,"DRAG   ME");
    }
    s.pop();
  }
  released(){
    if (this.dragging){
      super.released();
      MsgBus.send(msgT.droppedNewNode,{name:this.name,x:this.x,y:this.y});
      MsgBus.send(msgT.stoppedDraggingNode);
    } 
  }
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
}

class node extends Draggable {
  released(){
    if (this.dragging){
      super.released();
      MsgBus.send(msgT.stoppedDraggingNode);
    } 
  }
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
    this.buildHelper(s);
  }
  /*
  setpara(content){
    return "<p class='contextline'>" + content + "</p>";
  }
  setspan(pre, action, content, post){
    return "<span class='contextspan'>" + pre + "<span class='actionkey'>" + action + "</span>" + content + post +"</span>";
  }
  */
  buildHelper(s){
    let help = "";
    
    let para = setspan("[", "Click", this.g.activeNode(this) ? " unselect" : " select","]");
    para += setspan("[","X" ," delete","]")
    para += this.g.startNode !== this ? setspan("[","S"," set as start","]") : "";
    para += this.g.goalNode !== this ? setspan("[","G"," set as goal","]") : "";
    para += setspan("[","drag"," to move","]");
    help += setpara(para);

    para = this.neighbour.length > 0 ? setspan("[","A"," remove all from " + this.name,"]"):"";
    para += this.neighbourOfAny ? setspan("[","T"," remove all to " + this.name,"]"):"";
    para += (this.g.active !== null && this.neighbourExists(this, this.g.active)) ? setspan("[","F"," remove to " + this.g.active.name,"]"):"";
    para += (this.g.active !== null && this.neighbourExists(this.g.active, this)) ? setspan("[","P"," remove from " + this.g.active.name,"]"):"";
    help += setpara(para);

    para = (this.g.active !== null && this.g.notActiveNode(this) && (!this.neighbourExists(this.g.active, this) && this.g.active !== this)) ? setspan("[","D"," directed neighbour (red) from " + this.g.active.name,"]"):"";
    para += (this.g.active !== null && this.g.notActiveNode(this) && (!this.neighbourExists(this.g.active, this) || !this.neighbourExists(this, this.g.active)))
               ? setspan("[","U"," undirected (blue) neighbour to " + this.g.active.name,"]"):"";
    help += setpara(para);

    MsgBus.send(msgT.over_helper, {m:help,t:0,mx:s.mouseX,my:s.mouseY});
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
    if (inpM.kPressed(kD) && this.g.nodeActive && this.g.notActiveNode(this)) {
      let cost = ranI(10, 30);
      if (this.g.active.addNeighbour(this, cost))
        co.log("new neighbour " + this.g.active.name + "->" + this.name + "[" + cost + "]");
    }
    //need to make this pick up current cost if a neighbour exists in one of the directions
    if (inpM.kPressed(kU) && this.g.nodeActive && this.g.notActiveNode(this)) {
      this.generateUndirectedNeighbour(this.g.active, this);
    }
    /*
    showcontainer("overoptions");
    if (this.g.notActiveNode(this)) { showcontainer("joinnode"); }
      neighbourRemovalVisibility(this, this.g.active);
    */
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
  //returns true if any node has a a neighbour poiint to it
  get neighbourOfAny() {
    for (let p = 0; p < this.g.size; p++)
    {
      if (this.g.g[p].neighbourExists(this.g.g[p], this)){
        return true;
      }
    }
    return false;
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