//to be removed completely
class DijkstraNode{
    //arrays hold historical data sets
    #updates
    #gcost = [];
    get gcost(){return this.#gcost[this.#gcost.length - 1];}
    set gcost(value) {this.#gcost.push(value);}
  
    costcalled = "cost";
    #parent = [];
    get parent(){return this.#parent[this.#parent.length - 1];}
    set parent(value){this.#parent.push(value);}
  
    #visitnum;
    get visitnum() { return this.#visitnum > 0 ? this.#visitnum : "-";}
    set visitnum(value) { this.#visitnum = value;}
    node = null;
  
    state = ""

    constructor(node){
      this.node = node;
      this.#updates = 0;
      this.#parent = [];
      this.#visitnum = 0;
      this.state = " ";
    }
  
    updatecosts(cost, parent){
      this.gcost = cost;
      this.parent = parent;
    }
  
    get stateHTML(){
      let tr = "<td>" + this.visitnum + "</td>";
      tr += "<td>" + this.state + "</td>";
      tr += "<td>" + this.node.name + "</td>";
      tr += "<td>" + (this.#parent == null ? "null" : this.nodeArrayNames(this.#parent)) + "</td>";//want changes array
      tr += "<td>" + (this.#gcost == null ? "null" : this.nodeCost(this.#gcost)) + "</td>";//want changes array
      return tr;
    }

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

        s += "[" + (arr[p] == null ? "null" : arr[p].node.name) + "]";
      }
      return s;
    }

  }