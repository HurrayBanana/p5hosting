class costDeferred{
    nbour;
    /*nS;
    nG;
    cost;
    x;
    y;*/
    astar=true;
    draw = true;
    protect = false;
    constructor(ng){//nS, nG, cost, x, y){
        this.nbour = ng;
        /*this.nS = nS;
        this.nG = nG;
        this.cost = cost;
        this.x = x;
        this.y = y;*/
    }
    dontDraw(){
        this.protect = false;
        this.draw = false;
    }
    same(b){
        return  this.nbour.parent === b.nbour.node &&
                this.nbour.node === b.nbour.parent &&
                this.nbour.cost == b.nbour.cost;
        //return this.nS === b.nG && this.nG === b.nS && this.cost == b.cost;
    }
}
class Graph {
    
    lifetimecount;
    static #passthrough;
    g = [];
    #name = "untitled";
    get name() {return this.#name;}
    set name(value){this.#name = filestuff.caps(value.split(" "));}
    startNode = null;
    #arrows = true;
    // need this so we can edit different direction neighbours
    #duplicates = true;
    //show/worksith static or dynamic distances
    #dynamic = false;
    get showArrows(){return this.#arrows;}
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
    active = null;
    //is there an active node
    get nodeActive() { return this.active != null; }
    //is this node not the active one
    activeNode(n) { return this.active === n; }
    notActiveNode(n) { return this.nodeActive && this.active !== n; }
    over = false;

    static M = 2.7;
    static cSTART = [255 * Graph.M, 50 * Graph.M, 255 * Graph.M];
    static cGOAL = [50 * Graph.M, 255 * Graph.M, 50 * Graph.M]
    static cNORM = [255, 255, 255];
    static cOVER = [220, 200, 255];
    static cDRAG = [255, 220, 220];
    static cACTV = [255, 255, 100];

    constructor(name) {
        co.log("Graph given:"+name);
        this.name = (name === undefined ? filestuff.getnewName(true) : name);
        co.log("Graph set:"+this.name);
        this.lifetimecount = 0;
    }
    get size() { return this.g.length; }

    centre(s, keepaspect) {
        if (this.size > 0){
            let dx = 0; let dy = 0;
            let { l, r,  t, b } = this.calcextents();
            dx = s.width/2 - (l + r)/2; dy = s.height/2 - (t + b)/2;
            for (let p = 0; p < this.size; p++){
                this.g[p].x += dx; this.g[p].y += dy;
            }
            this.scale(s,r-l, b-t, 60, keepaspect);
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

    toggleArrows(){this.#arrows = !this.#arrows;}
    toggleDuplicates(){this.#duplicates = !this.#duplicates;}
    
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
                co.log("found:" + this.g[p].name);
                this.removeNeighboursOf(this.g[p].name);
                this.g.splice(p, 1);
                co.log("removed:" + p + " len now:" + this.size);
                return;
            }
        }
    }
    removeNeighboursOf(name) {
        for (let p = 0; p < this.size; p++) {
            this.g[p].removeNeighbour(name);
        }
    }
    showStartGoal(){
        co.log("start[" + (this.startNode == null ? "not set":this.startNode.name) +
         "] goal[" + (this.goalNode==null ? "not set":this.goalNode.name) + "]");
    }
    //takes a node string from a file and produces a new node
    //need to set the start and goal nodes if set
    AddNodeString(nodedata) {
        const x = 5;
        const y = 6;
        const start = 7;
        const goal = 8;
        const name = 1;
        const heur = 2;
        let parts = nodedata.split(",");
        let n = new SolverNode(parseInt(parts[x]), parseInt(parts[y]), parts[name], parseInt(parts[heur]));
        //let n = new node(parseInt(parts[x]), parseInt(parts[y]), parts[name], 0, 0);
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
        let sourceNode = this.nodeFromName(parts[source]);
        let destNode = this.nodeFromName(parts[dest]);
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

            //sourceNode.addNeighbour(destNode, parseInt(parts[cost]));
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
        this.lifetimecount++;
    }
    pressed(s) {
        if (!this.over && insketcharea(s, s.mouseX, s.mouseY)) {
            let ch = dblName(this.lifetimecount);
            let n = new SolverNode(s.mouseX, s.mouseY, ch, 0, 0);
            //let n = new node(s.mouseX, s.mouseY, ch, 0, 0);
            this.AddNode(n);
        }
        for (let p = 0; p < this.size; p++) {
            if (this.g[p].pressed(s)) {
                this.g[p].outNeighbours();
                this.modifyActiveNode(this.g[p], p);
            }
        }
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

    //outputs graph as a string array ready for file output
    asArrayString() {
        let arr = [];

        arr.push("name," + this.name);
        arr.push("arrow," + this.#arrows);
        arr.push("dupe," + this.#duplicates);
        arr.push("dyna," + this.#dynamic);
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
    static getSglBoolFromData(data, pos){
        //(parts[start].toLowerCase() == "true")
        let parts = data.split(",");
        if (parts.length <= pos){
            co.log("fatal error reading:" + data);
        } else {
            return parts[pos].toLowerCase() == "true";
        }
    }
    static getSglStringFromData(data, pos){
        //(parts[start].toLowerCase() == "true")
        let parts = data.split(",");
        if (parts.length <= pos){
            co.log("fatal error reading:" + data);
        } else {
            return parts[pos];
        }
    }
    //takes a file array string containing a loaded graph
    static #graphFromArrString(filename, fa) {
        let newgraph = new Graph(filename.split('.')[0]);
        co.log("filename loaded:"+filename);
        co.log("----------------");
        for (let p = 0; p < fa.length; p++) {
            co.log("processing ["+ fa[p]+ "]")
            switch (fa[p].slice(0, 4)) {
                case "name":
                    newgraph.name = Graph.getSglStringFromData(fa[p],1);
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
                    //co.log("read:" + fa[p]);
                    newgraph.AddNodeString(fa[p]);
                    break;
                case "neig":
                    //co.log("read:" + fa[p]);
                    newgraph.AddNeighbourString(fa[p]);
                    break;
                default:
                    co.log("unknown graph data:[" + fa[p] + "]");
                    break;
            }

        }
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
            //for (let p = 0; p < textArray.length; p++) {
            //    co.log(textArray[p]);
            //}
            //co.log("----------------");
            Graph.#graphFromArrString(fname,textArray);
        };
        r.readAsText(this.files[0]);
    }


}