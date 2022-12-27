//replacement for dijkstra node, needs a* stuff adding for simplicity
class SolverNode extends node{
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

    constructor(x,y,item, h){
      super(x,y,item, h);
      this.resetSolver();
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

    resetSolver(){
      this.#parent = [];
      this.#fcost = [];
      this.#gcost = [];
      this.visitnum = 0;
      this.state = " ";
    }
    get stateHTMLDijkstra(){
      let tr = "<td>" + this.visitnum + "</td>";
      tr += "<td>" + this.state + "</td>";
      tr += "<td>" + this.name + "</td>";
      tr += "<td>" + (this.#parent == null ? "null" : this.nodeArrayNames(this.#parent)) + "</td>";//want changes array
      tr += "<td>" + (this.#gcost == null ? "null" : this.nodeCost(this.#gcost)) + "</td>";//want changes array
      return tr;
    }

    get stateHTMLAstar(){
        let tr = "<td>" + this.visitnum + "</td>";
        tr += "<td>" + this.state + "</td>";
        tr += "<td>" + this.name + "</td>";
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
        s += "[" + (arr[p] == Number.MAX_SAFE_INTEGER ? "&#x221E;": arr[p]) + "]";
      }
      return s;
    }

    nodeArrayNames(arr){
      let s = "";
      for (let p = 0; p < arr.length; p++){

        s += "[" + (arr[p] == null ? "null" : arr[p].name) + "]";
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