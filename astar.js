//TODO need a toggle for solving mode A* or Dijkstra or maybe separate key  button
class Astar extends PathSolver {

    constructor(g){
        super(g);
    }

    init(){
        super.init();

        for (let p = 0; p < this.gnodes.length; p++){
            this.gnodes[p].resetSolver();
        }

        if (this.graph.startNode != null && this.graph.goalNode != null) {
            let sn = this.graph.startNode;
            this.addToSet(this.openSet, sn);
            sn.setcosts(0,null, sn.hcost)
            //let dave = sn.gcost + sn.hcost;
            //sn.updatecosts(0, null, dave);
            this.graph.goalNode.hcost = 0;

        }
        
    }
    //dijkstra implementation
    iterate(count){
        while (this.openSet.length > 0 && count > 0){
            count--;
            let current = this.getCheapestFG();

            this.removeOpenAndClose(current);
            //stop if visited goal
            if (this.graph.isGoal(current)){
                this.finished = true;
                this.started = false;
                this.traverse(current);
                return true;
            }
            //need to sort adding neighbours if not in open set
            for (let p = 0; p < current.neighbour.length; p++) {
                let nbNode = current.neighbour[p].node;
                if (!this.closedSet.includes(nbNode)){
                    if (!this.openSet.includes(nbNode)){
                        this.addToSet(this.openSet,nbNode);
                        let calccost = current.gcost + current.neighbour[p].cost;
                        nbNode.setcosts(calccost, current, calccost + nbNode.heuristic.value);
                    }
                    let calccost = current.gcost + current.neighbour[p].cost;
                    if (calccost < nbNode.gcost){
                            nbNode.updatecosts(calccost, current, calccost + nbNode.heuristic.value);
                    }
                }
            }
        }
        return false;
    }    

    //dumb ass linear search for now
    getCheapestFG(){
        let cheap = this.openSet[0];
        for (let p = 1; p < this.openSet.length; p++) {
            if (this.openSet[p].fcost < cheap.fcost){
                cheap = this.openSet[p];
            } else if (this.openSet[p].fcost == cheap.fcost && this.openSet[p].hcost <= cheap.hcost){
                        cheap = this.openSet[p];
            }
        }
        this.picked(cheap);
        return cheap;
    }

    showStateHTML(){
        let html = "<table>" + this.headingsHTML("G-cost");
        for (let p = 0; p < this.gnodes.length; p++){
            html += "<tr>" + this.gnodes[p].stateHTMLAstar + "</tr>";
        }
        html += "</table>"
        html += super.showStateHTML();
        return html;
    }

    headingsHTML(costname){
        let tr = "<td>Visit</td>";
        tr += "<td>State</td>";
        tr += "<td>Node</td>";
        tr += "<td>Parent</td>";//want changes array
        tr += "<td>" + costname + "</td>";//want changes array
        tr += "<td>H-cost</td>";//want changes array
        tr += "<td>F-cost</td>";//want changes array
        return tr;
    }

}