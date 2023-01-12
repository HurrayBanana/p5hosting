class costDeferred{
    nbour;
    astar=true;
    draw = true;
    protect = false;
    constructor(ng){
        this.nbour = ng;
    }
    dontDraw(){
        this.protect = false;
        this.draw = false;
    }
    same(b){
        return  this.nbour.parent === b.nbour.node &&
                this.nbour.node === b.nbour.parent &&
                this.nbour.cost == b.nbour.cost;
    }
}
class Graph {
    static M = 2.7;
    static cSTART = [255 * Graph.M, 50 * Graph.M, 255 * Graph.M, 220];
    static cGOAL = [50 * Graph.M, 255 * Graph.M, 50 * Graph.M, 220]
    static cNORM = [255, 255, 255, 220];
    static cOVER = [220, 200, 255, 220];
    static cDRAG = [255, 220, 220, 220];
    static cACTV = [255, 255, 100, 220];

    //need to set these dynamically
    //Hmethod = HeuristicMethod.euler;
    Hmethod = HeuristicMethod.euler;

    static #passthrough;
    g = [];
    get size() { return this.g.length; }

    #name = "untitled";
    get name() {return this.#name;}
    set name(value){this.#name = filestuff.caps(value.split(" "));}

    startNode = null;
    isStart(n) {return this.startNode === n; }
    notStart(n) { return this.startNode !== n; }
    setStart(n) {
        if (this.notStart(n)) {
            this.startNode = n;
            return true;
        }
        return false;
    }

    goalNode = null;
    isGoal(n) {return this.goalNode === n; }
    notGoal(n) { return this.goalNode !== n; }
    setGoal(n) {
        if (this.notGoal(n)) {
            this.goalNode = n;
            return true;
        }
        return false;
    }

    get canSolve() {return this.startNode != null && this.goalNode != null;}

    #arrows = true;
    get showArrows(){return this.#arrows;}
    set showArrows(val){this.#arrows = val;}

    // need this so we can edit different direction neighbours
    #duplicates = true;
    get duplicates(){return this.#duplicates;}
    set duplicates(val){this.#duplicates = val;}

    #shownodecost = false;
    get showNodeCost(){return this.#shownodecost;}
    set showNodeCost(val){this.#shownodecost=val;}
    
    #solveHistory = false;
    get solveHistory(){return this.#solveHistory;}
    set solveHistory(val){this.#solveHistory = val;}
    //show/worksith static or dynamic distances
    #dynamic = false;
    get isDynamicCost(){return this.#dynamic;}
    set dynamic(val){this.#dynamic=val;}
    #setmodesimple = true;
    get setModesimple(){return this.#setmodesimple;}
    get setModeVerbose(){return !this.#setmodesimple;}
    set setModeVerbose(val){this.#setmodesimple=val;}
    dynamicDivisor = 10;

    active = null;
    get nodeActive() { return this.active != null; }
    //is this node not the active one
    activeNode(n) { return this.active === n; }
    notActiveNode(n) { return this.nodeActive && this.active !== n; }
    
    over = false;

    dijkstra = false;
    logMethod(data){
        this.dijkstra = data.state;
    }

    constructor(name) {
        this.#subscriptions();
        co.log("Graph given:"+name);
        this.name = (name === undefined ? filestuff.getnewName(true) : name);
        co.log("Graph set:"+this.name);
        this.lifetimecount = 0;
        this.brodcastAllStates();
    }
    brodcastAllStates(){
        this.broadcastArrowsState();
        this.broadcastDuplicatesState();
        this.broadcastCostState();
        this.broadcastSolveHistory();
        this.broadcastNodeCost();
        this.broadcastSetModeState();
    }
    #subscriptions(){
        MsgBus.sub(msgT.arrows, this.toggleArrows, this);
        MsgBus.sub(msgT.duplicates, this.toggleDuplicates, this);
        MsgBus.sub(msgT.costmode, this.toggleCost, this);
        MsgBus.sub(msgT.shownodecost, this.toggleNodeCost, this);
        MsgBus.sub(msgT.solvehistory, this.toggleHistory, this);
        MsgBus.sub(msgT.divisorChange, this.setdivisor, this);
        MsgBus.sub(msgT.setmode, this.toggleSetMode, this);
        MsgBus.sub(msgT.solvemethodchanged, this.logMethod, this);
        MsgBus.sub(msgT.heuristic, this.setHeuristicMode, this);
    }
    cleanup(){
        MsgBus.drop(msgT.arrows, this.toggleArrows, this);
        MsgBus.drop(msgT.duplicates, this.toggleDuplicates, this);
        MsgBus.drop(msgT.costmode, this.toggleCost, this);
        MsgBus.drop(msgT.shownodecost, this.toggleNodeCost, this);
        MsgBus.drop(msgT.solvehistory, this.toggleHistory, this);
        MsgBus.drop(msgT.divisorChange, this.setdivisor, this);
        MsgBus.drop(msgT.setmode, this.toggleSetMode, this);
        MsgBus.drop(msgT.solvemethodchanged, this.logMethod, this);
    }
    setHeuristicMode(index){
        this.Hmethod = HeuristicMethod.available[index];
    }
    setdivisor(value){
        this.dynamicDivisor = value;
    }
    toggleCost(){//button){
        this.#dynamic = !this.#dynamic;
        this.broadcastCostState();
    }
    toggleNodeCost(){
        this.#shownodecost = !this.#shownodecost;
        this.broadcastNodeCost();
    }
    broadcastNodeCost(){
        MsgBus.send(msgT.shownodecostchanged,{state:this.#shownodecost, txtT:"on", txtF:"off"});
    }
    broadcastCostState(){
        MsgBus.send(msgT.costmodechanged,{state:this.#dynamic, txtT:"dynamic", txtF:"static"});
    }
    broadcastSolveHistory(){
        MsgBus.send(msgT.solvehistorychanged,{state:this.#solveHistory, txtT:"on", txtF:"off"});
    }
    toggleHistory(){//button){
        this.#solveHistory = !this.#solveHistory;
        this.broadcastSolveHistory();
    }
    toggleArrows(){//button){
        this.#arrows = !this.#arrows;
        this.broadcastArrowsState();
    }
    toggleSetMode(){//button){
        this.#setmodesimple = !this.#setmodesimple;
        this.broadcastSetModeState();
    }
    broadcastSetModeState(){
        MsgBus.send(msgT.setmodechanged,{state:this.#setmodesimple, txtT:"compact xo", txtF:"verbose"});
    }
    broadcastArrowsState(){
        MsgBus.send(msgT.arrowschanged,{state:this.#arrows, txtT:"on", txtF:"off"});
    }
    broadcastDuplicatesState(){
        MsgBus.send(msgT.duplicateschanged,{state:this.#duplicates, txtT:"on", txtF:"off"});
    }
    toggleDuplicates(){
        this.#duplicates = !this.#duplicates;
        this.broadcastDuplicatesState();
    }
    centre(s, margin, keepaspect) {
        if (this.size > 0){
            let dx = 0; let dy = 0;
            let { l, r,  t, b } = this.calcextents();
            dx = s.width/2 - (l + r)/2; dy = s.height/2 - (t + b)/2;
            for (let p = 0; p < this.size; p++){
                this.g[p].x += dx; this.g[p].y += dy;
            }
            this.scale(s,r-l, b-t, margin, keepaspect);
        }
        
    }
    calcextents() {
        let l = this.g[0].x; let r = this.g[0].x;
        let t = this.g[0].y; let b = this.g[0].y;
        for (let p = 1; p < this.size; p++) {
            if (this.g[p].x < l)
                l = this.g[p].x;
            if (this.g[p].x > r)
                r = this.g[p].x;
            if (this.g[p].y < t)
                t = this.g[p].y;
            if (this.g[p].y > b)
                b = this.g[p].y;
        }
        return {l, r, t, b };
    }

    scale(s,w,h,m, aspect){
        //don't attempt scaling with a single item
        if (this.g.length > 1){
            let sx = (s.width-m)/w;
            let sy = (s.height-m)/h;
            if (aspect!== undefined){
                if (sx > sy)
                    sx = sy;
                else
                    sy = sx;
            }
            //only scale if we need to shrink
            if (sx < 1 || sy < 1){
                let cx = s.width/2;
                let cy = s.height/2;
                for (let p = 0; p < this.size; p++){
                    this.g[p].x = Math.floor((this.g[p].x - cx) * sx + cx);
                    this.g[p].y = Math.floor((this.g[p].y - cy) * sy + cy);
                }
            }
        }
    }

    clearRoute(){
        for (let p = 0; p < this.size; p++){
            this.g[p].clearRoute();
            //this.g[p].resetSolver();
        }
    }    
    draw(s) {
        let sk = this.size > 0 ? this.g[0].s : null;
        let costD = [];
        for (let p = 0; p < this.size; p++)
            this.g[p].drawNeighboursPart1(s, costD);

        //now do deferred rendering of costs (so on top of lines)
        if (!this.#duplicates) this.removeDupeCosts(costD);
        for (let p = 0; p < costD.length; p++) {
            if (costD[p].draw){
                costD[p].nbour.show(s);
            }
        }

        for (let p = 0; p < this.size; p++)
            this.g[p].show(s);
    }

    Over(n) { this.over = true; }

    update(s) {
        this.over = false;
        this.removenodes();
        
        for (let p = 0; p < this.size; p++) {
            this.g[p].update(s);
        }
    }

    removenodes() {
        //let position = -1;
        for (let p = 0; p < this.size; p++) {
            if (this.g[p].remove) {
                if (this.isStart(this.g[p])){
                    this.startNode = null;
                }
                if (this.isGoal(this.g[p])){
                    this.goalNode = null;
                }
                co.log("found:" + this.g[p].name);
                this.removeNeighboursOfNode(this.g[p]);
                //this.removeNeighboursOf(this.g[p].name);
                this.g.splice(p, 1);
                co.log("removed:" + p + " len now:" + this.size);
                MsgBus.send(msgT.nodeDeleted);
                return;
            }
        }
    }

    removeNeighboursOfNode(n) {
        for (let p = 0; p < this.size; p++) {
            this.g[p].removeNeighbourNode(n);
        }
    }

    //needs to be re-written so neighbour object does drawing
    removeDupeCosts(c){
        for (let p = 0; p < c.length; p++) {
            for (let k = 0; k < c.length; k++) {
                if (k != p)
                {
                    if (c[p].same(c[k]) && !c[k].protect){
                        c[k].dontDraw();
                        c[p].protect = true;
                    }
                }
            }
        }
    }


    showStartGoal(){
        co.log("start[" + (this.startNode == null ? "not set":this.startNode.name) +
         "] goal[" + (this.goalNode==null ? "not set":this.goalNode.name) + "]");
    }
    //takes a node string from a file and produces a new node
    //these two functions shouldbe mainly done by gcoding class (whole of node)
    AddNodeString(nodedata) {
        const x = 5;
        const y = 6;
        const start = 7;
        const goal = 8;
        const name = 1;
        const heur = 2;
        let parts = nodedata.split(",");
        let n = new SolverNode(parseInt(parts[x]), parseInt(parts[y]), parts[name].toUpperCase(), parseInt(parts[heur]));
        this.AddNode(n);
        if (parts[start].toLowerCase() == "true") this.setStart(n);
        if (parts[goal].toLowerCase() == "true") this.setGoal(n);
    }

    AddNeighbourString(neighbourdata) {
        const source = 1;
        const dest = 2;
        const cost = 3;
        const costQuery = 4;
        const link = 5;
        let parts = neighbourdata.split(",");
        let sourceNode = this.nodeFromName(parts[source].toUpperCase());
        let destNode = this.nodeFromName(parts[dest].toUpperCase());
        let costing = parseInt(parts[cost]);
        if (sourceNode == null || destNode == null)
            co.log("Fatal error reading neighbour data:" + neighbourdata);
        
        let n1 = new neighbour(sourceNode, destNode, costing);

        let a = sourceNode.addNeighbour2(n1);

        let b = sourceNode.neighbourIfExists(destNode,sourceNode);

        if (neighbourdata.len > link ){
            //if this is a linked node we can attempt it now
            if (b == null){
                let b = new neighbour(destNode, sourceNode, costing);
                neighbour.link(a,b);
            } else {
                co.log("should never happen");
                neighbour.link(b,a);
            }
        } else {
            if (b != null){
                neighbour.link(b,a);
            }
        }
    }

    nodeFromName(name) {
        for (let p = 0; p < this.size; p++) {
            if (this.g[p].name == name)
                return this.g[p];
        }
        return null;
    }

    AddNode(n) {
        this.g.push(n);
        n.setParentGraph(this);
    }

    pressed(s, name) {
        let added = false;
        if (!this.over && insketcharea(s, s.mouseX, s.mouseY, 30)) {
            let n = new SolverNode(s.mouseX, s.mouseY, name, 0, 0);
            this.AddNode(n);
            added = true;
        }
        for (let p = 0; p < this.size; p++) {
            if (this.g[p].pressed(s)) {
                this.g[p].outNeighbours();
                this.modifyActiveNode(this.g[p], p);
            }
        }
        return added;
    }
    //toggles active node or sets a new one
    modifyActiveNode(n, p) {
        if (this.active === n.name) {
            this.active = null;
        } else {
            this.active = n;
            this.g.splice(p, 1); // remove from graph
            this.g.push(n); // add add on end so drawn last
            showPick(n.name);
            co.log("active:" + n.name);
        }

    }
    released(s) {
        for (let p = 0; p < this.size; p++) {
            this.g[p].released(s);
        }
    }
    /*
    //outputs graph as a string array ready for file output
    asArrayString() {
        let arr = [];

        arr.push("name," + this.name);
        arr.push("arrow," + this.#arrows);
        arr.push("dupe," + this.#duplicates);
        arr.push("dynamic," + this.#dynamic);
        arr.push("costnode," + this.#shownodecost);
        arr.push("divisor," + this.dynamicDivisor);
        arr.push("sets," + this.#setmodesimple);
        for (let p = 0; p < this.size; p++) {
            arr.push(this.g[p].asString);
        }
        for (let p = 0; p < this.size; p++) {
            for (let q = 0; q < this.g[p].neighbour.length; q++) {
                arr.push(this.g[p].neighbour[q].asString);
            }
        }
        return arr;
    }
    static getSglValFromData(data, pos){
        let parts = data.split(",");
        if (parts.length <= pos){
            co.log("fatal error reading:" + data);
        } else {
            return parts[pos];
        }
    }
    static getSglBoolFromData(data, pos){
        let parts = data.split(",");
        if (parts.length <= pos){
            co.log("fatal error reading:" + data);
        } else {
            return parts[pos].toLowerCase() == "true";
        }
    }
    static getSglStringFromData(data, pos){
        let parts = data.split(",");
        if (parts.length <= pos){
            co.log("fatal error reading:" + data);
        } else {
            return parts[pos];
        }
    }
    */
    //takes a file array string containing a loaded graph
    static #graphFromArrString(filename, fa) {
        let newgraph = new Graph(filename.split('.')[0]);
        co.log("filename loaded:"+filename);
        co.log("----------------");
        GCoding.importGraph(newgraph, fa);
        /*
        for (let p = 0; p < fa.length; p++) {
            co.log("processing ["+ fa[p]+ "]")
            switch (fa[p].slice(0, 4)) {
                case "name":
                    newgraph.name = Graph.getSglStringFromData(fa[p],1);
                    break;
                case "divi":
                    MsgBus.send(msgT.divisorChange, Graph.getSglValFromData(fa[p], 1));
                    break;
                case "cost":
                    newgraph.#shownodecost = Graph.getSglBoolFromData(fa[p], 1);
                    break;
                case "sets":
                    newgraph.#setmodesimple = Graph.getSglBoolFromData(fa[p], 1);
                    break;
                case "dupe":
                    newgraph.#duplicates = Graph.getSglBoolFromData(fa[p], 1);
                    break;
                case "arro":
                    newgraph.#arrows = Graph.getSglBoolFromData(fa[p],1);
                    break;
                case "dyna":
                    newgraph.#dynamic = Graph.getSglBoolFromData(fa[p],1);
                    break;
                case "node":
                    newgraph.AddNodeString(fa[p]);
                    break;
                case "neig":
                    newgraph.AddNeighbourString(fa[p]);
                    break;
                default:
                    co.log("unknown graph data:[" + fa[p] + "]");
                    break;
            }

        }
        */
        newgraph.brodcastAllStates();
        co.log("Graph name once loaded:" + newgraph.name)
        if (Graph.#passthrough != null) {
            Graph.#passthrough(newgraph);
            Graph.#passthrough = null;
        }
    }
    static loadGraph(passhere) {
        filestuff.setHandlerAndClick(Graph.handleRequest);
        Graph.#passthrough = passhere;
    }
    //graph load handler
    static handleRequest() {
        let fname = this.files[0].name;
        co.log("loaded:" + this.files[0].size + " bytes from:" + this.files[0].name);
        //co.log("----------------");
        let r = new FileReader();
        r.onload = function () {
            let textArray = r.result.split(/\r?\n/);
            Graph.#graphFromArrString(fname,textArray);
        };
        r.readAsText(this.files[0]);
    }
}