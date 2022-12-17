class costDeferred{
    nS;
    nG;
    cost;
    x;
    y;
    draw = true;
    protect = false;
    constructor(nS, nG, cost, x, y){
        this.nS = nS;
        this.nG = nG;
        this.cost = cost;
        this.x = x;
        this.y = y;
    }
    dontDraw(){
        this.protect = false;
        this.draw = false;
    }
    same(b){
        return this.nS === b.nG && this.nG === b.nS && this.cost == b.cost;
    }
}
class Graph {
    
    lifetimecount;
    static #passthrough;
    g = [];
    name = "untitled";
    startNode = null;
    #arrows = true;
    // need this so we can edit different direction neighbours
    #duplicates = true;
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
        this.name = name;
        this.lifetimecount = 0;
        //this.s = s;
    }
    get size() { return this.g.length; }

    centre(s) {
        if (this.size > 0){
            let l = this.g[0].x;let r = this.g[0].x;
            let t = this.g[0].y;let b = this.g[0].y;
            let dx = 0; let dy = 0;
            for (let p = 1; p < this.size; p++){
                if (this.g[p].x < l) l = this.g[p].x;
                if (this.g[p].x > r) r = this.g[p].x;
                if (this.g[p].y < t) t = this.g[p].y;
                if (this.g[p].y > b) b = this.g[p].y;
            }
            dx = s.width/2 - (l + r)/2; dy = s.height/2 - (t + b)/2;
            for (let p = 0; p < this.size; p++){
                this.g[p].x += dx; this.g[p].y += dy;
            }
        }
    }
    shrink(s){

    }

    toggleArrows(){this.#arrows = !this.#arrows;}
    toggleDuplicates(){this.#duplicates = !this.#duplicates;}
    //costD needs turning into a class definition for clarity
    //instead of an array of array which is a bit mad
    draw(s) {
        let sk = this.size > 0 ? this.g[0].s : null;
        let costD = [];
        for (let p = 0; p < this.size; p++)
            this.g[p].drawNeighbours(s, costD);

        //now do deferred rendering of costs (so on top of lines)
        if (!this.#duplicates) this.removeDupeCosts(costD);
        for (let p = 0; p < costD.length; p++) {
            if (costD[p].draw)
                this.showcostS(s, costD[p]);
        }

        for (let p = 0; p < this.size; p++)
            this.g[p].show(s);
    }
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
    //this should be in the costD class
    showcostS(s, cd) {
        s.push();

        s.stroke(255); s.fill(140);
        s.circle(cd.x, cd.y, 25);

        s.stroke(255); s.fill(255); s.textAlign(s.CENTER, s.CENTER);
        s.text(cd.cost, cd.x, cd.y);
        s.pop();
    }
    
    update(s) {
        this.over = false;
        this.removenodes();

        for (let p = 0; p < this.size; p++) {
            //g[p].move();// velocity based movement
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
    //takes a node string from a file and produces a new node
    //need to set the start and goal nodes if set
    AddNodeString(nodedata) {
        const x = 5;
        const y = 6;
        const start = 7;
        const goal = 8;
        const name = 1;
        let parts = nodedata.split(",");
        let n = new node(parseInt(parts[x]), parseInt(parts[y]), parts[name], 0, 0);
        this.AddNode(n);
        if (parts[start] == "True") this.setStart(n);
        if (parts[goal] == "True") this.setGoal(n);
    }
    AddNeighbourString(neighbourdata) {
        const source = 1;
        const dest = 2;
        const cost = 3;
        let parts = neighbourdata.split(",");
        let sourceNode = this.nodeFromName(parts[source]);
        let destNode = this.nodeFromName(parts[dest]);
        if (sourceNode == null || destNode == null)
            co.log("Fatal error reading neighbour data:" + neighbourdata);
        sourceNode.addNeighbour(destNode, parseInt(parts[cost]));
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
            let n = new node(s.mouseX, s.mouseY, ch, 0, 0);
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
        let arr = []
        for (let p = 0; p < this.size; p++) {
            let line = "node,";
            line += this.g[p].name + ",";
            line += "0" + ",";
            line += "0" + ",";
            line += "0" + ",";
            line += this.g[p].x + ",";
            line += this.g[p].y + ",";
            line += this.isStart(this.g[p]).toString() + ",";
            line += this.isGoal(this.g[p].name).toString();
            arr.push(line);
        }
        for (let p = 0; p < this.size; p++) {
            for (let q = 0; q < this.g[p].neighbour.length; q++) {
                let line = "neig,";
                line += this.g[p].name + ",";
                line += this.g[p].neighbour[q].node.name + ",";
                line += this.g[p].neighbour[q].cost + ",";
                line += "0";
                arr.push(line);
            }
        }
        return arr;
    }

    //takes a file array string containing a loaded graph
    static #graphFromArrString(fa) {
        let newgraph = new Graph();
        for (let p = 0; p < fa.length; p++) {
            switch (fa[p].slice(0, 4)) {
                case "node":
                    co.log("read:" + fa[p]);
                    newgraph.AddNodeString(fa[p]);
                    break;
                case "neig":
                    co.log("read:" + fa[p]);
                    newgraph.AddNeighbourString(fa[p]);
                    break;
                default:
                    co.log("unknown graph data:[" + fa[p] + "]");
                    break;
            }

        }

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

        co.log("loaded:" + this.files[0].size + " bytes from:" + this.files[0].name);
        co.log("----------------");
        let r = new FileReader();
        r.onload = function () {
            let textArray = r.result.split(/\r?\n/);
            for (let p = 0; p < textArray.length; p++) {
                co.log(textArray[p]);
            }
            co.log("----------------");
            Graph.#graphFromArrString(textArray);
        };
        r.readAsText(this.files[0]);
    }


}