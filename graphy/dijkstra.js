class Dijkstra extends PathSolver {

    constructor(g){
        super(g);
    }
    
    start(){
        super.start();
        for (let p = 0; p < this.gnodes.length; p++){
            let dn = this.gnodes[p];//quick ref
            dn.resetSolver();
            if (this.graph.isStart(dn)){
                dn.setcosts(0,null);
            } else {
                dn.setcosts(Number.MAX_SAFE_INTEGER);
            }
            this.addToSet(this.openSet, dn);
        }
    }
    //dijkstra implementation
    iterate(count){
        while (this.openSet.length > 0 && count > 0){
            MsgBus.send(msgT.hi_liteclear);
            count--;
            let current = this.getCheapest();
            MsgBus.send(msgT.hi_litecurrent, {node:current,auto:this.autoSolve});
            if (current.gcost == Number.MAX_SAFE_INTEGER){
                this.openSet = [];
                this.finished = true;
                this.history.push(this.showStateHTML());
                //leave the current showing if exhausted route
                //MsgBus.send(msgT.hi_liteclear);
                return false; // no route
            }
            this.removeOpenAndClose(current);
            //stop if visited goal
            if (this.graph.isGoal(current)){
                this.finished = true;
                this.traverse(current);
                MsgBus.send(msgT.hi_liteclear);
                this.history.push(this.showStateHTML());
                return true;
            }
            for (let p = 0; p < current.neighbour.length; p++) {
                let nbNode = current.neighbour[p].node;
                if (!this.closedSet.includes(nbNode)){
                    let calccost = current.gcost + current.neighbour[p].cost;
                    if (calccost < nbNode.gcost){
                        if (nbNode.gcost == Number.MAX_SAFE_INTEGER){
                            MsgBus.send(msgT.hi_liteneighbour, {node:nbNode,auto:this.autoSolve});
                        } else {
                            MsgBus.send(msgT.hi_liteneighbourupdate, {node:nbNode,auto:this.autoSolve});
                        }
                        nbNode.updatecosts(calccost, current);
                    } 
                }
            }
            this.history.push(this.showStateHTML());
        }
        return false;
    }    

    //dumb ass linear search for now
    getCheapest(){
        let cheap = this.openSet[0];
        for (let p = 1; p < this.openSet.length; p++) {
            if (this.openSet[p].gcost < cheap.gcost){
                cheap = this.openSet[p];
            }
        }
        this.picked(cheap);
        return cheap;
    }

    showStateHTML(){
        let html = "<table><tr>" + this.headingsHTML("cost") + "</tr>";
        for (let p = 0; p < this.gnodes.length; p++){
            if (this.graph.isStart(this.gnodes[p])){
                html += "<tr class='startrow'>" + this.gnodes[p].stateHTMLDijkstra + "</tr>";

            } else if (this.graph.isGoal(this.gnodes[p])){
                html += "<tr class='goalrow'>" + this.gnodes[p].stateHTMLDijkstra + "</tr>";

            } else {
                html += "<tr>" + this.gnodes[p].stateHTMLDijkstra + "</tr>";
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
        return tr;
    }

}