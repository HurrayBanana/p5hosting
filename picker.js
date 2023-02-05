//node picker elements and naming
class Picker{
    #list = [];
    #start = 0;
    #maxNum = 100;
    #off;
    #graph;
    set graph(value) {this.#graph = value;this.refresh();}
    startInc(value){
        if (this.#start < this.#maxNum){
            this.#start++;
            this.refresh();
        }
    }
    //the 0 has to be the first known free node
    startDec(value){
        if (this.#start > 0){
            this.#start--;
            this.refresh();
        }
    }
    length = 24;

    constructor(graph, offset){
        this.#graph = graph;
        this.#off = offset;
        this.refresh();
        this.#subscriptions();
    }
    #subscriptions(){
        MsgBus.sub(msgT.nodeDeleted, this.refresh, this);
        //MsgBus.sub(msgT.startPickInc, this.startInc, this);
        //MsgBus.sub(msgT.startPickDec, this.startDec, this);
    }
    update(s){
        for (let p = 0; p < this.#list.length; p++){
            this.#list[p].update(s);
        }
    }
    show(s){
        for (let p = 0; p < this.#list.length; p++){
            this.#list[p].show(s);
        }
        //s.text("pick start:" + this.#start, 10, 300);
    }
    pressed(s){
        for (let p = 0; p < this.#list.length; p++){
            this.#list[p].pressed(s);
        }
    }
    released(s){
        for (let p = 0; p < this.#list.length; p++){
            this.#list[p].released(s);
        }
    }
    // generates a string name using alphas from a number
    dblName(p){
        let ch = "";
        let key = Math.floor(p/26);
        return p < 26 ? this.getCh(65+p) :  this.getCh(64 + key) + this.getCh(65 + p % 26); 
    }
    getCh(code){
        return String.fromCharCode(code);
    }
    //generates an array of nodes to drag onto graph
    refresh(){
        let picks = [];
        this.#list = [];
        for (let p = 0; p < this.#graph.g.length; p++){
            picks.push(this.numberFromName(this.#graph.g[p].name));
        }
        picks.sort(function(a, b){return a - b});
        let p = 0;
        let first = true;
        while (this.#list.length < this.length && p < this.#maxNum){
            if (p >= this.#start && !picks.includes(p)){
                /*if (first) {
                    first = false;
                    this.#start = p;
                }*/
                let ch = this.dblName(p);
                let n = new pickerNode(this.#off, 15 + this.#list.length * 30,ch);
                this.#list.push(n);
            }
            p++;
        }
    }
  
    numberFromName(name){
        return name.length == 1 ? name.charCodeAt(0) - 65 : (name.charCodeAt(0) - 64) * 26 + name.charCodeAt(1) - 65;
    }    
    get nextName(){
        if ([this.#list.length > 0])
        {
            return this.#list[0].name;
        }
        return null;
    }
}