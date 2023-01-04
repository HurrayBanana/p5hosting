//replacement for dijkstra node, needs a* stuff adding for simplicity
class SolverNode extends node{

    static cCURR = [255, 255, 0, 220];
    static cNEIG = [0, 179, 255, 220];
    static cUPDT = [255, 120, 0, 220];
    //static cCOST = [120, 120, 120, 220];
    static cnCURR = [153, 153, 3, 220];
    static cnNEIG = [3, 106, 150, 220];
    static cnUPDT = [143, 68, 1, 220];
    static cnCOST = [120, 120, 120, 220];
    //arrays hold historical data sets
    get hcost(){return this.heuristic.value;}
    set hcost(val) {this.heuristic.value = val;}

    #gcost = [];
    get gcost(){return this.#gcost[this.#gcost.length - 1];}
    set gcost(value) {this.#gcost.push(value);}

    #fcost = [];
    get fcost(){return this.#fcost[this.#fcost.length - 1];}
    set fcost(value) {this.#fcost.push(value);}
    

    //costcalled = "cost";
    #parent = [];
    get parent(){return this.#parent[this.#parent.length - 1];}
    set parent(value){this.#parent.push(value);}
  
    #visitnum;
    get visitnum() { return this.#visitnum > 0 ? this.#visitnum : "-";}
    set visitnum(value) { this.#visitnum = value;}
    //node = null;
  
    state = ""

    highCurrent = false;
    highNeighbour = false;
    highUpdate = false;

    constructor(x,y,item, h){
      super(x,y,item, h);
      this.resetSolver();
      this.#subscriptions();
    }

    #subscriptions(){
      MsgBus.sub(msgT.hi_liteclear, this.clearhighlight, this);
      MsgBus.sub(msgT.hi_litecurrent, this.acceptCurrent, this);
      MsgBus.sub(msgT.hi_liteneighbour, this.acceptNeighbour, this);
      MsgBus.sub(msgT.hi_liteneighbourupdate, this.acceptUpdate, this);

    }
    clearhighlight(){
      this.highCurrent = null;
      this.highNeighbour = null;
      this.highUpdate = null;
    }
    acceptCurrent(n){
      if (n === this){
        this.highCurrent = true;
      }
    }
    acceptNeighbour(n){
      if (n === this){
        this.highNeighbour = true;
      }
    }
    acceptUpdate(n){
      if (n === this){
        this.highUpdate = true;
      }
    }
    cleanup(){
      MsgBus.drop(msgT.hi_liteclear, this.clearhighlight, this);
      MsgBus.drop(msgT.hi_litecurrent, this.acceptCurrent, this);
      MsgBus.drop(msgT.hi_liteneighbour, this.acceptNeighbour, this);
      MsgBus.drop(msgT.hi_liteneighbourupdate, this.acceptUpdate, this);
    }
    updatecosts(cost, parent, fcost){
      this.gcost = cost;
      this.parent = parent;
      if (fcost !== undefined){
        this.fcost = fcost;
      }
    }
  
    setcosts(cost, parent, fcost){
      this.#gcost = [cost];
      this.#parent = [parent];
      if (fcost !== undefined){
        this.#fcost = [fcost];
      }      
    }
    get exploredColour(){
      if (this.highCurrent) {
        return SolverNode.cnCURR;
      } else if (this.highNeighbour) {
        return SolverNode.cnNEIG;
      } else if (this.highUpdate) {  
        return SolverNode.cnUPDT;
      }    
      return SolverNode.cnCOST;
    }

    show(s){
      super.show(s);
      if (this.g.showNodeCost && this.gcost !== undefined){
        s.push();
        s.textAlign(s.CENTER, s.CENTER);
        s.fill(this.exploredColour);
        //s.fill(SolverNode.cCOST);
        s.stroke(255); 
        s.rect(this.x - this.rad, this.y - this.rad*2 -1, this.rad*2, this.rad);
    
        //value
        s.stroke(0); s.fill(255); 
        let cost = this.gcost;
        if (this.isInifinity(this.gcost)){
          cost = String.fromCharCode(0x221e);
          s.textSize(16);//infinity symbol is little
        }
        
        s.text(cost, this.x, this.y - this.rad*2 + this.rad/2 - 1);
        s.pop();
      }
    }

    checkterminators(s){
      super.checkterminators(s);
      s.push();
      s.noStroke();
      if (this.highCurrent) {
        s.fill(SolverNode.cCURR);
        s.circle(this.x, this.y, this.rad * 4);
        let ctxt = "CURRENT";
        this.textCircle(s, ctxt, this.x, this.y, this.rad * 1.5, ctxt.length * s.PI/16, s.PI / 6);
          //this.textCircle(s, "CURRENT", this.x, this.y, this.rad * 1.5, 8 * s.PI/16, s.PI / 6);
        this.ang += 0.01;
      } else if (this.highNeighbour) {
        s.fill(SolverNode.cNEIG);
        s.circle(this.x, this.y, this.rad * 4);
        let ctxt = "NEIGHBOUR";
        this.textCircle(s, ctxt, this.x, this.y, this.rad * 1.5, ctxt.length * s.PI/16, s.PI / 6);
          //this.textCircle(s, "NEIGHBOUR", this.x, this.y, this.rad * 1.5, 10 * s.PI/16, s.PI / 6);
        this.ang += 0.01;
      } else if (this.highUpdate) {
        s.fill(SolverNode.cUPDT);
        s.circle(this.x, this.y, this.rad * 4);
        let ctxt = "UPDATE";
        this.textCircle(s, ctxt, this.x, this.y, this.rad * 1.5, ctxt.length * s.PI/16, s.PI / 6);
          //this.textCircle(s, "UPDATE", this.x, this.y, this.rad * 1.5, 7 * s.PI/16, s.PI / 6);
        this.ang += 0.01;
      }
      s.pop();
    }
    resetSolver(){
      this.#parent = [];
      this.#fcost = [];
      this.#gcost = [];
      this.visitnum = 0;
      this.state = " ";
    }
    get stateHTMLDijkstra(){
      let tr = "<td>" + this.visitnum + "</td>";
      tr += "<td>" + getSpan(this.expandState(this.state)) + "</td>";
      tr += "<td>" + getSpan(this.name,this.explored) + "</td>";
      tr += "<td>" + (this.#parent == null ? "null" : this.nodeArrayNames(this.#parent)) + "</td>";//want changes array
      tr += "<td>" + (this.#gcost == null ? "null" : this.nodeCost(this.#gcost)) + "</td>";//want changes array
      return tr;
    }
    expandState(state){
      switch (state){
        case "X": return "CLOSED";
        case "O": return "OPEN";
        default: return state;
      }
    }
    get explored(){
      if (this.highCurrent) {
        return "spancurr"
      } else if (this.highNeighbour) {
        return "spanneig"
      } else if (this.highUpdate) {  
        return "spanupdt"
      }    
      return;
    }
    

    get stateHTMLAstar(){
        let tr = "<td>" + this.visitnum + "</td>";
        tr += "<td>" + getSpan(this.state) + "</td>";
        tr += "<td>" + getSpan(this.name,this.explored) + "</td>";
        tr += "<td>" + (this.#parent == null ? "null" : this.nodeArrayNames(this.#parent)) + "</td>";//want changes array
        tr += "<td>" + (this.#gcost == null ? "null" : this.nodeCost(this.#gcost)) + "</td>";//want changes array
        tr += "<td>" + this.hcost + "</td>";//want changes array
        tr += "<td>" + (this.#fcost == null ? "null" : this.nodeCost(this.#fcost)) + "</td>";//want changes array
        return tr;
    }
  
    //x221e is infinity unicode char
    nodeCost(arr){
      let s = "";
      for (let p = 0; p < arr.length; p++){
        if (p == arr.length - 1){
          s += "[" + getSpan(this.infinity(arr[p]), this.explored) + "]";
        } else {
          s += "[" + (this.infinity(arr[p])) + "]";
        }
        //s += "[" + (arr[p] == Number.MAX_SAFE_INTEGER ? "&#x221E;": arr[p]) + "]";
      }
      return s;
    }
    infinity(value){
      return (value == Number.MAX_SAFE_INTEGER ? "&#x221E;":value);
    }
    isInifinity(value){
      return value == Number.MAX_SAFE_INTEGER;
    }
    nodeArrayNames(arr){
      let s = "";
      for (let p = 0; p < arr.length; p++){
        if (p == arr.length - 1){
        s += "[" + getSpan((arr[p] == null ? "null" : arr[p].name), this.explored) + "]";
        } else {
          s += "[" + (arr[p] == null ? "null" : arr[p].name) + "]";
        }
      }
      return s;
    }
    get asString(){
      let line = "node,";
      line += this.name + ",";
      line += this.heuristic.value + ",";
      line += "0" + ",";
      line += "0" + ",";
      line += Math.floor(this.x) + ",";
      line += Math.floor(this.y) + ",";
      line += this.g.isStart(this).toString() + ",";
      line += this.g.isGoal(this).toString();
      return line;
    }    
}