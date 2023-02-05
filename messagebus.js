
class msgT{
    //ui elements
    static arrows = "arrows";
    static duplicates = "duplicates";
    static console = "console";
    static costmode = "costmode";
    static shownodecost = "shownodecost";
    static solvemethod = "solvemethod";
    static solve = "solve";
    static solvestyle = "solvestyle";
    static solvehistory = "solvehistory";
    static clearcon = "clearcon";
    static load = "load";
    static export = "export";
    static divisorChange = "divisorChange";
    static cleargraph = "cleargraph";
    static setmode = "setmode";
    static help = "help";
    static helpChanged = "helpChanged";
    static startPickInc = "startPickInc";
    static startPickDec = "startPickDec";
    static heuristic = "heuristic";
    static printdoc = "printdoc";
    static printdocgraph = "printdocgraph";
    static picker = "picker";
    
    static arrowschanged = "arrowschanged";
    static consolechanged = "consolechanged";
    static duplicateschanged = "duplicateschanged";
    static costmodechanged = "costmodechanged";
    static shownodecostchanged = "shownodecostchanged";
    static solvemethodchanged = "solvemethodchanged";
    static solvestylechanged = "solvemodechanged";
    static solvehistorychanged = "solvehistorychanged";
    static setmodechanged = "setmodechanged";
    static pickerChanged = "pickerChanged";
    //static solverchanged = "solverchanged";
    //highlighting
    static hi_liteclear = "highlightclear";
    static hi_litevisiting = "visiting"; //yellow
    static hi_liteneighbourupdate = "updating"; //orange
    static hi_litecurrent = "current";//yellow
    static hi_liteneighbour = "neighbour";//blue
    //other stuff
    static droppedNewNode = "droppedNewNode";
    //hove helpers
    static over_helper = "over_helper";
    static nb_over_notlinked = "nb_over_notlinked";
}
class MsgBus{
    static #subs = {};
    static sub(messageType, handler, instance){
        let callbacks = this.#subs[messageType];
        if (callbacks === undefined) {
            callbacks = [];
        }
        callbacks.push({handler,instance})
        this.#subs[messageType] = callbacks;
    }
    static dropall(messageType){
        if (messageType !== undefined){
            this.#subs[messageType] = undefined;
        } else {
            this.#subs = {};
        }
    }
    
    static drop(messageType, handler, instance){
        let callbacks = this.#subs[messageType];
        if (callbacks != null) {
            let p = 0;
            while (p < callbacks.length && callbacks[p].handler !== handler && callbacks[p].instance !== instance ){
                p++;
            }
            if (p < callbacks.length) {   
                callbacks.splice(p,1);
                this.#subs[messageType] = callbacks;
            } 
        }
    }

    static send(messageType, data){
        let callbacks = this.#subs[messageType];
        if (callbacks !== undefined) {
            for (let p = 0; p < callbacks.length; p++){
                let {handler,instance} = callbacks[p];
                handler.call(instance, data);
            }
        }
         let b = 5;
    }
}