class PathSolver {
    openSet = [];
    closedSet = [];

    showRouteHTML = true;
    graph = null;
    gnodes = null;
    route = null;
    started = false;
    finished = false;
    #picks = 0;
    #cycles = 0;
    get cycles(){return this.#cycles;}
    set cycles(value){this.#cycles = value;}

    autoSolve = false;

    constructor(g){
        this.graph = g;
        this.gnodes = this.graph.g;
        this.init();
        this.started = false;
        this.finished = false;
    }

    start(){
        this.started = true;
    }
    picked(n){
        n.visitnum = ++this.#picks;
    }

    addToSet(set, n){
        set.push(n);
        if (set === this.openSet){
            n.state = "O";
        }
    }

    removeOpenAndClose(n){
        n.state = "X"
        this.closedSet.push(n);
        let p = this.findNodePosition(this.openSet, n);
        if (p != -1){
            this.openSet.splice(p,1);
        }
        else { co.log("Fatal Error in removeOpenAndClose:" + n.name)}
    }
    findNodePosition(set, n){
        let p = 0;
        while (p < set.length){
            if (set[p] === n)
                return p;
            p++;
        }
        return -1; not in set
    }
    getNodeUSED(set, node){
        let p = 0;
        while (p < set.length){
            if (set[p] === node)
                return set[p];
            p++;
        }
        return null; //fatal error
    }
    init() {
        this.openSet = [];
        this.closedSet = [];
        this.route = null;
        this.graph.clearRoute();
    }

    solve(){
        if (this.autoSolve || !this.started){
            this.restartSearch();
        }
        this.iterate(this.autoSolve ? this.gnodes.length : this.#cycles);
        if (this.finished){
            if (this.route != null){
                this.displayRoute();
            }
        }
    }

    traverse(n){
        this.route = [n];
        let active = n;
        while (active.parent != null){
            active = active.parent;
            this.route.splice(0,0,active);
        }
    }

    restartSearch(){
        this.init();       
        this.started = true;
        this.finished = false;
    }

    show(){
        if (this.route != null){
            let t = "Route: " + this.route[0].name;
            for (let p = 1; p < this.route.length; p++){
                t += " -> " + this.route[p].name;
            }
            return t;
        } else { return "No Route";}
    }

    displayRoute(){
        let r = this.route;
        for (let p = 0; p < r.length - 1; p++){
            let nb = r[p].neighbourIfExists(r[p], r[p + 1]);
            nb.onRoute();
        }
    }

    showStateHTML(){
        return this.showRouteHTML ? this.show() : "";
    }    

}