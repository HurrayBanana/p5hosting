class GCoding{
    static getSglValFromData(data, pos){
        if (pos === undefined) { pos = 1;}
        let parts = data.split(",");
        if (parts.length <= pos){
            co.log("fatal error reading:" + data);
        } else {
            return parts[pos];
        }
    }
    static getSglBoolFromData(data, pos){
        if (pos === undefined) { pos = 1;}
        let parts = data.split(",");
        if (parts.length <= pos){
            co.log("fatal error reading:" + data);
        } else {
            return parts[pos].toLowerCase() == "true";
        }
    }
    static getSglStringFromData(data, pos){
        if (pos === undefined) { pos = 1;}
        let parts = data.split(",");
        if (parts.length <= pos){
            co.log("fatal error reading:" + data);
        } else {
            return parts[pos];
        }
    }    
    static name = {
        encode:function(g, arr){
            arr.push("name," + g.name);
        },
        decode:function(g, data){
            g.name = GCoding.getSglStringFromData(data)},
        name:function(){return "name"},
    }
    static divisor = {
        encode:function(g, arr){
            arr.push("divisor," + g.dynamicDivisor);
        },
        decode:function(g, data){
            MsgBus.send(msgT.divisorChange, GCoding.getSglValFromData(data))
        },
        name:function(){return "divi"},
    }
    static cost = {
        encode:function(g, arr){
            arr.push("costnode," + g.showNodeCost);
        },
        decode:function(g, data){
            g.showNodeCost =GCoding.getSglBoolFromData(data);
        },
        name:function(){return "cost"},
    }
    static setsstyle = {
        encode:function(g, arr){
            arr.push("setstyle," + g.setModesimple);
        },
        decode:function(g, data){
            g.setmodesimple = GCoding.getSglBoolFromData(data);
        },
        name:function(){return "sets"},
    }
    static duplicates = {
        encode:function(g, arr){
            arr.push("dupe," + g.duplicates);
        },
        decode:function(g, data){
            g.duplicates = GCoding.getSglBoolFromData(data);
        },
        name:function(){return "dupe"},
    }
    static arrow = {
        encode:function(g, arr){
            arr.push("arrow," + g.showArrows);
        },
        decode:function(g, data){
            g.showArrows = GCoding.getSglBoolFromData(data);
        },
        name:function(){return "arro"},
    }
    static dynamic = {
        encode:function(g, arr){
            arr.push("dynamic," + g.isDynamicCost);
        },
        decode:function(g, data){
            g.dynamic = GCoding.getSglBoolFromData(data);
        },
        name:function(){return "dyna"},
    }
    static heuristic = {
        encode:function(g, arr){
            arr.push("heuristic," + g.Hmethod.name());
        },
        decode:function(g, data){
            let p = HeuristicMethod.positionFromName(GCoding.getSglStringFromData(data));
            MsgBus.send(msgT.heuristic,p);
        },
        name:function(){return "heur"},
    }
    static node = {
        encode:function(g, arr){
            for (let p = 0; p < g.size; p++) {
                arr.push(g.g[p].asString);
            }
        },
        decode:function(g, data){
            g.AddNodeString(data);
        },
        name:function(){return "node"},
    }
    static neighbour = {
        encode:function(g, arr){
            for (let p = 0; p < g.size; p++) {
                for (let q = 0; q < g.g[p].neighbour.length; q++) {
                    arr.push(g.g[p].neighbour[q].asString);
                }
            }
        },
        decode:function(g, data){
            g.AddNeighbourString(data);
        },
        name:function(){return "neig"},
    }
    static components  = [
        GCoding.name, GCoding.divisor, GCoding.cost, GCoding.setsstyle,
        GCoding.duplicates, GCoding.arrow, GCoding.dynamic, GCoding.heuristic,
        GCoding.node, GCoding.neighbour
    ];
    static exportGraph(g){
        let arr=[];
        for (let p = 0; p < GCoding.components.length; p++){
            GCoding.components[p].encode(g, arr);
        }
        return arr;
    }
    static importGraph(g, lines){
        for (let k = 0; k < lines.length; k++){
            let p = 0;
            let code = lines[k].slice(0,4);
            co.log("...[" + lines[k] + "]");
            while (p < GCoding.components.length && code != GCoding.components[p].name())
            {p++;}
            if (p < GCoding.components.length){
                GCoding.components[p].decode(g, lines[k]);
            } else {
                co.log("unknown graph data:[" + lines[k] + "]");
            }
        }
    }
}
