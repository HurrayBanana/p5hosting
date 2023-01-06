//TODO need a toggle for solving mode A* or Dijkstra or maybe separate key  button
class Astar extends PathSolver {

    constructor(g){
        super(g);
    }

    start(){
       super.start();
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
       // }
    }
    //dijkstra implementation
    iterate(count){

        while (this.openSet.length > 0 && count > 0){
            MsgBus.send(msgT.hi_liteclear);
            count--;
            let current = this.getCheapestFG();
            MsgBus.send(msgT.hi_litecurrent, {node:current,auto:this.autoSolve});

            this.removeOpenAndClose(current);
            //stop if visited goal
            if (this.graph.isGoal(current)){
                this.finished = true;
                this.traverse(current);
                MsgBus.send(msgT.hi_liteclear);
                this.history.push(this.showStateHTML());
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
                        MsgBus.send(msgT.hi_liteneighbour, {node:nbNode,auto:this.autoSolve});

                    }
                    let calccost = current.gcost + current.neighbour[p].cost;
                    if (calccost < nbNode.gcost){
                            nbNode.updatecosts(calccost, current, calccost + nbNode.heuristic.value);
                            MsgBus.send(msgT.hi_liteneighbourupdate, {node:nbNode,auto:this.autoSolve});

                    }
                }
            }
            this.history.push(this.showStateHTML());
        }
        if (this.openSet.length == 0){
            this.finished = true;
            //this.history.push(this.showStateHTML());
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
        let html = "<table><tr>" + this.headingsHTML("G-cost") + "</tr>";
        for (let p = 0; p < this.gnodes.length; p++){
            if (this.graph.isStart(this.gnodes[p])){
                html += "<tr class='startrow'>" + this.gnodes[p].stateHTMLAstar + "</tr>";

            } else if (this.graph.isGoal(this.gnodes[p])){
                html += "<tr class='goalrow'>" + this.gnodes[p].stateHTMLAstar + "</tr>";

            } else {
                html += "<tr>" + this.gnodes[p].stateHTMLAstar + "</tr>";
            }
        }
        html += "</table>"
        html += super.showStateHTML();
        return html;
    }

    headingsHTML(costname){
        let tr = "<th>Visit</th>";
        tr += "<th>State</th>";
        tr += "<th>Node</th>";
        tr += "<th>Parent</th>";//want changes array
        tr += "<th>" + costname + "</th>";//want changes array
        tr += "<th>H-cost</th>";//want changes array
        tr += "<th>F-cost</th>";//want changes array
        return tr;
    }

}