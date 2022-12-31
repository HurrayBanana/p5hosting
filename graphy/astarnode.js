class AstarNode extends DijkstraNode{
    #hcost;
    get hcost(){return this.#hcost;}
    set hcost(value){ this.#hcost = value;}
    #fcost = [];
    get fcost(){return this.gcost + this.gcost;}
    set fcost(value) {this.#fcost.push(value);}
  
  
    constructor(node){
      super(node);
      this.#hcost = 0;
      this.#fcost = [];
    }
    updatecosts(g, parent, f){
      super.updatecosts(g, parent);
      this.fcost = f;
    }
    stateHTML(){
      let tr = super.stateHTML();
      tr += "<td>" + hcost + "</td>";
      tr += "<td>" + fcost + "</td>";
      return tr;
    }
  }
